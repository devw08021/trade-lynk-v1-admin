import React from 'react'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import type { KYCStatus, UserStatus } from '@/types'

interface StatusBadgeProps {
  status: KYCStatus | UserStatus | string
  className?: string
  showIcon?: boolean
  size?: 'sm' | 'default' | 'lg'
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  showIcon = true,
  size = 'default',
}) => {
  const getVariant = (status: string) => {
    // KYC Status
    if (['approved', 'active'].includes(status)) return 'success'
    if (['pending', 'suspended'].includes(status)) return 'warning'
    if (['rejected', 'expired', 'banned'].includes(status)) return 'error'
    if (['pending_verification'].includes(status)) return 'info'
    return 'neutral'
  }

  return (
    <BaseStatusBadge
      status={status.replace('_', ' ')}
      variant={getVariant(status)}
      size={size}
      className={className}
    />
  )
}
