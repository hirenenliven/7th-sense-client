import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'

// Card around one chart: title (+ optional subtitle and header actions), the chart in the body
function ChartCard({ title, subtitle, icon, actions, children }) {
  return (
    <Card className="h-100">
      <Card.Header>
        {icon && <i className={`bi ${icon} text-body-secondary`} aria-hidden="true" />}
        <div>
          <div>{title}</div>
          {subtitle && <div className="card-subtitle fw-normal">{subtitle}</div>}
        </div>
        {actions && <div className="ts-header-actions">{actions}</div>}
      </Card.Header>
      <Card.Body>{children}</Card.Body>
    </Card>
  )
}

ChartCard.propTypes = {
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.node,
  icon: PropTypes.string,
  actions: PropTypes.node,
  children: PropTypes.node.isRequired,
}

export default ChartCard
