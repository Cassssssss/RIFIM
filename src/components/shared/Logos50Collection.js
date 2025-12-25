import React from 'react';

// ==================== LOGO 1: Stéthoscope minimaliste (GARDÉ) ====================
const Logo1 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#2563eb" cx="50" cy="50" r="45"/>
    <path stroke="#fff" strokeWidth="4" fill="none" d="M 25 20 Q 25 35 40 40" strokeLinecap="round"/>
    <path stroke="#fff" strokeWidth="4" fill="none" d="M 75 20 Q 75 35 60 40" strokeLinecap="round"/>
    <line x1="40" y1="40" x2="50" y2="55" stroke="#fff" strokeWidth="4" strokeLinecap="round"/>
    <circle fill="#fff" cx="50" cy="65" r="10"/>
  </svg>
);

// ==================== LOGO 2: Infinity Medical ====================
const Logo2 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="inf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#inf-grad)" d="M 20 50 Q 20 30 32 30 Q 44 30 44 42 Q 44 50 50 50 Q 56 50 56 42 Q 56 30 68 30 Q 80 30 80 50 Q 80 70 68 70 Q 56 70 56 58 Q 56 50 50 50 Q 44 50 44 58 Q 44 70 32 70 Q 20 70 20 50 Z"/>
  </svg>
);

// ==================== LOGO 3: Pulse Minimal ====================
const Logo3 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="pulse-min" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
        <stop offset="50%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="#fff" cx="50" cy="50" r="45"/>
    <path stroke="url(#pulse-min)" strokeWidth="5" fill="none"
      d="M 15 50 L 30 50 L 38 25 L 46 75 L 54 30 L 62 65 L 70 50 L 85 50"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ==================== LOGO 4: Pentagon Medical ====================
const Logo4 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="pent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <polygon fill="url(#pent-grad)" points="50,8 90,35 75,85 25,85 10,35"/>
    <polygon fill="#fff" points="50,25 75,45 65,75 35,75 25,45" opacity="0.3"/>
    <circle fill="#fff" cx="50" cy="50" r="12"/>
  </svg>
);

// ==================== LOGO 5: Orbit ====================
const Logo5 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="orbit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#orbit-grad)" cx="50" cy="50" r="45"/>
    <ellipse fill="none" stroke="#fff" strokeWidth="3" cx="50" cy="50" rx="32" ry="18" opacity="0.8"/>
    <ellipse fill="none" stroke="#fff" strokeWidth="3" cx="50" cy="50" rx="18" ry="32" opacity="0.8"/>
    <circle fill="#fff" cx="50" cy="50" r="8"/>
  </svg>
);

// ==================== LOGO 6: Wave Sync ====================
const Logo6 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="wave-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect fill="url(#wave-grad)" x="10" y="10" width="80" height="80" rx="20"/>
    <path fill="none" stroke="#fff" strokeWidth="4" d="M 20 50 Q 30 30 40 50 T 60 50 T 80 50" strokeLinecap="round"/>
    <circle fill="#fff" cx="40" cy="50" r="5"/>
    <circle fill="#fff" cx="60" cy="50" r="5"/>
  </svg>
);

// ==================== LOGO 7: Triple Ring ====================
const Logo7 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#ring-grad)" cx="50" cy="50" r="45"/>
    <circle fill="none" stroke="#fff" strokeWidth="4" cx="50" cy="50" r="32" opacity="0.8"/>
    <circle fill="none" stroke="#fff" strokeWidth="4" cx="50" cy="50" r="22" opacity="0.6"/>
    <circle fill="#fff" cx="50" cy="50" r="10"/>
  </svg>
);

// ==================== LOGO 8: Hexagon Grid ====================
const Logo8 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0d9488', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <polygon fill="url(#hex-grad)" points="50,8 85,28 85,72 50,92 15,72 15,28"/>
    <polygon fill="none" stroke="#fff" strokeWidth="3" points="50,20 75,35 75,65 50,80 25,65 25,35"/>
    <circle fill="#fff" cx="50" cy="50" r="12"/>
  </svg>
);

