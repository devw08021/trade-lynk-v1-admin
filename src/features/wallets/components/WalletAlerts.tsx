import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { cn } from '@/classNames'
import { 
  AlertTriangle, 
  Shield, 
  Activity, 
  Zap, 
  CheckCircle,
  X,
  Clock,
  TrendingDown,
  Wallet
} from 'lucide-react'
import { format } from 'date-fns'
import type { WalletAlert } from '@/types/wallet'

interface WalletAlertsProps {
  alerts: WalletAlert[] | null
  isLoading: boolean
}

const AlertIcon: React.FC<{ type: WalletAlert['type'], severity: WalletAlert['severity'] }> = ({ type, severity }) => {
  const getIcon = () => {
    switch (type) {
      case 'low_balance': return TrendingDown
      case 'high_volume': return Activity
      case 'suspicious_activity': return Shield
      case 'maintenance_required': return Zap
      default: return AlertTriangle
    }
  }

  const getColor = () => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/20'
      case 'high': return 'text-orange-400 bg-orange-500/20'
      case 'medium': return 'text-amber-400 bg-amber-500/20'
      case 'low': return 'text-blue-400 bg-blue-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const IconComponent = getIcon()

  return (
    <div className={cn(
      'w-12 h-12 rounded-xl flex items-center justify-center',
      getColor()
    )}>
      <IconComponent className="w-6 h-6" />
    </div>
  )
}

const AlertPriorityBadge: React.FC<{ severity: WalletAlert['severity'] }> = ({ severity }) => {
  const config = {
    critical: { label: 'CRITICAL', color: 'bg-red-500/20 text-red-400 border-red-500/30', pulse: true },
    high: { label: 'HIGH', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', pulse: false },
    medium: { label: 'MEDIUM', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', pulse: false },
    low: { label: 'LOW', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', pulse: false },
  }

  const severityConfig = config[severity]

  return (
    <div className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border',
      severityConfig.color,
      severityConfig.pulse && 'animate-pulse'
    )}>
      {severityConfig.label}
    </div>
  )
}

export const WalletAlerts: React.FC<WalletAlertsProps> = ({ alerts, isLoading }) => {
  const [acknowledgedAlerts, setAcknowledgedAlerts] = React.useState<Set<string>>(new Set())

  const handleAcknowledge = (alertId: string) => {
    setAcknowledgedAlerts(prev => new Set([...prev, alertId]))
    // Here you would make an API call to acknowledge the alert
    console.log('Acknowledging alert:', alertId)
  }

  const handleDismiss = (alertId: string) => {
    // Here you would make an API call to dismiss the alert
    console.log('Dismissing alert:', alertId)
  }

  const sortedAlerts = React.useMemo(() => {
    if (!alerts) return []
    
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    
    return [...alerts].sort((a, b) => {
      // First by acknowledged status
      if (a.acknowledged !== b.acknowledged) {
        return a.acknowledged ? 1 : -1
      }
      // Then by severity
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity]
      }
      // Finally by date (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [alerts])

  const alertStats = React.useMemo(() => {
    if (!alerts) return { total: 0, critical: 0, unacknowledged: 0 }
    
    return {
      total: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      unacknowledged: alerts.filter(a => !a.acknowledged).length,
    }
  }, [alerts])

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-700/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

return (
    <div className="space-y-6">
      {/* Alert Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/20 border-blue-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {alertStats.total}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">
              Total Alerts
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-red-400 mb-2">
              {alertStats.critical}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">
              Critical Alerts
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-900/20 to-amber-800/20 border-amber-500/30">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-amber-400 mb-2">
              {alertStats.unacknowledged}
            </div>
            <div className="text-sm text-gray-400 uppercase tracking-wider">
              Unacknowledged
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700/50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl text-gray-100">System Alerts</span>
              <p className="text-sm text-gray-400 mt-1">
                Monitor wallet health and security events
              </p>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          {sortedAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">All Clear!</h3>
              <p className="text-gray-400">No active alerts at this time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAlerts.map((alert) => {
                const isLocallyAcknowledged = acknowledgedAlerts.has(alert.id)
                const isAcknowledged = alert.acknowledged || isLocallyAcknowledged

                return (
                  <div
                    key={alert.id}
                    className={cn(
                      'p-6 rounded-xl border transition-all duration-200',
                      isAcknowledged 
                        ? 'bg-gray-800/30 border-gray-700/30 opacity-60' 
                        : alert.severity === 'critical'
                        ? 'bg-red-900/10 border-red-500/30 shadow-lg shadow-red-500/10'
                        : alert.severity === 'high'
                        ? 'bg-orange-900/10 border-orange-500/30'
                        : alert.severity === 'medium'
                        ? 'bg-amber-900/10 border-amber-500/30'
                        : 'bg-blue-900/10 border-blue-500/30'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <AlertIcon type={alert.type} severity={alert.severity} />
                        
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center space-x-3">
                            <AlertPriorityBadge severity={alert.severity} />
                            <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded uppercase font-bold">
                              {alert.asset}
                            </span>
                            <span className="text-xs text-gray-400">
                              {format(new Date(alert.createdAt), 'MMM dd, HH:mm')}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-100 mb-2 text-lg">
                              {alert.message}
                            </h4>
                            
                            {alert.threshold && alert.currentValue && (
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-gray-400">Threshold: </span>
                                  <span className="font-mono text-gray-100">{alert.threshold}</span>
                                </div>
                                <div>
                                  <span className="text-gray-400">Current: </span>
                                  <span className="font-mono text-gray-100">{alert.currentValue}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {isAcknowledged && (
                            <div className="flex items-center space-x-2 text-sm text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span>
                                Acknowledged {alert.acknowledgedAt 
                                  ? format(new Date(alert.acknowledgedAt), 'MMM dd, HH:mm')
                                  : 'just now'
                                }
                                {alert.acknowledgedBy && ` by ${alert.acknowledgedBy}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!isAcknowledged && (
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAcknowledge(alert.id)}
                            className="text-green-400 hover:bg-green-500/20"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Acknowledge
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDismiss(alert.id)}
                            className="text-red-400 hover:bg-red-500/20"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
