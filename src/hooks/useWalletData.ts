import { useQuery } from '@tanstack/react-query'
import { apiService } from '@/services/api'
import type { WalletBalance, WalletTransaction, WalletAlert, WalletStats } from '@/types/wallet'

export function useWalletData() {
  const balancesQuery = useQuery({
    queryKey: ['walletBalances'],
    queryFn: async () => {
      const response = await apiService.get<WalletBalance[]>('/admin/wallets/balances')
      return response.data!
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
  })

  const transactionsQuery = useQuery({
    queryKey: ['walletTransactions'],
    queryFn: async () => {
      const response = await apiService.get<WalletTransaction[]>('/admin/wallets/transactions')
      return response.data!
    },
    staleTime: 15000, // 15 seconds
  })

  const alertsQuery = useQuery({
    queryKey: ['walletAlerts'],
    queryFn: async () => {
      const response = await apiService.get<WalletAlert[]>('/admin/wallets/alerts')
      return response.data!
    },
    staleTime: 10000, // 10 seconds
    refetchInterval: 30000, // 30 seconds
  })

  const statsQuery = useQuery({
    queryKey: ['walletStats'],
    queryFn: async () => {
      const response = await apiService.get<WalletStats>('/admin/wallets/stats')
      return response.data!
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  })

  const refetch = () => {
    balancesQuery.refetch()
    transactionsQuery.refetch()
    alertsQuery.refetch()
    statsQuery.refetch()
  }

  return {
    balances: balancesQuery.data,
    transactions: transactionsQuery.data,
    alerts: alertsQuery.data,
    stats: statsQuery.data,
    isLoading: balancesQuery.isLoading || transactionsQuery.isLoading || alertsQuery.isLoading || statsQuery.isLoading,
    error: balancesQuery.error || transactionsQuery.error || alertsQuery.error || statsQuery.error,
    refetch,
  }
}
