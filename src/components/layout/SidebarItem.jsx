import { useId, useState } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { NavLink, useLocation } from 'react-router-dom'
import { hasActiveChild } from '@/utils/navigation'

const linkClass = ({ isActive }) => `ts-sidenav-link${isActive ? ' active' : ''}`

function SidebarItem({ item, onNavigate }) {
  const { pathname } = useLocation()
  const childActive = hasActiveChild(item, pathname)
  const [expanded, setExpanded] = useState(childActive)
  const submenuId = useId()
  const { t } = useTranslation()
  const label = (entry) => t(entry.label)

  const icon = item.icon && <i className={`bi ${item.icon} ts-sidenav-icon`} aria-hidden="true" />

  if (!item.children) {
    return (
      <li>
        <NavLink to={item.path} end className={linkClass} onClick={onNavigate}>
          {icon}
          <span className="ts-sidenav-label">{label(item)}</span>
        </NavLink>
      </li>
    )
  }

  return (
    <li>
      <button
        type="button"
        className={`ts-sidenav-link${childActive ? ' has-active' : ''}`}
        onClick={() => setExpanded((open) => !open)}
        aria-expanded={expanded}
        aria-controls={submenuId}
      >
        {icon}
        <span className="ts-sidenav-label">{label(item)}</span>
        <i className="bi bi-chevron-down ts-sidenav-caret" aria-hidden="true" />
      </button>
      <Collapse in={expanded}>
        <div id={submenuId}>
          <ul className="ts-sidenav-sub">
            {item.children.map((child) => (
              <li key={child.key}>
                <NavLink to={child.path} end className={linkClass} onClick={onNavigate}>
                  {label(child)}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </Collapse>
    </li>
  )
}

const navLeafShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
})

SidebarItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    path: PropTypes.string,
    children: PropTypes.arrayOf(navLeafShape),
  }).isRequired,
  onNavigate: PropTypes.func,
}

export default SidebarItem
