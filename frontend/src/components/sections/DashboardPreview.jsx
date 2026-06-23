import React from 'react';
import { useFadeIn } from '../../lib/useFadeIn';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

const countryData = [
  { rank: 1, country: 'United States', flag: '🇺🇸', importValue: '$2.4B', growth: '+12.3%', demandScore: 92, competition: 'Medium', buyers: '2,340', trend: 'up' },
  { rank: 2, country: 'United Arab Emirates', flag: '🇦🇪', importValue: '$1.8B', growth: '+8.7%', demandScore: 87, competition: 'Low', buyers: '1,890', trend: 'up' },
  { rank: 3, country: 'United Kingdom', flag: '🇬🇧', importValue: '$1.2B', growth: '+5.1%', demandScore: 81, competition: 'High', buyers: '1,450', trend: 'up' },
  { rank: 4, country: 'Germany', flag: '🇩🇪', importValue: '$980M', growth: '+3.8%', demandScore: 78, competition: 'High', buyers: '1,120', trend: 'up' },
  { rank: 5, country: 'Saudi Arabia', flag: '🇸🇦', importValue: '$760M', growth: '+15.2%', demandScore: 76, competition: 'Low', buyers: '890', trend: 'up' },
  { rank: 6, country: 'Netherlands', flag: '🇳🇱', importValue: '$540M', growth: '-1.2%', demandScore: 71, competition: 'Medium', buyers: '670', trend: 'down' },
  { rank: 7, country: 'Japan', flag: '🇯🇵', importValue: '$480M', growth: '+2.1%', demandScore: 68, competition: 'High', buyers: '580', trend: 'flat' },
  { rank: 8, country: 'Australia', flag: '🇦🇺', importValue: '$420M', growth: '+9.4%', demandScore: 65, competition: 'Low', buyers: '520', trend: 'up' },
];

function TrendIcon({ trend }) {
  if (trend === 'up') return <ArrowUpRight size={12} className="text-[#059669]" />;
  if (trend === 'down') return <ArrowDownRight size={12} className="text-[#EF4444]" />;
  return <Minus size={12} className="text-[#94A3B8]" />;
}

function CompBadge({ level }) {
  const colors = {
    Low: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
    Medium: 'bg-[#FEF9C3] text-[#92400E] border-[#FDE68A]',
    High: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  };
  return (
    <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded border ${colors[level]}`}>
      {level}
    </span>
  );
}

function ScoreBar({ score }) {
  const color = score >= 80 ? '#059669' : score >= 60 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
      </div>
      <span className="text-[11px] font-semibold text-[#334155]">{score}</span>
    </div>
  );
}

export default function DashboardPreview() {
  const fade = useFadeIn();

  return (
    <section id="dashboard" className="w-full bg-[#F5F7FA] py-14 md:py-16 border-b border-[#E5E7EB]">
      <div className="section-container" ref={fade.ref}>
        <div className={fade.className}>
          <div className="text-center mb-10">
            <span className="type-label text-[#2563EB] mb-2 block">Sample Dashboard</span>
            <h2 className="type-h2 mb-3">Real Export Intelligence at Your Fingertips</h2>
            <p className="text-[14px] text-[#64748B] max-w-2xl mx-auto">
              See how GlobeX ranks countries by export potential for Indian textile exporters (HS Code 6204).
            </p>
          </div>

          {/* Dashboard card */}
          <div className="bg-white rounded border border-[#E5E7EB] overflow-hidden">
            {/* Dashboard header */}
            <div className="px-5 py-3 border-b border-[#E5E7EB] bg-[#F9FAFB] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-[14px] font-semibold text-[#0F172A]">Top Export Markets — Textile & Apparel</h3>
                <p className="text-[11px] text-[#94A3B8]">HS Code: 6204 | Source: India | Last updated: June 2026</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                  <div className="w-2 h-2 rounded-full bg-[#059669]" /> Growing
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                  <div className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Moderate
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                  <div className="w-2 h-2 rounded-full bg-[#EF4444]" /> Declining
                </div>
              </div>
            </div>

            {/* Data table */}
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Country</th>
                    <th>Import Value</th>
                    <th>YoY Growth</th>
                    <th>Demand Score</th>
                    <th>Competition</th>
                    <th>Verified Buyers</th>
                  </tr>
                </thead>
                <tbody>
                  {countryData.map((row) => (
                    <tr key={row.rank}>
                      <td className="font-semibold text-[#94A3B8] text-[11px]">{row.rank}</td>
                      <td>
                        <span className="flex items-center gap-2">
                          <span className="text-base">{row.flag}</span>
                          <span className="font-medium text-[#0F172A]">{row.country}</span>
                        </span>
                      </td>
                      <td className="font-semibold text-[#0F172A]">{row.importValue}</td>
                      <td>
                        <span className="flex items-center gap-1">
                          <TrendIcon trend={row.trend} />
                          <span className={`font-medium ${row.trend === 'down' ? 'text-[#EF4444]' : row.trend === 'up' ? 'text-[#059669]' : 'text-[#94A3B8]'}`}>
                            {row.growth}
                          </span>
                        </span>
                      </td>
                      <td><ScoreBar score={row.demandScore} /></td>
                      <td><CompBadge level={row.competition} /></td>
                      <td className="text-[#2563EB] font-medium">{row.buyers}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Dashboard footer */}
            <div className="px-5 py-2.5 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between">
              <p className="text-[11px] text-[#94A3B8]">Data sources: UN Comtrade, DGCI&S, customs registries</p>
              <span className="text-[11px] font-medium text-[#2563EB] cursor-pointer hover:underline">View full report →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
