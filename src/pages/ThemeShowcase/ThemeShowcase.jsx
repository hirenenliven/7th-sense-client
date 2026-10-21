import { useState } from 'react'
import {
  Alert,
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Dropdown,
  Form,
  Modal,
  Nav,
  Pagination,
  ProgressBar,
  Row,
  Table,
} from 'react-bootstrap'
import { toast } from '@/utils/toast'
import DatePicker from '@/components/common/DatePicker'
import TimePicker from '@/components/common/TimePicker'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const [tab, setTab] = useState(TABS[0])
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [sampleDate, setSampleDate] = useState('')
  const [sampleTime, setSampleTime] = useState('06:00')

  return (
    <>
      {/* Page header */}
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Plant · Pune')}</div>
          <h1>{t('Theme showcase')}</h1>
          <p className="ts-page-subtitle">{t('Every element on this page uses theme classes only.')}</p>
        </div>
        <div className="ts-page-actions">
          <span className="ts-chip text-success">
            <i className="ts-dot ts-dot-live" />
            {t('Live')}
          </span>
          <Form.Select size="sm" className="w-auto" aria-label={t('Shift')}>
            <option>{t('Shift A')}</option>
            <option>{t('Shift B')}</option>
          </Form.Select>
          <Button variant="ghost" className="btn-icon" aria-label={t('Refresh')}>
            ↻
          </Button>
          <Button onClick={() => setShowModal(true)}>{t('Open modal')}</Button>
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
              {t('Machines')}
              <Button variant="link" size="sm" className="p-0">
                View all →
              </Button>
            </Card.Header>
            <Card.Body>
              <div className="ts-toolbar">
                <Form.Control type="search" placeholder={t('Search machine, serial, cell…')} />
                <ButtonGroup aria-label={t('Status filter')}>
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
                      <th>{t('Machine')}</th>
                      <th>{t('Cell')}</th>
                      <th>{t('OEE')}</th>
                      <th>{t('Status')}</th>
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
                <h2 className="ts-section-title">{t('Top exceptions')}</h2>
                <p className="ts-note mb-3">{t('Ranked by cost this shift.')}</p>
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
                <h2 className="ts-section-title">{t('Log a reject')}</h2>
                <p className="ts-note mb-3">{t('Labels, inputs and states.')}</p>
                <Form>
                  <Row className="g-2">
                    <Col xs={6}>
                      <Form.Group controlId="ts-qty">
                        <Form.Label>{t('Quantity')}</Form.Label>
                        <Form.Control type="number" placeholder="0" />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group controlId="ts-reason">
                        <Form.Label>{t('Reason')}</Form.Label>
                        <Form.Select>
                          <option>{t('Dimension')}</option>
                          <option>{t('Surface')}</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group controlId="ts-date">
                        <Form.Label>{t('Date')}</Form.Label>
                        <DatePicker value={sampleDate} onChange={setSampleDate} />
                      </Form.Group>
                    </Col>
                    <Col xs={6}>
                      <Form.Group controlId="ts-time">
                        <Form.Label>{t('Shift start')}</Form.Label>
                        <TimePicker value={sampleTime} onChange={setSampleTime} />
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Dropdown>
                        <Dropdown.Toggle variant="ghost" size="sm">
                          {t('Actions')}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Header>Machine NX-3222</Dropdown.Header>
                          <Dropdown.Item as="button" type="button">
                            <i className="bi bi-pencil" aria-hidden="true" />
                            {t('Edit')}
                          </Dropdown.Item>
                          <Dropdown.Item as="button" type="button" active>
                            <i className="bi bi-pin-angle" aria-hidden="true" />
                            {t('Pinned')}
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item as="button" type="button" disabled>
                            <i className="bi bi-trash" aria-hidden="true" />
                            {t('Delete')}
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                    <Col xs={12}>
                      <Form.Group controlId="ts-note">
                        <Form.Label>{t('Note')}</Form.Label>
                        <Form.Control as="textarea" rows={2} placeholder={t('Optional')} />
                        <Form.Text>{t('Visible to the shift supervisor.')}</Form.Text>
                      </Form.Group>
                    </Col>
                    <Col xs={12}>
                      <Form.Label as="span" className="d-block" id="ts-severity-label">
                        {t('Severity')}
                      </Form.Label>
                      <div role="radiogroup" className="ts-radio-group" aria-labelledby="ts-severity-label">
                        <Form.Check inline type="radio" name="ts-severity" id="ts-severity-minor" label={t('Minor')} defaultChecked />
                        <Form.Check inline type="radio" name="ts-severity" id="ts-severity-major" label={t('Major')} />
                        <Form.Check inline type="radio" name="ts-severity" id="ts-severity-critical" label={t('Critical')} disabled />
                      </div>
                    </Col>
                    <Col xs={12}>
                      <Form.Check type="radio" name="ts-scope" id="ts-scope-line" label={t('This line only')} defaultChecked />
                      <Form.Check type="radio" name="ts-scope" id="ts-scope-shop" label={t('Whole shop')} />
                    </Col>
                    <Col xs={12}>
                      <Form.Check type="switch" id="ts-notify" label={t('Notify maintenance')} defaultChecked />
                    </Col>
                  </Row>
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    <Button type="button" onClick={() => toast.success('Reject logged for NX-3222.', { title: t('Saved') })}>
                      {t('Save')}
                    </Button>
                    <Button type="button" variant="ghost">
                      {t('Cancel')}
                    </Button>
                    <Button type="button" variant="ghost" disabled>
                      {t('Disabled')}
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
          <h2 className="ts-section-title">{t('Buttons & badges')}</h2>
          <div className="d-flex flex-wrap gap-2 my-3">
            <Button>{t('Primary')}</Button>
            <Button variant="ghost">{t('Ghost')}</Button>
            <Button variant="outline-primary">{t('Outline')}</Button>
            <Button variant="danger">{t('Danger')}</Button>
            <Button variant="link">Link →</Button>
            <Button size="sm">{t('Small')}</Button>
            <Button size="lg">{t('Large')}</Button>
            <Button disabled>{t('Disabled')}</Button>
          </div>
          <h2 className="ts-section-title">{t('Toasts')}</h2>
          <div className="d-flex flex-wrap gap-2 my-3">
            <Button variant="ghost" onClick={() => toast.success('Customer saved successfully.')}>
              {t('Success toast')}
            </Button>
            <Button variant="ghost" onClick={() => toast.error('Server did not respond.', { title: t('Save failed') })}>
              {t('Error toast')}
            </Button>
            <Button variant="ghost" onClick={() => toast.warning('Tool T12 is near end of life.')}>
              {t('Warning toast')}
            </Button>
            <Button variant="ghost" onClick={() => toast.info('Report export started.')}>
              {t('Info toast')}
            </Button>
          </div>
          <div className="d-flex flex-wrap gap-2 mb-2">
            <Badge bg="" className="badge-outline-success">{t('OK')}</Badge>
            <Badge bg="" className="badge-outline-warning">{t('Watch')}</Badge>
            <Badge bg="" className="badge-outline-serious">{t('Serious')}</Badge>
            <Badge bg="" className="badge-outline-danger">{t('Critical')}</Badge>
            <Badge bg="" className="badge-outline-muted">{t('No data')}</Badge>
          </div>
          <div className="d-flex flex-wrap gap-2 mb-3">
            <Badge bg="" className="badge-soft-success">{t('Ahead')}</Badge>
            <Badge bg="" className="badge-soft-danger">{t('Behind')}</Badge>
            <Badge bg="" className="badge-soft-info">{t('Info')}</Badge>
            <Badge bg="" className="badge-soft-violet">{t('AI')}</Badge>
            <Badge bg="primary">{t('Primary')}</Badge>
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
          <div className="ts-eyebrow mb-2">{t('Loss breakdown')}</div>
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
            {t('Spindle vibration exceeded the 2σ band for 14 minutes before the stop.')}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            {t('Close')}
          </Button>
          <Button onClick={() => setShowModal(false)}>{t('Raise ticket')}</Button>
        </Modal.Footer>
      </Modal>

    </>
  )
}

export default ThemeShowcase
