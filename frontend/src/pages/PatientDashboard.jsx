import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Search, Calendar, HeartPulse, Pill, FileText, Bell, LogOut, Activity, Plus, Heart, MessageSquare, 
  Clock, FileCheck, AlertCircle, X, Download, UploadCloud, Flame, MapPin, Apple, Dna, Zap, ShieldAlert,
  ShoppingCart, Shield, Navigation, Bone
} from 'lucide-react';
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Float, Environment, ContactShadows } from '@react-three/drei';
import api from '../api/client';
import { useAuth } from '../App';
import InteractiveBodyMap from '../components/InteractiveBodyMap';

// Framer Motion Variants
const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

/* ─────── EKG HEARTBEAT COMPONENT ─────── */
function EKGHeartbeat() {
  return (
    <svg width="40" height="20" viewBox="0 0 100 50" style={{ overflow: 'visible' }}>
      <motion.path 
        d="M 0 25 L 20 25 L 30 10 L 40 45 L 50 25 L 60 25 L 70 15 L 80 25 L 100 25" 
        fill="none" 
        stroke="#ef4444" 
        strokeWidth="4" 
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
      <motion.path 
        d="M 0 25 L 20 25 L 30 10 L 40 45 L 50 25 L 60 25 L 70 15 L 80 25 L 100 25" 
        fill="none" 
        stroke="#ef4444" 
        strokeWidth="8" 
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.3 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{ filter: 'blur(4px)' }}
      />
    </svg>
  );
}

/* ─────── 3D PHYSIO BONE ELEMENT ─────── */
function Physio3DObject() {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Icosahedron args={[1.5, 4]} position={[0, 0, 0]}>
        <MeshDistortMaterial 
          color="#38bdf8" 
          distort={0.4} 
          speed={2} 
          roughness={0.2} 
          metalness={0.8} 
          transmission={0.8} 
          thickness={1} 
          envMapIntensity={2} 
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Icosahedron>
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#3b82f6" />
    </Float>
  );
}

