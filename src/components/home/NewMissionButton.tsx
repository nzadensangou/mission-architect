import { Link } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import { audio } from '../../utils/audio'

export function NewMissionButton() {
  return (
    <Link
      to="/nouvelle-mission"
      className="btn btn-lg btn-primary group justify-between"
      onClick={() => audio.play('click')}
    >
      <span className="flex items-center gap-3">
        <Rocket className="h-5 w-5" aria-hidden="true" />
        Nouvelle mission
      </span>
      <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  )
}
