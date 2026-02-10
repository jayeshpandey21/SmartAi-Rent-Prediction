import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Animated building component using Three.js geometries
function Building({ position, size, color, delay = 0 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3 + delay) * 0.1
    }
  })
  
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} position={position}>
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.6} 
          roughness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  )
}

// Main 3D scene
function Scene() {
  const particlesRef = useRef()
  
  // Create particle positions
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20
    }
    return positions
  }, [])
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.02
    }
  })
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        color="#0ea5e9"
      />
      
      {/* Secondary light */}
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#d946ef" />
      
      {/* Building structures */}
      <Building position={[0, 0, 0]} size={[1.5, 3, 1.5]} color="#0ea5e9" delay={0} />
      <Building position={[-2, -0.5, 1]} size={[1, 2, 1]} color="#d946ef" delay={1} />
      <Building position={[2, -0.5, -1]} size={[1, 2.5, 1]} color="#8b5cf6" delay={2} />
      <Building position={[-1, -1, -2]} size={[0.8, 1.5, 0.8]} color="#06b6d4" delay={3} />
      <Building position={[1.5, -0.8, 1.5]} size={[0.7, 1.8, 0.7]} color="#f97316" delay={4} />
      
      {/* Central floating sphere */}
      <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.8, 64, 64]} position={[0, 1, 0]}>
          <MeshDistortMaterial
            color="#0ea5e9"
            attach="material"
            distort={0.4}
            speed={2}
            metalness={0.8}
            roughness={0.2}
            emissive="#0ea5e9"
            emissiveIntensity={0.2}
          />
        </Sphere>
      </Float>
      
      {/* Decorative rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.02, 16, 100]} />
        <meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={0.5} />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[4, 0.015, 16, 100]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.3} />
      </mesh>
      
      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesPosition.length / 3}
            array={particlesPosition}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#ffffff"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
      
      {/* Controls */}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  )
}

export default function Hero3D() {
  return (
    <div className="w-full h-full min-h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
