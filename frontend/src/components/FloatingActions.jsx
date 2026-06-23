import React from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FloatingActions({ onOpenAuth }) {
  return (
    <>
      {/* Side DEMO Tab */}
      <motion.button
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring' }}
        onClick={onOpenAuth}
        className="fixed top-1/2 right-0 -translate-y-1/2 z-50 bg-[#0066ff] hover:bg-[#00d4ff] text-white type-strong py-4 px-2 rounded-l-lg shadow-lg transition-colors flex flex-col items-center gap-1 group border-y border-l border-white/20"
      >
        <span className="writing-vertical text-sm tracking-widest group-hover:scale-105 transition-transform" style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>
          DEMO
        </span>
      </motion.button>

      {/* WhatsApp FAB */}
      <motion.a
        href="https://wa.me/1234567890" // Replace with actual number
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#1ebd57] text-white p-4 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all hover:scale-110 flex items-center justify-center"
      >
        <MessageCircle size={28} />
        {/* Ping animation effect */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping" style={{ animationDuration: '3s' }}></span>
      </motion.a>
    </>
  );
}
