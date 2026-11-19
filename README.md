# Stress Evaluation and Management System (StressCare)

A comprehensive, full-stack MERN (MongoDB Atlas, Express.js, React.js, Node.js) platform designed for evidence-informed psychological stress evaluation, reflective mood tracking, interactive somatic self-care, certified counselor appointments, and real-time AI assistance.

---

## 1. System Architecture & Diagram Alignment

The system is built strictly adhering to the architectural design and software engineering diagrams:

- **Admin Module**: System statistics, User management (roles & permissions), Counselor verification, Clinical resources & helpline management.
- **Counselor Module**: Appointment management (accept/reject/complete), clinical advice documentation, client psychological history tracking with privacy protection.
- **User Module**: PSS-10 standardized stress evaluation, daily mood journal with intensity and triggers, interactive 4-7-8 breathwork, appointment booking, longitudinal progress reports.
- **System Module (Backend API)**: JWT authentication, PSS-10 score calculation engine, personalized recommendation generator, appointment scheduler, intelligent chatbot service, centralized error handling.
- **Database (MongoDB Atlas)**: Dedicated collections for `users`, `stressassessments`, `moodjournals`, `appointments`, `recommendations`, and `resources`.

---

## 2. Technology Stack

- **Frontend**:
  - React 18 (Vite build engine)
  - React Router DOM v6
  - Axios (HTTP client with JWT request/response interceptors)
  - Lucide React (Icons)
  - Calming, modern responsive design system (`index.css`)
- **Backend**:
  - Node.js & Express.js RESTful API
  - JWT (JSON Web Tokens) Authentication
  - bcryptjs password encryption
  - CORS, dotenv, centralized error handler middleware
- **Database**:
  - MongoDB Atlas Cloud Database
  - Mongoose ODM with schema validation, indexing, and cascade safety

---

## 3. Core Modules & Functionality

### A. User Module
- Secure registration and login with bcrypt hashing and JWT tokens.
- Role-based redirection: Users → User Dashboard, Counselors → Counselor Portal, Admins → Admin Operations Center.
- Profile management (name, phone, occupation, age, gender, personal bio).
- Password change with old password verification.

### B. Stress Assessment Module (PSS-10)
- 10 standardized questions based on the validated Perceived Stress Scale.
- Automated reverse-scoring controls for positive coping questions (Q4, Q5, Q7, Q8).
- Calibrated 3-tier stress classification:
  - **Low Stress (0 - 13 points)**: High coping resilience, sustainable balance.
  - **Moderate Stress (14 - 26 points)**: Manageable pressure, early somatic/cognitive interventions recommended.
  - **High Stress (27 - 40 points)**: Clinical counseling recommended, grounding protocol triggered.
- Dimensional breakdown across Emotional Strain, Cognitive Control, Coping Fatigue, and Physical Pressure.
- Comparison engine to calculate delta between current and past evaluations.
- Prominent non-clinical safety disclaimer on every result.

