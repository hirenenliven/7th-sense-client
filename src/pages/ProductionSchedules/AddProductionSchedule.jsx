import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@/i18n/zodResolver'
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CUSTOMER_ROLE_ID, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { getUsers } from '@/services/customerService'
import { getMachines } from '@/services/machineService'
import { getPartById, getParts } from '@/services/partService'
import { createProductionSchedule, getProductionScheduleById, updateProductionSchedule } from '@/services/productionScheduleService'
import { getShifts } from '@/services/shiftService'
import useAuth from '@/hooks/useAuth'
import i18n from '@/i18n'
import { toast } from '@/utils/toast'
import { formatClock12 } from '@/utils/dateTime'
import DatePicker from '@/components/common/DatePicker'
import FieldLabel from '@/components/common/FieldLabel'
import Loader from '@/components/common/Loader'
import StatusToggle from '@/components/common/StatusToggle'
import { customerName } from '@/pages/Customers/customerFormat'
import ScheduleJobFields from './ScheduleJobFields'
import {
  EMPTY_ITEM,
  INITIAL_VALUES,
  MAX_ITEMS,
  SCHEDULE_STATUS,
  SCHEDULE_TYPE,
  SCHEDULE_TYPES,
  scheduleSchema,
  toFormValues,
  toSchedulePayload,
} from './scheduleForm'
import { FIELD_HELP } from './scheduleHelp'
import { Trans, useTranslation } from 'react-i18next'

const EMPTY_LISTS = { machines: [], shifts: [], parts: [], supervisors: [], operators: [] }
const byLabel = (a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: 'base' })
const userLabel = (user) => {
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ')
  return name ? `${name} (${user.username})` : user.username
}
const ITEM_SELECTS = ['supervisorId', 'operatorId', 'shiftId', 'partId', 'processId']

