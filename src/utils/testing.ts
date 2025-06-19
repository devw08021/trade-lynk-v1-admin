import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createMemoryRouter } from '@tanstack/react-router'
import React from 'react'

// Test wrapper with providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  const router = createMemoryRouter([
    {
      path: '/',
      element: <div>{children}</div>,
    },
  ])

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data generators
export const mockUser = (overrides?: Partial<User>): User => ({
  id: 'test-user-1',
  email: 'test@example.com',
  username: 'testuser',
  firstName: 'Test',
  lastName: 'User',
  kycStatus: 'approved',
  role: 'user',
  status: 'active',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  walletBalances: [
    {
      asset: 'BTC',
      balance: '1.5',
      lockedBalance: '0.1',
      usdValue: 50000,
    },
  ],
  tradingStats: {
    totalVolume: 100000,
    totalTrades: 50,
    winRate: 65.5,
    profitLoss: 5000,
    averageTradeSize: 2000,
  },
  p2pStats: {
    completedTrades: 25,
    rating: 4.5,
    totalVolume: 50000,
    avgCompletionTime: 15,
  },
  perpetualPositions: [],
  settings: {
    twoFactorEnabled: true,
    withdrawalsEnabled: true,
    tradingEnabled: true,
    notificationsEnabled: true,
  },
  ...overrides,
})

// Test utilities for API mocking
export const createMockApiResponse = <T>(data: T, success = true) => ({
  success,
  data: success ? data : undefined,
  message: success ? undefined : 'Mock error message',
})

export const createMockPaginatedResponse = <T>(
  data: T[],
  page = 1,
  limit = 20
): PaginatedResponse<T> => ({
  data,
  pagination: {
    page,
    limit,
    total: data.length,
    totalPages: Math.ceil(data.length / limit),
  },
})
