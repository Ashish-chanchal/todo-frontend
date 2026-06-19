import React, { useState } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';

function ApprovalGate({ negotiationData, onApplyOption, onDismiss }) {
  const [selectedOptionId, setSelectedOptionId] = useState('');

  if (!negotiationData || !negotiationData.hasConflict || !negotiationData.options || negotiationData.options.length === 0) {
    return null;
  }

  // Set initial selection if not set
  if (!selectedOptionId && negotiationData.options.length > 0) {
    setSelectedOptionId(negotiationData.options[0].id);
  }

  const handleApply = () => {
    if (!selectedOptionId) return;
    const opt = negotiationData.options.find(o => o.id === selectedOptionId);
    if (opt) {
      onApplyOption(opt.actions, opt.title);
    }
  };

  return (
    <div className="bg-[#0c0c11]/60 border border-amber-500/25 rounded-3xl p-6 space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl relative overflow-hidden animate-fade-in hover:border-amber-500/40 transition-all duration-300">
      {/* Top Warning Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-amber-500/40 to-transparent" />
      
      <div className="flex items-start gap-3 select-none">
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0 animate-pulse" />
        <div>
          <p className="text-xs font-bold text-neutral-300 uppercase tracking-wider">AI Capacity Negotiation</p>
          <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">
            Tomorrow backlog requires {negotiationData.totalLoadMinutes} mins of focus work. This exceeds your {negotiationData.capacityMinutes} mins capacity.
          </p>
        </div>
      </div>
      
      <div className="space-y-2 ml-7">
        <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block select-none">Reschedule Options:</span>
        {negotiationData.options.map((opt) => (
          <label 
            key={opt.id} 
            className={cn(
              "flex items-start gap-3 p-2.5 rounded-xl cursor-pointer transition-all border",
              selectedOptionId === opt.id
                ? 'bg-amber-500/5 border-amber-500/20 text-neutral-200'
                : 'bg-neutral-950/40 border-white/[0.04] text-neutral-400 hover:border-white/10 hover:text-neutral-300'
            )}
          >
            <input 
              type="radio" 
              name="conflict-option" 
              className="mt-0.5 accent-indigo-500" 
              checked={selectedOptionId === opt.id}
              onChange={() => setSelectedOptionId(opt.id)}
            />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-xs font-semibold">{opt.title}</p>
              <p className="text-[9px] text-neutral-500 flex items-center gap-1.5 mt-1 font-mono">
                <Clock className="w-3 h-3 text-neutral-600" /> {opt.description}
              </p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex gap-2.5 ml-7 pt-1">
        <button 
          onClick={handleApply}
          className="bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] rounded-full px-4 py-2 font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md shadow-indigo-500/15"
        >
          Approve & Apply
        </button>
        <button 
          onClick={onDismiss}
          className="text-[10px] text-neutral-500 hover:text-neutral-300 px-3 py-2 font-bold uppercase tracking-wider transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default ApprovalGate;
