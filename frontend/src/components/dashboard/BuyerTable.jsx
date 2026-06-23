import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Search, Globe } from 'lucide-react';

const BUYERS = [
  { id: 1, name: 'Jørgen Hansen & Co.', country: '🇩🇰 Denmark', industry: 'Textile Manufacturing', score: 97 },
  { id: 2, name: 'Alvarez Global Trade', country: '🇲🇽 Mexico', industry: 'Agro Commodities', score: 91 },
  { id: 3, name: 'PT Nusantara Imports', country: '🇮🇩 Indonesia', industry: 'Pharmaceuticals', score: 88 },
  { id: 4, name: 'Karim Brothers Ltd.', country: '🇳🇬 Nigeria', industry: 'Engineering Goods', score: 82 },
  { id: 5, name: 'Santos & Ferreira Ltda.', country: '🇧🇷 Brazil', industry: 'Leather Goods', score: 79 },
  { id: 6, name: 'Horizon Pacific LLC', country: '🇦🇺 Australia', industry: 'Spices & Food', score: 75 },
];

function ScoreBadge({ score }) {
  const color = score >= 90 ? '#00d4ff' : score >= 80 ? '#00ff88' : score >= 70 ? '#fbbf24' : '#f43f5e';
  const bg = score >= 90 ? 'rgba(0,212,255,0.1)' : score >= 80 ? 'rgba(0,255,136,0.1)' : score >= 70 ? 'rgba(251,191,36,0.1)' : 'rgba(244,63,94,0.1)';
  return (
    <span
      className="inline-flex items-center justify-center w-12 h-7 rounded-full text-xs font-bold"
      style={{ color, background: bg, border: `1px solid ${color}40` }}
    >
      {score}
    </span>
  );
}

/* ── Empty state ─────────────────────────────────────────────────── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#00d4ff]/10 border border-[#00d4ff]/20 flex items-center justify-center mb-4">
        <Globe size={28} className="text-[#00d4ff]" />
      </div>
      <h3 className="text-white font-bold text-lg mb-2">No buyer matches yet</h3>
      <p className="text-slate-400 text-sm max-w-xs mb-6">
        Run your first buyer search to discover global importers that match your products.
      </p>
      <button className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2">
        <Search size={14} /> Start Buyer Search
      </button>
    </div>
  );
}

export default function BuyerTable({ isEmpty = false }) {
  const buyers = isEmpty ? [] : BUYERS;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="card overflow-hidden"
      style={{ background: 'rgba(7, 20, 40, 0.8)' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-base">Recent Buyer Matches</h2>
          <p className="text-slate-400 text-xs mt-0.5">AI-ranked by product-market fit</p>
        </div>
        {!isEmpty && (
          <button className="text-[#00d4ff] text-xs font-semibold hover:opacity-80 transition-opacity">
            View All →
          </button>
        )}
      </div>

      {buyers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-3 text-left text-slate-400 font-semibold text-xs uppercase tracking-wider">Buyer</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold text-xs uppercase tracking-wider">Country</th>
                <th className="px-4 py-3 text-left text-slate-400 font-semibold text-xs uppercase tracking-wider hidden md:table-cell">Industry</th>
                <th className="px-4 py-3 text-center text-slate-400 font-semibold text-xs uppercase tracking-wider">Score</th>
                <th className="px-4 py-3 text-right text-slate-400 font-semibold text-xs uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((b, i) => (
                <motion.tr
                  key={b.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="border-b border-white/5 hover:bg-white/3 transition-colors group"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff]/20 to-[#0066ff]/20 border border-white/10 flex items-center justify-center text-xs font-bold text-[#00d4ff]">
                        {b.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium leading-tight">{b.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-300">{b.country}</td>
                  <td className="px-4 py-3.5 text-slate-400 hidden md:table-cell">{b.industry}</td>
                  <td className="px-4 py-3.5 text-center">
                    <ScoreBadge score={b.score} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00d4ff]/10 border border-[#00d4ff]/20 text-[#00d4ff] text-xs font-semibold hover:bg-[#00d4ff]/20 transition-all">
                      <Mail size={11} /> Contact
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
