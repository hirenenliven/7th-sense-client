import { memo } from 'react'
import PropTypes from 'prop-types'

// Active / Inactive pill for tables, cards and detail views: soft tint, coloured dot.
// <StatusBadge active={record.status !== X_STATUS.INACTIVE} />
function StatusBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }) {
  return (
    <span className={`ts-status ${active ? 'is-active' : 'is-inactive'}`}>
      <span className="ts-status-dot" aria-hidden="true" />
      {active ? activeLabel : inactiveLabel}
    </span>
  )
}

StatusBadge.propTypes = {
  active: PropTypes.bool.isRequired,
  activeLabel: PropTypes.string,
  inactiveLabel: PropTypes.string,
}

export default memo(StatusBadge)
