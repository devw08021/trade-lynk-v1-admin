import React from 'react'
import { BaseModal } from '@/components/base/BaseModal'
import { BaseButton } from '@/components/base/BaseButton'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { useUser, useUserAuditLog } from '@/hooks/useUsers'
import { classNames } from '@/classNames'
import {formatters} from '@/utils/formatters'

import { format } from 'date-fns'
import {
  User,
  Wallet,
  TrendingUp,
  Shield,
  Clock,
  Calendar,
  Activity,
  DollarSign,
  Star,
  Award,
  Mail,
  Smartphone,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import * as Tabs from '@radix-ui/react-tabs'
import type { User as UserType } from '@/types'

interface UserDetailModalProps {
  userId: string | null
  isOpen: boolean
  onClose: () => void
}

// Professional User Avatar Component (Enhanced)
const ProfessionalUserAvatar: React.FC<{ user: UserType; size?: 'sm' | 'lg' }> = ({ 
  user, 
  size = 'lg' 
}) => {
  const getStatusGradient = (status: string) => {
    switch (status) {
      case 'active': return classNames.avatar.gradients.green
      case 'suspended': return classNames.avatar.gradients.amber
      case 'banned': return classNames.avatar.gradients.red
      default: return classNames.avatar.gradients.gray
    }
  }

  const getInitials = (user: UserType) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    }
    return user.email.slice(0, 2).toUpperCase()
  }

  return (
    <div className="relative">
      <div className={`
        ${classNames.avatar.base}
        ${size === 'lg' ? 'w-20 h-20 text-2xl' : classNames.avatar.sizes.default}
        ${getStatusGradient(user.status)}
        shadow-2xl
      `}>
        <span className="text-white font-bold">
          {getInitials(user)}
        </span>
      </div>
      
      {/* VIP Crown */}
      {user.role === 'vip' && (
        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
          <Award className="w-4 h-4 text-white" />
        </div>
      )}
      
      {/* Online Status */}
      {user.lastLoginAt && new Date(user.lastLoginAt) > new Date(Date.now() - 5 * 60 * 1000) && (
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-4 border-gray-800 flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      )}
    </div>
  )
}

// Professional Stats Card for Modal
const ProfessionalModalStatsCard: React.FC<{
  title: string
  value: string | number
  subtitle?: string
  icon: React.ElementType
  color: 'blue' | 'green' | 'amber' | 'red' | 'purple'
  trend?: { value: number; positive: boolean }
}> = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  return (
    <div className={`
      ${classNames.card.base}
      ${classNames.metric.cardGradient[color]}
      p-6 text-center
    `}>
      <div className={`
        ${classNames.metric.icon}
        ${classNames.metric.iconGradient[color]}
        mx-auto mb-4
      `}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      
      <div className={`${classNames.metric.value} mb-2`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      
      <div className={`${classNames.metric.title} mb-2`}>
        {title}
      </div>
      
      {subtitle && (
        <div className={classNames.text.muted}>
          {subtitle}
        </div>
      )}
      
      {trend && (
        <div className={`flex items-center justify-center space-x-1 mt-2 text-sm font-semibold ${
          trend.positive ? classNames.metric.changePositive : classNames.metric.changeNegative
        }`}>
          <TrendingUp className={`w-4 h-4 ${trend.positive ? '' : 'rotate-180'}`} />
          <span>{trend.positive ? '+' : ''}{trend.value.toFixed(1)}%</span>
        </div>
      )}
    </div>
  )
}

