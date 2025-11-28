import { useState } from 'react'
import { X, Heart, CreditCard, DollarSign } from 'lucide-react'
import Button from './Button'
import toast from 'react-hot-toast'

const DonationModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [frequency, setFrequency] = useState('once') // once, monthly
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [donorName, setDonorName] = useState('')
  const [donorMessage, setDonorMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const presetAmounts = [5, 10, 25, 50, 100, 250]

  const handleDonate = async () => {
    const donationAmount = amount === 'custom' ? parseFloat(customAmount) : parseFloat(amount)

    if (!donationAmount || donationAmount < 1) {
      toast.error('Please enter a valid donation amount')
      return
    }

    setLoading(true)

    // In production, integrate with Paystack API
    try {
      // Simulate Paystack integration
      await new Promise(resolve => setTimeout(resolve, 2000))

      // This would be the actual Paystack integration:
      /*
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount * 100, // Paystack uses kobo
          email: currentUser.email,
          currency: 'KES',
          metadata: {
            donorName: isAnonymous ? 'Anonymous' : donorName,
            message: donorMessage,
            frequency,
          },
        }),
      })

      const data = await response.json()

      if (data.status) {
        window.location.href = data.data.authorization_url
      }
      */

      toast.success(`Thank you for your ${frequency === 'monthly' ? 'monthly' : ''} donation of $${donationAmount}!`)
      onClose()
    } catch (error) {
      console.error('Donation error:', error)
      toast.error('Payment processing failed. Please try again.')
    } finally {
      setLoading(false)
    }
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
            Select Amount (USD)
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
                ${preset}
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
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray" size={20} />
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
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
                placeholder="John Doe"
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
            We accept: Cards, Bank Transfer, Mobile Money (M-Pesa, MTN, etc.)
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="primary" fullWidth onClick={handleDonate} disabled={loading || (!amount && !customAmount)}>
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
