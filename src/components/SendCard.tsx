import React, { useState } from 'react';
import {
  Send,
  Clipboard,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { NetworkType, DemoTransaction } from '../types';
import {
  formatCurrency,
  truncateAddress,
  generateDemoTxId,
  generateDemoTxHash,
  SAMPLE_ADDRESSES,
} from '../utils/helpers';

interface SendCardProps {
  balance: number;
  onSendDemoTx: (newTx: DemoTransaction) => void;
  onViewHistory: () => void;
  onSelectTxDetails?: (tx: Transaction) => void;
}

export const SendCard: React.FC<SendCardProps> = ({
  balance,
  onSendTx,
  onViewHistory,
  onSelectTxDetails,
}) => {
  const [amount, setAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string>('');
  const [network, setNetwork] = useState<NetworkType>('TRC-20 (Tron)');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Send status state machine: 'idle' | 'processing' | 'success'
  const [sendState, setSendState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [processingStep, setProcessingStep] = useState<string>('');
  const [completedTx, setCompletedTx] = useState<Transaction | null>(null);

  // Copy states
  const [copiedTxId, setCopiedTxId] = useState(false);
  const [pasteFeedback, setPasteFeedback] = useState(false);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);

  const networks: { id: NetworkType; fee: string; speed: string; desc: string }[] = [
    { id: 'TRC-20 (Tron)', fee: '0.00 USDT', speed: '~1.5s', desc: 'Zero fee' },
    { id: 'ERC-20 (Ethereum)', fee: '1.20 USDT ', speed: '~3.0s', desc: 'Standard EVM Sim' },
    { id: 'BEP-20 (BNB Smart Chain)', fee: '0.15 USDT ', speed: '~2.0s', desc: 'Fast BSC ' },
    { id: 'Polygon', fee: '0.05 USDT ', speed: '~2.0s', desc: 'Low Gas ' },
  ];

  const handlePasteAddress = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          setRecipient(text.trim());
          setPasteFeedback(true);
          setValidationError(null);
          setTimeout(() => setPasteFeedback(false), 2000);
          return;
        }
      }
    } catch {
      // Fallback: If clipboard read permissions are blocked in iframe
    }
    // If empty or permission blocked, use first sample address as helpful fallback
    const sample = SAMPLE_ADDRESSES[0].address;
    setRecipient(sample);
    setPasteFeedback(true);
    setValidationError(null);
    setTimeout(() => setPasteFeedback(false), 2000);
  };

  const handleSelectSample = (sampleAddr: string, sampleNetwork: NetworkType) => {
    setRecipient(sampleAddr);
    setNetwork(sampleNetwork);
    setShowSampleDropdown(false);
    setValidationError(null);
  };

  const handleSetPercentage = (pct: number) => {
    const calculated = (balance * pct).toFixed(2);
    setAmount(calculated);
    setValidationError(null);
  };

  const handleSend = () => {
    setValidationError(null);

    // 1. Validate amount and recipient
    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Please enter a valid USDT amount greater than 0.');
      return;
    }

    if (numAmount > balance) {
      setValidationError(`Insufficient  balance. You have $${formatCurrency(balance)} USDT.`);
      return;
    }

    if (!recipient.trim()) {
      setValidationError('Please enter or paste a recipient wallet address.');
      return;
    }

    if (recipient.trim().length < 8) {
      setValidationError('Please enter a valid wallet address (minimum 8 characters).');
      return;
    }

    // 2. Disable send button & start processing simulation
    setSendState('processing');
    setProcessingStep('Packaging  transaction payload...');

    // Progress updates over 2.8 seconds
    setTimeout(() => {
      setProcessingStep('Broadcasting payload to mempool node...');
    }, 900);

    setTimeout(() => {
      setProcessingStep('Simulating cryptographic signature confirmation...');
    }, 1800);

    setTimeout(() => {
      // Complete transaction
      const now = new Date();
      const timestampStr = now.toISOString().replace('T', ' ').slice(0, 19);
      const selectedNet = networks.find((n) => n.id === network);

      const newTx: DemoTransaction = {
        id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        txId: generateDemoTxId(network),
        txHash: generateDemoTxHash(),
        amount: numAmount,
        recipient: recipient.trim(),
        recipientTruncated: truncateAddress(recipient.trim(), 8, 6),
        network,
        status: 'Successful',
        timestamp: timestampStr,
        gasFee: selectedNet ? selectedNet.fee : '0.00 USDT ',
        blockNumber: Math.floor(62000000 + Math.random() * 900000),
        isDemo: true,
      };

      setCompletedTx(newTx);
      setSendState('success');
      onSendDemoTx(newTx);
    }, 2800);
  };

  const handleResetForm = () => {
    setAmount('');
    setRecipient('');
    setSendState('idle');
    setCompletedTx(null);
    setValidationError(null);
  };

  const handleCopyTxId = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTxId(true);
    setTimeout(() => setCopiedTxId(false), 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Card Header & Container */}
      <div className="bg-[#0f1523] border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* Card Title */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Send className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Send USDT 
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
               dispatching USDT instantly with zero risk on test parameters.
            </p>
          </div>

          {/* Currency Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141d2e] border border-slate-700/80 shadow-inner">
            <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-[11px] text-white shadow-sm">
              ₮
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight">Tether USDT</span>
              <span className="text-[10px] text-slate-400">Available: ${formatCurrency(balance)}</span>
            </div>
          </div>
        </div>

        {/* ================= SUCCESS STATE VIEW ================= */}
        {sendState === 'success' && completedTx ? (
          <div id="-tx-success-view" className="space-y-6 animate-fadeIn">
            {/* Success Icon & Header */}
            <div className="text-center py-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/30 p-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Transaction Successful
              </h3>
              <p className="text-xs text-emerald-400 font-medium mt-1">
                 payload successfully processed & broadcasted
              </p>

              {/* Prominent Demo/Simulation Label */}
              <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span></span>
              </div>
            </div>

            {/* Transaction Summary Card */}
            <div className="bg-[#141c2c] rounded-xl p-5 border border-slate-700/80 space-y-3.5 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs text-slate-400 font-medium"> Amount</span>
                <span className="font-mono text-base sm:text-lg font-extrabold text-emerald-400">
                  {formatCurrency(completedTx.amount)} <span className="text-xs text-white">USDT</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Recipient Address</span>
                <span
                  className="font-mono text-xs text-slate-200 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700 font-medium"
                  title={completedTx.recipient}
                >
                  {completedTx.recipientTruncated}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Check className="w-3 h-3" />
                  Successful 
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1">
                <span className="text-xs text-slate-400 font-medium"> Transaction ID</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[11px] text-blue-300 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/50 truncate max-w-[200px]">
                    {completedTx.txId}
                  </span>
                  <button
                    type="button"
                    id="copy-txid-success-btn"
                    onClick={() => handleCopyTxId(completedTx.txId)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy  Transaction ID"
                  >
                    {copiedTxId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Network Protocol</span>
                <span className="font-mono text-slate-300">{completedTx.network}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span> Gas Fee</span>
                <span className="font-mono text-slate-300">{completedTx.gasFee}</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Timestamp</span>
                <span className="font-mono text-slate-300">{completedTx.timestamp} UTC</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                id="send-another-simulation-btn"
                onClick={handleResetForm}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-all shadow-md shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Another Simulation</span>
              </button>

              <button
                type="button"
                id="view-in-history-btn"
                onClick={onViewHistory}
                className="py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 flex items-center justify-center gap-2"
              >
                <span>View Transaction History</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onSelectTxDetails && (
                <button
                  type="button"
                  id="view-full-receipt-btn"
                  onClick={() => onSelectTxDetails(completedTx)}
                  className="py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 hover:text-blue-400 bg-transparent hover:bg-slate-800/40 border border-slate-700/60 transition-all flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Full Receipt</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ================= INPUT / SEND FORM ================= */
          <div className="space-y-5" id="send-form-container">
            {/* Validation Error Banner */}
            {validationError && (
              <div
                id="send-validation-error"
                className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-200">Validation Notice</p>
                  <p className="mt-0.5">{validationError}</p>
                </div>
              </div>
            )}

            {/* Network Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>Select Simulation Protocol Network</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {networks.map((net) => {
                  const isSelected = network === net.id;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      id={`network-select-${net.id.split(' ')[0]}`}
                      disabled={sendState === 'processing'}
                      onClick={() => setNetwork(net.id)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'bg-blue-600/15 border-blue-500/80 shadow-sm shadow-blue-500/10'
                          : 'bg-[#121826] border-slate-800 hover:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-slate-300'}`}>
                          {net.id.split(' ')[0]}
                        </span>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-1 leading-tight">{net.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="usdt-amount-input" className="text-xs font-semibold text-slate-300">
                  Amount to Send (USDT)
                </label>
                <div className="text-[11px] text-slate-400">
                  Balance:{' '}
                  <span className="font-mono text-slate-200 font-semibold">
                    ${formatCurrency(balance)} USDT
                  </span>
                </div>
              </div>

              <div className="relative">
                <input
                  id="usdt-amount-input"
                  type="number"
                  step="any"
                  min="0"
                  max={balance}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setValidationError(null);
                  }}
                  disabled={sendState === 'processing'}
                  placeholder="0.00"
                  className="w-full pl-4 pr-24 py-3 bg-[#141b2b] border border-slate-700/80 rounded-xl text-base sm:text-lg font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none gap-1.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-[9px] text-white">
                    ₮
                  </div>
                  <span className="font-bold text-xs text-white">USDT</span>
                </div>
              </div>

              {/* Quick Percentage Presets */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[10px] text-slate-400 font-medium mr-1">Quick:</span>
                {[
                  { label: '25%', val: 0.25 },
                  { label: '50%', val: 0.5 },
                  { label: '75%', val: 0.75 },
                  { label: 'MAX', val: 1.0 },
                ].map((pct) => (
                  <button
                    key={pct.label}
                    type="button"
                    id={`amount-pct-${pct.label}`}
                    disabled={sendState === 'processing'}
                    onClick={() => handleSetPercentage(pct.val)}
                    className="px-2.5 py-1 text-[11px] font-semibold font-mono rounded-lg bg-slate-800/80 text-slate-300 hover:bg-blue-600 hover:text-white border border-slate-700/70 transition-colors"
                  >
                    {pct.label}
                  </button>
                ))}
                <div className="hidden sm:flex items-center gap-1.5 ml-auto">
                  {[100, 500, 1000, 5000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      id={`amount-preset-${preset}`}
                      disabled={sendState === 'processing'}
                      onClick={() => {
                        setAmount(preset.toString());
                        setValidationError(null);
                      }}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-slate-700/40"
                    >
                      +{preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recipient Wallet Address Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="recipient-address-input" className="text-xs font-semibold text-slate-300">
                  Recipient Wallet Address
                </label>
                {/* Sample addresses dropdown toggle */}
                <div className="relative">
                  <button
                    type="button"
                    id="sample-addresses-toggle-btn"
                    onClick={() => setShowSampleDropdown(!showSampleDropdown)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <span>Sample Test Wallets</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showSampleDropdown && (
                    <div className="absolute right-0 mt-1 w-72 bg-[#121826] border border-slate-700 rounded-xl shadow-2xl z-30 p-1.5 space-y-1">
                      <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Select  Destination
                      </div>
                      {SAMPLE_ADDRESSES.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSample(s.address, s.network)}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs transition-colors flex flex-col"
                        >
                          <span className="font-semibold text-slate-200">{s.name}</span>
                          <span className="font-mono text-[10px] text-slate-400 truncate">
                            {s.address} ({s.network.split(' ')[0]})
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <input
                  id="recipient-address-input"
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    setRecipient(e.target.value);
                    setValidationError(null);
                  }}
                  disabled={sendState === 'processing'}
                  placeholder="e.g. TYDzsYUE298r8eBw3o3Pz6Zz7zV65Zz8Zz or 0x..."
                  className="w-full pl-3.5 pr-20 py-3 bg-[#141b2b] border border-slate-700/80 rounded-xl text-xs sm:text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />

                {/* Paste Button */}
                <button
                  type="button"
                  id="paste-address-btn"
                  disabled={sendState === 'processing'}
                  onClick={handlePasteAddress}
                  className="absolute inset-y-1.5 right-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-blue-300 font-semibold text-xs flex items-center gap-1.5 border border-slate-700 transition-all disabled:opacity-50"
                  title="Paste from clipboard or sample wallet"
                >
                  {pasteFeedback ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Pasted!</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>Paste</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Fee & Network details bar */}
            <div className="bg-[#121826] rounded-xl p-3 border border-slate-800 text-xs space-y-1.5 text-slate-400 font-mono">
              <div className="flex items-center justify-between">
                <span>Selected Protocol</span>
                <span className="text-slate-200 font-semibold">{network}</span>
              </div>
              <div className="flex items-center justify-between">
                <span> Network Fee</span>
                <span className="text-emerald-400 font-semibold">
                  {networks.find((n) => n.id === network)?.fee || '0.00 USDT '}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Speed</span>
                <span className="text-slate-300">
                  {networks.find((n) => n.id === network)?.speed || '~2s'}
                </span>
              </div>
            </div>

            {/* Prominent Send Button */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                id="send-usdt-submit-btn"
                disabled={sendState === 'processing'}
                onClick={handleSend}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-[#0f1523] transition-all shadow-lg shadow-blue-600/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Send USDT </span>
              </button>

              {/* Processing Spinner & Status directly underneath the button */}
              {sendState === 'processing' && (
                <div
                  id="transaction-processing-container"
                  className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 text-center space-y-2.5 animate-fadeIn"
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                    <span className="font-bold text-sm text-blue-300">Processing transaction…</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{processingStep}</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-full animate-pulse" />
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
