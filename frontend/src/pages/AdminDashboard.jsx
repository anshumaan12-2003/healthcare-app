import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  LayoutDashboard, Truck, Box, ShieldAlert, Map, Terminal, LogOut, ShieldCheck, Activity, Bed, Heart, Zap, Clock, Briefcase, DollarSign, AlertTriangle
} from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer
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

  const items = [
    { id: 'overview',   label: 'Command Center',     icon: LayoutDashboard },
    { id: 'operations', label: 'Fleet & Ops',        icon: Truck },
    { id: 'supply',     label: 'Supply Chain',       icon: Box },
    { id: 'risk',       label: 'Risk AI',            icon: ShieldAlert },
    { id: 'radar',      label: 'Outbreak Radar',     icon: Map },
    { id: 'audit-logs', label: 'Live Audit Stream',  icon: Terminal },
  ];
  
  return (
    <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 100 }} style={{ 
      background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
      borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
      padding: '16px 32px', position: 'sticky', top: 0, zIndex: 100 
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <motion.div whileHover={{ scale: 1.1, rotate: 10 }} style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #f43f5e, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(244,63,94,0.3)' }}>
            <ShieldCheck size={24} color="white" />
          </motion.div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', letterSpacing: -0.5 }}>Admin Nexus</div>
            <div style={{ fontSize: 10, color: '#f43f5e', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 800 }}>Global Oversight</div>
          </div>
        </div>
        
        <nav style={{ display: 'flex', gap: 6, background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.05)', padding: 6, borderRadius: 16 }}>
          {items.map(({ id, label, icon: Icon }) => (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              key={id} 
              onClick={() => setTab(id)}
              style={{
                background: tab === id ? '#ffffff' : 'transparent',
                color: tab === id ? '#0f172a' : '#64748b',
                boxShadow: tab === id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
                border: 'none', padding: '10px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <Icon size={14} color={tab === id ? '#f43f5e' : '#94a3b8'} />
              {label}
            </motion.button>
          ))}
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{user?.name}</div>
          <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>System Administrator</div>
        </div>
        <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" alt="Admin Avatar" style={{ width: 44, height: 44, borderRadius: 16, objectFit: 'cover', border: '2px solid white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
        <motion.button whileHover={{ scale: 1.2, color: '#f43f5e' }} onClick={logout} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}><LogOut size={20} /></motion.button>
      </div>
    </motion.div>
  );
}

/* ─────── 1. COMMAND CENTER (OVERVIEW) ─────── */
function Overview() {
  const [stats, setStats] = useState(null);
  const [beds, setBeds] = useState([]);

  useEffect(() => {
    api.get('/api/admin/stats').then(r => setStats(r.data)).catch(()=>{});
    api.get('/api/admin/beds').then(r => setBeds(r.data)).catch(()=>{});
  }, []);

  const icuBeds = beds.filter(b => b.ward === 'ICU');
  const icuOccupied = icuBeds.filter(b => b.status === 'OCCUPIED').length;
  const icuPct = icuBeds.length ? Math.round((icuOccupied / icuBeds.length) * 100) : 0;

  const genBeds = beds.filter(b => b.ward === 'GENERAL');
  const genOccupied = genBeds.filter(b => b.status === 'OCCUPIED').length;
  const genPct = genBeds.length ? Math.round((genOccupied / genBeds.length) * 100) : 0;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Global Command Center</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Real-time macro oversight of the hospital network.</motion.div>

      <div className="grid-3 mb-6 mt-8">
        {/* Hospital Bed Management */}
        <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.9)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <h2 className="card-title mb-6" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Bed size={20} color="#3b82f6" /> Live Bed Capacity
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginLeft: 'auto' }} />
          </h2>
          <div className="flex justify-between mb-2">
            <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>ICU Ward</span>
            <span style={{ fontSize: 14, color: icuPct > 80 ? '#ef4444' : '#10b981', fontWeight: 800 }}>{icuPct}% Full</span>
          </div>
          <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, marginBottom: 24, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${icuPct}%` }} transition={{ duration: 1 }} style={{ height: '100%', background: icuPct > 80 ? '#ef4444' : '#10b981', borderRadius: 6 }}/>
          </div>
          
          <div className="flex justify-between mb-2">
            <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>General Ward</span>
            <span style={{ fontSize: 14, color: genPct > 80 ? '#ef4444' : '#10b981', fontWeight: 800 }}>{genPct}% Full</span>
          </div>
          <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${genPct}%` }} transition={{ duration: 1, delay: 0.2 }} style={{ height: '100%', background: genPct > 80 ? '#ef4444' : '#10b981', borderRadius: 6 }}/>
          </div>
        </motion.div>

        {/* Patient Satisfaction AI */}
        <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card" style={{ background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.05), rgba(244, 63, 94, 0.02))', border: '1px solid rgba(244, 63, 94, 0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <h2 className="card-title mb-4" style={{ color: '#be185d', display: 'flex', alignItems: 'center', gap: 8 }}><Heart size={20} /> AI Sentiment Score</h2>
          <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.3 }} style={{ fontSize: 56, fontWeight: 900, color: '#e11d48', textAlign: 'center', margin: '24px 0', letterSpacing: -2 }}>
            4.8<span style={{fontSize: 24, color: '#fda4af'}}>/5</span>
          </motion.div>
          <div style={{ fontSize: 13, color: '#9f1239', textAlign: 'center', fontWeight: 500, lineHeight: 1.6 }}>Based on Spatial NLP analysis of {stats?.totalAppointments || 1240} post-consultation transcripts.</div>
        </motion.div>

        {/* Energy & Resource Dash */}
        <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card" style={{ background: '#0f172a', color: 'white', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <h2 className="card-title mb-6" style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={20} /> IoT Grid Demand
            <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#38bdf8', marginLeft: 'auto' }} />
          </h2>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart data={[{t:'1am', v:40},{t:'6am', v:50},{t:'12pm', v:90},{t:'6pm', v:85},{t:'11pm', v:45}]}>
              <defs><linearGradient id="grid" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/><stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/></linearGradient></defs>
              <Area type="monotone" dataKey="v" stroke="#38bdf8" strokeWidth={3} fill="url(#grid)" animationDuration={2000} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────── 2. OPERATIONS (FLEET & STAFF) ─────── */
