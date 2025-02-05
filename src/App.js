import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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
  //Si on veut ajouter la déconnexion par inactivité , ajouter <SessionManager /> au trou ligne 76, 
  //mais j'ai l'impression que si on ouvre plusieurs fenetre en meme temps, 
  // si on est inactif sur une fenetre, on sera deconnecté sur toutes les fenetres.


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

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const theme = isDarkMode ? darkTheme : lightTheme;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
      setUser({ token, username });
    }
  }, []);

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
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleLogin = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser({ token, username });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
  };

  return (
    <ThemeProvider theme={theme}>
    <GlobalStyle />
    <SessionManager /> 
      <DragDropContext onDragEnd={() => {}}>
        <Router>
          <div className={`app ${isDarkMode ? 'dark' : ''}`}>
            <Header 
              isDarkMode={isDarkMode} 
              toggleDarkMode={toggleDarkMode}
              user={user}
              onLogout={handleLogout}
            />
            <main className="container mt-8">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/login" element={<Auth onLogin={handleLogin} />} />
                  <Route path="/" element={<PrivateRoute />}>
                    <Route index element={<Home />} />
                    <Route path="questionnaires" element={<QuestionnaireListPage />} />
                    <Route path="questionnaires-list" element={<QuestionnairePage />} />
                    <Route path="create" element={<QuestionnaireCreator />} />
                    <Route path="edit/:id" element={<QuestionnaireCreator />} />
                    <Route path="cr/:id" element={<QuestionnaireCRPage />} />
                    <Route path="use/:id" element={<QuestionnaireUsePage />} />
                    <Route path="radiology-viewer/:caseId" element={<RadiologyViewer />} />
                    <Route path="cases" element={<CasesPage />} />
                    <Route path="cases-list" element={<CasesListPage />} />
                  </Route>
                  <Route path="*" element={<Navigate to="/" replace />} />
                  <Route path="/sheet/:caseId" element={<SheetViewer />} />
                  <Route path="/create-sheet/:caseId" element={<SheetEditor />} />
                  <Route path="/test-upload" element={<TestUpload />} />
                  <Route path="/public-questionnaires" element={<PublicQuestionnairesPage />} />
                  <Route path="/public-cases" element={<PublicCasesPage />} />
                  <Route 
                    path="questionnaire/:questionnaireId/link/:elementId/:linkIndex" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <LinkView />
                      </Suspense>
                    } 
                  />
                </Routes>
              </Suspense>
            </main>
          </div>
        </Router>
      </DragDropContext>
    </ThemeProvider>
  );
}

export default App;