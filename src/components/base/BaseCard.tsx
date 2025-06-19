import React from 'react'
import { cn, classNames, variants } from '@/classNames'

interface BaseCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'premium' | 'success' | 'warning' | 'danger'
  padding?: keyof typeof classNames.card.padding
  interactive?: boolean
  loading?: boolean
  children: React.ReactNode
}

export const BaseCard = React.forwardRef<HTMLDivElement, BaseCardProps>(
  ({ 
    className, 
    variant = 'default', 
    padding = 'default', 
    interactive = false, 
    loading = false,
    children, 
    ...props 
  }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case 'glass': return classNames.card.glass
        case 'premium': return classNames.card.premium
        case 'success': return classNames.card.success
        case 'warning': return classNames.card.warning
        case 'danger': return classNames.card.danger
        default: return classNames.card.base
      }
    }

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            classNames.card.base,
            classNames.card.padding[padding],
            'animate-pulse',
            className
          )}
          {...props}
        >
          <div className="space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-8 bg-gray-700 rounded w-1/2" />
            <div className="h-3 bg-gray-700 rounded w-1/4" />
          </div>
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          getVariantClasses(),
          classNames.card.padding[padding],
          interactive && classNames.card.interactive,
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

BaseCard.displayName = 'BaseCard'
