import { useState } from 'react'
import { Search, Phone, Home, Shield, Cross, AlertCircle, Scale, Heart, Users, MapPin } from 'lucide-react'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const ResourceHub = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { id: 'all', name: 'All Resources', icon: Users },
    { id: 'hotlines', name: 'Emergency Hotlines', icon: Phone },
    { id: 'shelters', name: 'Safe Houses & Shelters', icon: Home },
    { id: 'police', name: 'Police Stations', icon: Shield },
    { id: 'medical', name: 'Hospitals & Medical', icon: Cross },
    { id: 'ambulance', name: 'Ambulance Services', icon: AlertCircle },
    { id: 'legal', name: 'Legal Aid', icon: Scale },
    { id: 'counseling', name: 'Counseling & Mental Health', icon: Heart },
  ]

  const resources = [
    {
      id: 1,
      category: 'hotlines',
      name: 'GBV Emergency Hotline',
      type: 'National Hotline',
      phone: '1195',
      description: 'Free 24/7 GBV crisis support hotline',
      availability: '24/7',
      languages: ['English', 'Swahili'],
      verified: true,
    },
    {
      id: 2,
      category: 'hotlines',
      name: 'Kenya Police Emergency',
      type: 'Emergency Services',
      phone: '999',
      description: 'Police emergency response line',
      availability: '24/7',
      languages: ['English', 'Swahili'],
      verified: true,
    },
    {
      id: 3,
      category: 'shelters',
      name: 'FIDA Kenya Safe House',
      type: 'Shelter',
      phone: '+254 20 3874 220',
      email: 'info@fidakenya.org',
      address: 'Nairobi, Kenya',
      description: 'Safe house and legal aid for GBV survivors',
      availability: 'Mon-Fri: 8 AM - 5 PM',
      languages: ['English', 'Swahili'],
      verified: true,
    },
    {
      id: 4,
      category: 'medical',
      name: 'Kenyatta National Hospital',
      type: 'Hospital',
      phone: '+254 20 272 6300',
      address: 'Hospital Road, Nairobi',
      description: '24-hour emergency services and GBV response unit',
      availability: '24/7',
      distance: '5.2 km away',
      verified: true,
    },
    {
      id: 5,
      category: 'legal',
      name: 'Coalition on Violence Against Women (COVAW)',
      type: 'Legal Aid',
      phone: '+254 20 271 1690',
      email: 'info@covaw.or.ke',
      address: 'Nairobi, Kenya',
      description: 'Free legal aid and advocacy for GBV survivors',
      availability: 'Mon-Fri: 8 AM - 5 PM',
      languages: ['English', 'Swahili'],
      verified: true,
    },
  ]

  const filteredResources = resources.filter(resource => {
    const matchesCategory = activeCategory === 'all' || resource.category === activeCategory
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar isAuthenticated={true} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
              Support Resources
            </h1>
            <p className="text-warm-gray mb-8">
              Find help and verified support services near you
            </p>

            {/* Search Bar */}
            <Card className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray" size={20} />
                <input
                  type="text"
                  placeholder="Search by service name, type, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-light-gray rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-rose"
                />
              </div>
            </Card>

            {/* Category Tabs */}
            <div className="mb-8 overflow-x-auto">
              <div className="flex gap-2 pb-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        activeCategory === category.id
                          ? 'bg-deep-rose text-white'
                          : 'bg-white text-warm-gray hover:bg-pale-pink'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Resources Grid */}
            {filteredResources.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-warm-gray">No resources found matching your search.</p>
              </Card>
            ) : (
              <div className="space-y-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} hover={true}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-bold text-dark-charcoal">
                            {resource.name}
                          </h3>
                          {resource.verified && (
                            <span className="bg-success-green bg-opacity-10 text-success-green px-2 py-1 rounded-full text-xs font-medium">
                              ✓ Verified
                            </span>
                          )}
                        </div>
                        <span className="text-sm bg-pale-pink text-deep-rose px-3 py-1 rounded-full">
                          {resource.type}
                        </span>
                      </div>
                      {resource.availability === '24/7' && (
                        <span className="bg-success-green text-white px-3 py-1 rounded-full text-sm font-medium">
                          24/7
                        </span>
                      )}
                    </div>

                    <p className="text-warm-gray mb-4">{resource.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {resource.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="text-deep-rose" size={16} />
                          <a href={`tel:${resource.phone}`} className="text-deep-rose font-bold hover:underline">
                            {resource.phone}
                          </a>
                        </div>
                      )}
                      {resource.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="text-warm-gray" size={16} />
                          <span className="text-sm text-warm-gray">{resource.address}</span>
                        </div>
                      )}
                      {resource.availability && (
                        <div className="flex items-center gap-2">
                          <AlertCircle className="text-warm-gray" size={16} />
                          <span className="text-sm text-warm-gray">{resource.availability}</span>
                        </div>
                      )}
                      {resource.distance && (
                        <div className="flex items-center gap-2">
                          <MapPin className="text-success-green" size={16} />
                          <span className="text-sm text-success-green">{resource.distance}</span>
                        </div>
                      )}
                    </div>

                    {resource.languages && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-warm-gray">Languages:</span>
                        {resource.languages.map((lang) => (
                          <span key={lang} className="text-xs bg-light-gray px-2 py-1 rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {resource.phone && (
                        <Button variant="primary" size="small">
                          <Phone size={16} className="mr-2" />
                          Call Now
                        </Button>
                      )}
                      {resource.address && (
                        <Button variant="secondary" size="small">
                          Get Directions
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <FloatingActionButton />
    </div>
  )
}

export default ResourceHub
