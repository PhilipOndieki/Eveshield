import { X } from 'lucide-react'
import { useEffect } from 'react'

const Modal = ({ isOpen, onClose, title, children, size = 'medium' }) => {
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl',
    full: 'max-w-7xl',
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className={`relative bg-white rounded-lg shadow-2xl ${sizeClasses[size]} w-full mx-auto`}>
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-light-gray">
            <h2 className="text-2xl font-bold text-dark-charcoal">{title}</h2>
            <button
              onClick={onClose}
              className="text-warm-gray hover:text-dark-charcoal transition-colors p-1 rounded-full hover:bg-light-gray"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
