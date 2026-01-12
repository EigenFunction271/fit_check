# Product Requirements Document (PRD)
## Health & Fitness Research Study Platform

### 1. Product Overview
A web application for managing research study participants who attend workout sessions, with health metrics tracking and administrative oversight.

---

### 2. User Roles
- **Participants**: Register, book workout sessions, submit health data
- **Administrators**: Manage events, view participant data, access analytics

---

## 3. Core Features

### 3.1 Landing/Welcome Page
- Clean, professional design explaining the research study
- Clear call-to-action buttons for "Register" and "Login"
- Brief overview of what participants can expect
- Contact information or support details

### 3.2 Authentication System
**Registration:**
- Collect: Full Name, Phone Number, ID Number
- Password creation and confirmation
- Email verification (optional for MVP)
- Store securely in Supabase Auth

**Login:**
- Email/username and password
- Session management
- Role-based access (Participant vs Admin)

### 3. Events Management

**For Participants:**
- View upcoming workout events
- See event details (type, date, time, capacity, availability)
- Book into available events
- View their own bookings
- Cancel bookings (with appropriate restrictions)

**For Admins:**
- Create new workout events with details:
  - Event name
  - Event type (cardio, strength training, yoga, etc.)
  - Date and time
  - Duration
  - Max capacity
  - Location/room
  - Description
- Edit/delete existing events
- View participant lists for each event

**Events Page Requirements:**
- List all upcoming workout sessions
- Show event details (type, date, time, location, capacity)
- Quick booking action
- Filter/search capabilities

**Booking/Calendar Page:**
- Calendar view showing events on corresponding dates
- Visual indicators for:
  - Available spots
  - Fully booked sessions
  - User's existing bookings
- Ability to book/cancel sessions
- Show capacity (e.g., "5/20 spots filled")

**Personal Dashboard:**
- List of all attended events (past bookings)
- Health metrics display with:
  - Latest readings for: grip strength, bone density, pushup count, heart rate, body fat percentage
  - Historical data visualization (charts showing trends over time)
  - Form to submit new health data entries
  - Option to view health data correlated with attended events

**Admin Dashboard:**
- Overview of all participants
- List of all events with attendance numbers
- Ability to create/edit/delete workout events
- View individual participant health data and attendance history
- Analytics/summary statistics (total participants, attendance rates, average health metrics)

**Technical Requirements:**
- Supabase for authentication, database, and persistent storage
- Data visualization for health metrics (charts showing trends over time)
- Responsive design that works on desktop and mobile
- Real-time updates where appropriate

**Data Models:**

*Users Table:*
- id (UUID, primary key)
- email (unique)
- password (hashed)
- name
- phone_number
- id_number
- role (participant/admin)
- created_at

*Events/Workshops Table:*
- id
- title
- description
- date_time
- duration
- max_capacity
- current_bookings
- event_type (e.g., cardio, strength, yoga)
- location
- instructor_name

*Bookings Table:*
- user_id
- event_id
- booking_date
- status (confirmed/cancelled)

**Health Metrics Table:**
- user_id
- recorded_date
- grip_strength
- bone_density
- pushup_count
- heart_rate
- body_fat
- notes (optional)

Let me know if you'd like me to proceed with building this application based on this PRD, or if you'd like to modify anything first!