import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

// "Nothing matches" inside a .ts-table-panel, so a search or filter with no hits keeps the table
// frame and its header: search icon, title, `message`, and Clear filters when `onClear` is given.
// <NoResults /> on its own (card views); <TableNoResults colSpan={columns.length} /> as the <tbody> row.
export function NoResults({ message, onClear }) {
  return (
    <div className="ts-no-results" role="status">
      <span className="ts-no-results-icon" aria-hidden="true">
        <i className="bi bi-search" />
      </span>
      <p className="ts-no-results-title">No results found</p>
      <p className="ts-no-results-text">{message}</p>
      {onClear && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <i className="bi bi-x-circle me-1" aria-hidden="true" />
          Clear filters
        </Button>
      )}
    </div>
  )
}

function TableNoResults({ colSpan, message, onClear }) {
  return (
    <tr className="ts-no-results-row">
      <td colSpan={colSpan}>
        <NoResults message={message} onClear={onClear} />
      </td>
    </tr>
  )
}

NoResults.propTypes = {
  message: PropTypes.node.isRequired,
  onClear: PropTypes.func,
}

TableNoResults.propTypes = {
  colSpan: PropTypes.number.isRequired,
  message: PropTypes.node.isRequired,
  onClear: PropTypes.func,
}

export default TableNoResults
