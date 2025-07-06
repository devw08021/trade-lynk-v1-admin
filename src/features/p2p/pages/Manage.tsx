import React from 'react'
import { PageHeader } from '@/components/composite/PageHeader'
import { QuickStats } from '../components/QuickStats'
import { FiltersComponent } from '../components/Filters'
import { ModelDetails } from '../components/UserDetailModal'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseButton } from '@/components/base/BaseButton'
import { usePairs } from '@/hooks/p2p/usePair'
import { classNames } from '@/classNames'
import { Download, Plus, Users, Minus } from 'lucide-react'
import type { User, UserFilters, PaginationOptions, SortOptions } from '@/types'
import { DisputeTable } from '../components/DisputeTable'

export const Manage: React.FC = () => {
  const [filters, setFilters] = React.useState<UserFilters>({})
  const [pagination, setPagination] = React.useState<PaginationOptions>({ page: 0, limit: 20 })
  const [sort, setSort] = React.useState<SortOptions>({ field: 'createdAt', direction: -1 })
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isFilter, setIsFilter] = React.useState(false)

  const { data, isLoading } = usePairs(filters, pagination, sort)

  const handleUserClick = (user: User) => {
    setSelectedUserId(user.id)
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
        Add User
      </BaseButton>
    </>
  )

  return (
    <div className={classNames.layout.page}>
      <PageHeader
        title="P2P Management"
        subtitle="Monitor and manage all platform P2P orders advanced controls"
        // actions={pageActions}
        breadcrumbs={[{ label: 'P2P', href: '/p2p' }, { label: 'P2P Management' }]}
      />

      {/* Quick Stats */}
      <QuickStats />

      {/* Advanced Filters */}
      <FiltersComponent
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
                  {data.count > 0
                    ? `${Math.max(1, (pagination.page) * pagination.limit)}–${Math.min((pagination.page + 1) * pagination.limit, data.count)}`
                    : '0–0'}
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
        <DisputeTable
          filters={filters}
          pagination={pagination}
          sort={sort}
          onUserClick={handleUserClick}
        />
      </BaseCard>

      {/* User Detail Modal */}
      {/* <ModelDetails _id={selectedUserId} isOpen={isModalOpen} onClose={handleCloseModal} /> */}
    </div>
  )
}
