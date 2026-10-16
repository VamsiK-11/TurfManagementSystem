import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.jpeg'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src={logoImg} 
              alt="NammaArena Logo" 
              className="w-10 h-10 rounded-full transition-transform group-hover:scale-105"
            />
            <span className="text-2xl font-bold text-white tracking-tight">
              NammaArena
            </span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                <span className="text-white/90 text-sm mr-6 font-raleway font-semibold tracking-wide">Welcome, <span className="text-green-300">{user.username}</span></span>
                
                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/admin/users" className="px-4 py-2 rounded-xl text-white/90 hover:bg-white/20 transition-all duration-200 font-medium">Users</Link>
                    <Link to="/admin/turfs" className="px-4 py-2 rounded-xl text-white/90 hover:bg-white/20 transition-all duration-200 font-medium">Turfs</Link>
                    <Link to="/admin/bookings" className="px-4 py-2 rounded-xl text-white/90 hover:bg-white/20 transition-all duration-200 font-medium">Bookings</Link>
                  </>
                )}
                
                {user.role === 'OWNER' && (
                  <>
                    <Link to="/owner/turfs" className="px-4 py-2 rounded-xl text-white/90 hover:bg-white/20 transition-all duration-200 font-medium">My Turfs</Link>
                    <Link to="/owner/bookings" className="px-4 py-2 rounded-xl text-white/90 hover:bg-white/20 transition-all duration-200 font-medium">Bookings</Link>
                  </>
                )}
                
                {user.role === 'USER' && (
                  <>
                    <Link to="/turfs" className="px-4 py-2 rounded-xl text-white/90 hover:bg-white/20 transition-all duration-200 font-medium">Book Turfs</Link>
                    <Link to="/bookings" className="px-4 py-2 rounded-xl text-white/90 hover:bg-white/20 transition-all duration-200 font-medium">My Bookings</Link>
                  </>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="ml-4 bg-red-500/80 hover:bg-red-500 px-4 py-2 rounded-xl text-white font-medium transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-green-500/80 hover:bg-green-500 px-6 py-2 rounded-xl text-white font-medium transition-all duration-200">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}