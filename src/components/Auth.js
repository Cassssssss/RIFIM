import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';
import RifimLogo from './shared/Logo';
import { FileText, FolderOpen, Activity } from 'lucide-react';

const Introduction = styled.section`
  color: ${props => props.theme.text};
  h2 {
    font-family: 'Fraunces', Georgia, serif;
    font-size: clamp(2.5rem, 4.5vw, 4rem);
    font-weight: 400;
    line-height: 1.12;
    letter-spacing: -0.045em;
    margin: 2.5rem 0 1.5rem;
  }
  > p { max-width: 360px; color: ${props => props.theme.textSecondary}; }
  @media (max-width: 800px) {
    h2 { font-size: 2.3rem; margin: 1.5rem 0 1rem; }
  }
`;
const AuthBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.05em;
`;
const Resources = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 2rem;
  span {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.7rem;
    border: 1px solid ${props => props.theme.border};
    border-radius: 999px;
    font-size: 0.75rem;
    color: ${props => props.theme.textSecondary};
  }
  svg { width: 14px; height: 14px; }
`;

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(340px, 0.9fr);
  align-items: center;
  gap: clamp(2rem, 6vw, 7rem);
  max-width: 1200px;
  margin: auto;
  padding: clamp(1.5rem, 5vw, 5rem);
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 520px;
  }

`;

const AuthContainer = styled.div`
  width: 100%;
  padding: clamp(1.5rem, 3vw, 2.75rem);
  background: ${props => props.theme.card};
  border-radius: ${props => props.theme.radii.xl};
  box-shadow: ${props => props.theme.shadows.card};
  border: 1px solid ${props => props.theme.border};

`;

const AuthHeader = styled.div`
  text-align: left;
  margin-bottom: 2rem;
`;


const AuthSubtitle = styled.h1`
  font-size: 1.5rem;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const AuthDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.4;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.radii.button};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.card};
    box-shadow: 0 0 0 3px ${props => props.theme.focus};
  }

  &::placeholder {
    color: ${props => props.theme.textLight};
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: ${props => props.theme.radii.button};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => props.theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.button};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ToggleSection = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const ToggleText = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.primary};
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: ${props => props.theme.radii.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

const MessageContainer = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ErrorMessage = styled(MessageContainer)`
  background-color: ${props => props.theme.errorLight};
  border: 1px solid ${props => props.theme.error};
  color: ${props => props.theme.error};
`;

const SuccessMessage = styled(MessageContainer)`
  background-color: ${props => props.theme.successLight};
  border: 1px solid ${props => props.theme.success};
  color: ${props => props.theme.success};
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid ${props => props.theme.buttonText};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

// Dans Auth.js, modifier la partie handleSubmit :

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  setSuccess('');
  
  try {
    let response;
    if (isLogin) {
      response = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username); // ← UTILISER response.data.username
      onLogin(response.data.token, response.data.username); // ← UTILISER response.data.username
      setSuccess('Connexion réussie ! Redirection...');
      setTimeout(() => navigate('/'), 1000);
    } else {
      response = await axios.post('/auth/register', { username, password });
      setSuccess('Inscription réussie ! Connexion automatique...');
      
      // Connexion automatique après inscription
      const loginResponse = await axios.post('/auth/login', { username, password });
      localStorage.setItem('token', loginResponse.data.token);
      localStorage.setItem('username', loginResponse.data.username); // ← UTILISER loginResponse.data.username
      onLogin(loginResponse.data.token, loginResponse.data.username); // ← UTILISER loginResponse.data.username
      setTimeout(() => navigate('/'), 1500);
    }
  } catch (error) {
    setError(
      !error.response
        ? 'Le serveur de connexion est injoignable. Veuillez réessayer lorsque la connexion au serveur est rétablie.'
        : error.response.data?.message || 'Une erreur est survenue. Veuillez réessayer.'
    );
  } finally {
    setLoading(false);
  }
};

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
  };

  return (
    <AuthWrapper>
      <Introduction>
        <AuthBrand><RifimLogo /> RIFIM</AuthBrand>
        <h2>Le savoir se construit.<br />Et se partage.</h2>
        <p>Un espace pour vos questionnaires, vos cas cliniques et vos protocoles d’imagerie.</p>
        <Resources>
          <span><FileText /> Questionnaires</span>
          <span><FolderOpen /> Cas cliniques</span>
          <span><Activity /> Protocoles</span>
        </Resources>
      </Introduction>
      <AuthContainer>
        <AuthHeader>
          <AuthSubtitle>
            {isLogin ? 'Connexion' : 'Inscription'}
          </AuthSubtitle>
          <AuthDescription>
            {isLogin 
              ? 'Connectez-vous pour accéder à vos questionnaires et cas médicaux'
              : 'Créez votre compte pour commencer à utiliser RIFIM'
            }
          </AuthDescription>
        </AuthHeader>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            {success}
          </SuccessMessage>
        )}

        <AuthForm onSubmit={handleSubmit}>
          <InputGroup>
            <InputLabel htmlFor="auth-username">Nom d'utilisateur</InputLabel>
            <Input
              id="auth-username"
              autoComplete="username"
              type="text"
              placeholder="Votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <InputLabel htmlFor="auth-password">Mot de passe</InputLabel>
            <Input
              id="auth-password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                {isLogin ? 'Connexion...' : 'Inscription...'}
              </>
            ) : (
              <>
                {isLogin ? 'Se connecter' : "S'inscrire"}
              </>
            )}
          </SubmitButton>
        </AuthForm>

        <ToggleSection>
          <ToggleText>
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
          </ToggleText>
          <ToggleButton onClick={toggleMode} disabled={loading}>
            {isLogin ? "Créer un compte" : "Se connecter"}
          </ToggleButton>
        </ToggleSection>
      </AuthContainer>
    </AuthWrapper>
  );
};

export default Auth;
