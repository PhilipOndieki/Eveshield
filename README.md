# EveShield - Community-Powered Emergency Response Platform

![EveShield Banner](image.png)

**Empowering women's safety across Africa through technology, community, and rapid response.**

## 🌐 Live Demo

- **Production:** [https://eveshield.vercel.app/](https://eveshield.vercel.app/)
- **Pitch Deck:** [View Presentation](https://www.canva.com/design/DAG5-fpywSg/HDTKiUaEu6hKi5KVubHR0w/edit?utm_content=DAG5-fpywSg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

- **Live Video:** [Click to watch the video Preview of](https://youtu.be/5l6Q64MLNjo)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Theme Alignment](#theme-alignment)
3. [Core Features](#core-features)
4. [Technical Architecture](#technical-architecture)
5. [Getting Started](#getting-started)
6. [Feature Documentation](#feature-documentation)
7. [Security & Privacy](#security--privacy)
8. [Design System](#design-system)
9. [Roadmap](#roadmap)
10. [Contributing](#contributing)
11. [License](#license)

---

## 🌟 Overview

EveShield is a comprehensive emergency response platform specifically designed to combat gender-based violence (GBV) and enhance personal safety for women across Africa. Built with React and Firebase, the platform enables users to create personal safety networks with tiered emergency alerts, trusted bystander communities, real-time messaging, AI-powered safety education, and instant access to verified support resources.

### Why EveShield?

- **1 in 3 women** globally experience physical or sexual violence
- In Kenya, **45% of women** have experienced physical violence
- Emergency response times can be **15-30 minutes** in urban areas
- **Community-powered response** can arrive in **2-5 minutes**

---

## 🎯 Theme Alignment: Safety by Design and Survivor Support

EveShield embodies the "Safety by Design and Survivor Support" philosophy through:

### Proactive Protection
- **Tiered Alert System:** Three severity levels (Concern, Immediate, Critical) ensure appropriate response
- **Preventive Features:** Users can alert their network before situations escalate
- **Location Sharing:** Automatic GPS coordinates and reverse geocoding for human-readable addresses

### Community Empowerment
- **Verified Bystander Networks:** Manually verified community members (no stranger access)
- **Invitation-Based System:** All connections require mutual acceptance
- **Response Tracking:** Reliability metrics ensure accountability

### Privacy-First Architecture
- **User-Controlled Data:** Granular privacy controls and data ownership
- **Verified Contacts Only:** No public exposure of sensitive information
- **End-to-End Security:** Encrypted messaging and secure data storage

### Accessible Resources
- **24/7 Hotlines:** Instant access to GBV emergency services (1195, 999)
- **Safe Houses:** Directory of verified shelters (locations secured)
- **Support Services:** Legal aid, counseling, medical facilities
- **Pan-African Support:** Phone validation for all 54 African countries

---

## ✨ Core Features

### 1. 🚨 Tiered Emergency Alert System

A sophisticated three-level emergency response system that ensures appropriate help for every situation.

#### Level 1 - Concern (Orange Alert)
- **Use Case:** Feeling unsafe, being followed, need someone on standby
- **Examples:** Walking alone at night, suspicious person nearby, verbal harassment
- **Response:** Alerts emergency contacts, notifies nearby bystanders, shares location
- **Ideal For:** Preventive measures, early intervention

#### Level 2 - Immediate (Red Alert)
- **Use Case:** Harassment escalating, need help now, threatening situation
- **Examples:** Harassment intensifying, feeling cornered, need immediate intervention
- **Response:** Priority alerts to all contacts, push notifications, location tracking
- **Ideal For:** Situations requiring urgent but non-life-threatening response

#### Level 3 - CRITICAL (Deep Red Alert)
- **Use Case:** Physical attack, severe danger, life-threatening situation
- **Examples:** Physical assault, imminent harm, active violence
- **Response:** Maximum priority alerts, continuous location updates, emergency services contact
- **Ideal For:** Life-threatening emergencies requiring immediate intervention

**Technical Implementation:**
- Real-time GPS location capture with accuracy metrics (±10-50m)
- Reverse geocoding using OpenStreetMap Nominatim API
- Human-readable addresses (e.g., "Kenyatta Avenue, Nairobi Central, Kenya")
- Fallback to coordinates if address lookup fails
- Server timestamp for precise incident tracking
- Automatic incident number generation (INC-YYYY-XXX)

### 2. 👥 Emergency Contacts Management

A robust system for managing your primary safety network.

**Features:**
- **Contact Limit:** Up to 5 trusted contacts
- **Priority Levels:** 
  - Primary contacts (⭐ starred)
  - Secondary contacts
- **Contact Information:**
  - Full name
  - Relationship (Friend, Family, Partner, Colleague, Neighbor, Other)
  - Phone number (validated for African countries)
  - Email address (optional)
  - Verification status
- **One-Tap Actions:**
  - Direct call functionality
  - Edit contact details
  - Delete contacts
- **Verification System:**
  - SMS verification (planned)
  - Email confirmation (planned)
  - Status indicators (Verified ✓ / Pending ⏰)

**Pan-African Phone Support:**
- Validates phone numbers for all 54 African countries
- Auto-detects country from phone number
- Supports local formats (e.g., 0712345678 for Kenya)
- Converts to E.164 international format (+254712345678)
- Contextual error messages per country

### 3. 🛡️ Trusted Bystanders Network

A community-powered safety network with verified connections.

#### User Discovery
- **Browse All Users:** View all registered platform users
- **Search Functionality:** Find users by name or email
- **Profile Information:**
  - Full name and email
  - Location (if shared)
  - Bio/introduction
  - Connection status
- **Smart Filtering:** Hide already-connected users and pending requests

#### Connection Management
- **Send Connection Requests:**
  - Optional personalized message
  - Request status tracking
  - Cancel pending requests
- **Receive Requests:**
  - Real-time notifications
  - View requester profile
  - Accept or decline with one tap
  - See request messages
- **Bi-Directional Relationships:**
  - Both users automatically become connected
  - Equal visibility and permissions
  - Mutual safety network

#### Real-Time Features
- **Live Status Indicators:**
  - Online/offline status
  - Last active timestamp
  - Response reliability metrics
- **Connection Statistics:**
  - Total bystanders count
  - Currently available count
  - Pending invitations count

**Security Measures:**
- Manual verification only (no automated stranger access)
- Invitation acceptance required
- Profile visibility controls
- Block/report functionality (planned)

### 4. 💬 Real-Time Chat System

Secure, encrypted messaging with your trusted bystanders.

**Core Features:**
- **One-on-One Messaging:**
  - Real-time message delivery
  - Message persistence in Firestore
  - Chat history preservation
- **Message Status:**
  - Sent confirmation
  - Read receipts
  - Delivery tracking
  - Typing indicators
- **Rich Content Support:**
  - Text messages
  - Image sharing (UI ready)
  - Location sharing (UI ready)
  - File attachments (UI ready)

**Conversation Management:**
- **Conversation List:**
  - All active chats
  - Last message preview
  - Timestamp (e.g., "2 hours ago")
  - Unread message count
  - Search conversations
- **Chat Interface:**
  - Smooth scrolling
  - Message bubbles (sender/receiver differentiation)
  - Timestamp display
  - Read status indicators
- **Safety Features:**
  - End-to-end encryption notice
  - Message retention for evidence
  - No deletion capability (for safety documentation)

**Technical Implementation:**
- Firestore real-time listeners for instant updates
- Chat ID format: sorted UIDs joined with underscore
- Automatic scrolling to latest message
- Date formatting with date-fns library
- Optimized message rendering with React.memo

### 5. 🔔 Smart Notifications System

Comprehensive notification management with categorization and real-time updates.

**Notification Types:**
- **Emergency:** Alert triggers, safety status updates
- **Connections:** New requests, acceptances, network changes
- **Messages:** New chat messages, unread indicators
- **Safety Updates:** System notifications, feature announcements

**Features:**
- **Real-Time Delivery:**
  - Instant notification on events
  - Firestore listeners for live updates
  - Badge counts in navbar
- **Smart Management:**
  - Mark as read/unread
  - Bulk actions (mark all as read)
  - Delete individual notifications
  - Filter by category
- **Rich Content:**
  - Notification title and message
  - Action buttons (View Details)
  - Timestamp (relative, e.g., "5 minutes ago")
  - Category-specific icons
- **Visual Indicators:**
  - Unread count badge
  - Blue border for unread notifications
  - Category color coding
  - Icon differentiation

**User Experience:**
- Clean, organized interface
- Quick actions without leaving page
- Empty state messaging
- Search functionality (planned)

### 6. 🤖 Eveshield AI Chatbot

An intelligent, empathetic AI assistant powered by Google's Gemini model.

**Capabilities:**
- **Safety Education:**
  - Information about GBV
  - Safety strategies and tips
  - Rights and legal information
  - Prevention techniques
- **Platform Guidance:**
  - How to use emergency alerts
  - Setting up contacts and bystanders
  - Navigating resources
  - Understanding features
- **Emotional Support:**
  - Trauma-informed responses
  - Empowering language
  - Non-judgmental assistance
  - Crisis support guidance

**Technical Features:**
- **Gemini 2.0 Flash Integration:**
  - Fast response times
  - Context-aware conversations
  - Natural language understanding
  - Multi-turn dialogue support
- **Formatted Responses:**
  - Bold headers for emphasis
  - Bullet points for lists
  - Proper spacing and structure
  - Easy-to-read formatting
- **Quick Reply Buttons:**
  - "What is GBV?"
  - "Safety tips"
  - "How to use emergency alert"
  - "Find resources"

**Safety Protocols:**
- **Emergency Disclaimers:**
  - Always directs to 999 for immediate danger
  - Mentions GBV Hotline (1195) for support
  - Provides platform feature guidance
- **Context Awareness:**
  - Remembers conversation history
  - Adapts to user needs
  - Cultural sensitivity for African context
- **Limitations:**
  - Cannot replace human support
  - Not a substitute for emergency services
  - Educational purposes only

### 7. 📱 Incident Report Tracking

Comprehensive documentation and tracking of all emergency alerts.

**Incident Information:**
- **Incident Details:**
  - Unique incident number (INC-YYYY-XXX)
  - Severity level (1, 2, or 3)
  - Status (Active/Resolved)
  - Timestamp (date and time)
- **Location Data:**
  - GPS coordinates (latitude/longitude)
  - Human-readable address
  - Accuracy radius
- **Alert Details:**
  - Severity description
  - Custom user notes
  - Trigger method (manual/automatic)
- **Response Tracking:**
  - Contacts notified count
  - Bystanders alerted count
  - Response timeline
  - Action log

**Statistics Dashboard:**
- Total incidents count
- Active alerts count
- Resolved incidents count
- Average response time

**Evidence Preservation:**
- Immutable records for legal purposes
- Timestamp integrity
- Location verification
- Export capability (planned)

### 8. 📚 Support Resource Hub

A comprehensive, categorized directory of verified support services.

**Categories:**
1. **Emergency Hotlines:**
   - GBV Emergency Hotline (1195)
   - Kenya Police Emergency (999)
   - Ambulance Services
   - Crisis Lines

2. **Safe Houses & Shelters:**
   - FIDA Kenya Safe House
   - Women's shelters
   - Temporary accommodation
   - Secure locations (addresses protected)

3. **Police Stations:**
   - Gender Desks
   - Reporting centers
   - Legal assistance
   - Protection orders

4. **Hospitals & Medical:**
   - Kenyatta National Hospital
   - GBV response units
   - Post-rape care centers
   - Mental health services

5. **Legal Aid:**
   - FIDA Kenya
   - COVAW (Coalition on Violence Against Women)
   - Free legal consultation
   - Court accompaniment

6. **Counseling & Mental Health:**
   - Trauma counseling
   - Support groups
   - Therapy services
   - Peer support

**Resource Information:**
- **Contact Details:**
  - Phone numbers (clickable to call)
  - Email addresses
  - Physical addresses
- **Availability:**
  - 24/7 services highlighted
  - Operating hours
  - Weekend availability
- **Additional Info:**
  - Languages supported (English, Swahili, more)
  - Distance from user location
  - Verification status (✓ Verified)
  - Service descriptions

**Features:**
- **Search Functionality:** Find resources by name, type, or location
- **Category Filtering:** Quick navigation by service type
- **One-Tap Actions:**
  - Call now button
  - Get directions (Google Maps integration)
  - Email contact
- **Offline Access:** Cache for emergency use (planned)

### 9. 💰 Donation System

Secure, flexible donation platform powered by Paystack.

**Payment Options:**
- **Frequency:**
  - One-time donation
  - Monthly recurring (subscription)
- **Amounts:**
  - Preset amounts (500, 1000, 2500, 5000, 10000, 25000 KES)
  - Custom amount option
- **Currencies Supported:**
  - KES (Kenyan Shilling)

**Payment Methods (via Paystack):**
- Mobile Money:
  - M-Pesa (Kenya)

**Donation Features:**
- **Anonymous Donations:** Option to donate anonymously
- **Donor Information:**
  - Name (optional)
  - Email (required)
  - Personal message (optional)
- **Impact Transparency:**
  - Clear fund usage breakdown
  - Platform operations
  - Community initiatives
  - Feature development
- **Security:**
  - Paystack secure checkout
  - PCI DSS compliant
  - Payment verification
  - Transaction receipts

**Technical Implementation:**
- Paystack popup integration
- Payment reference generation
- Transaction verification
- Firestore donation records
- Real-time payment status
- Error handling and retry logic

### 10. 👤 User Profile & Settings

Comprehensive profile management and customization.

#### Personal Information
- **Profile Details:**
  - Full name
  - Email address (verified)
  - Phone number
  - Location/Address (optional)
  - Profile photo upload
- **Edit Capabilities:**
  - Update all fields
  - Change profile picture
  - Location sharing preferences

#### Security & Privacy
- **Password Management:**
  - Change password
  - Password strength indicator
  - Secure authentication
- **Privacy Controls:**
  - Location sharing toggle
  - Profile visibility settings
  - Data sharing preferences
- **Account Management:**
  - Download your data (GDPR compliance)
  - Delete account
  - Data export

#### Notification Preferences
- **Alert Notifications:**
  - Emergency alert sounds
  - Vibration/haptic feedback
  - Push notifications
- **Email Notifications:**
  - Safety tips (weekly)
  - Monthly safety report
  - Platform updates
- **Communication:**
  - Message notifications
  - Connection requests
  - System alerts

#### Safety Settings
- **Emergency Configuration:**
  - Quick SOS gesture (power button 5x)
  - Silent alarm mode
  - Auto-record audio during alerts
- **Default Alert Settings:**
  - Default severity level
  - Auto-notify preferences
  - Alert customization

#### App Preferences
- **Theme:**
  - Light mode
  - Dark mode (planned)
  - System default
- **Language:**
  - English
  - Swahili
  - More languages (planned)
- **Accessibility:**
  - High contrast mode
  - Large touch targets
  - Screen reader optimization
  - Font size adjustment

---

## 🛠️ Technical Architecture

### Frontend Stack

```javascript
{
  "framework": "React 18.3",
  "buildTool": "Vite 6.0",
  "styling": "Tailwind CSS 3.4",
  "routing": "React Router 6.28",
  "icons": "Lucide React 0.468",
  "dateHandling": "date-fns 4.1",
  "notifications": "react-hot-toast 2.6",
  "AI": "Google Generative AI (Gemini) 0.24"
}
```

### Backend & Services

```javascript
{
  "authentication": "Firebase Auth 11.10",
  "database": "Cloud Firestore",
  "storage": "Firebase Storage",
  "hosting": "Firebase Hosting / Vercel",
  "payments": "Paystack API",
  "geolocation": "OpenStreetMap Nominatim",
  "AI": "Google Gemini 2.0 Flash"
}
```

### Project Structure

```
client/
├── public/                 # Static assets
│   └── index.html         # Firebase hosting placeholder
├── src/
│   ├── components/        # Reusable UI components
│   │   └── common/        # Shared components
│   │       ├── AIChatbot.jsx          # AI assistant component
│   │       ├── Button.jsx             # Reusable button
│   │       ├── Card.jsx               # Card container
│   │       ├── DonationModal.jsx      # Donation interface
│   │       ├── EmptyState.jsx         # Empty states
│   │       ├── FloatingActionButton.jsx # Emergency SOS button
│   │       ├── Modal.jsx              # Modal wrapper
│   │       ├── Navbar.jsx             # Navigation bar
│   │       └── OptimizedImage.jsx     # Image component
│   ├── context/           # React Context providers
│   │   └── AuthContext.jsx            # Authentication state
│   ├── pages/             # Page components
│   │   ├── BystandersEnhanced.jsx     # Bystander network
│   │   ├── Chat.jsx                   # Messaging interface
│   │   ├── Contacts.jsx               # Emergency contacts
│   │   ├── Dashboard.jsx              # Main dashboard
│   │   ├── Emergency.jsx              # Alert trigger page
│   │   ├── Incidents.jsx              # Incident reports
│   │   ├── LandingPage.jsx            # Public homepage
│   │   ├── Login.jsx                  # Sign in
│   │   ├── Notifications.jsx          # Notification center
│   │   ├── Profile.jsx                # User settings
│   │   ├── ResourceHub.jsx            # Support resources
│   │   └── SignUp.jsx                 # Registration
│   ├── routes/            # Route protection
│   │   └── ProtectedRoute.jsx         # Auth guard
│   ├── utils/             # Utility functions
│   │   ├── firebase.js                # Firebase config
│   │   ├── helpers.js                 # Helper functions
│   │   ├── images.js                  # Image placeholders
│   │   ├── paystack.js                # Payment integration
│   │   └── validation.js              # Form validation
│   ├── App.jsx            # Main app component
│   ├── index.css          # Tailwind imports
│   └── main.jsx           # Entry point
├── .env.example           # Environment template
├── .firebaserc            # Firebase project config
├── firebase.json          # Firebase hosting config
├── firestore.indexes.json # Firestore indexes
├── firestore.rules        # Security rules
├── package.json           # Dependencies
├── tailwind.config.js     # Tailwind configuration
└── vite.config.js         # Vite configuration
```

### Database Schema

#### Collections

1. **users/**
   ```javascript
   {
     fullName: string,
     email: string,
     phoneNumber: string,
     location: string (optional),
     bio: string (optional),
     photoURL: string (optional),
     createdAt: timestamp,
     updatedAt: timestamp,
     authProvider: "email" | "google"
   }
   ```

2. **users/{userId}/emergencyContacts/**
   ```javascript
   {
     fullName: string,
     relationship: string,
     phoneNumber: string,
     email: string (optional),
     priority: "Primary" | "Secondary",
     verified: boolean,
     createdAt: timestamp
   }
   ```

3. **users/{userId}/incidents/**
   ```javascript
   {
     incidentNumber: string,
     severity: 1 | 2 | 3,
     status: "active" | "resolved",
     triggeredAt: timestamp,
     location: {
       lat: number,
       lng: number,
       accuracy: number,
       address: string
     },
     alertDetails: {
       description: string,
       customNotes: string,
       method: "manual" | "automatic"
     },
     notifications: {
       emergencyContacts: array,
       bystanders: array
     },
     responseLog: array
   }
   ```

4. **connections/**
   ```javascript
   {
     fromUserId: string,
     fromUserProfile: {
       id: string,
       fullName: string,
       email: string,
       photoURL: string
     },
     toUserId: string,
     toUserProfile: {
       id: string,
       fullName: string,
       email: string,
       photoURL: string
     },
     status: "pending" | "accepted" | "declined",
     message: string (optional),
     createdAt: timestamp,
     acceptedAt: timestamp (optional)
   }
   ```

5. **chats/{chatId}/messages/**
   ```javascript
   {
     senderId: string,
     senderName: string,
     receiverId: string,
     text: string,
     timestamp: timestamp,
     read: boolean
   }
   ```

6. **notifications/**
   ```javascript
   {
     userId: string,
     type: "emergency" | "connection" | "message" | "safety",
     title: string,
     message: string,
     read: boolean,
     actionUrl: string (optional),
     metadata: object (optional),
     createdAt: timestamp
   }
   ```

7. **donations/**
   ```javascript
   {
     userId: string,
     donorEmail: string,
     donorName: string,
     isAnonymous: boolean,
     amount: number,
     currency: string,
     frequency: "once" | "monthly",
     message: string (optional),
     reference: string,
     status: "completed" | "pending" | "failed",
     paystackResponse: object,
     createdAt: timestamp
   }
   ```

---

## 🚀 Getting Started

### Prerequisites

```bash
node >= 16.0.0
npm >= 8.0.0
Git
Firebase account (free tier)
Google Cloud account (for Gemini API)
Paystack account (for donations)
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

3. **Set up Firebase**

   - Create a new Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable the following services:
     - Authentication (Email/Password, Google)
     - Cloud Firestore
     - Storage
     - Hosting

4. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
   VITE_FIREBASE_PROJECT_ID=your_project_id_here
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
   VITE_FIREBASE_APP_ID=your_app_id_here

   # Gemini AI Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key_here

   # Paystack Configuration
   VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
   ```

5. **Set up Firestore Security Rules**

   In Firebase Console > Firestore Database > Rules, paste the rules from `firestore.rules`

6. **Set up Firestore Indexes**

   ```bash
   firebase deploy --only firestore:indexes
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

8. **Build for production**
   ```bash
   npm run build
   ```

9. **Deploy**
   ```bash
   # Deploy to Firebase
   firebase deploy

   # Or deploy to Vercel
   vercel --prod
   ```

---

## 📖 Feature Documentation

### Emergency Alert Workflow

1. **Trigger Alert:**
   - Navigate to `/emergency` or click floating SOS button
   - Select severity level (1, 2, or 3)
   - System captures GPS location
   - Reverse geocoding provides readable address

2. **Confirmation:**
   - Review location and recipients
   - Add optional context notes
   - Confirm alert sending

3. **Alert Distribution:**
   - Create incident in Firestore
   - Notify all emergency contacts
   - Alert nearby bystanders
   - Log response timeline

4. **Resolution:**
   - Mark as safe when resolved
   - Generate incident report
   - Store for future reference

### Bystander Connection Flow

1. **Discovery:**
   - Browse all platform users
   - Search by name or email
   - View user profiles

2. **Request:**
   - Click "Send Request"
   - Add optional message
   - Submit connection request

3. **Notification:**
   - Recipient receives real-time notification
   - View request details
   - Accept or decline

4. **Connection:**
   - Bi-directional relationship created
   - Both users added to each other's networks
   - Enable messaging and emergency alerts

### Chat System Usage

1. **Starting Conversation:**
   - Navigate to `/chat`
   - Select connected bystander
   - Type and send message

2. **Message Features:**
   - Real-time delivery
   - Read receipts
   - Typing indicators
   - Media sharing (planned)

3. **Conversation Management:**
   - Search conversations
   - View message history
   - Persistent chat records

### AI Chatbot Interaction

1. **Access:**
   - Click chatbot button (bottom right)
   - Available on all authenticated pages

2. **Quick Replies:**
   - Tap predefined questions
   - Get instant responses

3. **Custom Questions:**
   - Type your question
   - Receive contextual answer
   - Follow-up questions supported

4. **Emergency Guidance:**
   - Always directed to proper channels
   - Cannot replace emergency services
   - Educational support only

---

## 🔐 Security & Privacy

### Authentication
- Firebase Authentication with email/password
- Google OAuth integration
- Protected routes with authentication guards
- Session management
- Password strength requirements (8+ characters)

### Data Security
- **Firestore Security Rules:**
  - User can only access their own data
  - Connections visible to both participants
  - Messages only accessible to chat participants
  - Notifications user-specific
  - Resources read-only
- **Encryption:**
  - Data encrypted at rest (Firebase)
  - HTTPS for all communications
  - Secure token-based authentication

### Privacy Protection
- User-verified bystanders only (no stranger access)
- Manual connection approval required
- Granular privacy controls
- Location sharing with explicit consent
- Data export and deletion capabilities
- Anonymous donation option
- Secure shelter locations (not publicly displayed)

### Evidence Preservation
- Incident reports marked as immutable
- Message deletion disabled
- Timestamp integrity
- Location verification
- Audit trail for all actions

---

## 🎨 Design System

### Color Palette

#### Blue Gradient (Primary Theme)
```css
--deep-navy: #1A2332      /* Headers, primary backgrounds */
--medium-navy: #2C3E50    /* Navigation, secondary backgrounds */
--slate-blue: #34495E     /* Tertiary backgrounds */
--medium-blue: #5C7A99    /* Card backgrounds */
--light-blue: #7B9CB5     /* Hover states, light cards */
--sky-blue: #A8C5DA       /* Accents, interactive elements */
--pale-blue: #D4E6F1      /* Page backgrounds */
```

#### Emergency/Alert Colors
```css
--deep-rose: #E91E63      /* ONLY for emergencies */
--concern: #FFA726        /* Level 1 alerts */
--immediate: #FF6B6B      /* Level 2 alerts */
--critical: #D32F2F       /* Level 3 alerts */
```

#### Status Colors
```css
--success-green: #66BB6A
--warning-orange: #FFA726
--error-red: #D32F2F
--info-blue: #42A5F5
```

#### Neutral Colors
```css
--dark-charcoal: #2D2D2D  /* Primary text */
--warm-gray: #666666      /* Secondary text */
```

### Typography
- **Font Family:** System UI fonts (optimized performance)
- **Scale:** 
  - 3xl: Hero headings
  - 2xl: Page titles
  - xl: Section headings
  - lg: Subsections
  - base: Body text
  - sm: Secondary text
  - xs: Labels, captions

### Components
- **Cards:** Rounded corners, subtle shadows, hover effects
- **Buttons:** 
  - Primary (Deep Rose - emergencies only)
  - Secondary (Outlined)
  - Success, Warning, Danger variants
- **Forms:** 
  - Floating labels
  - Inline validation
  - Clear error messages
- **Icons:** Lucide React (consistent, scalable)

### Design Principles
- **Mobile-First:** Responsive design starting from 320px
- **Accessibility:** WCAG 2.1 AA compliance
  - Semantic HTML
  - ARIA labels
  - Keyboard navigation
  - Focus indicators
  - Color contrast 4.5:1 minimum
- **Performance:**
  - Lazy loading images
  - Code splitting
  - Optimized bundle size
  - Memoized components
- **Consistency:**
  - Reusable components
  - Design tokens
  - Systematic spacing
  - Predictable patterns

---

## 🗺️ Roadmap

### Phase 2 (Q2 2025)
- [ ] SMS notifications for alerts (Twilio/Africa's Talking)
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] Live location tracking during active alerts
- [ ] Audio recording as evidence
- [ ] Multi-language support (Swahili, French, Arabic)
- [ ] Dark mode
- [ ] Progressive Web App (PWA) capabilities
- [ ] Offline functionality with service workers

### Phase 3 (Q3 2025)
- [ ] AI-powered risk assessment
- [ ] Integration with law enforcement systems
- [ ] Community safe zones mapping
- [ ] Verified business partnerships (safe havens)
- [ ] Video evidence capture
- [ ] Wearable device support (smartwatches)
- [ ] Group chat functionality
- [ ] Voice/video calls

### Phase 4 (Q4 2025)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations
- [ ] Blockchain-based evidence storage
- [ ] Machine learning for threat detection
- [ ] International expansion (rest of Africa)
- [ ] Partnership with NGOs and government agencies

---

## 🤝 Contributing

We welcome contributions from developers, designers, and safety advocates!

### How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/Eveshield.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add AmazingFeature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Code Style
- Use ESLint and Prettier (configs provided)
- Follow React best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

### Testing
- Write unit tests for new features
- Ensure existing tests pass
- Test on multiple devices/browsers
- Verify accessibility compliance

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Philip Ondieki / EveShield

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

### Built For
- **Power Hacks 2025** - Theme: "Safety by Design and Survivor Support"
- **Women and vulnerable individuals** across Africa

### Technology Partners
- **Firebase** - Backend infrastructure and authentication
- **Google Gemini** - AI-powered safety education
- **Paystack** - Secure payment processing
- **Vercel** - Fast, reliable hosting
- **Unsplash** - High-quality imagery
- **OpenStreetMap** - Geocoding services

### Inspiration
- **GBV support organizations** in Kenya (FIDA, COVAW)
- **Survivors and advocates** who inspire this work
- **React community** for amazing tools and libraries
- **Open source contributors** worldwide

### Special Thanks
- Power Hacks 2025 organizers
- Mentors and reviewers
- Beta testers and early adopters
- Everyone working to make the world safer

---

## 📞 Support & Contact

### Get Help
- **Email:** Philipbarongo30@gmail.com
- **Emergency:** Always call 999 or 1195 for immediate help

### Developers
- **Name:** Philip Ondieki
- **Email:** philipbarongo30@gmail.com
- **Name:** Austin Ojango
- **Email:** austinojango@gmail.com
- **Name:** Sheilla Jepngetich
- **Email:** chesiresheilla2@gmail.com
- **Name:** Rahma Ahmed
- **Email:** rahmadekow9@gmail.com
- **Name:** Edith Karanja
- **Email:** edithkaranja02@gmail.com
- **Name:** Fatima Amir Muazu
- **Email:** amir.m1700769@st.futminna.edu.ng

---

## 📊 Project Statistics

- **Lines of Code:** ~15,000+
- **Components:** 30+
- **Pages:** 13
- **Supported Countries:** 54 (all of Africa)
- **Supported Languages:** 2 (English, Swahili)
- **Payment Methods:** 10+ (via Paystack)
- **Resource Categories:** 6
- **Alert Levels:** 3

---

## 🌍 Impact Vision

### Our Mission
To create a world where every woman feels safe, supported, and empowered through technology and community.

### Our Goals
- **100,000 users** by end of 2025
- **1 million** safety connections created
- **10 countries** across Africa
- **50+ verified** support organizations
- **<2 minutes** average community response time

### Success Metrics
- Number of alerts successfully responded to
- Community response times
- User satisfaction scores
- Incident prevention rate
- Platform reliability (99.9% uptime)

---

*Safety isn't a privilege, it's a button.*

---

**Last Updated:** November 29, 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