// ==================== LOGO 9: Diamond Pro ====================
const Logo9 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="dia-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#be185d', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <polygon fill="url(#dia-grad)" points="50,10 80,50 50,90 20,50"/>
    <polygon fill="#fff" points="50,10 80,50 50,50" opacity="0.4"/>
    <polygon fill="#fff" points="50,10 20,50 50,50" opacity="0.2"/>
  </svg>
);

// ==================== LOGO 10: Spiral ====================
const Logo10 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="spiral-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#spiral-grad)" cx="50" cy="50" r="45"/>
    <path fill="none" stroke="#fff" strokeWidth="4" d="M 50 50 Q 70 50 70 30 Q 70 10 50 10 Q 20 10 20 40 Q 20 70 50 70" strokeLinecap="round"/>
    <circle fill="#fff" cx="50" cy="70" r="6"/>
  </svg>
);

// ==================== LOGO 11: Cross Modern ====================
const Logo11 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="cross-mod" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="#fff" cx="50" cy="50" r="45"/>
    <rect fill="url(#cross-mod)" x="43" y="20" width="14" height="60" rx="4"/>
    <rect fill="url(#cross-mod)" x="20" y="43" width="60" height="14" rx="4"/>
  </svg>
);

// ==================== LOGO 12: Leaf Medical ====================
const Logo12 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="leaf-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#leaf-grad)" d="M 50 10 Q 85 25 85 55 Q 85 80 60 90 Q 35 90 25 75 Q 15 60 50 10 Z"/>
    <path stroke="#fff" strokeWidth="2.5" fill="none" d="M 50 10 Q 58 35 65 60" strokeLinecap="round" opacity="0.7"/>
  </svg>
);

// ==================== LOGO 13: Shield Minimal ====================
const Logo13 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="shield-min" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0284c7', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#shield-min)" d="M 50 8 L 88 22 L 88 50 Q 88 75 50 92 Q 12 75 12 50 L 12 22 Z"/>
    <path fill="#fff" d="M 50 20 L 78 32 L 78 50 Q 78 68 50 82 Q 22 68 22 50 L 22 32 Z" opacity="0.25"/>
  </svg>
);

// ==================== LOGO 14: Arrow Circle ====================
const Logo14 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="arrow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#a855f7', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#arrow-grad)" cx="50" cy="50" r="45"/>
    <path fill="#fff" d="M 30 50 L 58 50 L 58 35 L 78 50 L 58 65 L 58 50 Z"/>
  </svg>
);

// ==================== LOGO 15: Triangle Trio ====================
const Logo15 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="tri-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <polygon fill="url(#tri-grad)" points="50,15 85,75 15,75"/>
    <polygon fill="#fff" points="50,30 70,65 30,65" opacity="0.4"/>
  </svg>
);

// ==================== LOGO 16: Radiologie X (GARDÉ) ====================
const Logo16 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <rect fill="#374151" x="10" y="10" width="80" height="80" rx="8"/>
    <rect fill="#1f2937" x="20" y="20" width="60" height="60" rx="5"/>
    <path fill="#9ca3af" d="M 40 30 L 35 45 L 30 45 L 40 65 L 50 45 L 45 45 Z" opacity="0.6"/>
    <path fill="#d1d5db" d="M 60 35 L 55 50 L 50 50 L 60 70 L 70 50 L 65 50 Z" opacity="0.8"/>
  </svg>
);

// ==================== LOGO 17: Atom (GARDÉ) ====================
const Logo17 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <ellipse fill="none" stroke="#f97316" strokeWidth="3" cx="50" cy="50" rx="35" ry="15" transform="rotate(45 50 50)"/>
    <ellipse fill="none" stroke="#fb923c" strokeWidth="3" cx="50" cy="50" rx="35" ry="15" transform="rotate(-45 50 50)"/>
    <circle fill="#fdba74" cx="50" cy="50" r="12"/>
  </svg>
);

