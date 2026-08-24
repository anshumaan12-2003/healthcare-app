<div align="center">
  <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=1200&h=400" alt="MediCore Banner" style="border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);" width="100%" />

  <br />
  <br />

  <h1 align="center">
    <span style="background: -webkit-linear-gradient(45deg, #3b82f6, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
      MediCore+
    </span>
  </h1>
  <p align="center">
    <strong>Next-Generation Spatial Healthcare Ecosystem</strong>
  </p>
  <p align="center">
    A radically advanced, AI-driven healthcare platform featuring immersive 3D interfaces, predictive genomics, autonomous drone delivery tracking, and real-time biometric telemetry.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-Backend-339933.svg?style=for-the-badge&logo=node.js" alt="Node" />
    <img src="https://img.shields.io/badge/PostgreSQL-Database-4169E1.svg?style=for-the-badge&logo=postgresql" alt="Postgres" />
    <img src="https://img.shields.io/badge/Prisma-ORM-2D3748.svg?style=for-the-badge&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/Three.js-3D-black.svg?style=for-the-badge&logo=three.js" alt="Three.js" />
    <img src="https://img.shields.io/badge/Framer_Motion-Animation-E902B5.svg?style=for-the-badge&logo=framer" alt="Framer Motion" />
  </p>
</div>

<br />

## 🌟 The Vision

MediCore+ is not just a patient portal; it is a **Spatial Intelligence Clinic**. Designed for the year 2026, it merges **glassmorphic design**, **fluid physics-based animations**, and **real-time biometrics** into a unified ecosystem. Whether you are a patient doing AR-guided physiotherapy, a doctor controlling surgical robots via Quantum Uplinks, or a hospital admin monitoring a smart grid—MediCore+ delivers an unparalleled user experience.

---

## 🚀 Key Features

### 🏥 For Patients
*   **Interactive 3D Physiotherapy:** AR-guided rehabilitation exercises using `react-three-fiber` rendering bone structures and tracking joint angles.
*   **DNA Data Vault & AI Dietitian:** Syncs with genomic datasets to predict health risks and dynamically generate real-time diet plans based on live blood pressure readings.
*   **Virtual Pharmacy & Drone Tracking:** Order medications and watch a live map track the autonomous drone delivery to your GPS coordinates.
*   **Mental Health NLP Tracker:** Log your mood using natural language. The AI engine automatically adjusts your cognitive therapy sentiment analysis.

### 🩺 For Doctors
*   **Quantum Tele-Robotics Hub:** Secure WebRTC connections to surgical robots with live 3D viewfinder overlays.
*   **AI Pre-Diagnostics:** LLM-powered triage that reads a patient's historical EMR and predicts anomalies with high confidence.
*   **MDT Hologram Chat:** Secure, encrypted messaging channels for multi-disciplinary teams to consult on complex cases with heartbeat synchronization.
*   **Population Lab Heatmaps:** Live visual data of regional patient lab results (A1c, LDL) to track epidemiology.

### 🏢 For Administrators
*   **Global Hospital Matrix:** Real-time pulse monitoring of ER capacity, ICU bed allocation, and autonomous ambulance fleet tracking.
*   **IoT Smart Grid & Oxygen:** Live dashboard of oxygen tank pressure and electricity grids across the facility using MQTT protocols.
*   **Predictive AI Resource Allocation:** Machine learning models that forecast bed shortages based on seasonal traffic and incoming emergency beacons.
*   **Live Vendor & Supply Chain:** Instantly authorize bio-hazard disposal or robotic surgical tool shipments.

---

## 🛠️ Tech Architecture

MediCore+ is built on a scalable, modern MERN-like stack powered by a relational database and ORM.

### 💻 Frontend (Vite + React)
*   **Framework:** React 18, Vite (for lightning-fast HMR)
*   **Styling:** Custom CSS-in-JS, Glassmorphism, CSS Modules
*   **Animations:** `framer-motion` for staggered DOM entrances, layout transitions, and spring physics.
*   **3D / Spatial UI:** `@react-three/fiber` and `@react-three/drei` for interactive 3D components, biometric models, and background particle meshes.
*   **Charting:** `recharts` for live biometric streams and population health scatter plots.
*   **State & Networking:** React Context, Axios interceptors with JWT authentication.

### ⚙️ Backend (Node.js + Express)
*   **Runtime:** Node.js v18+
*   **Framework:** Express.js (RESTful API architecture)
*   **Database:** PostgreSQL (hosted on Render)
*   **ORM:** Prisma ORM for type-safe database queries and schema management.
*   **Authentication:** `jsonwebtoken` (JWT) and `bcryptjs` for secure password hashing.
*   **Security:** `helmet` for HTTP headers, `express-rate-limit` for DDoS protection, and secure CORS configurations.
*   **Automation:** `node-cron` for automated follow-up scheduling and AI triage background jobs.

---

## 📂 Project Structure

```bash
healthcare-app/
├── frontend/                 # Vite React Application
│   ├── src/
│   │   ├── api/              # Axios client & interceptors
│   │   ├── components/       # Reusable UI (InteractiveBodyMap, TopNav, etc.)
│   │   ├── pages/            # The 3 massive Dashboards (Admin, Doctor, Patient)
│   │   └── App.jsx           # Global Router & Auth Context
│   └── package.json
│
├── backend/                  # Node.js API
│   ├── prisma/               # Database Schema (schema.prisma) & Seeds
│   ├── src/
│   │   ├── middleware/       # JWT Auth Middleware
│   │   ├── routes/           # Express Routes (appointments, features, vitals)
│   │   └── app.js            # Express setup & CORS
│   ├── server.js             # API Entry Point
│   └── package.json
│
└── README.md
```

---

## 💻 Getting Started Locally

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL installed and running locally (or a remote URL like Supabase/Render)

### 1. Database Setup
```bash
# Clone the repository
git clone https://github.com/anshumaan12-2003/healthcare-app.git
cd healthcare-app/backend

# Create a .env file and add your database string
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/medicore" > .env
echo "JWT_SECRET=super_secret_dev_key" >> .env
echo "PORT=5000" >> .env

# Install dependencies, push the schema, and seed the database
npm install
npx prisma db push
npm run db:seed
```

### 2. Start the Backend API
```bash
# In the backend directory
npm run dev
# Server runs on http://localhost:5000
```

### 3. Start the Frontend
```bash
# Open a new terminal tab
cd ../frontend

# Install dependencies
npm install

# Start the Vite dev server
npm run dev
# App runs on http://localhost:5173
```

---

## 🔐 Default Login Credentials
Use these accounts (seeded in step 1) to explore the spatial interfaces:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | admin@medicore.com | `password123` |
| **Doctor** | doctor@medicore.com | `password123` |
| **Patient** | patient@medicore.com | `password123` |

---

<div align="center">
  <p>Built for the future of healthcare.</p>
</div>
