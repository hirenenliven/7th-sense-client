import { useCallback, useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import { Link, generatePath, useParams } from 'react-router-dom'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import { ROLES } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import useOrgUser from '@/hooks/useOrgUser'
import { getUserById } from '@/services/customerService'
import { getUserSessions, revokeAllUserSessions, revokeUserSession } from '@/services/sessionService'
import { toast } from '@/utils/toast'
import { customerName } from '@/pages/Customers/customerFormat'
import SessionTable from './SessionTable'

// Account Center › Customer / Users › View › Sessions (superadmin only, server ADR 0014): every
// active session of one customer or user, "log in as" ones included. The superadmin logs out one
// session or all of them; each browser is sent to the login screen on its next request.
function UserSessions() {
  const { id } = useParams()
  const { customerLabel } = useOrgUser()

  const [account, setAccount] = useState(null)
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // The session to log out, or 'all' for every session of the account
  const [pendingRevoke, setPendingRevoke] = useState(null)
  const [revoking, setRevoking] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    Promise.all([getUserById(id), getUserSessions(id)])
      .then(([user, list]) => {
        if (!active) return
        setAccount(user)
        setSessions(list)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, reloadKey])

  const isCustomer = account?.role === ROLES.CUSTOMER
  const name = account ? customerName({ ...account, ...account.companyProfile }) : 'Sessions'
  const backPath = generatePath(isCustomer || !account ? ROUTES.CUSTOMER_VIEW : ROUTES.USER_VIEW, { id: String(id) })
  // Every row is this account's: the customer is the account itself or its company
  const sessionCustomer = useCallback(
    () => customerLabel(isCustomer ? account?.id : account?.companyId),
    [customerLabel, isCustomer, account],
  )
  const revokingAll = pendingRevoke === 'all'

  const confirmRevoke = async () => {
    setRevoking(true)
    try {
      if (revokingAll) {
        const { revoked } = await revokeAllUserSessions(id)
        setSessions([])
        toast.success(`${revoked} session${revoked === 1 ? '' : 's'} of ${name} logged out.`, { title: 'Sessions logged out' })
      } else {
        await revokeUserSession(pendingRevoke.id)
        setSessions((list) => list.filter((session) => session.id !== pendingRevoke.id))
        toast.success(`${pendingRevoke.device} has been logged out.`, { title: 'Session logged out' })
      }
      setPendingRevoke(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not log out the session' })
      setPendingRevoke(null)
      setReloadKey((key) => key + 1)
    } finally {
      setRevoking(false)
    }
  }

  const renderBody = () => {
    if (loading) return <Loader text="Loading sessions…" />
    if (error) {
      return (
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0">
          <span className="me-auto">
            <b>Could not load sessions.</b> {error}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setReloadKey((key) => key + 1)}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Retry
          </Button>
        </Alert>
      )
    }
    if (!sessions.length) {
      return (
        <div className="ts-empty">
          <i className="bi bi-pc-display ts-empty-icon" aria-hidden="true" />
          <p className="mb-0">{name} is not signed in anywhere.</p>
        </div>
      )
    }
    return <SessionTable sessions={sessions} adminView customerLabel={sessionCustomer} onRevoke={setPendingRevoke} />
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">Account Center</div>
          <h1>{name}</h1>
          <p className="ts-page-subtitle">Active sessions of this account. Location is not available.</p>
        </div>
        <div className="ts-page-actions">
          <Button as={Link} to={backPath} variant="ghost">
            <i className="bi bi-arrow-left me-2" aria-hidden="true" />
            Back to {isCustomer || !account ? 'customer' : 'user'}
          </Button>
          <Button variant="danger" onClick={() => setPendingRevoke('all')} disabled={loading || !sessions.length}>
            <i className="bi bi-box-arrow-right me-2" aria-hidden="true" />
            Log out all
          </Button>
        </div>
      </header>

      {renderBody()}

      <ConfirmModal
        show={Boolean(pendingRevoke)}
        title={revokingAll ? `Log out every session of ${name}?` : 'Log out this session?'}
        confirmLabel="Log out"
        busy={revoking}
        onConfirm={confirmRevoke}
        onCancel={() => setPendingRevoke(null)}
      >
        {revokingAll
          ? `All ${sessions.length} session${sessions.length === 1 ? '' : 's'}, "log in as" ones included, are logged out. ${name} must log in again.`
          : `${pendingRevoke?.device ?? 'That device'} is logged out and must log in again.`}
      </ConfirmModal>
    </>
  )
}

export default UserSessions
