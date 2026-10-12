import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold">404</h1>
      <p className="fs-4 text-muted">Page not found</p>
      <Button as={Link} to={ROUTES.HOME} variant="primary">
        Go Home
      </Button>
    </div>
  )
}

export default NotFound
