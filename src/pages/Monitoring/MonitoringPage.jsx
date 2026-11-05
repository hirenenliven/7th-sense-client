import { useParams } from 'react-router-dom'
import MonitoringMachine from './MonitoringMachine'
import MonitoringMachines from './MonitoringMachines'

// Operations › Monitoring, one page: the machine list (`/monitoring`), or after a machine is picked
// that machine with a back arrow and its tabs
// (`/monitoring/:machineId/productivity|health|tools|tool-life|virtual-screen`). Another machine starts its view afresh (`key`).
function MonitoringPage() {
  const { machineId } = useParams()
  return machineId ? <MonitoringMachine key={machineId} machineId={machineId} /> : <MonitoringMachines />
}

export default MonitoringPage
