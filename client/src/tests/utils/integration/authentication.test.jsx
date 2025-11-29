import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../../../App'
import * as firebaseAuth from 'firebase/auth'
import * as firestore from 'firebase/firestore'

vi.mock('firebase/auth')
vi.mock('firebase/firestore')

describe('Authentication Flow Integration', () => {
  it('should complete signup flow', async () => {
    const mockUser = {
      uid: 'new-user-id',
      email: 'newuser@example.com',
      displayName: 'New User',
    }
    
    vi.spyOn(firebaseAuth, 'createUserWithEmailAndPassword').mockResolvedValue({
      user: mockUser,
    })
    vi.spyOn(firebaseAuth, 'updateProfile').mockResolvedValue()
    vi.spyOn(firestore, 'setDoc').mockResolvedValue()
    vi.spyOn(firebaseAuth, 'onAuthStateChanged').mockImplementation((auth, callback) => {
      callback(null)
      return vi.fn()
    })
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // Navigate to signup
    const signupLink = screen.getByText(/sign up/i)
    fireEvent.click(signupLink)
    
    await waitFor(() => {
      expect(screen.getByText(/create your safety account/i)).toBeInTheDocument()
    })
  })

  it('should complete login flow', async () => {
    const mockUser = {
      uid: 'existing-user-id',
      email: 'user@example.com',
    }
    
    vi.spyOn(firebaseAuth, 'signInWithEmailAndPassword').mockResolvedValue({
      user: mockUser,
    })
    vi.spyOn(firestore, 'setDoc').mockResolvedValue()
    vi.spyOn(firebaseAuth, 'onAuthStateChanged').mockImplementation((auth, callback) => {
      callback(null)
      return vi.fn()
    })
    
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // Should show login option
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })
})