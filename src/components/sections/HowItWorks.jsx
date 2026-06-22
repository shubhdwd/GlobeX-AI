import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { title: 'Discover Markets', desc: 'AI analyzes millions of data points to identify high-demand countries for your specific products.' },
  { title: 'Connect with Buyers', desc: 'Access a verified database of international importers, distributors, and wholesalers.' },
  { title: 'Automate Outreach', desc: 'Launch targeted email campaigns and track global engagement without needing an export team.' }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="w-full py-24 px-6 md:px-12 bg-[#020617]/75 relative">
      <div className="max-w-4xl mx-auto z-10 relative">
        <div className="text-center mb-16">
           <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="type-h2 text-white"
          >
            How It Works
          </motion.h2>
        </div>

        <div className="relative">
          {/* Vertical line connecting steps (hidden on small mobile for cleaner look) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2 z-0" />

          <div className="space-y-12 md:space-y-24">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 relative z-10`}
                >
                  {/* Text Content */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:text-right' : 'md:text-left'} text-center`}>
                    <h3 className="type-h3 text-white mb-3">{step.title}</h3>
                    <p className="type-body text-slate-400">{step.desc}</p>
                  </div>

                  {/* Center Number Marker */}
                  <div className="w-16 h-16 shrink-0 rounded-full bg-[#040d1a] border border-[#00d4ff] flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.2)]">
                    <span className="type-h2 text-[#00d4ff]">{idx + 1}</span>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block w-full md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

