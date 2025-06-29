import React from 'react'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseButton } from '@/components/base/BaseButton'
import { BaseInput } from '@/components/base/BaseInput'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { useAuthStore } from '@/stores/authStore'
import { classNames, formatters } from '@/classNames'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff, Zap, TrendingUp, Users, Activity, Lock } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginForm = z.infer<typeof loginSchema>

// Live Metrics Component for Branding Side
const LiveMetrics: React.FC = () => {
  const [metrics, setMetrics] = React.useState({
    volume: 2.4,
    users: 8934,
    trades: 156789,
    uptime: 99.99,
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        volume: prev.volume + (Math.random() - 0.5) * 0.1,
        users: prev.users + Math.floor(Math.random() * 10) - 5,
        trades: prev.trades + Math.floor(Math.random() * 50),
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const metricsData = [
    {
      icon: TrendingUp,
      label: '24h Volume',
      value: formatters.currency(metrics.volume * 1000000000),
      color: 'green' as const,
    },
    {
      icon: Users,
      label: 'Active Users',
      value: formatters.compact(metrics.users),
      color: 'blue' as const,
    },
    {
      icon: Activity,
      label: 'Total Trades',
      value: formatters.compact(metrics.trades),
      color: 'purple' as const,
    },
    {
      icon: Shield,
      label: 'System Uptime',
      value: `${metrics.uptime}%`,
      color: 'amber' as const,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {metricsData.map((metric, index) => (
        <BaseCard key={index} variant="glass" padding="sm">
          <div className="text-center space-y-2">
            <div
              className={`w-10 h-10 ${classNames.metric.iconGradient[metric.color]} rounded-lg flex items-center justify-center mx-auto`}
            >
              <metric.icon className="w-5 h-5 text-white" />
            </div>
            <div className={`${classNames.text.h6} text-white`}>{metric.value}</div>
            <div className={classNames.text.xs}>{metric.label}</div>
          </div>
        </BaseCard>
      ))}
    </div>
  )
}

// Security Features Component
const SecurityFeatures: React.FC = () => {
  const features = [
    { label: 'TLS 1.3 Encryption', icon: Shield },
    { label: 'DDoS Protection', icon: Lock },
    { label: '24/7 Monitoring', icon: Activity },
    { label: 'Multi-Factor Auth', icon: Eye },
  ]

  return (
    <div className="space-y-3">
      <h4 className={`${classNames.text.h6} text-blue-200 mb-4`}>Enterprise Security</h4>
      {features.map((feature, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
            <feature.icon className="w-3 h-3 text-green-400" />
          </div>
          <span className="text-sm text-blue-100">{feature.label}</span>
        </div>
      ))}
    </div>
  )
}

export const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuthStore()
  const [showPassword, setShowPassword] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@crypto.com',
      password: 'Test@123',
    },
  })

  const onSubmit = async (data: LoginForm) => {
    await login(data.email, data.password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900/90 via-purple-900/90 to-gray-900/90 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-4 mb-12">
            <div
              className={`w-16 h-16 ${classNames.metric.iconGradient.blue} rounded-2xl flex items-center justify-center shadow-2xl`}
            >
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className={`${classNames.text.h1} text-white`}>TradeLynk</h1>
              <p className="text-blue-200 text-lg font-medium">Professional Trading Platform</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className={`${classNames.text.h1} text-white leading-tight`}>
                Crypto Exchange
                <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Administration
                </span>
              </h2>
              <p className={`${classNames.text.bodyLarge} text-blue-100 max-w-lg`}>
                Monitor, manage, and optimize your trading platform with enterprise-grade tools,
                real-time analytics, and comprehensive user management capabilities.
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-3 gap-8 py-8">
              <div className="text-center">
                <div className={`${classNames.metric.value} text-white mb-2`}>99.99%</div>
                <div className="text-sm text-blue-200">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className={`${classNames.metric.value} text-white mb-2`}>24/7</div>
                <div className="text-sm text-blue-200">Monitoring</div>
              </div>
              <div className="text-center">
                <div className={`${classNames.metric.value} text-white mb-2`}> 50ms</div>
                <div className="text-sm text-blue-200">Latency</div>
              </div>
            </div>

            {/* Security Features */}
            <SecurityFeatures />
          </div>
        </div>

        {/* Live Metrics */}
        <div className="relative z-10 space-y-4">
          <LiveMetrics />
          <div className="flex items-center space-x-2 text-sm text-blue-200">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>
              Real-time platform metrics • Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        {/* Mobile Background */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900/40 backdrop-blur-sm" />

        <div className="w-full max-w-md space-y-8 relative z-10">
          {/* Mobile Header */}
          <div className="text-center lg:hidden">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 ${classNames.metric.iconGradient.blue} rounded-2xl mb-6 shadow-2xl`}
            >
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className={`${classNames.text.h2} text-white mb-2`}>TradeLynk Admin</h1>
            <p className={classNames.text.muted}>Secure access to your trading platform</p>
          </div>

          {/* Login Card */}
          <BaseCard className="shadow-2xl border-gray-700/50 bg-gradient-to-br from-gray-800/90 to-gray-850/90 backdrop-blur-md">
            {/* Card Header */}
            <div className={classNames.card.header}>
              <div className="flex items-center space-x-3">
                <div
                  className={`w-12 h-12 ${classNames.metric.iconGradient.blue} rounded-lg flex items-center justify-center`}
                >
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className={classNames.text.h4}>Admin Access</h3>
                  <p className={classNames.text.muted}>Secure authentication required</p>
                </div>
              </div>
            </div>

            {/* Card Content */}
            <div className={classNames.card.content}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Error Alert */}
                {error && (
                  <div className={`${classNames.alert.base} ${classNames.alert.variants.error}`}>
                    <Shield className={classNames.alert.icon} />
                    <div className={classNames.alert.content}>
                      <p className={classNames.alert.message}>{error}</p>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <BaseInput
                  label="Administrator Email"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  placeholder="admin@tradelnk.com"
                  leftIcon={<Users className={classNames.icon.sm} />}
                  inputSize="lg"
                />

                {/* Password Field */}
                <BaseInput
                  label="Secure Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  placeholder="Enter your secure password"
                  leftIcon={<Lock className={classNames.icon.sm} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className={classNames.icon.sm} />
                      ) : (
                        <Eye className={classNames.icon.sm} />
                      )}
                    </button>
                  }
                  inputSize="lg"
                />

                {/* Submit Button */}
                <BaseButton
                  type="submit"
                  className="w-full"
                  size="lg"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Authenticating...' : 'Access Admin Console'}
                </BaseButton>
              </form>

              {/* Demo Credentials */}
              <BaseCard variant="glass" padding="sm" className="mt-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <BaseStatusBadge status="Demo Environment" variant="success" size="sm" />
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className={classNames.utils.spaceBetween}>
                      <span className={classNames.text.muted}>Email:</span>
                      <code
                        className={`${classNames.text.mono} text-blue-400 bg-gray-900/50 px-2 py-1 rounded`}
                      >
                        admin@crypto.com
                      </code>
                    </div>
                    <div className={classNames.utils.spaceBetween}>
                      <span className={classNames.text.muted}>Password:</span>
                      <code
                        className={`${classNames.text.mono} text-blue-400 bg-gray-900/50 px-2 py-1 rounded`}
                      >
                        admin123
                      </code>
                    </div>
                  </div>
                </div>
              </BaseCard>

              {/* Security Notice */}
              <div className="text-center space-y-2 mt-6">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3" />
                    <span>TLS 1.3 Encrypted</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>DDoS Protected</span>
                  </div>
                </div>
                <p className={`${classNames.text.xs} text-gray-500`}>
                  Protected by advanced security protocols and monitoring
                </p>
              </div>
            </div>
          </BaseCard>

          {/* Footer */}
          <div className="text-center space-y-3">
            <p className={`${classNames.text.body} text-gray-300`}>
              TradeLynk Admin Console v2.1.0
            </p>
            <p className={`${classNames.text.xs} text-gray-500 max-w-sm mx-auto`}>
              © 2024 TradeLynk Technologies. Enterprise-grade cryptocurrency exchange platform with
              institutional-level security and performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
