import { useState } from 'react'
import type { MuscleGroupDto, SplitType } from '../../types'
import { SPLIT_LABELS } from '../../types'
import { createMuscleGroup } from '../../api'
import styles from '../Admin.module.css'
import { SectionLabel } from '../SectionLabel'

const SPLITS: SplitType[] = ['pec', 'triceps', 'dos', 'bras', 'epaules', 'jambes', 'cardio', 'abdos', 'fesses']

interface MuscleGroupSectionProps {
  muscleGroups: MuscleGroupDto[]
  setMuscleGroups: React.Dispatch<React.SetStateAction<MuscleGroupDto[]>>
  setConfirmAction: (action: { type: 'mg'; id: string; message: string } | null) => void
}

export function MuscleGroupSection({ muscleGroups, setMuscleGroups, setConfirmAction }: MuscleGroupSectionProps) {
  const [name, setName] = useState('')
  const [split, setSplit] = useState<SplitType>('pec')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddMuscleGroup = async () => {
    if (!name.trim()) {
      setError('Nom requis')
      return
    }
    setLoading(true)
    setError('')
    try {
      const mg = await createMuscleGroup({ name: name.trim(), split: split })
      setMuscleGroups(prev => [...prev, mg])
      setName('')
    } catch {
      setError('Erreur — ce nom existe peut-être déjà')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <SectionLabel>Groupes musculaires ({muscleGroups.length})</SectionLabel>
      <div className={styles.formCard}>
        <div className={styles.formCardHeader}>// NOUVEAU GROUPE</div>
        <div className={styles.formRow}>
          <div className={styles.formField} style={{ minWidth: 180 }}>
            <label className={styles.formLabel}>Nom</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Grand pectoral" onKeyDown={e => e.key === 'Enter' && handleAddMuscleGroup()} className={styles.input} />
          </div>
          <div className={styles.formField} style={{ minWidth: 160, flex: '0 1 auto' }}>
            <label className={styles.formLabel}>Split</label>
            <select value={split} onChange={e => setSplit(e.target.value as SplitType)} className={styles.select}>
              {SPLITS.map(s => <option key={s} value={s}>{SPLIT_LABELS[s]}</option>)}
            </select>
          </div>
          <button onClick={handleAddMuscleGroup} disabled={loading} className={styles.buttonPrimary}>{loading ? '...' : '+ AJOUTER'}</button>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
      <div className={styles.listContainer}>
        {muscleGroups.map(mg => (
          <div key={mg.id} className={styles.listItem}>
            <div className={styles.itemContent}>
              <div className={styles.mgSplitTag}>{SPLIT_LABELS[mg.split as SplitType] ?? mg.split}</div>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{mg.name}</span>
            </div>
            <button onClick={() => setConfirmAction({ type: 'mg', id: mg.id, message: `Supprimer "${mg.name}" ? Les exercices liés seront aussi supprimés.` })} className={styles.buttonDelete}>SUPPR</button>
          </div>
        ))}
      </div>
    </section>
  )
}