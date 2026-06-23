import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const DATA = [
  { month: 'Jan', inquiries: 42, matches: 18 },
  { month: 'Feb', inquiries: 68, matches: 31 },
  { month: 'Mar', inquiries: 55, matches: 24 },
  { month: 'Apr', inquiries: 91, matches: 47 },
  { month: 'May', inquiries: 113, matches: 62 },
  { month: 'Jun', inquiries: 138, matches: 79 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm"
      style={{ background: '#071428', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
    >
      <p className="text-slate-300 font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }} className="font-medium">
          {p.name === 'inquiries' ? 'Export Inquiries' : 'Buyer Matches'}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

export default function TrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="card overflow-hidden"
      style={{ background: 'rgba(7, 20, 40, 0.8)' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-white font-bold text-base">Export Inquiry Trends</h2>
          <p className="text-slate-400 text-xs mt-0.5">Last 6 months — inquiries vs buyer matches</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#00d4ff] inline-block" /> Inquiries
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded-full bg-[#00ff88] inline-block" /> Matches
          </span>
        </div>
      </div>

      <div className="px-4 py-6" style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradInquiries" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradMatches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="month"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="inquiries"
              stroke="#00d4ff"
              strokeWidth={2.5}
              fill="url(#gradInquiries)"
              dot={{ fill: '#00d4ff', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#00d4ff', stroke: '#020617', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="matches"
              stroke="#00ff88"
              strokeWidth={2.5}
              fill="url(#gradMatches)"
              dot={{ fill: '#00ff88', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, fill: '#00ff88', stroke: '#020617', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
