import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import { themes, defaultStyleId } from './themes';
import GlobalStyle from './GlobalStyle';
import ThemeSwitcher from './components/ThemeSwitcher';
import Sidebar from './components/Sidebar';
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

// NOUVELLE PAGE STATISTIQUES
const StatisticsDashboardPage = lazy(() => import('./pages/StatisticsDashboardPage'));

// PAGE TEMPORAIRE POUR CHOISIR LE LOGO
const LogoShowcasePage = lazy(() => import('./pages/LogoShowcasePage'));

// NOUVEAU : Composant wrapper pour gérer la navigation dans les routes protégées
function AppContent() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [styleId, setStyleId] = useState(defaultStyleId);
  const [user, setUser] = useState(null);
  const styleObj = themes[styleId] || themes[defaultStyleId];
  const theme = isDarkMode ? styleObj.dark : styleObj.light;
  const navigate = useNavigate();

  // Gestion du thème - EXACTEMENT comme votre version originale
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme));
    }
    const savedStyle = localStorage.getItem('siteStyle');
    if (savedStyle && themes[savedStyle]) {
      setStyleId(savedStyle);
    }
  }, []);

  const changeStyle = (id) => {
    if (!themes[id]) return;
    setStyleId(id);
    localStorage.setItem('siteStyle', id);
  };

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

  // Thème - applique la classe dark + synchronise toutes les variables CSS
  // (Tailwind --color-*, polices, header) depuis le style actif.
  useEffect(() => {
    const root = document.documentElement;

    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Identifiant du style actif (pour les overrides CSS d'agencement).
    root.setAttribute('data-style', styleId);
    root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

    const setVar = (name, value) => root.style.setProperty(name, value);

    // Header
    setVar('--header-background', theme.headerBackground);
    setVar('--header-text', theme.headerText);

    // Polices (utilisées aussi par index.css via var())
    setVar('--app-font-body', theme.fonts.body);
    setVar('--app-font-heading', theme.fonts.heading);

    // Agencement (consommé par GlobalStyle : largeur, densité, titres).
    const L = theme.layout;
    setVar('--app-container-max', L.containerMax);
    setVar('--app-content-pad', L.contentPad);
    setVar('--app-font-scale', L.fontScale);
    setVar('--app-line-height', L.lineHeight);
    setVar('--app-heading-spacing', L.headingSpacing);
    setVar('--app-heading-transform', L.headingTransform);
    setVar('--app-heading-weight', L.headingWeight);

    // Couleurs Tailwind (rgb « r g b » consommé via rgb(var(--color-*)))
    const tw = theme.tw;
    setVar('--color-primary', tw.primary);
    setVar('--color-secondary', tw.secondary);
    setVar('--color-accent', tw.accent);
    setVar('--color-background', tw.background);
    setVar('--color-surface', tw.surface);
    setVar('--color-text', tw.text);
    setVar('--color-border', tw.border);
  }, [isDarkMode, theme, styleId]);

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
          <ThemeSwitcher currentStyle={styleId} onChangeStyle={changeStyle} isDarkMode={isDarkMode} />
        </DragDropContext>
      </ThemeProvider>
    );
  }

  // Si utilisateur connecté, afficher l'app complète
  return (
    <ThemeProvider theme={theme}>
      <DragDropContext onDragEnd={onDragEnd}>
        <GlobalStyle />
        {/* .app-shell réserve la place du rail (et de la barre mobile) à partir
            des variables publiées par Sidebar : aucune valeur en dur ici. */}
        <div className={`app app-shell ${isDarkMode ? 'dark' : ''}`}>
          <Sidebar
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            userName={user?.username}
            onLogout={handleLogout}
          />
          <main className="container">
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
                  
                  {/* NOUVELLE ROUTE STATISTIQUES */}
                  <Route path="statistics" element={<StatisticsDashboardPage />} />

                  {/* ROUTE TEMPORAIRE POUR CHOISIR LE LOGO */}
                  <Route path="logos" element={<LogoShowcasePage />} />

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
        <ThemeSwitcher currentStyle={styleId} onChangeStyle={changeStyle} isDarkMode={isDarkMode} />
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