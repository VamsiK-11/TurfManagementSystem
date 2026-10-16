import { useState, useEffect } from 'react'
import { turfAPI } from '../../services/api'
import Notification from '../../components/Notification'

export default function AdminTurfs() {
  const [turfs, setTurfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchTurfs()
  }, [])

  const fetchTurfs = async () => {
    try {
      const response = await turfAPI.getAllTurfsAdmin()
      setTurfs(response.data)
    } catch (error) {
      console.error('Failed to fetch turfs')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (turfId, status) => {
    try {
      await turfAPI.updateTurfStatus(turfId, status)
      fetchTurfs()
      setNotification({ message: `Turf ${status.toLowerCase()} successfully`, type: 'success' })
    } catch (error) {
      setNotification({ message: 'Failed to update turf status', type: 'error' })
    }
  }

  const handleDeleteTurf = async (turfId, turfName) => {
    if (confirm(`Are you sure you want to delete turf: ${turfName}?`)) {
      try {
        await turfAPI.deleteTurfAdmin(turfId)
        fetchTurfs()
        setNotification({ message: 'Turf deleted successfully', type: 'success' })
      } catch (error) {
        setNotification({ message: 'Failed to delete turf', type: 'error' })
      }
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-6 shadow-xl">
        <h1 className="text-3xl font-heading font-bold mb-8 text-gray-800">Turf Management</h1>
        
        <div className="mb-6">
          <p className="text-gray-600 font-medium">Manage and moderate turf listings on the platform</p>
        </div>
        
        <div className="grid gap-6">
          {turfs.map((turf) => (
            <div key={turf.id} className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold text-gray-800 mb-2">{turf.name}</h3>
                  <p className="text-gray-600 mb-1">{turf.location}</p>
                  <p className="text-sm text-gray-500 mb-3">Available: {turf.startTime} - {turf.endTime}</p>
                  <div className="flex flex-wrap gap-2">
                    {turf.sports?.map((sport, index) => (
                      <span key={index} className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 px-3 py-1 text-sm rounded-full font-medium text-gray-700">
                        {sport.sportName}: ₹{sport.price}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-3 ml-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${
                    turf.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                    turf.status === 'REJECTED' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {turf.status}
                  </span>
                  <div className="flex items-center space-x-2">
                    {turf.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(turf.id, 'APPROVED')}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(turf.id, 'REJECTED')}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteTurf(turf.id, turf.name)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                      title="Delete Turf"
                    >
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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