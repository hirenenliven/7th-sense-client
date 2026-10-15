import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserCell, updateUserCell } from '@/services/userCellService'
import OrgCustomerField from '@/components/common/OrgCustomerField'
import useOrgUser from '@/hooks/useOrgUser'
import { ownedBy, ownerOf, withCustomer } from '@/utils/orgCustomer'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, cellSchema, toCellPayload, toFormValues } from './cellForm'

// Add / edit a cell: its line and name. `cell` = the cell being edited, null when adding.
function CellFormModal({ show, cell, lines, defaultLineId, onSaved, onHide }) {
  const isEdit = Boolean(cell)

  // The superadmin picks the customer on the form; others always save to their own company
  const { canPickUser, userId } = useOrgUser()
  const schema = useMemo(() => withCustomer(cellSchema, canPickUser), [canPickUser])

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
      cell
        ? { ...toFormValues(cell), customerId: String(cell.userId) }
        : { ...INITIAL_VALUES, customerId: ownerOf(lines, defaultLineId, 'userId'), userLineId: defaultLineId },
    )
  }, [show, cell, defaultLineId, lines, reset])

  // Parents of the picked customer only; a new customer clears the picked parent
  const customerId = watch('customerId')
  const parentOptions = useMemo(() => ownedBy(lines, canPickUser, customerId, 'userId'), [lines, canPickUser, customerId])

  const onSubmit = async (values) => {
    try {
      const ownerId = canPickUser ? values.customerId : userId
      const payload = toCellPayload(values)
      const saved = isEdit ? await updateUserCell(cell.id, payload, ownerId) : await createUserCell(payload, ownerId)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: isEdit ? 'Cell updated' : 'Cell added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save cell' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit cell' : 'Add cell'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Cell' : 'Add Cell'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgCustomerField
            id="cell-customer"
            registration={register('customerId', { onChange: () => setValue('userLineId', '') })}
            locked={isEdit}
            disabled={isSubmitting}
            error={errors.customerId?.message}
          />
          <Form.Group controlId="cell-line" className="mb-3">
            <Form.Label className="required">Line</Form.Label>
            <Form.Select {...register('userLineId')} isInvalid={Boolean(errors.userLineId)}>
              <option value="">Select line</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.shopName ? `${option.name} · ${option.shopName}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userLineId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="cell-name">
            <Form.Label className="required">Cell Name</Form.Label>
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

CellFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  cell: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    userLineId: PropTypes.number,
  }),
  lines: PropTypes.arrayOf(recordShape).isRequired,
  defaultLineId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default CellFormModal
