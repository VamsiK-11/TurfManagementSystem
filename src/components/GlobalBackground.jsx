import backgroundImg from '../assets/turf.jpeg'

export default function GlobalBackground({ children }) {
  return (
    <div className="min-h-screen relative">
      {/* Global Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url(${backgroundImg})`
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}