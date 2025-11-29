import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../../../components/common/Card'

describe('Card Component', () => {
  it('should render children', () => {
    render(<Card>Test Content</Card>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should apply padding classes', () => {
    const { rerender, container } = render(
      <Card padding="none">Content</Card>
    )
    expect(container.firstChild).not.toHaveClass('p-4', 'p-6', 'p-8')
    
    rerender(<Card padding="small">Content</Card>)
    expect(container.firstChild).toHaveClass('p-4')
    
    rerender(<Card padding="medium">Content</Card>)
    expect(container.firstChild).toHaveClass('p-6')
    
    rerender(<Card padding="large">Content</Card>)
    expect(container.firstChild).toHaveClass('p-8')
  })

  it('should apply hover classes when hover is true', () => {
    const { container } = render(<Card hover>Content</Card>)
    expect(container.firstChild).toHaveClass(
      'hover:shadow-lg',
      'hover:scale-105'
    )
  })

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should have base classes', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.firstChild).toHaveClass(
      'bg-white',
      'rounded-lg',
      'shadow-md'
    )
  })
})