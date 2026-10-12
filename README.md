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

Copy `.env.example` to `.env`. Only `VITE_`-prefixed variables are exposed; read them through `src/config/env.js`.

## Structure

```
src/
├── assets/
│   ├── images/
│   └── scss/                 # theme: _variables, _components, theme.scss (see THEME.md)
├── components/
│   ├── common/               # reusable UI (Loader, ...)
│   └── layout/               # Header, Footer, MainLayout
├── config/env.js             # env variables
├── constants/routes.js       # route paths
├── hooks/                    # custom hooks (useFetch)
├── pages/                    # one folder per page
├── routes/AppRoutes.jsx      # route definitions (lazy loaded)
├── services/apiClient.js     # axios instance + interceptors
├── utils/                    # helper functions
├── App.jsx
└── main.jsx                  # theme + Router setup
```

Imports use the `@` alias for `src` (e.g. `import Loader from '@/components/common/Loader'`).
