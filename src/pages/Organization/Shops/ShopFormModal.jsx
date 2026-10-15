import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Form, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { createUserShop, updateUserShop } from '@/services/userShopService'
import OrgCustomerField from '@/components/common/OrgCustomerField'
import useOrgUser from '@/hooks/useOrgUser'
import { ownedBy, ownerOf, withCustomer } from '@/utils/orgCustomer'
import { toast } from '@/utils/toast'
import { INITIAL_VALUES, NAME_MAX_LENGTH, shopSchema, toShopPayload, toFormValues } from './shopForm'

// Add / edit a shop: its location and name. `shop` = the shop being edited, null when adding.
function ShopFormModal({ show, shop, locations, defaultLocationId, onSaved, onHide }) {
  const isEdit = Boolean(shop)

  // The superadmin picks the customer on the form; others always save to their own company
  const { canPickUser, userId } = useOrgUser()
  const schema = useMemo(() => withCustomer(shopSchema, canPickUser), [canPickUser])

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
      shop
        ? { ...toFormValues(shop), customerId: String(shop.userId) }
        : { ...INITIAL_VALUES, customerId: ownerOf(locations, defaultLocationId, 'userId'), userLocationId: defaultLocationId },
    )
  }, [show, shop, defaultLocationId, locations, reset])

  // Parents of the picked customer only; a new customer clears the picked parent
  const customerId = watch('customerId')
  const parentOptions = useMemo(() => ownedBy(locations, canPickUser, customerId, 'userId'), [locations, canPickUser, customerId])

  const onSubmit = async (values) => {
    try {
      const ownerId = canPickUser ? values.customerId : userId
      const payload = toShopPayload(values)
      const saved = isEdit ? await updateUserShop(shop.id, payload, ownerId) : await createUserShop(payload, ownerId)
      toast.success(`${saved.name} has been ${isEdit ? 'updated' : 'added'}.`, { title: isEdit ? 'Shop updated' : 'Shop added' })
      onSaved(saved)
    } catch (error) {
      toast.error(error.message, { title: 'Could not save shop' })
    }
  }

  return (
    <Modal show={show} onHide={isSubmitting ? undefined : onHide} centered backdrop={isSubmitting ? 'static' : true}>
      <Form noValidate onSubmit={handleSubmit(onSubmit)} aria-label={isEdit ? 'Edit shop' : 'Add shop'}>
        <Modal.Header closeButton={!isSubmitting}>
          <Modal.Title>{isEdit ? 'Edit Shop' : 'Add Shop'}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <OrgCustomerField
            id="shop-customer"
            registration={register('customerId', { onChange: () => setValue('userLocationId', '') })}
            locked={isEdit}
            disabled={isSubmitting}
            error={errors.customerId?.message}
          />
          <Form.Group controlId="shop-location" className="mb-3">
            <Form.Label className="required">Location</Form.Label>
            <Form.Select {...register('userLocationId')} isInvalid={Boolean(errors.userLocationId)}>
              <option value="">Select location</option>
              {parentOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.branchName ? `${option.name} · ${option.branchName}` : option.name}
                </option>
              ))}
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.userLocationId?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="shop-name">
            <Form.Label className="required">Shop Name</Form.Label>
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

ShopFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  shop: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    userLocationId: PropTypes.number,
  }),
  locations: PropTypes.arrayOf(recordShape).isRequired,
  defaultLocationId: PropTypes.string,
  onSaved: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
}

export default ShopFormModal
