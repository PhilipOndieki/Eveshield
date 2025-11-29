import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  generateReference,
  convertToSubunit,
  SUPPORTED_CURRENCIES,
  loadPaystackScript,
} from '../paystack'

describe('Paystack Utils', () => {
  describe('generateReference', () => {
    it('should generate unique references', () => {
      const ref1 = generateReference()
      const ref2 = generateReference()
      
      expect(ref1).toMatch(/^EVESHIELD_\d+_\d+$/)
      expect(ref2).toMatch(/^EVESHIELD_\d+_\d+$/)
      expect(ref1).not.toBe(ref2)
    })
  })

  describe('convertToSubunit', () => {
    it('should convert amount to smallest unit', () => {
      expect(convertToSubunit(100, 'KES')).toBe(10000)
      expect(convertToSubunit(50.50, 'NGN')).toBe(5050)
      expect(convertToSubunit(1, 'USD')).toBe(100)
    })

    it('should handle decimals correctly', () => {
      expect(convertToSubunit(99.99, 'KES')).toBe(9999)
    })
  })

  describe('SUPPORTED_CURRENCIES', () => {
    it('should have correct structure', () => {
      expect(SUPPORTED_CURRENCIES).toBeInstanceOf(Array)
      expect(SUPPORTED_CURRENCIES.length).toBeGreaterThan(0)
      
      SUPPORTED_CURRENCIES.forEach(currency => {
        expect(currency).toHaveProperty('code')
        expect(currency).toHaveProperty('name')
        expect(currency).toHaveProperty('symbol')
      })
    })

    it('should include major African currencies', () => {
      const codes = SUPPORTED_CURRENCIES.map(c => c.code)
      expect(codes).toContain('KES')
      expect(codes).toContain('NGN')
      expect(codes).toContain('GHS')
      expect(codes).toContain('ZAR')
    })
  })

  describe('loadPaystackScript', () => {
    beforeEach(() => {
      delete window.PaystackPop
      document.body.innerHTML = ''
    })

    it('should load Paystack script', async () => {
      window.PaystackPop = {}
      const result = await loadPaystackScript()
      expect(result).toBeDefined()
    })

    it('should return existing PaystackPop if already loaded', async () => {
      window.PaystackPop = { test: 'value' }
      const result = await loadPaystackScript()
      expect(result).toEqual({ test: 'value' })
    })
  })
})