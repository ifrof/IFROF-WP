import { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Send,
  MessageCircle,
  Loader2,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react";
import { useAiChat } from "@/hooks/useAiChat";

export default function AIChat() {
  const { language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const initialMessage = useMemo(
    () => [
      {
        role: "assistant" as const,
        content:
          language === "ar"
            ? "مرحباً! أنا مساعد IFROF الذكي. كيف يمكنني مساعدتك في البحث عن المصانع الصينية الموثقة؟"
            : "Hello! I'm IFROF Smart Assistant. How can I help you find verified Chinese manufacturers?",
      },
    ],
    [language]
  );
  const { messages, input, isLoading, setInput, sendMessage } =
    useAiChat(initialMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendMessage();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#ff8c42] hover:bg-[#e67a35] text-white rounded-full p-4 shadow-lg transition transform hover:scale-110"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-40 w-96 bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200"
      dir={dir}
    >
      <div className="bg-[#1e3a5f] text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-bold">
            {language === "ar" ? "مساعد IFROF الذكي" : "IFROF AI Assistant"}
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/10 p-1 rounded"
          >
            {isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/10 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={`${msg.role}-${index}`}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-[#ff8c42] text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl rounded-tl-none">
                  <Loader2 className="w-4 h-4 animate-spin text-[#1e3a5f]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={
                  language === "ar"
                    ? "اسأل عن أي مصنع..."
                    : "Ask about any factory..."
                }
                className="flex-1 h-10 border-gray-200 focus:ring-[#1e3a5f]"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#1e3a5f] hover:bg-[#152944] h-10 w-10 p-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
