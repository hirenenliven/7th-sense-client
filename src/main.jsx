import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import '@fontsource-variable/roboto'
import 'bootstrap-icons/font/bootstrap-icons.min.css'
import '@/assets/scss/theme.scss'

import App from '@/App'
import { applyTheme, getStoredTheme } from '@/utils/theme'

// Last used theme before the first render (no dark flash for light users);
// App then applies the user's theme once the session is known
applyTheme(getStoredTheme()).finally(() =>
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  ),
)
