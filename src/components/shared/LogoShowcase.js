import React from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const ShowcaseContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 2rem;
  background: ${props => props.theme.background};
  min-height: 100vh;
`;

const LogoCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: ${props => props.theme.card};
  border-radius: 12px;
  border: 2px solid ${props => props.theme.border};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const LogoNumber = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const LogoName = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  text-align: center;
`;

// ==================== LOGO 1: Design abstrait moderne (actuel) ====================
const Logo1Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(180deg) scale(1.05);
  }
`;

const Logo1 = () => (
  <Logo1Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g1-1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="g1-2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#f5576c', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="g1-3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#4facfe', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#00f2fe', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#g1-1)" d="M 20 50 Q 20 20 50 20 L 50 35 Q 35 35 35 50 Q 35 65 50 65 L 50 80 Q 20 80 20 50 Z" />
    <path fill="url(#g1-2)" d="M 80 50 Q 80 80 50 80 L 50 65 Q 65 65 65 50 Q 65 35 50 35 L 50 20 Q 80 20 80 50 Z" />
    <circle fill="url(#g1-3)" cx="50" cy="50" r="15" />
  </Logo1Svg>
);

// ==================== LOGO 2: Hexagone médical ====================
const Logo2Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  &:hover { transform: scale(1.1); }
`;

const Logo2 = () => (
  <Logo2Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon fill="#3b82f6" points="50,10 85,30 85,70 50,90 15,70 15,30" />
    <polygon fill="#60a5fa" points="50,25 75,37.5 75,62.5 50,75 25,62.5 25,37.5" />
    <rect fill="#fff" x="47" y="35" width="6" height="30" rx="2"/>
    <rect fill="#fff" x="35" y="47" width="30" height="6" rx="2"/>
  </Logo2Svg>
);

// ==================== LOGO 3: Onde/Signal ====================
const Logo3Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  &:hover { transform: scale(1.1); }
`;

const Logo3 = () => (
  <Logo3Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle fill="#8b5cf6" cx="50" cy="50" r="45" />
    <path stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round"
      d="M 15 50 L 25 50 L 30 30 L 40 70 L 50 40 L 60 60 L 70 50 L 85 50" />
    <circle fill="#c084fc" cx="50" cy="40" r="8" />
  </Logo3Svg>
);

// ==================== LOGO 4: Atome/Molécule ====================
const Logo4Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  &:hover { transform: rotate(90deg); }
`;

const Logo4 = () => (
  <Logo4Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle fill="none" stroke="#10b981" strokeWidth="3" cx="50" cy="50" r="35" opacity="0.5"/>
    <circle fill="none" stroke="#34d399" strokeWidth="3" cx="50" cy="50" r="35" opacity="0.5" transform="rotate(60 50 50)"/>
    <circle fill="none" stroke="#6ee7b7" strokeWidth="3" cx="50" cy="50" r="35" opacity="0.5" transform="rotate(120 50 50)"/>
    <circle fill="#10b981" cx="50" cy="50" r="10"/>
    <circle fill="#34d399" cx="50" cy="15" r="6"/>
    <circle fill="#6ee7b7" cx="80" cy="65" r="6"/>
    <circle fill="#86efac" cx="20" cy="65" r="6"/>
  </Logo4Svg>
);

// ==================== LOGO 5: Œil/Vision ====================
const Logo5Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  &:hover { transform: scale(1.15); }
`;

const Logo5 = () => (
  <Logo5Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <ellipse fill="#f59e0b" cx="50" cy="50" rx="45" ry="30" />
    <circle fill="#fbbf24" cx="50" cy="50" r="20" />
    <circle fill="#1f2937" cx="50" cy="50" r="12" />
    <circle fill="#fff" cx="55" cy="45" r="5" />
  </Logo5Svg>
);

// ==================== LOGO 6: Bouclier/Protection ====================
const Logo6Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  &:hover { transform: scale(1.1); }
`;

