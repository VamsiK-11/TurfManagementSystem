import { useState, useEffect } from 'react'
import { bookingAPI, authAPI, turfAPI } from '../../services/api'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState({})
  const [turfs, setTurfs] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [bookingsRes, usersRes, turfsRes] = await Promise.all([
        bookingAPI.getAllBookings(),
        authAPI.getUsers(),
        turfAPI.getAllTurfsAdmin()
      ])
      
      setBookings(bookingsRes.data)
      
      // Create user lookup map
      const userMap = {}
      usersRes.data.forEach(user => {
        userMap[user.id] = user.name
      })
      setUsers(userMap)
      
      // Create turf lookup map with owner info
      const turfMap = {}
      turfsRes.data.forEach(turf => {
        turfMap[turf.id] = {
          name: turf.name,
          ownerName: userMap[turf.ownerId] || 'Unknown Owner'
        }
      })
      setTurfs(turfMap)
      
    } catch (error) {
      console.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingAPI.deleteBooking(bookingId)
        fetchData()
      } catch (error) {
        alert('Failed to cancel booking')
      }
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg mb-6">
        <h1 className="text-2xl font-bold">All Bookings</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turf Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sport</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time Slot</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm font-medium">
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td className="px-6 py-4 whitespace-nowrap">{booking.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{users[booking.userId] || 'Unknown User'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{turfs[booking.turfId]?.name || 'Unknown Turf'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{turfs[booking.turfId]?.ownerName || 'Unknown Owner'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.sport}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.bookingDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{booking.startTime} - {booking.endTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">₹{booking.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    booking.status === 'PAID' ? 'bg-green-100 text-green-800' :
                    booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}