import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei';

function BodyPart({ position, args, color = '#38bdf8', name, onPartClick }) {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  const [clicked, setClick] = useState(false);

  useFrame((state) => {
    if (!clicked) {
      mesh.current.material.emissiveIntensity = hovered ? 0.8 : 0.2;
    }
  });

  return (
    <mesh
      ref={mesh}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        setClick(!clicked);
        onPartClick(name);
      }}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={(e) => { setHover(false); document.body.style.cursor = 'auto'; }}
    >
      <capsuleGeometry args={args} />
      <meshStandardMaterial 
        color={clicked ? '#f43f5e' : color} 
        emissive={clicked ? '#f43f5e' : color} 
        emissiveIntensity={clicked ? 1 : 0.2} 
        wireframe={true} 
      />
      {clicked && (
        <Html distanceFactor={10} position={[0, args[1]/2 + 0.2, 0]} center>
          <div style={{ background: 'rgba(15,23,42,0.9)', color: 'white', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, pointerEvents: 'none', whiteSpace: 'nowrap' }}>
            {name} Selected
          </div>
        </Html>
      )}
    </mesh>
  );
}

function Humanoid({ onPartClick }) {
  const group = useRef();
  
  useFrame((state) => {
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* Head */}
      <mesh position={[0, 2.5, 0]} onClick={(e) => { e.stopPropagation(); onPartClick('Head'); }} onPointerOver={() => document.body.style.cursor = 'pointer'} onPointerOut={() => document.body.style.cursor = 'auto'}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" wireframe />
      </mesh>
      
      {/* Torso */}
      <BodyPart position={[0, 1.2, 0]} args={[0.5, 1.2, 4, 16]} name="Torso" onPartClick={onPartClick} />
      
      {/* Arms */}
      <BodyPart position={[-0.8, 1.3, 0]} args={[0.2, 1.0, 4, 16]} name="Left Arm" onPartClick={onPartClick} />
      <BodyPart position={[0.8, 1.3, 0]} args={[0.2, 1.0, 4, 16]} name="Right Arm" onPartClick={onPartClick} />
      
      {/* Legs */}
      <BodyPart position={[-0.3, 0, 0]} args={[0.2, 1.2, 4, 16]} name="Left Leg" onPartClick={onPartClick} />
      <BodyPart position={[0.3, 0, 0]} args={[0.2, 1.2, 4, 16]} name="Right Leg" onPartClick={onPartClick} />
    </group>
  );
}

export default function InteractiveBodyMap({ onSelect }) {
  return (
    <div style={{ width: '100%', height: '400px', background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)', borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, color: 'white', pointerEvents: 'none' }}>
        <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Interactive 3D Mapper</h3>
        <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>Rotate and click a region to report pain.</p>
      </div>
      <Canvas camera={{ position: [0, 1, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Humanoid onPartClick={onSelect} />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
      </Canvas>
    </div>
  );
}
