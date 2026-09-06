// A hand-art-directed illustration of a RAJRASS tiffin thali, built entirely
// in SVG so the project ships with zero external/stock imagery. Swap the
// <TiffinPlate/> markup for a real photograph whenever one is available —
// see the comment near the bottom for exactly where to drop an <img>.

export function TiffinPlate({ className = "" }) {
  return (
    <svg
      viewBox="0 0 520 520"
      className={className}
      role="img"
      aria-label="Illustration of a RAJRASS home-style thali with dal, sabzi, roti, rice, salad and achaar"
    >
      <defs>
        <radialGradient id="plateShadow" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#E7DABE" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#E7DABE" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="thaliMetal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3E9D7" />
          <stop offset="100%" stopColor="#E3D3AE" />
        </linearGradient>
      </defs>

      <ellipse cx="260" cy="300" rx="230" ry="60" fill="url(#plateShadow)" />

      {/* thali base */}
      <circle cx="260" cy="240" r="215" fill="url(#thaliMetal)" stroke="#C9B78C" strokeWidth="2" />
      <circle cx="260" cy="240" r="196" fill="#FBF5EA" stroke="#D8C8A2" strokeWidth="1.5" />

      {/* rice — center */}
      <g>
        <ellipse cx="260" cy="240" rx="78" ry="66" fill="#FEFBF3" stroke="#E7DABE" strokeWidth="2" />
        <path d="M215 220c8-10 20-14 30-8m20 30c10-8 24-8 34 2m-70 20c10 6 22 6 30 0" stroke="#D8C8A2" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>

      {/* dal — top left katori */}
      <g>
        <circle cx="150" cy="150" r="52" fill="#F3E9D7" stroke="#C9B78C" strokeWidth="2" />
        <circle cx="150" cy="150" r="40" fill="#C98A2C" />
        <ellipse cx="150" cy="140" rx="34" ry="10" fill="#E3B364" opacity="0.6" />
      </g>

      {/* sabzi — top right katori */}
      <g>
        <circle cx="370" cy="150" r="52" fill="#F3E9D7" stroke="#C9B78C" strokeWidth="2" />
        <circle cx="370" cy="150" r="40" fill="#8C2B1E" />
        <circle cx="358" cy="140" r="7" fill="#C98A2C" />
        <circle cx="380" cy="146" r="6" fill="#E3B364" />
        <circle cx="368" cy="158" r="6" fill="#6C2016" />
      </g>

      {/* roti — bottom left */}
      <g>
        <circle cx="130" cy="330" r="46" fill="#EED9A8" stroke="#C9B78C" strokeWidth="2" />
        <circle cx="130" cy="330" r="46" fill="none" stroke="#C98A2C" strokeWidth="1" strokeDasharray="3 5" opacity="0.5" />
        <ellipse cx="112" cy="316" rx="14" ry="9" fill="#8C2B1E" opacity="0.15" />
      </g>

      {/* salad + achaar — bottom right */}
      <g>
        <circle cx="390" cy="330" r="46" fill="#F3E9D7" stroke="#C9B78C" strokeWidth="2" />
        <path d="M370 320c6-10 20-14 28-6 8-6 20-2 24 8-4 10-16 16-26 12-10 4-22-2-26-14z" fill="#8AA05A" />
        <circle cx="405" cy="336" r="7" fill="#8C2B1E" />
      </g>

      {/* subtle steam above rice */}
      <g opacity="0.55">
        <path d="M245 150c-6 10 6 14 0 26" stroke="#C9B78C" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M262 146c-6 10 6 14 0 26" stroke="#C9B78C" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path d="M279 150c-6 10 6 14 0 26" stroke="#C9B78C" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  );
}

export function TiffinStack({ className = "" }) {
  return (
    <svg viewBox="0 0 60 90" className={className} role="presentation" aria-hidden="true">
      <ellipse cx="30" cy="10" rx="20" ry="5" fill="#C98A2C" />
      <rect x="10" y="10" width="40" height="18" rx="2" fill="#8C2B1E" />
      <rect x="10" y="30" width="40" height="18" rx="2" fill="#A3392A" />
      <rect x="10" y="50" width="40" height="18" rx="2" fill="#8C2B1E" />
      <rect x="22" y="68" width="16" height="14" fill="#6C2016" />
      <rect x="4" y="8" width="6" height="60" rx="2" fill="#4A150F" />
    </svg>
  );
}

// To use a real photograph instead of the illustration above:
//   <img src="/images/hero-thali.jpg" alt="Rajras home-style thali" className="..." />
// and remove the <TiffinPlate /> usage.
