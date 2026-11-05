import { useMemo, useState } from 'react'
import { Alert, Button, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import Loader from '@/components/common/Loader'
import SortableHead from '@/components/common/SortableHead'
import TablePagination from '@/components/common/TablePagination'
import TableNoResults, { NoResults } from '@/components/common/TableNoResults'
import { PAGE_SIZES, SUPERADMIN_ONLY } from '@/constants/app'
import useAuth from '@/hooks/useAuth'
import useTableSort from '@/hooks/useTableSort'
import { modeTypeOf } from '@/constants/machines'
import { newestFirst } from '@/utils/helpers'
import MachineCard from './MachineCard'
import MachineRow from './MachineRow'

// With the mode shown (`withMode`), its label ("In Production", "Idle"…) is searched too
const matchesSearch = (machine, term, withMode) =>
  [
    machine.id,
    machine.name,
    machine.serialNumber,
    machine.customerName,
    machine.modelName,
    machine.brandName,
    machine.controllerName,
    machine.lineName,
    withMode ? modeTypeOf(machine.modeId)?.label : null,
  ].some((value) => String(value ?? '').toLowerCase().includes(term))

// The machine list shared by All Machines (set-up: Edit / Delete) and Monitoring › Machines
// (Productivity / Health): search, customer filter (superadmin), sortable table or cards, paging.
// The page passes what each machine offers: `rowActions` (table; none = no Actions column),
// `cardActions` (card header) and `cardFooter`, or its own card (`renderCard(machine, showCustomer)`).
// `showMode` adds the Mode column (the mode the machine is in now). A page can also bring its own
// table: `tableColumns(showCustomer)` (useTableSort columns) with `renderRow(machine, showCustomer,
// actions)`. The card view's frame is flattened by the theme (.ts-table-panel:has(> .row)), so the
// cards are the only framed surface. `initialSearch` opens it with the search filled in (Monitoring's
// `?search=`); `onSearchChange(text)` hears every change of the search box.
function MachineBrowser({
  machines,
  loading,
  error,
  onRetry,
  view,
  empty,
  rowActions,
  cardActions,
  cardFooter,
  renderCard,
  tableColumns,
  renderRow,
  showMode = false,
  initialSearch = '',
  onSearchChange,
}) {
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)

  const [search, setSearchText] = useState(initialSearch)
  const [customerFilter, setCustomerFilter] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [page, setPage] = useState(1)

  const setSearch = (text) => {
    setSearchText(text)
    onSearchChange?.(text)
  }

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
        (!customerFilter || String(machine.userId) === customerFilter) && (!term || matchesSearch(machine, term, showMode)),
    )
  }, [machines, search, customerFilter, showMode])
  // Latest entry first (a row just added shows on top)
  const filtered = useMemo(() => newestFirst(matched), [matched])

  // Stay on a valid page when the list shrinks (search, filter, delete)
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const columns = tableColumns?.(isSuperadmin) ?? [
    { label: 'ID', sort: (row) => row.id },
    { label: 'Machine', sort: (row) => row.name },
    ...(isSuperadmin ? [{ label: 'Customer', sort: (row) => row.customerName }] : []),
    { label: 'Model', sort: (row) => row.modelName },
    { label: 'Brand / Controller', sort: (row) => [row.brandName, row.controllerName].filter(Boolean).join(' ') },
    { label: 'Line', sort: (row) => row.lineName },
    { label: 'Installed', sort: (row) => row.installationDate },
    ...(showMode ? [{ label: 'Mode', sort: (row) => modeTypeOf(row.modeId)?.label ?? '' }] : []),
    { label: 'Connection', sort: (row) => (row.onlineStatus ? 1 : 0) },
    { label: 'Status', sort: (row) => row.status },
    ...(rowActions ? ['Actions'] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // No results: Clear filters goes back to the whole list
  const noResults = 'No machines match these filters.'
  const clearFilters = () => {
    setSearch('')
    setCustomerFilter('')
    setPage(1)
  }

  if (loading) return <Loader text="Loading machines…" />

  if (error) {
    return (
      <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
        <span className="me-auto">
          <b>Could not load machines.</b> {error}
        </span>
        <Button variant="ghost" size="sm" onClick={onRetry}>
          <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
          Retry
        </Button>
      </Alert>
    )
  }

  if (!machines.length) return empty

  return (
    <>
      <div className="ts-toolbar">
        <InputGroup className="flex-grow-1 w-auto">
          <Form.Control
            type="search"
            placeholder={showMode ? 'Search ID, machine, mode, customer, model…' : 'Search ID, machine, serial no., customer, model…'}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            aria-label="Search machines"
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
            aria-label="Filter by customer"
          >
            <option value="">All customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Form.Select>
        )}
      </div>

      <div className="ts-table-panel">
        {view === 'cards' && !pageRows.length && <NoResults message={noResults} onClear={clearFilters} />}
        {view === 'cards' && pageRows.length > 0 && (
          <Row xs={1} md={2} xxl={3} className="g-3">
            {pageRows.map((machine) => (
              <Col key={machine.id}>
                {renderCard ? (
                  renderCard(machine, isSuperadmin)
                ) : (
                  <MachineCard
                    machine={machine}
                    showCustomer={isSuperadmin}
                    actions={cardActions?.(machine)}
                    footer={cardFooter?.(machine)}
                  />
                )}
              </Col>
            ))}
          </Row>
        )}
        {view !== 'cards' && (
          <Table hover responsive className="mb-0">
            <SortableHead columns={columns} sort={sort} onSort={onSort} />
            <tbody>
              {pageRows.map((machine) =>
                renderRow ? (
                  renderRow(machine, isSuperadmin, rowActions?.(machine))
                ) : (
                  <MachineRow
                    key={machine.id}
                    machine={machine}
                    showCustomer={isSuperadmin}
                    showMode={showMode}
                    actions={rowActions?.(machine)}
                  />
                ),
              )}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message={noResults} onClear={clearFilters} />
              )}
            </tbody>
          </Table>
        )}
        {filtered.length > 0 && (
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
        )}
      </div>
    </>
  )
}

MachineBrowser.propTypes = {
  machines: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  empty: PropTypes.node.isRequired,
  rowActions: PropTypes.func,
  cardActions: PropTypes.func,
  cardFooter: PropTypes.func,
  renderCard: PropTypes.func,
  tableColumns: PropTypes.func,
  renderRow: PropTypes.func,
  showMode: PropTypes.bool,
  initialSearch: PropTypes.string,
  onSearchChange: PropTypes.func,
}

export default MachineBrowser
