import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import 'bootstrap-icons/font/bootstrap-icons.min.css'
import '@/assets/scss/theme.scss'

import App from '@/App'
import { applyTheme, getStoredTheme } from '@/utils/theme'

// Last used theme right away; App then applies the user's saved theme from the API
applyTheme(getStoredTheme())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
