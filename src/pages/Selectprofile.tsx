import { useState, useEffect } from 'react'
import { getUsers } from '../api'
import { useUser } from '../context/UserContext'
import type { UserDto } from '../types'

export default function SelectProfile() {
  const [users, setUsers] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const { setCurrentUser } = useUser()

  useEffect(() => {
    getUsers().then(setUsers).finally(() => setLoading(false))
  }, [])

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }} className="fade-in">

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{
            width: 40, height: 40, border: '2px solid var(--cyan)', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, boxShadow: '0 0 20px var(--cyan-dim)',
          }}>⚡</div>
          <span style={{
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
            fontSize: 26, letterSpacing: 3, textTransform: 'uppercase' as const,
          }}>
            GYM<span style={{ color: 'var(--cyan)' }}>TRACKER</span>
          </span>
        </div>

        {/* Titre */}
        <div style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 700,
          letterSpacing: 2, textTransform: 'uppercase' as const, marginBottom: 8,
        }}>
          QUI ES-TU ?
        </div>
        <div style={{
          fontFamily: 'Share Tech Mono', fontSize: 11,
          color: 'var(--text-dim)', marginBottom: 36, letterSpacing: 1,
        }}>
          SÉLECTIONNE TON PROFIL
        </div>

        {loading ? (
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 13, color: 'var(--text-dim)' }}>
            CHARGEMENT...
          </div>
        ) : users.length === 0 ? (
          <div style={{ fontFamily: 'Share Tech Mono', fontSize: 13, color: 'var(--text-dim)' }}>
            // AUCUN PROFIL — CRÉE-EN UN DEPUIS L'ADMIN
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {users.map(user => (
              <button
                key={user.id}
                onClick={() => setCurrentUser(user)}
                style={{
                  padding: '16px 24px', borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  color: 'var(--text)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 16,
                  transition: 'all 0.15s', textAlign: 'left' as const,
                  width: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--cyan)'
                  e.currentTarget.style.boxShadow = '0 0 16px var(--cyan-dim)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 42, height: 42, borderRadius: 8,
                  background: 'var(--cyan-dim)', border: '1px solid var(--cyan)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                  fontSize: 16, color: 'var(--cyan)', flexShrink: 0,
                }}>
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16, letterSpacing: 1 }}>
                    {user.firstName} {user.lastName.toUpperCase()}
                  </div>
                  <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--text-dim)', marginTop: 2 }}>
                    APPUIE POUR CONTINUER → 
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}