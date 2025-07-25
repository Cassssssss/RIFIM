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

// NOUVEAU : Composant wrapper pour gérer la navigation dans les routes protégées
function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const navigate = useNavigate();

  // Gestion du thème - EXACTEMENT comme votre version originale
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  // Gestion de l'utilisateur - EXACTEMENT comme votre version originale
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    console.log('App.js: Vérification auth au démarrage', { 
      hasToken: !!token, 
      hasUsername: !!username,
      username 
    });
    
    if (token && username) {
      setUser({ token, username });
    }
  }, []);

  // Thème - EXACTEMENT comme votre version originale
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.documentElement.style.setProperty('--header-background', theme.headerBackground);
    document.documentElement.style.setProperty('--header-text', theme.headerText);
  }, [isDarkMode, theme]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', JSON.stringify(newMode));
  };

  // Login handler - EXACTEMENT comme votre version originale
  const handleLogin = (token, username) => {
    console.log('App.js: handleLogin appelé', { token: !!token, username });
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({ token, username });
  };

  // Logout handler - EXACTEMENT comme votre version originale  
  const handleLogout = () => {
    console.log('App.js: handleLogout appelé');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    // PAS de navigate ici pour éviter les boucles
  };

  const onDragEnd = (result) => {
    // Logique de drag and drop si nécessaire
  };

  // Si pas d'utilisateur, afficher Auth
  if (!user) {
    return (
      <ThemeProvider theme={theme}>
        <DragDropContext onDragEnd={onDragEnd}>
          <GlobalStyle />
          <div className={`app ${isDarkMode ? 'dark' : ''}`}>
            <Auth onLogin={handleLogin} />
          </div>
        </DragDropContext>
      </ThemeProvider>
    );
  }

  // Si utilisateur connecté, afficher l'app complète
  return (
    <ThemeProvider theme={theme}>
      <DragDropContext onDragEnd={onDragEnd}>
        <GlobalStyle />
        <div className={`app ${isDarkMode ? 'dark' : ''}`}>
          <Header 
            isDarkMode={isDarkMode} 
            toggleDarkMode={toggleDarkMode}
            userName={user?.username}
            onLogout={handleLogout}
          />
          <main className="container mt-8" style={{ paddingTop: '80px' }}>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Routes protégées */}
                <Route path="/" element={<PrivateRoute />}>
                  <Route index element={<Home />} />
                  
                  {/* Routes Questionnaires */}
                  <Route path="questionnaires" element={<QuestionnaireListPage />} />
                  <Route path="questionnaires-list" element={<QuestionnairePage />} />
                  <Route path="create" element={<QuestionnaireCreator />} />
                  <Route path="edit/:id" element={<QuestionnaireCreator />} />
                  <Route path="cr/:id" element={<QuestionnaireCRPage />} />
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
          </main>
        </div>
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