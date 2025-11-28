// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation (minimum 8 characters)
export const validatePassword = (password) => {
  return password.length >= 8
}

// Phone number validation (Kenya format: +254...)
export const validatePhoneNumber = (phone) => {
  const phoneRegex = /^(\+254|0)[17]\d{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

// Format phone number to E.164 standard
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1)
  }
  return cleaned.startsWith('+') ? cleaned : '+' + cleaned
}

// Check password strength
export const getPasswordStrength = (password) => {
  let strength = 0
  if (password.length >= 8) strength++
  if (password.length >= 12) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[^a-zA-Z0-9]/.test(password)) strength++

  if (strength <= 2) return { level: 'weak', color: 'error-red' }
  if (strength <= 3) return { level: 'medium', color: 'warning-orange' }
  return { level: 'strong', color: 'success-green' }
}
