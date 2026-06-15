import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { title: '1. Discover Markets', desc: 'AI analyzes millions of data points to identify high-demand countries for your specific products.' },
  { title: '2. Connect with Buyers', desc: 'Access a verified database of international importers, distributors, and wholesalers.' },
  { title: '3. Automate Outreach', desc: 'Launch targeted email campaigns and track global engagement without needing an export team.' }
];

export default function HowItWorks() {
  return (
    <section className="min-h-screen w-full flex items-center justify-end px-8 md:px-24">
      <div className="w-full max-w-md z-10">
        <motion.h2 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="text-4xl md:text-5xl font-bold mb-12 text-white"
        >
          How It Works
        </motion.h2>
        <div className="space-y-6">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              className="glass-panel p-8 rounded-2xl border-l-4 border-l-[#fbbf24]"
            >
              <h3 className="text-2xl font-semibold text-[#fbbf24] mb-3">{step.title}</h3>
              <p className="text-slate-300 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
