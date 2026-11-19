import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Alert, Button, Card, Form, InputGroup, Spinner, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import SortableHead from '@/components/common/SortableHead'
import TableNoResults from '@/components/common/TableNoResults'
import TablePagination from '@/components/common/TablePagination'
import { PAGE_SIZES } from '@/constants/app'
import { CONTROLLER_VERSION_TYPES } from '@/constants/machines'
import { ROUTES } from '@/constants/routes'
import useMachineLive from '@/hooks/useMachineLive'
import useTableSort from '@/hooks/useTableSort'
import { trackChanges } from '@/pages/MachineDiagnostics/diagnosticsSettings'
import {
  getMachinePlcVariables,
  resetMachinePlcVariable,
  resetMachinePlcVariables,
  testMachinePlcNodeIds,
  updateMachinePlcVariable,
} from '@/services/machinePlcVariableService'
import { toast } from '@/utils/toast'
import PlcVariableRow from './PlcVariableRow'
import {
  NODE_FILTER,
  NODE_FILTERS,
  NODE_STATUS,
  NODE_STATUS_LABELS,
  PLC_LIVE_INTERVAL_MS,
  READER_REFRESH_DELAY_MS,
  changedDraft,
  currentNodeId,
  nodeIdError,
  readerLook,
} from './plcVariableSettings'

const NO_VALUES = {}

const countOf = (variables, status) => variables.filter((row) => row.nodeStatus === status).length

const withRow = (list, saved) => {
  const variables = list.variables.map((row) => (row.variableId === saved.variableId ? saved : row))
  const updatedCount = countOf(variables, NODE_STATUS.UPDATED)
  return { ...list, variables, updatedCount, defaultCount: variables.length - updatedCount }
}

// list with the reader's state and answers of fresh (a later GET), keeping everything else
const withReader = (list, fresh) => {
  const freshRows = new Map(fresh.variables.map((row) => [row.variableId, row]))
  const variables = list.variables.map((row) => {
    const freshRow = freshRows.get(row.variableId)
    return freshRow ? { ...row, readerNodeId: freshRow.readerNodeId, readerStatus: freshRow.readerStatus } : row
  })
  return { ...list, reader: fresh.reader, variables }
}

const withoutKeys = (drafts, ids) => {
  const next = { ...drafts }
  ids.forEach((id) => delete next[id])
  return next
}

