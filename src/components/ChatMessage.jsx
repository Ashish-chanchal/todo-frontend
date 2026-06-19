import React from 'react';
import { Sparkles, HelpCircle, Check, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import TaskFormCard from './TaskFormCard';
import SuggestionChips from './SuggestionChips';

function sanitize(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
}

function ChatMessage({ msg, onFormSubmit, onSuggestionClick, onButtonClick }) {
  const isUser = msg.sender === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="flex gap-3 max-w-[85%] ml-auto justify-end"
      >
        <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl rounded-tr-sm px-4 py-3 shadow-md backdrop-blur-xl">
          <p className="text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-widest mb-1 select-none">you</p>
          <p className="text-xs text-zinc-200 leading-normal">{sanitize(msg.text)}</p>
        </div>
        <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
          <User className="w-3.5 h-3.5 text-indigo-400" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="flex gap-3.5 max-w-[90%] items-start"
    >
      <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-white/[0.06] flex items-center justify-center flex-shrink-0 shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn(
          "border rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm relative overflow-hidden backdrop-blur-xl",
          msg.confidence !== undefined && msg.confidence > 0.7
            ? 'bg-emerald-950/10 border-emerald-500/20'
            : 'bg-zinc-900/40 border-white/[0.05]'
        )}>
          <div className={cn(
            "absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r",
            msg.confidence !== undefined && msg.confidence > 0.7
              ? 'from-emerald-500/30 to-transparent'
              : 'from-indigo-500/20 to-transparent'
          )} />

          <p className="text-[9px] font-bold font-mono text-indigo-400 uppercase tracking-widest mb-1 select-none">assistant</p>
          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">{sanitize(msg.text)}</p>

          {/* Confidence badge */}
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

        {/* Inline form */}
        {msg.type === 'form' && msg.form && (
          <TaskFormCard
            form={msg.form}
            onSubmit={(values) => onFormSubmit(values, msg)}
            onCancel={msg.form.dismissable !== false ? () => onButtonClick?.({ action: 'cancel', msg }) : undefined}
          />
        )}

        {/* Action buttons */}
        {msg.type === 'confirm' && msg.buttons && (
          <div className="flex gap-2 mt-2">
            {msg.buttons.map((btn, i) => (
              <button
                key={i}
                onClick={() => onButtonClick?.(btn, msg)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95",
                  btn.variant === 'primary'
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    : btn.variant === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        )}

        {/* Suggestion chips */}
        {msg.suggestions && (
          <SuggestionChips suggestions={msg.suggestions} onClick={onSuggestionClick} compact />
        )}
      </div>
    </motion.div>
  );
}

export default ChatMessage;
