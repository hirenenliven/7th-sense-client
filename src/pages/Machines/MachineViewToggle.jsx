import { Button, ButtonGroup } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { MACHINE_VIEWS } from './useMachineView'

// Table / card switch of a machine list
function MachineViewToggle({ view, onChange }) {
  return (
    <ButtonGroup aria-label="Machine list view">
      {MACHINE_VIEWS.map((option) => (
        <Button
          key={option.key}
          variant="ghost"
          active={view === option.key}
          aria-pressed={view === option.key}
          title={option.label}
          onClick={() => onChange(option.key)}
        >
          <i className={`bi ${option.icon}`} aria-hidden="true" />
          <span className="visually-hidden">{option.label}</span>
        </Button>
      ))}
    </ButtonGroup>
  )
}

MachineViewToggle.propTypes = {
  view: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default MachineViewToggle
