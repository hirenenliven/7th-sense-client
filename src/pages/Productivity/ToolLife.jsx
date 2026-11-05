import PropTypes from 'prop-types'
import PlannedTab from './PlannedTab'

// Operations › Monitoring › a machine › Tool Life tab (MonitoringMachine passes the machine). Not built yet.
function ToolLife({ machine }) {
  return <PlannedTab title="Tool Life" note={`${machine.name}: how much life each tool has left.`} icon="bi-hourglass-split" />
}

ToolLife.propTypes = {
  machine: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string }).isRequired,
}

export default ToolLife
