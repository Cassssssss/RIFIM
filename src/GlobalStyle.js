// src/GlobalStyle.js - STYLES GLOBAUX CORRIGÉS
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
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
  }

  html {
    scroll-behavior: smooth;
  }
    
  // Variables CSS pour compatibilité
  :root {
    --background-color: ${props => props.theme.background};
    --header-background: ${props => props.theme.headerBackground};
    --text-color: ${props => props.theme.text};
    --border-color: ${props => props.theme.border};
    --button-background: ${props => props.theme.primary};
    --card-background: ${props => props.theme.card};
    --shadow: ${props => props.theme.shadow};
  }

  // Styles pour les éléments de base
  h1, h2, h3, h4, h5, h6 {
    color: ${props => props.theme.text};
    margin-bottom: 0.5rem;
  }

  p {
    color: ${props => props.theme.text};
    line-height: 1.6;
  }

  a {
    color: ${props => props.theme.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: ${props => props.theme.primaryHover};
    }
  }

  // Styles pour les cartes
  .card {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    box-shadow: 0 2px 4px ${props => props.theme.shadow};
    transition: all 0.3s ease;
  }

  // Styles pour les inputs
  input, textarea, select {
    background-color: ${props => props.theme.inputBackground || props.theme.card};
    color: ${props => props.theme.inputText || props.theme.text};
    border: 1px solid ${props => props.theme.border};
    border-radius: 4px;
    padding: 0.5rem;
    font-family: inherit;
    font-size: 0.9rem;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${props => props.theme.borderFocus};
      box-shadow: 0 0 0 2px ${props => props.theme.focus};
    }

    &::placeholder {
      color: ${props => props.theme.textLight};
    }
  }

  select {
    cursor: pointer;
    
    option {
      background-color: ${props => props.theme.inputBackground || props.theme.card};
      color: ${props => props.theme.inputText || props.theme.text};
    }
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  // Styles pour les boutons
  .btn {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background-color: ${props => props.theme.primaryHover};
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background-color: ${props => props.theme.disabled};
      cursor: not-allowed;
      transform: none;
    }
  }

  .btn-secondary {
    background-color: ${props => props.theme.buttonSecondary};
    color: ${props => props.theme.buttonSecondaryText};
    border: 1px solid ${props => props.theme.border};

    &:hover {
      background-color: ${props => props.theme.hover};
    }
  }

  .btn-danger {
    background-color: ${props => props.theme.buttonDanger};
    color: ${props => props.theme.textInverse};

    &:hover {
      background-color: ${props => props.theme.buttonDangerHover};
    }
  }

  // Classes utilitaires Tailwind
  .bg-gray-100 {
    background-color: ${props => props.theme.cardSecondary};
  }

  .text-gray-700 {
    color: ${props => props.theme.textSecondary};
  }

  .border-gray-300 {
    border-color: ${props => props.theme.border};
  }

  // Scrollbars personnalisées
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
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

  // Styles pour les questionnaires
  .questionnaire-card {
    background-color: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 4px 12px ${props => props.theme.shadowMedium};
      border-color: ${props => props.theme.primary};
    }
  }

  // Animations
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
  }

  // Responsive
  @media (max-width: 768px) {
    body {
      font-size: 14px;
    }
    
    .container {
      padding: 1rem;
    }
  }

  // Focus visible pour l'accessibilité
  :focus-visible {
    outline: 2px solid ${props => props.theme.primary};
    outline-offset: 2px;
  }

  // Sélection de texte
  ::selection {
    background-color: ${props => props.theme.primary}30;
    color: ${props => props.theme.text};
  }

  // Print styles
  @media print {
    body {
      background: white !important;
      color: black !important;
    }
    
    .no-print {
      display: none !important;
    }
  }
`;

export default GlobalStyle;