import React from 'react';
import { motion } from 'framer-motion';
import { Globe2, TrendingUp, Users, ShieldCheck } from 'lucide-react';

const features = [
  { icon: Globe2, title: 'Global Discovery', desc: 'Find active buyers in 150+ countries instantly with real-time customs data.' },
  { icon: TrendingUp, title: 'Demand Forecasting', desc: 'Predict which markets will grow for your products using AI predictive models.' },
  { icon: Users, title: 'Buyer Intelligence', desc: 'Detailed contact profiles, trade histories, and reliability scores of importers.' },
  { icon: ShieldCheck, title: 'Compliance Guide', desc: 'Navigate complex international export regulations and tariffs easily.' }
];

export default function FeaturesMatrix() {
  return (
    <section id="features" className="w-full py-24 px-6 md:px-12 bg-[#040d1a]/75">
      <div className="max-w-6xl mx-auto z-10">
        
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="type-label text-[#00d4ff] bg-[#00d4ff]/10 px-3 py-1 rounded-full mb-4 inline-block"
          >
            OUR PLATFORM
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="type-h2 text-white mb-4"
          >
            AI-Powered Export Intelligence
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="type-sub text-slate-400 max-w-2xl mx-auto"
          >
            Everything you need to find buyers, analyze competitors, and scale your export business globally.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {features.map((feat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="card p-8 flex items-start gap-6 hover:-translate-y-1 transition-all duration-300 group hover:shadow-[0_0_30px_rgba(0,212,255,0.15)]"
            >
              <div className="bg-slate-800/50 p-4 rounded-2xl text-[#00d4ff] border border-slate-700/50 group-hover:bg-[#00d4ff]/10 group-hover:border-[#00d4ff]/30 transition-colors">
                <feat.icon size={32} />
              </div>
              <div>
                <h3 className="type-h3 text-white mb-2 group-hover:text-[#00d4ff] transition-colors">{feat.title}</h3>
                <p className="type-body text-slate-400">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

