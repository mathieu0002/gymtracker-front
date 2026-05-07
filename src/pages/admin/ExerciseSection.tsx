import { useState, useEffect } from 'react'
import type { ExerciseDto, MuscleGroupDto, SplitType } from '../../types'
import { SPLIT_LABELS } from '../../types'
import { createCustomExercise } from '../../api'
import styles from '../Admin.module.css'
import { SectionLabel } from '../SectionLabel'

const SPLITS: SplitType[] = ['pec', 'triceps', 'dos', 'bras', 'epaules', 'jambes', 'cardio', 'abdos', 'fesses']

interface ExerciseSectionProps {
  exercises: ExerciseDto[]
  setExercises: React.Dispatch<React.SetStateAction<ExerciseDto[]>>
  muscleGroups: MuscleGroupDto[]
  setConfirmAction: (action: { type: 'exercise'; id: string; message: string } | null) => void
}

export function ExerciseSection({ exercises, setExercises, muscleGroups, setConfirmAction }: ExerciseSectionProps) {
  const [name, setName] = useState('')
  const [mgId, setMgId] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [filterSplit, setFilterSplit] = useState<SplitType | 'all'>('all')

  useEffect(() => {
    if (muscleGroups.length > 0 && !mgId) {
      setMgId(muscleGroups[0].id)
    }
  }, [muscleGroups, mgId])

  const handleAddExercise = async () => {
    if (!name.trim()) { setError('Nom requis'); return }
    if (!mgId) { setError('Groupe musculaire requis'); return }
    setLoading(true); setError('')
    try {
      const ex = await createCustomExercise({ name: name.trim(), muscleGroupId: mgId, description: desc.trim() || '' })
      setExercises(prev => [...prev, ex])
      setName(''); setDesc('')
    } catch { setError('Erreur — ce nom existe peut-être déjà') }
    finally { setLoading(false) }
  }

  const filteredExercises = filterSplit === 'all' ? exercises
    : exercises.filter(ex => { const mg = muscleGroups.find(mg => mg.id === ex.muscleGroupId); return mg?.split === filterSplit })

  return (
    <section>
      <SectionLabel>Exercices ({exercises.length})</SectionLabel>
      <div className={styles.formCard}>
        <div className={styles.formCardHeader}>// NOUVEL EXERCICE</div>
        <div className={styles.formRow}>
          <div className={styles.formField} style={{ minWidth: 180 }}>
            <label className={styles.formLabel}>Nom</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Développé couché" onKeyDown={e => e.key === 'Enter' && handleAddExercise()} className={styles.input} />
          </div>
          <div className={styles.formField} style={{ minWidth: 200 }}>
            <label className={styles.formLabel}>Groupe musculaire</label>
            <select value={mgId} onChange={e => setMgId(e.target.value)} className={styles.select}>
              {muscleGroups.map(mg => <option key={mg.id} value={mg.id}>{mg.name} ({SPLIT_LABELS[mg.split as SplitType] ?? mg.split})</option>)}
            </select>
          </div>
          <div className={styles.formField} style={{ minWidth: 160 }}>
            <label className={styles.formLabel}>Description (optionnel)</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Notes..." className={styles.input} />
          </div>
          <button onClick={handleAddExercise} disabled={loading} className={styles.buttonPrimary}>{loading ? '...' : '+ AJOUTER'}</button>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
      <div className={styles.filterButtons}>
        {['all', ...SPLITS].map(s => (
          <button key={s} onClick={() => setFilterSplit(s as SplitType | 'all')} className={filterSplit === s ? styles.filterButtonActive : styles.filterButton}>
            {s === 'all' ? 'TOUS' : SPLIT_LABELS[s as SplitType]}
          </button>
        ))}
      </div>
      <div className={styles.listContainer}>
        {filteredExercises.length === 0 ? (
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 12, color: 'var(--text-dim)', padding: 20 }}>// AUCUN EXERCICE</div>
        ) : filteredExercises.map(ex => {
          const mg = muscleGroups.find(mg => mg.id === ex.muscleGroupId)
          return (
            <div key={ex.id} className={styles.listItem}>
              <div className={styles.itemContent}>
                <div className={styles.mgSplitTag} style={{ color: 'var(--text-dim)', background: 'var(--bg)', borderColor: 'var(--border)' }}>{mg ? SPLIT_LABELS[mg.split as SplitType] ?? mg.split : '—'}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{ex.name}</div>
                  {mg && <div className={styles.exMgName}>{mg.name}</div>}
                </div>
                {ex.isCustom && (<div className={styles.exCustomTag}>CUSTOM</div>)}
              </div>
              <button onClick={() => setConfirmAction({ type: 'exercise', id: ex.id, message: `Supprimer "${ex.name}" ?` })} className={styles.buttonDelete}>SUPPR</button>
            </div>
          )
        })}
      </div>
    </section>
  )
}