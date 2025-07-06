import React from 'react'
import { cn, classNames } from '@/classNames'
import { X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { BaseButton } from './BaseButton'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  size?: string
  children: React.ReactNode
  footer?: React.ReactNode
  closeButton?: boolean
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  size = 'default',
  children,
  footer,
  closeButton = true,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose} >
      <Dialog.Portal>
        <Dialog.Overlay className={"fixed inset-0 bg-black/50"} />
        <Dialog.Content className={cn(
          classNames.modal.content,
          // classNames.modal.sizes[size]
        )}>
          {/* Header */}
          {(title || closeButton) && (
            <div className={classNames.modal.header}>
              <div>
                {title && (
                  <Dialog.Title className={classNames.text.h3}>
                    {title}
                  </Dialog.Title>
                )}
                {subtitle && (
                  <p className={classNames.text.muted}>{subtitle}</p>
                )}
              </div>
              
              {closeButton && (
                <Dialog.Close asChild>
                  <BaseButton variant="ghost" size="icon">
                    <X className={classNames.icon.default} />
                  </BaseButton>
                </Dialog.Close>
              )}
            </div>
          )}

          {/* Body */}
          <div className={classNames.modal.body}>
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className={classNames.modal.footer}>
              {footer}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
