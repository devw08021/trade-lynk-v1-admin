import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { coinService } from '@/services/coinService'
import { toast } from 'react-hot-toast'
import type { UserFilters, PaginationOptions, SortOptions } from '@/types'

export function useCoins(
  filters: UserFilters = {},
  pagination: PaginationOptions = { page: 0, limit: 20 },
  sort: SortOptions = { field: 'createdAt', direction: -1 }
) {
  return useQuery({
    queryKey: ['coins', filters, pagination, sort],
    queryFn: () => coinService.getCoins(filters, pagination, sort),
    staleTime: 30000, // 30 seconds
    retry: 3,
  })
}

export function useCoin(id: string) {
  return useQuery({
    queryKey: ['coin', id],
    queryFn: () => coinService.getCoin(id),
    enabled: !!id,
  })
}

export function useCoinActions() {
  const queryClient = useQueryClient()

  const addCoin = useMutation({
    mutationFn: (data: any) =>
      coinService.addCoin(data),
    onSuccess: (response, variables) => {
      if (response?.message) toast.success(response?.message || 'Failed to unban user')
      queryClient.invalidateQueries({ queryKey: ['coins'] })
      queryClient.invalidateQueries({ queryKey: ['coin', variables.id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to ban user')
    },
  })

  const updateCoin = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => coinService.updateCoin(id, data),
    onSuccess: (response, variables) => {
      if (response?.message) toast.success(response?.message || 'Failed to unban user')
      queryClient.invalidateQueries({ queryKey: ['coins'] })
      queryClient.invalidateQueries({ queryKey: ['coin', variables.id] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to unban user')
    },
  })


  return {
    addCoin,
    updateCoin,
    addCoinLoading: addCoin.isPending,
    updateCoinLoading: updateCoin.isPending,
  }
}
