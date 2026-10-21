import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import { CUSTOMER_ROLE_ID, MANAGERS, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import useAuth from '@/hooks/useAuth'
import { getUsers } from '@/services/customerService'
import { deleteShift, getShifts } from '@/services/shiftService'
import i18n from '@/i18n'
import { toast } from '@/utils/toast'
import ShiftCard from './ShiftCard'
import ShiftFormModal from './ShiftFormModal'
import { Trans, useTranslation } from 'react-i18next'

// Masters › Shifts › Shift Setup: the shift cards. The superadmin works on every customer's shifts
// (filter by customer); everyone else sees their company's. Managers (superadmin, customer, admin)
// add (Add Shift) and edit (a card's Edit) in the Shift modal, and delete.
function ShiftSetup() {
  const { t } = useTranslation()
  const { user, hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)
  const ownCompanyId = user?.role === ROLES.CUSTOMER ? user.id : user?.companyId

  const [shifts, setShifts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [customers, setCustomers] = useState([])
  const [customerFilter, setCustomerFilter] = useState('')

  // Add / Edit Shift modal: `editing` is the shift being edited (null = adding)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getShifts()
      .then((list) => active && setShifts(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  // Superadmin: customers for the form and the filter
  useEffect(() => {
    if (!isSuperadmin) return undefined
    let active = true
    getUsers()
      .then((users) => active && setCustomers(users.filter((option) => option.roleId === CUSTOMER_ROLE_ID)))
      .catch((err) => active && toast.error(err.message, { title: i18n.t('Could not load customers') }))
    return () => {
      active = false
    }
  }, [isSuperadmin])

  const visible = useMemo(
    () => (customerFilter ? shifts.filter((shift) => String(shift.userId) === customerFilter) : shifts),
    [shifts, customerFilter],
  )

  // Customers that have shifts, for the filter
  const filterOptions = useMemo(() => {
    const byId = new Map()
    shifts.forEach((shift) => byId.set(shift.userId, shift.customerName || `Customer #${shift.userId}`))
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [shifts])

  const handleSaved = useCallback((saved, wasEdit) => {
    setShifts((list) => (wasEdit ? list.map((shift) => (shift.id === saved.id ? saved : shift)) : [...list, saved]))
    setShowForm(false)
  }, [])

  const handleAdd = () => {
    setEditing(null)
    setShowForm(true)
  }

  const handleEdit = useCallback((shift) => {
    setEditing(shift)
    setShowForm(true)
  }, [])

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteShift(pendingDelete.id)
      setShifts((list) => list.filter((shift) => shift.id !== pendingDelete.id))
      toast.success(t('{{name}} has been deleted.', { name: pendingDelete.name }), { title: t('Shift deleted') })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t('Could not delete shift') })
    } finally {
      setDeleting(false)
    }
  }

  const renderCards = () => {
    if (loading) return <Loader text={t('Loading shifts…')} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t('Could not load shifts.')}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
          </Button>
        </Alert>
      )
    }

    if (!visible.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-calendar3 ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">{shifts.length ? t('No shifts for this customer.') : t('No shifts yet.')}</p>
        </div>
      )
    }

    return (
      <Row xs={1} lg={2} xxl={3} className="g-3">
        {visible.map((shift, index) => (
          <Col key={shift.id}>
            <ShiftCard
              shift={shift}
              number={index + 1}
              showCustomer={isSuperadmin}
              canManage={canManage}
              isEditing={showForm && editing?.id === shift.id}
              onEdit={handleEdit}
              onDelete={setPendingDelete}
            />
          </Col>
        ))}
      </Row>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Masters · Shifts')}</div>
          <h1>{t('Shift Setup')}</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? t('Every customer’s shifts, their working days and breaks.') : t('Your shifts, their working days and breaks.')}
          </p>
        </div>
        {(canManage || (isSuperadmin && filterOptions.length > 0)) && (
          <div className="ts-page-actions">
            {isSuperadmin && filterOptions.length > 0 && (
              <Form.Select value={customerFilter} onChange={(event) => setCustomerFilter(event.target.value)} aria-label={t('Filter shifts by customer')}>
                <option value="">{t('All customers')}</option>
                {filterOptions.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </Form.Select>
            )}
            {canManage && (
              <Button onClick={handleAdd} disabled={loading || Boolean(error)}>
                <i className="bi bi-plus-lg me-2" aria-hidden="true" />
                {t('Add Shift')}
              </Button>
            )}
          </div>
        )}
      </header>

      {renderCards()}

      {canManage && (
        <ShiftFormModal
          show={showForm}
          shift={editing}
          customers={customers}
          canPickCustomer={isSuperadmin}
          ownCompanyId={ownCompanyId}
          onSaved={handleSaved}
          onHide={() => setShowForm(false)}
        />
      )}

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={t('Delete shift')}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <Trans
          i18nKey="Delete shift <b>{{name}}</b>? Its breaks stay in the customer's break list."
          values={{ name: pendingDelete?.name }}
          components={{ b: <strong /> }}
        />
      </ConfirmModal>
    </>
  )
}

export default ShiftSetup
