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

// NOUVEAU : Container principal avec adaptation mobile
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    overflow-x: hidden; /* Empêche le défilement horizontal */
  }
`;

// NOUVEAU : Main content avec padding pour le header fixe
const MainContent = styled.main`
  flex: 1;
  padding-top: 80px; /* Espace pour le header fixe */
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 80px);
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding-top: 70px; /* Header plus petit sur mobile */
    min-height: calc(100vh - 70px);
    overflow-x: hidden; /* Empêche le défilement horizontal */
  }
  
  @media (max-width: 480px) {
    padding-top: 65px; /* Encore plus petit sur très petits écrans */
    min-height: calc(100vh - 65px);
  }
`;

// NOUVEAU : Loading wrapper responsive
const LoadingWrapper = styled.div`
  display: flex;  
  justify-content: center;
  align-items: center;
  min-height: 200px;
  padding: 2rem;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    min-height: 150px;
    padding: 1rem;
  }
`;

// NOUVEAU : Composant wrapper pour gérer la navigation dans les routes protégées
function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Détecter la préférence système sur mobile
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  // Sauvegarder le thème
  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Mettre à jour la classe sur le body pour les styles CSS globaux
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Charger l'utilisateur sauvegardé
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Écouter les changements de préférence système (uniquement si pas de préférence sauvegardée)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e) => setIsDarkMode(e.matches);
      
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Redirection vers la page de connexion sera gérée par PrivateRoute
  };

  // Handler pour drag & drop (garder la compatibilité existante)
  const onDragEnd = (result) => {
    // Logique de drag & drop existante si nécessaire
    console.log('Drag ended:', result);
  };

  // NOUVEAU : Composant Loading responsive
  const ResponsiveLoading = () => (
    <LoadingWrapper>
      <LoadingSpinner />
    </LoadingWrapper>
  );

  return (
    <ThemeProvider theme={theme}>
      <AppContainer>
        <GlobalStyle />
        <DragDropContext onDragEnd={onDragEnd}>
          {/* Header fixe */}
          <Header
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            user={user}
            onLogout={handleLogout}
          />

          {/* Contenu principal avec padding pour le header fixe */}
          <MainContent>
            <Suspense fallback={<ResponsiveLoading />}>
              <Routes>
                {/* Route de connexion */}
                <Route 
                  path="/login" 
                  element={
                    user ? 
                    <Navigate to="/" replace /> : 
                    <Auth onLogin={handleLogin} />
                  } 
                />
                
                {/* Routes protégées */}
                <Route path="/" element={<PrivateRoute user={user} />}>
                  <Route index element={<Home />} />
                  <Route path="questionnaires" element={<QuestionnaireListPage />} />
                  <Route path="questionnaire/:id" element={<QuestionnairePage />} />
                  <Route path="questionnaire-creator" element={<QuestionnaireCreator />} />
                  <Route path="questionnaire-creator/:id" element={<QuestionnaireCreator />} />
                  <Route path="questionnaire-cr/:id" element={<QuestionnaireCRPage />} />
                  <Route path="use/:id" element={<QuestionnaireUsePage />} />
                  
                  {/* Routes Cas */}
                  <Route path="radiology-viewer/:caseId" element={<RadiologyViewer />} />
                  <Route path="cases" element={<CasesPage />} />
                  <Route path="cases-list" element={<CasesListPage />} />
                  
                  {/* ROUTES FICHES - CORRIGÉES */}
                  <Route path="sheet/:caseId" element={<SheetViewer />} />
                  <Route path="sheet-editor/:caseId" element={<SheetEditor />} />
                  
                  {/* NOUVELLES ROUTES PROTOCOLES */}
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
        </DragDropContext>

        {/* Session manager pour la déconnexion automatique */}
        {/* Décommenté si vous voulez la déconnexion par inactivité */}
        {/* <SessionManager /> */}
      </AppContainer>
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