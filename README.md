# 7th Sense Client

React 19 + Vite + JavaScript + Bootstrap 5 (via `react-bootstrap`). No Tailwind.

Theme: SCSS on Bootstrap — see [THEME.md](THEME.md). Sample page at `/theme`.

## Scripts

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run preview
npm run lint
npm run build:theme  # standalone dist-theme/theme.css
```

## Environment

Copy `.env.example` to `.env`. The app calls the Go API (`7th-sense-server`) at `VITE_API_BASE_URL=/api/v1`; in dev, Vite proxies `/api` to `API_PROXY_TARGET` (default `http://localhost:8080`) because the API sends no CORS headers. Start the server before `npm run dev`. Only `VITE_`-prefixed variables reach the browser; read them through `src/config/env.js`.

## Authentication

`/login` is the only public screen; every other route sits behind `routes/ProtectedRoute.jsx` and sends
logged-out users to the login page (then back to where they were). The server sets an **HttpOnly session
cookie** at login, so no token is ever stored or readable in the browser. `AuthProvider` (`context/`)
restores the session with `GET /auth/me` on load; `useAuth()` returns `{ user, isChecking, login, logout,
hasRole }`. Any `401` from the API (session expired, user deactivated) signs the user out.

Roles: pages in `routes/pages.jsx` and items in `constants/navigation.js` can take `roles` (e.g.
`ADMIN_ONLY` from `constants/app.js`). Others don't see those menu items and get a 403 page on direct
links. This only hides UI; the API enforces the same rules.

## Structure

```
src/
├── assets/
│   ├── images/
│   └── scss/                 # theme: _variables, _components, theme.scss (see THEME.md)
├── components/
│   ├── common/               # reusable UI (Loader, ...)
│   └── layout/               # MainLayout, Topbar, Sidebar, SidebarItem, Footer
├── config/env.js             # env variables
├── constants/              # routes, navigation (sidebar menu), app settings
├── context/                # AuthProvider (logged-in user), SidebarProvider (open/close state)
├── hooks/                  # useAuth, useSidebar, useMediaQuery, useFetch
├── pages/                    # one folder per page
├── routes/                   # AppRoutes (lazy loaded), pages.jsx, ProtectedRoute
├── services/                 # apiClient (axios + 401 handling), authService, one file per API
├── utils/                    # helper functions
├── App.jsx
└── main.jsx                  # theme + Router setup
```

Imports use the `@` alias for `src` (e.g. `import Loader from '@/components/common/Loader'`).
