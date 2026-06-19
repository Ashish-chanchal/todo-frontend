import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Scan, 
  ShieldAlert, 
  Calendar, 
  Key,
  HelpCircle,
  Workflow
} from 'lucide-react';
import SplineWorkflow from '../components/SplineWorkflow';
import { AIFlow } from '../components/AIFlow';
function Landing({ onGetStarted }) {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "What is an MCP Server?",
      a: "Model Context Protocol (MCP) is an open standard that allows AI assistants (like Claude Desktop or Cursor IDE) to securely communicate with external tools and databases. TodoAI has a built-in MCP server so your AI agent can read, create, and complete tasks directly."
    },
    {
      q: "How does Commitment Detection work?",
      a: "Our background integration watches connected channels (like simulated Slack messages or email threads). When it detects commitment language (e.g. 'I will review the design tomorrow'), the AI parses it, extracts the deadline, and suggests it as a task on your board."
    },
    {
      q: "What is Energy-Aware Scheduling?",
      a: "Instead of treating all hours equally, our scheduling engine dynamically calculates your active tasks due tomorrow. If it exceeds our calculated 6-hour daily limit, the AI Negotiator helps reschedule low-priority tasks to prevent overload."
    },
    {
      q: "Can I subscribe via my external calendar?",
      a: "Yes! TodoAI generates standard read-only iCal (.ics) calendar feeds. You can copy the subscription link and paste it into Google Calendar, Apple Calendar, or Outlook to sync your task deadlines."
    }
  ];

  return (
    <div className="min-h-screen bg-[#08080a] text-zinc-100 font-sans antialiased overflow-x-hidden relative">
      {/* Background Grid with Radial Fade */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Decorative subtle glows */}
      <div className="absolute top-[-10%] left-[20%] w-[35rem] h-[35rem] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[35rem] h-[35rem] bg-violet-500/5 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3 select-none">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white">
            Todo<span className="text-indigo-400">AI</span>
          </span>
        </div>
        <button
          onClick={onGetStarted}
          className="bg-white hover:bg-zinc-200 text-black text-xs font-bold rounded-full px-5 py-2 transition-all shadow-sm"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-24 pb-20 relative z-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/5 border border-indigo-500/10 text-[9px] font-bold tracking-widest text-[#8f95ff] mb-6 uppercase">
          <Sparkles className="w-3 h-3" /> NATIVE MODEL CONTEXT PROTOCOL WORKSPACE
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-400 leading-[1.1] mb-6">
          The task manager <br />
          your AI already knows.
        </h1>

        <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-10">
          TodoAI is built on MCP, letting external agents inspect and update tasks natively. Integrated with Slack commitment capture, calendar feeds, and team widgets.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onGetStarted}
            className="relative inline-flex h-11 overflow-hidden rounded-full p-[1px] focus:outline-none active:scale-95 transition-all shadow-md"
          >
            <span className="absolute inset-0 animate-shimmer-glow rounded-full" />
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#08080a] px-6 text-xs font-bold text-white backdrop-blur-3xl hover:bg-[#08080a]/90 transition-all gap-1.5">
              Launch Console <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </section>

      {/* AI Reasoning Flow Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-20 border-t border-white/[0.04]">
        <div className="text-center mb-12 select-none">
          <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Cognition Engine</span>
          <h2 className="text-2xl font-bold text-white mt-1">AI Reasoning Flow</h2>
          <p className="text-xs text-zinc-500 mt-2 max-w-lg mx-auto">
            Visual sequence illustrating how the background agent processes queries, solves conflicts, and triggers webhooks.
          </p>
        </div>

        {/* Dynamic pipeline stepper */}
        <SplineWorkflow />
           <AIFlow />
      </section>

      {/* Bento Grid Features Layout */}
      <section className="max-w-6xl mx-auto px-6 py-16 relative z-20 border-t border-white/[0.04]">
        <div className="text-center mb-16 select-none">
          <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Feature Scope</span>
          <h2 className="text-2xl font-bold text-white mt-1">SaaS Features Grid</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Chat Assistant */}
          <div className="md:col-span-2 glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group">
            <div className="flex flex-col justify-between h-full min-h-[260px]">
              <div>
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                </div>
                <h3 className="font-bold text-md text-white mb-2">AI Chat Console</h3>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                  Submit conversational prompts like *"Add slides review high priority"* or *"Summarize my backlog"* to command your tasks directly.
                </p>
              </div>

              {/* Console Mockup */}
              <div className="bg-zinc-950 border border-white/[0.04] rounded-2xl p-4 font-mono text-[9px] text-zinc-500 mt-6">
                <div className="flex items-center gap-1.5 mb-2 border-b border-white/[0.03] pb-1.5">
                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[8px] text-zinc-700 ml-1">assistant_engine.sh</span>
                </div>
                <p className="text-emerald-400">{`> "Add task build API tomorrow"`}</p>
                <p className="text-indigo-400">{`> Created task: "Build API" | Due: Tomorrow [confidence: 0.98]`}</p>
              </div>
            </div>
          </div>

          {/* Card 2: Slack Commitment Net */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
                <Scan className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="font-bold text-md text-white mb-2">Commitment Net</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Listens to Slack channels and extracts commitment sentences (e.g. *"I'll send the updates"*), then formats them as tasks.
              </p>
            </div>

            {/* Simulated Card */}
            <div className="mt-6 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl p-3.5 space-y-2">
              <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider block">SLACK SOURCE</span>
              <p className="text-[10px] text-zinc-200 leading-normal">*"I will update the billing contract tonight"*</p>
              <button className="w-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 rounded-xl py-1 text-[9px] font-bold transition-all">
                Add to board
              </button>
            </div>
          </div>

          {/* Card 3: Energy limits rescheduler */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold text-md text-white mb-2">Energy-Aware Scheduling</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Monitors daily hours allocation. If overbooked, it automatically prompts dynamic negotiation reschedules.
            </p>
          </div>

          {/* Card 4: iCal subscriptions */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Calendar className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold text-md text-white mb-2">iCal Calendar Feeds</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Exposes standard `.ics` feeds to sync pending tasks with Google Calendar, Apple Calendar, or Outlook.
            </p>
          </div>

          {/* Card 5: MCP AI keys */}
          <div className="glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-300 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
              <Key className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold text-md text-white mb-2">MCP Developer Keys</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Generate secure API keys to connect Claude Desktop or Cursor to command tasks directly using standard MCP protocol.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 relative z-20 border-t border-white/[0.04]">
        <div className="text-center mb-12 select-none">
          <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">Feature Matrix</span>
          <h2 className="text-2xl font-bold text-white mt-1">Detailed Plan Comparison</h2>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.01] text-zinc-500 font-semibold uppercase tracking-wider text-[9px]">
                  <th className="p-4">Feature</th>
                  <th className="p-4">Free Plan</th>
                  <th className="p-4">Pro Plan</th>
                  <th className="p-4">Business Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-zinc-300 font-sans">
                <tr>
                  <td className="p-4 font-bold text-zinc-100">Task Backlog Limit</td>
                  <td className="p-4">Max 50 active tasks</td>
                  <td className="p-4 text-emerald-400">Unlimited</td>
                  <td className="p-4 text-emerald-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-100">Rate Limiting Threshold</td>
                  <td className="p-4">100 requests / hour</td>
                  <td className="p-4">1000 requests / hour</td>
                  <td className="p-4 text-indigo-400 font-semibold">5000 requests / hour</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-100">AI Natural Language Parser</td>
                  <td className="p-4 text-zinc-600">—</td>
                  <td className="p-4">Included (Gemini + Local)</td>
                  <td className="p-4">Included (Gemini + Local)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-100">Commitment Detection Net</td>
                  <td className="p-4 text-zinc-600">—</td>
                  <td className="p-4">Included (Slack/Email parsing)</td>
                  <td className="p-4">Included (Slack/Email parsing)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-100">MCP Server Integration Keys</td>
                  <td className="p-4 text-zinc-600">—</td>
                  <td className="p-4">Unlimited Key Generation</td>
                  <td className="p-4">Unlimited Key Generation</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-100">Calendar Subscriptions (.ics)</td>
                  <td className="p-4 text-zinc-600">—</td>
                  <td className="p-4 text-zinc-600">—</td>
                  <td className="p-4 text-indigo-400 font-semibold">Included (Live iCal sync)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-zinc-100">Collaborative Webhooks</td>
                  <td className="p-4 text-zinc-600">—</td>
                  <td className="p-4 text-zinc-600">—</td>
                  <td className="p-4 text-indigo-400 font-semibold">Cross-tool orchestration</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-6 py-16 relative z-20 border-t border-white/[0.04]">
        <div className="text-center mb-12 select-none">
          <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">FAQ Center</span>
          <h2 className="text-2xl font-bold text-white mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="glass-panel rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex justify-between items-center p-5 text-left focus:outline-none"
                >
                  <span className="font-semibold text-sm text-zinc-200 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400" /> {faq.q}
                  </span>
                  <span className="text-xs text-zinc-500 font-bold">
                    {isOpen ? '—' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/[0.03]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="max-w-4xl mx-auto text-center px-6 py-20 relative z-20 border-t border-white/[0.04]">
        <h2 className="text-3xl font-extrabold text-white leading-tight">Ready to command your tasks?</h2>
        <p className="text-zinc-500 text-xs mt-3 mb-8">No credit card required to start on our free tier.</p>
        <button
          onClick={onGetStarted}
          className="relative inline-flex h-11 overflow-hidden rounded-full p-[1px] focus:outline-none active:scale-95 transition-all shadow-md"
        >
          <span className="absolute inset-0 animate-shimmer-glow rounded-full" />
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-[#08080a] px-6 text-xs font-bold text-white backdrop-blur-3xl hover:bg-[#08080a]/90 transition-all gap-1.5">
            Create Free Account <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.03] py-8 text-center text-xs text-zinc-600 relative z-20 font-mono">
        © {new Date().getFullYear()} TodoAI Inc. All rights reserved. Designed in California.
      </footer>
    </div>
  );
}

export default Landing;
