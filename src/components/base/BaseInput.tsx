import React from 'react'
import { cn, classNames } from '@/classNames'

interface BaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: boolean
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  inputSize?: keyof typeof classNames.input.sizes
}

export const BaseInput = React.forwardRef<HTMLInputElement, BaseInputProps>(
  ({ 
    className, 
    label,
    helperText,
    error = false,
    success = false,
    leftIcon,
    rightIcon,
    inputSize = 'default',
    ...props 
  }, ref) => {
    const getStateClasses = () => {
      if (error) return classNames.input.states.error
      if (success) return classNames.input.states.success
      return ''
    }

    const getHelperClasses = () => {
      if (error) return classNames.input.helperError
      if (success) return classNames.input.helperSuccess
      return classNames.input.helper
    }

    return (
      <div className="space-y-2">
        {label && (
          <label className={classNames.input.label}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={cn(
              classNames.input.base,
              classNames.input.sizes[inputSize],
              getStateClasses(),
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {rightIcon}
            </div>
          )}
        </div>
        
        {helperText && (
          <p className={getHelperClasses()}>
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

BaseInput.displayName = 'BaseInput'
