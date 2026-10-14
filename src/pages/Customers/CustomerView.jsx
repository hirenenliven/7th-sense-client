import { Fragment, useEffect, useState } from 'react'
import { Alert, Badge, Button, Card, Col, Row } from 'react-bootstrap'
import { Link, generatePath, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { THEMES, USER_STATUS } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { getBranchById } from '@/services/branchService'
import { getUserById } from '@/services/customerService'
import Loader from '@/components/common/Loader'
import { FILTER_OPTIONS } from './customerForm'
import { customerName } from './customerFormat'

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

// Masters › Customers › View: everything GET /users/{id} returns for a customer.
// profile, companyProfile and address may each be null.
function CustomerView() {
  const { id } = useParams()

  const [customer, setCustomer] = useState(null)
  const [branchName, setBranchName] = useState('')
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
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id])

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">Masters · Customers</div>
        <h1>{customer ? customerName({ ...customer, ...customer.companyProfile }) : 'Customer'}</h1>
        <p className="ts-page-subtitle">Customer account, company, address and settings.</p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={ROUTES.CUSTOMERS} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Customer list
        </Button>
        {customer && (
          <Button as={Link} to={generatePath(ROUTES.CUSTOMER_EDIT, { id: String(customer.id) })}>
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
        <Loader text="Loading customer…" />
      </>
    )
  }

  if (error) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>Could not load this customer.</b> {error}
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

  return (
    <>
      {header}

      <Row className="g-3 mb-3">
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
                <Badge key="status" bg={isActive ? 'success' : 'secondary'}>
                  {isActive ? 'Active' : 'Inactive'}
                </Badge>,
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
    </>
  )
}

export default CustomerView
