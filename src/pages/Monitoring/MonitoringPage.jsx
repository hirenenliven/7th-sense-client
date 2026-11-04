import { useParams } from 'react-router-dom'
import MonitoringMachine from './MonitoringMachine'
import MonitoringMachines from './MonitoringMachines'

// Operations › Monitoring, one page: the machine list (`/monitoring`), or after a machine is picked
// that machine with a back arrow and its Productivity / Machine Health tabs
// (`/monitoring/:machineId/productivity|health`). Another machine starts its view afresh (`key`).
function MonitoringPage() {
  const { machineId } = useParams()
  return machineId ? <MonitoringMachine key={machineId} machineId={machineId} /> : <MonitoringMachines />
}

export default MonitoringPage
