import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, MessageCircle, Loader2, X, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChat() {
  const { language, dir } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: language === 'ar' 
        ? 'مرحباً! أنا مساعد IFROF الذكي. كيف يمكنني مساعدتك في البحث عن المصانع الصينية الموثقة؟'
        : 'Hello! I\'m IFROF Smart Assistant. How can I help you find verified Chinese manufacturers?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) {
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const currentLang = language || 'ar';
      const aiResponses = {
        ar: [
          'هذا سؤال ممتاز! دعني أساعدك في البحث عن أفضل المصانع الموثقة.',
          'يمكنني مساعدتك في التحقق من سمعة المصنع والتأكد من جودته.',
          'هل تريد معرفة المزيد عن عملية التحقق من المصانع؟',
          'يمكنني تقديم توصيات بناءً على احتياجاتك ومتطلباتك.',
        ],
        en: [
          'That\'s a great question! Let me help you find the best verified manufacturers.',
          'I can help you verify the factory\'s reputation and quality standards.',
          'Would you like to know more about our factory verification process?',
          'I can provide recommendations based on your specific needs and requirements.',
        ]
      };

      const responses = currentLang === 'ar' ? aiResponses.ar : aiResponses.en;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const suggestedQuestions = language === 'ar' 
    ? [
        'كيف أتحقق من المصنع؟',
        'ما هي أفضل المصانع؟',
        'كم تكلفة الشحن؟',
      ]
    : [
        'How to verify a factory?',
        'What are the best manufacturers?',
        'What\'s the shipping cost?',
      ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#ff8c42] hover:bg-[#e67a35] text-white rounded-full p-4 shadow-lg transition transform hover:scale-110"
        title={language === 'ar' ? 'فتح الدردشة' : 'Open Chat'}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-40 w-96 bg-white rounded-lg shadow-2xl overflow-hidden"
      dir={dir}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">
            {language === 'ar' ? 'مساعد IFROF الذكي' : 'IFROF Smart Assistant'}
          </h3>
          <p className="text-xs text-gray-300">
            {language === 'ar' ? 'متاح الآن' : 'Online'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="hover:bg-white/20 p-2 rounded transition"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:bg-white/20 p-2 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {language === 'ar' ? 'ابدأ محادثة' : 'Start a conversation'}
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-[#ff8c42] text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-2 bg-white border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-2">
                {language === 'ar' ? 'أسئلة مقترحة:' : 'Suggested questions:'}
              </p>
              <div className="space-y-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setInput(question);
                      setTimeout(() => {
                        const form = document.querySelector('form');
                        if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
                      }, 0);
                    }}
                    className="w-full text-left text-xs bg-gray-100 hover:bg-gray-200 p-2 rounded transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#ff8c42] hover:bg-[#e67a35] text-white"
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
