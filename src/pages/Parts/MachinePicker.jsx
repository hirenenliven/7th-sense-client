import { Dropdown, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'

const summary = (picked, machines, placeholder) => {
  if (!picked.length) return placeholder
  if (picked.length === 1) return machines.find((machine) => machine.id === picked[0])?.name ?? '1 machine selected'
  if (picked.length === machines.length) return 'All machines'
  return `${picked.length} machines selected`
}

// Multi-select of the customer's machines; value = picked machine ids (in list order).
function MachinePicker({ id, machines, value, onChange, onBlur, placeholder = 'Select machine', disabled = false, isInvalid = false }) {
  const picked = new Set(value)
  const allPicked = machines.length > 0 && machines.every((machine) => picked.has(machine.id))

  const toggle = (machineId) => {
    const next = new Set(picked)
    if (next.has(machineId)) next.delete(machineId)
    else next.add(machineId)
    onChange(machines.filter((machine) => next.has(machine.id)).map((machine) => machine.id))
  }

  return (
    <Dropdown autoClose="outside" onToggle={(open) => !open && onBlur?.()}>
      <Dropdown.Toggle
        id={id}
        variant=""
        disabled={disabled}
        className={`form-select ts-select-toggle text-start text-truncate${isInvalid ? ' is-invalid' : ''}`}
      >
        {summary(value, machines, placeholder)}
      </Dropdown.Toggle>
      <Dropdown.Menu className="ts-check-menu w-100">
        {machines.length > 1 && (
          <div className="ts-check-menu-all">
            <Form.Check
              id={`${id}-all`}
              label="All machines"
              checked={allPicked}
              onChange={() => onChange(allPicked ? [] : machines.map((machine) => machine.id))}
            />
          </div>
        )}
        <div>
          {machines.map((machine) => (
            <Form.Check
              key={machine.id}
              id={`${id}-${machine.id}`}
              label={machine.serialNumber ? `${machine.name} (${machine.serialNumber})` : machine.name}
              checked={picked.has(machine.id)}
              onChange={() => toggle(machine.id)}
            />
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

MachinePicker.propTypes = {
  id: PropTypes.string.isRequired,
  machines: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string.isRequired, serialNumber: PropTypes.string }),
  ).isRequired,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  isInvalid: PropTypes.bool,
}

export default MachinePicker
