import React from 'react'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { classNames } from '@/classNames'
import {formatters} from '@/utils/formatters'
import { User, Wallet, TrendingUp, Shield, Activity } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'user' | 'trade' | 'wallet' | 'kyc'
  title: string
  description: string
  timestamp: string
  status?: string
  user?: string
  amount?: number
  severity?: 'low' | 'medium' | 'high'
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'user',
    title: 'New User Registration',
    description: 'john.doe@email.com registered',
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    status: 'pending_verification',
    user: 'john.doe@email.com',
  },
  {
    id: '2',
    type: 'trade',
    title: 'Large Trade Alert',
    description: 'BTC/USDT trade executed',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    status: 'completed',
    amount: 2500000,
    severity: 'high',
  },
  {
    id: '3',
    type: 'wallet',
    title: 'Withdrawal Request',
    description: '50 BTC withdrawal pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    status: 'pending',
    user: 'trader123',
    amount: 50,
    severity: 'medium',
  },
  {
    id: '4',
    type: 'kyc',
    title: 'KYC Submission',
    description: 'Document verification required',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    status: 'pending',
    user: 'alice.crypto',
  },
]

const getActivityIcon = (type: ActivityItem['type']) => {
  const icons = {
    user: User,
    trade: TrendingUp,
    wallet: Wallet,
    kyc: Shield,
  }
  return icons[type]
}

const getActivityColor = (type: ActivityItem['type']) => {
  const colors = {
    user: 'blue',
    trade: 'green', 
    wallet: 'purple',
    kyc: 'amber',
  } as const
  return colors[type]
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed': case 'approved': return 'success'
    case 'pending': case 'pending_verification': return 'warning'
    case 'failed': case 'rejected': return 'error'
    default: return 'neutral'
  }
}

export const RecentActivity: React.FC = () => {
  return (
    <BaseCard>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className={classNames.text.h4}>Recent Activity</h3>
            <p className={classNames.text.muted}>Latest platform events</p>
          </div>
        </div>

        <div className="space-y-4">
          {mockActivities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type)
            const color = getActivityColor(activity.type)
            
            return (
              <div 
                key={activity.id} 
                className="flex items-start space-x-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/30 transition-colors cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${classNames.metric.iconGradient[color]}`}>
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className={classNames.utils.spaceBetween}>
                    <h4 className={`${classNames.text.h6} group-hover:text-white transition-colors`}>
                      {activity.title}
                    </h4>
                    {activity.status && (
                      <BaseStatusBadge
                        status={activity.status.replace('_', ' ')}
                        variant={getStatusVariant(activity.status)}
                        size="sm"
                      />
                    )}
                  </div>
                  
                  <p className={`${classNames.text.muted} mt-1`}>
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-xs text-gray-400">
                      {activity.user && (
                        <span>User: {activity.user}</span>
                      )}
                      {activity.amount && (
                        <span>
                          Amount: {activity.type === 'trade' 
                            ? formatters.currency(activity.amount)
                            : `${activity.amount} BTC`
                          }
                        </span>
                      )}
                      {activity.severity && (
                        <BaseStatusBadge
                          status={activity.severity}
                          variant={activity.severity === 'high' ? 'error' : activity.severity === 'medium' ? 'warning' : 'info'}
                          size="sm"
                        />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatters.timeAgo(activity.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </BaseCard>
  )
}
