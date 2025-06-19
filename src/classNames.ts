import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const classNames = {
  // === LAYOUTS ===
  layout: {
    page: 'space-y-4 p-6',
    pageHeader: 'flex items-center justify-between',
    pageTitle: 'text-3xl font-bold bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 bg-clip-text text-transparent',
    pageSubtitle: 'text-gray-400 mt-2',
    pageActions: 'flex items-center space-x-3',
    container: 'mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-6 lg:py-8',
    grid: {
      responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
      auto: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      metrics: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6',
    //   dashboard: 'grid grid-cols-1 xl:grid-cols-3 gap-8',
      dashboard: 'grid gap-8',
      sidebar: 'grid grid-cols-1 lg:grid-cols-2 gap-8',
    },
  },

  // === CARDS & CONTAINERS ===
  card: {
    base: 'bg-gradient-to-br from-gray-800 to-gray-850 border border-gray-700/50 rounded-xl shadow-2xl backdrop-blur-sm',
    interactive: 'hover:from-gray-750 hover:to-gray-800 transition-all duration-300 hover:shadow-xl hover:border-gray-600/50 cursor-pointer',
    glass: 'bg-gray-800/30 backdrop-blur-md border border-gray-700/30 rounded-xl',
    premium: 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-xl',
    success: 'bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/20 rounded-xl',
    warning: 'bg-gradient-to-br from-amber-900/20 to-amber-800/20 border border-amber-500/20 rounded-xl',
    danger: 'bg-gradient-to-br from-red-900/20 to-red-800/20 border border-red-500/20 rounded-xl',
    padding: {
      none: 'p-0',
      sm: 'p-4',
      default: 'p-6',
      lg: 'p-8',
    },
    header: 'flex flex-col space-y-1.5 pb-6',
    content: 'pt-0',
    title: 'text-xl font-semibold text-gray-100',
    subtitle: 'text-sm text-gray-400 mt-1',
  },

  // === BUTTONS ===
  button: {
    base: 'inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 active:transform active:scale-[0.98]',
    variants: {
      primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-500/25',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100 border border-gray-600 hover:border-gray-500',
      ghost: 'hover:bg-gray-700/50 text-gray-300 hover:text-gray-100',
      destructive: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white shadow-lg hover:shadow-red-500/25',
      success: 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white shadow-lg hover:shadow-green-500/25',
      warning: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-lg hover:shadow-amber-500/25',
    },
    sizes: {
      xs: 'h-7 px-2 text-xs',
      sm: 'h-8 px-3 text-xs',
      default: 'h-10 px-4 py-2',
      lg: 'h-12 px-6 text-base',
      xl: 'h-14 px-8 text-lg',
      icon: {
        xs: 'h-7 w-7',
        sm: 'h-8 w-8',
        default: 'h-10 w-10',
        lg: 'h-12 w-12',
        xl: 'h-14 w-14',
      },
    },
    loading: 'cursor-wait opacity-70',
    iconSpacing: 'mr-2',
  },

  // === FORM ELEMENTS ===
  input: {
    base: 'flex h-10 w-full rounded-lg border border-gray-600 bg-gray-800/50 px-3 py-2 text-sm text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-sm transition-all duration-200',
    sizes: {
      sm: 'h-8 px-2 text-xs',
      default: 'h-10 px-3 text-sm',
      lg: 'h-12 px-4 text-base',
    },
    states: {
      error: 'border-red-500 focus:ring-red-500 bg-red-900/10',
      success: 'border-green-500 focus:ring-green-500 bg-green-900/10',
      warning: 'border-amber-500 focus:ring-amber-500 bg-amber-900/10',
    },
    label: 'text-sm font-medium text-gray-300 uppercase tracking-wider mb-2 block',
    helper: 'text-sm mt-1',
    helperError: 'text-sm mt-1 text-red-400',
    helperSuccess: 'text-sm mt-1 text-green-400',
  },

  // === TABLES ===
  table: {
    container: 'relative w-full overflow-auto rounded-xl border border-gray-700/50',
    table: 'w-full caption-bottom text-sm',
    header: 'border-b border-gray-700 bg-gray-800/80 backdrop-blur-sm',
    headerCell: 'h-14 px-6 text-left align-middle font-semibold text-gray-300 tracking-wide uppercase text-xs',
    body: '[&_tr:last-child]:border-0',
    row: 'border-b border-gray-700/30 transition-all duration-200 hover:bg-gray-800/40 cursor-pointer data-[state=selected]:bg-gray-700/50',
    cell: 'px-6 py-4 align-middle',
    cellNumeric: 'px-6 py-4 align-middle text-right font-mono',
    loading: 'animate-pulse bg-gray-700/30 rounded h-16',
    empty: 'text-center py-12 text-gray-400',
  },

  // === STATUS SYSTEM ===
  status: {
    base: 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition-all duration-200 hover:scale-105',
    variants: {
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    sizes: {
      sm: 'px-2 py-0.5 text-xs',
      default: 'px-3 py-1 text-xs',
      lg: 'px-4 py-2 text-sm',
    },
    withIcon: 'pl-2',
    iconSpacing: 'mr-1.5',
    pulse: 'animate-pulse',
  },

  // === METRICS & STATS ===
  metric: {
    card: 'bg-gradient-to-br border trading-card group relative overflow-hidden',
    content: 'p-6 relative z-10',
    header: 'flex items-center space-x-2 mb-3',
    title: 'text-sm font-medium text-gray-400 uppercase tracking-wider',
    subtitle: 'text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded',
    value: 'text-3xl font-bold font-mono text-gray-100 tracking-tight mb-2',
    change: 'flex items-center space-x-1 text-sm font-semibold',
    changePositive: 'text-green-400',
    changeNegative: 'text-red-400',
    changeNeutral: 'text-gray-400',
    icon: 'w-14 h-14 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110',
    iconGradient: {
      blue: 'bg-gradient-to-br from-blue-500 to-blue-600',
      green: 'bg-gradient-to-br from-green-500 to-green-600',
      red: 'bg-gradient-to-br from-red-500 to-red-600',
      amber: 'bg-gradient-to-br from-amber-500 to-amber-600',
      purple: 'bg-gradient-to-br from-purple-500 to-purple-600',
      indigo: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
    },
    cardGradient: {
      blue: 'from-blue-900/20 to-blue-800/20 border-blue-500/30',
      green: 'from-green-900/20 to-green-800/20 border-green-500/30',
      red: 'from-red-900/20 to-red-800/20 border-red-500/30',
      amber: 'from-amber-900/20 to-amber-800/20 border-amber-500/30',
      purple: 'from-purple-900/20 to-purple-800/20 border-purple-500/30',
      indigo: 'from-indigo-900/20 to-indigo-800/20 border-indigo-500/30',
    },
  },

  // === TYPOGRAPHY ===
  text: {
    h1: 'text-4xl font-bold tracking-tight text-gray-100',
    h2: 'text-3xl font-bold tracking-tight text-gray-100',
    h3: 'text-2xl font-semibold text-gray-100',
    h4: 'text-xl font-semibold text-gray-100',
    h5: 'text-lg font-semibold text-gray-200',
    h6: 'text-base font-semibold text-gray-200',
    body: 'text-gray-200',
    bodyLarge: 'text-lg text-gray-200',
    muted: 'text-gray-400',
    small: 'text-sm text-gray-500',
    xs: 'text-xs text-gray-500',
    caption: 'text-xs text-gray-500 uppercase tracking-wider font-medium',
    gradient: 'bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent',
    gradientBlue: 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent',
    mono: 'font-mono',
    numeric: 'font-variant-numeric: tabular-nums font-feature-settings: "tnum"',
  },

  // === LOADING STATES ===
  loading: {
    spinner: 'animate-spin rounded-full border-2 border-gray-600 border-t-blue-500',
    skeleton: 'animate-pulse bg-gradient-to-r from-gray-800 to-gray-700 rounded',
    shimmer: 'bg-gradient-to-r from-gray-800/50 via-gray-700/80 to-gray-800/50 bg-[length:200%_100%] animate-[shimmer_2s_infinite]',
    pulse: 'animate-pulse',
    sizes: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      default: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    },
  },

  // === ANIMATIONS ===
  animation: {
    fadeIn: 'animate-in fade-in duration-500',
    slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
    slideDown: 'animate-in slide-in-from-top-4 duration-300',
    slideLeft: 'animate-in slide-in-from-right-4 duration-300',
    slideRight: 'animate-in slide-in-from-left-4 duration-300',
    scaleIn: 'animate-in zoom-in-95 duration-200',
    glow: 'animate-pulse shadow-lg shadow-blue-500/20',
    bounce: 'animate-bounce',
    spin: 'animate-spin',
    ping: 'animate-ping',
    pulse: 'animate-pulse',
  },

  // === TRADING SPECIFIC ===
  trading: {
    pricePositive: 'text-green-400 font-semibold',
    priceNegative: 'text-red-400 font-semibold',
    priceNeutral: 'text-gray-400 font-semibold',
    volumeBar: 'w-full bg-gray-700 rounded-full h-2 overflow-hidden',
    volumeBarFill: 'h-full transition-all duration-300',
    pair: 'font-semibold text-gray-100 text-lg',
    symbol: 'text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded uppercase font-bold',
    change: {
      positive: 'flex items-center space-x-1 text-green-400 font-semibold',
      negative: 'flex items-center space-x-1 text-red-400 font-semibold',
      neutral: 'flex items-center space-x-1 text-gray-400 font-semibold',
    },
    badge: {
      long: 'bg-green-500/20 text-green-400 border border-green-500/30',
      short: 'bg-red-500/20 text-red-400 border border-red-500/30',
      spot: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      futures: 'bg-purple-500/20 text-purple-400 border border-purple-500/30',
    },
  },

  // === ALERTS & NOTIFICATIONS ===
  alert: {
    base: 'p-4 rounded-lg border flex items-start space-x-3',
    variants: {
      info: 'bg-blue-900/20 border-blue-500/30 text-blue-400',
      success: 'bg-green-900/20 border-green-500/30 text-green-400',
      warning: 'bg-amber-900/20 border-amber-500/30 text-amber-400',
      error: 'bg-red-900/20 border-red-500/30 text-red-400',
    },
    icon: 'w-5 h-5 flex-shrink-0 mt-0.5',
    content: 'flex-1 min-w-0',
    title: 'font-semibold mb-1',
    message: 'text-sm opacity-90',
    dismiss: 'ml-auto flex-shrink-0',
  },

  // === MODAL & OVERLAY ===
  modal: {
    overlay: 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in duration-300',
    content: 'fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in zoom-in-95 duration-300',
    header: 'flex items-center justify-between p-8 border-b border-gray-700/50 bg-gradient-to-r from-gray-800/90 to-gray-850/90 backdrop-blur',
    body: 'overflow-y-auto',
    footer: 'flex items-center justify-end space-x-3 p-6 border-t border-gray-700/50 bg-gray-800/50',
    sizes: {
      sm: 'w-full max-w-md max-h-[80vh]',
      default: 'w-full max-w-2xl max-h-[90vh]',
      lg: 'w-full max-w-4xl max-h-[90vh]',
      xl: 'w-full max-w-6xl max-h-[95vh]',
      full: 'w-full max-w-7xl max-h-[95vh]',
    },
  },

  // === TABS ===
  tabs: {
    list: 'flex space-x-8 px-6 border-b border-gray-700/50 bg-gray-800/30',
    trigger: 'flex items-center space-x-2 px-4 py-4 text-sm font-medium text-gray-400 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 hover:text-gray-200 transition-all',
    content: 'p-6',
    badge: 'ml-2 px-2 py-1 text-xs rounded-full font-bold',
  },

  // === DROPDOWN & SELECT ===
  dropdown: {
    trigger: 'flex items-center justify-between px-3 py-2 bg-gray-800 border border-gray-600 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
    content: 'bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-2 z-50 min-w-[160px]',
    item: 'flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-700 rounded-lg transition-colors text-gray-200',
    separator: 'h-px bg-gray-700 my-2',
    label: 'px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider',
  },

  // === FILTERS & SEARCH ===
  filter: {
    container: 'flex items-center space-x-4',
    search: 'relative flex-1 max-w-md',
    searchIcon: 'absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400',
    searchInput: 'pl-10 w-full',
    badge: 'px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-400 font-semibold',
    clear: 'text-red-400 hover:text-red-300 text-sm font-medium transition-colors',
  },

  // === PAGINATION ===
  pagination: {
    container: 'flex items-center justify-between p-6 bg-gradient-to-r from-gray-800/50 to-gray-850/50 rounded-xl border border-gray-700/30',
    info: 'flex items-center space-x-4 text-sm text-gray-400',
    controls: 'flex items-center space-x-1',
    button: 'min-w-[40px] h-10 hover:bg-gray-700/50 text-gray-300',
    buttonActive: 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg',
    select: 'px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
    jump: 'flex items-center space-x-2',
    jumpInput: 'w-16 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-gray-100 text-center focus:outline-none focus:ring-2 focus:ring-blue-500',
  },

  // === ICONS & AVATARS ===
  icon: {
    sizes: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      default: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
      '2xl': 'w-10 h-10',
      '3xl': 'w-12 h-12',
    },
    spacing: {
      left: 'mr-2',
      right: 'ml-2',
    },
  },
  avatar: {
    base: 'rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
    sizes: {
      sm: 'w-8 h-8 text-xs',
      default: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-20 h-20 text-2xl',
    },
    gradients: {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      amber: 'from-amber-500 to-amber-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-yellow-500',
      gray: 'from-gray-500 to-gray-600',
    },
  },

  // === UTILITY CLASSES ===
  utils: {
    truncate: 'truncate',
    srOnly: 'sr-only',
    visuallyHidden: 'absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0',
    centerContent: 'flex items-center justify-center',
    spaceBetween: 'flex items-center justify-between',
    fullWidth: 'w-full',
    fullHeight: 'h-full',
    aspectSquare: 'aspect-square',
    aspectVideo: 'aspect-video',
    shadow: {
      sm: 'shadow-sm',
      default: 'shadow',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl',
      '2xl': 'shadow-2xl',
      professional: 'shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04),0_0_0_1px_rgba(59,130,246,0.05)]',
      glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    },
  },

  // === RESPONSIVE UTILITIES ===
  responsive: {
    show: {
      sm: 'hidden sm:block',
      md: 'hidden md:block',
      lg: 'hidden lg:block',
      xl: 'hidden xl:block',
    },
    hide: {
      sm: 'sm:hidden',
      md: 'md:hidden',
      lg: 'lg:hidden',
      xl: 'xl:hidden',
    },
    grid: {
      responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      auto: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      fill: 'grid-cols-[repeat(auto-fill,minmax(300px,1fr))]',
      fit: 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]',
    },
  },
} as const

// === COMPONENT VARIANTS ===
export const variants = {
  colors: ['blue', 'green', 'red', 'amber', 'purple', 'indigo', 'gray'] as const,
  sizes: ['xs', 'sm', 'default', 'lg', 'xl'] as const,
  priorities: ['low', 'medium', 'high', 'critical'] as const,
  statuses: ['success', 'warning', 'error', 'info', 'neutral'] as const,
} as const

// === UTILITY FUNCTIONS ===
export const getColorClasses = (color: typeof variants.colors[number]) => ({
  bg: `from-${color}-900/20 to-${color}-800/20`,
  border: `border-${color}-500/30`,
  text: `text-${color}-400`,
  icon: `text-${color}-400`,
  gradient: `from-${color}-500 to-${color}-600`,
})

export const conditional = {
  show: (condition: boolean) => condition ? 'block' : 'hidden',
  hide: (condition: boolean) => condition ? 'hidden' : 'block',
  apply: (condition: boolean, classes: string) => condition ? classes : '',
}

export { formatters } from '@/utils/formatters'