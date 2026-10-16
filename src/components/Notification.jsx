import { useState, useEffect } from 'react'

export default function Notification({ message, type = 'success', onClose }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'
  const icon = type === 'success' ? '✓' : '✕'

  return (
    <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    }`}>
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3`}>
        <span className="text-lg font-bold">{icon}</span>
        <span className="font-medium">{message}</span>
        <button 
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-2 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  )
}