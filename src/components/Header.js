import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Moon, Sun, Menu, X, User, LogOut, ChevronDown, ChevronRight, FileText, FolderOpen, Stethoscope, Activity } from 'lucide-react';

const HeaderWrapper = styled.header`
  background-color: ${props => props.theme.headerBackground};
  color: ${props => props.theme.headerText};
  padding: 1rem 0;
  width: 100%;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  /* 🔧 SOLUTION : Position fixed MAIS avec z-index plus BAS que RadiologyViewer */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50; /* 🔧 TRÈS IMPORTANT : Plus bas que RadiologyViewer (z-index: 100) */
  
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    padding: 0.5rem 0;
    /* Support pour les safe areas iPhone */
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 2500px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 0 1rem;
    /* Ajuste l'espacement pour mobile */
    gap: 0.5rem;
  }
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
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    font-size: 1.25rem;
    gap: 0.25rem;
    
    /* Masque le texte sur très petits écrans, garde juste l'icône */
    span {
      @media (max-width: 480px) {
        display: none;
      }
    }
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
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 0.25rem;
    
    /* Cache le titre sur très petits écrans */
    @media (max-width: 480px) {
      display: none;
    }
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const ThemeToggleButton = styled.button`
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
  touch-action: manipulation;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    padding: 0.5rem;
    min-height: 44px;
    min-width: 44px;
    
    /* Supprime l'effet hover sur mobile */
    &:hover {
      transform: none;
    }
  }
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
  touch-action: manipulation;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 0.25rem;
    min-height: 44px;
    
    /* Supprime l'effet hover sur mobile */
    &:hover {
      transform: none;
    }
    
    /* Cache le nom d'utilisateur sur très petits écrans */
    span {
      @media (max-width: 480px) {
        display: none;
      }
    }
  }
`;

/* 🔧 Menu dropdown avec z-index TRÈS ÉLEVÉ pour passer au-dessus de TOUT */
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
  z-index: 999999; /* 🔧 Z-index MAXIMAL pour le menu */
  min-width: 280px;
  backdrop-filter: blur(8px);
  animation: ${props => props.isOpen ? 'dropdownSlideIn' : 'dropdownSlideOut'} 0.2s ease;
  max-height: 80vh;
  overflow-y: auto;

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
  
  /* 🔧 Menu plein écran sur mobile */
  @media (max-width: 768px) {
    /* Menu plein écran sur mobile */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    min-width: unset;
    border-radius: 0;
    padding: 1rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    z-index: 9999999; /* 🔧 Z-index ENCORE PLUS ÉLEVÉ sur mobile */
    max-height: none;
    border: none;
    
    /* Support pour les safe areas */
    padding-top: calc(1rem + env(safe-area-inset-top));
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
    padding-left: calc(1rem + env(safe-area-inset-left));
    padding-right: calc(1rem + env(safe-area-inset-right));
    
    /* Animation différente sur mobile */
    animation: ${props => props.isOpen ? 'mobileSlideIn' : 'mobileSlideOut'} 0.3s ease;
  }
  
  @keyframes mobileSlideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes mobileSlideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100%);
    }
  }
`;

/* Header mobile avec bouton fermer */
const MobileMenuHeader = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid ${props => props.theme.border};
  }
`;

const MobileMenuTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const MobileCloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
  touch-action: manipulation;
  
  &:hover {
    background-color: ${props => props.theme.backgroundSecondary};
  }
`;

const MenuSection = styled.div`
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  /* Mobile spacing */
  @media (max-width: 768px) {
    margin-bottom: 1rem;
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
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0;
    font-size: 1rem;
    border-radius: 12px;
  }
`;

