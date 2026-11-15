import { Link } from 'react-router-dom'
import { SlidersHorizontal } from 'lucide-react'
import { audio } from '../../utils/audio'

export function OptionsButton() {
  return (
    <Link
      to="/options"
      className="btn btn-lg group justify-between"
      onClick={() => audio.play('click')}
    >
      <span className="flex items-center gap-3">
        <SlidersHorizontal className="h-5 w-5 text-accent" aria-hidden="true" />
        Options
      </span>
      <span aria-hidden="true" className="text-muted transition group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  )
}
