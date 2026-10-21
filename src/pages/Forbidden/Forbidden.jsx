import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useTranslation } from 'react-i18next'

// Shown when a logged-in user opens a screen their role cannot use
function Forbidden() {
  const { t } = useTranslation()
  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold">403</h1>
      <p className="fs-4 text-muted">{t('You do not have permission to view this page.')}</p>
      <Button as={Link} to={ROUTES.HOME} variant="primary">
        {t('Go Home')}
      </Button>
    </div>
  )
}

export default Forbidden
