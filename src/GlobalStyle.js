// src/GlobalStyle.js - VERSION CORRIGÉE AVEC HEADER PLUS FONCÉ
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ============ BASE STYLES ============ */
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
    
    &.menu-open {
      overflow: hidden;
      position: fixed;
      width: 100%;
    }
    
    @media (max-width: 768px) {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      overscroll-behavior: none;
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
  }

  html {
    scroll-behavior: smooth;
    
    @media (max-width: 768px) {
      height: -webkit-fill-available;
    }
  }
    
  /* ============ VARIABLES CSS ============ */
  :root {
    --background-color: ${props => props.theme.background};
    --header-background: ${props => props.theme.headerBackground};
    --text-color: ${props => props.theme.text};
    --border-color: ${props => props.theme.border};
    --button-background: ${props => props.theme.primary};
    --card-background: ${props => props.theme.card};
    --shadow: ${props => props.theme.shadow};
    
    --mobile-padding: 1rem;
    --mobile-gap: 0.5rem;
    --touch-target: 44px;
  }

  /* ============ TYPOGRAPHY ============ */
  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.text};
    margin-bottom: 0.5rem;
    
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
    
    @media (max-width: 768px) {
      min-height: var(--touch-target);
      display: inline-flex;
      align-items: center;
      touch-action: manipulation;
    }
  }

  /* ============ CARDS ============ */
  .card {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    box-shadow: 0 2px 4px ${props => props.theme.shadow};
    transition: all 0.3s ease;
    
    @media (max-width: 768px) {
      border-radius: 12px;
      margin-bottom: 1rem;
      box-shadow: 0 1px 3px ${props => props.theme.shadow};
    }
  }

  /* ============ INPUTS ============ */
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
    
    @media (max-width: 768px) {
      padding: 0.75rem;
      border-radius: 8px;
      font-size: 16px;
      min-height: var(--touch-target);
      -webkit-appearance: none;
      appearance: none;
    }
  }

  /* ============ BUTTONS SOBRES ET ÉLÉGANTS ============ */
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
    
    @media (max-width: 768px) {
      min-height: var(--touch-target);
      min-width: var(--touch-target);
      border-radius: 8px;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }
  }

  /* 🎨 NOUVEAU : Boutons principaux sobres */
  .btn-primary {
    background-color: ${props => props.theme.card};
    color: ${props => props.theme.text};
    border: 1.5px solid ${props => props.theme.border};
    padding: 0.65rem 1.25rem;
    font-weight: 500;
    box-shadow: 0 1px 3px ${props => props.theme.shadow};

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.primary};
      color: white;
      border-color: ${props => props.theme.primary};
      transform: translateY(-1px);
      box-shadow: 0 2px 6px ${props => props.theme.shadow};
    }
    
    @media (max-width: 768px) {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      width: 100%;
      
      &:hover {
        transform: none;
        background-color: ${props => props.theme.primary};
      }
    }
  }

  /* 🎨 NOUVEAU : Boutons secondaires sobres */
  .btn-secondary {
    background-color: transparent;
    color: ${props => props.theme.textSecondary};
    border: 1.5px solid ${props => props.theme.border};
    padding: 0.65rem 1.25rem;
    font-weight: 500;

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.hover};
      color: ${props => props.theme.text};
      border-color: ${props => props.theme.textSecondary};
    }
    
    @media (max-width: 768px) {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      width: 100%;
      
      &:hover {
        background-color: ${props => props.theme.hover};
      }
    }
  }

  /* 🎨 NOUVEAU : Boutons de suppression sobres */
  .btn-danger {
    background-color: transparent;
    color: ${props => props.theme.textLight};
    border: 1.5px solid ${props => props.theme.borderLight};
    padding: 0.65rem 1.25rem;
    font-weight: 500;

    &:hover:not(:disabled) {
      background-color: ${props => props.theme.errorLight};
      color: ${props => props.theme.error};
      border-color: ${props => props.theme.error};
    }
    
    @media (max-width: 768px) {
      padding: 1rem 1.5rem;
      font-size: 1rem;
      width: 100%;
      
      &:hover {
        background-color: ${props => props.theme.errorLight};
      }
    }
  }

  /* ============ UTILITIES ============ */
  .bg-gray-100 {
    background-color: ${props => props.theme.cardSecondary};
  }

  .text-gray-700 {
    color: ${props => props.theme.textSecondary};
  }

  .border-gray-300 {
    border-color: ${props => props.theme.border};
  }

  /* ============ SCROLLBARS ============ */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    
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

  * {
    scrollbar-width: thin;
    scrollbar-color: ${props => props.theme.border} ${props => props.theme.cardSecondary};
    
    @media (max-width: 768px) {
      scrollbar-width: none;
    }
  }

  /* ============ QUESTIONNAIRES ============ */
  .questionnaire-card {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px ${props => props.theme.shadowMedium};
      border-color: ${props => props.theme.primary};
    }
    
    @media (max-width: 768px) {
      margin-bottom: 1rem;
      
      &:hover {
        box-shadow: 0 2px 4px ${props => props.theme.shadow};
        border-color: ${props => props.theme.border};
      }
    }
  }

  /* ============ ANIMATIONS ============ */
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

  @keyframes slideIn {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* ============ LOADING STATES ============ */
  .loading {
    animation: spin 1s linear infinite;
  }

  .fade-in {
    animation: fadeIn 0.3s ease-in;
  }

  .slide-in {
    animation: slideIn 0.3s ease-out;
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
    
    .mobile-only {
      display: none !important;
    }
  }

  /* ============ MOBILE UTILITIES ============ */
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

  /* ============ FORM OPTIMIZATIONS ============ */
  @media (max-width: 768px) {
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
        order: -1;
        
        &.btn-secondary {
          order: 1;
        }
      }
    }
  }
`;

export default GlobalStyle;