import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, FolderKanban, ChevronDown, Plus, Users, User, Check, Sparkles } from 'lucide-react';

function NavBar({ onOpenSettings, activeTab, teams = [], activeTeam = null, onSwitchTeam, onCreateTeam }) {
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [loading, setLoading] = useState(false);

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'chat': return 'AI Assistant';
      case 'board': return 'Kanban Board';
      case 'timeline': return 'Gantt Timeline';
      case 'settings': return 'Settings';
      default: return 'console';
    }
  };

  const handleCreateTeamSubmit = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setLoading(true);
    const success = await onCreateTeam(newTeamName.trim());
    if (success) {
      setNewTeamName('');
      setCreateModalOpen(false);
    }
    setLoading(false);
  };

  return (
    <nav className="h-16 w-full px-6 border-b border-white/[0.05] bg-[#0c0c10]/45 backdrop-blur-md flex items-center justify-between z-50 relative">
      
      {/* Left side: Breadcrumb / Workspace Switcher */}
      <div className="flex items-center gap-3 text-xs text-zinc-400 select-none relative">
        <FolderKanban className="w-4 h-4 text-indigo-400" />
        
        {/* Workspace Dropdown Trigger */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-zinc-200 hover:text-white font-medium transition-all active:scale-[0.98]"
          >
            {activeTeam ? (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-tight">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> {activeTeam.name}
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-tight">
                <User className="w-3.5 h-3.5 text-zinc-500" /> Personal Workspace
              </span>
            )}
            <ChevronDown className={`w-3 h-3 text-zinc-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Switcher Dropdown Menu */}
          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-[#09090b]/95 border border-white/[0.07] shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl p-2 z-50 flex flex-col gap-1 animate-fade-in text-left">
                <span className="px-3 py-1.5 text-[8px] font-bold text-zinc-500 tracking-widest uppercase">Select Workspace</span>
                
                {/* Personal Option */}
                <button
                  onClick={() => {
                    onSwitchTeam('personal');
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 text-left text-xs rounded-xl transition-all ${
                    !activeTeam 
                      ? 'bg-indigo-500/10 text-indigo-300 font-semibold' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" /> Personal Workspace
                  </span>
                  {!activeTeam && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>

                <div className="h-px bg-white/[0.03] my-1" />

                {/* Team Options */}
                {teams.map((team) => (
                  <button
                    key={team._id}
                    onClick={() => {
                      onSwitchTeam(team._id);
                      setDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 text-left text-xs rounded-xl transition-all ${
                      activeTeam && activeTeam._id === team._id
                        ? 'bg-indigo-500/10 text-indigo-300 font-semibold' 
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Users className="w-3.5 h-3.5" /> <span className="truncate">{team.name}</span>
                    </span>
                    {activeTeam && activeTeam._id === team._id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </button>
                ))}

                <div className="h-px bg-white/[0.03] my-1" />

                {/* Create Team Button */}
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setCreateModalOpen(true);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left text-xs text-zinc-400 hover:bg-indigo-500/10 hover:text-indigo-300 rounded-xl transition-all font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Create New Workspace
                </button>
              </div>
            </>
          )}
        </div>

        <span className="text-zinc-700">/</span>
        <span className="font-semibold text-zinc-300 font-sans tracking-tight">{getTabLabel(activeTab)}</span>
      </div>
      
      {/* Right side: User Profiling */}
      {isAuthenticated && (
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right select-none">
            <span className="text-xs text-zinc-200 font-semibold block leading-tight">
              {user?.name && user?.name !== user?.email ? user.name : (user?.email ? user.email.split('@')[0] : 'User')}
            </span>
            <span className="text-[9px] text-zinc-500 font-mono block mt-0.5">{user?.email || ''}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] text-zinc-400 hover:text-white border border-white/[0.04] transition-all"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/10 hover:border-rose-500/20 transition-all"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Create Team Modal Dialog */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
          <div className="bg-[#0c0c10] border border-white/[0.08] rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-slide-up flex flex-col gap-4">
            <div>
              <span className="text-[9px] font-bold text-indigo-400 tracking-widest uppercase block mb-1">Create Workspace</span>
              <h2 className="text-lg font-bold text-white tracking-tight">Create a Team Workspace</h2>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                Organize work with collaborators. Assign tasks, track progress, and trigger AI hand-offs natively.
              </p>
            </div>
            
            <form onSubmit={handleCreateTeamSubmit} className="flex flex-col gap-4">
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="Workspace Name (e.g. Acme Dev Team)"
                className="w-full bg-[#050507] border border-white/[0.05] rounded-xl px-3.5 py-2.5 text-xs text-[#ededef] placeholder:text-[#444455] focus:outline-none focus:border-[#5c68ff] transition-all"
                required
                autoFocus
              />
              <div className="flex gap-2 justify-end text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-white/[0.05] text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !newTeamName.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl transition-all"
                >
                  {loading ? 'Creating...' : 'Create Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
