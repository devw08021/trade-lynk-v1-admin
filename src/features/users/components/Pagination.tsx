import React from 'react'
// import { BaseButton } from '@/components/ui/BaseButton'
import { BaseButton } from '@/components/base/BaseButton'
import { cn } from '@/classNames'
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  MoreHorizontal 
} from 'lucide-react'
import type { PaginationOptions } from '@/types'

interface PaginationProps {
  pagination: PaginationOptions
  totalPages: number
  onPageChange: (page: number) => void
  onLimitChange: (limit: number) => void
  showQuickJumper?: boolean
  showSizeChanger?: boolean
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  totalPages,
  onPageChange,
  onLimitChange,
  showQuickJumper = true,
  showSizeChanger = true,
}) => {
  const { page, limit } = pagination
  const [jumpToPage, setJumpToPage] = React.useState('')

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
      range.push(i)
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (page + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const pageNumbers = getPageNumbers()

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault()
    const pageNum = parseInt(jumpToPage)
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum)
      setJumpToPage('')
    }
  }

  return (
    <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-800/50 to-gray-850/50 rounded-xl border border-gray-700/30">
      {/* Left: Page Size Selector */}
      <div className="flex items-center space-x-4">
        {showSizeChanger && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400 font-medium">Show:</span>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-400">per page</span>
          </div>
        )}

        {/* Page Info */}
        <div className="text-sm text-gray-400">
          Page <span className="font-semibold text-gray-100">{page}</span> of{' '}
          <span className="font-semibold text-gray-100">{totalPages}</span>
        </div>
      </div>

      {/* Center: Page Navigation */}
      <div className="flex items-center space-x-1">
        {/* First Page */}
        <BaseButton
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
          className="hover:bg-gray-700/50"
        >
          <ChevronsLeft className="h-4 w-4" />
        </BaseButton>

        {/* Previous Page */}
        <BaseButton
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="hover:bg-gray-700/50"
        >
          <ChevronLeft className="h-4 w-4" />
        </BaseButton>

        {/* Page Numbers */}
        <div className="flex items-center space-x-1 mx-2">
          {pageNumbers.map((pageNum, index) => (
            <React.Fragment key={index}>
              {pageNum === '...' ? (
                <span className="px-3 py-2 text-gray-400">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              ) : (
                <BaseButton
                  variant={pageNum === page ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onPageChange(pageNum as number)}
                  className={cn(
                    'min-w-[40px] h-10',
                    pageNum === page
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'hover:bg-gray-700/50 text-gray-300'
                  )}
                >
                  {pageNum}
                </BaseButton>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next Page */}
        <BaseButton
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="hover:bg-gray-700/50"
        >
          <ChevronRight className="h-4 w-4" />
        </BaseButton>

        {/* Last Page */}
        <BaseButton
          variant="ghost"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
          className="hover:bg-gray-700/50"
        >
          <ChevronsRight className="h-4 w-4" />
        </BaseButton>
      </div>

      {/* Right: Quick Jump */}
      {showQuickJumper && (
        <form onSubmit={handleJumpToPage} className="flex items-center space-x-2">
          <span className="text-sm text-gray-400 font-medium">Go to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={jumpToPage}
            onChange={(e) => setJumpToPage(e.target.value)}
            placeholder="Page"
            className="w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <BaseButton
            type="submit"
            variant="secondary"
            size="sm"
            disabled={!jumpToPage || parseInt(jumpToPage) < 1 || parseInt(jumpToPage) > totalPages}
          >
            Go
          </BaseButton>
        </form>
      )}
    </div>
  )
}
