import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { cn } from '@/classNames'
import { 
  Activity, 
  Search, 
  Filter, 
  Download, 
  ExternalLink,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  TrendingUp,
  Shield
} from 'lucide-react'
import { format } from 'date-fns'
import * as Select from '@radix-ui/react-select'
import * as Popover from '@radix-ui/react-popover'
import type { WalletTransaction } from '@/types/wallet'

interface WalletTransactionHistoryProps {
  transactions: WalletTransaction[] | null
  isLoading: boolean
}

const TransactionIcon: React.FC<{ type: WalletTransaction['type'], status: WalletTransaction['status'] }> = ({ type, status }) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'deposit': return ArrowDownLeft
      case 'withdrawal': return ArrowUpRight
      case 'internal_transfer': return RefreshCw
      case 'fee': return TrendingUp
      case 'trading': return Activity
      default: return Activity
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-500/20'
      case 'pending': return 'text-amber-400 bg-amber-500/20'
      case 'failed': return 'text-red-400 bg-red-500/20'
      case 'cancelled': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const TypeIcon = getTypeIcon()

  return (
    <div className={cn(
      'w-10 h-10 rounded-xl flex items-center justify-center',
      getStatusColor()
    )}>
      <TypeIcon className="w-5 h-5" />
    </div>
  )
}

const TransactionStatusBadge: React.FC<{ 
  status: WalletTransaction['status']
  confirmations: number
  requiredConfirmations: number
}> = ({ status, confirmations, requiredConfirmations }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'confirmed':
        return {
          label: 'Confirmed',
          color: 'text-green-400 bg-green-500/20 border-green-500/30',
          icon: CheckCircle
        }
      case 'pending':
        return {
          label: `${confirmations}/${requiredConfirmations}`,
          color: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
          icon: Clock
        }
      case 'failed':
        return {
          label: 'Failed',
          color: 'text-red-400 bg-red-500/20 border-red-500/30',
          icon: X
        }
      case 'cancelled':
        return {
          label: 'Cancelled',
          color: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
          icon: X
        }
      default:
        return {
          label: 'Unknown',
          color: 'text-gray-400 bg-gray-500/20 border-gray-500/30',
          icon: AlertTriangle
        }
    }
  }

  const config = getStatusConfig()
  const StatusIcon = config.icon

  return (
    <div className={cn(
      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border',
      config.color
    )}>
      <StatusIcon className="w-3 h-3 mr-1" />
      {config.label}
    </div>
  )
}

const RiskScoreIndicator: React.FC<{ score?: number }> = ({ score }) => {
  if (!score) return null

  const getRiskLevel = () => {
    if (score >= 80) return { level: 'High', color: 'text-red-400 bg-red-500/20', icon: AlertTriangle }
    if (score >= 50) return { level: 'Medium', color: 'text-amber-400 bg-amber-500/20', icon: AlertTriangle }
    return { level: 'Low', color: 'text-green-400 bg-green-500/20', icon: Shield }
  }

  const risk = getRiskLevel()
  const RiskIcon = risk.icon

  return (
    <div className={cn(
      'inline-flex items-center px-2 py-1 rounded text-xs font-medium',
      risk.color
    )}>
      <RiskIcon className="w-3 h-3 mr-1" />
      {risk.level}
    </div>
  )
}

