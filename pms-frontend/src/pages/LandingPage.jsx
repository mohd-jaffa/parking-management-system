import { useNavigate } from 'react-router-dom'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <section className="page-center">
      <div className="landing-card">
        <h1 className="landing-title">Parking Management System</h1>
        <p className="landing-desc">
          Manage parking slots, issue tickets, and track vehicle activity — all in one place.
        </p>
        <button className="btn-primary" onClick={() => navigate('/login')}>
          Login
        </button>
      </div>
    </section>
  )
}

export default LandingPage
