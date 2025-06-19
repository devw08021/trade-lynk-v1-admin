export interface User {
    id: string
    email: string
    username: string
    firstName: string
    lastName: string
    kycStatus: KYCStatus
    role: UserRole
    status: UserStatus
    createdAt: string
    updatedAt: string
    lastLoginAt?: string
    walletBalances: WalletBalance[]
    tradingStats: TradingStats
    p2pStats: P2PStats
    perpetualPositions: PerpetualPosition[]
    settings: UserSettings
  }
  
  export type KYCStatus = 'not_started' | 'pending' | 'approved' | 'rejected' | 'expired'
  export type UserRole = 'user' | 'vip' | 'admin' | 'super_admin' | 'support'
  export type UserStatus = 'active' | 'suspended' | 'banned' | 'pending_verification'
  
  export interface WalletBalance {
    asset: string
    balance: string
    lockedBalance: string
    usdValue: number
  }
  
  export interface TradingStats {
    totalVolume: number
    totalTrades: number
    winRate: number
    profitLoss: number
    averageTradeSize: number
  }
  
  export interface P2PStats {
    completedTrades: number
    rating: number
    totalVolume: number
    avgCompletionTime: number
  }
  
  export interface PerpetualPosition {
    id: string
    symbol: string
    side: 'long' | 'short'
    size: number
    entryPrice: number
    markPrice: number
    pnl: number
    margin: number
    leverage: number
    createdAt: string
  }
  
  export interface UserSettings {
    twoFactorEnabled: boolean
    withdrawalsEnabled: boolean
    tradingEnabled: boolean
    notificationsEnabled: boolean
  }
  
export interface DashboardMetrics {
    totalUsers: number
    activeUsers: number
    totalVolume: number
    dailyVolume: number
    totalTrades: number
    dailyTrades: number
    systemUptime: number
    pendingKyc: number
    flaggedUsers: number
    newSignups: number
  }
  
  export interface SystemMetric {
    label: string
    value: string | number
    change?: number
    trend?: 'up' | 'down' | 'neutral'
    icon?: string
  }
  
  export interface ChartData {
    timestamp: string
    value: number
    label?: string
  }
  
  export interface AdminAction {
    id: string
    adminId: string
    adminUsername: string
    action: string
    targetType: 'user' | 'system' | 'trade' | 'wallet'
    targetId: string
    details: Record<string, any>
    timestamp: string
    ipAddress: string
  }
  
  // API Response types
  export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
  
  export interface APIResponse<T = any> {
    success: boolean
    data?: T
    message?: string
    errors?: Record<string, string[]>
  }
  
  // Filter and sort types
  export interface UserFilters {
    search?: string
    status?: UserStatus
    kycStatus?: KYCStatus
    role?: UserRole
    dateFrom?: string
    dateTo?: string
  }
  
  export interface SortOptions {
    field: string
    direction: 'asc' | 'desc'
  }
  
  export interface PaginationOptions {
    page: number
    limit: number
  }
  
  // Permission types for RBAC
  export type Permission = 
    | 'users.view' 
    | 'users.edit' 
    | 'users.ban' 
    | 'users.delete'
    | 'wallets.view'
    | 'wallets.freeze'
    | 'trades.view'
    | 'trades.cancel'
    | 'system.view'
    | 'system.edit'
    | 'admin.logs'
  
  export interface RolePermissions {
    role: UserRole
    permissions: Permission[]
  }
  
  