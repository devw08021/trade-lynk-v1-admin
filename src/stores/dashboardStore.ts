import { create } from 'zustand'
import type { DashboardMetrics, ChartData, SystemMetric } from '@/types'

interface DashboardState {
  metrics: DashboardMetrics | null
  chartData: ChartData[]
  systemMetrics: SystemMetric[]
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

interface DashboardActions {
  fetchMetrics: () => Promise<void>
  fetchChartData: (timeframe: string) => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useDashboardStore = create<DashboardState & DashboardActions>()(
  (set, get) => ({
    // State
    metrics: null,
    chartData: [],
    systemMetrics: [],
    isLoading: false,
    error: null,
    lastUpdated: null,

    // Actions
    fetchMetrics: async () => {
      set({ isLoading: true, error: null })
      try {
        const response = await fetch('/api/admin/dashboard/metrics')
        if (!response.ok) throw new Error('Failed to fetch metrics')
        
        const data = await response.json()
        set({
          metrics: data.metrics,
          systemMetrics: data.systemMetrics,
          isLoading: false,
          lastUpdated: new Date().toISOString(),
        })
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch metrics',
          isLoading: false,
        })
      }
    },

    fetchChartData: async (timeframe: string) => {
      try {
        const response = await fetch(`/api/admin/dashboard/chart?timeframe=${timeframe}`)
        if (!response.ok) throw new Error('Failed to fetch chart data')
        
        const data = await response.json()
        set({ chartData: data.chartData })
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to fetch chart data',
        })
      }
    },

    setLoading: (loading: boolean) => set({ isLoading: loading }),
    setError: (error: string | null) => set({ error }),
  })
)
