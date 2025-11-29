import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from '../../../context/AuthContext'
import * as firebaseAuth from 'firebase/auth'
import * as firestore from 'firebase/firestore'

// Test component that uses the auth context
function TestComponent() {
  const auth = useAuth()
  
  return (
    <div>
      <div data-testid="current-user">{auth.currentUser?.email || 'null'}</div>
      <div data-testid="loading">{String(auth.loading)}</div>
      <button onClick={() => auth.login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={auth.logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  it('should provide auth context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('current-user')).toBeInTheDocument()
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    spy.mockRestore()
  })

  it('should handle login', async () => {
    const mockUser = { uid: 'test-uid', email: 'test@example.com' }
    vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValue({
      user: mockUser,
    })
    vi.mocked(firestore.setDoc).mockResolvedValue()
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    const loginButton = screen.getByText('Login')
    loginButton.click()
    
    await waitFor(() => {
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled()
    })
  })

  it('should handle logout', async () => {
    vi.mocked(firebaseAuth.signOut).mockResolvedValue()
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    const logoutButton = screen.getByText('Logout')
    logoutButton.click()
    
    await waitFor(() => {
      expect(firebaseAuth.signOut).toHaveBeenCalled()
    })
  })
})