import { useState, useEffect } from 'react'
import { bookingAPI, turfAPI, authAPI } from '../../services/api'
import Notification from '../../components/Notification'

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  const fetchOwnerBookings = async () => {
    try {
      console.log('Fetching owner bookings...')
      const response = await bookingAPI.getOwnerBookings()
      console.log('Owner bookings response:', response.data)
      
      if (response.data && response.data.length > 0) {
        // Backend now returns bookings with turf and user names included
        const bookingsWithDetails = response.data.map(booking => ({
          ...booking,
          turfName: booking.turfName || `Turf ${booking.turfId}`,
          bookedByName: booking.userName || 'Unknown'
        }))
        setBookings(bookingsWithDetails)
      } else {
        console.log('No bookings found for owner')
        setBookings([])
      }
    } catch (error) {
      console.error('Failed to fetch owner bookings:', error)
      setNotification({ message: `Failed to fetch bookings: ${error.message}`, type: 'error' })
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId, turfName) => {
    if (confirm(`Cancel booking for ${turfName}?`)) {
      try {
        await bookingAPI.deleteBooking(bookingId)
        setNotification({ message: 'Booking cancelled successfully', type: 'success' })
        fetchOwnerBookings()
      } catch (error) {
        setNotification({ message: 'Failed to cancel booking', type: 'error' })
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
          <h1 className="text-2xl font-heading font-bold text-gray-800">My Turf Bookings</h1>
          <p className="text-gray-600 mt-1">Bookings made on your turfs</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-lg font-heading font-bold text-gray-600 mb-1">No Bookings</h3>
            <p className="text-gray-500">No bookings found for your turfs</p>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-gray-600">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-gray-600">Turf</th>
                  <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-gray-600">Booked By</th>
                  <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-gray-600">Sport</th>
                  <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-gray-600">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-gray-600">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-heading font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">#{booking.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{booking.turfName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{booking.bookedByName}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{booking.sport}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{booking.bookingDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{booking.startTime} - {booking.endTime}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600">₹{booking.price}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleCancelBooking(booking.id, booking.turfName)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                        title="Cancel Booking"
                      >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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