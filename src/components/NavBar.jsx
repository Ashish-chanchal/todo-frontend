import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Settings, Sparkles, FolderKanban } from 'lucide-react';

function NavBar({ onOpenSettings, activeTab }) {
  const { user, logout, isAuthenticated } = useAuth();

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'chat': return 'AI Assistant';
      case 'board': return 'Kanban Board';
      case 'timeline': return 'Gantt Timeline';
      case 'settings': return 'Settings';
      default: return 'console';
    }
  };

  return (
    <nav className="h-16 w-full px-6 border-b border-white/[0.05] bg-[#0c0c10]/45 backdrop-blur-md flex items-center justify-between z-30">
      {/* Left side: Breadcrumb path */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 select-none">
        <FolderKanban className="w-3.5 h-3.5 text-zinc-500" />
        <span className="font-mono text-[9px] text-zinc-600">WORKSPACE</span>
        <span className="text-zinc-600">/</span>
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
    </nav>
  );
}

export default NavBar;
