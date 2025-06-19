import React from 'react'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseButton } from '@/components/base/BaseButton'
import { useChartData } from '@/hooks/useDashboard'
import { classNames } from '@/classNames'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { format } from 'date-fns'

const timeframes = [
  { label: '24H', value: '24h' },
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
] as const

export const VolumeChart: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState<'24h' | '7d' | '30d' | '90d'>('24h')
  const { data: chartData, isLoading } = useChartData(timeframe)

  const formatXAxis = (timestamp: string) => {
    const date = new Date(timestamp)
    switch (timeframe) {
      case '24h':
        return format(date, 'HH:mm')
      case '7d':
        return format(date, 'MM/dd')
      case '30d':
      case '90d':
        return format(date, 'MM/dd')
      default:
        return format(date, 'MM/dd')
    }
  }

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  if (isLoading) {
    return (
      <BaseCard loading padding="default" />
    )
  }

  return (
    <BaseCard>
      {/* Header */}
      <div className={classNames.card.header}>
        <div className={classNames.utils.spaceBetween}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${classNames.metric.iconGradient.blue} rounded-lg flex items-center justify-center`}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className={classNames.text.h4}>Trading Volume</h3>
              <p className={classNames.text.muted}>Market activity over time</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {timeframes.map((tf) => (
              <BaseButton
                key={tf.value}
                variant={timeframe === tf.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setTimeframe(tf.value)}
              >
                {tf.label}
              </BaseButton>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Content */}
      <div className={classNames.card.content}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 28%, 17%)" />
              <XAxis 
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                stroke="hsl(215, 20%, 65%)"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                stroke="hsl(215, 20%, 65%)"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(220, 13%, 9%)',
                  border: '1px solid hsl(215, 28%, 17%)',
                  borderRadius: '8px',
                  color: 'hsl(210, 40%, 98%)',
                }}
                labelFormatter={(timestamp) => format(new Date(timestamp), 'PPp')}
                formatter={[(value: number) => [formatTooltipValue(value), 'Volume']]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="hsl(217, 91%, 60%)"
                fill="hsl(217, 91%, 60%)"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </BaseCard>
  )
}
