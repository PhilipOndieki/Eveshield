import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import OptimizedImage from '../OptimizedImage'

describe('OptimizedImage Component', () => {
  it('should render image with src and alt', () => {
    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test Image"
      />
    )
    
    const img = screen.getByAltText('Test Image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('should apply loading attribute', () => {
    const { rerender } = render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test"
        loading="lazy"
      />
    )
    
    expect(screen.getByAltText('Test')).toHaveAttribute('loading', 'lazy')
    
    rerender(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test"
        loading="eager"
      />
    )
    
    expect(screen.getByAltText('Test')).toHaveAttribute('loading', 'eager')
  })

  it('should show fallback on error', async () => {
    render(
      <OptimizedImage
        src="https://example.com/broken.jpg"
        alt="Test"
        fallback="https://example.com/fallback.jpg"
      />
    )
    
    const img = screen.getByAltText('Test')
    
    // Simulate image error
    fireEvent.error(img)
    
    await waitFor(() => {
      expect(img).toHaveAttribute('src', 'https://example.com/fallback.jpg')
    })
  })

  it('should show error message when no fallback provided', async () => {
    render(
      <OptimizedImage
        src="https://example.com/broken.jpg"
        alt="Test"
      />
    )
    
    const img = screen.getByAltText('Test')
    fireEvent.error(img)
    
    await waitFor(() => {
      expect(screen.getByText('Image unavailable')).toBeInTheDocument()
    })
  })

  it('should apply custom className', () => {
    render(
      <OptimizedImage
        src="https://example.com/image.jpg"
        alt="Test"
        className="custom-class"
      />
    )
    
    expect(screen.getByAltText('Test')).toHaveClass('custom-class')
  })
})