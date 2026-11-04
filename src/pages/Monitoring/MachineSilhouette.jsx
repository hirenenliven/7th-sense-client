import PropTypes from 'prop-types'

// Placeholder picture of a CNC machine (machines have no photo): drawn in currentColor, so the
// theme colours it through `className`.
function MachineSilhouette({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 80" aria-hidden="true">
      <g fill="currentColor">
        {/* spindle column and head */}
        <rect x="60" y="4" width="12" height="20" rx="2" opacity="0.7" />
        <rect x="55" y="22" width="22" height="6" rx="2" opacity="0.85" />
        {/* cabinet */}
        <rect x="8" y="24" width="94" height="42" rx="5" opacity="0.45" />
        {/* door window */}
        <rect x="16" y="32" width="40" height="24" rx="7" opacity="0.9" />
        <rect x="22" y="38" width="28" height="12" rx="4" opacity="0.35" />
        {/* control panel */}
        <rect x="82" y="28" width="15" height="30" rx="2" opacity="0.85" />
        <rect x="85" y="31" width="9" height="8" rx="1" opacity="0.35" />
        {/* base */}
        <rect x="4" y="66" width="112" height="7" rx="2" opacity="0.7" />
      </g>
    </svg>
  )
}

MachineSilhouette.propTypes = {
  className: PropTypes.string,
}

export default MachineSilhouette
