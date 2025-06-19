import React from 'react'
import { cn, classNames, variants } from '@/classNames'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface BaseMetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: React.ReactNode
  color?: typeof variants.colors[number]
  loading?: boolean
  onClick?: () => void
}

export const BaseMetricCard: React.FC<BaseMetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend,
  icon,
  color = 'blue',
  loading = false,
  onClick,
}) => {
  const getTrendIcon = () => {
    if (!change) return <Minus className={classNames.icon.sm} />
    if (trend === 'up') return <TrendingUp className={classNames.icon.sm} />
    if (trend === 'down') return <TrendingDown className={classNames.icon.sm} />
    return <Minus className={classNames.icon.sm} />
  }

  const getTrendColor = () => {
    if (!change) return classNames.metric.changeNeutral
    if (trend === 'up') return classNames.metric.changePositive
    if (trend === 'down') return classNames.metric.changeNegative
    return classNames.metric.changeNeutral
  }

  if (loading) {
    return (
      <BaseCard padding="default" loading />
    )
  }

  return (
    <BaseCard
      className={cn(
        classNames.metric.card,
        classNames.metric.cardGradient[color],
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className={classNames.metric.content}>
        <div className={classNames.utils.spaceBetween}>
          <div className={classNames.utils.fullWidth}>
            <div className={classNames.metric.header}>
              <span className={classNames.metric.title}>
                {title}
              </span>
              {subtitle && (
                <span className={classNames.metric.subtitle}>
                  {subtitle}
                </span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className={classNames.metric.value}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </div>
              
              {change !== undefined && (
                <div className={cn(classNames.metric.change, getTrendColor())}>
                  {getTrendIcon()}
                  <span>
                    {change > 0 ? '+' : ''}{change.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-xs">vs yesterday</span>
                </div>
              )}
            </div>
          </div>
          
          {icon && (
            <div className={cn(
              classNames.metric.icon,
              classNames.metric.iconGradient[color]
            )}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  )
}
