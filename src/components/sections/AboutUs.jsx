import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import aboutImage from '../../assets/about_us.png';

export default function AboutUs() {
  const bulletPoints = [
    "Discover untapped markets with AI-driven trade forecasting.",
    "Access verified data of importers across 203 countries.",
    "Eliminate the need for multiple data subscriptions."
  ];

  return (
    <section id="about" className="w-full py-24 px-6 md:px-12 bg-[#020617]/75">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Illustration */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
          className="relative rounded-3xl overflow-hidden border border-slate-700/50 shadow-[0_0_40px_rgba(0,212,255,0.1)]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60 z-10" />
          <img 
            src={aboutImage} 
            alt="AI Analytics Control Room" 
            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
          />
        </motion.div>

        {/* Right: Text Content */}
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <span className="type-label text-[#00d4ff] bg-[#00d4ff]/10 px-3 py-1 rounded-full mb-6 inline-block">
              ABOUT US
            </span>
            <h2 className="type-h2 text-white mb-6">
              The World's Premier Export Intelligence Platform
            </h2>
            <p className="type-sub text-slate-300 mb-8 leading-relaxed">
              ExportPilot stands as the leading AI platform designed specifically for Indian exporters. We empower businesses to shift their strategy based on real-time market insights, identifying emerging demand patterns before competitors do.
            </p>
          </motion.div>

          <motion.div 
            className="space-y-4 mb-10 w-full"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {bulletPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="text-[#00d4ff] mt-1 shrink-0" size={20} />
                <span className="type-body text-slate-300">{point}</span>
              </div>
            ))}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="group flex items-center gap-2 text-[#00d4ff] type-strong hover:text-white transition-colors"
          >
            Learn More About Our Tech
            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </motion.button>

        </div>
      </div>
    </section>
  );
}
