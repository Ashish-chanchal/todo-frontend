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
          <div className="w-12 h-12 rounded-2xl bg-black border border-zinc-800 flex items-center justify-center mb-4">
            <Sparkles className="w-5 h-5 text-zinc-400" />
          </div>
          <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-widest font-mono">TodoAI Agent Terminal</h4>
          <p className="text-[11px] text-zinc-500 mt-2 max-w-xs leading-relaxed font-sans">
            Directly command task registers using natural speech. <br />
            <span className="text-zinc-400 font-mono italic block mt-1.5">"Create task review billing models tomorrow high priority"</span>
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
            <div className="flex gap-3.5 max-w-[80%] items-start">
              <div className="w-8 h-8 rounded-xl bg-black border border-zinc-800 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="bg-black/40 border border-zinc-800/80 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
