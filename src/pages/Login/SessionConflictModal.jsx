import { Button, CloseButton, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { SESSION_MODES } from '@/constants/session'

const TITLE_ID = 'session-conflict-title'

// The 409 session_conflict of a login (server ADR 0014): the account already has as many sessions
// as allowed. Continue logs in again with forceLogoutOthers, which logs out the other session
// (single mode) or only the one inactive the longest (multiple mode); Cancel keeps them all.
function SessionConflictModal({ conflict, busy, onContinue, onCancel }) {
  const isSingle = conflict?.mode === SESSION_MODES.SINGLE
  const maxSessions = conflict?.maxSessions

  // What Continue does, in the order it happens
  const facts = isSingle
    ? [
        { icon: 'bi-laptop', text: 'Your account can be signed in on one device at a time.' },
        { icon: 'bi-box-arrow-right', text: 'The other device will be logged out.' },
      ]
    : [
        { icon: 'bi-laptop', text: `${maxSessions} of ${maxSessions} sessions are in use.` },
        { icon: 'bi-box-arrow-right', text: 'The device inactive the longest will be logged out.' },
        { icon: 'bi-check2-circle', text: 'Your other devices stay signed in.' },
      ]

  return (
    <Modal
      show={Boolean(conflict)}
      onHide={busy ? undefined : onCancel}
      centered
      backdrop={busy ? 'static' : true}
      dialogClassName="ts-alert-modal"
      aria-labelledby={TITLE_ID}
    >
      <Modal.Body>
        {!busy && <CloseButton className="ts-alert-modal-close" onClick={onCancel} aria-label="Close" />}

        <div className="ts-alert-modal-icon" aria-hidden="true">
          <i className="bi bi-shield-lock" />
        </div>
        <h2 id={TITLE_ID} className="ts-alert-modal-title">
          {isSingle ? 'Already signed in elsewhere' : 'Session limit reached'}
        </h2>
        <p className="ts-alert-modal-text">
          {isSingle
            ? 'Your account is signed in on another device right now.'
            : 'Your account is signed in on the most devices allowed at once.'}
        </p>

        <ul className="ts-alert-modal-facts">
          {facts.map((fact) => (
            <li key={fact.icon}>
              <i className={`bi ${fact.icon}`} aria-hidden="true" />
              <span>{fact.text}</span>
            </li>
          ))}
        </ul>

        <div className="d-grid gap-2">
          <Button variant="primary" className="ts-alert-modal-action" onClick={onContinue} disabled={busy}>
            {busy && <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />}
            {busy ? 'Signing in…' : 'Log out other device and continue'}
          </Button>
          <Button variant="ghost" className="ts-alert-modal-action" onClick={onCancel} disabled={busy}>
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  )
}

SessionConflictModal.propTypes = {
  // data of the 409: { mode, maxSessions, sessions }; null = closed
  conflict: PropTypes.shape({
    mode: PropTypes.string,
    maxSessions: PropTypes.number,
  }),
  busy: PropTypes.bool.isRequired,
  onContinue: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default SessionConflictModal
