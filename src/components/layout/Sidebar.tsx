import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { classNames } from '@/classNames'
import { usePermissions } from '@/hooks/usePermissions'
import {
  LayoutDashboard,
  Users,
  Wallet,
  TrendingUp,
  Settings,
  Shield,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Zap,
  Coins
} from 'lucide-react'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  {
    title: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
    permissions: ['system.view'],
    badge: null,
  },
  {
    title: 'User Management',
    href: '/users',
    icon: Users,
    permissions: ['users.view'],
    badge: '2.4k',
    badgeVariant: 'info' as const,
    children: [
      {
        title: 'User List',
        href: '/users/list',
      },
      {
        title: 'Balance List',
        href: '/users/balances',
      },
      {
        title: 'Activity Logs',
        href: '/users/logs',
      },
    ],
  },
  {
    title: 'Wallet Control',
    href: '/wallets',
    icon: Wallet,
    permissions: ['wallets.view'],
    badge: null,
  },
  {
    title: 'Trading Engine',
    href: '/trading',
    icon: TrendingUp,
    permissions: ['trades.view'],
    badge: 'LIVE',
    badgeVariant: 'success' as const,
  },
  {
    title: 'P2P Management',
    href: '/p2p',
    icon: Users,
    permissions: ['p2p.view'],
    badge: '2.4k',
    badgeVariant: 'info' as const,
    children: [
      {
        title: 'Pair List',
        href: '/p2p/pairs',
      },
      {
        title: 'Ads List',
        href: '/p2p/ads',
      },
      {
        title: 'Order List',
        href: '/p2p/orders',
      },
      {
        title: 'Dispute List',
        href: '/p2p/disputes',
      },
    ],
  },
  {
    title: 'Analytics Hub',
    href: '/analytics',
    icon: BarChart3,
    permissions: ['system.view'],
    badge: null,
  },
  {
    title: 'KYC Center',
    href: '/kyc',
    icon: Shield,
    permissions: ['users.view'],
    badge: '24',
    badgeVariant: 'warning' as const,
  },
  {
    title: 'Audit Trail',
    href: '/audit',
    icon: FileText,
    permissions: ['admin.logs'],
    badge: null,
  },
  {
    title: 'Coin  Management',
    href: '/coins',
    icon: Coins,
    permissions: ['coins.view'],
    badge: '2.4k',
    badgeVariant: 'info' as const,  
    children: [
      {
        title: 'Coin List',
        href: '/coins/list',
      },  
    ],
  },

  {
    title: 'System Config',
    href: '/settings',
    icon: Settings,
    permissions: ['system.edit'],
    badge: null,
  },
]

const SystemStatus: React.FC<{ collapsed: boolean }> = ({ collapsed }) => {
  const [status] = React.useState({
    uptime: 99.99,
    latency: 45,
    activeConnections: 8934,
  })

  if (collapsed) {
    return (
      <div className="px-2 py-3">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <div className={`${classNames.text.xs} ${classNames.text.mono}`}>{status.latency}ms</div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${classNames.card.base} mx-3 mb-4 p-3`}>
      <div className={classNames.utils.spaceBetween}>
        <span className={classNames.text.caption}>System</span>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <BaseStatusBadge status="ONLINE" variant="success" size="sm" />
        </div>
      </div>

      <div className="space-y-2 text-xs mt-3">
        <div className={classNames.utils.spaceBetween}>
          <span className={classNames.text.muted}>Uptime</span>
          <span className={`${classNames.text.body} ${classNames.text.mono}`}>
            {status.uptime}%
          </span>
        </div>
        <div className={classNames.utils.spaceBetween}>
          <span className={classNames.text.muted}>Latency</span>
          <span className={`${classNames.text.body} ${classNames.text.mono}`}>
            {status.latency}ms
          </span>
        </div>
        <div className={classNames.utils.spaceBetween}>
          <span className={classNames.text.muted}>Active</span>
          <span className={`${classNames.trading.pricePositive} ${classNames.text.mono}`}>
            {status.activeConnections.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation()
  const { hasAnyPermission } = usePermissions()

  // const filteredItems = navigationItems.filter(item =>
  //   hasAnyPermission(item.permissions)
  // )
  // #FORNOW
  const filteredItems = navigationItems
  return (
    <aside
      className={`
    ${classNames.layout.sidebar}
    relative flex flex-col transition-all duration-300 ease-in-out
    ${collapsed ? 'w-20' : 'w-72'}
  `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div
              className={`w-10 h-10 ${classNames.metric.iconGradient.blue} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={classNames.text.gradientBlue}>TradeLynk</h1>
              <p className={classNames.text.caption}>Admin Console</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-700 transition-colors group"
        >
          {collapsed ? (
            <ChevronRight
              className={`${classNames.icon.sm} text-gray-400 group-hover:text-gray-100`}
            />
          ) : (
            <ChevronLeft
              className={`${classNames.icon.sm} text-gray-400 group-hover:text-gray-100`}
            />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {filteredItems.map(item => {
          const isActive = location.pathname.startsWith(item.href)

          return (
            <div key={item.href}>
              <Link
                to={item.href}
                className={`
          group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative
          ${isActive
                    ? `${classNames.button.variants.primary} shadow-lg`
                    : 'text-gray-400 hover:text-gray-100 hover:bg-gray-700/50'
                  }
          ${collapsed ? 'justify-center' : 'justify-between'}
        `}
              >
                <div className="flex items-center">
                  <item.icon
                    className={`
            ${classNames.icon.default} transition-colors
            ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-100'}
            ${!collapsed && 'mr-3'}
          `}
                  />
                  {!collapsed && <span className="truncate">{item.title}</span>}
                </div>

                {!collapsed && item.badge && (
                  <BaseStatusBadge
                    status={item.badge}
                    variant={item.badgeVariant || 'neutral'}
                    size="sm"
                    pulse={item.badge === 'LIVE'}
                  />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
              </Link>

              {/* Render sub-navigation if applicable */}
              {!collapsed && item.children && isActive && (
                <div className="ml-8 mt-2 space-y-1">
                  {item.children.map(child => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className={`
                block px-3 py-2 text-sm rounded-md transition-colors
                ${location.pathname === child.href
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                        }
              `}
                    >
                      {child.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* System Status */}
      <SystemStatus collapsed={collapsed} />

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-700">
        {!collapsed ? (
          <div className="space-y-3">
            <div className={`${classNames.utils.spaceBetween} ${classNames.text.xs}`}>
              <span className={classNames.text.muted}>Version</span>
              <span className={`${classNames.text.body} ${classNames.text.mono}`}>v2.1.0</span>
            </div>
            <div className={`${classNames.utils.spaceBetween} ${classNames.text.xs}`}>
              <span className={classNames.text.muted}>Environment</span>
              <BaseStatusBadge status="PROD" variant="info" size="sm" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  )
}
