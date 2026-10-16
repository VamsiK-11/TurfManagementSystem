import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'
import { paymentAPI } from '../../services/api'
import CustomAlert from '../../components/CustomAlert'

export default function Payment() {
  const { paymentIntentId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [amount, setAmount] = useState(0)
  const [bookingDetails, setBookingDetails] = useState(null)
  const [alert, setAlert] = useState(null)
  const stripe = useStripe()
  const elements = useElements()
  
  useEffect(() => {
    const secret = localStorage.getItem('clientSecret')
    const paymentAmount = localStorage.getItem('paymentAmount')
    const booking = localStorage.getItem('bookingDetails')
    
    if (!secret) {
      setAlert({ message: 'Payment session expired. Please try booking again.', type: 'error' })
      setTimeout(() => navigate('/turfs'), 2000)
      return
    }
    
    setClientSecret(secret)
    setAmount(paymentAmount || 0)
    setBookingDetails(booking ? JSON.parse(booking) : null)
  }, [navigate])

  const handlePayment = async (e) => {
    e.preventDefault()
    
    if (!stripe || !elements || !clientSecret) {
      setAlert({ message: 'Payment not ready. Please try again.', type: 'error' })
      return
    }
    
    setLoading(true)
    
    const cardElement = elements.getElement(CardElement)
    
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      }
    })
    
    if (error) {
      setAlert({ message: `Payment failed: ${error.message}`, type: 'error' })
    } else if (paymentIntent.status === 'succeeded') {
      try {
        // Confirm payment with backend
        await paymentAPI.confirmPayment(paymentIntent.id)
        
        // Clear localStorage
        localStorage.removeItem('clientSecret')
        localStorage.removeItem('paymentAmount')
        localStorage.removeItem('bookingDetails')
        
        setAlert({ message: 'Payment successful! Your turf has been booked.', type: 'success' })
        setTimeout(() => navigate('/turfs'), 2000)
      } catch (error) {
        setAlert({ message: 'Payment succeeded but booking confirmation failed. Please contact support.', type: 'error' })
      }
    }
    
    setLoading(false)
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">💳 Secure Payment</h1>
          <p className="text-gray-600">Complete your turf booking payment</p>
        </div>
        
        <div className="turf-card p-8">
          {bookingDetails && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📋</span>
                Booking Summary
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="flex items-center"><span className="font-medium text-gray-700">Turf:</span> <span className="ml-2">{bookingDetails.turfName}</span></p>
                  <p className="flex items-center"><span className="font-medium text-gray-700">Sport:</span> <span className="ml-2">{bookingDetails.sport}</span></p>
                  <p className="flex items-center"><span className="font-medium text-gray-700">Date:</span> <span className="ml-2">{bookingDetails.date}</span></p>
                </div>
                <div className="space-y-2">
                  <p className="flex items-center"><span className="font-medium text-gray-700">Time:</span> <span className="ml-2">{bookingDetails.startTime} - {bookingDetails.endTime}</span></p>
                  <p className="flex items-center"><span className="font-medium text-gray-700">Duration:</span> <span className="ml-2">{bookingDetails.duration} hour(s)</span></p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="text-center p-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl text-white">
              <p className="text-lg font-medium mb-2">Total Amount</p>
              <p className="text-4xl font-bold">₹{amount}</p>
            </div>
            
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-xl mr-2">💳</span>
                Card Details
              </label>
              <div className="p-6 border-2 border-gray-200 rounded-2xl bg-white focus-within:border-green-500 transition-colors">
                <CardElement options={{
                  style: {
                    base: {
                      fontSize: '18px',
                      color: '#374151',
                      fontFamily: 'Inter, sans-serif',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                  },
                }} />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={!stripe || loading}
              className="btn-primary w-full text-white py-4 px-6 rounded-2xl font-bold text-lg shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Processing Payment...
                </div>
              ) : (
                '🚀 Pay Now'
              )}
            </button>
            
            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
              <p className="font-bold text-blue-800 mb-3 flex items-center">
                <span className="text-lg mr-2">🧪</span>
                Test Payment - Use These Card Details:
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <p><strong>Card Number:</strong> 4242 4242 4242 4242</p>
                  <p><strong>Expiry:</strong> 12/25</p>
                </div>
                <div>
                  <p><strong>CVC:</strong> 123</p>
                  <p><strong>Name:</strong> Any name</p>
                </div>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigate('/turfs')}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-6 rounded-2xl font-medium transition-all duration-300"
            >
              ❌ Cancel Booking
            </button>
          </form>
        </div>
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