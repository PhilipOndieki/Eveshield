import { describe, it, expect } from 'vitest'
import {
  formatDate,
  formatTime,
  formatDateTime,
  getTimeAgo,
  calculateDistance,
  getInitials,
  getSeverityColor,
  getSeverityLabel,
  generateIncidentNumber,
} from '../helpers'

describe('Helper Functions', () => {
  describe('getInitials', () => {
    it('should extract initials from names', () => {
      expect(getInitials('John Doe')).toBe('JD')
      expect(getInitials('Alice Bob Charlie')).toBe('AB')
      expect(getInitials('Test')).toBe('T')
    })

    it('should handle edge cases', () => {
      expect(getInitials('')).toBe('??')
      expect(getInitials(null)).toBe('??')
      expect(getInitials(undefined)).toBe('??')
    })
  })

  describe('getSeverityColor', () => {
    it('should return correct color for each level', () => {
      expect(getSeverityColor(1)).toBe('concern')
      expect(getSeverityColor(2)).toBe('immediate')
      expect(getSeverityColor(3)).toBe('critical')
      expect(getSeverityColor(99)).toBe('warm-gray')
    })
  })

  describe('getSeverityLabel', () => {
    it('should return correct label for each level', () => {
      expect(getSeverityLabel(1)).toBe('Level 1 - Concern')
      expect(getSeverityLabel(2)).toBe('Level 2 - Immediate')
      expect(getSeverityLabel(3)).toBe('Level 3 - CRITICAL')
      expect(getSeverityLabel(99)).toBe('Unknown')
    })
  })

  describe('generateIncidentNumber', () => {
    it('should generate unique incident numbers', () => {
      const num1 = generateIncidentNumber()
      const num2 = generateIncidentNumber()
      
      expect(num1).toMatch(/^INC-\d{4}-\d{3}$/)
      expect(num2).toMatch(/^INC-\d{4}-\d{3}$/)
      expect(num1).not.toBe(num2)
    })
  })

  describe('calculateDistance', () => {
    it('should calculate distance between coordinates', () => {
      // Nairobi to Mombasa (roughly 440km)
      const distance = calculateDistance(-1.2921, 36.8219, -4.0435, 39.6682)
      expect(distance).toContain('km')
    })

    it('should show meters for short distances', () => {
      // Very close points
      const distance = calculateDistance(-1.2921, 36.8219, -1.2922, 36.8220)
      expect(distance).toContain('m away')
    })
  })

  describe('formatDate', () => {
    it('should format Firestore timestamp', () => {
      const mockTimestamp = {
        toDate: () => new Date('2025-01-15T10:30:00'),
      }
      const formatted = formatDate(mockTimestamp)
      expect(formatted).toContain('January')
      expect(formatted).toContain('15')
      expect(formatted).toContain('2025')
    })

    it('should handle regular Date objects', () => {
      const date = new Date('2025-01-15T10:30:00')
      const formatted = formatDate(date)
      expect(formatted).toContain('January')
    })

    it('should return empty string for null', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
    })
  })

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const mockTimestamp = {
        toDate: () => new Date('2025-01-15T10:30:00'),
      }
      const formatted = formatTime(mockTimestamp)
      expect(formatted).toMatch(/\d{1,2}:\d{2}/)
    })
  })

  describe('getTimeAgo', () => {
    it('should return "Just now" for recent timestamps', () => {
      const now = {
        toDate: () => new Date(),
      }
      expect(getTimeAgo(now)).toBe('Just now')
    })

    it('should return minutes ago', () => {
      const fiveMinutesAgo = {
        toDate: () => new Date(Date.now() - 5 * 60000),
      }
      expect(getTimeAgo(fiveMinutesAgo)).toBe('5 minutes ago')
    })

    it('should return hours ago', () => {
      const twoHoursAgo = {
        toDate: () => new Date(Date.now() - 2 * 3600000),
      }
      expect(getTimeAgo(twoHoursAgo)).toBe('2 hours ago')
    })

    it('should return days ago', () => {
      const threeDaysAgo = {
        toDate: () => new Date(Date.now() - 3 * 86400000),
      }
      expect(getTimeAgo(threeDaysAgo)).toBe('3 days ago')
    })
  })
})