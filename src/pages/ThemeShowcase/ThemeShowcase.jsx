import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  Modal,
  Nav,
  Pagination,
  ProgressBar,
  Row,
  Table,
} from 'react-bootstrap'
import { toast } from '@/utils/toast'

// Sample data — pages should receive this from services/hooks.
const KPIS = [
  { label: 'OEE', value: '68.4', unit: '%', progress: 68, variant: 'primary', meta: 'Target 75%', delta: '-2.1', up: false },
  { label: 'Availability', value: '82.0', unit: '%', progress: 82, variant: 'success', meta: 'vs yesterday', delta: '+1.4', up: true },
  { label: 'Performance', value: '91.2', unit: '%', progress: 91, variant: 'info', meta: 'vs yesterday', delta: '+0.6', up: true },
  { label: 'Quality', value: '91.4', unit: '%', progress: 91, variant: 'warning', meta: 'Scrap 2.3%', delta: '-0.8', up: false },
]

const MACHINES = [
  { id: 'NX-3222', serial: '#JM-1187', cell: 'Cell A', oee: 41, status: 'danger', label: 'Stopped' },
  { id: 'TMC-800', serial: '#JM-1042', cell: 'Cell B', oee: 63, status: 'warning', label: 'Watch' },
  { id: 'VMC-650', serial: '#JM-0981', cell: 'Cell A', oee: 74, status: 'serious', label: 'Slow' },
  { id: 'AX-200', serial: '#JM-1210', cell: 'Cell C', oee: 88, status: 'success', label: 'Running' },
  { id: 'DX-200', serial: '#JM-1301', cell: 'Cell C', oee: 0, status: 'secondary', label: 'No data' },
]

const EXCEPTIONS = [
  { who: 'NX-3222', why: 'Spindle vibration high — machine stopped.', cost: '₹8.3L', status: 'danger' },
  { who: 'TMC-800', why: 'Tool T12 at 94% of rated life.', cost: '₹1.1L', status: 'warning' },
]

const FILTERS = [
  { key: 'all', label: 'All', count: 5 },
  { key: 'alert', label: 'Alerts', count: 3 },
  { key: 'ok', label: 'Running', count: 1 },
]

const TABS = ['Machines', 'Lines', 'Shifts', 'Operators']