// ==================== LOGO 18: Letter M Medical ====================
const Logo18 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="m-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect fill="url(#m-grad)" x="8" y="8" width="84" height="84" rx="22"/>
    <path fill="#fff" d="M 25 65 L 25 35 L 38 50 L 50 35 L 62 50 L 75 35 L 75 65 L 65 65 L 65 50 L 50 65 L 35 50 L 35 65 Z"/>
  </svg>
);

// ==================== LOGO 19: Droplet Minimal ====================
const Logo19 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="drop-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#drop-grad)" d="M 50 12 Q 75 35 75 58 Q 75 80 50 90 Q 25 80 25 58 Q 25 35 50 12 Z"/>
    <ellipse fill="#fff" cx="42" cy="35" rx="10" ry="14" opacity="0.35"/>
  </svg>
);

// ==================== LOGO 20: Star Medical ====================
const Logo20 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="star-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#eab308', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#ca8a04', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <polygon fill="url(#star-grad)" points="50,12 62,42 94,42 68,60 80,90 50,72 20,90 32,60 6,42 38,42"/>
  </svg>
);

// ==================== LOGO 21: Chevron Up ====================
const Logo21 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="chev-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#chev-grad)" cx="50" cy="50" r="45"/>
    <path fill="none" stroke="#fff" strokeWidth="8" d="M 25 60 L 50 35 L 75 60" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ==================== LOGO 22: Plus Circle ====================
const Logo22 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="plus-circ" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#plus-circ)" cx="50" cy="50" r="45"/>
    <rect fill="#fff" x="45" y="25" width="10" height="50" rx="3"/>
    <rect fill="#fff" x="25" y="45" width="50" height="10" rx="3"/>
  </svg>
);

// ==================== LOGO 23: Double Triangle ====================
const Logo23 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="dtri-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#be185d', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <polygon fill="url(#dtri-grad)" points="50,15 80,50 50,50"/>
    <polygon fill="url(#dtri-grad)" points="50,50 20,50 50,85"/>
  </svg>
);

// ==================== LOGO 24: Square Rotation ====================
const Logo24 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="sqrot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect fill="url(#sqrot-grad)" x="15" y="15" width="70" height="70" rx="12" transform="rotate(45 50 50)"/>
    <rect fill="#fff" x="32" y="32" width="36" height="36" rx="6" transform="rotate(45 50 50)" opacity="0.3"/>
  </svg>
);

// ==================== LOGO 25: Lightning ====================
const Logo25 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="light-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#light-grad)" cx="50" cy="50" r="45"/>
    <polygon fill="#fff" points="55,15 40,50 50,50 45,85 70,45 55,45"/>
  </svg>
);

// ==================== LOGO 26: Target ====================
const Logo26 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="targ-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#targ-grad)" cx="50" cy="50" r="45"/>
    <circle fill="#fff" cx="50" cy="50" r="32" opacity="0.9"/>
    <circle fill="url(#targ-grad)" cx="50" cy="50" r="20"/>
    <circle fill="#fff" cx="50" cy="50" r="8"/>
  </svg>
);

// ==================== LOGO 27: Molecule Chain ====================
const Logo27 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="mol-chain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#mol-chain)" cx="50" cy="50" r="45"/>
    <circle fill="#fff" cx="30" cy="35" r="8"/>
    <circle fill="#fff" cx="70" cy="35" r="8"/>
    <circle fill="#fff" cx="50" cy="50" r="10"/>
    <circle fill="#fff" cx="30" cy="65" r="8"/>
    <circle fill="#fff" cx="70" cy="65" r="8"/>
    <line x1="30" y1="35" x2="50" y2="50" stroke="#fff" strokeWidth="3"/>
    <line x1="70" y1="35" x2="50" y2="50" stroke="#fff" strokeWidth="3"/>
    <line x1="50" y1="50" x2="30" y2="65" stroke="#fff" strokeWidth="3"/>
    <line x1="50" y1="50" x2="70" y2="65" stroke="#fff" strokeWidth="3"/>
  </svg>
);

