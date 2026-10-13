import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BRANCH_STATUS } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { createBranch, getBranchById, updateBranch } from '@/services/branchService'
import { getUsers } from '@/services/customerService'
import { getUserCities } from '@/services/userCityService'
import { PATTERNS } from '@/utils/validators'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import Loader from '@/components/common/Loader'
import { customerName } from '@/pages/Customers/customerFormat'
import {
  COLOR_PICKER_FALLBACK,
  INITIAL_VALUES,
  REQUIRED_FIELDS,
  UPPERCASE_FIELDS,
  branchSchema,
  toBranchPayload,
  toFormValues,
} from './branchForm'
import { FIELD_HELP } from './branchHelp'

const labelClass = (name) => (REQUIRED_FIELDS.has(name) ? 'required' : undefined)

// Add and edit share this form: /masters/branches/add and /masters/branches/:id/edit
function AddBranch() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(branchSchema),
    defaultValues: INITIAL_VALUES,
  })

  const [customers, setCustomers] = useState([])
  const [customersLoading, setCustomersLoading] = useState(true)
  const [customersError, setCustomersError] = useState('')

  const [cities, setCities] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(true)
  const [citiesError, setCitiesError] = useState('')

  // Branch being edited (null when adding)
  const [existing, setExisting] = useState(null)
  const [branchLoading, setBranchLoading] = useState(isEdit)
  const [branchError, setBranchError] = useState('')

  const colorCode = watch('colorCode')

  // Load customer options
  useEffect(() => {
    let active = true
    getUsers()
      .then((list) => active && setCustomers(list))
      .catch((error) => {
        if (!active) return
        setCustomersError(error.message)
        toast.error(error.message, { title: 'Could not load customers' })
      })
      .finally(() => active && setCustomersLoading(false))
    return () => {
      active = false
    }
  }, [])

  // Load city options (Masters › City)
  useEffect(() => {
    let active = true
    getUserCities()
      .then((list) => active && setCities(list))
      .catch((error) => {
        if (!active) return
        setCitiesError(error.message)
        toast.error(error.message, { title: 'Could not load cities' })
      })
      .finally(() => active && setCitiesLoading(false))
    return () => {
      active = false
    }
  }, [])

  // Edit: load the branch and fill the form (reset() also makes these the Reset values)
  useEffect(() => {
    if (!isEdit) return undefined
    let active = true
    setBranchLoading(true)
    getBranchById(id)
      .then((branch) => {
        if (!active) return
        setExisting(branch)
        reset(toFormValues(branch))
      })
      .catch((error) => active && setBranchError(error.message))
      .finally(() => active && setBranchLoading(false))
    return () => {
      active = false
    }
  }, [id, isEdit, reset])

  // Handle uppercase fields
  const handleChange = (event) => {
    const { name, value } = event.target
    if (UPPERCASE_FIELDS.has(name)) setValue(name, value.toUpperCase())
  }

  const onSubmit = async (values) => {
    try {
      const payload = toBranchPayload(values, existing, cities)
      if (isEdit) {
        await updateBranch(id, payload)
        toast.success(`${payload.name} has been updated.`, { title: 'Branch updated' })
      } else {
        await createBranch(payload)
        toast.success(`${payload.name} has been added.`, { title: 'Branch created' })
      }
      navigate(ROUTES.BRANCHES)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save branch' })
    }
  }

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">Masters · Branches</div>
        <h1>{isEdit ? 'Edit Branch' : 'Add Branch'}</h1>
        <p className="ts-page-subtitle">{isEdit ? 'Update the branch details.' : 'Create a branch and link it to a customer.'}</p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={ROUTES.BRANCHES} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Branch list
        </Button>
      </div>
    </header>
  )

  if (branchLoading) {
    return (
      <>
        {header}
        <Loader text="Loading branch…" />
      </>
    )
  }

  if (branchError) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>Could not load this branch.</b> {branchError}
        </Alert>
      </>
    )
  }

  return (
    <>
      {header}

      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit branch' : 'Add branch'}>
        {/* Branch */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-diagram-3 text-primary" aria-hidden="true" />
            Branch details
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} xxl={4} controlId="code">
                <FieldLabel required help={FIELD_HELP.code}>Code</FieldLabel>
                <Form.Control {...register('code', { onChange: handleChange })} autoComplete="off" maxLength={20} placeholder="PUNE01" isInvalid={Boolean(errors.code)} />
                <Form.Control.Feedback type="invalid">{errors.code?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="name">
                <Form.Label className={labelClass('name')}>Name</Form.Label>
                <Form.Control {...register('name')} autoComplete="off" maxLength={200} isInvalid={Boolean(errors.name)} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control {...register('email')} type="email" autoComplete="off" maxLength={255} isInvalid={Boolean(errors.email)} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="customerId">
                <FieldLabel help={FIELD_HELP.customerId}>Customer</FieldLabel>
                <Form.Select {...register('customerId')} disabled={customersLoading || Boolean(customersError)} isInvalid={Boolean(errors.customerId)}>
                  <option value="">
                    {customersLoading ? 'Loading customers…' : customersError ? 'Customers unavailable' : 'No customer'}
                  </option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customerName(customer)}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.customerId?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="colorCode">
                <FieldLabel help={FIELD_HELP.colorCode}>Colour</FieldLabel>
                <InputGroup hasValidation>
                  <Form.Control
                    type="color"
                    className="form-control-color"
                    value={PATTERNS.hexColor.test(colorCode) ? colorCode : COLOR_PICKER_FALLBACK}
                    onChange={(event) => setValue('colorCode', event.target.value.toUpperCase(), { shouldValidate: true })}
                    aria-label="Pick colour"
                  />
                  <Form.Control {...register('colorCode', { onChange: handleChange })} autoComplete="off" maxLength={7} placeholder="#F58220" isInvalid={Boolean(errors.colorCode)} />
                  <Form.Control.Feedback type="invalid">{errors.colorCode?.message}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="status">
                <Form.Label className={labelClass('status')}>Status</Form.Label>
                <Form.Select {...register('status')} isInvalid={Boolean(errors.status)}>
                  <option value={BRANCH_STATUS.ACTIVE}>Active</option>
                  <option value={BRANCH_STATUS.INACTIVE}>Inactive</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.status?.message}</Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Address & tax */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-geo-alt text-primary" aria-hidden="true" />
            Address &amp; tax
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={8} controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control {...register('address')} autoComplete="street-address" maxLength={500} isInvalid={Boolean(errors.address)} />
                <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="userCityId">
                <FieldLabel help={FIELD_HELP.userCityId}>City</FieldLabel>
                <Form.Select {...register('userCityId')} disabled={citiesLoading || Boolean(citiesError)} isInvalid={Boolean(errors.userCityId)}>
                  <option value="">
                    {citiesLoading ? 'Loading cities…' : citiesError ? 'Cities unavailable' : cities.length ? 'Select city' : 'No cities yet'}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.stateName ? `${city.name} · ${city.stateName}` : city.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.userCityId?.message}</Form.Control.Feedback>
                {!citiesLoading && !citiesError && !cities.length && (
                  <Form.Text>
                    Add cities under <Link to={ROUTES.ORG_CITIES}>Masters › City</Link>.
                  </Form.Text>
                )}
                {existing?.city && !existing.userCityId && (
                  <Form.Text className="d-block">Saved as text: {existing.city}. Pick it from the list to link it.</Form.Text>
                )}
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="gstNumber">
                <Form.Label>GST No.</Form.Label>
                <Form.Control {...register('gstNumber', { onChange: handleChange })} autoComplete="off" maxLength={15} placeholder="22ABCDE1234F1Z5" isInvalid={Boolean(errors.gstNumber)} />
                <Form.Control.Feedback type="invalid">{errors.gstNumber?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="panNumber">
                <Form.Label>PAN No.</Form.Label>
                <Form.Control {...register('panNumber', { onChange: handleChange })} autoComplete="off" maxLength={10} placeholder="ABCDE1234F" isInvalid={Boolean(errors.panNumber)} />
                <Form.Control.Feedback type="invalid">{errors.panNumber?.message}</Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Actions */}
        <div className="ts-form-actions">
          <span className="ts-form-actions-note">
            Fields marked <span className="text-danger">*</span> are required.
          </span>
          <Button variant="ghost" onClick={() => navigate(ROUTES.BRANCHES)} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="ghost" onClick={() => reset()} disabled={isSubmitting}>
            Reset
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                <i className="bi bi-check2 me-2" aria-hidden="true" />
                {isEdit ? 'Update Branch' : 'Save Branch'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default AddBranch
