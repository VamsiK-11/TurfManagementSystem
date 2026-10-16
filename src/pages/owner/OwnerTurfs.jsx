import { useState, useEffect } from 'react'
import { turfAPI } from '../../services/api'
import Notification from '../../components/Notification'

export default function OwnerTurfs() {
  const [turfs, setTurfs] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTurf, setEditingTurf] = useState(null)
  const [notification, setNotification] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    imageUrl: '',
    startTime: '',
    endTime: '',
    sports: [{ sportName: '', price: '' }]
  })

  const availableSports = [
    'Football', 'Cricket', 'Basketball', 'Tennis', 'Badminton', 
    'Volleyball', 'Hockey', 'Table Tennis', 'Squash', 'Futsal'
  ]

  useEffect(() => {
    fetchTurfs()
  }, [])

  const fetchTurfs = async () => {
    try {
      const response = await turfAPI.getOwnerTurfs()
      setTurfs(response.data)
    } catch (error) {
      console.error('Failed to fetch turfs')
    }
  }



  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTurf) {
        await turfAPI.updateTurf(editingTurf.id, formData)
        setNotification({ message: 'Turf updated successfully', type: 'success' })
      } else {
        await turfAPI.createTurf(formData)
        setNotification({ message: 'Turf added successfully', type: 'success' })
      }
      setShowForm(false)
      resetForm()
      fetchTurfs()
    } catch (error) {
      setNotification({ message: 'Failed to save turf', type: 'error' })
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this turf?')) {
      try {
        await turfAPI.deleteTurf(id)
        fetchTurfs()
        setNotification({ message: 'Turf deleted successfully', type: 'success' })
      } catch (error) {
        setNotification({ message: 'Failed to delete turf', type: 'error' })
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      imageUrl: '',
      startTime: '',
      endTime: '',
      sports: [{ sportName: '', price: '' }]
    })
    setEditingTurf(null)
  }

  const addSport = () => {
    // Check if there's already an empty sport entry
    const hasEmptySport = formData.sports.some(sport => !sport.sportName || !sport.price)
    if (!hasEmptySport && formData.sports.length < availableSports.length) {
      setFormData({
        ...formData,
        sports: [...formData.sports, { sportName: '', price: '' }]
      })
    }
  }

  const updateSport = (index, field, value) => {
    const newSports = [...formData.sports]
    
    // If updating sportName, check for duplicates
    if (field === 'sportName' && value) {
      const isDuplicate = newSports.some((sport, i) => i !== index && sport.sportName === value)
      if (isDuplicate) {
        alert('This sport is already added!')
        return
      }
    }
    
    newSports[index][field] = value
    setFormData({ ...formData, sports: newSports })
  }

  const removeSport = (index) => {
    if (formData.sports.length > 1) {
      const newSports = formData.sports.filter((_, i) => i !== index)
      setFormData({ ...formData, sports: newSports })
    }
  }

  return (
    <div className="p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-heading font-bold text-gray-800">My Turfs</h1>
          <div className="flex gap-3">

            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add Turf
            </button>
          </div>
        </div>


      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[450px] max-h-[500px] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-heading font-bold mb-4 text-gray-800">{editingTurf ? 'Edit' : 'Add'} Turf</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Turf Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
              <input
                type="url"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex gap-2 mb-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-gray-700">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium mb-2 text-gray-700">Sports & Prices</label>
                {formData.sports.map((sport, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={sport.sportName}
                      onChange={(e) => updateSport(index, 'sportName', e.target.value)}
                      className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Sport</option>
                      {availableSports.map(sportName => (
                        <option key={sportName} value={sportName}>{sportName}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Price"
                      value={sport.price}
                      onChange={(e) => updateSport(index, 'price', e.target.value)}
                      className="w-24 p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    {formData.sports.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSport(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Remove Sport"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                {formData.sports.length < availableSports.length && !formData.sports.some(sport => !sport.sportName || !sport.price) && (
                  <button
                    type="button"
                    onClick={addSport}
                    className="text-blue-500 text-sm hover:underline"
                  >
                    + Add Sport
                  </button>
                )}
              </div>
              
              <div className="flex gap-2">
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); setEditingTurf(null); resetForm(); }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {turfs.map((turf) => (
          <div key={turf.id} className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                {turf.imageUrl && (
                  <img 
                    src={turf.imageUrl} 
                    alt={turf.name}
                    className="w-24 h-24 object-cover rounded"
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                <div>
                  <h3 className="text-xl font-heading font-semibold">{turf.name}</h3>
                  <p className="font-display text-gray-600">{turf.location}</p>
                  <p className="text-sm font-display text-gray-500">Available: {turf.startTime} - {turf.endTime}</p>
                  <div className="mt-2">
                    {turf.sports?.map((sport, index) => (
                      <span key={index} className="inline-block bg-gray-100 px-2 py-1 text-sm rounded mr-2">
                        {sport.sportName}: ₹{sport.price}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded text-sm font-medium mb-2 ${
                  turf.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  turf.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {turf.status}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => { 
                      setEditingTurf(turf); 
                      setFormData({
                        name: turf.name,
                        location: turf.location,
                        imageUrl: turf.imageUrl || '',
                        startTime: turf.startTime,
                        endTime: turf.endTime,
                        sports: turf.sports ? [...turf.sports] : [{ sportName: '', price: '' }]
                      }); 
                      setShowForm(true); 
                    }}
                    className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 group"
                    title="Edit Turf"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(turf.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                    title="Delete Turf"
                  >
                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={() => setNotification(null)} 
        />
      )}
    </div>
  )
}