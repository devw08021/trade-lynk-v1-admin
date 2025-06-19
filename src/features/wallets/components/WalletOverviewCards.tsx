import React from 'react'
import { BaseMetricCard } from '@/components/base/BaseMetricCard'
import { classNames } from '@/classNames'
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock,
  Users,
  AlertTriangle
} from 'lucide-react'
import type { WalletStats } from '@/types/wallet'

interface WalletOverviewCardsProps {
  stats: WalletStats | null
  isLoading: boolean
}

export const WalletOverviewCards: React.FC<WalletOverviewCardsProps> = ({ stats, isLoading }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`
    return `${Math.round(seconds / 3600)}h`
  }

  const metricCards = React.useMemo(() => {
    if (!stats) return []

    const netFlowTrend = stats.netFlow24h >= 0 ? 'up' : 'down'
    const netFlowPercentage = Math.abs(stats.netFlow24h / stats.totalDeposits24h * 100)

    return [
      {
        title: 'Total Portfolio Value',
        value: formatCurrency(stats.totalVolume24h),
        subtitle: 'All Assets',
        change: 12.5,
        trend: 'up' as const,
        icon: <Wallet className="w-7 h-7 text-white" />,
        color: 'blue' as const,
      },
      {
        title: 'Net Flow (24h)',
        value: formatCurrency(Math.abs(stats.netFlow24h)),
        subtitle: stats.netFlow24h >= 0 ? 'Net Inflow' : 'Net Outflow',
        change: netFlowPercentage,
        trend: netFlowTrend,
        icon: stats.netFlow24h >= 0 
          ? <TrendingUp className="w-7 h-7 text-white" />
          : <TrendingDown className="w-7 h-7 text-white" />,
        color: stats.netFlow24h >= 0 ? 'green' : 'red',
      },
      {
        title: 'Active Users (24h)',
        value: stats.activeUsers24h.toLocaleString(),
        subtitle: 'Unique Wallets',
        change: 8.3,
        trend: 'up' as const,
        icon: <Users className="w-7 h-7 text-white" />,
        color: 'purple' as const,
      },
      {
        title: 'Pending Transactions',
        value: stats.pendingTransactions.toLocaleString(),
        subtitle: 'Awaiting Confirmation',
        change: -15.2,
        trend: 'down' as const,
        icon: <Clock className="w-7 h-7 text-white" />,
        color: 'amber' as const,
      },
      {
        title: 'Avg Confirmation Time',
        value: formatTime(stats.averageConfirmationTime),
        subtitle: 'Network Average',
        change: -5.7,
        trend: 'down' as const,
        icon: <Activity className="w-7 h-7 text-white" />,
        color: 'indigo' as const,
      },
      {
        title: 'Failed Transactions',
        value: stats.failedTransactions24h.toLocaleString(),
        subtitle: 'Last 24 Hours',
        change: stats.failedTransactions24h > 0 ? 25.4 : -100,
        trend: stats.failedTransactions24h > 0 ? 'up' : 'down',
        icon: <AlertTriangle className="w-7 h-7 text-white" />,
        color: stats.failedTransactions24h > 0 ? 'red' : 'green',
      },
    ]
  }, [stats])

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
