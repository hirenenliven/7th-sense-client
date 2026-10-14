import PropTypes from 'prop-types'
import logoSvg from '@/assets/images/7thSlogologin.svg?raw'
import env from '@/config/env'

// 7th Sense logo (assets/images/7thSlogologin.svg), inlined so the white "SENSE" wordmark
// follows the text colour (.ts-logo) and stays visible in the light theme.
const LOGO_MARKUP = logoSvg.replace('fill="#fff"', 'fill="currentColor"')

// Size it with a class that sets a width (e.g. .ts-brand-mark, .ts-login-logo).
function BrandLogo({ className = '' }) {
  return (
    <span
      className={`ts-logo ${className}`}
      role="img"
      aria-label={env.appName}
      dangerouslySetInnerHTML={{ __html: LOGO_MARKUP }}
    />
  )
}

BrandLogo.propTypes = {
  className: PropTypes.string,
}

export default BrandLogo
