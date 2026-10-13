import AppRoutes from '@/routes/AppRoutes'
import Toaster from '@/components/common/Toaster'
import AuthProvider from '@/context/AuthProvider'
import OrgUserProvider from '@/context/OrgUserProvider'

// AuthProvider restores the session and applies the logged-in user's saved theme.
// OrgUserProvider holds the user an admin picked on the Masters (organization) screens.
function App() {
  return (
    <AuthProvider>
      <OrgUserProvider>
        <AppRoutes />
      </OrgUserProvider>
      <Toaster />
    </AuthProvider>
  )
}

export default App
