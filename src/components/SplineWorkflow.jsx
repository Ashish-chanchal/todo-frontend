import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Cpu, Layers, Workflow, Terminal, Database, Calendar, CheckCircle2, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function SplineWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [logs, setLogs] = useState([]);
  
  const pinWrapperRef = useRef(null);
  const consoleRef = useRef(null);
  const cardRefs = useRef([]);

  const steps = [
    {
      title: "1. NL Ingestion Net",
      subtitle: "EVENT CAPTURE",
      description: "Listens for Slack promise text, emails, or direct API payloads and streams them into the ingestion database.",
      icon: Database,
      logStream: [
        "[Web Ingestion] Captured Slack hook #engineering",
        "[Promise Found] 'ashish: I will deploy the auth fix tonight'",
        "[Payload] Formatting raw string to JSON object...",
        "[Database] POST /todo payload accepted [status: pending]"
      ]
    },
    {
      title: "2. Gemini Cognition Core",
      subtitle: "AI PARSING",
      description: "Gemini 3.1 Flash Lite automatically classifies text intent, parses due dates, and sets priority structures.",
      icon: Cpu,
      logStream: [
        "[Gemini 3.1] Initializing prompt context...",
        "[Parser] Matching text: 'I will deploy the auth fix tonight'",
        "[Meta] Extracted: { title: 'Deploy auth fix', due: 'Tonight' }",
        "[Engine] Assigned Priority: HIGH [confidence: 99.4%]"
      ]
    },
    {
      title: "3. Agentic Execution & MCP",
      subtitle: "ORCHESTRATION",
      description: "Exposes secure MCP server API keys for Claude/Cursor agents while executing cascading webhooks.",
      icon: Workflow,
      logStream: [
        "[MCP Server] Client connected via Stdio Transport",
        "[Auth] Developer x-api-key header validated successfully",
        "[MCP Tool] Executed: complete_todo(id: 'td_1029')",
        "[Webhook] Dispatched status update payload to Slack channel"
      ]
    }
  ];

  // Dynamic log printing trigger
  useEffect(() => {
    setLogs([]);
    const stream = steps[activeStep].logStream;
    let index = 0;
    
    const interval = setInterval(() => {
      if (index < stream.length) {
        setLogs(prev => [...prev, stream[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [activeStep]);

  // ScrollTrigger Setup
  useEffect(() => {
    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      // Make scroll triggers responsive (earlier trigger on mobile screen heights)
      const triggerStart = window.innerWidth < 1024 ? "top 70%" : "top 60%";

      ScrollTrigger.create({
        trigger: card,
        start: triggerStart,
        end: "bottom 60%",
        onEnter: () => {
          setActiveStep(index);
          gsap.to(card, { scale: 1.02, opacity: 1, duration: 0.4, ease: "power2.out" });
          cardRefs.current.forEach((c, idx) => {
            if (c && idx !== index) {
              gsap.to(c, { scale: 0.98, opacity: 0.3, duration: 0.4 });
            }
          });
        },
        onEnterBack: () => {
          setActiveStep(index);
          gsap.to(card, { scale: 1.02, opacity: 1, duration: 0.4, ease: "power2.out" });
          cardRefs.current.forEach((c, idx) => {
            if (c && idx !== index) {
              gsap.to(c, { scale: 0.98, opacity: 0.3, duration: 0.4 });
            }
          });
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div 
      ref={pinWrapperRef}
      className="w-full flex flex-col lg:flex-row items-start gap-8 lg:gap-12 py-6 lg:py-12 relative"
    >
      {/* Left: Sticky Console Screen (Stacked on mobile/tablet, sticky on desktop) */}
      <div className="w-full lg:w-[45%] lg:sticky lg:top-[16vh] flex flex-col gap-4 self-start z-10">
        
        {/* Title */}
        <div className="flex flex-col gap-1 text-left select-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-[9px] text-[#8f95ff] font-bold uppercase tracking-wider w-fit">
            <Sparkles className="w-3 h-3 text-indigo-400 animate-pulse" /> Live Ingestion Pipeline
          </div>
          <h3 className="text-lg lg:text-xl font-bold text-white mt-2 tracking-tight">AI Reasoning Flow</h3>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-sm">
            Scroll down to watch tasks stream through the natural language parser and propagate via the MCP server.
          </p>
        </div>

        {/* Mock Developer Console */}
        <div 
          ref={consoleRef}
          className="w-full bg-[#050507] border border-white/[0.05] rounded-3xl p-5 lg:p-6 font-mono text-[10px] leading-relaxed text-zinc-400 h-[220px] lg:h-[260px] flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Console Header */}
          <div className="flex items-center justify-between border-b border-white/[0.03] pb-3 mb-2 select-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[8px] text-zinc-700 ml-1">cognitive_engine_stream</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] text-zinc-500 font-mono">
              status_active
            </span>
          </div>

          {/* Console Output Terminal */}
          <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1 text-left">
            {logs.length === 0 ? (
              <span className="text-zinc-600">Awaiting stream packets...</span>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-indigo-500/80">&gt;</span>
                  <span className={typeof log === 'string' && (log.includes('Found') || log.includes('Output') || log.includes('Tool') || log.includes('accepted')) ? 'text-zinc-200 font-semibold' : 'text-zinc-500'}>
                    {log}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right: Scrolling Workflow Cards (Fully responsive pl/connector alignment) */}
      <div className="w-full lg:w-[55%] flex flex-col gap-8 lg:gap-12 relative pl-6 lg:pl-12 mt-6 lg:mt-0">
        
        {/* Connector Line - Mathematically aligned to pin center */}
        <div className="absolute left-[23px] lg:left-[47px] top-0 bottom-0 w-[2px] bg-white/[0.03] -z-10">
          <div 
            className="w-full bg-gradient-to-b from-indigo-500 to-violet-500 transition-all duration-500 ease-out" 
            style={{ 
              height: `${((activeStep + 1) / steps.length) * 100}%`,
              boxShadow: '0 0 10px rgba(99,102,241,0.5)'
            }} 
          />
        </div>

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = activeStep === idx;
          return (
            <div
              key={idx}
              ref={el => cardRefs.current[idx] = el}
              className={`flex gap-6 items-start transition-all duration-500 relative pl-4 lg:pl-6 ${
                isActive ? 'opacity-100 scale-[1.01]' : 'opacity-30 scale-98'
              }`}
            >
              {/* Connector Pin - Aligned exactly with line */}
              <div className={`absolute left-[-25px] lg:left-[-49px] top-5 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                isActive 
                  ? 'bg-[#08080a] border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' 
                  : 'bg-zinc-900 border-white/10'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full transition-all ${
                  isActive ? 'bg-indigo-400' : 'bg-transparent'
                }`} />
              </div>

              {/* Step Card Content */}
              <div className={`flex-1 p-5 lg:p-6 rounded-3xl border transition-all text-left ${
                isActive 
                  ? 'bg-indigo-500/[0.02] border-indigo-500/35 shadow-[0_0_25px_rgba(99,102,241,0.04)]' 
                  : 'bg-white/[0.01] border-white/[0.03]'
              }`}>
                <div className={`p-2.5 rounded-xl border w-fit mb-4 transition-colors ${
                  isActive 
                    ? 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400' 
                    : 'bg-white/[0.02] border-white/[0.05] text-zinc-500'
                }`}>
                  <Icon className="w-4 h-4 lg:w-5 lg:h-5" />
                </div>

                <div className="flex items-center justify-between">
                  <h4 className={`text-xs lg:text-sm font-bold transition-colors ${
                    isActive ? 'text-white' : 'text-zinc-400'
                  }`}>
                    {step.title}
                  </h4>
                  {isActive && (
                    <CheckCircle2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-indigo-400 animate-pulse" />
                  )}
                </div>

                <p className="text-[10px] lg:text-[11px] text-zinc-400 mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SplineWorkflow;
