import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.background} 0%, ${props => props.theme.backgroundSecondary} 100%);
  padding: 2rem;
`;

const AuthContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  background: ${props => props.theme.card};
  border-radius: ${props => props.theme.radii.xl};
  box-shadow: ${props => props.theme.shadows.cardHover};
  border: 1px solid ${props => props.theme.border};
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const AuthTitle = styled.h1`
  font-size: 2rem;
  color: ${props => props.theme.primary};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const AuthSubtitle = styled.h2`
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
  border: 2px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.radii.button};
  background-color: ${props => props.theme.backgroundSecondary};
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
    console.error('Erreur:', error.response ? error.response.data : error.message);
    setError(
      error.response?.data?.message || 
      'Une erreur est survenue. Veuillez réessayer.'
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
      <AuthContainer>
        <AuthHeader>
          <AuthTitle>
            🩺 RIFIM
          </AuthTitle>
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
            ⚠️ {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            ✅ {success}
          </SuccessMessage>
        )}

        <AuthForm onSubmit={handleSubmit}>
          <InputGroup>
            <InputLabel>👤 Nom d'utilisateur</InputLabel>
            <Input
              type="text"
              placeholder="Votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
          </InputGroup>

          <InputGroup>
            <InputLabel>🔒 Mot de passe</InputLabel>
            <Input
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
                {isLogin ? '👤 Se connecter' : '➕ S\'inscrire'}
              </>
            )}
          </SubmitButton>
        </AuthForm>

        <ToggleSection>
          <ToggleText>
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
          </ToggleText>
          <ToggleButton onClick={toggleMode} disabled={loading}>
            {isLogin ? "➕ Créer un compte" : "👤 Se connecter"}
          </ToggleButton>
        </ToggleSection>
      </AuthContainer>
    </AuthWrapper>
  );
};

export default Auth;