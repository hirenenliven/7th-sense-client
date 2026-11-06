import { Component } from 'react'
import { Alert, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Shows a message instead of a blank app when a screen crashes while drawing, or its code cannot
// be downloaded (after a deploy the old files are gone, and a screen left open still asks for them).
class ErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="container py-5">
        <Alert variant="danger" className="d-flex flex-wrap align-items-center gap-2 mb-0" role="alert">
          <span className="me-auto">
            <b>This page could not be shown.</b> The app may have been updated. Reload to continue.
          </span>
          <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
            <i className="bi bi-arrow-clockwise me-1" aria-hidden="true" />
            Reload
          </Button>
        </Alert>
      </div>
    )
  }
}

ErrorBoundary.propTypes = { children: PropTypes.node.isRequired }

export default ErrorBoundary
