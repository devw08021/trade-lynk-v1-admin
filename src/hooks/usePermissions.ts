import { useAuthStore } from '@/stores/authStore'
import type { Permission } from '@/types'

export function usePermissions() {
  const { permissions, hasPermission } = useAuthStore()

  const checkPermission = (permission: Permission) => hasPermission(permission)

  const checkMultiplePermissions = (requiredPermissions: Permission[], requireAll = true) => {
    if (requireAll) {
      return requiredPermissions.every(permission => hasPermission(permission))
    }
    return requiredPermissions.some(permission => hasPermission(permission))
  }

  return {
    permissions,
    hasPermission: checkPermission,
    hasAllPermissions: (permissions: Permission[]) => checkMultiplePermissions(permissions, true),
    hasAnyPermission: (permissions: Permission[]) => checkMultiplePermissions(permissions, false),
  }
}
