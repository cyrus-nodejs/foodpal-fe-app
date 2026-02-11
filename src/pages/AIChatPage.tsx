import React, { useRef } from "react";
import AIChat, { AIChatRef } from "../components/AIChat";

export default function AIChatPage() {
  const chatRef = useRef<AIChatRef>(null);

  const handleQuickAction = (message: string) => {
    // Scroll to chat and send the message
    if (chatRef.current) {
      chatRef.current.sendMessage(message);
    }
    // Scroll to the chat interface
    const chatElement = document.getElementById("ai-chat-interface");
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-6xl h-screen flex flex-col">
        {/* Page Header */}
        <div className="flex-shrink-0 bg-white shadow-sm border-b">
          <div className="px-6 py-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Cooking Assistant
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get instant help with African recipes, cooking techniques,
                ingredient substitutions, and culinary advice from our
                AI-powered cooking assistant.
              </p>
            </div>

            {/* Quick Features */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
              <button
                onClick={() =>
                  handleQuickAction(
                    "I need help with cooking recipes. Can you guide me through making authentic African dishes?"
                  )
                }
                className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover:from-primary/10 hover:to-primary/20 transition-all duration-200 transform hover:scale-105 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/30 transition-colors">
                  <span>🍛</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Recipe Help
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Get cooking guidance
                </p>
              </button>

              <button
                onClick={() =>
                  handleQuickAction(
                    "What are some good ingredient substitutions for African cooking? I want to learn about alternatives."
                  )
                }
                className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl hover:from-emerald-100 hover:to-emerald-200 transition-all duration-200 transform hover:scale-105 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-emerald-200 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-300 transition-colors">
                  <span>🌶️</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Ingredient Tips
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Substitutions & uses
                </p>
              </button>

              <button
                onClick={() =>
                  handleQuickAction(
                    "How long should I cook different African dishes? I need guidance on cooking times and timing."
                  )
                }
                className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl hover:from-yellow-100 hover:to-yellow-200 transition-all duration-200 transform hover:scale-105 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-yellow-200 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-yellow-300 transition-colors">
                  <span>⏱️</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Cooking Times
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Perfect timing advice
                </p>
              </button>

              <button
                onClick={() =>
                  handleQuickAction(
                    "Can you teach me traditional African cooking techniques? I want to learn authentic methods."
                  )
                }
                className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all duration-200 transform hover:scale-105 cursor-pointer group"
              >
                <div className="w-8 h-8 bg-orange-200 rounded-lg flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-300 transition-colors">
                  <span>🎯</span>
                </div>
                <h3 className="font-medium text-gray-900 text-sm">
                  Techniques
                </h3>
                <p className="text-xs text-gray-600 mt-1">
                  Traditional methods
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div
          id="ai-chat-interface"
          className="flex-1 bg-white shadow-lg rounded-t-2xl mt-4 mx-4 mb-4 overflow-hidden"
        >
          <AIChat
            ref={chatRef}
            context={{
              type: "general",
              data: {
                page: "ai-chat",
                timestamp: new Date().toISOString(),
              },
            }}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
