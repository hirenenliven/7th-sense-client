import PropTypes from 'prop-types'
import { Card } from 'react-bootstrap'

// Card around one chart: icon tile, title (+ optional subtitle) and header actions, the chart in the body
function ChartCard({ title, subtitle, icon, actions, children }) {
  return (
    <Card className="ts-chart-card h-100">
      <Card.Header className="flex-wrap">
        {icon && (
          <span className="ts-chart-card-icon" aria-hidden="true">
            <i className={`bi ${icon}`} />
          </span>
        )}
        <div className="ts-chart-card-heading">
          <h2 className="ts-chart-card-title">{title}</h2>
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
        {actions && <div className="ts-header-actions ts-chart-card-actions">{actions}</div>}
      </Card.Header>
      <Card.Body className="d-flex flex-column">{children}</Card.Body>
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
