import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Calendar, Bell, LogOut, Activity, MessageCircle, BookOpen, Search, DollarSign, Cpu, Send, X, AlertTriangle, ShieldCheck, User
} from 'lucide-react';
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/client';
import { useAuth } from '../App';

// Framer Motion Variants
const staggerContainer = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } } };

/* ─────── TOP NAVIGATION (SPATIAL LIGHT THEME) ─────── */
function TopNav({ tab, setTab }) {
  const { user, logout } = useAuth();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    api.get('/api/notifications').then(r => setUnread(r.data.filter(n => !n.read).length)).catch(()=>{});
  }, []);

  const items = [
    { id: 'overview',      label: 'Overview' },
    { id: 'appointments',  label: 'Queue' },
    { id: 'refills',       label: 'Auto-Refills' },
    { id: 'emr',           label: 'Global EMR' },
    { id: 'analytics',     label: 'Analytics' },
    { id: 'tele-robotics', label: 'Tele-Robotics' },
  ];
  
  return (
    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 100 }} style={{ 
      background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      padding: '16px 32px', position: 'sticky', top: 0, zIndex: 100 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(59,130,246,0.3)' }}>
            <Activity size={24} color="white" />
          </motion.div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>MediCore+</div>
            <div style={{ fontSize: 10, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Physician Portal</div>
          </div>
        </div>
        
        <nav style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)', padding: 6, borderRadius: 16 }}>
          {items.map(({ id, label }) => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={id} 
              onClick={() => setTab(id)}
              style={{
                background: tab === id ? '#ffffff' : 'transparent',
                color: tab === id ? '#0f172a' : '#64748b',
                boxShadow: tab === id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                border: 'none', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s'
              }}
            >
              {label}
            </motion.button>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.1)', color: '#3b82f6', padding: '10px 16px', fontSize: 13, borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', alignItems: 'center' }} onClick={() => setTab('notifications')}>
          <Bell size={18} /> Notifications {unread > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: 99, marginLeft: 8 }}>{unread}</span>}
        </motion.button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>Dr. {user?.name?.split(' ').slice(-1)[0]}</div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>Specialist</div>
          </div>
          <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=100&h=100" alt="Doctor Avatar" style={{ width: 44, height: 44, borderRadius: 16, objectFit: 'cover', border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
          <motion.button whileHover={{ scale: 1.2, color: '#ef4444' }} onClick={logout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}><LogOut size={20} /></motion.button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─────── 1. OVERVIEW ─────── */
function Overview({ setTab }) {
  const { user } = useAuth();
  const [apts, setApts] = useState([]);
  const [cme, setCme] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => { 
    api.get('/api/appointments/doctor').then(r => setApts(r.data)).catch(()=>{});
    api.get('/api/doctor-features/cme').then(r => {
      const total = r.data.reduce((sum, c) => sum + c.credits, 0);
      setCme(total);
      setLoading(false);
    }).catch(() => { setLoading(false); }); 
  }, []);

  const riskData = [
    { x: 120, y: 80, z: 200, name: 'Jane Doe', risk: 'Low' },
    { x: 140, y: 95, z: 250, name: 'John Smith', risk: 'High' },
    { x: 110, y: 70, z: 180, name: 'Alice Ray', risk: 'Low' },
    { x: 160, y: 100, z: 300, name: 'Bob Kent', risk: 'Critical' },
  ];

  if (loading) return null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <div className="flex justify-between items-end mb-8">
        <div>
          <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Good morning, Dr. {user?.name?.split(' ').slice(-1)[0]}</motion.h1>
          <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Your spatial intelligence clinic is online.</motion.div>
        </div>
        <motion.button variants={fadeUp} whileHover={{ scale: 1.05 }} className="btn" style={{ background: '#0f172a', color: 'white', border: 'none', boxShadow: '0 8px 16px rgba(15,23,42,0.2)' }} onClick={() => setTab('appointments')}>Manage Queue</motion.button>
      </div>

      <div className="grid-3 mb-6">
        {/* CME Tracker */}
        <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <h2 className="card-title mb-4" style={{ color: '#3b82f6' }}><BookOpen size={20} className="card-icon" /> CME Tracking</h2>
          <div style={{ fontSize: 40, fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: -1 }}>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{cme}</motion.span>
            <span style={{ fontSize: 16, color: '#94a3b8', fontWeight: 600 }}> / 50 hrs</span>
          </div>
          <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(100, (cme/50)*100)}%` }} transition={{ duration: 1, type: 'spring' }} style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', borderRadius: 6 }} />
          </div>
        </motion.div>

        {/* Patient Risk Stratification Matrix */}
        <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)', gridColumn: 'span 2' }}>
          <h2 className="card-title mb-4" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}><Activity size={20} className="card-icon" color="#3b82f6" /> Patient Risk Matrix</h2>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>AI analysis of your active patients based on recent vitals.</div>
          <ResponsiveContainer width="100%" height={200}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" dataKey="x" name="Systolic BP" tick={{fill:'#64748b', fontSize:12}} domain={[90, 180]} />
              <YAxis type="number" dataKey="y" name="Diastolic BP" tick={{fill:'#64748b', fontSize:12}} domain={[60, 120]} />
              <ZAxis type="number" dataKey="z" range={[50, 400]} />
              <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{borderRadius: 16, border: 'none', background: 'rgba(255,255,255,0.9)', color: '#0f172a', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'}} />
              <Scatter name="Patients" data={riskData} fill="#ef4444" fillOpacity={0.7} animationDuration={1500} />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid-2">
        {/* Automated Follow-up Engine */}
        <motion.div variants={fadeUp} className="card" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <h2 className="card-title mb-4" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}><MessageCircle size={20} color="#8b5cf6" /> AI Follow-up Engine</h2>
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>3 patients are scheduled for automated spatial check-ins today.</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'Jane Doe', img: '1544005313-94ddf0286df2', tag: 'Post-op Recovery', status: 'Sent 2h ago', done: true },
              { name: 'Michael Chen', img: '1506794778202-cad84cf45f1d', tag: 'New Medication', status: 'Sending at 2:00 PM', done: false },
              { name: 'Sarah Connor', img: '1534528741775-53994a69daeb', tag: 'General Check', status: 'Sending at 4:00 PM', done: false },
            ].map((f, i) => (
              <motion.div whileHover={{ scale: 1.02 }} key={i} style={{ background: 'white', padding: '16px 20px', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img src={`https://images.unsplash.com/photo-${f.img}?auto=format&fit=crop&q=80&w=50&h=50`} style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover' }} alt="patient" />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{f.name}</div>
                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500, marginTop: 2 }}>{f.tag}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: f.done ? '#059669' : '#3b82f6', background: f.done ? '#dcfce7' : '#dbeafe', padding: '6px 12px', borderRadius: 8 }}>{f.status}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────── 2. PATIENT QUEUE ─────── */
