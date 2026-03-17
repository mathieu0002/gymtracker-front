import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExercisesBySplit, createSession, addExerciseToSession, addSet, getLastSessionBySplit } from '../api'
import type { SplitType, ExerciseDto, SessionExerciseDto, LastSessionSummaryDto } from '../types'
import { SPLIT_LABELS } from '../types'

const SPLITS: SplitType[] = ['pec', 'triceps', 'dos', 'bras', 'epaules', 'jambes', 'cardio', 'abdos']

const inputStyle: React.CSSProperties = {
  width: 80, padding: '9px 12px', borderRadius: 4,
  border: '1px solid var(--border)', background: 'var(--bg)',
  color: 'var(--text)', fontSize: 14, fontFamily: 'Share Tech Mono',
  outline: 'none', transition: 'border-color 0.2s',
  textAlign: 'center',
}

export default function NewSession() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'splits' | 'exercises' | 'sets'>('splits')
  const [selectedSplits, setSelectedSplits] = useState<SplitType[]>([])
  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [selectedExercises, setSelectedExercises] = useState<ExerciseDto[]>([])
  const [sessionExercises, setSessionExercises] = useState<SessionExerciseDto[]>([])
  const [lastSession, setLastSession] = useState<LastSessionSummaryDto | null>(null)
  const [sets, setSets] = useState<Record<string, { weightKg: string; reps: string }>>({})
  const [repeatCount, setRepeatCount] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [sessionDate, setSessionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )

  const toggleSplit = (split: SplitType) =>
    setSelectedSplits(prev => prev.includes(split) ? prev.filter(s => s !== split) : [...prev, split])

  const toggleExercise = (ex: ExerciseDto) =>
    setSelectedExercises(prev => prev.find(e => e.id === ex.id) ? prev.filter(e => e.id !== ex.id) : [...prev, ex])

  const goToExercises = async () => {
    setLoading(true)
    try {
      const results = await Promise.all(selectedSplits.map(s => getExercisesBySplit(s)))
      const all = results.flat()
      const unique = all.filter((e, i, arr) => arr.findIndex(x => x.id === e.id) === i)
      setExercises(unique)
      if (selectedSplits.length === 1)
        getLastSessionBySplit(selectedSplits[0]).then(setLastSession).catch(() => setLastSession(null))
      setStep('exercises')
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const startSession = () => {
    setSessionExercises(selectedExercises.map((ex, i) => ({
      id: ex.id, sessionId: '', exerciseId: ex.id,
      exerciseName: ex.name, muscleGroupName: ex.muscleGroupName,
      orderIndex: i, sets: [],
    })))
    setStep('sets')
  }

  const getLastWeight = (exerciseName: string) => {
    if (!lastSession) return null
    const ex = lastSession.exercises.find(e => e.exerciseName === exerciseName)
    if (!ex || ex.sets.length === 0) return null
    return ex.sets.reduce((a, b) => a.weightKg > b.weightKg ? a : b)
  }

  const saveSet = (seId: string, setNumber: number, sourceKey: string) => {
    const val = sets[sourceKey]
    if (!val?.weightKg || !val?.reps) return
    setSessionExercises(prev => prev.map(se =>
      se.id === seId
        ? {
            ...se,
            sets: [...se.sets, {
              id: `${sourceKey}-${setNumber}`,
              setNumber,
              weightKg: parseFloat(val.weightKg),
              reps: parseInt(val.reps),
            }]
          }
        : se
    ))
  }

  const handleAdd = (se: SessionExerciseDto) => {
    const count = Math.max(1, parseInt(repeatCount[se.id] ?? '1') || 1)
    const key = `${se.id}-${se.sets.length + 1}`
    const val = sets[key]
    if (!val?.weightKg || !val?.reps) return

    for (let i = 0; i < count; i++) {
      saveSet(se.id, se.sets.length + 1 + i, key)
    }
    setSets(prev => ({ ...prev, [key]: { weightKg: '', reps: '' } }))
    setRepeatCount(prev => ({ ...prev, [se.id]: '' }))
  }

  const validateSession = async () => {
    setLoading(true)
    try {
      const session = await createSession({ splits: selectedSplits, sessionDate })
      for (let i = 0; i < sessionExercises.length; i++) {
        const localSe = sessionExercises[i]
        const se = await addExerciseToSession(session.id, { exerciseId: localSe.exerciseId, orderIndex: i })
        for (const s of localSe.sets)
          await addSet(se.id, { setNumber: s.setNumber, weightKg: s.weightKg, reps: s.reps })
      }
      navigate('/history')
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const BackBtn = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', color: 'var(--text-dim)',
      cursor: 'pointer', marginBottom: 24, fontFamily: 'Rajdhani, sans-serif',
      fontSize: 13, letterSpacing: 1,
    }}>
      ← RETOUR
    </button>
  )

  const PageTitle = ({ children, sub }: { children: React.ReactNode; sub?: string }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 26, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' as const }}>
        {children}
      </div>
      {sub && <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', marginTop: 4 }}>{sub}</div>}
    </div>
  )

  // ---- STEP 1 ----
  if (step === 'splits') return (
    <div className="fade-in">
      <PageTitle sub="SÉLECTIONNE TON GROUPE MUSCULAIRE">NOUVELLE SÉANCE</PageTitle>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
        {SPLITS.map(split => {
          const active = selectedSplits.includes(split)
          return (
            <button key={split} onClick={() => toggleSplit(split)} style={{
              padding: '12px 22px', borderRadius: 4,
              border: `1px solid ${active ? 'var(--cyan)' : 'var(--border)'}`,
              background: active ? 'var(--cyan-dim)' : 'var(--bg-card)',
              color: active ? 'var(--cyan)' : 'var(--text-dim)',
              fontSize: 13, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
              letterSpacing: 1.5, cursor: 'pointer', transition: 'all 0.15s',
              textTransform: 'uppercase' as const,
              boxShadow: active ? '0 0 12px var(--cyan-dim)' : 'none',
            }}>
              {SPLIT_LABELS[split]}
            </button>
          )
        })}
      </div>

      {/* Sélecteur de date */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 12,
          color: 'var(--text-dim)', letterSpacing: 1.5,
          textTransform: 'uppercase' as const, marginBottom: 10,
        }}>
          Date de la séance
        </div>
        <input
          type="date"
          value={sessionDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={e => setSessionDate(e.target.value)}
          style={{
            padding: '10px 14px', borderRadius: 4,
            border: '1px solid var(--border)',
            background: 'var(--bg-card)', color: 'var(--text)',
            fontSize: 13, fontFamily: 'Share Tech Mono',
            outline: 'none', cursor: 'pointer',
            colorScheme: 'dark',
          }}
        />
      </div>

      <button onClick={goToExercises} disabled={selectedSplits.length === 0 || loading} style={{
        padding: '13px 36px', borderRadius: 4, border: '1px solid var(--cyan)',
        background: selectedSplits.length > 0 ? 'var(--cyan-dim)' : 'transparent',
        color: selectedSplits.length > 0 ? 'var(--cyan)' : 'var(--text-dim)',
        fontSize: 13, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
        letterSpacing: 2, cursor: selectedSplits.length > 0 ? 'pointer' : 'not-allowed',
        textTransform: 'uppercase' as const,
        boxShadow: selectedSplits.length > 0 ? '0 0 16px var(--cyan-dim)' : 'none',
        transition: 'all 0.15s',
      }}>
        {loading ? 'CHARGEMENT...' : 'SUIVANT →'}
      </button>
    </div>
  )

  // ---- STEP 2 ----
  if (step === 'exercises') return (
    <div className="fade-in">
      <BackBtn onClick={() => setStep('splits')} />
      <PageTitle sub={`${selectedExercises.length} EXERCICE(S) SÉLECTIONNÉ(S)`}>CHOISIS TES EXERCICES</PageTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 32 }}>
        {exercises.map(ex => {
          const last = getLastWeight(ex.name)
          const isSelected = !!selectedExercises.find(e => e.id === ex.id)
          return (
            <div key={ex.id} onClick={() => toggleExercise(ex)} style={{
              padding: '14px 18px', borderRadius: 6,
              border: `1px solid ${isSelected ? 'var(--cyan)' : 'var(--border)'}`,
              background: isSelected ? 'var(--cyan-dim)' : 'var(--bg-card)',
              cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.15s',
              boxShadow: isSelected ? '0 0 10px var(--cyan-dim)' : 'none',
            }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14, color: isSelected ? 'var(--cyan)' : 'var(--text)' }}>
                  {ex.name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 3, fontFamily: 'Share Tech Mono' }}>
                  {ex.muscleGroupName}
                </div>
              </div>
              {last && (
                <div style={{ textAlign: 'right', fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-mid)' }}>
                  LAST SESSION<br />
                  <span style={{ color: 'var(--cyan)', fontWeight: 700 }}>{last.weightKg}kg × {last.reps}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button onClick={startSession} disabled={selectedExercises.length === 0} style={{
        padding: '13px 36px', borderRadius: 4,
        border: `1px solid ${selectedExercises.length > 0 ? 'var(--cyan)' : 'var(--border)'}`,
        background: selectedExercises.length > 0 ? 'var(--cyan-dim)' : 'transparent',
        color: selectedExercises.length > 0 ? 'var(--cyan)' : 'var(--text-dim)',
        fontSize: 13, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
        letterSpacing: 2, cursor: selectedExercises.length > 0 ? 'pointer' : 'not-allowed',
        textTransform: 'uppercase' as const,
        boxShadow: selectedExercises.length > 0 ? '0 0 16px var(--cyan-dim)' : 'none',
        transition: 'all 0.15s',
      }}>
        DÉMARRER →
      </button>
    </div>
  )

  // ---- STEP 3 ----
  return (
    <div className="fade-in">
      <PageTitle sub="ENREGISTRE TES SÉRIES">SÉANCE EN COURS</PageTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sessionExercises.map(se => {
          const nextSetNumber = se.sets.length + 1
          const key = `${se.id}-${nextSetNumber}`
          const repeat = repeatCount[se.id] ?? ''
          const repeatNum = Math.max(1, parseInt(repeat) || 1)

          return (
            <div key={se.id} style={{
              background: 'var(--bg-card)', borderRadius: 8,
              border: '1px solid var(--border)', borderLeft: '3px solid var(--cyan)',
              padding: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1 }}>
                    {se.exerciseName.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'Share Tech Mono', marginTop: 2 }}>
                    {se.muscleGroupName}
                  </div>
                </div>
                {se.sets.length > 0 && (
                  <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--green)' }}>
                    {se.sets.length} SÉRIE(S)
                  </div>
                )}
              </div>

              {/* Séries enregistrées */}
              {se.sets.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                  {se.sets.map(s => (
                    <div key={s.id} style={{
                      background: 'var(--green-dim)', border: '1px solid var(--green)',
                      borderRadius: 4, padding: '4px 10px',
                      fontFamily: 'Share Tech Mono', fontSize: 12, color: 'var(--green)',
                    }}>
                      {s.weightKg}kg × {s.reps}
                    </div>
                  ))}
                </div>
              )}

              {/* Formulaire saisie */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
                <span style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', minWidth: 56 }}>
                  S{String(nextSetNumber).padStart(2, '0')}
                </span>

                <input
                  type="number" placeholder="KG"
                  value={sets[key]?.weightKg ?? ''}
                  onChange={e => setSets(prev => ({ ...prev, [key]: { ...prev[key], weightKg: e.target.value } }))}
                  onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  style={inputStyle}
                />

                <input
                  type="number" placeholder="REPS"
                  value={sets[key]?.reps ?? ''}
                  onChange={e => setSets(prev => ({ ...prev, [key]: { ...prev[key], reps: e.target.value } }))}
                  onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  style={inputStyle}
                />

                {/* Séparateur */}
                <div style={{ width: 1, height: 28, background: 'var(--border)' }} />

                {/* Input répétitions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--text-dim)' }}>×</span>
                  <input
                    type="number" placeholder="1"
                    value={repeat}
                    onChange={e => setRepeatCount(prev => ({ ...prev, [se.id]: e.target.value }))}
                    onFocus={e => e.target.style.borderColor = 'var(--cyan)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    style={{ ...inputStyle, width: 52 }}
                    title="Nombre de séries identiques à créer"
                    min={1} max={10}
                  />
                  {repeat && repeatNum > 1 && (
                    <span style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--cyan)' }}>
                      séries
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleAdd(se)}
                  style={{
                    padding: '9px 18px', borderRadius: 4,
                    border: '1px solid var(--cyan)', background: 'var(--cyan-dim)',
                    color: 'var(--cyan)', cursor: 'pointer', fontWeight: 700,
                    fontFamily: 'Rajdhani, sans-serif', fontSize: 16, letterSpacing: 1,
                    transition: 'all 0.15s',
                  }}
                >
                  {repeatNum > 1 ? `+${repeatNum}` : '+'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <button onClick={validateSession} disabled={loading} style={{
        marginTop: 28, width: '100%', padding: '15px 36px', borderRadius: 4,
        border: '1px solid var(--green)',
        background: loading ? 'transparent' : 'var(--green-dim)',
        color: loading ? 'var(--text-dim)' : 'var(--green)',
        fontSize: 14, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
        letterSpacing: 2, cursor: loading ? 'not-allowed' : 'pointer',
        textTransform: 'uppercase' as const,
        boxShadow: loading ? 'none' : '0 0 16px var(--green-dim)',
        transition: 'all 0.15s',
      }}>
        {loading ? 'ENREGISTREMENT...' : '✓ VALIDER LA SÉANCE'}
      </button>
    </div>
  )
}