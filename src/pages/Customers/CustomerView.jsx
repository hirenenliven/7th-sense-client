import { Fragment, useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Row } from 'react-bootstrap'
import { Link, generatePath, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ALL_MACHINE_ROLES, ROLE_LABELS, SUPERADMIN_ONLY, THEMES, USER_STATUS } from '@/constants/app'
import useAuth from '@/hooks/useAuth'
import { getBranchById } from '@/services/branchService'
import { getUserById } from '@/services/customerService'
import { getMachines } from '@/services/machineService'
import Loader from '@/components/common/Loader'
import StatusBadge from '@/components/common/StatusBadge'
import { ACCOUNT_KIND, ACCOUNT_PAGES } from './accountPages'
import { FILTER_OPTIONS } from './customerForm'
import { customerName } from './customerFormat'
import { buildOrganizationPaths, filterLabel, hasFilterLevels, loadOrganization, machineMatches, toMachineFilterValues } from './machineFilter'

const EMPTY = '—'

// <input type="time"> style HH:MM from the API timestamp (e.g. 0000-01-01T06:00:00Z)
const toTime = (value) => String(value ?? '').match(/\d{2}:\d{2}/)?.[0] ?? ''

// One card of label / value pairs; blank values show a dash
function DetailCard({ icon, title, items }) {
  return (
    <Card className="h-100">
      <Card.Header>
        <i className={`bi ${icon} text-primary`} aria-hidden="true" />
        {title}
      </Card.Header>
      <Card.Body>
        <dl className="row gy-2 mb-0">
          {items.map(([label, value]) => (
            <Fragment key={label}>
              <Col as="dt" xs={5} className="fw-normal text-body-secondary">
                {label}
              </Col>
              <Col as="dd" xs={7} className="mb-0 text-break">
                {value === null || value === undefined || value === '' ? EMPTY : value}
              </Col>
            </Fragment>
          ))}
        </dl>
      </Card.Body>
    </Card>
  )
}

DetailCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.node)).isRequired,
}

