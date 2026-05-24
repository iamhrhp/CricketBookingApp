# Cricket Turf Booking (Agentic AI)

A cricket turf booking app to discover clubs, book slots, create activities, and get AI booking assistance.

---

# Tabs

* Home
* Booking
* AI
* Notifications
* Profile

---

# Flow

Splash → Login → Home → Club → Booking → Payment → Confirmation

---

# Home

* Club List
* Search Clubs
* Nearby Clubs
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

Slot → Duration → Amount → Checkout → Payment

### Payment

* UPI
* Pay Later at Club

---

# Activities

* Activity Name
* Date & Time
* Player Count
* Join Activity

---

# AI

* Create Activity
* Suggest Clubs
* Suggest Slots
* Booking Help

---

# Notifications

* Booking Updates
* Activity Invites

---

# Profile

* User Details
* Activity History
* Logout


APP FLOW STRUCTURE

Cricket Turf Booking (Agentic AI)
│
├── Splash Screen
│     └── Check Auth State
│
├── Authentication
│     ├── Login
│     ├── Signup
│     └── Google Login
│
├── Main App (Bottom Tabs)
│
│
├── HOME TAB
│     │
│     ├── Home Screen
│     │     ├── Club List
│     │     ├── Search Clubs
│     │     ├── Nearby Clubs
│     │     └── Create Activity (+)
│     │
│     ├── Club Details
│     │     ├── Images
│     │     ├── Timing
│     │     ├── Facilities
│     │     └── Tabs
│     │           ├── Info
│     │           ├── Booking
│     │           └── Activities
│     │
│     └── Create Activity
│           ├── Activity Name
│           ├── Player Size
│           ├── Select Club
│           ├── Comment
│           └── Create Activity
│
│
├── BOOKING TAB
│     │
│     ├── Slot Selection
│     │
│     ├── Duration Selection
│     │
│     ├── Amount Selection
│     │
│     ├── Checkout Screen
│     │     ├── Club Name
│     │     ├── Slot Time
│     │     ├── Duration
│     │     ├── Player Size
│     │     └── Amount
│     │
│     ├── Payment Screen
│     │     ├── UPI
│     │     ├── Card
│     │     ├── Wallet
│     │     └── Pay Later at Club
│     │
│     └── Booking Confirmation
│           ├── Booking ID
│           ├── Payment Success
│           └── Booking Details
│
│
├── AI TAB
│     │
│     └── AI Chat Screen
│           ├── Create Activity
│           ├── Suggest Clubs
│           ├── Suggest Slots
│           ├── Booking Help
│           └── Smart Recommendations
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
      ├── Edit Profile
      ├── Booking History
      ├── Activity History
      ├── Saved Clubs
      └── Logout