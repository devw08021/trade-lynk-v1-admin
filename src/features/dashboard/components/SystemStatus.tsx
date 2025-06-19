import React from 'react'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { classNames } from '@/classNames'
import { CheckCircle, AlertCircle, XCircle, Clock, Activity } from 'lucide-react'

interface SystemService {
  name: string
  status: 'operational' | 'degraded' | 'outage' | 'maintenance'
  uptime: number
  responseTime: number
  description: string
}

const mockServices: SystemService[] = [
  { 
    name: 'Trading Engine', 
    status: 'operational', 
    uptime: 99.9, 
    responseTime: 45,
    description: 'Order matching and execution'
  },
  { 
    name: 'Wallet Service', 
    status: 'operational', 
    uptime: 99.8, 
    responseTime: 67,
    description: 'Deposit and withdrawal processing'
  },
  { 
    name: 'KYC Service', 
    status: 'degraded', 
    uptime: 98.5, 
    responseTime: 150,
    description: 'Identity verification system'
  },
  { 
    name: 'Notification Service', 
    status: 'operational', 
    uptime: 99.7, 
    responseTime: 23,
    description: 'Email and SMS alerts'
  },
  { 
    name: 'Analytics Service', 
    status: 'maintenance', 
    uptime: 99.2, 
    responseTime: 0,
    description: 'Data processing and reporting'
  },
]

const getStatusVariant = (status: SystemService['status']) => {
  switch (status) {
    case 'operational': return { variant: 'success' as const, icon: CheckCircle }
    case 'degraded': return { variant: 'warning' as const, icon: AlertCircle }
    case 'outage': return { variant: 'error' as const, icon: XCircle }
    case 'maintenance': return { variant: 'info' as const, icon: Clock }
    default: return { variant: 'neutral' as const, icon: AlertCircle }
  }
}

export const SystemStatus: React.FC = () => {
  const overallStatus = mockServices.every(s => s.status === 'operational') 
    ? 'operational' 
    : mockServices.some(s => s.status === 'outage') 
    ? 'outage' 
    : 'degraded'

  const overallConfig = getStatusVariant(overallStatus)
  const OverallIcon = overallConfig.icon

  return (
    <BaseCard>
      <div className="p-6">
        <div className={classNames.utils.spaceBetween}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={classNames.text.h4}>System Status</h3>
              <p className={classNames.text.muted}>Real-time service monitoring</p>
            </div>
          </div>
          
          <BaseStatusBadge
            status={overallConfig.variant.charAt(0).toUpperCase() + overallConfig.variant.slice(1)}
            variant={overallConfig.variant}
            icon={<OverallIcon className={classNames.icon.xs} />}
          />
        </div>

        <div className="mt-6 space-y-4">
          {mockServices.map((service, index) => {
            const config = getStatusVariant(service.status)
            const StatusIcon = config.icon
            
            return (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    service.status === 'operational' ? 'bg-green-500/20' :
                    service.status === 'degraded' ? 'bg-amber-500/20' :
                    service.status === 'outage' ? 'bg-red-500/20' :
                    'bg-blue-500/20'
                  }`}>
                    <StatusIcon className={`w-5 h-5 ${
                      service.status === 'operational' ? 'text-green-400' :
                      service.status === 'degraded' ? 'text-amber-400' :
                      service.status === 'outage' ? 'text-red-400' :
                      'text-blue-400'
                    }`} />
                  </div>
                  
                  <div>
                    <h4 className={classNames.text.h6}>{service.name}</h4>
                    <p className={classNames.text.small}>{service.description}</p>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <BaseStatusBadge
                    status={config.variant.charAt(0).toUpperCase() + config.variant.slice(1)}
                    variant={config.variant}
                    size="sm"
                  />
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>{service.uptime}% uptime</span>
                    {service.status !== 'maintenance' && (
                      <span>{service.responseTime}ms</span>
                    )}
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
