import { Link } from 'react-router-dom'
import logoImg from '../assets/logo.jpeg'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-white">
            {/* Logo */}
            <div className="mb-8">
              <img 
                src={logoImg} 
                alt="NammaArena Logo" 
                className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-lg mb-6 float pulse-glow"
              />
            </div>
            
            {/* Content */}
            <div className="mb-12">
              <h1 className="text-6xl font-playfair font-bold mb-6 text-white hero-title tracking-tight">
                Welcome to Namma Arena
              </h1>
              <p className="text-2xl mb-8 font-heading font-light text-green-300 hero-subtitle">
                Your Field, Your Game, Your Victory
              </p>
              <p className="text-lg mb-8 max-w-2xl mx-auto leading-relaxed text-gray-300 hero-subtitle">
                Experience premium sports facilities designed for champions. 
                Book your perfect turf and create unforgettable moments.
              </p>
            </div>
            

          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 text-white">
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-400 rounded-lg"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Premium Facilities</h3>
              <p className="text-sm text-gray-300">Professional-grade turfs with modern amenities</p>
            </div>
            
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-blue-400 rounded-lg"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Booking</h3>
              <p className="text-sm text-gray-300">Simple reservation system with instant confirmation</p>
            </div>
            
            <div className="text-center bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-purple-400 rounded-lg"></div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-sm text-gray-300">Safe transactions with multiple payment options</p>
            </div>
          </div>
        </div>
    </div>
  )
}