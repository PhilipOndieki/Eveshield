import { render } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { vi } from 'vitest'

// Mock auth context value
export const mockAuthContextValue = {
  currentUser: {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
  },
  userProfile: {
    fullName: 'Test User',
    email: 'test@example.com',
    phoneNumber: '+254712345678',
  },
  signup: vi.fn(),
  signInWithGoogle: vi.fn(),
  login: vi.fn(),
  logout: vi.fn(),
  resetPassword: vi.fn(),
  loading: false,
  error: null,
}

// Custom render function
export function renderWithRouter(ui, { route = '/', ...renderOptions } = {}) {
  window.history.pushState({}, 'Test page', route)

  return render(ui, {
    wrapper: ({ children }) => <BrowserRouter>{children}</BrowserRouter>,
    ...renderOptions,
  })
}

// Create mock context provider
export function createMockAuthProvider(overrides = {}) {
  const mockContext = { ...mockAuthContextValue, ...overrides }
  
  return function MockAuthProvider({ children }) {
    return children
  }
}

// Helper to wait for async updates
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0))

// Mock Firestore data
export const mockFirestoreData = {
  users: {
    'test-user-id': {
      fullName: 'Test User',
      email: 'test@example.com',
      phoneNumber: '+254712345678',
      createdAt: new Date(),
    },
  },
  connections: [],
  chats: {},
  notifications: [],
  incidents: [],
  donations: [],
}

// Helper to create mock Firestore response
export function createMockFirestoreResponse(data, exists = true) {
  return {
    exists: () => exists,
    data: () => data,
    id: 'mock-doc-id',
  }
}

// Helper to create mock Firestore collection response
export function createMockFirestoreCollectionResponse(docs = []) {
  return {
    docs: docs.map((data, index) => ({
      id: `mock-doc-${index}`,
      data: () => data,
      exists: () => true,
    })),
    empty: docs.length === 0,
    size: docs.length,
  }
}