function Appointments() {
  const [apts, setApts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [detailModal, setDetailModal] = useState(null);
  const [notes, setNotes] = useState('');
  const [prescription, setPrescription] = useState('');

  const load = () => { 
    setLoading(true); 
    api.get('/api/appointments/doctor')
      .then(r => { setApts(r.data); setLoading(false); })
      .catch(() => { setLoading(false); }); 
  };
  useEffect(load, []);

  const openModal = (apt) => { setDetailModal(apt); setNotes(apt.notes || ''); setPrescription(apt.prescription?.text || ''); };
  const updateStatus = async (id, status, extraNotes = null) => {
    try {
      await api.patch(`/api/appointments/${id}/status`, { status, notes: extraNotes !== null ? extraNotes : notes, prescription: prescription ? { text: prescription } : undefined });
      toast.success(`Appointment ${status.toLowerCase()}`); 
      setDetailModal(null); 
      load();
    } catch { toast.error('Failed to update status'); }
  };

  const shown = filter === 'ALL' ? apts : apts.filter(a => a.status === filter);
  if (loading) return null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Patient Queue</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Manage your consultations and approvals.</motion.div>

      <motion.div variants={fadeUp} className="flex gap-3 mb-8" style={{ background: 'rgba(255,255,255,0.7)', padding: 6, borderRadius: 16, display: 'inline-flex', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
        {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'].map(f => (
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={f} style={{ background: filter === f ? 'white' : 'transparent', color: filter === f ? '#0f172a' : '#64748b', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13, cursor: 'pointer', boxShadow: filter === f ? '0 4px 12px rgba(0,0,0,0.08)' : 'none', transition: 'all 0.2s' }} onClick={() => setFilter(f)}>{f}</motion.button>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="card" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.9)', padding: 0, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
        <table className="data-table" style={{ color: '#0f172a' }}>
          <thead><tr style={{ color: '#64748b', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.02)' }}><th className="py-4">Patient</th><th className="py-4">Date & Time</th><th className="py-4">Status</th><th className="py-4">Actions</th></tr></thead>
          <tbody>
            <AnimatePresence>
              {shown.map((apt, i) => (
                <motion.tr layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={apt.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ fontWeight: 800 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} color="#64748b" /></div>
                      {apt.patient?.name}
                    </div>
                  </td>
                  <td><div style={{ fontWeight: 700 }}>{apt.date}</div><div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 500 }}>{apt.timeSlot}</div></td>
                  <td><span style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, background: apt.status === 'CONFIRMED' ? '#dcfce7' : apt.status === 'PENDING' ? '#fef9c3' : '#e2e8f0', color: apt.status === 'CONFIRMED' ? '#166534' : apt.status === 'PENDING' ? '#854d0e' : '#475569' }}>{apt.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      {apt.status === 'PENDING' && (
                        <>
                          <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: '#3b82f6', color: 'white', padding: '8px 16px', fontSize: 13, border: 'none', borderRadius: 12, boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }} onClick={() => updateStatus(apt.id, 'CONFIRMED')}>Approve</motion.button>
                          <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: '#f8fafc', color: '#ef4444', padding: '8px 16px', fontSize: 13, border: '1px solid #e2e8f0', borderRadius: 12 }} onClick={() => updateStatus(apt.id, 'CANCELLED')}>Decline</motion.button>
                        </>
                      )}
                      {(apt.status === 'CONFIRMED' || apt.status === 'COMPLETED') && (
                        <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: 'white', color: '#0f172a', border: '1px solid #e2e8f0', padding: '8px 16px', fontSize: 13, borderRadius: 12, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onClick={() => openModal(apt)}>Review Case</motion.button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </motion.div>

      <AnimatePresence>
        {detailModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setDetailModal(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="card" style={{ width: '100%', maxWidth: 560, background: 'rgba(255,255,255,0.95)', border: '1px solid white', borderRadius: 24, padding: 32, boxShadow: '0 40px 60px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div><h2 className="card-title" style={{ color: '#0f172a', fontSize: 24 }}>Consultation: {detailModal.patient?.name}</h2><div style={{ color: '#64748b', fontSize: 14, marginTop: 4, fontWeight: 500 }}>{detailModal.date} at {detailModal.timeSlot}</div></div>
                <motion.button whileHover={{ rotate: 90 }} style={{ background: '#f1f5f9', border: 'none', cursor: 'pointer', color: '#64748b', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDetailModal(null)}><X size={18} /></motion.button>
              </div>

              <div className="form-group" style={{ background: 'linear-gradient(135deg, #eff6ff, #f8fafc)', padding: 20, borderRadius: 16, border: '1px solid #bfdbfe', marginBottom: 24 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6, letterSpacing: 0.5 }}><Cpu size={14} /> AI Pre-Diagnostics</div>
                <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.6 }}>
                  <strong>Reported:</strong> {detailModal.symptoms || 'None'} <br/><br/>
                  <strong>Analysis:</strong> Based on historical patterns, suggest checking vitals and considering possible localized inflammation or fatigue. High confidence match for standard recovery trajectory.
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label" style={{ color: '#0f172a', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Clinical Notes</label>
                <textarea className="form-input" style={{ background: 'white', color: '#0f172a', border: '2px solid rgba(0,0,0,0.05)', borderRadius: 16, padding: 16, fontSize: 15 }} rows={3} placeholder="Add observation notes..." value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 32 }}>
                <label className="form-label" style={{ color: '#0f172a', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Prescription</label>
                <textarea className="form-input" style={{ background: 'white', color: '#0f172a', border: '2px solid rgba(0,0,0,0.05)', borderRadius: 16, padding: 16, fontSize: 15 }} rows={2} placeholder="Add medications..." value={prescription} onChange={e => setPrescription(e.target.value)} />
              </div>

              {detailModal.status === 'CONFIRMED' && (
                <div className="flex gap-4">
                  <motion.button whileHover={{ scale: 1.02 }} className="btn flex-1" style={{ background: 'white', color: '#ef4444', border: '2px solid rgba(0,0,0,0.05)', padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 15 }} onClick={() => updateStatus(detailModal.id, 'CANCELLED')}>Cancel Appt</motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} className="btn flex-1" style={{ color: 'white', background: '#3b82f6', border: 'none', padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 15, boxShadow: '0 10px 20px rgba(59,130,246,0.3)' }} onClick={() => updateStatus(detailModal.id, 'COMPLETED')}>Mark Completed</motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────── 3. AUTO-REFILLS ─────── */
function Refills() {
  const [approving, setApproving] = useState(false);
  const handleApproveAll = () => {
    setApproving(true); setTimeout(() => { setApproving(false); toast.success('All 12 routine refills approved securely.'); }, 2000);
  };
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <div className="flex justify-between items-end mb-8">
        <div><motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Prescription Auto-Refills</motion.h1><motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Bulk approve routine medication requests via Spatial UI.</motion.div></div>
        <motion.button variants={fadeUp} whileHover={{ scale: 1.05 }} className="btn" style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 800, boxShadow: '0 8px 16px rgba(59,130,246,0.3)' }} onClick={handleApproveAll} disabled={approving}>
          <Activity size={18} className={approving ? 'animate-spin-slow' : ''} style={{ marginRight: 8, display: 'inline' }} /> {approving ? 'Processing...' : 'Approve All Securely'}
        </motion.button>
      </div>
      <motion.div variants={fadeUp} className="card" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.9)', padding: 0, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
        <table className="data-table" style={{ color: '#0f172a' }}>
          <thead><tr style={{ color: '#64748b', borderBottom: '1px solid rgba(0,0,0,0.05)', background: 'rgba(0,0,0,0.02)' }}><th className="py-4">Patient</th><th className="py-4">Medication</th><th className="py-4">Request Date</th><th className="py-4">AI Risk Check</th></tr></thead>
          <tbody>
            {[
              { p: 'Jane Doe', m: 'Lisinopril 10mg', d: 'Today', r: 'Clear' },
              { p: 'Michael Chen', m: 'Metformin 500mg', d: 'Yesterday', r: 'Clear' },
              { p: 'Sarah Connor', m: 'Amoxicillin', d: 'Today', r: 'Warning' },
            ].map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ fontWeight: 800 }}>{r.p}</td>
                <td style={{ fontWeight: 500 }}>{r.m}</td>
                <td style={{ color: '#64748b' }}>{r.d}</td>
                <td><span style={{ background: r.r === 'Clear' ? '#dcfce7' : '#fee2e2', color: r.r === 'Clear' ? '#166534' : '#991b1b', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>{r.r}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}

/* ─────── 4. GLOBAL EMR SEARCH ─────── */
function EMRSearch() {
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  
  const handleSearch = (e) => {
    e.preventDefault(); setSearching(true); setTimeout(() => setSearching(false), 1500);
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Global EMR Search</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Search millions of anonymized medical records and spatial journals.</motion.div>

      <motion.form variants={fadeUp} onSubmit={handleSearch} className="mb-10" style={{ position: 'relative' }}>
        <Search size={24} style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <motion.input whileFocus={{ scale: 1.01, boxShadow: '0 30px 60px rgba(59,130,246,0.1)' }} className="form-input" style={{ width: '100%', padding: '24px 24px 24px 64px', fontSize: 18, borderRadius: 24, background: 'rgba(255,255,255,0.9)', color: '#0f172a', border: '2px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', outline: 'none', fontWeight: 600, transition: 'all 0.3s' }} placeholder="Search symptoms, rare diseases, or drug interactions..." value={search} onChange={e => setSearch(e.target.value)} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.05)'} />
      </motion.form>

      <AnimatePresence>
        {searching ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: 40, textAlign: 'center', color: '#64748b', fontSize: 16, fontWeight: 500 }}><Activity size={32} className="animate-spin-slow mx-auto mb-4 text-blue-500" /> Querying global EMR neural nets...</motion.div>
        ) : search && !searching ? (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid white', borderRadius: 24, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eff6ff', color: '#2563eb', padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 800, marginBottom: 16 }}><ShieldCheck size={14} /> Confirmed Medical Journal Match</div>
            <h2 className="card-title mb-2" style={{ color: '#0f172a', fontSize: 24 }}>Case Study: Atypical Presentation of X</h2>
            <div style={{ fontSize: 14, color: '#64748b', fontWeight: 500, marginBottom: 24 }}>Published in Spatial Journal of Medicine, 2026</div>
            <p style={{ lineHeight: 1.8, color: '#334155', fontSize: 16 }}>The patient presented with symptoms matching your query. Immediate administration of Y showed a 95% efficacy rate within 48 hours. Neural analysis suggests a direct correlation with environmental spatial factors...</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────── 5. ANALYTICS ─────── */
function Analytics() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Practice Analytics</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Financials and population health metrics in the Spatial UI.</motion.div>
      
      <div className="grid-2 mb-6">
        {/* Revenue Estimator */}
        <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, padding: 32 }}>
          <h2 className="card-title mb-4" style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8 }}><DollarSign size={20} /> Revenue & Tax Estimator</h2>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }} style={{ fontSize: 48, fontWeight: 900, color: 'white', marginBottom: 8, letterSpacing: -1 }}>$42,500</motion.div>
          <div style={{ fontSize: 14, color: '#94a3b8', marginBottom: 32, fontWeight: 500 }}>Estimated Earnings (MTD)</div>
          
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>Consultation Fees</span>
              <span style={{ fontWeight: 800, color: 'white', fontSize: 15 }}>$50,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8', fontSize: 14, fontWeight: 500 }}>Estimated Tax (15%)</span>
              <span style={{ fontWeight: 800, color: '#f87171', fontSize: 15 }}>-$7,500</span>
            </div>
          </div>
        </motion.div>

        {/* Lab Results Heatmap */}
        <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid white', borderRadius: 24, padding: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          <h2 className="card-title mb-6" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}><Activity size={20} color="#8b5cf6" /> Population Lab Heatmap</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { name: 'Hemoglobin A1c', val: '75% Normal', bg: 'linear-gradient(90deg, #3b82f6 75%, #ef4444 25%)', w: '75%' },
              { name: 'LDL Cholesterol', val: '40% Normal', bg: 'linear-gradient(90deg, #3b82f6 40%, #ef4444 60%)', w: '40%' },
              { name: 'Vitamin D', val: '20% Normal', bg: 'linear-gradient(90deg, #3b82f6 20%, #ef4444 80%)', w: '20%' },
            ].map(l => (
              <div key={l.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 800, marginBottom: 8, color: '#0f172a' }}>
                  <span>{l.name}</span><span style={{ color: '#64748b' }}>{l.val}</span>
                </div>
                <div style={{ height: 16, borderRadius: 8, background: '#f1f5f9', width: '100%', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: l.w }} transition={{ duration: 1.5, type: 'spring' }} style={{ height: '100%', background: l.bg, borderRadius: 8 }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────── 6. TELE-ROBOTICS ─────── */
function TeleRobotics() {
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="h-full flex flex-col">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Tele-Robotics Control Hub</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Spatial remote access to hospital surgical assistants.</motion.div>

      <motion.div variants={fadeUp} className="card flex-1 flex flex-col p-0 overflow-hidden mt-6" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 32, boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
        <AnimatePresence mode="wait">
          {!connected ? (
            <motion.div key="connecting" exit={{ opacity: 0, scale: 1.1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)', position: 'relative' }}>
              {/* Sonar pulses */}
              {connecting && (
                <>
                  <motion.div initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 3, opacity: 0 }} transition={{ repeat: Infinity, duration: 2 }} style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', border: '2px solid #3b82f6' }} />
                  <motion.div initial={{ scale: 0, opacity: 0.5 }} animate={{ scale: 3, opacity: 0 }} transition={{ repeat: Infinity, duration: 2, delay: 1 }} style={{ position: 'absolute', width: 100, height: 100, borderRadius: '50%', border: '2px solid #3b82f6' }} />
                </>
              )}
              <Cpu size={80} color="#3b82f6" style={{ marginBottom: 32, opacity: connecting ? 1 : 0.4, zIndex: 2 }} className={connecting ? 'animate-pulse' : ''} />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn" style={{ background: '#0f172a', color: 'white', padding: '18px 40px', fontSize: 16, fontWeight: 800, border: 'none', borderRadius: 20, boxShadow: '0 20px 40px rgba(15,23,42,0.2)', transition: 'all 0.3s', zIndex: 2 }} onClick={() => { setConnecting(true); setTimeout(() => setConnected(true), 3000); }} disabled={connecting}>
                {connecting ? 'Establishing Quantum Uplink...' : 'Connect to Surgical Bot Alpha'}
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="connected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ flex: 1, position: 'relative', background: '#0f172a' }}>
              {/* Simulated camera feed / grid */}
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.3, filter: 'grayscale(100%) blur(2px)' }} />
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              
              <div style={{ position: 'absolute', top: 32, left: 32, background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: 99, color: '#38bdf8', fontWeight: 800, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(10px)', border: '1px solid rgba(56,189,248,0.3)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', animation: 'pulse 1s infinite' }} /> SECURE CONNECTION ESTABLISHED
              </div>
              
              {/* Spatial Viewfinder */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} style={{ width: 300, height: 300, border: '2px dashed rgba(56,189,248,0.4)', position: 'relative', borderRadius: '50%' }}>
                  <div style={{ position: 'absolute', top: '50%', left: -20, right: -20, height: 1, background: 'rgba(56,189,248,0.5)' }} />
                  <div style={{ position: 'absolute', left: '50%', top: -20, bottom: -20, width: 1, background: 'rgba(56,189,248,0.5)' }} />
                </motion.div>
              </div>

              {/* Controls overlay */}
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ position: 'absolute', bottom: 32, right: 32, background: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 24, backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', gap: 16 }}>
                <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: 'white', color: '#0f172a', border: 'none', padding: '12px 24px', borderRadius: 16, fontWeight: 800, fontSize: 14 }}>Activate Scalpel</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: '#ef4444', color: 'white', border: 'none', padding: '12px 24px', borderRadius: 16, fontWeight: 800, fontSize: 14 }} onClick={() => { setConnected(false); setConnecting(false); }}>Terminate Link</motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

