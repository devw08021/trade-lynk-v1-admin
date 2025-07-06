import { apiService } from './api'
import type {  UserFilters, PaginationOptions, SortOptions, PaginatedResponse } from '@/types'

export const coinService = {
  async getCoins(
    filters: UserFilters = {},
    pagination: PaginationOptions = { page: 1, limit: 20 },
    sort: SortOptions = { field: 'createdAt', direction: 'desc' }
  ): Promise<PaginatedResponse<any>> {
    const params = {
      page: pagination.page,
      limit: pagination.limit,
      sortField: sort.field,
      sortDirection: sort.direction,
      ...filters,
    }

    return apiService.getPaginated<any>(`${import.meta.env.VITE_Wallet_API_URL}/coins`, params)
  },

  async getCoin(id: string): Promise<any> {
    const response = await apiService.get<any>(`${import.meta.env.VITE_Wallet_API_URL}/coin/${id}`)
    return response.data!
  },

  async addCoin(updates: Partial<any>): Promise<any> {
    const response = await apiService.post<any>(`${import.meta.env.VITE_Wallet_API_URL}/coin`, updates)
    return response!
  },
  async updateCoin(id: string, updates: Partial<any>): Promise<any> {
    const response = await apiService.put<any>(`${import.meta.env.VITE_Wallet_API_URL}/coin/${id}`, updates)
    return response!
  },

}
