# Product Requirements Document (PRD)

**Product:** Cricket Turf Booking (Agentic AI)  
**Platform:** React Native (iOS & Android)  
**Version:** 1.0

---

## 1. Product Overview

Cricket Turf Booking is a mobile app that helps cricket players discover turf clubs, book slots, create group activities, and join matches. An agentic AI assistant guides users through activity creation via a conversational chat flow.

---

## 2. Goals

* Let users find and book cricket turfs near them quickly
* Enable players to create and join group activities (gully matches, nets, corporate games)
* Provide a simple booking flow with clear payment options
* Use AI to reduce friction when creating activities
* Keep booking and activity history in one profile

---

## 3. Target Users

* Casual cricket players looking for turfs
* Groups organizing weekend matches
* Players who want to join open activities at local clubs

---

## 4. User Flow

```
Splash → Login (Google) → Home → Club Details → Book Slot → Payment → Confirmation
Home → Create Activity (manual or AI) → Activity Details
Booking Tab → Booking Details
Profile → Booking / Activity History
```

---

## 5. Functional Requirements

### 5.1 Authentication

| ID | Requirement |
|----|-------------|
| AUTH-1 | Splash screen checks auth state |
| AUTH-2 | Google Sign-In via Firebase |
| AUTH-3 | Logout from Profile |

### 5.2 Home

| ID | Requirement |
|----|-------------|
| HOME-1 | Search clubs by name/location |
| HOME-2 | Show Nearby Clubs (max 5) |
| HOME-3 | Show All Clubs preview (max 5) + See All screen |
| HOME-4 | Club card: image, name, timing, location, rating, price |
| HOME-5 | FAB (+) to create activity manually |
| HOME-6 | Tap club → Club Details |

### 5.3 Club Details

| ID | Requirement |
|----|-------------|
| CLUB-1 | **Info tab:** gallery, timing, facilities |
| CLUB-2 | **Booking tab:** select date, slot, duration, amount |
| CLUB-3 | **Activities tab:** list activities at club; join or open details |
| CLUB-4 | Proceed to Checkout from Booking tab |

### 5.4 Booking & Payment

| ID | Requirement |
|----|-------------|
| BOOK-1 | Checkout shows club, slot, duration, amount summary |
| BOOK-2 | Payment methods: UPI, Pay Later at Club |
| BOOK-3 | Confirmation shows booking ID and success state |
| BOOK-4 | Booking tab lists all user bookings |
| BOOK-5 | Tap booking → Booking Details |

### 5.5 Create Activity (Manual)

| ID | Requirement |
|----|-------------|
| ACT-1 | Fields: activity name, player size, club, comment |
| ACT-2 | Select Club screen with search |
| ACT-3 | Create activity and return to previous screen |

### 5.6 Activity Details

| ID | Requirement |
|----|-------------|
| ACTD-1 | Show name, club, date/time, slot, duration, amount, host |
| ACTD-2 | Show status: upcoming / in progress / completed |
| ACTD-3 | Show player list with count |
| ACTD-4 | Join Activity when open and not full |

### 5.7 AI Tab

| ID | Requirement |
|----|-------------|
| AI-1 | AI Home with Create Activity agent card |
| AI-2 | Chat agent collects: Name, Players, Club, Date, Time, Notes |
| AI-3 | Progress indicator (steps collected) |
| AI-4 | Confirm & Create → Activity Details |
| AI-5 | Promoted Clubs section at bottom |

### 5.8 Notifications

| ID | Requirement |
|----|-------------|
| NOTIF-1 | List booking updates, reminders, activity invites, payment updates |
| NOTIF-2 | Show read/unread state |

### 5.9 Profile

| ID | Requirement |
|----|-------------|
| PROF-1 | Show user name, email, photo, city |
| PROF-2 | Booking History → Booking Details |
| PROF-3 | Activity History → Activity Details |
| PROF-4 | Logout |

---

## 6. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | React Native CLI app (iOS & Android) |
| NFR-2 | Firebase Auth for Google Sign-In |
| NFR-3 | Secrets not committed to git |
| NFR-4 | Tab bar hidden on nested screens |
| NFR-5 | Local JSON data for MVP (clubs, bookings, activities) |

---

## 7. Out of Scope (v1)

* Email/password signup
* Card / wallet payment
* Edit profile, saved clubs
* OpenAI / live LLM integration (current AI is rule-based)
* Firestore / real backend
* Push notifications (in-app list only)

---

## 8. Success Metrics

* User can sign in and browse clubs
* User can complete a booking end-to-end
* User can create an activity (manual or AI)
* User can join an activity and view history in Profile
