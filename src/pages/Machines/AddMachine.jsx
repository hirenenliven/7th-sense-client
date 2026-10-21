import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CUSTOMER_ROLE_ID, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import {
  CONTROLLER_VERSION_TYPES,
  MACHINE_ACCURACIES,
  MACHINE_SYSTEM_TYPES,
  SECURITY_MODES,
} from '@/constants/machines'
import { ROUTES } from '@/constants/routes'
import { getBrands, getControllers, getModels } from '@/services/catalogService'
import { getUsers } from '@/services/customerService'
import { createMachine, getMachineById, updateMachine } from '@/services/machineService'
import { getUserLines } from '@/services/userLineService'
import useAuth from '@/hooks/useAuth'
import { formatDate } from '@/utils/helpers'
import i18n from '@/i18n'
import { tk } from '@/i18n/tk'
import { toast } from '@/utils/toast'
import DatePicker from '@/components/common/DatePicker'
import FieldLabel from '@/components/common/FieldLabel'
import Loader from '@/components/common/Loader'
import { customerName } from '@/pages/Customers/customerFormat'
import HealthSensorPicker from './HealthSensorPicker'
import { INITIAL_VALUES, MAX_LENGTH, NO, REQUIRED_FIELDS, YES, machineSchema, toFormValues, toMachinePayload } from './machineForm'
import { FIELD_HELP } from './machineHelp'
import { Trans, useTranslation } from 'react-i18next'

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// One form field: label (with help popover when given), the control, and its error
function Field({ name, label, isEdit, errors, help, md = 6, lg, children }) {
  const required = REQUIRED_FIELDS.has(name) && !(isEdit && name === 'password')
  return (
    <Form.Group as={Col} md={md} lg={lg} controlId={name}>
      {help ? (
        <FieldLabel required={required} help={help}>
          {label}
        </FieldLabel>
      ) : (
        <Form.Label className={required ? 'required' : undefined}>{label}</Form.Label>
      )}
      {children}
      <Form.Control.Feedback type="invalid">{errors[name]?.message}</Form.Control.Feedback>
    </Form.Group>
  )
}

Field.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isEdit: PropTypes.bool.isRequired,
  errors: PropTypes.object.isRequired,
  help: PropTypes.object,
  md: PropTypes.number,
  lg: PropTypes.number,
  children: PropTypes.node.isRequired,
}

// Loads one option list; { items, loading, error }. `load` = null skips loading (empty list).
// failTitle: the toast title (an English key) when it cannot be loaded.
function useOptions(load, failTitle) {
  const [state, setState] = useState({ items: [], loading: Boolean(load), error: '' })

  useEffect(() => {
    if (!load) {
      setState({ items: [], loading: false, error: '' })
      return undefined
    }
    let active = true
    setState((previous) => ({ ...previous, loading: true, error: '' }))
    load()
      .then((items) => active && setState({ items, loading: false, error: '' }))
      .catch((error) => {
        if (!active) return
        setState({ items: [], loading: false, error: error.message })
        toast.error(error.message, { title: i18n.t(failTitle) })
      })
    return () => {
      active = false
    }
  }, [load, failTitle])

  return state
}

// First option of a dependent select: pick the parent first / loading / unavailable / pick / empty.
// text holds the translated wording of each case.
const placeholder = ({ loading, error, items }, text) => {
  if (text.needs) return text.needs
  if (loading) return text.loading
  if (error) return text.error
  return items.length ? text.select : text.empty
}

const loadCustomers = () => getUsers().then((users) => users.filter((user) => user.roleId === CUSTOMER_ROLE_ID))
const loadBrands = () => getBrands().then((list) => [...list].sort(byName))
const loadControllers = () => getControllers().then((list) => [...list].sort(byName))
const loadModels = () => getModels().then((list) => [...list].sort(byName))

