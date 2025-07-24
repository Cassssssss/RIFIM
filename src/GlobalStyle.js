// src/GlobalStyle.js - STYLES GLOBAUX AVEC ADAPTATION MOBILE COMPLÈTE
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /* ==================== RESET CSS ==================== */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ==================== BASE STYLES ==================== */
  html {
    font-size: 16px; /* Base desktop */
    scroll-behavior: smooth;
    height: 100%;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      font-size: 15px; /* Police légèrement plus petite sur tablettes */
    }
    
    @media (max-width: 480px) {
      font-size: 14px; /* Police plus petite sur très petits écrans */
    }
  }

  body {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden; /* Empêche le défilement horizontal */
    line-height: 1.6;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      line-height: 1.5; /* Ligne plus compacte sur mobile */
      
      /* Amélioration du rendu des polices sur mobile */
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      text-size-adjust: 100%;
    }
  }

  #root {
    height: 100%;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
    
  /* ==================== VARIABLES CSS POUR COMPATIBILITÉ ==================== */
  :root {
    --background-color: ${props => props.theme.background};
    --header-background: ${props => props.theme.headerBackground};
    --text-color: ${props => props.theme.text};
    --border-color: ${props => props.theme.border};
    --button-background: ${props => props.theme.primary};
    --card-background: ${props => props.theme.card};
    --shadow: ${props => props.theme.shadow};
    
    /* NOUVELLES VARIABLES POUR MOBILE */
    --mobile-padding: 1rem;
    --mobile-margin: 0.5rem;
    --touch-target-size: 44px;
    --mobile-border-radius: 8px;
    
    /* Safe area insets pour les appareils avec encoche */
    --safe-area-inset-top: env(safe-area-inset-top, 0);
    --safe-area-inset-right: env(safe-area-inset-right, 0);
    --safe-area-inset-bottom: env(safe-area-inset-bottom, 0);
    --safe-area-inset-left: env(safe-area-inset-left, 0);
  }

  /* ==================== TYPOGRAPHY RESPONSIVE ==================== */
  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.text};
    margin-bottom: 0.5rem;
    line-height: 1.3;
    font-weight: 600;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      line-height: 1.25;
      margin-bottom: 0.75rem;
    }
  }

  /* Tailles responsives pour les titres */
  h1 {
    font-size: 2.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.875rem; /* 30px */
    }
    
    @media (max-width: 480px) {
      font-size: 1.5rem; /* 24px */
    }
  }

  h2 {
    font-size: 2rem;
    
    @media (max-width: 768px) {
      font-size: 1.5rem; /* 24px */
    }
    
    @media (max-width: 480px) {
      font-size: 1.25rem; /* 20px */
    }
  }

  h3 {
    font-size: 1.75rem;
    
    @media (max-width: 768px) {
      font-size: 1.25rem; /* 20px */
    }
    
    @media (max-width: 480px) {
      font-size: 1.125rem; /* 18px */
    }
  }

  h4 {
    font-size: 1.5rem;
    
    @media (max-width: 768px) {
      font-size: 1.125rem; /* 18px */
    }
    
    @media (max-width: 480px) {
      font-size: 1rem; /* 16px */
    }
  }

  h5 {
    font-size: 1.25rem;
    
    @media (max-width: 768px) {
      font-size: 1rem; /* 16px */
    }
    
    @media (max-width: 480px) {
      font-size: 0.875rem; /* 14px */
    }
  }

  h6 {
    font-size: 1rem;
    
    @media (max-width: 768px) {
      font-size: 0.875rem; /* 14px */
    }
    
    @media (max-width: 480px) {
      font-size: 0.8rem; /* 12.8px */
    }
  }

  p {
    color: ${props => props.theme.text};
    line-height: 1.6;
    margin-bottom: 1rem;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      line-height: 1.5;
      margin-bottom: 0.75rem;
    }
  }

  /* ==================== LIENS RESPONSIVE ==================== */
  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.primaryHover};
    }
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      /* Augmente la zone tactile pour les liens */
      min-height: var(--touch-target-size);
      display: inline-flex;
      align-items: center;
      
      &:hover {
        /* Pas d'effet hover sur mobile, utiliser :active à la place */
        color: ${props => props.theme.primary};
      }
      
      &:active {
        color: ${props => props.theme.primaryHover};
        background-color: rgba(59, 130, 246, 0.1);
        border-radius: 4px;
      }
    }
  }

  /* ==================== CARTES RESPONSIVE ==================== */
  .card {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    box-shadow: 0 2px 4px ${props => props.theme.shadow};
    transition: all 0.3s ease;
    padding: 1.5rem;
    margin-bottom: 1rem;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      border-radius: var(--mobile-border-radius);
      padding: var(--mobile-padding);
      margin-bottom: var(--mobile-margin);
      box-shadow: 0 1px 3px ${props => props.theme.shadow}; /* Ombre plus subtile */
      
      /* Transition simplifiée sur mobile pour la performance */
      transition: box-shadow 0.2s ease;
    }
    
    &:hover {
      box-shadow: 0 4px 12px ${props => props.theme.shadow};
      
      @media (max-width: 768px) {
        /* Pas d'effet hover sur mobile */
        box-shadow: 0 1px 3px ${props => props.theme.shadow};
      }
    }
    
    &:active {
      @media (max-width: 768px) {
        /* Effet tactile sur mobile */
        transform: scale(0.98);
        box-shadow: 0 1px 2px ${props => props.theme.shadow};
      }
    }
  }

  /* ==================== INPUTS ET FORMULAIRES RESPONSIVE ==================== */
  input, textarea, select {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    border-radius: 6px;
    color: ${props => props.theme.text};
    padding: 0.75rem;
    transition: all 0.2s ease;
    font-family: inherit;
    width: 100%;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      padding: 1rem; /* Plus de padding pour faciliter la saisie */
      font-size: 16px; /* Empêche le zoom sur iOS */
      border-radius: var(--mobile-border-radius);
      min-height: var(--touch-target-size);
      
      /* Amélioration du focus sur mobile */
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }
    
    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary};
      box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
      
      @media (max-width: 768px) {
        /* Focus plus visible sur mobile */
        border-color: ${props => props.theme.primary};
        box-shadow: 0 0 0 2px ${props => props.theme.primary}66;
      }
    }
    
    &::placeholder {
      color: ${props => props.theme.textLight};
      opacity: 0.7;
    }
    
    &:disabled {
      background-color: ${props => props.theme.disabled};
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Spécifique aux textarea */
  textarea {
    resize: vertical;
    min-height: 100px;
    
    @media (max-width: 768px) {
      min-height: 80px;
      resize: none; /* Désactive le resize sur mobile */
    }
  }

  /* ==================== BOUTONS RESPONSIVE ==================== */
  button {
    background-color: ${props => props.theme.primary};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    font-size: 1rem;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      padding: 1rem 1.5rem; /* Plus de padding pour faciliter le touch */
      font-size: 1rem;
      border-radius: var(--mobile-border-radius);
      min-height: var(--touch-target-size);
      
      /* Amélioration tactile */
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }
    
    &:hover {
      background-color: ${props => props.theme.primaryHover};
      transform: translateY(-1px);
      
      @media (max-width: 768px) {
        /* Pas d'effet hover sur mobile */
        background-color: ${props => props.theme.primary};
        transform: none;
      }
    }
    
    &:active {
      transform: translateY(0);
      
      @media (max-width: 768px) {
        background-color: ${props => props.theme.primaryHover};
        transform: scale(0.98);
      }
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
      
      @media (max-width: 768px) {
        box-shadow: 0 0 0 2px ${props => props.theme.primary}66;
      }
    }
    
    &:disabled {
      background-color: ${props => props.theme.disabled};
      cursor: not-allowed;
      opacity: 0.6;
      
      &:hover {
        transform: none;
        background-color: ${props => props.theme.disabled};
      }
    }
  }

  /* Boutons secondaires */
  button.secondary {
    background-color: transparent;
    color: ${props => props.theme.primary};
    border: 1px solid ${props => props.theme.primary};
    
    &:hover {
      background-color: ${props => props.theme.primary};
      color: white;
      
      @media (max-width: 768px) {
        background-color: transparent;
        color: ${props => props.theme.primary};
      }
    }
    
    &:active {
      @media (max-width: 768px) {
        background-color: ${props => props.theme.primary};
        color: white;
      }
    }
  }

  /* Boutons danger */
  button.danger {
    background-color: #ef4444;
    
    &:hover {
      background-color: #dc2626;
      
      @media (max-width: 768px) {
        background-color: #ef4444;
      }
    }
    
    &:active {
      @media (max-width: 768px) {
        background-color: #dc2626;
      }
    }
  }

  /* ==================== CLASSES UTILITAIRES TAILWIND MODIFIÉES ==================== */
  .bg-gray-100 {
    background-color: ${props => props.theme.cardSecondary};
  }

  .text-gray-700 {
    color: ${props => props.theme.textSecondary};
  }

  .border-gray-300 {
    border-color: ${props => props.theme.border};
  }

  /* ==================== SCROLLBARS PERSONNALISÉES ==================== */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      width: 4px;
      height: 4px;
    }
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.cardSecondary};
    border-radius: 4px;
    
    @media (max-width: 768px) {
      background: transparent;
      border-radius: 2px;
    }
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.textLight};
    }
    
    @media (max-width: 768px) {
      background: ${props => props.theme.textLight};
      border-radius: 2px;
      
      &:hover {
        background: ${props => props.theme.textLight};
      }
    }
  }

  /* Firefox scrollbar */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme.border} ${props => props.theme.cardSecondary};
    
    @media (max-width: 768px) {
      scrollbar-width: none; /* Cache la scrollbar sur mobile */
    }
  }

  /* ==================== STYLES POUR LES QUESTIONNAIRES ==================== */
  .questionnaire-card {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    transition: all 0.3s ease;
    border-radius: 8px;
    padding: 1.5rem;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      padding: var(--mobile-padding);
      border-radius: var(--mobile-border-radius);
      transition: box-shadow 0.2s ease; /* Transition simplifiée */
    }

    &:hover {
      box-shadow: 0 4px 12px ${props => props.theme.shadowMedium};
      border-color: ${props => props.theme.primary};
      
      @media (max-width: 768px) {
        /* Pas d'effet hover sur mobile */
        box-shadow: none;
        border-color: ${props => props.theme.border};
      }
    }
    
    &:active {
      @media (max-width: 768px) {
        transform: scale(0.98);
        box-shadow: 0 2px 8px ${props => props.theme.shadowMedium};
      }
    }
  }

  /* ==================== ANIMATIONS RESPONSIVE ==================== */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-in {
    animation: fadeIn 0.3s ease-out;
    
    /* MOBILE ADAPTATIONS - Animations réduites */
    @media (max-width: 768px) {
      animation: fadeIn 0.15s ease-out;
    }
  }

  /* Respect des préférences utilisateur pour les mouvements */
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

  /* ==================== CLASSES UTILITAIRES MOBILE ==================== */
  
  /* Classes pour cacher/montrer sur mobile */
  .mobile-hidden {
    @media (max-width: 768px) {
      display: none !important;
    }
  }

  .mobile-only {
    display: none;
    
    @media (max-width: 768px) {
      display: block !important;
    }
  }

  .mobile-flex {
    display: none;
    
    @media (max-width: 768px) {
      display: flex !important;
    }
  }

  /* Grilles responsives */
  .responsive-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: var(--mobile-margin);
    }
  }

  .responsive-grid-2 {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: var(--mobile-margin);
    }
  }

  /* Flexbox utilitaires */
  .flex-mobile-column {
    display: flex;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: var(--mobile-margin);
    }
  }

  /* Padding et margin utilitaires */
  .mobile-padding {
    @media (max-width: 768px) {
      padding: var(--mobile-padding) !important;
    }
  }

  .mobile-margin {
    @media (max-width: 768px) {
      margin: var(--mobile-margin) !important;
    }
  }

  /* ==================== ACCESSIBILITÉ MOBILE ==================== */
  
  /* Focus visible amélioré */
  :focus-visible {
    outline: 2px solid ${props => props.theme.primary};
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* Touch targets améliorés */
  .touch-target {
    min-height: var(--touch-target-size);
    min-width: var(--touch-target-size);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Amélioration des zones tactiles */
  @media (max-width: 768px) {
    button, 
    a, 
    input[type="checkbox"], 
    input[type="radio"],
    select {
      min-height: var(--touch-target-size);
    }
    
    /* Suppression du highlight tactile par défaut */
    * {
      -webkit-tap-highlight-color: transparent;
    }
  }

  /* ==================== SAFE AREA POUR LES APPAREILS AVEC ENCOCHE ==================== */
  .safe-area-padding {
    padding-left: var(--safe-area-inset-left);
    padding-right: var(--safe-area-inset-right);
    padding-top: var(--safe-area-inset-top);
    padding-bottom: var(--safe-area-inset-bottom);
  }

  .safe-area-margin {
    margin-left: var(--safe-area-inset-left);
    margin-right: var(--safe-area-inset-right);
    margin-top: var(--safe-area-inset-top);
    margin-bottom: var(--safe-area-inset-bottom);
  }

  /* ==================== SÉLECTION DE TEXTE ==================== */
  ::selection {
    background-color: ${props => props.theme.primary}30;
    color: ${props => props.theme.text};
  }

  ::-moz-selection {
    background-color: ${props => props.theme.primary}30;
    color: ${props => props.theme.text};
  }

  /* ==================== ORIENTATIONS MOBILE ==================== */
  
  /* Adaptations pour le mode landscape sur mobile */
  @media (max-width: 768px) and (orientation: landscape) {
    html {
      font-size: 13px; /* Police plus petite en landscape */
    }
    
    .card {
      padding: calc(var(--mobile-padding) * 0.75); /* Padding réduit en landscape */
    }
    
    h1, h2, h3, h4, h5, h6 {
      margin-bottom: 0.5rem; /* Marges réduites en landscape */
    }
  }

  /* ==================== PRINT STYLES ==================== */
  @media print {
    body {
      background: white !important;
      color: black !important;
      font-size: 12pt;
      line-height: 1.4;
    }
    
    .no-print,
    .mobile-only,
    .mobile-flex {
      display: none !important;
    }
    
    .card {
      border: 1px solid #ccc !important;
      box-shadow: none !important;
      break-inside: avoid;
    }
    
    h1, h2, h3, h4, h5, h6 {
      break-after: avoid;
    }
    
    a {
      color: black !important;
      text-decoration: underline !important;
    }
    
    button {
      display: none !important;
    }
  }

  /* ==================== MODE SOMBRE SPÉCIFIQUE ==================== */
  
  /* Ajustements pour le mode sombre sur mobile */
  @media (max-width: 768px) {
    .dark & {
      /* Contraste amélioré sur mobile en mode sombre */
      color: #f8fafc;
    }
    
    .dark input,
    .dark textarea,
    .dark select {
      /* Bordures plus visibles en mode sombre sur mobile */
      border-color: #475569;
      
      &:focus {
        border-color: ${props => props.theme.primary};
        box-shadow: 0 0 0 2px ${props => props.theme.primary}66;
      }
    }
  }

  /* ==================== LEGACY STYLES MAINTENUS ==================== */
  u {
    text-decoration: underline;
  }
`;