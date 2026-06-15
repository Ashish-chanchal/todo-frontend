import React from 'react';
import { Scan, Slack, Mail, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

function CommitmentCard({ commitments, onAdd, onIgnore }) {
  if (!commitments || commitments.length === 0) return null;

  return (
    <div className="space-y-3">
      {commitments.map((item) => (
        <div 
          key={item._id} 
          className="bg-[#0c0c11]/60 border border-indigo-500/25 rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-xl relative overflow-hidden animate-fade-in hover:border-indigo-500/40 transition-all duration-300"
        >
          {/* Glowing border top accent */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-indigo-500/40 to-transparent" />
          
          <div className="flex items-center gap-2 mb-3.5 select-none">
            <Scan className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Commitment Net</span>
          </div>

          <div className="flex items-start gap-3.5">
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.4)] border",
              item.source === 'slack' ? 'bg-[#3F0E40]/80 border-[#ecb22e]/20' : 'bg-[#C5221F]/80 border-white/10'
            )}>
              {item.source === 'slack' ? <Slack className="w-4 h-4 text-[#ecb22e]" /> : <Mail className="w-4 h-4 text-white" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-200 leading-relaxed">
                <span className="text-neutral-500 font-medium font-mono text-[10px] block mb-0.5 uppercase">scraped_message:</span>
                "{item.text}"
              </p>
              <p className="text-[9px] text-neutral-600 font-mono mt-1.5">{item.channel} · {new Date(item.createdAt).toLocaleTimeString()}</p>
              
              <div className="flex gap-2.5 mt-4">
                <button 
                  onClick={() => onAdd(item._id)}
                  className="text-[9px] bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-3 py-1.5 font-bold uppercase tracking-wider flex items-center gap-1 transition-all duration-150 active:scale-95 shadow-md shadow-indigo-500/10"
                >
                  <Plus className="w-3 h-3" /> Commit Task
                </button>
                <button 
                  onClick={() => onIgnore(item._id)}
                  className="text-[9px] text-neutral-500 hover:text-neutral-300 px-2.5 py-1.5 font-bold uppercase tracking-wider transition-colors"
                >
                  Ignore
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommitmentCard;
