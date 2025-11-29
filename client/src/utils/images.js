// Image URLs for placeholder images throughout the app
// Using high-quality, free stock photos from Unsplash

export const PLACEHOLDER_IMAGES = {
  // Hero/Landing
  hero: {
    empowerment: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80',
    community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=80',
    safety: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80',
  },

  // Features
  features: {
    emergencyAlert: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&q=80',
    trustedNetwork: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80',
    resources: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    support: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80',
  },

  // Empty States
  emptyStates: {
    noContacts: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80',
    noBystanders: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
    noIncidents: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80',
    noMessages: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    noNotifications: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80',
  },

  // Resources
  resources: {
    hotline: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    shelter: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80',
    medical: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80',
    legal: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&q=80',
    counseling: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  },

  // Testimonials/Users (diverse, African-focused)
  testimonials: {
    woman1: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80',
    woman2: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    woman3: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    group: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80',
  },

  // Getting Started
  gettingStarted: {
    step1: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80',
    step2: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&q=80',
    step3: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&q=80',
    step4: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  },

  // Dashboard
  dashboard: {
    safetyTip: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80',
    community: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  },

  // Avatars/Placeholders
  avatars: {
    female1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80',
    female2: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80',
    female3: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80',
    default: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  },

  // Backgrounds
  backgrounds: {
    login: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1920&q=80',
    signup: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&q=80',
    gradient: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=1920&q=80',
  },
}

// Helper function to get a random avatar
export const getRandomAvatar = () => {
  const avatars = Object.values(PLACEHOLDER_IMAGES.avatars)
  return avatars[Math.floor(Math.random() * avatars.length)]
}

// Helper function for image loading with fallback
export const getImageUrl = (category, key, fallback = null) => {
  try {
    return PLACEHOLDER_IMAGES[category]?.[key] || fallback || PLACEHOLDER_IMAGES.avatars.default
  } catch {
    return fallback || PLACEHOLDER_IMAGES.avatars.default
  }
}
