import React from 'react'
import { DataTable, DataTableColumn } from '@/components/composite/DataTable'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { BaseButton } from '@/components/base/BaseButton'
import { useUsers, useUserActions } from '@/hooks/useUsers'
import { usePermissions } from '@/hooks/usePermissions'
import { classNames } from '@/classNames'
import {formatters} from '@/utils/formatters'
import { 
  MoreHorizontal, 
  Eye, 
  Ban, 
  UserX, 
  Shield, 
  Wallet,
  Star,
  Activity
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { User, UserFilters, PaginationOptions, SortOptions } from '@/types'

interface UserTableProps {
  filters: UserFilters
  pagination: PaginationOptions
  sort: SortOptions
  onUserClick: (user: User) => void
}

// Reusable User Avatar Component
const UserAvatar: React.FC<{ user: User; size?: 'sm' | 'default' | 'lg' }> = ({ 
  user, 
  size = 'default' 
}) => {
  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'active': return 'green'
      case 'suspended': return 'amber'
      case 'banned': return 'red'
      default: return 'gray'
    }
  }

  const getInitials = (user: User) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    }
    return user.email.slice(0, 2).toUpperCase()
  }

  return (
    <div className="relative">
      <div className={`
        ${classNames.avatar.base}
        ${classNames.avatar.sizes[size]}
        ${classNames.avatar.gradients[getStatusGradient(user.status)]}
      `}>
        <span className="text-white font-bold">
          {getInitials(user)}
        </span>
      </div>
      
      {/* VIP Badge */}
      {user.role === 'vip' && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Star className="w-3 h-3 text-white" />
        </div>
      )}
      
      {/* Online Status */}
      {user.lastLoginAt && new Date(user.lastLoginAt) > new Date(Date.now() - 5 * 60 * 1000) && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800" />
      )}
    </div>
  )
}

// Trading Metrics Component
const TradingMetrics: React.FC<{ user: User }> = ({ user }) => {
  const totalValue = user.walletBalances.reduce((sum, balance) => sum + balance.usdValue, 0)
  
  return (
    <div className="flex items-center space-x-4 text-right">
      <div>
        <div className={`${classNames.text.mono} font-semibold text-gray-100`}>
          {formatters.currency(totalValue)}
        </div>
        <div className={classNames.text.xs}>Portfolio</div>
      </div>
      
      <div>
        <div className={`${classNames.text.mono} text-gray-300`}>
          {user.tradingStats.totalTrades.toLocaleString()}
        </div>
        <div className={classNames.text.xs}>Trades</div>
      </div>
      
      <div>
        <div className={`font-semibold ${
          user.tradingStats.profitLoss >= 0 
            ? classNames.trading.pricePositive 
            : classNames.trading.priceNegative
        }`}>
          {user.tradingStats.profitLoss >= 0 ? '+' : ''}
          {formatters.currency(Math.abs(user.tradingStats.profitLoss))}
        </div>
        <div className={classNames.text.xs}>P&L</div>
      </div>
    </div>
  )
}

