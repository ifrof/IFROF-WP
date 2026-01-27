import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Loader2, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { Streamdown } from "streamdown";

export default function Chatbot() {
  const { user, loading: authLoading } = useAuth();
  const { messages, input, isLoading, setInput, sendMessage, reset } =
    useAiChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessageMutation = trpc.chatbot.sendMessage.useMutation();
  const clearHistoryMutation = trpc.chatbot.clearHistory.useMutation();
  const { data: chatHistory, refetch: refetchHistory } = trpc.chatbot.getHistory.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  // Initialize session
  useEffect(() => {
    if (!sessionId) {
      setSessionId(nanoid());
    }
  }, [sessionId]);

  // Load chat history
  useEffect(() => {
    if (chatHistory) {
      setMessages(
        chatHistory.map((msg) => ({
          role: msg.role,
          content: msg.content,
        }))
      );
    }
  }, [chatHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You must be logged in to use the chatbot.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || !sessionId) return;

    const userMessage = input;
    setInput("");

    // Add user message to UI immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await sendMessageMutation.mutateAsync({
        content: userMessage,
        sessionId,
      });

      // Add AI response
      setMessages((prev) => [...prev, { role: "assistant", content: response.aiResponse }]);
      refetchHistory();
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
      // Remove the user message if sending failed
      setMessages((prev) => prev.slice(0, -1));
    }
  };

  const handleClearHistory = async () => {
    try {
      await clearHistoryMutation.mutateAsync({ sessionId });
      setMessages([]);
      setSessionId(nanoid());
      toast.success("Chat history cleared");
    } catch (error) {
      toast.error("Failed to clear history");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="h-screen max-h-screen flex flex-col">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>IFROF Smart Assistant</CardTitle>
                <CardDescription>
                  Your intelligent partner for direct sourcing from Chinese
                  manufacturers
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearHistory}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Welcome to IFROF Smart Assistant
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Ask me anything about finding factories, products, or using
                    the platform.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Example questions:</p>
                    <ul className="list-disc list-inside">
                      <li>How do I find electronics manufacturers?</li>
                      <li>What is the minimum order quantity?</li>
                      <li>How do I send an inquiry to a factory?</li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-200 text-black rounded-bl-none"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Streamdown>{message.content}</Streamdown>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}
                {sendMessageMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="bg-gray-200 text-black px-4 py-2 rounded-lg rounded-bl-none">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </CardContent>

          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="submit"
                disabled={sendMessageMutation.isPending || !input.trim()}
                className="gap-2"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
