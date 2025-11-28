// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password validation (minimum 8 characters)
export const validatePassword = (password) => {
  return password.length >= 8
}

// Pan-African country codes (all 54 African countries)
export const africanCountryCodes = {
  '+20': { country: 'Egypt', length: [10] },
  '+211': { country: 'South Sudan', length: [9] },
  '+212': { country: 'Morocco/Western Sahara', length: [9] },
  '+213': { country: 'Algeria', length: [9] },
  '+216': { country: 'Tunisia', length: [8] },
  '+218': { country: 'Libya', length: [10] },
  '+220': { country: 'Gambia', length: [7] },
  '+221': { country: 'Senegal', length: [9] },
  '+222': { country: 'Mauritania', length: [8] },
  '+223': { country: 'Mali', length: [8] },
  '+224': { country: 'Guinea', length: [9] },
  '+225': { country: 'Ivory Coast', length: [10] },
  '+226': { country: 'Burkina Faso', length: [8] },
  '+227': { country: 'Niger', length: [8] },
  '+228': { country: 'Togo', length: [8] },
  '+229': { country: 'Benin', length: [8] },
  '+230': { country: 'Mauritius', length: [8] },
  '+231': { country: 'Liberia', length: [7, 8] },
  '+232': { country: 'Sierra Leone', length: [8] },
  '+233': { country: 'Ghana', length: [9] },
  '+234': { country: 'Nigeria', length: [10] },
  '+235': { country: 'Chad', length: [8] },
  '+236': { country: 'Central African Republic', length: [8] },
  '+237': { country: 'Cameroon', length: [9] },
  '+238': { country: 'Cape Verde', length: [7] },
  '+239': { country: 'Sao Tome and Principe', length: [7] },
  '+240': { country: 'Equatorial Guinea', length: [9] },
  '+241': { country: 'Gabon', length: [7, 8] },
  '+242': { country: 'Republic of Congo', length: [9] },
  '+243': { country: 'Democratic Republic of Congo', length: [9] },
  '+244': { country: 'Angola', length: [9] },
  '+245': { country: 'Guinea-Bissau', length: [7] },
  '+246': { country: 'British Indian Ocean Territory', length: [7] },
  '+248': { country: 'Seychelles', length: [7] },
  '+249': { country: 'Sudan', length: [9] },
  '+250': { country: 'Rwanda', length: [9] },
  '+251': { country: 'Ethiopia', length: [9] },
  '+252': { country: 'Somalia', length: [8, 9] },
  '+253': { country: 'Djibouti', length: [8] },
  '+254': { country: 'Kenya', length: [9] },
  '+255': { country: 'Tanzania', length: [9] },
  '+256': { country: 'Uganda', length: [9] },
  '+257': { country: 'Burundi', length: [8] },
  '+258': { country: 'Mozambique', length: [9] },
  '+260': { country: 'Zambia', length: [9] },
  '+261': { country: 'Madagascar', length: [9, 10] },
  '+262': { country: 'Reunion/Mayotte', length: [9] },
  '+263': { country: 'Zimbabwe', length: [9] },
  '+264': { country: 'Namibia', length: [9] },
  '+265': { country: 'Malawi', length: [9] },
  '+266': { country: 'Lesotho', length: [8] },
  '+267': { country: 'Botswana', length: [8] },
  '+268': { country: 'Eswatini', length: [8] },
  '+269': { country: 'Comoros', length: [7] },
  '+27': { country: 'South Africa', length: [9] },
  '+290': { country: 'Saint Helena', length: [4] },
  '+291': { country: 'Eritrea', length: [7] },
}

// Phone number validation (Pan-African)
export const validatePhoneNumber = (phone) => {
  const cleaned = phone.replace(/[\s\-()]/g, '')

  // Check if starts with +
  if (!cleaned.startsWith('+')) {
    // If starts with 0, it's likely a local number (Kenya)
    if (cleaned.startsWith('0')) {
      return /^0[17]\d{8}$/.test(cleaned)
    }
    return false
  }

  // Find matching country code
  for (const [code, info] of Object.entries(africanCountryCodes)) {
    if (cleaned.startsWith(code)) {
      const numberWithoutCode = cleaned.substring(code.length)
      const isValidLength = info.length.includes(numberWithoutCode.length)
      const isNumeric = /^\d+$/.test(numberWithoutCode)
      return isValidLength && isNumeric
    }
  }

  return false
}

// Format phone number to E.164 standard
export const formatPhoneNumber = (phone) => {
  const cleaned = phone.replace(/[\s\-()]/g, '')

  // If it starts with 0, assume it's a Kenyan number
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1)
  }

  // If it already starts with +, return as is
  if (cleaned.startsWith('+')) {
    return cleaned
  }

  // Otherwise, add + prefix
  return '+' + cleaned
}

// Detect country from phone number
export const detectCountry = (phone) => {
  const cleaned = phone.replace(/[\s\-()]/g, '')

  for (const [code, info] of Object.entries(africanCountryCodes)) {
    if (cleaned.startsWith(code)) {
      return info.country
    }
  }

  return null
}

// Get validation error message
export const getPhoneValidationError = (phone) => {
  const cleaned = phone.replace(/[\s\-()]/g, '')

  if (!cleaned) {
    return 'Phone number is required'
  }

  if (!cleaned.startsWith('+') && !cleaned.startsWith('0')) {
    return 'Phone number must start with + (country code) or 0 (local)'
  }

  const country = detectCountry(cleaned)
  if (country) {
    return `Invalid phone number format for ${country}`
  }

  return 'Invalid phone number. Use format: +XXX XXXXXXXXX (e.g., +254 712 345 678)'
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
