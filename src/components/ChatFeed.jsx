import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';

function ChatFeed({ messages, streaming, onFormSubmit, onSuggestionClick, onButtonClick }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, streaming]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-6 py-6 space-y-5 custom-scrollbar"
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center select-none">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(99,102,241,0.15)] animate-pulse">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">TodoAI Agent Terminal</h4>
          <p className="text-[11px] text-zinc-500 mt-2 max-w-xs leading-relaxed">
            Directly command task registers using natural speech. <br />
            <span className="text-indigo-400/80 font-mono italic block mt-1.5">"Create task review billing models tomorrow high priority"</span>
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {messages.map((msg, index) => (
            <ChatMessage
              key={index}
              msg={msg}
              onFormSubmit={onFormSubmit}
              onSuggestionClick={onSuggestionClick}
              onButtonClick={onButtonClick}
            />
          ))}

          {/* Typing indicator */}
          {streaming && (
            <div className="flex gap-3.5 max-w-[80%] items-start animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="bg-zinc-900/40 border border-white/[0.05] rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatFeed;
