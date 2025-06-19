import { z } from 'zod'

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') 
    .replace(/javascript:/gi, '') 
    .replace(/on\w+=/gi, '')
    .trim()
}

export function validateAndSanitize<T>(
  input: unknown,
  schema: z.ZodSchema<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.parse(input)
    return { success: true, data: result }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return { success: false, error: firstError.message }
    }
    return { success: false, error: 'Validation failed' }
  }
}

export class RateLimiter {
  private requests: Map<string, number[]> = new Map()

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const windowStart = now - this.windowMs
    
    let requests = this.requests.get(identifier) || []
    requests = requests.filter(time => time > windowStart)
    
    if (requests.length >= this.maxRequests) {
      return false
    }
    
    requests.push(now)
    this.requests.set(identifier, requests)
    return true
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now()
    const windowStart = now - this.windowMs
    const requests = (this.requests.get(identifier) || [])
      .filter(time => time > windowStart)
    
    return Math.max(0, this.maxRequests - requests.length)
  }
}

// CSRF token management
export class CSRFTokenManager {
  private static instance: CSRFTokenManager
  private token: string | null = null

  static getInstance(): CSRFTokenManager {
    if (!CSRFTokenManager.instance) {
      CSRFTokenManager.instance = new CSRFTokenManager()
    }
    return CSRFTokenManager.instance
  }

  async getToken(): Promise<string> {
    if (!this.token) {
      const response = await fetch('/api/csrf-token')
      const data = await response.json()
      this.token = data.token
    }
    return this.token
  }

  clearToken(): void {
    this.token = null
  }
}

// Content Security Policy helper
export function generateCSPHeader(): string {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' wss: ws:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
  
  return directives.join('; ')
}
