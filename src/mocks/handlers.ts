import { http, HttpResponse } from 'msw'
import type { User, DashboardMetrics, PaginatedResponse } from '@/types'
import { walletHandlers } from './walletHandlers'

// Mock user data
const mockUsers: User[] = Array.from({ length: 150 }, (_, i) => ({
  id: `user-${i + 1}`,
  email: `user${i + 1}@example.com`,
  username: `user${i + 1}`,
  firstName: `User`,
  lastName: `${i + 1}`,
  kycStatus: ['not_started', 'pending', 'approved', 'rejected'][Math.floor(Math.random() * 4)] as any,
  role: ['user', 'vip', 'admin'][Math.floor(Math.random() * 3)] as any,
  status: ['active', 'suspended', 'banned', 'pending_verification'][Math.floor(Math.random() * 4)] as any,
  createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  lastLoginAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() : undefined,
  walletBalances: [
    {
      asset: 'BTC',
      balance: (Math.random() * 10).toFixed(8),
      lockedBalance: (Math.random() * 2).toFixed(8),
      usdValue: Math.random() * 500000,
    },
    {
      asset: 'ETH',
      balance: (Math.random() * 100).toFixed(6),
      lockedBalance: (Math.random() * 10).toFixed(6),
      usdValue: Math.random() * 200000,
    },
    {
      asset: 'USDT',
      balance: (Math.random() * 10000).toFixed(2),
      lockedBalance: (Math.random() * 1000).toFixed(2),
      usdValue: parseFloat((Math.random() * 10000).toFixed(2)),
    },
  ],
  tradingStats: {
    totalVolume: Math.random() * 1000000,
    totalTrades: Math.floor(Math.random() * 1000),
    winRate: Math.random() * 100,
    profitLoss: (Math.random() - 0.5) * 100000,
    averageTradeSize: Math.random() * 50000,
  },
  p2pStats: {
    completedTrades: Math.floor(Math.random() * 100),
    rating: 3 + Math.random() * 2,
    totalVolume: Math.random() * 500000,
    avgCompletionTime: Math.floor(Math.random() * 60) + 10,
  },
  perpetualPositions: Math.random() > 0.7 ? [{
    id: `pos-${i}`,
    symbol: 'BTCUSDT',
    side: Math.random() > 0.5 ? 'long' : 'short',
    size: Math.random() * 10,
    entryPrice: 45000 + Math.random() * 10000,
    markPrice: 45000 + Math.random() * 10000,
    pnl: (Math.random() - 0.5) * 5000,
    margin: Math.random() * 10000,
    leverage: Math.floor(Math.random() * 20) + 1,
    createdAt: new Date().toISOString(),
  }] : [],
  settings: {
    twoFactorEnabled: Math.random() > 0.5,
    withdrawalsEnabled: Math.random() > 0.2,
    tradingEnabled: Math.random() > 0.1,
    notificationsEnabled: Math.random() > 0.3,
  },
}))

const mockDashboardMetrics: DashboardMetrics = {
  totalUsers: 12543,
  activeUsers: 8931,
  totalVolume: 2847291047,
  dailyVolume: 142847593,
  totalTrades: 847592,
  dailyTrades: 15847,
  systemUptime: 99.9,
  pendingKyc: 245,
  flaggedUsers: 18,
  newSignups: 127,
}

