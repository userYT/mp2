import styles from './TypeBadge.module.css'

export default function TypeBadge({ type }: { type: string }) {
  return <span className={styles.badge}>{type}</span>
}
