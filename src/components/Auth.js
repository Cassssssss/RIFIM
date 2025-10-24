import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';

const AuthWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  padding: 2rem;
`;

const AuthContainer = styled.div`
  max-width: 400px;
  width: 100%;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const AuthTitle = styled.h1`
  font-size: 2rem;
  color: #1e3a8a;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const AuthSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #374151;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const AuthDescription = styled.p`
  color: #6b7280;
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
  color: #374151;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background-color: #f9fafb;
  color: #374151;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    background-color: white;
    box-shadow: 0 0 0 3px ${props => props.theme.focus};
  }
  
  &::placeholder {
    color: #9ca3af;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #5B7FBE 0%, #4A6BA8 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #6A8DCF 0%, #5B7FBE 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(91, 127, 190, 0.3);
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
  border-top: 1px solid #e5e7eb;
`;

const ToggleText = styled.p`
  color: #6b7280;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
  font-size: 0.9rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #eff6ff;
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
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
`;

const SuccessMessage = styled(MessageContainer)`
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
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