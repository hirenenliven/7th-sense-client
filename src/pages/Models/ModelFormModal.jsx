import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import FieldLabel from '@/components/common/FieldLabel'
import { createModel, updateModel } from '@/services/catalogService'
import { toast } from '@/utils/toast'
import ControllerOptions from './ControllerOptions'
import { INITIAL_VALUES, NAME_MAX_LENGTH, modelSchema, toFormValues, toModelPayload } from './modelForm'
import { FIELD_HELP } from './modelHelp'

// Add / edit a machine model: its controller and name. `model` = the model being edited, null when adding.
function ModelFormModal({ show, model, controllers, defaultControllerId, onSaved, onHide }) {
  const isEdit = Boolean(model)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(modelSchema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset(model ? toFormValues(model) : { ...INITIAL_VALUES, controllerId: defaultControllerId })
  }, [show, model, defaultControllerId, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toModelPayload(values)
      const saved = isEdit ? await updateModel(model.id, payload) : await createModel(payload)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: isEdit ? 'Model updated' : 'Model added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save model' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit model' : 'Add model'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Model' : 'Add Model'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="model-controller" className="mb-3">
            <FieldLabel required>Controller</FieldLabel>
            <Form.Select {...register('controllerId')} isInvalid={Boolean(errors.controllerId)}>
              <option value="">Select controller</option>
              <ControllerOptions controllers={controllers} />
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.controllerId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="model-name">
            <FieldLabel required help={FIELD_HELP.name}>
              Model Name
            </FieldLabel>
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

ModelFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  model: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    controllerId: PropTypes.number,
  }),
  controllers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      brandName: PropTypes.string,
    }),
  ).isRequired,
  defaultControllerId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default ModelFormModal
