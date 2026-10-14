import { memo } from 'react'
import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Square icon button for table-row actions (view, edit, delete…). Icons come from
// constants/icons.js; `danger` marks destructive actions (red on hover / focus).
function IconAction({ icon, label, onClick, danger = false }) {
  return (
    <Button
      variant="plain"
      size="sm"
      className={`btn-icon btn-action${danger ? ' btn-action-danger' : ''}`}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      <i className={`bi ${icon}`} aria-hidden="true" />
    </Button>
  )
}

IconAction.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  danger: PropTypes.bool,
}

export default memo(IconAction)
