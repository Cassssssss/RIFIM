import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-family: 'Poppins', sans-serif;
  }
    
  :root {
    --background-color: ${props => props.theme.background || '#F0F2F5'};
    --header-background: ${props => props.theme.headerBackground || '#4a69bd'};
    --text-color: ${props => props.theme.text || '#333'};
    --border-color: ${props => props.theme.border || '#E4E6E8'};
    --button-background: ${props => props.theme.primary || '#4a69bd'};
  }


  [data-theme="dark"] {
    --background-color: #181c2e;
    --header-background: #1f2335;
    --text-color: #fff;
    --border-color: #2a2a3e;
  }
  .card {
    background-color: ${props => props.theme.card};
    border-color: ${props => props.theme.border};
  }

  input, textarea, select {
    background-color: ${props => props.theme.inputBackground};
    color: ${props => props.theme.inputText};
    border-color: ${props => props.theme.border};
  }

  select {
    background-color: ${props => props.theme.inputBackground};
    color: ${props => props.theme.inputText};
    border-color: ${props => props.theme.border};
    padding: 0.5rem;
    border-radius: 4px;
    width: 100%;
  }

  textarea {
    background-color: ${props => props.theme.inputBackground};
    color: ${props => props.theme.inputText};
    border: 1px solid ${props => props.theme.border};
    padding: 0.5rem;
    border-radius: 4px;
    width: 100%;
    min-height: 100px;
    font-family: inherit;
  }

  .btn {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
  }

  .btn:hover {
    background-color: ${props => props.theme.secondary};
  }

  h2, h3 {
    color: ${props => props.theme.text};
  }

  .bg-gray-100 {
    background-color: ${props => props.theme.card};
  }

  .dark .bg-gray-100 {
    background-color: ${props => props.theme.questionBackground};
  }

  .questionnaire-option {
    color: ${props => props.theme.questionnaireOptionText};
  }

  h3, span, label, input, textarea {
    color: inherit;
  }

.link-button {
    padding: 0.25rem 0.75rem;
    background-color: #ebf5ff;
    color: #3b82f6;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.2s;
  }

  .link-button:hover {
    background-color: #dbeafe;
    color: #2563eb;
  }

    html {
    font-size: 16px;
    
    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

 body {
    background-color: var(--background-color);
    color: var(--text-color);
    margin: 0;
    padding: 0;
  }

  .card {
    @media (max-width: 768px) {
      margin: 0.5rem;
      padding: 0.5rem;
    }
  }

  input, select, textarea {
    @media (max-width: 768px) {
      font-size: 16px !important; // Empêche le zoom sur iOS
      max-width: 100%;
    }
  }

  .btn {
    @media (max-width: 768px) {
      padding: 0.5rem 1rem;
      width: 100%;
      margin-bottom: 0.5rem;
    }
  }
`;



export default GlobalStyle;