import React from 'react'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseButton } from '@/components/base/BaseButton'
import { BaseInput } from '@/components/base/BaseInput'
import { classNames } from '@/classNames'
import { Search, Filter, X } from 'lucide-react'
import * as Select from '@radix-ui/react-select'
import * as Popover from '@radix-ui/react-popover'

interface FilterOption {
  value: string
  label: string
}

interface FilterConfig {
  key: string
  label: string
  type: 'select' | 'multiselect' | 'date' | 'daterange'
  options?: FilterOption[]
  placeholder?: string
}

interface FilterPanelProps {
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: FilterConfig[]
  activeFilters?: Record<string, any>
  onFilterChange?: (key: string, value: any) => void
  onClearFilters?: () => void
  onApplyFilters?: () => void
  children?: React.ReactNode
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
  activeFilters = {},
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  children,
}) => {
  const activeFilterCount = Object.values(activeFilters).filter(Boolean).length
  const hasActiveFilters = activeFilterCount > 0

  const renderFilter = (filter: FilterConfig) => {
    switch (filter.type) {
      case 'select':
        return (
          <div key={filter.key} className="space-y-2">
            <label className={classNames.input.label}>{filter.label}</label>
            <Select.Root
              value={activeFilters[filter.key] || ''}
              onValueChange={(value) => onFilterChange?.(filter.key, value)}
            >
              <Select.Trigger className={classNames.dropdown.trigger}>
                <Select.Value placeholder={filter.placeholder || `Select ${filter.label}`} />
                <Select.Icon />
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className={classNames.dropdown.content}>
                  <Select.Viewport className="p-1">
                    <Select.Item value="all" className={classNames.dropdown.item}>
                      <Select.ItemText>All {filter.label}</Select.ItemText>
                    </Select.Item>
                    {filter.options?.map((option) => (
                      <Select.Item
                        key={option.value}
                        value={option.value}
                        className={classNames.dropdown.item}
                      >
                        <Select.ItemText>{option.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>
          </div>
        )

      case 'date':
        return (
          <div key={filter.key} className="space-y-2">
            <label className={classNames.input.label}>{filter.label}</label>
            <BaseInput
              type="date"
              value={activeFilters[filter.key] || ''}
              onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
            />
          </div>
        )

      case 'daterange':
        return (
          <div key={filter.key} className="space-y-2">
            <label className={classNames.input.label}>{filter.label}</label>
            <div className="grid grid-cols-2 gap-2">
              <BaseInput
                type="date"
                placeholder="From"
                value={activeFilters[`${filter.key}_from`] || ''}
                onChange={(e) => onFilterChange?.(`${filter.key}_from`, e.target.value)}
              />
              <BaseInput
                type="date"
                placeholder="To"
                value={activeFilters[`${filter.key}_to`] || ''}
                onChange={(e) => onFilterChange?.(`${filter.key}_to`, e.target.value)}
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <BaseCard>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={classNames.text.h5}>Advanced Search</h3>
              <p className={classNames.text.muted}>Find exactly what you're looking for</p>
            </div>
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              <div className={classNames.filter.badge}>
                {activeFilterCount} Filter{activeFilterCount > 1 ? 's' : ''} Active
              </div>
              <BaseButton variant="ghost" size="sm" onClick={onClearFilters}>
                Clear All
              </BaseButton>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <BaseInput
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            leftIcon={<Search className={classNames.icon.sm} />}
          />
        </div>

        {/* Filters */}
        {filters.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {filters.map(renderFilter)}
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-700/50">
              <BaseButton variant="secondary" onClick={onClearFilters}>
                <X className={classNames.icon.sm} />
                Clear
              </BaseButton>
              <BaseButton onClick={onApplyFilters}>
                <Filter className={classNames.icon.sm} />
                Apply Filters
              </BaseButton>
            </div>
          </>
        )}

        {/* Custom Children */}
        {children}
      </div>
    </BaseCard>
  )
}
