<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0F172A,100:3B82F6&height=280&section=header&text=MediCore%2B&fontSize=90&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=Spatial%20Intelligence%20for%20Modern%20Healthcare&descAlignY=58&descSize=20" width="100%" />

<img src="docs/assets/heartbeat-icon.svg" width="70" alt="beating heart" />

<a href="https://github.com/anshumaan12-2003/healthcare-app">
  <img src="https://readme-typing-svg.herokuapp.com?font=Orbitron&weight=700&size=26&duration=3000&pause=900&color=38BDF8&center=true&vCenter=true&width=800&height=70&lines=AI-DRIVEN+DIAGNOSTICS;REAL-TIME+PATIENT+BIOMETRICS;3D+SPATIAL+CARE+INTERFACES;BUILT+FOR+THE+NEXT+DECADE+OF+CARE" alt="Typing SVG" />
</a>

<br/>

<img src="docs/assets/ecg-divider.svg" width="100%" alt="ECG heartbeat divider" />

<br/>

<p align="center">
  <img src="https://img.shields.io/github/languages/top/anshumaan12-2003/healthcare-app?style=for-the-badge&color=3B82F6&labelColor=0F172A" />
  <img src="https://img.shields.io/github/last-commit/anshumaan12-2003/healthcare-app?style=for-the-badge&color=38BDF8&labelColor=0F172A" />
  <img src="https://img.shields.io/github/license/anshumaan12-2003/healthcare-app?style=for-the-badge&color=22D3EE&labelColor=0F172A" />
  <img src="https://img.shields.io/badge/status-active--development-46E3B7?style=for-the-badge&labelColor=0F172A" />
</p>

<p align="center">
  <a href="https://healthcare-app-dqw8.vercel.app">
    <img src="https://img.shields.io/badge/🔴_LIVE_FRONTEND-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Frontend" />
  </a>
  <a href="https://medicore-backend-k0dj.onrender.com">
    <img src="https://img.shields.io/badge/🟢_LIVE_BACKEND-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Live Backend" />
  </a>
</p>

<img src="docs/assets/ecg-divider.svg" width="100%" alt="ECG heartbeat divider" />

</div>

<br/>

## 📖 Table of Contents