export const WalletTransactionHistory: React.FC<WalletTransactionHistoryProps> = ({ 
  transactions, 
  isLoading 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string>('all')
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [assetFilter, setAssetFilter] = React.useState<string>('all')

  const formatCrypto = (amount: string, asset: string) => {
    const num = parseFloat(amount)
    const decimals = asset === 'BTC' ? 8 : asset === 'ETH' ? 6 : 4
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: decimals
    })
  }

  const formatAddress = (address: string) => {
    if (!address) return 'N/A'
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const filteredTransactions = React.useMemo(() => {
    if (!transactions) return []

    return transactions.filter(tx => {
      const matchesSearch = 
        tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.asset.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = typeFilter === 'all' || tx.type === typeFilter
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter
      const matchesAsset = assetFilter === 'all' || tx.asset === assetFilter

      return matchesSearch && matchesType && matchesStatus && matchesAsset
    })
  }, [transactions, searchTerm, typeFilter, statusFilter, assetFilter])

  // Get unique assets for filter
  const uniqueAssets = React.useMemo(() => {
    if (!transactions) return []
    return [...new Set(transactions.map(tx => tx.asset))].sort()
  }, [transactions])

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-700/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-br from-gray-800 to-gray-850 border-gray-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl text-gray-100">Transaction History</span>
              <p className="text-sm text-gray-400 mt-1">
                {filteredTransactions.length} of {transactions?.length || 0} transactions
              </p>
            </div>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mt-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by hash, user, or asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Type Filter */}
          <Select.Root value={typeFilter} onValueChange={setTypeFilter}>
            <Select.Trigger className="w-40 flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm">
              <Select.Value placeholder="All Types" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <Select.Viewport className="p-1">
                  <Select.Item value="all" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>All Types</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="deposit" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>Deposits</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="withdrawal" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>Withdrawals</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="trading" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>Trading</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="fee" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>Fees</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {/* Status Filter */}
          <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger className="w-40 flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm">
              <Select.Value placeholder="All Status" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <Select.Viewport className="p-1">
                  <Select.Item value="all" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>All Status</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="confirmed" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>Confirmed</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="pending" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>Pending</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="failed" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>Failed</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          {/* Asset Filter */}
          <Select.Root value={assetFilter} onValueChange={setAssetFilter}>
            <Select.Trigger className="w-32 flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm">
              <Select.Value placeholder="All Assets" />
              <Select.Icon />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                <Select.Viewport className="p-1">
                  <Select.Item value="all" className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded">
                    <Select.ItemText>All Assets</Select.ItemText>
                  </Select.Item>
                  {uniqueAssets.map((asset) => (
                    <Select.Item 
                      key={asset} 
                      value={asset} 
                      className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded"
                    >
                      <Select.ItemText>{asset}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">No Transactions Found</h3>
            <p className="text-gray-400">
              {transactions?.length === 0 
                ? 'No transactions have been recorded yet' 
                : 'Try adjusting your search filters'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700/50 hover:bg-transparent">
                  <TableHead className="text-gray-300 font-semibold">Transaction</TableHead>
                  <TableHead className="text-gray-300 font-semibold">User</TableHead>
                  <TableHead className="text-gray-300 font-semibold text-right">Amount</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Addresses</TableHead>
                  <TableHead className="text-gray-300 font-semibold text-center">Status</TableHead>
                  <TableHead className="text-gray-300 font-semibold text-center">Risk</TableHead>
                  <TableHead className="text-gray-300 font-semibold">Date</TableHead>
                  <TableHead className="text-gray-300 font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id} 
                    className={cn(
                      'border-gray-700/30 hover:bg-gray-700/20 transition-all duration-200 group',
                      transaction.flagged && 'bg-red-900/10 border-red-500/20'
                    )}
                  >
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-4">
                        <TransactionIcon type={transaction.type} status={transaction.status} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-100 capitalize">
                              {transaction.type.replace('_', ' ')}
                            </span>
                            <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded uppercase font-bold">
                              {transaction.asset}
                            </span>
                            {transaction.flagged && (
                              <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400 font-mono">
                            {formatAddress(transaction.txHash)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {transaction.userEmail ? (
                        <div>
                          <div className="font-medium text-gray-100">
                            {transaction.userEmail}
                          </div>
                          <div className="text-sm text-gray-400">
                            ID: {transaction.userId?.slice(0, 8)}...
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">System</span>
                      )}
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="space-y-1">
                        <div className={cn(
                          'font-mono font-semibold text-lg',
                          transaction.type === 'deposit' ? 'text-green-400' : 
                          transaction.type === 'withdrawal' ? 'text-red-400' : 'text-gray-100'
                        )}>
                          {transaction.type === 'deposit' ? '+' : 
                           transaction.type === 'withdrawal' ? '-' : ''}
                          {formatCrypto(transaction.amount, transaction.asset)}
                        </div>
                        {parseFloat(transaction.fee) > 0 && (
                          <div className="text-sm text-gray-400">
                            Fee: {formatCrypto(transaction.fee, transaction.asset)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {transaction.fromAddress && (
                          <div>
                            <span className="text-gray-400">From: </span>
                            <span className="font-mono text-gray-300">
                              {formatAddress(transaction.fromAddress)}
                            </span>
                          </div>
                        )}
                        {transaction.toAddress && (
                          <div>
                            <span className="text-gray-400">To: </span>
                            <span className="font-mono text-gray-300">
                              {formatAddress(transaction.toAddress)}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <TransactionStatusBadge
                        status={transaction.status}
                        confirmations={transaction.confirmations}
                        requiredConfirmations={transaction.requiredConfirmations}
                      />
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <RiskScoreIndicator score={transaction.risk_score} />
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-100">
                          {format(new Date(transaction.createdAt), 'MMM dd, yyyy')}
                        </div>
                        <div className="text-gray-400">
                          {format(new Date(transaction.createdAt), 'HH:mm:ss')}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="hover:bg-gray-600/50"
                          onClick={() => window.open(`https://blockexplorer.com/tx/${transaction.txHash}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        {transaction.flagged && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-red-600/20 text-red-400"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
