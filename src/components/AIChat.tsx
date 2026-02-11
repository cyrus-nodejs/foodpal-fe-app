import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import Button from "./Button";
import VoiceInput from "./VoiceInput";
import { useToast } from "./Toast";
import axios from "axios";

interface Message {
  id: string;
  content: string;
  type: "user" | "ai";
  timestamp: Date;
  isTyping?: boolean;
}

interface AIChatProps {
  context?: {
    type: "recipe" | "ingredient" | "general";
    data?: any;
  };
  className?: string;
}

export interface AIChatRef {
  sendMessage: (message: string) => void;
}

const AIChat = forwardRef<AIChatRef, AIChatProps>(
  ({ context, className = "" }, ref) => {
    const [messages, setMessages] = useState<Message[]>([
      {
        id: "welcome",
        content:
          "Hello! I'm your African cuisine AI assistant. I can help you with recipes, cooking techniques, ingredient substitutions, and any questions about African food. How can I assist you today?",
        type: "ai",
        timestamp: new Date(),
      },
    ]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    useEffect(() => {
      scrollToBottom();
    }, [messages]);

    useEffect(() => {
      // Add context-aware welcome message
      if (context) {
        const contextMessage = getContextMessage(context);
        if (contextMessage) {
          setMessages((prev) => [
            ...prev,
            {
              id: `context-${Date.now()}`,
              content: contextMessage,
              type: "ai",
              timestamp: new Date(),
            },
          ]);
        }
      }
    }, [context]);

    // Expose sendMessage function to parent components
    useImperativeHandle(ref, () => ({
      sendMessage: (message: string) => {
        sendMessage(message);
      },
    }));

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const getContextMessage = (context: any) => {
      switch (context.type) {
        case "recipe":
          return `I see you're interested in "${
            context.data?.title || "this recipe"
          }". I can help you with cooking instructions, ingredient substitutions, or answer any questions about preparing this dish!`;
        case "ingredient":
          return `I can help you learn more about "${
            context.data?.name || "this ingredient"
          }" and suggest recipes that use it effectively.`;
        default:
          return null;
      }
    };

    const sendMessage = async (messageContent: string) => {
      if (!messageContent.trim()) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: messageContent.trim(),
        type: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsLoading(true);

      // Add typing indicator
      const typingMessage: Message = {
        id: `typing-${Date.now()}`,
        content: "AI is typing...",
        type: "ai",
        timestamp: new Date(),
        isTyping: true,
      };
      setMessages((prev) => [...prev, typingMessage]);

      try {
        const response = await axios.post("/ai/chat", {
          message: messageContent,
          context: context,
          history: messages.slice(-10), // Send last 10 messages for context
        });

        // Remove typing indicator and add AI response
        setMessages((prev) => {
          const filtered = prev.filter((msg) => !msg.isTyping);
          return [
            ...filtered,
            {
              id: `ai-${Date.now()}`,
              content:
                response.data.message ||
                "I'm sorry, I couldn't process that request. Could you please try rephrasing?",
              type: "ai",
              timestamp: new Date(),
            },
          ];
        });
      } catch (error) {
        console.error("AI Chat error:", error);

        // Remove typing indicator and add error response
        setMessages((prev) => {
          const filtered = prev.filter((msg) => !msg.isTyping);
          return [
            ...filtered,
            {
              id: `ai-error-${Date.now()}`,
              content: generateFallbackResponse(messageContent),
              type: "ai",
              timestamp: new Date(),
            },
          ];
        });

        showToast(
          "AI is temporarily unavailable, but I've provided a helpful response!",
          "info"
        );
      } finally {
        setIsLoading(false);
      }
    };

    const generateFallbackResponse = (userMessage: string): string => {
      const lowerMessage = userMessage.toLowerCase();

      if (lowerMessage.includes("jollof") || lowerMessage.includes("rice")) {
        return "Jollof rice is the crown jewel of West African cuisine! The key is to use long-grain rice, quality tomatoes, and the right spice blend. Would you like me to share some tips for achieving the perfect Jollof rice texture and flavor?";
      }

      if (
        lowerMessage.includes("ingredient") ||
        lowerMessage.includes("substitute")
      ) {
        return "I'd be happy to help with ingredient substitutions! Many African ingredients have suitable alternatives. For example, you can substitute scotch bonnet peppers with habaneros, or use vegetable oil instead of palm oil if needed. What specific ingredient are you looking to substitute?";
      }

      if (lowerMessage.includes("spice") || lowerMessage.includes("season")) {
        return "African cuisine is all about bold, aromatic spices! Essential spices include curry powder, thyme, bay leaves, ginger, garlic, and local blends like berbere or suya spice. Each region has its signature spice combinations. What type of dish are you seasoning?";
      }

      if (lowerMessage.includes("cook") || lowerMessage.includes("how")) {
        return "I'm here to guide you through any African cooking technique! Whether it's achieving the perfect Jollof rice, making smooth egusi soup, or preparing crispy plantains, I can provide step-by-step instructions. What would you like to learn to cook?";
      }

      if (lowerMessage.includes("time") || lowerMessage.includes("long")) {
        return "Cooking times vary by dish, but here are some general guidelines: Jollof rice (45-60 min), Egusi soup (1-1.5 hours), Plantains (10-15 min), Suya (20-30 min). The key is patience - good African food develops its flavors over time!";
      }

      return "That's a great question about African cuisine! While I'm learning more about your specific query, I can help you with recipes, cooking techniques, ingredient substitutions, spice recommendations, and traditional cooking methods. Feel free to ask me anything about African food!";
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage(inputMessage);
    };

    const handleVoiceInput = (transcript: string) => {
      setInputMessage(transcript);
    };

    const quickQuestions = [
      "How do I make perfect Jollof rice?",
      "What spices are essential for African cooking?",
      "Can you suggest a vegetarian African recipe?",
      "How do I substitute palm oil?",
      "What's the difference between Egusi and Okra soup?",
    ];

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    return (
      <div className={`flex flex-col h-full bg-white ${className}`}>
        {/* Chat Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-emerald-50">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">🤖</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                AI Cooking Assistant
              </h3>
              <p className="text-sm text-gray-600">
                Your African cuisine expert
              </p>
            </div>
            <div className="ml-auto">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === "user"
                    ? "bg-primary text-white"
                    : message.isTyping
                    ? "bg-gray-100 text-gray-600 border-2 border-gray-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {message.isTyping ? (
                  <div className="flex items-center space-x-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <p
                      className={`text-xs mt-2 opacity-70 ${
                        message.type === "user"
                          ? "text-white/70"
                          : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Questions */}
        {messages.length <= 2 && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              Quick questions to get started:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => sendMessage(question)}
                  className="text-xs bg-white border border-gray-300 rounded-full px-3 py-2 hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  disabled={isLoading}
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me about African recipes, cooking tips, ingredients..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                  disabled={isLoading}
                  maxLength={500}
                />
                <div className="absolute right-3 top-3 text-xs text-gray-400">
                  {inputMessage.length}/500
                </div>
              </div>
              <Button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="px-6 py-3 rounded-2xl"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </Button>
            </div>

            {/* Voice Input */}
            <div className="border-t border-gray-200 pt-3">
              <VoiceInput
                onTranscript={handleVoiceInput}
                placeholder="Click to speak your question..."
                className="w-full"
                isListening={isListening}
                onListeningChange={setIsListening}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
);

AIChat.displayName = "AIChat";

export default AIChat;
