export const APP_CONFIG = {
    name: 'CryptoAdmin',
    version: '1.0.0',
    description: 'crypto exchange admin panel',
    author: 'Crypto Exchange Team',
    repository: '...',
  } as const
  
  export const API_ENDPOINTS = {
    auth: {
      login: '/auth/login',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      profile: '/auth/profile',
    },
    admin: {
      dashboard: '/admin/dashboard',
      users: '/admin/users',
      wallets: '/admin/wallets',
      trades: '/admin/trades',
      kyc: '/admin/kyc',
      audit: '/admin/audit',
      settings: '/admin/settings',
    },
  } as const
  
  export const PAGINATION_LIMITS = [10, 20, 50, 100] as const
  
  export const DATE_FORMATS = {
    short: 'MMM dd, yyyy',
    long: 'MMMM dd, yyyy',
    dateTime: 'MMM dd, yyyy HH:mm',
    time: 'HH:mm:ss',
    iso: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  } as const
  
  export const CHART_COLORS = {
    primary: 'hsl(217, 91%, 60%)',
    success: 'hsl(142, 76%, 36%)',
    danger: 'hsl(0, 84%, 60%)',
    warning: 'hsl(48, 96%, 53%)',
    info: 'hsl(271, 81%, 56%)',
  } as const
  
  export const CURRENCY_SYMBOLS = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    BTC: '₿',
    ETH: 'Ξ',
  } as const
  
  export const REGEX_PATTERNS = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    cryptoAddress: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^0x[a-fA-F0-9]{40}$/,
  } as const
  