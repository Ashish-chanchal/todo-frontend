import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Tag } from 'lucide-react';
import { cn } from '../lib/utils';

function Form({ getTodos }) {
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    tags: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const setPriority = (priority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    setMessage('');
    try {
      const parsedTags = formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
        : [];

      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/todo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate || null,
          tags: parsedTags
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Task logged successfully.');
        getTodos();
        setFormData({
          title: '',
          description: '',
          priority: 'medium',
          dueDate: '',
          tags: ''
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.msg || 'Failed to create todo');
      }
    } catch (err) {
      console.error(err);
      setMessage('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="glass-panel rounded-2xl p-5 shadow-lg relative overflow-hidden transition-all duration-300">
        <h3 className="text-[10px] font-bold flex items-center gap-2 mb-4 text-zinc-400 uppercase tracking-widest select-none">
          Log Task / <span className="text-zinc-600">Manual Entry</span>
        </h3>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <input
              type="text"
              placeholder="Task title or backlog subject..."
              className="glass-input rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none font-medium"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <textarea
              placeholder="Optional notes, log references, or context links..."
              className="glass-input rounded-xl px-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none min-h-[50px] resize-none leading-relaxed"
              name="description"
              id="description"
              onChange={handleChange}
              value={formData.description}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-white/[0.04]">
            {/* Priority Picker */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider select-none mb-1">Priority</span>
              <div className="flex gap-1.5">
                {['low', 'medium', 'high'].map((p) => {
                  const isActive = formData.priority === p;
                  let colorClass = 'bg-zinc-950/60 text-zinc-400 border-white/[0.04] hover:border-white/10';
                  if (isActive) {
                    if (p === 'low') colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold';
                    if (p === 'medium') colorClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold';
                    if (p === 'high') colorClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold';
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex-1 py-1.5 border rounded-xl text-[10px] capitalize transition-all duration-150 active:scale-95",
                        colorClass
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Due Date */}
            <div className="flex flex-col gap-1">
              <label htmlFor="dueDate" className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 select-none mb-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-600" /> Due Date
              </label>
              <input
                type="date"
                className="glass-input rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none"
                name="dueDate"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            {/* Tags */}
            <div className="flex flex-col gap-1">
              <label htmlFor="tags" className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5 select-none mb-1">
                <Tag className="w-3.5 h-3.5 text-zinc-600" /> Label Tags
              </label>
              <input
                type="text"
                placeholder="work, feature, personal"
                className="glass-input rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                name="tags"
                id="tags"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="submit"
              disabled={loading || !formData.title.trim()}
              className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-full px-5 py-2 text-xs font-bold transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>

        {message && (
          <p className="mt-3 font-semibold text-center text-xs text-indigo-400 font-mono animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Form;
