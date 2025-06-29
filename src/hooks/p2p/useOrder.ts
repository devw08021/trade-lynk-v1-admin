import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderService } from '@/services/p2p/orderService'
import { toast } from 'react-hot-toast'
import type { User, UserFilters, PaginationOptions, SortOptions } from '@/types'

export function userOrders(
  filters: UserFilters = {},
  pagination: PaginationOptions = { page: 0, limit: 20 },
  sort: SortOptions = { field: 'createdAt', direction: -1 }
) {
  return useQuery({
    queryKey: ['order', filters, pagination, sort],
    queryFn: () => orderService.getOrders(filters, pagination, sort),
    staleTime: 30000, // 30 seconds
    retry: 3,
  })
}

export function userPair(id: string) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => orderService.getPair(id),
    enabled: !!id,
  })
}

export function useUserActions() {
  const queryClient = useQueryClient()

  const banUser = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orderService.banUser(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User banned successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to ban user')
    },
  })

  const unbanUser = useMutation({
    mutationFn: (id: string) => orderService.unbanUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User unbanned successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to unban user')
    },
  })

  const suspendUser = useMutation({
    mutationFn: ({ id, reason, duration }: { id: string; reason: string; duration?: number }) =>
      orderService.suspendUser(id, reason, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User suspended successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to suspend user')
    },
  })

  const resetTwoFactor = useMutation({
    mutationFn: (id: string) => orderService.resetTwoFactor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Two-factor authentication reset successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reset 2FA')
    },
  })

  const toggleWithdrawals = useMutation({
    mutationFn: ({ id, enabled }: { id: string; enabled: boolean }) =>
      orderService.toggleWithdrawals(id, enabled),
    onSuccess: (_, { enabled }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success(`Withdrawals ${enabled ? 'enabled' : 'disabled'} successfully`)
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to toggle withdrawals')
    },
  })

  const updateUser = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<User> }) =>
      orderService.updateUser(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update user')
    },
  })

  return {
    banUser,
    unbanUser,
    suspendUser,
    resetTwoFactor,
    toggleWithdrawals,
    updateUser,
  }
}

export function useUserAuditLog(userId: string) {
  return useQuery({
    queryKey: ['userAuditLog', userId],
    queryFn: () => orderService.getUserAuditLog(userId),
    enabled: !!userId,
  })
}
