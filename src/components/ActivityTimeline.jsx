import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

function ActivityTimeline({ logs, onUndoAll }) {
  return (
    <div className="p-6 bg-[#0c0c11]/60 border border-white/[0.06] rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl relative overflow-hidden hover:border-indigo-500/20 transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-indigo-500/10 to-transparent" />
      <div className="flex items-center justify-between mb-4 select-none">
        <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Audit Trail</h4>
        {logs.length > 0 && (
          <button 
            onClick={onUndoAll}
            className="text-[9px] text-indigo-400/80 hover:text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-2.5 h-2.5" /> Clear
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <p className="text-xs text-neutral-500 italic py-2">No logs recorded.</p>
      ) : (
        <div className="relative pl-6 space-y-4 max-h-[220px] overflow-y-auto pr-1.5 custom-scrollbar">
          {/* Vertical Connecting Line */}
          <div className="absolute left-[11px] top-2.5 bottom-2.5 w-[2px] bg-white/[0.06]" />

          {logs.map((log, index) => (
            <div key={index} className="relative flex flex-col gap-0.5 animate-fade-in">
              {/* Glowing timeline dot */}
              <span className={cn(
                "absolute -left-[18px] top-1.5 w-3 h-3 rounded-full border bg-[#050508]",
                log.type === 'create' ? 'border-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 
                log.type === 'complete' ? 'border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 
                'border-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
              )} />
              
              <p className="text-[11px] text-neutral-300 leading-normal font-sans">
                {log.action}
              </p>
              <span className="text-[9px] text-neutral-600 font-mono mt-0.5">{log.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityTimeline;
