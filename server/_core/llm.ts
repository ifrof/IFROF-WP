import { ENV } from "./env";
import { TRPCError } from "@trpc/server";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type Message = {
  role: Role;
  content: string | any[];
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: any;
  };
};

export type ToolChoice = "none" | "auto" | { type: "function"; function: { name: string } };

export type OutputSchema = any;

export type ResponseFormat = {
  type: "text" | "json_object" | "json_schema";
  json_schema?: any;
};

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
  timeoutMs?: number;
};

export type InvokeResult = {
  choices: {
    message: Message;
    finish_reason: string;
    index: number;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

const normalizeMessage = (m: Message) => ({
  role: m.role,
  content: m.content,
  ...(m.name ? { name: m.name } : {}),
  ...(m.tool_call_id ? { tool_call_id: m.tool_call_id } : {}),
  ...(m.tool_calls ? { tool_calls: m.tool_calls } : {}),
});

const normalizeToolChoice = (choice: any, tools?: Tool[]) => {
  if (!choice) return undefined;
  if (typeof choice === "string") return choice;
  return choice;
};

const normalizeResponseFormat = (params: any) => {
  const format = params.responseFormat || params.response_format;
  if (format) return format;
  const schema = params.outputSchema || params.output_schema;
  if (schema) {
    return {
      type: "json_schema",
      json_schema: {
        name: "output",
        strict: true,
        schema,
      },
    };
  }
  return undefined;
};

const resolveApiConfig = (): { url: string; key: string; model: string } => {
  if (ENV.forgeApiUrl && ENV.forgeApiKey) {
    return {
      url: `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`,
      key: ENV.forgeApiKey,
      model: "gemini-2.5-flash",
    };
  }

  const groqKey = process.env.GROQ_API_KEY;
  if (groqKey) {
    return {
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: "llama-3.3-70b-versatile",
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return {
      url: "https://api.openai.com/v1/chat/completions",
      key: openaiKey,
      model: "gpt-4o-mini",
    };
  }

  throw new Error("No LLM API key configured.");
};

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const apiConfig = resolveApiConfig();
  const startTime = Date.now();

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
    timeoutMs = 20000,
  } = params;

  const payload: Record<string, unknown> = {
    model: apiConfig.model,
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) {
    payload.tools = tools;
  }

  const normalizedToolChoice = normalizeToolChoice(toolChoice || tool_choice, tools);
  if (normalizedToolChoice) {
    payload.tool_choice = normalizedToolChoice;
  }

  payload.max_tokens = maxTokens || max_tokens || 1500;

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
      signal: controller.signal,
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
    
    console.log(JSON.stringify({
      level: 'info',
      message: 'LLM_INVOKE_SUCCESS',
      model: apiConfig.model,
      latency_ms: duration,
      input_tokens: usage.prompt_tokens,
      output_tokens: usage.completion_tokens,
      total_tokens: usage.total_tokens,
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
