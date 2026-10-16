import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import logoImg from '../assets/logo.jpeg'
import CustomAlert from '../components/CustomAlert'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  })
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authAPI.register(formData)
      setAlert({ message: 'Registration successful! Redirecting to login...', type: 'success' })
      setTimeout(() => navigate('/login'), 2000)
    } catch (error) {
      setAlert({ message: 'Registration failed. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <img 
              src={logoImg} 
              alt="NammaArena Logo" 
              className="w-20 h-20 mx-auto rounded-2xl mb-4 shadow-lg"
            />
            <h2 className="text-3xl font-heading font-bold text-white mb-2">
              Join NammaArena
            </h2>
            <p className="text-white/80">Create your account to start booking</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
              required
            />
            
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
              required
            />
            
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
              required
              minLength={6}
            />
            
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
            >
              <option value="USER" className="bg-gray-800">Book Turfs (User)</option>
              <option value="OWNER" className="bg-gray-800">List Turfs (Owner)</option>
            </select>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 mt-6"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
            
            <div className="text-center mt-6">
              <Link 
                to="/login" 
                className="text-white/90 hover:text-white font-medium transition-colors duration-300"
              >
                Already have an account? Sign in
              </Link>
            </div>
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