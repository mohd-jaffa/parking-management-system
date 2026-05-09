import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { restoreAuth, logout } from './redux/authSlice'
import api from './services/api'
import LandingPage from './pages/LandingPage'
import RegisterPage from './pages/RegisterPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import SlotsPage from './pages/SlotsPage'
import TicketsPage from './pages/TicketsPage'
import VehiclesPage from './pages/VehiclesPage'
import Navbar from './components/Navbar'
import ProtectedRoute from './routes/ProtectedRoute'
import './App.css'

function App() {
  const dispatch = useDispatch()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token')
      console.log('[Auth] App load — checking token in localStorage:', token ? 'found' : 'not found')

      if (!token) {
        console.log('[Auth] No token — skipping profile fetch')
        setAuthChecked(true)
        return
      }

      try {
        console.log('[Auth] Fetching profile to validate token…')
        const response = await api.get('/api/auth/profile')
        const user = response.data.user

        console.log('[Auth] Profile fetch success — restoring auth state:', user)
        dispatch(restoreAuth({ token, user }))
      } catch (err) {
        console.error('[Auth] Token invalid or profile fetch failed:', err.response?.data || err.message)
        console.log('[Auth] Clearing invalid token — logging out automatically')
        localStorage.removeItem('token')
        dispatch(logout())
      } finally {
        setAuthChecked(true)
      }
    }

    validateToken()
  }, [dispatch])

  if (!authChecked) {
    return null
  }

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/slots"
          element={
            <ProtectedRoute>
              <SlotsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <TicketsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <VehiclesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
