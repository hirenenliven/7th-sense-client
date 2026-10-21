import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

// Placeholder for sidebar routes whose screens are not built yet. title / section are the sidebar's
// English keys, shown translated.
function ComingSoon({ title, section }) {
  const { t } = useTranslation()
  return (
    <>
      <header className="ts-page-header">
        <div>
          {section && <div className="ts-eyebrow">{t(section)}</div>}
          <h1>{t(title)}</h1>
          <p className="ts-page-subtitle">{t('This screen is planned and will be available soon.')}</p>
        </div>
      </header>
      <Card>
        <Card.Body className="ts-empty">
          <i className="bi bi-cone-striped ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">{t('{{screen}} hasn’t been built yet.', { screen: t(title) })}</p>
        </Card.Body>
      </Card>
    </>
  )
}

ComingSoon.propTypes = {
  title: PropTypes.string.isRequired,
  section: PropTypes.string,
}

export default ComingSoon
