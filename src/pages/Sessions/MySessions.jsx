import { useEffect, useState } from 'react'
import { Alert, Button } from 'react-bootstrap'
import ConfirmModal from '@/components/common/ConfirmModal'
import Loader from '@/components/common/Loader'
import { getMySessions, revokeMyOtherSessions, revokeMySession } from '@/services/sessionService'
import { toast } from '@/utils/toast'
import SessionTable from './SessionTable'

// System › My Sessions: the logged-in user's active sessions (server ADR 0014). Any other session
// can be logged out, one at a time or all at once; the browser of a logged out session is sent to
// the login screen on its next request. This session itself ends with the normal Log out.
function MySessions() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  // The session to log out, or 'others' for every session but this one
  const [pendingRevoke, setPendingRevoke] = useState(null)
  const [revoking, setRevoking] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMySessions()
      .then((list) => active && setSessions(list))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [reloadKey])

  const otherCount = sessions.filter((session) => !session.isCurrent).length
  const revokingOthers = pendingRevoke === 'others'

  const confirmRevoke = async () => {
    setRevoking(true)
    try {
      if (revokingOthers) {
        const { revoked } = await revokeMyOtherSessions()
        setSessions((list) => list.filter((session) => session.isCurrent))
        toast.success(`${revoked} other session${revoked === 1 ? '' : 's'} logged out.`, { title: 'Sessions logged out' })
      } else {
        await revokeMySession(pendingRevoke.id)
        setSessions((list) => list.filter((session) => session.id !== pendingRevoke.id))
        toast.success(`${pendingRevoke.device} has been logged out.`, { title: 'Session logged out' })
      }
      setPendingRevoke(null)
    } catch (err) {
      toast.error(err.message, { title: 'Could not log out the session' })
      // A 404 means it ended meanwhile: show the list as it is now
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
    return <SessionTable sessions={sessions} onRevoke={setPendingRevoke} />
  }

  return (
    <>
      <header className="ts-page-header">
        <div>
          <div className="ts-eyebrow">System</div>
          <h1>My Sessions</h1>
          <p className="ts-page-subtitle">Devices where your account is signed in. Location is not available.</p>
        </div>
        <div className="ts-page-actions">
          <Button variant="danger" onClick={() => setPendingRevoke('others')} disabled={loading || !otherCount}>
            <i className="bi bi-box-arrow-right me-2" aria-hidden="true" />
            Log out all other sessions
          </Button>
        </div>
      </header>

      {renderBody()}

      <ConfirmModal
        show={Boolean(pendingRevoke)}
        title={revokingOthers ? 'Log out all other sessions?' : 'Log out this session?'}
        confirmLabel="Log out"
        busy={revoking}
        onConfirm={confirmRevoke}
        onCancel={() => setPendingRevoke(null)}
      >
        {revokingOthers
          ? `Every other device (${otherCount}) is logged out and must log in again. This device stays signed in.`
          : `${pendingRevoke?.device ?? 'That device'} is logged out and must log in again.`}
      </ConfirmModal>
    </>
  )
}

export default MySessions
