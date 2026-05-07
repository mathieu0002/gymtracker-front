import { useState, useEffect } from 'react'
import {
  getMuscleGroups, deleteMuscleGroup,
  getExercises, deleteExercise,
  getUsers, deleteUser,
} from '../api'
import type { MuscleGroupDto, ExerciseDto, UserDto } from '../types'
import ConfirmModal from '../components/ConfirmModal'
import styles from './Admin.module.css'
import { UserSection } from './admin/UserSection'
import { MuscleGroupSection } from './admin/MuscleGroupSection'
import { ExerciseSection } from './admin/ExerciseSection'

type ConfirmAction = { type: 'user' | 'mg' | 'exercise'; id: string; message: string } | null

export default function Admin() {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroupDto[]>([])
  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)

  useEffect(() => {
    Promise.all([getMuscleGroups(), getExercises(), getUsers()])
      .then(([mgs, exs, us]) => {
        setMuscleGroups(mgs)
        setExercises(exs)
        setUsers(us)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleConfirm = async () => {
    if (!confirmAction) return
    const { type, id } = confirmAction
    try {
      if (type === 'user') {
        await deleteUser(id)
        setUsers(prev => prev.filter(u => u.id !== id))
      } else if (type === 'mg') {
        await deleteMuscleGroup(id)
        setMuscleGroups(prev => prev.filter(mg => mg.id !== id))
        setExercises(prev => prev.filter(ex => ex.muscleGroupId !== id))
      } else if (type === 'exercise') {
        await deleteExercise(id)
        setExercises(prev => prev.filter(ex => ex.id !== id))
      }
    } catch (error) {
      console.error("Failed to delete item:", error)
      // Optionally, show an error to the user
    } finally {
      setConfirmAction(null)
    }
  }

  if (loading) return (
    <div style={{ color: 'var(--text-dim)', fontFamily: 'Share Tech Mono', fontSize: 13, marginTop: 80, textAlign: 'center' }}>CHARGEMENT...</div>
  )

  return (
    <div className={`${styles.page} fade-in`}>

      {confirmAction && (
        <ConfirmModal
          message={confirmAction.message}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}

      <div>
        <div className={styles.headerTitle}>
          PANNEAU <span className={styles.titleHighlight}>ADMIN</span>
        </div>
        <div className={styles.headerSubtitle}>
          DATABASE_MANAGEMENT // USERS, EXERCISES & MUSCLE_GROUPS
        </div>
      </div>

      <UserSection
        users={users}
        setUsers={setUsers}
        setConfirmAction={setConfirmAction}
      />

      <MuscleGroupSection
        muscleGroups={muscleGroups}
        setMuscleGroups={setMuscleGroups}
        setConfirmAction={setConfirmAction}
      />

      <ExerciseSection
        exercises={exercises}
        setExercises={setExercises}
        muscleGroups={muscleGroups}
        setConfirmAction={setConfirmAction}
      />
    </div>
  )
}