import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../../../components/common/Button'

describe('Button Component', () => {
  it('should render with children', () => {
    render(<Button>Click Me</Button>)
    expect(screen.getByText('Click Me')).toBeInTheDocument()
  })

  it('should handle click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    
    fireEvent.click(screen.getByText('Click'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByText('Primary')).toHaveClass('bg-deep-rose')
    
    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByText('Secondary')).toHaveClass('border-2')
    
    rerender(<Button variant="success">Success</Button>)
    expect(screen.getByText('Success')).toHaveClass('bg-success-green')
  })

  it('should apply size classes', () => {
    const { rerender } = render(<Button size="small">Small</Button>)
    expect(screen.getByText('Small')).toHaveClass('px-4', 'py-2')
    
    rerender(<Button size="medium">Medium</Button>)
    expect(screen.getByText('Medium')).toHaveClass('px-6', 'py-3')
    
    rerender(<Button size="large">Large</Button>)
    expect(screen.getByText('Large')).toHaveClass('px-8', 'py-4')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByText('Disabled')
    
    expect(button).toBeDisabled()
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed')
  })

  it('should apply fullWidth class', () => {
    render(<Button fullWidth>Full Width</Button>)
    expect(screen.getByText('Full Width')).toHaveClass('w-full')
  })

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>)
    expect(screen.getByText('Custom')).toHaveClass('custom-class')
  })

  it('should have correct button type', () => {
    const { rerender } = render(<Button type="submit">Submit</Button>)
    expect(screen.getByText('Submit')).toHaveAttribute('type', 'submit')
    
    rerender(<Button type="button">Button</Button>)
    expect(screen.getByText('Button')).toHaveAttribute('type', 'button')
  })
})