import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const features = [
  { icon: Globe2, title: 'Global Discovery', desc: 'Find active buyers in 150+ countries instantly.' },
  { icon: TrendingUp, title: 'Demand Forecasting', desc: 'Predict which markets will grow for your products.' },
  { icon: Users, title: 'Buyer Intelligence', desc: 'Detailed contact profiles and trade histories of importers.' },
  { icon: ShieldCheck, title: 'Compliance Guide', desc: 'Navigate complex international export regulations easily.' }
];

export default function FeaturesMatrix() {
  return (
    <section className="min-h-screen w-full flex items-center justify-center px-4">
      <div className="w-full max-w-5xl z-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center text-white"
        >
          AI-Powered Export Intelligence
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-panel p-8 rounded-3xl flex items-start gap-6 hover:bg-[#0f172a]/80 transition-colors border border-slate-700/50"
            >
              <div className="bg-[#38bdf8]/20 p-4 rounded-2xl text-[#38bdf8]">
                <feat.icon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-slate-400 text-lg">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
