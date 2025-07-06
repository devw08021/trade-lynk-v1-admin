import React, { Fragment } from 'react'
import { DataTable, DataTableColumn } from '@/components/composite/DataTable'
import { useNavigate } from 'react-router-dom'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { BaseButton } from '@/components/base/BaseButton'
import { usePair } from '@/hooks/p2p/usePair'
import { usePermissions } from '@/hooks/usePermissions'
import { classNames } from '@/classNames'
import { formatters } from '@/utils/formatters'
import { MoreHorizontal, Eye, Ban, UserX, Shield, Wallet, Star, Activity } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import type { User, UserFilters, PaginationOptions, SortOptions } from '@/types'
import { Pagination } from './Pagination'

interface UserTableProps {
  data:any
  isLoading: boolean
  filters: UserFilters
  pagination: PaginationOptions
  sort: SortOptions
  onUserClick: (user: User) => void
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
}

// Reusable User Avatar Component
const Avatar: React.FC<{ pair: any; size?: 'sm' | 'default' | 'lg' }> = ({
  pair,
  size = 'default',
}) => {
  const getStatusGradient = (status: string) => {
    switch (status) {
      case 1:
        return 'green'
      case 'suspended':
        return 'amber'
      case 2:
        return 'red'
      default:
        return 'gray'
    }
  }

  return (
    <div className="relative">
      <div
        className={`
        ${classNames.avatar.base}
        ${classNames.avatar.sizes[size]}
        ${classNames.avatar.gradients[getStatusGradient(pair.status)]}
      `}
      >
        <span className="text-white font-bold">{pair?.tikerRoot}</span>
      </div>

      {/* VIP Badge */}
      {pair.role === 'vip' && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
          <Star className="w-3 h-3 text-white" />
        </div>
      )}

      {/* Online Status */}
      {pair.lastLoginAt && new Date(pair.lastLoginAt) > new Date(Date.now() - 5 * 60 * 1000) && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-800" />
      )}
    </div>
  )
}

export const PairTable: React.FC<UserTableProps> = ({
  data,
  isLoading,
  filters,
  pagination,
  sort,
  onUserClick,
  onPageChange,
  onLimitChange,
}) => {
  // const { data, isLoading, error } = usePair(filters, pagination, sort)
  const { hasPermission } = usePermissions()
  const push = useNavigate()


  const columns: DataTableColumn<User>[] = [
    {
      key: 'Pair',
      title: 'Pair',
      render: data => (
        <div className="flex items-center space-x-4">
          <Avatar pair={data} />
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {data.firstCoin && data?.secondCoin
                ? `${data?.firstCoin}/${data?.secondCoin}`
                : data?.tikerRoot || 'N/A'}
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
      key: 'price',
      title: 'Price',
      render: data => (
        <div className="flex items-center space-x-4">
          <div>
            <div className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
              {data.price}
            </div>
          </div>
        </div>
      ),
    },

    {
      key: 'status',
      title: 'Status',
      render: user => (
        <BaseStatusBadge
          status={user?.status == 1 ? 'active' : 'inactive'}
          variant={
            user?.status === 1
              ? 'success'
              : user?.status === 2
                ? 'warning'
                : user?.status === 'banned'
                  ? 'error'
                  : 'neutral'
          }
        />
      ),
    },
  ]

  const renderActions = (data: any) => (
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
            onSelect={() => push(`/p2p/${data?._id}`)}
          >
            <Eye className={`${classNames.icon.sm} text-blue-400`} />
            Edit
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className={`${classNames.dropdown.item} text-${data?.status == 1 ? 'red' : 'green'}-400 hover:bg-red-900/20`}
            onSelect={() => handleBanUser(data)}
          >
            <Ban className={classNames.icon.sm} />
            {data?.status == 1 ? 'DeActivate' : 'Activate'}
          </DropdownMenu.Item>
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
