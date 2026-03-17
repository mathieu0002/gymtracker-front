import { useState, useEffect } from 'react'
import { getSessions, deleteSession } from '../api'
import type { SessionDto } from '../types'
import { SPLIT_LABELS } from '../types'

export default function History() {
  const [sessions, setSessions] = useState<SessionDto[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSessions().then(data => { setSessions(data); setLoading(false) })
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cette séance ?')) return
    await deleteSession(id)
    setSessions(prev => prev.filter(s => s.id !== id))
  }

  if (loading) return (
    <div style={{ color: 'var(--text-dim)', fontFamily: 'Share Tech Mono', fontSize: 13, marginTop: 80, textAlign: 'center' }}>
      CHARGEMENT DES SESSIONS...
    </div>
  )

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 32, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' as const }}>
          HISTO<span style={{ color: 'var(--cyan)', textShadow: '0 0 20px var(--cyan-mid)' }}>RIQUE</span>
        </div>
        <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', marginTop: 4, letterSpacing: 1 }}>
          SESSION_LOG // {sessions.length} ENTRÉE(S)
        </div>
      </div>

      {sessions.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 80, fontFamily: 'Share Tech Mono', fontSize: 13, color: 'var(--text-dim)' }}>
          // AUCUNE SÉANCE ENREGISTRÉE
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sessions.map((session, idx) => (
            <div key={session.id} style={{
              background: 'var(--bg-card)', borderRadius: 8,
              border: '1px solid var(--border)', overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* Header */}
              <div
                onClick={() => setExpanded(expanded === session.id ? null : session.id)}
                style={{
                  padding: '14px 20px', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center',
                  cursor: 'pointer',
                  borderLeft: `3px solid ${expanded === session.id ? 'var(--cyan)' : 'transparent'}`,
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    fontFamily: 'Share Tech Mono', fontSize: 10,
                    color: 'var(--text-dim)', minWidth: 32,
                  }}>
                    #{String(idx + 1).padStart(3, '0')}
                  </div>
                  <div>
                    <div style={{
                      fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                      fontSize: 15, letterSpacing: 1, color: expanded === session.id ? 'var(--cyan)' : 'var(--text)',
                      textTransform: 'uppercase' as const,
                    }}>
                      {session.splits.map(s => SPLIT_LABELS[s]).join(' + ') || 'SÉANCE'}
                    </div>
                    <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)', marginTop: 3 }}>
                      {new Date(session.sessionDate).toLocaleDateString('fr-FR', {
                        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                      }).toUpperCase()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    fontFamily: 'Share Tech Mono', fontSize: 11,
                    color: 'var(--text-dim)', padding: '3px 8px',
                    border: '1px solid var(--border)', borderRadius: 3,
                  }}>
                    {session.exercises?.length ?? 0} EXO
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(session.id) }}
                    style={{
                      background: 'none', border: '1px solid #2a1010',
                      color: 'var(--red)', borderRadius: 4,
                      padding: '4px 10px', cursor: 'pointer',
                      fontFamily: 'Rajdhani, sans-serif', fontSize: 11,
                      fontWeight: 700, letterSpacing: 1,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#2a1010' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                  >
                    SUPPR
                  </button>
                  <span style={{ color: 'var(--text-dim)', fontSize: 12, fontFamily: 'Share Tech Mono' }}>
                    {expanded === session.id ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Détail */}
              {expanded === session.id && session.exercises && (
                <div style={{ borderTop: '1px solid var(--border)', padding: '16px 20px 20px 20px' }}>
                  {session.exercises.length === 0 ? (
                    <div style={{ fontFamily: 'Share Tech Mono', fontSize: 12, color: 'var(--text-dim)' }}>
                      // AUCUN EXERCICE
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {session.exercises.map(ex => (
                        <div key={ex.id}>
                          <div style={{
                            fontFamily: 'Rajdhani, sans-serif', fontWeight: 600,
                            fontSize: 14, letterSpacing: 1, marginBottom: 8,
                            textTransform: 'uppercase' as const,
                            display: 'flex', alignItems: 'center', gap: 10,
                          }}>
                            {ex.exerciseName}
                            <span style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--text-dim)', fontWeight: 400, textTransform: 'none' as const }}>
                              {ex.muscleGroupName}
                            </span>
                          </div>
                          {ex.sets.length === 0 ? (
                            <div style={{ fontFamily: 'Share Tech Mono', fontSize: 11, color: 'var(--text-dim)' }}>// AUCUNE SÉRIE</div>
                          ) : (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {ex.sets.map((set, i) => (
                                <div key={set.id} style={{
                                  background: 'var(--bg)', border: '1px solid var(--border-bright)',
                                  borderRadius: 4, padding: '5px 12px',
                                  fontFamily: 'Share Tech Mono', fontSize: 12, color: 'var(--text-mid)',
                                  display: 'flex', alignItems: 'center', gap: 6,
                                }}>
                                  <span style={{ color: 'var(--text-dim)', fontSize: 10 }}>S{i + 1}</span>
                                  <span style={{ color: 'var(--cyan)' }}>{set.weightKg}kg</span>
                                  <span style={{ color: 'var(--text-dim)' }}>×</span>
                                  <span>{set.reps}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}