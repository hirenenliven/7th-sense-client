import { useState } from 'react'
import { Accordion, Badge, Button, Card, Col, Form, InputGroup, Nav, Row, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import InfoTooltip from '@/components/common/InfoTooltip'
import { ROLE_LABELS } from '@/constants/app'
import { NAV_SECTIONS } from '@/constants/navigation'
import useAuth from '@/hooks/useAuth'
import { BUILT_PATHS } from '@/routes/pages'
import {
  LIST_BASICS,
  ROLE_ACCESS,
  SCREENS,
  SETUP_STEPS,
  SUPPORT_CHECKLIST,
  TROUBLESHOOTING,
  WHO,
} from './userGuideContent'

// System › User Guide: first-time setup in order (who does each step, with a link to its screen),
// who can do what, how the screens work, and troubleshooting by topic. One search box filters every
// section and opens the matching items. Content lives in userGuideContent.js; field-by-field help
// stays on the forms ((i) popovers).

const SECTIONS = [
  { id: 'guide-setup', label: 'First-time setup' },
  { id: 'guide-roles', label: 'Who can do what' },
  { id: 'guide-screens', label: 'Screens' },
  { id: 'guide-help', label: 'Troubleshooting' },
  { id: 'guide-support', label: 'Contact support' },
]

// Every text of a topic, lower case, for the search
const textOf = (...parts) => parts.flat(Infinity).filter(Boolean).join(' ').toLowerCase()

// Steps numbered in setup order (the account team's first, then the company's)
const NUMBERED_STEPS = SETUP_STEPS.map((step, index) => ({
  ...step,
  number: index + 1,
  search: textOf(step.title, step.summary, step.steps, step.tips, WHO[step.who].label),
}))

const navLinks = (item) => item.children ?? [item]

function WhoBadge({ who }) {
  const { label, tone, help } = WHO[who]
  return (
    <Badge bg="" className={`badge-soft-${tone}`} title={help}>
      {label}
    </Badge>
  )
}

WhoBadge.propTypes = {
  who: PropTypes.oneOf(Object.keys(WHO)).isRequired,
}

function OpenLink({ to, label = 'Open screen' }) {
  return (
    <Button as={Link} to={to} variant="ghost" size="sm">
      {label}
      <i className="bi bi-arrow-right ms-1" aria-hidden="true" />
    </Button>
  )
}

OpenLink.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string,
}

