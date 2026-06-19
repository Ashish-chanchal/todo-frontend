import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Mail, 
  Brain, 
  Cpu, 
  ShieldCheck, 
  ShieldAlert, 
  Database, 
  Calendar, 
  Terminal, 
  Play, 
  RotateCcw,
  Sparkles,
  Workflow,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';

export function AIFlow() {
  const [activePreset, setActivePreset] = useState(0);
  const [activeStep, setActiveStep] = useState(null); // null, 'source', 'classifier', 'extractor', 'conflict', 'dispatch'
  const [logs, setLogs] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const consoleContainerRef = useRef(null);

  const presets = [
    {
      label: "Conversational Chat Feed",
      source: "chat",
      text: "Draft UI redesign proposal and sync with team tomorrow at 2 PM",
      intent: "CREATE_TASK",
      extracted: { title: "Draft UI redesign proposal", date: "Tomorrow 2:00 PM", priority: "Medium" },
      conflict: "No conflict. tomorrow. load: 2.0h/6.0h (safe)",
      targets: ["db", "calendar"]
    },
    {
      label: "Slack Scraped Message",
      source: "slack",
      text: "Hey! I will fix the Mongoose connection timeout issue before Friday 10 AM",
      intent: "CREATE_TASK",
      extracted: { title: "Fix Mongoose connection timeout issue", date: "Friday 10:00 AM", priority: "High" },
      conflict: "No conflict. Friday load: 1.5h/6.0h (safe)",
      targets: ["db", "slack", "calendar", "mcp"]
    },
    {
      label: "Email Client Parser",
      source: "email",
      text: "Please review the billing webhook limits check by Thursday at 5 PM",
      intent: "CREATE_TASK",
      extracted: { title: "Review billing webhook limits check", date: "Thursday 5:00 PM", priority: "High" },
      conflict: "Warning: Overload tomorrow! Re-negotiating tasks.",
      targets: ["db", "slack", "mcp"]
    }
  ];

  const currentPreset = presets[activePreset];

  const addLog = (text, type = 'info') => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs((prev) => [...prev, { time, text, type }]);
  };

  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [logs]);

  useEffect(() => {
    if (!isRunning) return;

    let timer;
    
    if (activeStep === 'source') {
      addLog(`[INGESTION] Received event from: ${currentPreset.label.toUpperCase()}`, 'info');
      addLog(`> "${currentPreset.text}"`, 'prompt');
      timer = setTimeout(() => {
        setActiveStep('classifier');
      }, 1500);
    }
    else if (activeStep === 'classifier') {
      addLog(`[INTENT CLASSIFIER] Routing conversational input...`, 'info');
      timer = setTimeout(() => {
        addLog(`-> Classified intent: ${currentPreset.intent} (Confidence: 99.8%)`, 'success');
        setActiveStep('extractor');
      }, 1500);
    }
    else if (activeStep === 'extractor') {
      addLog(`[LLM PARSER] Running semantic context extraction...`, 'info');
      timer = setTimeout(() => {
        addLog(`-> Extracted Parameters:`, 'info');
        addLog(`   * Title: "${currentPreset.extracted.title}"`, 'success');
        addLog(`   * Date: ${currentPreset.extracted.date}`, 'success');
        addLog(`   * Priority: ${currentPreset.extracted.priority}`, 'success');
        setActiveStep('conflict');
      }, 1800);
    }
    else if (activeStep === 'conflict') {
      addLog(`[CONFLICT GUARD] Checking calendar capacity loads...`, 'info');
      timer = setTimeout(() => {
        if (currentPreset.conflict.includes("Warning")) {
          addLog(`[WARNING] Tomorrow capacity exceeded 6.0h limit!`, 'warning');
          addLog(`-> AI Rescheduler negotiated: Delayed low priority "Review backlog details" to next Monday.`, 'warning');
        } else {
          addLog(`[OK] Calendar load safe. ${currentPreset.conflict}`, 'success');
        }
        setActiveStep('dispatch');
      }, 1800);
    }
    else if (activeStep === 'dispatch') {
      addLog(`[ORCHESTRATOR] Dispatching task side-effects...`, 'info');
      timer = setTimeout(() => {
        if (currentPreset.targets.includes("db")) addLog(`-> MongoDB: Saved task successfully.`, 'success');
        if (currentPreset.targets.includes("slack")) addLog(`-> Slack Webhook: Dispatched alert to #development.`, 'success');
        if (currentPreset.targets.includes("calendar")) addLog(`-> Calendar: Appended .ics subscription feed.`, 'success');
        if (currentPreset.targets.includes("mcp")) addLog(`-> MCP SDK: Synced Claude Desktop and Cursor boards.`, 'success');
        addLog(`[SUCCESS] AI pipeline run complete. Standby.`, 'success');
        setIsRunning(false);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [activeStep, isRunning, activePreset]);

  const handleStart = () => {
    setLogs([]);
    setIsRunning(true);
    setActiveStep('source');
    addLog("Initializing pipeline telemetry...", "info");
  };

  const handleReset = () => {
    setIsRunning(false);
    setActiveStep(null);
    setLogs([]);
  };

  return (
    <div className="glass-panel rounded-3xl p-6 lg:p-8 backdrop-blur-md relative overflow-hidden shadow-2xl">
      {/* Background spotlights */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="flex flex-col xl:flex-row gap-8 relative z-10">
        
        {/* Left Column: Preset triggers & status */}
        <div className="w-full xl:w-[32%] flex flex-col justify-between border-b xl:border-b-0 xl:border-r border-white/[0.05] pb-6 xl:pb-0 xl:pr-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Pipeline Controller
            </div>

            <h3 className="text-lg font-bold text-white leading-tight">Autonomous AI Flow</h3>
            <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
              Test how connected applications feed text inputs into the intelligence pipeline to schedule items, resolve capacity bounds, and push sync commands.
            </p>

            {/* Presets Grid */}
            <div className="mt-6 space-y-3">
              {presets.map((preset, idx) => {
                const isActive = activePreset === idx;
                return (
                  <button
                    key={idx}
                    disabled={isRunning}
                    onClick={() => {
                      setActivePreset(idx);
                      handleReset();
                    }}
                    className={cn(
                      "w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3 relative overflow-hidden",
                      isActive 
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-white shadow-md' 
                        : 'bg-zinc-900/30 border-white/[0.04] text-zinc-400 hover:border-white/10 hover:text-white'
                    )}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activePresetGlow"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <div className={cn(
                      "p-2 rounded-xl border mt-0.5",
                      isActive ? 'bg-indigo-500/20 border-indigo-500/20 text-indigo-300' : 'bg-zinc-950 border-white/[0.05] text-zinc-500'
                    )}>
                      {preset.source === 'chat' && <MessageSquare className="w-4 h-4" />}
                      {preset.source === 'slack' && (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H6.303a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.043zm10.135 3.762a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.762 10.135a2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522v5.043a2.528 2.528 0 0 1-2.52 2.52h-5.043z" />
                        </svg>
                      )}
                      {preset.source === 'email' && <Mail className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold flex items-center justify-between">
                        {preset.label}
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1 italic font-mono line-clamp-1">
                        "{preset.text}"
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleStart}
              disabled={isRunning}
              className="flex-1 bg-gradient-to-r from-white to-zinc-200 hover:from-zinc-200 hover:to-zinc-300 text-black font-bold text-xs py-3 rounded-full flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-45 shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-black" /> Ingest & Process
            </button>
            <button
              onClick={handleReset}
              className="px-4 border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white rounded-full flex items-center justify-center transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Visual Canvas & Terminal Logs */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* SVG Canvas overlay */}
          <div className="relative bg-zinc-950/40 border border-white/[0.04] rounded-3xl h-[450px] p-6 hidden md:block overflow-hidden">
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

            {/* SVG Connecting Paths */}
            <svg 
              viewBox="0 0 1000 500" 
              className="absolute inset-0 w-full h-full pointer-events-none z-0" 
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="activeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Path 1: Chat Source to Classifier */}
              <motion.path
                d="M 120,100 L 500,100"
                fill="none"
                stroke={activeStep && currentPreset.source === 'chat' ? 'url(#activeGrad)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={activeStep && currentPreset.source === 'chat' ? 3.5 : 1.5}
                initial={{ pathLength: 0.1 }}
                animate={{ pathLength: activeStep && currentPreset.source === 'chat' ? 1 : 0.1 }}
                transition={{ duration: 0.8 }}
                filter={activeStep && currentPreset.source === 'chat' ? 'url(#glow)' : 'none'}
              />

              {/* Path 2: Slack Source to Classifier */}
              <motion.path
                d="M 120,250 C 300,250 300,100 500,100"
                fill="none"
                stroke={activeStep && currentPreset.source === 'slack' ? 'url(#activeGrad)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={activeStep && currentPreset.source === 'slack' ? 3.5 : 1.5}
                initial={{ pathLength: 0.1 }}
                animate={{ pathLength: activeStep && currentPreset.source === 'slack' ? 1 : 0.1 }}
                transition={{ duration: 0.8 }}
                filter={activeStep && currentPreset.source === 'slack' ? 'url(#glow)' : 'none'}
              />

              {/* Path 3: Email Source to Classifier */}
              <motion.path
                d="M 120,400 C 300,400 300,100 500,100"
                fill="none"
                stroke={activeStep && currentPreset.source === 'email' ? 'url(#activeGrad)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={activeStep && currentPreset.source === 'email' ? 3.5 : 1.5}
                initial={{ pathLength: 0.1 }}
                animate={{ pathLength: activeStep && currentPreset.source === 'email' ? 1 : 0.1 }}
                transition={{ duration: 0.8 }}
                filter={activeStep && currentPreset.source === 'email' ? 'url(#glow)' : 'none'}
              />

              {/* Path 4: Classifier to Extractor */}
              <motion.path
                d="M 500,100 L 500,250"
                fill="none"
                stroke={['classifier', 'extractor', 'conflict', 'dispatch'].includes(activeStep) ? 'url(#activeGrad)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={['classifier', 'extractor', 'conflict', 'dispatch'].includes(activeStep) ? 3.5 : 1.5}
                initial={{ pathLength: 0.1 }}
                animate={{ pathLength: ['classifier', 'extractor', 'conflict', 'dispatch'].includes(activeStep) ? 1 : 0.1 }}
                transition={{ duration: 0.8 }}
                filter={['classifier', 'extractor', 'conflict', 'dispatch'].includes(activeStep) ? 'url(#glow)' : 'none'}
              />

              {/* Path 5: Extractor to Conflict Guard */}
              <motion.path
                d="M 500,250 L 500,400"
                fill="none"
                stroke={['extractor', 'conflict', 'dispatch'].includes(activeStep) ? 'url(#activeGrad)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={['extractor', 'conflict', 'dispatch'].includes(activeStep) ? 3.5 : 1.5}
                initial={{ pathLength: 0.1 }}
                animate={{ pathLength: ['extractor', 'conflict', 'dispatch'].includes(activeStep) ? 1 : 0.1 }}
                transition={{ duration: 0.8 }}
                filter={['extractor', 'conflict', 'dispatch'].includes(activeStep) ? 'url(#glow)' : 'none'}
              />

              {/* Path 6: Conflict Guard to MongoDB */}
              <motion.path
                d="M 500,400 C 700,400 700,75 880,75"
                fill="none"
                stroke={activeStep === 'dispatch' && currentPreset.targets.includes('db') ? 'url(#activeGrad)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={activeStep === 'dispatch' && currentPreset.targets.includes('db') ? 3.5 : 1.5}
                initial={{ pathLength: 0.1 }}
                animate={{ pathLength: activeStep === 'dispatch' && currentPreset.targets.includes('db') ? 1 : 0.1 }}
                transition={{ duration: 0.8 }}
                filter={activeStep === 'dispatch' && currentPreset.targets.includes('db') ? 'url(#glow)' : 'none'}
              />

              {/* Path 7: Conflict Guard to Slack webhook */}
              <motion.path
                d="M 500,400 C 700,400 700,190 880,190"
                fill="none"
                stroke={activeStep === 'dispatch' && currentPreset.targets.includes('slack') ? 'url(#activeGrad)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={activeStep === 'dispatch' && currentPreset.targets.includes('slack') ? 3.5 : 1.5}
                initial={{ pathLength: 0.1 }}
                animate={{ pathLength: activeStep === 'dispatch' && currentPreset.targets.includes('slack') ? 1 : 0.1 }}
                transition={{ duration: 0.8 }}
                filter={activeStep === 'dispatch' && currentPreset.targets.includes('slack') ? 'url(#glow)' : 'none'}
              />

              {/* Path 8: Conflict Guard to Calendar */}
              <motion.path
                d="M 500,400 C 700,400 700,310 880,310"
                fill="none"
                stroke={activeStep === 'dispatch' && currentPreset.targets.includes('calendar') ? 'url(#activeGrad)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={activeStep === 'dispatch' && currentPreset.targets.includes('calendar') ? 3.5 : 1.5}
                initial={{ pathLength: 0.1 }}
                animate={{ pathLength: activeStep === 'dispatch' && currentPreset.targets.includes('calendar') ? 1 : 0.1 }}
                transition={{ duration: 0.8 }}
                filter={activeStep === 'dispatch' && currentPreset.targets.includes('calendar') ? 'url(#glow)' : 'none'}
              />

              {/* Path 9: Conflict Guard to MCP Server */}
              <motion.path
                d="M 500,400 C 700,400 700,425 880,425"
                fill="none"
                stroke={activeStep === 'dispatch' && currentPreset.targets.includes('mcp') ? 'url(#activeGrad)' : 'rgba(255, 255, 255, 0.04)'}
                strokeWidth={activeStep === 'dispatch' && currentPreset.targets.includes('mcp') ? 3.5 : 1.5}
                initial={{ pathLength: 0.1 }}
                animate={{ pathLength: activeStep === 'dispatch' && currentPreset.targets.includes('mcp') ? 1 : 0.1 }}
                transition={{ duration: 0.8 }}
                filter={activeStep === 'dispatch' && currentPreset.targets.includes('mcp') ? 'url(#glow)' : 'none'}
              />
            </svg>

            {/* === NODES OVERLAY === */}
            
            {/* Sources Column (X: 12%) */}
            <div 
              style={{ left: '12%', top: '20%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-3.5 py-2 rounded-xl border flex items-center gap-2 shadow-sm transition-all duration-300 z-10",
                activeStep && currentPreset.source === 'chat'
                  ? 'bg-indigo-500/10 border-indigo-400 text-white scale-105 ring-1 ring-indigo-500/20'
                  : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Chat Feed</span>
            </div>

            <div 
              style={{ left: '12%', top: '50%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-3.5 py-2 rounded-xl border flex items-center gap-2 shadow-sm transition-all duration-300 z-10",
                activeStep && currentPreset.source === 'slack'
                  ? 'bg-purple-500/10 border-purple-400 text-white scale-105 ring-1 ring-purple-500/20'
                  : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H6.303a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.043zm10.135 3.762a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.762 10.135a2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522v5.043a2.528 2.528 0 0 1-2.52 2.52h-5.043z" />
              </svg>
              <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Slack Msg</span>
            </div>

            <div 
              style={{ left: '12%', top: '80%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-3.5 py-2 rounded-xl border flex items-center gap-2 shadow-sm transition-all duration-300 z-10",
                activeStep && currentPreset.source === 'email'
                  ? 'bg-pink-500/10 border-pink-400 text-white scale-105 ring-1 ring-pink-500/20'
                  : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              <Mail className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-[9px] font-bold uppercase tracking-wider font-mono">Email Sync</span>
            </div>

            {/* AI Processing Engine (X: 50%) */}
            <div 
              style={{ left: '50%', top: '20%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-5 py-3 rounded-2xl border flex flex-col items-center gap-1 shadow-sm transition-all duration-300 z-10 min-w-[160px]",
                activeStep === 'classifier'
                  ? 'bg-indigo-500/10 border-indigo-400 text-white scale-105'
                  : ['extractor', 'conflict', 'dispatch'].includes(activeStep)
                    ? 'bg-zinc-900 border-indigo-500/30 text-indigo-300'
                    : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              <Brain className={cn("w-5 h-5", ['classifier', 'extractor', 'conflict', 'dispatch'].includes(activeStep) ? 'text-indigo-400' : 'text-zinc-600')} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Intent Classifier</span>
              <span className="text-[8px] opacity-60 font-mono">NLP Routing</span>
            </div>

            <div 
              style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-5 py-3 rounded-2xl border flex flex-col items-center gap-1 shadow-sm transition-all duration-300 z-10 min-w-[160px]",
                activeStep === 'extractor'
                  ? 'bg-purple-500/10 border-purple-400 text-white scale-105'
                  : ['conflict', 'dispatch'].includes(activeStep)
                    ? 'bg-zinc-900 border-purple-500/30 text-purple-300'
                    : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              <Cpu className={cn("w-5 h-5", ['extractor', 'conflict', 'dispatch'].includes(activeStep) ? 'text-purple-400 font-bold' : 'text-zinc-600')} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">LLM Extractor</span>
              <span className="text-[8px] opacity-60 font-mono">Gemini-Flash 1.5</span>
            </div>

            <div 
              style={{ left: '50%', top: '80%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-5 py-3 rounded-2xl border flex flex-col items-center gap-1 shadow-sm transition-all duration-300 z-10 min-w-[160px]",
                activeStep === 'conflict'
                  ? 'bg-emerald-500/10 border-emerald-400 text-white scale-105'
                  : activeStep === 'dispatch'
                    ? 'bg-zinc-900 border-emerald-500/30 text-emerald-300'
                    : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              {currentPreset.conflict.includes("Warning") && activeStep === 'conflict' ? (
                <ShieldAlert className="w-5 h-5 text-amber-400 animate-bounce" />
              ) : (
                <ShieldCheck className={cn("w-5 h-5", ['conflict', 'dispatch'].includes(activeStep) ? 'text-emerald-400' : 'text-zinc-600')} />
              )}
              <span className="text-[10px] font-bold uppercase tracking-wider mt-1">Conflict Guard</span>
              <span className="text-[8px] opacity-60 font-mono">Rescheduler negotiation</span>
            </div>

            {/* Outputs Column (X: 88%) */}
            <div 
              style={{ left: '88%', top: '15%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-3.5 py-2 rounded-xl border flex items-center gap-2 shadow-sm transition-all duration-300 z-10",
                activeStep === 'dispatch' && currentPreset.targets.includes('db')
                  ? 'bg-emerald-500/10 border-emerald-400 text-white'
                  : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[9px] font-bold uppercase font-mono">MongoDB</span>
            </div>

            <div 
              style={{ left: '88%', top: '38%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-3.5 py-2 rounded-xl border flex items-center gap-2 shadow-sm transition-all duration-300 z-10",
                activeStep === 'dispatch' && currentPreset.targets.includes('slack')
                  ? 'bg-purple-500/10 border-purple-400 text-white'
                  : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              <svg className="w-3.5 h-3.5 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.823a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.823 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H6.303a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.043zm10.135 3.762a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.762 10.135a2.528 2.528 0 0 1-2.52 2.522 2.528 2.528 0 0 1-2.522-2.522v-2.52h2.522a2.528 2.528 0 0 1 2.52 2.52zm0-1.262a2.528 2.528 0 0 1-2.52-2.52v-5.043a2.528 2.528 0 0 1 2.522-2.522h5.043a2.528 2.528 0 0 1 2.52 2.522v5.043a2.528 2.528 0 0 1-2.52 2.52h-5.043z" />
              </svg>
              <span className="text-[9px] font-bold uppercase font-mono">Team Slack</span>
            </div>

            <div 
              style={{ left: '88%', top: '62%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-3.5 py-2 rounded-xl border flex items-center gap-2 shadow-sm transition-all duration-300 z-10",
                activeStep === 'dispatch' && currentPreset.targets.includes('calendar')
                  ? 'bg-blue-500/10 border-blue-400 text-white'
                  : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[9px] font-bold uppercase font-mono">iCal Feed</span>
            </div>

            <div 
              style={{ left: '88%', top: '85%', transform: 'translate(-50%, -50%)' }}
              className={cn(
                "absolute px-3.5 py-2 rounded-xl border flex items-center gap-2 shadow-sm transition-all duration-300 z-10",
                activeStep === 'dispatch' && currentPreset.targets.includes('mcp')
                  ? 'bg-rose-500/10 border-rose-400 text-white'
                  : 'bg-zinc-950 border-white/[0.04] text-zinc-500'
              )}
            >
              <Terminal className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[9px] font-bold uppercase font-mono">MCP Tool</span>
            </div>
          </div>

          {/* Mobile Linear View */}
          <div className="md:hidden space-y-3 bg-zinc-950 border border-white/[0.04] p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
              <Workflow className="w-4 h-4" /> Sequential Pipeline Log
            </div>
            
            <div className="space-y-2 text-xs">
              <div className={cn("p-2.5 rounded-xl border", activeStep === 'source' ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-zinc-900/30 border-white/5 text-zinc-500')}>
                <span className="font-bold">1. Input:</span> {currentPreset.text}
              </div>
              <div className={cn("p-2.5 rounded-xl border", activeStep === 'classifier' ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-zinc-900/30 border-white/5 text-zinc-500')}>
                <span className="font-bold">2. Intent:</span> {activeStep !== 'source' && activeStep ? currentPreset.intent : 'Pending...'}
              </div>
              <div className={cn("p-2.5 rounded-xl border", activeStep === 'extractor' ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-zinc-900/30 border-white/5 text-zinc-500')}>
                <span className="font-bold">3. Entities:</span> {['extractor', 'conflict', 'dispatch'].includes(activeStep) ? `${currentPreset.extracted.title} (${currentPreset.extracted.date})` : 'Pending...'}
              </div>
              <div className={cn("p-2.5 rounded-xl border", activeStep === 'conflict' ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-zinc-900/30 border-white/5 text-zinc-500')}>
                <span className="font-bold">4. Capacity:</span> {['conflict', 'dispatch'].includes(activeStep) ? currentPreset.conflict : 'Pending...'}
              </div>
              <div className={cn("p-2.5 rounded-xl border", activeStep === 'dispatch' ? 'bg-indigo-500/10 border-indigo-500/30 text-white' : 'bg-zinc-900/30 border-white/5 text-zinc-500')}>
                <span className="font-bold">5. Dispatch:</span> {activeStep === 'dispatch' ? `Sync complete for ${currentPreset.targets.join(", ")}` : 'Pending...'}
              </div>
            </div>
          </div>

          {/* Console Output box */}
          <div className="bg-zinc-950 border border-white/[0.05] rounded-2xl p-4 font-mono text-xs flex flex-col justify-between min-h-[160px] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.04] pb-2 mb-2 text-zinc-600 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="font-bold uppercase tracking-wider ml-1">AI Pipeline Console</span>
              </div>
              <div className="text-[9px]">
                STATE: {isRunning ? (
                  <span className="text-indigo-400 font-bold animate-pulse">COMPUTING</span>
                ) : activeStep === 'dispatch' ? (
                  <span className="text-emerald-400 font-bold">READY</span>
                ) : (
                  <span className="text-zinc-700 font-bold">IDLE</span>
                )}
              </div>
            </div>

            <div ref={consoleContainerRef} className="flex-1 overflow-y-auto space-y-1.5 max-h-[150px] custom-scrollbar text-[10px] pr-2 scroll-smooth">
              {logs.length === 0 ? (
                <div className="text-zinc-600 italic select-none">
                  Standby. Awaiting trigger signal...
                </div>
              ) : (
                logs.map((log, index) => {
                  let colorClass = "text-zinc-500";
                  if (log.type === 'success') colorClass = "text-emerald-400";
                  if (log.type === 'warning') colorClass = "text-amber-400";
                  if (log.type === 'prompt') colorClass = "text-indigo-300 font-bold italic";

                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2"
                    >
                      <span className="text-zinc-700 select-none">[{log.time}]</span>
                      <span className={colorClass}>{log.text}</span>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
