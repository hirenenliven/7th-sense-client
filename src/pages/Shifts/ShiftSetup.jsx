import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, Col, Form, Row } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import { CUSTOMER_ROLE_ID, MANAGERS, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import useAuth from '@/hooks/useAuth'
import { getUsers } from '@/services/customerService'
import { deleteShift, getShifts } from '@/services/shiftService'
import { toast } from '@/utils/toast'
import ShiftCard from './ShiftCard'
import ShiftFormModal from './ShiftFormModal'

// Masters › Shifts › Shift Setup: the shift cards. The superadmin works on every customer's shifts
// (filter by customer); everyone else sees their company's. Managers (superadmin, customer, admin)
// add (Add Shift) and edit (a card's Edit) in the Shift modal, and delete.
function ShiftSetup() {
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
      .catch((err) => active && toast.error(err.message, { title: 'Could not load customers' }))
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
      toast.success(`${pendingDelete.name} has been deleted.`, { title: 'Shift deleted' })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not delete shift' })
    } finally {
      setDeleting(false)
    }
  }

  const renderCards = () => {
    if (loading) return <Loader text="Loading shifts…" />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load shifts.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }

    if (!visible.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-calendar3 ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">{shifts.length ? 'No shifts for this customer.' : 'No shifts yet.'}</p>
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
          <div className="ts-eyebrow">Masters · Shifts</div>
          <h1>Shift Setup</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? 'Every customer’s shifts, their working days and breaks.' : 'Your shifts, their working days and breaks.'}
          </p>
        </div>
        {(canManage || (isSuperadmin && filterOptions.length > 0)) && (
          <div className="ts-page-actions">
            {isSuperadmin && filterOptions.length > 0 && (
              <Form.Select value={customerFilter} onChange={(event) => setCustomerFilter(event.target.value)} aria-label="Filter shifts by customer">
                <option value="">All customers</option>
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
                Add Shift
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
        title="Delete shift"
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        Delete shift <strong>{pendingDelete?.name}</strong>? Its breaks stay in the customer's break list.
      </ConfirmModal>
    </>
  )
}

export default ShiftSetup
