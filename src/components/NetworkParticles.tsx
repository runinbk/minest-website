"use client";

import { useEffect, useState, useMemo } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useBrandStore } from "@/store/useBrandStore";

export function NetworkParticles() {
  const [init, setInit] = useState(false);
  const { activeBrand } = useBrandStore();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // loadSlim loads the necessary features to render particles with links
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particleColor = useMemo(() => {
    switch (activeBrand) {
      case "jetema":
        return "#a78bfa"; // vibrant purple
      case "dermclar":
        return "#38bdf8"; // sky blue
      case "xtralife":
        return "#34d399"; // emerald green
      default:
        // Maines / Default - Tipo turquesa solicitado
        return "#00e5ff"; 
    }
  }, [activeBrand]);

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
          opacity: 0.3,
          width: 1,
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
          value: 150, // Ligeramente más puntos para llenar el centro
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
      {/* Resplandor radial central turquesa suave */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.12)_0%,transparent_60%)] z-0 pointer-events-none" />
      
      {/* Máscara tipo viñeta para oscurecer los bordes y enfocar la tensión lumínica al centro */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,theme(colors.stone.50)_100%)] dark:bg-[radial-gradient(circle_at_center,transparent_20%,#03090c_100%)] z-10 pointer-events-none" />
      
      <Particles
        id="tsparticles"
        options={options}
        className="absolute inset-0 z-0"
      />
    </div>
  );
}
