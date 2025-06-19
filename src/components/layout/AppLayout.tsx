import React from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { classNames } from '@/classNames'
import { Toaster } from 'react-hot-toast'
import { ErrorBoundary } from '@/components/ErrorBoundary'

interface AppLayoutProps {
  children: React.ReactNode
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    // Get initial state from localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    }
    return false
  })

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newState))
    }
  }

  return (
    <ErrorBoundary>
      <div className={classNames.layout.main}>
        <div className="flex">
          <Sidebar 
            collapsed={sidebarCollapsed}
            onToggle={toggleSidebar}
          />
          
          <div className="flex-1 flex flex-col min-h-screen">
            <Header />
            
            <main className="flex-1 bg-gray-900">
              {children}
            </main>
          </div>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'hsl(220, 13%, 9%)',
              color: 'hsl(210, 40%, 98%)',
              border: '1px solid hsl(215, 28%, 17%)',
            },
            success: {
              iconTheme: {
                primary: 'hsl(142, 76%, 36%)',
                secondary: 'hsl(220, 13%, 9%)',
              },
            },
            error: {
              iconTheme: {
                primary: 'hsl(0, 84%, 60%)',
                secondary: 'hsl(220, 13%, 9%)',
              },
            },
          }}
        />
      </div>
    </ErrorBoundary>
  )
}
