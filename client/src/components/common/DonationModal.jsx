import { useState } from 'react'
import { X, Heart, CreditCard, DollarSign } from 'lucide-react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../utils/firebase'
import { useAuth } from '../../context/AuthContext'
import Button from './Button'
import toast from 'react-hot-toast'
import { 
  openPaystackPopup, 
  generateReference, 
  verifyPayment,
  SUPPORTED_CURRENCIES 
} from '../../utils/paystack'

const DonationModal = ({ isOpen, onClose }) => {
  const { currentUser, userProfile } = useAuth()
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [currency, setCurrency] = useState('KES')
  const [frequency, setFrequency] = useState('once') // once, monthly
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [donorName, setDonorName] = useState('')
  const [donorMessage, setDonorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const presetAmounts = [500, 1000, 2500, 5000, 10000, 25000] // KES amounts

  const handleDonate = async () => {
    const donationAmount = amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount)

    if (!donationAmount || donationAmount < 1) {
      toast.error('Please enter a valid donation amount')
      return
    }

    if (!currentUser || !currentUser.email) {
      toast.error('Please sign in to make a donation')
      return
    }

    setLoading(true)

    try {
      const reference = generateReference()
      const displayName = isAnonymous ? 'Anonymous' : (donorName || userProfile?.fullName || 'Anonymous')

      // Open Paystack payment popup
      await openPaystackPopup({
        email: currentUser.email,
        amount: donationAmount,
        currency: currency,
        reference: reference,
        metadata: {
          donorName: displayName,
          message: donorMessage,
          frequency: frequency,
          userId: currentUser.uid,
          isAnonymous: isAnonymous,
        },
        onSuccess: async (response) => {
          console.log('Payment successful:', response)
          
          try {
            // Verify payment on backend
            const verificationResult = await verifyPayment(response.reference)
            
            if (verificationResult.data.status === 'success') {
              // Save donation to Firestore
              await addDoc(collection(db, 'donations'), {
                userId: currentUser.uid,
                donorEmail: currentUser.email,
                donorName: displayName,
                isAnonymous: isAnonymous,
                amount: donationAmount,
                currency: currency,
                frequency: frequency,
                message: donorMessage,
                reference: response.reference,
                status: 'completed',
                paystackResponse: {
                  reference: response.reference,
                  status: verificationResult.data.status,
                  amount: verificationResult.data.amount,
                  channel: verificationResult.data.channel,
                },
                createdAt: serverTimestamp(),
              })

              toast.success(`Thank you for your ${frequency === 'monthly' ? 'monthly' : ''} donation of ${currency} ${donationAmount}!`, {
                duration: 5000,
                icon: '💚',
              })
              
              onClose()
              
              // Reset form
              setAmount('')
              setCustomAmount('')
              setDonorName('')
              setDonorMessage('')
            } else {
              throw new Error('Payment verification failed')
            }
          } catch (verifyError) {
            console.error('Verification error:', verifyError)
            toast.error('Payment verification failed. Please contact support.')
          }
        },
        onClose: () => {
          console.log('Payment popup closed')
          toast.error('Payment cancelled')
          setLoading(false)
        },
      })
      
    } catch (error) {
      console.error('Donation error:', error)
      toast.error('Payment processing failed. Please try again.')
      setLoading(false)
    }
  }

  const getCurrencySymbol = () => {
    const curr = SUPPORTED_CURRENCIES.find(c => c.code === currency)
    return curr?.symbol || currency
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-deep-rose bg-opacity-10 p-3 rounded-full">
              <Heart className="text-deep-rose" size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-dark-charcoal">Support EveShield</h3>
              <p className="text-sm text-warm-gray">Help us protect more lives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-warm-gray hover:text-dark-charcoal transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Currency Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-dark-charcoal mb-3">
            Select Currency
          </label>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {SUPPORTED_CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => setCurrency(curr.code)}
                className={`py-2 px-3 rounded-lg font-medium transition-colors text-sm ${
                  currency === curr.code
                    ? 'bg-medium-blue text-white'
                    : 'bg-pale-blue text-dark-charcoal hover:bg-medium-blue hover:bg-opacity-20'
                }`}
              >
                {curr.symbol} {curr.code}
              </button>
            ))}
          </div>
        </div>

        {/* Frequency Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFrequency('once')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              frequency === 'once'
                ? 'bg-medium-blue text-white'
                : 'bg-pale-blue text-dark-charcoal'
            }`}
          >
            One-time
          </button>
          <button
            onClick={() => setFrequency('monthly')}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              frequency === 'monthly'
                ? 'bg-medium-blue text-white'
                : 'bg-pale-blue text-dark-charcoal'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-dark-charcoal mb-3">
            Select Amount ({getCurrencySymbol()})
          </label>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset.toString())}
                className={`py-3 rounded-lg font-medium transition-colors ${
                  amount === preset.toString()
                    ? 'bg-deep-rose text-white'
                    : 'bg-white border-2 border-gray-300 text-dark-charcoal hover:border-deep-rose'
                }`}
              >
                {getCurrencySymbol()} {preset.toLocaleString()}
              </button>
            ))}
          </div>
          <button
            onClick={() => setAmount('custom')}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              amount === 'custom'
                ? 'bg-deep-rose text-white'
                : 'bg-white border-2 border-gray-300 text-dark-charcoal hover:border-deep-rose'
            }`}
          >
            Custom Amount
          </button>

          {amount === 'custom' && (
            <div className="mt-3 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray font-medium">
                {getCurrencySymbol()}
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
              />
            </div>
          )}
        </div>

        {/* Donor Information */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="h-4 w-4 text-deep-rose focus:ring-deep-rose border-gray-300 rounded"
            />
            <label htmlFor="anonymous" className="text-sm text-dark-charcoal">
              Donate anonymously
            </label>
          </div>

          {!isAnonymous && (
            <div>
              <label className="block text-sm font-medium text-dark-charcoal mb-2">
                Your Name (Optional)
              </label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder={userProfile?.fullName || "John Doe"}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-charcoal mb-2">
              Message (Optional)
            </label>
            <textarea
              value={donorMessage}
              onChange={(e) => setDonorMessage(e.target.value)}
              placeholder="Leave a message of support..."
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-blue"
            />
          </div>
        </div>

        {/* Impact Statement */}
        <div className="bg-success-green bg-opacity-10 border border-success-green rounded-lg p-4 mb-6">
          <h4 className="font-bold text-dark-charcoal mb-2">Your Impact</h4>
          <ul className="text-sm text-warm-gray space-y-1">
            <li>✓ Support platform operations and maintenance</li>
            <li>✓ Fund community safety initiatives</li>
            <li>✓ Provide subsidies for resource access</li>
            <li>✓ Expand platform features and reach</li>
          </ul>
        </div>

        {/* Payment Methods */}
        <div className="bg-pale-blue rounded-lg p-4 mb-6">
          <p className="text-sm text-dark-charcoal mb-2 font-medium">
            <CreditCard size={16} className="inline mr-2" />
            Secure Payment via Paystack
          </p>
          <p className="text-xs text-warm-gray">
            We accept: Cards, Bank Transfer, Mobile Money (M-Pesa, MTN, Airtel, etc.)
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleDonate} 
            disabled={loading || (!amount && !customAmount)}
          >
            {loading ? 'Processing...' : `Donate ${frequency === 'monthly' ? 'Monthly' : 'Now'}`}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </div>

        <p className="text-xs text-center text-warm-gray mt-4">
          Your donation is secure and your information is protected
        </p>
      </div>
    </div>
  )
}

export default DonationModal