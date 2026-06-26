import React, { useState, useEffect } from 'react';
import { 
  Globe2, 
  TrendingUp, 
  Target, 
  ShieldCheck, 
  Search, 
  BarChart3, 
  MapPin, 
  Plus,
  Loader2,
  AlertCircle,
  X,
  Map,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function GlobalExpansion() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal & AI States
  const [isAnalysisModalOpen, setIsAnalysisModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [product, setProduct] = useState('Coffee');
  const [targetRegion, setTargetRegion] = useState('Germany');
  
  const [runningAnalysis, setRunningAnalysis] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [executionPlan, setExecutionPlan] = useState('');
  const [loadingPlan, setLoadingPlan] = useState(false);

  const { token } = useAuth();

  const analysisSteps = [
    'Analyzing Global Trade Flows...',
    'Evaluating Tariff Schedules...',
    'Assessing Regional Competition...',
    'Scoring Market Opportunities...',
    'Formulating Expansion Strategy...'
  ];

  const fetchOpportunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/market/opportunities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch opportunities');
      
      setOpportunities(data.data?.opportunities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOpportunities();
    }
  }, [token]);

  const handleRunAnalysis = async (e) => {
    e.preventDefault();
    setRunningAnalysis(true);
    setAnalysisStep(0);

    const interval = setInterval(() => {
      setAnalysisStep(prev => (prev < analysisSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const promptText = `Generate an expansion strategy for Indian ${product} exporters targeting ${targetRegion}.`;
      
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: promptText })
      });

      const json = await res.json();
      clearInterval(interval);

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to analyze markets');
      }

      // Try to parse opportunities from expansion_analysis tool
      const toolResults = json.data?.tool_results || {};
      const markets = toolResults.expansion_analysis?.top_markets || [];

      if (markets.length > 0) {
        const formatted = markets.map((opp, idx) => ({
          id: opp.id || `opp-ai-${idx}`,
          country: opp.country || targetRegion,
          countryCode: opp.countryCode || 'DE',
          demandScore: opp.demandScore || 90,
          growthRate: opp.growthRate || '+15%',
          competition: opp.competition || 'Medium',
          marketSize: opp.marketSize || '$1.2B',
          trend: opp.trend || 'Growing',
          insights: opp.insights || `Strong demand for ${product} exports from India.`
        }));
        setOpportunities(formatted);
      } else {
        // Fallback
        fetchOpportunities();
      }
      setIsAnalysisModalOpen(false);
    } catch (err) {
      clearInterval(interval);
      alert(err.message || 'Error occurred during market analysis.');
    } finally {
      setRunningAnalysis(false);
    }
  };

  const handleGeneratePlan = async () => {
    setLoadingPlan(true);
    setIsPlanModalOpen(true);
    try {
      const targetCountry = opportunities[0]?.country || 'Germany';
      const promptText = `Create a step-by-step export execution plan for Indian ${product} exports to ${targetCountry}.`;
      
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: promptText })
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to generate execution plan');
      }

      setExecutionPlan(json.data?.response || 'Failed to retrieve AI execution plan.');
    } catch (err) {
      setExecutionPlan(`Error: ${err.message}`);
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Global Expansion Strategy</h2>
          <p className="text-sm text-[#64748B] mt-1">Discover new markets and AI-recommended expansion opportunities.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsMapModalOpen(true)}
            className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-2"
          >
            <Map size={16} /> View World Map
          </button>
          <button 
            onClick={() => setIsAnalysisModalOpen(true)}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> New Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Target Markets */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col min-h-[500px] relative">
            <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex justify-between items-center">
              <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                <Target size={18} className="text-[#2563EB]" />
                Recommended Markets
              </h3>
              <button className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]">Filter Regions</button>
            </div>

            <div className="flex-1 p-5 flex flex-col gap-4 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="animate-spin text-[#2563EB] mb-2" size={32} />
                  <p className="text-[#64748B] text-sm">Analyzing global markets...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <AlertCircle className="text-[#EF4444] mb-2" size={32} />
                  <p className="text-[#0F172A] font-medium">{error}</p>
                  <button onClick={fetchOpportunities} className="mt-4 text-[#2563EB] text-sm hover:underline">Try Again</button>
                </div>
              ) : opportunities.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-white">
                  <Globe2 className="text-[#94A3B8] mb-3" size={48} />
                  <h4 className="text-lg font-semibold text-[#0F172A]">No Opportunities Found</h4>
                  <p className="text-[#64748B] text-sm mt-1 max-w-sm">Run a new AI market analysis to discover potential export destinations.</p>
                  <button 
                    onClick={() => setIsAnalysisModalOpen(true)}
                    className="mt-4 bg-[#EFF6FF] text-[#2563EB] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#DBEAFE] transition-colors"
                  >
                    Run Analysis
                  </button>
                </div>
              ) : (
                opportunities.map((opp) => (
                  <div key={opp.id} className="border border-[#E2E8F0] rounded-xl p-5 hover:border-[#2563EB] hover:shadow-md transition-all group bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl" title={opp.country}>{opp.countryCode === 'US' ? '🇺🇸' : opp.countryCode === 'DE' ? '🇩🇪' : opp.countryCode === 'FR' ? '🇫🇷' : opp.countryCode === 'IN' ? '🇮🇳' : opp.countryCode === 'JP' ? '🇯🇵' : '🌍'}</div>
                        <div>
                          <h4 className="font-bold text-[#0F172A] text-lg group-hover:text-[#2563EB] transition-colors">{opp.country}</h4>
                          <p className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                            <MapPin size={12} /> {opp.marketSize || 'N/A'} Market Size
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          opp.demandScore > 80 ? 'bg-[#D1FAE5] text-[#059669]' : 
                          opp.demandScore > 50 ? 'bg-[#FEF3C7] text-[#D97706]' : 
                          'bg-[#FEE2E2] text-[#DC2626]'
                        }`}>
                          {opp.demandScore}/100 Score
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                        <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Growth Rate</p>
                        <p className="text-sm font-semibold text-[#0F172A] flex items-center gap-1">
                          <TrendingUp size={14} className="text-[#10B981]"/> {opp.growthRate}
                        </p>
                      </div>
                      <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                        <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Competition</p>
                        <p className="text-sm font-semibold text-[#0F172A]">{opp.competition}</p>
                      </div>
                      <div className="bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                        <p className="text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Market Trend</p>
                        <p className="text-sm font-semibold text-[#0F172A] capitalize">{opp.trend || 'Stable'}</p>
                      </div>
                    </div>

                    {opp.insights && (
                      <div className="text-sm text-[#475569] bg-[#EFF6FF] p-3 rounded-lg border border-[#BFDBFE]">
                        <span className="font-semibold text-[#1D4ED8]">AI Insight:</span> {opp.insights}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Tools & Quick Stats */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A]">Expansion Toolkit</h3>
            </div>
            <div className="p-3 flex flex-col gap-1">
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group cursor-pointer">
                <div className="bg-[#EFF6FF] p-2 rounded-md text-[#2563EB] group-hover:bg-[#DBEAFE] transition-colors">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#0F172A]">Market Intelligence</p>
                  <p className="text-xs text-[#64748B]">Deep dive into demographics</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group cursor-pointer">
                <div className="bg-[#FDF4FF] p-2 rounded-md text-[#C026D3] group-hover:bg-[#FAE8FF] transition-colors">
                  <Globe2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#0F172A]">Trade Barriers</p>
                  <p className="text-xs text-[#64748B]">Analyze tariffs and quotas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group cursor-pointer">
                <div className="bg-[#FFFBEB] p-2 rounded-md text-[#D97706] group-hover:bg-[#FEF3C7] transition-colors">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#0F172A]">Risk Assessment</p>
                  <p className="text-xs text-[#64748B]">Political and economic risks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-xl shadow-md p-6 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 text-white/5 pointer-events-none">
              <Globe2 size={160} />
            </div>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2">Ready to launch?</h3>
              <p className="text-sm text-[#94A3B8] mb-6">Our AI Copilot can generate a complete step-by-step export execution plan for your top market.</p>
              <button 
                onClick={handleGeneratePlan}
                className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                Generate Execution Plan
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* New Analysis Modal */}
      {isAnalysisModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Target className="text-[#2563EB]" /> Run Market Analysis
              </h3>
              <button 
                onClick={() => setIsAnalysisModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
                disabled={runningAnalysis}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRunAnalysis} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Product to Export</label>
                <input 
                  type="text" 
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  placeholder="e.g. Spices or Coffee"
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  required
                  disabled={runningAnalysis}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Target Market / Region</label>
                <input 
                  type="text" 
                  value={targetRegion}
                  onChange={(e) => setTargetRegion(e.target.value)}
                  placeholder="e.g. Germany or USA"
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  required
                  disabled={runningAnalysis}
                />
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsAnalysisModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                  disabled={runningAnalysis}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  disabled={runningAnalysis}
                >
                  {runningAnalysis ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Run Analysis'
                  )}
                </button>
              </div>
            </form>

            {runningAnalysis && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 z-20">
                <Loader2 className="animate-spin text-[#2563EB] mb-4" size={40} />
                <p className="text-[#0F172A] font-bold text-lg mb-2">Global Trade Analysis Active</p>
                <p className="text-[#2563EB] text-sm font-medium animate-pulse">{analysisSteps[analysisStep]}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Execution Plan Modal */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-slide-up border border-[#E2E8F0] flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <FileCheck className="text-[#2563EB]" /> Export Execution Plan
              </h3>
              <button 
                onClick={() => setIsPlanModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 text-[#334155]">
              {loadingPlan ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="animate-spin text-[#2563EB] mb-4" size={40} />
                  <p className="text-sm text-[#64748B]">Synthesizing market entry directives...</p>
                </div>
              ) : (
                <div className="prose max-w-none whitespace-pre-line text-sm leading-relaxed">
                  {executionPlan}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-[#E2E8F0] flex justify-end">
              <button 
                onClick={() => setIsPlanModalOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
              >
                Close Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* World Map Modal */}
      {isMapModalOpen && (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl overflow-hidden animate-slide-up border border-[#E2E8F0] flex flex-col">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Globe2 className="text-[#2563EB]" /> World Expansion Map
              </h3>
              <button onClick={() => setIsMapModalOpen(false)} className="text-[#64748B] hover:text-[#0F172A]">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 bg-slate-50 flex items-center justify-center min-h-[400px] border-b border-[#E2E8F0] relative">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-blue-100 text-blue-600 mb-4 animate-bounce">
                  <Globe2 size={48} />
                </div>
                <h4 className="text-lg font-bold text-slate-800">Bilateral Export Map</h4>
                <p className="text-sm text-slate-500 max-w-md mt-2">Displaying trade corridors, average freight routes, and regional tariffs from India.</p>
                <div className="mt-8 flex gap-4 justify-center text-xs font-semibold">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#10B981]" /> High Demand Corridor</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#F59E0B]" /> Moderate Demand</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#EF4444]" /> Trade Restrictions</span>
                </div>
              </div>
            </div>

            <div className="p-6 flex justify-end">
              <button 
                onClick={() => setIsMapModalOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors"
              >
                Close Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
