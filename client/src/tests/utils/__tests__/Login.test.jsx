import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../Login'
import { AuthProvider } from '../../context/AuthContext'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../context/AuthContext')
  return {
    ...actual,
    useAuth: () => ({
      login: vi.fn().mockResolvedValue({}),
      signInWithGoogle: vi.fn().mockResolvedValue({}),
    }),
  }
})

describe('Login Page', () => {
  it('should render login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in to eveshield/i })).toBeInTheDocument()
  })

  it('should show validation errors for empty fields', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    
    const submitButton = screen.getByRole('button', { name: /sign in to eveshield/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('should show validation error for invalid email', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    
    const emailInput = screen.getByLabelText(/email address/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    
    const submitButton = screen.getByRole('button', { name: /sign in to eveshield/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('should toggle password visibility', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    
    const passwordInput = screen.getByLabelText(/password/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    const toggleButton = passwordInput.nextElementSibling
    fireEvent.click(toggleButton)
    
    expect(passwordInput).toHaveAttribute('type', 'text')
  })

  it('should have link to signup page', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
    
    const signupLink = screen.getByText(/create one/i)
    expect(signupLink).toHaveAttribute('href', '/signup')
  })
})