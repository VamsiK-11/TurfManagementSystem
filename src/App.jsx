import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import GlobalBackground from './components/GlobalBackground'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTurfs from './pages/admin/AdminTurfs'
import AdminBookings from './pages/admin/AdminBookings'
import OwnerTurfs from './pages/owner/OwnerTurfs'
import OwnerBookings from './pages/owner/OwnerBookings'
import UserTurfs from './pages/user/UserTurfs'
import BookTurf from './pages/user/BookTurf'
import Payment from './pages/user/Payment'
import Home from './pages/Home'
import UserBookings from './pages/user/UserBookings'

const stripePromise = loadStripe('pk_test_51S5gKzPARYumdThXYxUt4LS6N6vnUkbCfvBHVS33DhrAISCzkdyDdZnkn4FkXlmlh69usUmAGoKVqsgYGGJkBiBT00njNZxGJI')

function App() {
  return (
    <AuthProvider>
      <Elements stripe={stripePromise}>
        <Router>
          <GlobalBackground>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Admin Routes */}
              <Route path="/admin/users" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/turfs" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminTurfs />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              <Route path="/admin/bookings" element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminBookings />
                </ProtectedRoute>
              } />
              
              {/* Owner Routes */}
              <Route path="/owner/turfs" element={
                <ProtectedRoute roles={['OWNER']}>
                  <OwnerTurfs />
                </ProtectedRoute>
              } />
              <Route path="/owner/bookings" element={
                <ProtectedRoute roles={['OWNER']}>
                  <OwnerBookings />
                </ProtectedRoute>
              } />
              
              {/* User Routes */}
              <Route path="/turfs" element={
                <ProtectedRoute roles={['USER']}>
                  <UserTurfs />
                </ProtectedRoute>
              } />
              <Route path="/book/:id" element={
                <ProtectedRoute roles={['USER']}>
                  <BookTurf />
                </ProtectedRoute>
              } />
              <Route path="/payment/:paymentIntentId" element={
                <ProtectedRoute roles={['USER']}>
                  <Payment />
                </ProtectedRoute>
              } />
              <Route path="/bookings" element={
                <ProtectedRoute roles={['USER']}>
                  <UserBookings />
                </ProtectedRoute>
              } />
              
              <Route path="/" element={<Home />} />
              <Route path="/unauthorized" element={
                <div className="p-6 text-center">
                  <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
                  <p className="mt-2">You don't have permission to access this page.</p>
                </div>
              } />
            </Routes>
          </GlobalBackground>
        </Router>
      </Elements>
    </AuthProvider>
  )
}

export default App