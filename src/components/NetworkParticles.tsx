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
        // Maines / Default
        return "#0ea5e9"; // cyan/blue
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
          value: 120, // Enough density to look like a thick web
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
    <div className="absolute inset-0 w-full h-full bg-[#0a0a0a] overflow-hidden">
      {/* Soft radial gradient mask over the dark bg so it looks deep */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/80 z-10 pointer-events-none" />
      <Particles
        id="tsparticles"
        options={options}
        className="w-full h-full"
      />
    </div>
  );
}
