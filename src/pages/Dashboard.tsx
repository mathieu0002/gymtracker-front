import { useState, useEffect } from 'react'
import { getPersonalRecords, getExercisesBySplit, getProgression } from '../api'
import { useUser } from '../context/UserContext'
import type { PersonalRecordDto, SplitType, ExerciseDto, ProgressionDto } from '../types'
import { SPLIT_LABELS } from '../types'
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'

const SPLITS: SplitType[] = ['pec', 'triceps', 'dos', 'bras', 'epaules', 'jambes', 'cardio', 'abdos']
const COLORS = ['#00e5ff', '#00e676', '#ff6d00', '#ffea00', '#ff4081', '#69f0ae', '#40c4ff', '#ea80fc']

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
    <div style={{ width: 3, height: 18, background: 'var(--cyan)', borderRadius: 2, boxShadow: '0 0 8px var(--cyan)' }} />
    <span style={{
      fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700,
      letterSpacing: 2, color: 'var(--text-mid)', textTransform: 'uppercase' as const,
    }}>
      {children}
    </span>
  </div>
)

export default function Dashboard() {
  const { currentUser } = useUser()
  const [prs, setPrs] = useState<PersonalRecordDto[]>([])
  const [loadingPrs, setLoadingPrs] = useState(true)
  const [selectedMuscle, setSelectedMuscle] = useState<SplitType>('pec')
  const [progressions, setProgressions] = useState<ProgressionDto[]>([])
  const [loadingProg, setLoadingProg] = useState(false)

  useEffect(() => {
    if (!currentUser) return
    getPersonalRecords(currentUser.id).then(setPrs).finally(() => setLoadingPrs(false))
  }, [currentUser])

  useEffect(() => {
    if (!currentUser) return
    setLoadingProg(true)
    setProgressions([])
    getExercisesBySplit(selectedMuscle)
      .then(async (exs: ExerciseDto[]) => {
        const progs = await Promise.all(exs.map((ex: ExerciseDto) => getProgression(ex.id, currentUser.id)))
        setProgressions(progs.filter((p: ProgressionDto) => p.points.length > 0))
      })
      .catch(() => setProgressions([]))
      .finally(() => setLoadingProg(false))
  }, [selectedMuscle, currentUser])

  const mergedData = progressions
    .reduce((acc, prog) => {
      prog.points.forEach(point => {
        const existing = acc.find(x => x.date === point.sessionDate)
        if (existing) existing[prog.exerciseName] = point.maxWeightKg
        else acc.push({ date: point.sessionDate, [prog.exerciseName]: point.maxWeightKg })
      })
      return acc
    }, [] as Record<string, any>[])
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }} className="fade-in">

      <div>
        <div style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700,
          letterSpacing: 3, textTransform: 'uppercase' as const, color: 'var(--text)',
        }}>
          TABLEAU DE <span style={{ color: 'var(--cyan)', textShadow: '0 0 20px var(--cyan-mid)' }}>BORD</span>
        </div>
        <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', marginTop: 4, letterSpacing: 1 }}>
          {currentUser?.firstName.toUpperCase()} {currentUser?.lastName.toUpperCase()} // PERFORMANCE_ANALYTICS
        </div>
      </div>

      <section>
        <SectionLabel>Records personnels</SectionLabel>
        {loadingPrs ? (
          <div style={{ color: 'var(--text-dim)', fontFamily: 'Share Tech Mono', fontSize: 13 }}>CHARGEMENT...</div>
        ) : prs.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', fontFamily: 'Share Tech Mono', fontSize: 13 }}>
            // AUCUNE DONNÉE — COMMENCE TA PREMIÈRE SÉANCE
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: 10 }}>
            {prs.map((pr, i) => (
              <div key={pr.exerciseId} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderTop: '2px solid var(--cyan)', borderRadius: 6,
                padding: 16, position: 'relative', overflow: 'hidden',
                transition: 'box-shadow 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px var(--cyan-dim)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none' }}
              >
                <div style={{ position: 'absolute', top: 8, right: 10, fontFamily: 'Share Tech Mono', fontSize: 9, color: 'var(--text-dim)', letterSpacing: 1 }}>
                  PR_{String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 10 }}>{pr.exerciseName}</div>
                <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 30, fontWeight: 700, color: 'var(--cyan)', lineHeight: 1, textShadow: '0 0 12px var(--cyan-mid)' }}>
                  {pr.prWeightKg}<span style={{ fontSize: 14, fontWeight: 400, marginLeft: 4 }}>kg</span>
                </div>
                <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', marginTop: 6 }}>
                  × {pr.repsAtPr} REPS
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <SectionLabel>Progression par muscle</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 24 }}>
          {SPLITS.map(s => (
            <button key={s} onClick={() => setSelectedMuscle(s)} style={{
              padding: '6px 14px', borderRadius: 4,
              border: `1px solid ${selectedMuscle === s ? 'var(--cyan)' : 'var(--border)'}`,
              background: selectedMuscle === s ? 'var(--cyan-dim)' : 'transparent',
              color: selectedMuscle === s ? 'var(--cyan)' : 'var(--text-dim)',
              fontSize: 11, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
              letterSpacing: 1.5, cursor: 'pointer', transition: 'all 0.15s',
              textTransform: 'uppercase' as const,
              boxShadow: selectedMuscle === s ? '0 0 10px var(--cyan-dim)' : 'none',
            }}>
              {SPLIT_LABELS[s]}
            </button>
          ))}
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: 24, minHeight: 200 }}>
          {loadingProg ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)', fontFamily: 'Share Tech Mono', fontSize: 12 }}>
              CHARGEMENT DES DONNÉES...
            </div>
          ) : mergedData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-dim)', fontFamily: 'Share Tech Mono', fontSize: 12 }}>
              // PAS DE DONNÉES POUR {SPLIT_LABELS[selectedMuscle].toUpperCase()}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={mergedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#0d1a26" />
                <XAxis dataKey="date" tick={{ fill: '#4a6080', fontSize: 10, fontFamily: 'Share Tech Mono' }} axisLine={{ stroke: 'var(--border)' }} tickLine={false} />
                <YAxis tick={{ fill: '#4a6080', fontSize: 10, fontFamily: 'Share Tech Mono' }} axisLine={false} tickLine={false} unit="kg" />
                <Tooltip
                  contentStyle={{ background: '#0a0f14', border: '1px solid var(--cyan)', borderRadius: 6, fontSize: 12, fontFamily: 'Share Tech Mono', boxShadow: '0 0 16px var(--cyan-dim)' }}
                  labelStyle={{ color: 'var(--text-mid)', marginBottom: 6, fontSize: 11 }}
                  formatter={(v: any) => [`${v} kg`]}
                />
                <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Rajdhani', letterSpacing: 1, paddingTop: 16 }} />
                {progressions.map((prog, i) => (
                  <Line key={prog.exerciseId} type="monotone" dataKey={prog.exerciseName}
                    stroke={COLORS[i % COLORS.length]} strokeWidth={2}
                    dot={{ fill: COLORS[i % COLORS.length], r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 2, stroke: '#0a0f14' }} connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>
    </div>
  )
}