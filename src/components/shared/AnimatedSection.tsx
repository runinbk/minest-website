'use client';

import { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger } from '@/lib/gsap-setup';

// ScrollTrigger is registered once in gsap-setup.ts — importing here ensures
// the TweenVars type augmentation is applied (scrollTrigger property on tweens).
void ScrollTrigger; // reference to satisfy linter without removing the import

type Direction = 'up' | 'left' | 'right';

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  className?: string;
}

/**
 * Drop-in wrapper that animates its root div into view on scroll.
 * Uses ScrollTrigger so the animation only plays when the element
 * enters the viewport at 85% threshold.
 */
export function AnimatedSection({
  children,
  delay = 0,
  direction = 'up',
  className,
}: AnimatedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const from: gsap.TweenVars = {
        autoAlpha: 0,
        y: direction === 'up' ? 40 : 0,
        x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
      };

      const to: gsap.TweenVars = {
        autoAlpha: 1,
        y: 0,
        x: 0,
        duration: 0.7,
        delay,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      };

      gsap.fromTo(containerRef.current, from, to);
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
