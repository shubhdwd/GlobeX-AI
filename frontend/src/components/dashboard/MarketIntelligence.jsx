import React, { useState, useEffect } from 'react';
import { Globe2, TrendingUp, AlertTriangle, FileCheck, CheckCircle2, Loader2, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function MarketIntelligence() {
  const [recommendations, setRecommendations] = useState([]);
  const [compliance, setCompliance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingCompliance, setLoadingCompliance] = useState(false);
  const [error, setError] = useState(null);
  const [complianceError, setComplianceError] = useState(null);

  // Modal and Analyzing States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hsCode, setHsCode] = useState('090111');
  const [productName, setProductName] = useState('Coffee beans');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState(0);

  const { token } = useAuth();

  const analyzingSteps = [
    'Understanding HS Code...',
    'Searching Global Trade Databases...',
    'Analyzing Market Opportunities...',
    'Calculating Average Tariffs...',
    'Formulating AI Recommendations...'
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/tradedata/destinations?limit=5', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch market data');
      
      const dests = data.data || [];
      setRecommendations(dests);
      
      if (dests.length > 0) {
        fetchCompliance(dests[0].countryCode || dests[0].country);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchCompliance = async (country) => {
    setLoadingCompliance(true);
    setComplianceError(null);
    try {
      const res = await fetch(`https://globex-ai-2.onrender.com/api/v1/compliance/${country}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch compliance data');
      
      setCompliance(data.data);
    } catch (err) {
      setComplianceError(err.message);
    } finally {
      setLoadingCompliance(false);
    }
  };

  const handleRunHSCodeAnalysis = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setAnalyzingStep(0);

    const interval = setInterval(() => {
      setAnalyzingStep(prev => (prev < analyzingSteps.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const promptText = `Analyze HS Code ${hsCode} market opportunities for ${productName}.`;
      
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
        throw new Error(json.message || 'Failed to analyze HS code');
      }

      // Try to parse opportunities from market_research or expansion_analysis tool
      const toolResults = json.data?.tool_results || {};
      const opportunities = toolResults.market_research?.opportunities || 
                            toolResults.expansion_analysis?.top_markets || [];

      if (opportunities.length > 0) {
        const formatted = opportunities.map((opp, idx) => ({
          country: opp.country || 'Target Market',
          countryCode: opp.countryCode || 'DE',
          demandScore: opp.demandScore || 85,
          avgTariff: opp.avgTariff || 5.5,
          growthRate: opp.growthRate || '+12%',
          competition: opp.competition || 'Medium'
        }));
        setRecommendations(formatted);
        
        // Fetch compliance for the first country
        fetchCompliance(formatted[0].countryCode || formatted[0].country);
      } else {
        // Fallback
        fetchData();
      }
      setIsModalOpen(false);
    } catch (err) {
      clearInterval(interval);
      alert(err.message || 'Error occurred during analysis.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDownloadChecklist = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Market Intelligence</h2>
          <p className="text-sm text-[#64748B] mt-1">Discover optimal export destinations and compliance requirements.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          <Globe2 size={16} />
          Analyze New HS Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Recommendations */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-[#0F172A]">AI Market Recommendations</h3>
            <p className="text-xs text-[#64748B] mt-1">Based on global trade data analysis</p>
          </div>
          
          <div className="p-0 flex-1 overflow-x-auto relative">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                <Loader2 className="animate-spin text-[#2563EB] mb-2" size={32} />
                <p className="text-[#64748B] text-sm">Processing trade datasets...</p>
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="text-[#EF4444] mb-2" size={32} />
                <p className="text-[#0F172A] font-medium">{error}</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Target Market</th>
                    <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Opportunity Score</th>
                    <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Avg Tariff</th>
                    <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Growth & Comp</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((rec, i) => (
                    <tr 
                      key={i} 
                      className={`border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer ${compliance?.country === rec.country ? 'bg-[#EFF6FF]' : ''}`}
                      onClick={() => fetchCompliance(rec.countryCode || rec.country)}
                    >
                      <td className="px-5 py-4 text-sm font-bold text-[#0F172A]">
                        <span className="mr-2" title={rec.country}>{rec.countryCode === 'US' ? '🇺🇸' : rec.countryCode === 'DE' ? '🇩🇪' : rec.countryCode === 'FR' ? '🇫🇷' : rec.countryCode === 'IN' ? '🇮🇳' : rec.countryCode === 'JP' ? '🇯🇵' : '🌍'}</span>
                        {rec.country}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${rec.demandScore > 80 ? 'bg-[#10B981]' : rec.demandScore > 50 ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`} style={{ width: `${Math.min(rec.demandScore, 100)}%` }} />
                          </div>
                          <span className={`text-xs font-bold ${rec.demandScore > 80 ? 'text-[#10B981]' : rec.demandScore > 50 ? 'text-[#F59E0B]' : 'text-[#EF4444]'}`}>{rec.demandScore}/100</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#334155]">{rec.avgTariff}%</td>
                      <td className="px-5 py-4 text-sm">
                        <div className="flex flex-col">
                          <span className="text-[#10B981] font-medium">{rec.growthRate}</span>
                          <span className="text-xs text-[#64748B]">{rec.competition} Competition</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Compliance Snapshot */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col min-h-[400px] relative">
          <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#FDF4FF]">
            <h3 className="font-bold text-[#0F172A] text-sm">
              {compliance ? `${compliance.country} Compliance` : 'Compliance'}
            </h3>
            <FileCheck size={18} className="text-[#C026D3]" />
          </div>
          
          <div className="p-5 flex-1 flex flex-col gap-4 bg-white overflow-y-auto">
            {loadingCompliance ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="animate-spin text-[#C026D3] mb-2" size={32} />
                <p className="text-[#64748B] text-sm font-medium">Loading compliance data...</p>
              </div>
            ) : complianceError ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertTriangle className="text-[#F59E0B] mb-2" size={32} />
                <p className="text-[#0F172A] font-medium text-sm">{complianceError}</p>
                <p className="text-xs text-[#64748B] mt-2">No compliance data available for this market yet.</p>
              </div>
            ) : compliance && compliance.requirements ? (
              <>
                {compliance.requirements.slice(0, 5).map((req, i) => (
                  <div key={i} className="flex items-start gap-3">
                    {req.isRequired ? (
                      <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-[#0F172A]">{req.documentName}</p>
                      <p className="text-xs text-[#64748B] line-clamp-2">{req.description}</p>
                    </div>
                  </div>
                ))}
                
                {compliance.requirements.length > 5 && (
                  <p className="text-xs text-[#64748B] text-center mt-2 italic">
                    + {compliance.requirements.length - 5} more requirements
                  </p>
                )}
                
                <div className="mt-auto pt-4">
                  <button onClick={handleDownloadChecklist} className="w-full py-2.5 bg-[#FDF4FF] hover:bg-[#FAE8FF] text-[#C026D3] border border-[#F5D0FE] text-sm font-medium rounded-lg transition-colors flex justify-center items-center gap-2 shadow-sm">
                    <FileCheck size={16} />
                    Download Full Checklist
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-[#64748B]">
                <p className="text-sm">Select a market to view compliance requirements</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* HS Code Analysis Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-slide-up border border-[#E2E8F0]">
            <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                <Globe2 className="text-[#2563EB]" /> Analyze HS Code
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#0F172A]"
                disabled={analyzing}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleRunHSCodeAnalysis} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">HS Code</label>
                <input 
                  type="text" 
                  value={hsCode}
                  onChange={(e) => setHsCode(e.target.value)}
                  placeholder="e.g. 090111"
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  required
                  disabled={analyzing}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#475569] uppercase tracking-wider mb-2">Product Name</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Coffee beans"
                  className="w-full px-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB]"
                  required
                  disabled={analyzing}
                />
              </div>

              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F8FAFC] rounded-lg transition-colors"
                  disabled={analyzing}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  disabled={analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze opportunities'
                  )}
                </button>
              </div>
            </form>

            {analyzing && (
              <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-6 z-20">
                <Loader2 className="animate-spin text-[#2563EB] mb-4" size={40} />
                <p className="text-[#0F172A] font-bold text-lg mb-2">Market Intelligence Analysis</p>
                <p className="text-[#2563EB] text-sm font-medium animate-pulse">{analyzingSteps[analyzingStep]}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
