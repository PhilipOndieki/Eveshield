import React from 'react'

/**
 * Optimized Image component with lazy loading, error handling, and accessibility
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  fallback,
  loading = 'lazy',
  objectFit = 'cover',
  onLoad,
  onError,
  ...props
}) => {
  const [imgSrc, setImgSrc] = React.useState(src)
  const [isLoading, setIsLoading] = React.useState(true)
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    setImgSrc(src)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  const handleLoad = (e) => {
    setIsLoading(false)
    onLoad?.(e)
  }

  const handleError = (e) => {
    setIsLoading(false)
    setHasError(true)
    if (fallback && imgSrc !== fallback) {
      setImgSrc(fallback)
    }
    onError?.(e)
  }

  const imgClasses = `
    ${className}
    ${isLoading ? 'opacity-0' : 'opacity-100'}
    transition-opacity duration-300
  `.trim()

  return (
    <div className="relative overflow-hidden" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-pale-blue animate-pulse" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={imgClasses}
        loading={loading}
        onLoad={handleLoad}
        onError={handleError}
        style={{ objectFit, width: '100%', height: '100%' }}
        {...props}
      />
      {hasError && !fallback && (
        <div className="absolute inset-0 flex items-center justify-center bg-pale-blue">
          <span className="text-warm-gray text-sm">Image unavailable</span>
        </div>
      )}
    </div>
  )
}

export default React.memo(OptimizedImage)
