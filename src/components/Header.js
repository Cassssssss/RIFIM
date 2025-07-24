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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 0.75rem 0; /* Padding réduit sur mobile */
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
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 0 1rem; /* Padding réduit sur mobile */
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
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 1.25rem; /* Logo plus petit sur mobile */
    gap: 0.25rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem; /* Encore plus petit sur très petits écrans */
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
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 1rem; /* Titre plus petit sur mobile */
    display: none; /* Caché sur mobile pour économiser l'espace */
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    gap: 0.5rem; /* Espacement réduit sur mobile */
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
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 0.5rem; /* Padding réduit sur mobile */
    
    &:hover {
      transform: none; /* Pas d'animation hover sur mobile */
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
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 0.5rem;
    gap: 0.25rem;
    
    &:hover {
      transform: none; /* Pas d'animation hover sur mobile */
    }
  }
`;

/* NOUVEAU : Menu mobile hamburger */
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.theme.headerText};
  cursor: pointer;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    display: flex; /* Visible seulement sur mobile */
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
  z-index: 1001;
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
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    min-width: 250px; /* Largeur réduite sur mobile */
    right: -0.5rem; /* Ajustement de position */
    
    /* Animation simplifiée sur mobile */
    animation: none;
    transition: opacity 0.2s ease;
  }
`;

/* NOUVEAU : Menu mobile overlay */
const MobileMenuOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  backdrop-filter: blur(4px);
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

/* NOUVEAU : Menu mobile drawer */
const MobileMenuDrawer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 85%;
    max-width: 320px;
    background-color: ${props => props.theme.card || '#ffffff'};
    border-left: 1px solid ${props => props.theme.border || '#e0e6ed'};
    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    transform: translateX(${props => props.isOpen ? '0' : '100%'});
    transition: transform 0.3s ease;
    overflow-y: auto;
    
    /* Safe area pour les appareils avec encoche */
    padding-top: env(safe-area-inset-top, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;

const MobileMenuHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.border || '#e0e6ed'};
  
  h3 {
    margin: 0;
    color: ${props => props.theme.text || '#374151'};
    font-size: 1.125rem;
    font-weight: 600;
  }
`;

const MobileCloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text || '#374151'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.backgroundSecondary || '#f1f5f9'};
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
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 0.8rem; /* Police plus petite sur mobile */
    padding: 0.5rem 1rem;
  }
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
  min-height: 44px; /* Taille minimum pour le touch sur mobile */
  
  &:hover {
    background-color: ${props => props.theme.backgroundSecondary || '#f1f5f9'};
    color: ${props => props.theme.primary || '#3b82f6'};
    transform: translateX(4px);
  }

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.7;
    flex-shrink: 0; /* Empêche l'icône de se rétrécir */
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    
    &:hover {
      transform: none; /* Pas d'animation sur mobile */
    }
    
    &:active {
      background-color: ${props => props.theme.backgroundSecondary || '#f1f5f9'};
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
  min-height: 44px; /* Taille minimum pour le touch */
  
  &:hover {
    background-color: #fef2f2;
    transform: translateX(4px);
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    
    &:hover {
      transform: none; /* Pas d'animation sur mobile */
    }
    
    &:active {
      background-color: #fef2f2;
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
    flex-shrink: 0;
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

/* NOUVEAU : Section pour les boutons de thème sur mobile */
const MobileThemeSection = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    padding: 1rem;
    border-top: 1px solid ${props => props.theme.border || '#e0e6ed'};
    margin-top: 1rem;
  }
`;

const MobileThemeButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.primary || '#3b82f6'};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  min-height: 44px;
  
  &:hover {
    background-color: ${props => props.theme.primaryHover || '#2563eb'};
  }
`;

const Header = ({ isDarkMode, toggleDarkMode, user, onLogout }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  // Fermer les menus quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer le menu mobile quand on change de page
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  // Empêcher le scroll du body quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    {
      section: "Navigation",
      items: [
        { to: "/", icon: <Stethoscope />, label: "Accueil" },
        { to: "/questionnaires", icon: <FileText />, label: "Questionnaires" },
        { to: "/cases", icon: <FolderOpen />, label: "Cas Médicaux" },
        { to: "/protocols/personal", icon: <FileText />, label: "Mes Protocoles" }
      ]
    },
    {
      section: "Public",
      items: [
        { to: "/public-questionnaires", icon: <FileText />, label: "Questionnaires Publics" },
        { to: "/public-cases", icon: <FolderOpen />, label: "Cas Publics" },
        { to: "/protocols/public", icon: <FileText />, label: "Protocoles Publics" }
      ]
    }
  ];

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    onLogout();
  };

  const renderMenuContent = () => (
    <>
      {user && (
        <>
          <UserInfo>
            <User />
            <span>{user.username}</span>
          </UserInfo>
          <MenuDivider />
        </>
      )}

      {menuItems.map((section, index) => (
        <MenuSection key={index}>
          <SectionTitle>
            {section.section}
          </SectionTitle>
          {section.items.map((item, itemIndex) => (
            <MenuItem key={itemIndex} to={item.to}>
              {item.icon}
              <span>{item.label}</span>
            </MenuItem>
          ))}
        </MenuSection>
      ))}

      {user && (
        <>
          <MenuDivider />
          <LogoutItem onClick={handleLogout}>
            <LogOut />
            <span>Se déconnecter</span>
          </LogoutItem>
        </>
      )}
    </>
  );

  return (
    <>
      <HeaderWrapper>
        <HeaderContent>
          <Logo to="/">
            <Stethoscope size={24} />
            CreationQ
          </Logo>
          
          <CenterTitle>
            Plateforme Médicale
          </CenterTitle>

          <RightSection>
            {/* Bouton de thème - visible sur desktop */}
            <ThemeToggleButton 
              onClick={toggleDarkMode}
              className="mobile-hidden"
              title={isDarkMode ? "Mode clair" : "Mode sombre"}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </ThemeToggleButton>

            {/* Menu desktop */}
            <div className="mobile-hidden" ref={dropdownRef}>
              <MenuButton 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <User size={20} />
                {user && <span>{user.username}</span>}
                <ChevronDown size={16} />
              </MenuButton>

              <DropdownMenu isOpen={isDropdownOpen}>
                {renderMenuContent()}
              </DropdownMenu>
            </div>

            {/* Bouton menu mobile */}
            <MobileMenuButton
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Ouvrir le menu"
            >
              <Menu size={24} />
            </MobileMenuButton>
          </RightSection>
        </HeaderContent>
      </HeaderWrapper>

      {/* Menu mobile */}
      <MobileMenuOverlay 
        isOpen={isMobileMenuOpen}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      <MobileMenuDrawer isOpen={isMobileMenuOpen}>
        <MobileMenuHeader>
          <h3>Menu</h3>
          <MobileCloseButton
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </MobileCloseButton>
        </MobileMenuHeader>

        <div style={{ padding: '1rem 0' }}>
          {renderMenuContent()}
        </div>

        {/* Section thème sur mobile */}
        <MobileThemeSection>
          <MobileThemeButton onClick={toggleDarkMode}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{isDarkMode ? "Mode clair" : "Mode sombre"}</span>
          </MobileThemeButton>
        </MobileThemeSection>
      </MobileMenuDrawer>
    </>
  );
};

export default Header;