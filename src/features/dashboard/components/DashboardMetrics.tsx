import React from 'react'
import { BaseMetricCard } from '@/components/base/BaseMetricCard'
import { classNames } from '@/classNames'
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Shield
} from 'lucide-react'
import type { DashboardMetrics } from '@/types'

interface DashboardMetricsProps {
  metrics: DashboardMetrics | null
  isLoading: boolean
}

export const DashboardMetricsCards: React.FC<DashboardMetricsProps> = ({ 
  metrics, 
  isLoading 
}) => {
  const formatCurrency = (amount: number) => 
    `$${(amount / 1000000).toFixed(1)}M`

  const metricCards = React.useMemo(() => {
    if (!metrics) return []

    return [
      {
        title: 'Total Users',
        value: metrics.totalUsers,
        change: 12.5,
        trend: 'up' as const,
        icon: <Users className="w-7 h-7 text-white" />,
        color: 'blue' as const,
        subtitle: 'Registered',
      },
      {
        title: 'Active Users',
        value: metrics.activeUsers,
        change: 8.2,
        trend: 'up' as const,
        icon: <Activity className="w-7 h-7 text-white" />,
        color: 'green' as const,
        subtitle: 'Online now',
      },
      {
        title: 'Daily Volume',
        value: formatCurrency(metrics.dailyVolume),
        change: -2.1,
        trend: 'down' as const,
        icon: <TrendingUp className="w-7 h-7 text-white" />,
        color: 'purple' as const,
        subtitle: '24h trading',
      },
      {
        title: 'Total Trades',
        value: metrics.totalTrades,
        change: 15.3,
        trend: 'up' as const,
        icon: <DollarSign className="w-7 h-7 text-white" />,
        color: 'amber' as const,
        subtitle: 'All time',
      },
      {
        title: 'Pending KYC',
        value: metrics.pendingKyc,
        change: -5.7,
        trend: 'down' as const,
        icon: <Shield className="w-7 h-7 text-white" />,
        color: 'red' as const,
        subtitle: 'Awaiting review',
      },
      {
        title: 'System Uptime',
        value: `${metrics.systemUptime}%`,
        change: 0.1,
        trend: 'up' as const,
        icon: <Zap className="w-7 h-7 text-white" />,
        color: 'indigo' as const,
        subtitle: 'Last 30 days',
      },
    ]
  }, [metrics])

  return (
    <div className={classNames.layout.grid.metrics}>
      {metricCards.map((card, index) => (
        <BaseMetricCard
          key={index}
          {...card}
          loading={isLoading}
        />
      ))}
    </div>
  )
}
