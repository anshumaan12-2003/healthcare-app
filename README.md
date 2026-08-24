<div align="center">



# 🏥 MediCore+
**The Next-Generation Healthcare Ecosystem**

<p>
  <img src="https://img.shields.io/badge/React-18-blue.svg?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-API-green.svg?style=flat-square&logo=node.js" alt="Node" />
  <img src="https://img.shields.io/badge/PostgreSQL-DB-blue.svg?style=flat-square&logo=postgresql" alt="Postgres" />
  <img src="https://img.shields.io/badge/Three.js-3D-black.svg?style=flat-square&logo=three.js" alt="Three.js" />
</p>

An elegant, AI-driven hospital management platform featuring real-time biometrics, 3D spatial interfaces, and multi-dashboard syncing.

---

### 🔴 LIVE DEPLOYMENT

**Frontend (Vercel):**  
[https://vercel.com/me-c972/healthcare-app-dqw8/5rLGtsZeTRZmupPYX1ht3aJL5Vx5](https://vercel.com/me-c972/healthcare-app-dqw8/5rLGtsZeTRZmupPYX1ht3aJL5Vx5)

**Backend API (Render):**  
[https://medicore-backend-k0dj.onrender.com](https://medicore-backend-k0dj.onrender.com)

---

</div>

<br />

## ✨ Key Features

### 🧬 Patient Portal
*   **3D Physiotherapy:** Real-time AR joint tracking for rehabilitation.
*   **AI Dietitian:** Generates dynamic meal plans based on live biometric data.
*   **Drone Delivery:** Live tracking for autonomous pharmacy drops.

### 🩺 Doctor Dashboard
*   **Tele-Robotics:** Secure WebRTC connections for remote surgical consultations.
*   **AI Diagnostics:** Instantly reads entire EMR histories to flag anomalies.
*   **MDT Hologram Chat:** Secure, encrypted channels for multi-disciplinary teams.

### 🏢 Administrator Matrix
*   **Global Command:** Real-time pulse monitoring of ER and ICU bed capacity.
*   **IoT Smart Grid:** Live dashboard of oxygen and power usage via MQTT.
*   **Autonomous Fleet:** Dispatch and routing of self-driving ambulances.

<br />

## 🚀 Quick Start (Local Setup)

Get the project running on your local machine in three simple steps.

**1. Clone the repository**
```bash
git clone https://github.com/anshumaan12-2003/healthcare-app.git
```

**2. Boot the API**
```bash
cd healthcare-app/backend
echo "DATABASE_URL=postgresql://postgres:password@localhost:5432/medicore" > .env
npm install
npx prisma db push && npm run db:seed
npm run dev
```

**3. Start the Frontend**
```bash
# In a new terminal tab
cd healthcare-app/frontend
npm install
npm run dev
```

<br />

## 🔐 Default Test Accounts

Use these accounts to explore the different dashboards:

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@medicore.com` | `password123` |
| **Doctor** | `doctor@medicore.com` | `password123` |
| **Patient** | `patient@medicore.com` | `password123` |

<br />

<div align="center">
  <i>Engineered for 2026. Designed for simplicity.</i>
</div>
