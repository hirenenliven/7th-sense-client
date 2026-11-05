import { useMemo } from 'react'
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import SortableHead from '@/components/common/SortableHead'
import { UNKNOWN_MODE_COLOR, modeTypeOf } from '@/constants/machines'
import { machineMonitorPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import useTableSort from '@/hooks/useTableSort'
import { MachineOee } from '@/pages/Monitoring/MachineMetrics'
import { formatCount } from '@/pages/Productivity/productivitySettings'
import { PICKER_LOCALE, formatModeDuration } from '@/utils/dateTime'
import {
  ATTENTION_LIMIT,
  ATTENTION_MINUTES,
  ATTENTION_MODE_IDS,
  LOWEST_OEE_LIMIT,
  secondsInMode,
} from './homeSettings'

const timeLabel = new Intl.DateTimeFormat(PICKER_LOCALE, { hour: '2-digit', minute: '2-digit' })

// Short top-N tables of the Home page (at most ten rows, so no paging): sortable headers, the
// list's own ranking until a header is clicked
function HomeTable({ columns, rows, renderRow, emptyText }) {
  const { sortedRows, sort, onSort } = useTableSort(rows, columns)
  if (!rows.length) return <div className="ts-empty">{emptyText}</div>
  return (
    <div className="ts-table-panel">
      <Table responsive size="sm" className="mb-0">
        <SortableHead columns={columns} sort={sort} onSort={onSort} />
        <tbody>{sortedRows.map(renderRow)}</tbody>
      </Table>
    </div>
  )
}

HomeTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  renderRow: PropTypes.func.isRequired,
  emptyText: PropTypes.string.isRequired,
}

// Machine name linking to its Productivity tab; the customer under it for the superadmin
function MachineCell({ machine, showCustomer }) {
  return (
    <td>
      <Link to={machineMonitorPath(ROUTES.MACHINE_PRODUCTIVITY, { id: machine.machineId })}>{machine.machineName}</Link>
      {showCustomer && <div className="small text-body-secondary">{machine.customerName || '—'}</div>}
    </td>
  )
}

MachineCell.propTypes = { machine: PropTypes.object.isRequired, showCustomer: PropTypes.bool.isRequired }

function ModeCell({ modeId }) {
  const mode = modeTypeOf(modeId)
  return (
    <td>
      <svg className="me-1" width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
        <circle cx="4" cy="4" r="4" fill={mode?.color ?? UNKNOWN_MODE_COLOR} />
      </svg>
      {mode?.label ?? '—'}
    </td>
  )
}

ModeCell.propTypes = { modeId: PropTypes.number }

// Machines stuck in Downtime or Hold for ATTENTION_MINUTES or more, longest first
export function AttentionCard({ machines, serverTime, showCustomer }) {
  const rows = useMemo(
    () =>
      machines
        .filter((machine) => ATTENTION_MODE_IDS.includes(machine.modeId))
        .map((machine) => ({ ...machine, stuckSec: secondsInMode(machine, serverTime) }))
        .filter((machine) => machine.stuckSec >= ATTENTION_MINUTES * 60)
        .sort((a, b) => b.stuckSec - a.stuckSec)
        .slice(0, ATTENTION_LIMIT),
    [machines, serverTime],
  )
  const columns = [
    { label: 'Machine', sort: (row) => row.machineName },
    { label: 'Mode', sort: (row) => modeTypeOf(row.modeId)?.label },
    { label: 'For', sort: (row) => row.stuckSec },
  ]

  return (
    <ChartCard title="Needs attention" subtitle={`Live · in Downtime or Hold for ${ATTENTION_MINUTES} min or more`} icon="bi-exclamation-triangle">
      <HomeTable
        columns={columns}
        rows={rows}
        emptyText={`No machine has been in Downtime or Hold for ${ATTENTION_MINUTES} minutes.`}
        renderRow={(machine) => (
          <tr key={machine.machineId}>
            <MachineCell machine={machine} showCustomer={showCustomer} />
            <ModeCell modeId={machine.modeId} />
            <td className="font-tabular">{formatModeDuration(machine.stuckSec)}</td>
          </tr>
        )}
      />
    </ChartCard>
  )
}

AttentionCard.propTypes = {
  machines: PropTypes.arrayOf(PropTypes.object).isRequired,
  serverTime: PropTypes.string.isRequired,
  showCustomer: PropTypes.bool.isRequired,
}

// The machines with the lowest OEE of the day (those with an OEE), lowest first
export function LowestOeeCard({ machines, showCustomer }) {
  const rows = useMemo(
    () => machines.filter((machine) => machine.oee != null).sort((a, b) => a.oee - b.oee).slice(0, LOWEST_OEE_LIMIT),
    [machines],
  )
  const columns = [
    { label: 'Machine', sort: (row) => row.machineName },
    { label: 'OEE', sort: (row) => row.oee },
    { label: 'Parts', sort: (row) => row.partsMade },
  ]

  return (
    <ChartCard title="Lowest OEE" subtitle={`The ${LOWEST_OEE_LIMIT} machines with the lowest OEE · A · P · Q underneath`} icon="bi-sort-down">
      <HomeTable
        columns={columns}
        rows={rows}
        emptyText="No machine has an OEE for this day yet."
        renderRow={(machine) => (
          <tr key={machine.machineId}>
            <MachineCell machine={machine} showCustomer={showCustomer} />
            <td>
              <MachineOee summary={machine} />
            </td>
            <td className="font-tabular">
              {formatCount(machine.partsMade)}
              {machine.plannedQuantity != null && (
                <span className="text-body-secondary"> / {formatCount(machine.plannedQuantity)}</span>
              )}
            </td>
          </tr>
        )}
      />
    </ChartCard>
  )
}

LowestOeeCard.propTypes = {
  machines: PropTypes.arrayOf(PropTypes.object).isRequired,
  showCustomer: PropTypes.bool.isRequired,
}

// The alarm codes raised most often in the day
export function AlarmsCard({ alarms }) {
  const columns = [
    { label: 'Code', sort: (row) => row.code },
    { label: 'Message', sort: (row) => row.message },
    { label: 'Raised', sort: (row) => row.count },
    { label: 'Machines', sort: (row) => row.machineCount },
    { label: 'Last', sort: (row) => row.lastAt },
  ]

  return (
    <ChartCard title="Top alarms" subtitle="Alarm codes raised most often in the day (controller alarms)" icon="bi-bell">
      <HomeTable
        columns={columns}
        rows={alarms}
        emptyText="No alarm raised on this day."
        renderRow={(alarm) => (
          <tr key={alarm.code}>
            <td className="font-monospace">{alarm.code}</td>
            <td>{alarm.message || '—'}</td>
            <td className="font-tabular">{formatCount(alarm.count)}</td>
            <td className="font-tabular">{formatCount(alarm.machineCount)}</td>
            <td className="font-tabular">{timeLabel.format(new Date(alarm.lastAt))}</td>
          </tr>
        )}
      />
    </ChartCard>
  )
}

AlarmsCard.propTypes = { alarms: PropTypes.arrayOf(PropTypes.object).isRequired }
