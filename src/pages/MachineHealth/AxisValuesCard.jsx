import { memo, useCallback, useMemo, useState } from 'react'
import { Button, ButtonGroup, Col, Form, Row } from 'react-bootstrap'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import LineTrendChart from '@/components/charts/LineTrendChart'
import useLoad from '@/hooks/useLoad'
import { getAxisValues } from '@/services/machineHealthService'
import {
  AXIS_DECIMALS,
  AXIS_MAX_RAW_VALUES,
  AXIS_MIN_ZOOM_MS,
  AXIS_RANGES,
  AXIS_REFRESH_MAX_MINUTES,
  AXIS_REFRESH_MS,
  AXIS_SETS,
  DEFAULT_AXIS_RANGE,
  DEFAULT_AXIS_SET,
  axisRows,
  formatCount,
  formatMs,
  zoomedOut,
} from './axisValues'
import { formatTimestamp, formatValue, tickFormatter } from './healthSensors'

const EMPTY_AXES = ['X', 'Y', 'Z'].map((axis) => ({ axis, rows: [], series: [{ key: 'value', label: `${axis} axis` }] }))

// Loads the axis values and times the whole round trip (request, server, network, JSON), so the
// card can show it beside the server's own database time
const loadTimed = async (machineId, query) => {
  const started = performance.now()
  const data = await getAxisValues(machineId, query)
  return { ...data, totalMs: performance.now() - started }
}

// Machine Health › Axis Values: X, Y and Z of one axis set (machine position by default) as three
// step charts, with the range buttons and how long the data took: stored rows read, points drawn,
// database time and total time. Every stored value is drawn while an axis holds at most
// AXIS_MAX_RAW_VALUES in the range. Drag across a chart to zoom all three into that window: the
// window is loaded again from the server, so zooming into a grouped range shows every value.
function AxisValuesCard({ machineId }) {
  const [axisSet, setAxisSet] = useState(DEFAULT_AXIS_SET)
  const [rangeKey, setRangeKey] = useState(DEFAULT_AXIS_RANGE)
  // { start, end } in ms while zoomed into part of the range; null = the whole range
  const [zoom, setZoom] = useState(null)
  const range = AXIS_RANGES.find((option) => option.key === rangeKey)
  const rangeMs = range.minutes * 60_000

  const query = zoom
    ? { axisSet, start: new Date(zoom.start).toISOString(), end: new Date(zoom.end).toISOString() }
    : { axisSet, minutes: range.minutes }
  const state = useLoad(() => loadTimed(machineId, query), `${machineId}|${JSON.stringify(query)}`, {
    // A zoomed window is fixed in time; short ranges follow the clock
    refreshMs: !zoom && range.minutes <= AXIS_REFRESH_MAX_MINUTES ? AXIS_REFRESH_MS : undefined,
  })
  const values = state.data
  const charts = useMemo(
    () =>
      (values?.axes ?? []).map((axis) => ({
        ...axis,
        rows: axisRows(axis, values.from, values.to),
        series: [{ key: 'value', label: `${axis.axis} axis` }],
      })),
    [values],
  )
  const formatTick = tickFormatter(zoom ? zoom.end - zoom.start : rangeMs)

  const pickRange = (key) => {
    setRangeKey(key)
    setZoom(null)
  }
  const zoomTo = useCallback((start, end) => {
    if (end - start >= AXIS_MIN_ZOOM_MS) setZoom({ start, end })
  }, [])

  const emptyText = () => {
    if (state.loading) return 'Loading…'
    if (state.error) return state.error
    return 'No readings in this range.'
  }

  const renderStats = () => {
    if (!values) return <span>{state.loading ? 'Loading…' : state.error}</span>
    return (
      <>
        <span>
          <b className="font-tabular">{formatCount(values.stats.rowsRead)}</b> stored rows →{' '}
          <b className="font-tabular">{formatCount(values.stats.pointCount)}</b> points
        </span>
        <span>
          Database <b className="font-tabular">{formatMs(values.stats.queryMs)}</b>
        </span>
        <span>
          Total <b className="font-tabular">{formatMs(values.totalMs)}</b> (request, network, server)
        </span>
        {values.raw ? (
          <span className="text-body-secondary">Every stored value</span>
        ) : (
          <span className="text-body-secondary">
            Over {formatCount(AXIS_MAX_RAW_VALUES)} values per axis: 1 point = last value of {formatCount(values.bucketSec)} s. Drag
            across a chart to zoom in and see every value.
          </span>
        )}
      </>
    )
  }

  return (
    <ChartCard
      title="Axis Values (X, Y, Z)"
      subtitle={`Step line · live machine_telementry${values ? ` · ${values.axisLabel}` : ''}`}
      icon="bi-arrows-move"
      actions={
        <Form.Select size="sm" className="w-auto" value={axisSet} onChange={(event) => setAxisSet(event.target.value)} aria-label="Axis set">
          {AXIS_SETS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      }
    >
      <div className="d-flex flex-wrap align-items-center gap-3 mb-2">
        <div className="ts-chart-reading-meta" aria-live="polite">
          {renderStats()}
        </div>
        <div className="ts-chart-range ms-md-auto">
          <ButtonGroup size="sm" aria-label="Axis values time range">
            {AXIS_RANGES.map((option) => (
              <Button
                key={option.key}
                variant="ghost"
                active={!zoom && option.key === rangeKey}
                aria-pressed={!zoom && option.key === rangeKey}
                onClick={() => pickRange(option.key)}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-3 small">
        {zoom ? (
          <>
            <i className="bi bi-zoom-in text-primary" aria-hidden="true" />
            <span>
              Zoomed: <b className="font-tabular">{formatTimestamp(zoom.start)}</b> – <b className="font-tabular">{formatTimestamp(zoom.end)}</b>
            </span>
            <Button size="sm" variant="ghost" onClick={() => setZoom(zoomedOut(zoom, rangeMs))}>
              <i className="bi bi-zoom-out me-1" aria-hidden="true" />
              Zoom out
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setZoom(null)}>
              <i className="bi bi-arrow-counterclockwise me-1" aria-hidden="true" />
              Reset zoom
            </Button>
          </>
        ) : (
          <span className="text-body-secondary">
            <i className="bi bi-cursor me-1" aria-hidden="true" />
            Drag across a chart to zoom into that time (all three charts follow).
          </span>
        )}
      </div>

      <Row xs={1} xl={3} className="g-3">
        {(charts.length ? charts : EMPTY_AXES).map((chart) => (
          <Col key={chart.axis}>
            <h3 className="ts-section-title h6 mb-2">
              {chart.axis} axis
              {chart.name && <small className="text-body-secondary fw-normal"> · {chart.name}</small>}
            </h3>
            <LineTrendChart
              data={chart.rows}
              series={chart.series}
              xType="time"
              xTickFormatter={formatTick}
              yDomain={['auto', 'auto']}
              yUnit={chart.unit || undefined}
              valueFormatter={(value) => `${formatValue(value, AXIS_DECIMALS)}${chart.unit ? ` ${chart.unit}` : ''}`}
              labelFormatter={formatTimestamp}
              curve="stepAfter"
              onSelectRange={zoomTo}
              emptyText={emptyText()}
            />
          </Col>
        ))}
      </Row>
    </ChartCard>
  )
}

AxisValuesCard.propTypes = {
  machineId: PropTypes.number.isRequired,
}

export default memo(AxisValuesCard)