export const handlers = [
  // Auth endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as any
    
    if (email === 'admin@crypto.com' && password === 'admin123') {
      return HttpResponse.json({
        success: true,
        data: {
          user: {
            id: 'admin-1',
            email: 'admin@crypto.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'super_admin',
          },
          token: 'mock-jwt-token',
          permissions: [
            'users.view',
            'users.edit',
            'users.ban',
            'wallets.view',
            'wallets.freeze',
            'trades.view',
            'system.view',
            'system.edit',
            'admin.logs',
          ],
        },
      })
    }

    return HttpResponse.json({
      success: false,
      message: 'Invalid credentials',
    }, { status: 401 })
  }),

  // Dashboard endpoints
  http.get('/api/admin/dashboard/metrics', () => {
    return HttpResponse.json({
      success: true,
      data: {
        metrics: mockDashboardMetrics,
        systemMetrics: [
          { label: 'API Response Time', value: '45ms', change: -12.5, trend: 'down', icon: '⚡' },
          { label: 'Database Queries/sec', value: '1,247', change: 8.3, trend: 'up', icon: '💾' },
          { label: 'Active Connections', value: '8,931', change: 15.7, trend: 'up', icon: '🔗' },
          { label: 'Memory Usage', value: '68%', change: 2.1, trend: 'up', icon: '🧠' },
        ],
      },
    })
  }),

  http.get('/api/admin/dashboard/chart', ({ request }) => {
    const url = new URL(request.url)
    const timeframe = url.searchParams.get('timeframe') || '24h'
    
    const dataPoints = timeframe === '24h' ? 24 : timeframe === '7d' ? 7 : 30
    const chartData = Array.from({ length: dataPoints }, (_, i) => {
      const baseTime = new Date()
      baseTime.setHours(baseTime.getHours() - (dataPoints - i))
      
      return {
        timestamp: baseTime.toISOString(),
        value: Math.random() * 10000000 + 5000000,
        label: `Volume ${i}`,
      }
    })

    return HttpResponse.json({
      success: true,
      data: chartData,
    })
  }),

  // Users endpoints
  http.get('/api/admin/users', ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const search = url.searchParams.get('search') || ''
    const status = url.searchParams.get('status')
    const kycStatus = url.searchParams.get('kycStatus')
    const role = url.searchParams.get('role')

    let filteredUsers = mockUsers

    // Apply filters
    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(search.toLowerCase()) ||
        user.username?.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status) {
      filteredUsers = filteredUsers.filter(user => user.status === status)
    }

    if (kycStatus) {
      filteredUsers = filteredUsers.filter(user => user.kycStatus === kycStatus)
    }

    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role)
    }

    // Pagination
    const total = filteredUsers.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const end = start + limit
    const paginatedUsers = filteredUsers.slice(start, end)

    const response: PaginatedResponse<User> = {
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }

    return HttpResponse.json({
      success: true,
      data: response,
    })
  }),

  http.get('/api/admin/users/:id', ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id)
    
    if (!user) {
      return HttpResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 })
    }

    return HttpResponse.json({
      success: true,
      data: user,
    })
  }),

  http.post('/api/admin/users/:id/ban', ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id)
    
    if (!user) {
      return HttpResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 })
    }

    user.status = 'banned'
    
    return HttpResponse.json({
      success: true,
      message: 'User banned successfully',
    })
  }),

  http.post('/api/admin/users/:id/suspend', ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id)
    
    if (!user) {
      return HttpResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 })
    }

    user.status = 'suspended'
    
    return HttpResponse.json({
      success: true,
      message: 'User suspended successfully',
    })
  }),

  http.post('/api/admin/users/:id/reset-2fa', ({ params }) => {
    const user = mockUsers.find(u => u.id === params.id)
    
    if (!user) {
      return HttpResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 })
    }

    user.settings.twoFactorEnabled = false
    
    return HttpResponse.json({
      success: true,
      message: '2FA reset successfully',
    })
  }),

  http.post('/api/admin/users/:id/toggle-withdrawals', async ({ params, request }) => {
    const { enabled } = (await request.json()) as any
    const user = mockUsers.find(u => u.id === params.id)
    
    if (!user) {
      return HttpResponse.json({
        success: false,
        message: 'User not found',
      }, { status: 404 })
    }

    user.settings.withdrawalsEnabled = enabled
    
    return HttpResponse.json({
      success: true,
      message: `Withdrawals ${enabled ? 'enabled' : 'disabled'} successfully`,
    })
  }),

  http.get('/api/admin/users/:id/audit-log', ({ params }) => {
    const auditLog = Array.from({ length: 20 }, (_, i) => ({
      id: `audit-${i}`,
      adminId: 'admin-1',
      adminUsername: 'admin',
      action: [
        'User login',
        'Password changed',
        'Withdrawal requested',
        'Trade executed',
        'KYC submitted',
        '2FA enabled',
        'Profile updated',
      ][Math.floor(Math.random() * 7)],
      targetType: 'user',
      targetId: params.id,
      details: { ip: '192.168.1.1', userAgent: 'Mozilla/5.0...' },
      timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      ipAddress: '192.168.1.1',
    }))

    return HttpResponse.json({
      success: true,
      data: auditLog,
    })
  }),

  ...walletHandlers,
]
