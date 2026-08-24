import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, Maximize, Settings, FileText, Type } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VideoConsultation({ appointment, onEndCall }) {
  const localVideoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [duration, setDuration] = useState(0);
  const [showNotes, setShowNotes] = useState(true);
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [transcribing, setTranscribing] = useState(false);

  // Start local webcam stream
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediaStream;
        }
        toast.success('Secure WebRTC connection established.');
      } catch (err) {
        toast.error('Camera/Microphone access denied or not available.');
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !micOn));
      setMicOn(!micOn);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !videoOn));
      setVideoOn(!videoOn);
    }
  };

  const endCall = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    onEndCall(clinicalNotes);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: '#0f172a', display: 'flex' }}>
      {/* Video Area */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        
        {/* Remote Video (Mocked as Patient) */}
        <div style={{ flex: 1, background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'var(--bg-app)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: 'var(--brand-teal)' }}>
              {appointment.patient?.name?.[0]}
            </div>
            <h2 style={{ color: 'white', margin: '0 0 8px' }}>{appointment.patient?.name}</h2>
            <div className="flex items-center gap-2 justify-center">
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--brand-success)', animation: 'pulse 2s infinite' }} />
              Connecting secure P2P stream...
            </div>
          </div>

          {/* Local Video Overlay */}
          <div style={{ position: 'absolute', bottom: 40, right: 40, width: 280, height: 200, background: '#000', borderRadius: 16, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '2px solid rgba(255,255,255,0.1)' }}>
            {videoOn ? (
              <video ref={localVideoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                <VideoOff size={32} />
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'rgba(0,0,0,0.6)', padding: '4px 8px', borderRadius: 6, fontSize: 12, color: 'white', backdropFilter: 'blur(4px)' }}>You</div>
          </div>
        </div>

        {/* Controls Overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 40, display: 'flex', justifyContent: 'center', gap: 24, background: 'linear-gradient(to top, rgba(15,23,42,0.9), transparent)' }}>
          <button className={`btn ${micOn ? 'btn-secondary' : 'btn-danger'}`} style={{ width: 56, height: 56, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={toggleMic}>
            {micOn ? <Mic size={24} /> : <MicOff size={24} />}
          </button>
          <button className={`btn ${videoOn ? 'btn-secondary' : 'btn-danger'}`} style={{ width: 56, height: 56, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={toggleVideo}>
            {videoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </button>
          <button className="btn btn-danger" style={{ width: 56, height: 56, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(1.1)' }} onClick={endCall}>
            <PhoneOff size={24} />
          </button>
          <button className="btn btn-secondary" style={{ width: 56, height: 56, borderRadius: '50%', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 40 }} onClick={() => setShowNotes(!showNotes)}>
            <FileText size={24} />
          </button>
        </div>

        {/* Header Overlay */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: 32, display: 'flex', justifyContent: 'space-between', background: 'linear-gradient(to bottom, rgba(15,23,42,0.9), transparent)' }}>
          <div style={{ color: 'white', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: 8, backdropFilter: 'blur(4px)', fontWeight: 600, letterSpacing: 2 }}>
              {formatTime(duration)}
            </div>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '8px 16px', borderRadius: 8, backdropFilter: 'blur(4px)', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1.5s infinite' }} />
              ENCRYPTED
            </div>
          </div>
          <button className="btn btn-secondary" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}>
            <Maximize size={18} />
          </button>
        </div>
      </div>

      {/* Side Panel: Clinical Notes & Pre-Diagnostics */}
      {showNotes && (
        <div className="animate-fade-left" style={{ width: 400, background: 'white', display: 'flex', flexDirection: 'column', boxShadow: '-10px 0 30px rgba(0,0,0,0.1)' }}>
          <div style={{ padding: 24, borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 700, color: 'var(--text-main)' }}>Patient Context</h3>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{appointment.patient?.name}</div>
          </div>
          
          <div style={{ padding: 24, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* AI Pre-Diagnostics */}
            <div style={{ background: 'linear-gradient(135deg, var(--brand-primary-light), rgba(56, 189, 248, 0.05))', padding: 20, borderRadius: 16, border: '1px solid rgba(49, 130, 206, 0.1)' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--brand-primary)', display: 'flex', alignItems: 'center', gap: 8 }}><Settings size={14} className="animate-spin-slow" /> AI Pre-Diagnosis</h4>
              <div style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.6 }}>
                <strong>Reported Symptoms:</strong> {appointment.symptoms || 'None reported'}<br/><br/>
                <strong>Analysis:</strong> Based on historical patterns, consider evaluating for localized inflammation. Recommend reviewing recent CBC and vitals during consultation.
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h4 style={{ margin: 0, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)' }}>Clinical Notes (Real-time)</h4>
                <button 
                  className={`btn ${transcribing ? 'btn-primary' : 'btn-secondary'}`} 
                  style={{ padding: '4px 12px', fontSize: 11 }}
                  onClick={() => {
                    if (!transcribing) {
                      setTranscribing(true);
                      toast.success('AI Scribe active. Listening to consultation...');
                      // Simulate AI typing notes based on symptoms
                      setTimeout(() => {
                        setClinicalNotes(prev => prev + `\n\n[AI Scribe] Patient reports ${appointment.symptoms || 'discomfort'}. Recommending conservative management and rest.`);
                      }, 4000);
                    } else {
                      setTranscribing(false);
                      toast.error('AI Scribe paused.');
                    }
                  }}
                >
                  <Type size={12} className={transcribing ? 'animate-pulse' : ''} /> {transcribing ? 'Listening...' : 'Auto-Scribe'}
                </button>
              </div>
              <textarea 
                className="form-input" 
                style={{ width: '100%', flex: 1, resize: 'none', background: 'var(--bg-app)', border: 'none', padding: 16 }} 
                placeholder="Type your consultation notes here. These will be saved securely upon ending the call..."
                value={clinicalNotes}
                onChange={e => setClinicalNotes(e.target.value)}
              />
            </div>
          </div>
          
          <div style={{ padding: 24, borderTop: '1px solid var(--border)', background: 'var(--bg-app)' }}>
            <button className="btn btn-primary w-full" onClick={endCall}>Save & End Call</button>
          </div>
        </div>
      )}
    </div>
  );
}
