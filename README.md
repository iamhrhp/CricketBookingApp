

# Cricket Turf Booking (Agentic AI)

# APK Download Link  : https://drive.google.com/file/d/10ghAMepL4d1kNBQfAm2Rr5j2vLfvXOF6/view?usp=drive_link

A cricket turf booking app to discover clubs, book slots, create activities, and get AI booking assistance.

---

# Install & Run

```bash
npm install
npm run ios      # or: npm run android
npm start        # Metro bundler (separate terminal)
```

**Firebase setup (first time):**

```bash
cp src/config/firebase.example.ts src/config/firebase.local.ts
cp android/app/google-services.json.example android/app/google-services.json
cp ios/CricketBookingAppCLI/GoogleService-Info.plist.example ios/CricketBookingAppCLI/GoogleService-Info.plist
```

Add your Firebase / Google Sign-In values in those files, then run `npm run setup-secrets`.  
See [SECRETS.md](./SECRETS.md) for details.

---

# Tabs

* Home
* Booking
* AI
* Notifications
* Profile

---

# Flow

Splash → Login (Google) → Home → Club → Booking → Payment → Confirmation

---

# Home

* Search Clubs
* Nearby Clubs (max 5)
* All Clubs (max 5 + See All)
* Create Activity (+)

### Club Card

* Image
* Name
* Timing
* Location

---

# Create Activity

* Activity Name
* Player Size
* Select Club
* Comment

---

# Club Details

### Tabs

* Info
* Booking
* Activities

### Details

* Images
* Timing
* Facilities

---

# Booking

Booking tab shows your booking list → tap for Booking Details.

New booking flow (from Club Details → Booking tab):

Slot → Duration → Amount → Checkout → Payment → Confirmation

### Payment

* UPI
* Pay Later at Club

---

# Activities

* Activity Name
* Date & Time
* Player Count
* Slot, Duration, Amount
* Join Activity

---

# AI

* Create Activity (Agentic AI chat)
* Promoted Clubs

### AI Activity Agent

Step-by-step chat: Name → Players → Club → Date → Time → Notes → Confirm & Create

---

# Notifications

* Booking Updates
* Booking Reminder
* Activity Invites
* Payment Updates

---

# Profile

* User Details
* Booking History
* Activity History
* Logout


APP FLOW STRUCTURE

Cricket Turf Booking (Agentic AI)
│
├── Splash Screen
│     └── Check Auth State
│
├── Authentication
│     └── Google Login
│
├── Main App (Bottom Tabs)
│
│
├── HOME TAB
│     │
│     ├── Home Screen
│     │     ├── Search Clubs
│     │     ├── Nearby Clubs
│     │     ├── All Clubs (+ See All)
│     │     └── Create Activity (+)
│     │
│     ├── All Clubs
│     │
│     ├── Club Details
│     │     └── Tabs
│     │           ├── Info
│     │           ├── Booking
│     │           └── Activities
│     │
│     ├── Create Activity
│     │     ├── Activity Name
│     │     ├── Player Size
│     │     ├── Select Club
│     │     └── Comment
│     │
│     ├── Select Club
│     │
│     ├── Activity Details
│     │
│     ├── Checkout Screen
│     │
│     ├── Payment Screen
│     │     ├── UPI
│     │     └── Pay Later at Club
│     │
│     └── Booking Confirmation
│
│
├── BOOKING TAB
│     │
│     ├── Booking List
│     │
│     └── Booking Details
│
│
├── AI TAB
│     │
│     ├── AI Home
│     │     ├── Create Activity (Agentic AI)
│     │     └── Promoted Clubs
│     │
│     └── AI Activity Agent
│           └── Chat: Name → Players → Club → Date → Time → Notes
│
│
├── NOTIFICATIONS TAB
│     │
│     ├── Booking Updates
│     ├── Booking Reminder
│     ├── Activity Invite
│     └── Payment Updates
│
│
└── PROFILE TAB
      │
      ├── User Details
      ├── Booking History
      ├── Activity History
      └── Logout
