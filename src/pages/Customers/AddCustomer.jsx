import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ALL_MACHINE_ROLES, ROLE_LABELS, ROLES, SUPERADMIN_ONLY, THEMES } from '@/constants/app'
import { ACTION_ICONS } from '@/constants/icons'
import { COUNTRIES, TIME_ZONES, getDialCode, getStates } from '@/constants/locations'
import { getBranches } from '@/services/branchService'
import { createUser, getUserById, getUsers, updateUser } from '@/services/customerService'
import { getMachines } from '@/services/machineService'
import { getAssignableRoles } from '@/services/roleService'
import useAuth from '@/hooks/useAuth'
import { formatFileSize } from '@/utils/helpers'
import { refreshUserTheme } from '@/utils/theme'
import i18n from '@/i18n'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import TimePicker from '@/components/common/TimePicker'
import IconAction from '@/components/common/IconAction'
import Loader from '@/components/common/Loader'
import {
  FILTER_NAMES,
  FILTER_OPTIONS,
  INITIAL_VALUES,
  getCustomerSchema,
  isFieldRequired,
  savedLogoPath,
  toFormValues,
  toUserPayload,
} from './customerForm'
import { ACCOUNT_KIND, ACCOUNT_PAGES } from './accountPages'
import { customerName } from './customerFormat'
import { FIELD_HELP } from './customerHelp'
import { Trans, useTranslation } from 'react-i18next'

