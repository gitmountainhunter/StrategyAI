'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RefreshCw, BarChart3 } from 'lucide-react';
import { ChatMessage } from '@/types';
import { ChatChart } from '@/components/chat/ChatChart';

// Sample suggestions for the chat - including visualization triggers
const suggestions = [
  "Show me strategic outcomes progress",
  "What's the revenue trend toward 2030?",
  "Compare market segment performance",
  "Show priorities status",
  "What are the main constraints we're facing?",
  "How is the digital transformation progressing?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your PCT Strategy Agent. I can help you understand the M&T Strategy and Execution Plan, analyze market trends, and provide insights about your oil & gas chemistry business.\n\nI can also generate **charts and visualizations** from your data. Try asking me to:\n• Show strategic outcomes progress\n• Display revenue trends\n• Compare market segments\n• Visualize priorities status\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Call the chat API
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, history: messages }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        metadata: data.metadata,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-light text-slb-black">Strategy Agent</h1>
          <p className="text-sm font-light text-gray-500">
            Ask questions about your PCT strategy and market intelligence
          </p>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-light text-gray-600 hover:text-slb-blue hover:bg-gray-50 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex items-start space-x-3 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-slb-blue' : 'bg-gray-100'
                }`}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-slb-blue" />
                )}
              </div>
              <div
                className={`chat-message ${
                  message.role === 'user'
                    ? 'chat-message-user'
                    : 'chat-message-assistant'
                }`}
              >
                <p className="text-sm font-light whitespace-pre-wrap">
                  {message.content}
                </p>

                {/* Render charts if present */}
                {message.metadata?.charts && message.metadata.charts.length > 0 && (
                  <div className="mt-3">
                    {message.metadata.charts.map((chart, index) => (
                      <ChatChart key={chart.id || index} chartData={chart} />
                    ))}
                  </div>
                )}

                {message.metadata?.suggestions && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-light text-gray-500 mb-2">
                      Related questions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.metadata.suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(suggestion)}
                          className="text-xs font-light px-2 py-1 bg-white border border-gray-200 rounded hover:border-slb-blue hover:text-slb-blue transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Bot className="w-4 h-4 text-slb-blue" />
              </div>
              <div className="chat-message chat-message-assistant">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slb-blue rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-slb-blue rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  />
                  <div
                    className="w-2 h-2 bg-slb-blue rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="pb-4">
          <p className="text-sm font-light text-gray-500 mb-3">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(suggestion)}
                className="text-sm font-light px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg hover:border-slb-blue hover:text-slb-blue transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask about your strategy, market trends, or request analysis..."
              rows={1}
              className="w-full px-4 py-3 text-sm font-light border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-slb-blue focus:border-transparent"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
        <p className="text-xs font-light text-gray-400 mt-2 text-center">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
