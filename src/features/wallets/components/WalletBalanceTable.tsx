import React from 'react'
import { DataTable, DataTableColumn } from '@/components/composite/DataTable'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { BaseButton } from '@/components/base/BaseButton'
import { classNames } from '@/classNames'
import { 
  MoreHorizontal, 
  Eye, 
  Settings, 
  Activity,
  Pause,
  Wallet as WalletIcon
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { WalletBalance } from '@/types/wallet'

interface WalletBalanceTableProps {
  balances: WalletBalance[] | null
  isLoading: boolean
}

// Reusable Asset Icon Component
const AssetIcon: React.FC<{ asset: string; size?: 'sm' | 'default' | 'lg' }> = ({ 
  asset, 
  size = 'default' 
}) => {
  const getAssetGradient = (asset: string) => {
    const gradients = {
      'BTC': 'orange',
      'ETH': 'blue',
      'USDT': 'green',
      'BNB': 'amber',
      'ADA': 'indigo',
      'SOL': 'purple',
    } as const
    return gradients[asset as keyof typeof gradients] || 'gray'
  }

  return (
    <div className={`
      ${classNames.avatar.base}
      ${classNames.avatar.sizes[size]}
      ${classNames.avatar.gradients[getAssetGradient(asset)]}
    `}>
      <span className="text-white font-bold">
        {asset.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

// Reusable Balance Bar Component
const BalanceBar: React.FC<{ 
  available: number
  locked: number
  pending: number 
}> = ({ available, locked, pending }) => {
  const total = available + locked + pending
  const availablePercent = total > 0 ? (available / total) * 100 : 0
  const lockedPercent = total > 0 ? (locked / total) * 100 : 0
  const pendingPercent = total > 0 ? (pending / total) * 100 : 0

  return (
    <div className="w-48 space-y-2">
      <div className="flex justify-between text-xs text-gray-400">
        <span>Available: {availablePercent.toFixed(1)}%</span>
        <span>Locked: {lockedPercent.toFixed(1)}%</span>
        <span>Pending: {pendingPercent.toFixed(1)}%</span>
      </div>
      <div className={classNames.trading.volumeBar}>
        <div className="h-full flex">
          <div 
            className={`${classNames.trading.volumeBarFill} bg-gradient-to-r from-green-500 to-green-400`}
            style={{ width: `${availablePercent}%` }}
          />
          <div 
            className={`${classNames.trading.volumeBarFill} bg-gradient-to-r from-amber-500 to-amber-400`}
            style={{ width: `${lockedPercent}%` }}
          />
          <div 
            className={`${classNames.trading.volumeBarFill} bg-gradient-to-r from-blue-500 to-blue-400`}
            style={{ width: `${pendingPercent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

// Reusable Health Indicator Component
const WalletHealthIndicator: React.FC<{ reserveRatio: number }> = ({ reserveRatio }) => {
  const getHealthVariant = () => {
    if (reserveRatio >= 0.8) return 'success'
    if (reserveRatio >= 0.5) return 'warning'
    return 'error'
  }

  return (
    <BaseStatusBadge
      status={`${(reserveRatio * 100).toFixed(1)}%`}
      variant={getHealthVariant()}
      size="sm"
    />
  )
}

export const WalletBalanceTable: React.FC<WalletBalanceTableProps> = ({ 
  balances, 
  isLoading 
}) => {
  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num)
  }

  const formatCrypto = (amount: string, asset: string) => {
    const num = parseFloat(amount)
    const decimals = asset === 'BTC' ? 8 : asset === 'ETH' ? 6 : 4
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals
    })
  }

  const columns: DataTableColumn<WalletBalance>[] = [
    {
      key: 'asset',
      title: 'Asset',
      render: (balance) => (
        <div className="flex items-center space-x-4">
          <AssetIcon asset={balance.asset} />
          <div>
            <div className={classNames.text.h6}>{balance.asset}</div>
            <div className={classNames.text.small}>
              Updated {new Date(balance.lastUpdated).toLocaleTimeString()}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'totalBalance',
      title: 'Total Balance',
      numeric: true,
      render: (balance) => (
        <div className="space-y-1">
          <div className={`${classNames.text.h6} ${classNames.text.mono}`}>
            {formatCrypto(balance.totalBalance, balance.asset)}
          </div>
          <div className={classNames.text.small}>
            Available: {formatCrypto(balance.availableBalance, balance.asset)}
          </div>
          {parseFloat(balance.lockedBalance) > 0 && (
            <div className="text-sm text-amber-400">
              Locked: {formatCrypto(balance.lockedBalance, balance.asset)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'usdValue',
      title: 'USD Value',
      numeric: true,
      render: (balance) => (
        <div className={`${classNames.text.h6} ${classNames.text.mono}`}>
          {formatCurrency(balance.usdValue)}
        </div>
      ),
    },
    {
      key: 'distribution',
      title: 'Distribution',
      render: (balance) => (
        <BalanceBar
          available={parseFloat(balance.availableBalance)}
          locked={parseFloat(balance.lockedBalance)}
          pending={parseFloat(balance.pendingDeposits) + parseFloat(balance.pendingWithdrawals)}
        />
      ),
    },
    {
      key: 'hotColdRatio',
      title: 'Hot/Cold Ratio',
      render: (balance) => (
        <div className="space-y-2 text-center">
          <div className="text-sm">
            <span className="text-orange-400 font-semibold">Hot: </span>
            <span className={`${classNames.text.mono} text-gray-100`}>
              {formatCrypto(balance.hotWalletBalance, balance.asset)}
            </span>
          </div>
          <div className="text-sm">
            <span className="text-blue-400 font-semibold">Cold: </span>
            <span className={`${classNames.text.mono} text-gray-100`}>
              {formatCrypto(balance.coldWalletBalance, balance.asset)}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'health',
      title: 'Health',
      render: (balance) => (
        <div className="text-center">
          <WalletHealthIndicator reserveRatio={balance.reserveRatio} />
        </div>
      ),
    },
  ]

  const renderActions = (balance: WalletBalance) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <BaseButton variant="ghost" size="icon">
          <MoreHorizontal className={classNames.icon.sm} />
        </BaseButton>
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={classNames.dropdown.content}>
          <DropdownMenu.Item className={classNames.dropdown.item}>
            <Eye className={`${classNames.icon.sm} text-blue-400`} />
            View Details
          </DropdownMenu.Item>
          
          <DropdownMenu.Item className={classNames.dropdown.item}>
            <Activity className={`${classNames.icon.sm} text-green-400`} />
            Transaction History
          </DropdownMenu.Item>
          
          <DropdownMenu.Item className={classNames.dropdown.item}>
            <Settings className={`${classNames.icon.sm} text-purple-400`} />
            Configure Wallet
          </DropdownMenu.Item>
          
          <DropdownMenu.Separator className={classNames.dropdown.separator} />
          
          <DropdownMenu.Item className={`${classNames.dropdown.item} text-amber-400 hover:bg-amber-900/20`}>
            <Pause className={classNames.icon.sm} />
            Pause Trading
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )

  return (
    <DataTable
      data={balances || []}
      columns={columns}
      loading={isLoading}
      empty={!balances || balances.length === 0}
      emptyMessage="No wallet balances found. Configure your first cryptocurrency wallet to get started."
      emptyIcon={<WalletIcon className="w-16 h-16 text-gray-400" />}
      searchable
      searchPlaceholder="Search assets..."
      exportable
      refreshable
      renderActions={renderActions}
      onSearch={(term) => console.log('Search:', term)}
      onExport={() => console.log('Export wallet balances')}
      onRefresh={() => console.log('Refresh balances')}
    />
  )
}
