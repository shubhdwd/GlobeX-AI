import React, { useState, useEffect, useRef } from 'react';
import {
  Search, TrendingUp, Mail, FileText, CheckCircle2, Terminal,
  Play, Check, Loader2, ShieldAlert, Globe, LogOut,
  ChevronRight, Sparkles, Activity, Package, Users, ArrowUpRight,
  Bell, Settings, Home
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ────────────────────────────────────────────────────────── */
/*  Agent definitions                                          */
/* ────────────────────────────────────────────────────────── */
const AGENTS = {
  discovery: {
    id: 'discovery',
    name: 'Buyer Discovery',
    fullName: 'Buyer Discovery Agent',
    icon: Search,
    color: '#2563EB',
    bg: '#EFF6FF',
    role: 'Global Trade Importer Finder',
    tag: 'Find Buyers',
    description: 'Crawls international shipping records, customs registries, and business directories to compile verified active buyers purchasing your HS code products.',
    capabilities: [
      'Real-time scanning of bills of lading & customs manifests.',
      'Cross-border registry scraping and trade volume tracking.',
      'Entity resolution to filter duplicates and identify parent companies.'
    ],
    simulationLogs: [
      '🚀 Initializing Buyer Discovery Agent...',
      '🔍 Scanning customs registries for HS Code: 6204.62 (Women\'s Cotton Trousers)...',
      '📊 Parsing latest bills of lading for the last 6 months...',
      '🔄 Filtered 12,480 shipments. Isolating active importers in Europe & North America...',
      '💡 Match found: "Textil GmbH" (Hamburg, Germany) — 18 shipments, 45 tons.',
      '💡 Match found: "Nordic Retailers" (Oslo, Norway) — 9 shipments, 22 tons.',
      '💡 Match found: "Atlas Imports Inc." (New York, USA) — 34 shipments, 88 tons.',
      '✨ Resolving corporate structures and public contact details...',
      '✅ Agent run complete. 3 high-volume buyers verified and saved to pipeline.'
    ],
    outcome: {
      title: 'Discovered Buyers — HS 6204.62',
      type: 'table',
      data: [
        { company: 'Atlas Imports Inc.', country: '🇺🇸 United States', volume: '88 Tons', reliability: '94%', contact: 'procurement@atlasimports.com' },
        { company: 'Textil GmbH', country: '🇩🇪 Germany', volume: '45 Tons', reliability: '89%', contact: 'buying@textilgmbh.de' },
        { company: 'Nordic Retailers', country: '🇳🇴 Norway', volume: '22 Tons', reliability: '87%', contact: 'sourcing@nordicretailers.no' }
      ]
    }
  },
  intelligence: {
    id: 'intelligence',
    name: 'Market Intelligence',
    fullName: 'Market Intelligence Agent',
    icon: TrendingUp,
    color: '#059669',
    bg: '#ECFDF5',
    role: 'Global Market Opportunity Evaluator',
    tag: 'Analyze Markets',
    description: 'Analyzes tariff rates, historical trade growth, competitor presence, and pricing dynamics to score and recommend top-performing export countries.',
    capabilities: [
      'Retrieves customs tariffs and Free Trade Agreement benefits.',
      'Calculates 5-year CAGR demand trends for specific product lines.',
      'Evaluates port logistics efficiency and transportation cost indices.'
    ],
    simulationLogs: [
      '🚀 Initializing Market Intelligence Agent...',
      '📈 Fetching 5-year historical trade data for: Agro-products (Spices)...',
      '📊 Fetching tariff rates for India → Worldwide exports...',
      '🔍 Checking regional FTAs and CEPA benefits...',
      '⚡ Analyzing competitor density (major exporters: Vietnam, Madagascar)...',
      '💡 Computing Opportunity Scores: Tariffs + Demand + Logistics...',
      '📈 Germany: 0% tariff (FTA), +6.8% CAGR, Score: 91/100',
      '📈 UAE: 0% tariff (CEPA), +8.2% CAGR, Score: 89/100',
      '📈 Japan: 4.5% tariff, +2.1% CAGR, Score: 72/100',
      '✅ Market analysis complete. Germany and UAE flagged as high-priority.'
    ],
    outcome: {
      title: 'Top Target Export Markets',
      type: 'list',
      data: [
        { country: '🇩🇪 Germany', tariff: '0.0% (FTA)', growth: '+6.8% CAGR', score: 91, status: 'Highly Recommended' },
        { country: '🇦🇪 United Arab Emirates', tariff: '0.0% (CEPA)', growth: '+8.2% CAGR', score: 89, status: 'Highly Recommended' },
        { country: '🇯🇵 Japan', tariff: '4.5%', growth: '+2.1% CAGR', score: 72, status: 'Moderate Growth' }
      ]
    }
  },
  outreach: {
    id: 'outreach',
    name: 'Outreach & RFP',
    fullName: 'Outreach & RFP Agent',
    icon: Mail,
    color: '#7C3AED',
    bg: '#F5F3FF',
    role: 'Multilingual Pitch Generator',
    tag: 'Generate Outreach',
    description: 'Automatically drafts personalized B2B outreach proposals and RFP replies, tailored to local market cultures and languages for maximum conversion.',
    capabilities: [
      'Generates hyper-personalized outreach from buyer transaction histories.',
      'Native localization for European, Middle Eastern, and Asian markets.',
      'Follows professional email compliance standards (CAN-SPAM / GDPR).'
    ],
    simulationLogs: [
      '🚀 Initializing Outreach & RFP Agent...',
      '📧 Fetching buyer profile: "Textil GmbH" (Hamburg, Germany)...',
      '✍️ Analyzing history: Frequently imports organic cotton textiles from South Asia...',
      '🌐 Selecting draft language: German (Deutsch) for high response rate...',
      '📝 Generating personalized value proposition based on organic certifications...',
      '⚙️ Applying tone: Formal corporate partner...',
      '📧 Subject optimized: Partnerschaftsanfrage: Bio-Baumwolltextilien direkt vom Hersteller',
      '✨ Body draft created. Checking GDPR compliance...',
      '✅ Outreach draft ready for approval.'
    ],
    outcome: {
      title: 'Generated Outreach Email (Deutsch)',
      type: 'email',
      subject: 'Partnerschaftsanfrage: Bio-Baumwolltextilien direkt vom Hersteller',
      body: `Sehr geehrte Damen und Herren,

wir haben festgestellt, dass Ihr Unternehmen Textil GmbH ein führender Importeur von ökologischen Textilien in Deutschland ist.

Als zertifizierter Hersteller in Indien bieten wir hochwertige Bio-Baumwolltextilien an, die den globalen GOTS-Standards entsprechen. Durch unsere vertikal integrierte Produktion können wir Ihre Lieferkettenstabilität sichern und attraktive Einkaufskonditionen bei 0% Zoll (unter dem aktuellen Handelsabkommen) garantieren.

Gerne senden wir Ihnen unseren neuesten Produktkatalog und einige Muster zu.

Mit freundlichen Grüßen,
Sourcing-Team`
    }
  },
  compliance: {
    id: 'compliance',
    name: 'Compliance & Customs',
    fullName: 'Compliance & Customs Agent',
    icon: FileText,
    color: '#D97706',
    bg: '#FFFBEB',
    role: 'Trade Barriers & Regulations Advisor',
    tag: 'Check Compliance',
    description: 'Verifies customs requirements, certifications, product labeling mandates, and testing protocols required for seamless entry into target countries.',
    capabilities: [
      'Cross-references target country customs protocols with your HS code.',
      'Highlights mandatory safety, agricultural, or environmental certifications.',
      'Tracks average port clearance days and regulatory risk indicators.'
    ],
    simulationLogs: [
      '🚀 Initializing Compliance & Customs Agent...',
      '📦 Target product: Spices & Condiments. Target country: Germany (EU)...',
      '🔍 Accessing European Food Safety Authority (EFSA) regulatory database...',
      '⚠️ Alert: Phytosanitary Certificate required from Indian authorities.',
      '⚠️ Alert: Pesticide MRLs must conform to EU Regulation (EC) 396/2005.',
      '📝 Checking labeling: Must include botanical name, batch ID, net weight in German.',
      '⚖️ Port customs: Standard entry with document clearance. Avg. delay: 2 days.',
      '✅ Compliance check complete. 3 certificates required.'
    ],
    outcome: {
      title: 'EU Compliance Checklist',
      type: 'checklist',
      data: [
        { check: 'Phytosanitary Certificate', authority: 'Ministry of Agriculture, India', status: 'Required', action: 'Apply 7 days before shipping' },
        { check: 'Pesticide MRL Test Report', authority: 'NABL Accredited Laboratory', status: 'Required', action: 'Batch sample testing mandatory' },
        { check: 'EU-Standard Bilingual Labeling', authority: 'Self-Declaration', status: 'Required', action: 'Incorporate German labels on packaging' }
      ]
    }
  },
  scoring: {
    id: 'scoring',
    name: 'Lead Scoring',
    fullName: 'Lead Scoring Agent',
    icon: CheckCircle2,
    color: '#DC2626',
    bg: '#FEF2F2',
    role: 'Buyer Trust & Credit Scorer',
    tag: 'Score Leads',
    description: 'Calculates propensity scores for buyers by correlating trade frequencies, order volumes, financial stability records, and supplier retention rates.',
    capabilities: [
      'Correlates trade frequency to identify stable, recurring importers.',
      'Performs business credit registry checks where available.',
      'Assigns an overall Lead Score out of 100 based on fit and stability.'
    ],
    simulationLogs: [
      '🚀 Initializing Lead Scoring Agent...',
      '📊 Processing importer: "Atlas Imports Inc."...',
      '📈 Transaction history audit: 34 shipments over 12 months (Stable demand).',
      '🔄 Supplier retention analysis: Longevity averages 3.2 years.',
      '💳 Querying corporate registries for credit stability indicators...',
      '⚖️ Risk analysis: No legal disputes or customs violations found.',
      '🎛️ Fitting parameters: Volume Match (10/10), Stability (9/10), Growth (8/10).',
      '💡 Final score computed: 94/100.',
      '✅ Scoring complete. Lead flagged as tier-1 priority target.'
    ],
    outcome: {
      title: 'Lead Profile: Atlas Imports Inc.',
      type: 'scoring',
      score: 94,
      metrics: [
        { name: 'Import Frequency', rating: 'High — Monthly', score: 95 },
        { name: 'Shipment Volume Fit', rating: 'Optimal Match', score: 92 },
        { name: 'Financial Reliability', rating: 'Strong Credit', score: 94 },
        { name: 'Supplier Loyalty', rating: 'High Retention', score: 90 }
      ]
    }
  }
};

/* ────────────────────────────────────────────────────────── */
/*  Stat card                                                  */
/* ────────────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 flex items-start gap-4">
      <div className="p-2.5 rounded-lg" style={{ background: color + '18' }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-[12px] text-[#64748B] font-medium">{label}</p>
        <p className="text-2xl font-black text-[#0F172A] leading-tight">{value}</p>
        <p className="text-[11px] text-[#94A3B8] mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Main Dashboard                                             */
/* ────────────────────────────────────────────────────────── */
export default function AiAgentsHub({ onBackToLanding }) {
  const { user, logout } = useAuth();
  const [activeAgent, setActiveAgent] = useState('discovery');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState([]);
  const [showOutcome, setShowOutcome] = useState(false);
  const terminalEndRef = useRef(null);
  const intervalRef = useRef(null);

  const agent = AGENTS[activeAgent];

  // Reset simulator on agent switch
  useEffect(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setIsSimulating(false);
    setSimulatedLogs([]);
    setShowOutcome(false);
  }, [activeAgent]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [simulatedLogs]);

  const handleStartSimulation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsSimulating(true);
    setSimulatedLogs([]);
    setShowOutcome(false);
    const logs = agent.simulationLogs;
    let step = 0;
    intervalRef.current = setInterval(() => {
      if (step < logs.length) {
        setSimulatedLogs(prev => [...prev, logs[step++]]);
      } else {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsSimulating(false);
        setShowOutcome(true);
      }
    }, 800);
  };

  const firstName = user?.name?.split(' ')[0] || 'there';
  const AgentIcon = agent.icon;

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col">

      {/* ── Top Dashboard Bar ───────────────────────────────── */}
      <div className="bg-[#0F172A] border-b border-[#1E293B] sticky top-0 z-40">
        {/* Port image subtle overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <img src="/port.jpg" alt="" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-transparent to-[#0F172A]" />
        </div>
        <div className="relative section-container h-14 flex items-center justify-between gap-4">
          {/* Logo + page */}
          <div className="flex items-center gap-3">
            <img src="/globex-logo.jpg" alt="GlobeX Logo" className="w-7 h-7 rounded-lg object-contain bg-white border border-[#334155] shrink-0" />
            <span className="text-white font-bold text-sm tracking-tight">GlobeX</span>
            <span className="hidden md:block text-[#475569] text-xs">/</span>
            <span className="hidden md:block text-[#94A3B8] text-xs font-medium">AI Trade Agents</span>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToLanding}
              className="hidden md:flex items-center gap-1.5 text-[12px] text-[#94A3B8] hover:text-white transition-colors"
            >
              <Home size={13} /> Back to Site
            </button>

            {/* Notification dot */}
            <button className="relative p-1.5 text-[#64748B] hover:text-[#94A3B8] transition-colors">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
            </button>

            {/* User chip */}
            {user && (
              <div className="flex items-center gap-2 bg-[#1E293B] rounded-lg px-3 py-1.5">
                <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-[11px] font-bold">
                  {(user.name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="hidden md:block">
                  <p className="text-[12px] font-semibold text-white leading-none">{user.name || user.email}</p>
                  <p className="text-[10px] text-[#64748B]">{user.role === 'SELLER' ? '📦 Seller' : '🛒 Buyer'}</p>
                </div>
                <button
                  onClick={() => { logout(); onBackToLanding(); }}
                  className="ml-1 text-[#64748B] hover:text-[#EF4444] transition-colors"
                  title="Sign Out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Dashboard Body ──────────────────────────────────── */}
      <div className="flex-1 section-container py-8">

        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-black text-[#0F172A] leading-tight">
                Welcome back, {firstName} 👋
              </h1>
              <p className="text-[14px] text-[#64748B] mt-1">
                Your AI Trade Agents are ready. Select an agent below to run a live simulation.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              <span className="text-[12px] font-semibold text-[#059669]">All Agents Operational</span>
            </div>
          </div>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Buyers Discovered" value="3,200+" sub="Last 30 days" color="#2563EB" />
          <StatCard icon={Globe} label="Markets Analyzed" value="47" sub="Active coverage" color="#059669" />
          <StatCard icon={Mail} label="Emails Generated" value="820" sub="This month" color="#7C3AED" />
          <StatCard icon={Activity} label="Avg. Lead Score" value="88.4" sub="Tier-1 pipeline" color="#D97706" />
        </div>

        {/* Main 2-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── Sidebar ───────────────────────── */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Agent list */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F1F5F9]">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                  AI Agents
                </span>
              </div>
              <div className="flex flex-col p-2 gap-1">
                {Object.values(AGENTS).map((ag) => {
                  const Icon = ag.icon;
                  const isActive = activeAgent === ag.id;
                  return (
                    <button
                      key={ag.id}
                      onClick={() => setActiveAgent(ag.id)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                        isActive ? 'text-white shadow-sm' : 'text-[#475569] hover:bg-[#F8FAFC]'
                      }`}
                      style={isActive ? { background: ag.color } : {}}
                    >
                      <div
                        className="p-1.5 rounded-md shrink-0"
                        style={isActive
                          ? { background: 'rgba(255,255,255,0.2)' }
                          : { background: ag.bg }
                        }
                      >
                        <Icon size={15} style={{ color: isActive ? '#fff' : ag.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-[13px] font-semibold truncate ${isActive ? 'text-white' : 'text-[#334155]'}`}>
                          {ag.name}
                        </p>
                        <p className={`text-[10px] truncate ${isActive ? 'text-white/70' : 'text-[#94A3B8]'}`}>
                          {ag.tag}
                        </p>
                      </div>
                      {isActive && <ChevronRight size={13} className="ml-auto text-white/60 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* System status */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
              <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-3">
                Data Sources
              </h4>
              {[
                ['Customs Manifests', true],
                ['Tariff Databases', true],
                ['EFSA Regulations', true],
                ['Language APIs', true],
                ['Credit Registries', true],
              ].map(([label, online]) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-[#F8FAFC] last:border-0 text-[12px]">
                  <span className="text-[#64748B]">{label}</span>
                  <span className={`flex items-center gap-1 font-semibold ${online ? 'text-[#059669]' : 'text-[#EF4444]'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${online ? 'bg-[#059669]' : 'bg-[#EF4444]'}`} />
                    {online ? 'Online' : 'Offline'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Main workspace ────────────────── */}
          <div className="lg:col-span-9 flex flex-col gap-5">

            {/* Agent header card */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F1F5F9] mb-5">
                <div className="flex items-center gap-4">
                  <div className="p-3.5 rounded-xl" style={{ background: agent.bg }}>
                    <AgentIcon size={26} style={{ color: agent.color }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-[#0F172A]">{agent.fullName}</h2>
                    <span
                      className="inline-block mt-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border"
                      style={{ color: agent.color, background: agent.bg, borderColor: agent.color + '40' }}
                    >
                      {agent.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleStartSimulation}
                  disabled={isSimulating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 shrink-0"
                  style={{ background: isSimulating ? '#94A3B8' : agent.color }}
                >
                  {isSimulating ? (
                    <><Loader2 size={15} className="animate-spin" /> Running…</>
                  ) : (
                    <><Play size={15} fill="currentColor" /> Run Simulation</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">What This Agent Does</h4>
                  <p className="text-[13px] text-[#475569] leading-relaxed">{agent.description}</p>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Key Capabilities</h4>
                  <ul className="flex flex-col gap-2">
                    {agent.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13px] text-[#475569]">
                        <Check size={14} className="mt-0.5 shrink-0" style={{ color: agent.color }} />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="rounded-xl border border-[#1E293B] overflow-hidden bg-[#0F172A]">
              <div className="flex items-center justify-between bg-[#1E293B] px-4 py-2.5">
                <div className="flex items-center gap-2">
                  <Terminal size={13} className="text-[#64748B]" />
                  <span className="text-[11px] font-mono font-semibold text-[#64748B]">
                    agent_runtime.log — {agent.fullName}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                </div>
              </div>
              <div className="p-5 font-mono text-[12px] min-h-[180px] max-h-[240px] overflow-y-auto flex flex-col gap-1.5 text-slate-300">
                {simulatedLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[140px] gap-2 text-slate-600">
                    <Terminal size={22} />
                    <p className="text-xs italic">Press "Run Simulation" to watch the agent execute in real-time.</p>
                  </div>
                ) : (
                  simulatedLogs.map((log, i) => (
                    <div key={i}
                      className={`leading-relaxed border-l-2 pl-3 py-0.5 ${
                        log?.startsWith('🚀') ? 'text-[#60A5FA] border-[#3B82F6]' :
                        log?.startsWith('✅') ? 'text-[#34D399] border-[#10B981]' :
                        log?.startsWith('⚠️') ? 'text-[#FCD34D] border-[#F59E0B]' :
                        'text-slate-300 border-slate-700'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
                {isSimulating && (
                  <div className="flex items-center gap-2 text-slate-500 pl-3 mt-1 border-l-2 border-slate-800">
                    <Loader2 size={11} className="animate-spin" />
                    <span>Processing next pipeline step…</span>
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>

            {/* Outcome panel */}
            {showOutcome && (
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
                <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-4 mb-5">
                  <div className="p-1.5 rounded-lg" style={{ background: agent.bg }}>
                    <Sparkles size={15} style={{ color: agent.color }} />
                  </div>
                  <h3 className="text-[15px] font-bold text-[#0F172A]">
                    Simulation Result: {agent.outcome.title}
                  </h3>
                </div>

                {/* TABLE */}
                {agent.outcome.type === 'table' && (
                  <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Importer Company</th>
                          <th>Country</th>
                          <th>Est. Volume</th>
                          <th>Reliability</th>
                          <th>Verified Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agent.outcome.data.map((row, i) => (
                          <tr key={i}>
                            <td className="font-semibold text-[#0F172A]">{row.company}</td>
                            <td>{row.country}</td>
                            <td>{row.volume}</td>
                            <td>
                              <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                                {row.reliability}
                              </span>
                            </td>
                            <td className="text-slate-500 font-mono text-[11px]">{row.contact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* LIST */}
                {agent.outcome.type === 'list' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {agent.outcome.data.map((row, i) => (
                      <div key={i} className="border border-[#E2E8F0] rounded-xl p-4 bg-[#F8FAFC]">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-bold text-[#0F172A] text-[14px]">{row.country}</span>
                          <div
                            className="text-[12px] font-black px-2.5 py-1 rounded-lg"
                            style={{ background: agent.bg, color: agent.color }}
                          >
                            {row.score}
                          </div>
                        </div>
                        {/* Score bar */}
                        <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full mb-3 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${row.score}%`, background: agent.color }} />
                        </div>
                        <div className="text-[11px] text-[#64748B] flex flex-col gap-1">
                          <div className="flex justify-between">
                            <span>Import Tariff:</span>
                            <span className="font-semibold text-[#334155]">{row.tariff}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>5-Yr CAGR:</span>
                            <span className="font-semibold text-[#059669]">{row.growth}</span>
                          </div>
                          <div className="mt-2 text-center text-[10px] font-bold text-[#047857] bg-[#ECFDF5] py-1 rounded-lg border border-[#A7F3D0]">
                            {row.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* EMAIL */}
                {agent.outcome.type === 'email' && (
                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                    <div className="bg-[#F8FAFC] px-4 py-3 border-b border-[#E2E8F0] flex items-start gap-2">
                      <span className="text-[11px] font-bold text-[#64748B] shrink-0 mt-0.5">Subject:</span>
                      <span className="text-[12px] font-semibold text-[#0F172A] font-mono">{agent.outcome.subject}</span>
                    </div>
                    <div className="p-5 text-[13px] font-mono whitespace-pre-wrap leading-relaxed text-[#334155] bg-white max-h-[220px] overflow-y-auto">
                      {agent.outcome.body}
                    </div>
                  </div>
                )}

                {/* CHECKLIST */}
                {agent.outcome.type === 'checklist' && (
                  <div className="flex flex-col gap-3">
                    {agent.outcome.data.map((row, i) => (
                      <div key={i} className="flex items-start gap-3 border border-[#E2E8F0] rounded-xl p-4 bg-white">
                        <div className="p-1.5 rounded-full bg-[#ECFDF5] shrink-0 mt-0.5">
                          <Check size={13} className="text-[#059669]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap justify-between gap-2 items-start">
                            <h4 className="text-[13px] font-bold text-[#0F172A]">{row.check}</h4>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                              {row.status}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">Issuing authority: {row.authority}</p>
                          <p className="mt-2 text-[11px] font-semibold px-2 py-1 rounded-lg inline-block"
                            style={{ background: agent.bg, color: agent.color }}>
                            → {row.action}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* SCORING */}
                {agent.outcome.type === 'scoring' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-4 flex flex-col items-center justify-center border border-[#E2E8F0] rounded-xl p-6 bg-[#F8FAFC] text-center">
                      <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Overall Fit Score</p>
                      <div className="text-6xl font-black my-2" style={{ color: agent.color }}>
                        {agent.outcome.score}
                      </div>
                      <div className="text-[13px] font-bold text-[#0F172A]">/100</div>
                      <span className="mt-3 text-[11px] font-bold text-[#059669] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#A7F3D0]">
                        🏆 Tier-1 Match
                      </span>
                    </div>
                    <div className="md:col-span-8 flex flex-col gap-3.5">
                      <h4 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">Capability Breakdown</h4>
                      {agent.outcome.metrics.map((m, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[12px] text-[#334155] mb-1.5">
                            <span className="font-semibold">{m.name}</span>
                            <span className="text-[#94A3B8]">{m.rating} — {m.score}/100</span>
                          </div>
                          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{ width: `${m.score}%`, background: agent.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
