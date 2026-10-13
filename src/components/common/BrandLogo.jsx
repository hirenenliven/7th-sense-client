import PropTypes from 'prop-types'
import env from '@/config/env'

// 7th Sense wordmark: the orange line-drawn "7" with "th", and "SENSE".
// Colours come from the theme (.ts-logo-* in _components.scss), so it follows dark / light.
function BrandLogo({ className = '' }) {
  return (
    <svg className={`ts-logo ${className}`} viewBox="0 0 150 64" role="img" aria-label={env.appName}>
      <g className="ts-logo-mark">
        <path d="M6 7 H45 L22 58" />
        <path d="M14 14 H35 L16 57" />
        <path d="M4 14 H8" />
        <path d="M27 22 L31 22" />
      </g>
      <text className="ts-logo-sup" x="61" y="16">
        th
      </text>
      <text className="ts-logo-word" x="60" y="40">
        SENSE
      </text>
    </svg>
  )
}

BrandLogo.propTypes = {
  className: PropTypes.string,
}

export default BrandLogo
