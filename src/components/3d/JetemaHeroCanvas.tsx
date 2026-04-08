'use client';

/**
 * JetemaHeroCanvas — React Three Fiber scene for the Jetema hero section.
 *
 * Layout contract:
 *  • Exported as a default dynamic import (ssr: false) from this file so the
 *    parent can write: `const JetemaHeroCanvas = dynamic(() => import(...))`
 *  • On mobile (< 768 px) renders a static <img> fallback instead of WebGL.
 *  • Intended to fill whatever container the parent gives it (width: 100%, height: 100%).
 *
 * Scene:
 *  • IcosahedronGeometry(1.8, 4) — solid purple mesh + wireframe overlay
 *  • Slow auto-rotation via useFrame
 *  • Mouse parallax: mesh follows pointer at 5% lerp
 *  • Lights: ambient (dark indigo), two point lights (purple + white)
 *  • Geometry & material disposed on unmount
 */

import dynamic from 'next/dynamic';
import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsMobile } from '@/hooks/useIsMobile';

// ─── Inner scene ──────────────────────────────────────────────────────────────

function JetemaOrb() {
  const meshRef    = useRef<THREE.Mesh>(null);
  const wireMRef   = useRef<THREE.Mesh>(null);
  const targetPos  = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Geometry & material refs for disposal
  const geoRef     = useRef<THREE.IcosahedronGeometry | null>(null);
  const matRef     = useRef<THREE.MeshStandardMaterial | null>(null);
  const wireMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  const { gl } = useThree();

  // Track mouse / pointer in normalised device coords
  useEffect(() => {
    const canvas = gl.domElement;

    const onMove = (e: PointerEvent) => {
      const rect   = canvas.getBoundingClientRect();
      const ndcX   = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      const ndcY   = -((e.clientY - rect.top)  / rect.height - 0.5) * 2;
      targetPos.current = { x: ndcX, y: ndcY };
    };

    canvas.addEventListener('pointermove', onMove);
    return () => canvas.removeEventListener('pointermove', onMove);
  }, [gl]);

  // Dispose on unmount
  useEffect(() => {
    return () => {
      geoRef.current?.dispose();
      matRef.current?.dispose();
      wireMatRef.current?.dispose();
    };
  }, []);

  useFrame(() => {
    if (!meshRef.current || !wireMRef.current) return;

    // Auto-rotation
    meshRef.current.rotation.y  += 0.003;
    meshRef.current.rotation.x  += 0.001;
    wireMRef.current.rotation.y  = meshRef.current.rotation.y;
    wireMRef.current.rotation.x  = meshRef.current.rotation.x;

    // Mouse parallax — lerp toward target at 5 %
    const LERP = 0.05;
    meshRef.current.position.x  += (targetPos.current.x * 0.8 - meshRef.current.position.x)  * LERP;
    meshRef.current.position.y  += (targetPos.current.y * 0.8 - meshRef.current.position.y)  * LERP;
    wireMRef.current.position.x  = meshRef.current.position.x;
    wireMRef.current.position.y  = meshRef.current.position.y;
  });

  return (
    <>
      {/* Solid mesh */}
      <mesh ref={meshRef}>
        <icosahedronGeometry
          ref={geoRef}
          args={[1.8, 4]}
        />
        <meshStandardMaterial
          ref={matRef}
          color="#7C3AED"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Wireframe overlay — same geometry, different material */}
      <mesh ref={wireMRef}>
        <icosahedronGeometry args={[1.81, 4]} />
        <meshBasicMaterial
          ref={wireMatRef}
          color="#9F67FF"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>
    </>
  );
}

// ─── Lights ───────────────────────────────────────────────────────────────────

function JetemaLights() {
  return (
    <>
      <ambientLight color="#1a0a2e" intensity={0.6} />
      <pointLight color="#7C3AED" intensity={2}  position={[3,  3,  3]} />
      <pointLight color="#ffffff" intensity={0.4} position={[-3, -2, 2]} />
    </>
  );
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────

function JetemaHeroScene() {
  return (
    <Canvas
      gl={{ alpha: true, antialias: true }}
      camera={{ position: [0, 0, 5], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
    >
      <JetemaLights />
      <JetemaOrb />
    </Canvas>
  );
}

// ─── Public default export (SSR guard + mobile fallback) ─────────────────────

function JetemaHeroCanvasInner() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <img
        src="/images/jetema-fallback.png"
        alt="Jetema"
        className="w-full h-full object-contain"
      />
    );
  }

  return <JetemaHeroScene />;
}

// Dynamic export consumed by the parent — ssr: false prevents THREE from
// running during Next.js server rendering.
export default dynamic(() => Promise.resolve(JetemaHeroCanvasInner), {
  ssr: false,
});