function Operations() {
  const [running, setRunning] = useState(false);
  const [ambulances, setAmbulances] = useState([]);

  useEffect(() => {
    api.get('/api/admin/ambulances').then(r => setAmbulances(r.data)).catch(()=>{});
  }, []);

  const dispatchedCount = ambulances.filter(a => a.status === 'DISPATCHED').length;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="flex flex-col h-full">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Fleet & Operations</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Manage physical assets and human capital with spatial intelligence.</motion.div>

      <div className="grid-2 flex-1 min-h-[400px] mt-8">
        {/* Live GPS Fleet Tracking */}
        <motion.div variants={fadeUp} className="card p-0 flex flex-col overflow-hidden" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: 24, borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.9)' }}>
            <h2 className="card-title m-0" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}><Truck size={20} color="#3b82f6" /> Live Ambulance GPS</h2>
            <span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>{dispatchedCount} Dispatched</span>
          </div>
          <div style={{ flex: 1, background: '#f8fafc', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {/* Real map background via CSS */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.15, filter: 'grayscale(100%) blur(1px)' }} />
            
            {/* Pulsing GPS Blips */}
            {ambulances.map((amb, i) => (
              <motion.div key={amb.id} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ 
                position: 'absolute', 
                top: `${30 + (i * 15)}%`, 
                left: `${40 + (i * 20)}%`, 
                width: 20, height: 20, 
                background: amb.status === 'DISPATCHED' ? '#ef4444' : '#3b82f6', 
                borderRadius: '50%', 
                boxShadow: `0 0 0 10px ${amb.status === 'DISPATCHED' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`, 
                animation: `pulse 2s infinite ${i * 0.5}s` 
              }}>
                <div style={{ position: 'absolute', top: -30, left: -20, background: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 800, color: '#0f172a', border: '1px solid rgba(0,0,0,0.1)' }}>{amb.vehicleId}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Staff Shift Auto-Scheduler */}
        <motion.div variants={fadeUp} className="card flex flex-col" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          <h2 className="card-title mb-4" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={20} color="#f59e0b" /> AI Shift Auto-Scheduler</h2>
          <div style={{ fontSize: 15, color: '#334155', marginBottom: 24, lineHeight: 1.6 }}>
            The AI predicts a <strong style={{ color: '#0f172a' }}>24% surge in ER admissions</strong> tonight due to localized weather patterns and historical data matching.
          </div>
          
          <div style={{ display: 'flex', gap: -10, marginBottom: 20 }}>
            {[
              'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=60&h=60',
              'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=60&h=60',
              'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=60&h=60'
            ].map((img, i) => (
              <img key={i} src={img} style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid white', zIndex: 3-i, objectFit: 'cover' }} alt="Staff" />
            ))}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ padding: 20, background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#dc2626', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14} /> CURRENT STAFFING RISK</div>
              <div style={{ fontSize: 14, color: '#991b1b', fontWeight: 500 }}>ER is critically understaffed by 3 nurses for the 10:00 PM shift.</div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn w-full mt-auto" style={{ background: '#0f172a', color: 'white', padding: '16px', borderRadius: 16, fontWeight: 800, fontSize: 15, boxShadow: '0 10px 20px rgba(15,23,42,0.2)' }} onClick={() => { setRunning(true); setTimeout(() => setRunning(false), 2000); }}>
              {running ? 'Running Neural Genetic Algorithm...' : 'Auto-Generate Optimal Roster'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────── 3. SUPPLY CHAIN AI ─────── */
function SupplyChain() {
  const [inventory, setInventory] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [ordering, setOrdering] = useState(null);

  const loadData = () => {
    api.get('/api/admin/inventory').then(r => setInventory(r.data)).catch(()=>{});
    api.get('/api/admin/contracts').then(r => setContracts(r.data)).catch(()=>{});
  };

  useEffect(loadData, []);

  const handleOrder = async (itemId) => {
    setOrdering(itemId);
    try {
      await api.post('/api/admin/inventory/order', { itemId, amount: 500 });
      toast.success('Successfully ordered stock via EDI.');
      loadData();
    } catch {
      toast.error('Failed to order stock.');
    } finally {
      setOrdering(null);
    }
  };

  const shortages = inventory.filter(i => i.quantity <= i.reorderLevel);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Supply Chain & Vendors</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Predictive inventory and automated procurement management.</motion.div>

      <div className="grid-2 mb-6 mt-8">
        {/* Inventory AI */}
        <motion.div variants={fadeUp} className="card" style={{ background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.02))', border: '1px solid rgba(245, 158, 11, 0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <h2 className="card-title mb-6" style={{ color: '#b45309', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Box size={20} /> Inventory Depletion AI
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <AnimatePresence>
              {shortages.map(item => {
                const pct = Math.max(5, Math.round((item.quantity / (item.reorderLevel * 2)) * 100));
                return (
                  <motion.div key={item.id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                    <div className="flex justify-between mb-3"><span style={{ fontWeight: 800, color: '#78350f', fontSize: 14 }}>{item.itemName}</span><span style={{ fontSize: 13, color: '#b45309', fontWeight: 800 }}>Low Stock ({item.quantity})</span></div>
                    <div style={{ height: 12, background: 'rgba(245, 158, 11, 0.1)', borderRadius: 6, overflow: 'hidden' }}><motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} style={{ height: '100%', background: '#ef4444', borderRadius: 6 }}/></div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn mt-4 w-full" style={{ background: '#d97706', color: 'white', padding: '12px', borderRadius: 12, fontWeight: 800, fontSize: 13, boxShadow: '0 10px 20px rgba(217, 119, 6, 0.2)' }} onClick={() => handleOrder(item.id)} disabled={ordering === item.id}>
                      {ordering === item.id ? 'Processing...' : 'Auto-Order via EDI'}
                    </motion.button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
            {shortages.length === 0 && <div style={{ color: '#b45309', fontWeight: 700 }}>All critical inventory levels are nominal.</div>}
          </div>
        </motion.div>

        {/* Vendor Management */}
        <motion.div variants={fadeUp} className="card" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          <h2 className="card-title mb-6" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}><Briefcase size={20} color="#3b82f6" /> Vendor Contracts</h2>
          <table className="w-full text-left" style={{ fontSize: 15 }}>
            <thead>
              <tr style={{ color: '#64748b', borderBottom: '2px solid rgba(0,0,0,0.05)' }}>
                <th className="pb-4 font-bold">Vendor Name</th><th className="pb-4 font-bold">Contract Status</th><th className="pb-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td className="py-4 font-extrabold text-slate-800">
                    <div className="flex items-center gap-3">
                      <img src={`https://images.unsplash.com/photo-${i % 2 === 0 ? '1587370560942-ad2a04eabb6d' : '1584308666744-24d5e9b3802f'}?auto=format&fit=crop&q=80&w=40&h=40`} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} alt="vendor" />
                      {c.vendorName}
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      background: c.status === 'ACTIVE' ? '#dcfce7' : '#fef3c7', 
                      color: c.status === 'ACTIVE' ? '#166534' : '#92400e', 
                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 
                    }}>{c.status}</span>
                  </td>
                  <td className="text-right">
                    <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ 
                      background: c.status === 'ACTIVE' ? 'white' : '#3b82f6', 
                      color: c.status === 'ACTIVE' ? '#0f172a' : 'white', 
                      border: c.status === 'ACTIVE' ? '2px solid rgba(0,0,0,0.05)' : 'none', 
                      padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700 
                    }}>{c.status === 'ACTIVE' ? 'Review' : 'Renew API'}</motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────── 4. RISK & COMPLIANCE ─────── */
function RiskCompliance() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Risk & Compliance</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>AI-driven spatial auditing of network liabilities and financial integrity.</motion.div>

      <div className="grid-2 mb-6 mt-8">
        {/* Malpractice Sentinel */}
        <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(220, 38, 38, 0.02))', border: '1px solid rgba(239, 68, 68, 0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}>
          <h2 className="card-title mb-4" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldAlert size={20} /> Liability Sentinel (NLP)
            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', marginLeft: 'auto' }} />
          </h2>
          <p style={{ fontSize: 14, color: '#991b1b', marginBottom: 20, lineHeight: 1.6, fontWeight: 500 }}>Scanning all doctor-patient chat transcripts for potential HIPAA violations or malpractice indicators using deep neural networks.</p>
          <div style={{ background: 'white', padding: 24, borderRadius: 16, borderLeft: '6px solid #ef4444', boxShadow: '0 10px 25px rgba(239,68,68,0.1)' }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#dc2626', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14} /> FLAGGED TRANSCRIPT (Consultation #4029)</div>
            <div style={{ fontSize: 14, color: '#334155', fontStyle: 'italic', lineHeight: 1.6 }}>"...I'm not totally sure what this is, let's just try this medication and see if it goes away without testing..."</div>
            <motion.button whileHover={{ scale: 1.02 }} className="btn mt-6 w-full" style={{ background: '#b91c1c', color: 'white', fontSize: 14, fontWeight: 800, padding: '12px', borderRadius: 12, border: 'none' }}>Launch Internal Audit</motion.button>
          </div>
        </motion.div>

        {/* Financial Fraud Detection */}
        <motion.div variants={fadeUp} whileHover={{ y: -5 }} className="card" style={{ background: 'rgba(255,255,255,0.8)', border: '1px solid white', boxShadow: '0 20px 40px rgba(0,0,0,0.03)' }}>
          <h2 className="card-title mb-6" style={{ color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}><DollarSign size={20} color="#10b981" /> Billing Fraud AI</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <motion.div whileHover={{ scale: 1.02 }} style={{ padding: 20, background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Duplicate Claim Detected</div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Claim ID #99283 - $4,500</div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 800 }}>Block Auto-Pay</motion.button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} style={{ padding: 20, background: 'white', border: '1px solid rgba(0,0,0,0.05)', borderRadius: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Suspicious Overbilling</div>
                <div style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Dr. XYZ - Routine Checkup ($25,000)</div>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: '#fef3c7', color: '#92400e', border: 'none', padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 800 }}>Flag for Review</motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────── 5. OUTBREAK RADAR ─────── */
function OutbreakRadar() {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="h-full flex flex-col">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Public Health Outbreak Radar</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Spatial epidemiological mapping based on real-time triage data.</motion.div>

      <motion.div variants={fadeUp} className="card flex-1 flex flex-col p-0 overflow-hidden min-h-[500px] mt-8" style={{ border: '1px solid rgba(0,0,0,0.05)', borderRadius: 32, boxShadow: '0 40px 80px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '20px 32px', background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <div style={{ color: '#ea580c', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} /> CLUSTER DETECTED: Influenza A
            <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: 8, height: 8, borderRadius: '50%', background: '#ea580c' }} />
          </div>
          <motion.button whileHover={{ scale: 1.05 }} className="btn" style={{ background: '#ea580c', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 800, boxShadow: '0 8px 16px rgba(234,88,12,0.3)' }}>Notify CDC API</motion.button>
        </div>
        <div style={{ flex: 1, background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
          {/* Spatial Map Image */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.1, filter: 'grayscale(100%)' }} />
          
          {/* Outbreak Heatmap Zones */}
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }} transition={{ repeat: Infinity, duration: 3 }} style={{ position: 'absolute', top: '20%', left: '30%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(239, 68, 68, 1) 0%, transparent 70%)', borderRadius: '50%' }} />
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.4, 0.15] }} transition={{ repeat: Infinity, duration: 4, delay: 1 }} style={{ position: 'absolute', top: '50%', left: '60%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(245, 158, 11, 1) 0%, transparent 70%)', borderRadius: '50%' }} />
          
          <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} style={{ position: 'absolute', bottom: 32, left: 32, background: 'rgba(255,255,255,0.9)', padding: 24, borderRadius: 20, backdropFilter: 'blur(20px)', border: '1px solid white', color: '#0f172a', fontSize: 14, lineHeight: 1.6, maxWidth: 400, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
            <strong style={{ display: 'block', marginBottom: 8, color: '#ea580c', fontWeight: 900 }}>Spatial Analysis:</strong> 
            <span style={{ fontWeight: 500, color: '#334155' }}>450 patients reported fever and coughing in the downtown sector over the last 24 hours. Spike is 3x standard deviation of normal baseline patterns.</span>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────── 6. LIVE AUDIT LOGS ─────── */
function LiveAuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/api/admin/audits').then(r => setLogs(r.data)).catch(()=>{});
  }, []);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className="h-full flex flex-col">
      <motion.h1 variants={fadeUp} className="page-title" style={{ color: '#0f172a' }}>Live Security Logs</motion.h1>
      <motion.div variants={fadeUp} className="page-subtitle" style={{ color: '#64748b' }}>Real-time audit trail of all network events streaming from the database.</motion.div>
      
      <motion.div variants={fadeUp} className="card flex-1 flex flex-col p-0 overflow-hidden mt-8" style={{ background: '#0f172a', borderRadius: 32, border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
        <div style={{ background: '#1e293b', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
          </div>
          <div style={{ marginLeft: 16, color: '#94a3b8', fontSize: 13, fontFamily: 'monospace', fontWeight: 600 }}>root@medicare-secure-audit:~# tail -f /var/log/audit.log</div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 32, fontFamily: 'monospace', fontSize: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AnimatePresence>
            {logs.map(log => (
              <motion.div key={log.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', gap: 16, color: log.level === 'WARN' ? '#fbbf24' : '#38bdf8' }}>
                <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>[{new Date(log.createdAt).toLocaleTimeString()}]</span>
                <span style={{ color: log.level === 'WARN' ? '#f59e0b' : '#22c55e', fontWeight: 800 }}>{log.action}</span>
                <span style={{ color: log.level === 'WARN' ? '#fde68a' : '#f1f5f9' }}>{log.details}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} style={{ color: '#64748b', marginTop: 12, fontSize: 16 }}>_</motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────── ROOT ─────── */
export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  
  const tabs = {
    overview: <Overview />,
    operations: <Operations />,
    supply: <SupplyChain />,
    risk: <RiskCompliance />,
    radar: <OutbreakRadar />,
    'audit-logs': <LiveAuditLogs />,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
      
      {/* Light Spatial Mesh Gradients */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, transparent 60%)', filter: 'blur(80px)', animation: 'float 12s infinite alternate', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 60%)', filter: 'blur(100px)', animation: 'float 15s infinite alternate-reverse', pointerEvents: 'none', zIndex: 0 }} />
      
      <TopNav tab={tab} setTab={setTab} />
      
      <main style={{ flex: 1, padding: 48, maxWidth: 1400, margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
            {tabs[tab]}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