// ==================== LOGO 28: Gear ====================
const Logo28 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="gear-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#64748b', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#475569', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#gear-grad)" cx="50" cy="50" r="45"/>
    <circle fill="#fff" cx="50" cy="50" r="15"/>
    <rect fill="#fff" x="47" y="8" width="6" height="18" rx="2"/>
    <rect fill="#fff" x="47" y="74" width="6" height="18" rx="2"/>
    <rect fill="#fff" x="8" y="47" width="18" height="6" rx="2"/>
    <rect fill="#fff" x="74" y="47" width="18" height="6" rx="2"/>
    <rect fill="#fff" x="20" y="20" width="6" height="15" rx="2" transform="rotate(45 23 27.5)"/>
    <rect fill="#fff" x="74" y="20" width="6" height="15" rx="2" transform="rotate(-45 77 27.5)"/>
    <rect fill="#fff" x="20" y="65" width="6" height="15" rx="2" transform="rotate(-45 23 72.5)"/>
    <rect fill="#fff" x="74" y="65" width="6" height="15" rx="2" transform="rotate(45 77 72.5)"/>
  </svg>
);

// ==================== LOGO 29: Heart Simple ====================
const Logo29 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="heart-simp" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f43f5e', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#e11d48', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#heart-simp)"
      d="M 50 80 L 20 50 Q 10 40 10 28 Q 10 10 28 10 Q 38 10 50 22 Q 62 10 72 10 Q 90 10 90 28 Q 90 40 80 50 Z"/>
  </svg>
);

// ==================== LOGO 30: Circle Grid ====================
const Logo30 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="cgrid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0d9488', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#cgrid-grad)" cx="50" cy="50" r="45"/>
    <circle fill="#fff" cx="32" cy="32" r="8"/>
    <circle fill="#fff" cx="68" cy="32" r="8"/>
    <circle fill="#fff" cx="32" cy="68" r="8"/>
    <circle fill="#fff" cx="68" cy="68" r="8"/>
    <circle fill="#fff" cx="50" cy="50" r="10"/>
  </svg>
);

// ==================== LOGO 31: Check Circle ====================
const Logo31 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="check-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#check-grad)" cx="50" cy="50" r="45"/>
    <path stroke="#fff" strokeWidth="8" fill="none" d="M 30 50 L 43 63 L 70 33" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ==================== LOGO 32: Bookmark ====================
const Logo32 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="book-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect fill="url(#book-grad)" x="25" y="10" width="50" height="80" rx="8"/>
    <path fill="#fff" d="M 30 15 L 70 15 L 70 80 L 50 65 L 30 80 Z" opacity="0.9"/>
  </svg>
);

// ==================== LOGO 33: Bell ====================
const Logo33 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="bell-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#bell-grad)" cx="50" cy="50" r="45"/>
    <path fill="#fff" d="M 35 55 Q 35 35 50 25 Q 65 35 65 55 L 70 60 L 30 60 Z"/>
    <circle fill="#fff" cx="50" cy="68" r="5"/>
  </svg>
);

// ==================== LOGO 34: Lock ====================
const Logo34 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="lock-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect fill="url(#lock-grad)" x="28" y="45" width="44" height="38" rx="8"/>
    <path fill="none" stroke="url(#lock-grad)" strokeWidth="8" d="M 35 45 L 35 32 Q 35 18 50 18 Q 65 18 65 32 L 65 45"/>
    <circle fill="#fff" cx="50" cy="64" r="6"/>
  </svg>
);

