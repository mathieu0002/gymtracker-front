import { useState } from 'react'
import type { UserDto } from '../../types'
import { createUser } from '../../api'
import styles from '../Admin.module.css'
import { SectionLabel } from '../SectionLabel'

interface UserSectionProps {
  users: UserDto[]
  setUsers: React.Dispatch<React.SetStateAction<UserDto[]>>
  setConfirmAction: (action: { type: 'user'; id: string; message: string } | null) => void
}

export function UserSection({ users, setUsers, setConfirmAction }: UserSectionProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAddUser = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('Prénom et nom requis')
      return
    }
    setLoading(true)
    setError('')
    try {
      const u = await createUser({ firstName: firstName.trim(), lastName: lastName.trim() })
      setUsers(prev => [...prev, u])
      setFirstName('')
      setLastName('')
    } catch {
      setError('Erreur lors de la création')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <SectionLabel>Utilisateurs ({users.length})</SectionLabel>
      <div className={styles.formCard}>
        <div className={styles.formCardHeader}>// NOUVEL UTILISATEUR</div>
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Prénom</label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ex: Mathieu" onKeyDown={e => e.key === 'Enter' && handleAddUser()} className={styles.input} />
          </div>
          <div className={styles.formField}>
            <label className={styles.formLabel}>Nom</label>
            <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Ex: Dupont" onKeyDown={e => e.key === 'Enter' && handleAddUser()} className={styles.input} />
          </div>
          <button onClick={handleAddUser} disabled={loading} className={styles.buttonPrimary}>{loading ? '...' : '+ AJOUTER'}</button>
        </div>
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>
      <div className={styles.listContainer}>
        {users.map(u => (
          <div key={u.id} className={styles.listItem}>
            <div className={styles.itemContent}>
              <div className={styles.userAvatar}>{u.firstName[0]}{u.lastName[0]}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{u.firstName} {u.lastName.toUpperCase()}</div>
            </div>
            <button onClick={() => setConfirmAction({ type: 'user', id: u.id, message: `Supprimer ${u.firstName} ${u.lastName} ? Toutes ses séances seront supprimées.` })} className={styles.buttonDelete}>SUPPR</button>
          </div>
        ))}
      </div>
    </section>
  )
}