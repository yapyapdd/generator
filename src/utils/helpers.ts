import { DemoTransaction, NetworkType } from '../types';

export function truncateAddress(address: string, startLen = 6, endLen = 5): string {
  if (!address) return '';
  if (address.length <= startLen + endLen) return address;
  return `${address.slice(0, startLen)}...${address.slice(-endLen)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

export function generateDemoTxId(network: NetworkType): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }

  if (network.includes('TRC-20')) {
    return `TX_TRON_${hash.slice(0, 16).toUpperCase()}`;
  }
  return `0x${hash}`;
}

export function generateDemoTxHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return `0x${hash}`;
}

export const SAMPLE_ADDRESSES: { name: string; address: string; network: NetworkType }[] = [
  {
    name: 'Binance Cold Storage (Demo)',
    address: 'TYDzsYUE298r8eBw3o3Pz6Zz7zV65Zz8Zz',
    network: 'TRC-20 (Tron)',
  },
  {
    name: 'OKX Deposit Vault (Demo)',
    address: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    network: 'TRC-20 (Tron)',
  },
  {
    name: 'Uniswap Liquidity Pool (Demo)',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    network: 'ERC-20 (Ethereum)',
  },
  {
    name: 'Trust Wallet Cold Node (Demo)',
    address: '0x55d398326f99059fF775485246999027B3197955',
    network: 'BEP-20 (BNB Smart Chain)',
  },
  {
    name: 'Kraken Settlement (Demo)',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    network: 'Polygon',
  },
];

export const INITIAL_TRANSACTIONS: DemoTransaction[] = [
  {
    id: 'tx-init-1',
    txId: 'TX_TRON_8F2A9C4E1D0B7E3F',
    txHash: '0x9a8f4c7e2b1d0e3a5f8c6b9d2e1a4f7c8b0e3a6d9f2c5b8e1a4d7f0c3e6a9b2d',
    amount: 15400.0,
    recipient: 'TYDzsYUE298r8eBw3o3Pz6Zz7zV65Zz8Zz',
    recipientTruncated: truncateAddress('TYDzsYUE298r8eBw3o3Pz6Zz7zV65Zz8Zz'),
    network: 'TRC-20 (Tron)',
    status: 'Successful',
    timestamp: '2026-08-16 18:45:12',
    gasFee: '0.00 USDT (Demo)',
    blockNumber: 62941029,
    isDemo: true,
  },
  {
    id: 'tx-init-2',
    txId: '0x8f2d9c1a5b4e7f0c',
    txHash: '0x4f7c8b0e3a6d9f2c5b8e1a4d7f0c3e6a9b2d9a8f4c7e2b1d0e3a5f8c6b9d2e1a',
    amount: 5000.0,
    recipient: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    recipientTruncated: truncateAddress('0xdAC17F958D2ee523a2206206994597C13D831ec7'),
    network: 'ERC-20 (Ethereum)',
    status: 'Successful',
    timestamp: '2026-08-16 16:20:05',
    gasFee: '1.20 USDT (Demo)',
    blockNumber: 20491823,
    isDemo: true,
  },
  {
    id: 'tx-init-3',
    txId: 'TX_TRON_4A9E2D8B1C7F0E3A',
    txHash: '0x2e1a4f7c8b0e3a6d9f2c5b8e1a4d7f0c3e6a9b2d9a8f4c7e2b1d0e3a5f8c6b9d',
    amount: 25000.0,
    recipient: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
    recipientTruncated: truncateAddress('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'),
    network: 'TRC-20 (Tron)',
    status: 'Successful',
    timestamp: '2026-08-15 21:10:48',
    gasFee: '0.00 USDT (Demo)',
    blockNumber: 62928491,
    isDemo: true,
  },
  {
    id: 'tx-init-4',
    txId: '0x7b1c3e5a9d2f4e6a',
    txHash: '0x3e6a9b2d9a8f4c7e2b1d0e3a5f8c6b9d2e1a4f7c8b0e3a6d9f2c5b8e1a4d7f0c',
    amount: 1250.5,
    recipient: '0x55d398326f99059fF775485246999027B3197955',
    recipientTruncated: truncateAddress('0x55d398326f99059fF775485246999027B3197955'),
    network: 'BEP-20 (BNB Smart Chain)',
    status: 'Successful',
    timestamp: '2026-08-15 14:02:30',
    gasFee: '0.15 USDT (Demo)',
    blockNumber: 41829104,
    isDemo: true,
  },
];
