# EveShield - Community-Powered Emergency Response Platform

[![Built for Power Hacks 2025](https://img.shields.io/badge/Built%20for-Power%20Hacks%202025-E91E63)]()
[![Theme](https://img.shields.io/badge/Theme-Safety%20by%20Design-FFB6C1)]()

## 🌟 Overview

EveShield is a community-powered emergency response platform designed for gender-based violence (GBV) prevention and survivor support. Built with React and Firebase, it enables users to build personal safety networks with tiered emergency alert capabilities, trusted bystander networks, and instant access to verified support resources.

### Theme Alignment: Safety by Design

EveShield embodies "Safety by Design" through:
- **Proactive Protection**: Tiered alert system for varying threat levels
- **Community Empowerment**: Verified bystander networks for rapid response
- **Privacy-First Architecture**: User-controlled data and verified contacts only
- **Accessible Resources**: Instant access to GBV hotlines, safe houses, and support services

## ✨ Key Features

### 1. **Tiered Panic Button / Emergency SOS**
Three severity levels ensure appropriate response:
- **Level 1 (Concern)**: Feeling unsafe, need someone on standby
- **Level 2 (Immediate)**: Harassment escalating, need help now
- **Level 3 (CRITICAL)**: Life-threatening situation, urgent intervention

### 2. **Emergency Contacts Management**
- Add up to 5 trusted contacts
- Priority levels (Primary/Secondary)
- Verification system via SMS
- One-tap call functionality

### 3. **Trusted Bystanders Network**
- Manually verified community members only (NO stranger access)
- Invitation-based system with acceptance required
- Location-aware response for nearby help
- Response tracking and reliability metrics

### 4. **Incident Report Tracking**
- Comprehensive incident documentation
- Timeline of events and responses
- Evidence storage (location, timestamps, notes)
- Exportable reports for authorities

### 5. **Support Resource Hub**
- Verified GBV hotlines (24/7 access)
- Safe houses and shelters (secure locations)
- Police stations and medical facilities
- Legal aid and counseling services
- Categorized and searchable directory

### 6. **User Profile & Settings**
- Personal information management
- Security and privacy controls
- Notification preferences
- Safety configuration options

## 🎨 Design System

### Color Palette
- **Primary**: Soft Pink (#FFB6C1), Deep Rose (#E91E63), Pale Pink (#FFF0F5)
- **Neutrals**: White (#FFFFFF), Dark Charcoal (#2D2D2D), Warm Gray (#666666)
- **Alert Levels**: Orange (#FFA726), Red (#FF6B6B), Deep Red (#D32F2F)
- **Status**: Green (#66BB6A), Blue (#42A5F5)

### Design Principles
- Solid colors only (no gradients)
- Mobile-first responsive design
- High accessibility standards (WCAG AA)
- Intuitive, empathetic UX for crisis situations

## 🛠️ Technology Stack

- **Frontend**: React 18.3+ with JSX
- **Styling**: Tailwind CSS (utility-first)
- **Backend**: Firebase (Firestore, Auth, Hosting)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel / Firebase Hosting

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase account (free tier)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PhilipOndieki/Eveshield.git
   cd Eveshield
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**

   Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)

   Enable the following services:
   - Authentication (Email/Password)
   - Cloud Firestore
   - Storage (optional)
   - Hosting

4. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

   Fill in your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here
   ```

5. **Set up Firestore Security Rules**

   In Firebase Console > Firestore Database > Rules, paste:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;

         match /emergencyContacts/{contactId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }

         match /trustedBystanders/{bystanderId} {
           allow read: if request.auth != null && (
             request.auth.uid == userId ||
             request.auth.uid == bystanderId
           );
           allow write: if request.auth != null && request.auth.uid == userId;
         }

         match /incidents/{incidentId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }

       match /resources/{resourceId} {
         allow read: if request.auth != null;
       }
     }
   }
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

7. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
eveshield/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/      # Base components (Button, Card, Modal, etc.)
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── LandingPage.jsx
│   │   ├── Login.jsx
│   │   ├── SignUp.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Emergency.jsx
│   │   ├── Contacts.jsx
│   │   ├── Bystanders.jsx
│   │   ├── Incidents.jsx
│   │   ├── ResourceHub.jsx
│   │   └── Profile.jsx
│   ├── context/         # React Context providers
│   │   └── AuthContext.jsx
│   ├── routes/          # Route protection
│   │   └── ProtectedRoute.jsx
│   ├── utils/           # Utility functions
│   │   ├── firebase.js
│   │   ├── validation.js
│   │   └── helpers.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind imports
├── .env.example         # Environment variables template
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🔐 Security Features

### Privacy Protection
- User-verified bystanders only (prevents predator access)
- Encrypted Firestore storage
- Granular privacy controls
- Location sharing with user consent only
- Data export and deletion capabilities

### Authentication
- Firebase Authentication (Email/Password)
- Session management
- Password strength requirements (8+ characters)
- Protected routes with authentication guards

### Data Security
- Firestore security rules enforce user ownership
- No public access to sensitive data
- Secure shelter locations (not displayed publicly)

## 📱 User Flows

### New User Journey
1. Land on homepage → View value propositions
2. Sign up with email, phone, and password
3. Verify email (optional but recommended)
4. Complete onboarding checklist:
   - Add 3-5 emergency contacts
   - Invite trusted bystanders
   - Test emergency alert
   - Explore resource hub

### Emergency Alert Flow
1. Trigger alert via dashboard, floating button, or quick gesture
2. Select severity level (1, 2, or 3)
3. Review location and alert recipients
4. Add optional context notes
5. Confirm and send alert
6. Receive real-time response tracking
7. Mark as safe when resolved

## 🌍 Impact & Use Cases

### Target Users
- Women and vulnerable individuals at risk of GBV
- Students on university campuses
- People walking alone in unfamiliar areas
- Community members supporting survivor safety

### Real-World Scenarios
- Walking home alone at night (Level 1)
- Verbal harassment escalating (Level 2)
- Physical assault or imminent danger (Level 3)
- Building a trusted safety circle in new neighborhoods

## 🚧 Future Enhancements

### Phase 2 Features
- [ ] SMS notifications for alerts (via Twilio)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Live location tracking during active alerts
- [ ] Audio recording as evidence
- [ ] Multi-language support (Swahili, more)
- [ ] Dark mode
- [ ] Progressive Web App (PWA) capabilities
- [ ] Offline functionality

### Phase 3 Features
- [ ] AI-powered risk assessment
- [ ] Integration with law enforcement systems
- [ ] Community safe zones mapping
- [ ] Verified business partnerships (safe havens)
- [ ] Video evidence capture
- [ ] Wearable device support (smartwatches)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Team

Built for Power Hacks 2025

- **Developer**: Philip Ondieki
- **Theme**: Safety by Design

## 🙏 Acknowledgments

- Power Hacks 2025 organizers
- GBV support organizations in Kenya (FIDA, COVAW)
- Open source community (React, Tailwind CSS, Firebase)
- Survivors and advocates who inspired this platform

---

**Built with 💜 for Power Hacks 2025 - Safety by Design**

*Safety isn’t a Privilege it’s a Button.*