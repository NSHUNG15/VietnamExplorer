// src/3d/VietnamMap3D.jsx
// 3D interactive Vietnam map using React Three Fiber

import { useRef, useState, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars, Float, Text, Html, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { motion } from 'framer-motion'
import { SEED_PROVINCES } from '../data/seedData'

// Vietnam map shape - simplified outline points (normalized 0-1)
// These represent the approximate shape of Vietnam
const VIETNAM_SHAPE_POINTS = [
  // Northern tip
  [0.42, 0.02], [0.50, 0.00], [0.58, 0.03], [0.65, 0.06],
  [0.70, 0.10], [0.75, 0.14], [0.78, 0.18], [0.80, 0.22],
  [0.82, 0.26], [0.80, 0.30], [0.78, 0.34], [0.80, 0.38],
  // Central narrowing
  [0.78, 0.42], [0.75, 0.46], [0.73, 0.50], [0.72, 0.54],
  [0.75, 0.58], [0.78, 0.62], [0.76, 0.66],
  // Southern expansion
  [0.72, 0.70], [0.68, 0.74], [0.65, 0.78], [0.62, 0.82],
  [0.58, 0.86], [0.52, 0.90], [0.46, 0.92], [0.40, 0.90],
  [0.35, 0.86], [0.30, 0.82], [0.28, 0.78], [0.30, 0.74],
  [0.32, 0.70], [0.34, 0.66],
  // Western border going back up
  [0.36, 0.62], [0.34, 0.58], [0.32, 0.54], [0.30, 0.50],
  [0.28, 0.46], [0.30, 0.42], [0.32, 0.38],
  [0.30, 0.34], [0.28, 0.30], [0.30, 0.26], [0.32, 0.22],
  [0.34, 0.18], [0.36, 0.14], [0.38, 0.10], [0.40, 0.06],
  [0.42, 0.02],
]

// Create Vietnam map mesh
function VietnamLand({ provinces, onProvinceClick, hoveredId }) {
  const meshRef = useRef()

  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const scale = 4

    VIETNAM_SHAPE_POINTS.forEach(([x, y], i) => {
      const px = (x - 0.5) * scale
      const py = -(y - 0.5) * scale * 2.5 // Vietnam is tall

      if (i === 0) s.moveTo(px, py)
      else s.lineTo(px, py)
    })
    s.closePath()
    return s
  }, [])

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3,
    }),
    []
  )

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02
    }
  })

  return (
    <group ref={meshRef}>
      {/* Main land mass */}
      <mesh receiveShadow castShadow position={[0, 0, 0]}>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <meshStandardMaterial
          color="#1a4731"
          roughness={0.8}
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Glow overlay */}
      <mesh position={[0, 0, 0.01]}>
        <extrudeGeometry args={[shape, { depth: 0.001, bevelEnabled: false }]} />
        <meshStandardMaterial
          color="#22c55e"
          transparent
          opacity={0.15}
          roughness={1}
        />
      </mesh>

      {/* Province dots */}
      {provinces.map((province) => (
        <ProvinceDot
          key={province.id}
          province={province}
          onClick={() => onProvinceClick(province)}
          isHovered={hoveredId === province.id}
        />
      ))}
    </group>
  )
}

