import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  RotateCcw,
  LogOut,
  Mail,
  Zap,
  Key,
  Check,
  Copy,
  AlertTriangle,
  Server,
} from 'lucide-react';
import { formatCurrency } from '../utils/helpers';

interface ProfileModalProps {
  userEmail: string;
  balance: number;
  onResetBalance: () => void;
  onLogout: () => void;
  transactionCount: number;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userEmail,
  balance,
  onResetBalance,
  onLogout,
  transactionCount,
}) => {
  const [copiedApiKey, setCopiedApiKey] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const simulatedApiKey = 'flash_live_sim_892d3f019a82bb7e';

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(simulatedApiKey);
    setCopiedApiKey(true);
    setTimeout(() => setCopiedApiKey(false), 2000);
  };

  const handleTriggerReset = () => {
    onResetBalance();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Profile Overview Card */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <User className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight"> Operator</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Active
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>{userEmail}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            id="profile-logout-btn"
            onClick={onLogout}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#141b2b] border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Session Tier</span>
            <p className="text-sm font-bold text-white">Full  Operator Sandbox</p>
            <p className="text-[11px] text-slate-400">Unlimited testing broadcasts</p>
          </div>

          <div className="p-4 rounded-xl bg-[#141b2b] border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-medium">Current  Balance</span>
            <p className="text-sm font-bold font-mono text-emerald-400">
              ${formatCurrency(balance)} <span className="text-xs text-slate-300">USDT</span>
            </p>
            <p className="text-[11px] text-slate-400">{transactionCount} simulated transactions</p>
          </div>
        </div>

        {/* Simulated API Key */}
        <div className="mt-6 p-4 rounded-xl bg-[#141b2b] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-400" />
              Simulated Dispatcher Key
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Sandbox Scope</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={simulatedApiKey}
              className="flex-1 px-3 py-2 bg-[#0d121c] border border-slate-700/70 rounded-lg text-xs font-mono text-slate-300 focus:outline-none select-all"
            />
            <button
              type="button"
              id="copy-api-key-btn"
              onClick={handleCopyApiKey}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors"
            >
              {copiedApiKey ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Demo Controls Section */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-400" />
            <span>Sandbox Management</span>
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#121826] border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">Refill Sandbox Balance</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Reset your test wallet back to the default $50,000.00 USDT fund.
              </p>
            </div>
            <button
              type="button"
              id="refill-balance-profile-btn"
              onClick={handleTriggerReset}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/20 shrink-0"
            >
              {resetSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Refilled ($50,000)!</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refill Balance</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-[10px] font-semibold tracking-[0.18em] text-blue-400/70"> MODE</div>
      </div>
    </div>
  );
};
