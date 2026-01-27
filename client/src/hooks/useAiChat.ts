import { useCallback, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type UseAiChatResult = {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  setInput: (value: string) => void;
  sendMessage: (content?: string) => Promise<void>;
  reset: () => void;
};

export function useAiChat(
  initialMessages: ChatMessage[] = []
): UseAiChatResult {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(
    async (content?: string) => {
      const messageContent = content ?? input;
      if (!messageContent.trim()) return;

      const nextMessages = [
        ...messages,
        { role: "user", content: messageContent } as ChatMessage,
      ];
      setMessages(nextMessages);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ messages: nextMessages }),
        });

        if (!response.ok) {
          throw new Error(`Chat request failed with status ${response.status}`);
        }

        if (!response.body) {
          throw new Error("Missing response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantContent = "";

        setMessages(current => [
          ...current,
          { role: "assistant", content: "" },
        ]);

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          assistantContent += decoder.decode(value, { stream: true });
          setMessages(current => {
            const updated = [...current];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: assistantContent,
              };
            }
            return updated;
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [input, messages]
  );

  const reset = useCallback(() => {
    setMessages(initialMessages);
    setInput("");
  }, [initialMessages]);

  return {
    messages,
    input,
    isLoading,
    setInput,
    sendMessage,
    reset,
  };
}
