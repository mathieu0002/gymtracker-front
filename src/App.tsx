import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NewSession from './pages/NewSession'
import History from './pages/History'
import Admin from './pages/Admin'
import SelectProfile from './pages/SelectProfile'
import { UserProvider, useUser } from './context/UserContext'
import './index.css'

function NavBar() {
  const { currentUser, setCurrentUser } = useUser()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  // Ferme le menu quand on change de page
  useEffect(() => { setMenuOpen(false) }, [location])

  const navLinks = [
    { to: '/', label: 'DASHBOARD' },
    { to: '/session', label: 'NOUVELLE SÉANCE' },
    { to: '/history', label: 'HISTORIQUE' },
  ]

  return (
    <>
      <nav style={{
        display: 'flex', alignItems: 'center',
        padding: '0 24px', height: 60,
        background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 200,
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 'auto' }}>
          <div style={{
            width: 32, height: 32, border: '2px solid var(--cyan)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, boxShadow: '0 0 12px var(--cyan-dim)',
          }}>⚡</div>
          <span style={{
            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
            fontSize: 20, letterSpacing: 2, textTransform: 'uppercase' as const, color: 'var(--text)',
          }}>
            GYM<span style={{ color: 'var(--cyan)' }}>TRACKER</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({
              padding: '8px 18px', textDecoration: 'none',
              fontSize: 12, fontFamily: 'Rajdhani, sans-serif', fontWeight: 600, letterSpacing: 1.5,
              color: isActive ? 'var(--cyan)' : 'var(--text-dim)',
              borderBottom: isActive ? '2px solid var(--cyan)' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            })}>
              {label}
            </NavLink>
          ))}

          {currentUser && (
            <button onClick={() => setCurrentUser(null)} style={{
              display: 'flex', alignItems: 'center', gap: 8, marginLeft: 12,
              background: 'none', border: '1px solid var(--border)', borderRadius: 6,
              padding: '5px 12px', cursor: 'pointer', transition: 'all 0.15s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--cyan)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{
                width: 24, height: 24, borderRadius: 4, background: 'var(--cyan-dim)',
                border: '1px solid var(--cyan)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontFamily: 'Rajdhani, sans-serif',
                fontWeight: 700, fontSize: 11, color: 'var(--cyan)',
              }}>
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </div>
              <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 12, fontWeight: 600, color: 'var(--text-mid)', letterSpacing: 1 }}>
                {currentUser.firstName.toUpperCase()}
              </span>
            </button>
          )}

          <NavLink to="/admin" style={({ isActive }) => ({
            marginLeft: 8, padding: '6px 14px', textDecoration: 'none',
            fontSize: 11, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 1.5,
            color: isActive ? 'var(--orange)' : 'var(--text-dim)',
            border: `1px solid ${isActive ? 'var(--orange)' : 'var(--border)'}`,
            borderRadius: 4, background: isActive ? 'var(--orange-dim)' : 'transparent',
            transition: 'all 0.15s',
          })}>
            ⚙ ADMIN
          </NavLink>
        </div>

        {/* Burger button — mobile only */}
        <button
          className="burger-btn"
          onClick={() => setMenuOpen(prev => !prev)}
          style={{
            display: 'none',
            background: 'none', border: '1px solid var(--border)',
            borderRadius: 6, padding: '6px 10px', cursor: 'pointer',
            color: 'var(--text)', fontSize: 18, lineHeight: 1,
          }}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="mobile-menu" style={{
          position: 'fixed', top: 60, left: 0, right: 0, bottom: 0,
          background: 'var(--bg-card)', borderTop: '1px solid var(--border)',
          zIndex: 199, display: 'flex', flexDirection: 'column', padding: 24, gap: 8,
        }}>
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({
              padding: '16px 20px', textDecoration: 'none',
              fontSize: 16, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 2,
              color: isActive ? 'var(--cyan)' : 'var(--text)',
              background: isActive ? 'var(--cyan-dim)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--cyan)' : 'var(--border)'}`,
              borderRadius: 8, transition: 'all 0.15s',
              textTransform: 'uppercase' as const,
            })}>
              {label}
            </NavLink>
          ))}

          <NavLink to="/admin" style={({ isActive }) => ({
            padding: '16px 20px', textDecoration: 'none',
            fontSize: 16, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 2,
            color: isActive ? 'var(--orange)' : 'var(--text)',
            background: isActive ? 'var(--orange-dim)' : 'transparent',
            border: `1px solid ${isActive ? 'var(--orange)' : 'var(--border)'}`,
            borderRadius: 8, transition: 'all 0.15s',
            textTransform: 'uppercase' as const,
          })}>
            ⚙ ADMIN
          </NavLink>

          {/* Profil en bas du menu */}
          {currentUser && (
            <div style={{ marginTop: 'auto' }}>
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 8, background: 'var(--cyan-dim)',
                    border: '1px solid var(--cyan)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontFamily: 'Rajdhani, sans-serif',
                    fontWeight: 700, fontSize: 16, color: 'var(--cyan)',
                  }}>
                    {currentUser.firstName[0]}{currentUser.lastName[0]}
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16 }}>
                      {currentUser.firstName} {currentUser.lastName.toUpperCase()}
                    </div>
                    <div style={{ fontFamily: 'Share Tech Mono', fontSize: 10, color: 'var(--text-dim)' }}>
                      PROFIL ACTIF
                    </div>
                  </div>
                </div>
                <button onClick={() => setCurrentUser(null)} style={{
                  width: '100%', padding: '12px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: 'var(--text-dim)', cursor: 'pointer',
                  fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 1,
                  textTransform: 'uppercase' as const,
                }}>
                  CHANGER DE PROFIL
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

function AppContent() {
  const { currentUser } = useUser()
  if (!currentUser) return <SelectProfile />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      <NavBar />
      <main style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/session" element={<NewSession />} />
          <Route path="/history" element={<History />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </BrowserRouter>
  )
}