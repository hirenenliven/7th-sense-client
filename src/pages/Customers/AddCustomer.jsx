import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { COUNTRIES, TIME_ZONES, getStates } from '@/constants/locations'
import { ROUTES } from '@/constants/routes'
import { createCustomer, getBranches } from '@/services/customerService'
import { formatFileSize } from '@/utils/helpers'
import { toast } from '@/utils/toast'
import {
  FIELD_ID_PREFIX,
  INITIAL_VALUES,
  LOGO_RULES,
  UPPERCASE_FIELDS,
  customerSchema,
  isFieldRequired,
} from './customerForm'

const fieldId = (name) => `${FIELD_ID_PREFIX}${name}`

function AddCustomer() {
  const navigate = useNavigate()
  const logoInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: INITIAL_VALUES,
  })

  const [showPassword, setShowPassword] = useState(false)

  const [branches, setBranches] = useState([])
  const [branchesLoading, setBranchesLoading] = useState(true)
  const [branchesError, setBranchesError] = useState('')

  // Watch specific fields for conditional logic
  const country = watch('country')
  const logo = watch('logo')

  const states = getStates(country)

  // Load branch options
  useEffect(() => {
    let active = true
    getBranches()
      .then((list) => active && setBranches(list))
      .catch((error) => {
        if (!active) return
        setBranchesError(error.message)
        toast.error(error.message, { title: 'Could not load branches' })
      })
      .finally(() => active && setBranchesLoading(false))
    return () => {
      active = false
    }
  }, [])

  // Logo preview URL (revoked when replaced/unmounted)
  const logoPreview = useMemo(
    () => (logo && LOGO_RULES.types.includes(logo.type) ? URL.createObjectURL(logo) : ''),
    [logo],
  )
  useEffect(() => () => logoPreview && URL.revokeObjectURL(logoPreview), [logoPreview])

  // Handle country change to reset state
  const handleCountryChange = (event) => {
    setValue('country', event.target.value)
    setValue('state', '') // Reset state when country changes
  }

  // Handle uppercase fields
  const handleChange = (event) => {
    const { name, value } = event.target
    if (UPPERCASE_FIELDS.has(name)) {
      setValue(name, value.toUpperCase())
    }
  }

  const removeLogo = () => {
    if (logoInputRef.current) logoInputRef.current.value = ''
    setValue('logo', null)
  }

  // Add required class to label for visual indication
  const labelClass = (name) => (isFieldRequired(name, country) ? 'required' : undefined)

  const onSubmit = async (values) => {
    try {
      await createCustomer(values)
      toast.success(`${values.companyName} has been added.`, { title: 'Customer created' })
      reset()
      if (logoInputRef.current) logoInputRef.current.value = ''
    } catch (error) {
      if (error.message) {
        toast.error(error.message, { title: 'Could not save customer' })
      }
    }
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Masters · Customers</div>
          <h1>Add Customer</h1>
          <p className="ts-page-subtitle">Create a customer account and its login.</p>
        </div>
        <div className="ts-page-actions">
          <Button as={Link} to={ROUTES.CUSTOMERS} variant="ghost">
            <i className="bi bi-arrow-left me-2" aria-hidden="true" />
            Customer list
          </Button>
        </div>
      </header>

      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label="Add customer">
        {/* Company */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-building text-primary" aria-hidden="true" />
            Company details
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('branchId')}>
                <Form.Label className={labelClass('branchId')}>Branch</Form.Label>
                <Form.Select {...register('branchId')} disabled={branchesLoading || Boolean(branchesError)} isInvalid={Boolean(errors.branchId)}>
                  <option value="">
                    {branchesLoading ? 'Loading branches…' : branchesError ? 'Branches unavailable' : 'Select branch'}
                  </option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.branchId?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('companyName')}>
                <Form.Label className={labelClass('companyName')}>Company Name</Form.Label>
                <Form.Control {...register('companyName')} autoComplete="organization" maxLength={150} isInvalid={Boolean(errors.companyName)} />
                <Form.Control.Feedback type="invalid">{errors.companyName?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('finixId')}>
                <Form.Label>Finix ID</Form.Label>
                <Form.Control {...register('finixId')} autoComplete="off" />
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('gstNo')}>
                <Form.Label className={labelClass('gstNo')}>GST No.</Form.Label>
                <Form.Control {...register('gstNo', { onChange: handleChange })} autoComplete="off" maxLength={15} placeholder="22ABCDE1234F1Z5" isInvalid={Boolean(errors.gstNo)} />
                <Form.Control.Feedback type="invalid">{errors.gstNo?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('panNo')}>
                <Form.Label className={labelClass('panNo')}>PAN No.</Form.Label>
                <Form.Control {...register('panNo', { onChange: handleChange })} autoComplete="off" maxLength={10} placeholder="ABCDE1234F" isInvalid={Boolean(errors.panNo)} />
                <Form.Control.Feedback type="invalid">{errors.panNo?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('website')}>
                <Form.Label>Website</Form.Label>
                <Form.Control {...register('website')} type="url" autoComplete="url" placeholder="www.example.com" isInvalid={Boolean(errors.website)} />
                <Form.Control.Feedback type="invalid">{errors.website?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('logo')}>
                <Form.Label>Company Logo</Form.Label>
                <Form.Control
                  ref={logoInputRef}
                  type="file"
                  accept={LOGO_RULES.accept}
                  {...register('logo')}
                  isInvalid={Boolean(errors.logo)}
                />
                <Form.Control.Feedback type="invalid">{errors.logo?.message}</Form.Control.Feedback>
                {!errors.logo && (
                  <Form.Text>PNG, JPG, SVG or WEBP · max {formatFileSize(LOGO_RULES.maxBytes)}</Form.Text>
                )}
                {logo && (
                  <div className="ts-file-preview mt-2">
                    {logoPreview && <img src={logoPreview} alt="Logo preview" className="ts-file-preview-img" />}
                    <div className="ts-file-preview-meta">
                      <div className="text-truncate">{logo.name}</div>
                      <div className="fs-xs text-body-tertiary">{formatFileSize(logo.size)}</div>
                    </div>
                    <Button variant="plain" size="sm" className="btn-icon" onClick={removeLogo} aria-label="Remove logo">
                      <i className="bi bi-trash3" aria-hidden="true" />
                    </Button>
                  </div>
                )}
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Login */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-person-lock text-primary" aria-hidden="true" />
            Login credentials
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('email')}>
                <Form.Label className={labelClass('email')}>Email</Form.Label>
                <Form.Control {...register('email')} type="email" autoComplete="off" isInvalid={Boolean(errors.email)} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('username')}>
                <Form.Label className={labelClass('username')}>User Name</Form.Label>
                <Form.Control {...register('username')} autoComplete="off" isInvalid={Boolean(errors.username)} />
                <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('password')}>
                <Form.Label className={labelClass('password')}>Password</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    isInvalid={Boolean(errors.password)}
                  />
                  <Button
                    variant="ghost"
                    onClick={() => setShowPassword((show) => !show)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                  </Button>
                  <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Address */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-geo-alt text-primary" aria-hidden="true" />
            Address
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} controlId={fieldId('address1')}>
                <Form.Label className={labelClass('address1')}>Address - 1</Form.Label>
                <Form.Control {...register('address1')} autoComplete="address-line1" isInvalid={Boolean(errors.address1)} />
                <Form.Control.Feedback type="invalid">{errors.address1?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId={fieldId('address2')}>
                <Form.Label>Address - 2</Form.Label>
                <Form.Control {...register('address2')} autoComplete="address-line2" />
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId={fieldId('country')}>
                <Form.Label className={labelClass('country')}>Country</Form.Label>
                <Form.Select {...register('country', { onChange: handleCountryChange })} autoComplete="country" isInvalid={Boolean(errors.country)}>
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.country?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId={fieldId('state')}>
                <Form.Label className={labelClass('state')}>State</Form.Label>
                {states.length ? (
                  <Form.Select {...register('state')} isInvalid={Boolean(errors.state)}>
                    <option value="">Select state</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control {...register('state')} autoComplete="address-level1" isInvalid={Boolean(errors.state)} />
                )}
                <Form.Control.Feedback type="invalid">{errors.state?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId={fieldId('city')}>
                <Form.Label className={labelClass('city')}>City</Form.Label>
                <Form.Control {...register('city')} autoComplete="address-level2" isInvalid={Boolean(errors.city)} />
                <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId={fieldId('zipCode')}>
                <Form.Label className={labelClass('zipCode')}>Zip Code</Form.Label>
                <Form.Control {...register('zipCode')} autoComplete="postal-code" inputMode="numeric" maxLength={10} isInvalid={Boolean(errors.zipCode)} />
                <Form.Control.Feedback type="invalid">{errors.zipCode?.message}</Form.Control.Feedback>
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Contact & settings */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-telephone text-primary" aria-hidden="true" />
            Contact &amp; settings
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('contactPerson')}>
                <Form.Label className={labelClass('contactPerson')}>Contact Person</Form.Label>
                <Form.Control {...register('contactPerson')} autoComplete="name" isInvalid={Boolean(errors.contactPerson)} />
                <Form.Control.Feedback type="invalid">{errors.contactPerson?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('primaryPhone')}>
                <Form.Label className={labelClass('primaryPhone')}>Primary Phone</Form.Label>
                <Form.Control {...register('primaryPhone')} type="tel" autoComplete="tel" placeholder="+91 98765 43210" isInvalid={Boolean(errors.primaryPhone)} />
                <Form.Control.Feedback type="invalid">{errors.primaryPhone?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('secondaryPhone')}>
                <Form.Label>Secondary Phone</Form.Label>
                <Form.Control {...register('secondaryPhone')} type="tel" autoComplete="tel" isInvalid={Boolean(errors.secondaryPhone)} />
                <Form.Control.Feedback type="invalid">{errors.secondaryPhone?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('timeZone')}>
                <Form.Label className={labelClass('timeZone')}>Time Zone</Form.Label>
                <Form.Select {...register('timeZone')} isInvalid={Boolean(errors.timeZone)}>
                  {TIME_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.timeZone?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId={fieldId('dayStartFrom')}>
                <Form.Label className={labelClass('dayStartFrom')}>Day Start From</Form.Label>
                <Form.Control {...register('dayStartFrom')} type="time" isInvalid={Boolean(errors.dayStartFrom)} />
                <Form.Control.Feedback type="invalid">{errors.dayStartFrom?.message}</Form.Control.Feedback>
                {!errors.dayStartFrom && <Form.Text>Production day begins at this time.</Form.Text>}
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Actions */}
        <div className="ts-form-actions">
          <span className="ts-form-actions-note">
            Fields marked <span className="text-danger">*</span> are required.
          </span>
          <Button variant="ghost" onClick={() => navigate(ROUTES.CUSTOMERS)} disabled={isSubmitting}>
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
                Save Customer
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default AddCustomer
