import React from 'react';
import { LogOut, User, Menu, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardHeader({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-[#0F172A] border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Logo area */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-sm text-[#CBD5E1] hover:text-white transition-colors mr-2 group"
          >
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back to Copilot</span>
          </button>
          
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate('dashboard'); }}
            className="flex items-center gap-2"
          >
            <img src="/globex-logo.jpg" alt="GlobeX" className="w-8 h-8 rounded object-cover border border-slate-700" />
            <span className="text-white font-bold text-lg tracking-wide hidden sm:block">GlobeX AI</span>
          </a>
          <span className="text-slate-400 mx-2 hidden sm:block">|</span>
          <span className="text-blue-400 font-medium text-sm hidden sm:block">Agents Hub</span>
        </div>

        {/* User actions */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium"
          >
            <User size={16} />
            <span className="hidden sm:block">{user?.name || 'My Profile'}</span>
          </button>
          
          <button 
            onClick={() => {
              logout();
              onNavigate('landing');
            }}
            className="flex items-center gap-2 text-slate-300 hover:text-red-400 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
