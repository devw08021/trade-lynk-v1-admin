import React from 'react'
import { BaseButton } from '@/components/base/BaseButton'
import { useUser, useUserAuditLog } from '@/hooks/useUsers'
import { classNames } from '@/classNames'
import { formatters } from '@/utils/formatters'

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
    AlertTriangle,
    Contact
} from 'lucide-react'
import type { User as UserType } from '@/types'

interface UserDetailModalProps {
    userId: string | null
    isOpen: boolean
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
                <div className={`flex items-center justify-center space-x-1 mt-2 text-sm font-semibold ${trend.positive ? classNames.metric.changePositive : classNames.metric.changeNegative
                    }`}>
                    <TrendingUp className={`w-4 h-4 ${trend.positive ? '' : 'rotate-180'}`} />
                    <span>{trend.positive ? '+' : ''}{trend.value.toFixed(1)}%</span>
                </div>
            )}
        </div>
    )
}

export const WalletDetails: React.FC<UserDetailModalProps> = ({
    userId,
    isOpen,
    onClose,
}) => {
    const { data: user, isLoading } = useUser(userId || '')
    const { data: auditLog } = useUserAuditLog(userId || '')

    if (!userId) return null

    const totalPortfolioValue = user?.walletBalances?.reduce((sum, balance) => sum + balance?.usdValue, 0) || 0

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


        <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className={classNames.text.h4}>WALLET Details</h3>
            <p className={classNames.text.muted}>
                Detailed trading history and analytics will be displayed here
            </p>
        </div>

    )
}
