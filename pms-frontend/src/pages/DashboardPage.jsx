import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/authSlice'

function DashboardPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    console.log('[Logout] Clearing localStorage token')
    localStorage.removeItem('token')

    console.log('[Logout] Clearing Redux auth state')
    dispatch(logout())

    console.log('[Logout] Redirecting to /login')
    navigate('/login')
  }

  return (
    <section className="page-center">
      <div className="dashboard-card">
        <h2 className="dashboard-title">Dashboard</h2>
        <div className="user-info">
          <div className="info-row">
            <span className="info-label">Name</span>
            <span className="info-value">{user?.name}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email</span>
            <span className="info-value">{user?.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Role</span>
            <span className="info-value role-badge">{user?.role}</span>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </section>
  )
}

export default DashboardPage
