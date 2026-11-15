import type { EventChoice } from '../../types'

interface DecisionButtonsProps {
  choices: EventChoice[]
  onChoose: (choiceId: string) => void
}

export function DecisionButtons({ choices, onChoose }: DecisionButtonsProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      {choices.map((choice, index) => (
        <button
          key={choice.id}
          type="button"
          className={`btn flex-1 flex-col items-start gap-0.5 px-4 py-2.5 text-left ${
            index === 0 ? 'btn-primary' : ''
          }`}
          onClick={() => onChoose(choice.id)}
        >
          <span className="text-sm font-medium">{choice.label}</span>
          {choice.hint ? <span className="text-xs font-normal opacity-75">{choice.hint}</span> : null}
        </button>
      ))}
    </div>
  )
}
