import React from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { cn, classNames } from '@/classNames'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { SystemMetric } from '@/types'

interface MetricCardProps {
  metric: SystemMetric & {
    color?: 'blue' | 'green' | 'amber' | 'emerald' | 'purple' | 'orange'
    subtitle?: string
  }
  loading?: boolean
}

const colorVariants = {
  blue: {
    bg: 'from-blue-900/20 to-blue-800/20',
    border: 'border-blue-500/20',
    icon: 'text-blue-400',
    glow: 'shadow-blue-500/10',
  },
  green: {
    bg: 'from-green-900/20 to-green-800/20',
    border: 'border-green-500/20',
    icon: 'text-green-400',
    glow: 'shadow-green-500/10',
  },
  amber: {
    bg: 'from-amber-900/20 to-amber-800/20',
    border: 'border-amber-500/20',
    icon: 'text-amber-400',
    glow: 'shadow-amber-500/10',
  },
  emerald: {
    bg: 'from-emerald-900/20 to-emerald-800/20',
    border: 'border-emerald-500/20',
    icon: 'text-emerald-400',
    glow: 'shadow-emerald-500/10',
  },
  purple: {
    bg: 'from-purple-900/20 to-purple-800/20',
    border: 'border-purple-500/20',
    icon: 'text-purple-400',
    glow: 'shadow-purple-500/10',
  },
  orange: {
    bg: 'from-orange-900/20 to-orange-800/20',
    border: 'border-orange-500/20',
    icon: 'text-orange-400',
    glow: 'shadow-orange-500/10',
  },
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric, loading }) => {
  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-8 bg-gray-700 rounded w-1/2" />
            <div className="h-3 bg-gray-700 rounded w-1/4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTrendIcon = () => {
    if (!metric.change) return <Minus className="h-4 w-4" />
    if (metric.trend === 'up') return <TrendingUp className="h-4 w-4" />
    if (metric.trend === 'down') return <TrendingDown className="h-4 w-4" />
    return <Minus className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (!metric.change) return 'text-gray-400'
    if (metric.trend === 'up') return 'text-green-400'
    if (metric.trend === 'down') return 'text-red-400'
    return 'text-gray-400'
  }

  const colorVariant = colorVariants[metric.color || 'blue']

  return (
    <Card className={cn(
      'bg-gradient-to-br',
      colorVariant.bg,
      'border',
      colorVariant.border,
      'shadow-2xl',
      colorVariant.glow,
      'hover:shadow-xl transition-all duration-300 group'
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-3">
              <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                {metric.label}
              </p>
              {metric.subtitle && (
                <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">
                  {metric.subtitle}
                </span>
              )}
            </div>
            
            <p className="text-3xl font-bold text-gray-100 mb-3 font-mono tracking-tight">
              {typeof metric.value === 'number' 
                ? metric.value.toLocaleString() 
                : metric.value
              }
            </p>
            
            {metric.change !== undefined && (
              <div className={cn('flex items-center text-sm font-semibold', getTrendColor())}>
                {getTrendIcon()}
                <span className="ml-1">
                  {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}%
                </span>
                <span className="ml-2 text-gray-500 text-xs">vs yesterday</span>
              </div>
            )}
          </div>
          
          {metric.icon && (
            <div className={cn(
              'h-14 w-14 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110',
              'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-700/50'
            )}>
              <span className={colorVariant.icon}>{metric.icon}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
