import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import FieldLabel from '@/components/common/FieldLabel'
import { createBrand, updateBrand } from '@/services/catalogService'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, MAX_LENGTH, brandSchema, toBrandPayload, toFormValues } from './brandForm'
import { FIELD_HELP } from './brandHelp'

// Add / edit a brand: name, optional code and description.
// `brand` = the brand being edited, null when adding.
function BrandFormModal({ show, brand, onSaved, onHide }) {
  const isEdit = Boolean(brand)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(brandSchema),
    defaultValues: INITIAL_VALUES,
  })

  // Fresh values every time the modal opens
  useEffect(() => {
    if (show) reset(brand ? toFormValues(brand) : INITIAL_VALUES)
  }, [show, brand, reset])

  const onSubmit = async (values) => {
    try {
      const payload = toBrandPayload(values)
      const saved = isEdit ? await updateBrand(brand.id, payload) : await createBrand(payload)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, {
        title: isEdit ? 'Brand updated' : 'Brand added',
      })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save brand' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit brand' : 'Add brand'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Brand' : 'Add Brand'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group controlId="brand-name" className="mb-3">
            <FieldLabel required help={FIELD_HELP.name}>
              Brand Name
            </FieldLabel>
            <Form.Control {...register('name')} maxLength={MAX_LENGTH.name} autoComplete="off" autoFocus isInvalid={Boolean(errors.name)} />
            <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="brand-code" className="mb-3">
            <FieldLabel help={FIELD_HELP.code}>Code</FieldLabel>
            <Form.Control
              {...register('code')}
              maxLength={MAX_LENGTH.code}
              autoComplete="off"
              className="text-uppercase"
              isInvalid={Boolean(errors.code)}
            />
            <Form.Control.Feedback type="invalid">{errors.code?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="brand-description">
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

BrandFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  brand: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    code: PropTypes.string,
    description: PropTypes.string,
  }),
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default BrandFormModal
