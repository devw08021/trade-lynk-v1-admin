import { apiService } from '../api'
import type { User, UserFilters, PaginationOptions, SortOptions, PaginatedResponse } from '@/types'

export const pairService = {
  async getPairs(
    filters: UserFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 20 },
    sort: SortOptions = { field: 'createdAt', direction: 'desc' }
  ): Promise<PaginatedResponse<User>> {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      sortField: sort.field,
      sortDirection: sort.direction,
      ...filters,
    }

    return apiService.getPaginated<User>(`${import.meta.env.VITE_P2P_API_URL}/pairs`, params)
  },

  async getPair(id: string): Promise<User> {
    const response = await apiService.get<User>(`${import.meta.env.VITE_P2P_API_URL}/pair/${id}`)
    return response.data!
  },

  async addPair(updates: Partial<any>): Promise<any> {
    const response = await apiService.post<any>(`${import.meta.env.VITE_P2P_API_URL}/pair`, updates)
    return response!
  },
  async updatePair(id: string, updates: Partial<any>): Promise<any> {
    const response = await apiService.put<any>(`${import.meta.env.VITE_P2P_API_URL}/pair/${id}`, updates)
    return response!
  },
}
