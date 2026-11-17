import { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Card, Col, Form, InputGroup, Row, Table } from 'react-bootstrap'
import DatePicker from '@/components/common/DatePicker'
import Loader from '@/components/common/Loader'
import SortableHead from '@/components/common/SortableHead'
import TableNoResults from '@/components/common/TableNoResults'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES, ROLES, SUPERADMIN_ONLY } from '@/constants/app'
import useAuth from '@/hooks/useAuth'
import useOrgUser from '@/hooks/useOrgUser'
import useTableSort from '@/hooks/useTableSort'
import { getUsers } from '@/services/customerService'
import { getOperatorJobs } from '@/services/productionScheduleService'
import { customerName } from '@/pages/Customers/customerFormat'
import OperatorJobRow from './OperatorJobRow'
import { EMPTY_FILTERS, filterOptions, machineLabel, matchesSearch, partLabel } from './operatorScheduleSettings'

// The filter selects: key in the filters, label, option list key, "all" text
const SELECT_FILTERS = [
  { key: 'machineId', label: 'Machine', options: 'machines', placeholder: 'All machines' },
  { key: 'partId', label: 'Part', options: 'parts', placeholder: 'All parts' },
  { key: 'operatorId', label: 'Operator', options: 'operators', placeholder: 'All operators' },
  { key: 'shiftId', label: 'Shift', options: 'shifts', placeholder: 'All shifts' },
]

