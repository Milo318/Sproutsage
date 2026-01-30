
import React, { useState, useRef, useEffect } from 'react';
import { createGardeningChat } from '../services/geminiService';
import { ChatMessage, GroundingSource } from '../types';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatInstance = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatInstance.current) {
      chatInstance.current = createGardeningChat();
    }
    
    // Initial welcome message
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

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await chatInstance.current.sendMessage({ message: input });
      
      // Extract grounding metadata if available
      const sources: GroundingSource[] = [];
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        chunks.forEach((chunk: any) => {
          if (chunk.web && chunk.web.uri) {
            // Only add unique URIs
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

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-180px)] flex flex-col px-4 py-4">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-hide"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] p-4 rounded-3xl ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 shadow-sm border border-emerald-50 rounded-tl-none'
              }`}
            >
              <div className="prose prose-sm max-w-none prose-emerald">
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className="mb-1 last:mb-0">{line}</p>
                ))}
              </div>

              {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-emerald-50">
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <i className="fa-solid fa-earth-americas"></i>
                    Sources & Research
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {msg.sources.map((source, idx) => (
                      <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md hover:bg-emerald-100 transition-colors flex items-center gap-1"
                      >
                        <i className="fa-solid fa-link text-[8px]"></i>
                        {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className={`text-[10px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm border border-emerald-50 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150"></div>
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-300"></div>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider animate-pulse">Searching sources...</span>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <div className="relative bg-white rounded-3xl shadow-xl shadow-emerald-900/5 p-2 border border-emerald-50">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about local pests, seasonal advice, or garden news..."
            className="w-full py-4 px-6 rounded-2xl bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-emerald-600 rounded-2xl text-white flex items-center justify-center shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:bg-gray-200 disabled:shadow-none"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          SproutSage uses Google Search to ground its responses in up-to-date gardening facts.
        </p>
      </div>
    </div>
  );
};

export default ChatBot;
