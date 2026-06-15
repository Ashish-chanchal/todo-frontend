import React, { useRef, useEffect } from 'react';
import { Sparkles, HelpCircle, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

function ChatFeed({ messages, streaming }) {
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
      className="flex-1 overflow-y-auto px-6 py-6 space-y-6 max-h-[480px] min-h-[350px] custom-scrollbar"
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
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            
            if (isUser) {
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="flex gap-3 max-w-[85%] ml-auto justify-end"
                >
                  <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl rounded-tr-sm px-4.5 py-3 shadow-md backdrop-blur-xl">
                    <p className="text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-widest mb-1 select-none">user_query:</p>
                    <p className="text-xs text-zinc-200 leading-normal">{msg.text}</p>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="flex gap-3.5 max-w-[90%] items-start"
              >
                <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <div className={cn(
                  "border rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex-1 relative overflow-hidden backdrop-blur-xl transition-all duration-200",
                  msg.confidence !== undefined && msg.confidence > 0.7 
                    ? 'bg-emerald-950/10 border-emerald-500/20' 
                    : 'bg-zinc-900/40 border-white/[0.05]'
                )}>
                  {/* Subtle active glow overlay inside the assistant card */}
                  <div className={cn(
                    "absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r",
                    msg.confidence !== undefined && msg.confidence > 0.7 
                      ? 'from-emerald-500/30 to-transparent' 
                      : 'from-indigo-500/20 to-transparent'
                  )} />
                  
                  <p className="text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-widest mb-1 select-none">assistant_response:</p>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>
                  
                  {/* Confidence metrics banner */}
                  {msg.confidence !== undefined && (
                    <div className="flex gap-2 mt-3 pt-2 border-t border-white/[0.04]">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 text-[8px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider",
                        msg.confidence > 0.7 
                          ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15' 
                          : 'bg-amber-500/5 text-amber-400 border-amber-500/15'
                      )}>
                        {msg.confidence > 0.7 ? <Check className="w-2.5 h-2.5" /> : <HelpCircle className="w-2.5 h-2.5" />}
                        {msg.confidence > 0.7 ? 'CONFIDENT' : 'UNCERTAIN'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Typing loaders */}
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
