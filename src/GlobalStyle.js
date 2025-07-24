// src/GlobalStyle.js - STYLES GLOBAUX RESPONSIVE COMPLETS
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ============ BASE STYLES AVEC SUPPORT MOBILE ============ */
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
    
    /* Classe pour empêcher le scroll quand le menu mobile est ouvert */
    &.menu-open {
      overflow: hidden;
      position: fixed;
      width: 100%;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      /* Améliore le rendu sur mobile */
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      /* Évite le bounce sur iOS */
      overscroll-behavior: none;
      /* Support pour les safe areas */
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  }

  html {
    scroll-behavior: smooth;
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      /* Fix pour les hauteurs sur mobile */
      height: -webkit-fill-available;
    }
  }
    
  /* ============ VARIABLES CSS POUR COMPATIBILITÉ ============ */
  :root {
    --background-color: ${props => props.theme.background};
    --header-background: ${props => props.theme.headerBackground};
    --text-color: ${props => props.theme.text};
    --border-color: ${props => props.theme.border};
    --button-background: ${props => props.theme.primary};
    --card-background: ${props => props.theme.card};
    --shadow: ${props => props.theme.shadow};
    
    /* Mobile variables */
    --mobile-padding: 1rem;
    --mobile-gap: 0.5rem;
    --touch-target: 44px;
  }

  /* ============ RESPONSIVE TYPOGRAPHY ============ */
  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.text};
    margin-bottom: 0.5rem;
    
    /* Mobile responsive typography */
    @media (max-width: 768px) {
      line-height: 1.3;
    }
  }

  h1 {
    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }

  h2 {
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }

  h3 {
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }

  p {
    color: ${props => props.theme.text};
    line-height: 1.6;
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      line-height: 1.5;
      font-size: 1rem;
    }
  }

  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.primaryHover};
    }
    
    /* Mobile touch optimization */
    @media (max-width: 768px) {
      min-height: var(--touch-target);
      display: inline-flex;
      align-items: center;
      touch-action: manipulation;
    }
  }

  /* ============ RESPONSIVE CARDS ============ */
  .card {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    box-shadow: 0 2px 4px ${props => props.theme.shadow};
    transition: all 0.3s ease;
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      border-radius: 12px;
      margin-bottom: 1rem;
      
      /* Réduit les ombres sur mobile pour de meilleures performances */
      box-shadow: 0 1px 3px ${props => props.theme.shadow};
    }
  }

  /* ============ RESPONSIVE INPUTS ============ */
  input, textarea, select {
    background-color: ${props => props.theme.card};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.border};
    border-radius: 4px;
    padding: 0.5rem;
    transition: all 0.2s ease;
    font-family: inherit;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.primary};
      box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 16px; /* Évite le zoom sur iOS */
      min-height: var(--touch-target);
      
      /* Améliore l'apparence sur mobile */
      -webkit-appearance: none;
      appearance: none;
    }
  }

  /* ============ RESPONSIVE BUTTONS ============ */
  button {
    font-family: inherit;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    border-radius: 4px;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    /* Mobile touch optimization */
    @media (max-width: 768px) {
      min-height: var(--touch-target);
      min-width: var(--touch-target);
      border-radius: 8px;
      touch-action: manipulation;
      
      /* Améliore la réactivité tactile */
      -webkit-tap-highlight-color: transparent;
    }
  }

  .btn-primary {
    background-color: ${props => props.theme.primary};
    color: white;
    padding: 0.75rem 1.5rem;

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.primaryHover};
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      width: 100%;
      
      /* Supprime l'effet hover sur mobile */
      &:hover {
        background-color: ${props => props.theme.primary};
      }
    }
  }

  .btn-secondary {
    background-color: ${props => props.theme.secondary};
    color: white;
    padding: 0.75rem 1.5rem;

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.secondaryHover};
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      width: 100%;
      
      &:hover {
        background-color: ${props => props.theme.secondary};
      }
    }
  }

  .btn-danger {
    background-color: ${props => props.theme.buttonDanger};
    color: white;
    padding: 0.75rem 1.5rem;

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.buttonDangerHover};
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      width: 100%;
      
      &:hover {
        background-color: ${props => props.theme.buttonDanger};
      }
    }
  }

  /* ============ RESPONSIVE UTILITIES ============ */
  .bg-gray-100 {
    background-color: ${props => props.theme.cardSecondary};
  }

  .text-gray-700 {
    color: ${props => props.theme.textSecondary};
  }

  .border-gray-300 {
    border-color: ${props => props.theme.border};
  }

  /* ============ RESPONSIVE SCROLLBARS ============ */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    
    /* Cache les scrollbars sur mobile */
    @media (max-width: 768px) {
      width: 0;
      height: 0;
    }
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.cardSecondary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.textLight};
    }
  }

  /* Firefox scrollbars */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme.border} ${props => props.theme.cardSecondary};
    
    /* Cache sur mobile */
    @media (max-width: 768px) {
      scrollbar-width: none;
    }
  }

  /* ============ RESPONSIVE QUESTIONNAIRES ============ */
  .questionnaire-card {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px ${props => props.theme.shadowMedium};
      border-color: ${props => props.theme.primary};
    }
    
    /* Mobile responsive */
    @media (max-width: 768px) {
      margin-bottom: 1rem;
      
      /* Supprime l'effet hover sur mobile */
      &:hover {
        box-shadow: 0 2px 4px ${props => props.theme.shadow};
        border-color: ${props => props.theme.border};
      }
    }
  }

  /* ============ RESPONSIVE ANIMATIONS ============ */
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
    
    /* Réduit les animations sur mobile pour de meilleures performances */
    @media (max-width: 768px) {
      animation: fadeIn 0.2s ease-out;
    }
  }

  /* ============ MOBILE CONTAINER CLASSES ============ */
  @media (max-width: 768px) {
    .container {
      padding: var(--mobile-padding);
    }
    
    .mobile-stack {
      display: flex;
      flex-direction: column;
      gap: var(--mobile-gap);
    }
    
    .mobile-full-width {
      width: 100% !important;
    }
    
    .mobile-hidden {
      display: none !important;
    }
  }

  /* ============ TABLET RESPONSIVE ============ */
  @media (min-width: 769px) and (max-width: 1024px) {
    .tablet-stack {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  }

  /* ============ MOBILE TOUCH OPTIMIZATIONS ============ */
  @media (max-width: 768px) {
    /* Améliore les interactions tactiles */
    button, a, [role="button"], .clickable {
      min-height: var(--touch-target);
      min-width: var(--touch-target);
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
    
    /* Évite la sélection de texte accidentelle */
    .no-select-mobile {
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    
    /* Améliore le scroll sur mobile */
    .mobile-scroll {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior: contain;
    }
  }

  /* ============ ACCESSIBILITY ============ */
  :focus-visible {
    outline: 2px solid ${props => props.theme.primary};
    outline-offset: 2px;
  }

  /* Augmente la zone de focus sur mobile */
  @media (max-width: 768px) {
    :focus-visible {
      outline-width: 3px;
      outline-offset: 3px;
    }
  }

  /* ============ TEXT SELECTION ============ */
  ::selection {
    background-color: ${props => props.theme.primary}30;
    color: ${props => props.theme.text};
  }

  /* ============ PRINT STYLES ============ */
  @media print {
    body {
      background: white !important;
      color: black !important;
    }
    
    .no-print {
      display: none !important;
    }
    
    /* Cache les éléments mobiles à l'impression */
    .mobile-only {
      display: none !important;
    }
  }

  /* ============ MOBILE VIEWPORT FIXES ============ */
  @media (max-width: 768px) {
    /* Fix pour les hauteurs sur mobile */
    .mobile-full-height {
      height: 100vh;
      height: -webkit-fill-available;
    }
    
    /* Fix pour le clavier virtuel */
    .mobile-input-container {
      padding-bottom: env(keyboard-inset-height, 0);
    }
    
    /* Support pour les safe areas iPhone */
    .mobile-safe-area {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
      padding-bottom: env(safe-area-inset-bottom);
    }
  }

  /* ============ RESPONSIVE UTILITIES ============ */
  /* Classes utilitaires pour mobile */
  .mobile-hidden {
    @media (max-width: 768px) {
      display: none !important;
    }
  }

  .mobile-only {
    display: none;
    
    @media (max-width: 768px) {
      display: block;
    }
  }

  .desktop-only {
    @media (max-width: 768px) {
      display: none !important;
    }
  }

  /* ============ MOBILE SAFE AREAS (iPhone X+) ============ */
  @media (max-width: 768px) {
    .mobile-safe-area {
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
      padding-bottom: env(safe-area-inset-bottom);
    }
    
    .mobile-safe-area-top {
      padding-top: env(safe-area-inset-top);
    }
  }

  /* ============ PERFORMANCE OPTIMIZATIONS ============ */
  @media (max-width: 768px) {
    /* Améliore les performances d'animation sur mobile */
    * {
      -webkit-transform: translateZ(0);
      transform: translateZ(0);
    }
    
    /* Réduit les transitions sur mobile */
    .reduced-motion {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* ============ FORM OPTIMIZATIONS ============ */
  @media (max-width: 768px) {
    /* Améliore les formulaires sur mobile */
    form {
      width: 100%;
    }
    
    .form-group {
      margin-bottom: 1rem;
    }
    
    .form-row {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .form-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1.5rem;
      
      button {
        width: 100%;
        order: -1; /* Met le bouton principal en premier */
        
        &.btn-secondary {
          order: 1; /* Met les boutons secondaires après */
        }
      }
    }
  }

  /* ============ MODAL OPTIMIZATIONS ============ */
  @media (max-width: 768px) {
    .modal {
      margin: 0;
      width: 100vw;
      height: 100vh;
      max-height: none;
      border-radius: 0;
      
      .modal-content {
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      .modal-header {
        position: sticky;
        top: 0;
        z-index: 1;
        background: inherit;
        border-bottom: 1px solid ${props => props.theme.border};
      }
      
      .modal-footer {
        position: sticky;
        bottom: 0;
        z-index: 1;
        background: inherit;
        border-top: 1px solid ${props => props.theme.border};
      }
    }
  }

  /* ============ NAVIGATION OPTIMIZATIONS ============ */
  @media (max-width: 768px) {
    .nav-tabs {
      display: flex;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
      
      .nav-item {
        flex-shrink: 0;
        min-width: fit-content;
      }
    }
    
    .breadcrumb {
      font-size: 0.875rem;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      white-space: nowrap;
      scrollbar-width: none;
      
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  /* ============ TABLE OPTIMIZATIONS ============ */
  @media (max-width: 768px) {
    .table-responsive {
      display: block;
      width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      
      table {
        min-width: 600px; /* Force une largeur minimum */
      }
      
      /* Style alternatif pour les petites tables */
      &.table-stack {
        table, thead, tbody, th, td, tr {
          display: block;
        }
        
        thead tr {
          position: absolute;
          top: -9999px;
          left: -9999px;
        }
        
        tr {
          border: 1px solid ${props => props.theme.border};
          margin-bottom: 0.5rem;
          border-radius: 8px;
          padding: 0.5rem;
        }
        
        td {
          border: none;
          position: relative;
          padding-left: 50% !important;
          
          &:before {
            content: attr(data-label) ": ";
            position: absolute;
            left: 6px;
            width: 45%;
            padding-right: 10px;
            white-space: nowrap;
            font-weight: bold;
          }
        }
      }
    }
  }

  /* ============ COMPONENT SPECIFIC OPTIMIZATIONS ============ */
  @media (max-width: 768px) {
    /* Cards en grille deviennent une colonne */
    .card-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    /* Sidebar devient un drawer mobile */
    .sidebar {
      position: fixed;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100vh;
      z-index: 9999;
      transition: left 0.3s ease;
      
      &.open {
        left: 0;
      }
    }
    
    /* Header mobile avec burger menu */
    .header-mobile {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      
      .burger-menu {
        display: flex;
        flex-direction: column;
        gap: 3px;
        cursor: pointer;
        
        span {
          width: 25px;
          height: 3px;
          background: currentColor;
          transition: all 0.3s ease;
        }
        
        &.active span:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }
        
        &.active span:nth-child(2) {
          opacity: 0;
        }
        
        &.active span:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }
      }
    }
  }

  /* ============ FINAL MOBILE POLISH ============ */
  @media (max-width: 768px) {
    /* Supprime les outline sur mobile pour une meilleure UX */
    button:focus,
    a:focus,
    input:focus,
    textarea:focus,
    select:focus {
      outline: none;
      box-shadow: 0 0 0 2px ${props => props.theme.primary}50;
    }
    
    /* Améliore le contraste pour mobile */
    .low-contrast {
      color: ${props => props.theme.text};
      opacity: 0.8;
    }
    
    /* Loading states optimisés pour mobile */
    .loading-spinner {
      width: 2rem;
      height: 2rem;
      border-width: 2px;
    }
    
    /* Tooltips adaptés pour mobile */
    .tooltip {
      font-size: 0.875rem;
      padding: 0.5rem 0.75rem;
      max-width: 200px;
      word-wrap: break-word;
    }
  }
`;

export default GlobalStyle;