import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <div className={styles.modalOverlay}>
      {/* Overlay */}
      <div
        onClick={onCancel}
        className={styles.overlayBackground}
      />
      {/* Modal */}
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          ⚠ CONFIRMATION
        </div>
        <div className={styles.modalMessage}>
          {message}
        </div>
        <div className={styles.modalActions}>
          <button
            onClick={onCancel}
            className={styles.buttonCancel}>
            ANNULER
          </button>
          <button
            onClick={onConfirm}
            className={styles.buttonConfirm}>
            SUPPRIMER
          </button>
        </div>
      </div>
    </div>
  )
}