// Add and edit share this form: /production/schedule/add and /production/schedule/:id/edit (managers
// only). The superadmin picks the customer; a customer or admin always plans their own company (the
// server enforces it). Every list of a job is the customer's; part processes are those of the part that
// run on the selected machine.
function AddProductionSchedule() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = Boolean(id)
  const { user, hasRole } = useAuth()
  const canPickCustomer = hasRole(SUPERADMIN_ONLY)
  const ownCompanyId = user?.role === ROLES.CUSTOMER ? user.id : user?.companyId

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
    defaultValues: canPickCustomer ? INITIAL_VALUES : { ...INITIAL_VALUES, userId: ownCompanyId ? String(ownCompanyId) : '' },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const [userId, machineId, scheduleType, startDate, endDate, items] = useWatch({
    control,
    name: ['userId', 'machineId', 'scheduleType', 'startDate', 'endDate', 'items'],
  })
  const isMultiple = scheduleType === SCHEDULE_TYPE.MULTIPLE

  // Schedule being edited (null when adding)
  const [existing, setExisting] = useState(null)
  const [scheduleLoading, setScheduleLoading] = useState(isEdit)
  const [scheduleError, setScheduleError] = useState('')

  const [customers, setCustomers] = useState({ items: [], loading: canPickCustomer })
  const [lists, setLists] = useState({ ...EMPTY_LISTS, loading: false })
  // Part id → { loading, processes } (GET /parts/{id}; list rows carry no processes)
  const [partDetails, setPartDetails] = useState(() => new Map())

  // Superadmin: the customers to pick from
  useEffect(() => {
    if (!canPickCustomer) return undefined
    let active = true
    getUsers()
      .then((users) => active && setCustomers({ items: users.filter((option) => option.roleId === CUSTOMER_ROLE_ID), loading: false }))
      .catch((error) => {
        if (!active) return
        setCustomers({ items: [], loading: false })
        toast.error(error.message, { title: i18n.t('Could not load customers') })
      })
    return () => {
      active = false
    }
  }, [canPickCustomer])

  // The customer's machines, shifts, parts, supervisors and operators (non-superadmins: the server
  // returns their own company's)
  useEffect(() => {
    if (!userId) {
      setLists({ ...EMPTY_LISTS, loading: false })
      return undefined
    }
    let active = true
    const customerId = canPickCustomer ? userId : undefined
    setLists((previous) => ({ ...previous, loading: true }))
    Promise.all([
      getMachines(customerId),
      getShifts(customerId),
      getParts(customerId),
      getUsers({ filterRole: ROLES.SUPERVISOR, companyId: customerId }),
      getUsers({ filterRole: ROLES.OPERATOR, companyId: customerId }),
    ])
      .then(([machines, shifts, parts, supervisors, operators]) => {
        if (!active) return
        setLists({
          machines: machines.map((machine) => ({ value: String(machine.id), label: machine.name })).sort(byLabel),
          shifts: shifts.map((shift) => ({
            value: String(shift.id),
            label: `${shift.name} (${formatClock12(shift.startTime)} – ${formatClock12(shift.endTime)})`,
            startTime: shift.startTime,
            endTime: shift.endTime,
          })),
          parts: parts.map((part) => ({ value: String(part.id), label: `${part.partNo} - ${part.partName}` })).sort(byLabel),
          supervisors: supervisors.map((member) => ({ value: String(member.id), label: userLabel(member) })).sort(byLabel),
          operators: operators.map((member) => ({ value: String(member.id), label: userLabel(member) })).sort(byLabel),
          loading: false,
        })
      })
      .catch((error) => {
        if (!active) return
        setLists({ ...EMPTY_LISTS, loading: false })
        toast.error(error.message, { title: i18n.t('Could not load schedule options') })
      })
    return () => {
      active = false
    }
  }, [userId, canPickCustomer])

  // Load the processes of every picked part once
  const partIds = useMemo(() => [...new Set((items ?? []).map((item) => item.partId).filter(Boolean))], [items])
  useEffect(() => {
    const missing = partIds.filter((partId) => !partDetails.has(partId))
    if (!missing.length) return
    setPartDetails((previous) => {
      const next = new Map(previous)
      missing.forEach((partId) => next.set(partId, { loading: true, processes: [] }))
      return next
    })
    missing.forEach((partId) => {
      getPartById(partId)
        .then((part) => setPartDetails((previous) => new Map(previous).set(partId, { loading: false, processes: part.processes ?? [] })))
        .catch((error) => {
          setPartDetails((previous) => new Map(previous).set(partId, { loading: false, processes: [] }))
          toast.error(error.message, { title: i18n.t('Could not load part processes') })
        })
    })
  }, [partIds, partDetails])

  // Edit: load the schedule and fill the form (reset() also makes these the Reset values)
  useEffect(() => {
    if (!isEdit) return undefined
    let active = true
    setScheduleLoading(true)
    getProductionScheduleById(id)
      .then((schedule) => {
        if (!active) return
        setExisting(schedule)
        reset(toFormValues(schedule))
      })
      .catch((error) => active && setScheduleError(error.message))
      .finally(() => active && setScheduleLoading(false))
    return () => {
      active = false
    }
  }, [id, isEdit, reset])

  // Processes of partId that run on the selected machine
  const processOptions = useCallback(
    (partId) => {
      const details = partDetails.get(partId)
      if (!partId || !details) return { loading: Boolean(partId), items: [] }
      return {
        loading: details.loading,
        items: details.processes
          .filter((process) => (process.machineIds ?? []).includes(Number(machineId)))
          .map((process) => ({ value: String(process.id), label: `${process.process} (${process.programName})` })),
      }
    },
    [partDetails, machineId],
  )

  const shiftsById = useMemo(() => new Map(lists.shifts.map((shift) => [shift.value, shift])), [lists.shifts])

  // Everything a job picks belongs to the customer: clear the picks when the customer changes
  const handleCustomerChange = () => {
    setValue('machineId', '')
    getValues('items').forEach((_, index) => ITEM_SELECTS.forEach((field) => setValue(`items.${index}.${field}`, '')))
  }

  // Processes depend on the machine
  const handleMachineChange = () => {
    getValues('items').forEach((_, index) => setValue(`items.${index}.processId`, ''))
  }

  const onSubmit = async (values) => {
    try {
      const payload = toSchedulePayload(values, existing)
      if (isEdit) {
        await updateProductionSchedule(id, payload)
        toast.success(t('The production schedule has been updated.'), { title: t('Schedule updated') })
      } else {
        await createProductionSchedule(payload)
        toast.success(t('The production schedule has been added.'), { title: t('Schedule created') })
      }
      navigate(ROUTES.PRODUCTION_SCHEDULE)
    } catch (error) {
      toast.error(error.message, { title: t('Could not save schedule') })
    }
  }

  // While a list is empty: pick the customer first / loading / none (whole sentences per list)
  const emptyText = (loading, none) => {
    if (!userId) return t('Select a customer first')
    return lists.loading ? loading : none
  }
  const placeholder = {
    supervisor: emptyText(t('Loading supervisors…'), t('No supervisors for this customer')),
    operator: emptyText(t('Loading operators…'), t('No operators for this customer')),
    shift: emptyText(t('Loading shifts…'), t('No shifts for this customer')),
    part: emptyText(t('Loading parts…'), t('No parts for this customer')),
    process: t('Select Part Process'),
  }

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">{t('Production · Schedule')}</div>
        <h1>{isEdit ? t('Edit Production Schedule') : t('Add Production Schedule')}</h1>
        <p className="ts-page-subtitle">
          {isEdit ? t('Update the jobs planned on this machine.') : t('Plan the jobs a machine runs, by shift, for one day or several.')}
        </p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={ROUTES.PRODUCTION_SCHEDULE} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          {t('Schedule list')}
        </Button>
      </div>
    </header>
  )

  // The customer select gets its saved value only when its options exist: wait for them
  if (scheduleLoading || customers.loading) {
    return (
      <>
        {header}
        <Loader text={scheduleLoading ? t('Loading schedule…') : t('Loading options…')} />
      </>
    )
  }

  if (scheduleError) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>{t('Could not load this schedule.')}</b> {scheduleError}
        </Alert>
      </>
    )
  }

  const itemListError = errors.items?.message ?? errors.items?.root?.message

  return (
    <>
      {header}

      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? t('Edit production schedule') : t('Add production schedule')}>
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-calendar-week text-primary" aria-hidden="true" />
            {isEdit ? t('Edit Production Schedule') : t('Add Production Schedule')}
          </Card.Header>
          <Card.Body>
            <Row className="g-3 mb-4">
              <Form.Group as={Col} xs={12}>
                <FieldLabel required help={FIELD_HELP.scheduleType}>
                  {t('Schedule Type')}
                </FieldLabel>
                <div>
                  {SCHEDULE_TYPES.map((option) => (
                    <Form.Check
                      key={option.value}
                      inline
                      type="radio"
                      id={`scheduleType-${option.value}`}
                      label={t(option.label)}
                      value={option.value}
                      {...register('scheduleType')}
                    />
                  ))}
                </div>
              </Form.Group>

              <Form.Group as={Col} md={6} xl={3} controlId="startDate">
                <Form.Label className="required">{isMultiple ? t('Schedule Start Date') : t('Schedule of Date')}</Form.Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => <DatePicker {...field} id="startDate" isInvalid={Boolean(errors.startDate)} />}
                />
                {errors.startDate && <div className="invalid-feedback d-block">{errors.startDate.message}</div>}
              </Form.Group>

              {isMultiple && (
                <Form.Group as={Col} md={6} xl={3} controlId="endDate">
                  <Form.Label className="required">{t('Schedule End Date')}</Form.Label>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker {...field} id="endDate" min={startDate || undefined} isInvalid={Boolean(errors.endDate)} />
                    )}
                  />
                  {errors.endDate && <div className="invalid-feedback d-block">{errors.endDate.message}</div>}
                </Form.Group>
              )}

              {canPickCustomer && (
                <Form.Group as={Col} md={6} xl={3} controlId="userId">
                  <Form.Label className="required">{t('Select Customer')}</Form.Label>
                  <Form.Select {...register('userId', { onChange: handleCustomerChange })} isInvalid={Boolean(errors.userId)}>
                    <option value="">{customers.items.length ? t('Select Customer') : t('No customers yet')}</option>
                    {customers.items.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customerName(customer) === '—' ? customer.username : `${customerName(customer)} (${customer.username})`}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.userId?.message}</Form.Control.Feedback>
                </Form.Group>
              )}

              <Form.Group as={Col} md={6} xl={3} controlId="machineId">
                <FieldLabel required help={FIELD_HELP.machineId}>
                  {t('Machine')}
                </FieldLabel>
                {/* Controlled: the options load after the customer is known */}
                <Controller
                  name="machineId"
                  control={control}
                  render={({ field }) => (
                    <Form.Select
                      {...field}
                      onChange={(event) => {
                        field.onChange(event)
                        handleMachineChange()
                      }}
                      disabled={!lists.machines.length}
                      isInvalid={Boolean(errors.machineId)}
                    >
                      <option value="">{lists.machines.length ? 'Select Machine' : emptyText('machines')}</option>
                      {lists.machines.map((machine) => (
                        <option key={machine.value} value={machine.value}>
                          {machine.label}
                        </option>
                      ))}
                    </Form.Select>
                  )}
                />
                <Form.Control.Feedback type="invalid">{errors.machineId?.message}</Form.Control.Feedback>
              </Form.Group>

              {isEdit && (
                <Form.Group as={Col} md={6} xl={3}>
                  <Form.Label className="required">{t('Status')}</Form.Label>
                  <StatusToggle
                    id="status"
                    {...register('status')}
                    activeValue={SCHEDULE_STATUS.ACTIVE}
                    inactiveValue={SCHEDULE_STATUS.INACTIVE}
                  />
                </Form.Group>
              )}
            </Row>

            {/* Jobs */}
            {fields.map((field, index) => (
              <ScheduleJobFields
                key={field.id}
                index={index}
                control={control}
                register={register}
                setValue={setValue}
                errors={errors.items?.[index]}
                isMultiple={isMultiple}
                startDate={startDate}
                endDate={endDate}
                options={lists}
                processOptions={processOptions}
                shiftsById={shiftsById}
                placeholder={placeholder}
                canRemove={fields.length > 1}
                onRemove={() => remove(index)}
              />
            ))}
            {itemListError && <div className="invalid-feedback d-block mb-2">{itemListError}</div>}
            <Button onClick={() => append({ ...EMPTY_ITEM })} disabled={fields.length >= MAX_ITEMS}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              {t('Add More')}
            </Button>
          </Card.Body>
        </Card>

        {/* Actions */}
        <div className="ts-form-actions">
          <span className="ts-form-actions-note">
            <Trans i18nKey="Fields marked <r>*</r> are required." components={{ r: <span className="text-danger" /> }} />
          </span>
          <Button variant="ghost" onClick={() => navigate(ROUTES.PRODUCTION_SCHEDULE)} disabled={isSubmitting}>
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
                {isEdit ? t('Update Schedule') : t('Save Schedule')}
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default AddProductionSchedule
