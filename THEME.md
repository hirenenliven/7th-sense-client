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
- **Standalone CSS:** `npm run build:theme` writes `dist-theme/theme.css`, `theme.min.css` and the light `theme-light.css` / `theme-light.min.css`.

## Light theme

Dark is the default. Each user can choose Dark or Light (`user_profiles.theme`: `dark_version` / `light_version`,
set on the customer form). The light theme is the **same SCSS built again with light tokens**:

| File | Purpose |
|---|---|
| `src/assets/scss/_tokens-light.scss` | Light values of the colour tokens (surfaces, ink, accent, status, greys, shadows) |
| `src/assets/scss/theme-light.scss` | Imports `tokens-light`, then `theme` |
| `src/utils/theme.js` | `applyTheme()` loads `theme-light.scss?inline` on demand and adds it after the dark stylesheet; `refreshUserTheme()` applies the logged-in user's theme (`GET /me`, called by `AuthProvider` after login / session restore) |
| `src/hooks/useTheme.js` | The theme on screen; re-renders when it changes |

The colour tokens in `_variables.scss` are `!default`, so the light file sets them first. Bootstrap bakes colours
into SVG icons and `to-rgb()` values at compile time, which is why this is a second build and not CSS variables.
**Switching:** the sun / moon button in the top bar calls `chooseTheme(theme)`. It shows the theme at once and saves it
to the user's profile (`PUT /me/theme`, open to every logged-in user), so it follows them to other browsers and devices;
a failed save shows an error toast. After login / session restore the profile theme is applied.
`main.jsx` applies the last theme (`ts.theme`) before the first render, so reloads do not flash the other theme.
**Login is always dark:** `Login` calls `forceTheme(THEME.DARK)` (and `main.jsx` does on `/login` before the first render).
A forced theme only changes what is on screen, never the user's stored or saved theme; leaving the page calls
`forceTheme(null)` and the user's theme comes back.

Pages need nothing special: use the tokens and Bootstrap classes as usual and both themes follow.
A new colour token must get a light value in `_tokens-light.scss` (and `!default` in `_variables.scss`).

## Rules

1. **No inline styles, no hex/px values in pages.** Use Bootstrap classes, theme classes or tokens.
   The only exception is the width that `ProgressBar now={…}` sets from data.
2. **Use Bootstrap first** (`Card`, `Table`, `Badge`, `Alert`, `Modal`, utilities such as `d-flex gap-2 mb-3`).
   Use a `ts-*` class only when Bootstrap has nothing equivalent.
3. **New colours or sizes go into `_variables.scss`** as a token, and are then used by name.
4. **Use the full page width.** Every container (`Container`, `container-fluid`, `.ts-page`) fills the screen,
   with only a small edge gutter: 12px on phones, 16px from `md`, 20px from `xl` (`$ts-gutter-x-*`).
   Never add a `max-width` or extra side `px-*`/`mx-*` to a page wrapper. Fill wide screens with
   more grid columns (`xl={4}`, `xxl={6}`) instead of leaving empty margins.
5. **Responsive:** use the Bootstrap grid (`<Row xs={1} sm={2} xl={4}>`) and responsive utilities (`d-md-flex`).

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
| Read-only form | `.ts-readonly` |
| Steps | `<ol className="ts-steps"><li className="ts-step done">…` (`done` / `active`) |
| Legend | `.ts-legend` > `<span className="text-{status}"><i className="ts-swatch" /> Label</span>` |
| Empty state | `.ts-empty` |
| Bar thickness | `progress-thin` 5px · `progress-sm` 6px · default 8px · `progress-lg` 14px |

**Utilities added to Bootstrap:** `fs-xs`, `fs-sm`, `fw-title`, `font-tabular`, `ls-tight|wide|wider`, `cursor-pointer`.

## App shell (top bar + sidebar)

`MainLayout` renders the shell. **Pages never render their own navigation.**

```
.ts-shell(.sidebar-open)
├── .ts-topbar        brand · Menu toggle · clock · language · notifications · user
├── .ts-sidebar       sections → items → submenus (from constants/navigation.js)
├── .ts-sidebar-backdrop   mobile only
└── main.ts-content > .ts-page (your page) + .ts-footer
```

- **Menu button** toggles `sidebar-open`. On screens `lg` and wider the sidebar pushes the content aside and its open/closed state is remembered. Below `lg` it slides over the content with a backdrop, and closes on a link click, a backdrop click or Esc.
- **Adding a menu item:** add the path to `constants/routes.js` and the item to `constants/navigation.js`.
  The item has `{ key, label, icon: 'bi-…', path }`, or `children: [{ key, label, path }]` for a submenu.
  The route appears automatically with a *Coming soon* page. Once the screen is built, add it to `PAGES` in `routes/pages.jsx`.
- **State:** `useSidebar()` returns `{ isOpen, isDesktop, toggle, closeOnMobile }`.
- **Icons:** [Bootstrap Icons](https://icons.getbootstrap.com), e.g. `<i className="bi bi-cpu" aria-hidden="true" />`.
- **Tokens:** `$ts-sidebar-width`, `$ts-sidebar-bg`, `$ts-sidebar-transition`, `$ts-sidebar-icon-size`, `$ts-sidebar-sub-indent`.
- **Plain button** (borderless, used in the top bar): `variant="plain"`.

## Toasts (global notifications)

`<Toaster />` is mounted once in `App.jsx`. Call `toast` from anywhere: components, services or axios interceptors.

```js
import { toast } from '@/utils/toast'

toast.success('Customer saved')
toast.error(error.message, { title: 'Could not save customer' })
toast.warning('Please fix 3 highlighted fields.')
const id = toast.info('Uploading…', { duration: 0 }) // 0 = stays until dismissed
toast.dismiss(id)
```

- **Options:** `{ title, duration (ms), id }`. Calling again with the same `id` replaces that toast.
- **Default durations and titles** are `TOAST_DEFAULTS` in `constants/app.js`. Errors stay longest.
- **Behaviour:** toasts show top-right (full width on phones) with a coloured edge, an icon and a progress bar. The timer pauses on hover or focus. At most 5 are shown.

## Forms

Write forms with plain react-bootstrap markup, without wrapper components:

```jsx
<Form.Group as={Col} md={6} controlId="customer-email">
  <Form.Label className="required">Email</Form.Label>
  <Form.Control name="email" value={values.email} onChange={handleChange} isInvalid={!!errors.email} />
  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
</Form.Group>
```

- `Form.Label.required` adds a red `*`.
- Group fields into `Card`s with a `Card.Header` that has an icon and a title.
- Put the buttons in a `.ts-form-actions` bar, which sticks to the bottom of the screen. Include a `.ts-form-actions-note`.
- `.ts-file-preview` shows the selected file: thumbnail, name, size and a remove button.
- Shared validation rules are in `utils/validators.js`. Each form's own rules go next to the page, as in `pages/Customers/customerForm.js`.

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
