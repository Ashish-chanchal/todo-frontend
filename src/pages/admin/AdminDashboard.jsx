import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Settings, 
  Zap, 
  ShieldAlert, 
  Database, 
  ArrowLeft, 
  Volume2, 
  Lock, 
  Unlock, 
  Activity,
  CreditCard,
  History,
  Terminal,
  Brain
} from 'lucide-react';
import { cn } from '../../lib/utils';

function AdminDashboard({ onBack }) {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'subscriptions', 'usage', 'ai', 'audit'
  
  // Data lists
  const [users, setUsers] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [usageLogs, setUsageLogs] = useState([]);
  const [aiLogs, setAiLogs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [health, setHealth] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // Announcement broadcast
  const [annText, setAnnText] = useState('');
  const [annMsg, setAnnMsg] = useState('');
  const [annLoading, setAnnLoading] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Fetch stats failed:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/admin/users?q=${searchTerm}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Fetch users failed:', err);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/admin/subscriptions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSubscriptions(data.subscriptions);
      }
    } catch (err) {
      console.error('Fetch subscriptions failed:', err);
    }
  };

  const fetchUsageLogs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/admin/usage`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsageLogs(data.usage);
      }
    } catch (err) {
      console.error('Fetch usage failed:', err);
    }
  };

  const fetchAiLogs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/admin/ai-usage`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAiLogs(data.aiUsage);
      }
    } catch (err) {
      console.error('Fetch AI usage failed:', err);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/admin/audit-logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data.logs);
      }
    } catch (err) {
      console.error('Fetch audit logs failed:', err);
    }
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/admin/health`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHealth(data);
      }
    } catch (err) {
      console.error('Fetch health failed:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchHealth();
  }, [token]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    else if (activeTab === 'subscriptions') fetchSubscriptions();
    else if (activeTab === 'usage') fetchUsageLogs();
    else if (activeTab === 'ai') fetchAiLogs();
    else if (activeTab === 'audit') fetchAuditLogs();
  }, [token, activeTab, searchTerm]);

  const toggleSuspended = async (userId, currentSuspended) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ suspended: !currentSuspended })
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to update suspension:', err);
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!annText.trim()) return;
    setAnnLoading(true);
    setAnnMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/admin/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: annText })
      });
      const data = await res.json();
      if (res.ok) {
        setAnnMsg(`✅ ${data.msg}`);
        setAnnText('');
      } else {
        setAnnMsg(`❌ ${data.msg || 'Broadcast failed'}`);
      }
    } catch (err) {
      setAnnMsg('Connection failed');
    } finally {
      setAnnLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#ededef] p-6 lg:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#88889c] hover:text-[#ededef] mb-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Workspace
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
        </div>

        {/* Stats card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#121216]/60 border border-white/[0.04] rounded-2xl p-4 shadow-sm backdrop-blur-xl">
            <span className="text-[10px] font-bold text-[#555566] tracking-widest uppercase block">Monthly Revenue</span>
            <span className="text-xl font-bold text-[#ededef] mt-1 block">${stats?.mrr || 0} MRR</span>
            <span className="text-[10px] text-emerald-400 mt-1 block">Live subscriptions valuation</span>
          </div>

          <div className="bg-[#121216]/60 border border-white/[0.04] rounded-2xl p-4 shadow-sm backdrop-blur-xl">
            <span className="text-[10px] font-bold text-[#555566] tracking-widest uppercase block">Active Subscribers</span>
            <span className="text-xl font-bold text-[#ededef] mt-1 block">{stats?.activeSubscribers || 0} users</span>
            <span className="text-[10px] text-[#88889c] mt-1 block">{stats?.freeUsers || 0} free tier members</span>
          </div>

          <div className="bg-[#121216]/60 border border-white/[0.04] rounded-2xl p-4 shadow-sm backdrop-blur-xl">
            <span className="text-[10px] font-bold text-[#555566] tracking-widest uppercase block">Workspace Tasks</span>
            <span className="text-xl font-bold text-[#ededef] mt-1 block">{stats?.totalTodos || 0} issues</span>
            <span className="text-[10px] text-indigo-400 mt-1 block">{stats?.completedTodos || 0} completed checklist items</span>
          </div>

          <div className="bg-[#121216]/60 border border-white/[0.04] rounded-2xl p-4 shadow-sm backdrop-blur-xl">
            <span className="text-[10px] font-bold text-[#555566] tracking-widest uppercase block">MCP Call Volume</span>
            <span className="text-xl font-bold text-[#ededef] mt-1 block">{stats?.mcpCallVolume || 0} calls</span>
            <span className="text-[10px] text-indigo-400 mt-1 block">API key routing metrics</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Dynamic Left Panel with sub-tab controls */}
          <div className="lg:col-span-2 bg-[#121216]/60 border border-white/[0.04] rounded-2xl p-5 shadow-sm backdrop-blur-xl flex flex-col gap-6">
            
            {/* Tabs Controller */}
            <div className="flex flex-wrap gap-1.5 bg-[#08080a] border border-white/[0.05] p-1 rounded-xl">
              {[
                { id: 'users', label: 'Users', icon: Users },
                { id: 'subscriptions', label: 'Billing Plans', icon: CreditCard },
                { id: 'usage', label: 'API/MCP Usage', icon: Terminal },
                { id: 'ai', label: 'AI Token Cost', icon: Brain },
                { id: 'audit', label: 'Audit Trail', icon: History }
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearchTerm('');
                    }}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      isSelected 
                        ? "bg-[#1f1f26] text-white border border-white/[0.06] shadow-sm"
                        : "text-[#88889c] hover:text-white"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB BODY CONTENTS */}
            <div className="flex-1 min-h-[300px]">
              
              {/* Tab 1: Users */}
              {activeTab === 'users' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center gap-4">
                    <h2 className="text-sm font-semibold text-[#ededef]">Manage Users</h2>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search email/name..."
                      className="bg-[#08080a] border border-white/[0.06] rounded-lg px-2.5 py-1 text-xs text-[#ededef] placeholder:text-[#444455] focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.03] text-[#555566] font-bold uppercase tracking-wider">
                          <th className="py-2.5">User</th>
                          <th className="py-2.5">Tier</th>
                          <th className="py-2.5">Role</th>
                          <th className="py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-white/[0.01]">
                            <td className="py-3 pr-2">
                              <span className="font-semibold text-[#ededef] block">{u.name}</span>
                              <span className="text-[#6b6b80] block font-mono text-[10px]">{u.email}</span>
                            </td>
                            <td className="py-3">
                              <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                                u.tier === 'business' ? 'bg-[#5c68ff]/10 text-[#a3a8ff]' :
                                u.tier === 'pro' ? 'bg-amber-500/10 text-[#fef3c7]' : 'bg-[#121216] border border-white/[0.05] text-[#88889c]'
                              }`}>
                                {u.tier}
                              </span>
                            </td>
                            <td className="py-3 text-[#c9cdd6] capitalize">{u.role}</td>
                            <td className="py-3 text-right">
                              <button
                                onClick={() => toggleSuspended(u._id, u.suspended)}
                                className={`p-1.5 rounded-lg border transition-all ${
                                  u.suspended 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' 
                                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                                }`}
                                title={u.suspended ? 'Unlock account' : 'Suspend account'}
                              >
                                {u.suspended ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 2: Subscriptions */}
              {activeTab === 'subscriptions' && (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-[#ededef]">Plans & Subscriptions</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.03] text-[#555566] font-bold uppercase tracking-wider">
                          <th className="py-2.5">User</th>
                          <th className="py-2.5">Tier</th>
                          <th className="py-2.5">Period End</th>
                          <th className="py-2.5 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {subscriptions.map((sub) => (
                          <tr key={sub._id} className="hover:bg-white/[0.01]">
                            <td className="py-3 pr-2">
                              <span className="font-semibold text-[#ededef] block">{sub.userId?.name || 'Deleted User'}</span>
                              <span className="text-[#6b6b80] block font-mono text-[10px]">{sub.userId?.email || 'N/A'}</span>
                            </td>
                            <td className="py-3">
                              <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[9px] bg-indigo-500/10 text-indigo-400">
                                {sub.tier}
                              </span>
                            </td>
                            <td className="py-3 text-[#c9cdd6]">
                              {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="py-3 text-right">
                              <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[9px] ${
                                sub.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                              }`}>
                                {sub.status || 'free'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: API/MCP Usage */}
              {activeTab === 'usage' && (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-[#ededef]">API & MCP Call Volumes</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.03] text-[#555566] font-bold uppercase tracking-wider">
                          <th className="py-2.5">User</th>
                          <th className="py-2.5">Date</th>
                          <th className="py-2.5">API Calls</th>
                          <th className="py-2.5 text-right">MCP Calls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {usageLogs.map((log) => (
                          <tr key={log._id} className="hover:bg-white/[0.01]">
                            <td className="py-3 pr-2">
                              <span className="font-semibold text-[#ededef] block">{log.userId?.name || 'System / Sandbox'}</span>
                              <span className="text-[#6b6b80] block font-mono text-[10px]">{log.userId?.email || 'N/A'}</span>
                            </td>
                            <td className="py-3 text-[#c9cdd6] font-mono">{log.date}</td>
                            <td className="py-3 text-indigo-400 font-mono font-bold">{log.apiCalls || 0}</td>
                            <td className="py-3 text-right text-rose-400 font-mono font-bold">{log.mcpCalls || 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 4: AI Token Cost */}
              {activeTab === 'ai' && (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-[#ededef]">AI Token Consumption</h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.03] text-[#555566] font-bold uppercase tracking-wider">
                          <th className="py-2.5">User</th>
                          <th className="py-2.5">Date</th>
                          <th className="py-2.5">Tokens Consumed</th>
                          <th className="py-2.5 text-right">Est. Cost ($)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.03]">
                        {aiLogs.map((log) => (
                          <tr key={log._id} className="hover:bg-white/[0.01]">
                            <td className="py-3 pr-2">
                              <span className="font-semibold text-[#ededef] block">{log.userId?.name || 'System / Sandbox'}</span>
                              <span className="text-[#6b6b80] block font-mono text-[10px]">{log.userId?.email || 'N/A'}</span>
                            </td>
                            <td className="py-3 text-[#c9cdd6] font-mono">{log.date}</td>
                            <td className="py-3 text-amber-400 font-mono font-bold">{log.aiTokens || 0}</td>
                            <td className="py-3 text-right font-mono text-neutral-400">
                              ${((log.aiTokens || 0) * 0.000002).toFixed(4)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 5: Audit Trail */}
              {activeTab === 'audit' && (
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold text-[#ededef]"> Chronological Audit Trail</h2>
                  
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {auditLogs.map((log) => (
                      <div key={log._id} className="p-3.5 bg-black/30 border border-white/[0.03] rounded-xl text-xs space-y-1.5 hover:border-white/[0.06] transition-all">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-indigo-400 font-mono text-[9px] uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">
                            {log.action}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-neutral-300">
                          Actor: <span className="font-semibold text-white">{log.userId?.name || 'System'}</span> ({log.userId?.email || 'System'})
                        </div>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <pre className="p-2 bg-black/60 border border-white/[0.04] rounded-lg text-[10px] font-mono text-neutral-400 overflow-x-auto leading-relaxed">
                            {JSON.stringify(log.metadata, null, 2)}
                          </pre>
                        )}
                        <div className="text-[9px] text-[#555566] flex justify-between font-mono">
                          <span>IP: {log.ip || '127.0.0.1'}</span>
                          <span className="truncate max-w-[200px]" title={log.userAgent}>UA: {log.userAgent || 'Unknown'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right block: Health checks and Announcements */}
          <div className="flex flex-col gap-6">
            
            {/* System Health Monitor */}
            <div className="bg-[#121216]/60 border border-white/[0.04] rounded-2xl p-5 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-[#5c68ff]" />
                <h2 className="text-sm font-semibold text-[#ededef]">System Health</h2>
              </div>
              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#88889c]">Connection status</span>
                  <span className="text-emerald-400 font-bold uppercase flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" /> MONGODB CONNECTED
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#88889c]">Server Uptime</span>
                  <span className="font-mono text-[#ededef]">{Math.round(health?.uptime || 0)}s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#88889c]">Memory usage</span>
                  <span className="font-mono text-[#ededef]">
                    {health?.memory ? Math.round(health.memory.usage * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Broadcast Center */}
            <div className="bg-[#121216]/60 border border-white/[0.04] rounded-2xl p-5 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-3">
                <Volume2 className="w-4 h-4 text-[#5c68ff]" />
                <h2 className="text-sm font-semibold text-[#ededef]">Broadcast Announcement</h2>
              </div>
              <p className="text-[11px] text-[#88889c] mb-4">
                Send a global announcement notification to all user workspaces.
              </p>
              <form onSubmit={handleBroadcast} className="flex flex-col gap-2">
                <textarea
                  value={annText}
                  onChange={(e) => setAnnText(e.target.value)}
                  placeholder="Enter notification text..."
                  rows={3}
                  className="w-full bg-[#08080a] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-[#ededef] placeholder:text-[#444455] focus:outline-none focus:border-indigo-500/50"
                  required
                />
                <button
                  type="submit"
                  disabled={annLoading}
                  className="bg-[#5c68ff] hover:bg-[#4b56df] text-white rounded-lg py-1.5 font-semibold text-xs transition-all disabled:opacity-50"
                >
                  {annLoading ? 'Sending...' : 'Broadcast'}
                </button>
              </form>
              {annMsg && (
                <p className="text-[10px] text-[#ededef] font-semibold bg-[#1b1b24] p-2 rounded-lg border border-white/[0.03] mt-2">
                  {annMsg}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