// One setup step: number, title, who; the body has the steps, tips and a link to the screen
function SetupStep({ step, canOpen }) {
  return (
    <Accordion.Item eventKey={step.key}>
      <Accordion.Header>
        <span className="d-flex flex-wrap align-items-center gap-2 me-2">
          <span className="ts-guide-step-no" aria-hidden="true">
            {step.number}
          </span>
          <span className="fw-semibold">{step.title}</span>
          <WhoBadge who={step.who} />
        </span>
      </Accordion.Header>
      <Accordion.Body>
        <p className="ts-note mb-3">{step.summary}</p>
        <ol className="vstack gap-2 mb-3 ps-3">
          {step.steps.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ol>
        {step.tips.map((tip) => (
          <div key={tip} className="card-inset d-flex gap-2 mb-2">
            <i className="bi bi-lightbulb text-warning" aria-hidden="true" />
            <span className="ts-note">{tip}</span>
          </div>
        ))}
        {canOpen && (
          <div className="mt-3">
            <OpenLink to={step.path} />
          </div>
        )}
      </Accordion.Body>
    </Accordion.Item>
  )
}

SetupStep.propTypes = {
  step: PropTypes.shape({
    key: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    who: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    summary: PropTypes.string.isRequired,
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
    tips: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  canOpen: PropTypes.bool.isRequired,
}

function SectionCard({ id, icon, title, note, children }) {
  return (
    <Card id={id} className="ts-guide-section">
      <Card.Header>
        <i className={`bi ${icon} text-primary`} aria-hidden="true" />
        {title}
      </Card.Header>
      <Card.Body>
        {note && <p className="ts-note mb-3">{note}</p>}
        {children}
      </Card.Body>
    </Card>
  )
}

SectionCard.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  note: PropTypes.node,
  children: PropTypes.node.isRequired,
}

function UserGuide() {
  const { user, hasRole } = useAuth()
  const [search, setSearch] = useState('')
  const term = search.trim().toLowerCase()
  const matches = (text) => !term || text.includes(term)

  // A step's screen opens only for roles that do that step, once the screen is built
  const canOpen = (step) => hasRole(WHO[step.who].roles) && BUILT_PATHS.has(step.path)

  const steps = NUMBERED_STEPS.filter((step) => matches(step.search))
  const teamSteps = steps.filter((step) => step.who === 'team')
  const companySteps = steps.filter((step) => step.who !== 'team')

  const roles = ROLE_ACCESS.filter((row) => matches(textOf(ROLE_LABELS[row.role], row.can)))

  const screenAreas = SCREENS.map((area) => ({
    ...area,
    items: area.items.filter((item) => matches(textOf(area.area, item.title, item.text, WHO[item.who].label))),
  })).filter((area) => area.items.length)

  const topics = TROUBLESHOOTING.map((topic) => ({
    ...topic,
    items: topic.items.filter((item) => matches(textOf(topic.topic, item.q, item.a))),
  })).filter((topic) => topic.items.length)

  const found = steps.length + roles.length + screenAreas.length + topics.length
  // While searching, the accordions re-open on their matches (remounted per search term)
  const openAll = (keys) => (term ? keys : undefined)

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">System</div>
          <h1>User Guide</h1>
          <p className="ts-page-subtitle">Set up your company step by step, and fix the most common problems yourself.</p>
        </div>
      </header>

      <div className="vstack gap-3">
        {/* Search + jump links */}
        <Card>
          <Card.Body className="vstack gap-3">
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-search" aria-hidden="true" />
              </InputGroup.Text>
              <Form.Control
                type="search"
                placeholder="Search the guide: a screen, a task or the message you see (e.g. “already scheduled”)"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search the guide"
              />
            </InputGroup>
            <div className="d-flex flex-wrap align-items-center gap-2">
              <Nav as="nav" variant="pills" className="ts-guide-jump" aria-label="Guide sections">
                {SECTIONS.map((section) => (
                  <Nav.Link key={section.id} href={`#${section.id}`}>
                    {section.label}
                  </Nav.Link>
                ))}
              </Nav>
              {user?.role && (
                <span className="ts-note ms-auto">
                  Signed in as <strong>{ROLE_LABELS[user.role] ?? user.role}</strong>
                  <InfoTooltip
                    title="Your role"
                    content="Badges show who does each step. Open screen links appear only on the steps your role can do."
                    placement="left"
                  />
                </span>
              )}
            </div>
          </Card.Body>
        </Card>

        {term && !found && (
          <div className="ts-empty">
            <i className="bi bi-search ts-empty-icon" aria-hidden="true" />
            <p className="mb-0">Nothing in the guide matches “{search.trim()}”. Try another word, or see Contact support below.</p>
          </div>
        )}

        {/* First-time setup, in order */}
        {steps.length > 0 && (
          <SectionCard
            id="guide-setup"
            icon="bi-signpost-2"
            title="First-time setup"
            note="Follow the steps in order: each one uses what the step before it added. Open a step to see what to do and where."
          >
            <div className="vstack gap-4">
              {teamSteps.length > 0 && (
                <section>
                  <div className="ts-eyebrow mb-2">Done for you by your account team</div>
                  <Accordion alwaysOpen key={`team-${term}`} defaultActiveKey={openAll(teamSteps.map((step) => step.key))}>
                    {teamSteps.map((step) => (
                      <SetupStep key={step.key} step={step} canOpen={canOpen(step)} />
                    ))}
                  </Accordion>
                </section>
              )}
              {companySteps.length > 0 && (
                <section>
                  <div className="ts-eyebrow mb-2">Your setup</div>
                  <Accordion
                    alwaysOpen
                    key={`company-${term}`}
                    defaultActiveKey={term ? companySteps.map((step) => step.key) : [companySteps[0].key]}
                  >
                    {companySteps.map((step) => (
                      <SetupStep key={step.key} step={step} canOpen={canOpen(step)} />
                    ))}
                  </Accordion>
                </section>
              )}
            </div>
          </SectionCard>
        )}

        {/* Roles */}
        {roles.length > 0 && (
          <SectionCard
            id="guide-roles"
            icon="bi-person-badge"
            title="Who can do what"
            note="Every user sees only their own company’s data. Screens and buttons a role may not use are hidden."
          >
            <div className="ts-table-panel">
              <Table size="sm" responsive className="mb-0">
                <thead>
                  <tr>
                    <th scope="col">Role</th>
                    <th scope="col">Can</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((row) => (
                    <tr key={row.role} className={row.role === user?.role ? 'table-active' : undefined}>
                      <th scope="row" className="fw-semibold text-nowrap">
                        {ROLE_LABELS[row.role]}
                      </th>
                      <td className="text-body-secondary">{row.can}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </SectionCard>
        )}

        {/* Screens */}
        {(screenAreas.length > 0 || !term) && (
          <SectionCard id="guide-screens" icon="bi-grid" title="Screens">
            {!term && (
              <Row xs={1} md={2} xxl={4} className="g-3 mb-4">
                {LIST_BASICS.map((basic) => (
                  <Col key={basic.title}>
                    <div className="card-inset h-100">
                      <h5 className="mb-1">
                        <i className={`bi ${basic.icon} text-primary me-2`} aria-hidden="true" />
                        {basic.title}
                      </h5>
                      <p className="ts-note mb-0">{basic.text}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            )}

            <Accordion alwaysOpen key={`screens-${term}`} defaultActiveKey={openAll(screenAreas.map((area) => area.area))}>
              {screenAreas.map((area) => (
                <Accordion.Item key={area.area} eventKey={area.area}>
                  <Accordion.Header>
                    <span className="fw-semibold">{area.area}</span>
                  </Accordion.Header>
                  <Accordion.Body className="vstack gap-2">
                    {area.items.map((item) => (
                      <div key={item.key} className="card-inset d-flex flex-wrap align-items-start gap-2">
                        <div className="flex-grow-1">
                          <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                            <strong>{item.title}</strong>
                            <WhoBadge who={item.who} />
                          </div>
                          <div className="ts-note">{item.text}</div>
                        </div>
                        {BUILT_PATHS.has(item.path) && <OpenLink to={item.path} label="Open" />}
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              ))}

              {/* Built from the sidebar, so it always matches what this login can see */}
              {!term && (
                <Accordion.Item eventKey="all-screens">
                  <Accordion.Header>
                    <span className="fw-semibold">All screens and what is available today</span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <Row xs={1} md={2} xxl={3} className="g-3">
                      {NAV_SECTIONS.flatMap((section) => section.items.filter((item) => hasRole(item.roles))).map((item) => (
                        <Col key={item.key}>
                          <div className="card-inset h-100">
                            <h5 className="mb-2">
                              <i className={`bi ${item.icon} text-primary me-2`} aria-hidden="true" />
                              {item.label}
                            </h5>
                            <ul className="list-unstyled vstack gap-1 mb-0 small">
                              {navLinks(item)
                                .filter((link) => hasRole(link.roles))
                                .map((link) => (
                                  <li key={link.key} className="d-flex align-items-center justify-content-between gap-2">
                                    {BUILT_PATHS.has(link.path) ? (
                                      <Link to={link.path}>{link.label}</Link>
                                    ) : (
                                      <span className="text-body-secondary">{link.label}</span>
                                    )}
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
                  </Accordion.Body>
                </Accordion.Item>
              )}
            </Accordion>
          </SectionCard>
        )}

        {/* Troubleshooting */}
        {topics.length > 0 && (
          <SectionCard
            id="guide-help"
            icon="bi-life-preserver"
            title="Troubleshooting"
            note="Look up the message you see; most are answered here. Search above with a few words of the message."
          >
            <Row xs={1} xl={2} className="g-4">
              {topics.map((topic) => (
                <Col key={topic.topic}>
                  <div className="ts-section-title mb-2">
                    <i className={`bi ${topic.icon} text-primary me-2`} aria-hidden="true" />
                    {topic.topic}
                  </div>
                  <Accordion flush alwaysOpen key={`${topic.topic}-${term}`} defaultActiveKey={openAll(topic.items.map((item) => item.q))}>
                    {topic.items.map((item) => (
                      <Accordion.Item key={item.q} eventKey={item.q}>
                        <Accordion.Header>{item.q}</Accordion.Header>
                        <Accordion.Body className="ts-note">{item.a}</Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Col>
              ))}
            </Row>
          </SectionCard>
        )}

        {/* Support */}
        <SectionCard
          id="guide-support"
          icon="bi-headset"
          title="Still need help?"
          note="Contact your administrator or your 7th Sense account team. Sending these details gets you an answer faster:"
        >
          <ul className="vstack gap-2 mb-0 ps-3">
            {SUPPORT_CHECKLIST.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </>
  )
}

export default UserGuide
