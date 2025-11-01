import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders provided text and variant styles', () => {
    render(<Button variant="secondary">Save</Button>)

    const button = screen.getByRole('button', { name: /save/i })
    expect(button).toHaveTextContent('Save')
    expect(button.className).toContain('bg-secondary')
  })
})
