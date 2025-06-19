import { useQuery } from '@tanstack/react-query'
import { useDashboardStore } from '@/stores/dashboardStore'
import { apiService } from '@/services/api'
import type { DashboardMetrics, ChartData } from '@/types'

export function useDashboardMetrics() {
  const { metrics, isLoading, error } = useDashboardStore()

  const query = useQuery({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      const response = await apiService.get<{
        metrics: DashboardMetrics
        systemMetrics: any[]
      }>('/admin/dashboard/metrics')
      return response.data!
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 300000, // 5 minutes
  })

  return {
    metrics: query.data?.metrics || metrics,
    systemMetrics: query.data?.systemMetrics || [],
    isLoading: query.isLoading || isLoading,
    error: query.error?.message || error,
    refetch: query.refetch,
  }
}

export function useChartData(timeframe: '24h' | '7d' | '30d' | '90d' = '24h') {
  return useQuery({
    queryKey: ['chartData', timeframe],
    queryFn: async () => {
      const response = await apiService.get<ChartData[]>(`/admin/dashboard/chart?timeframe=${timeframe}`)
      return response.data!
    },
    staleTime: 300000, // 5 minutes
  })
}
