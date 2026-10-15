import { useEffect, useRef, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Alert, Button, Col, Form, InputGroup, Modal, Row, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { CUSTOMER_ROLE_ID, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import { COUNTRIES, getDialCode, getStates } from '@/constants/locations'
import { createClientele, getClienteleById, updateClientele } from '@/services/clienteleService'
import { getUsers } from '@/services/customerService'
import useAuth from '@/hooks/useAuth'
import { toast } from '@/utils/toast'
import FieldLabel from '@/components/common/FieldLabel'
import Loader from '@/components/common/Loader'
import StatusToggle from '@/components/common/StatusToggle'
import { customerName } from '@/pages/Customers/customerFormat'
import { CLIENTELE_STATUS, INITIAL_VALUES, MAX_LENGTH, clienteleSchema, toClientelePayload, toFormValues } from './clienteleForm'
import { FIELD_HELP } from './clienteleHelp'

// Add / Edit Clientele modal (managers only): adds one, or edits `clienteleId` (loaded by id, as the
// list rows don't carry every field). The superadmin picks the customer; a customer or admin always
// adds to their own company (the server enforces it).
function ClienteleFormModal({ show, clienteleId = null, onSaved, onHide }) {
  const isEdit = Boolean(clienteleId)
  const { user, hasRole } = useAuth()
  const canPickCustomer = hasRole(SUPERADMIN_ONLY)
  const ownCompanyId = user?.role === ROLES.CUSTOMER ? user.id : user?.companyId
  const emptyValues = canPickCustomer ? INITIAL_VALUES : { ...INITIAL_VALUES, userId: ownCompanyId ? String(ownCompanyId) : '' }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(clienteleSchema), defaultValues: emptyValues })
  const countryCode = useWatch({ control, name: 'countryCode' })
  const states = getStates(countryCode)

  // Superadmin: the customers to pick from, loaded the first time the modal opens
  const [customers, setCustomers] = useState({ items: [], loaded: false })
  const customersRequested = useRef(false)
  useEffect(() => {
    if (!show || !canPickCustomer || customersRequested.current) return
    customersRequested.current = true
    getUsers()
      .then((users) => setCustomers({ items: users.filter((option) => option.roleId === CUSTOMER_ROLE_ID), loaded: true }))
      .catch((error) => {
        setCustomers({ items: [], loaded: true })
        toast.error(error.message, { title: 'Could not load customers' })
      })
  }, [show, canPickCustomer])

  // Every open starts fresh: an empty form, or the clientele loaded into it. `record.id` is the
  // clientele the form holds, so a different one shows the loader until it arrives.
  const [record, setRecord] = useState({ id: null, error: '' })
  useEffect(() => {
    if (!show) return undefined
    if (!clienteleId) {
      reset(emptyValues)
      return undefined
    }
    let active = true
    setRecord({ id: null, error: '' })
    getClienteleById(clienteleId)
      .then((clientele) => {
        if (!active) return
        reset(toFormValues(clientele))
        setRecord({ id: clienteleId, error: '' })
      })
      .catch((error) => active && setRecord({ id: clienteleId, error: error.message }))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- emptyValues is rebuilt every render
  }, [show, clienteleId, reset])

  const recordLoading = isEdit && record.id !== clienteleId
  // The customer select gets its saved value only when its options exist: wait for them
  const customersLoading = canPickCustomer && !customers.loaded
  const loadError = isEdit && record.id === clienteleId ? record.error : ''
  const ready = !recordLoading && !customersLoading && !loadError

  const onSubmit = async (values) => {
    try {
      const payload = toClientelePayload(values, isEdit)
      if (isEdit) {
        await updateClientele(clienteleId, payload)
        toast.success(`${payload.name} has been updated.`, { title: 'Clientele updated' })
      } else {
        await createClientele(payload)
        toast.success(`${payload.name} has been added.`, { title: 'Clientele created' })
      }
      onSaved()
    } catch (error) {
      toast.error(error.message, { title: 'Could not save clientele' })
    }
  }

  const renderFields = () => (
    <Row className="g-3">
      {canPickCustomer && (
        <Form.Group as={Col} md={6} controlId="clientele-userId">
          <FieldLabel required help={FIELD_HELP.userId}>
            Customer Name
          </FieldLabel>
          <Form.Select {...register('userId')} isInvalid={Boolean(errors.userId)}>
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

      <Form.Group as={Col} md={6} controlId="clientele-clientCode">
        <FieldLabel required help={FIELD_HELP.clientCode}>
          Client ID
        </FieldLabel>
        <Form.Control {...register('clientCode')} autoComplete="off" maxLength={MAX_LENGTH.clientCode} isInvalid={Boolean(errors.clientCode)} />
        <Form.Control.Feedback type="invalid">{errors.clientCode?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group as={Col} md={6} controlId="clientele-name">
        <Form.Label className="required">Client Name</Form.Label>
        <Form.Control {...register('name')} autoComplete="off" maxLength={MAX_LENGTH.name} isInvalid={Boolean(errors.name)} />
        <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group as={Col} md={6} controlId="clientele-email">
        <Form.Label>Client Email</Form.Label>
        <Form.Control {...register('email')} type="email" autoComplete="off" maxLength={MAX_LENGTH.email} isInvalid={Boolean(errors.email)} />
        <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group as={Col} md={6} controlId="clientele-contactNumber">
        <FieldLabel required help={FIELD_HELP.contactNumber}>
          Contact Number
        </FieldLabel>
        <InputGroup hasValidation>
          <InputGroup.Text>{getDialCode(countryCode)}</InputGroup.Text>
          <Form.Control
            {...register('contactNumber')}
            type="tel"
            autoComplete="off"
            placeholder="98765 43210"
            isInvalid={Boolean(errors.contactNumber)}
          />
          <Form.Control.Feedback type="invalid">{errors.contactNumber?.message}</Form.Control.Feedback>
        </InputGroup>
      </Form.Group>

      <Form.Group as={Col} xs={12} controlId="clientele-address">
        <Form.Label className="required">Address</Form.Label>
        <Form.Control {...register('address')} autoComplete="off" maxLength={MAX_LENGTH.address} isInvalid={Boolean(errors.address)} />
        <Form.Control.Feedback type="invalid">{errors.address?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group as={Col} md={4} controlId="clientele-countryCode">
        <Form.Label className="required">Country</Form.Label>
        <Form.Select {...register('countryCode', { onChange: () => setValue('stateCode', '') })} isInvalid={Boolean(errors.countryCode)}>
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </Form.Select>
        <Form.Control.Feedback type="invalid">{errors.countryCode?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group as={Col} md={4} controlId="clientele-stateCode">
        <Form.Label className="required">State</Form.Label>
        {/* Controlled: the options change with the country, so the saved state shows once they exist */}
        <Controller
          name="stateCode"
          control={control}
          render={({ field }) => (
            <Form.Select {...field} isInvalid={Boolean(errors.stateCode)}>
              <option value="">Select State</option>
              {states.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </Form.Select>
          )}
        />
        <Form.Control.Feedback type="invalid">{errors.stateCode?.message}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group as={Col} md={4} controlId="clientele-city">
        <Form.Label className="required">City</Form.Label>
        <Form.Control {...register('city')} autoComplete="off" maxLength={MAX_LENGTH.city} isInvalid={Boolean(errors.city)} />
        <Form.Control.Feedback type="invalid">{errors.city?.message}</Form.Control.Feedback>
      </Form.Group>

      {isEdit && (
        <Form.Group as={Col} md={6}>
          <Form.Label className="required">Status</Form.Label>
          <StatusToggle
            id="clientele-status"
            {...register('status')}
            activeValue={CLIENTELE_STATUS.ACTIVE}
            inactiveValue={CLIENTELE_STATUS.INACTIVE}
          />
        </Form.Group>
      )}
    </Row>
  )

  const renderBody = () => {
    if (loadError) {
      return (
        <Alert variant="danger" className="mb-0">
          <b>Could not load this clientele.</b> {loadError}
        </Alert>
      )
    }
    if (!ready) return <Loader text={recordLoading ? 'Loading clientele…' : 'Loading options…'} />
    return renderFields()
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} size="lg" centered scrollable backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit clientele' : 'Add clientele'} className="ts-modal-form">
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Clientele' : 'Add Clientele'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>{renderBody()}</Modal.Body>

        <Modal.Footer>
          <span className="me-auto small text-body-secondary">
            Fields marked <span className="text-danger">*</span> are required.
          </span>
          <Button variant="ghost" onClick={onHide} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !ready}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />
                Saving…
              </>
            ) : (
              <>
                <i className="bi bi-check2 me-2" aria-hidden="true" />
                {isEdit ? 'Update Clientele' : 'Save Clientele'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

ClienteleFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  clienteleId: PropTypes.number,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default ClienteleFormModal
