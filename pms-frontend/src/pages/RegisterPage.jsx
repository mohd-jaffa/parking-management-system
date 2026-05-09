import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

function RegisterPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const payload = { name, email, password }
    console.log('[Register] Request payload:', payload)

    try {
      const response = await api.post('/api/auth/register', payload)
      console.log('[Register] API success:', response.data)
      navigate('/login')
    } catch (err) {
      console.error('[Register] API failure:', err.response?.data || err.message)
      const data = err.response?.data
      if (data?.errors?.length) {
        setError(data.errors.join(' '))
      } else {
        setError(data?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page-center">
      <div className="form-card">
        <h2 className="form-title">Create Account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
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
            {loading ? 'Creating account…' : 'Register'}
          </button>
          <p className="form-footer">
            Already have an account?{' '}
            <span className="form-link" onClick={() => navigate('/login')}>
              Sign in
            </span>
          </p>
        </form>
      </div>
    </section>
  )
}

export default RegisterPage
