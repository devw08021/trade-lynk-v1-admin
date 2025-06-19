import { http, HttpResponse } from 'msw'
import type { WalletBalance, WalletTransaction, WalletAlert, WalletStats } from '@/types/wallet'

// Mock wallet balances
const mockWalletBalances: WalletBalance[] = [
  {
    asset: 'BTC',
    totalBalance: '487.5924',
    availableBalance: '445.8201',
    lockedBalance: '41.7723',
    pendingDeposits: '2.1500',
    pendingWithdrawals: '8.9200',
    usdValue: 21125450.75,
    lastUpdated: new Date().toISOString(),
    hotWalletBalance: '89.2841',
    coldWalletBalance: '398.3083',
    reserveRatio: 0.82,
  },
  {
    asset: 'ETH',
    totalBalance: '12847.3251',
    availableBalance: '11203.8894',
    lockedBalance: '1643.4357',
    pendingDeposits: '124.7500',
    pendingWithdrawals: '287.3400',
    usdValue: 34562890.25,
    lastUpdated: new Date().toISOString(),
    hotWalletBalance: '2569.4650',
    coldWalletBalance: '10277.8601',
    reserveRatio: 0.75,
  },
  {
    asset: 'USDT',
    totalBalance: '8947521.45',
    availableBalance: '8234567.89',
    lockedBalance: '712953.56',
    pendingDeposits: '45000.00',
    pendingWithdrawals: '189500.00',
    usdValue: 8947521.45,
    lastUpdated: new Date().toISOString(),
    hotWalletBalance: '1789504.29',
    coldWalletBalance: '7158017.16',
    reserveRatio: 0.88,
  },
  // Add more mock balances...
]

// Mock transactions
const mockTransactions: WalletTransaction[] = Array.from({ length: 50 }, (_, i) => ({
  id: `tx-${i + 1}`,
  txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
  type: ['deposit', 'withdrawal', 'internal_transfer', 'fee', 'trading'][Math.floor(Math.random() * 5)] as any,
  asset: ['BTC', 'ETH', 'USDT', 'BNB'][Math.floor(Math.random() * 4)],
  amount: (Math.random() * 100).toFixed(8),
  fee: (Math.random() * 0.01).toFixed(8),
  status: ['pending', 'confirmed', 'failed'][Math.floor(Math.random() * 3)] as any,
  confirmations: Math.floor(Math.random() * 20),
  requiredConfirmations: 6,
  fromAddress: Math.random() > 0.5 ? `1${Math.random().toString(36).substr(2, 25)}` : undefined,
  toAddress: Math.random() > 0.5 ? `1${Math.random().toString(36).substr(2, 25)}` : undefined,
  userId: `user-${Math.floor(Math.random() * 1000)}`,
  userEmail: `user${Math.floor(Math.random() * 1000)}@example.com`,
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  blockHeight: Math.floor(Math.random() * 1000000),
  risk_score: Math.floor(Math.random() * 100),
  flagged: Math.random() > 0.9,
}))

// Mock alerts
const mockAlerts: WalletAlert[] = [
  {
    id: 'alert-1',
    type: 'low_balance',
    severity: 'critical',
    asset: 'BTC',
    message: 'BTC hot wallet balance below critical threshold',
    threshold: '100 BTC',
    currentValue: '89.28 BTC',
    acknowledged: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'alert-2',
    type: 'high_volume',
    severity: 'medium',
    asset: 'USDT',
    message: 'Unusually high withdrawal volume detected',
    threshold: '$500,000',
    currentValue: '$1,245,000',
    acknowledged: true,
    acknowledgedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    acknowledgedBy: 'admin',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  // Add more mock alerts...
]

const mockStats: WalletStats = {
    totalDeposits24h: 2457891.50,
    totalWithdrawals24h: 1896543.25,
    netFlow24h: 561348.25,
    activeUsers24h: 8934,
    pendingTransactions: 247,
    failedTransactions24h: 18,
    averageConfirmationTime: 145, // seconds
    totalVolume24h: 45789234.75,
  }
  
  // Export handlers
  export const walletHandlers = [
    http.get('/api/admin/wallets/balances', () => {
      return HttpResponse.json({
        success: true,
        data: mockWalletBalances,
      })
    }),
  
    http.get('/api/admin/wallets/transactions', () => {
      return HttpResponse.json({
        success: true,
        data: mockTransactions,
      })
    }),
  
    http.get('/api/admin/wallets/alerts', () => {
      return HttpResponse.json({
        success: true,
        data: mockAlerts,
      })
    }),
  
    http.get('/api/admin/wallets/stats', () => {
      return HttpResponse.json({
        success: true,
        data: mockStats,
      })
    }),
  ]
  