const Logo6 = () => (
  <Logo6Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path fill="#ef4444" d="M 50 10 L 85 25 L 85 50 Q 85 80 50 90 Q 15 80 15 50 L 15 25 Z" />
    <path fill="#fca5a5" d="M 50 20 L 75 32 L 75 50 Q 75 72 50 80 Q 25 72 25 50 L 25 32 Z" />
    <path stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round"
      d="M 35 50 L 45 60 L 65 35" />
  </Logo6Svg>
);

// ==================== LOGO 7: Infini/Ruban ====================
const Logo7Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  &:hover { transform: rotate(90deg); }
`;

const Logo7 = () => (
  <Logo7Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g7" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#g7)"
      d="M 25 50 Q 25 30 35 30 Q 45 30 45 40 Q 45 50 50 50 Q 55 50 55 40 Q 55 30 65 30 Q 75 30 75 50 Q 75 70 65 70 Q 55 70 55 60 Q 55 50 50 50 Q 45 50 45 60 Q 45 70 35 70 Q 25 70 25 50 Z" />
  </Logo7Svg>
);

// ==================== LOGO 8: Diamant/Cristal ====================
const Logo8Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  &:hover { transform: rotate(45deg) scale(1.1); }
`;

const Logo8 = () => (
  <Logo8Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <polygon fill="#06b6d4" points="50,10 80,40 50,90 20,40" />
    <polygon fill="#22d3ee" points="50,10 80,40 50,40" opacity="0.8"/>
    <polygon fill="#67e8f9" points="50,10 20,40 50,40" opacity="0.6"/>
    <polygon fill="#a5f3fc" points="50,40 80,40 50,90" opacity="0.4"/>
    <polygon fill="#cffafe" points="50,40 20,40 50,90" opacity="0.3"/>
  </Logo8Svg>
);

// ==================== LOGO 9: Flèche/Direction ====================
const Logo9Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  &:hover { transform: translateX(10px); }
`;

const Logo9 = () => (
  <Logo9Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle fill="#f97316" cx="50" cy="50" r="45" />
    <path fill="#fff" d="M 30 50 L 55 50 L 55 35 L 75 50 L 55 65 L 55 50 Z" />
    <circle fill="#fb923c" cx="30" cy="50" r="8" />
  </Logo9Svg>
);

// ==================== LOGO 10: Goutte/Liquide ====================
const Logo10Svg = styled.svg`
  width: 80px;
  height: 80px;
  transition: all 0.3s ease;
  &:hover { transform: scale(1.1) rotate(-10deg); }
`;

const Logo10 = () => (
  <Logo10Svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g10" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#0891b2', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <path fill="url(#g10)"
      d="M 50 10 Q 70 30 70 55 Q 70 75 50 85 Q 30 75 30 55 Q 30 30 50 10 Z" />
    <ellipse fill="#fff" cx="45" cy="35" rx="8" ry="12" opacity="0.3"/>
  </Logo10Svg>
);

const LogoShowcase = () => {
  const logos = [
    { component: Logo1, name: "Design abstrait moderne", number: 1 },
    { component: Logo2, name: "Hexagone médical", number: 2 },
    { component: Logo3, name: "Onde/Signal vital", number: 3 },
    { component: Logo4, name: "Atome/Molécule", number: 4 },
    { component: Logo5, name: "Œil/Vision", number: 5 },
    { component: Logo6, name: "Bouclier/Protection", number: 6 },
    { component: Logo7, name: "Infini/Ruban", number: 7 },
    { component: Logo8, name: "Diamant/Cristal", number: 8 },
    { component: Logo9, name: "Flèche/Direction", number: 9 },
    { component: Logo10, name: "Goutte/Liquide", number: 10 }
  ];

  return (
    <ShowcaseContainer>
      {logos.map(({ component: LogoComponent, name, number }) => (
        <LogoCard key={number}>
          <LogoNumber>Logo #{number}</LogoNumber>
          <LogoComponent />
          <LogoName>{name}</LogoName>
        </LogoCard>
      ))}
    </ShowcaseContainer>
  );
};

export default LogoShowcase;