// Add and edit share this form: /machines/add and /machines/:id/edit (managers only). The superadmin
// picks the customer; a customer or admin always adds to their own company (the server enforces it).
function AddMachine() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { user, hasRole } = useAuth()
  const canPickCustomer = hasRole(SUPERADMIN_ONLY)
  const ownCompanyId = user?.role === ROLES.CUSTOMER ? user.id : user?.companyId

  const schema = useMemo(() => machineSchema(isEdit), [isEdit])
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: canPickCustomer ? INITIAL_VALUES : { ...INITIAL_VALUES, userId: ownCompanyId ? String(ownCompanyId) : '' },
  })

  const [showPassword, setShowPassword] = useState(false)

  // Machine being edited (null when adding)
  const [existing, setExisting] = useState(null)
  const [machineLoading, setMachineLoading] = useState(isEdit)
  const [machineError, setMachineError] = useState('')

  const customers = useOptions(canPickCustomer ? loadCustomers : null, tk('Could not load customers'))
  const brands = useOptions(loadBrands, tk('Could not load brands'))
  const controllers = useOptions(loadControllers, tk('Could not load controllers'))
  const models = useOptions(loadModels, tk('Could not load models'))

  const userId = watch('userId')
  const brandId = watch('brandId')
  const controllerId = watch('controllerId')

  // Lines are the picked customer's (Masters › Line, admin acting for that customer)
  const loadLines = useMemo(() => (userId ? () => getUserLines(null, userId).then((list) => [...list].sort(byName)) : null), [userId])
  const lines = useOptions(loadLines, tk('Could not load lines'))

  // Catalog: Brand → Controller → Model (Masters › Machine Catalog)
  const brandControllers = useMemo(
    () => controllers.items.filter((option) => String(option.brandId) === brandId),
    [controllers.items, brandId],
  )
  const controllerModels = useMemo(
    () => models.items.filter((option) => String(option.controllerId) === controllerId),
    [models.items, controllerId],
  )

  // Edit: load the machine and fill the form (reset() also makes these the Reset values)
  useEffect(() => {
    if (!isEdit) return undefined
    let active = true
    setMachineLoading(true)
    getMachineById(id)
      .then((machine) => {
        if (!active) return
        setExisting(machine)
        reset(toFormValues(machine))
      })
      .catch((error) => active && setMachineError(error.message))
      .finally(() => active && setMachineLoading(false))
    return () => {
      active = false
    }
  }, [id, isEdit, reset])

  // A line belongs to one customer, a controller to one brand and a model to one controller:
  // clear them when the parent changes
  const clearLine = () => setValue('lineId', '')
  const clearModel = () => setValue('modelId', '')
  const clearController = () => {
    setValue('controllerId', '')
    clearModel()
  }

  const onSubmit = async (values) => {
    try {
      const payload = toMachinePayload(values)
      if (isEdit) {
        await updateMachine(id, payload)
        toast.success(t('{{name}} has been updated.', { name: payload.name }), { title: t('Machine updated') })
      } else {
        await createMachine(payload)
        toast.success(t('{{name}} has been added.', { name: payload.name }), { title: t('Machine created') })
      }
      navigate(ROUTES.MACHINES)
    } catch (error) {
      toast.error(error.message, { title: t('Could not save machine') })
    }
  }

  const fieldProps = { isEdit, errors }

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">{t('Operations · Machines')}</div>
        <h1>{isEdit ? t('Edit Machine') : t('Add Machine')}</h1>
        <p className="ts-page-subtitle">
          {isEdit ? 'Update the machine and how its data is read.' : "Register a customer's machine and how its data is read."}
        </p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={ROUTES.MACHINES} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          {t('Machine list')}
        </Button>
      </div>
    </header>
  )

  // Selects get their saved value only when their options exist: wait for the option lists
  const optionsLoading = customers.loading || brands.loading || controllers.loading || models.loading

  if (machineLoading || optionsLoading) {
    return (
      <>
        {header}
        <Loader text={machineLoading ? t('Loading machine…') : t('Loading options…')} />
      </>
    )
  }

  if (machineError) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>{t('Could not load this machine.')}</b> {machineError}
        </Alert>
      </>
    )
  }

  return (
    <>
      {header}

      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? t('Edit machine') : t('Add machine')}>
        {/* Machine details */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-cpu text-primary" aria-hidden="true" />
            {t('Machine details')}
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              {canPickCustomer && (
                <Field name="userId" label={t('Customer')} help={FIELD_HELP.userId} {...fieldProps}>
                  <Form.Select
                    {...register('userId', { onChange: clearLine })}
                    disabled={customers.loading || Boolean(customers.error)}
                    isInvalid={Boolean(errors.userId)}
                  >
                    <option value="">{placeholder(customers, {
                        loading: t('Loading customers…'),
                        error: t('Customers unavailable'),
                        select: t('Select customer'),
                        empty: t('No customers yet'),
                      })}</option>
                    {customers.items.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customerName(customer) === '—' ? customer.username : `${customerName(customer)} (${customer.username})`}
                      </option>
                    ))}
                  </Form.Select>
                </Field>
              )}

              <Form.Group as={Col} md={6} controlId="addedDate">
                <Form.Label>{t('Machine Added Date')}</Form.Label>
                <Form.Control value={formatDate(existing?.createdAt ?? new Date())} readOnly />
              </Form.Group>

              <Field name="name" label={t('Machine Name')} {...fieldProps}>
                <Form.Control {...register('name')} autoComplete="off" maxLength={MAX_LENGTH.name} placeholder="VMC-01" isInvalid={Boolean(errors.name)} />
              </Field>

              <Field name="serialNumber" label={t('Machine Sr. No.')} {...fieldProps}>
                <Form.Control {...register('serialNumber')} autoComplete="off" maxLength={MAX_LENGTH.serialNumber} isInvalid={Boolean(errors.serialNumber)} />
              </Field>

              <Field name="brandId" label={t('Brand')} {...fieldProps}>
                <Form.Select
                  {...register('brandId', { onChange: clearController })}
                  disabled={brands.loading || Boolean(brands.error)}
                  isInvalid={Boolean(errors.brandId)}
                >
                  <option value="">{placeholder(brands, {
                      loading: t('Loading brands…'),
                      error: t('Brands unavailable'),
                      select: t('Select brand'),
                      empty: t('No brands yet'),
                    })}</option>
                  {brands.items.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="controllerId" label={t('Controller')} help={FIELD_HELP.controllerId} {...fieldProps}>
                <Form.Select
                  {...register('controllerId', { onChange: clearModel })}
                  disabled={!brandId || controllers.loading || Boolean(controllers.error)}
                  isInvalid={Boolean(errors.controllerId)}
                >
                  <option value="">
                    {placeholder(
                      { ...controllers, items: brandControllers },
                      {
                        needs: brandId ? '' : t('Select a brand first'),
                        loading: t('Loading controllers…'),
                        error: t('Controllers unavailable'),
                        select: t('Select controller'),
                        empty: t('No controllers for this brand'),
                      },
                    )}
                  </option>
                  {brandControllers.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="modelId" label={t('Model Name')} help={FIELD_HELP.modelId} {...fieldProps}>
                <Form.Select
                  {...register('modelId')}
                  disabled={!controllerId || models.loading || Boolean(models.error)}
                  isInvalid={Boolean(errors.modelId)}
                >
                  <option value="">
                    {placeholder(
                      { ...models, items: controllerModels },
                      {
                        needs: controllerId ? '' : t('Select a controller first'),
                        loading: t('Loading models…'),
                        error: t('Models unavailable'),
                        select: t('Select model'),
                        empty: t('No models for this controller'),
                      },
                    )}
                  </option>
                  {controllerModels.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="controllerVersion" label={t('Controller Software Ver.')} {...fieldProps}>
                <Form.Control {...register('controllerVersion')} autoComplete="off" maxLength={MAX_LENGTH.controllerVersion} placeholder="V04.07" isInvalid={Boolean(errors.controllerVersion)} />
              </Field>

              <Field name="accuracyId" label={t('Machine Accuracy')} {...fieldProps}>
                <Form.Select {...register('accuracyId')} isInvalid={Boolean(errors.accuracyId)}>
                  <option value="">{t('Select machine accuracy')}</option>
                  {MACHINE_ACCURACIES.map((option) => (
                    <option key={option.id} value={option.id}>
                      {t(option.label)}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="lineId" label={t('Machine Line No.')} help={FIELD_HELP.lineId} {...fieldProps}>
                {/* Controlled: the options load after the customer is known */}
                <Controller
                  name="lineId"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field} disabled={!userId || lines.loading || Boolean(lines.error)} isInvalid={Boolean(errors.lineId)}>
                      <option value="">
                        {placeholder(lines, {
                          needs: userId ? '' : t('Select a customer first'),
                          loading: t('Loading lines…'),
                          error: t('Lines unavailable'),
                          select: t('Select line'),
                          empty: t('No lines for this customer'),
                        })}
                      </option>
                      {lines.items.map((line) => (
                        <option key={line.id} value={line.id}>
                          {line.name}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                />
              </Field>

              <Field name="isInsured" label={t('Insured')} {...fieldProps}>
                <Form.Select {...register('isInsured')} isInvalid={Boolean(errors.isInsured)}>
                  <option value={NO}>{t('No')}</option>
                  <option value={YES}>{t('Yes')}</option>
                </Form.Select>
              </Field>

              <Field name="maintenanceRequired" label={t('Maintenance Req.')} {...fieldProps}>
                <Form.Select {...register('maintenanceRequired')} isInvalid={Boolean(errors.maintenanceRequired)}>
                  <option value={NO}>{t('No')}</option>
                  <option value={YES}>{t('Yes')}</option>
                </Form.Select>
              </Field>

              <Field name="installationDate" label={t('Installation Date')} md={3} {...fieldProps}>
                <Controller
                  name="installationDate"
                  control={control}
                  render={({ field }) => <DatePicker {...field} isInvalid={Boolean(errors.installationDate)} />}
                />
              </Field>

              <Field name="billDate" label={t('Bill Date')} md={3} {...fieldProps}>
                <Controller
                  name="billDate"
                  control={control}
                  render={({ field }) => <DatePicker {...field} isInvalid={Boolean(errors.billDate)} />}
                />
              </Field>

              <Field name="warrantyDate" label={t('Warranty End Date')} {...fieldProps}>
                <Controller
                  name="warrantyDate"
                  control={control}
                  render={({ field }) => <DatePicker {...field} isInvalid={Boolean(errors.warrantyDate)} />}
                />
              </Field>

              <Field name="hourlyCost" label={t('Machine Hourly Cost')} {...fieldProps}>
                <Form.Control {...register('hourlyCost')} inputMode="decimal" autoComplete="off" placeholder="800.00" isInvalid={Boolean(errors.hourlyCost)} />
              </Field>

              <Field name="amc" label={t('AMC - only after O/W')} help={FIELD_HELP.amc} {...fieldProps}>
                <Form.Control {...register('amc')} autoComplete="off" maxLength={MAX_LENGTH.amc} isInvalid={Boolean(errors.amc)} />
              </Field>

              <Field name="machineSystemType" label={t('Machine System Type')} {...fieldProps}>
                <Form.Select {...register('machineSystemType')} isInvalid={Boolean(errors.machineSystemType)}>
                  {MACHINE_SYSTEM_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="securityMode" label={t('Security Type')} help={FIELD_HELP.securityMode} {...fieldProps}>
                <Form.Select {...register('securityMode')} isInvalid={Boolean(errors.securityMode)}>
                  {SECURITY_MODES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.label)}
                    </option>
                  ))}
                </Form.Select>
              </Field>
            </Row>
          </Card.Body>
        </Card>

        {/* Machine data access details */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-hdd-network text-primary" aria-hidden="true" />
            {t('Machine data access details')}
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Field name="localIp" label={t('Local IP')} help={FIELD_HELP.localIp} md={4} {...fieldProps}>
                <Form.Control {...register('localIp')} autoComplete="off" inputMode="decimal" placeholder="192.168.1.10" isInvalid={Boolean(errors.localIp)} />
              </Field>

              <Field name="liveIp" label={t('Live IP')} help={FIELD_HELP.liveIp} md={4} {...fieldProps}>
                <Form.Control {...register('liveIp')} autoComplete="off" inputMode="decimal" placeholder="103.81.119.106" isInvalid={Boolean(errors.liveIp)} />
              </Field>

              <Field name="port" label={t('Port')} help={FIELD_HELP.port} md={4} {...fieldProps}>
                <Form.Control {...register('port')} autoComplete="off" inputMode="numeric" placeholder="4840" isInvalid={Boolean(errors.port)} />
              </Field>

              <Field name="username" label={t('User Name')} md={4} {...fieldProps}>
                <Form.Control {...register('username')} autoComplete="off" maxLength={MAX_LENGTH.username} isInvalid={Boolean(errors.username)} />
              </Field>

              <Form.Group as={Col} md={4} controlId="password">
                <FieldLabel required={!isEdit} help={FIELD_HELP.password}>
                  {t('Password')}
                </FieldLabel>
                <InputGroup hasValidation>
                  <Form.Control
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    maxLength={MAX_LENGTH.password}
                    placeholder={isEdit && existing?.hasPassword ? '••••••••' : undefined}
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
                {isEdit && <Form.Text>{t('To change the password type it here, otherwise leave it blank.')}</Form.Text>}
              </Form.Group>

              <Form.Group as={Col} md={4}>
                <Form.Label as="span" className="required d-block" id="controllerVersionType-label">
                  {t('Controller Ver.')}
                </Form.Label>
                <div role="radiogroup" className="ts-radio-group" aria-labelledby="controllerVersionType-label">
                  {CONTROLLER_VERSION_TYPES.map((option) => (
                    <Form.Check
                      key={option.id}
                      inline
                      type="radio"
                      id={`controllerVersionType-${option.id}`}
                      label={option.label}
                      value={String(option.id)}
                      {...register('controllerVersionType')}
                      isInvalid={Boolean(errors.controllerVersionType)}
                    />
                  ))}
                </div>
                {errors.controllerVersionType && (
                  <div className="invalid-feedback d-block">{errors.controllerVersionType.message}</div>
                )}
              </Form.Group>

              <Field name="longitude" label={t('Longitude')} md={4} {...fieldProps}>
                <Form.Control {...register('longitude')} autoComplete="off" inputMode="decimal" placeholder="70.671297" isInvalid={Boolean(errors.longitude)} />
              </Field>

              <Field name="latitude" label={t('Latitude')} md={4} {...fieldProps}>
                <Form.Control {...register('latitude')} autoComplete="off" inputMode="decimal" placeholder="22.244054" isInvalid={Boolean(errors.latitude)} />
              </Field>

              <Form.Group as={Col} md={4}>
                <FieldLabel help={FIELD_HELP.healthIds}>{t('Machine Health')}</FieldLabel>
                <Controller
                  name="healthIds"
                  control={control}
                  render={({ field }) => <HealthSensorPicker id="healthIds" value={field.value} onChange={field.onChange} />}
                />
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>

        {/* Actions */}
        <div className="ts-form-actions">
          <span className="ts-form-actions-note">
            <Trans i18nKey="Fields marked <r>*</r> are required." components={{ r: <span className="text-danger" /> }} />
          </span>
          <Button variant="ghost" onClick={() => navigate(ROUTES.MACHINES)} disabled={isSubmitting}>
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
                {isEdit ? t('Update Machine') : t('Save Machine')}
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default AddMachine
