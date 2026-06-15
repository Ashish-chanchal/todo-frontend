import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Sparkles } from 'lucide-react';

function Signup({ onSwitchToLogin }) {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(email, password, name);
    } catch (err) {
      setError(err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-900 border border-white/[0.06] mb-3 shadow-sm">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white select-none">
          Create your account
        </h2>
        <p className="mt-1 text-xs text-zinc-500">
          Sign up to get started with TodoAI
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-400 font-semibold">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-700"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-700"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider select-none">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-700"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-4 py-2.5 font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <UserPlus className="w-3.5 h-3.5" />}
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <button
              onClick={onSwitchToLogin}
              className="text-xs text-indigo-400 hover:underline font-semibold"
            >
              Already have an account? Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
