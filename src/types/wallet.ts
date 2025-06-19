export interface WalletTransaction {
    id: string
    txHash: string
    type: 'deposit' | 'withdrawal' | 'internal_transfer' | 'fee' | 'trading'
    asset: string
    amount: string
    fee: string
    status: 'pending' | 'confirmed' | 'failed' | 'cancelled'
    confirmations: number
    requiredConfirmations: number
    fromAddress?: string
    toAddress?: string
    userId?: string
    userEmail?: string
    createdAt: string
    updatedAt: string
    blockHeight?: number
    risk_score?: number
    flagged?: boolean
    notes?: string
  }
  
  export interface WalletBalance {
    asset: string
    totalBalance: string
    availableBalance: string
    lockedBalance: string
    pendingDeposits: string
    pendingWithdrawals: string
    usdValue: number
    lastUpdated: string
    hotWalletBalance: string
    coldWalletBalance: string
    reserveRatio: number
  }
  
  export interface WalletConfig {
    asset: string
    enabled: boolean
    depositEnabled: boolean
    withdrawalEnabled: boolean
    minDeposit: string
    minWithdrawal: string
    maxWithdrawal: string
    withdrawalFee: string
    confirmationsRequired: number
    hotWalletLimit: string
    coldWalletThreshold: string
    maintenanceMode: boolean
    network: string
    contractAddress?: string
    decimals: number
  }
  
  export interface WalletAlert {
    id: string
    type: 'low_balance' | 'high_volume' | 'suspicious_activity' | 'maintenance_required'
    severity: 'low' | 'medium' | 'high' | 'critical'
    asset: string
    message: string
    threshold?: string
    currentValue?: string
    acknowledged: boolean
    createdAt: string
    acknowledgedAt?: string
    acknowledgedBy?: string
  }
  
  export interface WalletStats {
    totalDeposits24h: number
    totalWithdrawals24h: number
    netFlow24h: number
    activeUsers24h: number
    pendingTransactions: number
    failedTransactions24h: number
    averageConfirmationTime: number
    totalVolume24h: number
  }
  