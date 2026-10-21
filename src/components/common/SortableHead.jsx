import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { SORT_DIR } from '@/hooks/useTableSort'

const ARIA_SORT = { [SORT_DIR.ASC]: 'ascending', [SORT_DIR.DESC]: 'descending' }

// <thead> of a list table with sortable columns (state from hooks/useTableSort.js). A column is a
// label string (plain header, e.g. Actions) or { label, sort } (a header button that sorts).
// Labels arrive translated (t('Client Name') in the page's columns).
function SortableHead({ columns, sort, onSort }) {
  const { t } = useTranslation()
  return (
    <thead>
      <tr>
        {columns.map((column) => {
          if (typeof column === 'string' || !column.sort) {
            const label = typeof column === 'string' ? column : column.label
            return (
              <th key={label} scope="col">
                {label}
              </th>
            )
          }

          const active = sort.key === column.label
          // The sorted column shows its direction; another shows ↓ on hover (a click sorts descending first)
          const icon = active && sort.dir === SORT_DIR.ASC ? 'bi-arrow-up' : 'bi-arrow-down'
          return (
            <th key={column.label} scope="col" aria-sort={active ? ARIA_SORT[sort.dir] : 'none'}>
              <button
                type="button"
                className={`ts-sort-btn${active ? ' is-active' : ''}`}
                onClick={() => onSort(column.label)}
                title={t('Sort by {{column}}', { column: column.label })}
              >
                {column.label}
                <i className={`bi ${icon} ts-sort-icon`} aria-hidden="true" />
              </button>
            </th>
          )
        })}
      </tr>
    </thead>
  )
}

SortableHead.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ label: PropTypes.string.isRequired, sort: PropTypes.func })]),
  ).isRequired,
  sort: PropTypes.shape({ key: PropTypes.string, dir: PropTypes.oneOf(Object.values(SORT_DIR)) }).isRequired,
  onSort: PropTypes.func.isRequired,
}

export default SortableHead
