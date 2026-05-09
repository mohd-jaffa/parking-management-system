import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginSuccess } from '../redux/authSlice'
import api from '../services/api'

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = { email, password }
    console.log('[Login] Request payload:', payload)

    try {
      const response = await api.post('/api/auth/login', payload)
      const { token, user } = response.data

      console.log('[Login] API success:', response.data)

      localStorage.setItem('token', token)
      console.log('[Login] Token stored in localStorage:', token)

      dispatch(loginSuccess({ token, user }))
      navigate('/dashboard')
    } catch (err) {
      console.error('[Login] API failure:', err.response?.data || err.message)
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-center">
      <div className="form-card">
        <h2 className="form-title">Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
          <p className="form-footer">
            Don't have an account?{' '}
            <Link to="/register" className="form-link">Register</Link>
          </p>
        </form>
      </div>
    </section>
  )
}

export default LoginPage
