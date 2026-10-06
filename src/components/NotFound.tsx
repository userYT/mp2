import { Link } from 'react-router-dom'
import StatusMessage from './StatusMessage'

export default function NotFound({ message = 'Page not found.' }: { message?: string }) {
  return (
    <div>
      <StatusMessage kind="empty" message={message} />
      <p>
        <Link to="/list" className="btn">
          Back to list
        </Link>
      </p>
    </div>
  )
}
