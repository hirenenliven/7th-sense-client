import { Accordion, Badge, Button, Card, Col, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import InfoTooltip from '@/components/common/InfoTooltip'
import { NAV_SECTIONS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { BUILT_PATHS } from '@/routes/pages'
import { FIELD_HELP } from '@/pages/Customers/customerHelp'

// The guide covers tasks and the rules a user cannot guess from a label.
// Field-by-field format help lives on the form itself (FIELD_HELP → (i) popovers), not here.

// One-line purpose per sidebar item (keyed by NAV_SECTIONS item key)
const MODULE_PURPOSE = {
  dashboard: 'Start page with an overview of the plant.',
  machines: 'Machine inventory, live health and machine groups.',
  production: 'Plan production runs and follow them live.',
  tools: 'Cutting-tool inventory and tool-life tracking.',
  reports: 'OEE, downtime and production reports.',
  customers: 'Customer accounts and their logins.',
  branches: 'Branches, their tax details and owning customers.',
  countries: 'Countries you work in.',
  states: 'States within each country.',
  cities: 'Cities within each state.',
  'org-branches': 'Branches within each city.',
  locations: 'Locations within each branch.',
  shops: 'Shops within each location.',
  lines: 'Production lines within each shop.',
  cells: 'Cells within each line.',
  supervisors: 'Supervisors assigned to each cell.',
  parts: 'Parts and the operations performed on them.',
  shifts: 'Shift timings and company holidays.',
  users: 'System users, roles and permissions.',
  account: 'Your profile and password.',
  theme: 'Reference of the colours and components used in the app.',
  'user-guide': 'This page.',
  about: 'Version and system information.',
}

const ADD_CUSTOMER_STEPS = [
  { title: 'Company details', text: 'Choose the branch the customer belongs to and enter the legal company name. Add tax IDs and a logo if you have them.' },
  { title: 'Login credentials', text: 'Create the email, user name and password the customer’s account will use.' },
  { title: 'Address', text: 'Select the country first — it decides which tax IDs are required and how State and Zip Code are entered.' },
  { title: 'Contact & settings', text: 'Add the contact person and phone, then set the time zone and production-day start.' },
  { title: 'Save', text: 'Select Save Customer. If anything needs attention, the form jumps to the first field with a problem.' },
]

const COUNTRY_RULES = [
  { field: 'GST No.', india: 'Required · 15 characters', other: 'Optional' },
  { field: 'PAN No.', india: 'Required · 10 characters', other: 'Optional' },
  { field: 'State', india: 'Pick from the list', other: 'Pick from the list' },
  { field: 'Zip Code', india: '6-digit PIN code', other: '3–10 letters, digits, spaces or dashes' },
]

const REPORTING_FIELDS = [FIELD_HELP.timeZone, FIELD_HELP.dayStartFrom]

const FAQ = [
  {
    question: 'I selected Save Customer and nothing was saved.',
    answer: 'Fields that need attention are outlined in red with a message underneath, and the cursor moves to the first one. Fix those fields and save again.',
  },
  {
    question: 'The State field went blank after I changed the country.',
    answer: 'This is expected. Each country has its own list of states, so State is cleared whenever Country changes.',
  },
  {
    question: 'GST No. and PAN No. are not marked required.',
    answer: 'They are required only when Country is India. For other countries they are optional.',
  },
  {
    question: 'The Branch list shows “Branches unavailable”.',
    answer: 'The branch list could not be loaded. Reload the page; if it keeps happening, contact your administrator.',
  },
  {
    question: 'What is the difference between Reset and Cancel?',
    answer: 'Reset clears everything you typed and stays on the form. Cancel leaves the form without saving.',
  },
  {
    question: 'A screen says it is planned and will be available soon.',
    answer: 'That screen has not been released yet. The Modules section above shows which screens are available today.',
  },
]

const navLinks = (item) => item.children ?? [item]

function UserGuide() {
  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">System</div>
          <h1>User Guide</h1>
          <p className="ts-page-subtitle">What each module does and how to complete common tasks.</p>
        </div>
      </header>

      <div className="vstack gap-3">
        {/* Getting started */}
        <Card>
          <Card.Header>
            <i className="bi bi-compass text-primary" aria-hidden="true" />
            Getting started
          </Card.Header>
          <Card.Body>
            <Row xs={1} md={3} className="g-3">
              <Col>
                <div className="card-inset h-100">
                  <h5 className="mb-1">
                    <i className="bi bi-layout-sidebar text-primary me-2" aria-hidden="true" />
                    Find your way
                  </h5>
                  <p className="ts-note mb-0">
                    Open the sidebar with <strong>Menu</strong> in the top bar. Modules with an arrow expand to show their screens.
                  </p>
                </div>
              </Col>
              <Col>
                <div className="card-inset h-100">
                  <h5 className="mb-1">
                    <i className="bi bi-input-cursor-text text-primary me-2" aria-hidden="true" />
                    Fill in forms
                  </h5>
                  <p className="ts-note mb-0">
                    Fields marked <span className="text-danger">*</span> are required. For format help, hover or tap{' '}
                    <InfoTooltip
                      title="Field help"
                      content="Opens a short explanation of the field, an example value and the rules it must follow."
                      example="Try it on GST No. in Add Customer"
                      placement="top"
                    />{' '}
                    next to a label.
                  </p>
                </div>
              </Col>
              <Col>
                <div className="card-inset h-100">
                  <h5 className="mb-1">
                    <i className="bi bi-check2-circle text-primary me-2" aria-hidden="true" />
                    Check your input
                  </h5>
                  <p className="ts-note mb-0">
                    When you save, any field that needs attention turns red with a message explaining what to change.
                  </p>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Modules — built from the sidebar config so it always matches the app */}
        <Card>
          <Card.Header>
            <i className="bi bi-grid text-primary" aria-hidden="true" />
            Modules
          </Card.Header>
          <Card.Body className="vstack gap-4">
            {NAV_SECTIONS.map((section) => (
              <section key={section.key}>
                <div className="ts-eyebrow mb-2">{section.title}</div>
                <Row xs={1} md={2} xxl={4} className="g-3">
                  {section.items.map((item) => (
                    <Col key={item.key}>
                      <div className="card-inset h-100">
                        <h5 className="mb-1">
                          <i className={`bi ${item.icon} text-primary me-2`} aria-hidden="true" />
                          {item.label}
                        </h5>
                        <p className="ts-note mb-2">{MODULE_PURPOSE[item.key]}</p>
                        <ul className="list-unstyled vstack gap-1 mb-0 small">
                          {navLinks(item).map((link) => (
                            <li key={link.key} className="d-flex align-items-center justify-content-between gap-2">
                              {BUILT_PATHS.has(link.path) ? <Link to={link.path}>{link.label}</Link> : <span className="text-body-secondary">{link.label}</span>}
                              {BUILT_PATHS.has(link.path) ? (
                                <Badge bg="" className="badge-soft-success">Available</Badge>
                              ) : (
                                <Badge bg="" className="badge-outline-muted">Coming soon</Badge>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Col>
                  ))}
                </Row>
              </section>
            ))}
          </Card.Body>
        </Card>

        {/* Task: add a customer */}
        <Card>
          <Card.Header>
            <i className="bi bi-building-add text-primary" aria-hidden="true" />
            Add a customer
            <Button as={Link} to={ROUTES.CUSTOMER_ADD} variant="link" size="sm">
              Open Add Customer
              <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
            </Button>
          </Card.Header>
          <Card.Body>
            <p className="ts-note mb-3">
              Creates a customer account together with its login. Go to <strong>Masters › Customers › Add Customer</strong>.
            </p>

            <Row className="g-4">
              <Col lg={6}>
                <div className="ts-section-title mb-2">Steps</div>
                <ol className="vstack gap-2 mb-0 ps-3">
                  {ADD_CUSTOMER_STEPS.map((step) => (
                    <li key={step.title}>
                      <strong>{step.title}</strong>
                      <div className="ts-note">{step.text}</div>
                    </li>
                  ))}
                </ol>
              </Col>

              <Col lg={6} className="vstack gap-4">
                <div>
                  <div className="ts-section-title mb-2">Rules that depend on the country</div>
                  <div className="ts-table-panel">
                    <Table size="sm" className="mb-0">
                      <thead>
                        <tr>
                          <th scope="col">Field</th>
                          <th scope="col">India</th>
                          <th scope="col">Other countries</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COUNTRY_RULES.map((rule) => (
                          <tr key={rule.field}>
                            <th scope="row" className="fw-semibold">{rule.field}</th>
                            <td>{rule.india}</td>
                            <td className="text-body-secondary">{rule.other}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>

                <div>
                  <div className="ts-section-title mb-2">Settings that affect reports</div>
                  <div className="vstack gap-2">
                    {REPORTING_FIELDS.map((help) => (
                      <div key={help.title} className="card-inset">
                        <strong>{help.title}</strong>
                        <div className="ts-note">{help.content}</div>
                        {help.example && <div className="ts-note mt-1"><code>{help.example}</code></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <Card.Header>
            <i className="bi bi-question-circle text-primary" aria-hidden="true" />
            Common questions
          </Card.Header>
          <Card.Body>
            <Accordion flush>
              {FAQ.map((item, index) => (
                <Accordion.Item key={item.question} eventKey={String(index)}>
                  <Accordion.Header>{item.question}</Accordion.Header>
                  <Accordion.Body className="ts-note">{item.answer}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}

export default UserGuide
