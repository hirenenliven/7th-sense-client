import { memo } from 'react'
import { Badge } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { HEALTH_STATUS } from './healthSensors'

// Normal / Warning / Critical: icon + label, never colour alone
function HealthStatusBadge({ status }) {
  const { label, icon, badge } = HEALTH_STATUS[status]
  return (
    <Badge bg="" className={badge}>
      <i className={`bi ${icon} me-1`} aria-hidden="true" />
      {label}
    </Badge>
  )
}

HealthStatusBadge.propTypes = {
  status: PropTypes.oneOf(Object.keys(HEALTH_STATUS)).isRequired,
}

export default memo(HealthStatusBadge)
