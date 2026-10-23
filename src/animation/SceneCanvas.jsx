import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { AdaptiveDpr, AdaptiveEvents, ContactShadows, Environment, PerformanceMonitor } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { easing } from 'maath';

function CameraRig({ target = [0, 0, 0], strength = .18 }) {
  const { camera } = useThree();
  const pointer = useRef(new THREE.Vector2());
  useFrame((state, delta) => { pointer.current.lerp(state.pointer, .06); easing.damp3(camera.position, [pointer.current.x * strength, pointer.current.y * strength, camera.position.z], 0.35, delta); camera.lookAt(...target); });
  return null;
}

function DemoOrb() {
  const ref = useRef(); const points = useMemo(() => { const array = []; for (let i = 0; i < 900; i += 1) { const phi = Math.acos(-1 + (2 * i) / 900); const theta = Math.sqrt(900 * Math.PI) * phi; array.push(Math.cos(theta) * Math.sin(phi) * 1.1, Math.cos(phi) * 1.1, Math.sin(theta) * Math.sin(phi) * 1.1); } return new Float32Array(array); }, []);
  useFrame((state, delta) => { ref.current.rotation.y += delta * .12; ref.current.rotation.x = Math.sin(state.clock.elapsedTime * .25) * .1; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} /></bufferGeometry><pointsMaterial color="#74c8f5" size={.025} sizeAttenuation transparent opacity={.72} depthWrite={false} blending={THREE.AdditiveBlending} /></points>;
}

export function SceneCanvas({ children, effects = false, className = '' }) {
  return <div className={`scene-canvas ${className}`}><Canvas dpr={[1, 1.7]} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} camera={{ position: [0, 0, 5], fov: 34 }} frameloop="always"><PerformanceMonitor onDecline={() => undefined}><AdaptiveDpr pixelated /><AdaptiveEvents /><Suspense fallback={null}><CameraRig />{children || <DemoOrb />}<Environment preset="city" environmentIntensity={.22} /><ContactShadows opacity={.18} scale={6} blur={2.2} far={4} /></Suspense>{effects && <EffectComposer multisampling={0}><Bloom intensity={.35} luminanceThreshold={.65} mipmapBlur /><Noise opacity={.025} /><Vignette eskil={false} offset={.15} darkness={.45} /></EffectComposer>}</PerformanceMonitor></Canvas></div>;
}
