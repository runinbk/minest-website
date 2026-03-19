
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Maines S.R.L. | Innovación Médica',
  description: 'Landing page B2B para Maines S.R.L. - Innovación Médica Sin Fronteras',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-stone-50/50 text-foreground selection:bg-accent/30 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
