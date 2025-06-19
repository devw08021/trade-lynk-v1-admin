import React from 'react'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { AppLayout } from '@/components/layout/AppLayout'

const DashboardPage = React.lazy(() => import('@/features/dashboard/pages/DashboardPage').then(m => ({ default: m.DashboardPage })))
const UsersPage = React.lazy(() => import('@/features/users/pages/UsersPage').then(m => ({ default: m.UsersPage })))
const WalletsPage = React.lazy(() => import('@/features/wallets/pages/WalletsPage').then(m => ({ default: m.WalletsPage })))
const LoginPage = React.lazy(() => import('@/features/auth/pages/LoginPage').then(m => ({ default: m.LoginPage })))

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    }>
      <AppLayout>
      {children}
      </AppLayout>
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
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    }>
      {children}
    </React.Suspense>
  )
}

// Create router
const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthRoute>
        <LoginPage />
      </AuthRoute>
    ),
  },
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <UsersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/wallets",
    element: (
      <ProtectedRoute>
        <WalletsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/trading",
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
    path: "/analytics",
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
    path: "/kyc",
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
    path: "/audit",
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
    path: "/settings",
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
    path: "*",
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
