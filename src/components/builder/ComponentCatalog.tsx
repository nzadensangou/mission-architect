import { COMPONENTS } from '../../data/components'
import { CATEGORY_LABELS } from '../../data/messages'
import type { ComponentCategory } from '../../types'
import { ComponentCard } from './ComponentCard'

interface ComponentCatalogProps {
  componentIds: string[]
  onAdd: (componentId: string) => void
}

const ORDER: ComponentCategory[] = [
  'structure',
  'energy',
  'battery',
  'camera',
  'antenna',
  'attitude',
  'shield',
]

export function ComponentCatalog({ componentIds, onAdd }: ComponentCatalogProps) {
  return (
    <section className="panel flex h-full flex-col" aria-labelledby="catalog-title">
      <div className="panel-head">
        <h2 id="catalog-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
          Composants disponibles
        </h2>
        <span className="font-mono text-[0.6875rem] text-muted">CLIC POUR AJOUTER</span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-3">
        {ORDER.map((category) => {
          const items = COMPONENTS.filter((component) => component.category === category)
          if (items.length === 0) return null
          return (
            <div key={category}>
              <p className="eyebrow mb-1.5 px-1">{CATEGORY_LABELS[category]}</p>
              <div className="space-y-1.5">
                {items.map((component) => (
                  <ComponentCard
                    key={component.id}
                    component={component}
                    installed={componentIds.filter((id) => id === component.id).length}
                    onAdd={() => onAdd(component.id)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
