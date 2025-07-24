// src/GlobalStyle.js - STYLES GLOBAUX OPTIMISÉS POUR MOBILE
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent; /* Supprime la surbrillance au tap sur mobile */
  }

  html {
    scroll-behavior: smooth;
    /* Empêche le zoom lors du focus sur les inputs sur iOS */
    -webkit-text-size-adjust: 100%;
    -moz-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
    text-size-adjust: 100%;
  }

  body {
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
    
    /* Optimisations mobile */
    -webkit-overflow-scrolling: touch;
    touch-action: manipulation; /* Améliore les performances tactiles */
    user-select: none; /* Empêche la sélection accidentelle */
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    
    /* Permet la sélection de texte uniquement où nécessaire */
    input, textarea, [contenteditable] {
      user-select: text;
      -webkit-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
    }
    
    /* Empêche le défilement élastique sur iOS */
    position: fixed;
    width: 100%;
    height: 100%;
    overflow: hidden;
    
    @media (min-width: 769px) {
      position: static;
      height: auto;
      overflow: visible;
    }
  }
    
  /* Variables CSS pour compatibilité */
  :root {
    --background-color: ${props => props.theme.background};
    --header-background: ${props => props.theme.headerBackground};
    --text-color: ${props => props.theme.text};
    --border-color: ${props => props.theme.border};
    --button-background: ${props => props.theme.primary};
    --card-background: ${props => props.theme.card};
    --shadow: ${props => props.theme.shadow};
    
    /* Variables pour les tailles tactiles */
    --touch-target-size: 44px; /* Taille minimum recommandée par Apple/Google */
    --mobile-padding: 1rem;
    --mobile-gap: 0.5rem;
  }

  /* Container principal pour gérer le défilement sur mobile */
  #root {
    height: 100vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    
    @media (min-width: 769px) {
      height: auto;
      overflow: visible;
    }
  }

  /* Styles pour les éléments de base */
  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.text};
    margin-bottom: 0.5rem;
    
    /* Responsive typography */
    @media (max-width: 768px) {
      font-size: ${props => props.fontSize ? `${props.fontSize * 0.85}rem` : 'inherit'};
      line-height: 1.2;
    }
  }

  h1 {
    font-size: 2.5rem;
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  h2 {
    font-size: 2rem;
    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }

  h3 {
    font-size: 1.5rem;
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }

  p {
    color: ${props => props.theme.text};
    line-height: 1.6;
    
    @media (max-width: 768px) {
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }

  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    transition: color 0.2s ease;
    
    /* Améliore la zone tactile */
    min-height: var(--touch-target-size);
    display: inline-flex;
    align-items: center;

    &:hover {
      color: ${props => props.theme.primaryHover};
    }
    
    &:active {
      opacity: 0.7;
    }
  }

  /* Styles pour les cartes - optimisées mobile */
  .card {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    border-radius: 12px;
    box-shadow: 0 2px 8px ${props => props.theme.shadow};
    transition: all 0.3s ease;
    
    @media (max-width: 768px) {
      border-radius: 8px;
      margin-bottom: var(--mobile-gap);
      box-shadow: 0 1px 4px ${props => props.theme.shadow};
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px ${props => props.theme.shadow};
      
      @media (max-width: 768px) {
        transform: none; /* Pas d'hover effect sur mobile */
      }
    }
  }

  /* Styles pour les inputs - optimisés mobile */
  input, textarea, select {
    background-color: ${props => props.theme.card};
    border: 2px solid ${props => props.theme.border};
    border-radius: 8px;
    padding: 0.75rem;
    color: ${props => props.theme.text};
    font-size: 1rem;
    transition: all 0.2s ease;
    width: 100%;
    min-height: var(--touch-target-size);
    
    /* Empêche le zoom sur iOS */
    @media (max-width: 768px) {
      font-size: 16px; /* Taille minimum pour éviter le zoom sur iOS */
      padding: 1rem;
      border-radius: 12px;
    }
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary};
      box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
    }
    
    &::placeholder {
      color: ${props => props.theme.textSecondary};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  /* Boutons optimisés pour mobile */
  button {
    background-color: ${props => props.theme.primary};
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: var(--touch-target-size);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    
    @media (max-width: 768px) {
      padding: 1rem 1.5rem;
      font-size: 16px; /* Évite le zoom sur iOS */
      border-radius: 12px;
      min-height: 48px;
    }
    
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.primaryHover};
      transform: translateY(-1px);
      
      @media (max-width: 768px) {
        transform: none; /* Pas d'effect hover sur mobile */
      }
    }
    
    &:active:not(:disabled) {
      transform: scale(0.98);
      background-color: ${props => props.theme.primaryActive || props.theme.primary};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
  }

  /* Scrollbars personnalisées */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    
    @media (max-width: 768px) {
      width: 4px;
      height: 4px;
    }
  }
  
  ::-webkit-scrollbar-track {
    background: ${props => props.theme.surface};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.primaryHover};
    }
  }

  /* Support pour Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme.primary} ${props => props.theme.surface};
  }

  /* Grilles responsive */
  .responsive-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: var(--mobile-gap);
      padding: var(--mobile-padding);
    }
  }

  /* Container responsive */
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    
    @media (max-width: 768px) {
      padding: 0 var(--mobile-padding);
    }
  }

  /* Classes utilitaires pour mobile */
  .mobile-hidden {
    @media (max-width: 768px) {
      display: none !important;
    }
  }
  
  .desktop-hidden {
    @media (min-width: 769px) {
      display: none !important;
    }
  }
  
  .mobile-full-width {
    @media (max-width: 768px) {
      width: 100% !important;
    }
  }
  
  .mobile-center {
    @media (max-width: 768px) {
      text-align: center;
    }
  }

  /* Amélioration des performances sur mobile */
  .gpu-accelerated {
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    will-change: transform;
  }

  /* Fix pour les modals sur mobile */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    
    @media (max-width: 768px) {
      padding: var(--mobile-padding);
    }
  }

  .modal-content {
    background: ${props => props.theme.card};
    border-radius: 12px;
    max-width: 90vw;
    max-height: 90vh;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    
    @media (max-width: 768px) {
      width: 100%;
      height: 100%;
      max-width: none;
      max-height: none;
      border-radius: 0;
    }
  }

  /* Optimisations spécifiques pour les images */
  img {
    max-width: 100%;
    height: auto;
    display: block;
    
    /* Améliore les performances de rendu */
    image-rendering: optimizeQuality;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  /* Tables responsive */
  table {
    width: 100%;
    border-collapse: collapse;
    
    @media (max-width: 768px) {
      font-size: 0.9rem;
    }
  }

  /* Amélioration de l'accessibilité */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* Focus visible amélioré */
  *:focus-visible {
    outline: 2px solid ${props => props.theme.primary};
    outline-offset: 2px;
  }

  /* Support pour les orientations */
  @media (orientation: landscape) and (max-height: 500px) {
    .mobile-landscape-adjust {
      padding: 0.5rem;
    }
  }
`;

export default GlobalStyle;