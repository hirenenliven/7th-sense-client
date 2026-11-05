import { Card } from 'react-bootstrap'
import PropTypes from 'prop-types'

// A machine tab whose screen is not built yet (Tool List, Tool Life, Virtual Screen): the tab
// header, then an empty card saying so
function PlannedTab({ title, note, icon }) {
  return (
    <>
      <div className="ts-tab-header">
        <div>
          <h2 className="ts-section-title">{title}</h2>
          <p className="ts-note mb-0">{note}</p>
        </div>
      </div>

      <Card>
        <Card.Body className="ts-empty">
          <i className={`bi ${icon} ts-empty-icon`} aria-hidden="true" />
          <p className="mb-0">{title} hasn&apos;t been built yet.</p>
        </Card.Body>
      </Card>
    </>
  )
}

PlannedTab.propTypes = {
  title: PropTypes.string.isRequired,
  note: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
}

export default PlannedTab