const MenuDivider = styled.div`
  height: 1px;
  background-color: ${props => props.theme.border || '#e0e6ed'};
  margin: 0.5rem 0;
  
  /* Mobile spacing */
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
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
  touch-action: manipulation;
  
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
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0 0 0.5rem 0;
    border-radius: 12px;
    font-size: 1rem;
    min-height: 56px;
    
    /* Supprime l'effet de translation sur mobile */
    &:hover {
      transform: none;
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
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
  touch-action: manipulation;
  
  &:hover {
    background-color: #fef2f2;
    transform: translateX(4px);
  }

  svg {
    width: 18px;
    height: 18px;
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0;
    border-radius: 12px;
    font-size: 1rem;
    min-height: 56px;
    
    /* Supprime l'effet de translation sur mobile */
    &:hover {
      transform: none;
    }
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.text || '#374151'};
  font-weight: 500;
  margin: 0 0.5rem;
  border-radius: 8px;
  background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0 0 1rem 0;
    border-radius: 12px;
    font-size: 1rem;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

function Header({ isDarkMode, toggleDarkMode, onLogout, userName, pageTitle = null }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
    
    // 🔧 Empêche le scroll du body quand le menu mobile est ouvert
    if (!showMenu) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const handleMenuItemClick = () => {
    setShowMenu(false);
    // Restaure le scroll du body
    document.body.classList.remove('menu-open');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        document.body.classList.remove('menu-open');
      }
    };

    // Seulement si le menu est ouvert
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup au démontage du composant
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('menu-open');
    };
  }, [showMenu]);

  // Cleanup si le composant change de route
  useEffect(() => {
    setShowMenu(false);
    document.body.classList.remove('menu-open');
  }, [location.pathname]);

  return (
    <HeaderWrapper>
      <HeaderContent>
        <Logo to="/">
          <Stethoscope size={24} />
          <span>RIFIM</span>
        </Logo>
        
        {pageTitle && (
          <CenterTitle>{pageTitle}</CenterTitle>
        )}
        
        <RightSection ref={menuRef}>
          <ThemeToggleButton onClick={toggleDarkMode} title={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </ThemeToggleButton>

          <MenuButton onClick={handleMenuToggle}>
            <span>{userName}</span>
            <ChevronDown 
              size={16} 
              style={{ 
                transform: showMenu ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }} 
            />
          </MenuButton>

          <DropdownMenu isOpen={showMenu}>
            {/* Header mobile uniquement */}
            <MobileMenuHeader>
              <MobileMenuTitle>Menu</MobileMenuTitle>
              <MobileCloseButton onClick={handleMenuItemClick}>
                <X size={24} />
              </MobileCloseButton>
            </MobileMenuHeader>

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
                <span>➕</span> Gérer les questionnaires
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
                <span>➕</span> Gérer les Cas
              </MenuItem>
              <MenuItem to="/cases-list" onClick={handleMenuItemClick}>
                <span>📁</span> Mes Cas
              </MenuItem>
              <MenuItem to="/public-cases" onClick={handleMenuItemClick}>
                <span>📂</span> Cas Publics
              </MenuItem>
            </MenuSection>

            <MenuDivider />

            {/* Section Protocoles */}
            <MenuSection>
              <SectionTitle>
                <Activity size={18} />
                Protocoles
              </SectionTitle>
              <MenuItem to="/protocols/create" onClick={handleMenuItemClick}>
                <span>➕</span> Créer un protocole
              </MenuItem>
              <MenuItem to="/protocols/personal" onClick={handleMenuItemClick}>
                <span>📋</span> Mes Protocoles
              </MenuItem>
              <MenuItem to="/protocols/public" onClick={handleMenuItemClick}>
                <span>📖</span> Protocoles Publics
              </MenuItem>
            </MenuSection>

            <MenuDivider />

            {/* Section Déconnexion */}
            <MenuSection>
              <LogoutItem onClick={() => { handleMenuItemClick(); onLogout(); }}>
                <LogOut size={18} />
                Se déconnecter
              </LogoutItem>
            </MenuSection>
          </DropdownMenu>
        </RightSection>
      </HeaderContent>
    </HeaderWrapper>
  );
}

export default Header;