import React from 'react';
import styled from 'styled-components';

const LogoSvg = styled.svg`
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;

  .shape-1 {
    fill: url(#gradient1);
  }

  .shape-2 {
    fill: url(#gradient2);
  }

  .shape-3 {
    fill: url(#gradient3);
  }

  &:hover {
    transform: rotate(180deg) scale(1.05);
  }
`;

const RifimLogo = () => {
  return (
    <LogoSvg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Dégradés modernes */}
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f093fb', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f5576c', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#4facfe', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#00f2fe', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Design abstrait moderne - 3 formes géométriques qui s'entrecroisent */}
      {/* Forme 1 - arc gauche */}
      <path
        className="shape-1"
        d="M 20 50 Q 20 20 50 20 L 50 35 Q 35 35 35 50 Q 35 65 50 65 L 50 80 Q 20 80 20 50 Z"
      />

      {/* Forme 2 - arc droit */}
      <path
        className="shape-2"
        d="M 80 50 Q 80 80 50 80 L 50 65 Q 65 65 65 50 Q 65 35 50 35 L 50 20 Q 80 20 80 50 Z"
      />

      {/* Forme 3 - cercle central */}
      <circle
        className="shape-3"
        cx="50"
        cy="50"
        r="15"
      />
    </LogoSvg>
  );
};

export default RifimLogo;
