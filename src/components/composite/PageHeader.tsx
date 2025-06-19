import React from 'react'
import { classNames } from '@/classNames'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  breadcrumbs?: Array<{ label: string; href?: string }>
  children?: React.ReactNode
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  breadcrumbs,
  children,
}) => {
  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex space-x-2 text-sm text-gray-400">
          {breadcrumbs.map((breadcrumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>/</span>}
              {breadcrumb.href ? (
                <a 
                  href={breadcrumb.href} 
                  className="hover:text-gray-200 transition-colors"
                >
                  {breadcrumb.label}
                </a>
              ) : (
                <span className="text-gray-200">{breadcrumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header */}
      <div className={classNames.layout.pageHeader}>
        <div>
          <h1 className={classNames.layout.pageTitle}>
            {title}
          </h1>
          {subtitle && (
            <p className={classNames.layout.pageSubtitle}>
              {subtitle}
            </p>
          )}
        </div>
        
        {actions && (
          <div className={classNames.layout.pageActions}>
            {actions}
          </div>
        )}
      </div>

      {/* Additional Content */}
      {children}
    </div>
  )
}
