import React from 'react';
import { 
  TrendingUp, 
  Users, 
  FileText, 
  Activity,
  ArrowUpRight,
  Package,
  Globe2
} from 'lucide-react';

export default function DashboardHome() {
  const user = JSON.parse(localStorage.getItem('user') || '{"name":"Exporter"}');

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Welcome back, {user.name.split(' ')[0]} 👋</h2>
          <p className="text-sm text-[#64748B] mt-1">Here is what's happening with your export pipeline today.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-[#E2E8F0] rounded-lg text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]">
            Download Report
          </button>
          <button className="btn-primary px-4 py-2 text-sm">
            Launch New Agent
          </button>
        </div>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <Package size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-md">
              <TrendingUp size={12} /> +12.5%
            </span>
          </div>
          <h3 className="text-[#64748B] text-sm font-medium">Active Export Volume</h3>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">420 Tons</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#FDF4FF] flex items-center justify-center text-[#C026D3]">
              <Users size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-md">
              <TrendingUp size={12} /> +4 New
            </span>
          </div>
          <h3 className="text-[#64748B] text-sm font-medium">Discovered Buyers</h3>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">1,284</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#FFFBEB] flex items-center justify-center text-[#D97706]">
              <FileText size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-1 rounded-md">
              <TrendingUp size={12} /> 2 Pending
            </span>
          </div>
          <h3 className="text-[#64748B] text-sm font-medium">Active RFPs / Quotes</h3>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">12</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#059669]">
              <Globe2 size={20} />
            </div>
          </div>
          <h3 className="text-[#64748B] text-sm font-medium">Top Performing Market</h3>
          <p className="text-2xl font-bold text-[#0F172A] mt-1">Germany</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent AI Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center">
            <h3 className="font-bold text-[#0F172A] flex items-center gap-2">
              <Activity size={18} className="text-[#2563EB]" />
              AI Agent Live Activity
            </h3>
            <button className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]">View All</button>
          </div>
          <div className="p-5 flex-1 flex flex-col gap-4">
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#EFF6FF] flex items-center justify-center shrink-0 mt-0.5">
                <Users size={14} className="text-[#2563EB]" />
              </div>
              <div>
                <p className="text-sm text-[#334155]"><strong>Buyer Discovery Agent</strong> found 3 new high-probability importers in the EU for HS Code 6204.62.</p>
                <p className="text-xs text-[#94A3B8] mt-1">10 minutes ago</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#FDF4FF] flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={14} className="text-[#C026D3]" />
              </div>
              <div>
                <p className="text-sm text-[#334155]"><strong>Compliance Agent</strong> flagged a new mandatory phytosanitary certificate requirement for Germany.</p>
                <p className="text-xs text-[#94A3B8] mt-1">2 hours ago</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-[#ECFDF5] flex items-center justify-center shrink-0 mt-0.5">
                <TrendingUp size={14} className="text-[#059669]" />
              </div>
              <div>
                <p className="text-sm text-[#334155]"><strong>Market Intelligence Agent</strong> detected a 4.2% drop in ocean freight rates on the Mumbai-Rotterdam route.</p>
                <p className="text-xs text-[#94A3B8] mt-1">5 hours ago</p>
              </div>
            </div>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-[#0F172A]">Quick Actions</h3>
          </div>
          <div className="p-2 flex flex-col">
            <button className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group">
              <div>
                <p className="font-semibold text-sm text-[#0F172A]">Generate Email Draft</p>
                <p className="text-xs text-[#64748B]">Pitch to a new buyer</p>
              </div>
              <ArrowUpRight size={16} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </button>
            <button className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group border-t border-[#F1F5F9]">
              <div>
                <p className="font-semibold text-sm text-[#0F172A]">Check EU Compliance</p>
                <p className="text-xs text-[#64748B]">Verify certifications</p>
              </div>
              <ArrowUpRight size={16} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </button>
            <button className="flex items-center justify-between p-3 rounded-lg hover:bg-[#F8FAFC] transition-colors text-left group border-t border-[#F1F5F9]">
              <div>
                <p className="font-semibold text-sm text-[#0F172A]">Search New Markets</p>
                <p className="text-xs text-[#64748B]">Find demand spikes</p>
              </div>
              <ArrowUpRight size={16} className="text-[#94A3B8] group-hover:text-[#2563EB] transition-colors" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