/* ─────── SIDEBAR ─────── */
function Sidebar({ tab, setTab, points }) {
  const { user, logout } = useAuth();
  const items = [
    { id: 'overview',      label: 'Health Overview',  icon: LayoutDashboard },
    { id: 'doctors',       label: 'Find a Doctor',    icon: Search },
    { id: 'appointments',  label: 'Appointments',     icon: Calendar },
    { id: 'vitals',        label: 'Vitals & IoT',     icon: HeartPulse },
    { id: 'medicines',     label: 'Pharmacy',         icon: Pill },
    { id: 'records',       label: 'Vault & DNA',      icon: FileText },
    { id: 'physio',        label: 'Physiotherapy',    icon: Bone },
    { id: 'ai-triage',     label: 'AI Triage',        icon: MessageSquare },
  ];
  return (
    <div className="sidebar" style={{ background: 'rgba(255, 255, 255, 0.4)', borderRight: '1px solid rgba(255, 255, 255, 0.3)' }}>
      <div className="brand-logo" style={{ padding: '0 24px' }}>
        <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.5 }} className="brand-icon" style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-purple))', boxShadow: 'var(--shadow-glow)' }}><HeartPulse size={24} /></motion.div>
        <h2 style={{ background: 'linear-gradient(135deg, var(--text-main), var(--brand-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MediCare+</h2>
      </div>
      
      {/* Gamified Health Streaks */}
      <motion.div whileHover={{ scale: 1.02 }} style={{ margin: '0 24px 32px', padding: '12px 16px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 16, border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #ea580c)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Flame size={20} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: '#b45309', fontWeight: 700, textTransform: 'uppercase' }}>Health Streak</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#92400e' }}>{points} Points</div>
        </div>
      </motion.div>

      <nav className="nav-menu" style={{ padding: '0 16px' }}>
        {items.map(({ id, label, icon: Icon }) => (
          <motion.button 
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.95 }}
            key={id} 
            className={`nav-item ${tab === id ? 'active' : ''}`} 
            style={tab === id ? { background: 'rgba(255, 255, 255, 0.8)', boxShadow: 'var(--shadow-sm)' } : {}} 
            onClick={() => setTab(id)}
          >
            <Icon size={18} color={tab === id ? 'var(--brand-primary)' : 'var(--text-muted)'} /> 
            <span style={{ fontWeight: tab === id ? 700 : 500, color: tab === id ? 'var(--brand-primary)' : 'var(--text-main)' }}>{label}</span>
          </motion.button>
        ))}
      </nav>
      <div className="user-profile" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(255, 255, 255, 0.4)' }}>
        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" style={{ width: 36, height: 36, borderRadius: 12, objectFit: 'cover' }} alt="User Avatar" />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }} className="truncate">{user?.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Premium Member</div>
        </div>
        <motion.button whileHover={{ scale: 1.2, color: '#ef4444' }} onClick={logout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <LogOut size={16} />
        </motion.button>
      </div>
    </div>
  );
}

/* ─────── 1. OVERVIEW (DIET COACH) ─────── */
function Overview({ setTab }) {
  const { user } = useAuth();
  const [apts, setApts] = useState([]);

  useEffect(() => {
    api.get('/api/appointments').then(r => setApts(r.data)).catch(()=>{});
  }, []);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title">Good morning, {user?.name?.split(' ')[0]}</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle">Your personalized health hub is active.</motion.div>

      {/* AI Dietary & Nutrition Coach */}
      <motion.div variants={fadeUp} className="card mb-6" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(20, 184, 166, 0.05))', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="card-title" style={{ color: '#166534', display: 'flex', alignItems: 'center', gap: 8 }}><Apple size={20} /> AI Nutrition Coach</h2>
            <div style={{ fontSize: 13, color: '#166534', opacity: 0.8 }}>Based on your recent high blood pressure readings.</div>
          </div>
          <span style={{ background: '#22c55e', color: 'white', padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} />
            LIVE PLAN
          </span>
        </div>
        <div className="grid-3">
          <motion.div whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.6)', padding: 16, borderRadius: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 4 }}>BREAKFAST (8:00 AM)</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Oatmeal with Berries</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>High fiber, low sodium to manage BP.</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.6)', padding: 16, borderRadius: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 4 }}>LUNCH (1:00 PM)</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Grilled Salmon Salad</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Omega-3s for cardiovascular health.</div>
          </motion.div>
          <motion.div whileHover={{ y: -5 }} style={{ background: 'rgba(255,255,255,0.6)', padding: 16, borderRadius: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#166534', marginBottom: 4 }}>DINNER (7:00 PM)</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>Quinoa & Steamed Veggies</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Light digestion, potassium rich.</div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid-2">
        <motion.div variants={fadeUp} className="card">
          <h2 className="card-title mb-4"><Activity size={20} className="card-icon" /> Activity Rings</h2>
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
            <div style={{ position: 'relative', width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ position: 'absolute', transform: 'rotate(-90deg)' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(244,63,94,0.1)" strokeWidth="12" />
                <motion.circle cx="60" cy="60" r="50" fill="none" stroke="var(--brand-coral)" strokeWidth="12" strokeLinecap="round" strokeDasharray="314" initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 314 * 0.2 }} transition={{ duration: 1.5, type: 'spring' }} />
              </svg>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-coral)' }}>80%</div>
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>8,432 / 10,000 Steps</div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="card">
          <h2 className="card-title mb-4"><Calendar size={20} className="card-icon" /> Next Milestone</h2>
          <div style={{ background: 'var(--bg-app)', padding: 24, borderRadius: 16, height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {apts.length > 0 ? (
              <>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: 8 }}>Upcoming Consultation</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=50&h=50" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} alt="Doc" />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Dr. {apts[0].doctor?.user?.name || 'Doctor'}</div>
                    <div style={{ fontSize: 13, color: 'var(--brand-primary)', fontWeight: 600 }}>{apts[0].date} at {apts[0].timeSlot}</div>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={() => setTab('appointments')}>Enter Waiting Room</motion.button>
              </>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>No upcoming appointments scheduled.</div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────── 2. VITALS & IOT HUB & MENTAL HEALTH ─────── */
function Vitals() {
  const [syncing, setSyncing] = useState(false);
  const [synced, setSynced] = useState(false);
  const [journals, setJournals] = useState([]);
  const [sleepLogs, setSleepLogs] = useState([]);

  useEffect(() => {
    if (synced) {
      api.get('/api/patient/sleep').then(r => setSleepLogs(r.data)).catch(()=>{});
    }
    api.get('/api/patient/journal').then(r => setJournals(r.data)).catch(()=>{});
  }, [synced]);

  const handleSync = () => {
    setSyncing(true); setTimeout(() => { setSyncing(false); setSynced(true); toast.success('IoT Devices Synced!'); }, 2000);
  };

  const handleMood = async (m, sentiment) => {
    try {
      const res = await api.post('/api/patient/journal', { content: `Logged mood: ${m}`, sentiment });
      setJournals([res.data, ...journals]);
      toast.success(`Mood logged: ${m}`);
    } catch {
      toast.error('Failed to log mood');
    }
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <div className="flex justify-between items-end mb-8">
        <div>
          <motion.h1 variants={fadeUp} className="page-title">Vitals & IoT Hub</motion.h1>
          <motion.div variants={fadeUp} className="page-subtitle">Telemetry from your wearables and smart devices.</motion.div>
        </div>
        <motion.button variants={fadeUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-secondary" onClick={handleSync} disabled={syncing || synced}>
          <Activity size={16} className={syncing ? 'animate-spin-slow' : ''} /> {syncing ? 'Syncing IoT...' : synced ? 'IoT Synced' : 'Sync Wearables'}
        </motion.button>
      </div>
      
      {/* Mental Health & Mood Tracker */}
      <motion.div variants={fadeUp} className="card mb-6" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(168, 85, 247, 0.2)' }}>
        <h2 className="card-title mb-4" style={{ color: '#7e22ce' }}>Mental Health & Mood Tracker</h2>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: 'var(--text-main)', marginBottom: 16 }}>How are you feeling today? Our NLP engine adjusts your cognitive therapy plan based on your sentiment.</div>
            <div className="flex gap-4 mb-4">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn flex-1" style={{ background: 'white', color: '#b91c1c', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} onClick={() => handleMood('Terrible', 'NEGATIVE')}>Terrible</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn flex-1" style={{ background: 'white', color: '#ea580c', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} onClick={() => handleMood('Bad', 'NEGATIVE')}>Bad</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn flex-1" style={{ background: 'white', color: '#ca8a04', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} onClick={() => handleMood('Okay', 'NEUTRAL')}>Okay</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn flex-1" style={{ background: 'white', color: '#16a34a', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} onClick={() => handleMood('Good', 'POSITIVE')}>Good</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn flex-1" style={{ background: 'white', color: '#15803d', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} onClick={() => handleMood('Great', 'POSITIVE')}>Great</motion.button>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.7)', padding: 16, borderRadius: 12, width: 300, maxHeight: 150, overflowY: 'auto' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#7e22ce', textTransform: 'uppercase', marginBottom: 8 }}>Recent NLP Journal Entries</div>
            <AnimatePresence>
              {journals.slice(0,3).map(j => (
                <motion.div key={j.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ fontSize: 12, color: 'var(--text-main)', marginBottom: 4 }}>
                  <span style={{ fontWeight: 800, color: j.sentiment === 'POSITIVE' ? '#16a34a' : j.sentiment === 'NEGATIVE' ? '#b91c1c' : '#ca8a04' }}>[{j.sentiment}]</span> {j.content}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {synced && (
        <div className="grid-2 mb-6">
          <motion.div variants={fadeUp} className="card" style={{ background: '#0f172a', color: 'white', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <h2 className="card-title mb-4" style={{ color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              Continuous Glucose Monitor 
              <EKGHeartbeat />
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={[{t:'10am', v:90},{t:'11am', v:110},{t:'12pm', v:140},{t:'1pm', v:120},{t:'2pm', v:95}]}>
                <defs><linearGradient id="cgm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                <Area type="monotone" dataKey="v" stroke="#10b981" strokeWidth={3} fill="url(#cgm)" animationDuration={2000} />
                <Tooltip contentStyle={{background:'#1e293b', border:'none', color:'white', borderRadius:8}} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div variants={fadeUp} className="card" style={{ background: '#0f172a', color: 'white', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <h2 className="card-title mb-4" style={{ color: 'white' }}>Smart Mattress Sleep Cycles</h2>
            {sleepLogs.length > 0 ? (
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={sleepLogs.map(l => ({ t: l.date.split('-').slice(1).join('-'), v: l.quality }))}>
                  <Line type="monotone" dataKey="v" stroke="#a78bfa" strokeWidth={3} dot={false} animationDuration={2000} />
                  <Tooltip contentStyle={{background:'#1e293b', border:'none', color:'white', borderRadius:8}} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
               <div style={{ textAlign: 'center', color: '#94a3b8', paddingTop: 40 }}>No sleep data found from IoT</div>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

/* ─────── 3. VAULT & DNA ─────── */
function Vault() {
  const [analyzing, setAnalyzing] = useState(false);
  const [dna, setDna] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);

  useEffect(() => {
    api.get('/api/patient/dna').then(r => setDna(r.data)).catch(()=>{});
    api.get('/api/patient/vaccinations').then(r => setVaccinations(r.data)).catch(()=>{});
  }, []);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title">Medical Vault & Genomics</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle">Secure storage for your clinical documents and DNA data.</motion.div>

      <div className="grid-2 mb-6">
        {/* Genomic Vault */}
        <motion.div variants={fadeUp} className="card" style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(219, 39, 119, 0.05))', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
          <div className="flex justify-between items-start mb-6">
            <h2 className="card-title" style={{ color: '#be185d', display: 'flex', alignItems: 'center', gap: 8 }}><Dna size={24} /> DNA Data Vault</h2>
            <span style={{ background: '#be185d', color: 'white', padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 700 }}>23andMe Synced</span>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-main)', marginBottom: 24, lineHeight: 1.6 }}>Your genetic data has been imported. Our AI predicts your predispositions to help doctors tailor your care.</p>
          
          <AnimatePresence>
            {dna && analyzing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#be185d', marginBottom: 8 }}>RISK MARKERS DETECTED</div>
                {Object.entries(dna.riskMarkers || {}).map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, borderBottom: '1px solid #f1f5f9', padding: '4px 0' }}>
                    <span style={{ fontWeight: 600 }}>{key}</span>
                    <span style={{ color: val === 'Normal' ? '#16a34a' : '#ef4444', fontWeight: 800 }}>{val}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn w-full" style={{ background: '#be185d', color: 'white' }} onClick={() => setAnalyzing(true)} disabled={analyzing}>
            {analyzing ? 'Analysis Complete' : 'Run Predictive Risk Analysis'}
          </motion.button>
        </motion.div>

        {/* Immunization & Records */}
        <motion.div variants={fadeUp} className="card flex flex-col justify-between">
          <div>
            <h2 className="card-title mb-4"><Shield size={20} className="card-icon" /> Immunization Passport</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {vaccinations.length > 0 ? vaccinations.map(v => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, background: 'var(--bg-app)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><ShieldCheck size={16} color="var(--brand-teal)"/> <div><div style={{ fontSize: 14, fontWeight: 600 }}>{v.disease} - {v.vaccineName}</div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Administered: {new Date(v.dateAdministered).toLocaleDateString()}</div></div></div>
                  <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 800 }}>Verified</span>
                </div>
              )) : <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>No vaccinations found.</div>}
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary w-full mt-4"><UploadCloud size={16} /> Upload Record</motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────── 4. PHARMACY (STOREFRONT) ─────── */
function Pharmacy() {
  const [orders, setOrders] = useState([]);
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    api.get('/api/patient/orders').then(r => setOrders(r.data)).catch(()=>{});
  }, []);

  const handleOrder = async (name, amount) => { 
    setOrdering(true); 
    try {
      const res = await api.post('/api/patient/orders', { items: [{name, qty: 1}], totalAmount: amount });
      setOrders([res.data, ...orders]);
      toast.success(`${name} ordered for 2-hour delivery!`);
    } catch {
      toast.error('Failed to order medication');
    }
    setOrdering(false); 
  };
  
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title">Virtual Pharmacy</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle">Manage active prescriptions and order refills with instant delivery.</motion.div>

      {/* AI Drug Interaction Warning */}
      <motion.div variants={fadeUp} className="card mb-6" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05))', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <h2 className="card-title mb-2" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 8 }}><ShieldAlert size={20} /> AI Drug Interaction Warning</h2>
        <div style={{ fontSize: 14, color: '#991b1b', lineHeight: 1.5 }}>
          <strong>Analysis complete:</strong> You are taking <strong>Amoxicillin and Lisinopril</strong> together. 
          There is a known mild interaction that may cause slight dizziness when taken simultaneously. 
          <em>Recommendation: Space dosages by at least 2 hours.</em>
        </div>
      </motion.div>

      <div className="grid-2 mb-6">
        <motion.div variants={fadeUp} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-start gap-4 mb-4">
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Pill size={24} /></div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Amoxicillin 500mg</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Twice a day • 14 days remaining</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-app)', padding: 12, borderRadius: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Prescribed by Dr. Ananya Sharma</div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary w-full mt-auto" onClick={() => handleOrder('Amoxicillin 500mg', 450)} disabled={ordering}>
            <ShoppingCart size={16} /> Order Refill (₹450)
          </motion.button>
        </motion.div>

        <motion.div variants={fadeUp} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-start gap-4 mb-4">
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Pill size={24} /></div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Lisinopril 10mg</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Once daily • 5 days remaining</div>
            </div>
          </div>
          <div style={{ background: 'var(--bg-app)', padding: 12, borderRadius: 8, fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Prescribed by Dr. Rohit Mehta</div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary w-full mt-auto" onClick={() => handleOrder('Lisinopril 10mg', 320)} disabled={ordering}>
            <ShoppingCart size={16} /> Order Refill (₹320)
          </motion.button>
        </motion.div>
      </div>

      <motion.div variants={fadeUp} className="card">
        <h2 className="card-title mb-4">Order History</h2>
        {orders.length > 0 ? (
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 0' }}>Items</th>
                <th style={{ padding: '12px 0' }}>Total</th>
                <th style={{ padding: '12px 0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <motion.tr key={o.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i*0.1 }} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px 0', fontWeight: 600, color: 'var(--text-main)' }}>
                    {o.items?.map(i => `${i.qty}x ${i.name}`).join(', ')}
                  </td>
                  <td style={{ padding: '16px 0', fontWeight: 700 }}>₹{o.totalAmount}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ padding: '4px 8px', borderRadius: 8, fontSize: 11, fontWeight: 800, background: o.status === 'DELIVERED' ? '#dcfce7' : '#dbeafe', color: o.status === 'DELIVERED' ? '#166534' : '#1e40af' }}>
                      {o.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>No orders placed yet.</div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────── 5. DOCTORS (INSURANCE ANALYZER) ─────── */
function Doctors() {
  const [analyzing, setAnalyzing] = useState(false);
  const [cost, setCost] = useState(null);

  const analyzeInsurance = () => {
    setAnalyzing(true); setCost(null);
    setTimeout(() => { setAnalyzing(false); setCost(150); toast.success('Insurance policy analyzed!'); }, 1500);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title">Find a Specialist</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle">Book your next consultation with our top-tier network.</motion.div>

      {/* Insurance Coverage Analyzer */}
      <motion.div variants={fadeUp} className="card mb-6" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(14, 165, 233, 0.05))', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <h2 className="card-title mb-4" style={{ color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: 8 }}><Shield size={20} /> Insurance Coverage Analyzer</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ flex: 1, fontSize: 14, color: 'var(--text-main)' }}>
            We've detected your <strong>BlueCross Premium</strong> policy. Click below to use AI to read your policy documents and estimate exact out-of-pocket costs for consultations.
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary" onClick={analyzeInsurance} disabled={analyzing}>
            {analyzing ? 'Scanning Policy...' : 'Estimate Coverage'}
          </motion.button>
        </div>
        <AnimatePresence>
          {cost !== null && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4" style={{ background: 'rgba(255,255,255,0.7)', padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>Estimated Out-of-Pocket Cost:</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--brand-primary)' }}>₹{cost}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="grid-3">
        {[
          { id: 1, name: 'Dr. Ananya Sharma', spec: 'Cardiology', fee: 800, img: '1559839734-2b71ea197ec2' },
          { id: 2, name: 'Dr. Rohit Mehta', spec: 'Neurology', fee: 900, img: '1622253692010-333f2da6031d' },
          { id: 3, name: 'Dr. Priya Nair', spec: 'Dermatology', fee: 600, img: '1594824438466-419b4b0e9f6c' },
        ].map(doc => (
          <motion.div variants={fadeUp} whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} key={doc.id} className="card flex flex-col">
            <img src={`https://images.unsplash.com/photo-${doc.img}?auto=format&fit=crop&q=80&w=150&h=150`} style={{ width: 64, height: 64, borderRadius: 16, objectFit: 'cover', marginBottom: 16, boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} alt="doc" />
            <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>{doc.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{doc.spec}</div>
            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: cost !== null ? 'var(--text-muted)' : 'var(--text-main)', textDecoration: cost !== null ? 'line-through' : 'none' }}>₹{doc.fee}</div>
                {cost !== null && <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--brand-primary)' }}>₹{cost} <span style={{fontSize: 10, color:'var(--text-muted)', fontWeight:500}}>w/ Ins.</span></div>}
              </div>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="btn btn-teal">Book</motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─────── 6. APPOINTMENTS (SYMPTOM TIMELINE) ─────── */
function Appointments() {
  const [apts, setApts] = useState([]);
  useEffect(() => { api.get('/api/appointments').then(r => setApts(r.data)).catch(()=>{}); }, []);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title">Appointments & Timeline</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle">Track your recovery journey and past visits.</motion.div>

      <motion.div variants={fadeUp} className="card mb-6">
        <h2 className="card-title mb-6"><Activity size={20} className="card-icon" /> Symptom Progression Timeline</h2>
        <div style={{ display: 'flex', position: 'relative', paddingBottom: 24 }}>
          {/* Line */}
          <div style={{ position: 'absolute', top: 16, left: 24, right: 24, height: 4, background: 'var(--bg-app)', borderRadius: 2 }} />
          <motion.div initial={{ width: 0 }} animate={{ width: '66%' }} transition={{ duration: 1.5, type: 'spring' }} style={{ position: 'absolute', top: 16, left: 24, height: 4, background: 'var(--brand-primary)', borderRadius: 2 }} />
          
          {/* Nodes */}
          {[
            { date: 'Aug 10', title: 'Chest Pain Reported', status: 'done' },
            { date: 'Aug 12', title: 'Cardiology Consult', status: 'done' },
            { date: 'Aug 20', title: 'Medication Started', status: 'done' },
            { date: 'Sep 05', title: 'Follow-up Check', status: 'pending' },
          ].map((node, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.2 }} style={{ width: 32, height: 32, borderRadius: '50%', background: node.status === 'done' ? 'var(--brand-primary)' : 'white', border: `4px solid ${node.status === 'done' ? 'var(--brand-primary-light)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                {node.status === 'done' && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }}/>}
              </motion.div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', textAlign: 'center' }}>{node.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{node.date}</div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Appointment List */}
      <motion.div variants={fadeUp} className="card">
        <h2 className="card-title mb-4"><Calendar size={20} className="card-icon" /> Upcoming Visits</h2>
        {apts.length > 0 ? (
          <div className="flex flex-col gap-4">
            {apts.map(apt => (
              <div key={apt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: 'var(--bg-app)', borderRadius: 12 }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>Dr. {apt.doctor?.user?.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{apt.date} at {apt.timeSlot}</div>
                </div>
                <span style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: apt.status === 'CONFIRMED' ? '#dcfce7' : '#fef9c3', color: apt.status === 'CONFIRMED' ? '#166534' : '#854d0e' }}>
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No upcoming appointments scheduled.</div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────── 7. PHYSIOTHERAPY (INTERACTIVE 3D) ─────── */
function Physiotherapy() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col h-full">
      <motion.h1 variants={fadeUp} className="page-title">Interactive Physiotherapy</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle">3D guided rehabilitation exercises.</motion.div>

      <motion.div variants={fadeUp} className="card flex-1 flex flex-col p-0 overflow-hidden" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
        <div style={{ padding: 24, borderBottom: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ color: 'white', margin: '0 0 4px', fontSize: 18 }}>Rotator Cuff Recovery</h2>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>Exercise 2 of 5: External Rotation</div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn btn-primary">Start AR Mode</motion.button>
        </div>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)' }}>
          
          {/* REAL 3D CANVAS INSTEAD OF PLACEHOLDER */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <Environment preset="city" />
              <ambientLight intensity={1} />
              <Physio3DObject />
            </Canvas>
          </div>

          <div style={{ position: 'absolute', top: 32, left: 32, zIndex: 2, color: '#38bdf8', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' }}>
            [ 3D Render Engine Active ]
          </div>
          
          {/* Overlay stats */}
          <div style={{ position: 'absolute', bottom: 32, left: 32, zIndex: 2, background: 'rgba(0,0,0,0.6)', padding: 16, borderRadius: 12, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ color: '#94a3b8', fontSize: 12, marginBottom: 4 }}>Joint Angle Analysis</div>
            <div style={{ color: '#22c55e', fontSize: 24, fontWeight: 800 }}>45° <span style={{fontSize:14, fontWeight:500, color:'white'}}>Perfect Form</span></div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────── 8. AI TRIAGE ─────── */
function AIAssistant({ setTab }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([{ id: 1, sender: 'ai', text: `Hi ${user?.name?.split(' ')[0]}, use the 3D Body Map or type below to describe your symptoms.` }]);
  
  const handleBodyPartSelect = (part) => {
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: `Pain in ${part}` }]);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now()+1, sender: 'ai', text: `I've logged the pain in your ${part}. I recommend consulting an orthopedic specialist.`, specialty: 'Orthopedics' }]);
    }, 1000);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="h-full flex flex-col">
      <div><motion.h1 variants={fadeUp} className="page-title">Symptom Mapper & AI Triage</motion.h1><motion.div variants={fadeUp} className="page-subtitle">Interact with the 3D body model.</motion.div></div>
      <motion.div variants={fadeUp} className="card mb-6 p-0">
        <InteractiveBodyMap onSelect={handleBodyPartSelect} />
      </motion.div>
      <motion.div variants={fadeUp} className="card flex-1 flex flex-col p-0 overflow-hidden min-h-[300px]">
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 16, background: 'rgba(255,255,255,0.3)' }}>
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={m.id} style={{ display: 'flex', gap: 12, alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                {m.sender === 'ai' && <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-teal))', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MessageSquare size={16} /></div>}
                <div>
                  <div style={{ background: m.sender === 'user' ? 'var(--brand-primary)' : 'rgba(255,255,255,0.8)', color: m.sender === 'user' ? 'white' : 'var(--text-main)', padding: '12px 16px', borderRadius: m.sender === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', boxShadow: 'var(--shadow-sm)', fontSize: 14 }}>{m.text}</div>
                  {m.specialty && <motion.button whileHover={{ scale: 1.05 }} className="btn btn-secondary mt-2 text-xs py-1 px-3" onClick={() => setTab('doctors')}>Book {m.specialty}</motion.button>}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────── ROOT COMPONENT ─────── */
export default function PatientDashboard() {
  const [tab, setTab] = useState('overview');
  const [sosActive, setSosActive] = useState(false);
  const [points, setPoints] = useState(1240);

  const tabs = {
    overview: <Overview setTab={setTab} />,
    doctors: <Doctors />,
    appointments: <Appointments />,
    vitals: <Vitals />,
    medicines: <Pharmacy />,
    records: <Vault />,
    physio: <Physiotherapy />,
    'ai-triage': <AIAssistant setTab={setTab} />,
  };

  const triggerSOS = () => {
    setSosActive(true);
    toast.error('EMERGENCY SOS BEACON ACTIVATED. Broadcasting GPS coordinates...', { duration: 5000, style: { background: '#ef4444', color: 'white', fontWeight: 800 }});
    setTimeout(() => { setSosActive(false); toast.success('SOS Cancelled.'); }, 6000);
  };

  return (
    <>
      <div className="animated-gradient-bg" />
      <div className="med-bg-particles">
        <div className="med-cross">✚</div><div className="med-cross">✚</div><div className="med-cross">✚</div>
      </div>
      
      <div className="app-layout">
        <Sidebar tab={tab} setTab={setTab} points={points} />
        <main className="main-content glass-panel" style={{ margin: '20px 20px 20px 0', padding: 40, overflowY: 'auto' }}>
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              {tabs[tab]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* EMERGENCY SOS BEACON */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`btn ${sosActive ? 'sos-active' : ''}`} 
        onClick={triggerSOS}
        style={{ position: 'fixed', bottom: 40, right: 40, width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: 'white', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.5)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '4px solid rgba(255,255,255,0.2)' }}
      >
        <Navigation size={28} fill="white" style={{ marginBottom: 2 }} />
        <span style={{ fontSize: 12, fontWeight: 800, letterSpacing: 1 }}>SOS</span>
      </motion.button>
    </>
  );
}
