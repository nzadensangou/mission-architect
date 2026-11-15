import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Eye, PlusCircle, RotateCcw, Wrench } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { ResultScreen } from '../components/result/ResultScreen'
import { FailureReport } from '../components/result/FailureReport'
import { ScorePanel } from '../components/result/ScorePanel'
import { useMissionStore } from '../store/missionStore'
import { audio } from '../utils/audio'

export default function ResultPage() {
  const { missionId = 'observer-la-terre' } = useParams()
  const navigate = useNavigate()
  const mission = useMissionStore((state) => state.mission)
  const restart = useMissionStore((state) => state.restart)
  const [showReport, setShowReport] = useState(false)

  if (!mission) return null

  const success = mission.status === 'reussie'

  return (
    <div className="shell">
      <PageHeader
        eyebrow={success ? 'Mission accomplie' : 'Rapport de mission'}
        title={success ? 'Objectif atteint' : 'La mission s’arrête'}
        subtitle={
          success
            ? 'Le satellite a rempli sa mission. Analyse ton score et repars pour un meilleur résultat.'
            : 'Chaque échec explique une contrainte d’ingénierie. Lis le rapport, ajuste, réessaie.'
        }
        backTo="/"
      />

      <div className="space-y-4">
        {success ? <ResultScreen mission={mission} /> : <FailureReport mission={mission} />}

        <ScorePanel mission={mission} />

        {showReport ? (
          <div className="grid gap-4 lg:grid-cols-2">
            <section className="panel" aria-labelledby="battery-chart-title">
              <div className="panel-head">
                <h2
                  id="battery-chart-title"
                  className="font-display text-sm font-semibold uppercase tracking-[0.16em]"
                >
                  Batterie au fil des jours
                </h2>
              </div>
              <div className="h-56 px-2 py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mission.history}>
                    <defs>
                      <linearGradient id="batteryFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.03} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit=" kWh" width={52} />
                    <Tooltip
                      contentStyle={{
                        background: '#111C33',
                        border: '1px solid #2A374F',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelFormatter={(day) => `Jour ${day}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="battery"
                      name="Batterie"
                      stroke="#22D3EE"
                      fill="url(#batteryFill)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel" aria-labelledby="obs-chart-title">
              <div className="panel-head">
                <h2
                  id="obs-chart-title"
                  className="font-display text-sm font-semibold uppercase tracking-[0.16em]"
                >
                  Observations par jour
                </h2>
              </div>
              <div className="h-56 px-2 py-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mission.history}>
                    <CartesianGrid stroke="#1E293B" strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} width={40} />
                    <Tooltip
                      contentStyle={{
                        background: '#111C33',
                        border: '1px solid #2A374F',
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      labelFormatter={(day) => `Jour ${day}`}
                    />
                    <Bar dataKey="observations" name="Observations" radius={[3, 3, 0, 0]}>
                      {mission.history.map((entry) => (
                        <Cell
                          key={entry.day}
                          fill={entry.observations >= 20 ? '#22C55E' : '#F59E0B'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <section className="panel lg:col-span-2" aria-labelledby="journal-title">
              <div className="panel-head">
                <h2 id="journal-title" className="font-display text-sm font-semibold uppercase tracking-[0.16em]">
                  Journal complet
                </h2>
              </div>
              <div className="max-h-64 space-y-1 overflow-y-auto px-4 py-3">
                {mission.journal.map((entry) => (
                  <p key={entry.id} className="font-mono text-xs text-muted">
                    <span className="text-muted/70">J{String(entry.day).padStart(2, '0')}</span>{' '}
                    <span className="text-ink/85">{entry.message}</span>
                  </p>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        <div className="flex flex-col flex-wrap gap-2 sm:flex-row sm:justify-between">
          <button type="button" className="btn" onClick={() => setShowReport((value) => !value)}>
            <Eye className="h-4 w-4" aria-hidden="true" />
            {showReport ? 'Masquer le rapport' : 'Voir le rapport'}
          </button>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              className="btn"
              onClick={() => {
                audio.play('click')
                navigate(`/construction/${missionId}`)
              }}
            >
              <Wrench className="h-4 w-4" aria-hidden="true" />
              Modifier le satellite
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                audio.play('add')
                restart()
                navigate(`/simulation/${missionId}`)
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Réessayer
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                audio.play('click')
                navigate('/nouvelle-mission')
              }}
            >
              <PlusCircle className="h-4 w-4" aria-hidden="true" />
              Nouvelle mission
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
