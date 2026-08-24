import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../App';
import toast from 'react-hot-toast';
import { Activity, Shield, ArrowRight, Sparkles, Box } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { Icosahedron, MeshDistortMaterial, Float, Environment, ContactShadows } from '@react-three/drei';

/* ─────── 3D LIGHT MODE ELEMENT (Next Level Tech) ─────── */
function NextGenObject() {
  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <Icosahedron args={[1.5, 4]} position={[0, 0, 0]}>
        <MeshDistortMaterial 
          color="#ffffff" 
          distort={0.3} 
          speed={2} 
          roughness={0.1} 
          metalness={0.9} 
          transmission={0.9} 
          thickness={1.5} 
          envMapIntensity={2} 
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </Icosahedron>
      <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} color="#3b82f6" />
    </Float>
  );
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('PATIENT');
  const [form, setForm] = useState({ name: '', email: 'patient@healthcare.com', password: 'Patient@1234' });
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    const correctPassword = newRole === 'ADMIN' ? 'Admin@1234' : newRole === 'DOCTOR' ? 'Doctor@1234' : 'Patient@1234';
    setForm({ name: '', email: `${newRole.toLowerCase()}@healthcare.com`, password: correctPassword });
  };

  const submitAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { data } = await api.post('/api/auth/login', { email: form.email, password: form.password });
        login(data.user, data.token);
        if (data.user.role === 'ADMIN') navigate('/admin');
        else if (data.user.role === 'DOCTOR') navigate('/doctor');
        else navigate('/patient');
        toast.success('Login successful. Welcome back!');
      } else {
        await api.post('/api/auth/register', { ...form, role });
        toast.success('Account created successfully! Please sign in.');
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f8fafc',
      color: '#0f172a', position: 'relative', overflow: 'hidden', fontFamily: '"Inter", sans-serif'
    }}>
      
      {/* NEXT-GEN CSS MESH GRADIENTS */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(147,197,253,0.4) 0%, transparent 60%)', filter: 'blur(80px)', animation: 'float 10s infinite alternate', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(196,181,253,0.4) 0%, transparent 60%)', filter: 'blur(100px)', animation: 'float 12s infinite alternate-reverse', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', left: '30%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(167,243,208,0.3) 0%, transparent 60%)', filter: 'blur(90px)', animation: 'float 8s infinite alternate', pointerEvents: 'none' }} />

      {/* 3D GLASS RENDER LAYER */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <Environment preset="city" />
          <ambientLight intensity={1} />
          <NextGenObject />
        </Canvas>
      </div>

      {/* FOREGROUND UI CONTAINER (VISION PRO STYLE GLASSMORPHISM) */}
      <div className="stagger-1" style={{ 
        zIndex: 10, display: 'flex', width: '100%', maxWidth: 1100, height: 600,
        background: 'rgba(255, 255, 255, 0.6)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)',
        borderRadius: 40, border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255,255,255,0.9)'
      }}>
        
        {/* LEFT BRANDING AREA */}
        <div style={{ flex: 1, padding: 60, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(59,130,246,0.3)' }}>
              <Activity size={24} color="white" />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: -0.5, color: '#0f172a' }}>MediCore UI+</div>
          </div>

          <div className="stagger-2">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.05)', padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700, color: '#3b82f6', marginBottom: 24, boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
              <Sparkles size={16} /> Spatial Health Interface
            </div>
            <h1 style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.1, marginBottom: 24, letterSpacing: -2, background: 'linear-gradient(135deg, #0f172a, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              The future of care.
            </h1>
            <p style={{ fontSize: 18, color: '#475569', lineHeight: 1.6, fontWeight: 500, maxWidth: 380 }}>
              Experience the next generation of medical management. Powered by neural networking and spatial computing architecture.
            </p>
          </div>

          <div className="stagger-3" style={{ marginTop: 'auto', display: 'flex', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#64748b' }}>
              <Shield size={16} color="#3b82f6" /> Quantum Encrypted
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#64748b' }}>
              <Box size={16} color="#8b5cf6" /> Spatial Ready
            </div>
          </div>
        </div>

        {/* RIGHT LOGIN AREA */}
        <div style={{ width: 440, padding: 60, display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', borderRadius: '0 40px 40px 0' }}>
          
          <div className="stagger-4" style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: -1, color: '#0f172a', marginBottom: 8 }}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </h2>
            <div style={{ fontSize: 15, color: '#64748b', fontWeight: 500 }}>
              {isLogin ? 'Enter your credentials to access your account.' : 'Create a new account to join the network.'}
            </div>
          </div>

          {/* Quick Fill Roles */}
          <div className="stagger-5" style={{ display: 'flex', background: 'rgba(255,255,255,0.7)', padding: 6, borderRadius: 16, marginBottom: 32, boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05), 0 1px 0 rgba(255,255,255,1)' }}>
            <div style={{ padding: '0 8px', fontSize: 12, fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>Role:</div>
            {['Patient', 'Doctor', 'Admin'].map(r => (
              <button 
                key={r} type="button"
                onClick={() => handleRoleChange(r.toUpperCase())}
                style={{ 
                  flex: 1, padding: '10px 0', border: 'none', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: role === r.toUpperCase() ? '#ffffff' : 'transparent',
                  color: role === r.toUpperCase() ? '#0f172a' : '#64748b',
                  boxShadow: role === r.toUpperCase() ? '0 4px 12px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <form className="stagger-5" onSubmit={submitAuth}>
            
            {/* Full Name field (Only for Sign Up) */}
            {!isLogin && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>Full Name</label>
                <input 
                  type="text" required={!isLogin}
                  value={form.name} 
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Jane Doe"
                  style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '2px solid rgba(0,0,0,0.05)', background: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 500, color: '#0f172a', outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#ffffff'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.9)'; }}
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#334155', marginBottom: 8 }}>Email address</label>
              <input 
                type="email" required
                autoComplete="off"
                value={form.email} 
                onChange={e => setForm({...form, email: e.target.value})}
                placeholder="name@example.com"
                style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '2px solid rgba(0,0,0,0.05)', background: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 500, color: '#0f172a', outline: 'none', transition: 'all 0.2s' }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#ffffff'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.9)'; }}
              />
            </div>
            
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>Password</label>
                {isLogin && <a href="#" style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6', textDecoration: 'none' }}>Forgot password?</a>}
              </div>
              <input 
                type="password" required
                autoComplete="new-password"
                value={form.password} 
                onChange={e => setForm({...form, password: e.target.value})}
                placeholder="••••••••"
                style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '2px solid rgba(0,0,0,0.05)', background: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: 500, color: '#0f172a', outline: 'none', transition: 'all 0.2s' }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.background = '#ffffff'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.05)'; e.target.style.background = 'rgba(255,255,255,0.9)'; }}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              style={{ width: '100%', background: '#3b82f6', color: 'white', padding: '16px', borderRadius: 16, border: 'none', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, transition: 'all 0.3s', boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)' }}
              onMouseOver={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 15px 30px rgba(59, 130, 246, 0.4)'; }}
              onMouseOut={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 10px 20px rgba(59, 130, 246, 0.3)'; }}
            >
              {loading ? <Activity className="animate-spin-slow" size={20} /> : (isLogin ? 'Sign In' : 'Sign Up')} 
            </button>
            
            <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#64748b', fontWeight: 500 }}>
              <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: '#3b82f6', fontWeight: 700, cursor: 'pointer' }}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
