import React from 'react'
import { cn, classNames } from '@/classNames'
import { Loader2 } from 'lucide-react'

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof classNames.button.variants
  size?: keyof typeof classNames.button.sizes
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  children?: React.ReactNode
}

export const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
    ({ 
      className, 
      variant = 'primary', 
      size = 'default', 
      loading = false,
      disabled,
      icon,
      iconPosition = 'left',
      children, 
      ...props 
    }, ref) => {
      const isDisabled = disabled || loading
  
      const getSizeClasses = () => {
        if (size === 'icon') {
          return typeof classNames.button.sizes.icon === 'string' 
            ? classNames.button.sizes.icon 
            : classNames.button.sizes.icon.default
        }
        return classNames.button.sizes[size]
      }
  
      const renderIcon = () => {
        if (loading) {
          return <Loader2 className={cn(classNames.icon.sm, 'animate-spin')} />
        }
        return icon
      }
  
      const renderContent = () => {
        if (size === 'icon') {
          return renderIcon() || children
        }
  
        if (!children) {
          return renderIcon()
        }
  
        return (
          <>
            {iconPosition === 'left' && renderIcon() && (
              <span className={classNames.button.iconSpacing}>
                {renderIcon()}
              </span>
            )}
            {children}
            {iconPosition === 'right' && renderIcon() && (
              <span className={cn(classNames.button.iconSpacing, 'ml-2 mr-0')}>
                {renderIcon()}
              </span>
            )}
          </>
        )
      }
  
      return (
        <button
          ref={ref}
          className={cn(
            classNames.button.base,
            classNames.button.variants[variant],
            getSizeClasses(),
            loading && classNames.button.loading,
            className
          )}
          disabled={isDisabled}
          {...props}
        >
          {renderContent()}
        </button>
      )
    }
  )
  
  BaseButton.displayName = 'BaseButton'
  