// ==================== LOGO 35: Wifi Signal ====================
const Logo35 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="wifi-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#wifi-grad)" cx="50" cy="50" r="45"/>
    <path fill="none" stroke="#fff" strokeWidth="5" d="M 25 65 Q 35 55 50 55 Q 65 55 75 65" strokeLinecap="round"/>
    <path fill="none" stroke="#fff" strokeWidth="5" d="M 18 55 Q 30 40 50 40 Q 70 40 82 55" strokeLinecap="round"/>
    <circle fill="#fff" cx="50" cy="72" r="5"/>
  </svg>
);

// ==================== LOGO 36: Stérilisation (GARDÉ) ====================
const Logo36 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#f59e0b" cx="50" cy="50" r="40"/>
    <path stroke="#fff" strokeWidth="4" fill="none" d="M 30 50 Q 40 30 50 50 Q 60 70 70 50" strokeLinecap="round"/>
    <circle fill="#fbbf24" cx="35" cy="45" r="5"/>
    <circle fill="#fbbf24" cx="50" cy="50" r="5"/>
    <circle fill="#fbbf24" cx="65" cy="45" r="5"/>
  </svg>
);

// ==================== LOGO 37: Battery ====================
const Logo37 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="batt-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#22c55e', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#16a34a', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect fill="url(#batt-grad)" x="15" y="35" width="65" height="30" rx="5"/>
    <rect fill="#fff" x="20" y="40" width="50" height="20" rx="3" opacity="0.9"/>
    <rect fill="url(#batt-grad)" x="80" y="43" width="5" height="14" rx="2"/>
  </svg>
);

// ==================== LOGO 38: Pen ====================
const Logo38 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="pen-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#be185d', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#pen-grad)" cx="50" cy="50" r="45"/>
    <polygon fill="#fff" points="35,65 35,55 65,25 75,35 45,65"/>
    <rect fill="#fff" x="68" y="20" width="10" height="20" rx="2" transform="rotate(45 73 30)"/>
  </svg>
);

// ==================== LOGO 39: Download ====================
const Logo39 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="down-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#down-grad)" cx="50" cy="50" r="45"/>
    <rect fill="#fff" x="45" y="25" width="10" height="35" rx="2"/>
    <polygon fill="#fff" points="50,70 35,55 45,55 50,60 55,55 65,55"/>
    <line x1="30" y1="75" x2="70" y2="75" stroke="#fff" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

// ==================== LOGO 40: Upload ====================
const Logo40 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="up-grad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#up-grad)" cx="50" cy="50" r="45"/>
    <rect fill="#fff" x="45" y="40" width="10" height="35" rx="2"/>
    <polygon fill="#fff" points="50,30 35,45 45,45 50,40 55,45 65,45"/>
    <line x1="30" y1="75" x2="70" y2="75" stroke="#fff" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

// ==================== LOGO 41: Cloud ====================
const Logo41 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="cloud-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#60a5fa', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#cloud-grad)" cx="50" cy="50" r="45"/>
    <path fill="#fff" d="M 30 55 Q 25 55 25 50 Q 25 40 35 40 Q 35 28 50 28 Q 65 28 65 40 Q 75 40 75 50 Q 75 60 65 60 L 30 60 Q 25 60 25 55 Z"/>
  </svg>
);

// ==================== LOGO 42: Folder ====================
const Logo42 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="fold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f59e0b', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#d97706', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#fold-grad)" d="M 15 30 L 15 75 L 85 75 L 85 35 L 55 35 L 45 25 Z"/>
    <rect fill="#fbbf24" x="15" y="30" width="70" height="10" opacity="0.4"/>
  </svg>
);

// ==================== LOGO 43: Eye ====================
const Logo43 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="eye-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <ellipse fill="url(#eye-grad2)" cx="50" cy="50" rx="45" ry="28"/>
    <circle fill="#fff" cx="50" cy="50" r="15"/>
    <circle fill="#1f2937" cx="50" cy="50" r="10"/>
    <circle fill="#fff" cx="55" cy="45" r="4"/>
  </svg>
);

