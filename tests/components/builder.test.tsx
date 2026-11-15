import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import BuilderPage from '../../src/pages/BuilderPage'
import { useMissionStore } from '../../src/store/missionStore'
import { REFERENCE_BUILD } from '../fixtures'

const COMPONENT_LABELS: Record<string, string> = {
  structure: 'Structure de base',
  'panneau-standard': 'Panneaux solaires standard',
  'batterie-standard': 'Batterie standard',
  'camera-standard': 'Caméra standard',
  'antenne-standard': 'Antenne standard',
  orientation: 'Système d’orientation',
}

function renderBuilder() {
  return render(
    <MemoryRouter initialEntries={['/construction/observer-la-terre']}>
      <Routes>
        <Route path="/construction/:missionId" element={<BuilderPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('BuilderPage', () => {
  beforeEach(() => {
    useMissionStore.setState({ mission: null, running: false, lastOutcome: null })
    useMissionStore.getState().startNewMission('observer-la-terre')
    useMissionStore.getState().chooseLauncher('moyen')
  })

  it('ajoute un composant au clic et met à jour la masse', async () => {
    const user = userEvent.setup()
    renderBuilder()
    await user.click(screen.getByRole('button', { name: /Ajouter Structure de base/ }))
    expect(useMissionStore.getState().mission!.components).toContain('structure')
    expect(screen.getAllByText(/40 kg/).length).toBeGreaterThan(0)
  })

  it('bloque le lancement tant que la conception est incomplète', () => {
    renderBuilder()
    expect(screen.getByRole('button', { name: /Lancer la mission/ })).toBeDisabled()
    expect(screen.getByText(/Ajoute une structure/)).toBeInTheDocument()
  })

  it('autorise le lancement une fois la conception de référence complète', async () => {
    const user = userEvent.setup()
    renderBuilder()
    for (const id of REFERENCE_BUILD) {
      await user.click(screen.getByRole('button', { name: new RegExp(`Ajouter ${COMPONENT_LABELS[id]}`) }))
    }
    expect(useMissionStore.getState().mission!.components).toHaveLength(REFERENCE_BUILD.length)
    expect(screen.getByRole('button', { name: /Lancer la mission/ })).toBeEnabled()
  })
})