### C. Mood Journal Module
- Daily mood logging across 7 distinct states (*Great, Good, Neutral, Anxious, Stressed, Sad, Frustrated*).
- Intensity slider (1 - 10), sleep duration (hours), and energy levels.
- Common contextual trigger tags (#Work, #Studies, #Sleep, #Relationships, etc.).
- Complete CRUD: Edit and delete own journal entries.
- Automated analytics: Average intensity, average sleep, and mood distribution bar.

### D. Self-Care & Recommendation Module
- **Interactive 4-7-8 Animated Breathing Guide**: Expanding and contracting visual sphere with real-time timers (4s Inhale, 7s Hold, 8s Exhale) and cycle tracker.
- **Box Breathing (Navy SEAL Protocol)**: 4s Inhale, 4s Hold, 4s Exhale, 4s Hold.
- **5-4-3-2-1 Sensory Grounding**: Somatic intervention to interrupt anxiety spirals.
- **Progressive Muscle Relaxation (PMR)**: Guided clench-and-release walkthrough.
- **Pomodoro Flow & Micro-breaks**: Cognitive pacing technique.
- **Sleep Hygiene Rituals**: Circadian alignment advice.
- Psychoeducational clinical articles and guides.

### E. Counselor Module
- Counselor portal with dedicated metrics: Total assigned, Pending review, Accepted sessions, Completed.
- Client appointment management: Accept, Reject, Complete with clinical notes.
- Client History Review: Securely view assigned client's past PSS-10 scores and mood logs.

### F. Admin Module
- Platform overview analytics: Total users, counselors, assessments taken, counseling bookings.
- System-wide stress distribution meter (Low vs Moderate vs High).
- User management table: Update roles (`user`, `counselor`, `admin`), remove inactive users.
- Educational Content & Helplines CRUD: Publish new articles, guides, and emergency hotline numbers.

### G. Chatbot & Safety Module
- 24/7 AI Stress Support Assistant with responsive guidance.
- Contextual replies for anxiety, panic, insomnia, academic/work deadlines, and emotional fatigue.
- Automated safety keyword detection (crisis, self-harm) immediately surfaces 24/7 National Helplines:
  - **Tele-MANAS**: 14416 / 1800 891 4416 (24/7 National Tele Mental Health Helpline)
  - **KIRAN**: 1800 599 0019 (24/7 Mental Health Rehabilitation Helpline)
  - **Vandrevala Foundation**: +91 9999 666 555 (24/7 Free Crisis Counseling)
  - **National Emergency**: 112

---

## 4. Demo Login Credentials

For testing and grading convenience, default accounts have been pre-seeded into MongoDB Atlas:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **System Admin** | `admin@stresscare.org` | `Admin@123456` | Full platform administration, content & user control |
| **Counselor** | `dr.sharma@stresscare.org` | `Counselor@123456` | Counselor portal, client history, session management |
| **Counselor** | `dr.ananya@stresscare.org` | `Counselor@123456` | Counselor portal, client history, session management |
| **User** | Register any new account | (Your chosen password) | Self-assessment, mood journal, booking, self-care |

---

## 5. Running the Application Locally

### Quick Launch (Windows)
Double-click `run.bat` in the root folder, or run:
```bash
run.bat
```

### Manual Launch

#### Step 1: Start Backend API Server
```bash
cd server
npm start
```
*API will run on `http://localhost:5000` (Healthcheck: `http://localhost:5000/api/health`)*

#### Step 2: Start React Frontend
```bash
cd client
npm run dev
```
*Frontend will open on `http://localhost:5173`*

#### Step 3: Run Database Seed (Optional - already populated)
```bash
cd server
npm run seed
```

#### Step 4: Run Backend Integration Test Suite
```bash
cd server
node testApis.js
```
*(Tests healthcheck, registration, login, PSS-10 calculation, mood journal CRUD, recommendations, counselor booking, chatbot, and progress reports)*

---

## 6. Project Directory Structure

```
stress-management-system/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   ├── CrisisModal.jsx
│       │   └── ChatbotWidget.jsx
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── services/
│       │   └── api.js
│       └── pages/
│           ├── LandingPage.jsx
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── UserDashboard.jsx
│           ├── StressAssessmentPage.jsx
│           ├── AssessmentResultPage.jsx
│           ├── AssessmentHistoryPage.jsx
│           ├── MoodJournalPage.jsx
│           ├── RecommendationsPage.jsx
│           ├── AppointmentBookingPage.jsx
│           ├── ProgressReportsPage.jsx
│           ├── CounselorDashboard.jsx
│           ├── AdminDashboard.jsx
│           └── ProfilePage.jsx
├── server/
│   ├── package.json
│   ├── server.js
│   ├── testApis.js
│   ├── .env
│   ├── .env.example
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── assessmentController.js
│   │   ├── moodController.js
│   │   ├── recommendationController.js
│   │   ├── appointmentController.js
│   │   ├── counselorController.js
│   │   ├── adminController.js
│   │   ├── chatbotController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── StressAssessment.js
│   │   ├── MoodJournal.js
│   │   ├── Appointment.js
│   │   ├── Recommendation.js
│   │   └── Resource.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── assessmentRoutes.js
│   │   ├── moodRoutes.js
│   │   ├── recommendationRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── counselorRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── chatbotRoutes.js
│   │   └── reportRoutes.js
│   └── seed/
│       └── seedData.js
├── .gitignore
├── .env.example
├── package.json
├── run.bat
└── README.md
```
