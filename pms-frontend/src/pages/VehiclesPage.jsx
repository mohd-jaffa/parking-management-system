import { useState, useEffect } from 'react'
import api from '../services/api'

function VehiclesPage() {
  const [vehicles, setVehicles] = useState([])
  const [loadingVehicles, setLoadingVehicles] = useState(false)
  const [vehiclesError, setVehiclesError] = useState('')
  const [search, setSearch] = useState('')

  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loadingTickets, setLoadingTickets] = useState(false)
  const [ticketsError, setTicketsError] = useState('')

  const fetchVehicles = async () => {
    setLoadingVehicles(true)
    setVehiclesError('')
    console.log('[Vehicles] Fetching all vehicles')
    try {
      const res = await api.get('/api/vehicles')
      console.log('[Vehicles] Fetch success:', res.data)
      setVehicles(res.data.vehicles)
    } catch (err) {
      console.error('[Vehicles] Fetch error:', err.response?.data || err.message)
      setVehiclesError(err.response?.data?.message || 'Failed to load vehicles')
    } finally {
      setLoadingVehicles(false)
    }
  }

  const fetchTicketHistory = async (vehicle) => {
    setSelectedVehicle(vehicle)
    setTickets([])
    setTicketsError('')
    setLoadingTickets(true)
    console.log('[Vehicles] Fetching ticket history for vehicle:', vehicle.vehicleNumber)
    try {
      const res = await api.get(`/api/vehicles/${vehicle._id}/tickets`)
      console.log('[Vehicles] Ticket history success:', res.data)
      setTickets(res.data.tickets)
    } catch (err) {
      console.error('[Vehicles] Ticket history error:', err.response?.data || err.message)
      setTicketsError(err.response?.data?.message || 'Failed to load ticket history')
    } finally {
      setLoadingTickets(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  const filtered = vehicles.filter((v) =>
    v.vehicleNumber.toLowerCase().includes(search.toLowerCase())
  )

  const formatTime = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString()
  }

  const typeLabel = { bike: 'Bike', car: 'Car', truck: 'Truck' }

  return (
    <div className="split-page">
      <div className="split-panel split-panel-scroll">
        <div className="panel-header">
          <h2 className="panel-title">Vehicles</h2>
          <button className="btn-refresh" onClick={fetchVehicles}>Refresh</button>
        </div>

        <div className="tickets-filters">
          <input
            type="text"
            className="filter-search"
            placeholder="Search vehicle number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loadingVehicles && <p className="panel-info">Loading vehicles…</p>}
        {vehiclesError && <p className="form-error">{vehiclesError}</p>}
        {!loadingVehicles && filtered.length === 0 && !vehiclesError && (
          <p className="panel-info">No vehicles found.</p>
        )}

        <div className="vehicles-list">
          {filtered.map((vehicle) => (
            <div
              key={vehicle._id}
              className={`vehicle-card ${selectedVehicle?._id === vehicle._id ? 'vehicle-card-active' : ''}`}
              onClick={() => fetchTicketHistory(vehicle)}
            >
              <div className="vehicle-card-main">
                <span className="vehicle-number">{vehicle.vehicleNumber}</span>
                <span className="slot-type-badge">{typeLabel[vehicle.vehicleType]}</span>
              </div>
              <span className="vehicle-since">Registered {formatTime(vehicle.createdAt)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="split-divider" />

      <div className="split-panel split-panel-scroll">
        {!selectedVehicle ? (
          <div className="history-empty">
            <p className="panel-info">Select a vehicle to view its ticket history.</p>
          </div>
        ) : (
          <>
            <div className="panel-header">
              <div className="history-heading">
                <h2 className="panel-title" style={{ margin: 0 }}>
                  {selectedVehicle.vehicleNumber}
                </h2>
                <span className="slot-type-badge">{typeLabel[selectedVehicle.vehicleType]}</span>
              </div>
              <button className="btn-refresh" onClick={() => fetchTicketHistory(selectedVehicle)}>Refresh</button>
            </div>

            {loadingTickets && <p className="panel-info">Loading history…</p>}
            {ticketsError && <p className="form-error">{ticketsError}</p>}
            {!loadingTickets && tickets.length === 0 && !ticketsError && (
              <p className="panel-info">No tickets found for this vehicle.</p>
            )}

            <div className="tickets-list">
              {tickets.map((ticket) => (
                <div key={ticket._id} className={`ticket-card ${ticket.isActive ? 'ticket-active' : 'ticket-inactive'}`}>
                  <div className="ticket-row">
                    <span className="ticket-num">#{ticket.ticketNumber}</span>
                    <span className={`ticket-status-badge ${ticket.isActive ? 'badge-active' : 'badge-inactive'}`}>
                      {ticket.isActive ? 'Active' : 'Closed'}
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
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VehiclesPage