// Machines › a machine › PLC node IDs, for the superadmin (server ADR 0020): every PLC variable (a
// plc address in cnc_variable_addresses for any controller) with the OPC UA node id the machine reads
// it from. A variable reads its default (the controller's own, else the Siemens one: PLC defaults
// exist for Siemens only) until it is given the machine's own; the node id is edited in the row (Enter
// saves, Esc undoes), Save changes saves every edited row, and Reset puts one or all back on the
// default. The collector reloads the machine's variables after each save. Test reads node ids (saved
// or typed) once from the machine over OPC UA, nothing stored; the Live value column shows each
// variable's value from the socket and whether the PLC reader reads its saved node id.
function MachinePlcVariables() {
  const { id } = useParams()
  const machineId = Number(id)

  const [list, setList] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // variableId → typed node id, kept across pages and filters until saved or undone
  const [drafts, setDrafts] = useState({})
  const [saving, setSaving] = useState(() => new Set())
  const [savingAll, setSavingAll] = useState(false)
  const [confirmResetAll, setConfirmResetAll] = useState(false)
  const [resettingAll, setResettingAll] = useState(false)
  // variableId → { nodeId, testing, startedAt } while reading, then { nodeId, ok, status, value, valueType, at }
  const [tests, setTests] = useState({})
  const readerTimer = useRef(null)

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState(NODE_FILTER.ALL)
  const [category, setCategory] = useState('')
  const [pageSize, setPageSize] = useState(PAGE_SIZES[1])
  const [currentPageNo, setPage] = useState(1)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMachinePlcVariables(machineId)
      .then((data) => active && setList(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [machineId, reloadKey])

  const variables = useMemo(() => list?.variables ?? [], [list])
  const changed = useMemo(
    () => variables.map((row) => ({ row, draft: changedDraft(drafts, row) })).filter((item) => item.draft !== undefined),
    [variables, drafts],
  )
  const savable = changed.filter((item) => !nodeIdError(item.draft))
  const categories = useMemo(() => [...new Set(variables.map((row) => row.category))].sort(), [variables])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return variables.filter((row) => {
      if (filter === NODE_FILTER.UNSAVED) {
        if (changedDraft(drafts, row) === undefined) return false
      } else if (filter && row.nodeStatus !== filter) return false
      if (category && row.category !== category) return false
      return !term || [row.code, row.name, row.nodeId, row.defaultNodeId, String(row.variableId)].some((text) => text.toLowerCase().includes(term))
    })
  }, [variables, drafts, search, filter, category])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(currentPageNo, pageCount)
  const columns = [
    { label: 'ID', sort: (row) => row.variableId },
    { label: 'Variable', sort: (row) => row.code },
    { label: 'Category', sort: (row) => row.category },
    { label: 'Node ID', sort: (row) => row.nodeId },
    'Live value',
    { label: 'Status', sort: (row) => NODE_STATUS_LABELS[row.nodeStatus] },
    'Actions',
  ]
  const { sortedRows, sort, onSort } = useTableSort(filtered, columns, () => setPage(1))
  const pageRows = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // Live values of the rows on this page (the socket takes at most 100 codes, the largest page)
  const reader = list?.reader
  const readsLive = Boolean(reader?.enabled && reader?.supported)
  const liveCodes = useMemo(() => pageRows.map((row) => row.code).sort(), [pageRows])
  const live = useMachineLive(readsLive && liveCodes.length ? machineId : null, { codes: liveCodes, intervalMs: PLC_LIVE_INTERVAL_MS })
  const liveValues = readsLive && live.values ? live.values : NO_VALUES
  const socketLive = readsLive && live.connected
  const [tracked, setTracked] = useState({ source: null, rows: {} })
  if (liveValues !== tracked.source) setTracked(trackChanges(tracked, liveValues, live.at))

  useEffect(() => () => clearTimeout(readerTimer.current), [])

  // After a save the PLC reader subscribes again; its answer for the new node id is fetched shortly after
  const refreshReaderSoon = useCallback(() => {
    clearTimeout(readerTimer.current)
    readerTimer.current = setTimeout(async () => {
      try {
        const fresh = await getMachinePlcVariables(machineId)
        setList((current) => (current ? withReader(current, fresh) : current))
      } catch {
        // the next page load shows it
      }
    }, READER_REFRESH_DELAY_MS)
  }, [machineId])

  // Reads targets ([{ row, nodeId }]) once from the machine. A result is kept only while it is the
  // row's latest test; the row shows it while its box still holds that node id.
  const runTest = useCallback(
    async (targets) => {
      if (!targets.length) return
      const startedAt = Date.now()
      const setResults = (resultOf) =>
        setTests((current) => {
          const next = { ...current }
          targets.forEach(({ row, nodeId }) => {
            if (current[row.variableId]?.startedAt === startedAt) next[row.variableId] = { nodeId, at: Date.now(), ...resultOf(nodeId) }
          })
          return next
        })
      setTests((current) => {
        const next = { ...current }
        targets.forEach(({ row, nodeId }) => {
          next[row.variableId] = { nodeId, testing: true, startedAt }
        })
        return next
      })
      try {
        const test = await testMachinePlcNodeIds(machineId, [...new Set(targets.map((target) => target.nodeId))])
        const results = new Map(test.results.map((result) => [result.nodeId, result]))
        setResults((nodeId) => {
          const result = results.get(nodeId)
          if (result) return { ok: result.ok, status: result.status, value: result.value, valueType: result.valueType }
          return { ok: false, status: test.tested ? 'Not connected' : 'Not tested' }
        })
        if (!test.connected) {
          toast.error([test.message, test.hint].filter(Boolean).join(' '), { title: test.tested ? 'Could not reach the machine' : 'Not tested' })
        } else if (targets.length > 1) {
          const working = test.results.filter((result) => result.ok).length
          const notify = working === test.results.length ? toast.success : toast.error
          notify(`${working} of ${test.results.length} node IDs read a value (${test.durationMs} ms).`, { title: 'Test finished' })
        }
      } catch (err) {
        setResults(() => ({ ok: false, status: err.message }))
        toast.error(err.message, { title: 'Could not test node IDs' })
      }
    },
    [machineId],
  )

  const clearFilters = () => {
    setSearch('')
    setFilter(NODE_FILTER.ALL)
    setCategory('')
    setPage(1)
  }

  const changeDraft = useCallback((variableId, value) => {
    setDrafts((current) => (value === undefined ? withoutKeys(current, [variableId]) : { ...current, [variableId]: value }))
  }, [])

  const markSaving = (variableId, on) =>
    setSaving((current) => {
      const next = new Set(current)
      if (on) next.add(variableId)
      else next.delete(variableId)
      return next
    })

  // One request per row; the row keeps its typing when the server refuses it
  const saveRow = useCallback(
    async (row, draft) => {
      markSaving(row.variableId, true)
      try {
        const saved = await updateMachinePlcVariable(machineId, row.variableId, draft.trim())
        setList((current) => withRow(current, saved))
        setDrafts((current) => withoutKeys(current, [row.variableId]))
        refreshReaderSoon()
        return saved
      } finally {
        markSaving(row.variableId, false)
      }
    },
    [machineId, refreshReaderSoon],
  )

  const handleSave = useCallback(
    async (row, draft) => {
      try {
        const saved = await saveRow(row, draft)
        toast.success(saved.nodeStatus === NODE_STATUS.DEFAULT ? `${row.code} reads the default node ID again.` : `${row.code} reads ${saved.nodeId}.`, { title: 'Node ID saved' })
      } catch (err) {
        toast.error(err.message, { title: `Could not save ${row.code}` })
      }
    },
    [saveRow],
  )

  const handleReset = useCallback(
    async (row) => {
      markSaving(row.variableId, true)
      try {
        const saved = await resetMachinePlcVariable(machineId, row.variableId)
        setList((current) => withRow(current, saved))
        setDrafts((current) => withoutKeys(current, [row.variableId]))
        refreshReaderSoon()
        toast.success(`${row.code} reads the default node ID again.`, { title: 'Node ID reset' })
      } catch (err) {
        toast.error(err.message, { title: `Could not reset ${row.code}` })
      } finally {
        markSaving(row.variableId, false)
      }
    },
    [machineId, refreshReaderSoon],
  )

  const saveAll = async () => {
    setSavingAll(true)
    const results = await Promise.allSettled(savable.map(({ row, draft }) => saveRow(row, draft)))
    setSavingAll(false)
    const failed = results.filter((result) => result.status === 'rejected')
    const savedCount = results.length - failed.length
    if (savedCount) toast.success(`${savedCount} node ID${savedCount === 1 ? '' : 's'} saved.`, { title: 'Node IDs saved' })
    if (failed.length) toast.error(failed[0].reason?.message, { title: `${failed.length} could not be saved` })
  }

  const resetAll = async () => {
    setResettingAll(true)
    try {
      setList(await resetMachinePlcVariables(machineId))
      setDrafts({})
      refreshReaderSoon()
      setConfirmResetAll(false)
      toast.success('The machine’s own node IDs are removed; variables read their defaults again.', { title: 'Node IDs reset' })
    } catch (err) {
      toast.error(err.message, { title: 'Could not reset node IDs' })
    } finally {
      setResettingAll(false)
    }
  }

  const backButton = (
    <Button as={Link} to={ROUTES.MACHINES} variant="ghost">
      <i className="bi bi-arrow-left me-2" aria-hidden="true" />
      Machine list
    </Button>
  )

  if (loading) return <Loader text="Loading PLC node IDs…" />
  if (!list) {
    return (
      <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2">
        <span className="me-auto">
          <b>Could not load PLC node IDs.</b> {error}
        </span>
        {backButton}
        <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
          <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
          Retry
        </Button>
      </Alert>
    )
  }

  const versionLabel = CONTROLLER_VERSION_TYPES.find((option) => option.id === list.controllerVersionType)?.label
  const busy = savingAll || resettingAll
  const readerState = readerLook(list.reader)
  const pageTargets = pageRows
    .map((row) => ({ row, nodeId: currentNodeId(row, changedDraft(drafts, row)) }))
    .filter(({ nodeId }) => !nodeIdError(nodeId))
  const pageTesting = pageRows.some((row) => tests[row.variableId]?.testing)

  const renderList = () => {
    if (!variables.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-diagram-3 ts-empty-icon" aria-hidden="true" />
          <p className="mb-1">No PLC variables yet.</p>
          <p className="ts-note mb-0">A variable is listed here once it has a PLC address in the variable catalog (cnc_variable_addresses).</p>
        </div>
      )
    }
    return (
      <>
        <div className="ts-toolbar">
          <InputGroup className="flex-grow-1 w-auto">
            <Form.Control
              type="search"
              placeholder="Search code, name, node ID…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              aria-label="Search PLC variables"
            />
            <InputGroup.Text>
              <i className="bi bi-search" aria-hidden="true" />
            </InputGroup.Text>
          </InputGroup>
          <Form.Select
            className="w-auto"
            value={filter}
            onChange={(event) => {
              setFilter(event.target.value)
              setPage(1)
            }}
            aria-label="Node ID status"
          >
            {NODE_FILTERS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
          <Form.Select
            className="w-auto text-capitalize"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value)
              setPage(1)
            }}
            aria-label="Category"
          >
            <option value="">All categories</option>
            {categories.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Form.Select>
          {list.reader.supported && (
            <Button variant="outline-secondary" onClick={() => runTest(pageTargets)} disabled={pageTesting || !pageTargets.length}>
              {pageTesting ? <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" /> : <i className="bi bi-play-circle me-2" aria-hidden="true" />}
              Test this page ({pageTargets.length})
            </Button>
          )}
          {changed.length > 0 && (
            <>
              <Button variant="ghost" onClick={() => setDrafts({})} disabled={busy}>
                Discard
              </Button>
              <Button onClick={saveAll} disabled={busy || !savable.length}>
                {savingAll ? <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" /> : <i className="bi bi-check-lg me-2" aria-hidden="true" />}
                Save {savable.length} change{savable.length === 1 ? '' : 's'}
              </Button>
            </>
          )}
        </div>

        <div className="ts-table-panel">
          <Table hover responsive className="mb-0 align-middle">
            <SortableHead columns={columns} sort={sort} onSort={onSort} />
            <tbody>
              {pageRows.map((row) => (
                <PlcVariableRow
                  key={row.variableId}
                  row={row}
                  draft={changedDraft(drafts, row)}
                  saving={saving.has(row.variableId)}
                  test={tests[row.variableId]}
                  reader={list.reader}
                  socketLive={socketLive}
                  liveValue={liveValues[row.code]}
                  liveChanges={tracked.rows[row.code]?.changes ?? 0}
                  onDraftChange={changeDraft}
                  onSave={handleSave}
                  onReset={handleReset}
                  onTest={runTest}
                />
              ))}
              {!pageRows.length && <TableNoResults colSpan={columns.length} message="No PLC variable matches these filters." onClear={clearFilters} />}
            </tbody>
          </Table>
          {filtered.length > 0 && (
            <TablePagination
              page={currentPage}
              pageSize={pageSize}
              totalCount={filtered.length}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setPage(1)
              }}
            />
          )}
        </div>
      </>
    )
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Machines · PLC node IDs</div>
          <h1>{list.machineName}</h1>
          <p className="ts-page-subtitle">
            Machine # {list.machineId} · {list.controllerName || 'No controller'} · {versionLabel ? `Controller version ${versionLabel}` : 'Controller version not set: only node IDs for every version apply'}
          </p>
        </div>
        <div className="ts-page-actions">
          {backButton}
          <Button variant="outline-danger" onClick={() => setConfirmResetAll(true)} disabled={busy || !list.updatedCount}>
            <i className="bi bi-arrow-counterclockwise me-2" aria-hidden="true" />
            Reset all to default
          </Button>
        </div>
      </header>

      <Card>
        <Card.Body>
          {variables.length > 0 && (
            <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
              <span className="ts-chip ts-chip-muted">{variables.length} PLC variables</span>
              <span className={`ts-chip ${list.updatedCount ? 'text-warning' : 'ts-chip-muted'}`}>{list.updatedCount} updated</span>
              <span className="ts-chip ts-chip-muted">{list.defaultCount} default</span>
              {changed.length > 0 && <span className="ts-chip text-info">{changed.length} unsaved</span>}
              <span className={`ts-diag-state small ts-tone-${readerState.tone}`} title={readerState.title}>
                <i className="ts-dot" aria-hidden="true" />
                {readerState.label}
              </span>
              <p className="ts-note mb-0 ms-lg-2">
                Type a node ID and press Enter to save it for this machine; Esc undoes. Test (<i className="bi bi-play-circle" aria-hidden="true" />) reads the node ID in the
                box once from the machine, saved or not, so a node ID can be tried before it is saved. Live value is what the PLC reader receives now (Siemens machines, OPC UA).
              </p>
            </div>
          )}
          {renderList()}
        </Card.Body>
      </Card>

      <ConfirmModal
        show={confirmResetAll}
        title="Reset all node IDs?"
        confirmLabel="Reset all"
        busy={resettingAll}
        onConfirm={resetAll}
        onCancel={() => setConfirmResetAll(false)}
      >
        The {list.updatedCount} updated PLC variable{list.updatedCount === 1 ? '' : 's'} of <strong>{list.machineName}</strong> will read their default node IDs again.
        {changed.length > 0 && ' Unsaved changes are discarded.'}
      </ConfirmModal>
    </>
  )
}

export default MachinePlcVariables