function ProvinceDot({ province, onClick, isHovered }) {
  const [hovered, setHovered] = useState(false)
  const dotRef = useRef()
  const glowRef = useRef()

  // Convert province map_x/map_y (0-100) to 3D coordinates
  const scale = 4
  const x = ((province.map_x / 100) - 0.5) * scale
  const y = -((province.map_y / 100) - 0.5) * scale * 2.5
  const z = 0.12

  useFrame((state) => {
    if (dotRef.current) {
      const pulse = Math.sin(state.clock.elapsedTime * 2 + province.id * 0.5) * 0.15 + 1
      dotRef.current.scale.setScalar(hovered ? 1.5 * pulse : pulse)
    }
    if (glowRef.current) {
      glowRef.current.material.opacity =
        hovered ? 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.2 : 0.3
    }
  })

  return (
    <group
      position={[x, y, z]}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      {/* Glow ring */}
      <mesh ref={glowRef} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.035, 0.055, 16]} />
        <meshBasicMaterial
          color={province.highlight_color || '#22c55e'}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Main dot */}
      <mesh ref={dotRef}>
        <circleGeometry args={[0.025, 16]} />
        <meshBasicMaterial color={province.highlight_color || '#22c55e'} />
      </mesh>

      {/* Label on hover */}
      {hovered && (
        <Html
          center
          distanceFactor={8}
          style={{
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(34, 197, 94, 0.5)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'white',
              fontSize: '12px',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: '500',
              transform: 'translateY(-30px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            }}
          >
            📍 {province.name}
          </div>
        </Html>
      )}
    </group>
  )
}

// Ocean/water backdrop
function Ocean() {
  const meshRef = useRef()

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.color.setHSL(
        0.55,
        0.7,
        0.05 + Math.sin(state.clock.elapsedTime * 0.5) * 0.01
      )
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, -0.02]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#051530"
        roughness={0.8}
        metalness={0.4}
      />
    </mesh>
  )
}

// Floating particles
function FloatingParticles() {
  const count = 80
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return pos
  }, [])

  const ref = useRef()
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#22c55e"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

// Compass rose
function CompassRose() {
  return (
    <group position={[2.2, -4.8, 0.2]}>
      <mesh>
        <ringGeometry args={[0.08, 0.12, 32]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.8} />
      </mesh>
      <Text
        position={[0, 0.2, 0]}
        fontSize={0.1}
        color="#f59e0b"
        anchorX="center"
        anchorY="middle"
      >
        N
      </Text>
    </group>
  )
}

// Scene lighting
function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.4} color="#c7d5e0" />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-3, 3, 2]} intensity={0.5} color="#22c55e" />
      <pointLight position={[3, -3, 2]} intensity={0.3} color="#3b82f6" />
      <hemisphereLight
        skyColor="#1a3a5c"
        groundColor="#0f2417"
        intensity={0.3}
      />
    </>
  )
}

// Camera controller
function CameraController({ targetProvince }) {
  const { camera } = useThree()
  const controlsRef = useRef()

  useFrame(() => {
    if (targetProvince && controlsRef.current) {
      const scale = 4
      const targetX = ((targetProvince.map_x / 100) - 0.5) * scale
      const targetY = -((targetProvince.map_y / 100) - 0.5) * scale * 2.5

      camera.position.lerp(
        new THREE.Vector3(targetX * 0.5, targetY * 0.5, 5),
        0.05
      )
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={3}
      maxDistance={20}
      maxPolarAngle={Math.PI / 2.2}
      minPolarAngle={0.2}
      autoRotate={!targetProvince}
      autoRotateSpeed={0.5}
      dampingFactor={0.05}
      enableDamping
    />
  )
}

// Main 3D Map component
export default function VietnamMap3D({ onProvinceSelect, selectedProvinceId }) {
  const [hoveredId, setHoveredId] = useState(null)
  const provinces = SEED_PROVINCES

  const selectedProvince = provinces.find((p) => p.id === selectedProvinceId)

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, -1, 10], fov: 50 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneLighting />
          <Stars
            radius={100}
            depth={50}
            count={3000}
            factor={4}
            saturation={0.5}
            fade
            speed={0.5}
          />
          <Ocean />
          <FloatingParticles />

          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
            <VietnamLand
              provinces={provinces}
              onProvinceClick={onProvinceSelect}
              hoveredId={hoveredId}
            />
          </Float>

          <CompassRose />
          <CameraController targetProvince={selectedProvince} />

          <fog attach="fog" args={['#080c14', 25, 40]} />
        </Suspense>
      </Canvas>
    </div>
  )
}
