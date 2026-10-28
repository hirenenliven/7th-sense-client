import { Accordion, Badge, Button, Card, Col, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import InfoTooltip from '@/components/common/InfoTooltip'
import { ACTION_ICONS } from '@/constants/icons'
import { NAV_SECTIONS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { BUILT_PATHS } from '@/routes/pages'
import { FIELD_HELP } from '@/pages/Customers/customerHelp'

// The guide covers tasks and the rules a user cannot guess from a label.
// Field-by-field format help lives on the form itself (FIELD_HELP → (i) popovers), not here.

// One-line purpose per sidebar item (keyed by NAV_SECTIONS item key)
const MODULE_PURPOSE = {
  dashboard: 'Start page with an overview of the plant.',
  machines: 'Machine inventory, live health, productivity and machine groups.',
  production: 'Plan production runs and follow them live.',
  tools: 'Cutting-tool inventory and tool-life tracking.',
  reports: 'OEE, downtime and production reports.',
  customers: 'Customer accounts, their logins, company details and filters.',
  catalog: 'Machine controllers of each brand and the machine models of each controller (super administrator only).',
  branches: 'Branches with their city, tax details, colour and owning customer.',
  countries: 'Countries you work in — the top of your organisation.',
  states: 'States within each country.',
  cities: 'Cities within each state. Branches are placed in these cities.',
  locations: 'Locations (plants, sites) within each branch.',
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

// Organisation levels, top to bottom. Each one is added under the level above it.
const ORG_LEVELS = [
  { label: 'Country', path: ROUTES.ORG_COUNTRIES, parent: null, editable: false },
  { label: 'State', path: ROUTES.ORG_STATES, parent: 'Country', editable: false },
  { label: 'City', path: ROUTES.ORG_CITIES, parent: 'State', editable: true },
  { label: 'Branch', path: ROUTES.BRANCHES, parent: 'City (optional)', editable: true },
  { label: 'Location', path: ROUTES.ORG_LOCATIONS, parent: 'Branch', editable: true },
  { label: 'Shop', path: ROUTES.ORG_SHOPS, parent: 'Location', editable: true },
  { label: 'Line', path: ROUTES.ORG_LINES, parent: 'Shop', editable: true },
  { label: 'Cell', path: ROUTES.ORG_CELLS, parent: 'Line', editable: true },
  { label: 'Supervisor', path: ROUTES.ORG_SUPERVISORS, parent: 'Cell', editable: true },
]

const ORG_RULES = [
  'Work from the top down: a state needs a country, a city needs a state, and so on.',
  'Each screen lists the level with its parent. Use the search box or the parent filter to narrow the list.',
  'Add and Edit open a small form: pick the parent, type the name and save. Names can be up to 100 characters and must be unique under the same parent.',
  'Country and State cannot be edited. To correct one, delete it and add it again.',
  'Something that still has items under it cannot be deleted — delete those items first. The message tells you what is in the way.',
]

const ADD_CUSTOMER_STEPS = [
  { title: 'Company details', text: 'Choose the branch the customer belongs to and enter the legal company name. Add Finix ID, tax IDs, website and logo if you have them.' },
  { title: 'Login credentials', text: 'Create the email, user name and password the customer’s account will use. The password is set only when adding.' },
  { title: 'Address', text: 'Select the country first — it decides which tax IDs are required and how State and Zip Code are entered.' },
  { title: 'Contact & settings', text: 'Add the contact person and phones, then set the time zone, production-day start and the colour theme the customer sees.' },
  { title: 'Filters', text: 'Tick the filters the customer may use on dashboards and reports (Country to Supervisor). Use Select all or Clear for speed.' },
  { title: 'Save', text: 'Select Save Customer. If anything needs attention, the form jumps to the first field with a problem.' },
]

const COUNTRY_RULES = [
  { field: 'GST No.', india: 'Required · 15 characters', other: 'Optional' },
  { field: 'PAN No.', india: 'Required · 10 characters', other: 'Optional' },
  { field: 'State', india: 'Pick from the list', other: 'Pick from the list' },
  { field: 'Zip Code', india: '6-digit PIN code', other: '3–10 letters, digits, spaces or dashes' },
]

const REPORTING_FIELDS = [FIELD_HELP.timeZone, FIELD_HELP.dayStartFrom, FIELD_HELP.filters]

const CUSTOMER_LIST_ACTIONS = [
  { icon: ACTION_ICONS.status, title: 'Status', text: 'Switch a customer active or inactive straight from the list.' },
  { icon: ACTION_ICONS.view, title: 'View', text: 'Open every detail of the customer: company, login, address, settings and filters.' },
  { icon: ACTION_ICONS.edit, title: 'Edit', text: 'Change any detail. The password is not shown or changed here.' },
  { icon: ACTION_ICONS.delete, title: 'Delete', text: 'Removes the customer and their login after you confirm.' },
]

const ADD_BRANCH_STEPS = [
  { title: 'Branch details', text: 'Enter a short code (capitals and digits, e.g. PUNE01) and the branch name. Email, owning customer and colour are optional; status starts as Active.' },
  { title: 'Address & tax', text: 'Type the address and pick the City from your cities. GST No. and PAN No. are optional but checked when filled in.' },
  { title: 'Save', text: 'Select Save Branch. The branch then appears in the Branch dropdown of Add Customer and as a parent for locations.' },
]

const FAQ = [
  {
    question: 'I selected Save and nothing was saved.',
    answer: 'Fields that need attention are outlined in red with a message underneath, and the cursor moves to the first one. Fix those fields and save again. If the server rejects the data, its message appears in a notification at the corner of the screen.',
  },
  {
    question: 'The State field went blank after I changed the country.',
    answer: 'This is expected. Each country has its own list of states, so State is cleared whenever Country changes.',
  },
  {
    question: 'GST No. and PAN No. are not marked required.',
    answer: 'On Add Customer they are required only when Country is India. On Add Branch they are always optional.',
  },
  {
    question: 'How do I change a customer’s password?',
    answer: 'The password is set when the customer is added. Edit Customer does not change it.',
  },
  {
    question: 'The City dropdown on Add Branch is empty.',
    answer: 'It lists the cities from Masters › City. Add the country, state and city there first, then come back to the branch.',
  },
  {
    question: 'An Add button is greyed out or a screen says to add something first.',
    answer: 'Every level belongs to the one above it, so the parent must exist before you can add to it — for example a shop needs a location.',
  },
  {
    question: 'I cannot delete a country, city, branch or line.',
    answer: 'It still has items under it. Delete those first, starting from the bottom of the organisation, then try again.',
  },
  {
    question: 'A dropdown shows “unavailable”.',
    answer: 'Its list could not be loaded. Reload the page; if it keeps happening, contact your administrator.',
  },
  {
    question: 'What is the difference between Reset and Cancel?',
    answer: 'Reset puts the form back to how it was when you opened it and stays on the page. Cancel leaves the form without saving.',
  },
  {
    question: 'A screen says it is planned and will be available soon.',
    answer: 'That screen has not been released yet. The Modules section above shows which screens are available today.',
  },
]

const navLinks = (item) => item.children ?? [item]

// Numbered steps for a task card
function StepList({ steps }) {
  return (
    <ol className="vstack gap-2 mb-0 ps-3">
      {steps.map((step) => (
        <li key={step.title}>
          <strong>{step.title}</strong>
          <div className="ts-note">{step.text}</div>
        </li>
      ))}
    </ol>
  )
}

StepList.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.shape({ title: PropTypes.string.isRequired, text: PropTypes.string.isRequired })).isRequired,
}

// Card header link to the screen a task is done on
function OpenLink({ to, label }) {
  return (
    <Button as={Link} to={to} variant="link" size="sm">
      {label}
      <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
    </Button>
  )
}

OpenLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}

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
            <Row xs={1} md={2} xxl={4} className="g-3">
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
                    <i className="bi bi-list-ol text-primary me-2" aria-hidden="true" />
                    Set up in order
                  </h5>
                  <p className="ts-note mb-0">
                    Build your organisation first (Country → Supervisor), then branches, then customers. See <strong>Set up your organisation</strong> below.
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
                    When you save, any field that needs attention turns red with a message. Results and server messages appear as notifications.
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

        {/* Task: organisation hierarchy */}
        <Card>
          <Card.Header>
            <i className="bi bi-diagram-3 text-primary" aria-hidden="true" />
            Set up your organisation
            <OpenLink to={ROUTES.ORG_COUNTRIES} label="Open Country" />
          </Card.Header>
          <Card.Body>
            <p className="ts-note mb-3">
              Your organisation is a chain of levels under <strong>Masters</strong>, from Country down to Supervisor. Each level is added under one from the level above.
            </p>

            <Row className="g-4">
              <Col lg={6}>
                <div className="ts-section-title mb-2">Levels, top to bottom</div>
                <div className="ts-table-panel">
                  <Table size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th scope="col">Level</th>
                        <th scope="col">Belongs To</th>
                        <th scope="col">Edit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ORG_LEVELS.map((level) => (
                        <tr key={level.label}>
                          <th scope="row" className="fw-semibold">
                            <Link to={level.path}>{level.label}</Link>
                          </th>
                          <td className="text-body-secondary">{level.parent ?? '—'}</td>
                          <td className="text-body-secondary">{level.editable ? 'Yes' : 'Delete and add again'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>

              <Col lg={6}>
                <div className="ts-section-title mb-2">Rules</div>
                <ul className="vstack gap-2 mb-0 ps-3 ts-note">
                  {ORG_RULES.map((rule) => (
                    <li key={rule}>{rule}</li>
                  ))}
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Task: add a branch */}
        <Card>
          <Card.Header>
            <i className="bi bi-signpost-split text-primary" aria-hidden="true" />
            Add a branch
            <OpenLink to={ROUTES.BRANCH_ADD} label="Open Add Branch" />
          </Card.Header>
          <Card.Body>
            <p className="ts-note mb-3">
              Go to <strong>Masters › Branches › Add Branch</strong>. Add its city under <strong>Masters › City</strong> first so you can pick it.
            </p>
            <Row className="g-4">
              <Col lg={6}>
                <div className="ts-section-title mb-2">Steps</div>
                <StepList steps={ADD_BRANCH_STEPS} />
              </Col>
              <Col lg={6}>
                <div className="ts-section-title mb-2">In the Branch List</div>
                <p className="ts-note mb-0">
                  Search by ID, code, name, email or city. Use the switch to make a branch active or inactive, the pencil to edit it and the bin to delete it.
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Task: add a customer */}
        <Card>
          <Card.Header>
            <i className="bi bi-building-add text-primary" aria-hidden="true" />
            Add a customer
            <OpenLink to={ROUTES.CUSTOMER_ADD} label="Open Add Customer" />
          </Card.Header>
          <Card.Body>
            <p className="ts-note mb-3">
              Creates a customer account together with its login. Go to <strong>Masters › Customers › Add Customer</strong>.
            </p>

            <Row className="g-4">
              <Col lg={6}>
                <div className="ts-section-title mb-2">Steps</div>
                <StepList steps={ADD_CUSTOMER_STEPS} />
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
                          <th scope="col">Other Countries</th>
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

        {/* Task: manage customers */}
        <Card>
          <Card.Header>
            <i className="bi bi-people text-primary" aria-hidden="true" />
            Manage customers
            <OpenLink to={ROUTES.CUSTOMERS} label="Open Customer List" />
          </Card.Header>
          <Card.Body>
            <p className="ts-note mb-3">
              <strong>Masters › Customers › Customer List</strong> shows every customer. Search by ID, user name, customer, email or mobile, and choose how many rows to show per page.
            </p>
            <Row xs={1} md={2} xxl={4} className="g-3">
              {CUSTOMER_LIST_ACTIONS.map((action) => (
                <Col key={action.title}>
                  <div className="card-inset h-100">
                    <h5 className="mb-1">
                      <i className={`bi ${action.icon} text-primary me-2`} aria-hidden="true" />
                      {action.title}
                    </h5>
                    <p className="ts-note mb-0">{action.text}</p>
                  </div>
                </Col>
              ))}
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
