import React, { useState, useEffect, useRef } from 'react';
import { Search, HeartPulse, Calendar, Pill, FileText, MessageSquare, Activity, X } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (!query) return;
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/doctors');
        const matched = res.data.filter(d => 
          d.name?.toLowerCase().includes(query.toLowerCase()) || 
          d.specialty.toLowerCase().includes(query.toLowerCase())
        );
        setDoctors(matched);
      } catch (e) {} finally { setLoading(false); }
    };
    const to = setTimeout(fetchSearch, 300);
    return () => clearTimeout(to);
  }, [query]);

  if (!open || !user) return null;

  const standardActions = [
    { icon: <HeartPulse size={16} />, label: 'Log Vitals', action: () => { setOpen(false); /* Normally would trigger specific tab navigation via context/events */ } },
    { icon: <Calendar size={16} />, label: 'My Appointments', action: () => setOpen(false) },
    { icon: <MessageSquare size={16} />, label: 'Ask AI Triage', action: () => setOpen(false) },
    { icon: <FileText size={16} />, label: 'Upload Medical Record', action: () => setOpen(false) },
  ].filter(a => a.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '10vh' }} onClick={() => setOpen(false)}>
      <div className="animate-fade-up" style={{ width: '90%', maxWidth: 640, background: 'white', borderRadius: 16, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border)' }}>
          <Search size={20} color="var(--text-muted)" />
          <input ref={inputRef} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '8px 16px', fontSize: 18, color: 'var(--text-main)' }} placeholder="Search doctors, actions, or medical terms..." value={query} onChange={e => setQuery(e.target.value)} />
          <div style={{ fontSize: 12, background: 'var(--bg-app)', padding: '4px 8px', borderRadius: 6, color: 'var(--text-muted)', fontWeight: 600 }}>ESC</div>
        </div>

        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '16px 0' }}>
          {query && loading && <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>Searching network...</div>}
          
          {query && !loading && doctors.length > 0 && (
            <div style={{ padding: '0 16px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 16px 8px', letterSpacing: 1 }}>Doctors</div>
              {doctors.map(d => (
                <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={() => setOpen(false)}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--brand-teal-light)', color: 'var(--brand-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                    {d.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Dr. {d.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.specialty} • ₹{d.consultationFee}</div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--brand-primary)', fontWeight: 600 }}>Book Slot</div>
                </div>
              ))}
            </div>
          )}

          {standardActions.length > 0 && (
            <div style={{ padding: '0 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 16px 8px', letterSpacing: 1 }}>Quick Actions</div>
              {standardActions.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 16px', cursor: 'pointer', borderRadius: 8, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-hover)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} onClick={a.action}>
                  <div style={{ color: 'var(--text-muted)' }}>{a.icon}</div>
                  <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{a.label}</div>
                  <div style={{ marginLeft: 'auto', opacity: 0 }} className="action-arrow">→</div>
                </div>
              ))}
            </div>
          )}

          {query && !loading && doctors.length === 0 && standardActions.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No results found for "{query}"</div>
          )}
        </div>
      </div>
    </div>
  );
}
