import React, { Fragment } from 'react'
import { DataTable, DataTableColumn } from '@/components/composite/DataTable'
import { useNavigate } from 'react-router-dom'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { BaseButton } from '@/components/base/BaseButton'
import { useUsers, useUserActions } from '@/hooks/useUsers'
import { usePermissions } from '@/hooks/usePermissions'
import { classNames } from '@/classNames'
import { formatters } from '@/utils/formatters'
import { MoreHorizontal, Eye, Ban, UserX, Shield, Wallet, Star, Activity } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { User, UserFilters, PaginationOptions, SortOptions } from '@/types'
import { Pagination } from './Pagination'

interface UserTableProps {
  data: any
  isLoading: boolean
  filters: UserFilters
  pagination: PaginationOptions
  sort: SortOptions
  onUserClick: (user: any) => void
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

// Reusable User Avatar Component
const UserAvatar: React.FC<{ user: any; size?: 'sm' | 'default' | 'lg' }> = ({
  user,
  size = 'default',
}) => {
  const getStatusGradient = (status: string) => {
    switch (status) {
      case true:
        return 'green'
      case 'suspended':
        return 'amber'
      case 'banned':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getInitials = (user: any) => {
    if (user.symbol) {
      return `${user.symbol}`
    }
    return user.symbol.slice(0, 4).toUpperCase()
  }

  return (
    <div className="relative">
      <div
        className={`
        ${classNames.avatar.base}
        ${classNames.avatar.sizes[size]}
        ${classNames.avatar.gradients[getStatusGradient(user.isActive)]}
      `}
      >
        <span className="text-white font-bold">{getInitials(user)}</span>
      </div>



      {/* Online Status */}
      {user.createdAt && new Date(user.createdAt) > new Date(Date.now() - 5 * 60 * 1000) && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800" />
      )}
    </div>
  )
}

// Trading Metrics Component
// TradingMetrics Component
const TradingMetrics: React.FC<{ user: any }> = ({ user }) => {
  return (
    <>
      {user?.network.map((chain: any, index: number) => (
        <div key={index} className="flex items-center space-x-4 text-right">
          <div>
            <div
              className={`font-semibold ${user.type=="coin"
                ? classNames.trading.pricePositive
                : classNames.trading.priceNegative
                }`}
            >
              {chain.chainName}
            </div>
            <div className={classNames.text.xs}>Chain</div>
          </div>
          <div>
            <div className={`${classNames.text.mono} font-semibold text-gray-100`}>
              {chain?.minDeposit}
            </div>
            <div className={classNames.text.xs}>minDeposit</div>
          </div>
          <div>
            <div className={`${classNames.text.mono} font-semibold text-gray-100`}>
              {chain?.maxDeposit}
            </div>
            <div className={classNames.text.xs}>maxDeposit</div>
          </div>

          <div>
            <div className={`${classNames.text.mono} font-semibold text-gray-100`}>
              {chain?.minWithdraw}
            </div>
            <div className={classNames.text.xs}>minWithdraw</div>
          </div>
          <div>
            <div className={`${classNames.text.mono} font-semibold text-gray-100`}>
              {chain?.withdrawalFee}
            </div>
            <div className={classNames.text.xs}>withdrawalFee</div>
          </div>

        </div>
      ))}
    </>
  );
};



export const UserTable: React.FC<UserTableProps> = ({
  data,
  isLoading,
  filters,
  pagination,
  sort,
  onUserClick,
  onPageChange,
  onLimitChange,
}) => {
  // const { data, isLoading, error } = useUsers(filters, pagination, sort)
  const { hasPermission } = usePermissions()
  const push = useNavigate()
  const userActions = useUserActions()

  const handleBanUser = (user: any) => {
    if (confirm(`Are you sure you want to ban ${user.email}?`)) {
      userActions.banUser.mutate({
        id: user.id,
        reason: 'Banned via admin panel',
      })
    }
  }

  const handleSuspendUser = (user: any) => {
    if (confirm(`Are you sure you want to suspend ${user.email}?`)) {
      userActions.suspendUser.mutate({
        id: user.id,
        reason: 'Suspended via admin panel',
        duration: 7,
      })
    }
  }

  const handleResetTwoFactor = (user: any) => {
    if (confirm(`Reset 2FA for ${user.email}?`)) {
      userActions.resetTwoFactor.mutate(user.id)
    }
  }

  const handleToggleWithdrawals = (user: any) => {
    const action = user.settings.withdrawalsEnabled ? 'disable' : 'enable'
    if (confirm(`${action} withdrawals for ${user.email}?`)) {
      userActions.toggleWithdrawals.mutate({
        id: user.id,
        enabled: !user.settings.withdrawalsEnabled,
      })
    }
  }

  const columns: DataTableColumn<any>[] = [
    {
      key: 'symbol',
      title: 'symbol',
      render: user => (
        <div className="flex items-center space-x-4">
          <UserAvatar user={user} />
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {user.symbol
                ? `${user?.symbol}`
                : user?.symbol || 'N/A'}
            </div>
            {/* <div className={`${classNames.text.small} ${classNames.text.mono}`}>{user?.symbol}</div>
            <div className="flex items-center space-x-2 mt-1">
              {user?.type && (
                <div className="w-2 h-2 bg-blue-400 rounded-full" title="Type" />
              )}
               {user?.isActive && (
                <div className="w-2 h-2 bg-green-400 rounded-full" title="Status" />
              )}
            </div> */}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      title: 'Type',
      render: user => (
        <BaseStatusBadge
          status={user?.type}
          variant={
            user?.type === 'coin'
              ? 'warning'
              : user?.type === 'token'
                ? 'error'
                : 'info'
          }
          icon={user?.type === 'coin' ? <Star className={classNames.icon.xs} /> : undefined}
        />
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: user => (
        <BaseStatusBadge
          status={user?.isActive ? "Active" : "In Active"}
          variant={
            user?.isActive
              ? 'success'
              : user?.status === 'suspended'
                ? 'warning'
                : user?.status === 'banned'
                  ? 'error'
                  : 'error'
          }
        />
      ),
    },
    {
      key: 'network',
      title: 'Network Metrics',
      numeric: true,
      render: user => <TradingMetrics user={user} />,
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
            onSelect={() => push(`/users/${user?._id}`)}
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
                {user?.settings?.withdrawalsEnabled ? 'Disable' : 'Enable'} Withdrawals
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
    <Fragment>
      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        empty={!data?.data.length}
        emptyMessage="No data found matching your criteria"
        emptyIcon={<Activity className="w-16 h-16 text-gray-400" />}
        onRowClick={onUserClick}
        renderActions={renderActions}
      />
      <Pagination
        pagination={pagination}
        totalPages={Math.ceil(data?.count / pagination?.limit)}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </Fragment>
  )
}
