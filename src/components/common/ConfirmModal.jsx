import { Button, Modal, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Yes/no confirmation for destructive actions. Stays open while `busy`.
function ConfirmModal({
  show,
  title,
  children,
  confirmLabel = 'Confirm',
  confirmVariant = 'danger',
  busy = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal show={show} onHide={busy ? undefined : onCancel} centered backdrop={busy ? 'static' : true}>
      <Modal.Header closeButton={!busy}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="ts-note">{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="ghost" onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button variant={confirmVariant} onClick={onConfirm} disabled={busy}>
          {busy && <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />}
          {confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ConfirmModal.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  confirmLabel: PropTypes.string,
  confirmVariant: PropTypes.string,
  busy: PropTypes.bool,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}

export default ConfirmModal
