import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { turfAPI, bookingAPI, paymentAPI } from '../../services/api'

export default function BookTurf() {
  const { id } = useParams()
  const [turf, setTurf] = useState(null)
  const [bookingData, setBookingData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    sportName: '',
    duration: 1
  })
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    fetchTurf()
  }, [id])

  const fetchTurf = async () => {
    try {
      const response = await turfAPI.getTurf(id)
      setTurf(response.data)
    } catch (error) {
      console.error('Failed to fetch turf')
    }
  }

  const validateBookingTime = () => {
    if (!turf || !bookingData.startTime || !bookingData.endTime) return false
    
    const turfStart = turf.startTime
    const turfEnd = turf.endTime
    const bookingStart = bookingData.startTime
    const bookingEnd = bookingData.endTime
    
    return bookingStart >= turfStart && bookingEnd <= turfEnd && bookingStart < bookingEnd
  }

  const calculateDuration = () => {
    if (!bookingData.startTime || !bookingData.endTime) return 0
    const start = new Date(`2000-01-01T${bookingData.startTime}`)
    const end = new Date(`2000-01-01T${bookingData.endTime}`)
    const diffMs = end - start
    return Math.max(0, diffMs / (1000 * 60 * 60)) // Convert to hours
  }

  const calculatePrice = () => {
    const duration = calculateDuration()
    if (!turf || !bookingData.sportName || !duration) return 0
    const sport = turf.sports?.find(s => s.sportName === bookingData.sportName)
    return sport ? sport.price * duration : 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateBookingTime()) {
      alert(`Booking time must be within turf hours: ${turf.startTime} - ${turf.endTime}`)
      return
    }
    
    const price = calculatePrice()
    try {
      // First create the booking
      const bookingResponse = await bookingAPI.createBooking({
        turfId: parseInt(id),
        sport: bookingData.sportName,
        bookingDate: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        duration: bookingData.duration,
        price: price
      })
      
      // Then create payment intent with booking ID
      const paymentResponse = await paymentAPI.createPaymentIntent({
        bookingId: bookingResponse.data.id,
        amount: price
      })
      
      console.log('Payment response:', paymentResponse.data)
      
      if (!paymentResponse.data.clientSecret) {
        alert('Failed to get payment details. Please try again.')
        return
      }
      
      // Store payment and booking details
      localStorage.setItem('clientSecret', paymentResponse.data.clientSecret)
      localStorage.setItem('paymentAmount', price)
      localStorage.setItem('bookingDetails', JSON.stringify({
        turfName: turf.name,
        sport: bookingData.sportName,
        date: bookingData.date,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        duration: bookingData.duration
      }))
      window.location.href = `/payment/${paymentResponse.data.id}`
    } catch (error) {
      alert('Failed to create booking or initiate payment')
    }
  }

  // Update duration and total price when times or sport changes
  useEffect(() => {
    const duration = calculateDuration()
    setBookingData(prev => ({ ...prev, duration }))
    setTotalPrice(calculatePrice())
  }, [bookingData.startTime, bookingData.endTime, bookingData.sportName, turf])

  if (!turf) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-6">Book Turf</h1>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-heading font-bold text-gray-800 mb-2">{turf.name}</h3>
              <p className="text-gray-600 mb-2">{turf.location}</p>
              <p className="text-sm text-gray-500 mb-3">{turf.startTime} - {turf.endTime}</p>
              <div className="flex flex-wrap gap-2">
                {turf.sports?.map((sport, index) => (
                  <span key={index} className="bg-white px-3 py-1 text-sm rounded border">
                    {sport.sportName}: ₹{sport.price}/hr
                  </span>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={bookingData.startTime}
                    onChange={(e) => setBookingData({ ...bookingData, startTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min={turf?.startTime}
                    max={turf?.endTime}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={bookingData.endTime}
                    onChange={(e) => setBookingData({ ...bookingData, endTime: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    min={turf?.startTime}
                    max={turf?.endTime}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                <select
                  value={bookingData.sportName}
                  onChange={(e) => setBookingData({ ...bookingData, sportName: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Sport</option>
                  {turf.sports?.map(sport => (
                    <option key={sport.sportName} value={sport.sportName}>{sport.sportName}</option>
                  ))}
                </select>
              </div>
              
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Duration: {bookingData.duration.toFixed(1)} hours</span>
                  <span className="text-lg font-bold text-blue-600">₹{totalPrice}</span>
                </div>
              </div>
              
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded font-medium transition-colors">
                Book & Pay ₹{totalPrice}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}