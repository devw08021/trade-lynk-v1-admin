import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppLayout } from '@/components/layout/AppLayout'

const DashboardPage = React.lazy(() =>
  import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage }))
)

// User
const UsersPage = React.lazy(() =>
  import('@/features/users/pages/UsersPage').then(m => ({ default: m.UsersPage }))
)
const UsersList = React.lazy(() =>
  import('@/features/users/pages/UsersList').then(m => ({ default: m.UsersList }))
)
const UsersProfile = React.lazy(() =>
  import('@/features/users/pages/userProfile').then(m => ({ default: m.UserProfile }))
)

// Wallet
const WalletsPage = React.lazy(() =>
  import('@/features/wallets/pages/WalletsPage').then(m => ({ default: m.WalletsPage }))
)

//P2P
const P2PState = React.lazy(() =>
  import('@/features/p2p/pages/Manage').then(m => ({ default: m.Manage }))
)
const P2PPair = React.lazy(() =>
  import('@/features/p2p/pages/PairList').then(m => ({ default: m.PairList }))
)
const P2PEdit = React.lazy(() =>
  import('@/features/p2p/pages/PairList').then(m => ({ default: m.PairList }))
)
const P2PAdsList = React.lazy(() =>
  import('@/features/p2p/pages/AdsList').then(m => ({ default: m.AdsList }))
)
const P2POrderList = React.lazy(() =>
  import('@/features/p2p/pages/OrderList').then(m => ({ default: m.OrderList }))
)
const P2PDispute = React.lazy(() =>
  import('@/features/p2p/pages/DisputeList').then(m => ({ default: m.DispteList }))
)

const LoginPage = React.lazy(() =>
  import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage }))
)

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      }
    >
      <AppLayout>{children}</AppLayout>
    </React.Suspense>
  )
}

// Auth Route Component
const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      }
    >
      {children}
    </React.Suspense>
  )
}

// Create router
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    ),
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },

  // user
  {
    path: '/users',
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/list',
    element: (
      <ProtectedRoute>
        <UsersList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/users/:id',
    element: (
      <ProtectedRoute>
        <UsersProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/wallets',
    element: (
      <ProtectedRoute>
        <WalletsPage />
      </ProtectedRoute>
    ),
  },

  // p2p
  {
    path: '/p2p',
    element: (
      <ProtectedRoute>
        <P2PState />
      </ProtectedRoute>
    ),
  },
  {
    path: '/p2p/pairs',
    element: (
      <ProtectedRoute>
        <P2PPair />
      </ProtectedRoute>
    ),
  },
  {
    path: '/p2p/:pairId',
    element: (
      <ProtectedRoute>
        <P2PPair />
      </ProtectedRoute>
    ),
  },
  {
    path: '/p2p/ads',
    element: (
      <ProtectedRoute>
        <P2PAdsList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/p2p/:adId',
    element: (
      <ProtectedRoute>
        <P2PAdsList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/p2p/orders',
    element: (
      <ProtectedRoute>
        <P2POrderList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/p2p/:orderId',
    element: (
      <ProtectedRoute>
        <P2POrderList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/p2p/disputes',
    element: (
      <ProtectedRoute>
        <P2PDispute />
      </ProtectedRoute>
    ),
  },
  {
    path: '/p2p/:disputeOrderID',
    element: (
      <ProtectedRoute>
        <P2PDispute />
      </ProtectedRoute>
    ),
  },
  {
    path: '/trading',
    element: (
      <ProtectedRoute>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Trading Engine</h2>
          <p className="text-gray-400">Coming Soon</p>
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Analytics Hub</h2>
          <p className="text-gray-400">Coming Soon</p>
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/kyc',
    element: (
      <ProtectedRoute>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">KYC Review Center</h2>
          <p className="text-gray-400">Coming Soon</p>
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/audit',
    element: (
      <ProtectedRoute>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Audit Logs</h2>
          <p className="text-gray-400">Coming Soon</p>
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">System Settings</h2>
          <p className="text-gray-400">Coming Soon</p>
        </div>
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])

// Router Provider Component
export const AppRouter: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}
