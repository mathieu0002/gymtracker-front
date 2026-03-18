import { useState, useEffect } from 'react'
import {
  getMuscleGroups, createMuscleGroup, deleteMuscleGroup,
  getExercises, createCustomExercise, deleteExercise,
  getUsers, createUser, deleteUser,
} from '../api'
import type { MuscleGroupDto, ExerciseDto, SplitType, UserDto } from '../types'
import { SPLIT_LABELS } from '../types'

const SPLITS: SplitType[] = ['pec', 'triceps', 'dos', 'bras', 'epaules', 'jambes', 'cardio', 'abdos']

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
    <div style={{ width: 3, height: 18, background: 'var(--orange)', borderRadius: 2, boxShadow: '0 0 8px var(--orange)' }} />
    <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 2, color: 'var(--text-mid)', textTransform: 'uppercase' as const }}>
      {children}
    </span>
  </div>
)

const inputStyle: React.CSSProperties = {
  padding: '10px 14px', borderRadius: 4, border: '1px solid var(--border)',
  background: 'var(--bg)', color: 'var(--text)', fontSize: 13,
  fontFamily: 'Exo 2, sans-serif', outline: 'none', width: '100%',
}

const btnPrimary: React.CSSProperties = {
  padding: '10px 20px', borderRadius: 4, border: '1px solid var(--orange)',
  background: 'var(--orange-dim)', color: 'var(--orange)', fontSize: 12,
  fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 1.5,
  cursor: 'pointer', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' as const, transition: 'all 0.15s',
}

const btnDelete: React.CSSProperties = {
  padding: '4px 10px', borderRadius: 4, border: '1px solid #2a1010',
  background: 'none', color: 'var(--red)', fontSize: 11,
  fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 1, cursor: 'pointer', transition: 'all 0.15s',
}

