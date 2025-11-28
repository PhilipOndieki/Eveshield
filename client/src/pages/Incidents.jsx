import { useState, useEffect } from 'react'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import FloatingActionButton from '../components/common/FloatingActionButton'
import Card from '../components/common/Card'
import { CheckCircle, MapPin, Clock, Users } from 'lucide-react'
import { getSeverityColor, getSeverityLabel, formatDateTime } from '../utils/helpers'

const Incidents = () => {
  const { currentUser } = useAuth()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      const q = query(
        collection(db, 'users', currentUser.uid, 'incidents'),
        orderBy('triggeredAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      const incidentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setIncidents(incidentsData)
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-light-gray">
      <Navbar isAuthenticated={true} />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-dark-charcoal mb-2">
              Incident Reports
            </h1>
            <p className="text-warm-gray mb-8">
              Track all your emergency alerts and safety incidents
            </p>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-deep-rose mb-2">{incidents.length}</p>
                  <p className="text-sm text-warm-gray">Total Incidents</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-warning-orange mb-2">
                    {incidents.filter(i => i.status === 'active').length}
                  </p>
                  <p className="text-sm text-warm-gray">Active Alerts</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-success-green mb-2">
                    {incidents.filter(i => i.status === 'resolved').length}
                  </p>
                  <p className="text-sm text-warm-gray">Resolved</p>
                </div>
              </Card>
              <Card>
                <div className="text-center">
                  <p className="text-4xl font-bold text-info-blue mb-2">0</p>
                  <p className="text-sm text-warm-gray">Avg Response Time</p>
                </div>
              </Card>
            </div>

            {/* Incidents List */}
            {loading ? (
              <Card className="text-center py-12">
                <p className="text-warm-gray">Loading incidents...</p>
              </Card>
            ) : incidents.length === 0 ? (
              <Card className="text-center py-16">
                <CheckCircle className="mx-auto mb-4 text-success-green" size={64} />
                <h2 className="text-2xl font-bold text-dark-charcoal mb-2">
                  No incidents recorded
                </h2>
                <p className="text-warm-gray">
                  You haven't triggered any emergency alerts. Stay safe!
                </p>
                <p className="text-success-green mt-4">
                  We hope it stays this way 💚
                </p>
              </Card>
            ) : (
              <div className="space-y-6">
                {incidents.map((incident) => (
                  <Card
                    key={incident.id}
                    borderColor={getSeverityColor(incident.severity)}
                    hover={true}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`bg-${getSeverityColor(incident.severity)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                            {getSeverityLabel(incident.severity)}
                          </span>
                          <span className={`bg-${incident.status === 'active' ? 'error-red' : 'success-green'} bg-opacity-10 text-${incident.status === 'active' ? 'error-red' : 'success-green'} px-3 py-1 rounded-full text-sm font-medium`}>
                            {incident.status === 'active' ? 'Active' : 'Resolved'}
                          </span>
                        </div>
                        <p className="text-sm text-warm-gray">
                          Incident #{incident.incidentNumber}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-start gap-2">
                        <Clock className="text-warm-gray flex-shrink-0 mt-1" size={16} />
                        <div>
                          <p className="text-sm font-medium text-dark-charcoal">Triggered At</p>
                          <p className="text-sm text-warm-gray">
                            {incident.triggeredAt ? formatDateTime(incident.triggeredAt) : 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="text-warm-gray flex-shrink-0 mt-1" size={16} />
                        <div>
                          <p className="text-sm font-medium text-dark-charcoal">Location</p>
                          <p className="text-sm text-warm-gray">
                            {incident.location?.lat && incident.location?.lng
                              ? `${incident.location.lat.toFixed(4)}, ${incident.location.lng.toFixed(4)}`
                              : 'Location unavailable'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Users className="text-warm-gray" size={16} />
                      <p className="text-sm text-warm-gray">
                        {incident.notifications?.emergencyContacts?.length || 0} contacts notified •{' '}
                        {incident.notifications?.bystanders?.length || 0} bystanders alerted
                      </p>
                    </div>

                    {incident.alertDetails?.customNotes && (
                      <div className="bg-light-gray p-3 rounded-lg mb-4">
                        <p className="text-sm text-dark-charcoal">
                          <span className="font-medium">Notes: </span>
                          {incident.alertDetails.customNotes}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button className="text-sm text-deep-rose hover:underline">
                        View Details
                      </button>
                      {incident.status === 'active' && (
                        <button className="text-sm text-success-green hover:underline">
                          Mark as Safe
                        </button>
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

export default Incidents
