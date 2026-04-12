'use client';

interface InstagramBadgeProps {
  handle: string;
  url: string;
  color: string; // hex, e.g. '#7C3AED'
}

/**
 * Pill-shaped Instagram badge.
 * Opens the brand's Instagram profile in a new tab.
 */
export function InstagramBadge({ handle, url, color }: InstagramBadgeProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 hover:bg-white/60 transition-all shadow-sm group"
      aria-label={`Instagram ${handle}`}
    >
      {/* Instagram SVG — gradient icon */}
      <svg
        className="w-5 h-5 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#f09433" />
            <stop offset="25%"  stopColor="#e6683c" />
            <stop offset="50%"  stopColor="#dc2743" />
            <stop offset="75%"  stopColor="#cc2366" />
            <stop offset="100%" stopColor="#bc1888" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"
          stroke="url(#ig-grad)" strokeWidth="1.8" fill="none" />
        <circle cx="12" cy="12" r="4.5"
          stroke="url(#ig-grad)" strokeWidth="1.8" fill="none" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="url(#ig-grad)" />
      </svg>

      <span
        className="text-sm font-semibold tracking-tight transition-colors"
        style={{ color }}
      >
        {handle}
      </span>

      {/* External arrow */}
      <svg
        className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0"
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M7 17L17 7M7 7h10v10" />
      </svg>
    </a>
  );
}