export default function Admin() {
  const [muscleGroups, setMuscleGroups] = useState<MuscleGroupDto[]>([])
  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)

  const [mgName, setMgName] = useState('')
  const [mgSplit, setMgSplit] = useState<SplitType>('pec')
  const [mgLoading, setMgLoading] = useState(false)
  const [mgError, setMgError] = useState('')

  const [exName, setExName] = useState('')
  const [exMgId, setExMgId] = useState('')
  const [exDesc, setExDesc] = useState('')
  const [exLoading, setExLoading] = useState(false)
  const [exError, setExError] = useState('')

  const [filterSplit, setFilterSplit] = useState<SplitType | 'all'>('all')

  const [userFirstName, setUserFirstName] = useState('')
  const [userLastName, setUserLastName] = useState('')
  const [userLoading, setUserLoading] = useState(false)
  const [userError, setUserError] = useState('')

  useEffect(() => {
    Promise.all([getMuscleGroups(), getExercises(), getUsers()])
      .then(([mgs, exs, us]) => {
        setMuscleGroups(mgs)
        setExercises(exs)
        setUsers(us)
        if (mgs.length > 0) setExMgId(mgs[0].id)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleAddUser = async () => {
    if (!userFirstName.trim() || !userLastName.trim()) { setUserError('Prénom et nom requis'); return }
    setUserLoading(true); setUserError('')
    try {
      const u = await createUser({ firstName: userFirstName.trim(), lastName: userLastName.trim() })
      setUsers(prev => [...prev, u])
      setUserFirstName(''); setUserLastName('')
    } catch { setUserError('Erreur lors de la création') }
    finally { setUserLoading(false) }
  }

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ? Toutes ses séances seront supprimées.')) return
    await deleteUser(id)
    setUsers(prev => prev.filter(u => u.id !== id))
  }

  const handleAddMuscleGroup = async () => {
    if (!mgName.trim()) { setMgError('Nom requis'); return }
    setMgLoading(true); setMgError('')
    try {
      const mg = await createMuscleGroup({ name: mgName.trim(), split: mgSplit })
      setMuscleGroups(prev => [...prev, mg])
      setMgName('')
    } catch { setMgError('Erreur — ce nom existe peut-être déjà') }
    finally { setMgLoading(false) }
  }

  const handleDeleteMuscleGroup = async (id: string) => {
    if (!confirm('Supprimer ce groupe ?')) return
    await deleteMuscleGroup(id)
    setMuscleGroups(prev => prev.filter(mg => mg.id !== id))
    setExercises(prev => prev.filter(ex => ex.muscleGroupId !== id))
  }

  const handleAddExercise = async () => {
    if (!exName.trim()) { setExError('Nom requis'); return }
    if (!exMgId) { setExError('Groupe musculaire requis'); return }
    setExLoading(true); setExError('')
    try {
      const ex = await createCustomExercise({ name: exName.trim(), muscleGroupId: exMgId, description: exDesc.trim() || undefined })
      setExercises(prev => [...prev, ex])
      setExName(''); setExDesc('')
    } catch { setExError('Erreur — ce nom existe peut-être déjà') }
    finally { setExLoading(false) }
  }

  const handleDeleteExercise = async (id: string) => {
    if (!confirm('Supprimer cet exercice ?')) return
    await deleteExercise(id)
    setExercises(prev => prev.filter(ex => ex.id !== id))
  }

  const filteredExercises = filterSplit === 'all' ? exercises
    : exercises.filter(ex => { const mg = muscleGroups.find(mg => mg.id === ex.muscleGroupId); return mg?.split === filterSplit })

  if (loading) return (
    <div style={{ color: 'var(--text-dim)', fontFamily: 'Share Tech Mono', fontSize: 13, marginTop: 80, textAlign: 'center' }}>CHARGEMENT...</div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }} className="fade-in">
      <div>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const }}>
          PANNEAU <span style={{ color: 'var(--orange)', textShadow: '0 0 20px var(--orange)' }}>ADMIN</span>
        </div>
        <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', marginTop: 4, letterSpacing: 1 }}>
          DATABASE_MANAGEMENT // USERS, EXERCISES & MUSCLE_GROUPS
        </div>
      </div>

      {/* ---- UTILISATEURS ---- */}
      <section>
        <SectionLabel>Utilisateurs ({users.length})</SectionLabel>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '2px solid var(--orange)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', marginBottom: 14, letterSpacing: 1 }}>// NOUVEL UTILISATEUR</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' as const }}>Prénom</div>
              <input value={userFirstName} onChange={e => setUserFirstName(e.target.value)} placeholder="Ex: Mathieu"
                onKeyDown={e => e.key === 'Enter' && handleAddUser()}
                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                style={inputStyle}
              />
            </div>
            <div style={{ flex: 1, minWidth: 140 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' as const }}>Nom</div>
              <input value={userLastName} onChange={e => setUserLastName(e.target.value)} placeholder="Ex: Dupont"
                onKeyDown={e => e.key === 'Enter' && handleAddUser()}
                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                style={inputStyle}
              />
            </div>
            <button onClick={handleAddUser} disabled={userLoading} style={btnPrimary}>{userLoading ? '...' : '+ AJOUTER'}</button>
          </div>
          {userError && <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--red)', marginTop: 10 }}>{userError}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {users.map(u => (
            <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 6, background: 'var(--cyan-dim)', border: '1px solid var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 13, color: 'var(--cyan)' }}>
                  {u.firstName[0]}{u.lastName[0]}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{u.firstName} {u.lastName}</div>
                </div>
              </div>
              <button onClick={() => handleDeleteUser(u.id)} style={btnDelete}
                onMouseEnter={e => e.currentTarget.style.background = '#2a1010'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >SUPPR</button>
            </div>
          ))}
        </div>
      </section>

      {/* ---- GROUPES MUSCULAIRES ---- */}
      <section>
        <SectionLabel>Groupes musculaires ({muscleGroups.length})</SectionLabel>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '2px solid var(--orange)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', marginBottom: 14, letterSpacing: 1 }}>// NOUVEAU GROUPE</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' as const }}>Nom</div>
              <input value={mgName} onChange={e => setMgName(e.target.value)} placeholder="Ex: Grand pectoral"
                onKeyDown={e => e.key === 'Enter' && handleAddMuscleGroup()}
                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                style={inputStyle}
              />
            </div>
            <div style={{ minWidth: 160 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' as const }}>Split</div>
              <select value={mgSplit} onChange={e => setMgSplit(e.target.value as SplitType)} style={{ ...inputStyle, width: 'auto', cursor: 'pointer', colorScheme: 'dark' }}>
                {SPLITS.map(s => <option key={s} value={s}>{SPLIT_LABELS[s]}</option>)}
              </select>
            </div>
            <button onClick={handleAddMuscleGroup} disabled={mgLoading} style={btnPrimary}>{mgLoading ? '...' : '+ AJOUTER'}</button>
          </div>
          {mgError && <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--red)', marginTop: 10 }}>{mgError}</div>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {muscleGroups.map(mg => (
            <div key={mg.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--orange)', border: '1px solid var(--orange-dim)', borderRadius: 3, padding: '2px 8px', background: 'var(--orange-dim)' }}>
                  {SPLIT_LABELS[mg.split as SplitType] ?? mg.split}
                </div>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{mg.name}</span>
              </div>
              <button onClick={() => handleDeleteMuscleGroup(mg.id)} style={btnDelete}
                onMouseEnter={e => e.currentTarget.style.background = '#2a1010'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >SUPPR</button>
            </div>
          ))}
        </div>
      </section>

      {/* ---- EXERCICES ---- */}
      <section>
        <SectionLabel>Exercices ({exercises.length})</SectionLabel>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderTop: '2px solid var(--orange)', borderRadius: 8, padding: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', marginBottom: 14, letterSpacing: 1 }}>// NOUVEL EXERCICE</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const, alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' as const }}>Nom</div>
              <input value={exName} onChange={e => setExName(e.target.value)} placeholder="Ex: Développé couché"
                onKeyDown={e => e.key === 'Enter' && handleAddExercise()}
                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                style={inputStyle}
              />
            </div>
            <div style={{ minWidth: 200 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' as const }}>Groupe musculaire</div>
              <select value={exMgId} onChange={e => setExMgId(e.target.value)} style={{ ...inputStyle, cursor: 'pointer', colorScheme: 'dark' }}>
                {muscleGroups.map(mg => <option key={mg.id} value={mg.id}>{mg.name} ({SPLIT_LABELS[mg.split as SplitType] ?? mg.split})</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 11, color: 'var(--text-dim)', letterSpacing: 1, marginBottom: 6, textTransform: 'uppercase' as const }}>Description (optionnel)</div>
              <input value={exDesc} onChange={e => setExDesc(e.target.value)} placeholder="Notes..."
                onFocus={e => e.target.style.borderColor = 'var(--orange)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                style={inputStyle}
              />
            </div>
            <button onClick={handleAddExercise} disabled={exLoading} style={btnPrimary}>{exLoading ? '...' : '+ AJOUTER'}</button>
          </div>
          {exError && <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--red)', marginTop: 10 }}>{exError}</div>}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
          {['all', ...SPLITS].map(s => (
            <button key={s} onClick={() => setFilterSplit(s as SplitType | 'all')} style={{
              padding: '5px 12px', borderRadius: 4,
              border: `1px solid ${filterSplit === s ? 'var(--orange)' : 'var(--border)'}`,
              background: filterSplit === s ? 'var(--orange-dim)' : 'transparent',
              color: filterSplit === s ? 'var(--orange)' : 'var(--text-dim)',
              fontSize: 11, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
              letterSpacing: 1, cursor: 'pointer', textTransform: 'uppercase' as const,
            }}>
              {s === 'all' ? 'TOUS' : SPLIT_LABELS[s as SplitType]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {filteredExercises.length === 0 ? (
            <div style={{ fontFamily: 'Share Tech Mono', fontSize: 12, color: 'var(--text-dim)', padding: 20 }}>// AUCUN EXERCICE</div>
          ) : filteredExercises.map(ex => {
            const mg = muscleGroups.find(mg => mg.id === ex.muscleGroupId)
            return (
              <div key={ex.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--text-dim)', border: '1px solid var(--border)', borderRadius: 3, padding: '2px 8px', minWidth: 90, textAlign: 'center' as const }}>
                    {mg ? SPLIT_LABELS[mg.split as SplitType] ?? mg.split : '—'}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{ex.name}</div>
                    {mg && <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>{mg.name}</div>}
                  </div>
                  {ex.isCustom && (
                    <div style={{ fontFamily: 'Share Tech Mono', fontSize: 9, color: 'var(--orange)', border: '1px solid var(--orange-dim)', borderRadius: 3, padding: '2px 6px', background: 'var(--orange-dim)' }}>CUSTOM</div>
                  )}
                </div>
                <button onClick={() => handleDeleteExercise(ex.id)} style={btnDelete}
                  onMouseEnter={e => e.currentTarget.style.background = '#2a1010'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >SUPPR</button>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}