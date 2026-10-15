import { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CUSTOMER_ROLE_ID, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { getClienteles } from '@/services/clienteleService'
import { getUsers } from '@/services/customerService'
import { getMachines } from '@/services/machineService'
import { createPart, getPartById, partDrawingUrl, updatePart, uploadPartDrawing } from '@/services/partService'
import useAuth from '@/hooks/useAuth'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import Loader from '@/components/common/Loader'
import StatusToggle from '@/components/common/StatusToggle'
import { customerName } from '@/pages/Customers/customerFormat'
import ProcessFields from './ProcessFields'
import {
  EMPTY_PROCESS,
  INITIAL_VALUES,
  MAX_LENGTH,
  MAX_PART_COUNT,
  MAX_PROCESSES,
  PART_STATUS,
  partSchema,
  partSeconds,
  toFormValues,
  toPartPayload,
} from './partForm'
import { FIELD_HELP } from './partHelp'

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })

// Add and edit share this form: /masters/parts/add and /masters/parts/:id/edit (managers only).
// The superadmin picks the customer; a customer or admin always adds to their own company (the
// server enforces it). Each process picks from the customer's machines.
function AddPart() {
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
    resolver: zodResolver(partSchema),
    defaultValues: canPickCustomer ? INITIAL_VALUES : { ...INITIAL_VALUES, userId: ownCompanyId ? String(ownCompanyId) : '' },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'processes' })
  const userId = useWatch({ control, name: 'userId' })
  const processes = useWatch({ control, name: 'processes' })

  // Part being edited (null when adding)
  const [existing, setExisting] = useState(null)
  const [partLoading, setPartLoading] = useState(isEdit)
  const [partError, setPartError] = useState('')

  const [customers, setCustomers] = useState({ items: [], loading: canPickCustomer })
  const [machines, setMachines] = useState({ items: [], loading: false })
  const [clienteles, setClienteles] = useState({ items: [], loading: false })

  // Superadmin: the customers to pick from
  useEffect(() => {
    if (!canPickCustomer) return undefined
    let active = true
    getUsers()
      .then((users) => active && setCustomers({ items: users.filter((option) => option.roleId === CUSTOMER_ROLE_ID), loading: false }))
      .catch((error) => {
        if (!active) return
        setCustomers({ items: [], loading: false })
        toast.error(error.message, { title: 'Could not load customers' })
      })
    return () => {
      active = false
    }
  }, [canPickCustomer])

  // The customer's machines (the server returns only the own company's to non-superadmins)
  useEffect(() => {
    if (!userId) {
      setMachines({ items: [], loading: false })
      return undefined
    }
    let active = true
    setMachines((previous) => ({ ...previous, loading: true }))
    getMachines(canPickCustomer ? userId : undefined)
      .then((list) => active && setMachines({ items: [...list].sort(byName), loading: false }))
      .catch((error) => {
        if (!active) return
        setMachines({ items: [], loading: false })
        toast.error(error.message, { title: 'Could not load machines' })
      })
    return () => {
      active = false
    }
  }, [userId, canPickCustomer])

  // The customer's clienteles (Masters › Clientele)
  useEffect(() => {
    if (!userId) {
      setClienteles({ items: [], loading: false })
      return undefined
    }
    let active = true
    setClienteles((previous) => ({ ...previous, loading: true }))
    getClienteles(canPickCustomer ? userId : undefined)
      .then((list) => active && setClienteles({ items: [...list].sort(byName), loading: false }))
      .catch((error) => {
        if (!active) return
        setClienteles({ items: [], loading: false })
        toast.error(error.message, { title: 'Could not load clienteles' })
      })
    return () => {
      active = false
    }
  }, [userId, canPickCustomer])

  // Edit: load the part and fill the form (reset() also makes these the Reset values)
  useEffect(() => {
    if (!isEdit) return undefined
    let active = true
    setPartLoading(true)
    getPartById(id)
      .then((part) => {
        if (!active) return
        setExisting(part)
        reset(toFormValues(part))
      })
      .catch((error) => active && setPartError(error.message))
      .finally(() => active && setPartLoading(false))
    return () => {
      active = false
    }
  }, [id, isEdit, reset])

  // Clienteles and machines belong to one customer: clear the picks when the customer changes
  const handleCustomerChange = () => {
    setValue('clienteleId', '')
    getValues('processes').forEach((_, index) => setValue(`processes.${index}.machineIds`, []))
  }

  const drawingUrl = useCallback((processId) => partDrawingUrl(id, processId), [id])

  // Uploads the drawings picked since the last save (POST /parts/drawings) and puts their stored
  // names in the form, so a retry after a failed save does not upload them again
  const uploadPendingDrawings = async (processList) => {
    const uploaded = []
    for (const [index, process] of processList.entries()) {
      if (!process.drawingUpload) {
        uploaded.push(process)
        continue
      }
      const drawing = await uploadPartDrawing(process.drawingUpload)
      setValue(`processes.${index}.drawingFile`, drawing.file)
      setValue(`processes.${index}.drawingName`, drawing.name)
      setValue(`processes.${index}.drawingUpload`, null)
      uploaded.push({ ...process, drawingFile: drawing.file, drawingName: drawing.name, drawingUpload: null })
    }
    return uploaded
  }

  const onSubmit = async (values) => {
    try {
      const processList = await uploadPendingDrawings(values.processes)
      const payload = toPartPayload({ ...values, processes: processList }, existing)
      if (isEdit) {
        await updatePart(id, payload)
        toast.success(`${payload.partName} has been updated.`, { title: 'Part updated' })
      } else {
        await createPart(payload)
        toast.success(`${payload.partName} has been added.`, { title: 'Part created' })
      }
      navigate(ROUTES.PARTS)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save part' })
    }
  }

  let machinesPlaceholder = 'Select Machine'
  if (!userId) machinesPlaceholder = 'Select a customer first'
  else if (machines.loading) machinesPlaceholder = 'Loading machines…'
  else if (!machines.items.length) machinesPlaceholder = 'No machines for this customer'

  let clientelePlaceholder = 'Select Clientele'
  if (!userId) clientelePlaceholder = 'Select a customer first'
  else if (clienteles.loading) clientelePlaceholder = 'Loading clienteles…'
  else if (!clienteles.items.length) clientelePlaceholder = 'No clienteles for this customer'

  const header = (
    <header className="ts-page-header">
      <div>
        <div className="ts-eyebrow">Masters · Parts</div>
        <h1>{isEdit ? 'Edit Part' : 'Add Part'}</h1>
        <p className="ts-page-subtitle">
          {isEdit ? 'Update the part and how it is produced.' : 'Register a part, its processes and the machines that make it.'}
        </p>
      </div>
      <div className="ts-page-actions">
        <Button as={Link} to={ROUTES.PARTS} variant="ghost">
          <i className="bi bi-arrow-left me-2" aria-hidden="true" />
          Part list
        </Button>
      </div>
    </header>
  )

  // The customer select gets its saved value only when its options exist: wait for them
  if (partLoading || customers.loading) {
    return (
      <>
        {header}
        <Loader text={partLoading ? 'Loading part…' : 'Loading options…'} />
      </>
    )
  }

  if (partError) {
    return (
      <>
        {header}
        <Alert variant="danger">
          <b>Could not load this part.</b> {partError}
        </Alert>
      </>
    )
  }

  const processListError = errors.processes?.message ?? errors.processes?.root?.message

  return (
    <>
      {header}

      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit part' : 'Add part'}>
        <Card className="mb-3">
          <Card.Header>
            <i className="bi bi-rocket-takeoff text-primary" aria-hidden="true" />
            {isEdit ? 'Edit Part' : 'Add Part'}
          </Card.Header>
          <Card.Body>
            <Row className="g-4">
              {/* Part details */}
              <Col lg={4} xl={3} className="ts-part-details">
                <Row className="g-3">
                  {canPickCustomer && (
                    <Form.Group as={Col} xs={12} controlId="userId">
                      <FieldLabel required help={FIELD_HELP.userId}>
                        Customer Name
                      </FieldLabel>
                      <Form.Select {...register('userId', { onChange: handleCustomerChange })} isInvalid={Boolean(errors.userId)}>
                        <option value="">{customers.items.length ? 'Select Customer' : 'No customers yet'}</option>
                        {customers.items.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customerName(customer) === '—' ? customer.username : `${customerName(customer)} (${customer.username})`}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">{errors.userId?.message}</Form.Control.Feedback>
                    </Form.Group>
                  )}

                  <Form.Group as={Col} xs={12} controlId="clienteleId">
                    <FieldLabel required help={FIELD_HELP.clienteleId}>
                      Clientele Name
                    </FieldLabel>
                    {/* Controlled: the options load after the customer is known */}
                    <Controller
                      name="clienteleId"
                      control={control}
                      render={({ field }) => (
                        <Form.Select {...field} disabled={!userId || clienteles.loading} isInvalid={Boolean(errors.clienteleId)}>
                          <option value="">{clientelePlaceholder}</option>
                          {clienteles.items.map((clientele) => (
                            <option key={clientele.id} value={clientele.id}>
                              {`${clientele.name} (${clientele.clientCode})`}
                            </option>
                          ))}
                        </Form.Select>
                      )}
                    />
                    <Form.Control.Feedback type="invalid">{errors.clienteleId?.message}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xs={12} controlId="partNo">
                    <Form.Label className="required">Part No.</Form.Label>
                    <Form.Control {...register('partNo')} autoComplete="off" maxLength={MAX_LENGTH.partNo} isInvalid={Boolean(errors.partNo)} />
                    <Form.Control.Feedback type="invalid">{errors.partNo?.message}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xs={12} controlId="partName">
                    <Form.Label className="required">Part Name</Form.Label>
                    <Form.Control {...register('partName')} autoComplete="off" maxLength={MAX_LENGTH.partName} isInvalid={Boolean(errors.partName)} />
                    <Form.Control.Feedback type="invalid">{errors.partName?.message}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xs={12} controlId="partCount">
                    <FieldLabel required help={FIELD_HELP.partCount}>
                      Part Count
                    </FieldLabel>
                    <Form.Control
                      {...register('partCount')}
                      type="number"
                      min={1}
                      max={MAX_PART_COUNT}
                      inputMode="numeric"
                      isInvalid={Boolean(errors.partCount)}
                    />
                    <Form.Control.Feedback type="invalid">{errors.partCount?.message}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xs={12} controlId="partProductionTime">
                    <FieldLabel help={FIELD_HELP.partProductionTime}>Part Production Time (Sec.)</FieldLabel>
                    <Form.Control value={partSeconds(processes)} readOnly tabIndex={-1} className="font-tabular" />
                  </Form.Group>

                  {isEdit && (
                    <Form.Group as={Col} xs={12}>
                      <Form.Label className="required">Status</Form.Label>
                      <StatusToggle
                        id="status"
                        {...register('status')}
                        activeValue={PART_STATUS.ACTIVE}
                        inactiveValue={PART_STATUS.INACTIVE}
                      />
                    </Form.Group>
                  )}
                </Row>
              </Col>

              {/* Processes */}
              <Col lg={8} xl={9}>
                {fields.map((field, index) => (
                  <ProcessFields
                    key={field.id}
                    index={index}
                    control={control}
                    register={register}
                    setValue={setValue}
                    errors={errors.processes?.[index]}
                    machines={machines.items}
                    machinesPlaceholder={machinesPlaceholder}
                    drawingUrl={drawingUrl}
                    canRemove={fields.length > 1}
                    onRemove={() => remove(index)}
                  />
                ))}
                {processListError && <div className="invalid-feedback d-block mb-2">{processListError}</div>}
                <Button onClick={() => append({ ...EMPTY_PROCESS })} disabled={fields.length >= MAX_PROCESSES}>
                  <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                  Add More
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Actions */}
        <div className="ts-form-actions">
          <span className="ts-form-actions-note">
            Fields marked <span className="text-danger">*</span> are required.
          </span>
          <Button variant="ghost" onClick={() => navigate(ROUTES.PARTS)} disabled={isSubmitting}>
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
                {isEdit ? 'Update Part' : 'Save Part'}
              </>
            )}
          </Button>
        </div>
      </Form>
    </>
  )
}

export default AddPart
