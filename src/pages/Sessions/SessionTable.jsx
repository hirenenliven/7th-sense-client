import { useMemo, useState } from 'react'
import { Badge, Form, InputGroup, Table } from 'react-bootstrap'
import PropTypes from 'prop-types'
import IconAction from '@/components/common/IconAction'
import SortableHead from '@/components/common/SortableHead'
import TablePagination from '@/components/common/TablePagination'
import TableNoResults from '@/components/common/TableNoResults'
import { PAGE_SIZES } from '@/constants/app'
import { ACTION_ICONS } from '@/constants/icons'
import { formatSessionTime } from '@/constants/session'
import useTableSort from '@/hooks/useTableSort'

const matchesSearch = (session, term) =>
  [session.device, session.ipAddress].some((value) => String(value ?? '').toLowerCase().includes(term))

// Active login sessions as a sortable table (My sessions, and a user's sessions for the superadmin).
// Sessions come most recently used first from the server. `customerLabel` (superadmin) adds the
// Customer column; `adminView` replaces Current with the session type (password / log in as) and
// lets every row be logged out. The current session is never logged out here: that is Log out.
function SessionTable({ sessions, adminView = false, customerLabel, onRevoke }) {
  const [search, setSearch] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [currentPageNo, setPage] = useState(1)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return term ? sessions.filter((session) => matchesSearch(session, term)) : sessions
  }, [sessions, search])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(currentPageNo, pageCount)
  const columns = [
    { label: 'Device', sort: (row) => row.device },
    { label: 'IP', sort: (row) => row.ipAddress },
    { label: 'Signed in', sort: (row) => row.createdAt },
    { label: 'Last active', sort: (row) => row.lastUsedAt },
    adminView ? { label: 'Type', sort: (row) => (row.isLoginAs ? 1 : 0) } : { label: 'Current', sort: (row) => (row.isCurrent ? 1 : 0) },
    ...(customerLabel ? [{ label: 'Customer', sort: (row) => customerLabel(row) }] : []),
    'Actions',
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const clearFilters = () => {
    setSearch('')
    setPage(1)
  }

  return (
    <>
      <div className="ts-toolbar">
        <InputGroup className="flex-grow-1 w-auto">
          <Form.Control
            type="search"
            placeholder="Search device, IP…"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            aria-label="Search sessions"
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
            {pageRows.map((session) => (
              <tr key={session.id}>
                <td className="fw-semibold">
                  <i className={`bi ${ACTION_ICONS.sessions} me-2 text-body-secondary`} aria-hidden="true" />
                  {session.device}
                </td>
                <td className="font-tabular">{session.ipAddress || '—'}</td>
                <td>{formatSessionTime(session.createdAt)}</td>
                <td>{formatSessionTime(session.lastUsedAt)}</td>
                <td>
                  {adminView && (
                    <Badge bg="" className={session.isLoginAs ? 'badge-soft-info' : 'badge-outline-muted'}>
                      {session.isLoginAs ? 'Log in as' : 'Password'}
                    </Badge>
                  )}
                  {!adminView &&
                    (session.isCurrent ? (
                      <Badge bg="" className="badge-soft-success">
                        This device
                      </Badge>
                    ) : (
                      '—'
                    ))}
                </td>
                {customerLabel && <td>{customerLabel(session)}</td>}
                <td className="border-start">
                  {(adminView || !session.isCurrent) && (
                    <IconAction danger icon={ACTION_ICONS.logout} label={`Log out ${session.device}`} onClick={() => onRevoke(session)} />
                  )}
                </td>
              </tr>
            ))}
            {!pageRows.length && <TableNoResults colSpan={columns.length} message="No sessions match this search." onClear={clearFilters} />}
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

SessionTable.propTypes = {
  sessions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      userId: PropTypes.number,
      device: PropTypes.string,
      ipAddress: PropTypes.string,
      createdAt: PropTypes.string,
      lastUsedAt: PropTypes.string,
      isCurrent: PropTypes.bool,
      isLoginAs: PropTypes.bool,
    }),
  ).isRequired,
  adminView: PropTypes.bool,
  // (session) → customer name; given only for the superadmin
  customerLabel: PropTypes.func,
  onRevoke: PropTypes.func.isRequired,
}

export default SessionTable
