import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Moon, Sun, Menu, X, User, LogOut, ChevronDown, ChevronRight, FileText, FolderOpen, Stethoscope } from 'lucide-react';

const HeaderWrapper = styled.header`
  background-color: ${props => props.theme.headerBackground};
  color: ${props => props.theme.headerText};
  padding: 1rem 0;
  width: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;
  position: fixed; /* ← CHANGEMENT : fixed au lieu de relative */
  top: 0; /* ← AJOUT : Collé en haut */
  left: 0; /* ← AJOUT : Collé à gauche */
  right: 0; /* ← AJOUT : Collé à droite */
  z-index: 1000; /* ← AJOUT : Au-dessus de tout le contenu */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* ← AJOUT : Ombre pour le séparer du contenu */
  backdrop-filter: blur(8px); /* ← AJOUT : Effet de flou d'arrière-plan moderne */
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

const CenterTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${props => props.theme.headerText};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.headerText};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
  gap: 0.5rem;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: ${props => props.theme.card || '#ffffff'};
  border: 1px solid ${props => props.theme.border || '#e0e6ed'};
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  padding: 0.75rem 0;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1001; /* ← AUGMENTÉ : Au-dessus du header */
  min-width: 280px;
  backdrop-filter: blur(8px);
  animation: ${props => props.isOpen ? 'dropdownSlideIn' : 'dropdownSlideOut'} 0.2s ease;

  @keyframes dropdownSlideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes dropdownSlideOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
`;

const MenuSection = styled.div`
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.primary || '#3b82f6'};
  background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
  margin: 0 0.5rem;
  border-radius: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.border || '#e0e6ed'};
  margin: 0.5rem 0;
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.text || '#374151'};
  text-decoration: none;
  transition: all 0.2s ease;
  font-weight: 500;
  margin: 0 0.5rem;
  border-radius: 8px;
  
  &:hover {
    background-color: ${props => props.theme.backgroundSecondary || '#f1f5f9'};
    color: ${props => props.theme.primary || '#3b82f6'};
    transform: translateX(4px);
  }

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }
`;

const ThemeToggleItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.text || '#374151'};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  width: 100%;
  text-align: left;
  margin: 0 0.5rem;
  border-radius: 8px;
  
  &:hover {
    background-color: ${props => props.theme.backgroundSecondary || '#f1f5f9'};
    color: ${props => props.theme.primary || '#3b82f6'};
    transform: translateX(4px);
  }

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.text || '#374151'};
  background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
  margin: 0 0.5rem;
  border-radius: 8px;
  font-weight: 500;
  border: 1px solid ${props => props.theme.border || '#e0e6ed'};
`;

const LogoutItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  width: 100%;
  text-align: left;
  margin: 0 0.5rem;
  border-radius: 8px;
  
  &:hover {
    background-color: #fef2f2;
    transform: translateX(4px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

function Header({ isDarkMode, toggleDarkMode, user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
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
    if (path === '/protocols') return 'Protocoles';
    if (path === '/protocols/personal') return 'Mes Protocoles';
    if (path === '/protocols/public') return 'Protocoles Publics';
    if (path === '/protocols/create') return 'Créer un Protocole';
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

  const handleMenuItemClick = () => {
    setShowMenu(false);
  };

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

        {/* Section droite avec menu déroulant */}
        <RightSection ref={menuRef}>
          <MenuButton onClick={() => setShowMenu(!showMenu)}>
            {userName && (
              <>
                <User size={18} />
                {userName}
              </>
            )}
            <ChevronDown 
              size={16} 
              style={{ 
                transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
            />
          </MenuButton>

          <DropdownMenu isOpen={showMenu}>
            {/* Informations utilisateur */}
            {userName && (
              <>
                <UserInfo>
                  <User size={18} />
                  Connecté en tant que <strong>{userName}</strong>
                </UserInfo>
                <MenuDivider />
              </>
            )}

            {/* Section Questionnaires */}
            <MenuSection>
              <SectionTitle>
                <FileText size={18} />
                Questionnaires
              </SectionTitle>
              <MenuItem to="/questionnaires" onClick={handleMenuItemClick}>
                <span>➕</span> Créer un Questionnaire
              </MenuItem>
              <MenuItem to="/questionnaires-list" onClick={handleMenuItemClick}>
                <span>📋</span> Mes Questionnaires
              </MenuItem>
              <MenuItem to="/public-questionnaires" onClick={handleMenuItemClick}>
                <span>📖</span> Questionnaires Publics
              </MenuItem>
            </MenuSection>

            <MenuDivider />

            {/* Section Cas Cliniques */}
            <MenuSection>
              <SectionTitle>
                <FolderOpen size={18} />
                Cas Cliniques
              </SectionTitle>
              <MenuItem to="/cases" onClick={handleMenuItemClick}>
                <span>➕</span> Créer un Cas
              </MenuItem>
              <MenuItem to="/cases-list" onClick={handleMenuItemClick}>
                <span>📁</span> Mes Cas
              </MenuItem>
              <MenuItem to="/public-cases" onClick={handleMenuItemClick}>
                <span>📂</span> Cas Publics
              </MenuItem>
            </MenuSection>

            <MenuDivider />

            {/* Section Protocoles - NOUVELLE ! */}
            <MenuSection>
              <SectionTitle>
                <Stethoscope size={18} />
                Protocoles
              </SectionTitle>
              <MenuItem to="/protocols/create" onClick={handleMenuItemClick}>
                <span>➕</span> Créer un Protocole
              </MenuItem>
              <MenuItem to="/protocols/personal" onClick={handleMenuItemClick}>
                <span>🔒</span> Mes Protocoles
              </MenuItem>
              <MenuItem to="/protocols/public" onClick={handleMenuItemClick}>
                <span>🌍</span> Protocoles Publics
              </MenuItem>
            </MenuSection>

            <MenuDivider />

            {/* Paramètres */}
            <MenuSection>
              <ThemeToggleItem onClick={toggleDarkMode}>
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
              </ThemeToggleItem>
            </MenuSection>

            <MenuDivider />

            {/* Déconnexion */}
            <LogoutItem onClick={onLogout}>
              <LogOut size={18} />
              Déconnexion
            </LogoutItem>
          </DropdownMenu>
        </RightSection>
      </HeaderContent>
    </HeaderWrapper>
  );
}

export default Header;