import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, FileText, Activity, ArrowUpRight, Package, 
  Globe2, Clock, Target, Search, X, ArrowRight, Loader2, Database, BarChart3, Newspaper, Sparkles
} from 'lucide-react';
import { Joyride, STATUS } from 'react-joyride';
import { useAuth } from '../../context/AuthContext';
import { mockDashboardSummary } from '../../lib/mockData';

export default function DashboardHome({ onNavigate }) {
  const { user, token } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'Exporter';
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Joyride State
  const [runTour, setRunTour] = useState(false);
  const [tourSteps] = useState([
    {
      target: '.tour-step-1',
      content: 'Welcome to GlobeX AI! This Executive Summary gives you an instant, AI-generated snapshot of your best export opportunities.',
      placement: 'bottom',
      disableBeacon: true,
    },
    {
      target: '.tour-step-2',
      content: 'Here are your top-level metrics. We analyze millions of data points to calculate your global opportunity score.',
      placement: 'bottom',
    },
    {
      target: '.tour-step-3',
      content: 'Jump straight into AI market analysis to find new countries to export to.',
      placement: 'left',
    },
    {
      target: '.tour-step-4',
      content: 'Stay updated with real-time geopolitical and trade news that could affect your supply chain.',
      placement: 'left',
    }
  ]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setData(mockDashboardSummary);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
        // Only run tour if it's their first time
        if (!localStorage.getItem('globex_tour_completed')) {
          setTimeout(() => setRunTour(true), 1000);
        }
      }
    };
    if (token) fetchDashboard();
  }, [token]);

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem('globex_tour_completed', 'true');
      setRunTour(false);
    }
  };

  const handleRecentSearch = (queryText) => {
    localStorage.setItem('copilotPendingQuery', queryText);
    if (onNavigate) onNavigate('copilot');
  };

  const overview = data?.overview || { avgLeadScore: 0, buyersFound: 0, productsRegistered: 0 };
  const topCountry = data?.topCountries?.[0]?.country || 'Germany';

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#2563EB',
            textColor: '#0F172A',
            zIndex: 1000,
          }
        }}
      />
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Welcome back, {userName} 👋</h2>
          <p className="text-sm text-[#64748B] mt-1">Here is what's happening with your global trade operations today.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]">
            Download Report
          </button>
          <button onClick={() => { if (onNavigate) onNavigate('global-expansion'); }} className="tour-step-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-500/20">
            Analyze New Market
          </button>
        </div>
      </div>

      {/* AI Executive Summary Widget */}
      <div className="tour-step-1 bg-gradient-to-r from-[#EFF6FF] to-[#F8FAFC] border border-[#BFDBFE] rounded-xl p-5 shadow-sm flex gap-4 items-start">
        <div className="w-10 h-10 rounded-full bg-[#2563EB] text-white flex flex-shrink-0 items-center justify-center shadow-md">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-[#1E3A8A] mb-1 flex items-center gap-2">
            AI Executive Summary
          </h3>
          <p className="text-sm text-[#334155] leading-relaxed">
            Your best opportunity right now is exporting <strong>Coffee to Germany</strong> due to a recent 12% drop in tariffs and high buyer intent. We recommend running a new Buyer Discovery scan in the EU region to capture this demand.
          </p>
        </div>
      </div>

      {/* Top Metrics */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin text-[#2563EB]" size={32} />
        </div>
      ) : (
        <div className="tour-step-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
                <Target size={20} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-md border border-[#D1FAE5]">
                <TrendingUp size={12} /> High
              </span>
            </div>
            <h3 className="text-[#64748B] text-sm font-medium">Global Opportunity Score</h3>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">{overview.avgLeadScore}/100</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FDF4FF] flex items-center justify-center text-[#C026D3]">
                <Users size={20} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-md border border-[#D1FAE5]">
                <TrendingUp size={12} /> Live
              </span>
            </div>
            <h3 className="text-[#64748B] text-sm font-medium">Discovered Buyers</h3>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">{overview.buyersFound}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] flex items-center justify-center text-[#D97706]">
                <FileText size={20} />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-md border border-[#D1FAE5]">
                <TrendingUp size={12} /> Syncing
              </span>
            </div>
            <h3 className="text-[#64748B] text-sm font-medium">Products Registered</h3>
            <p className="text-2xl font-bold text-[#0F172A] mt-1">{overview.productsRegistered}</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
                <Globe2 size={20} />
              </div>
            </div>
            <h3 className="text-[#64748B] text-sm font-medium">Top Recommended Market</h3>
            <p className="text-2xl font-bold text-[#0F172A] mt-1 truncate">{topCountry}</p>
          </div>
        </div>
      )}

      {/* Dataset Statistics (GlobeX AI Knowledge Base) */}
      {!loading && data?.datasetStats && (
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Database size={120} />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Database className="text-[#38BDF8]" size={20} />
              <h3 className="text-lg font-bold text-white">GlobeX Trade Intelligence Engine</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[#94A3B8] text-sm font-medium">Bilateral Trade Records</p>
                <p className="text-2xl font-bold text-white mt-1">{data.datasetStats.tradeFlowRecords?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-sm font-medium">World Trade Entries</p>
                <p className="text-2xl font-bold text-white mt-1">{data.datasetStats.worldTradeRecords?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-sm font-medium">Countries Indexed</p>
                <p className="text-2xl font-bold text-white mt-1">{data.datasetStats.countriesCovered}</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-sm font-medium">Historical Data Range</p>
                <p className="text-2xl font-bold text-[#38BDF8] mt-1">{data.datasetStats.yearsRange}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Activity */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                <Activity size={18} className="text-[#2563EB]" />
                Recent AI Analyses
              </h3>
              <button onClick={() => onNavigate?.('copilot')} className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]">View History</button>
            </div>
            <div className="flex flex-col">
              {[
                { title: "Coffee Export Feasibility to EU", type: "Expansion Strategy", time: "2 hours ago", status: "Complete" },
                { title: "Tariff Analysis: Spice Exports to USA", type: "Market Intelligence", time: "5 hours ago", status: "Complete" },
                { title: "Automotive Parts Buyers in Japan", type: "Buyer Discovery", time: "1 day ago", status: "Complete" },
              ].map((analysis, i) => (
                <div key={i} className="flex items-center justify-between p-5 border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-[14px] text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{analysis.title}</span>
                    <div className="flex items-center gap-2 text-[12px] text-[#64748B]">
                      <span className="bg-[#E2E8F0] px-2 py-0.5 rounded text-[#475569]">{analysis.type}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {analysis.time}</span>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-[#94A3B8] group-hover:text-[#2563EB]" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
            <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                <Activity size={18} className="text-[#10B981]" />
                System Notifications
              </h3>
            </div>
            <div className="p-5 flex-1 flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={14} className="text-[#2563EB]" />
                </div>
                <div>
                  <p className="text-[14px] text-[#334155]"><strong>Buyer Discovery Agent</strong> found 3 new high-probability importers in the EU for HS Code 6204.62.</p>
                  <p className="text-[12px] text-[#94A3B8] mt-1">10 minutes ago</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#FDF4FF] flex items-center justify-center shrink-0 mt-0.5">
                  <FileText size={14} className="text-[#C026D3]" />
                </div>
                <div>
                  <p className="text-[14px] text-[#334155]"><strong>Compliance Agent</strong> flagged a new mandatory phytosanitary certificate requirement for Germany.</p>
                  <p className="text-[12px] text-[#94A3B8] mt-1">2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: News & Quick Actions */}
        <div className="flex flex-col gap-6">
          
          {/* Trade News Widget */}
          <div className="tour-step-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
            <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
                <Newspaper size={18} className="text-[#D97706]" />
                Global Trade Pulse
              </h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex flex-col gap-1 cursor-pointer group">
                <span className="text-[10px] font-bold text-[#D97706] uppercase tracking-wider">Geopolitics • 2h ago</span>
                <p className="text-[13px] font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">EU Carbon Border Tax goes into effect, impacting steel and cement exports.</p>
              </div>
              <div className="w-full h-px bg-[#F1F5F9]"></div>
              <div className="flex flex-col gap-1 cursor-pointer group">
                <span className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">Logistics • 5h ago</span>
                <p className="text-[13px] font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">Suez Canal delays ease, reducing shipping costs for Europe-bound freight by 4%.</p>
              </div>
              <div className="w-full h-px bg-[#F1F5F9]"></div>
              <div className="flex flex-col gap-1 cursor-pointer group">
                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider">Agri-Trade • 1d ago</span>
                <p className="text-[13px] font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">Global coffee prices surge amidst supply shortages in Latin America.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
            <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A]">Quick Actions</h3>
            </div>
            <div className="p-2 flex flex-col">
              <button onClick={() => onNavigate?.('global-expansion')} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group">
                <div>
                  <p className="font-semibold text-[13px] text-[#0F172A]">Generate Expansion Plan</p>
                  <p className="text-[12px] text-[#64748B]">Start a new strategy</p>
                </div>
                <ArrowUpRight size={16} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
              </button>
              <button onClick={() => onNavigate?.('compliance')} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group border-t border-[#F1F5F9]">
                <div>
                  <p className="font-semibold text-[13px] text-[#0F172A]">Check EU Compliance</p>
                  <p className="text-[12px] text-[#64748B]">Verify certifications</p>
                </div>
                <ArrowUpRight size={16} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
              </button>
              <button onClick={() => onNavigate?.('buyers')} className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group border-t border-[#F1F5F9]">
                <div>
                  <p className="font-semibold text-[13px] text-[#0F172A]">Search Buyer Database</p>
                  <p className="text-[12px] text-[#64748B]">Find CRM contacts</p>
                </div>
                <ArrowUpRight size={16} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
            <div className="p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <h3 className="font-bold text-[#0F172A]">Recent Copilot Searches</h3>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <button onClick={() => handleRecentSearch("What is the average import tariff for organic spices in the US?")} className="text-left text-[13px] text-[#475569] hover:text-[#2563EB] transition-colors line-clamp-2 leading-relaxed">
                "What is the average import tariff for organic spices in the US?"
              </button>
              <div className="w-full h-px bg-[#F1F5F9]"></div>
              <button onClick={() => handleRecentSearch("Find me 5 coffee distributors in France.")} className="text-left text-[13px] text-[#475569] hover:text-[#2563EB] transition-colors line-clamp-2 leading-relaxed">
                "Find me 5 coffee distributors in France."
              </button>
              <div className="w-full h-px bg-[#F1F5F9]"></div>
              <button onClick={() => handleRecentSearch("Draft an email to Nordic Retailers offering a 10% discount on bulk orders.")} className="text-left text-[13px] text-[#475569] hover:text-[#2563EB] transition-colors line-clamp-2 leading-relaxed">
                "Draft an email to Nordic Retailers offering a 10% discount on bulk orders."
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
