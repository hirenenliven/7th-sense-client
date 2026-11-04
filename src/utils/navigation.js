import { matchPath } from 'react-router-dom'

// All link items (leaves) of the sidebar config, flattened, with their section / parent labels.
// A child without its own `roles` inherits its parent's.
export const flattenNav = (sections) =>
  sections.flatMap((section) =>
    section.items.flatMap((item) =>
      item.children
        ? item.children.map((child) => ({
            ...child,
            roles: child.roles ?? item.roles,
            section: section.title,
            parent: item.label,
          }))
        : [{ ...item, section: section.title }],
    ),
  )

// The sidebar config without the items `hasRole` rejects. Submenus and sections left
// empty are dropped too.
export const filterNavByRole = (sections, hasRole) =>
  sections
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => hasRole(item.roles))
        .map((item) =>
          item.children ? { ...item, children: item.children.filter((child) => hasRole(child.roles)) } : item,
        )
        .filter((item) => !item.children || item.children.length > 0),
    }))
    .filter((section) => section.items.length > 0)

export const isPathActive = (path, pathname) =>
  Boolean(matchPath({ path, end: true }, pathname))

export const hasActiveChild = (item, pathname) =>
  Boolean(
    item.children?.some(
      (child) => isPathActive(child.path, pathname) || child.activePaths?.some((path) => isPathActive(path, pathname)),
    ),
  )
