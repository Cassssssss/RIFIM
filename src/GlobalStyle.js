import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
    font-family: 'Poppins', sans-serif;
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
`;





export default GlobalStyle;