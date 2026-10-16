import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { turfAPI } from '../../services/api'

export default function UserTurfs() {
  const [turfs, setTurfs] = useState([])
  const [filteredTurfs, setFilteredTurfs] = useState([])
  const [sportFilter, setSportFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTurfs()
  }, [])

  useEffect(() => {
    if (sportFilter) {
      setFilteredTurfs(turfs.filter(turf => 
        turf.sports?.some(sport => 
          sport.sportName.toLowerCase().includes(sportFilter.toLowerCase())
        )
      ))
    } else {
      setFilteredTurfs(turfs)
    }
  }, [turfs, sportFilter])

  const fetchTurfs = async () => {
    try {
      const response = await turfAPI.getApprovedTurfs()
      console.log('Turfs data:', response.data)
      setTurfs(response.data)
    } catch (error) {
      console.error('Failed to fetch turfs')
    } finally {
      setLoading(false)
    }
  }

  const handleBookTurf = (turf) => {
    navigate(`/book/${turf.id}`, { state: { turf } })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading turfs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-heading font-bold text-gray-800">Available Turfs</h1>
              <p className="text-gray-600 mt-1">Book your preferred turf</p>
            </div>
            <input
              type="text"
              placeholder="Filter by sport..."
              value={sportFilter}
              onChange={(e) => setSportFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTurfs.map((turf) => (
            <div key={turf.id} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <div className="relative">
                <img 
                  src={turf.imageUrl || 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=200&fit=crop'} 
                  alt={turf.name}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                  Available
                </span>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-heading font-bold text-gray-800 mb-2">{turf.name}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-2">📍</span>
                    <span>{turf.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <span className="mr-2">🕐</span>
                    <span>{turf.startTime} - {turf.endTime}</span>
                  </div>
                  {turf.sports && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {turf.sports.slice(0, 3).map((sport, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {sport.sportName}: ₹{sport.price}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => handleBookTurf(turf)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded font-medium transition-colors"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredTurfs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🏟️</div>
            <h3 className="text-lg font-heading font-bold text-gray-600 mb-1">No Turfs Found</h3>
            <p className="text-gray-500">Try adjusting your search filter</p>
          </div>
        )}
      </div>
    </div>
  )
}