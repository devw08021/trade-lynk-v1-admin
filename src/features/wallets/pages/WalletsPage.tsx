import React from 'react'
import { PageHeader } from '@/components/composite/PageHeader'
import { WalletOverviewCards } from '../components/WalletOverviewCards'
import { WalletBalanceTable } from '../components/WalletBalanceTable'
import { WalletTransactionHistory } from '../components/WalletTransactionHistory'
import { WalletAlerts } from '../components/WalletAlerts'
import { BaseButton } from '@/components/base/BaseButton'
import { useWalletData } from '@/hooks/useWalletData'
import { classNames } from '@/classNames'
import { 
  Download, 
  Settings, 
  RefreshCw, 
  AlertTriangle,
  Wallet,
  Activity,
  Shield
} from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'

export const WalletsPage: React.FC = () => {
  const { 
    balances, 
    transactions, 
    alerts, 
    stats, 
    isLoading, 
    refetch 
  } = useWalletData()

  const [activeTab, setActiveTab] = React.useState('overview')

  const criticalAlerts = alerts?.filter(alert => 
    alert.severity === 'critical' && !alert.acknowledged
  ).length || 0

  const pageActions = (
    <>
      {criticalAlerts > 0 && (
        <div className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg animate-pulse">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm text-red-400 font-medium">
            {criticalAlerts} Critical Alert{criticalAlerts > 1 ? 's' : ''}
          </span>
        </div>
      )}
      
      <BaseButton variant="secondary" onClick={() => console.log('Export')}>
        <Download className={classNames.icon.sm} />
        Export Report
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

  const tabItems = [
    { value: 'overview', label: 'Portfolio Overview', icon: Wallet },
    { value: 'transactions', label: 'Transaction History', icon: Activity },
    { value: 'alerts', label: 'Alerts & Monitoring', icon: AlertTriangle, badge: criticalAlerts },
    { value: 'config', label: 'Configuration', icon: Settings },
  ]

  return (
    <div className={classNames.layout.page}>
      <PageHeader
        title="Wallet Management"
        subtitle="Monitor and control all cryptocurrency wallets and transactions"
        actions={pageActions}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Wallet Management' },
        ]}
      />

      {/* Overview Cards */}
      <WalletOverviewCards stats={stats} isLoading={isLoading} />

      {/* Main Content Tabs */}
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-gray-700/50 bg-gray-800/30 rounded-t-xl">
          <Tabs.List className={classNames.tabs.list}>
            {tabItems.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={classNames.tabs.trigger}
              >
                <tab.icon className={classNames.icon.sm} />
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className={`${classNames.tabs.badge} bg-red-500/20 text-red-400`}>
                    {tab.badge}
                  </span>
                )}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/50 rounded-b-xl">
          <Tabs.Content value="overview" className={classNames.tabs.content}>
            <WalletBalanceTable balances={balances} isLoading={isLoading} />
          </Tabs.Content>

          <Tabs.Content value="transactions" className={classNames.tabs.content}>
            <WalletTransactionHistory transactions={transactions} isLoading={isLoading} />
          </Tabs.Content>

          <Tabs.Content value="alerts" className={classNames.tabs.content}>
            <WalletAlerts alerts={alerts} isLoading={isLoading} />
          </Tabs.Content>

          <Tabs.Content value="config" className={classNames.tabs.content}>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={classNames.text.h4}>Configuration Panel</h3>
              <p className={classNames.text.muted}>
                Wallet configuration tools will be available here
              </p>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  )
}
