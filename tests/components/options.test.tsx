import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import OptionsPage from '../../src/pages/OptionsPage'
import { DEFAULT_OPTIONS, useOptionsStore } from '../../src/store/optionsStore'

describe('OptionsPage', () => {
  beforeEach(() => {
    useOptionsStore.setState({ options: DEFAULT_OPTIONS })
  })

  it('applique immédiatement le thème clair', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <OptionsPage />
      </MemoryRouter>,
    )
    await user.click(screen.getByText('Clair'))
    expect(useOptionsStore.getState().options.theme).toBe('light')
  })

  it('change la taille du texte', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <OptionsPage />
      </MemoryRouter>,
    )
    await user.click(screen.getByText('Grand'))
    expect(useOptionsStore.getState().options.textSize).toBe('large')
  })

  it('désactive les effets sonores via l’interrupteur', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <OptionsPage />
      </MemoryRouter>,
    )
    await user.click(screen.getByRole('switch', { name: 'Effets sonores' }))
    expect(useOptionsStore.getState().options.soundEffects).toBe(false)
  })

  it('garde l’anglais indisponible pour le MVP', () => {
    render(
      <MemoryRouter>
        <OptionsPage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('radio', { name: 'English' })).toBeDisabled()
  })
})
