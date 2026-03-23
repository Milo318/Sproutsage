
import React, { useState, useRef, useEffect } from 'react';
import { createGardeningChat } from '../services/geminiService';
import { ChatMessage, GroundingSource } from '../types';

const suggestions = [
  { text: "What are the best indoor plants for beginners?", icon: "fa-house-chimney" },
  { text: "How do I get rid of fungus gnats?", icon: "fa-bug" },
  { text: "When should I start planting vegetables?", icon: "fa-carrot" },
  { text: "Why are my plant's leaves turning yellow?", icon: "fa-leaf" },
  { text: "How often should I fertilize my houseplants?", icon: "fa-vial-circle-check" },
  { text: "What plants are safe for cats?", icon: "fa-cat" },
];

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatInstance = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!chatInstance.current) {
      chatInstance.current = createGardeningChat();
    }
    
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: "Hello! I'm SproutSage, your virtual gardening expert. How can I help you and your plants today? Whether it's about pruning, watering schedules, or diagnosing a sick leaf, I'm here for you!",
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatInstance.current.sendMessage({ message: messageText });
      
      const sources: GroundingSource[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web && chunk.web.uri) {
            if (!sources.find(s => s.uri === chunk.web.uri)) {
              sources.push({
                title: chunk.web.title || 'Source',
                uri: chunk.web.uri
              });
            }
          }
        });
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't process that. Can you rephrase?",
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "My apologies, I'm having trouble connecting to my botanical databases. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col px-4 py-4">
      {/* Suggestions - only show when conversation is empty */}
      {showSuggestions && (
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Try asking about</p>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => handleSend(s.text)}
                className="flex items-center gap-2.5 p-3 bg-white rounded-2xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-all text-left group"
              >
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <i className={`fa-solid ${s.icon} text-emerald-500 text-xs`}></i>
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-emerald-700 leading-tight">{s.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center mr-2 shrink-0 mt-1">
                <i className="fa-solid fa-leaf text-emerald-500 text-xs"></i>
              </div>
            )}
            <div 
              className={`max-w-[80%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-md' 
                  : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-md'
              }`}
            >
              <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'prose-emerald'}`}>
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 last:mb-0 text-sm leading-relaxed">{line}</p>
                ))}
              </div>

              {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <i className="fa-solid fa-earth-americas text-[8px]"></i>
                    Sources
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[9px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md hover:bg-emerald-100 transition-colors flex items-center gap-1 truncate max-w-[200px]"
                      >
                        <i className="fa-solid fa-link text-[7px] shrink-0"></i>
                        <span className="truncate">{source.title}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className={`text-[9px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center mr-2 shrink-0">
              <i className="fa-solid fa-leaf text-emerald-500 text-xs"></i>
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Searching...</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-2">
        <div className="relative bg-white rounded-2xl shadow-xl shadow-gray-900/5 p-1.5 border border-gray-100">
          <input 
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about plants, pests, or garden care..."
            className="w-full py-3.5 px-5 rounded-xl bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
            disabled={isTyping}
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 rounded-xl text-white flex items-center justify-center shadow-lg shadow-emerald-200/50 active:scale-95 transition-all disabled:bg-gray-200 disabled:shadow-none"
          >
            <i className="fa-solid fa-arrow-up text-sm"></i>
          </button>
        </div>
        <p className="text-[9px] text-center text-gray-300 mt-2">
          Powered by Google Search for up-to-date gardening facts
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
