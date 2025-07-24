import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  Image, 
  BookOpen, 
  Settings, 
  User,
  Moon,
  Sun,
  LogOut,
  ChevronDown
} from 'lucide-react';

// ==================== STYLED COMPONENTS OPTIMISÉS MOBILE ====================

const MobileHeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${props => props.theme.headerBackground || props.theme.card};
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  z-index: 1000;
  backdrop-filter: blur(10px);
  
  /* Support pour les encoches */
  padding-top: env(safe-area-inset-top);
  
  @media (max-width: 768px) {
    height: 70px;
    padding: 0 1rem;
    background: ${props => props.theme.headerBackground || props.theme.card}ee;
    backdrop-filter: blur(20px);
  }
  
  @media (orientation: landscape) and (max-height: 500px) {
    height: 50px;
    padding: 0 0.75rem;
  }
`;

const MobileLogo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: ${props => props.theme.primary};
  font-weight: 700;
  font-size: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    gap: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    
    /* Masque le texte sur très petits écrans */
    span {
      display: none;
    }
  }
`;

const MobileNavigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none; /* Masqué sur mobile, remplacé par le menu hamburger */
  }
`;

const MobileNavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: ${props => props.theme.text};
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.theme.hover};
    color: ${props => props.theme.primary};
  }
  
  &.active {
    background: ${props => props.theme.primary}20;
    color: ${props => props.theme.primary};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${props => props.theme.primary};
    }
  }
`;

const MobileUserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const MobileThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    
    &:active {
      background: ${props => props.theme.hover};
      transform: scale(0.95);
    }
  }
  
  &:hover {
    background: ${props => props.theme.hover};
    border-color: ${props => props.theme.primary};
    
    @media (max-width: 768px) {
      background: transparent;
      border-color: ${props => props.theme.border};
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    background: transparent;
    border: 1px solid ${props => props.theme.border};
    border-radius: 10px;
    color: ${props => props.theme.text};
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:active {
      background: ${props => props.theme.hover};
      transform: scale(0.95);
    }
  }
`;

const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1500;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
`;

const MobileMenuPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 320px;
  height: 100vh;
  background: ${props => props.theme.card};
  border-left: 1px solid ${props => props.theme.border};
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s ease;
  z-index: 1600;
  display: flex;
  flex-direction: column;
  
  /* Support pour les encoches */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  
  @media (max-width: 480px) {
    width: 100vw;
    border-left: none;
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: ${props => props.theme.text};
    margin: 0;
  }
`;

const MobileCloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:active {
    background: ${props => props.theme.hover};
    transform: scale(0.95);
  }
`;

const MobileMenuContent = styled.div`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const MobileMenuSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const MobileMenuSectionTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 1rem 0;
  padding: 0 1.5rem;
`;

const MobileMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: ${props => props.theme.text};
  font-weight: 500;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  
  &:active {
    background: ${props => props.theme.hover};
  }
  
  &.active {
    background: ${props => props.theme.primary}10;
    color: ${props => props.theme.primary};
    border-left-color: ${props => props.theme.primary};
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const MobileMenuButton2 = styled.button`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
  border-left: 3px solid transparent;
  
  &:active {
    background: ${props => props.theme.hover};
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const MobileUserInfo = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.border};
  background: ${props => props.theme.surface};
`;

const MobileUserAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
`;

const MobileUserName = styled.div`
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const MobileUserEmail = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

// ==================== COMPOSANT PRINCIPAL ====================

const Header = ({ user, onLogout, isDarkMode, onToggleTheme }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Fermeture du menu mobile au changement de route
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Fermeture du menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      // Empêche le scroll du body
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Fonction pour déterminer si un lien est actif
  const isActiveLink = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Navigation items
  const navigationItems = [
    { path: '/', label: 'Accueil', icon: Home },
    { path: '/cases', label: 'Cas', icon: Image },
    { path: '/questionnaires', label: 'Questionnaires', icon: FileText },
    { path: '/protocols/personal', label: 'Protocoles', icon: BookOpen },
  ];

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    onLogout();
  };

  return (
    <>
      <MobileHeaderContainer>
        {/* Logo */}
        <MobileLogo to="/">
          <div style={{ 
            width: '32px', 
            height: '32px', 
            background: 'currentColor', 
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            R
          </div>
          <span>Rifim</span>
        </MobileLogo>

        {/* Navigation desktop */}
        <MobileNavigation>
          {navigationItems.map(({ path, label, icon: Icon }) => (
            <MobileNavLink
              key={path}
              to={path}
              className={isActiveLink(path) ? 'active' : ''}
            >
              <Icon size={18} />
              {label}
            </MobileNavLink>
          ))}
        </MobileNavigation>

        {/* Section utilisateur */}
        <MobileUserSection>
          {/* Toggle thème */}
          <MobileThemeToggle onClick={onToggleTheme}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </MobileThemeToggle>

          {/* Menu hamburger mobile */}
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={20} />
          </MobileMenuButton>
        </MobileUserSection>
      </MobileHeaderContainer>

      {/* Menu mobile overlay */}
      <MobileMenuOverlay 
        isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Panel menu mobile */}
      <MobileMenuPanel ref={menuRef} isOpen={isMobileMenuOpen}>
        {/* Header du menu */}
        <MobileMenuHeader>
          <h3>Menu</h3>
          <MobileCloseButton onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} />
          </MobileCloseButton>
        </MobileMenuHeader>

        {/* Contenu du menu */}
        <MobileMenuContent>
          {/* Navigation principale */}
          <MobileMenuSection>
            <MobileMenuSectionTitle>Navigation</MobileMenuSectionTitle>
            {navigationItems.map(({ path, label, icon: Icon }) => (
              <MobileMenuItem
                key={path}
                to={path}
                className={isActiveLink(path) ? 'active' : ''}
              >
                <Icon size={20} />
                {label}
              </MobileMenuItem>
            ))}
          </MobileMenuSection>

          {/* Pages publiques */}
          <MobileMenuSection>
            <MobileMenuSectionTitle>Public</MobileMenuSectionTitle>
            <MobileMenuItem to="/public-cases">
              <Image size={20} />
              Cas publics
            </MobileMenuItem>
            <MobileMenuItem to="/public-questionnaires">
              <FileText size={20} />
              Questionnaires publics
            </MobileMenuItem>
            <MobileMenuItem to="/protocols/public">
              <BookOpen size={20} />
              Protocoles publics
            </MobileMenuItem>
          </MobileMenuSection>

          {/* Actions */}
          <MobileMenuSection>
            <MobileMenuSectionTitle>Actions</MobileMenuSectionTitle>
            <MobileMenuButton2 onClick={onToggleTheme}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              {isDarkMode ? 'Mode clair' : 'Mode sombre'}
            </MobileMenuButton2>
            <MobileMenuButton2 onClick={handleLogout}>
              <LogOut size={20} />
              Déconnexion
            </MobileMenuButton2>
          </MobileMenuSection>
        </MobileMenuContent>

        {/* Info utilisateur */}
        {user && (
          <MobileUserInfo>
            <MobileUserAvatar>
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </MobileUserAvatar>
            <MobileUserName>
              {user.name || 'Utilisateur'}
            </MobileUserName>
            <MobileUserEmail>
              {user.email || 'email@example.com'}
            </MobileUserEmail>
          </MobileUserInfo>
        )}
      </MobileMenuPanel>
    </>
  );
};

export default Header;