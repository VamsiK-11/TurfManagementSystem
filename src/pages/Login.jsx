import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import logoImg from '../assets/logo.jpeg'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await authAPI.login({ email, password })
      const { token, userId, username, role } = response.data
      login(token, { userId, username, role })
      
      // Navigate based on role
      if (role === 'ADMIN') navigate('/admin/users')
      else if (role === 'OWNER') navigate('/owner/turfs')
      else navigate('/turfs')
    } catch (error) {
      alert('Login failed')
    } finally {
      setLoading(false)
    }
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
              Welcome Back
            </h2>
            <p className="text-white/80">Sign in to your NammaArena account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            <div className="text-center">
              <Link 
                to="/register" 
                className="text-white/90 hover:text-white font-medium transition-colors duration-300"
              >
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}