import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';
import Icon, { IconWithText, StatusIcon } from './Icons';

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, ${props => props.theme.primary}15, ${props => props.theme.secondary}15);
  padding: 2rem;
`;

const AuthContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
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
  gap: 0.75rem;
`;

const AuthSubtitle = styled.h2`
  font-size: 1.25rem;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const AuthDescription = styled.p`
  color: ${props => props.theme.text};
  opacity: 0.7;
  font-size: 0.9rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
  border: 2px solid ${props => props.theme.inputBorder || props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.inputBackground || props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.text};
    opacity: 0.5;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.text};
  opacity: 0.5;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.secondary};
    transform: translateY(-2px);
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
  color: ${props => props.theme.text};
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0 auto;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.primary}10;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #FEF2F2;
  border: 1px solid #FECACA;
  border-radius: 8px;
  color: #DC2626;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #F0FDF4;
  border: 1px solid #BBF7D0;
  border-radius: 8px;
  color: #16A34A;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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
        onLogin(response.data.token, username);
        setSuccess('Connexion réussie ! Redirection...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        response = await axios.post('/auth/register', { username, password });
        setSuccess('Inscription réussie ! Connexion automatique...');
        
        // Connexion automatique après inscription
        const loginResponse = await axios.post('/auth/login', { username, password });
        localStorage.setItem('token', loginResponse.data.token);
        onLogin(loginResponse.data.token, username);
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
            <Icon name="stethoscope" size="lg" />
            RIFIM
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
            <StatusIcon status="error" />
            {error}
          </ErrorMessage>
        )}

        {success && (
          <SuccessMessage>
            <StatusIcon status="success" />
            {success}
          </SuccessMessage>
        )}

        <AuthForm onSubmit={handleSubmit}>
          <InputGroup>
            <InputLabel>
              <Icon name="user" size="sm" />
              Nom d'utilisateur
            </InputLabel>
            <div style={{ position: 'relative' }}>
              <InputIcon>
                <Icon name="user" size="sm" />
              </InputIcon>
              <Input
                type="text"
                placeholder="Votre nom d'utilisateur"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </InputGroup>

          <InputGroup>
            <InputLabel>
              <Icon name="lock" size="sm" />
              Mot de passe
            </InputLabel>
            <div style={{ position: 'relative' }}>
              <InputIcon>
                <Icon name="lock" size="sm" />
              </InputIcon>
              <Input
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
          </InputGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? (
              <>
                <Icon name="refresh" size="sm" className="animate-spin" />
                {isLogin ? 'Connexion...' : 'Inscription...'}
              </>
            ) : (
              <>
                <Icon name={isLogin ? 'user' : 'plus'} size="sm" />
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
            <Icon name={isLogin ? 'plus' : 'user'} size="sm" />
            {isLogin ? "Créer un compte" : "Se connecter"}
          </ToggleButton>
        </ToggleSection>
      </AuthContainer>
    </AuthWrapper>
  );
};

export default Auth;