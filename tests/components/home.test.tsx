import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from '../../src/pages/HomePage'
import { useMissionStore } from '../../src/store/missionStore'

describe('HomePage', () => {
  beforeEach(() => {
    useMissionStore.setState({ mission: null, running: false, lastOutcome: null })
  })

  it('affiche les quatre entrées du menu principal', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: /Mission en cours/ })).toHaveAttribute('href', '/mission-en-cours')
    expect(screen.getByRole('link', { name: /Nouvelle mission/ })).toHaveAttribute('href', '/nouvelle-mission')
    expect(screen.getByRole('link', { name: /Options/ })).toHaveAttribute('href', '/options')
    expect(screen.getByRole('link', { name: /Quitter/ })).toHaveAttribute('href', '/quitter')
  })

  it('indique l’absence de mission au démarrage', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByText(/Aucune mission/)).toBeInTheDocument()
  })
})
