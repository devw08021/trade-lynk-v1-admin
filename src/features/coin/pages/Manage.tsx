import React from 'react'
import { PageHeader } from '@/components/composite/PageHeader'
import { UserQuickStats } from '../components/UserQuickStats'
import { UserFiltersComponent } from '../components/UserFilters'
import { UserTable } from '../components/UserTable'
import { UserDetailModal } from '../components/UserDetailModal'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseButton } from '@/components/base/BaseButton'
import { useCoins } from '@/hooks/useCoins'
import { classNames } from '@/classNames'
import { Download, Plus, Users } from 'lucide-react'
import type { User, UserFilters, PaginationOptions, SortOptions } from '@/types'

export const Page: React.FC = () => {
  const [filters, setFilters] = React.useState<UserFilters>({})
  const [pagination, setPagination] = React.useState<PaginationOptions>({ page: 0, limit: 20 })
  const [sort, setSort] = React.useState<SortOptions>({ field: 'createdAt', direction: -1 })
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const { data, isLoading } = useCoins(filters, pagination, sort)

  const handleUserClick = (user: User) => {
    setSelectedUserId(user?._id)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUserId(null)
  }

  const handleFiltersChange = (newFilters: UserFilters) => {
    setFilters(newFilters)
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleClearFilters = () => {
    setFilters({})
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handleExport = () => {
    console.log('Exporting users...', { filters, sort })
  }

  const pageActions = (
    <>
      <BaseButton variant="secondary" onClick={handleExport}>
        <Download className={classNames.icon.sm} />
        Export Data
      </BaseButton>
      <BaseButton>
        <Plus className={classNames.icon.sm} />
        Add Coin
      </BaseButton>
    </>
  )

  return (
    <div className={classNames.layout.page}>  
      <PageHeader
        title="Coin Management"
        subtitle="Monitor and manage all platform Coin with advanced controls"
        // actions={pageActions}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Coin Management' },
        ]}
      />

      {/* Quick Stats */}
      <UserQuickStats />

      {/* Advanced Filters */}
      <UserFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Results Summary */}
      {data && (
        <BaseCard variant="glass" padding="sm">
          <div className={classNames.utils.spaceBetween}>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <Users className={classNames.icon.sm} />
                <span className={classNames.text.muted}>Showing</span>
                <span className={`${classNames.text.body} font-semibold`}>
                  {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, data?.pagination?.total)}
                </span>
                <span className={classNames.text.muted}>of</span>
                <span className={`${classNames.text.body} font-semibold`}>
                  {data?.pagination?.total?.toLocaleString()}
                </span>
                <span className={classNames.text.muted}>users</span>
              </div>

              {Object.values(filters).filter(Boolean).length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full" />
                  <span className="text-blue-400 text-sm font-medium">Filtered results</span>
                </div>
              )}
            </div>

            <div className={classNames.text.muted}>
              Page {pagination?.page} of {data?.pagination?.totalPages}
            </div>
          </div>
        </BaseCard>
      )}

      {/* Users Table */}
      <BaseCard padding="none">
        <UserTable
          data={data}
          isLoading={isLoading}
          filters={filters}
          pagination={pagination}
          sort={sort}
          onUserClick={handleUserClick}
        />
      </BaseCard>

      {/* User Detail Modal */}
      <UserDetailModal
        _id={selectedUserId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
