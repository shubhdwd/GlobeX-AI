import React from 'react';
import { Mail, Globe, Users, Code } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0F172A] border-t border-[#1E293B]">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-20 md:h-24 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        
        {/* Left Side */}
        <div className="flex items-center gap-2 text-[13px] text-[#64748B]">
          <span className="font-semibold text-[#CBD5E1]">GlobeX AI</span>
          <span>© {new Date().getFullYear()}</span>
          <span className="hidden sm:inline">&middot; All rights reserved.</span>
        </div>

        {/* Center: Social/Contact Icons */}
        <div className="flex items-center gap-5 text-[#64748B]">
          <a href="mailto:sales@globexai.com" title="Email" className="hover:text-white transition-colors">
            <Mail size={18} />
          </a>
          <a href="#" title="Website" className="hover:text-white transition-colors">
            <Globe size={18} />
          </a>
          <a href="#" title="LinkedIn" className="hover:text-white transition-colors">
            <Users size={18} />
          </a>
          <a href="#" title="GitHub" className="hover:text-white transition-colors">
            <Code size={18} />
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6 text-[13px] text-[#64748B]">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
        
      </div>
    </footer>
  );
}
