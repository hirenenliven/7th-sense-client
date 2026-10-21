import { useId, useState } from 'react'
import { Form, Pagination } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { PAGE_SIZES } from '@/constants/app'

// Up to this many pages every number is shown; above it, first · … · neighbours · … · last
const MAX_PLAIN_PAGES = 7

// Page numbers to show, with 'gap' where pages are skipped: 1 … 4 5 6 … 12
const pageItems = (page, pageCount) => {
  if (pageCount <= MAX_PLAIN_PAGES) return Array.from({ length: pageCount }, (_, index) => index + 1)

  // Always 7 slots, so the bar keeps its width while paging
  const range = (from, to) => Array.from({ length: to - from + 1 }, (_, index) => from + index)
  if (page <= 4) return [...range(1, 5), 'gap-end', pageCount]
  if (page >= pageCount - 3) return [1, 'gap-start', ...range(pageCount - 4, pageCount)]
  return [1, 'gap-start', page - 1, page, page + 1, 'gap-end', pageCount]
}

// Footer for a .ts-table-panel, placed right after the <Table>:
// rows per page · "1–10 of 42" | ‹ 1 … 4 5 6 … 12 › · go to page
function TablePagination({ page, pageSize, totalCount, onPageChange, onPageSizeChange, pageSizes = PAGE_SIZES }) {
  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))
  const first = totalCount ? (page - 1) * pageSize + 1 : 0
  const last = Math.min(page * pageSize, totalCount)
  const [jumpTo, setJumpTo] = useState('')
  const { t } = useTranslation()
  const id = useId()

  const goTo = (target) => onPageChange(Math.min(Math.max(1, target), pageCount))

  const handleJump = (event) => {
    event.preventDefault()
    const target = Number(jumpTo)
    if (Number.isInteger(target) && target > 0) goTo(target)
    setJumpTo('')
  }

  return (
    <div className="ts-table-footer">
      <div className="ts-table-footer-info">
        {onPageSizeChange && (
          <div className="ts-page-size">
            <Form.Label htmlFor={`${id}-size`} className="mb-0 d-none d-sm-inline">
              {t('Rows per page')}
            </Form.Label>
            <Form.Select
              id={`${id}-size`}
              size="sm"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
              aria-label={t('Rows per page')}
            >
              {pageSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </Form.Select>
          </div>
        )}
        <span className="font-tabular" aria-live="polite">
          <span className="text-body">
            {first}–{last}
          </span>{' '}
          {t('of {{total}}', { total: totalCount })}
        </span>
      </div>

      {pageCount > 1 && (
        <div className="ts-table-footer-nav">
          <nav aria-label={t('Pagination')}>
            <Pagination size="sm" className="ts-pager">
              <Pagination.Prev onClick={() => goTo(page - 1)} disabled={page === 1} aria-label={t('Previous page')}>
                <i className="bi bi-chevron-left" aria-hidden="true" />
              </Pagination.Prev>
              {pageItems(page, pageCount).map((item) =>
                typeof item === 'number' ? (
                  <Pagination.Item
                    key={item}
                    className="d-none d-sm-block"
                    active={item === page}
                    onClick={() => goTo(item)}
                    aria-label={t('Page {{page}}', { page: item })}
                  >
                    {item}
                  </Pagination.Item>
                ) : (
                  <Pagination.Ellipsis key={item} className="d-none d-sm-block" disabled />
                ),
              )}
              <li className="ts-pager-status d-sm-none font-tabular">
                {t('Page {{page}} of {{pages}}', { page, pages: pageCount })}
              </li>
              <Pagination.Next onClick={() => goTo(page + 1)} disabled={page === pageCount} aria-label={t('Next page')}>
                <i className="bi bi-chevron-right" aria-hidden="true" />
              </Pagination.Next>
            </Pagination>
          </nav>

          {pageCount > MAX_PLAIN_PAGES && (
            <Form className="ts-page-jump d-none d-md-flex" onSubmit={handleJump}>
              <Form.Label htmlFor={`${id}-jump`} className="mb-0 text-nowrap">
                {t('Go to')}
              </Form.Label>
              <Form.Control
                id={`${id}-jump`}
                size="sm"
                type="number"
                inputMode="numeric"
                min={1}
                max={pageCount}
                placeholder={String(page)}
                value={jumpTo}
                onChange={(event) => setJumpTo(event.target.value)}
                aria-label={t('Go to page (1 to {{pages}})', { pages: pageCount })}
              />
            </Form>
          )}
        </div>
      )}
    </div>
  )
}

TablePagination.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  // Shows the rows-per-page select when given
  onPageSizeChange: PropTypes.func,
  pageSizes: PropTypes.arrayOf(PropTypes.number),
}

export default TablePagination
