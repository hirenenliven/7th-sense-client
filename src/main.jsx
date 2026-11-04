import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@fontsource-variable/roboto'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import '@/assets/scss/theme.scss'

import App from '@/App'
import { THEME } from '@/constants/app'
import { ROUTES } from '@/constants/routes'
import { takeLoginAsFromUrl } from '@/utils/loginAs'
import { applyTheme, forceTheme, getStoredTheme } from '@/utils/theme'

// Last used theme before the first render (no dark flash for light users);
// App then applies the user's theme once the session is known.
// The login screen is always dark (Login forces it too, and releases it on leaving).
if (window.location.pathname === ROUTES.LOGIN) forceTheme(THEME.DARK)

// A "log in as customer" tab opens at /#loginAs=<key>: keep the key for this tab, drop the hash
takeLoginAsFromUrl()

applyTheme(getStoredTheme()).finally(() =>
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  ),
)