// Account Center › Customer › View and Masters › Users › View (kind): everything GET /users/{id} returns.
// profile, companyProfile and address may each be null. Users also show their role, machines and
// machine filter; only customers have the Filters card.
function CustomerView({ kind = ACCOUNT_KIND.CUSTOMER }) {
  const account = ACCOUNT_PAGES[kind]
  const isUser = kind === ACCOUNT_KIND.USER
  const { id } = useParams()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)

  const [customer, setCustomer] = useState(null)
  const [branchName, setBranchName] = useState('')
  // The company's machines (to name the user's; null until loaded) and organization (to name the machine filter)
  const [companyMachines, setCompanyMachines] = useState(null)
  const [organization, setOrganization] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getUserById(id)
      .then((data) => {
        if (!active) return
        setCustomer(data)
        // Branch name is a nice-to-have; the id is shown if it cannot be loaded
        if (data.branchId) {
          getBranchById(data.branchId)
            .then((branch) => active && setBranchName(branch?.name ?? ''))
            .catch(() => {})
        }
        // Machine and organization names are a nice-to-have too; counts are shown if they cannot be loaded
        if (isUser && (data.machineIds?.length || data.machineFilter)) {
          const userId = isSuperadmin ? data.companyId : undefined
          Promise.all([getMachines(userId), hasFilterLevels(data.machineFilter) ? loadOrganization(userId) : {}])
            .then(([machines, levels]) => {
              if (!active) return
              setCompanyMachines(machines)
              setOrganization(levels)
            })
            .catch(() => {})
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, isUser, isSuperadmin])

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">{account.section}</div>
        <h1>{customer ? customerName({ ...customer, ...customer.companyProfile }) : account.title}</h1>
        <p className="ts-page-subtitle">{account.viewSubtitle}</p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={account.routes.list} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          {account.title} list
        </Button>
        {customer && (
          <Button as={Link} to={generatePath(account.routes.edit, { id: String(customer.id) })}>
            <i className="bi bi-pencil me-2" aria-hidden="true" />
            Edit
          </Button>
        )}
      </div>
    </header>
  )

  if (loading) {
    return (
      <>
        {header}
        <Loader text={`Loading ${account.noun}…`} />
      </>
    )
  }

  if (error) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>Could not load this {account.noun}.</b> {error}
        </Alert>
      </>
    )
  }

  const company = customer.companyProfile ?? {}
  const address = customer.address ?? {}
  const profile = customer.profile ?? {}
  const isActive = customer.status !== USER_STATUS.INACTIVE
  const themeLabel = THEMES.find((option) => option.value === profile.theme)?.label ?? profile.theme
  const chosenFilters = new Set(profile.filters ?? [])
  const filterLabels = FILTER_OPTIONS.filter((option) => chosenFilters.has(option.value))
  const seesAllMachines = ALL_MACHINE_ROLES.includes(customer.role)
  const assignedCount = customer.machineIds?.length ?? 0
  const assigned = new Set(customer.machineIds ?? [])
  const machineNames = (companyMachines ?? []).filter((machine) => assigned.has(machine.id)).map((machine) => machine.name)
  const machineFilter = customer.machineFilter
  const filterPath = hasFilterLevels(machineFilter) ? filterLabel(machineFilter, organization) : ''
  // With all machines the filter gives them: count the company machines under it now (once loaded)
  const filterValues = toMachineFilterValues(machineFilter)
  const organizationPaths = buildOrganizationPaths(organization)
  const filterMachineCount = companyMachines?.filter((machine) => machineMatches(machine, filterValues, organizationPaths)).length
  const machinesValue = seesAllMachines
    ? 'All company machines'
    : machineFilter?.allMachines
      ? `All machines of ${filterPath || 'the company'} (${filterMachineCount == null ? '' : `${filterMachineCount} now, `}new ones included)`
      : machineNames.length
        ? machineNames.join(', ')
        : `${assignedCount} assigned`

  return (
    <>
      {header}

      <Row className="g-3 mb-3">
        {isUser && (
          <Col lg={12}>
            <DetailCard
              icon="bi-shield-check"
              title="Access"
              items={[
                ['Role', ROLE_LABELS[customer.role] ?? customer.role],
                ['Machines', machinesValue],
                ...(!seesAllMachines && filterPath && !machineFilter.allMachines ? [['Organization', filterPath]] : []),
              ]}
            />
          </Col>
        )}
        <Col lg={6}>
          <DetailCard
            icon="bi-building"
            title="Company details"
            items={[
              ['Company Name', company.companyName],
              ['Branch', branchName || customer.branchId],
              ['Finix ID', company.finixId],
              ['GST No.', company.gstNumber],
              ['PAN No.', company.panNumber],
              ['Website', company.website],
              ['Company Logo', profile.profilePicture],
            ]}
          />
        </Col>
        <Col lg={6}>
          <DetailCard
            icon="bi-person-lock"
            title="Login"
            items={[
              ['User Name', customer.username],
              ['Email', customer.email],
              [
                'Status',
                <StatusBadge key="status" active={isActive} />,
              ],
            ]}
          />
        </Col>
        <Col lg={6}>
          <DetailCard
            icon="bi-geo-alt"
            title="Address"
            items={[
              ['Address - 1', address.addressLine1],
              ['Address - 2', address.addressLine2],
              ['City', address.city],
              ['State', address.stateName],
              ['Country', address.countryName],
              ['Zip Code', address.pinCode],
            ]}
          />
        </Col>
        <Col lg={6}>
          <DetailCard
            icon="bi-telephone"
            title="Contact & settings"
            items={[
              ['Contact Person', profile.contactPerson],
              ['Primary Phone', customer.mobile],
              ['Secondary Phone', profile.contactPhone],
              ['Time Zone', profile.timezone],
              ['Day Start From', toTime(profile.startDayTime)],
              ['Theme', themeLabel],
            ]}
          />
        </Col>
      </Row>

      {!isUser && (
        <Card>
          <Card.Header>
            <i className="bi bi-funnel text-primary" aria-hidden="true" />
            Filters
          </Card.Header>
          <Card.Body>
            {filterLabels.length ? (
              <div className="d-flex flex-wrap gap-2">
                {filterLabels.map((option) => (
                  <Badge key={option.value} bg="primary">
                    {option.label}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-body-secondary">No filters selected.</span>
            )}
          </Card.Body>
        </Card>
      )}
    </>
  )
}

CustomerView.propTypes = {
  kind: PropTypes.oneOf(Object.values(ACCOUNT_KIND)),
}

export default CustomerView
