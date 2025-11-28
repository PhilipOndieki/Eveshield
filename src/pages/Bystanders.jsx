import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import { Shield, UserPlus, Info } from 'lucide-react'

const Bystanders = () => {
  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar isAuthenticated={true} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
              My Trusted Bystanders Network
            </h1>
            <p className="text-warm-gray mb-8">
              Build your safety circle with people you trust in your community
            </p>

            {/* Info Banner */}
            <Card className="mb-6 bg-info-blue bg-opacity-10 border border-info-blue">
              <div className="flex items-start gap-3">
                <Info className="text-info-blue flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="font-bold text-dark-charcoal mb-2">
                    What are Trusted Bystanders?
                  </h3>
                  <p className="text-sm text-warm-gray">
                    Bystanders are people you personally know and trust who can respond if you need help.
                    They might be neighbors, classmates, coworkers, or community members. You must manually
                    add and verify each bystander - there are NO automatic alerts to strangers.
                  </p>
                </div>
              </div>
            </Card>

            {/* Empty State */}
            <Card className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="bg-info-blue bg-opacity-10 rounded-full p-6 inline-block mb-6">
                  <Shield className="text-info-blue" size={64} />
                </div>
                <h2 className="text-2xl font-bold text-dark-charcoal mb-4">
                  You haven't added any trusted bystanders yet
                </h2>
                <p className="text-warm-gray mb-4">
                  Bystanders are community members you trust who can help quickly because they're nearby
                </p>
                <p className="text-sm text-warm-gray mb-8">
                  Examples: Neighbors, classmates, roommates, coworkers, friends in your area
                </p>
                <Button variant="primary" size="large">
                  <UserPlus size={20} className="mr-2" />
                  Add First Bystander
                </Button>
                <div className="mt-8 p-4 bg-pale-pink rounded-lg">
                  <h3 className="font-bold text-dark-charcoal mb-2">Before adding bystanders:</h3>
                  <ul className="text-sm text-warm-gray text-left space-y-2">
                    <li>✓ I personally know this person</li>
                    <li>✓ I trust them to help me in an emergency</li>
                    <li>✓ I have their permission to add them</li>
                    <li>✓ They live or work near me</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Network Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-info-blue mb-2">0</p>
                  <p className="text-sm text-warm-gray">Total Bystanders</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-success-green mb-2">0</p>
                  <p className="text-sm text-warm-gray">Currently Available</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-warning-orange mb-2">0</p>
                  <p className="text-sm text-warm-gray">Pending Invitations</p>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <FloatingActionButton />
    </div>
  )
}

export default Bystanders
