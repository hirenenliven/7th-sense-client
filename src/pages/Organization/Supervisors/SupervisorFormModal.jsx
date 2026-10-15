import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserSupervisor, updateUserSupervisor } from '@/services/userSupervisorService'
import OrgCustomerField from '@/components/common/OrgCustomerField'
import useOrgUser from '@/hooks/useOrgUser'
import { ownedBy, ownerOf, withCustomer } from '@/utils/orgCustomer'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, supervisorSchema, toSupervisorPayload, toFormValues } from './supervisorForm'

// Add / edit a supervisor: its cell and name. `supervisor` = the supervisor being edited, null when adding.
function SupervisorFormModal({ show, supervisor, cells, defaultCellId, onSaved, onHide }) {
  const isEdit = Boolean(supervisor)

  // The superadmin picks the customer on the form; others always save to their own company
  const { canPickUser, userId } = useOrgUser()
  const schema = useMemo(() => withCustomer(supervisorSchema, canPickUser), [canPickUser])

  const {
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

  // Fresh values every time the modal opens
  useEffect(() => {
    if (!show) return
    reset(
      supervisor
        ? { ...toFormValues(supervisor), customerId: String(supervisor.userId) }
        : { ...INITIAL_VALUES, customerId: ownerOf(cells, defaultCellId, 'userId'), userCellId: defaultCellId },
    )
  }, [show, supervisor, defaultCellId, cells, reset])

  // Parents of the picked customer only; a new customer clears the picked parent
  const customerId = watch('customerId')
  const parentOptions = useMemo(() => ownedBy(cells, canPickUser, customerId, 'userId'), [cells, canPickUser, customerId])

  const onSubmit = async (values) => {
    try {
      const ownerId = canPickUser ? values.customerId : userId
      const payload = toSupervisorPayload(values)
      const saved = isEdit ? await updateUserSupervisor(supervisor.id, payload, ownerId) : await createUserSupervisor(payload, ownerId)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: isEdit ? 'Supervisor updated' : 'Supervisor added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save supervisor' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit supervisor' : 'Add supervisor'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Supervisor' : 'Add Supervisor'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgCustomerField
            id="supervisor-customer"
            registration={register('customerId', { onChange: () => setValue('userCellId', '') })}
            locked={isEdit}
            disabled={isSubmitting}
            error={errors.customerId?.message}
          />
          <Form.Group controlId="supervisor-cell" className="mb-3">
            <Form.Label className="required">Cell</Form.Label>
            <Form.Select {...register('userCellId')} isInvalid={Boolean(errors.userCellId)}>
              <option value="">Select cell</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.lineName ? `${option.name} · ${option.lineName}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userCellId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="supervisor-name">
            <Form.Label className="required">Supervisor Name</Form.Label>
            <Form.Control {...register('name')} maxLength={NAME_MAX_LENGTH} autoComplete="off" autoFocus isInvalid={Boolean(errors.name)} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="ghost" onClick={onHide} disabled={isSubmitting}>
            Cancel
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
                {isEdit ? 'Update' : 'Save'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

const recordShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
})

SupervisorFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  supervisor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    userCellId: PropTypes.number,
  }),
  cells: PropTypes.arrayOf(recordShape).isRequired,
  defaultCellId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default SupervisorFormModal
