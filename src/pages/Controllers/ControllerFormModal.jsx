import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import FieldLabel from '@/components/common/FieldLabel'
import { createController, updateController } from '@/services/catalogService'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, MAX_LENGTH, controllerSchema, toControllerPayload, toFormValues } from './controllerForm'
import { FIELD_HELP } from './controllerHelp'

// Add / edit a controller: its brand, name (variant included, e.g. Sinumerik 828D) and description.
// `controller` = the controller being edited, null when adding.
function ControllerFormModal({ show, controller, brands, defaultBrandId, onSaved, onHide }) {
  const isEdit = Boolean(controller)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(controllerSchema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset(controller ? toFormValues(controller) : { ...INITIAL_VALUES, brandId: defaultBrandId })
  }, [show, controller, defaultBrandId, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toControllerPayload(values)
      const saved = isEdit ? await updateController(controller.id, payload) : await createController(payload)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, {
        title: isEdit ? 'Controller updated' : 'Controller added',
      })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save controller' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit controller' : 'Add controller'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Controller' : 'Add Controller'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="controller-brand" className="mb-3">
            <FieldLabel required>Brand</FieldLabel>
            <Form.Select {...register('brandId')} isInvalid={Boolean(errors.brandId)}>
              <option value="">Select brand</option>
              {brands.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.brandId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="controller-name" className="mb-3">
            <FieldLabel required help={FIELD_HELP.name}>
              Controller Name
            </FieldLabel>
            <Form.Control {...register('name')} maxLength={MAX_LENGTH.name} autoComplete="off" autoFocus isInvalid={Boolean(errors.name)} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="controller-description">
            <FieldLabel>Description</FieldLabel>
            <Form.Control
              as="textarea"
              rows={3}
              {...register('description')}
              maxLength={MAX_LENGTH.description}
              isInvalid={Boolean(errors.description)}
            />
            <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
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

ControllerFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  controller: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    brandId: PropTypes.number,
    description: PropTypes.string,
  }),
  brands: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  defaultBrandId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default ControllerFormModal
