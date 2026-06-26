import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  TrendingUp, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Terminal, 
  Play, 
  Check, 
  Loader2, 
  ShieldAlert, 
  Globe, 
  ArrowLeft,
  Calendar,
  Building,
  User,
  MapPin,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function AiAgentsHub({ onBackToLanding }) {
  const [activeAgent, setActiveAgent] = useState('discovery');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedLogs, setSimulatedLogs] = useState([]);
  const [simulationStep, setSimulationStep] = useState(0);
  const [showOutcome, setShowOutcome] = useState(false);
  const terminalEndRef = useRef(null);
  const intervalRef = useRef(null);

  // Reset simulator when changing agent
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsSimulating(false);
    setSimulatedLogs([]);
    setSimulationStep(0);
    setShowOutcome(false);
  }, [activeAgent]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Scroll terminal logs to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simulatedLogs]);

  const agents = {
    discovery: {
      id: 'discovery',
      name: 'Buyer Discovery Agent',
      icon: Search,
      role: 'Global Trade Importer Finder',
      description: 'Crawls international shipping records, customs registries, and business directories to compile a list of active buyers purchasing your specific HS code products.',
      capabilities: [
        'Real-time scanning of bills of lading and customs manifests.',
        'Cross-border registry scraping and trade volume tracking.',
        'Entity resolution to filter duplicate buyers and identify parent companies.'
      ],
      simulationLogs: [
        '🚀 Initializing Buyer Discovery Agent...',
        '🔍 Scanning customs registries for HS Code: 6204.62 (Women\'s Cotton Trousers)...',
        '📊 Parsing latest bills of lading for the last 6 months...',
        '🔄 Filtered 12,480 shipments. Isolating active importers in Europe and North America...',
        '💡 Match found: "Textil GmbH" (Hamburg, Germany) - 18 shipments, total 45 tons.',
        '💡 Match found: "Nordic Retailers" (Oslo, Norway) - 9 shipments, total 22 tons.',
        '💡 Match found: "Atlas Imports Inc." (New York, USA) - 34 shipments, total 88 tons.',
        '✨ Resolving corporate structures and public contact details...',
        '✅ Agent run complete. 3 high-volume buyers verified and saved to pipeline.'
      ],
      outcome: {
        title: 'Discovered Buyers (HS 6204.62)',
        type: 'table',
        data: [
          { company: 'Atlas Imports Inc.', country: 'United States', volume: '88 Tons', reliability: '94%', contact: 'procurement@atlasimports.com' },
          { company: 'Textil GmbH', country: 'Germany', volume: '45 Tons', reliability: '89%', contact: 'buying@textilgmbh.de' },
          { company: 'Nordic Retailers', country: 'Norway', volume: '22 Tons', reliability: '87%', contact: 'sourcing@nordicretailers.no' }
        ]
      }
    },
    intelligence: {
      id: 'intelligence',
      name: 'Market Intelligence Agent',
      icon: TrendingUp,
      role: 'Global Market Opportunity Evaluator',
      description: 'Analyzes tariff rates, historical trade growth, competitor presence, and pricing dynamics to score and recommend top-performing countries for your exports.',
      capabilities: [
        'Retrieves international customs tariffs and trade agreement benefits.',
        'Calculates 5-year CAGR demand trends for specific product lines.',
        'Evaluates port logistics efficiency indices and transportation costs.'
      ],
      simulationLogs: [
        '🚀 Initializing Market Intelligence Agent...',
        '📈 Fetching 5-year historical trade data for category: Agro-products (Spices)...',
        '📊 Fetching tariff rates for India → Worldwide exports...',
        '🔍 Checking regional Free Trade Agreements (FTAs) and CEPA benefits...',
        '⚡ Analyzing competitor density (major exporters: Vietnam, Madagascar)...',
        '💡 Computing Opportunity Scores based on Tariffs, Demand, and Logistics...',
        '📈 Germany: Tariff 0% (under FTA), 5-yr CAGR +6.8%, Opportunity Score: 91/100',
        '📈 UAE: Tariff 0% (CEPA), 5-yr CAGR +8.2%, Opportunity Score: 89/100',
        '📈 Japan: Tariff 4.5%, 5-yr CAGR +2.1%, Opportunity Score: 72/100',
        '✅ Market analysis complete. Germany and UAE flagged as high-potential targets.'
      ],
      outcome: {
        title: 'Top Target Export Markets',
        type: 'list',
        data: [
          { country: 'Germany', tariff: '0.0% (FTA)', growth: '+6.8% CAGR', score: 91, status: 'Highly Recommended' },
          { country: 'United Arab Emirates', tariff: '0.0% (CEPA)', growth: '+8.2% CAGR', score: 89, status: 'Highly Recommended' },
          { country: 'Japan', tariff: '4.5%', growth: '+2.1% CAGR', score: 72, status: 'Moderate Growth' }
        ]
      }
    },
    outreach: {
      id: 'outreach',
      name: 'Outreach & RFP Agent',
      icon: Mail,
      role: 'Multilingual Pitch Generator & Negotiator',
      description: 'Automatically drafts personalized B2B outreach proposals, product catalogs, and replies to RFPs tailored to local market cultures and languages.',
      capabilities: [
        'Generates hyper-personalized outreach based on buyer transaction histories.',
        'Supports native localization for European, Middle Eastern, and Asian markets.',
        'Follows professional email compliance standards (CAN-SPAM/GDPR).'
      ],
      simulationLogs: [
        '🚀 Initializing Outreach & RFP Agent...',
        '📧 Fetching buyer profile: "Textil GmbH" (Hamburg, Germany)...',
        '✍️ Analyzing history: Frequently imports organic cotton textiles from South Asia...',
        '🌐 Selecting draft language: German (Deutsch) for high response rate...',
        '📝 Generating personalized value proposition based on organic certifications...',
        '⚙️ Applying tone setting: Formal corporate partner...',
        '📧 Subject line optimized: Partnerschaftsanfrage: Bio-Baumwolltextilien direkt vom Hersteller',
        '✨ Body draft created. Checking compliance with European GDPR laws...',
        '✅ Outreach draft ready for approval.'
      ],
      outcome: {
        title: 'Generated Outreach (Deutsch)',
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
      name: 'Compliance & Customs Agent',
      icon: FileText,
      role: 'Trade Barriers & Regulations Advisor',
      description: 'Verifies customs requirements, necessary certifications, product labeling mandates, and mandatory testing protocols required for seamless entry into target countries.',
      capabilities: [
        'Cross-references target country customs protocols with your HS code.',
        'Highlights mandatory safety, agricultural, or environmental certifications.',
        'Tracks average port clearance days and regulatory risk indicators.'
      ],
      simulationLogs: [
        '🚀 Initializing Compliance & Customs Agent...',
        '📦 Target product: Spices & Condiments. Target country: Germany (EU)...',
        '🔍 Accessing European Food Safety Authority (EFSA) regulatory database...',
        '⚠️ Alert: Requires Phytosanitary Certificate issued by Indian authorities.',
        '⚠️ Alert: Maximum residue limits (MRLs) for pesticides must conform to EU Regulation (EC) 396/2005.',
        '📝 Checking labeling requirements: Must include botanical name, batch ID, and net weight in German.',
        '⚖️ Port customs procedure: Standard customs entry with document clearance. Average delay: 2 days.',
        '✅ Compliance check complete. 3 certificates required.'
      ],
      outcome: {
        title: 'EU Compliance Checklist',
        type: 'checklist',
        data: [
          { check: 'Phytosanitary Certificate', authority: 'Ministry of Agriculture, India', status: 'Required', action: 'Must apply 7 days before shipping' },
          { check: 'Pesticide MRL Test Report', authority: 'NABL Accredited Laboratory', status: 'Required', action: 'Batch sample testing mandatory' },
          { check: 'EU-Standard Bilingual Labeling', authority: 'Self-Declaration', status: 'Required', action: 'Incorporate German labels on packaging' }
        ]
      }
    },
    scoring: {
      id: 'scoring',
      name: 'Lead Scoring Agent',
      icon: CheckCircle2,
      role: 'Buyer Trust & Credit Scorer',
      description: 'Calculates propensity scores for buyers by correlating trade frequencies, order volumes, financial stability records, and historical supplier retention rates.',
      capabilities: [
        'Correlates trade frequency to identify stable, recurring importers.',
        'Performs basic business credit registry checks where available.',
        'Assigns an overall Lead Score out of 100 based on fit.'
      ],
      simulationLogs: [
        '🚀 Initializing Lead Scoring Agent...',
        '📊 Processing importer data for: "Atlas Imports Inc."...',
        '📈 Transaction history audit: 34 shipments over 12 months (Stable demand).',
        '🔄 Supplier retention analysis: Supplier longevity averages 3.2 years.',
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
          { name: 'Import Frequency', rating: 'High (Monthly)', score: 95 },
          { name: 'Shipment Volume Fit', rating: 'Optimal Match', score: 92 },
          { name: 'Financial Reliability', rating: 'Strong Credit', score: 94 },
          { name: 'Supplier Loyalty', rating: 'High Retention', score: 90 }
        ]
      }
    }
  };

  const handleStartSimulation = async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsSimulating(true);
    setSimulatedLogs([]);
    setSimulationStep(0);
    setShowOutcome(false);

    let logList = agents[activeAgent].simulationLogs;
    try {
      const res = await fetch(`https://globex-ai-2.onrender.com/api/v1/tradedata/simulation-logs/${activeAgent}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('globex_token') || ''}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success && data.data?.logs?.length > 0) {
        logList = data.data.logs;
      }
    } catch (err) {
      console.warn("Failed to fetch simulation logs, using fallback:", err);
    }

    let step = 0;

    intervalRef.current = setInterval(() => {
      if (step < logList.length) {
        setSimulatedLogs(prev => [...prev, logList[step]]);
        step++;
        setSimulationStep(step);
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsSimulating(false);
        setShowOutcome(true);
      }
    }, 850);
  };

  const SelectedIcon = agents[activeAgent].icon;

  return (
    <div className="w-full bg-[#F8FAFC] flex-1">
      {/* Main Interactive Section */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Agent Selection Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest block mb-5">
                Available Agents
              </span>
              
              <div className="flex flex-col gap-3">
                {Object.values(agents).map((agent) => {
                  const Icon = agent.icon;
                  const isActive = activeAgent === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => setActiveAgent(agent.id)}
                      className={`group flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 border ${
                        isActive 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-transparent border-transparent hover:bg-slate-50 hover:border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                        isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-blue-600 group-hover:shadow-sm'
                      }`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className={`text-[15px] font-semibold mb-0.5 ${isActive ? 'text-blue-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                          {agent.name}
                        </h3>
                        <p className={`text-[13px] line-clamp-1 ${isActive ? 'text-blue-700' : 'text-slate-500 group-hover:text-slate-600'}`}>
                          {agent.role}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trust and status card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-2">
                <Globe size={16} className="text-blue-600" />
                System Integration Status
              </h4>
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-[14px] font-medium text-slate-600">Customs Manifests</span>
                  <span className="text-[13px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Operational
                  </span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <span className="text-[14px] font-medium text-slate-600">Tariff Databases</span>
                  <span className="text-[13px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Online
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium text-slate-600">Language Translators</span>
                  <span className="text-[13px] font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> 12 Native APIs
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Active Agent Workspace */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Agent Header Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <SelectedIcon size={28} />
                </div>
                <div className="flex flex-col justify-center">
                  <h2 className="text-[22px] font-bold text-slate-900 leading-tight mb-1.5">{agents[activeAgent].name}</h2>
                  <span className="text-[13px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
                    Active Role: {agents[activeAgent].role}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleStartSimulation}
                disabled={isSimulating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-[15px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                {isSimulating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play size={18} fill="currentColor" />
                    Run Simulation
                  </>
                )}
              </button>
            </div>

            {/* Description & Capabilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-4">
                  Description
                </h4>
                <p className="text-[15px] text-slate-600 leading-relaxed flex-1">
                  {agents[activeAgent].description}
                </p>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col">
                <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest mb-4">
                  Key Capabilities
                </h4>
                <ul className="flex flex-col gap-3 flex-1">
                  {agents[activeAgent].capabilities.map((cap, index) => (
                    <li key={index} className="flex items-start gap-3 text-[15px] text-slate-600 leading-relaxed">
                      <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interactive Terminal Console */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden flex flex-col shadow-lg mt-2">
              <div className="flex items-center justify-between bg-slate-800/80 px-5 py-3 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Terminal size={16} className="text-slate-400" />
                  <span className="text-[13px] font-mono font-medium text-slate-300">agent_simulation_terminal.log</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-500" />
                </div>
              </div>

              <div className="p-6 font-mono text-[14px] min-h-[220px] max-h-[320px] overflow-y-auto flex flex-col gap-2 bg-slate-900 text-slate-300">
                {simulatedLogs.length === 0 ? (
                  <div className="text-slate-500 italic flex items-center justify-center h-[160px]">
                    Click "Run Simulation" above to watch the agent perform operations.
                  </div>
                ) : (
                  simulatedLogs.map((log, index) => (
                    <div 
                      key={index}
                      className={`leading-relaxed border-l-2 pl-4 py-0.5 ${
                        log && log.startsWith('🚀') ? 'text-blue-400 border-blue-400' :
                        log && log.startsWith('✅') ? 'text-emerald-400 border-emerald-400' :
                        log && log.startsWith('⚠️') ? 'text-amber-400 border-amber-400' :
                        'text-slate-300 border-slate-700'
                      }`}
                    >
                      {log}
                    </div>
                  ))
                )}
                {isSimulating && (
                  <div className="flex items-center gap-3 text-slate-400 pl-4 mt-2 border-l-2 border-slate-800">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Executing pipeline segment...</span>
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>

            {/* Outcome Display (Triggered after simulation finishes) */}
            {showOutcome && (
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-fade-in flex flex-col gap-6 mt-2">
                <h3 className="text-[18px] font-bold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-3">
                  <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  Simulation Result: {agents[activeAgent].outcome.title}
                </h3>

                {/* Outcome rendering depends on activeAgent outcome type */}
                
                {/* 1. TABLE Outcome */}
                {agents[activeAgent].outcome.type === 'table' && (
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left border-collapse text-[14px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="font-semibold text-slate-600 p-4">Importer Company</th>
                          <th className="font-semibold text-slate-600 p-4">Country</th>
                          <th className="font-semibold text-slate-600 p-4">Est. Import Volume</th>
                          <th className="font-semibold text-slate-600 p-4">Reliability Score</th>
                          <th className="font-semibold text-slate-600 p-4">Verified Contact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agents[activeAgent].outcome.data.map((row, idx) => (
                          <tr key={idx} className="border-b border-slate-100 last:border-none hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 font-semibold text-slate-900">{row.company}</td>
                            <td className="p-4 text-slate-600">{row.country}</td>
                            <td className="p-4 text-slate-600">{row.volume}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {row.reliability}
                              </span>
                            </td>
                            <td className="p-4 text-slate-500 font-mono text-[13px]">{row.contact}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. LIST Outcome */}
                {agents[activeAgent].outcome.type === 'list' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {agents[activeAgent].outcome.data.map((row, idx) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4 hover:border-slate-300 transition-colors">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-[16px] text-slate-900">{row.country}</span>
                          <span className="text-[12px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                            Score: {row.score}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between text-[14px]">
                            <span className="text-slate-500">Import Tariff:</span>
                            <span className="font-medium text-slate-900">{row.tariff}</span>
                          </div>
                          <div className="flex justify-between text-[14px]">
                            <span className="text-slate-500">5-Yr CAGR:</span>
                            <span className="font-medium text-slate-900">{row.growth}</span>
                          </div>
                        </div>
                        <div className="mt-auto text-center text-[12px] font-bold text-emerald-700 bg-emerald-50 py-2 rounded-lg border border-emerald-200">
                          {row.status}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. EMAIL Outcome */}
                {agents[activeAgent].outcome.type === 'email' && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                      <div className="text-[14px] text-slate-600 font-mono">
                        <span className="font-semibold text-slate-900">Subject: </span>
                        {agents[activeAgent].outcome.subject}
                      </div>
                    </div>
                    <div className="p-6 text-[14px] font-mono whitespace-pre-wrap leading-relaxed text-slate-700 max-h-[300px] overflow-y-auto">
                      {agents[activeAgent].outcome.body}
                    </div>
                  </div>
                )}

                {/* 4. CHECKLIST Outcome */}
                {agents[activeAgent].outcome.type === 'checklist' && (
                  <div className="flex flex-col gap-4">
                    {agents[activeAgent].outcome.data.map((row, idx) => (
                      <div key={idx} className="flex items-start gap-4 border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
                        <div className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 mt-0.5 shrink-0 border border-emerald-100">
                          <Check size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-[15px] font-bold text-slate-900">{row.check}</h4>
                            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                              {row.status}
                            </span>
                          </div>
                          <p className="text-[13px] text-slate-500 mb-3">Authority: {row.authority}</p>
                          <div className="text-[13px] font-medium text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 inline-block">
                            Required Action: {row.action}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 5. SCORING Outcome */}
                {agents[activeAgent].outcome.type === 'scoring' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    <div className="md:col-span-4 flex flex-col items-center justify-center border border-slate-200 rounded-xl p-8 bg-white shadow-sm text-center">
                      <span className="text-[13px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Overall Fit Score</span>
                      <div className="text-6xl font-black text-blue-600 my-4">{agents[activeAgent].outcome.score}</div>
                      <span className="text-[13px] font-bold text-emerald-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200">
                        Tier-1 Match
                      </span>
                    </div>

                    <div className="md:col-span-8 flex flex-col justify-center gap-5 border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
                      <h4 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest">Capability Breakdown</h4>
                      <div className="flex flex-col gap-4">
                        {agents[activeAgent].outcome.metrics.map((row, idx) => (
                          <div key={idx}>
                            <div className="flex justify-between text-[14px] text-slate-700 mb-2">
                              <span className="font-semibold">{row.name}</span>
                              <span className="font-medium text-slate-500">{row.rating} ({row.score}/100)</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                              <div 
                                className="bg-blue-600 h-full rounded-full transition-all duration-700 ease-out" 
                                style={{ width: `${row.score}%` }} 
                              />
                            </div>
                          </div>
                        ))}
                      </div>
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
