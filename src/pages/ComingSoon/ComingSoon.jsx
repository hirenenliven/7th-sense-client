import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'

// Placeholder for sidebar routes whose screens are not built yet.
function ComingSoon({ title, section }) {
  return (
    <>
      <header className="ts-page-header">
        <div>
          {section && <div className="ts-eyebrow">{section}</div>}
          <h1>{title}</h1>
          <p className="ts-page-subtitle">This screen is planned and will be available soon.</p>
        </div>
      </header>
      <Card>
        <Card.Body className="ts-empty">
          <i className="bi bi-cone-striped ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">{title} hasn&apos;t been built yet.</p>
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
