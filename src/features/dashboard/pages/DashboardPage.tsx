import React from 'react'
import { PageHeader } from '@/components/composite/PageHeader'
import { DashboardMetricsCards } from '../components/DashboardMetrics'
import { VolumeChart } from '../components/VolumeChart'
import { RecentActivity } from '../components/RecentActivity'
import { SystemStatus } from '../components/SystemStatus'
import { TradingOverview } from '../components/TradingOverview'
import { TopTraders } from '../components/TopTraders'
import { BaseButton } from '@/components/base/BaseButton'
import { useDashboardMetrics } from '@/hooks/useDashboard'
import { classNames } from '@/classNames'
import { RefreshCw, Download, Settings, AlertTriangle } from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { metrics, systemMetrics, isLoading, refetch } = useDashboardMetrics()

  const criticalAlerts = [
    { id: 1, message: 'High withdrawal volume detected', severity: 'warning', time: '2 min ago' },
    { id: 2, message: 'API rate limit approaching', severity: 'info', time: '5 min ago' },
  ]

  const pageActions = (
    <>
      {criticalAlerts.length > 0 && (
        <div className="flex items-center space-x-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-sm text-amber-400 font-medium">
            {criticalAlerts.length} Alert{criticalAlerts.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      <BaseButton variant="secondary" onClick={() => console.log('Export')}>
        <Download className={classNames.icon.sm} />
        Export
      </BaseButton>
      
      <BaseButton variant="secondary" onClick={refetch} loading={isLoading}>
        <RefreshCw className={classNames.icon.sm} />
        Refresh
      </BaseButton>
      
      <BaseButton>
        <Settings className={classNames.icon.sm} />
        Configure
      </BaseButton>
    </>
  )

  return (
    <div className={classNames.layout.page}>
      <PageHeader
        title="Trading Dashboard"
        subtitle="Real-time overview of your exchange operations"
        actions={pageActions}
        breadcrumbs={[
          { label: 'Dashboard' },
        ]}
      />

      {/* Key Metrics */}
      <DashboardMetricsCards metrics={metrics} isLoading={isLoading} />

      {/* Main Content Grid */}
      <div className={classNames.layout.grid.dashboard}>
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-8">
          <VolumeChart />
          <TradingOverview />
        </div>
        
        {/* Right Column - Activity & Status */}
        <div className="xl:col-span-2 space-y-8">
          <SystemStatus />
          <TopTraders />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
