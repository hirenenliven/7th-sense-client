import { useEffect } from 'react'
import AppRoutes from '@/routes/AppRoutes'
import Toaster from '@/components/common/Toaster'
import { refreshUserTheme } from '@/utils/theme'

function App() {
  // Apply the logged-in user's saved theme
  useEffect(() => {
    refreshUserTheme()
  }, [])

  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}

export default App
