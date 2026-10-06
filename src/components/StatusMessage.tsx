import styles from './StatusMessage.module.css'

interface Props {
  kind: 'loading' | 'error' | 'empty'
  message: string
  onRetry?: () => void
}

export default function StatusMessage({ kind, message, onRetry }: Props) {
  return (
    <div className={styles.box} role={kind === 'error' ? 'alert' : 'status'}>
      {kind === 'loading' && <div className={styles.spinner} aria-hidden="true" />}
      <p>{message}</p>
      {kind === 'error' && onRetry && (
        <button type="button" className="btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
