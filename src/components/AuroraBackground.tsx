"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBrandStore, BrandType } from "@/store/useBrandStore";
import { useTheme } from "next-themes";
import { NetworkParticles } from "./NetworkParticles";
import { useEffect, useState } from "react";

const brandColors: Record<BrandType, { primary: string; secondary: string }> = {
  maines: { primary: "#065cc4", secondary: "#06bad2" }, // Azul vibrante y Cyan
  dermclar: { primary: "#0088ff", secondary: "#00e5ff" },
  xtralife: { primary: "#00ff66", secondary: "#aeff00" },
  jetema: { primary: "#b026ff", secondary: "#ff26a5" },
};

function BlobShaderMaterial({ brand }: { brand: BrandType }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const targetColors = useMemo(() => {
    return {
      primary: new THREE.Color(brandColors[brand].primary),
      secondary: new THREE.Color(brandColors[brand].secondary),
    };
  }, [brand]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(brandColors.maines.primary) },
      uColor2: { value: new THREE.Color(brandColors.maines.secondary) },
      uResolution: { value: new THREE.Vector2(typeof window !== 'undefined' ? window.innerWidth : 1000, typeof window !== 'undefined' ? window.innerHeight : 1000) },
    }),
    []
  );

  useFrame((state, delta) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value += delta * 0.25; // Movimiento más suave y flotante

    // Suavizamos la transición de color de las manchas
    materialRef.current.uniforms.uColor1.value.lerp(targetColors.primary, 0.05);
    materialRef.current.uniforms.uColor2.value.lerp(targetColors.secondary, 0.05);

    materialRef.current.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `;

  // Shader Fragment Suave (Manchitas Extendidas, sin agresividad metálica)
  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec2 uResolution;

    varying vec2 vUv;

    // Simplex 2D noise
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
      + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      // Normalizar coordenadas para mantener proporciones redondas
      float aspect = uResolution.x / uResolution.y;
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      st.x *= aspect;
      
      vec2 center = vec2(0.5 * aspect, 0.5);
      float t = uTime;

      // Órbitas muy extensas para que naveguen por toda la pantalla (costados y esquinas)
      vec2 p1 = center + vec2(sin(t * 0.7) * 0.6 * aspect, cos(t * 0.5) * 0.4);
      vec2 p2 = center + vec2(cos(t * 0.5) * 0.7 * aspect, sin(t * 0.6) * 0.45);
      vec2 p3 = center + vec2(sin(t * 0.3) * 0.8 * aspect, cos(t * 0.8) * 0.35);

      // Distorsión sutil en los bordes para mantener toque orgánico pero suave
      float noise1 = snoise(st * 2.0 + t * 0.5) * 0.08;
      float noise2 = snoise(st * 2.2 - t * 0.4) * 0.08;
      float noise3 = snoise(st * 1.8 + t * 0.6) * 0.08;
      
      float d1 = length(st - p1) + noise1;
      float d2 = length(st - p2) + noise2;
      float d3 = length(st - p3) + noise3;

      // Difuminación más amplia y suave
      float g1 = exp(-d1 * 2.8);
      float g2 = exp(-d2 * 3.2);
      float g3 = exp(-d3 * 3.5);

      // Colores puros y suaves, sin el blanco metálico fuerte en el centro
      vec3 col = (uColor1 * g1) + (uColor2 * g2) + (mix(uColor1, uColor2, 0.5) * g3);

      // Textura VOS9X texturizada refinada (menos agresiva)
      float grain = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.025;
      
      // Control de opacidad delicado para que el fondo plomito respire (máximo 60%)
      float alpha = (g1 + g2 + g3);
      alpha = smoothstep(0.0, 1.5, alpha) * 0.65;
      
      col += grain * alpha; // Agregamos ligero ruido a los bloques

      gl_FragColor = vec4(col, alpha);
    }
  `;

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true} // Importante para permitir que el plomo de atrás se vea
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function AuroraBackground() {
  const activeBrand = useBrandStore((state) => state.activeBrand);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="fixed inset-0 z-0 bg-stone-50/50 pointer-events-none" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div 
      className={`fixed inset-0 z-0 overflow-hidden ${isDark ? "" : "pointer-events-none"}`} 
      aria-hidden="true"
    >
      {isDark ? (
        <NetworkParticles />
      ) : (
        <Canvas
          camera={{ position: [0, 0, 1] }}
          dpr={[1, 2]}
          gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
          className="w-full h-full"
        >
          <BlobShaderMaterial brand={activeBrand} />
        </Canvas>
      )}
    </div>
  );
}
