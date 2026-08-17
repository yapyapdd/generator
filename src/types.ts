export type NetworkType = 'TRC-20 (Tron)' | 'ERC-20 (Ethereum)' | 'BEP-20 (BNB Smart Chain)' | 'Polygon';

export interface DemoTransaction {
  id: string;
  txId: string;
  txHash: string;
  amount: number;
  recipient: string;
  recipientTruncated: string;
  network: NetworkType;
  status: 'Successful' | 'Processing' | 'Failed';
  timestamp: string;
  gasFee: string;
  blockNumber: number;
  isDemo: true;
}

export type NavigationTab = 'dashboard' | 'send' | 'history' | 'profile';

export interface UserSession {
  isAuthenticated: boolean;
  email: string;
  loginTime: string;
  simulatedBalance: number;
}
