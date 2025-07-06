import { useAuthStore } from '@/stores/authStore'
import type { APIResponse, PaginatedResponse } from '@/types'

class APIService {
  private baseURL = import.meta.env.VITE_API_URL || '/api'

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<APIResponse<T>> {
    const { token } = useAuthStore.getState()

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${endpoint}`, config)
      const data = await response.json()

      if (!response.ok) {
        const error = new Error(data?.message || 'API request failed') as any
        error.response = { ...data }
        throw error
      }


      return data
    } catch (error) {
      throw error instanceof Error ? error : new Error('Network error')
    }
  }

  // Generic CRUD operations
  async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint)
  }

  async post<T>(endpoint: string, body: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  }

  async put<T>(endpoint: string, body: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  }

  async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  // Paginated requests
  async getPaginated<T>(
    endpoint: string,
    params?: Record<string, string | number>
  ): Promise<PaginatedResponse<T>> {
    const searchParams = new URLSearchParams()

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString())
      })
    }

    const url = `${endpoint}?${searchParams.toString()}`
    const response = await this.get<PaginatedResponse<T>>(url)
    return response.data!
  }
}

export const apiService = new APIService()
