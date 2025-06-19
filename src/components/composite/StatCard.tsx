import React from 'react'
import { BaseCard } from '@/components/base/BaseCard'
import { classNames, variants } from '@/classNames'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  color?: typeof variants.colors[number]
  icon?: React.ReactNode
  loading?: boolean
  onClick?: () => void
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  color = 'blue',
  icon,
  loading = false,
  onClick,
}) => {
  if (loading) {
    return <BaseCard padding="default" loading />
  }

  return (
    <BaseCard
      className={`${classNames.metric.cardGradient[color]} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="text-center space-y-3">
        {icon && (
          <div className={`${classNames.metric.iconGradient[color]} ${classNames.metric.icon} mx-auto w-12 h-12`}>
            {icon}
          </div>
        )}
        
        <div>
          <div className={classNames.metric.value}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </div>
          <div className={classNames.metric.title}>
            {title}
          </div>
          {subtitle && (
            <div className={classNames.text.muted}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  )
}
