import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, Brain, ArrowRight, User, Bot, Send, 
  CheckCircle2, RefreshCw, Users, Globe2, ShieldCheck, FileText, AlertCircle
} from 'lucide-react';

export default function AICopilotPage() {
  const [query, setQuery] = useState('');
  const [state, setState] = useState('idle'); // 'idle', 'analyzing', 'chat'
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    "Understanding Request...",
    "Searching Trade Database...",
    "Retrieving Compliance Information...",
    "Finding Buyers...",
    "Running AI Analysis...",
    "Building Expansion Strategy...",
    "Preparing Dashboard..."
  ];

  useEffect(() => {
    const pendingQuery = localStorage.getItem('copilotPendingQuery');
    if (pendingQuery) {
      localStorage.removeItem('copilotPendingQuery');
      handleAnalyze(null, pendingQuery);
    }
  }, []);

  const makeApiCall = async (q) => {
    setState('analyzing');
    setCurrentStep(0);
    setError(null);
    setQuery('');
    
    // Cycle through loading steps purely for UX
    const interval = setInterval(() => {
      setCurrentStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 1200);

    try {
      const token = localStorage.getItem('globex_token');
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: q, source: 'copilot' })
      });
      
      const data = await res.json();
      clearInterval(interval);
      
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'The AI service encountered an error.');
      }
      
      setCurrentStep(steps.length); // Complete
      setTimeout(() => {
        setState('chat');
        setMessages(prev => [
          ...prev,
          { 
            id: Date.now(), 
            type: 'ai', 
            text: data.data.response,
            toolResults: data.data.tool_results
          }
        ]);
      }, 500);

    } catch (err) {
      clearInterval(interval);
      setState('chat');
      setMessages(prev => [
        ...prev,
        { id: Date.now(), type: 'error', text: err.message || 'Failed to connect to the backend.' }
      ]);
    }
  };

  const handleAnalyze = (e, explicitQuery = null) => {
    e?.preventDefault();
    const q = explicitQuery || query;
    if (!q.trim()) return;
    
    setMessages([{ id: Date.now(), type: 'user', text: q }]);
    makeApiCall(q);
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;
    const q = query;
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text: q }]);
    makeApiCall(q);
  };

  const renderToolResults = (toolResults) => {
    if (!toolResults || Object.keys(toolResults).length === 0) return null;
    
    return (
      <div className="mt-4 flex flex-col gap-3">
        {Object.entries(toolResults).map(([toolName, result], idx) => {
          if (toolName === 'buyer_discovery') {
            const buyers = result.buyers || [];
            return (
              <div key={idx} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-[#0F172A] mb-3 text-[13px] uppercase tracking-wider flex items-center gap-2">
                  <Users size={16} className="text-[#2563EB]" /> Discovered Buyers
                </h4>
                <div className="flex flex-col gap-2">
                  {buyers.slice(0, 3).map((b, i) => (
                    <div key={i} className="flex justify-between items-center bg-white p-3 rounded-lg border border-[#E2E8F0]">
                      <div>
                        <p className="font-semibold text-sm text-[#0F172A]">{b.company_name}</p>
                        <p className="text-xs text-[#64748B]">{b.location}</p>
                      </div>
                      <span className="bg-[#ECFDF5] text-[#059669] px-2 py-1 rounded text-xs font-bold border border-[#D1FAE5]">
                        {b.match_score || 95}% Match
                      </span>
                    </div>
                  ))}
                  {buyers.length === 0 && <p className="text-sm text-[#64748B]">No buyers found in this dataset.</p>}
                </div>
              </div>
            );
          }
          if (toolName === 'market_research' || toolName === 'expansion_analysis') {
            const ops = result.opportunities || [];
            return (
              <div key={idx} className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-[#0F172A] mb-3 text-[13px] uppercase tracking-wider flex items-center gap-2">
                  <Globe2 size={16} className="text-[#10B981]" /> Market Insights
                </h4>
                <div className="flex flex-col gap-2">
                  {ops.slice(0, 3).map((op, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-[#E2E8F0]">
                      <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-sm text-[#0F172A]">{op.country}</p>
                        <span className="text-xs font-bold text-[#2563EB]">{op.opportunity_score}/100</span>
                      </div>
                      <p className="text-xs text-[#64748B]">{op.key_driver}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (toolName === 'country_rules') {
            return (
              <div key={idx} className="bg-[#FFFBEB] border border-[#FEF3C7] p-4 rounded-xl shadow-sm">
                <h4 className="font-bold text-[#D97706] mb-3 text-[13px] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck size={16} /> Compliance Rules
                </h4>
                <pre className="text-xs text-[#92400E] whitespace-pre-wrap font-sans leading-relaxed">
                  {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                </pre>
              </div>
            );
          }
          
          // Fallback generic renderer
          return (
            <div key={idx} className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-sm">
              <h4 className="font-bold text-[#0F172A] mb-2 text-sm capitalize flex items-center gap-2">
                <FileText size={16} className="text-[#64748B]" /> {toolName.replace(/_/g, ' ')}
              </h4>
              <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] overflow-x-auto">
                <pre className="text-xs text-[#475569]">{JSON.stringify(result, null, 2)}</pre>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] flex flex-col bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden animate-fade-in">
      
      {/* Header */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB] shadow-sm border border-[#DBEAFE]">
            <Brain size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F172A]">AI Trade Copilot</h2>
            <p className="text-sm text-[#64748B]">Powered by GlobeX Intelligence</p>
          </div>
        </div>
        {state !== 'idle' && (
          <button 
            onClick={() => { setState('idle'); setMessages([]); setQuery(''); }} 
            className="text-[13px] font-medium text-[#64748B] hover:text-[#2563EB] flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-[#BFDBFE] hover:bg-[#EFF6FF]"
          >
            <RefreshCw size={14} /> New Session
          </button>
        )}
      </div>

      {state === 'idle' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
          <div className="max-w-3xl w-full flex flex-col items-center">
            <h1 className="text-3xl font-bold text-[#0F172A] mb-3 text-center tracking-tight">
              How can I help you expand today?
            </h1>
            <p className="text-[#64748B] text-[15px] mb-8 text-center max-w-xl">
              I orchestrate multiple AI agents to discover buyers, analyze markets, and handle trade compliance autonomously.
            </p>

            <div className="w-full relative shadow-lg rounded-2xl mb-8">
              <form onSubmit={(e) => handleAnalyze(e)} className="w-full relative flex items-center bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:border-transparent transition-all">
                <Search className="absolute left-6 text-[#94A3B8]" size={20} />
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., I manufacture coffee in India. Find buyers in Germany."
                  className="w-full pl-14 pr-[140px] py-5 text-[15px] outline-none text-[#0F172A] bg-transparent"
                />
                <button 
                  type="submit"
                  disabled={!query.trim()}
                  className="absolute right-2 bg-[#2563EB] text-white px-5 py-2.5 rounded-xl font-medium text-[14px] hover:bg-[#1D4ED8] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  Analyze
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            <div className="w-full max-w-2xl">
              <p className="text-[12px] font-bold text-[#94A3B8] mb-4 uppercase tracking-wider text-center">Suggested Workflows</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <button onClick={() => handleAnalyze(null, "Find buyers in Germany for Indian coffee")} className="flex items-start gap-3 p-4 bg-white border border-[#E2E8F0] rounded-xl text-left hover:border-[#2563EB] hover:shadow-md transition-all group">
                  <div className="p-2 rounded-lg bg-[#F8FAFC] text-[#475569] group-hover:bg-[#EFF6FF] group-hover:text-[#2563EB] transition-colors">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#0F172A] mb-1">Find Buyers</h4>
                    <p className="text-[12px] text-[#64748B]">Identify high-intent importers</p>
                  </div>
                </button>
                <button onClick={() => handleAnalyze(null, "Analyze market trends for spices in Europe")} className="flex items-start gap-3 p-4 bg-white border border-[#E2E8F0] rounded-xl text-left hover:border-[#2563EB] hover:shadow-md transition-all group">
                  <div className="p-2 rounded-lg bg-[#F8FAFC] text-[#475569] group-hover:bg-[#EFF6FF] group-hover:text-[#2563EB] transition-colors">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-[#0F172A] mb-1">Market Trends</h4>
                    <p className="text-[12px] text-[#64748B]">Analyze demand and tariffs</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {(state === 'analyzing' || state === 'chat') && (
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {messages.map((msg, idx) => {
            if (msg.type === 'error') {
              return (
                <div key={msg.id} className="flex gap-4 max-w-[85%] animate-fade-in">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-[#FEF2F2] text-[#EF4444] border border-[#FEE2E2]">
                    <AlertCircle size={14} />
                  </div>
                  <div className="p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm bg-[#FEF2F2] border border-[#FEE2E2] text-[#991B1B] rounded-tl-sm">
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex gap-4 max-w-[85%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''} animate-fade-in`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm ${msg.type === 'user' ? 'bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]' : 'bg-[#2563EB] text-white'}`}>
                  {msg.type === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-5 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                  msg.type === 'user' 
                    ? 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#0F172A] rounded-tr-sm' 
                    : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-sm w-full min-w-[300px]'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  {msg.type === 'ai' && renderToolResults(msg.toolResults)}
                </div>
              </div>
            );
          })}

          {state === 'analyzing' && (
            <div className="flex gap-4 max-w-[85%] animate-fade-in">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-[#2563EB] text-white shadow-sm">
                <Bot size={14} />
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-sm shadow-sm w-full md:w-auto min-w-[300px]">
                <h3 className="text-[14px] font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                  <Sparkles className="text-[#2563EB]" size={16} />
                  Orchestrating Agents...
                </h3>
                <div className="flex flex-col gap-3">
                  {steps.map((stepText, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isPending = index > currentStep;
                    return (
                      <div key={index} className={`flex items-center gap-3 ${isPending ? 'opacity-40' : ''}`}>
                        {isCompleted ? (
                          <CheckCircle2 className="text-[#10B981]" size={16} />
                        ) : isActive ? (
                          <div className="w-4 h-4 rounded-full border-2 border-[#2563EB] border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-[#CBD5E1]" />
                        )}
                        <span className={`text-[13px] ${isCompleted ? 'text-[#475569]' : isActive ? 'text-[#0F172A] font-semibold' : 'text-[#94A3B8]'}`}>
                          {stepText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input Area */}
      {state === 'chat' && (
        <div className="p-5 border-t border-[#E2E8F0] bg-white animate-fade-in shrink-0">
          <form onSubmit={handleSendMessage} className="relative flex items-center max-w-4xl mx-auto w-full">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a follow-up question or instruct the AI..."
              className="w-full pl-5 pr-14 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-[15px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] shadow-sm transition-all"
            />
            <button 
              type="submit"
              disabled={!query.trim()}
              className="absolute right-2 p-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#94A3B8] disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
      
    </div>
  );
}
