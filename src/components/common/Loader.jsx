import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

function Loader({ text }) {
  const { t } = useTranslation()
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <Spinner animation="border" variant="primary" role="status" />
      <span className="mt-2 text-muted">{text ?? t('Loading…')}</span>
    </div>
  )
}

export default Loader
