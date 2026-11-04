import PropTypes from 'prop-types'
import { modeTypeOf } from '@/constants/machines'

// The mode a machine is in now (`machine.modeId`, machine_modes id): a bar in the mode colour
// (--ts-mode-*) and its name; nothing when the collector has not reported a known mode.
function MachineMode({ modeId }) {
  const mode = modeTypeOf(modeId)
  if (!mode) return null

  return (
    <span className="ts-machine-mode">
      <svg className="ts-machine-mode-bar" viewBox="0 0 24 6" aria-hidden="true">
        <rect width="24" height="6" rx="3" fill={mode.color} />
      </svg>
      {mode.label}
    </span>
  )
}

MachineMode.propTypes = {
  modeId: PropTypes.number,
}

export default MachineMode
