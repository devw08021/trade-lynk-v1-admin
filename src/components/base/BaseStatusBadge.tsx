import React from 'react'
import { cn, classNames, variants } from '@/classNames'

interface BaseStatusBadgeProps {
  status: string
  variant?: typeof variants.statuses[number]
  size?: keyof typeof classNames.status.sizes
  icon?: React.ReactNode
  pulse?: boolean
  className?: string
}

export const BaseStatusBadge: React.FC<BaseStatusBadgeProps> = ({
  status,
  variant = 'neutral',
  size = 'default',
  icon,
  pulse = false,
  className,
}) => {
  return (
    <span className={cn(
      classNames.status.base,
      classNames.status.variants[variant],
      classNames.status.sizes[size],
      icon && classNames.status.withIcon,
      pulse && classNames.status.pulse,
      className
    )}>
      {icon && (
        <span className={classNames.status.iconSpacing}>
          {icon}
        </span>
      )}
      <span className="uppercase tracking-wider font-bold">
        {status}
      </span>
    </span>
  )
}
