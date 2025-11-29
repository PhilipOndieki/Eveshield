import React from 'react'
import OptimizedImage from './OptimizedImage'

/**
 * Empty state component with optional image
 */
const EmptyState = ({
  icon: Icon,
  image,
  title,
  description,
  action,
  actionLabel,
  className = '',
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      {image && (
        <div className="mb-6 flex justify-center">
          <OptimizedImage
            src={image}
            alt={title}
            className="rounded-lg shadow-md"
            width="300px"
            height="200px"
            objectFit="cover"
          />
        </div>
      )}
      {Icon && !image && (
        <div className="bg-pale-blue rounded-full p-6 inline-block mb-6">
          <Icon className="text-medium-blue" size={64} />
        </div>
      )}
      <h2 className="text-2xl font-bold text-dark-charcoal mb-4">{title}</h2>
      {description && (
        <p className="text-warm-gray max-w-md mx-auto mb-6">{description}</p>
      )}
      {action && actionLabel && (
        <button
          onClick={action}
          className="px-6 py-3 bg-medium-blue text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

export default React.memo(EmptyState)
