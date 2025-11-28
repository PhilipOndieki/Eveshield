const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  className = '',
}) => {
  const baseClasses = 'font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantClasses = {
    primary: 'bg-deep-rose text-white hover:bg-opacity-90 focus:ring-deep-rose',
    secondary: 'border-2 border-deep-rose text-deep-rose hover:bg-deep-rose hover:text-white focus:ring-deep-rose',
    outline: 'border-2 border-white text-white hover:bg-white hover:text-deep-rose focus:ring-white',
    success: 'bg-success-green text-white hover:bg-opacity-90 focus:ring-success-green',
    danger: 'bg-error-red text-white hover:bg-opacity-90 focus:ring-error-red',
    warning: 'bg-warning-orange text-white hover:bg-opacity-90 focus:ring-warning-orange',
  }

  const sizeClasses = {
    small: 'px-4 py-2 text-sm rounded-md',
    medium: 'px-6 py-3 text-base rounded-lg',
    large: 'px-8 py-4 text-lg rounded-full',
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  const widthClasses = fullWidth ? 'w-full' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${disabledClasses}
        ${widthClasses}
        ${className}
      `}
    >
      {children}
    </button>
  )
}

export default Button
