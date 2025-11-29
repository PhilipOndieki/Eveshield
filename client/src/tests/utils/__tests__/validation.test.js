import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
  formatPhoneNumber,
  detectCountry,
  getPasswordStrength,
} from '../validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.ke')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test @example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate passwords with 8+ characters', () => {
      expect(validatePassword('password123')).toBe(true)
      expect(validatePassword('12345678')).toBe(true)
      expect(validatePassword('verylongpassword')).toBe(true)
    })

    it('should reject passwords with less than 8 characters', () => {
      expect(validatePassword('short')).toBe(false)
      expect(validatePassword('1234567')).toBe(false)
      expect(validatePassword('')).toBe(false)
    })
  })

  describe('validatePhoneNumber', () => {
    it('should validate Kenyan phone numbers', () => {
      expect(validatePhoneNumber('+254712345678')).toBe(true)
      expect(validatePhoneNumber('+254722345678')).toBe(true)
      expect(validatePhoneNumber('0712345678')).toBe(true)
      expect(validatePhoneNumber('0722345678')).toBe(true)
    })

    it('should validate other African country numbers', () => {
      expect(validatePhoneNumber('+234 803 456 7890')).toBe(true) // Nigeria
      expect(validatePhoneNumber('+233 24 345 6789')).toBe(true) // Ghana
      expect(validatePhoneNumber('+27 82 345 6789')).toBe(true) // South Africa
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('12345')).toBe(false)
      expect(validatePhoneNumber('+254 12345')).toBe(false)
      expect(validatePhoneNumber('invalid')).toBe(false)
      expect(validatePhoneNumber('')).toBe(false)
    })
  })

  describe('formatPhoneNumber', () => {
    it('should format Kenyan local numbers to E.164', () => {
      expect(formatPhoneNumber('0712345678')).toBe('+254712345678')
      expect(formatPhoneNumber('0722345678')).toBe('+254722345678')
    })

    it('should preserve already formatted numbers', () => {
      expect(formatPhoneNumber('+254712345678')).toBe('+254712345678')
      expect(formatPhoneNumber('+234 803 456 7890')).toBe('+2348034567890')
    })

    it('should add + prefix to numbers without it', () => {
      expect(formatPhoneNumber('254712345678')).toBe('+254712345678')
    })
  })

  describe('detectCountry', () => {
    it('should detect country from phone number', () => {
      expect(detectCountry('+254712345678')).toBe('Kenya')
      expect(detectCountry('+234 803 456 7890')).toBe('Nigeria')
      expect(detectCountry('+233 24 345 6789')).toBe('Ghana')
      expect(detectCountry('+27 82 345 6789')).toBe('South Africa')
    })

    it('should return null for invalid numbers', () => {
      expect(detectCountry('12345')).toBe(null)
      expect(detectCountry('')).toBe(null)
    })
  })

  describe('getPasswordStrength', () => {
    it('should return weak for simple passwords', () => {
      expect(getPasswordStrength('12345678')).toEqual({
        level: 'weak',
        color: 'error-red',
      })
      expect(getPasswordStrength('password')).toEqual({
        level: 'weak',
        color: 'error-red',
      })
    })

    it('should return medium for moderate passwords', () => {
      expect(getPasswordStrength('Password123')).toEqual({
        level: 'medium',
        color: 'warning-orange',
      })
    })

    it('should return strong for complex passwords', () => {
      expect(getPasswordStrength('P@ssw0rd123!')).toEqual({
        level: 'strong',
        color: 'success-green',
      })
    })
  })
})