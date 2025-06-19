import { apiService } from './api'
import type { User, UserFilters, PaginationOptions, SortOptions, PaginatedResponse } from '@/types'

export const userService = {
  async getUsers(
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

    return apiService.getPaginated<User>('/admin/users', params)
  },

  async getUser(id: string): Promise<User> {
    const response = await apiService.get<User>(`/admin/users/${id}`)
    return response.data!
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const response = await apiService.put<User>(`/admin/users/${id}`, updates)
    return response.data!
  },

  async banUser(id: string, reason: string): Promise<void> {
    await apiService.post(`/admin/users/${id}/ban`, { reason })
  },

  async unbanUser(id: string): Promise<void> {
    await apiService.post(`/admin/users/${id}/unban`, {})
  },

  async suspendUser(id: string, reason: string, duration?: number): Promise<void> {
    await apiService.post(`/admin/users/${id}/suspend`, { reason, duration })
  },

  async resetTwoFactor(id: string): Promise<void> {
    await apiService.post(`/admin/users/${id}/reset-2fa`, {})
  },

  async toggleWithdrawals(id: string, enabled: boolean): Promise<void> {
    await apiService.post(`/admin/users/${id}/toggle-withdrawals`, { enabled })
  },

  async getUserAuditLog(id: string): Promise<any[]> {
    const response = await apiService.get<any[]>(`/admin/users/${id}/audit-log`)
    return response.data!
  },
}
