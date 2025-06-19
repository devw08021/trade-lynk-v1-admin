export const formatters = {
    // Currency formatting
    currency: (amount: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        ...options,
      }).format(amount)
    },
  
    // Crypto formatting with dynamic decimals
    crypto: (amount: string | number, asset: string) => {
      const num = typeof amount === 'string' ? parseFloat(amount) : amount
      const decimals = getCryptoDecimals(asset)
      return num.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals
      })
    },
  
    // Percentage formatting
    percentage: (value: number, decimals = 1) => {
      return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
    },
  
    // Large number formatting (K, M, B)
    compact: (num: number) => {
      return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(num)
    },
  
    // Address formatting
    address: (address: string, start = 6, end = 4) => {
      if (!address) return 'N/A'
      return `${address.slice(0, start)}...${address.slice(-end)}`
    },
  
    // Time formatting
    timeAgo: (date: string | Date) => {
      const now = new Date()
      const past = new Date(date)
      const diff = now.getTime() - past.getTime()
      
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      
      if (days > 0) return `${days}d ago`
      if (hours > 0) return `${hours}h ago`
      if (minutes > 0) return `${minutes}m ago`
      return `${seconds}s ago`
    },
  
    // Duration formatting
    duration: (seconds: number) => {
      if (seconds < 60) return `${seconds}s`
      if (seconds < 3600) return `${Math.round(seconds / 60)}m`
      return `${Math.round(seconds / 3600)}h`
    },
  }
  
  // Helper function for crypto decimals
  const getCryptoDecimals = (asset: string): number => {
    const decimalsMap: Record<string, number> = {
      'BTC': 8,
      'ETH': 6,
      'USDT': 2,
      'USDC': 2,
      'BNB': 4,
      'ADA': 6,
      'SOL': 4,
      'DOT': 4,
      'AVAX': 4,
    }
    return decimalsMap[asset.toUpperCase()] || 4
  }
  