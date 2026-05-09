import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../redux/authSlice'

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    console.log('[Navbar] Logout — clearing localStorage and Redux state')
    localStorage.removeItem('token')
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">PMS</Link>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/slots" className="nav-link">Slots</Link>
            <Link to="/tickets" className="nav-link">Tickets</Link>
            <Link to="/vehicles" className="nav-link">Vehicles</Link>
            <span className="nav-user">{user?.name}</span>
            <button className="nav-logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
