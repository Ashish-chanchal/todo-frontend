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
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-black/40 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 rounded-xl text-[10px] text-zinc-400 hover:text-zinc-200 transition-all font-mono"
          >
            {IconComp && <IconComp className="w-3 h-3 text-zinc-500" />}
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default SuggestionChips;