- [Architectural Vision](#-architectural-vision)
- [Tech Stack](#️-tech-stack)
- [System Architecture](#-system-architecture)
  - [High-Level System Map](#high-level-system-map)
  - [Real-Time Vitals Pipeline](#-real-time-vitals-pipeline)
  - [Deployment Topology](#️-deployment-topology)
- [Feature Matrix](#️-feature-matrix)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Demo Access](#-demo-access)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

<br/>

## 🌌 Architectural Vision

**MediCore+** goes beyond the traditional patient portal — it's a **Spatial Intelligence Clinic**. By combining a glassmorphic UI, **React Three Fiber** for 3D rendering, and **WebSockets** for live data, it creates a connected ecosystem across patients, doctors, and administrators, where vitals, schedules, and diagnostics update in real time instead of on page refresh.

<br/>

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=react,vite,threejs,tailwind,nodejs,express,postgres,prisma,docker,vercel,githubactions,figma&perline=6" />

<br/><br/>

| Layer | Technologies |
|---|---|
| **Frontend** | React · Vite · React Three Fiber · Framer Motion · Tailwind CSS |
| **Backend** | Node.js · Express · WebSockets (Socket.IO) |
| **Database** | PostgreSQL · Prisma ORM |
| **Infra / DevOps** | Docker · GitHub Actions · Vercel (frontend) · Render (backend) |
| **Realtime / IoT** | MQTT (telemetry) · WebRTC (video/tele-robotics) · Mapbox GL (fleet tracking) |

</div>

<br/>

## 🧩 System Architecture

<p align="center"><img src="docs/assets/heartbeat-icon.svg" width="34" alt="pulse" /></p>

### High-Level System Map

```mermaid
%%{init: {'theme':'base', 'themeVariables': {
  'primaryColor':'#1E293B','primaryTextColor':'#E2E8F0','primaryBorderColor':'#38BDF8',
  'lineColor':'#38BDF8','secondaryColor':'#0F172A','tertiaryColor':'#0F172A',
  'fontFamily':'Trebuchet MS'}}}%%
flowchart LR
    subgraph Client["🖥️ Frontend — React + R3F"]
        UI[Patient / Doctor / Admin Dashboards]
        SCENE[3D Scenes — React Three Fiber]
        WS_C[WebSocket Client]
    end

    subgraph Server["⚙️ Backend — Node.js + Express"]
        API[REST API]
        AUTH[Auth & RBAC Middleware]
        WS_S[WebSocket Gateway]
        SVC[Domain Services]
    end

    subgraph Data["🗄️ Data Layer"]
        PG[(PostgreSQL via Prisma)]
    end

    subgraph External["🔌 External Services"]
        MQTT[MQTT Broker — IoT Telemetry]
        RTC[WebRTC — Tele-Robotics]
        MAP[Mapbox GL — Fleet Tracking]
    end

    UI --> API
    UI --> SCENE
    WS_C <--> WS_S
    API --> AUTH --> SVC --> PG
    WS_S --> SVC
    SVC <--> MQTT
    SVC <--> RTC
    SVC <--> MAP

    classDef client fill:#1E3A8A,stroke:#38BDF8,color:#E0F2FE
    classDef server fill:#134E4A,stroke:#2DD4BF,color:#CCFBF1
    classDef data fill:#4C1D95,stroke:#A78BFA,color:#EDE9FE
    classDef ext fill:#7C2D12,stroke:#FB923C,color:#FFEDD5
    class UI,SCENE,WS_C client
    class API,AUTH,WS_S,SVC server
    class PG data
    class MQTT,RTC,MAP ext
```

<br/>

### 🫀 Real-Time Vitals Pipeline

The pulse motif isn't just decoration — it mirrors how live data actually moves through the system: a sensor reading travels from device to dashboard in under a second, the same way a heartbeat propagates through an ECG trace.

```mermaid
%%{init: {'theme':'base', 'themeVariables': {
  'primaryColor':'#1E293B','primaryTextColor':'#E2E8F0','primaryBorderColor':'#F87171',
  'lineColor':'#F87171','actorBkg':'#0F172A','actorBorder':'#38BDF8','actorTextColor':'#E2E8F0',
  'signalColor':'#38BDF8','signalTextColor':'#E2E8F0'}}}%%
sequenceDiagram
    participant Sensor as 📟 Bedside / Wearable Sensor
    participant Broker as 📡 MQTT Broker
    participant Backend as ⚙️ Express + WS Gateway
    participant DB as 🗄️ PostgreSQL
    participant Dash as 🖥️ Doctor / Admin Dashboard

    Sensor->>Broker: publish(vitals: HR, SpO2, BP)
    Broker->>Backend: forward telemetry event
    Backend->>DB: persist reading (Prisma)
    Backend-->>Dash: emit over WebSocket (live)
    Dash->>Dash: animate ECG waveform + trigger alerts
    alt reading out of safe range
        Backend-->>Dash: push critical alert
        Dash->>Dash: flag patient in Command Center
    end
```

<br/>

### ☁️ Deployment Topology

```mermaid
%%{init: {'theme':'base', 'themeVariables': {
  'primaryColor':'#1E293B','primaryTextColor':'#E2E8F0','primaryBorderColor':'#38BDF8',
  'lineColor':'#38BDF8'}}}%%
flowchart TB
    DEV[Local Dev — Docker Compose] -->|git push| GH[GitHub Repo]
    GH -->|CI: lint + test| CI[GitHub Actions]
    CI -->|deploy| VC[Vercel — Frontend]
    CI -->|deploy| RD[Render — Backend + WS Gateway]
    RD --> DB[(Render Postgres)]
    VC -->|HTTPS / WSS| RD

    classDef pipe fill:#0F172A,stroke:#38BDF8,color:#E2E8F0
    class DEV,GH,CI,VC,RD,DB pipe
```

<br/>

## ⚡️ Feature Matrix

<table width="100%">
  <tr>
    <td width="55%" valign="middle">
      <h3>🧬 Patients</h3>
      <ul>
        <li><b>AR Physiotherapy</b> — real-time 3D joint tracking and bone rendering</li>
        <li><b>Genomic AI Dietitian</b> — syncs health data to generate dynamic meal plans</li>
        <li><b>Delivery Tracking</b> — live GPS tracking of medication delivery</li>
        <li><b>NLP Mood Tracker</b> — sentiment analysis on a private mental-health journal</li>
      </ul>
    </td>
    <td width="45%" align="center">
      <img src="https://raw.githubusercontent.com/anshumaan12-2003/healthcare-app/main/docs/assets/patient-preview.gif" width="100%" style="border-radius: 16px;" onerror="this.style.display='none'" />
    </td>
  </tr>
  <tr>
    <td width="55%" valign="middle">
      <h3>🩺 Doctors</h3>
      <ul>
        <li><b>Tele-Consult</b> — secure WebRTC video for remote consultations</li>
        <li><b>AI Pre-Diagnostics</b> — LLM-assisted triage over patient EMRs</li>
        <li><b>MDT Chat</b> — multi-disciplinary secure messaging channels</li>
        <li><b>Population Heatmaps</b> — regional vitals and outbreak tracking</li>
      </ul>
    </td>
    <td width="45%" align="center">
      <img src="https://raw.githubusercontent.com/anshumaan12-2003/healthcare-app/main/docs/assets/doctor-preview.gif" width="100%" style="border-radius: 16px;" onerror="this.style.display='none'" />
    </td>
  </tr>
  <tr>
    <td width="55%" valign="middle">
      <h3>🏢 Admins</h3>
      <ul>
        <li><b>Command Center</b> — live ER / ICU capacity tracking</li>
        <li><b>Smart Grid IoT</b> — oxygen and power telemetry via MQTT</li>
        <li><b>Predictive Allocation</b> — bed-shortage forecasting from seasonal data</li>
        <li><b>Fleet Dispatch</b> — Mapbox GL routing for ambulance dispatch</li>
      </ul>
    </td>
    <td width="45%" align="center">
      <img src="https://raw.githubusercontent.com/anshumaan12-2003/healthcare-app/main/docs/assets/admin-preview.gif" width="100%" style="border-radius: 16px;" onerror="this.style.display='none'" />
    </td>
  </tr>
</table>

> 💡 Replace the `docs/assets/*.gif` placeholders above with real screen recordings of each dashboard (e.g. via [ScreenToGif](https://www.screentogif.com/) or `ffmpeg`) — recruiters and visitors trust real product footage far more than stock gifs.

<img src="docs/assets/ecg-divider.svg" width="100%" alt="ECG heartbeat divider" />

<br/>

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL ≥ 14 (or Docker)
- npm or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/anshumaan12-2003/healthcare-app.git
cd healthcare-app
```

### 2. Backend setup
```bash
cd backend
cp .env.example .env   # then fill in your own values — see Environment Variables below
npm install
npx prisma db push
npm run db:seed
npm run dev
```

### 3. Frontend setup
```bash
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

### 4. (Optional) Run with Docker Compose
```bash
docker compose up --build
```

<br/>

## 🔑 Environment Variables

Create a `.env` in `backend/` (never commit real secrets — this is illustrative only):

```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/medicore
JWT_SECRET=<generate-a-strong-random-secret>
MQTT_BROKER_URL=<your-mqtt-broker>
MAPBOX_TOKEN=<your-mapbox-token>
PORT=5000
```

And in `frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
VITE_MAPBOX_TOKEN=<your-mapbox-token>
```

<br/>

## 📂 Project Structure

```
healthcare-app/
├── backend/
│   ├── src/
│   │   ├── routes/          # REST endpoints
│   │   ├── controllers/
│   │   ├── services/        # business logic
│   │   ├── sockets/         # WebSocket gateway
│   │   └── prisma/          # schema + migrations
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/           # patient / doctor / admin views
│   │   ├── scenes/          # React Three Fiber 3D scenes
│   │   └── hooks/
│   └── package.json
└── docker-compose.yml
```

<br/>

## 🔐 Demo Access

> ⚠️ **Seed data only.** These accounts exist purely for local/demo evaluation via `npm run db:seed` and are not present in any production database. Rotate or delete this seed before deploying publicly, and never reuse these credentials for a real account.

| Role | Email | Password |
| :--- | :--- | :--- |
| 🔴 Admin | `admin@medicore.com` | `password123` |
| 🔵 Doctor | `doctor@medicore.com` | `password123` |
| 🟢 Patient | `patient@medicore.com` | `password123` |

<br/>

## 🗺️ Roadmap

- [ ] Replace placeholder feature GIFs with real product recordings
- [ ] Add automated test suite (Jest / Vitest + Playwright)
- [ ] CI pipeline for lint, test, and preview deploys
- [ ] Role-based access control audit
- [ ] Accessibility pass (WCAG 2.1 AA) on all three dashboards

<br/>

## 🤝 Contributing

Contributions are welcome. Please open an issue to discuss significant changes before submitting a PR.

```bash
git checkout -b feature/your-feature
git commit -m "feat: describe your change"
git push origin feature/your-feature
```

<br/>

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

<div align="center">
<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:3B82F6,100:0F172A&height=150&section=footer&text=Engineered%20for%20Tomorrow&fontSize=22&fontColor=ffffff&animation=fadeIn" width="100%" />

</div>
