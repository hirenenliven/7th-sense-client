import PropTypes from 'prop-types'
import PlannedTab from './PlannedTab'

// Operations › Monitoring › a machine › Virtual Screen tab (MonitoringMachine passes the machine). Not built yet.
function VirtualScreen({ machine }) {
  return <PlannedTab title="Virtual Screen" note={`${machine.name}: a live view of the machine's screen.`} icon="bi-display" />
}

VirtualScreen.propTypes = {
  machine: PropTypes.shape({ id: PropTypes.number.isRequired, name: PropTypes.string }).isRequired,
}

export default VirtualScreen
