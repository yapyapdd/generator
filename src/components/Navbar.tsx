import React, { useState } from 'react';
import {
  Zap,
  LayoutDashboard,
  Send,
  History,
  User,
  LogOut,
  Menu,
  X,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { NavigationTab } from '../types';
import { formatCurrency } from '../utils/helpers';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onLogout: () => void;
  balance: number;
  onResetBalance?: () => void;
  userEmail: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onLogout,
  balance,
  onResetBalance,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'send', label: 'Send', icon: <Send className="w-4 h-4" /> },
    { id: 'history', label: 'Transaction History', icon: <History className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
  ];

  const handleTabClick = (tabId: NavigationTab) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c101a]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTabClick('dashboard')}
              id="brand-logo-btn"
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all border border-blue-400/30">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-white tracking-tight text-base sm:text-lg">
                    Flash USDT Sender
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    DEMO
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Simulated Crypto Dispatcher
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121826] p-1 rounded-xl border border-slate-800" id="desktop-nav-tabs">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar (Simulated Balance & Logout) */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Simulated Balance Pill */}
            <div
              id="navbar-balance-pill"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141d2e] border border-slate-700/80 text-xs shadow-inner"
              title="Simulated Demo Balance"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400 font-medium">Demo Balance</span>
                <span className="font-mono font-bold text-white">
                  ${formatCurrency(balance)} <span className="text-emerald-400 text-[10px]">USDT</span>
                </span>
              </div>
              {onResetBalance && (
                <button
                  type="button"
                  id="reset-balance-btn"
                  onClick={onResetBalance}
                  className="ml-1 p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                  title="Refill / Reset Demo Balance to $50,000"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Logout Button */}
            <button
              type="button"
              id="logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-red-400 bg-slate-800/60 hover:bg-red-500/10 border border-slate-700/60 hover:border-red-500/30 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e1422] border-b border-slate-800 px-4 pt-3 pb-5 space-y-3">
          {/* Mobile Balance Display */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#141d2e] border border-slate-700">
            <div>
              <p className="text-[11px] text-slate-400">Simulated Demo Balance</p>
              <p className="font-mono font-bold text-white text-base">
                ${formatCurrency(balance)} <span className="text-emerald-400 text-xs">USDT</span>
              </p>
            </div>
            {onResetBalance && (
              <button
                onClick={onResetBalance}
                className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg bg-slate-800 text-blue-400 border border-slate-700"
              >
                <RotateCcw className="w-3 h-3" />
                Refill
              </button>
            )}
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={onLogout}
              id="mobile-logout-btn"
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Persistent Demo Notice Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 via-slate-900/90 to-blue-950/60 border-t border-slate-800/50 py-1 px-4 text-center">
        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />
          <span className="font-semibold text-slate-300">DEMO SIMULATION ENVIRONMENT:</span>
          <span>All transactions and balances shown are visual simulations only.</span>
        </p>
      </div>
    </header>
  );
};
