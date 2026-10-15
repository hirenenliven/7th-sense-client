import { useCallback, useMemo, useState } from 'react'

export const SORT_DIR = { ASC: 'asc', DESC: 'desc' }

const isBlank = (value) => value === null || value === undefined || value === ''

// Numbers by value; anything else as text, case-insensitive and with digits read as numbers ("Line 2" < "Line 10")
const compareValues = (a, b) =>
  typeof a === 'number' && typeof b === 'number'
    ? a - b
    : String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })

// Column sorting for a table (used with components/common/SortableHead.jsx).
// columns: the table's columns, each a label string (not sortable, e.g. Actions) or
// { label, sort: (row) => value } (sortable by that value). A header click sorts descending, then
// ascending, then back to the list's own order. Blank values always go last; equal values keep
// their order. onSortChange runs after each change (e.g. back to page 1).
function useTableSort(rows, columns, onSortChange) {
  const [sort, setSort] = useState({ key: null, dir: SORT_DIR.ASC })

  const accessor = columns.find((column) => typeof column === 'object' && column.label === sort.key)?.sort

  const sortedRows = useMemo(() => {
    if (!accessor) return rows
    const factor = sort.dir === SORT_DIR.ASC ? 1 : -1
    return rows
      .map((row, index) => ({ row, index, value: accessor(row) }))
      .sort((a, b) => {
        const aBlank = isBlank(a.value)
        const bBlank = isBlank(b.value)
        if (aBlank || bBlank) return aBlank === bBlank ? a.index - b.index : aBlank ? 1 : -1
        return compareValues(a.value, b.value) * factor || a.index - b.index
      })
      .map((entry) => entry.row)
  }, [rows, accessor, sort.dir])

  const onSort = useCallback(
    (key) => {
      setSort((current) => {
        if (current.key !== key) return { key, dir: SORT_DIR.DESC }
        if (current.dir === SORT_DIR.DESC) return { key, dir: SORT_DIR.ASC }
        return { key: null, dir: SORT_DIR.ASC }
      })
      onSortChange?.()
    },
    [onSortChange],
  )

  return { sortedRows, sort, onSort }
}

export default useTableSort
