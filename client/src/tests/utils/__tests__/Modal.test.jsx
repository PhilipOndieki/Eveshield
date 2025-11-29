import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from '../Modal'

describe('Modal Component', () => {
  it('should not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Test Modal">
        Content
      </Modal>
    )
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test Modal">
        Content
      </Modal>
    )
    expect(screen.getByText('Test Modal')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    )
    
    const closeButton = screen.getByRole('button')
    fireEvent.click(closeButton)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should call onClose when overlay is clicked', () => {
    const handleClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Content
      </Modal>
    )
    
    const overlay = document.querySelector('.fixed.inset-0.bg-black')
    fireEvent.click(overlay)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('should apply size classes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={vi.fn()} title="Test" size="small">
        Content
      </Modal>
    )
    expect(document.querySelector('.max-w-md')).toBeInTheDocument()
    
    rerender(
      <Modal isOpen={true} onClose={vi.fn()} title="Test" size="medium">
        Content
      </Modal>
    )
    expect(document.querySelector('.max-w-2xl')).toBeInTheDocument()
    
    rerender(
      <Modal isOpen={true} onClose={vi.fn()} title="Test" size="large">
        Content
      </Modal>
    )
    expect(document.querySelector('.max-w-4xl')).toBeInTheDocument()
  })
})