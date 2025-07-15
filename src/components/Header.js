import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Icon, { IconWithText } from './Icons'; // Import de notre nouveau système d'icônes

const HeaderWrapper = styled.header`
  background-color: ${props => props.theme.headerBackground};
  color: ${props => props.theme.headerText};
  padding: 1rem 0;
  width: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 2500px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.headerText};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.headerText};
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.headerText};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const CenterTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${props => props.theme.headerText};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.headerText};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MenuDropdown = styled.div`
  position: absolute;
  right: 2rem;
  top: 4rem;
  background-color: ${props => props.theme.headerBackground};
  border: 1px solid ${props => props.theme.headerText};
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.headerText};
  margin-right: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.headerText};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const MobileMenu = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const NavLinks = styled.div`
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: ${props => props.theme.headerBackground};
    flex-direction: column;
    padding: 1rem;
    border-top: 1px solid ${props => props.theme.headerText};
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  color: ${props => props.theme.headerText};
  border-radius: 4px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

function Header({ isDarkMode, toggleDarkMode, user, onLogout }) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonction pour obtenir le titre de la page basé sur l'URL
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return { title: 'Accueil', icon: 'home' };
    if (path === '/questionnaires') return { title: 'Mes Questionnaires', icon: 'checklist' };
    if (path === '/questionnaires-list') return { title: 'Questionnaires', icon: 'checklist' };
    if (path === '/create') return { title: 'Créer un Questionnaire', icon: 'plus' };
    if (path.includes('/edit/')) return { title: 'Modifier le Questionnaire', icon: 'edit' };
    if (path.includes('/cr/')) return { title: 'Compte Rendu', icon: 'document' };
    if (path.includes('/use/')) return { title: 'Utiliser le Questionnaire', icon: 'checklist' };
    if (path === '/cases') return { title: 'Mes Cas', icon: 'folder' };
    if (path === '/cases-list') return { title: 'Liste des Cas', icon: 'folder' };
    if (path === '/public-questionnaires') return { title: 'Questionnaires Publics', icon: 'book-open' };
    if (path === '/public-cases') return { title: 'Cas Publics', icon: 'folder-open' };
    return { title: 'RIFIM', icon: 'stethoscope' };
  };

  const currentPage = getPageTitle();

  return (
    <HeaderWrapper>
      <HeaderContent>
        {/* Logo avec icône médicale */}
        <Logo to="/">
          <Icon name="stethoscope" size="lg" />
          RIFIM
        </Logo>

        {/* Titre central avec icône de page */}
        <CenterTitle>
          <Icon name={currentPage.icon} size="md" />
          {currentPage.title}
        </CenterTitle>

        {/* Navigation principale pour desktop */}
        <Nav className="hidden md:flex">
          <NavLink to="/questionnaires">
            <IconWithText iconName="checklist" iconSize="sm">
              Mes CR
            </IconWithText>
          </NavLink>
          
          <NavLink to="/cases">
            <IconWithText iconName="folder" iconSize="sm">
              Mes Cas
            </IconWithText>
          </NavLink>
          
          <NavLink to="/public-questionnaires">
            <IconWithText iconName="book-open" iconSize="sm">
              CR Publics
            </IconWithText>
          </NavLink>
          
          <NavLink to="/public-cases">
            <IconWithText iconName="folder-open" iconSize="sm">
              Cas Publics
            </IconWithText>
          </NavLink>

          {/* Toggle du mode sombre */}
          <ThemeToggle onClick={toggleDarkMode} title="Basculer le thème">
            <Icon name={isDarkMode ? 'light-mode' : 'dark-mode'} size="md" />
          </ThemeToggle>

          {/* Menu utilisateur */}
          {user && (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <MenuButton onClick={() => setShowUserMenu(!showUserMenu)}>
                <Icon name="user" size="md" />
                <Icon name="chevron-down" size="sm" />
              </MenuButton>
              
              {showUserMenu && (
                <MenuDropdown>
                  <DropdownItem>
                    <Icon name="user" size="sm" />
                    {user}
                  </DropdownItem>
                  
                  <DropdownItem>
                    <Icon name="settings" size="sm" />
                    Paramètres
                  </DropdownItem>
                  
                  <LogoutButton onClick={onLogout}>
                    <Icon name="logout" size="sm" />
                    Déconnexion
                  </LogoutButton>
                </MenuDropdown>
              )}
            </div>
          )}
        </Nav>

        {/* Menu mobile */}
        <MobileMenu>
          <MenuButton onClick={() => setShowMobileMenu(!showMobileMenu)}>
            <Icon name={showMobileMenu ? 'close' : 'menu'} size="md" />
          </MenuButton>
          
          <NavLinks isOpen={showMobileMenu}>
            <NavLink to="/questionnaires" onClick={() => setShowMobileMenu(false)}>
              <IconWithText iconName="checklist" iconSize="sm">
                Mes CR
              </IconWithText>
            </NavLink>
            
            <NavLink to="/cases" onClick={() => setShowMobileMenu(false)}>
              <IconWithText iconName="folder" iconSize="sm">
                Mes Cas
              </IconWithText>
            </NavLink>
            
            <NavLink to="/public-questionnaires" onClick={() => setShowMobileMenu(false)}>
              <IconWithText iconName="book-open" iconSize="sm">
                CR Publics
              </IconWithText>
            </NavLink>
            
            <NavLink to="/public-cases" onClick={() => setShowMobileMenu(false)}>
              <IconWithText iconName="folder-open" iconSize="sm">
                Cas Publics
              </IconWithText>
            </NavLink>

            <div style={{ padding: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: '0.5rem' }}>
              <ThemeToggle onClick={toggleDarkMode}>
                <IconWithText iconName={isDarkMode ? 'light-mode' : 'dark-mode'} iconSize="sm">
                  {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
                </IconWithText>
              </ThemeToggle>
              
              {user && (
                <LogoutButton onClick={onLogout} style={{ width: '100%', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                  <Icon name="logout" size="sm" />
                  Déconnexion ({user})
                </LogoutButton>
              )}
            </div>
          </NavLinks>
        </MobileMenu>
      </HeaderContent>
    </HeaderWrapper>
  );
}

export default Header;