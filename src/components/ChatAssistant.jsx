import React, { useState } from 'react';
import { Sparkles, Send, Brain, ShieldAlert, CheckCircle2, ChevronDown, ChevronRight, HelpCircle, FileText, UserCheck, Scale, RefreshCw } from 'lucide-react';

export default function ChatAssistant({ activeDoc }) {
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: `Hello! I am **LegalBuddy**, your AI legal assistant. I'm currently analyzing **${activeDoc ? activeDoc.name : 'Mutual_Non_Disclosure_Agreement.pdf'}**. \n\nAsk me anything about termination terms, risk exposure, indemnity, non-competes, or governing law!`,
      trace: [
        { tool: 'retrieve_documents', input: { query: 'Initial document load' }, output: 'Loaded 5 chunks into vector index' }
      ],
      citations: [activeDoc ? activeDoc.name : 'Mutual_Non_Disclosure_Agreement.pdf'],
      confidence: 0.96,
      riskLevel: 'LOW'
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('client'); // 'client' or 'lawyer'
  const [expandedTraceIndex, setExpandedTraceIndex] = useState(null);

  const suggestedQuestions = [
    "Does this contract have a termination clause, and is it fair?",
    "What are the highest risk terms and indemnification clauses?",
    "Can the company increase rates or claw back payments?",
    "Summarize the key confidentiality and IP ownership rules."
  ];

  const handleSend = async (queryText = inputQuery) => {
    if (!queryText.trim() || isLoading) return;
    const userMsg = queryText.trim();
    setInputQuery('');

    // Append user message
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const docId = activeDoc ? activeDoc.doc_id : 'demo_nda';
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMsg,
          doc_id: docId,
          mode: mode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reach LegalBuddy agent');
      }

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.answer,
          trace: data.trace || [],
          citations: data.citations || [],
          confidence: data.confidence || 0.9,
          riskLevel: data.risk_level || 'MEDIUM'
        }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `⚠️ **Agent Notice:** Unable to contact backend. Please ensure the Python API server is running on port 8000.`,
          trace: [],
          citations: [],
          confidence: 0.5,
          riskLevel: 'HIGH'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header bar with Mode Toggle & Active Document info */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/mascot.jpg" alt="Mascot" className="w-10 h-10 rounded-lg object-cover ring-2 ring-indigo-500/40" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">LegalBuddy Agentic Q&A</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Brain className="w-3 h-3 text-indigo-400" /> LangGraph RAG
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Active Doc: <span className="text-indigo-300 font-medium">{activeDoc ? activeDoc.name : 'Mutual NDA'}</span>
            </p>
          </div>
        </div>

        {/* Mode Switcher: Client vs Lawyer */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('client')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'client'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" /> Client Mode (Plain English)
          </button>
          <button
            onClick={() => setMode('lawyer')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'lawyer'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" /> Lawyer Mode (Formal Legal)
          </button>
        </div>
      </div>

      {/* Suggested Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-400" /> Quick Prompts:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-xs text-slate-300 hover:text-white bg-slate-900/80 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-500/40 px-3 py-1.5 rounded-lg transition-all shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="glass-card rounded-2xl border border-slate-800 p-6 space-y-6 min-h-[420px] max-h-[560px] overflow-y-auto">
        {messages.map((msg, index) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={index} className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
              
              {!isUser && (
                <img
                  src="/mascot.jpg"
                  alt="LegalBuddy Avatar"
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/40 shrink-0 mt-1"
                />
              )}

              <div className={`space-y-3 max-w-3xl ${isUser ? 'items-end' : 'items-start'}`}>
                
                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-900/90 text-slate-100 border border-slate-800 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>
                </div>

                {/* Assistant Metadata: Confidence, Risk Badge, Reasoning Trace, Citations */}
                {!isUser && (
                  <div className="space-y-2.5 pt-1">
                    
                    {/* Metadata Header Badges */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      
                      {/* Confidence Meter */}
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {Math.round((msg.confidence || 0.9) * 100)}% Confidence
                      </span>

                      {/* Risk Level Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-semibold border ${
                          msg.riskLevel === 'HIGH'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                            : msg.riskLevel === 'MEDIUM'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Risk: {msg.riskLevel}
                      </span>
                    </div>

                    {/* Agent Reasoning Trace Accordion (Standout Feature) */}
                    {msg.trace && msg.trace.length > 0 && (
                      <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                        <button
                          onClick={() => setExpandedTraceIndex(expandedTraceIndex === index ? null : index)}
                          className="w-full px-3.5 py-2 text-left text-xs font-semibold text-indigo-300 bg-slate-900/60 hover:bg-slate-900 flex items-center justify-between transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <Brain className="w-4 h-4 text-indigo-400 animate-pulse" />
                            Agentic Multi-Step Reasoning Trace ({msg.trace.length} tools executed)
                          </span>
                          {expandedTraceIndex === index ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>

                        {expandedTraceIndex === index && (
                          <div className="p-3 space-y-2 border-t border-slate-800/80 bg-slate-950/80">
                            {msg.trace.map((step, sIdx) => (
                              <div key={sIdx} className="text-xs p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 space-y-1">
                                <div className="flex items-center justify-between text-indigo-400 font-mono font-bold">
                                  <span>🔧 Step {sIdx + 1}: {step.tool}</span>
                                </div>
                                <div className="text-slate-300 font-mono text-[11px]">
                                  <span className="text-slate-500">Input:</span> {JSON.stringify(step.input)}
                                </div>
                                <div className="text-slate-400 font-mono text-[11px] truncate">
                                  <span className="text-slate-500">Output:</span> {step.output}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Citations List */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="text-slate-400 flex items-center gap-1 font-semibold">
                          <FileText className="w-3 h-3 text-indigo-400" /> Citations:
                        </span>
                        {msg.citations.map((cite, cIdx) => (
                          <span key={cIdx} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                            {cite}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>
                )}

              </div>

              {isUser && (
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-1">
                  YOU
                </div>
              )}

            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-indigo-300">
            <img src="/mascot.jpg" alt="Mascot" className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40 animate-pulse" />
            <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
              <span>LegalBuddy is executing RAG vector search & reasoning tools...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative">
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder={`Ask LegalBuddy a question about ${activeDoc ? activeDoc.name : 'the contract'}...`}
          className="w-full pl-5 pr-28 py-4 bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-2xl text-sm text-white placeholder-slate-500 outline-none shadow-xl transition-all"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="absolute right-2.5 top-2.5 bottom-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/30"
        >
          <Send className="w-4 h-4" /> Ask Agent
        </button>
      </form>

    </div>
  );
}
