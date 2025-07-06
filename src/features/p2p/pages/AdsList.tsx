import React from 'react'
import { PageHeader } from '@/components/composite/PageHeader'
import { FiltersComponent } from '../components/Filters'
import { AdsTable } from '../components/AdsTable'
import { UserDetailModal } from '../components/UserDetailModal'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseButton } from '@/components/base/BaseButton'
import { useAds } from '@/hooks/p2p/useAds'
import { classNames } from '@/classNames'
import { Download, Plus, Users, Minus } from 'lucide-react'
import type { User, UserFilters, PaginationOptions, SortOptions } from '@/types'

export const AdsList: React.FC = () => {
  const [filters, setFilters] = React.useState<UserFilters>({})
  const [pagination, setPagination] = React.useState<PaginationOptions>({ page: 0, limit: 10 })
  const [sort, setSort] = React.useState<SortOptions>({ field: 'createdAt', direction: -1 })
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isFilter, setIsFilter] = React.useState(false)

  const { data, isLoading } = useAds(filters, pagination, sort)
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
    setPagination(prev => ({ ...prev, page: 0 }))
  }

  const handleClearFilters = () => {
    setFilters({})
    setPagination(prev => ({ ...prev, page: 0 }))
  }

  const handleExport = () => {
    console.log('Exporting users...', { filters, sort })
  }
  const onPageChange = page => {
    setPagination(prev => ({ ...prev, page: page }))
  }
  const onLimitChange = page => {
    setPagination(prev => ({ ...prev, limit: page }))
  }
  const pageActions = (
    <>
      <BaseButton variant="secondary" onClick={handleExport}>
        <Download className={classNames.icon.sm} />
        Export Data
      </BaseButton>
      <BaseButton onClick={() => setIsFilter(!isFilter)} >
        {
          isFilter ? <Minus className={classNames.icon.sm} onClick={() => setIsFilter(!isFilter)} />
            : <Plus className={classNames.icon.sm} />
        }
        Filters
      </BaseButton>
    </>
  )

  return (
    <div className={classNames.layout.page}>
      <PageHeader
        title="P2P Ads"
        subtitle="Monitor and manage all Pairs in P2P orders"
        actions={pageActions}
        breadcrumbs={[{ label: 'P2P', href: '/p2p' }, { label: 'P2P Management' }]}
      />
      {/* Advanced Filters */}
      <FiltersComponent
        isOpen={isFilter}
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
                  {data.count.toLocaleString()}
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
              Page {pagination.page + 1} of {Math.ceil(data?.count / pagination.limit)}
            </div>
          </div>
        </BaseCard>
      )}

      {/* Users Table */}
      <BaseCard padding="none">
        <AdsTable
          filters={filters}
          pagination={pagination}
          sort={sort}
          onUserClick={handleUserClick}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </BaseCard>

      {/* User Detail Modal */}
      {/* <UserDetailModal userId={selectedUserId} isOpen={isModalOpen} onClose={handleCloseModal} /> */}
    </div>
  )
}
