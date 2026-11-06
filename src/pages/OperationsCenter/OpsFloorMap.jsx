import { useMemo, useState } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import ChartCard from '@/components/charts/ChartCard'
import { NoResults } from '@/components/common/TableNoResults'
import { modeTypeOf } from '@/constants/machines'
import { machineMonitorPath } from '@/constants/monitoring'
import { ROUTES } from '@/constants/routes'
import { OTHER_MODE, fleetModeCounts, secondsInMode } from '@/pages/Home/homeSettings'
import { formatCount, percent } from '@/pages/Productivity/productivitySettings'
import { formatModeDuration } from '@/utils/dateTime'
import { floorGroups, machineInChip } from './operationsSettings'

const toneOf = (modeId) => (modeTypeOf(modeId) ? `mode-${modeId}` : 'neutral')
const chipTone = (chip) => (chip.id === OTHER_MODE.id ? 'neutral' : `mode-${chip.id}`)

// One machine: a bar in its mode colour, what it does now and for how long, its OEE of the day.
// Opens the machine's Productivity tab.
function MachineTile({ machine, serverTime }) {
  const mode = modeTypeOf(machine.modeId)
  const seconds = secondsInMode(machine, serverTime)
  return (
    <Link
      to={machineMonitorPath(ROUTES.MACHINE_PRODUCTIVITY, { id: machine.machineId })}
      className={`ts-ops-machine ts-tone-${toneOf(machine.modeId)} text-reset text-decoration-none`}
    >
      <span className="ts-ops-machine-name text-truncate">
        {!machine.onlineStatus && <i className="bi bi-wifi-off text-danger me-1" title="Offline" aria-label="Offline" />}
        {machine.machineName}
      </span>
      <span className="small text-body-secondary text-truncate">
        {mode?.label ?? 'Awaiting data'}
        {seconds != null && ` · ${formatModeDuration(seconds)}`}
      </span>
      <span className="ts-ops-machine-meta small font-tabular">
        <span>OEE {percent(machine.oee)}</span>
        <span className="text-body-secondary">{formatCount(machine.completedCount)} cycles</span>
      </span>
    </Link>
  )
}

MachineTile.propTypes = { machine: PropTypes.object.isRequired, serverTime: PropTypes.string.isRequired }

// Every machine at a glance, by line, in its mode colour; narrowed by mode or name
function OpsFloorMap({ home, setup, showCustomer }) {
  const [search, setSearch] = useState('')
  const [chipId, setChipId] = useState(null)
  const chips = useMemo(() => fleetModeCounts(home.fleet.modes).filter((chip) => chip.count > 0), [home.fleet.modes])
  const chip = chips.find((item) => item.id === chipId) ?? null
  const term = search.trim().toLowerCase()

  const groups = useMemo(() => {
    const shown = home.machines.filter(
      (machine) => (!chip || machineInChip(machine, chip)) && (!term || machine.machineName.toLowerCase().includes(term)),
    )
    return floorGroups(shown, setup, showCustomer)
  }, [home.machines, setup, showCustomer, chip, term])

  return (
    <ChartCard title="Shop floor" subtitle="Right now · every active machine by line, in its mode colour" icon="bi-grid-3x3-gap">
      <div className="ts-toolbar">
        <div className="ts-ops-chips" role="group" aria-label="Filter by mode">
          <button type="button" className="ts-ops-chip ts-tone-neutral" aria-pressed={!chip} onClick={() => setChipId(null)}>
            All <span className="font-tabular">{formatCount(home.machines.length)}</span>
          </button>
          {chips.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`ts-ops-chip ts-tone-${chipTone(item)}`}
              aria-pressed={chip?.id === item.id}
              onClick={() => setChipId(chip?.id === item.id ? null : item.id)}
            >
              <i className="ts-dot" aria-hidden="true" />
              {item.label} <span className="font-tabular">{formatCount(item.count)}</span>
            </button>
          ))}
        </div>
        <InputGroup className="ts-ops-search w-auto ms-auto">
          <Form.Control type="search" placeholder="Search machine…" value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search machines" />
          <InputGroup.Text>
            <i className="bi bi-search" aria-hidden="true" />
          </InputGroup.Text>
        </InputGroup>
      </div>

      {groups.length ? (
        <div className="ts-ops-groups">
          {groups.map((group) => (
            <section key={group.label} className="ts-ops-group">
              <h3 className="ts-ops-group-title">
                {group.label} <span className="font-tabular text-body-tertiary">· {formatCount(group.machines.length)}</span>
              </h3>
              <div className="ts-ops-floor">
                {group.machines.map((machine) => (
                  <MachineTile key={machine.machineId} machine={machine} serverTime={home.serverTime} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <NoResults
          message="No machine matches this filter."
          onClear={() => {
            setSearch('')
            setChipId(null)
          }}
        />
      )}
    </ChartCard>
  )
}

OpsFloorMap.propTypes = {
  home: PropTypes.object.isRequired,
  setup: PropTypes.arrayOf(PropTypes.object).isRequired,
  showCustomer: PropTypes.bool.isRequired,
}

export default OpsFloorMap
