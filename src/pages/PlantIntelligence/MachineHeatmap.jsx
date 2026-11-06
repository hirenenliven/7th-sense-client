import { useMemo, useState } from 'react'
import { ButtonGroup, Button, Form, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import { NoResults } from '@/components/common/TableNoResults'
import { UNKNOWN_MODE_COLOR, modeTypeOf } from '@/constants/machines'
import { machineMonitorPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import { scoreTone } from '@/pages/Home/homeSettings'
import { formatCount, percent } from '@/pages/Productivity/productivitySettings'
import { dayLabel, weekdayLabel } from './intelligenceSettings'

const CYCLE_LEVELS = 4

const scoreText = (value) => {
  if (value == null) return ''
  return value > 0 && value < 1 ? '<1' : String(Math.round(value))
}

// A score of 0 is a machine that did not run, not a low score: it stays neutral
const scoreClass = (value) => {
  if (value == null) return ''
  return value === 0 ? 'ts-int-cell-zero' : `ts-tone-${scoreTone(value)} ts-int-cell-score`
}

// What a cell shows. `summary` is the Period column of the row; machines sort worst first on a score
// and most first on cycles.
const METRICS = [
  {
    key: 'availability',
    label: 'Availability',
    unit: '%',
    value: (row) => row?.availability ?? null,
    summary: (machine) => machine.availabilityAverage,
    summaryText: (machine) => percent(machine.availabilityAverage),
    ascending: true,
  },
  {
    key: 'oee',
    label: 'OEE',
    unit: '%',
    value: (row) => row?.oee ?? null,
    summary: (machine) => machine.oeeAverage,
    summaryText: (machine) => percent(machine.oeeAverage),
    ascending: true,
  },
  {
    key: 'cycles',
    label: 'Cycles',
    unit: '',
    value: (row) => row?.completedCount ?? null,
    summary: (machine) => machine.completed,
    summaryText: (machine) => formatCount(machine.completed),
    ascending: false,
  },
]

const cellTitle = (machine, date, row) => {
  if (!row) return `${machine.machineName}, ${dayLabel(date)}: no data`
  return [
    `${machine.machineName}, ${dayLabel(date)}`,
    `Availability ${percent(row.availability)}`,
    `OEE ${percent(row.oee)}`,
    `Cycles ${formatCount(row.completedCount)} completed, ${formatCount(row.unfinishedCount)} unfinished`,
  ].join('\n')
}

// Every machine against every day of the period: which machines lag, on which days, and whether it is
// one bad day or a pattern. Worst first; machines that did not run stay out of the way until asked for.
function MachineHeatmap({ machines, dates, lineOf, showCustomer }) {
  const [metricKey, setMetricKey] = useState(METRICS[0].key)
  const [search, setSearch] = useState('')
  const [line, setLine] = useState('')
  const [showSilent, setShowSilent] = useState(false)
  const metric = METRICS.find((item) => item.key === metricKey)

  const lines = useMemo(() => [...new Set(machines.map((machine) => lineOf.get(machine.machineId)).filter(Boolean))].sort(), [machines, lineOf])
  const silentCount = machines.filter((machine) => !machine.ran).length
  const term = search.trim().toLowerCase()

  const rows = useMemo(() => {
    const direction = metric.ascending ? 1 : -1
    return machines
      .filter((machine) => showSilent || machine.ran)
      .filter((machine) => !line || lineOf.get(machine.machineId) === line)
      .filter((machine) => !term || [machine.machineName, machine.customerName, lineOf.get(machine.machineId)].some((text) => text?.toLowerCase().includes(term)))
      .sort((a, b) => {
        const first = metric.summary(a)
        const second = metric.summary(b)
        // Machines without a value go last whatever the direction
        if (first == null || second == null) return (first == null) - (second == null)
        return (first - second) * direction
      })
  }, [machines, metric, showSilent, line, term, lineOf])

  // Cycle cells darken with the count, against the busiest cell shown
  const busiest = useMemo(
    () => Math.max(1, ...rows.flatMap((machine) => [...machine.cells.values()].map((row) => row.completedCount))),
    [rows],
  )
  const cellClass = (value) => {
    if (metric.key !== 'cycles') return scoreClass(value)
    if (value == null) return ''
    return value === 0 ? 'ts-int-cell-zero' : `ts-int-level-${Math.ceil((value / busiest) * CYCLE_LEVELS)}`
  }
  const clearFilters = () => {
    setSearch('')
    setLine('')
  }

  return (
    <ChartCard
      title="Machines by day"
      subtitle={`Each machine's ${metric.label.toLowerCase()} per day · ${metric.ascending ? 'lowest' : 'most'} first · hover a cell for the day, open a machine for its detail`}
      icon="bi-grid-3x3"
      actions={
        <ButtonGroup size="sm" aria-label="Metric">
          {METRICS.map((item) => (
            <Button key={item.key} variant={item.key === metricKey ? 'primary' : 'ghost'} aria-pressed={item.key === metricKey} onClick={() => setMetricKey(item.key)}>
              {item.label}
            </Button>
          ))}
        </ButtonGroup>
      }
    >
      <div className="ts-toolbar">
        <InputGroup className="ts-ops-search w-auto">
          <Form.Control type="search" placeholder="Search machine…" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search machines" />
          <InputGroup.Text>
            <i className="bi bi-search" aria-hidden="true" />
          </InputGroup.Text>
        </InputGroup>
        {lines.length > 0 && (
          <Form.Select className="w-auto" value={line} onChange={(event) => setLine(event.target.value)} aria-label="Line">
            <option value="">All lines</option>
            {lines.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Form.Select>
        )}
        {silentCount > 0 && (
          <Form.Check
            type="switch"
            id="heatmap-show-silent"
            className="mb-0 align-self-center"
            checked={showSilent}
            onChange={(event) => setShowSilent(event.target.checked)}
            label={`Show ${formatCount(silentCount)} that did not run`}
          />
        )}
      </div>

      {rows.length ? (
        <div className="ts-int-heat-scroll">
          <table className="ts-int-heat">
            <thead>
              <tr>
                <th scope="col" className="ts-int-heat-name">Machine</th>
                <th scope="col" className="ts-int-heat-summary">Period{metric.unit ? ' avg' : ''}</th>
                {dates.map((date) => (
                  <th key={date} scope="col" className="ts-int-heat-day">
                    <span className="d-block">{weekdayLabel(date)}</span>
                    <span className="d-block fw-normal text-body-secondary">{dayLabel(date)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((machine) => {
                const mode = modeTypeOf(machine.modeId)
                const lineName = lineOf.get(machine.machineId)
                return (
                  <tr key={machine.machineId}>
                    <th scope="row" className="ts-int-heat-name">
                      <Link to={machineMonitorPath(ROUTES.MACHINE_PRODUCTIVITY, { id: machine.machineId })} className="d-block text-truncate">
                        <svg className="me-1" width="8" height="8" viewBox="0 0 8 8" role="img" aria-label={`Now: ${mode?.label ?? 'awaiting data'}`}>
                          <circle cx="4" cy="4" r="4" fill={mode?.color ?? UNKNOWN_MODE_COLOR} />
                        </svg>
                        {machine.machineName}
                      </Link>
                      <span className="d-block small fw-normal text-body-secondary text-truncate">
                        {[showCustomer && machine.customerName, lineName].filter(Boolean).join(' · ') || 'No line'}
                      </span>
                    </th>
                    <td className="ts-int-heat-summary font-tabular">{metric.summaryText(machine)}</td>
                    {dates.map((date) => {
                      const row = machine.cells.get(date)
                      const value = metric.value(row)
                      return (
                        <td key={date} className={`ts-int-cell font-tabular ${cellClass(value)}`} title={cellTitle(machine, date, row)}>
                          {metric.key === 'cycles' ? (value == null ? '' : formatCount(value)) : scoreText(value)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <NoResults message={silentCount && !showSilent && !term && !line ? 'No machine ran in this period.' : 'No machine matches these filters.'} onClear={term || line ? clearFilters : undefined} />
      )}

      {metric.key !== 'cycles' && (
        <div className="ts-int-heat-legend small text-body-secondary">
          <span className="ts-tone-good"><i className="ts-dot" aria-hidden="true" /> 85% and up</span>
          <span className="ts-tone-warning"><i className="ts-dot" aria-hidden="true" /> 60–85%</span>
          <span className="ts-tone-critical"><i className="ts-dot" aria-hidden="true" /> Below 60%</span>
          <span>0 = did not run · blank = no value</span>
        </div>
      )}
    </ChartCard>
  )
}

MachineHeatmap.propTypes = {
  machines: PropTypes.arrayOf(PropTypes.object).isRequired,
  dates: PropTypes.arrayOf(PropTypes.string).isRequired,
  lineOf: PropTypes.instanceOf(Map).isRequired,
  showCustomer: PropTypes.bool.isRequired,
}

export default MachineHeatmap