// Production › Operator Wise: every scheduled job as one row, to see who runs what, when and on
// which machine. Filters are sent to the server on Search (GET /production-schedules/operator-jobs);
// the search box narrows the shown rows. The superadmin picks a customer (Customer column), everyone
// else sees their company's jobs. Read only, for every role.
function OperatorSchedule() {
  const { hasRole } = useAuth()
  const isSuperadmin = hasRole(SUPERADMIN_ONLY)
  const { customerLabel } = useOrgUser()

  // `draft` is what the filter form shows; `applied` what the table was loaded with (Search)
  const [draft, setDraft] = useState(EMPTY_FILTERS)
  const [applied, setApplied] = useState(EMPTY_FILTERS)

  const [customers, setCustomers] = useState([])
  // The customer's jobs without filters: the source of the Machine / Part / Operator / Shift options
  const [optionJobs, setOptionJobs] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [currentPageNo, setPage] = useState(1)

  useEffect(() => {
    if (!isSuperadmin) return undefined
    let active = true
    getUsers({ filterRole: ROLES.CUSTOMER })
      .then((list) => active && setCustomers(list))
      .catch(() => active && setCustomers([]))
    return () => {
      active = false
    }
  }, [isSuperadmin])

  // Options follow the customer picked in the form (same request as an unfiltered load: shared)
  useEffect(() => {
    let active = true
    getOperatorJobs({ userId: draft.userId })
      .then((list) => active && setOptionJobs(list))
      .catch(() => active && setOptionJobs([]))
    return () => {
      active = false
    }
  }, [draft.userId])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getOperatorJobs(applied)
      .then((list) => active && setJobs(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [applied, reloadKey])

  const options = useMemo(() => filterOptions(optionJobs), [optionJobs])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return term ? jobs.filter((job) => matchesSearch(job, term)) : jobs
  }, [jobs, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(currentPageNo, pageCount)
  // Rows keep the server's order (latest day first, then as they run) until a column is sorted
  const columns = [
    'Sr. No.',
    { label: 'Date', sort: (row) => row.scheduleDate },
    { label: 'Operator', sort: (row) => row.operatorName },
    { label: 'Shift', sort: (row) => row.shiftName },
    { label: 'Job ID', sort: (row) => row.jobId },
    { label: 'Qty.', sort: (row) => row.quantity },
    { label: 'Machine', sort: machineLabel },
    { label: 'Period', sort: (row) => row.startTime },
    { label: 'Part', sort: partLabel },
    { label: 'Program', sort: (row) => row.programName },
    ...(isSuperadmin ? [{ label: 'Customer', sort: (row) => customerLabel(row.userId) }] : []),
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const firstIndex = (currentPage - 1) * pageSize
  const pageRows = sortedRows.slice(firstIndex, firstIndex + pageSize)

  const setFilter = (key, value) => setDraft((current) => ({ ...current, [key]: value }))

  // A new customer has other machines, parts, operators and shifts
  const changeCustomer = (userId) => setDraft({ ...EMPTY_FILTERS, userId, date: draft.date })

  const applyFilters = (event) => {
    event.preventDefault()
    setApplied(draft)
    setPage(1)
  }

  const resetFilters = () => {
    setDraft(EMPTY_FILTERS)
    setApplied(EMPTY_FILTERS)
    setSearch('')
    setPage(1)
  }

  const activeFilterCount = Object.values(applied).filter(Boolean).length

  const renderTable = () => {
    if (loading) return <Loader text="Loading jobs…" />
    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load the schedule.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }
    if (!jobs.length && !activeFilterCount) {
      return (
        <div className="ts-empty">
          <i className="bi bi-person-gear ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">No jobs are scheduled yet. Jobs added under Production › Schedule show here.</p>
        </div>
      )
    }
    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder="Search operator, job ID, machine, part, program…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search jobs"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
        </div>

        <div className="ts-table-panel">
          <Table hover responsive className="mb-0">
            <SortableHead columns={columns} sort={sort} onSort={onSort} />
            <tbody>
              {pageRows.map((job, index) => (
                <OperatorJobRow
                  key={job.itemId}
                  job={job}
                  serialNo={firstIndex + index + 1}
                  showCustomer={isSuperadmin}
                  customerLabel={customerLabel}
                />
              ))}
              {!pageRows.length && (
                <TableNoResults colSpan={columns.length} message="No jobs match these filters." onClear={resetFilters} />
              )}
            </tbody>
          </Table>
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

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Production</div>
          <h1>Operator Wise Production Schedule</h1>
          <p className="ts-page-subtitle">Who runs which job, when and on which machine — every scheduled job, one row each.</p>
        </div>
      </header>

      <Card className="mb-4">
        <Card.Header>
          <i className="bi bi-funnel text-primary" aria-hidden="true" />
          Filters
          {activeFilterCount > 0 && <span className="ms-auto small text-body-secondary">{activeFilterCount} applied</span>}
        </Card.Header>
        <Card.Body>
          <Form noValidate onSubmit={applyFilters} aria-label="Filter jobs">
            <Row className="g-3 align-items-end">
              {isSuperadmin && (
                <Form.Group as={Col} sm={6} lg={4} xxl={3} controlId="operator-schedule-customer">
                  <Form.Label>Customer</Form.Label>
                  <Form.Select value={draft.userId} onChange={(event) => changeCustomer(event.target.value)}>
                    <option value="">All customers</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customerName(customer)}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              {SELECT_FILTERS.map((filter) => (
                <Form.Group key={filter.key} as={Col} sm={6} lg={4} xxl={3} controlId={`operator-schedule-${filter.key}`}>
                  <Form.Label>{filter.label}</Form.Label>
                  <Form.Select value={draft[filter.key]} onChange={(event) => setFilter(filter.key, event.target.value)}>
                    <option value="">{filter.placeholder}</option>
                    {options[filter.options].map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              ))}
              <Form.Group as={Col} sm={6} lg={4} xxl={3} controlId="operator-schedule-date">
                <Form.Label>Date of schedule</Form.Label>
                <DatePicker id="operator-schedule-date" value={draft.date} onChange={(value) => setFilter('date', value)} />
              </Form.Group>
              <Col xs="auto" className="d-flex gap-2">
                <Button type="submit">
                  <i className="bi bi-search me-2" aria-hidden="true" />
                  Search
                </Button>
                <Button variant="ghost" onClick={resetFilters} aria-label="Reset filters" title="Reset filters">
                  <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {renderTable()}
    </>
  )
}

export default OperatorSchedule
