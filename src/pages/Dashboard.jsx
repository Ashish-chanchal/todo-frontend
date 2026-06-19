import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import Form from '../components/Form';
import TodosList from '../components/TodosLIst';
import ChatFeed from '../components/ChatFeed';
import NLInput from '../components/NLInput';
import ActivityTimeline from '../components/ActivityTimeline';
import ApprovalGate from '../components/ApprovalGate';
import CommitmentCard from '../components/CommitmentCard';
import Settings from './Settings';
import TimelineView from '../components/TimelineView';
import UpgradeModal from '../components/UpgradeModal';
import { 
  Sparkles, 
  LayoutGrid, 
  Settings as SettingsIcon, 
  MessageSquare, 
  BrainCircuit,
  Zap,
  Clock,
  ListTodo,
  CheckCircle,
  AlertCircle,
  Workflow
} from 'lucide-react';
import { cn } from '../lib/utils';

function Dashboard() {
  const { token, user } = useAuth();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'board', 'settings'

  const handleFetchResponse = async (res) => {
    if (res.status === 402 || res.status === 403) {
      const data = await res.json();
      setChatMessages(prev => [...prev, { 
        sender: 'agent', 
        text: `⚠️ Limit Hit: ${data.msg || 'This feature requires a premium plan.'}` 
      }]);
      setIsUpgradeModalOpen(true);
      return false;
    }
    return true;
  };
  const [todos, setTodos] = useState([]);
  const [commitments, setCommitments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNegotiationGate, setShowNegotiationGate] = useState(true);
  const [negotiationData, setNegotiationData] = useState(null);

  // Simulator state
  const [simText, setSimText] = useState('');
  const [simSource, setSimSource] = useState('slack');
  const [simLoading, setSimLoading] = useState(false);
  const [simMessage, setSimMessage] = useState('');
  
  // Chat state
  const [chatMessages, setChatMessages] = useState([
    { sender: 'agent', text: "Hello! I am your TodoAI Assistant. You can speak to me in natural language to list, create, complete, or delete tasks. Try typing 'Summarize my day' to get started!", confidence: 1.0 }
  ]);
  const [chatStreaming, setChatStreaming] = useState(false);
  
  // Agent timeline logs state
  const [activityLogs, setActivityLogs] = useState([
    { action: "Initialized TodoAI Workspace", time: new Date().toLocaleTimeString(), type: "create" }
  ]);

  const fetchNegotiation = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/negotiate`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNegotiationData(data.conflictData);
      }
    } catch (err) {
      console.error('Fetch negotiation error:', err);
    }
  };

  const fetchTodos = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/todos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!(await handleFetchResponse(response))) return;
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos);
        fetchNegotiation();
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCommitments = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/commitments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setCommitments(data.commitments);
      }
    } catch (err) {
      console.error('Fetch commitments error:', err);
    }
  };

  useEffect(() => {
    fetchTodos();
    fetchCommitments();
    fetchNegotiation();
  }, [token]);

  const addLog = (action, type = 'create') => {
    setActivityLogs(prev => [
      { action, time: new Date().toLocaleTimeString(), type },
      ...prev
    ]);
  };

  const handleMakeComplete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/completed`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (!(await handleFetchResponse(res))) return;
      if (res.ok) {
        const data = await res.json();
        addLog(`Completed: ${data.todo?.title || 'task'}`, 'complete');
        fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const todoToDelete = todos.find(t => t._id === id);
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      if (!(await handleFetchResponse(res))) return;
      if (res.ok) {
        addLog(`Deleted: ${todoToDelete?.title || 'task'}`, 'delete');
        fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // AI Command processing
  const handleSendChatMessage = async (text) => {
    setChatMessages(prev => [...prev, { sender: 'user', text }]);
    setChatStreaming(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/command`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text })
      });

      if (!(await handleFetchResponse(response))) {
        setChatStreaming(false);
        return;
      }

      const data = await response.json();
      if (response.ok) {
        setChatMessages(prev => [...prev, { 
          sender: 'agent', 
          text: data.reply,
          confidence: data.confidence 
        }]);

        if (data.type === 'create') {
          addLog(`AI created task: ${data.todo?.title}`, 'create');
          fetchTodos();
        } else if (data.type === 'complete') {
          addLog(`AI completed task`, 'complete');
          fetchTodos();
        } else if (data.type === 'delete') {
          addLog(`AI deleted task`, 'delete');
          fetchTodos();
        }
      } else {
        setChatMessages(prev => [...prev, { 
          sender: 'agent', 
          text: "I encountered an error trying to process that instruction." 
        }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setChatMessages(prev => [...prev, { 
        sender: 'agent', 
        text: "I couldn't reach the AI engine. Please ensure the backend is running." 
      }]);
    } finally {
      setChatStreaming(false);
    }
  };

  // AI Prioritization sort trigger
  const handleAIPrioritize = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/prioritize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setTodos(data.todos);
        addLog("AI re-prioritized task board", "create");
      }
    } catch (err) {
      console.error('Prioritize error:', err);
    }
  };

  const handleAISprintPlan = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/sprint-plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        addLog("AI Sprint Planner organized tasks", "create");
        fetchTodos();
      }
    } catch (err) {
      console.error('Sprint planner error:', err);
    }
  };

  // Commitment addition/resolution
  const handleAddCommitment = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/commitments/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, action: 'add' })
      });
      if (res.ok) {
        const data = await res.json();
        addLog(`Commitment added: ${data.todo?.title}`, 'create');
        fetchCommitments();
        fetchTodos();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleIgnoreCommitment = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/commitments/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, action: 'ignore' })
      });
      if (res.ok) {
        addLog(`Ignored commitment notification`, 'delete');
        fetchCommitments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Simulate Slack/Email inputs
  const handleSimulate = async (e) => {
    e.preventDefault();
    if (!simText.trim()) return;
    
    setSimLoading(true);
    setSimMessage('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/detect-commitment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: simText,
          source: simSource,
          channel: simSource === 'slack' ? '#general' : 'Inbox'
        })
      });
      const data = await res.json();
      if (res.ok) {
        if (data.hasCommitment) {
          setSimMessage('Added to Commitment Net!');
          setSimText('');
          fetchCommitments();
        } else {
          setSimMessage('No commitment found in message.');
        }
      }
    } catch (err) {
      setSimMessage('Connection error.');
    } finally {
      setSimLoading(false);
    }
  };

  // Calculate dynamic schedule conflicts (todos due tomorrow)
  const getConflictTasks = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    return todos.filter(todo => {
      if (todo.completed || !todo.dueDate) return false;
      const todoDateStr = new Date(todo.dueDate).toISOString().split('T')[0];
      return todoDateStr === dateStr;
    });
  };

  // Apply schedule negotiation option choices
  const handleApplyNegotiationOption = async (actions, title) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BACKEND_URI}/ai/negotiate/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ actions })
      });
      if (res.ok) {
        addLog(`Applied AI Rescheduler: ${title}`, 'complete');
        fetchTodos();
      }
    } catch (err) {
      console.error('Failed to apply negotiation option:', err);
    }
  };

  const handleUndoAllLogs = () => {
    setActivityLogs([]);
  };

  const conflictTasks = getConflictTasks();

  return (
    <div className="h-screen w-screen bg-[#08080a] text-zinc-100 flex overflow-hidden font-sans select-none antialiased relative">
      {/* Background patterns */}
      <div className="absolute top-[10%] right-[10%] w-[35rem] h-[35rem] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none animate-float-2 z-0" />
      <div className="absolute bottom-[-10%] left-[10%] w-[30rem] h-[30rem] bg-violet-600/5 rounded-full blur-[130px] pointer-events-none animate-float-1 z-0" />

      {/* Docked Left Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-white/[0.05] bg-[#0c0c10]/80 backdrop-blur-xl flex flex-col justify-between h-full z-10">
        
        {/* Top Header Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/[0.05]">
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-md shadow-indigo-500/10">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            Todo<span className="text-indigo-400">AI</span>
          </span>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-4 custom-scrollbar">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-zinc-500 px-3 tracking-widest uppercase mb-1">Workspaces</span>
            
            <button
              onClick={() => setActiveTab('chat')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 relative overflow-hidden border border-transparent",
                activeTab === 'chat' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              )}
            >
              {activeTab === 'chat' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/[0.03] border border-white/[0.05] rounded-xl -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Assistant</span>
              </div>
              <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20 font-bold uppercase tracking-wider">Live</span>
            </button>

            <button
              onClick={() => setActiveTab('board')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 relative overflow-hidden border border-transparent",
                activeTab === 'board' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              )}
            >
              {activeTab === 'board' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/[0.03] border border-white/[0.05] rounded-xl -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-3.5 h-3.5 text-zinc-400" />
                <span>Kanban Board</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 relative overflow-hidden border border-transparent",
                activeTab === 'timeline' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              )}
            >
              {activeTab === 'timeline' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/[0.03] border border-white/[0.05] rounded-xl -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2.5">
                <Workflow className="w-3.5 h-3.5 text-zinc-400" />
                <span>Gantt Timeline</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-150 relative overflow-hidden border border-transparent",
                activeTab === 'settings' ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white hover:bg-white/[0.02]'
              )}
            >
              {activeTab === 'settings' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 bg-white/[0.03] border border-white/[0.05] rounded-xl -z-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-2.5">
                <SettingsIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>Settings</span>
              </div>
            </button>
          </div>

          {/* Quick Metrics Progress bar */}
          <div className="border-t border-white/[0.04] pt-4 px-3 flex flex-col gap-2.5">
            <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Velocity</span>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-zinc-400">Completion</span>
              <span className="text-indigo-400 font-bold font-mono">
                {todos.length > 0 
                  ? Math.round((todos.filter(t => t.completed).length / todos.length) * 100) 
                  : 0}%
              </span>
            </div>
            <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
              <motion.div 
                className="bg-indigo-500 h-full shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                initial={{ width: 0 }}
                animate={{ 
                  width: `${todos.length > 0 
                    ? (todos.filter(t => t.completed).length / todos.length) * 100 
                    : 0}%` 
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Integration Simulator */}
          <div className="border-t border-white/[0.04] pt-4 px-3 flex flex-col gap-3">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Lab Simulator</span>
            </div>
            <form onSubmit={handleSimulate} className="flex flex-col gap-2.5">
              <textarea
                value={simText}
                onChange={(e) => setSimText(e.target.value)}
                placeholder="Commitment text: 'I will write tests tomorrow'..."
                rows={2}
                className="w-full bg-zinc-950/70 border border-white/[0.05] focus:border-indigo-500/30 rounded-lg px-2.5 py-2 text-[10px] text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all resize-none leading-relaxed"
                required
              />
              <button
                type="submit"
                disabled={simLoading}
                className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-xl py-1.5 font-bold text-[10px] transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {simLoading ? 'Parsing...' : 'Simulate Message'}
              </button>
            </form>
            {simMessage && (
              <motion.p 
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[9px] text-indigo-400 font-medium leading-relaxed bg-indigo-500/5 p-2 rounded-lg border border-indigo-500/10 font-mono"
              >
                {simMessage}
              </motion.p>
            )}
          </div>
        </div>

        {/* Footer Info / Version */}
        <div className="p-4 border-t border-white/[0.04] text-center text-[9px] text-zinc-600 font-mono">
          TodoAI Console v1.0.0
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden z-10">
        
        {/* Docked Pinned Header */}
        <NavBar onOpenSettings={() => setActiveTab('settings')} activeTab={activeTab} />

        {/* Center Workspace Body Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* Main Content Pane */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar bg-[#08080a]">
            <AnimatePresence mode="wait">
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-6 max-w-4xl mx-auto h-full justify-between"
                >
                  {/* Unified Header Card */}
                  <div className="glass-panel rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
                    <div>
                      <h2 className="text-md font-bold text-white">Interactive Assistant</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Command workspace tasks using natural language speech</p>
                    </div>
                    <div className="flex gap-2 items-center bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" />
                      <span className="text-[9px] text-emerald-400 font-mono font-bold uppercase tracking-wider">SSE Active</span>
                    </div>
                  </div>

                  {/* Main Chat Feed Box */}
                  <div className="glass-panel rounded-2xl flex flex-col justify-between flex-1 min-h-[400px] overflow-hidden">
                    <ChatFeed messages={chatMessages} streaming={chatStreaming} />
                    <NLInput onSendMessage={handleSendChatMessage} disabled={chatStreaming} />
                  </div>
                </motion.div>
              )}

              {activeTab === 'board' && (
                <motion.div
                  key="board"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-6"
                >
                  <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
                    <div>
                      <h2 className="text-md font-bold text-white">Workspace Checklist</h2>
                      <p className="text-xs text-zinc-400 mt-0.5">Clean status boards, dynamic prioritize actions</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAIPrioritize}
                        className="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-full px-4 py-2.5 font-bold flex items-center gap-1.5 transition-all duration-150 active:scale-95 text-xs"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Prioritize
                      </button>
                      <button
                        onClick={handleAISprintPlan}
                        className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 rounded-full px-4 py-2.5 font-bold flex items-center gap-1.5 transition-all duration-150 active:scale-95 text-xs"
                      >
                        <Workflow className="w-3.5 h-3.5 text-purple-400" /> AI Sprint Planner
                      </button>
                    </div>
                  </div>
                  
                  <Form getTodos={fetchTodos} />
                  <TodosList todos={todos} makeComplete={handleMakeComplete} deleteTodo={handleDeleteTodo} fetchTodos={fetchTodos} />
                </motion.div>
              )}

              {activeTab === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <TimelineView />
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <Settings onBack={() => setActiveTab('chat')} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Right Context sidebar panel - Only rendered on chat tab */}
          {activeTab === 'chat' && (
            <aside className="w-80 border-l border-white/[0.05] bg-[#0c0c10]/40 backdrop-blur-xl flex flex-col gap-6 p-5 overflow-y-auto custom-scrollbar">
              {/* Commitment Detector */}
              <div className="flex flex-col gap-2.5">
                {commitments.length === 0 ? (
                  <div className="glass-panel rounded-2xl p-4 text-center">
                    <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase block mb-1">Commitment Net</span>
                    <p className="text-[10px] text-zinc-600 italic">No active commitments detected.</p>
                  </div>
                ) : (
                  <CommitmentCard 
                    commitments={commitments} 
                    onAdd={handleAddCommitment} 
                    onIgnore={handleIgnoreCommitment} 
                  />
                )}
              </div>

              {/* Schedule Conflict Gate */}
              {showNegotiationGate && negotiationData?.hasConflict && (
                <ApprovalGate 
                  negotiationData={negotiationData} 
                  onApplyOption={handleApplyNegotiationOption}
                  onDismiss={() => setShowNegotiationGate(false)}
                />
              )}

              {/* Activity Timeline */}
              <ActivityTimeline logs={activityLogs} onUndoAll={handleUndoAllLogs} />
            </aside>
          )}

        </div>
      </div>

      <UpgradeModal 
        isOpen={isUpgradeModalOpen} 
        onClose={() => setIsUpgradeModalOpen(false)} 
        token={token} 
        user={user} 
        onUpgradeSuccess={() => {
          fetchTodos();
        }}
      />
    </div>
  );
}

export default Dashboard;
