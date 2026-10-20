import { ResponsiveContainer } from 'recharts'
import PropTypes from 'prop-types'

// Sized box for one Recharts chart (`.ts-chart`, height from the theme). With `empty` it shows a
// placeholder instead, so a chart without data keeps its place in the layout.
function ChartFrame({ size, empty = false, emptyText = 'No data to show yet.', children }) {
  return (
    <div className={`ts-chart${size ? ` ts-chart-${size}` : ''}`}>
      {empty ? (
        <div className="ts-chart-empty">
          <i className="bi bi-bar-chart-line" aria-hidden="true" />
          <span>{emptyText}</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </div>
  )
}

ChartFrame.propTypes = {
  size: PropTypes.oneOf(['lg']),
  empty: PropTypes.bool,
  emptyText: PropTypes.string,
  children: PropTypes.element.isRequired,
}

export default ChartFrame
