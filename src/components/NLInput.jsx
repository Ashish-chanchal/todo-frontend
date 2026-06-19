import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import SuggestionChips from './SuggestionChips';

const QUICK_SUGGESTIONS = [
  'Summarize my day',
  'List all tasks',
  'Create a task',
  'What is my priority?',
];

function NLInput({ onSendMessage, disabled, suggestions, onSuggestionClick }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-white/[0.04] px-6 py-4 rounded-b-2xl">
      {/* Quick suggestions */}
      {!disabled && (suggestions || QUICK_SUGGESTIONS).length > 0 && (
        <div className="mb-3">
          <SuggestionChips
            suggestions={suggestions || QUICK_SUGGESTIONS}
            onClick={(label) => {
              onSuggestionClick ? onSuggestionClick(label) : onSendMessage(label);
            }}
          />
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center bg-zinc-950 border border-white/[0.05] focus-within:border-indigo-500/40 rounded-xl px-4 py-3 transition-all duration-200">
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or ask a question..."
            className="w-full bg-transparent text-xs font-mono text-zinc-200 placeholder:text-zinc-600 resize-none focus:outline-none pr-12 min-h-[22px] max-h-[100px] leading-relaxed custom-scrollbar"
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={disabled || !text.trim()}
            className="absolute right-3 p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-lg transition-all disabled:opacity-30 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-3 px-1 text-[9px] text-zinc-500 font-mono tracking-wider select-none uppercase">
          <span>[Enter] Send · [Shift+Enter] Wrap</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
            AI Assistant
          </span>
        </div>
      </form>
    </div>
  );
}

export default NLInput;
