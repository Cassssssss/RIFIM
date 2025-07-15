import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Moon, Sun, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';

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
    if (path === '/') return 'Accueil';
    if (path === '/questionnaires') return 'Mes Questionnaires';
    if (path === '/questionnaires-list') return 'Questionnaires';
    if (path === '/create') return 'Créer un Questionnaire';
    if (path.includes('/edit/')) return 'Modifier le Questionnaire';
    if (path.includes('/cr/')) return 'Compte Rendu';
    if (path.includes('/use/')) return 'Utiliser le Questionnaire';
    if (path === '/cases') return 'Mes Cas';
    if (path === '/cases-list') return 'Liste des Cas';
    if (path === '/public-questionnaires') return 'Questionnaires Publics';
    if (path === '/public-cases') return 'Cas Publics';
    return 'RIFIM';
  };

  // Fonction pour obtenir le nom d'utilisateur de manière sûre
  const getUserName = () => {
    if (!user) return null;
    
    // Si user est une string, la retourner directement
    if (typeof user === 'string') return user;
    
    // Si user est un objet, extraire le username
    if (typeof user === 'object' && user.username) return user.username;
    
    // Fallback
    return 'Utilisateur';
  };

  const userName = getUserName();

  return (
    <HeaderWrapper>
      <HeaderContent>
        {/* Logo */}
        <Logo to="/">
          🩺 RIFIM
        </Logo>

        {/* Titre central */}
        <CenterTitle>
          {getPageTitle()}
        </CenterTitle>

        {/* Navigation principale pour desktop */}
        <Nav className="hidden md:flex">
          <NavLink to="/questionnaires">
            📋 Mes CR
          </NavLink>
          
          <NavLink to="/questionnaires-list">
            ➕ Créer CR
          </NavLink>
          
          <NavLink to="/cases-list">
            📁 Mes Cas
          </NavLink>
          
          <NavLink to="/cases">
            ➕ Créer Cas
          </NavLink>
          
          <NavLink to="/public-questionnaires">
            📖 CR Publics
          </NavLink>
          
          <NavLink to="/public-cases">
            📂 Cas Publics
          </NavLink>

          {/* Toggle du mode sombre */}
          <ThemeToggle onClick={toggleDarkMode} title="Basculer le thème">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </ThemeToggle>

          {/* Menu utilisateur */}
          {userName && (
            <div ref={menuRef} style={{ position: 'relative' }}>
              <MenuButton onClick={() => setShowUserMenu(!showUserMenu)}>
                <User size={20} />
                <ChevronDown size={16} />
              </MenuButton>
              
              {showUserMenu && (
                <MenuDropdown>
                  <DropdownItem>
                    <User size={16} />
                    {userName}
                  </DropdownItem>
                  
                  <DropdownItem>
                    ⚙️ Paramètres
                  </DropdownItem>
                  
                  <LogoutButton onClick={onLogout}>
                    <LogOut size={16} />
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
            {showMobileMenu ? <X size={20} /> : <Menu size={20} />}
          </MenuButton>
          
          <NavLinks isOpen={showMobileMenu}>
            <NavLink to="/questionnaires" onClick={() => setShowMobileMenu(false)}>
              📋 Mes CR
            </NavLink>
            
            <NavLink to="/questionnaires-list" onClick={() => setShowMobileMenu(false)}>
              ➕ Créer CR
            </NavLink>
            
            <NavLink to="/cases-list" onClick={() => setShowMobileMenu(false)}>
              📁 Mes Cas
            </NavLink>
            
            <NavLink to="/cases" onClick={() => setShowMobileMenu(false)}>
              ➕ Créer Cas
            </NavLink>
            
            <NavLink to="/public-questionnaires" onClick={() => setShowMobileMenu(false)}>
              📖 CR Publics
            </NavLink>
            
            <NavLink to="/public-cases" onClick={() => setShowMobileMenu(false)}>
              📂 Cas Publics
            </NavLink>

            <div style={{ padding: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.2)', marginTop: '0.5rem' }}>
              <ThemeToggle onClick={toggleDarkMode}>
                {isDarkMode ? '☀️ Mode Clair' : '🌙 Mode Sombre'}
              </ThemeToggle>
              
              {userName && (
                <LogoutButton onClick={onLogout} style={{ width: '100%', justifyContent: 'flex-start', marginTop: '0.5rem' }}>
                  <LogOut size={16} />
                  Déconnexion ({userName})
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