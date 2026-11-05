import PropTypes from 'prop-types'
import { modeTypeOf } from '@/constants/machines'

// Today's OEE and cycles of one machine (a row of GET /productivity/machine-summaries)
export const summaryShape = PropTypes.shape({
  availability: PropTypes.number,
  performance: PropTypes.number,
  quality: PropTypes.number,
  oee: PropTypes.number,
  cycleCount: PropTypes.number.isRequired,
  completedCount: PropTypes.number.isRequired,
  unfinishedCount: PropTypes.number.isRequired,
})

// Monitoring table columns: few and stacked so the table fits without sideways scroll (machine
// with its number and line; model with brand / controller; connection with set-up status). Today's
// OEE and cycles come from `summaries` (Map by machine id); machines without one sort last.
export const monitorColumns = (showCustomer, summaries) => [
  { label: 'Machine', sort: (row) => row.name },
  ...(showCustomer ? [{ label: 'Customer', sort: (row) => row.customerName }] : []),
  { label: 'Model', sort: (row) => [row.modelName, row.brandName, row.controllerName].filter(Boolean).join(' ') },
  { label: 'Mode', sort: (row) => modeTypeOf(row.modeId)?.label ?? '' },
  { label: 'OEE today', sort: (row) => summaries.get(row.id)?.oee ?? -1 },
  { label: 'Cycles today', sort: (row) => summaries.get(row.id)?.cycleCount ?? -1 },
  { label: 'Status', sort: (row) => (row.onlineStatus ? 1 : 0) },
  'Actions',
]
