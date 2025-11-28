import { AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const FloatingActionButton = () => {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/emergency')}
      className="fixed bottom-8 right-8 h-16 w-16 bg-deep-rose text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 flex items-center justify-center z-40 animate-pulse"
      aria-label="Emergency SOS"
    >
      <AlertTriangle size={28} />
    </button>
  )
}

export default FloatingActionButton
