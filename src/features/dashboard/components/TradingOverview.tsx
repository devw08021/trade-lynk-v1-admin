import React from 'react'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseButton } from '@/components/base/BaseButton'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { classNames } from '@/classNames'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'

const tradingPairs = [
  { pair: 'BTC/USDT', price: 43250.50, change: 2.45, volume: 1234.56, high: 44100, low: 42800 },
  { pair: 'ETH/USDT', price: 2680.75, change: -1.23, volume: 5678.90, high: 2720, low: 2650 },
  { pair: 'BNB/USDT', price: 315.25, change: 0.87, volume: 890.12, high: 318, low: 312 },
  { pair: 'ADA/USDT', price: 0.485, change: 3.21, volume: 2456.78, high: 0.492, low: 0.478 },
  { pair: 'SOL/USDT', price: 98.45, change: -0.65, volume: 1890.34, high: 102, low: 96.8 },
]

export const TradingOverview: React.FC = () => {
  return (
    <BaseCard>
      {/* Header */}
      <div className={classNames.card.header}>
        <div className={classNames.utils.spaceBetween}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${classNames.metric.iconGradient.green} rounded-lg flex items-center justify-center`}>
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={classNames.text.h4}>Live Trading Markets</h3>
              <p className={classNames.text.muted}>Real-time market data</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <BaseStatusBadge
              status="LIVE"
              variant="success"
              pulse
            />
            <BaseButton variant="ghost" size="sm">
              View All Markets
            </BaseButton>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className={classNames.card.content}>
        <div className="space-y-1">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-700/50">
            <div>Pair</div>
            <div className="text-right">Price</div>
            <div className="text-right">24h Change</div>
            <div className="text-right">Volume</div>
            <div className="text-right">High</div>
            <div className="text-right">Low</div>
          </div>
          
          {/* Trading Pairs */}
          {tradingPairs.map((pair, index) => (
            <div 
              key={pair.pair}
              className="grid grid-cols-6 gap-4 px-4 py-4 hover:bg-gray-700/30 transition-colors rounded-lg cursor-pointer group"
            >
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 ${classNames.avatar.gradients.orange} rounded-full flex items-center justify-center text-xs font-bold text-white`}>
                  {pair.pair.split('/')[0].slice(0, 2)}
                </div>
                <div>
                  <div className={`${classNames.text.h6} ${classNames.trading.pair}`}>
                    {pair.pair}
                  </div>
                  <div className={classNames.text.xs}>
                    Vol: {pair.volume}M
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`${classNames.text.mono} font-semibold text-gray-100`}>
                  ${pair.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`${classNames.trading.change[pair.change >= 0 ? 'positive' : 'negative']}`}>
                  {pair.change >= 0 ? (
                    <TrendingUp className={classNames.icon.sm} />
                  ) : (
                    <TrendingDown className={classNames.icon.sm} />
                  )}
                  <span>{pair.change >= 0 ? '+' : ''}{pair.change.toFixed(2)}%</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`${classNames.text.mono} text-gray-300`}>
                  ${pair.volume.toFixed(1)}M
                </div>
              </div>
              
              <div className="text-right">
                <div className={`${classNames.text.mono} text-gray-300`}>
                  ${pair.high.toLocaleString()}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`${classNames.text.mono} text-gray-300`}>
                  ${pair.low.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Trading Stats */}
        <div className="mt-6 pt-6 border-t border-gray-700/50">
          <div className="grid grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`${classNames.metric.value} text-gray-100`}>247</div>
              <div className={classNames.text.small}>Active Pairs</div>
            </div>
            <div className="text-center">
              <div className={`${classNames.metric.value} text-green-400`}>$2.4B</div>
              <div className={classNames.text.small}>24h Volume</div>
            </div>
            <div className="text-center">
              <div className={`${classNames.metric.value} text-blue-400`}>15.7K</div>
              <div className={classNames.text.small}>Active Orders</div>
            </div>
            <div className="text-center">
              <div className={`${classNames.metric.value} text-purple-400`}>8.9K</div>
              <div className={classNames.text.small}>Online Traders</div>
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  )
}
