import { useCallback, useEffect, useMemo, useState } from 'react'
import { Alert, Button, ButtonGroup, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import { Link, generatePath, useNavigate } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import TablePagination from '@/components/common/TablePagination'
import { MANAGERS, PAGE_SIZES, STORAGE_KEYS, SUPERADMIN_ONLY } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'
import { deleteMachine, getMachines } from '@/services/machineService'
import { readStorage, writeStorage } from '@/utils/storage'
import { toast } from '@/utils/toast'
import MachineCard from './MachineCard'
import MachineRow from './MachineRow'
import useTableSort from '@/hooks/useTableSort'
import SortableHead from '@/components/common/SortableHead'
import { newestFirst } from '@/utils/helpers'
import { Trans, useTranslation } from 'react-i18next'
import { tk } from '@/i18n/tk'

const VIEWS = [
  { key: 'table', label: tk('Table view'), icon: 'bi-list-ul' },
  { key: 'cards', label: tk('Card view'), icon: 'bi-grid-3x3-gap' },
]

// Machine Health opens on this machine (`?machineId=`)
const healthPath = (machine) => `${ROUTES.MACHINE_HEALTH}?machineId=${machine.id}`

const matchesSearch = (machine, term) =>
  [machine.id, machine.name, machine.serialNumber, machine.customerName, machine.modelName, machine.brandName, machine.controllerName, machine.lineName]
    .some((value) => String(value ?? '').toLowerCase().includes(term))

// Operations › All Machines. The superadmin sees every customer's machines (filter by customer)
// and deletes them; managers (superadmin, customer, admin) add and edit; everyone else only
// reads the machines the server returns for them.
function MachineList() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const canManage = hasRole(MANAGERS)

  const [machines, setMachines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [customerFilter, setCustomerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  // Table rows or cards; remembered per browser
  const [view, setView] = useState(() => readStorage(STORAGE_KEYS.MACHINE_VIEW, VIEWS[0].key))
  const changeView = (key) => {
    setView(key)
    writeStorage(STORAGE_KEYS.MACHINE_VIEW, key)
  }

  const [pendingDelete, setPendingDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Load the machines on open (and on Retry); the server limits non-admins to their own
  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMachines()
      .then((list) => active && setMachines(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  // Customer filter options: the customers that have machines
  const customers = useMemo(() => {
    const byId = new Map()
    machines.forEach((machine) => {
      if (machine.userId) byId.set(machine.userId, machine.customerName || `Customer #${machine.userId}`)
    })
    return [...byId].map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
  }, [machines])

  const matched = useMemo(() => {
    const term = search.trim().toLowerCase()
    return machines.filter(
      (machine) =>
        (!customerFilter || String(machine.userId) === customerFilter) && (!term || matchesSearch(machine, term)),
    )
  }, [machines, search, customerFilter])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = [
    { label: t('ID'), sort: (row) => row.id },
    { label: t('Machine'), sort: (row) => row.name },
    ...(isSuperadmin ? [{ label: t('Customer'), sort: (row) => row.customerName }] : []),
    { label: t('Model'), sort: (row) => row.modelName },
    { label: t('Brand / Controller'), sort: (row) => [row.brandName, row.controllerName].filter(Boolean).join(' ') },
    { label: t('Line'), sort: (row) => row.lineName },
    { label: t('Installed'), sort: (row) => row.installationDate },
    { label: t('Connection'), sort: (row) => (row.onlineStatus ? 1 : 0) },
    { label: t('Status'), sort: (row) => row.status },
    t('Actions'),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const handleHealth = useCallback((machine) => navigate(healthPath(machine)), [navigate])

  const handleEdit = useCallback(
    (machine) => navigate(generatePath(ROUTES.MACHINE_EDIT, { id: String(machine.id) })),
    [navigate],
  )

  const confirmDelete = async () => {
    setDeleting(true)
    try {
      await deleteMachine(pendingDelete.id)
      setMachines((list) => list.filter((machine) => machine.id !== pendingDelete.id))
      toast.success(t('{{name}} has been deleted.', { name: pendingDelete.name }), { title: t('Machine deleted') })
      setPendingDelete(null)
    } catch (err) {
      toast.error(err.message, { title: t('Could not delete machine') })
    } finally {
      setDeleting(false)
    }
  }


  const renderBody = () => {
    if (loading) return <Loader text={t('Loading machines…')} />

    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>{t('Could not load machines.')}</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            {t('Retry')}
          </Button>
        </Alert>
      )
    }

    if (!machines.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-cpu ts-empty-icon" aria-hidden="true" />
          <p className="mb-2">{t('No machines yet.')}</p>
          {canManage && (
            <Button as={Link} to={ROUTES.MACHINE_ADD} size="sm">
              {t('Add the first machine')}
            </Button>
          )}
        </div>
      )
    }

    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder={t('Search ID, machine, serial no., customer, model…')}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label={t('Search machines')}
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          {isSuperadmin && (
            <Form.Select
              className="w-auto"
              value={customerFilter}
              onChange={(event) => {
                setCustomerFilter(event.target.value)
                setPage(1)
              }}
              aria-label={t('Filter by customer')}
            >
              <option value="">{t('All customers')}</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
            </Form.Select>
          )}
        </div>

        {filtered.length ? (
          <div className="ts-table-panel">
            {view === 'cards' ? (
              <Row xs={1} md={2} xxl={3} className="g-3 p-3">
                {pageRows.map((machine) => (
                  <Col key={machine.id}>
                    <MachineCard
                      machine={machine}
                      showCustomer={isSuperadmin}
                      canEdit={canManage}
                      canDelete={isSuperadmin}
                      healthPath={healthPath(machine)}
                      onEdit={handleEdit}
                      onDelete={setPendingDelete}
                    />
                  </Col>
                ))}
              </Row>
            ) : (
              <Table hover responsive className="mb-0">
                <SortableHead columns={columns} sort={sort} onSort={onSort} />
                <tbody>
                  {pageRows.map((machine) => (
                    <MachineRow
                      key={machine.id}
                      machine={machine}
                      showCustomer={isSuperadmin}
                      canEdit={canManage}
                      canDelete={isSuperadmin}
                      onHealth={handleHealth}
                      onEdit={handleEdit}
                      onDelete={setPendingDelete}
                    />
                  ))}
                </tbody>
              </Table>
            )}
            <TablePagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={filtered.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          </div>
        ) : (
          <div className="ts-empty">{t('No machines match these filters.')}</div>
        )}
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">{t('Operations · Machines')}</div>
          <h1>{t('All Machines')}</h1>
          <p className="ts-page-subtitle">
            {isSuperadmin ? t('Every customer’s machines, their model, controller and line.') : t('Your machines, their model, controller and line.')}
          </p>
        </div>
        <div className="ts-page-actions">
          <ButtonGroup aria-label={t('Machine list view')}>
            {VIEWS.map((option) => (
              <Button
                key={option.key}
                variant="ghost"
                active={view === option.key}
                aria-pressed={view === option.key}
                title={t(option.label)}
                onClick={() => changeView(option.key)}
              >
                <i className={`bi ${option.icon}`} aria-hidden="true" />
                <span className="visually-hidden">{t(option.label)}</span>
              </Button>
            ))}
          </ButtonGroup>
          {canManage && (
            <Button as={Link} to={ROUTES.MACHINE_ADD}>
              <i className="bi bi-plus-lg me-2" aria-hidden="true" />
              {t('Add Machine')}
            </Button>
          )}
        </div>
      </header>

      <Card>
        <Card.Body>{renderBody()}</Card.Body>
      </Card>

      <ConfirmModal
        show={Boolean(pendingDelete)}
        title={t('Delete machine')}
        confirmLabel={t('Delete')}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      >
        <Trans
          i18nKey="Delete <b>{{name}}</b>? Its data will no longer be collected or shown."
          values={{ name: pendingDelete?.name }}
          components={{ b: <strong /> }}
        />
      </ConfirmModal>
    </>
  )
}

export default MachineList
