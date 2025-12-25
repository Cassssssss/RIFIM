import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
`;

// ==================== LOGO 1: Double Helix DNA (inspiré Ancestry, 23andMe) ====================
const Logo1 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="dna1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00c6ff" />
        <stop offset="100%" stopColor="#0072ff" />
      </linearGradient>
    </defs>
    {/* Spirale gauche */}
    <path d="M 30 10 Q 20 30 30 50 Q 40 70 30 90" stroke="url(#dna1)" strokeWidth="4" fill="none"/>
    {/* Spirale droite */}
    <path d="M 70 10 Q 80 30 70 50 Q 60 70 70 90" stroke="url(#dna1)" strokeWidth="4" fill="none"/>
    {/* Barreaux */}
    <line x1="30" y1="20" x2="70" y2="20" stroke="url(#dna1)" strokeWidth="2"/>
    <line x1="32" y1="35" x2="68" y2="35" stroke="url(#dna1)" strokeWidth="2"/>
    <line x1="30" y1="50" x2="70" y2="50" stroke="url(#dna1)" strokeWidth="2"/>
    <line x1="32" y1="65" x2="68" y2="65" stroke="url(#dna1)" strokeWidth="2"/>
    <line x1="30" y1="80" x2="70" y2="80" stroke="url(#dna1)" strokeWidth="2"/>
  </svg>
);

// ==================== LOGO 2: Heartbeat Line (inspiré Fitbit, Apple Health) ====================
const Logo2 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="heart1" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="100%" stopColor="#ee5a6f" />
      </linearGradient>
    </defs>
    <circle fill="url(#heart1)" cx="50" cy="50" r="42"/>
    <path d="M 15 50 L 30 50 L 38 35 L 46 65 L 54 40 L 62 55 L 70 50 L 85 50"
      stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ==================== LOGO 3: Microscope Moderne (inspiré LabCorp) ====================
const Logo3 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#6366f1" cx="50" cy="50" r="45"/>
    <circle fill="#818cf8" cx="50" cy="30" r="12"/>
    <rect fill="#a5b4fc" x="44" y="38" width="12" height="25" rx="2"/>
    <ellipse fill="#c7d2fe" cx="50" cy="70" rx="20" ry="8"/>
    <line x1="35" y1="70" x2="65" y2="70" stroke="#fff" strokeWidth="2"/>
  </svg>
);

// ==================== LOGO 4: Network/Neurons (inspiré Neuralink) ====================
const Logo4 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#10b981" cx="30" cy="30" r="8"/>
    <circle fill="#10b981" cx="70" cy="30" r="8"/>
    <circle fill="#10b981" cx="50" cy="50" r="10"/>
    <circle fill="#10b981" cx="30" cy="70" r="8"/>
    <circle fill="#10b981" cx="70" cy="70" r="8"/>
    <line x1="30" y1="30" x2="50" y2="50" stroke="#34d399" strokeWidth="2"/>
    <line x1="70" y1="30" x2="50" y2="50" stroke="#34d399" strokeWidth="2"/>
    <line x1="30" y1="70" x2="50" y2="50" stroke="#34d399" strokeWidth="2"/>
    <line x1="70" y1="70" x2="50" y2="50" stroke="#34d399" strokeWidth="2"/>
  </svg>
);

// ==================== LOGO 5: Shield + Cross (inspiré Mayo Clinic) ====================
const Logo5 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <path fill="#0ea5e9" d="M 50 10 L 80 25 L 80 50 Q 80 75 50 90 Q 20 75 20 50 L 20 25 Z"/>
    <rect fill="#fff" x="46" y="30" width="8" height="40" rx="2"/>
    <rect fill="#fff" x="30" y="46" width="40" height="8" rx="2"/>
  </svg>
);

// ==================== LOGO 6: Lungs (inspiré American Lung Association) ====================
const Logo6 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    {/* Poumon gauche */}
    <path fill="#f472b6" d="M 25 30 Q 15 40 15 55 Q 15 70 25 80 Q 32 75 35 65 Q 38 55 35 45 Q 32 35 25 30 Z"/>
    {/* Poumon droit */}
    <path fill="#f472b6" d="M 75 30 Q 85 40 85 55 Q 85 70 75 80 Q 68 75 65 65 Q 62 55 65 45 Q 68 35 75 30 Z"/>
    {/* Trachée */}
    <rect fill="#ec4899" x="47" y="10" width="6" height="25" rx="3"/>
    {/* Bronches */}
    <path stroke="#ec4899" strokeWidth="4" fill="none" d="M 50 35 L 38 42"/>
    <path stroke="#ec4899" strokeWidth="4" fill="none" d="M 50 35 L 62 42"/>
  </svg>
);

// ==================== LOGO 7: Pill Capsule (inspiré CVS, Walgreens) ====================
const Logo7 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="pill1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="50%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <ellipse fill="url(#pill1)" cx="50" cy="50" rx="35" ry="18" transform="rotate(45 50 50)"/>
  </svg>
);

// ==================== LOGO 8: Brain Waves (inspiré MindMaze) ====================
const Logo8 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#8b5cf6" cx="50" cy="50" r="45"/>
    <path stroke="#fff" strokeWidth="3" fill="none"
      d="M 20 50 Q 28 35 35 50 T 50 50 T 65 50 T 80 50" strokeLinecap="round"/>
    <circle fill="#a78bfa" cx="50" cy="35" r="15"/>
  </svg>
);

// ==================== LOGO 9: Eye/Vision (inspiré LASIK clinics) ====================
const Logo9 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <ellipse fill="#06b6d4" cx="50" cy="50" rx="45" ry="28"/>
    <circle fill="#0891b2" cx="50" cy="50" r="20"/>
    <circle fill="#0e7490" cx="50" cy="50" r="12"/>
    <circle fill="#fff" cx="55" cy="45" r="6"/>
  </svg>
);

// ==================== LOGO 10: Stethoscope moderne ====================
const Logo10 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#4f46e5" cx="50" cy="50" r="42"/>
    {/* Tube */}
    <path stroke="#fff" strokeWidth="5" fill="none" d="M 30 25 Q 30 40 45 45" strokeLinecap="round"/>
    <path stroke="#fff" strokeWidth="5" fill="none" d="M 70 25 Q 70 40 55 45" strokeLinecap="round"/>
    {/* Connecteur */}
    <line x1="45" y1="45" x2="50" y2="60" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
    {/* Membrane */}
    <circle fill="#fff" cx="50" cy="68" r="12"/>
    <circle fill="#4f46e5" cx="50" cy="68" r="8"/>
  </svg>
);

// ==================== LOGO 11: DNA Circle (inspiré Illumina) ====================
const Logo11 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="none" stroke="#14b8a6" strokeWidth="8" cx="50" cy="50" r="35"/>
    <circle fill="#14b8a6" cx="50" cy="15" r="5"/>
    <circle fill="#14b8a6" cx="85" cy="50" r="5"/>
    <circle fill="#14b8a6" cx="50" cy="85" r="5"/>
    <circle fill="#14b8a6" cx="15" cy="50" r="5"/>
    <circle fill="#5eead4" cx="50" cy="50" r="12"/>
  </svg>
);

// ==================== LOGO 12: Molecular Structure (inspiré Moderna) ====================
const Logo12 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#a855f7" cx="50" cy="50" r="10"/>
    <circle fill="#c084fc" cx="30" cy="30" r="8"/>
    <circle fill="#c084fc" cx="70" cy="30" r="8"/>
    <circle fill="#c084fc" cx="70" cy="70" r="8"/>
    <circle fill="#c084fc" cx="30" cy="70" r="8"/>
    <line x1="50" y1="50" x2="30" y2="30" stroke="#e9d5ff" strokeWidth="3"/>
    <line x1="50" y1="50" x2="70" y2="30" stroke="#e9d5ff" strokeWidth="3"/>
    <line x1="50" y1="50" x2="70" y2="70" stroke="#e9d5ff" strokeWidth="3"/>
    <line x1="50" y1="50" x2="30" y2="70" stroke="#e9d5ff" strokeWidth="3"/>
  </svg>
);

// ==================== LOGO 13: Cross Médical Rond (inspiré Red Cross moderne) ====================
const Logo13 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#dc2626" cx="50" cy="50" r="45"/>
    <rect fill="#fff" x="42" y="25" width="16" height="50" rx="3"/>
    <rect fill="#fff" x="25" y="42" width="50" height="16" rx="3"/>
  </svg>
);

// ==================== LOGO 14: Pulse Circle (inspiré Medtronic) ====================
const Logo14 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="none" stroke="#0284c7" strokeWidth="6" cx="50" cy="50" r="40"/>
    <path stroke="#0284c7" strokeWidth="5" fill="none"
      d="M 25 50 L 35 50 L 42 35 L 50 65 L 58 40 L 65 50 L 75 50"
      strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ==================== LOGO 15: Hexagonal Cell (inspiré biotech) ====================
const Logo15 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="hex1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22c55e" />
        <stop offset="100%" stopColor="#16a34a" />
      </linearGradient>
    </defs>
    <polygon fill="url(#hex1)" points="50,10 80,30 80,70 50,90 20,70 20,30"/>
    <polygon fill="#86efac" points="50,25 70,37.5 70,62.5 50,75 30,62.5 30,37.5" opacity="0.5"/>
    <circle fill="#fff" cx="50" cy="50" r="10"/>
  </svg>
);

// ==================== LOGO 16: Droplet (inspiré lab testing) ====================
const Logo16 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="drop1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#1d4ed8" />
      </linearGradient>
    </defs>
    <path fill="url(#drop1)" d="M 50 15 Q 70 35 70 55 Q 70 75 50 85 Q 30 75 30 55 Q 30 35 50 15 Z"/>
    <ellipse fill="#60a5fa" cx="42" cy="35" rx="8" ry="12" opacity="0.4"/>
  </svg>
);

// ==================== LOGO 17: Atom moderne (inspiré quantum health) ====================
const Logo17 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <ellipse fill="none" stroke="#f97316" strokeWidth="3" cx="50" cy="50" rx="35" ry="15" transform="rotate(45 50 50)"/>
    <ellipse fill="none" stroke="#fb923c" strokeWidth="3" cx="50" cy="50" rx="35" ry="15" transform="rotate(-45 50 50)"/>
    <circle fill="#fdba74" cx="50" cy="50" r="12"/>
  </svg>
);

// ==================== LOGO 18: Medical Chart (inspiré analytics) ====================
const Logo18 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <rect fill="#6366f1" x="10" y="10" width="80" height="80" rx="8"/>
    <rect fill="#a5b4fc" x="20" y="55" width="12" height="25" rx="2"/>
    <rect fill="#a5b4fc" x="36" y="40" width="12" height="40" rx="2"/>
    <rect fill="#a5b4fc" x="52" y="30" width="12" height="50" rx="2"/>
    <rect fill="#a5b4fc" x="68" y="45" width="12" height="35" rx="2"/>
  </svg>
);

// ==================== LOGO 19: Heartbeat + Cross ====================
const Logo19 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#ec4899" cx="50" cy="50" r="45"/>
    <path stroke="#fff" strokeWidth="4" fill="none"
      d="M 20 45 L 32 45 L 40 30 L 48 60 L 56 35 L 64 45 L 80 45"
      strokeLinecap="round" strokeLinejoin="round"/>
    <rect fill="#fff" x="46" y="55" width="8" height="25" rx="2"/>
    <rect fill="#fff" x="35" y="66" width="30" height="8" rx="2"/>
  </svg>
);

// ==================== LOGO 20: Scanner Circle (inspiré imaging) ====================
const Logo20 = () => (
  <svg width="80" height="80" viewBox="0 0 100 100">
    <circle fill="#0891b2" cx="50" cy="50" r="45"/>
    <circle fill="none" stroke="#fff" strokeWidth="3" cx="50" cy="50" r="32" strokeDasharray="5,5"/>
    <circle fill="none" stroke="#67e8f9" strokeWidth="4" cx="50" cy="50" r="20"/>
    <circle fill="#fff" cx="50" cy="50" r="8"/>
    <path stroke="#fff" strokeWidth="2" fill="none" d="M 50 22 L 50 10" strokeLinecap="round"/>
    <path stroke="#fff" strokeWidth="2" fill="none" d="M 50 90 L 50 78" strokeLinecap="round"/>
    <path stroke="#fff" strokeWidth="2" fill="none" d="M 22 50 L 10 50" strokeLinecap="round"/>
    <path stroke="#fff" strokeWidth="2" fill="none" d="M 90 50 L 78 50" strokeLinecap="round"/>
  </svg>
);

export {
  Logo1, Logo2, Logo3, Logo4, Logo5,
  Logo6, Logo7, Logo8, Logo9, Logo10,
  Logo11, Logo12, Logo13, Logo14, Logo15,
  Logo16, Logo17, Logo18, Logo19, Logo20
};
