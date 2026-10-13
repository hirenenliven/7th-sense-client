import { useState } from 'react'
import { Button, Form, Pagination } from 'react-bootstrap'
import PropTypes from 'prop-types'

const MAX_PAGE_BUTTONS = 5

// Page numbers to show: a window of MAX_PAGE_BUTTONS around the current page
const pageWindow = (page, pageCount) => {
  const start = Math.max(1, Math.min(page - Math.floor(MAX_PAGE_BUTTONS / 2), pageCount - MAX_PAGE_BUTTONS + 1))
  const end = Math.min(pageCount, start + MAX_PAGE_BUTTONS - 1)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
}

// List footer: "Showing 1 to 10 of 42 entries" · page buttons · "Go to page"
function TablePagination({ page, pageSize, totalCount, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
  const first = totalCount ? (page - 1) * pageSize + 1 : 0
  const last = Math.min(page * pageSize, totalCount)
  const [jumpTo, setJumpTo] = useState('')

  const goTo = (target) => onPageChange(Math.min(Math.max(1, target), pageCount))

  const handleJump = (event) => {
    event.preventDefault()
    const target = Number(jumpTo)
    if (Number.isInteger(target) && target > 0) goTo(target)
    setJumpTo('')
  }

  return (
    <div className="ts-table-footer">
      <span className="fs-sm text-body-secondary">
        Showing {first} to {last} of {totalCount} entries
      </span>

      <Pagination size="sm" className="mb-0">
        <Pagination.Prev onClick={() => goTo(page - 1)} disabled={page === 1} aria-label="Previous page" />
        {pageWindow(page, pageCount).map((number) => (
          <Pagination.Item key={number} active={number === page} onClick={() => goTo(number)}>
            {number}
          </Pagination.Item>
        ))}
        <Pagination.Next onClick={() => goTo(page + 1)} disabled={page === pageCount} aria-label="Next page" />
      </Pagination>

      <Form className="ts-page-jump" onSubmit={handleJump}>
        <Form.Label htmlFor="ts-page-jump" className="mb-0 fs-sm text-body-secondary text-nowrap">
          Go to page
        </Form.Label>
        <Form.Control
          id="ts-page-jump"
          size="sm"
          type="number"
          min={1}
          max={pageCount}
          placeholder={String(page)}
          value={jumpTo}
          onChange={(event) => setJumpTo(event.target.value)}
        />
        <Button type="submit" variant="plain" size="sm" className="btn-icon" aria-label="Go to page">
          <i className="bi bi-caret-right-fill" aria-hidden="true" />
        </Button>
      </Form>
    </div>
  )
}

TablePagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
}

export default TablePagination
