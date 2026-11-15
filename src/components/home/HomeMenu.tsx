import { ContinueMissionButton } from './ContinueMissionButton'
import { NewMissionButton } from './NewMissionButton'
import { OptionsButton } from './OptionsButton'
import { QuitButton } from './QuitButton'

export function HomeMenu() {
  return (
    <nav aria-label="Menu principal" className="flex w-full flex-col gap-3">
      <ContinueMissionButton />
      <NewMissionButton />
      <OptionsButton />
      <QuitButton />
    </nav>
  )
}
