"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBrandStore, BrandType } from "@/store/useBrandStore";

const brandColors: Record<BrandType, { primary: string; secondary: string }> = {
  maines: { primary: "#335599", secondary: "#79DAEA" },
  dermclar: { primary: "#0088ff", secondary: "#00e5ff" },
  xtralife: { primary: "#00ff66", secondary: "#aeff00" },
  jetema: { primary: "#b026ff", secondary: "#ff26a5" },
};

function NeonShaderMaterial({ brand }: { brand: BrandType }) {
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
    materialRef.current.uniforms.uTime.value += delta * 0.4;
    
    // Suavizamos la transición usando lerp (interpolación)
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

  // Shader Fragment interactivo tipo Neon/Stitch
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
      vec2 st = gl_FragCoord.xy / uResolution.xy;
      st.x *= uResolution.x / uResolution.y;

      vec2 q = vec2(0.);
      q.x = snoise(st + uTime * 0.1);
      q.y = snoise(st + vec2(1.0));

      vec2 r = vec2(0.);
      r.x = snoise(st + 1.0*q + vec2(1.7,9.2)+ 0.15*uTime );
      r.y = snoise(st + 1.0*q + vec2(8.3,2.8)+ 0.126*uTime);

      float f = snoise(st+r);

      // Neon glowing flow
      float flow = snoise(st * 1.5 + uTime * 0.2 + r * 1.5);
      flow = smoothstep(0.0, 1.0, flow);

      // Mix dark background with primary color 1 
      vec3 bgDark = vec3(0.01, 0.02, 0.04);
      vec3 col = mix(bgDark, uColor1 * 0.6, f);
      
      // Mix bright neon lines using uColor2
      col = mix(col, uColor2, flow * f * 1.8);

      // Strong metallic bloom / glow
      float glow = pow(flow, 4.0) * 2.0;
      col += uColor2 * glow;

      gl_FragColor = vec4(col, 1.0);
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
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function AuroraBackground() {
  const activeBrand = useBrandStore((state) => state.activeBrand);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#020617]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        dpr={[1, 2]}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        className="w-full h-full"
      >
        <NeonShaderMaterial brand={activeBrand} />
      </Canvas>
    </div>
  );
}