function ThemeShowcase() {
  const [tab, setTab] = useState(TABS[0])
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      {/* Page header */}
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Plant · Pune</div>
          <h1>Theme showcase</h1>
          <p className="ts-page-subtitle">Every element on this page uses theme classes only.</p>
        </div>
        <div className="ts-page-actions">
          <span className="ts-chip text-success">
            <i className="ts-dot ts-dot-live" />
            Live
          </span>
          <Form.Select size="sm" className="w-auto" aria-label="Shift">
            <option>Shift A</option>
            <option>Shift B</option>
          </Form.Select>
          <Button variant="ghost" className="btn-icon" aria-label="Refresh">
            ↻
          </Button>
          <Button onClick={() => setShowModal(true)}>Open modal</Button>
        </div>
      </header>

      {/* Sub-nav tabs */}
      <Nav variant="tabs" className="mb-4">
        {TABS.map((t) => (
          <Nav.Item key={t}>
            <Nav.Link active={tab === t} onClick={() => setTab(t)}>
              {t}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>

      <Alert variant="primary">
        <b>Shift summary:</b> OEE is 6.6 pts below target. Two machines need attention before the next changeover.
      </Alert>

      {/* KPI tiles */}
      <Row xs={1} sm={2} xl={4} className="g-3 mb-4">
        {KPIS.map((k) => (
          <Col key={k.label}>
            <Card className="ts-kpi card-clickable h-100">
              <Card.Body>
                <span className="ts-drill">Details →</span>
                <div className="ts-kpi-label">{k.label}</div>
                <div className="ts-kpi-value">
                  {k.value}
                  <small>{k.unit}</small>
                </div>
                <ProgressBar now={k.progress} variant={k.variant} className="progress-thin" />
                <div className="ts-kpi-meta">
                  <span>{k.meta}</span>
                  <span className={k.up ? 'ts-delta-up' : 'ts-delta-down'}>
                    {k.up ? '▲' : '▼'} {k.delta}
                  </span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-3">
        {/* Machines table */}
        <Col lg={8}>
          <Card>
            <Card.Header>
              Machines
              <Button variant="link" size="sm" className="p-0">
                View all →
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="ts-toolbar">
                <Form.Control type="search" placeholder="Search machine, serial, cell…" />
                <ButtonGroup aria-label="Status filter">
                  {FILTERS.map((f) => (
                    <Button
                      key={f.key}
                      variant="ghost"
                      size="sm"
                      active={filter === f.key}
                      onClick={() => setFilter(f.key)}
                    >
                      {f.label}
                      <Badge bg="">{f.count}</Badge>
                    </Button>
                  ))}
                </ButtonGroup>
              </div>

              <div className="ts-table-panel">
                <Table hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Machine</th>
                      <th>Cell</th>
                      <th>OEE</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MACHINES.map((m) => (
                      <tr
                        key={m.id}
                        className={`ts-row-link row-status-${m.status} ${m.status === 'danger' ? 'table-danger' : ''}`}
                      >
                        <td>
                          <div className="fw-semibold">{m.id}</div>
                          <div className="fs-xs text-body-tertiary">{m.serial}</div>
                        </td>
                        <td className="text-body-secondary">{m.cell}</td>
                        <td className="text-nowrap">
                          <div className="d-flex align-items-center gap-2">
                            <ProgressBar now={m.oee} variant={m.status} className="progress-sm flex-grow-1" />
                            <b className="font-tabular">{m.oee}%</b>
                          </div>
                        </td>
                        <td>
                          <Badge bg="" className={`badge-outline-${m.status}`}>
                            {m.label}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-3">
                <span className="fs-sm text-body-secondary">Showing 1–5 of 42</span>
                <Pagination size="sm" className="mb-0">
                  <Pagination.Prev disabled />
                  <Pagination.Item active>{1}</Pagination.Item>
                  <Pagination.Item>{2}</Pagination.Item>
                  <Pagination.Item>{3}</Pagination.Item>
                  <Pagination.Next />
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Right column */}
        <Col lg={4}>
          <div className="d-grid gap-3">
            {/* Exceptions */}
            <Card>
              <Card.Body>
                <h2 className="ts-section-title">Top exceptions</h2>
                <p className="ts-note mb-3">Ranked by cost this shift.</p>
                <div className="d-grid gap-2">
                  {EXCEPTIONS.map((e) => (
                    <div key={e.who} className={`card-inset card-clickable card-status-${e.status}`}>
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div className="fw-bold">{e.who}</div>
                          <div className="fs-sm text-body-secondary">{e.why}</div>
                        </div>
                        <div className="text-end text-nowrap">
                          <b>{e.cost}</b>
                          <div className="fs-xs text-body-tertiary">/ shift</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* Form */}
            <Card>
              <Card.Body>
                <h2 className="ts-section-title">Log a reject</h2>
                <p className="ts-note mb-3">Labels, inputs and states.</p>
                <Form>
                  <Row className="g-2">
                    <Col xs={6}>
                      <Form.Group controlId="ts-qty">
                        <Form.Label>Quantity</Form.Label>
                        <Form.Control type="number" placeholder="0" />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group controlId="ts-reason">
                        <Form.Label>Reason</Form.Label>
                        <Form.Select>
                          <option>Dimension</option>
                          <option>Surface</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Group controlId="ts-note">
                        <Form.Label>Note</Form.Label>
                        <Form.Control as="textarea" rows={2} placeholder="Optional" />
                        <Form.Text>Visible to the shift supervisor.</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Check type="switch" id="ts-notify" label="Notify maintenance" defaultChecked />
                    </Col>
                  </Row>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Button type="button" onClick={() => toast.success('Reject logged for NX-3222.', { title: 'Saved' })}>
                      Save
                    </Button>
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                    <Button type="button" variant="ghost" disabled>
                      Disabled
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {/* Buttons, badges, alerts reference */}
      <Card className="mt-3">
        <Card.Body>
          <h2 className="ts-section-title">Buttons & badges</h2>
          <div className="d-flex flex-wrap gap-2 my-3">
            <Button>Primary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="outline-primary">Outline</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link →</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button disabled>Disabled</Button>
          </div>
          <h2 className="ts-section-title">Toasts</h2>
          <div className="d-flex flex-wrap gap-2 my-3">
            <Button variant="ghost" onClick={() => toast.success('Customer saved successfully.')}>
              Success toast
            </Button>
            <Button variant="ghost" onClick={() => toast.error('Server did not respond.', { title: 'Save failed' })}>
              Error toast
            </Button>
            <Button variant="ghost" onClick={() => toast.warning('Tool T12 is near end of life.')}>
              Warning toast
            </Button>
            <Button variant="ghost" onClick={() => toast.info('Report export started.')}>
              Info toast
            </Button>
          </div>
          <div className="d-flex flex-wrap gap-2 mb-2">
            <Badge bg="" className="badge-outline-success">OK</Badge>
            <Badge bg="" className="badge-outline-warning">Watch</Badge>
            <Badge bg="" className="badge-outline-serious">Serious</Badge>
            <Badge bg="" className="badge-outline-danger">Critical</Badge>
            <Badge bg="" className="badge-outline-muted">No data</Badge>
          </div>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Badge bg="" className="badge-soft-success">Ahead</Badge>
            <Badge bg="" className="badge-soft-danger">Behind</Badge>
            <Badge bg="" className="badge-soft-info">Info</Badge>
            <Badge bg="" className="badge-soft-violet">AI</Badge>
            <Badge bg="primary">Primary</Badge>
          </div>
          <Alert variant="danger" className="mb-2">
            <b>Breakdown:</b> NX-3222 stopped — ticket raised.
          </Alert>
          <Alert variant="success" className="mb-0">
            <b>Resolved:</b> Cell B back to target pace.
          </Alert>
        </Card.Body>
      </Card>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>NX-3222 · #JM-1187</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="ts-eyebrow mb-2">Loss breakdown</div>
          <ProgressBar className="progress-lg mb-3">
            <ProgressBar now={45} variant="danger" key="down" />
            <ProgressBar now={20} variant="warning" key="slow" />
            <ProgressBar now={10} variant="serious" key="scrap" />
          </ProgressBar>
          <div className="ts-legend mb-3">
            <span className="text-danger"><i className="ts-swatch" /> Downtime</span>
            <span className="text-warning"><i className="ts-swatch" /> Slow cycles</span>
            <span className="text-serious"><i className="ts-swatch" /> Scrap</span>
          </div>
          <p className="text-body-secondary mb-0">
            Spindle vibration exceeded the 2σ band for 14 minutes before the stop.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button onClick={() => setShowModal(false)}>Raise ticket</Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default ThemeShowcase
