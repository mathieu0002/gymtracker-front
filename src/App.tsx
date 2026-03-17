import { BrowserRouter, Routes, Route, NavLink, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import NewSession from './pages/NewSession'
import History from './pages/History'
import Admin from './pages/Admin'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>

        <nav style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '0 32px', height: 60,
          background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          <Link to="/" style={{ marginRight: 40, display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 32, height: 32, border: '2px solid var(--cyan)', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, boxShadow: '0 0 12px var(--cyan-dim)',
            }}>⚡</div>
            <span style={{
              fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
              fontSize: 20, letterSpacing: 2, textTransform: 'uppercase' as const,
              color: 'var(--text)',
            }}>
              GYM<span style={{ color: 'var(--cyan)' }}>TRACKER</span>
            </span>
          </Link>

          {[
            { to: '/', label: 'DASHBOARD' },
            { to: '/session', label: 'NOUVELLE SÉANCE' },
            { to: '/history', label: 'HISTORIQUE' },
          ].map(({ to, label }) => (
            <NavLink key={to} to={to} end style={({ isActive }) => ({
              padding: '8px 18px', textDecoration: 'none',
              fontSize: 12, fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 600, letterSpacing: 1.5,
              color: isActive ? 'var(--cyan)' : 'var(--text-dim)',
              borderBottom: isActive ? '2px solid var(--cyan)' : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            })}>
              {label}
            </NavLink>
          ))}

          <div style={{ marginLeft: 'auto' }}>
            <NavLink to="/admin" style={({ isActive }) => ({
              padding: '6px 14px', textDecoration: 'none',
              fontSize: 11, fontFamily: 'Rajdhani, sans-serif',
              fontWeight: 700, letterSpacing: 1.5,
              color: isActive ? 'var(--orange)' : 'var(--text-dim)',
              border: `1px solid ${isActive ? 'var(--orange)' : 'var(--border)'}`,
              borderRadius: 4,
              background: isActive ? 'var(--orange-dim)' : 'transparent',
              transition: 'all 0.15s',
            })}>
              ⚙ ADMIN
            </NavLink>
          </div>
        </nav>

        <main style={{ padding: '32px', maxWidth: 900, margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/session" element={<NewSession />} />
            <Route path="/history" element={<History />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App