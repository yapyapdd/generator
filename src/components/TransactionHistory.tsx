import React, { useState } from 'react';
import {
  History,
  Search,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Filter,
  Download,
  Trash2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { DemoTransaction } from '../types';
import { formatCurrency, truncateAddress } from '../utils/helpers';

interface TransactionHistoryProps {
  transactions: DemoTransaction[];
  onSelectTx: (tx: DemoTransaction) => void;
  onClearHistory?: () => void;
  onNavigateToSend?: () => void;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  onSelectTx,
  onClearHistory,
  onNavigateToSend,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.amount.toString().includes(searchTerm);

    const matchesNetwork =
      networkFilter === 'all' || tx.network.toLowerCase().includes(networkFilter.toLowerCase());

    return matchesSearch && matchesNetwork;
  });

  const exportCSV = () => {
    const headers = 'Amount,Recipient,Status,Date,Transaction ID,Network\n';
    const rows = transactions
      .map(
        (tx) =>
          `"${tx.amount} USDT","${tx.recipient}","${tx.status}","${tx.timestamp}","${tx.txId}","${tx.network}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flash-usdt-demo-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Top Header Card */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <History className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Simulated Transaction History
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Audit log of all demo broadcasts generated during this session.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              id="export-csv-btn"
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 bg-[#141b2b] hover:bg-slate-800 border border-slate-700/70 hover:text-white transition-all"
              title="Download CSV report of simulated records"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            {onClearHistory && (
              <button
                type="button"
                id="clear-history-btn"
                onClick={onClearHistory}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-red-400 bg-[#141b2b] hover:bg-red-500/10 border border-slate-700/70 hover:border-red-500/30 transition-all"
                title="Reset session history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Log</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              id="history-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Tx ID, recipient address, or amount..."
              className="w-full pl-9 pr-4 py-2 bg-[#141b2b] border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          {/* Network Filter Pills */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3 h-3" />
              Net:
            </span>
            {[
              { id: 'all', label: 'All Protocols' },
              { id: 'trc', label: 'TRC-20' },
              { id: 'erc', label: 'ERC-20' },
              { id: 'bep', label: 'BEP-20' },
            ].map((f) => (
              <button
                key={f.id}
                id={`filter-tab-${f.id}`}
                onClick={() => setNetworkFilter(f.id)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all shrink-0 ${
                  networkFilter === f.id
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 px-4 text-center space-y-3" id="history-empty-state">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto border border-slate-700">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">No simulated transactions found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm || networkFilter !== 'all'
                ? 'No records match your filter criteria. Try adjusting your search query.'
                : 'No transactions have been dispatched yet. Use the Send USDT module to simulate your first transfer.'}
            </p>
            {onNavigateToSend && (
              <button
                onClick={onNavigateToSend}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Simulate First Transfer</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto" id="transaction-history-table-wrapper">
            <table className="w-full text-left border-collapse" id="transaction-history-table">
              <thead>
                <tr className="border-b border-slate-800 bg-[#121929] text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Recipient</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-xs">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    id={`tx-row-${tx.id}`}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectTx(tx)}
                  >
                    {/* Amount */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-500/30">
                          ₮
                        </div>
                        <div>
                          <span className="font-bold text-slate-100 text-sm">
                            {formatCurrency(tx.amount)}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">USDT</span>
                          <span className="block text-[10px] text-slate-400">{tx.network}</span>
                        </div>
                      </div>
                    </td>

                    {/* Recipient */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="bg-slate-800/80 px-2 py-1 rounded text-slate-200 border border-slate-700/60 font-medium"
                          title={tx.recipient}
                        >
                          {truncateAddress(tx.recipient, 6, 5)}
                        </span>
                        <button
                          type="button"
                          id={`copy-recipient-${tx.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(tx.recipient, `rec-${tx.id}`);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          title="Copy Full Recipient Address"
                        >
                          {copiedId === `rec-${tx.id}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        {tx.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {tx.timestamp}
                    </td>

                    {/* Transaction ID */}
                    <td className="py-3.5 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-900/50 text-[11px] truncate max-w-[140px]">
                          {tx.txId}
                        </span>
                        <button
                          type="button"
                          id={`copy-txid-${tx.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(tx.txId, `txid-${tx.id}`);
                          }}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                          title="Copy Transaction ID"
                        >
                          {copiedId === `txid-${tx.id}` ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        id={`view-details-${tx.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTx(tx);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-blue-600 text-slate-300 hover:text-white border border-slate-700/60 transition-colors text-xs font-semibold"
                      >
                        <span>Receipt</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="bg-[#0b0e15] px-4 py-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-400" />
            <span>Showing {filteredTransactions.length} of {transactions.length} simulated transactions</span>
          </div>
          <span className="font-mono text-blue-400/70">PRANK MODE</span>
        </div>
      </div>
    </div>
  );
};
