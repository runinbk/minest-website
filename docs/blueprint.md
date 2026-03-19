# **App Name**: Aurora Innovations

## Core Features:

- Global Brand State Management: Utilizes Zustand to manage the active brand state ('maines', 'dermclar', 'xtralife', 'jetema'), ensuring consistent UI responses across the application.
- Dynamic Aurora Mesh Background: A fixed background component featuring animated, blurred, and blending color circles that transition smoothly in hue based on the currently active brand.
- Glassmorphism Content Wrapper: Applies a transparent, frosted glass effect (Glassmorphism) to all main content areas, allowing the dynamic Aurora background to subtly show through.
- Mutating Navigation Bar: A primary floating navigation bar that dynamically hides and slides up to reveal a sticky, central brand-switcher pill when the user scrolls to the brands section, and reappears when scrolling back up.
- Interactive Brand Showcase: Provides an impactful, asymmetric layout for each brand (Dermclar, Xtralife, Jetema), rendering specific content and a video player placeholder, with smooth transitions via AnimatePresence.
- Hero Section: A clean, modern hero section with a bold 'Innovación Médica. Sin Fronteras.' headline and floating Glassmorphism cards displaying key B2B statistics.
- Corporate Overview & Contact: A modern 'bento box' grid displaying Maines S.R.L.'s corporate logistics, technical support, and services, complemented by an integrated Glassmorphism contact form for B2B inquiries.

## Style Guidelines:

- Primary color: A sophisticated deep blue (#335599) providing a formal and technological accent for interactive elements and headlines.
- Background color: An extremely light, desaturated blue-gray (#F0F2F5) providing an elegant, subtle canvas for the entire page, designed to be almost imperceptible from white but adding warmth.
- Accent color: A vibrant cyan (#79DAEA) used sparingly for calls to action and to provide contrast, reflecting a modern, technological feel.
- Headline and Body text font: 'Space Grotesk', a proportional sans-serif with a techy, scientific feel, chosen for its modernity and readability in both massive displays and concise text.
- Minimalist, vector-based line icons with a clean and modern aesthetic to maintain a sophisticated B2B and technological feel, complementing the Glassmorphism design.
- Spacious and asymmetrical content sections, particularly for brand showcases. Utilizes a continuous scroll experience without scroll-snap, enhancing content flow.
- Smooth color transitions for the 'Aurora' background driven by Framer Motion, seamless slide-in/out animations for the mutating navigation, and fluid conditional rendering for brand-specific content sections using AnimatePresence.