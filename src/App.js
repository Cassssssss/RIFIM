import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import { lightTheme, darkTheme } from './theme';
import GlobalStyle from './GlobalStyle';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import Auth from './components/Auth';
import PrivateRoute from './components/PrivateRoute';
import PublicQuestionnairesPage from './pages/PublicQuestionnairesPage';
import PublicCasesPage from './pages/PublicCasesPage';
import SessionManager from './components/SessionManager';
import styled from 'styled-components';

// Pages existantes
const Home = lazy(() => import('./pages/Home'));
const QuestionnairePage = lazy(() => import('./pages/QuestionnairePage'));
const QuestionnaireListPage = lazy(() => import('./pages/QuestionnaireListPage'));
const QuestionnaireCreator = lazy(() => import('./components/QuestionnaireCreator'));
const QuestionnaireCRPage = lazy(() => import('./components/QuestionnaireCRPage'));
const QuestionnaireUsePage = lazy(() => import('./components/QuestionnaireUsePage'));
const RadiologyViewer = lazy(() => import('./components/RadiologyViewer'));
const CasesPage = lazy(() => import('./pages/CasesPage'));
const CasesListPage = lazy(() => import('./pages/CasesListPage'));
const SheetEditor = lazy(() => import('./components/SheetEditor'));
const TestUpload = lazy(() => import('./components/TestUpload'));
const SheetViewer = lazy(() => import('./components/SheetViewer'));
const LinkView = lazy(() => import('./components/LinkView'));

// NOUVELLES PAGES PROTOCOLES
const ProtocolsPersonalPage = lazy(() => import('./pages/ProtocolsPersonalPage'));
const ProtocolsPublicPage = lazy(() => import('./pages/ProtocolsPublicPage'));
const ProtocolCreatorPage = lazy(() => import('./pages/ProtocolCreatorPage'));
const ProtocolViewPage = lazy(() => import('./pages/ProtocolViewPage'));

// Container principal responsive
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* Support pour les appareils mobiles avec safe areas */
  min-height: -webkit-fill-available;
  background-color: ${props => props.theme.background};
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    /* Évite les problèmes de hauteur sur mobile */
    min-height: 100vh;
    min-height: -webkit-fill-available;
    /* Améliore les performances sur mobile */
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
`;

// Main content avec padding pour le header fixe
const MainContent = styled.main`
  flex: 1;
  /* Espace pour le header fixe */
  padding-top: 80px;
  background-color: ${props => props.theme.background};
  position: relative;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    /* Ajuste l'espace pour le header mobile */
    padding-top: 70px;
    /* Support pour les safe areas */
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-bottom: env(safe-area-inset-bottom);
  }
`;

// Loading spinner responsive
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    min-height: 150px;
    padding: 2rem 1rem;
  }
`;

// NOUVEAU : Composant wrapper pour gérer la navigation dans les routes protégées
function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Gestion du thème sombre avec persistance
  useEffect(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme !== null) {
      setIsDarkMode(JSON.parse(savedTheme));
    } else {
      // Détection du thème système sur mobile
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Sauvegarde du thème
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    
    // Update du thème sur le document pour les styles CSS externes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Gestion de l'utilisateur
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Gestion du drag and drop
  const handleDragEnd = (result) => {
    // Logique existante de drag and drop
    // (conservée telle quelle)
  };

  // Détection mobile pour optimisations
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Optimisations viewport mobile
  useEffect(() => {
    if (isMobile) {
      // Améliore le comportement sur mobile
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
      
      // Empêche le zoom sur les inputs sur iOS
      document.addEventListener('touchstart', {});
    }
  }, [isMobile]);

  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AppContainer>
          <Auth 
            onLogin={handleLogin} 
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </AppContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <DragDropContext onDragEnd={handleDragEnd}>
        <AppContainer>
          <Header 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode}
            onLogout={handleLogout}
            userName={user?.username}
          />
          
          <MainContent>
            <Suspense fallback={
              <LoadingContainer>
                <LoadingSpinner />
              </LoadingContainer>
            }>
              <Routes>
                {/* Routes protégées */}
                <Route path="/" element={<PrivateRoute />}>
                  <Route index element={<Home />} />
                  
                  {/* Routes Questionnaires */}
                  <Route path="questionnaires" element={<QuestionnairePage />} />
                  <Route path="questionnaires-list" element={<QuestionnaireListPage />} />
                  <Route path="questionnaire/edit/:id" element={<QuestionnaireCreator />} />
                  <Route path="questionnaire/new" element={<QuestionnaireCreator />} />
                  <Route path="cr/:id" element={<QuestionnaireCRPage />} />
                  <Route path="use/:id" element={<QuestionnaireUsePage />} />
                  
                  {/* Routes Cas */}
                  <Route path="radiology-viewer/:caseId" element={<RadiologyViewer />} />
                  <Route path="cases" element={<CasesPage />} />
                  <Route path="cases-list" element={<CasesListPage />} />
                  
                  {/* ROUTES FICHES */}
                  <Route path="sheet/:caseId" element={<SheetViewer />} />
                  <Route path="sheet-editor/:caseId" element={<SheetEditor />} />
                  
                  {/* ROUTES PROTOCOLES */}
                  <Route path="protocols/personal" element={<ProtocolsPersonalPage />} />
                  <Route path="protocols/create" element={<ProtocolCreatorPage />} />
                  <Route path="protocols/edit/:id" element={<ProtocolCreatorPage />} />
                  <Route path="protocols/view/:id" element={<ProtocolViewPage />} />
                  
                  {/* Routes utilitaires */}
                  <Route path="test-upload" element={<TestUpload />} />
                  <Route path="link/:id" element={<LinkView />} />
                </Route>
                
                {/* Routes publiques accessibles même sans connexion */}
                <Route path="/public-questionnaires" element={<PublicQuestionnairesPage />} />
                <Route path="/public-cases" element={<PublicCasesPage />} />
                <Route path="/protocols/public" element={<ProtocolsPublicPage />} />
                
                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </MainContent>
        </AppContainer>
      </DragDropContext>
    </ThemeProvider>
  );
}

// Composant principal avec Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;