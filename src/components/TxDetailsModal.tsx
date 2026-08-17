import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  Check,
  ShieldCheck,
  AlertTriangle,
  Download,
  Share2,
} from 'lucide-react';
import { DemoTransaction } from '../types';
import { formatCurrency } from '../utils/helpers';

interface TxDetailsModalProps {
  tx: DemoTransaction | null;
  onClose: () => void;
}

export const TxDetailsModal: React.FC<TxDetailsModalProps> = ({ tx, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!tx) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
      id="tx-details-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0f1523] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden relative"
        id="tx-details-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#121929]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-bold text-white"> Transaction Receipt</h3>
          </div>
          <button
            type="button"
            id="close-receipt-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status & Amount Highlight */}
          <div className="text-center py-4 bg-[#141c2c] rounded-xl border border-slate-800">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status: Successful </span>
            </div>
            <div className="text-3xl font-extrabold font-mono text-white">
              {formatCurrency(tx.amount)} <span className="text-emerald-400 text-sm font-sans">USDT</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{tx.network}</p>
          </div>

          {/* Key-Value Details */}
          <div className="space-y-3 font-mono text-xs">
            {/* Tx ID */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121826] border border-slate-800">
              <span className="text-slate-400"> Tx ID</span>
              <div className="flex items-center gap-1.5">
                <span className="text-blue-300 select-all font-semibold truncate max-w-[220px]">
                  {tx.txId}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(tx.txId, 'txid')}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                >
                  {copiedKey === 'txid' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Recipient Full Address */}
            <div className="p-2.5 rounded-lg bg-[#121826] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400">
                <span>Recipient Address</span>
                <button
                  type="button"
                  onClick={() => handleCopy(tx.recipient, 'rec')}
                  className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'rec' ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
              <p className="text-slate-200 select-all break-all text-[11px] font-medium">{tx.recipient}</p>
            </div>

            {/* Simulated Block Number */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121826] border border-slate-800">
              <span className="text-slate-400">Block Height </span>
              <span className="text-slate-200 font-semibold">#{tx.blockNumber}</span>
            </div>

            {/* Gas Fee */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121826] border border-slate-800">
              <span className="text-slate-400"> Network Gas</span>
              <span className="text-emerald-400 font-semibold">{tx.gasFee}</span>
            </div>

            {/* Timestamp */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#121826] border border-slate-800">
              <span className="text-slate-400">Execution Time</span>
              <span className="text-slate-200">{tx.timestamp} UTC</span>
            </div>
          </div>

          <div className="text-center text-[10px] font-semibold tracking-[0.18em] text-blue-400/70"></div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#121929] border-t border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
