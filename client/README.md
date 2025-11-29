# 🛡️ EveShield - Community-Powered Emergency Response Platform

**Empowering women's safety across Africa through technology, community, and rapid response.**

[![React](https://img.shields.io/badge/React-18.3-blue)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-11.10-orange)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Key Features Explained](#key-features-explained)
- [Security](#security)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [Contributing](#contributing)
- [License](#license)

## 🌟 Overview

EveShield is a comprehensive safety platform designed to empower women across Africa through:
- **Instant Emergency Alerts:** Three-tier severity system (Concern, Immediate, Critical)
- **Trusted Bystander Network:** Community-powered support system
- **Real-Time Messaging:** Secure communication with your safety network
- **AI-Powered Education:** SafeGuide AI chatbot for safety information
- **Resource Directory:** Verified support services (hotlines, shelters, legal aid, counseling)
- **Pan-African Support:** Phone validation for all 54 African countries

## ✨ Features

### 🚨 Emergency Response
- **Three-Tier Alert System**
  - Level 1 - Concern: Feeling unsafe, need standby support
  - Level 2 - Immediate: Escalating situation, need help now
  - Level 3 - Critical: Life-threatening emergency
- **Automatic Location Sharing:** GPS coordinates shared with emergency contacts
- **One-Tap Activation:** Floating SOS button accessible from any page
- **Evidence Collection:** Upload photos, videos, audio for documentation

### 👥 Trusted Bystanders Network
- **Global User Discovery:** Browse all platform users
- **Connection Requests:** Send/receive/accept connection requests with optional messages
- **Bi-Directional Relationships:** Both users become connected
- **Real-Time Status:** See who's online and available
- **Search & Filter:** Find bystanders by name, location, skills

### 💬 Real-Time Chat
- **One-on-One Messaging:** Secure chat with connected bystanders
- **Message History:** Persistent conversation storage
- **Read Receipts:** Track message delivery and reading status
- **Typing Indicators:** See when someone is composing a message
- **Location Sharing:** Share your current location for safety
- **Media Support:** Send images and files (UI ready)

### 🔔 Notifications System
- **Real-Time Alerts:** Instant notifications via Firestore listeners
- **Category Filtering:** Emergency, Messages, Connections, Updates
- **Smart Management:** Mark as read/unread, bulk actions
- **Unread Badges:** Visual indicators in navbar
- **Action Buttons:** Quick access to related content

### 🤖 AI Safety Assistant
- **SafeGuide AI:** Educational chatbot powered by Gemini
- **Context-Aware Responses:** Understands safety questions
- **Quick Replies:** Common questions as buttons
- **Emergency Disclaimers:** Always directs to emergency services when critical
- **Platform Help:** Explains how to use features
- **Resource Recommendations:** Suggests relevant support services

### 💰 Donation System
- **Paystack Integration:** Secure payment processing
- **Flexible Options:** One-time or monthly recurring donations
- **Multiple Currencies:** Support for African currencies
- **Payment Methods:** Cards, Bank Transfer, Mobile Money (M-Pesa, MTN, etc.)
- **Anonymous Donations:** Optional donor privacy
- **Impact Transparency:** Clear communication of fund usage

### 📱 Pan-African Support
- **54 Countries:** Phone validation for all African nations
- **Auto-Detection:** Identifies country from phone number
- **E.164 Formatting:** Standard international format
- **Contextual Errors:** Helpful validation messages per country

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - Modern UI library with hooks
- **React Router 6.28** - Client-side routing
- **Tailwind CSS 3.4** - Utility-first styling
- **Lucide React** - Beautiful icon library
- **Socket.io Client** - Real-time communication
- **date-fns** - Date manipulation
- **react-hot-toast** - Toast notifications

### Backend & Services
- **Firebase 11.10**
  - Authentication (Email/Password, OAuth)
  - Firestore (Real-time database)
  - Storage (File uploads)
  - Hosting
- **Firestore Security Rules** - Granular access control

### Build Tools
- **Vite 6.0** - Fast development server & build tool
- **PostCSS** - CSS processing
- **Autoprefixer** - Cross-browser compatibility

## 🚀 Getting Started

### Prerequisites
```bash
node >= 16.0.0
npm >= 8.0.0
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/PhilipOndieki/Eveshield.git
cd Eveshield/client
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

### Build for Production
```bash
npm run build
```

### Deploy to Firebase
```bash
npm run deploy
```

## 📁 Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   └── common/      # Shared components
│   │       ├── AIChatbot.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── DonationModal.jsx
│   │       ├── EmptyState.jsx
│   │       ├── FloatingActionButton.jsx
│   │       ├── Modal.jsx
│   │       ├── Navbar.jsx
│   │       └── OptimizedImage.jsx
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── BystandersEnhanced.jsx
│   │   ├── Chat.jsx
│   │   ├── Contacts.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Emergency.jsx
│   │   ├── Incidents.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── Notifications.jsx
│   │   ├── Profile.jsx
│   │   ├── ResourceHub.jsx
│   │   └── SignUp.jsx
│   ├── routes/          # Route protection
│   │   └── ProtectedRoute.jsx
│   ├── utils/           # Utility functions
│   │   ├── firebase.js  # Firebase configuration
│   │   ├── helpers.js   # Helper functions
│   │   ├── images.js    # Image placeholders
│   │   └── validation.js # Validation functions
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── firestore.rules      # Firestore security rules
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🔐 Security

### Firestore Security Rules
- **User Data:** Users can only access their own data
- **Connections:** Only participants can view/modify connections
- **Chats:** Only chat participants can read/write messages
- **Notifications:** Users can only access their own notifications
- **Resources:** Read-only access to verified resources
- **Message Deletion:** Disabled for evidence preservation

### Authentication
- Firebase Authentication with email/password
- Protected routes with React Router
- Automatic redirect to login for unauthenticated users

### Data Privacy
- Incident reports marked as sensitive
- Optional anonymous donations
- User-controlled profile visibility
- Location sharing only during emergencies

## ⚡ Performance

### Code Splitting
- **Lazy Loading:** All pages loaded on-demand
- **React.lazy():** Dynamic imports for routes
- **Suspense:** Loading fallbacks during code splitting

### Optimizations
- **React.memo():** Memoized components to prevent unnecessary re-renders
- **OptimizedImage:** Lazy loading images with error handling
- **Firestore Listeners:** Efficient real-time updates
- **Bundle Optimization:** Vite's automatic code splitting

### Best Practices
- Minimal prop drilling with Context API
- Efficient Firestore queries with proper indexing
- Debounced search inputs
- Pagination for large lists (planned)

## ♿ Accessibility

### WCAG 2.1 AA Compliance
- **Semantic HTML:** Proper use of nav, main, section, article
- **ARIA Labels:** Screen reader friendly
- **Keyboard Navigation:** All interactive elements accessible via keyboard
- **Focus Management:** Visible focus indicators
- **Color Contrast:** 4.5:1 minimum for normal text
- **Alt Text:** All images have descriptive alt attributes

### Mobile Accessibility
- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Responsive Design:** Works on all screen sizes
- **Swipe Gestures:** Where appropriate
- **No Hover-Dependent Functionality**

## 🎨 Design System

### Color Palette
```css
/* Blue Gradient (Primary) */
--deep-navy: #1A2332      /* Headers, primary backgrounds */
--medium-navy: #2C3E50    /* Navigation */
--slate-blue: #34495E     /* Tertiary backgrounds */
--medium-blue: #5C7A99    /* Card backgrounds */
--light-blue: #7B9CB5     /* Hover states */
--sky-blue: #A8C5DA       /* Accents, interactive */
--pale-blue: #D4E6F1      /* Page backgrounds */

/* Emergency/Alert */
--deep-rose: #E91E63      /* ONLY for emergencies */

/* Status Colors */
--success-green: #66BB6A
--warning-orange: #FFA726
--error-red: #D32F2F
--info-blue: #42A5F5
```

### Typography
- **Font:** System UI fonts for optimal performance
- **Scale:** Clear hierarchy (3xl, 2xl, xl, lg, base, sm, xs)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use ESLint and Prettier (configs provided)
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** - High-quality stock photos
- **Lucide Icons** - Beautiful icon set
- **Firebase** - Backend infrastructure
- **Tailwind CSS** - Styling framework
- **React Community** - Amazing ecosystem

## 📞 Support

For support, email support@eveshield.org or join our community Slack.

## 🗺️ Roadmap

- [ ] Group chat functionality
- [ ] Video/voice calls
- [ ] Offline mode with service workers
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with local emergency services

---

**Made with ❤️ for women's safety across Africa**
