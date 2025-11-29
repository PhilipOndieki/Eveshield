/**
 * Paystack Payment Integration Utility
 * Handles payment initialization and verification for donations
 */

// Paystack Public Key - Store in .env file
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY

/**
 * Initialize Paystack payment
 * @param {Object} params - Payment parameters
 * @returns {Promise} - Payment response
 */
export const initializePayment = async ({
  email,
  amount, // in smallest currency unit (kobo for NGN, cents for ZAR, etc.)
  currency = 'KES',
  reference,
  metadata = {},
  callback_url,
}) => {
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_PUBLIC_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount,
        currency,
        reference,
        metadata,
        callback_url,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'],
      }),
    })

    const data = await response.json()
    
    if (!data.status) {
      throw new Error(data.message || 'Payment initialization failed')
    }

    return data
  } catch (error) {
    console.error('Paystack initialization error:', error)
    throw error
  }
}

/**
 * Verify Paystack payment
 * @param {string} reference - Transaction reference
 * @returns {Promise} - Verification response
 */
export const verifyPayment = async (reference) => {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PAYSTACK_PUBLIC_KEY}`,
      },
    })

    const data = await response.json()
    
    if (!data.status) {
      throw new Error(data.message || 'Payment verification failed')
    }

    return data
  } catch (error) {
    console.error('Paystack verification error:', error)
    throw error
  }
}

/**
 * Generate unique payment reference
 * @returns {string} - Unique reference
 */
export const generateReference = () => {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000000)
  return `EVESHIELD_${timestamp}_${random}`
}

/**
 * Convert amount to smallest currency unit
 * @param {number} amount - Amount in major currency unit
 * @param {string} currency - Currency code
 * @returns {number} - Amount in smallest unit
 */
export const convertToSubunit = (amount, currency = 'KES') => {
  // Most currencies use 100 subunits (cents, kobo, etc.)
  return Math.round(amount * 100)
}

/**
 * Get supported currencies for African countries
 */
export const SUPPORTED_CURRENCIES = [
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
]

/**
 * Load Paystack inline script
 * @returns {Promise} - Script loaded promise
 */
export const loadPaystackScript = () => {
  return new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve(window.PaystackPop)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v1/inline.js'
    script.onload = () => resolve(window.PaystackPop)
    script.onerror = () => reject(new Error('Failed to load Paystack script'))
    document.body.appendChild(script)
  })
}

/**
 * Open Paystack payment popup
 * @param {Object} params - Payment parameters
 * @returns {Promise} - Payment result
 */
export const openPaystackPopup = async ({
  email,
  amount,
  currency = 'KES',
  reference,
  metadata = {},
  onSuccess,
  onClose,
}) => {
  try {
    const PaystackPop = await loadPaystackScript()
    
    const handler = PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email,
      amount: convertToSubunit(amount, currency),
      currency,
      ref: reference,
      metadata,
      callback: (response) => {
        console.log('Payment successful:', response)
        onSuccess?.(response)
      },
      onClose: () => {
        console.log('Payment popup closed')
        onClose?.()
      },
    })

    handler.openIframe()
  } catch (error) {
    console.error('Error opening Paystack popup:', error)
    throw error
  }
}