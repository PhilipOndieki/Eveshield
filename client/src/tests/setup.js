import { expect, afterEach, vi, beforeAll, afterAll } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Mock Firebase modules
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
  getApp: vi.fn(() => ({})),
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({
    currentUser: null,
    onAuthStateChanged: vi.fn((callback) => {
      callback(null)
      return vi.fn() // unsubscribe function
    }),
  })),
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
  updateProfile: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
}))

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
  collection: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  addDoc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  deleteDoc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  onSnapshot: vi.fn(),
  serverTimestamp: vi.fn(() => new Date()),
}))

vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(() => ({})),
  ref: vi.fn(),
  uploadBytes: vi.fn(),
  getDownloadURL: vi.fn(),
}))

// Mock environment variables
process.env.VITE_FIREBASE_API_KEY = 'test-api-key'
process.env.VITE_FIREBASE_AUTH_DOMAIN = 'test-auth-domain'
process.env.VITE_FIREBASE_PROJECT_ID = 'test-project-id'
process.env.VITE_FIREBASE_STORAGE_BUCKET = 'test-storage-bucket'
process.env.VITE_FIREBASE_MESSAGING_SENDER_ID = 'test-sender-id'
process.env.VITE_FIREBASE_APP_ID = 'test-app-id'
process.env.VITE_GEMINI_API_KEY = 'test-gemini-key'
process.env.VITE_PAYSTACK_PUBLIC_KEY = 'pk_test_key'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn((success) =>
    Promise.resolve(
      success({
        coords: {
          latitude: -1.2921,
          longitude: 36.8219,
          accuracy: 10,
        },
      })
    )
  ),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
}

Object.defineProperty(global.navigator, 'geolocation', {
  writable: true,
  value: mockGeolocation,
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Setup MSW server for API mocking
export const handlers = [
  // Mock Gemini API
  http.post('https://generativelanguage.googleapis.com/*', () => {
    return HttpResponse.json({
      candidates: [
        {
          content: {
            parts: [{ text: 'Mock AI response' }],
          },
        },
      ],
    })
  }),

  // Mock Paystack API
  http.post('https://api.paystack.co/transaction/initialize', () => {
    return HttpResponse.json({
      status: true,
      message: 'Authorization URL created',
      data: {
        authorization_url: 'https://checkout.paystack.com/test',
        access_code: 'test_access_code',
        reference: 'test_reference',
      },
    })
  }),

  http.get('https://api.paystack.co/transaction/verify/:reference', () => {
    return HttpResponse.json({
      status: true,
      message: 'Verification successful',
      data: {
        status: 'success',
        amount: 10000,
        channel: 'card',
      },
    })
  }),

  // Mock OpenStreetMap Nominatim API
  http.get('https://nominatim.openstreetmap.org/reverse', () => {
    return HttpResponse.json({
      address: {
        road: 'Kenyatta Avenue',
        suburb: 'Central Business District',
        city: 'Nairobi',
        county: 'Nairobi',
        country: 'Kenya',
      },
    })
  }),
]

export const server = setupServer(...handlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))

// Reset handlers after each test
afterEach(() => server.resetHandlers())

// Clean up after all tests
afterAll(() => server.close())

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
}