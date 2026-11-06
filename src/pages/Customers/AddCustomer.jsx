import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { ALL_MACHINE_ROLES, ROLE_LABELS, ROLES, SUPERADMIN_ONLY, THEMES } from '@/constants/app'
import { COUNTRIES, TIME_ZONES, getDialCode, getStates } from '@/constants/locations'
import { getBranches } from '@/services/branchService'
import { createUser, getUserById, getUsers, updateUser } from '@/services/customerService'
import { getMachines } from '@/services/machineService'
import { getAssignableRoles } from '@/services/roleService'
import useAuth from '@/hooks/useAuth'
import useOrgUser from '@/hooks/useOrgUser'
import { refreshUserTheme } from '@/utils/theme'
import { PASSWORD_MAX_LENGTH } from '@/utils/validators'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import TimePicker from '@/components/common/TimePicker'
import Loader from '@/components/common/Loader'
import MultiSelectPicker from '@/components/common/MultiSelectPicker'
import {
  FILTER_NAMES,
  FILTER_OPTIONS,
  INITIAL_VALUES,
  getCustomerSchema,
  isFieldRequired,
  toFormValues,
  toUserPayload,
} from './customerForm'
import { ACCOUNT_KIND, ACCOUNT_PAGES } from './accountPages'
import {
  EMPTY_MACHINE_FILTER,
  MACHINE_FILTER_LEVELS,
  buildOrganizationPaths,
  hasFilterLevels,
  levelOptions,
  loadOrganization,
  machineMatches,
  pickFilterLevel,
} from './machineFilter'
import { customerName } from './customerFormat'
import { FIELD_HELP } from './customerHelp'

// Group of the machines without a line in the machine dropdown
const NO_LINE = 'No line'

