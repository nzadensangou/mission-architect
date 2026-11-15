import { useNavigate } from 'react-router-dom'
import { Save } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { OptionsPage as OptionsPanel } from '../components/options/OptionsPage'
import { audio } from '../utils/audio'

export default function OptionsPage() {
  const navigate = useNavigate()

  return (
    <div className="shell">
      <PageHeader
        eyebrow="Préférences"
        title="Options"
        subtitle="Les changements sont appliqués immédiatement et conservés sur cet appareil."
        backTo="/"
      />

      <div className="mx-auto max-w-2xl">
        <OptionsPanel />

        <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
            Retour
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              audio.play('success')
              navigate('/')
            }}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
