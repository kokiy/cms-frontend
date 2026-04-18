import { Navigate, useLocation } from 'react-router-dom'
import { storeSelector } from '../stores'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const token = storeSelector.use.token()
  const isAuthenticated = !!token

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