/* ─────── NOTIFICATIONS ─────── */
function Notifications() {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => { 
    api.get('/api/notifications')
      .then(r => { setNotifs(r.data); setLoading(false); })
      .catch(() => { setLoading(false); }); 
  };
  useEffect(load, []);

  const markRead = async (id) => {
    try { await api.patch(`/api/notifications/${id}/read`); load(); } catch (e) {}
  };

  if (loading) return null;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Notifications</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Alerts and activity for your clinic.</motion.div>
      
      <motion.div variants={fadeUp} className="card" style={{ padding: 0, overflow: 'hidden', background: 'rgba(255,255,255,0.8)', border: '1px solid white', borderRadius: 24, boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
        {notifs.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center', color: '#64748b', fontSize: 16, fontWeight: 500 }}>You're all caught up!</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AnimatePresence>
              {notifs.map(n => (
                <motion.div key={n.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }} style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: 24, borderBottom: '1px solid rgba(0,0,0,0.05)', background: n.read ? 'transparent' : 'rgba(59,130,246,0.05)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: n.read ? '#f1f5f9' : '#3b82f6', color: n.read ? '#64748b' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Bell size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: n.read ? 600 : 800, color: '#0f172a', marginBottom: 6 }}>{n.message}</div>
                    <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>{new Date(n.createdAt).toLocaleString()}</div>
                  </div>
                  {!n.read && <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: 'white', color: '#0f172a', border: '2px solid rgba(0,0,0,0.05)', padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }} onClick={() => markRead(n.id)}>Mark as Read</motion.button>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────── ROOT COMPONENT ─────── */
export default function DoctorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [mdtOpen, setMdtOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (mdtOpen) {
      api.get('/api/doctor-features/chat').then(r => setMessages(r.data)).catch(()=>{});
    }
  }, [mdtOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const res = await api.post('/api/doctor-features/chat', { content: newMessage });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch {}
  };

  const tabs = {
    overview: <Overview setTab={setTab} />,
    appointments: <Appointments />,
    refills: <Refills />,
    emr: <EMRSearch />,
    analytics: <Analytics />,
    'tele-robotics': <TeleRobotics />,
    notifications: <Notifications />,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Light Spatial Mesh Gradients */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(147,197,253,0.3) 0%, transparent 60%)', filter: 'blur(80px)', animation: 'float 12s infinite alternate', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(196,181,253,0.3) 0%, transparent 60%)', filter: 'blur(100px)', animation: 'float 15s infinite alternate-reverse', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '40%', left: '40%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(167,243,208,0.2) 0%, transparent 60%)', filter: 'blur(90px)', animation: 'float 10s infinite alternate', pointerEvents: 'none', zIndex: 0 }} />

      <TopNav tab={tab} setTab={setTab} />
      
      <main style={{ flex: 1, padding: 48, maxWidth: 1400, margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
            {tabs[tab]}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* MULTI-DISCIPLINARY TEAM (MDT) CHAT WIDGET */}
      <div style={{ position: 'fixed', bottom: 40, right: 40, zIndex: 9999 }}>
        <AnimatePresence>
          {mdtOpen ? (
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="card" style={{ width: 360, height: 480, padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 40px 80px rgba(0, 0, 0, 0.1)', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid white', borderRadius: 32, transformOrigin: 'bottom right' }}>
              <div style={{ background: 'rgba(255,255,255,0.8)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div style={{ fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', gap: 10, color: '#0f172a' }}>
                  <MessageCircle size={20} color="#3b82f6" /> MDT Consult
                  <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                </div>
                <motion.button whileHover={{ rotate: 90 }} style={{ background: '#f1f5f9', border: 'none', color: '#64748b', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setMdtOpen(false)}><X size={16} /></motion.button>
              </div>
              <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ fontSize: 11, textAlign: 'center', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Secure Line Established</div>
                
                {messages.map((msg, i) => (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={msg.id} style={{ 
                    background: msg.senderId === user.id ? '#3b82f6' : '#f1f5f9', 
                    color: msg.senderId === user.id ? 'white' : '#0f172a',
                    padding: '16px 20px', 
                    borderRadius: msg.senderId === user.id ? '20px 20px 0 20px' : '0 20px 20px 20px', 
                    fontSize: 14, 
                    alignSelf: msg.senderId === user.id ? 'flex-end' : 'flex-start', 
                    maxWidth: '85%', 
                    border: msg.senderId === user.id ? 'none' : '1px solid rgba(0,0,0,0.05)' 
                  }}>
                    {msg.senderId !== user.id && <strong style={{ color: '#3b82f6', display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 800 }}>Dr. {msg.sender.name.split(' ').slice(-1)[0]}</strong>}
                    {msg.content}
                  </motion.div>
                ))}
              </div>
              <form onSubmit={sendMessage} style={{ padding: 20, background: 'rgba(255,255,255,0.8)', borderTop: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: 12 }}>
                <input className="form-input" value={newMessage} onChange={e => setNewMessage(e.target.value)} style={{ flex: 1, padding: '14px 20px', fontSize: 14, background: 'white', border: '2px solid rgba(0,0,0,0.05)', color: '#0f172a', borderRadius: 16, outline: 'none' }} placeholder="Message specialists..." onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.05)'} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="btn" style={{ padding: '0 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 16, boxShadow: '0 8px 16px rgba(59,130,246,0.3)' }}><Send size={18} /></motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.button 
              key="btn"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="btn" 
              onClick={() => setMdtOpen(true)}
              style={{ width: 72, height: 72, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#3b82f6', color: 'white', border: 'none', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)' }}
            >
              <MessageCircle size={32} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
