import { ENV } from "./env";
import { TRPCError } from "@trpc/server"; // Import TRPCError for structured error handling

export type Role = "system" | "user" | "assistant" | "tool" | "function";

// ... (Type definitions remain the same) ...

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  timeoutMs?: number; // NEW: Timeout in milliseconds
};

// ... (InvokeResult and other types remain the same) ...

// ... (Utility functions like ensureArray, normalizeContentPart, normalizeMessage, normalizeToolChoice, resolveApiConfig, normalizeResponseFormat remain the same) ...

const resolveApiConfig = (): { url: string; key: string; model: string } => {
  // 1. Try Forge API first (internal)
  if (ENV.forgeApiUrl && ENV.forgeApiKey) {
    return {
      url: `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`,
      key: ENV.forgeApiKey,
      model: "gemini-2.5-flash",
    };
  }

  // 2. Try Groq API (free tier)
  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    return {
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: "llama-3.3-70b-versatile", // Free tier model with good capabilities
    };
  }

  // 3. Try OpenAI API
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return {
      url: "https://api.openai.com/v1/chat/completions",
      key: openaiKey,
      model: "gpt-4o-mini",
    };
  }

  throw new Error(
    "No LLM API key configured. Please set GROQ_API_KEY (free) or OPENAI_API_KEY in environment variables."
  );
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const apiConfig = resolveApiConfig();
  const startTime = Date.now(); // Start timer

  const {
    messages,
    tools,
    toolChoice,
    tool_choice,
    outputSchema,
    output_schema,
    responseFormat,
    response_format,
    maxTokens,
    max_tokens,
    timeoutMs = 20000, // Default LLM timeout to 20s
  } = params;

  const payload: Record<string, unknown> = {
    model: apiConfig.model,
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(
    toolChoice || tool_choice,
    tools
  );
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  // Guard: Dynamic max_tokens enforcement
  payload.max_tokens = maxTokens || max_tokens || 1500; // Default to 1500 tokens

  const normalizedResponseFormat = normalizeResponseFormat({
    responseFormat,
    response_format,
    outputSchema,
    output_schema,
  });

  if (normalizedResponseFormat) {
    if (normalizedResponseFormat.type === "json_schema" && apiConfig.url.includes("groq.com")) {
      payload.response_format = { type: "json_object" };
      const schemaInstructions = `\n\nYou MUST respond with valid JSON that matches this exact schema:\n${JSON.stringify(normalizedResponseFormat.json_schema.schema, null, 2)}`;
      const systemMsg = payload.messages as any[];
      if (systemMsg.length > 0 && systemMsg[0].role === 'system') {
        systemMsg[0].content += schemaInstructions;
      } else {
        systemMsg.unshift({ role: 'system', content: schemaInstructions });
      }
    } else {
      payload.response_format = normalizedResponseFormat;
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, timeoutMs);

  try {
    const response = await fetch(apiConfig.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiConfig.key}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal, // AbortController signal
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[LLM] Error: ${response.status} ${response.statusText} – ${errorText}`);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `LLM invoke failed: ${response.status} ${response.statusText} – ${errorText}`,
      });
    }

    const result = (await response.json()) as InvokeResult;
    const duration = Date.now() - startTime;
    const usage = result.usage || { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };
    
    // Structured Logging for Cost/Performance
    console.log(JSON.stringify({
      level: 'info',
      message: 'LLM_INVOKE_SUCCESS',
      model: apiConfig.model,
      latency_ms: duration,
      input_tokens: usage.prompt_tokens,
      output_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
      cost_estimate: (usage.total_tokens / 1000) * 0.0005, // Hardcoded cost for gpt-4o-mini equivalent
    }));

    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new TRPCError({
        code: 'TIMEOUT',
        message: `LLM request timed out after ${timeoutMs}ms.`,
      });
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