// Customers and users share this form (add and edit): /masters/customers/add, /masters/customers/:id/edit,
// /masters/users/add and /masters/users/:id/edit. Users also get the Access card: role, company
// (the superadmin picks it) and the machines they may access, narrowed by the company's organization
// (Country → … → Line); "all machines" there also gives the machines added later. The Filters card
// is for customers only.
function AddCustomer({ kind = ACCOUNT_KIND.CUSTOMER }) {
  const page = ACCOUNT_PAGES[kind]
  const isUser = kind === ACCOUNT_KIND.USER
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { reloadUsers } = useOrgUser()

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
  const [organization, setOrganization] = useState({})
  const [accessError, setAccessError] = useState('')

  // Watch specific fields for conditional logic
  const roleId = watch('roleId')
  const companyId = watch('companyId')
  const machineIds = watch('machineIds') ?? []
  const machineFilter = watch('machineFilter') ?? EMPTY_MACHINE_FILTER
  const roleName = roles.find((role) => String(role.id) === roleId)?.name
  // Admins see every machine of their company, so only other roles get machines assigned
  // (shown before a role is picked too, so the machine filter is visible from the start)
  const assignsMachines = isUser && !ALL_MACHINE_ROLES.includes(roleName)
  const organizationPaths = useMemo(() => buildOrganizationPaths(organization), [organization])
  const filteredMachines = machines.filter((machine) => machineMatches(machine, machineFilter, organizationPaths))
  const allMachines = machineFilter.allMachines
  // Machine dropdown options, grouped by line (machines without a line last)
  const machineOptions = filteredMachines
    .map((machine) => ({ value: String(machine.id), label: machine.name, group: machine.lineName || NO_LINE, hint: machine.modelName || undefined }))
    .sort((a, b) => (a.group === NO_LINE) - (b.group === NO_LINE) || a.group.localeCompare(b.group) || a.label.localeCompare(b.label))
  const country = watch('country')
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
        toast.error(error.message, { title: 'Could not load branches' })
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
        toast.error(error.message, { title: 'Could not load roles' })
      })
    return () => {
      active = false
    }
  }, [isUser, needsCompany])

  // Users: the company's machines to assign and its organization to narrow them. The server
  // returns a customer's or admin's own company; the superadmin asks for the picked customer's.
  useEffect(() => {
    if (!isUser || (needsCompany && !companyId)) {
      setMachines([])
      setOrganization({})
      return undefined
    }
    let active = true
    const userId = needsCompany ? companyId : undefined
    setMachinesLoading(true)
    // Loaded apart, so an organization list that fails still leaves the machines to pick
    const machinesLoad = getMachines(userId)
      .then((list) => active && setMachines(list))
      .catch((error) => active && toast.error(error.message, { title: 'Could not load machines' }))
    const organizationLoad = loadOrganization(userId)
      .then((levels) => active && setOrganization(levels))
      .catch((error) => active && toast.error(error.message, { title: 'Could not load the organization' }))
    Promise.all([machinesLoad, organizationLoad]).finally(() => active && setMachinesLoading(false))
    return () => {
      active = false
    }
  }, [isUser, needsCompany, companyId])

  // Another company has other machines and organization, so a new pick clears the chosen ones
  const handleCompanyChange = () => {
    setValue('machineIds', [])
    setValue('machineFilter', EMPTY_MACHINE_FILTER)
  }

  // A new level keeps only the picked machines that are still under the selection, so the
  // dropdown always shows every machine that will be saved
  const handleFilterLevelChange = (key) => (event) => {
    const next = pickFilterLevel(machineFilter, organizationPaths, key, event.target.value)
    const stillShown = new Set(
      machines.filter((machine) => machineMatches(machine, next, organizationPaths)).map((machine) => String(machine.id)),
    )
    setValue('machineFilter', next, { shouldDirty: true })
    setValue('machineIds', machineIds.filter((machineId) => stillShown.has(machineId)), { shouldDirty: true })
  }

  // Picking machines one by one ends "All machines" (removing one from All keeps the rest picked)
  const handleMachinesChange = (next) => {
    setValue('machineFilter', { ...machineFilter, allMachines: false }, { shouldDirty: true })
    setValue('machineIds', next, { shouldDirty: true })
  }

  // "All machines" is saved as the filter's allMachines, not as ids: the server then also gives
  // the machines added to the selection later
  const handleAllMachinesChange = (checked) => {
    setValue('machineFilter', { ...machineFilter, allMachines: checked }, { shouldDirty: true })
    setValue('machineIds', [], { shouldDirty: true })
  }

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

  // Required marker (*) — GST / PAN depend on the country, password only when adding
  const isRequired = (name) => isFieldRequired(name, country, isEdit)
  const labelClass = (name) => (isRequired(name) ? 'required' : undefined)

  const onSubmit = async (values) => {
    try {
      // Admins get no assigned machines or filter (they see them all); with all machines the
      // filter gives them, so none are sent one by one
      const access = !assignsMachines
        ? { machineIds: [], machineFilter: EMPTY_MACHINE_FILTER }
        : values.machineFilter.allMachines
          ? { machineIds: [] }
          : {}
      const payload = toUserPayload({ ...values, ...access }, existing, kind)
      if (isEdit) {
        await updateUser(id, payload)
        toast.success(`${values.companyName} has been updated.`, { title: `${page.title} updated` })
      } else {
        await createUser(payload)
        toast.success(`${values.companyName} has been added.`, { title: `${page.title} created` })
      }
      // Customer pickers and labels show the change; re-apply the logged-in user's theme in case
      // this was their own account
      reloadUsers()
      refreshUserTheme()
      navigate(page.routes.list)
    } catch (error) {
      toast.error(error.message, { title: `Could not save ${page.noun}` })
    }
  }

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">{page.section}</div>
        <h1>{isEdit ? `Edit ${page.title}` : `Add ${page.title}`}</h1>
        <p className="ts-page-subtitle">
          {isEdit ? `Update the ${page.noun} account and its login.` : `Create a ${page.noun} account and its login.`}
        </p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={page.routes.list} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          {page.title} list
        </Button>
      </div>
    </header>
  )

  if (customerLoading) {
    return (
      <>
        {header}
        <Loader text={`Loading ${page.noun}…`} />
      </>
    )
  }

  if (customerError) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>Could not load this {page.noun}.</b> {customerError}
        </Alert>
      </>
    )
  }

  return (
    <>
      {header}

      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? `Edit ${page.noun}` : `Add ${page.noun}`}>
        {/* Access: role, company and machines (users only) */}
        {isUser && (
          <Card className="mb-3">
            <Card.Header>
              <i className="bi bi-shield-check text-primary" aria-hidden="true" />
              Access
            </Card.Header>
            <Card.Body>
              <Row className="g-3">
                <Form.Group as={Col} md={6} xxl={4} controlId="roleId">
                  <FieldLabel required help={FIELD_HELP.roleId}>Role</FieldLabel>
                  {/* key: re-mount once the options arrive, so a saved role loaded earlier shows */}
                  <Form.Select key={roles.length} {...register('roleId')} disabled={Boolean(accessError)} isInvalid={Boolean(errors.roleId)}>
                    <option value="">{accessError ? 'Roles unavailable' : 'Select role'}</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {ROLE_LABELS[role.name] ?? role.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.roleId?.message}</Form.Control.Feedback>
                </Form.Group>

                {needsCompany && (
                  <Form.Group as={Col} md={6} xxl={4} controlId="companyId">
                    <Form.Label className={labelClass('companyId')}>Customer</Form.Label>
                    <Form.Select key={companies.length} {...register('companyId', { onChange: handleCompanyChange })} isInvalid={Boolean(errors.companyId)}>
                      <option value="">Select customer</option>
                      {companies.map((company) => (
                        <option key={company.id} value={company.id}>
                          {customerName(company) === '—' ? company.username : `${customerName(company)} (${company.username})`}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.companyId?.message}</Form.Control.Feedback>
                    {!errors.companyId && <Form.Text>Company the user belongs to.</Form.Text>}
                  </Form.Group>
                )}
              </Row>

              {roleName && !assignsMachines && (
                <Alert variant="info" className="mt-3 mb-0">
                  {ROLE_LABELS[roleName] ?? roleName} users see every machine of the company.
                </Alert>
              )}

              {assignsMachines && (
                <fieldset className="mt-3" aria-describedby="machines-hint">
                  <legend className="visually-hidden">Machines</legend>
                  <FieldLabel help={FIELD_HELP.machineFilter}>Machine access by organization</FieldLabel>
                  <Row className="g-3 mt-0">
                    {MACHINE_FILTER_LEVELS.map((level) => {
                      const options = levelOptions(organization, organizationPaths, machineFilter, level.key)
                      return (
                        <Form.Group key={level.key} as={Col} md={6} xl={3} controlId={`machineFilter-${level.key}`}>
                          <Form.Label>{level.label}</Form.Label>
                          <Form.Select value={machineFilter[level.key]} onChange={handleFilterLevelChange(level.key)} disabled={machinesLoading || !options.length}>
                            <option value="">
                              {needsCompany && !companyId
                                ? 'Select a customer first'
                                : machinesLoading
                                  ? 'Loading…'
                                  : options.length
                                    ? `All ${level.plural}`
                                    : `No ${level.plural}`}
                            </option>
                            {options.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      )
                    })}

                    <Form.Group as={Col} xs={12}>
                      <FieldLabel help={FIELD_HELP.machineIds}>Machines</FieldLabel>
                      {machinesLoading ? (
                        <Loader text="Loading machines…" />
                      ) : (
                        <MultiSelectPicker
                          id="machineIds"
                          options={machineOptions}
                          value={allMachines ? machineOptions.map((option) => option.value) : machineIds}
                          onChange={handleMachinesChange}
                          noun={{ one: 'machine', many: 'machines' }}
                          placeholder="Select machines"
                          emptyText={
                            needsCompany && !companyId
                              ? 'Select a customer to see its machines'
                              : machines.length
                                ? 'No machines in this selection yet'
                                : 'This company has no machines yet'
                          }
                          disabled={needsCompany && !companyId}
                          allChecked={allMachines}
                          onAllChange={handleAllMachinesChange}
                          allLabel={hasFilterLevels(machineFilter) ? 'All machines of this selection' : 'All machines of the company'}
                        />
                      )}
                      <Form.Text id="machines-hint">
                        {allMachines
                          ? `${filteredMachines.length} machine${filteredMachines.length === 1 ? '' : 's'} now · machines added to this selection later are given automatically`
                          : `${machineIds.length} of ${filteredMachines.length} selected · the user sees only the selected machines`}
                      </Form.Text>
                    </Form.Group>
                  </Row>
                </fieldset>
              )}
            </Card.Body>
          </Card>
        )}

        {/* Company */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-building text-primary" aria-hidden="true" />
            Company details
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Form.Group as={Col} md={6} xxl={4} controlId="branchId">
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

              <Form.Group as={Col} md={6} xxl={4} controlId="companyName">
                <Form.Label className={labelClass('companyName')}>Company Name</Form.Label>
                <Form.Control {...register('companyName')} autoComplete="organization" maxLength={150} isInvalid={Boolean(errors.companyName)} />
                <Form.Control.Feedback type="invalid">{errors.companyName?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="finixId">
                <Form.Label>Finix ID</Form.Label>
                <Form.Control {...register('finixId')} autoComplete="off" />
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="gstNo">
                <FieldLabel required={isRequired('gstNo')} help={FIELD_HELP.gstNo}>GST No.</FieldLabel>
                <Form.Control {...register('gstNo', { onChange: handleChange })} autoComplete="off" maxLength={15} placeholder="22ABCDE1234F1Z5" isInvalid={Boolean(errors.gstNo)} />
                <Form.Control.Feedback type="invalid">{errors.gstNo?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="panNo">
                <FieldLabel required={isRequired('panNo')} help={FIELD_HELP.panNo}>PAN No.</FieldLabel>
                <Form.Control {...register('panNo', { onChange: handleChange })} autoComplete="off" maxLength={10} placeholder="ABCDE1234F" isInvalid={Boolean(errors.panNo)} />
                <Form.Control.Feedback type="invalid">{errors.panNo?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="website">
                <Form.Label>Website</Form.Label>
                <Form.Control {...register('website')} type="url" autoComplete="url" placeholder="www.example.com" isInvalid={Boolean(errors.website)} />
                <Form.Control.Feedback type="invalid">{errors.website?.message}</Form.Control.Feedback>
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
              <Form.Group as={Col} md={6} xxl={4} controlId="email">
                <Form.Label className={labelClass('email')}>Email</Form.Label>
                <Form.Control {...register('email')} type="email" autoComplete="off" isInvalid={Boolean(errors.email)} />
                <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="username">
                <FieldLabel required={isRequired('username')} help={FIELD_HELP.username}>User Name</FieldLabel>
                <Form.Control {...register('username')} autoComplete="off" isInvalid={Boolean(errors.username)} />
                <Form.Control.Feedback type="invalid">{errors.username?.message}</Form.Control.Feedback>
              </Form.Group>

              {/* Required when adding; when editing it starts empty and a typed value sets a new password */}
              <Form.Group as={Col} md={6} xxl={4} controlId="password">
                <Form.Label className={labelClass('password')}>{isEdit ? 'New Password' : 'Password'}</Form.Label>
                <InputGroup hasValidation>
                  <Form.Control
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    maxLength={PASSWORD_MAX_LENGTH}
                    placeholder={isEdit ? '••••••••' : undefined}
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
                {isEdit && <Form.Text>To change the password type a new one here, otherwise leave it blank.</Form.Text>}
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
              <Form.Group as={Col} md={6} controlId="address1">
                <Form.Label className={labelClass('address1')}>Address - 1</Form.Label>
                <Form.Control {...register('address1')} autoComplete="address-line1" isInvalid={Boolean(errors.address1)} />
                <Form.Control.Feedback type="invalid">{errors.address1?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} controlId="address2">
                <Form.Label>Address - 2</Form.Label>
                <Form.Control {...register('address2')} autoComplete="address-line2" />
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId="country">
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

              <Form.Group as={Col} md={6} xxl={3} controlId="state">
                <Form.Label className={labelClass('state')}>State</Form.Label>
                {states.length ? (
                  <Form.Select {...register('state')} isInvalid={Boolean(errors.state)}>
                    <option value="">Select state</option>
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
                <Form.Label className={labelClass('city')}>City</Form.Label>
                <Form.Control {...register('city')} autoComplete="address-level2" isInvalid={Boolean(errors.city)} />
                <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={3} controlId="zipCode">
                <FieldLabel required={isRequired('zipCode')} help={FIELD_HELP.zipCode}>Zip Code</FieldLabel>
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
                <Form.Label className={labelClass('contactPerson')}>Contact Person</Form.Label>
                <Form.Control {...register('contactPerson')} autoComplete="name" isInvalid={Boolean(errors.contactPerson)} />
                <Form.Control.Feedback type="invalid">{errors.contactPerson?.message}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="primaryPhone">
                <Form.Label className={labelClass('primaryPhone')}>Primary Phone</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text>{dialCode}</InputGroup.Text>
                  <Form.Control {...register('primaryPhone')} type="tel" autoComplete="tel-national" placeholder="98765 43210" isInvalid={Boolean(errors.primaryPhone)} />
                  <Form.Control.Feedback type="invalid">{errors.primaryPhone?.message}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="secondaryPhone">
                <Form.Label>Secondary Phone</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text>{dialCode}</InputGroup.Text>
                  <Form.Control {...register('secondaryPhone')} type="tel" autoComplete="tel-national" isInvalid={Boolean(errors.secondaryPhone)} />
                  <Form.Control.Feedback type="invalid">{errors.secondaryPhone?.message}</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="timeZone">
                <FieldLabel required={isRequired('timeZone')} help={FIELD_HELP.timeZone}>Time Zone</FieldLabel>
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
                <FieldLabel required={isRequired('dayStartFrom')} help={FIELD_HELP.dayStartFrom}>Day Start From</FieldLabel>
                <Controller
                  name="dayStartFrom"
                  control={control}
                  render={({ field }) => <TimePicker {...field} isInvalid={Boolean(errors.dayStartFrom)} />}
                />
                <Form.Control.Feedback type="invalid">{errors.dayStartFrom?.message}</Form.Control.Feedback>
                {!errors.dayStartFrom && <Form.Text>Production day begins at this time.</Form.Text>}
              </Form.Group>

              <Form.Group as={Col} md={6} xxl={4} controlId="theme">
                <Form.Label className={labelClass('theme')}>Theme</Form.Label>
                <Form.Select {...register('theme')} isInvalid={Boolean(errors.theme)}>
                  {THEMES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.theme?.message}</Form.Control.Feedback>
                {!errors.theme && <Form.Text>Colour scheme the {page.noun} sees after signing in.</Form.Text>}
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Filters (customers only; a user's machines are narrowed in the Access card) */}
        {!isUser && (
          <Card className="mb-3">
            <Card.Header>
              <i className="bi bi-funnel text-primary" aria-hidden="true" />
              Filters
              <span className="ts-filter-count" aria-hidden="true">
                {filters.length}/{FILTER_NAMES.length}
              </span>
              <span className="ms-auto d-flex gap-1">
                <Button variant="link" size="sm" onClick={() => setValue('filters', FILTER_NAMES, { shouldDirty: true })} disabled={allFiltersChosen}>
                  Select all
                </Button>
                <Button variant="link" size="sm" onClick={() => setValue('filters', [], { shouldDirty: true })} disabled={!filters.length}>
                  Clear
                </Button>
              </span>
            </Card.Header>
            <Card.Body>
              <fieldset aria-describedby="filters-hint">
                <legend className="visually-hidden">Filters</legend>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                  <FieldLabel help={FIELD_HELP.filters}>Filters available to this {page.noun}</FieldLabel>
                  <span id="filters-hint" className={`fs-sm ${errors.filters ? 'text-danger' : 'text-body-tertiary'}`}>
                    {errors.filters?.message || `${filters.length} of ${FILTER_NAMES.length} selected · shown on dashboards and reports`}
                  </span>
                </div>

                <div className="ts-filter-chips">
                  {FILTER_OPTIONS.map((option) => (
                    <label key={option.value} className={`ts-filter-chip${errors.filters ? ' is-invalid' : ''}`} htmlFor={`filter-${option.value}`}>
                      <input id={`filter-${option.value}`} type="checkbox" className="ts-filter-input" value={option.value} {...register('filters')} />
                      <i className={`bi ${option.icon} ts-filter-icon`} aria-hidden="true" />
                      {option.label}
                      <i className="bi bi-check-lg ts-filter-check" aria-hidden="true" />
                    </label>
                  ))}
                </div>
              </fieldset>
            </Card.Body>
          </Card>
        )}

        {/* Actions */}
        <div className="ts-form-actions">
          <span className="ts-form-actions-note">
            Fields marked <span className="text-danger">*</span> are required.
          </span>
          <Button variant="ghost" onClick={() => navigate(page.routes.list)} disabled={isSubmitting}>
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
                {isEdit ? `Update ${page.title}` : `Save ${page.title}`}
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
