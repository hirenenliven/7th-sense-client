# 7thSense Theme — Usage Guide

The theme is Bootstrap 5.3 with SCSS, dark by design and based on `7thsense-ui-review.html`.
Live sample: **`/theme`** (`src/pages/ThemeShowcase/ThemeShowcase.jsx`).

## Files

| File | Purpose |
|---|---|
| `src/assets/scss/_variables.scss` | Design tokens (`$ts-*`) and every Bootstrap variable override |
| `src/assets/scss/_components.scss` | Component styles, `--ts-*` CSS variables and `ts-*` classes |
| `src/assets/scss/theme.scss` | Entry point: Bootstrap + tokens + components + extra utilities |

- **App:** `main.jsx` imports `theme.scss`, and Vite compiles it with hot reload.
- **Standalone CSS:** `npm run build:theme` writes `dist-theme/theme.css` and `theme.min.css`.

## Rules

1. **No inline styles, no hex/px values in pages.** Use Bootstrap classes, theme classes or tokens.
   The only exception is the width that `ProgressBar now={…}` sets from data.
2. **Use Bootstrap first** (`Card`, `Table`, `Badge`, `Alert`, `Modal`, utilities such as `d-flex gap-2 mb-3`).
   Use a `ts-*` class only when Bootstrap has nothing equivalent.
3. **New colours or sizes go into `_variables.scss`** as a token, and are then used by name.
4. **Responsive:** use the Bootstrap grid (`<Row xs={1} sm={2} xl={4}>`) and responsive utilities (`d-md-flex`).

## Tokens

| Token | Use |
|---|---|
| `$ts-bg` / `$ts-panel` / `$ts-panel-2` | Page / cards and tables / inputs, inner boxes, hover |
| `$ts-line` | All borders |
| `$ts-ink` / `$ts-ink-2` / `$ts-ink-3` | Text: primary / secondary / muted |
| `$ts-orange` (`primary`) | Accent: active, selected, primary action |
| `success` `warning` `serious` `danger` `info` `violet` `secondary` | Status (good / amber / serious / red / blue / AI / neutral) |

In SCSS, use `$ts-*`. In plain CSS, use `var(--ts-*)`.
Text and background colours have Bootstrap classes:

- `text-body` = ink, `text-body-secondary` = ink-2, `text-body-tertiary` = ink-3
- `bg-body` = page, `bg-body-secondary` = panel, `bg-body-tertiary` = panel-2
- `text-{status}` and `bg-{status}`, for example `text-serious`

## Bootstrap components, already themed

`Button` · `Form.*` · `Table` · `Card` · `Navbar` · `Nav` (tabs are underline style) · `Dropdown` · `Modal` ·
`Toast` · `Alert` · `Badge` · `ProgressBar` · `Pagination` · `ListGroup` · `Accordion` · `Offcanvas` · `Tooltip`.

## Theme additions

| Need | Use |
|---|---|
| Secondary button | `variant="ghost"` |
| Segmented control | `<ButtonGroup>` + `variant="ghost"` buttons with `active` |
| Count inside a button | `<Badge bg="">3</Badge>` inside the `Button` |
| Square icon button | `className="btn-icon"` |
| Page header | `.ts-page-header` > `.ts-eyebrow`, `h1`, `.ts-page-subtitle`, `.ts-page-actions` |
| Section title / note | `.ts-section-title`, `.ts-note` |
| KPI tile | `Card.ts-kpi` > `.ts-kpi-label`, `.ts-kpi-value` (with `<small>` unit), `ProgressBar.progress-thin`, `.ts-kpi-meta` |
| Big number | `.ts-number .ts-number-{sm\|md\|lg\|xl}` |
| Clickable card | `.card-clickable` (with `.ts-drill` hint) |
| Status edge on a card | `.card-status-{status}`, or `.card-accent` for orange |
| Inner box | `.card-inset` |
| Table in a rounded panel | wrap it in `.ts-table-panel` |
| Status edge on a table row | `<tr className="row-status-{status}">`, add `table-danger` to tint the row |
| Status pill | `<Badge bg="" className="badge-outline-{status}">`, or `badge-outline-muted` |
| Soft chip | `<Badge bg="" className="badge-soft-{status}">` |
| Live chip | `<span className="ts-chip text-success"><i className="ts-dot ts-dot-live" />Live</span>` |
| Banner | `<Alert variant="{status}">` with `<b>` for the coloured lead text |
| Toolbar above a list | `.ts-toolbar` |
| Sub-nav strip | `.ts-subnav` wrapping `<Nav variant="tabs">` |
| Sidebar | `<Offcanvas responsive="lg" className="ts-sidebar">` + `Nav className="flex-column"` |
| Read-only form | `.ts-readonly` |
| Steps | `<ol className="ts-steps"><li className="ts-step done">…` (`done` / `active`) |
| Legend | `.ts-legend` > `<span className="text-{status}"><i className="ts-swatch" /> Label</span>` |
| Empty state | `.ts-empty` |
| Bar thickness | `progress-thin` 5px · `progress-sm` 6px · default 8px · `progress-lg` 14px |

**Utilities added to Bootstrap:** `fs-xs`, `fs-sm`, `fw-title`, `font-tabular`, `ls-tight|wide|wider`, `cursor-pointer`.

## Example

```jsx
<Card className="ts-kpi card-clickable">
  <Card.Body>
    <div className="ts-kpi-label">OEE</div>
    <div className="ts-kpi-value">68.4<small>%</small></div>
    <ProgressBar now={68} className="progress-thin" />
    <div className="ts-kpi-meta">
      <span>Target 75%</span>
      <span className="ts-delta-down">▼ 2.1</span>
    </div>
  </Card.Body>
</Card>
```
