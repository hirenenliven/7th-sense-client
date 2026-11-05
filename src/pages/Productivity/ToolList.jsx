import PropTypes from 'prop-types'
import PlannedTab from './PlannedTab'

// Operations › Monitoring › a machine › Tool List tab (MonitoringMachine passes the machine). Not built yet.
function ToolList({ machine }) {
  return <PlannedTab title="Tool List" note={`${machine.name}: the tools on this machine.`} icon="bi-tools" />
}

ToolList.propTypes = {
  machine: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string }).isRequired,
}

export default ToolList
