import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../../../pages/Dashboard'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

vi.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { uid: 'test-uid', email: 'test@example.com' },
    userProfile: { fullName: 'Test User', email: 'test@example.com' },
  }),
}))

describe('Dashboard Page', () => {
  it('should render welcome message with user name', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    expect(screen.getByText(/welcome back, test user/i)).toBeInTheDocument()
  })

  it('should render emergency alert card', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Emergency Alert')).toBeInTheDocument()
    expect(screen.getByText(/one tap to alert your safety network/i)).toBeInTheDocument()
  })

  it('should render safety status card', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Safety Status')).toBeInTheDocument()
    expect(screen.getByText('Safe')).toBeInTheDocument()
  })

  it('should render emergency contacts summary', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Emergency Contacts')).toBeInTheDocument()
    expect(screen.getByText(/of 5 contacts/i)).toBeInTheDocument()
  })

  it('should render trusted bystanders card', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Trusted Bystanders')).toBeInTheDocument()
    expect(screen.getByText(/responders/i)).toBeInTheDocument()
  })

  it('should render quick resources', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Quick Resources')).toBeInTheDocument()
    expect(screen.getByText('GBV Hotline')).toBeInTheDocument()
    expect(screen.getByText('1195')).toBeInTheDocument()
  })

  it('should render getting started checklist', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Complete Your Safety Setup')).toBeInTheDocument()
    expect(screen.getByText(/add at least 3 emergency contacts/i)).toBeInTheDocument()
  })
})