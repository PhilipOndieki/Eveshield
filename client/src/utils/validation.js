// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation (minimum 8 characters)
export const validatePassword = (password) => {
  return password.length >= 8
}

// International phone number validation (supports multiple countries)
export const validatePhoneNumber = (phone) => {
  // Remove all spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  // Check if it's a valid international format
  // Must start with + followed by 1-3 digit country code and 4-15 digits
  const internationalRegex = /^\+[1-9]\d{6,14}$/
  
  // Or check if it's a Kenya local format (starting with 0)
  const kenyaLocalRegex = /^0[17]\d{8}$/
  
  return internationalRegex.test(cleaned) || kenyaLocalRegex.test(cleaned)
}

// Format phone number to E.164 standard
export const formatPhoneNumber = (phone, defaultCountryCode = '254') => {
  // Remove all spaces, dashes, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  
  // If already in international format, return as is
  if (cleaned.startsWith('+')) {
    return cleaned
  }
  
  // If starts with 0 (Kenya local format), replace with +254
  if (cleaned.startsWith('0')) {
    return '+' + defaultCountryCode + cleaned.substring(1)
  }
  
  // If no country code, add default
  if (!cleaned.startsWith('+')) {
    return '+' + cleaned
  }
  
  return cleaned
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

// Get country code from phone number
export const getCountryCode = (phone) => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (cleaned.startsWith('+')) {
    const match = cleaned.match(/^\+(\d{1,3})/)
    return match ? match[1] : '1'
  }
  return '254' // Default to Kenya
}

// Common country codes for dropdown
export const countryCodes = [
  { code: '1', name: 'United States/Canada', flag: '🇺🇸' },
  { code: '44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '254', name: 'Kenya', flag: '🇰🇪' },
  { code: '255', name: 'Tanzania', flag: '🇹🇿' },
  { code: '256', name: 'Uganda', flag: '🇺🇬' },
  { code: '27', name: 'South Africa', flag: '🇿🇦' },
  { code: '234', name: 'Nigeria', flag: '🇳🇬' },
  { code: '233', name: 'Ghana', flag: '🇬🇭' },
  { code: '91', name: 'India', flag: '🇮🇳' },
  { code: '86', name: 'China', flag: '🇨🇳' },
]