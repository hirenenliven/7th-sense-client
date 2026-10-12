import { matchPath } from 'react-router-dom'

// All link items (leaves) of the sidebar config, flattened, with their section / parent labels.
export const flattenNav = (sections) =>
  sections.flatMap((section) =>
    section.items.flatMap((item) =>
      item.children
        ? item.children.map((child) => ({ ...child, section: section.title, parent: item.label }))
        : [{ ...item, section: section.title }],
    ),
  )

export const isPathActive = (path, pathname) =>
  Boolean(matchPath({ path, end: true }, pathname))

export const hasActiveChild = (item, pathname) =>
  Boolean(item.children?.some((child) => isPathActive(child.path, pathname)))
