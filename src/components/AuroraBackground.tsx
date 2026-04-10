"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBrandStore, BrandType } from "@/store/useBrandStore";

const brandColors: Record<BrandType, { primary: string; secondary: string }> = {
  maines: { primary: "#94A3B8", secondary: "#335599" }, // Plomo/Azul
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
    materialRef.current.uniforms.uTime.value += delta * 0.3; // Slower, more elegant movement
    
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

  // Shader Fragment interactivo tipo VOS9X (Manchitas Metálicas con Ruido)
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
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      st.x *= uResolution.x / uResolution.y;
      
      // Ajustamos el centro
      vec2 center = vec2(0.5 * (uResolution.x / uResolution.y), 0.5);

      float t = uTime;

      // Definir 3 posiciones para las manchas (moviéndose en órbitas orgánicas)
      vec2 p1 = center + vec2(sin(t * 0.8) * 0.4, cos(t * 0.5) * 0.3);
      vec2 p2 = center + vec2(cos(t * 0.6) * 0.5, sin(t * 0.9) * 0.3);
      vec2 p3 = center + vec2(sin(t * 0.4) * 0.3, cos(t * 0.7) * 0.4);

      // Calculamos distancia de las manchas, y añadimos ruido a los bordes
      float noise = snoise(st * 3.0 + t) * 0.15;
      
      float d1 = length(st - p1) + noise;
      float d2 = length(st - p2) + snoise(st * 2.5 - t) * 0.15;
      float d3 = length(st - p3) + snoise(st * 4.0 + t * 0.5) * 0.15;

      // Glow falloff (difuminado de luz) -> Inverso Exponencial
      float g1 = exp(-d1 * 4.0);
      float g2 = exp(-d2 * 4.0);
      float g3 = exp(-d3 * 4.0);

      // Núcleo hiper brillante (Efecto metálico / plasma concentrado)
      float core1 = exp(-d1 * 12.0);
      float core2 = exp(-d2 * 12.0);
      float core3 = exp(-d3 * 12.0);

      // Color base para cada mancha, mezclando ligeramente con blanco puro en el núcleo
      vec3 c1 = mix(uColor1, vec3(1.0), core1 * 0.8);
      vec3 c2 = mix(uColor2, vec3(1.0), core2 * 0.8);
      // La tercer mancha mezcla el color primario pero más tenue
      vec3 c3 = mix(uColor1, vec3(1.0), core3 * 0.6);

      // Sumamos todas las luces additive blending
      vec3 col = (c1 * g1) + (c2 * g2) + (c3 * g3 * 0.6);

      // Generación de granulado texturizado tipo VOS9X (Noise dither)
      float grain = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.05;
      
      // Alpha se basa en la intensidad total de color (Para que el resto del canvas sea transparente)
      float alpha = clamp((g1 + g2 + g3) * 1.5, 0.0, 1.0);
      
      col += grain * alpha; // Agregamos el noise solo donde hay color

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

  return (
    // Removido bg-[#020617] para permitir el fondo por defecto (light mode)
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: true }} // alpha true
        className="w-full h-full"
      >
        <BlobShaderMaterial brand={activeBrand} />
      </Canvas>
    </div>
  );
}
