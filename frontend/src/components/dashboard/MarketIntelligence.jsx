import React from 'react';
import { Globe2, TrendingUp, AlertTriangle, FileCheck, CheckCircle2 } from 'lucide-react';

export default function MarketIntelligence() {
  const recommendations = [
    { country: 'Germany', match: 96, tariff: '0% (FTA)', risk: 'Low', reason: 'High demand for organic textiles.' },
    { country: 'United States', match: 88, tariff: '14.5%', risk: 'Medium', reason: 'Large volume buyers, complex customs.' },
    { country: 'Japan', match: 82, tariff: '3.2%', risk: 'Low', reason: 'Consistent growth in premium segments.' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A]">Market Intelligence</h2>
          <p className="text-sm text-[#64748B] mt-1">Discover optimal export destinations and compliance requirements.</p>
        </div>
        <button className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
          <Globe2 size={16} />
          Analyze New HS Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Recommendations */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-[#E2E8F0]">
            <h3 className="font-bold text-[#0F172A]">AI Market Recommendations</h3>
            <p className="text-xs text-[#64748B] mt-1">Based on your product profile (HS Code: 6204.62)</p>
          </div>
          
          <div className="p-0 flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Target Market</th>
                  <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">AI Match Score</th>
                  <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Import Tariff</th>
                  <th className="px-5 py-3 text-xs font-bold text-[#64748B] uppercase tracking-wider border-b border-[#E2E8F0]">Primary Driver</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.map((rec, i) => (
                  <tr key={i} className="border-b border-[#E2E8F0] hover:bg-[#F1F5F9] transition-colors">
                    <td className="px-5 py-4 text-sm font-bold text-[#0F172A]">{rec.country}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${rec.match}%` }} />
                        </div>
                        <span className="text-xs font-bold text-[#10B981]">{rec.match}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[#334155]">{rec.tariff}</td>
                    <td className="px-5 py-4 text-sm text-[#64748B]">{rec.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Compliance Snapshot */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="p-5 border-b border-[#E2E8F0] flex justify-between items-center bg-[#FDF4FF]">
            <h3 className="font-bold text-[#0F172A]">Germany Compliance</h3>
            <FileCheck size={18} className="text-[#C026D3]" />
          </div>
          
          <div className="p-5 flex-1 flex flex-col gap-4 bg-white">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">CE Marking</p>
                <p className="text-xs text-[#64748B]">Required for all textile products.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-[#F59E0B] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">REACH Certification</p>
                <p className="text-xs text-[#64748B]">Chemical restrictions apply. Must provide MSDS documentation.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 size={16} className="text-[#10B981] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#0F172A]">Commercial Invoice</p>
                <p className="text-xs text-[#64748B]">Must include exact HS code and EORI number.</p>
              </div>
            </div>
            
            <button className="mt-4 w-full py-2 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] text-sm font-medium rounded-md transition-colors">
              Download Full Checklist
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
