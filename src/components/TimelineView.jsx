import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Workflow, 
  AlertTriangle,
  Cpu
} from 'lucide-react';
import { cn } from '../lib/utils';

function TimelineView() {
  const { token } = useAuth();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scheduleStats, setScheduleStats] = useState(null);

  const fetchTodos = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduleStats = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/schedule-profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setScheduleStats(data.profile);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoSchedule = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/auto-schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        fetchTodos();
        fetchScheduleStats();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchScheduleStats();
  }, [token]);

  // Calendar dates generation (next 7 days)
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(today);
      nextDay.setDate(today.getDate() + i);
      days.push({
        dateStr: nextDay.toISOString().split('T')[0],
        label: nextDay.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
        dateObj: nextDay
      });
    }
    return days;
  };

  const next7Days = getNextDays();

  // Filter tasks with valid due dates
  const scheduledTasks = todos.filter(t => !t.completed && t.dueDate);

  // Group tasks by daily slot
  const getTasksForDay = (dateStr) => {
    return scheduledTasks.filter(t => {
      const todoDateStr = new Date(t.dueDate).toISOString().split('T')[0];
      return todoDateStr === dateStr;
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Header Controller Card */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div>
          <h2 className="text-md font-bold flex items-center gap-2 text-white">
            <Workflow className="w-4 h-4 text-indigo-400" />
            AI Gantt Timeline
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">Visualize project task distributions, focus peak profiles, and timeline logs.</p>
        </div>
        <button
          onClick={handleAutoSchedule}
          disabled={loading}
          className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-full px-4 py-2 font-bold flex items-center gap-1.5 transition-all duration-150 active:scale-95 text-xs disabled:opacity-50"
        >
          AI Auto-Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main 7-day Gantt timeline */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-5 flex flex-col gap-4">
          <h3 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase select-none">Weekly Focus Allocation</h3>

          <div className="space-y-4">
            {next7Days.map((day) => {
              const dayTasks = getTasksForDay(day.dateStr);
              // Calculate allocated hours (capacity limit 6h = 360m)
              const totalMinutes = dayTasks.reduce((sum, t) => sum + (t.aiMetadata?.estimatedMinutes || 60), 0);
              const capacityPercent = Math.min((totalMinutes / 360) * 100, 100);

              return (
                <div key={day.dateStr} className="space-y-2 border-b border-white/[0.03] pb-3 last:border-b-0">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-zinc-300">{day.label}</span>
                    <span className={cn(
                      "font-mono font-semibold text-[9px]",
                      totalMinutes > 360 ? "text-rose-400" : totalMinutes > 240 ? "text-amber-400" : "text-zinc-500"
                    )}>
                      {totalMinutes > 0 ? `${(totalMinutes / 60).toFixed(1)}h allocated` : 'No tasks scheduled'}
                    </span>
                  </div>

                  {/* Daily Capacity tracker line */}
                  {totalMinutes > 0 && (
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-300",
                          totalMinutes > 360 ? "bg-rose-500" : "bg-indigo-500"
                        )}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                  )}

                  {/* Gantt task bar stacks */}
                  <div className="flex flex-col gap-1.5 pl-3">
                    {dayTasks.map((t) => {
                      const estimated = t.aiMetadata?.estimatedMinutes || 60;
                      return (
                        <div 
                          key={t._id}
                          className="flex items-center justify-between bg-zinc-900/20 hover:bg-zinc-900/50 border border-white/[0.03] rounded-lg px-3 py-1.5 text-[10px] text-zinc-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={cn(
                              "w-1.5 h-1.5 rounded-full",
                              t.priority === 'high' ? 'bg-rose-400' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'
                            )} />
                            <span className="font-semibold truncate">{t.title}</span>
                          </div>
                          <div className="flex items-center gap-3 font-mono text-[9px] text-zinc-500 flex-shrink-0">
                            <span>{estimated} mins</span>
                            {t.dependencies?.length > 0 && (
                              <span className="bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 text-[8px] font-bold">
                                Has Dependencies
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right context: Focus Profile metrics */}
        <div className="flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4 select-none">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <h3 className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Focus Peaks Profile</h3>
            </div>
            
            {scheduleStats ? (
              <div className="space-y-4 text-xs">
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-2xl">
                  <span className="text-[9px] text-indigo-400 font-bold block mb-1">OPTIMAL PEAK HOURS</span>
                  <p className="font-semibold text-zinc-200">
                    {scheduleStats.peakHours?.map(h => `${h}:00`).join(' and ') || '9:00 and 14:00'}
                  </p>
                  <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                    {scheduleStats.explanation}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>Focus limit (Daily)</span>
                    <span className="font-mono">6.0 hours</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>Total backlog tasks</span>
                    <span className="font-mono">{todos.length} items</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-zinc-500">
                    <span>Tasks Scheduled</span>
                    <span className="font-mono">{scheduledTasks.length} items</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-zinc-600 italic text-xs select-none">
                Awaiting telemetry calculations...
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default TimelineView;
