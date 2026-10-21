import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { BRANCH_STATUS, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import { createBranch, getBranchById, updateBranch } from '@/services/branchService'
import { getUsers } from '@/services/customerService'
import { getUserCities } from '@/services/userCityService'
import { PATTERNS } from '@/utils/validators'
import i18n from '@/i18n'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import Loader from '@/components/common/Loader'
import StatusToggle from '@/components/common/StatusToggle'
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
import { Trans, useTranslation } from 'react-i18next'

const labelClass = (name) => (REQUIRED_FIELDS.has(name) ? 'required' : undefined)

// Add and edit share this form: /masters/branches/add and /masters/branches/:id/edit
function AddBranch() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  // Only the superadmin works across customers; other users keep the branch's customer as is
  const { hasRole } = useAuth()
  const canPickCustomer = hasRole(SUPERADMIN_ONLY)

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
  const [customersLoading, setCustomersLoading] = useState(canPickCustomer)
  const [customersError, setCustomersError] = useState('')

  const [cities, setCities] = useState([])
  const [citiesLoading, setCitiesLoading] = useState(false)
  const [citiesError, setCitiesError] = useState('')

  // Branch being edited (null when adding)
  const [existing, setExisting] = useState(null)
  const [branchLoading, setBranchLoading] = useState(isEdit)
  const [branchError, setBranchError] = useState('')

  const colorCode = watch('colorCode')
  const customerId = watch('customerId')

  // Load customer options
  useEffect(() => {
    if (!canPickCustomer) return undefined
    let active = true
    getUsers({ filterRole: ROLES.CUSTOMER })
      .then((list) => active && setCustomers(list))
      .catch((error) => {
        if (!active) return
        setCustomersError(error.message)
        toast.error(error.message, { title: i18n.t('Could not load customers') })
      })
      .finally(() => active && setCustomersLoading(false))
    return () => {
      active = false
    }
  }, [canPickCustomer])

  // City options: the picked customer's cities (Masters › City), loaded once the customer is known
  useEffect(() => {
    setCities([])
    setCitiesError('')
    if (!customerId) return undefined
    let active = true
    setCitiesLoading(true)
    getUserCities(undefined, customerId)
      .then((list) => active && setCities(list))
      .catch((error) => {
        if (!active) return
        setCitiesError(error.message)
        toast.error(error.message, { title: i18n.t('Could not load cities') })
      })
      .finally(() => active && setCitiesLoading(false))
    return () => {
      active = false
    }
  }, [customerId])

  // Another customer has other cities, so a new pick clears the chosen one
  const handleCustomerChange = () => setValue('userCityId', '')

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
      const payload = toBranchPayload(values, existing)
      if (isEdit) {
        await updateBranch(id, payload)
        toast.success(t('{{name}} has been updated.', { name: payload.name }), { title: t('Branch updated') })
      } else {
        await createBranch(payload)
        toast.success(t('{{name}} has been added.', { name: payload.name }), { title: t('Branch created') })
      }
      navigate(ROUTES.BRANCHES)
    } catch (error) {
      toast.error(error.message, { title: t('Could not save branch') })
    }
  }

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">{t('Masters · Branches')}</div>
        <h1>{isEdit ? t('Edit Branch') : t('Add Branch')}</h1>
        <p className="ts-page-subtitle">{isEdit ? t('Update the branch details.') : t('Create a branch and link it to a customer.')}</p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={ROUTES.BRANCHES} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          {t('Branch list')}
        </Button>
      </div>
    </header>
  )

  if (branchLoading) {
    return (
      <>
        {header}
        <Loader text={t('Loading branch…')} />
      </>
    )
  }

  if (branchError) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>{t('Could not load this branch.')}</b> {branchError}
        </Alert>
      </>
    )
  }

  return (
    <>
      {header}

      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? t('Edit Branch') : t('Add Branch')}>
        {/* Branch */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-diagram-3 text-primary" aria-hidden="true" />
            {t('Branch details')}
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} xxl={4} controlId="code">
                <FieldLabel required help={FIELD_HELP.code}>{t('Code')}</FieldLabel>
                <Form.Control {...register('code', { onChange: handleChange })} autoComplete="off" maxLength={20} placeholder="PUNE01" isInvalid={Boolean(errors.code)} />
                <Form.Control.Feedback type="invalid">{errors.code?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="name">
                <Form.Label className={labelClass('name')}>{t('Name')}</Form.Label>
                <Form.Control {...register('name')} autoComplete="off" maxLength={200} isInvalid={Boolean(errors.name)} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="email">
                <Form.Label>{t('Email')}</Form.Label>
                <Form.Control {...register('email')} type="email" autoComplete="off" maxLength={255} isInvalid={Boolean(errors.email)} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>

              {canPickCustomer && (
                <Form.Group as={Col} md={6} xxl={4} controlId="customerId">
                  <FieldLabel required help={FIELD_HELP.customerId}>{t('Customer')}</FieldLabel>
                  <Form.Select {...register('customerId', { onChange: handleCustomerChange })} disabled={customersLoading || Boolean(customersError)} isInvalid={Boolean(errors.customerId)}>
                    <option value="">
                      {customersLoading ? t('Loading customers…') : customersError ? t('Customers unavailable') : t('Select customer')}
                    </option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customerName(customer)}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.customerId?.message}</Form.Control.Feedback>
                </Form.Group>
              )}

              <Form.Group as={Col} md={6} xxl={4} controlId="colorCode">
                <FieldLabel help={FIELD_HELP.colorCode}>{t('Colour')}</FieldLabel>
                <InputGroup hasValidation>
                  <Form.Control
                    type="color"
                    className="form-control-color"
                    value={PATTERNS.hexColor.test(colorCode) ? colorCode : COLOR_PICKER_FALLBACK}
                    onChange={(event) => setValue('colorCode', event.target.value.toUpperCase(), { shouldValidate: true })}
                    aria-label={t('Pick colour')}
                  />
                  <Form.Control {...register('colorCode', { onChange: handleChange })} autoComplete="off" maxLength={7} placeholder="#F58220" isInvalid={Boolean(errors.colorCode)} />
                  <Form.Control.Feedback type="invalid">{errors.colorCode?.message}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4}>
                <Form.Label className={labelClass('status')}>{t('Status')}</Form.Label>
                <StatusToggle
                  id="status"
                  {...register('status')}
                  activeValue={BRANCH_STATUS.ACTIVE}
                  inactiveValue={BRANCH_STATUS.INACTIVE}
                  isInvalid={Boolean(errors.status)}
                />
                {errors.status && <div className="invalid-feedback d-block">{errors.status.message}</div>}
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
                <Form.Label>{t('Address')}</Form.Label>
                <Form.Control {...register('address')} autoComplete="street-address" maxLength={500} isInvalid={Boolean(errors.address)} />
                <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={4} controlId="userCityId">
                <FieldLabel help={FIELD_HELP.userCityId}>{t('City')}</FieldLabel>
                {/* key: re-mount once the options arrive, so a saved city loaded earlier shows */}
                <Form.Select
                  key={cities.length}
                  {...register('userCityId')}
                  disabled={!customerId || citiesLoading || Boolean(citiesError)}
                  isInvalid={Boolean(errors.userCityId)}
                >
                  <option value="">
                    {!customerId
                      ? t('Select a customer first')
                      : citiesLoading
                        ? t('Loading cities…')
                        : citiesError
                          ? t('Cities unavailable')
                          : cities.length
                            ? t('Select city')
                            : t('No cities yet')}
                  </option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.stateName ? `${city.name} · ${city.stateName}` : city.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.userCityId?.message}</Form.Control.Feedback>
                {customerId && !citiesLoading && !citiesError && !cities.length && (
                  <Form.Text>
                    <Trans
                      i18nKey="This customer has no cities. Add them under <l>Masters › City</l>."
                      components={{ l: <Link to={ROUTES.ORG_CITIES} /> }}
                    />
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="gstNumber">
                <Form.Label>{t('GST No.')}</Form.Label>
                <Form.Control {...register('gstNumber', { onChange: handleChange })} autoComplete="off" maxLength={15} placeholder="22ABCDE1234F1Z5" isInvalid={Boolean(errors.gstNumber)} />
                <Form.Control.Feedback type="invalid">{errors.gstNumber?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="panNumber">
                <Form.Label>{t('PAN No.')}</Form.Label>
                <Form.Control {...register('panNumber', { onChange: handleChange })} autoComplete="off" maxLength={10} placeholder="ABCDE1234F" isInvalid={Boolean(errors.panNumber)} />
                <Form.Control.Feedback type="invalid">{errors.panNumber?.message}</Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Actions */}
        <div className="ts-form-actions">
          <span className="ts-form-actions-note">
            <Trans i18nKey="Fields marked <r>*</r> are required." components={{ r: <span className="text-danger" /> }} />
          </span>
          <Button variant="ghost" onClick={() => navigate(ROUTES.BRANCHES)} disabled={isSubmitting}>
            {t('Cancel')}
          </Button>
          <Button variant="ghost" onClick={() => reset()} disabled={isSubmitting}>
            {t('Reset')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                {t('Saving…')}
              </>
            ) : (
              <>
                <i className="bi bi-check2 me-2" aria-hidden="true" />
                {isEdit ? t('Update Branch') : t('Save Branch')}
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default AddBranch