// ==================== LOGO 44: Clipboard ====================
const Logo44 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="clip-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0d9488', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect fill="url(#clip-grad)" x="25" y="18" width="50" height="72" rx="6"/>
    <rect fill="#fff" x="35" y="12" width="30" height="12" rx="3"/>
    <line x1="35" y1="35" x2="65" y2="35" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    <line x1="35" y1="48" x2="65" y2="48" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
    <line x1="35" y1="61" x2="55" y2="61" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

// ==================== LOGO 45: Calendar ====================
const Logo45 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="cal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect fill="url(#cal-grad)" x="20" y="25" width="60" height="60" rx="8"/>
    <rect fill="#fff" x="20" y="25" width="60" height="15" rx="8" clipPath="inset(0 0 50% 0 round 8px)"/>
    <circle fill="#fff" cx="35" cy="52" r="4"/>
    <circle fill="#fff" cx="50" cy="52" r="4"/>
    <circle fill="#fff" cx="65" cy="52" r="4"/>
    <circle fill="#fff" cx="35" cy="68" r="4"/>
    <circle fill="#fff" cx="50" cy="68" r="4"/>
  </svg>
);

// ==================== LOGO 46: User ====================
const Logo46 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="user-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#user-grad)" cx="50" cy="50" r="45"/>
    <circle fill="#fff" cx="50" cy="40" r="15"/>
    <path fill="#fff" d="M 25 85 Q 25 65 50 65 Q 75 65 75 85 Z"/>
  </svg>
);

// ==================== LOGO 47: Users ====================
const Logo47 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="users-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#users-grad)" cx="50" cy="50" r="45"/>
    <circle fill="#fff" cx="38" cy="38" r="10"/>
    <circle fill="#fff" cx="62" cy="38" r="10"/>
    <path fill="#fff" d="M 20 75 Q 20 58 38 58 Q 45 58 45 65 Z"/>
    <path fill="#fff" d="M 55 65 Q 55 58 62 58 Q 80 58 80 75 Z"/>
  </svg>
);

// ==================== LOGO 48: Settings Modern ====================
const Logo48 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="set-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#set-grad)" cx="50" cy="50" r="45"/>
    <line x1="30" y1="35" x2="70" y2="35" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
    <circle fill="#fff" cx="55" cy="35" r="7"/>
    <line x1="30" y1="50" x2="70" y2="50" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
    <circle fill="#fff" cx="45" cy="50" r="7"/>
    <line x1="30" y1="65" x2="70" y2="65" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
    <circle fill="#fff" cx="60" cy="65" r="7"/>
  </svg>
);

// ==================== LOGO 49: Map Pin ====================
const Logo49 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="pin-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#ef4444', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#pin-grad)" d="M 50 10 Q 70 20 70 40 Q 70 55 50 85 Q 30 55 30 40 Q 30 20 50 10 Z"/>
    <circle fill="#fff" cx="50" cy="38" r="12"/>
  </svg>
);

// ==================== LOGO 50: Search ====================
const Logo50 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="search-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <circle fill="url(#search-grad)" cx="50" cy="50" r="45"/>
    <circle fill="none" stroke="#fff" strokeWidth="6" cx="42" cy="42" r="18"/>
    <line x1="55" y1="55" x2="72" y2="72" stroke="#fff" strokeWidth="8" strokeLinecap="round"/>
  </svg>
);

export {
  Logo1, Logo2, Logo3, Logo4, Logo5,
  Logo6, Logo7, Logo8, Logo9, Logo10,
  Logo11, Logo12, Logo13, Logo14, Logo15,
  Logo16, Logo17, Logo18, Logo19, Logo20,
  Logo21, Logo22, Logo23, Logo24, Logo25,
  Logo26, Logo27, Logo28, Logo29, Logo30,
  Logo31, Logo32, Logo33, Logo34, Logo35,
  Logo36, Logo37, Logo38, Logo39, Logo40,
  Logo41, Logo42, Logo43, Logo44, Logo45,
  Logo46, Logo47, Logo48, Logo49, Logo50
};
