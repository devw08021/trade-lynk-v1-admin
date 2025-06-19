import React from 'react'
import { useAuthStore } from '@/stores/authStore'
import { BaseButton } from '@/components/base/BaseButton'
import { BaseInput } from '@/components/base/BaseInput'
import { classNames} from '@/classNames'
import {formatters} from '@/utils/formatters'
import {
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Activity,
  DollarSign,
  TrendingUp,
  Users,
  Moon,
  Sun,
} from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

interface HeaderProps {
  title?: string
  actions?: React.ReactNode
}

// Real-time stats component
const LiveStats: React.FC = () => {
  const [stats, setStats] = React.useState({
    btcPrice: 43250.50,
    change24h: 2.45,
    volume24h: 2.4,
    activeUsers: 8934,
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        btcPrice: prev.btcPrice + (Math.random() - 0.5) * 100,
        change24h: prev.change24h + (Math.random() - 0.5) * 0.5,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="hidden lg:flex items-center space-x-6 text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        <span className={classNames.text.muted}>BTC</span>
        <span className={`${classNames.text.mono} font-semibold text-gray-100`}>
          {formatters.currency(stats.btcPrice)}
        </span>
        <span className={stats.change24h >= 0 ? classNames.trading.pricePositive : classNames.trading.priceNegative}>
          {formatters.percentage(stats.change24h)}
        </span>
      </div>
      
      <div className="h-4 w-px bg-gray-600" />
      
      <div className="flex items-center space-x-1">
        <TrendingUp className={classNames.icon.sm} />
        <span className={classNames.text.muted}>24h Vol:</span>
        <span className={`${classNames.text.body} font-semibold`}>
          ${stats.volume24h}B
        </span>
      </div>
      
      <div className="flex items-center space-x-1">
        <Users className={classNames.icon.sm} />
        <span className={classNames.text.muted}>Online:</span>
        <span className={classNames.trading.pricePositive}>
          {stats.activeUsers.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

export const Header: React.FC<HeaderProps> = ({ title, actions }) => {
  const { user, logout } = useAuthStore()
  const [notifications] = React.useState(3)
  const [darkMode, setDarkMode] = React.useState(true)

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header className={classNames.layout.header}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {title && (
            <div className="flex items-center space-x-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full" />
              <h1 className={classNames.layout.pageTitle}>
                {title}
              </h1>
            </div>
          )}
          
          <LiveStats />
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-8">
          <BaseInput
            type="text"
            placeholder="Search users, transactions, orders..."
            leftIcon={<Search className={classNames.icon.sm} />}
            className="bg-gray-800/60 border-gray-600/50 focus:bg-gray-800/80"
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {actions}
          
          {/* Quick Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <BaseButton variant="ghost" size="sm">
              <Activity className={classNames.icon.sm} />
              System
            </BaseButton>
            <BaseButton variant="ghost" size="sm">
              <DollarSign className={classNames.icon.sm} />
              Treasury
            </BaseButton>
          </div>

          <div className="h-6 w-px bg-gray-600" />

          {/* Theme Toggle */}
          <BaseButton
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {darkMode ? (
              <Sun className={classNames.icon.sm} />
            ) : (
              <Moon className={classNames.icon.sm} />
            )}
          </BaseButton>

          {/* Notifications */}
          <BaseButton variant="ghost" size="icon" className="relative">
            <Bell className={classNames.icon.sm} />
            {notifications > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs flex items-center justify-center text-white font-semibold animate-pulse">
                {notifications}
              </span>
            )}
          </BaseButton>

          {/* User Menu */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <BaseButton variant="ghost" className="flex items-center space-x-3 px-3 py-2">
                <div className={`h-9 w-9 ${classNames.avatar.gradients.blue} rounded-lg flex items-center justify-center shadow-lg`}>
                  <User className={classNames.icon.sm} />
                </div>
                <div className="text-left hidden sm:block">
                  <div className={`${classNames.text.body} font-semibold`}>
                    {user?.firstName || 'Admin'}
                  </div>
                  <div className={`${classNames.text.xs} capitalize`}>
                    {user?.role?.replace('_', ' ')}
                  </div>
                </div>
                <ChevronDown className={classNames.icon.sm} />
              </BaseButton>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content className={classNames.dropdown.content}>
                <div className="px-3 py-2 border-b border-gray-700 mb-2">
                  <div className={`${classNames.text.body} font-semibold`}>
                    {user?.firstName || 'Admin User'}
                  </div>
                  <div className={classNames.text.small}>
                    {user?.email}
                  </div>
                </div>

                <DropdownMenu.Item className={classNames.dropdown.item}>
                  <User className={`${classNames.icon.sm} text-gray-400`} />
                  Profile Settings
                </DropdownMenu.Item>
                
                <DropdownMenu.Item className={classNames.dropdown.item}>
                  <Settings className={`${classNames.icon.sm} text-gray-400`} />
                  Preferences
                </DropdownMenu.Item>
                
                <DropdownMenu.Separator className={classNames.dropdown.separator} />
                
                <DropdownMenu.Item 
                  className={`${classNames.dropdown.item} text-red-400 hover:bg-red-900/20`}
                  onSelect={logout}
                >
                  <LogOut className={classNames.icon.sm} />
                  Sign Out
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  )
}
