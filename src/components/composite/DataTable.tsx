import React from 'react'
import { 
  BaseTable, 
  BaseTableHeader, 
  BaseTableBody, 
  BaseTableRow, 
  BaseTableHead, 
  BaseTableCell,
  BaseTableLoading,
  BaseTableEmpty
} from '@/components/base/BaseTable'
import { BaseInput } from '@/components/base/BaseInput'
import { BaseButton } from '@/components/base/BaseButton'
import { classNames } from '@/classNames'
import { Search, Filter, Download, RefreshCw } from 'lucide-react'

export interface DataTableColumn<T> {
  key: keyof T | string
  title: string
  sortable?: boolean
  numeric?: boolean
  width?: string
  render?: (item: T, value: any) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: DataTableColumn<T>[]
  loading?: boolean
  empty?: boolean
  emptyMessage?: string
  emptyIcon?: React.ReactNode
  searchable?: boolean
  searchPlaceholder?: string
  filterable?: boolean
  exportable?: boolean
  refreshable?: boolean
  onSearch?: (term: string) => void
  onFilter?: () => void
  onExport?: () => void
  onRefresh?: () => void
  onRowClick?: (item: T) => void
  renderActions?: (item: T) => React.ReactNode
  className?: string
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  empty = false,
  emptyMessage = 'No data available',
  emptyIcon,
  searchable = false,
  searchPlaceholder = 'Search...',
  filterable = false,
  exportable = false,
  refreshable = false,
  onSearch,
  onFilter,
  onExport,
  onRefresh,
  onRowClick,
  renderActions,
  className,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = React.useState('')

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch?.(term)
  }

  const getValue = (item: T, key: string) => {
    return key.includes('.') 
      ? key.split('.').reduce((obj, k) => obj?.[k], item)
      : item[key]
  }

  if (loading) {
    return (
      <BaseTable className={className}>
        <BaseTableHeader>
          <BaseTableRow>
            {columns.map((column, index) => (
              <BaseTableHead key={index} style={{ width: column.width }}>
                {column.title}
              </BaseTableHead>
            ))}
            {renderActions && <BaseTableHead>Actions</BaseTableHead>}
          </BaseTableRow>
        </BaseTableHeader>
        <BaseTableLoading rows={5} columns={columns.length + (renderActions ? 1 : 0)} />
      </BaseTable>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      {(searchable || filterable || exportable || refreshable) && (
        <div className={classNames.filter.container}>
          {searchable && (
            <div className={classNames.filter.search}>
              <Search className={classNames.filter.searchIcon} />
              <BaseInput
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={handleSearch}
                className={classNames.filter.searchInput}
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            {filterable && (
              <BaseButton variant="secondary" size="sm" onClick={onFilter}>
                <Filter className={classNames.icon.sm} />
                Filter
              </BaseButton>
            )}
            
            {exportable && (
              <BaseButton variant="secondary" size="sm" onClick={onExport}>
                <Download className={classNames.icon.sm} />
                Export
              </BaseButton>
            )}
            
            {refreshable && (
              <BaseButton variant="secondary" size="sm" onClick={onRefresh}>
                <RefreshCw className={classNames.icon.sm} />
                Refresh
              </BaseButton>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <BaseTable className={className}>
        <BaseTableHeader>
          <BaseTableRow>
            {columns.map((column, index) => (
              <BaseTableHead key={index} style={{ width: column.width }}>
                {column.title}
              </BaseTableHead>
            ))}
            {renderActions && <BaseTableHead>Actions</BaseTableHead>}
          </BaseTableRow>
        </BaseTableHeader>

        {empty || data.length === 0 ? (
          <BaseTableEmpty 
            message={emptyMessage}
            icon={emptyIcon}
            columns={columns.length + (renderActions ? 1 : 0)}
          />
        ) : (
          <BaseTableBody>
            {data.map((item, rowIndex) => (
              <BaseTableRow 
                key={rowIndex}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={onRowClick ? 'cursor-pointer' : undefined}
              >
                {columns.map((column, colIndex) => {
                  const value = getValue(item, column.key as string)
                  return (
                    <BaseTableCell key={colIndex} numeric={column.numeric}>
                      {column.render ? column.render(item, value) : value}
                    </BaseTableCell>
                  )
                })}
                {renderActions && (
                  <BaseTableCell>
                    {renderActions(item)}
                  </BaseTableCell>
                )}
              </BaseTableRow>
            ))}
          </BaseTableBody>
        )}
      </BaseTable>
    </div>
  )
}
