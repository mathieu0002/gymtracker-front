interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      {/* Overlay */}
      <div
        onClick={onCancel}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      />
      {/* Modal */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'var(--bg-card)', border: '1px solid var(--red)',
        borderRadius: 10, padding: 28, maxWidth: 340, width: '100%',
        boxShadow: '0 0 32px rgba(255,23,68,0.2)',
      }}>
        <div style={{
          fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700,
          letterSpacing: 2, color: 'var(--red)', marginBottom: 12,
          textTransform: 'uppercase',
        }}>
          ⚠ CONFIRMATION
        </div>
        <div style={{
          fontFamily: 'Exo 2, sans-serif', fontSize: 14,
          color: 'var(--text)', marginBottom: 24, lineHeight: 1.5,
        }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: '12px', borderRadius: 6,
              border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-dim)', cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif', fontSize: 13,
              fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
          >
            ANNULER
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: '12px', borderRadius: 6,
              border: '1px solid var(--red)', background: 'rgba(255,23,68,0.1)',
              color: 'var(--red)', cursor: 'pointer',
              fontFamily: 'Rajdhani, sans-serif', fontSize: 13,
              fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
              transition: 'all 0.15s',
            }}
          >
            SUPPRIMER
          </button>
        </div>
      </div>
    </div>
  )
}