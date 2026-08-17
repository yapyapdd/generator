/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { SendCard } from './components/SendCard';
import { TransactionHistory } from './components/TransactionHistory';
import { ProfileModal } from './components/ProfileModal';
import { TxDetailsModal } from './components/TxDetailsModal';
import { DemoTransaction, NavigationTab } from './types';
import { INITIAL_TRANSACTIONS } from './utils/helpers';
import { Zap, Sparkles } from 'lucide-react';

const STORAGE_KEY_AUTH = 'flash_usdt_auth';
const STORAGE_KEY_BALANCE = 'flash_usdt_balance';
const STORAGE_KEY_TXS = 'flash_usdt_txs';
const DEFAULT_BALANCE = 50000.0;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [userEmail, setUserEmail] = useState<string>(
    'usdtrewardsnexus4312urey@gmail.com'
  );

  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');

  const [balance, setBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BALANCE);
      return saved ? parseFloat(saved) : DEFAULT_BALANCE;
    } catch {
      return DEFAULT_BALANCE;
    }
  });

  const [transactions, setTransactions] = useState<DemoTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TXS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [selectedTx, setSelectedTx] = useState<DemoTransaction | null>(null);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, isAuthenticated ? 'true' : 'false');
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BALANCE, balance.toString());
    } catch {}
  }, [balance]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TXS, JSON.stringify(transactions));
    } catch {}
  }, [transactions]);

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email);
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {}
  };

  const handleSendDemoTx = (newTx: DemoTransaction) => {
    // Add transaction to the top of list
    setTransactions((prev) => [newTx, ...prev]);

    // Deduct simulated balance
    setBalance((prev) => Math.max(0, prev - newTx.amount));
  };

  const handleResetBalance = () => {
    setBalance(DEFAULT_BALANCE);
  };

  const handleClearHistory = () => {
    setTransactions([]);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={handleLogout}
        balance={balance}
        onResetBalance={handleResetBalance}
        userEmail={userEmail}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentTab === 'dashboard' && (
          <DashboardOverview
            balance={balance}
            transactions={transactions}
            onSendDemoTx={handleSendDemoTx}
            onNavigateToTab={setCurrentTab}
            onSelectTxDetails={(tx) => setSelectedTx(tx)}
          />
        )}

        {currentTab === 'send' && (
          <div className="py-2 animate-fadeIn space-y-6">
            <div className="text-center max-w-xl mx-auto mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Simulated USDT Dispatcher
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Configure simulated recipient and dispatch demo tokens across test protocols.
              </p>
            </div>
            <SendCard
              balance={balance}
              onSendDemoTx={handleSendDemoTx}
              onViewHistory={() => setCurrentTab('history')}
              onSelectTxDetails={(tx) => setSelectedTx(tx)}
            />
          </div>
        )}

        {currentTab === 'history' && (
          <div className="py-2 animate-fadeIn">
            <TransactionHistory
              transactions={transactions}
              onSelectTx={(tx) => setSelectedTx(tx)}
              onClearHistory={handleClearHistory}
              onNavigateToSend={() => setCurrentTab('send')}
            />
          </div>
        )}

        {currentTab === 'profile' && (
          <div className="py-2 animate-fadeIn">
            <ProfileModal
              userEmail={userEmail}
              balance={balance}
              onResetBalance={handleResetBalance}
              onLogout={handleLogout}
              transactionCount={transactions.length}
            />
          </div>
        )}
      </main>

      {/* Transaction Details Modal */}
      <TxDetailsModal tx={selectedTx} onClose={() => setSelectedTx(null)} />

      {/* Bottom Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#090d15] py-6 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-[10px] border border-blue-500/30">
              ⚡
            </div>
            <span className="font-bold text-slate-400">Flash USDT Sender</span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400">DEMO V3.4</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-blue-400/70" />
            <span className="font-medium tracking-wide">PRANK MODE</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Status: <span className="text-emerald-400 font-semibold font-mono">Sandbox Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
