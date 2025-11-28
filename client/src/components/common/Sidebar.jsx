import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  Shield,
  ClipboardList,
  BookOpen,
  Settings,
} from 'lucide-react'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/emergency', icon: AlertTriangle, label: 'Emergency SOS', color: 'text-deep-rose' },
    { path: '/contacts', icon: Users, label: 'My Contacts' },
    { path: '/bystanders', icon: Shield, label: 'Trusted Bystanders' },
    { path: '/incidents', icon: ClipboardList, label: 'Incident Reports' },
    { path: '/resource-hub', icon: BookOpen, label: 'Resource Hub' },
    { path: '/profile', icon: Settings, label: 'Profile Settings' },
  ]

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-light-gray min-h-screen">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200
                ${isActive
                  ? 'bg-pale-pink text-deep-rose font-medium'
                  : 'text-warm-gray hover:bg-light-gray hover:text-dark-charcoal'
                }
                ${item.color || ''}
              `}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
