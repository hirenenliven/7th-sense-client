import { useId, useState } from 'react'
import PropTypes from 'prop-types'
import { Collapse } from 'react-bootstrap'
import { NavLink, useLocation } from 'react-router-dom'
import { hasActiveChild, isPathActive } from '@/utils/navigation'

const linkClass = ({ isActive }) => `ts-sidenav-link${isActive ? ' active' : ''}`

// `activePaths`: the link also stays active on these routes (e.g. every tab of a tabbed page)
const isAlsoActive = (item, pathname) => Boolean(item.activePaths?.some((path) => isPathActive(path, pathname)))

function SidebarItem({ item, onNavigate }) {
  const { pathname } = useLocation()
  const childActive = hasActiveChild(item, pathname)
  const [expanded, setExpanded] = useState(childActive)
  const submenuId = useId()

  const icon = item.icon && <i className={`bi ${item.icon} ts-sidenav-icon`} aria-hidden="true" />

  if (!item.children) {
    const alsoActive = isAlsoActive(item, pathname)
    return (
      <li>
        <NavLink
          to={item.path}
          end
          className={({ isActive }) => linkClass({ isActive: isActive || alsoActive })}
          onClick={onNavigate}
        >
          {icon}
          <span className="ts-sidenav-label">{item.label}</span>
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
        <span className="ts-sidenav-label">{item.label}</span>
        <i className="bi bi-chevron-down ts-sidenav-caret" aria-hidden="true" />
      </button>
      <Collapse in={expanded}>
        <div id={submenuId}>
          <ul className="ts-sidenav-sub">
            {item.children.map((child) => (
              <li key={child.key}>
                <NavLink
                  to={child.path}
                  end
                  className={({ isActive }) => linkClass({ isActive: isActive || isAlsoActive(child, pathname) })}
                  onClick={onNavigate}
                >
                  {child.label}
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
  activePaths: PropTypes.arrayOf(PropTypes.string),
})

SidebarItem.propTypes = {
  item: PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    path: PropTypes.string,
    activePaths: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.arrayOf(navLeafShape),
  }).isRequired,
  onNavigate: PropTypes.func,
}

export default SidebarItem
