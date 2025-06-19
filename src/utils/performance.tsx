import React from 'react'

export function createLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFn)
  
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <React.Suspense fallback={fallback ? <fallback /> : <div>Loading...</div>}>
      <LazyComponent {...props} ref={ref} />
    </React.Suspense>
  ))
}

// Memoization helper for expensive calculations
export function useMemoizedValue<T>(
  fn: () => T,
  deps: React.DependencyList
): T {
  return React.useMemo(fn, deps)
}

// Virtual scrolling for large lists
export function useVirtualization<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 5,
}: {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = React.useState(0)

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
    setScrollTop,
  }
}

export function useOptimizedImage(src: string, options?: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'png' | 'jpg'
  }) {
    const [isLoaded, setIsLoaded] = React.useState(false)
    const [hasError, setHasError] = React.useState(false)
  
    const optimizedSrc = React.useMemo(() => {
      if (!options) return src
      
      const params = new URLSearchParams()
      if (options.width) params.set('w', options.width.toString())
      if (options.height) params.set('h', options.height.toString())
      if (options.quality) params.set('q', options.quality.toString())
      if (options.format) params.set('f', options.format)
      
      return `${src}?${params.toString()}`
    }, [src, options])
  
    React.useEffect(() => {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.onerror = () => setHasError(true)
      img.src = optimizedSrc
    }, [optimizedSrc])
  
    return { src: optimizedSrc, isLoaded, hasError }
  }
  
  // Intersection Observer hook for lazy loading
  export function useIntersectionObserver(
    options?: IntersectionObserverInit
  ) {
    const [isIntersecting, setIsIntersecting] = React.useState(false)
    const [element, setElement] = React.useState<Element | null>(null)
  
    React.useEffect(() => {
      if (!element) return
  
      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting)
      }, options)
  
      observer.observe(element)
      return () => observer.disconnect()
    }, [element, options])
  
    return [setElement, isIntersecting] as const
  }
  