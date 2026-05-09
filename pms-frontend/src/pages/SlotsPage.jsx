import { useState, useEffect } from 'react'
import api from '../services/api'

function SlotsPage() {
  const [slots, setSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [slotsError, setSlotsError] = useState('')

  const [slotNumber, setSlotNumber] = useState('')
  const [slotType, setSlotType] = useState('car')
  const [addError, setAddError] = useState('')
  const [addSuccess, setAddSuccess] = useState('')
  const [adding, setAdding] = useState(false)

  const fetchSlots = async () => {
    setLoadingSlots(true)
    setSlotsError('')
    console.log('[Slots] Fetching all slots')
    try {
      const res = await api.get('/api/slots')
      console.log('[Slots] Fetch success:', res.data)
      setSlots(res.data.parkingSlots)
    } catch (err) {
      console.error('[Slots] Fetch error:', err.response?.data || err.message)
      setSlotsError(err.response?.data?.message || 'Failed to load slots')
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [])

  const handleAddSlot = async (e) => {
    e.preventDefault()
    setAddError('')
    setAddSuccess('')
    setAdding(true)
    const payload = { slotNumber: Number(slotNumber), slotType }
    console.log('[Slots] Creating slot:', payload)
    try {
      const res = await api.post('/api/slots', payload)
      console.log('[Slots] Create success:', res.data)
      setAddSuccess(`Slot #${res.data.parkingSlot.slotNumber} created successfully`)
      setSlotNumber('')
      setSlotType('car')
      fetchSlots()
    } catch (err) {
      console.error('[Slots] Create error:', err.response?.data || err.message)
      const data = err.response?.data
      setAddError(data?.errors?.join(' ') || data?.message || 'Failed to create slot')
    } finally {
      setAdding(false)
    }
  }

  const typeLabel = { bike: 'Bike', car: 'Car', truck: 'Truck' }

  return (
    <div className="split-page">
      <div className="split-panel">
        <h2 className="panel-title">Add Slot</h2>
        <form onSubmit={handleAddSlot} className="auth-form">
          <div className="form-group">
            <label htmlFor="slotNumber">Slot Number</label>
            <input
              id="slotNumber"
              type="number"
              min="1"
              value={slotNumber}
              onChange={(e) => setSlotNumber(e.target.value)}
              placeholder="e.g. 101"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="slotType">Slot Type</label>
            <select
              id="slotType"
              value={slotType}
              onChange={(e) => setSlotType(e.target.value)}
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
            {adding ? 'Adding…' : 'Add Slot'}
          </button>
        </form>
      </div>

      <div className="split-divider" />

      <div className="split-panel">
        <div className="panel-header">
          <h2 className="panel-title">Parking Slots</h2>
          <button className="btn-refresh" onClick={fetchSlots}>Refresh</button>
        </div>

        {loadingSlots && <p className="panel-info">Loading slots…</p>}
        {slotsError && <p className="form-error">{slotsError}</p>}

        {!loadingSlots && slots.length === 0 && !slotsError && (
          <p className="panel-info">No slots found.</p>
        )}

        {slots.length > 0 && (
          <div className="slots-grid">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className={`slot-card ${slot.isOccupied ? 'slot-occupied' : 'slot-free'}`}
              >
                <span className="slot-number">#{slot.slotNumber}</span>
                <span className="slot-type-badge">{typeLabel[slot.slotType]}</span>
                <span className="slot-status">{slot.isOccupied ? 'Occupied' : 'Free'}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SlotsPage
