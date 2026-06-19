import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Trash2, 
  Check, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ChevronDown 
} from 'lucide-react';
import { cn } from '../lib/utils';

function TodosList({ todos, makeComplete, deleteTodo, fetchTodos, activeTeam }) {
  const { token } = useAuth();
  
  // Local UI states
  const [loadingTodoId, setLoadingTodoId] = useState(null); // for AI breakdown spinner
  const [newSubtaskTexts, setNewSubtaskTexts] = useState({}); // todoId -> text
  const [logWorkMinutes, setLogWorkMinutes] = useState({}); // todoId -> number

  const statuses = [
    { id: 'todo', label: 'To Do', color: 'text-zinc-400 bg-zinc-950/60 border-white/[0.03]' },
    { id: 'in_progress', label: 'In Progress', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 'review', label: 'In Review', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { id: 'done', label: 'Completed', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' }
  ];

  const isOverdue = (dueDate, status) => {
    if (!dueDate || status === 'done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dueDate) < today;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  // Actions
  const handleStatusChange = async (todoId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/todo/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: todoId, status: newStatus })
      });
      if (res.ok) {
        if (fetchTodos) fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogWork = async (todoId) => {
    const minutes = parseInt(logWorkMinutes[todoId] || '0');
    if (!minutes || minutes <= 0) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/todo/log-work`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: todoId, minutes })
      });
      if (res.ok) {
        setLogWorkMinutes(prev => ({ ...prev, [todoId]: '' }));
        if (fetchTodos) fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddSubtask = async (todoId) => {
    const title = newSubtaskTexts[todoId] || '';
    if (!title.trim()) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/todo/subtask/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: todoId, title })
      });
      if (res.ok) {
        setNewSubtaskTexts(prev => ({ ...prev, [todoId]: '' }));
        if (fetchTodos) fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubtaskToggle = async (todoId, subtaskId, currentlyCompleted) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/todo/subtask/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ todoId, subtaskId, completed: !currentlyCompleted })
      });
      if (res.ok) {
        if (fetchTodos) fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAIBreakdown = async (todoId) => {
    setLoadingTodoId(todoId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/break-down`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: todoId })
      });
      if (res.ok) {
        if (fetchTodos) fetchTodos();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTodoId(null);
    }
  };

  // Local states for assignee filtering
  const [filterAssigneeId, setFilterAssigneeId] = useState('all');

  // Get unique assignees from the current todos list
  const uniqueAssignees = todos.reduce((acc, t) => {
    if (t.assigneeId && !acc.some(a => a._id === t.assigneeId._id)) {
      acc.push(t.assigneeId);
    }
    return acc;
  }, []);

  const filteredTodos = filterAssigneeId === 'all' 
    ? todos 
    : filterAssigneeId === 'unassigned'
      ? todos.filter(t => !t.assigneeId)
      : todos.filter(t => t.assigneeId?._id === filterAssigneeId);

  // Group todos by status
  const groupedTodos = {
    todo: filteredTodos.filter(t => t.status === 'todo' || (!t.status && !t.completed)),
    in_progress: filteredTodos.filter(t => t.status === 'in_progress'),
    review: filteredTodos.filter(t => t.status === 'review'),
    done: filteredTodos.filter(t => t.status === 'done' || t.completed)
  };

  return (
    <div className="w-full mt-2 select-none">
      {/* Workspace & Assignee Filter Header */}
      {activeTeam && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 p-4 glass-panel rounded-2xl border border-white/[0.04]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
              Workspace: {activeTeam.name}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Filter Assignee:</span>
            <select
              value={filterAssigneeId}
              onChange={(e) => setFilterAssigneeId(e.target.value)}
              className="glass-input rounded-xl px-3 py-1.5 text-[10px] text-zinc-300 focus:outline-none min-w-[140px] bg-zinc-950/80 border border-white/[0.06]"
            >
              <option value="all">Show All Tasks</option>
              <option value="unassigned">Unassigned</option>
              {uniqueAssignees.map(assignee => (
                <option key={assignee._id} value={assignee._id}>
                  {assignee.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-start">
        {statuses.map((statusCol) => {
          const columnTodos = groupedTodos[statusCol.id] || [];
          
          return (
            <div 
              key={statusCol.id}
              className="glass-panel rounded-2xl p-4 flex flex-col gap-4 min-h-[520px] relative"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center pb-2 border-b border-white/[0.04] select-none">
                <span className={cn(
                  "text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider",
                  statusCol.color
                )}>
                  {statusCol.label}
                </span>
                <span className="text-[10px] text-zinc-500 font-bold font-mono">
                  {columnTodos.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="flex flex-col gap-3.5 pr-1">
                {columnTodos.length === 0 ? (
                  <div className="py-12 text-center text-zinc-600 italic text-[10px] border border-dashed border-white/[0.04] rounded-xl select-none">
                    Backlog Empty
                  </div>
                ) : (
                  columnTodos.map((todo) => {
                    const overdue = isOverdue(todo.dueDate, todo.status);
                    
                    // Progress calculations
                    const totalSubtasks = todo.subtasks?.length || 0;
                    const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0;
                    const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
                    
                    const timeEstimated = todo.aiMetadata?.estimatedMinutes || 60;
                    const timeLogged = todo.timeLogged || 0;
                    const timeProgress = Math.min((timeLogged / timeEstimated) * 100, 100);

                    return (
                      <div 
                        key={todo._id}
                        className="bg-zinc-900/40 hover:bg-zinc-900/80 border border-white/[0.04] hover:border-indigo-500/30 rounded-xl p-4 pl-4.5 shadow-sm flex flex-col gap-3 relative overflow-hidden group transition-all duration-200"
                      >
                        {/* Priority indicator bar */}
                        {todo.status !== 'done' && todo.priority && (
                          <div className={cn(
                            "absolute left-0 top-0 bottom-0 w-[3px]",
                            todo.priority === 'high' ? 'bg-rose-500' :
                            todo.priority === 'medium' ? 'bg-amber-500' : 
                            'bg-emerald-500'
                          )} />
                        )}

                        {/* Title and Dropdown */}
                        <div className="flex justify-between items-start gap-2">
                          <span className={cn(
                            "text-xs font-semibold text-zinc-200 tracking-tight leading-snug",
                            todo.status === 'done' ? 'line-through text-zinc-600' : ''
                          )}>
                            {todo.title}
                          </span>
                          
                          {/* Column Mover Selector */}
                          <div className="relative group/mover">
                            <button className="p-1 hover:bg-white/5 rounded-md text-zinc-500 hover:text-white transition-all">
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <div className="absolute right-0 top-6 bg-[#0c0c10] border border-white/[0.06] rounded-xl py-1 min-w-[110px] hidden group-hover/mover:block z-50 shadow-2xl">
                              {statuses.map(st => (
                                <button
                                  key={st.id}
                                  onClick={() => handleStatusChange(todo._id, st.id)}
                                  className={cn(
                                    "w-full text-left px-3 py-1 text-[9px] hover:bg-white/5 hover:text-white block",
                                    todo.status === st.id ? "text-indigo-400 font-bold" : "text-zinc-500"
                                  )}
                                >
                                  {st.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {todo.description && (
                          <p className="text-[10px] text-zinc-400 leading-relaxed line-clamp-2">
                            {todo.description}
                          </p>
                        )}

                        {/* Sprint & Tags */}
                        <div className="flex flex-wrap gap-1 items-center">
                          {todo.sprint && (
                            <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                              {todo.sprint}
                            </span>
                          )}
                          {todo.tags?.map((tag, idx) => (
                            <span key={idx} className="text-[8px] px-1.5 py-0.5 bg-zinc-950/70 border border-white/[0.04] text-zinc-500 rounded font-mono">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Nested Subtasks List */}
                        {totalSubtasks > 0 && (
                          <div className="space-y-1.5 border-t border-white/[0.04] pt-2.5">
                            <div className="flex justify-between items-center text-[9px] text-zinc-500 select-none">
                              <span>Subtasks ({completedSubtasks}/{totalSubtasks})</span>
                              <span className="font-mono font-bold">{Math.round(subtaskProgress)}%</span>
                            </div>
                            <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" style={{ width: `${subtaskProgress}%` }} />
                            </div>

                            {/* Subtask checkboxes */}
                            <div className="space-y-1 mt-2 max-h-[100px] overflow-y-auto pr-0.5 scrollbar-thin">
                              {todo.subtasks.map((st) => (
                                <button
                                  key={st._id}
                                  onClick={() => handleSubtaskToggle(todo._id, st._id, st.completed)}
                                  className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.02] text-left transition-colors"
                                >
                                  <div className={cn(
                                    "w-3.5 h-3.5 rounded border flex items-center justify-center transition-all flex-shrink-0",
                                    st.completed 
                                      ? "bg-indigo-500/20 border-indigo-500 text-indigo-400"
                                      : "border-white/[0.1] hover:border-indigo-400"
                                  )}>
                                    {st.completed && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                                  </div>
                                  <span className={cn(
                                    "text-[10px] truncate leading-tight",
                                    st.completed ? "line-through text-zinc-600" : "text-zinc-200"
                                  )}>
                                    {st.title}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Unified inline subtask text field with Sparks trigger inside */}
                        <div className="flex gap-2 items-center border-t border-white/[0.04] pt-2.5">
                          <div className="relative flex-1 flex items-center">
                            <input
                              type="text"
                              value={newSubtaskTexts[todo._id] || ''}
                              onChange={(e) => setNewSubtaskTexts({ ...newSubtaskTexts, [todo._id]: e.target.value })}
                              placeholder="Add subtask..."
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddSubtask(todo._id);
                              }}
                              className="glass-input w-full rounded-lg pl-2 pr-8 py-1 text-[9px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                            />
                            <button
                              onClick={() => handleAIBreakdown(todo._id)}
                              disabled={loadingTodoId === todo._id}
                              className="absolute right-1 p-1 hover:bg-white/5 text-zinc-500 hover:text-indigo-400 rounded-md transition-colors"
                              title="AI Subtask Breakdown"
                            >
                              <Sparkles className={cn("w-3 h-3", loadingTodoId === todo._id ? "animate-spin text-indigo-400" : "")} />
                            </button>
                          </div>
                        </div>

                        {/* Time tracking widget with inline Log action */}
                        <div className="space-y-1.5 border-t border-white/[0.04] pt-2.5">
                          <div className="flex justify-between items-center text-[9px] text-zinc-500 select-none">
                            <span>Logged Work</span>
                            <span className="font-mono">{timeLogged}m / {timeEstimated}m</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" style={{ width: `${timeProgress}%` }} />
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <div className="relative flex-1 flex items-center">
                              <input
                                type="number"
                                placeholder="Log mins..."
                                value={logWorkMinutes[todo._id] || ''}
                                onChange={(e) => setLogWorkMinutes({ ...logWorkMinutes, [todo._id]: e.target.value })}
                                className="glass-input w-full rounded-lg pl-2 pr-10 py-1 text-[9px] font-mono text-zinc-200 placeholder:text-zinc-600"
                              />
                              <button
                                onClick={() => handleLogWork(todo._id)}
                                className="absolute right-1 px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-white/[0.03] text-[8px] font-bold uppercase rounded transition-colors"
                              >
                                Log
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Card Footer: Due dates & delete actions */}
                        <div className="flex justify-between items-center border-t border-white/[0.04] pt-2 text-[9px] text-zinc-500 select-none">
                          <div className="flex items-center gap-2">
                            {todo.dueDate ? (
                              <div className={cn(
                                "flex items-center gap-1 font-mono",
                                overdue ? 'text-rose-400 font-bold' : 'text-zinc-500'
                              )}>
                                {overdue ? <AlertTriangle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                                <span>{formatDate(todo.dueDate)}</span>
                              </div>
                            ) : (
                              <span />
                            )}
                            
                            {todo.assigneeId && (
                              <div 
                                className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.04] rounded-full pl-1 pr-2 py-0.5 text-zinc-400 hover:text-zinc-200 transition-colors"
                                title={todo.assigneeId.email}
                              >
                                <span className="w-3.5 h-3.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-bold rounded-full flex items-center justify-center">
                                  {todo.assigneeId.name ? todo.assigneeId.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                                </span>
                                <span className="text-[8px] max-w-[65px] truncate font-medium">{todo.assigneeId.name}</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => deleteTodo(todo._id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all md:opacity-0 group-hover:opacity-100 duration-200 active:scale-95"
                            title="Delete Task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TodosList;
