import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function DashboardNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const menuItems = [
    { icon: User, label: 'Profile', onClick: () => setDropdownOpen(false) },
    { icon: Settings, label: 'Settings', onClick: () => setDropdownOpen(false) },
    { icon: LogOut, label: 'Logout', onClick: handleLogout, danger: true },
  ];

  return (
    <nav className="navbar fixed top-0 left-0 w-full z-50 py-3">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <img src="/logo.png" alt="GlobeX AI" className="h-9 w-auto object-contain" />
        </div>

        {/* Right: User avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            {/* Avatar circle */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0066ff] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span className="text-white text-sm font-semibold hidden sm:block max-w-[120px] truncate">
              {user?.name || 'User'}
            </span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 overflow-hidden z-50"
                style={{ background: '#071428', boxShadow: '0 16px 40px rgba(0,0,0,0.6)' }}
              >
                {/* User info header */}
                <div className="px-4 py-3 border-b border-white/10">
                  <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-slate-400 text-xs truncate">{user?.email}</p>
                </div>
                {menuItems.map(({ icon: Icon, label, onClick, danger }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left
                      ${danger
                        ? 'text-red-400 hover:bg-red-500/10'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