export const UserDetailModal: React.FC<UserDetailModalProps> = ({
  userId,
  isOpen,
  onClose,
}) => {
  const { data: user, isLoading } = useUser(userId || '')
  const { data: auditLog } = useUserAuditLog(userId || '')

  if (!userId) return null

  const totalPortfolioValue = user?.walletBalances.reduce((sum, balance) => sum + balance.usdValue, 0) || 0

  const modalFooter = user && (
    <div className="flex items-center space-x-3">
      <BaseButton variant="secondary" onClick={onClose}>
        Close
      </BaseButton>
      <BaseButton>
        Edit User
      </BaseButton>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      footer={modalFooter}
    >
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className={`${classNames.loading.spinner} ${classNames.loading.sizes.lg}`} />
            <span className={classNames.text.muted}>Loading user details...</span>
          </div>
        </div>
      ) : user ? (
        <>
          {/* Enhanced Header */}
          <div className="px-8 py-6 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/90 to-gray-850/90">
            <div className="flex items-center space-x-6">
              <ProfessionalUserAvatar user={user} size="lg" />
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-4">
                  <h2 className={classNames.text.h2}>
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user.username || 'Unknown User'
                    }
                  </h2>
                  
                  <div className="flex items-center space-x-2">
                    <BaseStatusBadge
                      status={user.status.replace('_', ' ')}
                      variant={
                        user.status === 'active' ? 'success' :
                        user.status === 'suspended' ? 'warning' :
                        user.status === 'banned' ? 'error' : 'neutral'
                      }
                    />
                    <BaseStatusBadge
                      status={user.kycStatus.replace('_', ' ')}
                      variant={
                    user.kycStatus === 'pending' ? 'warning' :
                    user.kycStatus === 'rejected' || user.kycStatus === 'expired' ? 'error' : 'neutral'
                  }
                />
                
                {user.role === 'vip' && (
                  <BaseStatusBadge
                    status="VIP Member"
                    variant="warning"
                    icon={<Star className={classNames.icon.xs} />}
                  />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className={classNames.icon.sm} />
                <span className={classNames.text.mono}>{user.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-gray-400">
                <Calendar className={classNames.icon.sm} />
                <span>Joined {format(new Date(user.createdAt), 'MMM dd, yyyy')}</span>
              </div>
              
              {user.lastLoginAt && (
                <div className="flex items-center space-x-2 text-gray-400">
                  <Activity className={classNames.icon.sm} />
                  <span>Last seen {formatters.timeAgo(user.lastLoginAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Content with Tabs */}
      <div className="p-8 max-h-[calc(95vh-200px)] overflow-y-auto">
        <Tabs.Root defaultValue="overview">
          <Tabs.List className={classNames.tabs.list}>
            {[
              { value: 'overview', label: 'Overview', icon: User },
              { value: 'trading', label: 'Trading', icon: TrendingUp },
              { value: 'wallets', label: 'Wallets', icon: Wallet },
              { value: 'security', label: 'Security', icon: Shield },
              { value: 'activity', label: 'Activity', icon: Clock },
            ].map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={classNames.tabs.trigger}
              >
                <tab.icon className={classNames.icon.sm} />
                <span>{tab.label}</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview" className={classNames.tabs.content}>
            <div className="space-y-8">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ProfessionalModalStatsCard
                  title="Portfolio Value"
                  value={formatters.currency(totalPortfolioValue)}
                  subtitle="Total Balance"
                  icon={Wallet}
                  color="blue"
                  trend={{ value: 12.5, positive: true }}
                />
                
                <ProfessionalModalStatsCard
                  title="Total Trades"
                  value={user.tradingStats.totalTrades}
                  subtitle="All time"
                  icon={TrendingUp}
                  color="green"
                  trend={{ value: 8.3, positive: true }}
                />
                
                <ProfessionalModalStatsCard
                  title="Win Rate"
                  value={`${user.tradingStats.winRate.toFixed(1)}%`}
                  subtitle="Success ratio"
                  icon={Activity}
                  color={user.tradingStats.winRate >= 50 ? 'green' : 'red'}
                />
                
                <ProfessionalModalStatsCard
                  title="P&L"
                  value={formatters.currency(Math.abs(user.tradingStats.profitLoss))}
                  subtitle={user.tradingStats.profitLoss >= 0 ? 'Profit' : 'Loss'}
                  icon={DollarSign}
                  color={user.tradingStats.profitLoss >= 0 ? 'green' : 'red'}
                  trend={{
                    value: Math.abs(user.tradingStats.profitLoss) / 1000,
                    positive: user.tradingStats.profitLoss >= 0
                  }}
                />
              </div>

              {/* Personal Information & P2P Stats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className={`${classNames.card.base} p-6`}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-10 h-10 ${classNames.metric.iconGradient.blue} rounded-lg flex items-center justify-center`}>
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={classNames.text.h4}>Personal Information</h3>
                      <p className={classNames.text.muted}>Account details and preferences</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className={classNames.input.label}>First Name</label>
                        <p className={classNames.text.body}>{user.firstName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className={classNames.input.label}>Last Name</label>
                        <p className={classNames.text.body}>{user.lastName || 'Not provided'}</p>
                      </div>
                      <div>
                        <label className={classNames.input.label}>Username</label>
                        <p className={`${classNames.text.body} ${classNames.text.mono}`}>{user.username || 'Not set'}</p>
                      </div>
                      <div>
                        <label className={classNames.input.label}>Account Type</label>
                        <BaseStatusBadge
                          status={user.role.replace('_', ' ')}
                          variant={user.role === 'vip' ? 'warning' : 'info'}
                          size="sm"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700/50">
                      <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className={classNames.text.muted}>Member since</span>
                          <span className={classNames.text.body}>
                            {format(new Date(user.createdAt), 'MMMM dd, yyyy')}
                          </span>
                        </div>
                        
                        {user.lastLoginAt && (
                          <div className="flex items-center justify-between">
                            <span className={classNames.text.muted}>Last login</span>
                            <span className={classNames.text.body}>
                              {format(new Date(user.lastLoginAt), 'MMM dd, yyyy \'at\' HH:mm')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* P2P Statistics */}
                <div className={`${classNames.card.base} p-6`}>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`w-10 h-10 ${classNames.metric.iconGradient.green} rounded-lg flex items-center justify-center`}>
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={classNames.text.h4}>P2P Trading</h3>
                      <p className={classNames.text.muted}>Peer-to-peer trading statistics</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                        <div className={`${classNames.metric.value} text-green-400 mb-1`}>
                          {user.p2pStats.completedTrades.toLocaleString()}
                        </div>
                        <div className={classNames.text.small}>Completed Trades</div>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-800/30 rounded-lg">
                        <div className="flex items-center justify-center space-x-1 mb-1">
                          <div className={`${classNames.metric.value} text-yellow-400`}>
                            {user.p2pStats.rating.toFixed(1)}
                          </div>
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </div>
                        <div className={classNames.text.small}>Average Rating</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                        <span className={classNames.text.muted}>Total P2P Volume</span>
                        <span className={`${classNames.text.body} ${classNames.text.mono} font-semibold`}>
                          {formatters.currency(user.p2pStats.totalVolume)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-800/30 rounded-lg">
                        <span className={classNames.text.muted}>Avg Completion Time</span>
                        <span className={`${classNames.text.body} font-semibold`}>
                          {user.p2pStats.avgCompletionTime} minutes
                        </span>
                      </div>
                      
                      {/* Rating Stars */}
                      <div className="pt-2">
                        <div className="flex items-center justify-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= user.p2pStats.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                          <span className={`ml-2 ${classNames.text.small}`}>
                            ({user.p2pStats.rating.toFixed(1)}/5.0)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>

          {/* Other tabs content would continue here... */}
          <Tabs.Content value="trading" className={classNames.tabs.content}>
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={classNames.text.h4}>Trading Details</h3>
              <p className={classNames.text.muted}>
                Detailed trading history and analytics will be displayed here
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="wallets" className={classNames.tabs.content}>
            <div className="text-center py-12">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={classNames.text.h4}>Wallet Management</h3>
              <p className={classNames.text.muted}>
                User wallet balances and transaction history
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="security" className={classNames.tabs.content}>
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={classNames.text.h4}>Security Settings</h3>
              <p className={classNames.text.muted}>
                Security preferences and access controls
              </p>
            </div>
          </Tabs.Content>

          <Tabs.Content value="activity" className={classNames.tabs.content}>
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className={classNames.text.h4}>Activity Timeline</h3>
              <p className={classNames.text.muted}>
                Recent user activities and audit trail
              </p>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </>
  ) : (
    <div className="p-12 text-center">
      <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
      <h3 className={classNames.text.h4}>User Not Found</h3>
      <p className={classNames.text.muted}>
        The requested user could not be located in the system.
      </p>
    </div>
  )}
</BaseModal>
)
}
