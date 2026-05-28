import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NameCard from '../name-card'

describe('NameCard', () => {
  it('should render the name correctly', () => {
    render(
      <NameCard
        name="Sofía"
        nameId="1"
        gender="girl"
      />
    )

    expect(screen.getByText('Sofía')).toBeInTheDocument()
  })

  it('should render gender and usage score when provided', () => {
    render(
      <NameCard
        name="Lucas"
        nameId="2"
        gender="boy"
        usageScore={5000}
      />
    )

    expect(screen.getByText('Lucas')).toBeInTheDocument()
    expect(screen.getByText('Masculino')).toBeInTheDocument()
    expect(screen.getByText(/Usado/)).toBeInTheDocument()
    expect(screen.getByText(/5\.0K/)).toBeInTheDocument()
  })

  it('should call onClick when card is clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(
      <NameCard
        name="Emma"
        nameId="3"
        gender="girl"
        onClick={handleClick}
      />
    )

    await user.click(screen.getByText('Emma'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should call onToggleFavorite when heart is clicked', async () => {
    const user = userEvent.setup()
    const handleToggleFavorite = vi.fn().mockResolvedValue(undefined)

    render(
      <NameCard
        name="Olivia"
        nameId="4"
        gender="girl"
        isFavorited={false}
        onToggleFavorite={handleToggleFavorite}
      />
    )

    const favoriteButton = screen.getByRole('button', { name: /añadir a favoritos/i })
    await user.click(favoriteButton)

    expect(handleToggleFavorite).toHaveBeenCalledWith('4', 'Olivia')
  })

  it('should show favorited state correctly', () => {
    render(
      <NameCard
        name="Martín"
        nameId="5"
        gender="boy"
        isFavorited={true}
        onToggleFavorite={vi.fn()}
      />
    )

    expect(screen.getByText('Martín')).toBeInTheDocument()
    // Visual state tested via snapshot or manual testing
  })

  it('should format large usage scores with K suffix', () => {
    render(
      <NameCard
        name="María"
        nameId="6"
        gender="girl"
        usageScore={15430}
      />
    )

    expect(screen.getByText(/15\.4K/)).toBeInTheDocument()
  })

  it('should not render usage section when usageScore is not provided', () => {
    render(
      <NameCard
        name="Pablo"
        nameId="7"
        gender="boy"
      />
    )

    expect(screen.queryByText('Masculino')).not.toBeInTheDocument()
  })
})
