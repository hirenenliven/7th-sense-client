import PropTypes from 'prop-types'
import { Alert, Button, Spinner } from 'react-bootstrap'
import ChartCard from '@/components/charts/ChartCard'
import { PICKER_LOCALE } from '@/utils/dateTime'
import { CHECK_STATUS, MACHINE_STATE, NETWORK_ROWS, STATUS_LOOK, machineStateLook, networkRowLabel } from './diagnosticsSettings'

const timeFormat = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit', second: '2-digit' })

// Check machine: one ping and one TCP connect to the machine's live IP and port from the server
// (GET /machines/{id}/diagnostics/network). Both answering = the machine is on; otherwise it says
// whether the IP or only the port is closed. The page shares the result with its IP and Port checks.
function MachinePowerCheck({ machine, network, collectorConnected, onCheck }) {
  const { data, error, running } = network
  const hasAddress = Boolean(machine.liveIp) && machine.port > 0
  const look = machineStateLook(data?.machineState, { ip: machine.liveIp, port: machine.port })
  const failed = data && data.machineState !== MACHINE_STATE.ON

  const renderResult = () => {
    if (!hasAddress) {
      return (
        <Alert variant="warning" className="mb-0">
          This machine has no Live IP and port to test. Add them on the machine form.
        </Alert>
      )
    }
    if (running && !data) {
      return (
        <div className="ts-diag-power ts-tone-info card-inset" role="status">
          <Spinner animation="border" size="sm" className="ts-diag-power-icon" aria-hidden="true" />
          <div>
            <div className="fw-semibold">Checking…</div>
            <div className="small text-body-secondary">Testing the IP and port from the server. This takes a few seconds.</div>
          </div>
        </div>
      )
    }
    if (error) {
      return (
        <Alert variant="danger" className="mb-0">
          <b>The test could not run.</b> {error}
        </Alert>
      )
    }
    return (
      <>
        <div className={`ts-diag-power ts-tone-${look.tone} card-inset`} role="status" aria-live="polite">
          <i className={`bi ${look.icon} ts-diag-power-icon`} aria-hidden="true" />
          <div>
            <div className="ts-diag-power-title">{look.title}</div>
            <div className="small">{look.message}</div>
          </div>
        </div>
        {data && (
          <ul className="list-unstyled mb-0">
            {NETWORK_ROWS.map((row) => {
              const check = data[row.key]
              const rowLook = STATUS_LOOK[check.status]
              return (
                <li key={row.key} className={`ts-diag-step ts-tone-${rowLook.tone}`}>
                  <i className={`bi ${rowLook.icon} ts-diag-step-icon`} aria-hidden="true" />
                  <div>
                    <div className="fw-semibold">
                      {row.label} <span className="font-monospace fw-normal text-body-secondary">{row.key === 'ip' ? machine.liveIp : machine.port}</span>
                    </div>
                    <div className="small">{check.message}</div>
                    {check.status !== CHECK_STATUS.OK && check.hint && <div className="small text-body-secondary">{check.hint}</div>}
                  </div>
                  <span className="ts-diag-state small">{networkRowLabel(row, check.status)}</span>
                </li>
              )
            })}
          </ul>
        )}
        {failed && collectorConnected && (
          <div className="small text-body-secondary">The collector is connected to this machine right now, so a firewall may be blocking only this test.</div>
        )}
        {data && (
          <div className="small text-body-secondary font-tabular">
            Checked at {timeFormat.format(new Date(data.checkedAt))}
            {data.latencyMs != null && ` · TCP connect ${data.latencyMs} ms`}
          </div>
        )}
      </>
    )
  }

  return (
    <ChartCard
      title="Is the machine on?"
      subtitle="Tests the IP and port from the server"
      icon="bi-power"
      actions={
        <Button size="sm" onClick={onCheck} disabled={running || !hasAddress}>
          {running ? <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" /> : <i className="bi bi-broadcast me-2" aria-hidden="true" />}
          {running ? 'Checking…' : 'Check machine'}
        </Button>
      }
    >
      <div className="d-flex flex-column gap-3">{renderResult()}</div>
    </ChartCard>
  )
}

MachinePowerCheck.propTypes = {
  machine: PropTypes.shape({ liveIp: PropTypes.string, port: PropTypes.number }).isRequired,
  network: PropTypes.shape({
    data: PropTypes.object,
    error: PropTypes.string,
    running: PropTypes.bool,
  }).isRequired,
  collectorConnected: PropTypes.bool,
  onCheck: PropTypes.func.isRequired,
}

export default MachinePowerCheck