// Customers and users share this form (add and edit): /masters/customers/add, /masters/customers/:id/edit,
// /masters/users/add and /masters/users/:id/edit. Users also get the Access card: role, company
// (the superadmin picks it) and the machines they may access.
function AddCustomer({ kind = ACCOUNT_KIND.CUSTOMER }) {
  const { t } = useTranslation()
  const page = ACCOUNT_PAGES[kind]
  const isUser = kind === ACCOUNT_KIND.USER
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const logoInputRef = useRef(null)

  // Only the superadmin works across companies, so only it picks the user's company
  const { hasRole } = useAuth()
  const needsCompany = isUser && hasRole(SUPERADMIN_ONLY)

  const schema = useMemo(() => getCustomerSchema(isEdit, { kind, needsCompany }), [isEdit, kind, needsCompany])

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: INITIAL_VALUES,
  })

  const [showPassword, setShowPassword] = useState(false)

  const [branches, setBranches] = useState([])
  const [branchesLoading, setBranchesLoading] = useState(true)
  const [branchesError, setBranchesError] = useState('')

  // Customer being edited (null when adding)
  const [existing, setExisting] = useState(null)
  const [customerLoading, setCustomerLoading] = useState(isEdit)
  const [customerError, setCustomerError] = useState('')

  // Access options (users only)
  const [roles, setRoles] = useState([])
  const [companies, setCompanies] = useState([])
  const [machines, setMachines] = useState([])
  const [machinesLoading, setMachinesLoading] = useState(false)
  const [accessError, setAccessError] = useState('')

  // Watch specific fields for conditional logic
  const roleId = watch('roleId')
  const companyId = watch('companyId')
  const machineIds = watch('machineIds') ?? []
  const roleName = roles.find((role) => String(role.id) === roleId)?.name
  // Admins see every machine of their company, so only other roles get machines assigned
  const assignsMachines = isUser && Boolean(roleName) && !ALL_MACHINE_ROLES.includes(roleName)
  const country = watch('country')
  const logo = watch('logo')
  const filters = watch('filters') ?? []
  const allFiltersChosen = filters.length === FILTER_NAMES.length

  const states = getStates(country)
  const dialCode = getDialCode(country)

  // Load branch options
  useEffect(() => {
    let active = true
    getBranches()
      .then((list) => active && setBranches(list))
      .catch((error) => {
        if (!active) return
        setBranchesError(error.message)
        toast.error(error.message, { title: i18n.t('Could not load branches') })
      })
      .finally(() => active && setBranchesLoading(false))
    return () => {
      active = false
    }
  }, [])

  // Users: the roles the logged-in user may give, and (superadmin) the customers to pick from
  useEffect(() => {
    if (!isUser) return undefined
    let active = true
    Promise.all([getAssignableRoles(), needsCompany ? getUsers({ filterRole: ROLES.CUSTOMER }) : []])
      .then(([roleList, customerList]) => {
        if (!active) return
        // Customers are added on the Customers page
        setRoles(roleList.filter((role) => role.name !== ROLES.CUSTOMER))
        setCompanies(customerList)
      })
      .catch((error) => {
        if (!active) return
        setAccessError(error.message)
        toast.error(error.message, { title: i18n.t('Could not load roles') })
      })
    return () => {
      active = false
    }
  }, [isUser, needsCompany])

  // Users: the company's machines to assign. The server returns a customer's or admin's own
  // company machines; the superadmin asks for the picked customer's.
  useEffect(() => {
    if (!isUser || (needsCompany && !companyId)) {
      setMachines([])
      return undefined
    }
    let active = true
    setMachinesLoading(true)
    getMachines(needsCompany ? companyId : undefined)
      .then((list) => active && setMachines(list))
      .catch((error) => active && toast.error(error.message, { title: i18n.t('Could not load machines') }))
      .finally(() => active && setMachinesLoading(false))
    return () => {
      active = false
    }
  }, [isUser, needsCompany, companyId])

  // Another company has other machines, so a new pick clears the chosen ones
  const handleCompanyChange = () => setValue('machineIds', [])

  // Edit: load the customer and fill the form (reset() also makes these the Reset values)
  useEffect(() => {
    if (!isEdit) return undefined
    let active = true
    setCustomerLoading(true)
    getUserById(id)
      .then((customer) => {
        if (!active) return
        setExisting(customer)
        reset(toFormValues(customer))
      })
      .catch((error) => active && setCustomerError(error.message))
      .finally(() => active && setCustomerLoading(false))
    return () => {
      active = false
    }
  }, [id, isEdit, reset])

  // Logo preview URL (revoked when replaced/unmounted)
  const logoPreview = useMemo(
    () => (logo && ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'].includes(logo.type) ? URL.createObjectURL(logo) : ''),
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
    if (name === 'gstNo' || name === 'panNo') {
      setValue(name, value.toUpperCase())
    }
  }

  const removeLogo = () => {
    if (logoInputRef.current) logoInputRef.current.value = ''
    setValue('logo', null)
  }

  // Required marker (*) — GST / PAN depend on the country, password only when adding
  const isRequired = (name) => isFieldRequired(name, country, isEdit)
  const labelClass = (name) => (isRequired(name) ? 'required' : undefined)

  const onSubmit = async (values) => {
    try {
      // Admins get no assigned machines (they see them all)
      const payload = toUserPayload(assignsMachines ? values : { ...values, machineIds: [] }, existing, kind)
      if (isEdit) {
        await updateUser(id, payload)
        toast.success(t('{{name}} has been updated.', { name: values.companyName }), { title: t(page.text.updatedTitle) })
      } else {
        await createUser(payload)
        toast.success(t('{{name}} has been added.', { name: values.companyName }), { title: t(page.text.createdTitle) })
      }
      // Re-apply the logged-in user's theme in case this was their own account
      refreshUserTheme()
      navigate(page.routes.list)
    } catch (error) {
      toast.error(error.message, { title: t(page.text.saveFailed) })
    }
  }

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">{t(page.section)}</div>
        <h1>{t(isEdit ? page.text.edit : page.text.add)}</h1>
        <p className="ts-page-subtitle">
          {t(isEdit ? page.text.editSubtitle : page.text.addSubtitle)}
        </p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={page.routes.list} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          {t(page.text.backToList)}
        </Button>
      </div>
    </header>
  )

  if (customerLoading) {
    return (
      <>
        {header}
        <Loader text={t(page.text.loadingOne)} />
      </>
    )
  }

  if (customerError) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>{t(page.text.loadOneFailed)}</b> {customerError}
        </Alert>
      </>
    )
  }

  return (
    <>
      {header}

      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={t(isEdit ? page.text.edit : page.text.add)}>
        {/* Access: role, company and machines (users only) */}
        {isUser && (
          <Card className="mb-3">
            <Card.Header>
              <i className="bi bi-shield-check text-primary" aria-hidden="true" />
              {t('Access')}
              {assignsMachines && (
                <span className="ms-auto d-flex gap-1">
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => setValue('machineIds', machines.map((machine) => String(machine.id)), { shouldDirty: true })}
                    disabled={!machines.length || machineIds.length === machines.length}
                  >
                    {t('Select all')}
                  </Button>
                  <Button variant="link" size="sm" onClick={() => setValue('machineIds', [], { shouldDirty: true })} disabled={!machineIds.length}>
                    {t('Clear')}
                  </Button>
                </span>
              )}
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Form.Group as={Col} md={6} xxl={4} controlId="roleId">
                  <FieldLabel required help={FIELD_HELP.roleId}>{t('Role')}</FieldLabel>
                  {/* key: re-mount once the options arrive, so a saved role loaded earlier shows */}
                  <Form.Select key={roles.length} {...register('roleId')} disabled={Boolean(accessError)} isInvalid={Boolean(errors.roleId)}>
                    <option value="">{accessError ? t('Roles unavailable') : t('Select role')}</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {ROLE_LABELS[role.name] ? t(ROLE_LABELS[role.name]) : role.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.roleId?.message}</Form.Control.Feedback>
                </Form.Group>

                {needsCompany && (
                  <Form.Group as={Col} md={6} xxl={4} controlId="companyId">
                    <Form.Label className={labelClass('companyId')}>{t('Customer')}</Form.Label>
                    <Form.Select key={companies.length} {...register('companyId', { onChange: handleCompanyChange })} isInvalid={Boolean(errors.companyId)}>
                      <option value="">{t('Select customer')}</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {customerName(company) === '—' ? company.username : `${customerName(company)} (${company.username})`}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.companyId?.message}</Form.Control.Feedback>
                    {!errors.companyId && <Form.Text>{t('Company the user belongs to.')}</Form.Text>}
                  </Form.Group>
                )}
              </Row>

              {roleName && !assignsMachines && (
                <Alert variant="info" className="mt-3 mb-0">
                  {t('{{role}} users see every machine of the company.', { role: ROLE_LABELS[roleName] ? t(ROLE_LABELS[roleName]) : roleName })}
                </Alert>
              )}

              {assignsMachines && (
                <fieldset className="mt-3" aria-describedby="machines-hint">
                  <legend className="visually-hidden">{t('Machines')}</legend>
                  <FieldLabel help={FIELD_HELP.machineIds}>{t('Machines this user can access')}</FieldLabel>
                  {machinesLoading ? (
                    <Loader text={t('Loading machines…')} />
                  ) : machines.length ? (
                    <div className="d-flex flex-wrap gap-3 mt-1">
                      {machines.map((machine) => (
                        <Form.Check
                          key={machine.id}
                          id={`machine-${machine.id}`}
                          type="checkbox"
                          label={machine.lineName ? `${machine.name} (${machine.lineName})` : machine.name}
                          value={String(machine.id)}
                          {...register('machineIds')}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-body-secondary mt-1">
                      {needsCompany && !companyId ? t('Select a customer to see its machines.') : t('This company has no machines yet.')}
                    </div>
                  )}
                  <Form.Text id="machines-hint">
                    {`${machineIds.length} of ${machines.length} selected · the user sees only these machines`}
                  </Form.Text>
                </fieldset>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Company */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-building text-primary" aria-hidden="true" />
            {t('Company details')}
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} xxl={4} controlId="branchId">
                <Form.Label className={labelClass('branchId')}>{t('Branch')}</Form.Label>
                <Form.Select {...register('branchId')} disabled={branchesLoading || Boolean(branchesError)} isInvalid={Boolean(errors.branchId)}>
                  <option value="">
                    {branchesLoading ? 'Loading branches…' : branchesError ? t('Branches unavailable') : t('Select branch')}
                  </option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.branchId?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="companyName">
                <Form.Label className={labelClass('companyName')}>{t('Company Name')}</Form.Label>
                <Form.Control {...register('companyName')} autoComplete="organization" maxLength={150} isInvalid={Boolean(errors.companyName)} />
                <Form.Control.Feedback type="invalid">{errors.companyName?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="finixId">
                <Form.Label>{t('Finix ID')}</Form.Label>
                <Form.Control {...register('finixId')} autoComplete="off" />
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="gstNo">
                <FieldLabel required={isRequired('gstNo')} help={FIELD_HELP.gstNo}>{t('GST No.')}</FieldLabel>
                <Form.Control {...register('gstNo', { onChange: handleChange })} autoComplete="off" maxLength={15} placeholder="22ABCDE1234F1Z5" isInvalid={Boolean(errors.gstNo)} />
                <Form.Control.Feedback type="invalid">{errors.gstNo?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="panNo">
                <FieldLabel required={isRequired('panNo')} help={FIELD_HELP.panNo}>{t('PAN No.')}</FieldLabel>
                <Form.Control {...register('panNo', { onChange: handleChange })} autoComplete="off" maxLength={10} placeholder="ABCDE1234F" isInvalid={Boolean(errors.panNo)} />
                <Form.Control.Feedback type="invalid">{errors.panNo?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="website">
                <Form.Label>{t('Website')}</Form.Label>
                <Form.Control {...register('website')} type="url" autoComplete="url" placeholder="www.example.com" isInvalid={Boolean(errors.website)} />
                <Form.Control.Feedback type="invalid">{errors.website?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="logo">
                <Form.Label>{t('Company Logo')}</Form.Label>
                <Form.Control
                  ref={logoInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.svg,.webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setValue('logo', file)
                  }}
                  isInvalid={Boolean(errors.logo)}
                />
                <Form.Control.Feedback type="invalid">{errors.logo?.message}</Form.Control.Feedback>
                {!errors.logo && savedLogoPath(existing) && !logo && (
                  <Form.Text className="d-block text-truncate">{t('Current: {{file}}', { file: savedLogoPath(existing) })}</Form.Text>
                )}
                {!errors.logo && (
                  <Form.Text>{t('PNG, JPG, SVG or WEBP · max {{size}}', { size: formatFileSize(2 * 1024 * 1024) })}</Form.Text>
                )}
                {logo && (
                  <div className="ts-file-preview mt-2">
                    {logoPreview && <img src={logoPreview} alt={t('Logo preview')} className="ts-file-preview-img" />}
                    <div className="ts-file-preview-meta">
                      <div className="text-truncate">{logo.name}</div>
                      <div className="fs-xs text-body-tertiary">{formatFileSize(logo.size)}</div>
                    </div>
                    <IconAction danger icon={ACTION_ICONS.remove} label={t('Remove logo')} onClick={removeLogo} />
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
            {t('Login credentials')}
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} xxl={4} controlId="email">
                <Form.Label className={labelClass('email')}>{t('Email')}</Form.Label>
                <Form.Control {...register('email')} type="email" autoComplete="off" isInvalid={Boolean(errors.email)} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="username">
                <FieldLabel required={isRequired('username')} help={FIELD_HELP.username}>{t('User Name')}</FieldLabel>
                <Form.Control {...register('username')} autoComplete="off" isInvalid={Boolean(errors.username)} />
                <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
              </Form.Group>

              {/* Only when adding: an existing customer's password is not changed here */}
              {!isEdit && (
                <Form.Group as={Col} md={6} xxl={4} controlId="password">
                  <Form.Label className={labelClass('password')}>{t('Password')}</Form.Label>
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
                      aria-label={showPassword ? t('Hide password') : t('Show password')}
                      aria-pressed={showPassword}
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                    </Button>
                    <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              )}
            </Row>
          </Card.Body>
        </Card>

        {/* Address */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-geo-alt text-primary" aria-hidden="true" />
            {t('Address')}
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} controlId="address1">
                <Form.Label className={labelClass('address1')}>{t('Address - 1')}</Form.Label>
                <Form.Control {...register('address1')} autoComplete="address-line1" isInvalid={Boolean(errors.address1)} />
                <Form.Control.Feedback type="invalid">{errors.address1?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="address2">
                <Form.Label>{t('Address - 2')}</Form.Label>
                <Form.Control {...register('address2')} autoComplete="address-line2" />
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId="country">
                <Form.Label className={labelClass('country')}>{t('Country')}</Form.Label>
                <Form.Select {...register('country', { onChange: handleCountryChange })} autoComplete="country" isInvalid={Boolean(errors.country)}>
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.country?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId="state">
                <Form.Label className={labelClass('state')}>{t('State')}</Form.Label>
                {states.length ? (
                  <Form.Select {...register('state')} isInvalid={Boolean(errors.state)}>
                    <option value="">{t('Select state')}</option>
                    {states.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </Form.Select>
                ) : (
                  <Form.Control {...register('state')} autoComplete="address-level1" isInvalid={Boolean(errors.state)} />
                )}
                <Form.Control.Feedback type="invalid">{errors.state?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId="city">
                <Form.Label className={labelClass('city')}>{t('City')}</Form.Label>
                <Form.Control {...register('city')} autoComplete="address-level2" isInvalid={Boolean(errors.city)} />
                <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId="zipCode">
                <FieldLabel required={isRequired('zipCode')} help={FIELD_HELP.zipCode}>{t('Zip Code')}</FieldLabel>
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
              <Form.Group as={Col} md={6} xxl={4} controlId="contactPerson">
                <Form.Label className={labelClass('contactPerson')}>{t('Contact Person')}</Form.Label>
                <Form.Control {...register('contactPerson')} autoComplete="name" isInvalid={Boolean(errors.contactPerson)} />
                <Form.Control.Feedback type="invalid">{errors.contactPerson?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="primaryPhone">
                <Form.Label className={labelClass('primaryPhone')}>{t('Primary Phone')}</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text>{dialCode}</InputGroup.Text>
                  <Form.Control {...register('primaryPhone')} type="tel" autoComplete="tel-national" placeholder="98765 43210" isInvalid={Boolean(errors.primaryPhone)} />
                  <Form.Control.Feedback type="invalid">{errors.primaryPhone?.message}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="secondaryPhone">
                <Form.Label>{t('Secondary Phone')}</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text>{dialCode}</InputGroup.Text>
                  <Form.Control {...register('secondaryPhone')} type="tel" autoComplete="tel-national" isInvalid={Boolean(errors.secondaryPhone)} />
                  <Form.Control.Feedback type="invalid">{errors.secondaryPhone?.message}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="timeZone">
                <FieldLabel required={isRequired('timeZone')} help={FIELD_HELP.timeZone}>{t('Time Zone')}</FieldLabel>
                <Form.Select {...register('timeZone')} isInvalid={Boolean(errors.timeZone)}>
                  {TIME_ZONES.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.timeZone?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="dayStartFrom">
                <FieldLabel required={isRequired('dayStartFrom')} help={FIELD_HELP.dayStartFrom}>{t('Day Start From')}</FieldLabel>
                <Controller
                  name="dayStartFrom"
                  control={control}
                  render={({ field }) => <TimePicker {...field} isInvalid={Boolean(errors.dayStartFrom)} />}
                />
                <Form.Control.Feedback type="invalid">{errors.dayStartFrom?.message}</Form.Control.Feedback>
                {!errors.dayStartFrom && <Form.Text>{t('Production day begins at this time.')}</Form.Text>}
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="theme">
                <Form.Label className={labelClass('theme')}>{t('Theme')}</Form.Label>
                <Form.Select {...register('theme')} isInvalid={Boolean(errors.theme)}>
                  {THEMES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.theme?.message}</Form.Control.Feedback>
                {!errors.theme && <Form.Text>{t(page.text.themeHint)}</Form.Text>}
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Filters */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-funnel text-primary" aria-hidden="true" />
            {t('Filters')}
            <span className="ts-filter-count" aria-hidden="true">
              {filters.length}/{FILTER_NAMES.length}
            </span>
            <span className="ms-auto d-flex gap-1">
              <Button variant="link" size="sm" onClick={() => setValue('filters', FILTER_NAMES, { shouldDirty: true })} disabled={allFiltersChosen}>
                {t('Select all')}
              </Button>
              <Button variant="link" size="sm" onClick={() => setValue('filters', [], { shouldDirty: true })} disabled={!filters.length}>
                {t('Clear')}
              </Button>
            </span>
          </Card.Header>
          <Card.Body>
            <fieldset aria-describedby="filters-hint">
              <legend className="visually-hidden">{t('Filters')}</legend>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                <FieldLabel help={FIELD_HELP.filters}>{t(page.text.filtersLabel)}</FieldLabel>
                <span id="filters-hint" className={`fs-sm ${errors.filters ? 'text-danger' : 'text-body-tertiary'}`}>
                  {errors.filters?.message || `${filters.length} of ${FILTER_NAMES.length} selected · shown on dashboards and reports`}
                </span>
              </div>

              <div className="ts-filter-chips">
                {FILTER_OPTIONS.map((option) => (
                  <label key={option.value} className={`ts-filter-chip${errors.filters ? ' is-invalid' : ''}`} htmlFor={`filter-${option.value}`}>
                    <input id={`filter-${option.value}`} type="checkbox" className="ts-filter-input" value={option.value} {...register('filters')} />
                    <i className={`bi ${option.icon} ts-filter-icon`} aria-hidden="true" />
                    {t(option.label)}
                    <i className="bi bi-check-lg ts-filter-check" aria-hidden="true" />
                  </label>
                ))}
              </div>
            </fieldset>
          </Card.Body>
        </Card>

        {/* Actions */}
        <div className="ts-form-actions">
          <span className="ts-form-actions-note">
            <Trans i18nKey="Fields marked <r>*</r> are required." components={{ r: <span className="text-danger" /> }} />
          </span>
          <Button variant="ghost" onClick={() => navigate(page.routes.list)} disabled={isSubmitting}>
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
                {t(isEdit ? page.text.update : page.text.save)}
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

AddCustomer.propTypes = {
  kind: PropTypes.oneOf(Object.values(ACCOUNT_KIND)),
}

export default AddCustomer
