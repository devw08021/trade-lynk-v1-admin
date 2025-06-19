import React from 'react'
import { cn, classNames } from '@/classNames'

interface BaseTableProps extends React.HTMLAttributes<HTMLTableElement> {
  loading?: boolean
  loadingRows?: number
  empty?: boolean
  emptyMessage?: string
  emptyIcon?: React.ReactNode
}

const BaseTable = React.forwardRef<HTMLTableElement, BaseTableProps>(
  ({ className, loading, children, ...props }, ref) => (
    <div className={classNames.table.container}>
      <table
        ref={ref}
        className={cn(classNames.table.table, className)}
        {...props}
      >
        {children}
      </table>
    </div>
  )
)

const BaseTableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(classNames.table.header, className)}
      {...props}
    />
  )
)

const BaseTableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn(classNames.table.body, className)}
      {...props}
    />
  )
)

const BaseTableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(classNames.table.row, className)}
      {...props}
    />
  )
)

const BaseTableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(classNames.table.headerCell, className)}
      {...props}
    />
  )
)

const BaseTableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement> & {
  numeric?: boolean
}>(
  ({ className, numeric = false, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        numeric ? classNames.table.cellNumeric : classNames.table.cell,
        className
      )}
      {...props}
    />
  )
)

// Loading state component
const BaseTableLoading: React.FC<{ rows?: number; columns?: number }> = ({ 
  rows = 5, 
  columns = 6 
}) => (
  <BaseTableBody>
    {Array.from({ length: rows }).map((_, i) => (
      <BaseTableRow key={i}>
        {Array.from({ length: columns }).map((_, j) => (
          <BaseTableCell key={j}>
            <div className={classNames.table.loading} />
          </BaseTableCell>
        ))}
      </BaseTableRow>
    ))}
  </BaseTableBody>
)

// Empty state component
const BaseTableEmpty: React.FC<{ 
  message?: string
  icon?: React.ReactNode
  columns: number
}> = ({ message = 'No data available', icon, columns }) => (
  <BaseTableBody>
    <BaseTableRow>
      <BaseTableCell colSpan={columns}>
        <div className={classNames.table.empty}>
          {icon && <div className="mb-4">{icon}</div>}
          <p className={classNames.text.muted}>{message}</p>
        </div>
      </BaseTableCell>
    </BaseTableRow>
  </BaseTableBody>
)

BaseTable.displayName = 'BaseTable'
BaseTableHeader.displayName = 'BaseTableHeader'
BaseTableBody.displayName = 'BaseTableBody'
BaseTableRow.displayName = 'BaseTableRow'
BaseTableHead.displayName = 'BaseTableHead'
BaseTableCell.displayName = 'BaseTableCell'

export {
  BaseTable,
  BaseTableHeader,
  BaseTableBody,
  BaseTableRow,
  BaseTableHead,
  BaseTableCell,
  BaseTableLoading,
  BaseTableEmpty,
}
