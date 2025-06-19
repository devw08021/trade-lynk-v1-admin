import React from 'react'
import { BaseCard } from '@/components/base/BaseCard'
import { BaseButton } from '@/components/base/BaseButton'
import { classNames } from '@/classNames'
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

// Professional Error Display Component
const ProfessionalErrorDisplay: React.FC<{
  error: Error
  errorInfo?: React.ErrorInfo
  resetError: () => void
}> = ({ error, errorInfo, resetError }) => {
  const [showDetails, setShowDetails] = React.useState(false)
  const [reportSent, setReportSent] = React.useState(false)

  const handleSendReport = async () => {
    try {
      // Simulate sending error report
      await new Promise(resolve => setTimeout(resolve, 1000))
      setReportSent(true)
      setTimeout(() => setReportSent(false), 3000)
    } catch (err) {
      console.error('Failed to send error report:', err)
    }
  }

  const goHome = () => {
    window.location.href = '/dashboard'
  }

  const reloadPage = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-6">
        {/* Main Error Card */}
        <BaseCard className="text-center">
          <div className={classNames.card.content}>
            {/* Error Icon */}
            <div className="mb-6">
              <div className={`w-20 h-20 ${classNames.metric.iconGradient.red} rounded-2xl flex items-center justify-center mx-auto shadow-2xl`}>
                <AlertTriangle className="w-10 h-10 text-white" />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-4 mb-8">
              <h1 className={`${classNames.text.h2} text-red-400`}>
                Something went wrong
              </h1>
              <p className={classNames.text.muted}>
                An unexpected error occurred in the admin panel. Our team has been notified 
                and is working to resolve this issue.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <BaseButton onClick={resetError} size="lg">
                <RefreshCw className={classNames.icon.sm} />
                Try Again
              </BaseButton>
              
              <BaseButton variant="secondary" onClick={reloadPage} size="lg">
                <RefreshCw className={classNames.icon.sm} />
                Reload Page
              </BaseButton>
              
              <BaseButton variant="ghost" onClick={goHome} size="lg">
                <Home className={classNames.icon.sm} />
                Go to Dashboard
              </BaseButton>
            </div>

            {/* Error Details Toggle */}
            <div className="border-t border-gray-700/50 pt-6">
              <BaseButton
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="mb-4"
              >
                <Bug className={classNames.icon.sm} />
                {showDetails ? 'Hide' : 'Show'} Technical Details
              </BaseButton>

              {/* Send Report Button */}
              <div className="flex justify-center">
                <BaseButton
                  variant="ghost"
                  size="sm"
                  onClick={handleSendReport}
                  disabled={reportSent}
                  className={reportSent ? 'text-green-400' : ''}
                >
                  <Mail className={classNames.icon.sm} />
                  {reportSent ? 'Report Sent!' : 'Send Error Report'}
                </BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>

        {/* Technical Details Card */}
        {showDetails && (
          <BaseCard variant="danger" className={classNames.animation.slideUp}>
            <div className={classNames.card.header}>
              <div className="flex items-center space-x-3">
                <Bug className={`${classNames.icon.default} text-red-400`} />
                <div>
                  <h3 className={`${classNames.text.h5} text-red-400`}>Technical Details</h3>
                  <p className={classNames.text.muted}>For development and debugging purposes</p>
                </div>
              </div>
            </div>
            
            <div className={classNames.card.content}>
              <div className="space-y-4">
                {/* Error Message */}
                <div>
                  <label className={classNames.text.caption}>Error Message:</label>
                  <div className="mt-2 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <code className={`${classNames.text.small} ${classNames.text.mono} text-red-400`}>
                      {error.message}
                    </code>
                  </div>
                </div>

                {/* Stack Trace */}
                {error.stack && (
                  <div>
                    <label className={classNames.text.caption}>Stack Trace:</label>
                    <div className="mt-2 p-3 bg-gray-900/50 border border-gray-700 rounded-lg max-h-40 overflow-y-auto">
                      <pre className={`${classNames.text.xs} ${classNames.text.mono} text-gray-300 whitespace-pre-wrap`}>
                        {error.stack}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Component Stack */}
                {errorInfo?.componentStack && (
                  <div>
                    <label className={classNames.text.caption}>Component Stack:</label>
                    <div className="mt-2 p-3 bg-gray-900/50 border border-gray-700 rounded-lg max-h-40 overflow-y-auto">
                      <pre className={`${classNames.text.xs} ${classNames.text.mono} text-gray-300 whitespace-pre-wrap`}>
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Environment Info */}
                <div>
                  <label className={classNames.text.caption}>Environment Info:</label>
                  <div className="mt-2 p-3 bg-gray-900/50 border border-gray-700 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className={classNames.text.muted}>Environment:</span>
                        <span className={`${classNames.text.body} ml-2`}>
                          {import.meta.env.MODE}
                        </span>
                      </div>
                      <div>
                        <span className={classNames.text.muted}>Timestamp:</span>
                        <span className={`${classNames.text.body} ${classNames.text.mono} ml-2`}>
                          {new Date().toISOString()}
                        </span>
                      </div>
                      <div>
                        <span className={classNames.text.muted}>User Agent:</span>
                        <span className={`${classNames.text.body} ml-2 truncate`} title={navigator.userAgent}>
                          {navigator.userAgent.split(' ')[0]}...
                        </span>
                      </div>
                      <div>
                        <span className={classNames.text.muted}>URL:</span>
                        <span className={`${classNames.text.body} ${classNames.text.mono} ml-2 truncate`}>
                          {window.location.pathname}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </BaseCard>
        )}

        {/* Footer */}
        <div className="text-center">
          <p className={`${classNames.text.small} text-gray-500`}>
            If this error persists, please contact the development team with the technical details above.
          </p>
        </div>
      </div>
    </div>
  )
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })
    
    // Log to external service in production
    if (import.meta.env.PROD) {
      this.logErrorToService(error, errorInfo)
    }
  }

  private logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // Integration with error reporting services
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      userId: 'admin-user', // Get from auth store
    }

    // Example: Send to Sentry, LogRocket, or custom endpoint
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport),
    }).catch(err => {
      console.error('Failed to log error to service:', err)
    })
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props
      
      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} resetError={this.resetError} />
      }

      return (
        <ProfessionalErrorDisplay
          error={this.state.error!}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
        />
      )
    }

    return this.props.children
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  return React.useCallback((error: Error, errorInfo?: { componentStack: string }) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    
    // Log to external service
    if (import.meta.env.PROD) {
      const errorReport = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }

      fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errorReport),
      }).catch(err => {
        console.error('Failed to log error:', err)
      })
    }
  }, [])
}

// Simple Error Fallback Component
export const SimpleErrorFallback: React.FC<{ 
  error: Error 
  resetError: () => void 
}> = ({ error, resetError }) => (
  <div className="p-8 text-center">
    <BaseCard variant="danger">
      <div className={classNames.card.content}>
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <h2 className={`${classNames.text.h4} text-red-400 mb-2`}>
          Something went wrong
        </h2>
        <p className={`${classNames.text.muted} mb-4`}>
          {error.message}
        </p>
        <BaseButton onClick={resetError}>
          <RefreshCw className={classNames.icon.sm} />
          Try Again
        </BaseButton>
      </div>
    </BaseCard>
  </div>
)
