import React from 'react';
import {
  Zap,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { DemoTransaction } from '../types';
import { formatCurrency, truncateAddress } from '../utils/helpers';
import { SendCard } from './SendCard';

interface DashboardOverviewProps {
  balance: number;
  transactions: DemoTransaction[];
  onSendDemoTx: (newTx: DemoTransaction) => void;
  onNavigateToTab: (tab: 'dashboard' | 'send' | 'history' | 'profile') => void;
  onSelectTxDetails: (tx: DemoTransaction) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  balance,
  transactions,
  onSendDemoTx,
  onNavigateToTab,
  onSelectTxDetails,
}) => {
  const totalSentVolume = transactions.reduce((acc, tx) => acc + tx.amount, 0);
  const recentTransactions = transactions.slice(0, 4);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Top Stat Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-metrics-grid">
        {/* Metric 1: Demo Balance */}
        <div className="bg-[#0f1523] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Available Demo Balance</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
              ₮
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-white tracking-tight">
              ${formatCurrency(balance)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>USDT Tether (Simulation)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Dispatched Volume */}
        <div className="bg-[#0f1523] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Simulated Dispatched</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-300 tracking-tight">
              ${formatCurrency(totalSentVolume)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
              <span>{transactions.length} total demo broadcasts</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Node Simulation Status */}
        <div className="bg-[#0f1523] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Node Status</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sandbox Live</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-mono">
              <span>Latency: 18ms (Mocked)</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Security Layer */}
        <div className="bg-[#0f1523] border border-slate-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Demo Guard</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Isolated</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-purple-300 mt-1">
              <span>Zero real crypto risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Send USDT Section & Quick Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Center: Main Send USDT Demo card */}
        <div className="lg:col-span-7">
          <SendCard
            balance={balance}
            onSendDemoTx={onSendDemoTx}
            onViewHistory={() => onNavigateToTab('history')}
            onSelectTxDetails={onSelectTxDetails}
          />
        </div>

        {/* Right: Recent Activity & Node Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Recent Transactions List */}
          <div className="bg-[#0f1523] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Recent Demo Activity</h3>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('history')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {recentTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No simulated activity yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    onClick={() => onSelectTxDetails(tx)}
                    className="p-3 rounded-xl bg-[#141b2b] border border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
                        ₮
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white font-mono">
                          {formatCurrency(tx.amount)} USDT
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          To: {truncateAddress(tx.recipient, 5, 4)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        Success
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                        {tx.timestamp.split(' ')[1] || tx.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Simulation Features Guide */}
          <div className="bg-[#0f1523] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Flash Sender Capabilities
            </h3>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  <strong className="text-slate-200">Multi-Protocol Testing:</strong> Simulate TRC-20, ERC-20, and BEP-20 payload structures.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  <strong className="text-slate-200">Broadcast Emulation:</strong> Real-time feedback spinner with dynamic mempool status feedback.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/15 text-blue-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  <strong className="text-slate-200">Safe Sandbox:</strong> Strictly isolated demo environment without real crypto or wallet connections.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
