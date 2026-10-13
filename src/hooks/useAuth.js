import { useContext } from 'react'
import AuthContext from '@/context/AuthContext'

// { user, isChecking, login, logout, hasRole } — see context/AuthProvider.jsx
export default function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
