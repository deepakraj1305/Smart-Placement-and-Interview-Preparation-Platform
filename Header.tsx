import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mic, BarChart2, Shield, History, UserCheck, LogOut, Sparkles, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, signOut, isAdmin, setIsAdmin } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#fbfbfb]/90 backdrop-blur-md border-b border-[#e4e4e7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-lg bg-[#18181b] flex items-center justify-center text-white font-mono text-sm font-semibold tracking-tight shadow-xs group-hover:bg-[#27272a] transition-colors">
              <span className="text-blue-400 mr-0.5">/</span>PA
            </div>
            <div>
              <span className="text-sm font-semibold tracking-tight text-[#18181b] block">
                Placement Workstation
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#71717a] block -mt-0.5">
                Response Analyzer
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link
              to="/setup"
              className={`px-3.5 py-1.5 text-xs font-medium tracking-tight rounded-md transition-colors ${
                isActive('/setup') || isActive('/workstation')
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f5]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5" />
                Start Interview
              </span>
            </Link>

            <Link
              to="/history"
              className={`px-3.5 py-1.5 text-xs font-medium tracking-tight rounded-md transition-colors ${
                isActive('/history')
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f5]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" />
                Practice History
              </span>
            </Link>

            <Link
              to="/admin"
              className={`px-3.5 py-1.5 text-xs font-medium tracking-tight rounded-md transition-colors ${
                isActive('/admin')
                  ? 'bg-[#18181b] text-white shadow-xs'
                  : 'text-[#52525b] hover:text-[#18181b] hover:bg-[#f4f4f5]'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <BarChart2 className="w-3.5 h-3.5" />
                Placement Cell Admin
              </span>
            </Link>
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Admin Toggle quick badge */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              title="Toggle Placement Admin View"
              className={`text-[11px] font-mono px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 ${
                isAdmin
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-white text-[#71717a] border-[#e4e4e7] hover:text-[#18181b]'
              }`}
            >
              <Shield className="w-3 h-3" />
              {isAdmin ? 'Admin Mode: ON' : 'Admin Mode'}
            </button>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs font-medium text-[#18181b] truncate max-w-[140px]">
                    {user.email?.split('@')[0]}
                  </div>
                  <div className="text-[10px] font-mono text-[#71717a]">
                    Candidate
                  </div>
                </div>
                <button
                  onClick={signOut}
                  className="p-1.5 rounded text-[#71717a] hover:text-[#18181b] hover:bg-[#f4f4f5] transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#18181b] bg-white border border-[#d4d4d8] rounded hover:bg-[#f4f4f5] transition-colors shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Sign In / Guest
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#52525b] hover:text-[#18181b]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#e4e4e7] space-y-1">
            <Link
              to="/setup"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#18181b] hover:bg-[#f4f4f5] rounded"
            >
              Start Interview
            </Link>
            <Link
              to="/history"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#18181b] hover:bg-[#f4f4f5] rounded"
            >
              Practice History
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-[#18181b] hover:bg-[#f4f4f5] rounded"
            >
              Placement Cell Admin
            </Link>
            <div className="pt-2 border-t border-[#e4e4e7] flex items-center justify-between px-3">
              <button
                onClick={() => {
                  setIsAdmin(!isAdmin);
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-mono text-[#71717a]"
              >
                Toggle Admin: {isAdmin ? 'Active' : 'Off'}
              </button>
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-red-600 font-medium"
                >
                  Sign Out
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs font-medium text-blue-600"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
