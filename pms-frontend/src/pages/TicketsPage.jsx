import { useState, useEffect } from 'react'
import api from '../services/api'

function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [ticketsError, setTicketsError] = useState('')

  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const [vehicleNumber, setVehicleNumber] = useState('')
  const [vehicleType, setVehicleType] = useState('car')
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')
  const [adding, setAdding] = useState(false)

  const [exitingId, setExitingId] = useState(null)

  const fetchTickets = async (status) => {
    setLoadingTickets(true)
    setTicketsError('')
    const query = status && status !== 'all' ? `?status=${status}` : ''
    console.log('[Tickets] Fetching tickets with filter:', status || 'all')
    try {
      const res = await api.get(`/api/tickets${query}`)
      console.log('[Tickets] Fetch success:', res.data)
      setTickets(res.data.parkingTickets)
    } catch (err) {
      console.error('[Tickets] Fetch error:', err.response?.data || err.message)
      setTicketsError(err.response?.data?.message || 'Failed to load tickets')
    } finally {
      setLoadingTickets(false)
    }
  }

  useEffect(() => {
    fetchTickets(statusFilter)
  }, [statusFilter])

  const handleAddTicket = async (e) => {
    e.preventDefault()
    setAddError('')
    setAddSuccess('')
    setAdding(true)
    const payload = { vehicleNumber: vehicleNumber.trim().toUpperCase(), vehicleType }
    console.log('[Tickets] Creating ticket:', payload)
    try {
      const res = await api.post('/api/tickets', payload)
      console.log('[Tickets] Create success:', res.data)
      setAddSuccess(`Ticket created for ${payload.vehicleNumber}`)
      setVehicleNumber('')
      setVehicleType('car')
      fetchTickets(statusFilter)
    } catch (err) {
      console.error('[Tickets] Create error:', err.response?.data || err.message)
      const data = err.response?.data
      setAddError(data?.errors?.join(' ') || data?.message || 'Failed to create ticket')
    } finally {
      setAdding(false)
    }
  }

  const handleExit = async (ticketId) => {
    setExitingId(ticketId)
    console.log('[Tickets] Exiting vehicle for ticket:', ticketId)
    try {
      const res = await api.put(`/api/tickets/exit/${ticketId}`)
      console.log('[Tickets] Exit success:', res.data)
      fetchTickets(statusFilter)
    } catch (err) {
      console.error('[Tickets] Exit error:', err.response?.data || err.message)
    } finally {
      setExitingId(null)
    }
  }

  const filtered = tickets.filter((t) => {
    const vNum = t.vehicleNumber?.vehicleNumber?.toLowerCase() || ''
    return vNum.includes(search.toLowerCase())
  })

  const formatTime = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString()
  }

  return (
    <div className="split-page">
      <div className="split-panel">
        <h2 className="panel-title">New Ticket</h2>
        <form onSubmit={handleAddTicket} className="auth-form">
          <div className="form-group">
            <label htmlFor="vehicleNumber">Vehicle Number</label>
            <input
              id="vehicleNumber"
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              placeholder="e.g. TN01AB1234"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="vehicleType">Vehicle Type</label>
            <select
              id="vehicleType"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
              className="form-select"
            >
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="truck">Truck</option>
            </select>
          </div>
          {addError && <p className="form-error">{addError}</p>}
          {addSuccess && <p className="form-success">{addSuccess}</p>}
          <button type="submit" className="btn-primary" disabled={adding}>
            {adding ? 'Creating…' : 'Create Ticket'}
          </button>
        </form>
      </div>

      <div className="split-divider" />

      <div className="split-panel split-panel-scroll">
        <div className="panel-header">
          <h2 className="panel-title">Tickets</h2>
          <button className="btn-refresh" onClick={() => fetchTickets(statusFilter)}>Refresh</button>
        </div>

        <div className="tickets-filters">
          <input
            type="text"
            className="filter-search"
            placeholder="Search vehicle number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-tabs">
            {['all', 'active', 'inactive'].map((s) => (
              <button
                key={s}
                className={`filter-tab ${statusFilter === s ? 'filter-tab-active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loadingTickets && <p className="panel-info">Loading tickets…</p>}
        {ticketsError && <p className="form-error">{ticketsError}</p>}

        {!loadingTickets && filtered.length === 0 && !ticketsError && (
          <p className="panel-info">No tickets found.</p>
        )}

        <div className="tickets-list">
          {filtered.map((ticket) => (
            <div key={ticket._id} className={`ticket-card ${ticket.isActive ? 'ticket-active' : 'ticket-inactive'}`}>
              <div className="ticket-row">
                <span className="ticket-num">#{ticket.ticketNumber}</span>
                <span className={`ticket-status-badge ${ticket.isActive ? 'badge-active' : 'badge-inactive'}`}>
                  {ticket.isActive ? 'Active' : 'Closed'}
                </span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">Vehicle</span>
                <span className="ticket-value">
                  {ticket.vehicleNumber?.vehicleNumber}
                  <span className="ticket-type-tag">{ticket.vehicleNumber?.vehicleType}</span>
                </span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">Slot</span>
                <span className="ticket-value">
                  #{ticket.slotNumber?.slotNumber} ({ticket.slotNumber?.slotType})
                </span>
              </div>
              <div className="ticket-row">
                <span className="ticket-label">Entry</span>
                <span className="ticket-value">{formatTime(ticket.entryTime)}</span>
              </div>
              {!ticket.isActive && (
                <>
                  <div className="ticket-row">
                    <span className="ticket-label">Exit</span>
                    <span className="ticket-value">{formatTime(ticket.exitTime)}</span>
                  </div>
                  <div className="ticket-row">
                    <span className="ticket-label">Amount</span>
                    <span className="ticket-value ticket-amount">₹{ticket.amount}</span>
                  </div>
                </>
              )}
              {ticket.isActive && (
                <button
                  className="btn-exit"
                  onClick={() => handleExit(ticket._id)}
                  disabled={exitingId === ticket._id}
                >
                  {exitingId === ticket._id ? 'Processing…' : 'Exit Vehicle'}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TicketsPage
