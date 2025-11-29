import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Shield } from 'lucide-react'
import EmptyState from '../../../pages/'

describe('EmptyState Component', () => {
  it('should render title and description', () => {
    render(
      <EmptyState
        title="No Data"
        description="No items found"
      />
    )
    
    expect(screen.getByText('No Data')).toBeInTheDocument()
    expect(screen.getByText('No items found')).toBeInTheDocument()
  })

  it('should render icon when provided', () => {
    const { container } = render(
      <EmptyState
        icon={Shield}
        title="No Data"
      />
    )
    
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('should render action button when provided', () => {
    const handleAction = vi.fn()
    render(
      <EmptyState
        title="No Data"
        action={handleAction}
        actionLabel="Add Item"
      />
    )
    
    const button = screen.getByText('Add Item')
    expect(button).toBeInTheDocument()
    
    fireEvent.click(button)
    expect(handleAction).toHaveBeenCalledTimes(1)
  })

  it('should not render action button when action is not provided', () => {
    render(
      <EmptyState
        title="No Data"
        actionLabel="Add Item"
      />
    )
    
    expect(screen.queryByText('Add Item')).not.toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <EmptyState
        title="No Data"
        className="custom-class"
      />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})