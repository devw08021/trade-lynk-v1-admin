import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pairService } from '@/services/p2p/pairService'
import { toast } from 'react-hot-toast'
import type { User, UserFilters, PaginationOptions, SortOptions } from '@/types'

export function usePairs(
  filters: UserFilters = {},
  pagination: PaginationOptions = { page: 0, limit: 20 },
  sort: SortOptions = { field: 'createdAt', direction: -1 }
) {
  return useQuery({
    queryKey: ['pairs', filters, pagination, sort],
    queryFn: () => pairService.getPairs(filters, pagination, sort),
    staleTime: 30000, // 30 seconds
    retry: 3,
  })
}

export function usePair(id: string) {
  return useQuery({
    queryKey: ['pair', id],
    queryFn: () => pairService.getPair(id),
    enabled: !!id,
  })
}

export function usePairActions() {
  const queryClient = useQueryClient()

  const addPair = useMutation({
    mutationFn: (data: any) =>
      pairService.addPair(data),
    onSuccess: (response, variables) => {
      if (response?.message) toast.success(response?.message || 'Failed to unban user')
      queryClient.invalidateQueries({ queryKey: ['pairs'] })
      queryClient.invalidateQueries({ queryKey: ['pair', variables.id] })
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to ban user')
    },
  })

  const updatePair = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => pairService.updatePair(id, data),
    onSuccess: (response, variables) => {
      if (response?.message) toast.success(response?.message || 'Failed to unban user')
      queryClient.invalidateQueries({ queryKey: ['pairs'] })
      queryClient.invalidateQueries({ queryKey: ['pair', variables.id] })
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to unban user')
    },
  })


  return {
    addPair,
    updatePair,
    addPairLoading: addPair.isPending,
    updatePairLoading: updatePair.isPending,
  }
}

