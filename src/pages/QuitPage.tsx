import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { audio } from '../utils/audio'

export default function QuitPage() {
  const navigate = useNavigate()

  const quit = () => {
    audio.play('click')
    window.close()
    window.setTimeout(() => navigate('/session-terminee'), 120)
  }

  return (
    <div className="shell">
      <PageHeader eyebrow="Sortie" title="Quitter Mission Architect ?" backTo="/" />

      <div className="panel mx-auto max-w-lg">
        <div className="px-6 py-8">
          <p className="text-sm leading-relaxed text-muted">
            Ta progression est déjà enregistrée sur cet appareil. Tu pourras reprendre ta mission à
            tout moment depuis l’accueil.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/')}>
            Annuler
          </button>
          <button type="button" className="btn btn-danger" onClick={quit}>
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Oui, quitter
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted">
        Certains navigateurs empêchent la fermeture automatique d’un onglet.
      </p>
    </div>
  )
}