export const UserTable: React.FC<UserTableProps> = ({
  filters,
  pagination,
  sort,
  onUserClick,
}) => {
  const { data, isLoading, error } = useUsers(filters, pagination, sort)
  const { hasPermission } = usePermissions()
  const userActions = useUserActions()

  const handleBanUser = (user: User) => {
    if (confirm(`Are you sure you want to ban ${user.email}?`)) {
      userActions.banUser.mutate({
        id: user.id,
        reason: 'Banned via admin panel',
      })
    }
  }

  const handleSuspendUser = (user: User) => {
    if (confirm(`Are you sure you want to suspend ${user.email}?`)) {
      userActions.suspendUser.mutate({
        id: user.id,
        reason: 'Suspended via admin panel',
        duration: 7,
      })
    }
  }

  const handleResetTwoFactor = (user: User) => {
    if (confirm(`Reset 2FA for ${user.email}?`)) {
      userActions.resetTwoFactor.mutate(user.id)
    }
  }

  const handleToggleWithdrawals = (user: User) => {
    const action = user.settings.withdrawalsEnabled ? 'disable' : 'enable'
    if (confirm(`${action} withdrawals for ${user.email}?`)) {
    userActions.toggleWithdrawals.mutate({
        id: user.id,
        enabled: !user.settings.withdrawalsEnabled,
      })
    }
  }

  const columns: DataTableColumn<User>[] = [
    {
      key: 'user',
      title: 'User',
      render: (user) => (
        <div className="flex items-center space-x-4">
          <UserAvatar user={user} />
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.username || 'N/A'
              }
            </div>
            <div className={`${classNames.text.small} ${classNames.text.mono}`}>
              {user.email}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              {user.settings.twoFactorEnabled && (
                <div className="w-2 h-2 bg-green-400 rounded-full" title="2FA Enabled" />
              )}
              {user.settings.withdrawalsEnabled && (
                <div className="w-2 h-2 bg-blue-400 rounded-full" title="Withdrawals Enabled" />
              )}
              {user.perpetualPositions.length > 0 && (
                <div className="w-2 h-2 bg-purple-400 rounded-full" title="Active Positions" />
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (user) => (
        <BaseStatusBadge
          status={user.status.replace('_', ' ')}
          variant={
            user.status === 'active' ? 'success' :
            user.status === 'suspended' ? 'warning' :
            user.status === 'banned' ? 'error' : 'neutral'
          }
        />
      ),
    },
    {
      key: 'kycStatus',
      title: 'Verification',
      render: (user) => (
        <div className="flex items-center space-x-2">
          <BaseStatusBadge
            status={user.kycStatus.replace('_', ' ')}
            variant={
              user.kycStatus === 'approved' ? 'success' :
              user.kycStatus === 'pending' ? 'warning' :
              user.kycStatus === 'rejected' || user.kycStatus === 'expired' ? 'error' : 'neutral'
            }
          />
          {user.kycStatus === 'pending' && (
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          )}
        </div>
      ),
    },
    {
      key: 'role',
      title: 'Role',
      render: (user) => (
        <BaseStatusBadge
          status={user.role.replace('_', ' ')}
          variant={
            user.role === 'vip' ? 'warning' :
            user.role === 'admin' || user.role === 'super_admin' ? 'error' : 'info'
          }
          icon={user.role === 'vip' ? <Star className={classNames.icon.xs} /> : undefined}
        />
      ),
    },
    {
      key: 'tradingMetrics',
      title: 'Trading Metrics',
      numeric: true,
      render: (user) => <TradingMetrics user={user} />,
    },
    {
      key: 'lastActivity',
      title: 'Last Activity',
      render: (user) => (
        <div className="text-sm">
          {user.lastLoginAt ? (
            <div>
              <div className="text-gray-300 font-medium">
                {formatters.timeAgo(user.lastLoginAt)}
              </div>
              <div className="text-gray-500 text-xs">
                {new Date(user.lastLoginAt).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <span className="text-gray-500">Never logged in</span>
          )}
        </div>
      ),
    },
  ]

  const renderActions = (user: User) => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <BaseButton variant="ghost" size="icon">
          <MoreHorizontal className={classNames.icon.sm} />
        </BaseButton>
      </DropdownMenu.Trigger>
      
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={classNames.dropdown.content}>
          <DropdownMenu.Item 
            className={classNames.dropdown.item}
            onSelect={() => onUserClick(user)}
          >
            <Eye className={`${classNames.icon.sm} text-blue-400`} />
            View Profile
          </DropdownMenu.Item>
          
          {hasPermission('users.edit') && (
            <>
              <DropdownMenu.Item 
                className={classNames.dropdown.item}
                onSelect={() => handleResetTwoFactor(user)}
              >
                <Shield className={`${classNames.icon.sm} text-amber-400`} />
                Reset 2FA
              </DropdownMenu.Item>
              
              <DropdownMenu.Item 
                className={classNames.dropdown.item}
                onSelect={() => handleToggleWithdrawals(user)}
              >
                <Wallet className={`${classNames.icon.sm} text-green-400`} />
                {user.settings.withdrawalsEnabled ? 'Disable' : 'Enable'} Withdrawals
              </DropdownMenu.Item>
            </>
          )}
          
          {hasPermission('users.ban') && user.status !== 'banned' && (
            <>
              <DropdownMenu.Separator className={classNames.dropdown.separator} />
              <DropdownMenu.Item 
                className={`${classNames.dropdown.item} text-amber-400 hover:bg-amber-900/20`}
                onSelect={() => handleSuspendUser(user)}
              >
                <UserX className={classNames.icon.sm} />
                Suspend User
              </DropdownMenu.Item>
              
              <DropdownMenu.Item 
                className={`${classNames.dropdown.item} text-red-400 hover:bg-red-900/20`}
                onSelect={() => handleBanUser(user)}
              >
                <Ban className={classNames.icon.sm} />
                Ban User
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      loading={isLoading}
      empty={!data?.data.length}
      emptyMessage="No users found matching your criteria"
      emptyIcon={<Activity className="w-16 h-16 text-gray-400" />}
      onRowClick={onUserClick}
      renderActions={renderActions}
    />
  )
}
