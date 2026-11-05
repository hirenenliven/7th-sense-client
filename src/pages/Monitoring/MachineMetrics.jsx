import { ProgressBar } from 'react-bootstrap'
import { FAIR_OEE, WORLD_CLASS_OEE, formatCount, percent } from '@/pages/Productivity/productivitySettings'
import { summaryShape } from './monitorTable'

// Today's OEE and cycles of one machine (GET /productivity/machine-summaries), for the Monitoring
// table and cards: the value with a bar beside it, its parts underneath. "—" while unknown (no
// summary yet, no planned time, no closed cycle).

const OEE_PARTS = [
  { key: 'availability', letter: 'A', label: 'Availability' },
  { key: 'performance', letter: 'P', label: 'Performance' },
  { key: 'quality', letter: 'Q', label: 'Quality' },
]

// Green from world class, amber from fair, red below
const oeeVariant = (oee) => {
  if (oee >= WORLD_CLASS_OEE) return 'success'
  if (oee >= FAIR_OEE) return 'warning'
  return 'danger'
}

const wholePercent = (value) => (value == null ? '—' : `${Math.round(value)}%`)

const NoValue = () => <span className="ts-metric-value text-body-secondary">—</span>

export function MachineOee({ summary }) {
  const oee = summary?.oee
  if (oee == null) return <NoValue />

  const variant = oeeVariant(oee)
  const hasParts = summary.availability != null
  return (
    <div className="ts-metric">
      <div className="ts-metric-head">
        <span className={`ts-metric-value font-tabular text-${variant}`}>{percent(oee)}</span>
        <ProgressBar className="ts-metric-bar" variant={variant} now={oee} aria-hidden="true" />
      </div>
      {hasParts && (
        <dl className="ts-metric-parts font-tabular">
          {OEE_PARTS.map((part) => (
            <div key={part.key} title={`${part.label} ${percent(summary[part.key])}`}>
              <dt>
                {part.letter}
                <span className="visually-hidden"> ({part.label})</span>
              </dt>
              <dd>{wholePercent(summary[part.key])}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

export function MachineCycles({ summary }) {
  if (!summary) return <NoValue />

  const { completedCount: completed, unfinishedCount: unfinished } = summary
  const closed = completed + unfinished
  const share = (count) => (closed ? (count / closed) * 100 : 0)
  return (
    <div className="ts-metric">
      <div className="ts-metric-head">
        <span className="ts-metric-value font-tabular">{formatCount(summary.cycleCount)}</span>
        <ProgressBar className="ts-metric-bar" aria-hidden="true">
          <ProgressBar variant="success" now={share(completed)} key="completed" />
          <ProgressBar variant="danger" now={share(unfinished)} key="unfinished" />
        </ProgressBar>
      </div>
      <ul className="ts-metric-legend font-tabular">
        <li className={`is-good${completed ? '' : ' is-zero'}`}>
          <strong>{formatCount(completed)}</strong> completed
        </li>
        <li className={`is-bad${unfinished ? '' : ' is-zero'}`}>
          <strong>{formatCount(unfinished)}</strong> unfinished
        </li>
      </ul>
    </div>
  )
}

MachineOee.propTypes = { summary: summaryShape }
MachineCycles.propTypes = { summary: summaryShape }
