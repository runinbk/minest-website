/**
 * Centralised GSAP setup — import from here everywhere in the project.
 * gsap.registerPlugin() runs ONCE at module-evaluation time, not inside components.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, Flip, useGSAP);

export { gsap, ScrollTrigger, Flip, useGSAP };
