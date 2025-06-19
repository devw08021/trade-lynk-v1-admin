import React from 'react'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { classNames} from '@/classNames'
import { Crown, TrendingUp, Award, Star } from 'lucide-react'
import {formatters} from '@/utils/formatters'

const topTraders = [
  { 
    rank: 1, 
    name: 'CryptoKing47', 
    profit: 847250, 
    trades: 1247, 
    winRate: 87.5, 
    badge: 'diamond',
    country: 'US'
  },
  { 
    rank: 2, 
    name: 'WhaleHunter', 
    profit: 634180, 
    trades: 892, 
    winRate: 82.3, 
    badge: 'gold',
    country: 'SG'
  },
  { 
    rank: 3, 
    name: 'TradeMaster', 
    profit: 521300, 
    trades: 1556, 
    winRate: 79.1, 
    badge: 'gold',
    country: 'UK'
  },
  { 
    rank: 4, 
    name: 'BitBaron', 
    profit: 445670, 
    trades: 743, 
    winRate: 85.2, 
    badge: 'silver',
    country: 'CA'
  },
  { 
    rank: 5, 
    name: 'CoinSensei', 
    profit: 398450, 
    trades: 891, 
    winRate: 76.8, 
    badge: 'silver',
    country: 'JP'
  },
]

const getBadgeGradient = (badge: string) => {
  switch (badge) {
    case 'diamond': return classNames.avatar.gradients.blue
    case 'gold': return classNames.avatar.gradients.amber
    case 'silver': return classNames.avatar.gradients.gray
    default: return classNames.avatar.gradients.gray
  }
}

const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-4 h-4 text-yellow-400" />
      case 2: return <Award className="w-4 h-4 text-gray-300" />
      case 3: return <Award className="w-4 h-4 text-amber-600" />
      default: return <Star className="w-4 h-4 text-gray-400" />
    }
  }
  
  export const TopTraders: React.FC = () => {
    return (
      <BaseCard>
        {/* Header */}
        <div className={classNames.card.header}>
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${classNames.metric.iconGradient.amber} rounded-lg flex items-center justify-center`}>
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={classNames.text.h4}>Top Performers</h3>
              <p className={classNames.text.muted}>This month's leaderboard</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className={classNames.card.content}>
          <div className="space-y-4">
            {topTraders.map((trader) => (
              <div 
                key={trader.rank}
                className="flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-700/30 transition-colors group cursor-pointer"
              >
                {/* Rank & Badge */}
                <div className="flex items-center space-x-3">
                  <div className={`${classNames.avatar.base} ${classNames.avatar.sizes.default} bg-gray-700`}>
                    {getRankIcon(trader.rank)}
                  </div>
                  <div className={`w-3 h-6 rounded-full ${getBadgeGradient(trader.badge)}`} />
                </div>
                
                {/* Trader Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`${classNames.text.h6} text-gray-100`}>
                      {trader.name}
                    </div>
                    <BaseStatusBadge
                      status={trader.country}
                      variant="neutral"
                      size="sm"
                    />
                  </div>
                  <div className={classNames.text.small}>
                    {formatters.compact(trader.trades)} trades • {trader.winRate}% win rate
                  </div>
                </div>
                
                {/* Profit */}
                <div className="text-right">
                  <div className={`${classNames.trading.pricePositive} flex items-center space-x-1 font-semibold`}>
                    <TrendingUp className={classNames.icon.sm} />
                    <span>+{formatters.currency(trader.profit)}</span>
                  </div>
                  <div className={classNames.text.xs}>This month</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-700/50 text-center">
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
              View Full Leaderboard →
            </button>
          </div>
        </div>
      </BaseCard>
    )
  }
  