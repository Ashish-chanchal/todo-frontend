import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../lib/utils';

function NLInput({ onSendMessage, disabled }) {
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
    <form onSubmit={handleSubmit} className="border-t border-white/[0.04] px-6 py-4.5 bg-zinc-950/40 rounded-b-2xl">
      <div className="relative flex items-center bg-zinc-950 border border-white/[0.05] focus-within:border-indigo-500/40 rounded-xl px-4 py-3 transition-all duration-200">
        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type command (e.g. 'Add design tasks')..."
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
          <span className="w-1 h-1 rounded-full bg-indigo-400 animate-ping" />
          Agent Parser Active
        </span>
      </div>
    </form>
  );
}

export default NLInput;
