import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Check, Sparkles, AlertCircle } from 'lucide-react';

function ShareView({ sharedUserId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedBacklog = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/share/${sharedUserId}`);
        const json = await response.json();
        if (response.ok) {
          setData(json);
        } else {
          setError(json.msg || 'Shared board not found');
        }
      } catch (err) {
        setError('Failed to fetch shared board content.');
      } finally {
        setLoading(false);
      }
    };

    if (sharedUserId) {
      fetchSharedBacklog();
    }
  }, [sharedUserId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080a] text-[#ededef] flex flex-col justify-center items-center">
        <div className="w-6 h-6 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-2" />
        <span className="text-xs text-[#88889c]">Loading shared checklist...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#08080a] text-[#ededef] flex flex-col justify-center items-center p-6 text-center">
        <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
        <h3 className="text-sm font-bold">Workspace Not Found</h3>
        <p className="text-xs text-[#88889c] mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-[#ededef] flex flex-col relative overflow-x-hidden">
      <header className="max-w-4xl mx-auto w-full px-6 py-6 border-b border-white/[0.03] flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#ededef]">
            Todo<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">AI</span>
          </span>
        </div>
        <span className="text-xs text-[#88889c] bg-[#121216] border border-white/[0.04] px-3 py-1 rounded-xl">
          Shared Backlog View
        </span>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 relative z-10">
        <h1 className="text-2xl font-bold mb-1">
          {data?.name}'s Workspace
        </h1>
        <p className="text-xs text-[#88889c] mb-8">Active task backlog checklist</p>

        <div className="bg-[#121216] border border-white/[0.04] rounded-2xl shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#171720]/40 border-b border-white/[0.03] flex justify-between items-center text-xs text-[#555566] font-bold tracking-wider uppercase">
            <span>Backlog Tasks</span>
            <span>{data?.todos.length} active</span>
          </div>

          {data?.todos.length === 0 ? (
            <div className="p-12 text-center">
              <Clock className="w-8 h-8 text-[#444455] mx-auto mb-2" />
              <p className="text-sm text-[#88889c]">No items found in active backlog.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.03]">
              {data?.todos.map((todo) => (
                <div key={todo._id} className="flex justify-between items-center p-4">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <div className="w-4 h-4 rounded-full mt-1 border border-white/[0.2] flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#ededef]">{todo.title}</span>
                        {todo.priority && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            todo.priority === 'high' ? 'bg-[#ef4444]/10 text-[#fecaca]' :
                            todo.priority === 'medium' ? 'bg-[#f59e0b]/10 text-[#fef3c7]' :
                            'bg-[#10b981]/10 text-[#a7f3d0]'
                          }`}>
                            {todo.priority}
                          </span>
                        )}
                      </div>
                      {todo.description && (
                        <p className="text-xs text-[#88889c] mt-1 line-clamp-1 leading-relaxed">
                          {todo.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {todo.dueDate && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-[#6b6b80] ml-4">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(todo.dueDate)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ShareView;
