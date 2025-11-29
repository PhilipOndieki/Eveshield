import { AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const FloatingActionButton = () => {
  const navigate = useNavigate()
  const [isPulsing, setIsPulsing] = useState(true)

  const handleClick = () => {
    setIsPulsing(false)
    navigate('/emergency')
  }

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setIsPulsing(false)}
      onMouseLeave={() => setIsPulsing(true)}
      className={`fixed bottom-8 right-8 h-20 w-20 bg-deep-rose text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center justify-center z-50 ${isPulsing ? 'animate-pulse' : ''}`}
      aria-label="Emergency SOS"
      title="Trigger Emergency Alert"
    >
      <div className="flex flex-col items-center">
        <AlertTriangle size={32} />
        <span className="text-xs font-bold mt-1">SOS</span>
      </div>
      
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full bg-deep-rose opacity-75 animate-ping"></span>
    </button>
  )
}

export default FloatingActionButton