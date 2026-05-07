import styles from '../Admin.module.css'

export const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.sectionLabel}>
    <div className={styles.sectionDecorator} />
    <span className={styles.sectionLabelText}>
      {children}
    </span>
  </div>
)