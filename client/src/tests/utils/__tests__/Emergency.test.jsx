import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Emergency from '../../../pages/Emergency'
import * as firestore from 'firebase/firestore'

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
    currentUser: { uid: 'test-uid' },
  }),
}))

vi.mock('firebase/firestore')

describe('Emergency Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock geolocation
    global.navigator.geolocation = {
      getCurrentPosition: vi.fn((success) =>
        success({
          coords: {
            latitude: -1.2921,
            longitude: 36.8219,
            accuracy: 10,
          },
        })
      ),
    }
  })

  it('should render severity level selection', () => {
    render(
      <BrowserRouter>
        <Emergency />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Emergency Alert')).toBeInTheDocument()
    expect(screen.getByText(/i feel unsafe/i)).toBeInTheDocument()
    expect(screen.getByText(/i need help now/i)).toBeInTheDocument()
    expect(screen.getByText(/emergency - life in danger/i)).toBeInTheDocument()
  })

  it('should show confirmation screen after selecting level', () => {
    render(
      <BrowserRouter>
        <Emergency />
      </BrowserRouter>
    )
    
    const level2Button = screen.getByText(/i need help now/i)
    fireEvent.click(level2Button)
    
    expect(screen.getByText('Confirm Alert')).toBeInTheDocument()
    expect(screen.getByText(/your location/i)).toBeInTheDocument()
  })

  it('should display location information', async () => {
    render(
      <BrowserRouter>
        <Emergency />
      </BrowserRouter>
    )
    
    const level2Button = screen.getByText(/i need help now/i)
    fireEvent.click(level2Button)
    
    await waitFor(() => {
      expect(screen.getByText(/latitude/i)).toBeInTheDocument()
      expect(screen.getByText(/longitude/i)).toBeInTheDocument()
    })
  })

  it('should allow adding additional information', () => {
    render(
      <BrowserRouter>
        <Emergency />
      </BrowserRouter>
    )
    
    const level1Button = screen.getByText(/i feel unsafe/i)
    fireEvent.click(level1Button)
    
    const textarea = screen.getByPlaceholderText(/describe what's happening/i)
    fireEvent.change(textarea, { target: { value: 'Test note' } })
    
    expect(textarea).toHaveValue('Test note')
  })

  it('should send alert when confirmed', async () => {
    vi.spyOn(firestore, 'addDoc').mockResolvedValue({ id: 'test-incident-id' })
    
    render(
      <BrowserRouter>
        <Emergency />
      </BrowserRouter>
    )
    
    const level3Button = screen.getByText(/emergency - life in danger/i)
    fireEvent.click(level3Button)
    
    const sendButton = screen.getByRole('button', { name: /send alert now/i })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(firestore.addDoc).toHaveBeenCalled()
    })
  })

  it('should show success screen after sending alert', async () => {
    vi.spyOn(firestore, 'addDoc').mockResolvedValue({ id: 'test-incident-id' })
    
    render(
      <BrowserRouter>
        <Emergency />
      </BrowserRouter>
    )
    
    const level2Button = screen.getByText(/i need help now/i)
    fireEvent.click(level2Button)
    
    const sendButton = screen.getByRole('button', { name: /send alert now/i })
    fireEvent.click(sendButton)
    
    await waitFor(() => {
      expect(screen.getByText('Alert Sent Successfully')).toBeInTheDocument()
    })
  })
})