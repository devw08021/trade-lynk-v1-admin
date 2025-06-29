import React, { Fragment } from 'react'
import { DataTable, DataTableColumn } from '@/components/composite/DataTable'
import { useNavigate } from 'react-router-dom'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { BaseButton } from '@/components/base/BaseButton'
import { userOrders, useUserActions } from '@/hooks/p2p/useOrder'
import { usePermissions } from '@/hooks/usePermissions'
import { classNames } from '@/classNames'
import { formatters } from '@/utils/formatters'
import { MoreHorizontal, Eye, Ban, UserX, Shield, Wallet, Star, Activity } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { User, UserFilters, PaginationOptions, SortOptions } from '@/types'
import { Pagination } from './Pagination'

interface UserTableProps {
  filters: UserFilters
  pagination: PaginationOptions
  sort: SortOptions
  onUserClick: (user: User) => void
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

// Reusable User Avatar Component
const UserAvatar: React.FC<{ user: User; size?: 'sm' | 'default' | 'lg' }> = ({
  user,
  size = 'default',
}) => {
  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'active':
        return 'green'
      case 'suspended':
        return 'amber'
      case 'banned':
        return 'red'
      default:
        return 'gray'
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
      <div
        className={`
        ${classNames.avatar.base}
        ${classNames.avatar.sizes[size]}
        ${classNames.avatar.gradients[getStatusGradient(user.status)]}
      `}
      >
        <span className="text-white font-bold">{getInitials(user)}</span>
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
const TradingMetrics: React.FC<{ user: any }> = ({ user }) => {
  return (
    <div className="flex items-center space-x-4 text-right">
      <div>
        <div className={`${classNames.text.mono} font-semibold text-gray-100`}>
          {user?.receiveValue}
        </div>
        <div className={classNames.text.xs}>Price</div>
      </div>
      <div>
        <div className={`${classNames.text.mono} font-semibold text-gray-100`}>
          {user?.payValue}
        </div>
        <div className={classNames.text.xs}>Quantity</div>
      </div>
    </div>
  )
}

export const OrderTable: React.FC<UserTableProps> = ({
  filters,
  pagination,
  sort,
  onUserClick,
  onPageChange,
  onLimitChange,
}) => {
  const { data, isLoading, error } = userOrders(filters, pagination, sort)
  const { hasPermission } = usePermissions()
  const push = useNavigate()
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
      key: 'createdAt',
      title: 'Created At  ',
      render: user => (
        <div className="text-sm">
          {user?.createdAt ? (
            <div>
              <div className="text-gray-300 font-medium">{formatters.timeAgo(user.createdAt)}</div>
              <div className="text-gray-500 text-xs">
                {new Date(user?.createdAt).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <span className="text-gray-500">Never logged in</span>
          )}
        </div>
      ),
    },
    {
      key: 'postCode',
      title: 'Ad ID',
      render: data => (
        <div className="flex items-center space-x-4">
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {data.postCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'orderCode',
      title: 'Order ID',
      render: data => (
        <div className="flex items-center space-x-4">
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {data.orderCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'buyerCode',
      title: 'Buyer',
      render: user => (
        <div className="flex items-center space-x-4">
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {user.firstName && user?.lastName
                ? `${user?.firstName} ${user?.lastName}`
                : user?.buyerCode || 'N/A'}
            </div>
            <div className={`${classNames.text.small} ${classNames.text.mono}`}>
              {user?.buyerCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'sellerCode',
      title: 'Seller',
      render: user => (
        <div className="flex items-center space-x-4">
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {user.firstName && user?.lastName
                ? `${user?.firstName} ${user?.lastName}`
                : user?.sellerCode || 'N/A'}
            </div>
            <div className={`${classNames.text.small} ${classNames.text.mono}`}>
              {user?.sellerCode}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'firstCoin',
      title: 'Crypto',
      render: data => (
        <div className="flex items-center space-x-4">
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {data.firstCoin}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'secondCoin',
      title: 'Fiat',
      render: data => (
        <div className="flex items-center space-x-4">
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {data.secondCoin}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'side',
      title: 'Side',
      render: user => (
        <BaseStatusBadge
          status={['buy', 'sell'][user?.side]}
          variant={['success', 'error'][user?.side]}
        />
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: user => (
        <BaseStatusBadge
          status={
            ['open', 'paid', 'completed', 'cancelled', 'dispute', 'dispute resolved', 'time out'][
              user?.status
            ]
          }
          variant={
            ['neutral', 'warning', 'success', 'error', 'warning', 'success', 'error'][user?.status]
          }
        />
      ),
    },
    {
      key: 'tradingMetrics',
      title: 'Trading Metrics',
      numeric: true,
      render: user => <TradingMetrics user={user} />,
    },
    {
      key: 'endTime',
      title: 'Expired At  ',
      render: user => (
        <div className="text-sm">
          {user?.endTime ? (
            <div>
              <div className="text-gray-300 font-medium">{formatters.timeAgo(user.endTime)}</div>
              <div className="text-gray-500 text-xs">
                {new Date(user?.endTime).toLocaleDateString()}
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
            onSelect={() => push(`/users/${user?._id}`)}
          >
            <Eye className={`${classNames.icon.sm} text-blue-400`} />
            View
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
