import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

function TaskFormCard({ form, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => {
    const initial = {};
    (form.fields || []).forEach(f => { initial[f.name] = f.value || '' });
    return initial;
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    (form.fields || []).forEach(f => {
      if (f.required && !values[f.name]?.trim()) {
        newErrors[f.name] = `${f.label || f.name} is required`;
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(values);
  };

  const renderField = (field) => {
    const base = 'w-full bg-[#050507] border border-white/[0.06] rounded-lg px-2 py-1.5 text-[11px] text-[#ededef] placeholder:text-[#444455] focus:outline-none focus:border-indigo-500/40 transition-all';

    switch (field.type) {
      case 'select':
        return (
          <select value={values[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)} className={base}>
            <option value="">Select...</option>
            {(field.options || []).map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );
      case 'date':
        return <input type="date" value={values[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)} className={base} />;
      case 'textarea':
        return (
          <textarea rows={2} value={values[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder} className={`${base} resize-none`} />
        );
      default:
        return <input type="text" value={values[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)}
          placeholder={field.placeholder} className={base} />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900/60 border border-white/[0.06] rounded-xl p-3 mt-1.5 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">{form.title || 'New Task'}</span>
        {onCancel && (
          <button type="button" onClick={onCancel} className="p-0.5 hover:bg-zinc-800 rounded">
            <X className="w-3 h-3 text-zinc-500" />
          </button>
        )}
      </div>

      {(form.fields || []).map(field => (
        <div key={field.name}>
          <label className="text-[9px] text-zinc-500 font-semibold block mb-0.5">
            {field.label || field.name}
            {field.required && <span className="text-rose-400 ml-0.5">*</span>}
          </label>
          {renderField(field)}
          {errors[field.name] && <p className="text-[8px] text-rose-400 mt-0.5">{errors[field.name]}</p>}
        </div>
      ))}

      <button type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-1.5 text-[10px] font-semibold flex items-center justify-center gap-1 transition-all active:scale-[0.98]">
        <Send className="w-2.5 h-2.5" />
        {form.submitLabel || 'Create'}
      </button>
    </form>
  );
}

export default TaskFormCard;
