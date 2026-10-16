import { useState, useEffect } from 'react'
import { bookingAPI, turfAPI } from '../../services/api'
import CustomAlert from '../../components/CustomAlert'

export default function UserBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getUserBookings()
      const confirmedBookings = response.data.filter(booking => booking.status === 'CONFIRMED')
      
      // Fetch turf names for each booking
      const bookingsWithTurfNames = await Promise.all(
        confirmedBookings.map(async (booking) => {
          try {
            const turfResponse = await turfAPI.getTurf(booking.turfId)
            return { ...booking, turfName: turfResponse.data.name }
          } catch (error) {
            return { ...booking, turfName: `Turf ${booking.turfId}` }
          }
        })
      )
      
      setBookings(bookingsWithTurfNames)
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-700'
      case 'PENDING': return 'bg-yellow-100 text-yellow-700'
      case 'CANCELLED': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const handleCancelBooking = async (bookingId, turfName) => {
    if (confirm(`Cancel booking for ${turfName}?`)) {
      try {
        await bookingAPI.deleteBooking(bookingId)
        setAlert({ message: 'Booking cancelled successfully', type: 'success' })
        fetchBookings()
      } catch (error) {
        setAlert({ message: 'Failed to cancel booking', type: 'error' })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-6">
          <h1 className="text-2xl font-heading font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-600 mt-1">Your confirmed reservations</p>
        </div>
        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-white/10 backdrop-blur-sm rounded-lg">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-heading font-bold text-white mb-1">No Confirmed Bookings</h3>
            <p className="text-gray-300">Complete a payment to see your bookings here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-heading font-bold text-gray-800">{booking.turfName}</h3>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-medium">
                    Confirmed
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>{booking.sport}</div>
                  <div>{booking.bookingDate}</div>
                  <div>{booking.startTime} - {booking.endTime}</div>
                  <div className="font-bold text-green-600">₹{booking.price}</div>
                </div>
                
                <button
                  onClick={() => handleCancelBooking(booking.id, booking.turfName)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm font-medium transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {alert && (
        <CustomAlert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  )
}