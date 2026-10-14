import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CUSTOMER_ROLE_ID } from '@/constants/app'
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
import { formatDate } from '@/utils/helpers'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import Loader from '@/components/common/Loader'
import { customerName } from '@/pages/Customers/customerFormat'
import HealthSensorPicker from './HealthSensorPicker'
import { INITIAL_VALUES, MAX_LENGTH, NO, REQUIRED_FIELDS, YES, machineSchema, toFormValues, toMachinePayload } from './machineForm'
import { FIELD_HELP } from './machineHelp'

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
function useOptions(load, title) {
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
        toast.error(error.message, { title: `Could not load ${title}` })
      })
    return () => {
      active = false
    }
  }, [load, title])

  return state
}

// First option of a dependent select: loading / unavailable / pick the parent first / empty
const placeholder = ({ loading, error, items }, label, { needs, empty } = {}) => {
  if (needs) return needs
  if (loading) return `Loading ${label.toLowerCase()}…`
  if (error) return `${label} unavailable`
  return items.length ? `Select ${label.toLowerCase()}` : empty ?? `No ${label.toLowerCase()} yet`
}

const loadCustomers = () => getUsers().then((users) => users.filter((user) => user.roleId === CUSTOMER_ROLE_ID))
const loadBrands = () => getBrands().then((list) => [...list].sort(byName))
const loadControllers = () => getControllers().then((list) => [...list].sort(byName))
const loadModels = () => getModels().then((list) => [...list].sort(byName))

