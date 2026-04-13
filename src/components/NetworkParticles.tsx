"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useBrandStore } from "@/store/useBrandStore";
import { useTheme } from "next-themes";

export function NetworkParticles() {
  const [init, setInit] = useState(false);
  const { activeBrand } = useBrandStore();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // loadSlim loads the necessary features to render particles with links
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const brandConfig = useMemo(() => {
    switch (activeBrand) {
      case "jetema":
        return { lightParticle: "#7e22ce", darkParticle: "#a78bfa", glow: "167,139,250" }; // violet/purple
      case "dermclar":
        return { lightParticle: "#0369a1", darkParticle: "#38bdf8", glow: "56,189,248" }; // blue/cyan
      case "xtralife":
        return { lightParticle: "#15803d", darkParticle: "#34d399", glow: "52,211,153" }; // emerald
      default:
        // Maines / Default - Turquesa
        return { lightParticle: "#0891b2", darkParticle: "#00e5ff", glow: "0,229,255" };
    }
  }, [activeBrand]);

  const particleColor = isDark ? brandConfig.darkParticle : brandConfig.lightParticle;

  const options: ISourceOptions = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent", // Background color handled by tailwind container
        },
      },
      fullScreen: {
        enable: false, // We will contain it inside absolute div instead of fixed fullscreen
        zIndex: -1,
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "grab", // Grab mode draws links from the cursor to particles
          },
        },
        modes: {
          push: {
            quantity: 3,
          },
          grab: {
            distance: 200,
            links: {
              opacity: 0.8,
            },
          },
        },
      },
      particles: {
        color: {
          value: particleColor,
        },
        links: {
          color: particleColor,
          distance: 150,
          enable: true,
          opacity: isDark ? 0.3 : 0.6,
          width: isDark ? 1 : 2, // Más gruesas en modo claro
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
          },
          value: 180, // Aún más densas al centro
        },
        opacity: {
          value: 0.6,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    [particleColor]
  );

  if (!init) return null;

  return (
    <div className="absolute inset-0 w-full h-full bg-stone-50 dark:bg-[#03090c] overflow-hidden transition-colors duration-500">
      {/* Resplandor radial central adaptado a la marca actual */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none transition-all duration-700" 
        style={{
          background: isDark 
            ? `radial-gradient(circle at center, rgba(${brandConfig.glow},0.12) 0%, transparent 60%)` 
            : `radial-gradient(circle at center, rgba(${brandConfig.glow},0.05) 0%, transparent 60%)`
        }}
      />
      
      {/* Máscara tipo viñeta para oscurecer/aclarar los bordes y enfocar la tensión lumínica al centro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,theme(colors.stone.50)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_20%,#03090c_100%)] z-10 pointer-events-none" />
      
      <Particles
        id="tsparticles"
        options={options}
        className="absolute inset-0 z-0"
      />
    </div>
  );
}
