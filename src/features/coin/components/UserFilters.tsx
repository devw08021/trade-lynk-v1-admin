import React, { Fragment } from 'react'
import { FilterPanel } from '@/components/composite/FilterPanel'
import type { UserFilters } from '@/types'

interface UserFiltersProps {
  isOpen: boolean
  filters: UserFilters
  onFiltersChange: (filters: UserFilters) => void
  onClearFilters: () => void
}

export const UserFiltersComponent: React.FC<UserFiltersProps> = ({
  isOpen = false,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const filterConfigs = [
    {
      key: 'status',
      label: 'User Status',
      type: 'select' as const,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' },
        { value: 'banned', label: 'Banned' },
        { value: 'pending_verification', label: 'Pending Verification' },
      ],
      placeholder: 'All statuses',
    },
    {
      key: 'kycStatus',
      label: 'KYC Status',
      type: 'select' as const,
      options: [
        { value: 'not_started', label: 'Not Started' },
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'expired', label: 'Expired' },
      ],
      placeholder: 'All KYC statuses',
    },
    {
      key: 'role',
      label: 'User Role',
      type: 'select' as const,
      options: [
        { value: 'user', label: 'User' },
        { value: 'vip', label: 'VIP' },
        { value: 'admin', label: 'Admin' },
        { value: 'super_admin', label: 'Super Admin' },
        { value: 'support', label: 'Support' },
      ],
      placeholder: 'All roles',
    },
    {
      key: 'registrationDate',
      label: 'Registration Date',
      type: 'daterange' as const,
    },
  ]

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    })
  }

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({
      ...filters,
      search: searchTerm || undefined,
    })
  }

  return (
    <Fragment>
      {isOpen && (
        <FilterPanel
          searchValue={filters.search || ''}
          onSearchChange={handleSearchChange}
          searchPlaceholder="Search users by name, email, or username..."
          filters={filterConfigs}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={onClearFilters}
          onApplyFilters={() => console.log('Apply filters')}
        />)}
    </Fragment>

  )
}