// Add and edit share this form: /machines/add and /machines/:id/edit (admin only)
function AddMachine() {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)

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
    defaultValues: INITIAL_VALUES,
  })

  const [showPassword, setShowPassword] = useState(false)

  // Machine being edited (null when adding)
  const [existing, setExisting] = useState(null)
  const [machineLoading, setMachineLoading] = useState(isEdit)
  const [machineError, setMachineError] = useState('')

  const customers = useOptions(loadCustomers, 'customers')
  const brands = useOptions(loadBrands, 'brands')
  const controllers = useOptions(loadControllers, 'controllers')
  const models = useOptions(loadModels, 'models')

  const userId = watch('userId')
  const brandId = watch('brandId')
  const controllerId = watch('controllerId')

  // Lines are the picked customer's (Masters › Line, admin acting for that customer)
  const loadLines = useMemo(() => (userId ? () => getUserLines(null, userId).then((list) => [...list].sort(byName)) : null), [userId])
  const lines = useOptions(loadLines, 'lines')

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
        toast.success(`${payload.name} has been updated.`, { title: 'Machine updated' })
      } else {
        await createMachine(payload)
        toast.success(`${payload.name} has been added.`, { title: 'Machine created' })
      }
      navigate(ROUTES.MACHINES)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save machine' })
    }
  }

  const fieldProps = { isEdit, errors }

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">Operations · Machines</div>
        <h1>{isEdit ? 'Edit Machine' : 'Add Machine'}</h1>
        <p className="ts-page-subtitle">
          {isEdit ? 'Update the machine and how its data is read.' : "Register a customer's machine and how its data is read."}
        </p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={ROUTES.MACHINES} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Machine list
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
        <Loader text={machineLoading ? 'Loading machine…' : 'Loading options…'} />
      </>
    )
  }

  if (machineError) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>Could not load this machine.</b> {machineError}
        </Alert>
      </>
    )
  }

  return (
    <>
      {header}

      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit machine' : 'Add machine'}>
        {/* Machine details */}
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-cpu text-primary" aria-hidden="true" />
            Machine details
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Field name="userId" label="Customer" help={FIELD_HELP.userId} {...fieldProps}>
                <Form.Select
                  {...register('userId', { onChange: clearLine })}
                  disabled={customers.loading || Boolean(customers.error)}
                  isInvalid={Boolean(errors.userId)}
                >
                  <option value="">{placeholder(customers, 'Customer', { empty: 'No customers yet' })}</option>
                  {customers.items.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customerName(customer) === '—' ? customer.username : `${customerName(customer)} (${customer.username})`}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Form.Group as={Col} md={6} controlId="addedDate">
                <Form.Label>Machine Added Date</Form.Label>
                <Form.Control value={formatDate(existing?.createdAt ?? new Date())} readOnly />
              </Form.Group>

              <Field name="name" label="Machine Name" {...fieldProps}>
                <Form.Control {...register('name')} autoComplete="off" maxLength={MAX_LENGTH.name} placeholder="VMC-01" isInvalid={Boolean(errors.name)} />
              </Field>

              <Field name="serialNumber" label="Machine Sr. No." {...fieldProps}>
                <Form.Control {...register('serialNumber')} autoComplete="off" maxLength={MAX_LENGTH.serialNumber} isInvalid={Boolean(errors.serialNumber)} />
              </Field>

              <Field name="brandId" label="Brand" {...fieldProps}>
                <Form.Select
                  {...register('brandId', { onChange: clearController })}
                  disabled={brands.loading || Boolean(brands.error)}
                  isInvalid={Boolean(errors.brandId)}
                >
                  <option value="">{placeholder(brands, 'Brand')}</option>
                  {brands.items.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="controllerId" label="Controller" help={FIELD_HELP.controllerId} {...fieldProps}>
                <Form.Select
                  {...register('controllerId', { onChange: clearModel })}
                  disabled={!brandId || controllers.loading || Boolean(controllers.error)}
                  isInvalid={Boolean(errors.controllerId)}
                >
                  <option value="">
                    {placeholder(
                      { ...controllers, items: brandControllers },
                      'Controller',
                      { needs: brandId ? '' : 'Select a brand first', empty: 'No controllers for this brand' },
                    )}
                  </option>
                  {brandControllers.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="modelId" label="Model Name" help={FIELD_HELP.modelId} {...fieldProps}>
                <Form.Select
                  {...register('modelId')}
                  disabled={!controllerId || models.loading || Boolean(models.error)}
                  isInvalid={Boolean(errors.modelId)}
                >
                  <option value="">
                    {placeholder(
                      { ...models, items: controllerModels },
                      'Model',
                      { needs: controllerId ? '' : 'Select a controller first', empty: 'No models for this controller' },
                    )}
                  </option>
                  {controllerModels.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="controllerVersion" label="Controller Software Ver." {...fieldProps}>
                <Form.Control {...register('controllerVersion')} autoComplete="off" maxLength={MAX_LENGTH.controllerVersion} placeholder="V04.07" isInvalid={Boolean(errors.controllerVersion)} />
              </Field>

              <Field name="accuracyId" label="Machine Accuracy" {...fieldProps}>
                <Form.Select {...register('accuracyId')} isInvalid={Boolean(errors.accuracyId)}>
                  <option value="">Select machine accuracy</option>
                  {MACHINE_ACCURACIES.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="lineId" label="Machine Line No." help={FIELD_HELP.lineId} {...fieldProps}>
                {/* Controlled: the options load after the customer is known */}
                <Controller
                  name="lineId"
                  control={control}
                  render={({ field }) => (
                    <Form.Select {...field} disabled={!userId || lines.loading || Boolean(lines.error)} isInvalid={Boolean(errors.lineId)}>
                      <option value="">
                        {placeholder(lines, 'Line', { needs: userId ? '' : 'Select a customer first', empty: 'No lines for this customer' })}
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

              <Field name="isInsured" label="Insured" {...fieldProps}>
                <Form.Select {...register('isInsured')} isInvalid={Boolean(errors.isInsured)}>
                  <option value={NO}>No</option>
                  <option value={YES}>Yes</option>
                </Form.Select>
              </Field>

              <Field name="maintenanceRequired" label="Maintenance Req." {...fieldProps}>
                <Form.Select {...register('maintenanceRequired')} isInvalid={Boolean(errors.maintenanceRequired)}>
                  <option value={NO}>No</option>
                  <option value={YES}>Yes</option>
                </Form.Select>
              </Field>

              <Field name="installationDate" label="Installation Date" md={3} {...fieldProps}>
                <Form.Control {...register('installationDate')} type="date" isInvalid={Boolean(errors.installationDate)} />
              </Field>

              <Field name="billDate" label="Bill Date" md={3} {...fieldProps}>
                <Form.Control {...register('billDate')} type="date" isInvalid={Boolean(errors.billDate)} />
              </Field>

              <Field name="warrantyDate" label="Warranty End Date" {...fieldProps}>
                <Form.Control {...register('warrantyDate')} type="date" isInvalid={Boolean(errors.warrantyDate)} />
              </Field>

              <Field name="hourlyCost" label="Machine Hourly Cost" {...fieldProps}>
                <Form.Control {...register('hourlyCost')} inputMode="decimal" autoComplete="off" placeholder="800.00" isInvalid={Boolean(errors.hourlyCost)} />
              </Field>

              <Field name="amc" label="AMC - only after O/W" help={FIELD_HELP.amc} {...fieldProps}>
                <Form.Control {...register('amc')} autoComplete="off" maxLength={MAX_LENGTH.amc} isInvalid={Boolean(errors.amc)} />
              </Field>

              <Field name="machineSystemType" label="Machine System Type" {...fieldProps}>
                <Form.Select {...register('machineSystemType')} isInvalid={Boolean(errors.machineSystemType)}>
                  {MACHINE_SYSTEM_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Form.Select>
              </Field>

              <Field name="securityMode" label="Security Type" help={FIELD_HELP.securityMode} {...fieldProps}>
                <Form.Select {...register('securityMode')} isInvalid={Boolean(errors.securityMode)}>
                  {SECURITY_MODES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
            Machine data access details
          </Card.Header>
          <Card.Body>
            <Row className="g-3">
              <Field name="localIp" label="Local IP" help={FIELD_HELP.localIp} md={4} {...fieldProps}>
                <Form.Control {...register('localIp')} autoComplete="off" inputMode="decimal" placeholder="192.168.1.10" isInvalid={Boolean(errors.localIp)} />
              </Field>

              <Field name="liveIp" label="Live IP" help={FIELD_HELP.liveIp} md={4} {...fieldProps}>
                <Form.Control {...register('liveIp')} autoComplete="off" inputMode="decimal" placeholder="103.81.119.106" isInvalid={Boolean(errors.liveIp)} />
              </Field>

              <Field name="port" label="Port" help={FIELD_HELP.port} md={4} {...fieldProps}>
                <Form.Control {...register('port')} autoComplete="off" inputMode="numeric" placeholder="4840" isInvalid={Boolean(errors.port)} />
              </Field>

              <Field name="username" label="User Name" md={4} {...fieldProps}>
                <Form.Control {...register('username')} autoComplete="off" maxLength={MAX_LENGTH.username} isInvalid={Boolean(errors.username)} />
              </Field>

              <Form.Group as={Col} md={4} controlId="password">
                <FieldLabel required={!isEdit} help={FIELD_HELP.password}>
                  Password
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
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
                  </Button>
                  <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
                </InputGroup>
                {isEdit && <Form.Text>To change the password type it here, otherwise leave it blank.</Form.Text>}
              </Form.Group>

              <Form.Group as={Col} md={4}>
                <Form.Label as="span" className="required d-block" id="controllerVersionType-label">
                  Controller Ver.
                </Form.Label>
                <div role="radiogroup" aria-labelledby="controllerVersionType-label">
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

              <Field name="longitude" label="Longitude" md={4} {...fieldProps}>
                <Form.Control {...register('longitude')} autoComplete="off" inputMode="decimal" placeholder="70.671297" isInvalid={Boolean(errors.longitude)} />
              </Field>

              <Field name="latitude" label="Latitude" md={4} {...fieldProps}>
                <Form.Control {...register('latitude')} autoComplete="off" inputMode="decimal" placeholder="22.244054" isInvalid={Boolean(errors.latitude)} />
              </Field>

              <Form.Group as={Col} md={4}>
                <FieldLabel help={FIELD_HELP.healthIds}>Machine Health</FieldLabel>
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
            Fields marked <span className="text-danger">*</span> are required.
          </span>
          <Button variant="ghost" onClick={() => navigate(ROUTES.MACHINES)} disabled={isSubmitting}>
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
                {isEdit ? 'Update Machine' : 'Save Machine'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default AddMachine
