import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { audio } from '../../utils/audio'

export function ContinueMissionButton() {
  return (
    <Link
      to="/mission-en-cours"
      className="btn btn-lg group justify-between"
      onClick={() => audio.play('click')}
    >
      <span className="flex items-center gap-3">
        <ClipboardList className="h-5 w-5 text-primary" aria-hidden="true" />
        Mission en cours
      </span>
      <span aria-hidden="true" className="text-muted transition group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  )
}
