import React from 'react';
import { Sparkles, ListTodo, Calendar, BrainCircuit } from 'lucide-react';

const ICONS = {
  sparkles: Sparkles,
  list: ListTodo,
  calendar: Calendar,
  brain: BrainCircuit,
};

function SuggestionChips({ suggestions, onClick, compact }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${compact ? 'mt-2' : 'mt-3'}`}>
      {suggestions.map((chip, i) => {
        const label = typeof chip === 'string' ? chip : chip.label;
        const iconName = typeof chip === 'object' ? chip.icon : null;
        const IconComp = iconName ? ICONS[iconName] : null;

        return (
          <button
            key={i}
            onClick={() => onClick(label)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-800/60 hover:bg-zinc-700/80 border border-white/[0.04] hover:border-indigo-500/30 rounded-xl text-[10px] text-zinc-300 hover:text-white font-medium transition-all active:scale-95"
          >
            {IconComp && <IconComp className="w-3 h-3 text-indigo-400" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default SuggestionChips;
