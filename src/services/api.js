 import axios from 'axios'

const createAPI = (baseURL) => {
  const api = axios.create({ baseURL })
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  return api
}

const authApi = createAPI('http://localhost:8081')
const turfApi = createAPI('http://localhost:8082')
const bookingApi = createAPI('http://localhost:8083')
const paymentApi = createAPI('http://localhost:8084')

export const authAPI = {
  login: (credentials) => authApi.post('/api/auth/login', credentials),
  register: (userData) => authApi.post('/api/auth/register', userData),
  getUsers: () => authApi.get('/api/auth/users'),
  deleteUser: (userId) => authApi.delete(`/api/auth/users/${userId}`),
}

export const turfAPI = {
  getAllTurfs: () => turfApi.get('/api/turfs'),
  getApprovedTurfs: () => turfApi.get('/api/turfs'),
  getTurf: (id) => turfApi.get(`/api/turfs/${id}`),
  createTurf: (turfData) => turfApi.post('/api/turfs', turfData),
  updateTurf: (id, turfData) => turfApi.put(`/api/turfs/${id}`, turfData),
  deleteTurf: (id) => turfApi.delete(`/api/turfs/${id}`),
  getOwnerTurfs: () => turfApi.get('/api/turfs/owner'),
  getAllTurfsAdmin: () => turfApi.get('/api/turfs/admin/all'),
  updateTurfStatus: (id, status) => turfApi.put(`/api/turfs/admin/${id}/status?status=${status}`),
  deleteTurfAdmin: (id) => turfApi.delete(`/api/turfs/admin/${id}`),
}

export const bookingAPI = {
  createBooking: (bookingData) => bookingApi.post('/api/bookings', bookingData),
  getUserBookings: () => bookingApi.get('/api/bookings/user'),
  getOwnerBookings: () => bookingApi.get('/api/bookings/owner'),
  deleteBooking: (bookingId) => bookingApi.delete(`/api/bookings/${bookingId}`),
  getAllBookings: () => bookingApi.get('/api/bookings/admin/all'),
  cancelBooking: (bookingId) => bookingApi.put(`/api/bookings/${bookingId}/cancel`),
}

export const paymentAPI = {
  createPaymentIntent: (paymentData) => paymentApi.post('/api/payments/create', paymentData),
  confirmPayment: (paymentIntentId) => paymentApi.post('/api/payments/confirm', { paymentIntentId }),
}