import { Dropdown, Form } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { MACHINE_HEALTH_SENSORS } from '@/constants/machines'

const ALL_IDS = MACHINE_HEALTH_SENSORS.map((sensor) => sensor.id)

const summary = (count) => {
  if (!count) return 'Select machine health'
  if (count === ALL_IDS.length) return 'All health sensors'
  return `${count} sensor${count === 1 ? '' : 's'} selected`
}

// Multi-select of the machine health sensors (constants/machines.js); value = picked ids.
function HealthSensorPicker({ id, value, onChange, isInvalid = false }) {
  const picked = new Set(value)
  const allPicked = picked.size === ALL_IDS.length

  const toggle = (sensorId) => {
    const next = new Set(picked)
    if (next.has(sensorId)) next.delete(sensorId)
    else next.add(sensorId)
    onChange(ALL_IDS.filter((sensor) => next.has(sensor)))
  }

  return (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle
        id={id}
        variant=""
        className={`form-select ts-select-toggle text-start${isInvalid ? ' is-invalid' : ''}`}
      >
        {summary(picked.size)}
      </Dropdown.Toggle>
      <Dropdown.Menu className="ts-check-menu w-100">
        <div className="px-3 py-2 border-bottom">
          <Form.Check
            id={`${id}-all`}
            label="All sensors"
            checked={allPicked}
            onChange={() => onChange(allPicked ? [] : ALL_IDS)}
          />
        </div>
        <div className="px-3 py-2">
          {MACHINE_HEALTH_SENSORS.map((sensor) => (
            <Form.Check
              key={sensor.id}
              id={`${id}-${sensor.id}`}
              label={sensor.label}
              checked={picked.has(sensor.id)}
              onChange={() => toggle(sensor.id)}
            />
          ))}
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

HealthSensorPicker.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.number).isRequired,
  onChange: PropTypes.func.isRequired,
  isInvalid: PropTypes.bool,
}

export default HealthSensorPicker
