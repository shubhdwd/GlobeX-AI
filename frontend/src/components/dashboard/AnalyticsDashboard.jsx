import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Globe2, Activity, PieChart, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AnalyticsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // AI Report Generation States
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportStep, setReportStep] = useState(0);

  const { token } = useAuth();

  const reportSteps = [
    'Aggregating business analytics...',
    'Querying trade flow databases...',
    'Analyzing sales pipeline...',
    'Synthesizing insights report...',
    'Finalizing formatted summary...'
  ];

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/dashboard', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Failed to fetch analytics');
      
      setData(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboard();
    }
  }, [token]);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    setReportStep(0);

    const interval = setInterval(() => {
      setReportStep(prev => (prev < reportSteps.length - 1 ? prev + 1 : prev));
    }, 1000);

    try {
      // Prompt LLM to retrieve trade analytics summary
      const res = await fetch('https://globex-ai-2.onrender.com/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: 'Generate a short summary report of top performing export markets for India.' })
      });

      const json = await res.json();
      clearInterval(interval);

      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to generate report');
      }

      // Re-fetch dashboard data to refresh UI KPIs
      await fetchDashboard();
      
      alert(json.data?.response || 'Analytics report generated successfully!');
    } catch (err) {
      clearInterval(interval);
      alert(err.message || 'Error occurred while generating analytics report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] animate-fade-in">
        <Loader2 className="animate-spin text-[#2563EB] mb-4" size={40} />
        <p className="text-[#64748B] font-medium">Aggregating business analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-120px)] animate-fade-in text-center p-8">
        <AlertCircle className="text-[#EF4444] mb-4" size={48} />
        <h3 className="text-xl font-bold text-[#0F172A] mb-2">Analytics Error</h3>
        <p className="text-[#64748B] max-w-md">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-6 px-4 py-2 bg-[#F1F5F9] text-[#334155] rounded-lg text-sm font-medium hover:bg-[#E2E8F0]">
          Retry Loading
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { overview = {}, pipeline = [], topCountries = [], recentLeads = [] } = data;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12 relative">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Business Analytics</h2>
          <p className="text-sm text-[#64748B] mt-1">Export trends, revenue pipeline, and market performance.</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-[#E2E8F0] text-[#334155] text-sm rounded-lg focus:ring-[#2563EB] focus:border-[#2563EB] block p-2">
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button 
            onClick={handleGenerateReport}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <BarChart3 size={16} />
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#EFF6FF] text-[#2563EB] rounded-full flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <h3 className="text-[#64748B] text-sm font-medium">Total Buyers Found</h3>
            <p className="text-2xl font-bold text-[#0F172A]">{overview.buyersFound || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ECFDF5] text-[#10B981] rounded-full flex items-center justify-center shrink-0">
            <Globe2 size={24} />
          </div>
          <div>
            <h3 className="text-[#64748B] text-sm font-medium">Countries Analyzed</h3>
            <p className="text-2xl font-bold text-[#0F172A]">{overview.countriesAnalyzed || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FFFBEB] text-[#F59E0B] rounded-full flex items-center justify-center shrink-0">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-[#64748B] text-sm font-medium">Active Leads</h3>
            <p className="text-2xl font-bold text-[#0F172A]">{overview.activeLeads || 0}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#FDF4FF] text-[#C026D3] rounded-full flex items-center justify-center shrink-0">
            <TrendingUp size={24} />
          </div>
          <div>
            <h3 className="text-[#64748B] text-sm font-medium">Avg Lead Score</h3>
            <p className="text-2xl font-bold text-[#0F172A]">{overview.avgLeadScore || 0}/100</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales Pipeline */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
              <PieChart size={18} className="text-[#2563EB]" />
              Lead Pipeline
            </h3>
          </div>
          <div className="flex-1 flex flex-col justify-center gap-4">
            {pipeline.length === 0 ? (
              <p className="text-center text-[#64748B] text-sm py-8">No pipeline data available.</p>
            ) : (
              pipeline.map((stage, idx) => {
                const total = Math.max(pipeline.reduce((acc, curr) => acc + curr.count, 0), 1);
                const percent = Math.round((stage.count / total) * 100);
                return (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-[#334155]">{stage.status}</span>
                      <span className="font-bold text-[#0F172A]">{stage.count} ({percent}%)</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div className="h-full bg-[#2563EB] rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Performing Countries */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
              <Globe2 size={18} className="text-[#10B981]" />
              Top Export Markets
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            {topCountries.length === 0 ? (
              <p className="text-center text-[#64748B] text-sm py-8">No market data available.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="pb-2 text-xs font-bold text-[#64748B] uppercase">Market</th>
                    <th className="pb-2 text-xs font-bold text-[#64748B] uppercase text-right">Demand Score</th>
                  </tr>
                </thead>
                <tbody>
                  {topCountries.map((c, idx) => (
                    <tr key={idx} className="border-b border-[#F1F5F9] last:border-0">
                      <td className="py-3 text-sm font-medium text-[#0F172A]">{c.country}</td>
                      <td className="py-3 text-sm font-bold text-right text-[#10B981]">{c.demandScore}/100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {generatingReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-6 border border-[#E2E8F0] text-center">
            <Loader2 className="animate-spin text-[#2563EB] mx-auto mb-4" size={40} />
            <p className="text-[#0F172A] font-bold text-lg mb-2">Generating AI Report</p>
            <p className="text-[#2563EB] text-sm font-medium animate-pulse">{reportSteps[reportStep]}</p>
          </div>
        </div>
      )}
    </div>
  );
}
