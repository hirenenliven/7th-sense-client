import { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

// Active / Inactive pill for tables, cards and detail views: soft tint, coloured dot.
// <StatusBadge active={record.status !== X_STATUS.INACTIVE} />. Labels are English keys, shown translated.
function StatusBadge({ active, activeLabel = 'Active', inactiveLabel = 'Inactive' }) {
  const { t } = useTranslation()
  return (
    <span className={`ts-status ${active ? 'is-active' : 'is-inactive'}`}>
      <span className="ts-status-dot" aria-hidden="true" />
      {t(active ? activeLabel : inactiveLabel)}
    </span>
  )
}

StatusBadge.propTypes = {
  active: PropTypes.bool.isRequired,
  activeLabel: PropTypes.string,
  inactiveLabel: PropTypes.string,
}

export default memo(StatusBadge)
