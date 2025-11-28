const Card = ({
  children,
  className = '',
  padding = 'medium',
  hover = false,
  borderColor = null,
}) => {
  const paddingClasses = {
    none: '',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  }

  const baseClasses = 'bg-white rounded-lg shadow-md'
  const hoverClasses = hover ? 'hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer' : ''
  const borderClasses = borderColor ? `border-l-4 border-${borderColor}` : ''

  return (
    <div className={`
      ${baseClasses}
      ${paddingClasses[padding]}
      ${hoverClasses}
      ${borderClasses}
      ${className}
    `}>
      {children}
    </div>
  )
}

export default Card
