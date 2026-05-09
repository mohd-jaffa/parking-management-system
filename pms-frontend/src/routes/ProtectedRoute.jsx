import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth)

  console.log('[ProtectedRoute] Auth check — isAuthenticated:', isAuthenticated)

  if (!isAuthenticated) {
    console.log('[ProtectedRoute] Unauthorized — redirecting to /login')
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
