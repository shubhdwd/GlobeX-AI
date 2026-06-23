import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ icon: Icon, title, value, trend, trendUp = true, color = '#00d4ff', delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="card relative overflow-hidden p-6 flex flex-col gap-4 hover:border-[#00d4ff]/30 transition-all group"
      style={{ background: 'rgba(7, 20, 40, 0.8)' }}
    >
      {/* Top glow accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      {/* Icon + title */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}18`, border: `1px solid ${color}30` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        {/* Trend badge */}
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
          ${trendUp ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}
        >
          {trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
          {trend}
        </div>
      </div>

      {/* Value */}
      <div>
        <p className="text-3xl font-extrabold text-white tracking-tight leading-none mb-1">{value}</p>
        <p className="text-slate-400 text-sm font-medium">{title}</p>
      </div>

      {/* Subtle bottom glow on hover */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 100%, ${color}18, transparent)` }}
      />
    </motion.div>
  );
}
