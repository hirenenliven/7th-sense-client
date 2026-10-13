import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserLine, updateUserLine } from '@/services/userLineService'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, lineSchema, toLinePayload, toFormValues } from './lineForm'

// Add / edit a line: its shop and name. `line` = the line being edited, null when adding.
function LineFormModal({ show, line, shops, defaultShopId, onSaved, onHide }) {
  const isEdit = Boolean(line)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(lineSchema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset(line ? toFormValues(line) : { ...INITIAL_VALUES, userShopId: defaultShopId })
  }, [show, line, defaultShopId, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toLinePayload(values)
      const saved = isEdit ? await updateUserLine(line.id, payload) : await createUserLine(payload)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: isEdit ? 'Line updated' : 'Line added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save line' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit line' : 'Add line'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Line' : 'Add Line'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="line-shop" className="mb-3">
            <Form.Label className="required">Shop</Form.Label>
            <Form.Select {...register('userShopId')} isInvalid={Boolean(errors.userShopId)}>
              <option value="">Select shop</option>
              {shops.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.locationName ? `${option.name} · ${option.locationName}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userShopId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="line-name">
            <Form.Label className="required">Line Name</Form.Label>
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

LineFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  line: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    userShopId: PropTypes.number,
  }),
  shops: PropTypes.arrayOf(recordShape).isRequired,
  defaultShopId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default LineFormModal
