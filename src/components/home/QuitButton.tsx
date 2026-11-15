import { Link } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { audio } from '../../utils/audio'

export function QuitButton() {
  return (
    <Link
      to="/quitter"
      className="btn btn-lg btn-ghost group justify-between"
      onClick={() => audio.play('click')}
    >
      <span className="flex items-center gap-3">
        <LogOut className="h-5 w-5" aria-hidden="true" />
        Quitter
      </span>
      <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  )
}
