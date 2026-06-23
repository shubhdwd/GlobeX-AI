import React from 'react';
import { motion } from 'framer-motion';
import { Search, Send, BarChart2, Upload, ArrowRight } from 'lucide-react';

const ACTIONS = [
  {
    icon: Search,
    label: 'Search New Buyers',
    description: 'Find importers by product, HS code, or country',
    color: '#00d4ff',
    primary: true,
  },
  {
    icon: Send,
    label: 'Start Outreach Campaign',
    description: 'Send personalised emails to your buyer list',
    color: '#00ff88',
  },
  {
    icon: BarChart2,
    label: 'View Analytics',
    description: 'Deep-dive into trade flows and demand trends',
    color: '#a855f7',
  },
  {
    icon: Upload,
    label: 'Upload Product Catalog',
    description: 'Let AI match your products to global demand',
    color: '#fbbf24',
  },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="card overflow-hidden flex flex-col"
      style={{ background: 'rgba(7, 20, 40, 0.8)' }}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-white font-bold text-base">Quick Actions</h2>
        <p className="text-slate-400 text-xs mt-0.5">Jump right into your workflow</p>
      </div>

      {/* Action items */}
      <div className="flex flex-col divide-y divide-white/5 flex-1">
        {ACTIONS.map(({ icon: Icon, label, description, color, primary }, i) => (
          <motion.button
            key={label}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.45 + i * 0.07 }}
            className="flex items-center gap-4 px-6 py-4 text-left hover:bg-white/3 transition-all group"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
              style={{ background: `${color}15`, border: `1px solid ${color}30` }}
            >
              <Icon size={17} style={{ color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold leading-tight mb-0.5 ${primary ? 'text-[#00d4ff]' : 'text-white'}`}>
                {label}
              </p>
              <p className="text-slate-400 text-xs leading-snug truncate">{description}</p>
            </div>
            <ArrowRight
              size={14}
              className="text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all flex-shrink-0"
            />
          </motion.button>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="px-6 py-4 border-t border-white/10">
        <button className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2">
          <Search size={14} /> New Buyer Search
        </button>
      </div>
    </motion.div>
  );
}
