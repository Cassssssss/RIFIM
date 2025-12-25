import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Moon, Sun, Menu, X, User, LogOut, ChevronDown, FileText, FolderOpen, BookOpen, Users, BarChart3 } from 'lucide-react';
import RifimLogo from './shared/Logo';

const HeaderWrapper = styled.header`
  /* ✨ DÉGRADÉ en mode clair, couleur unie en mode sombre */
  background: ${props => props.$isDarkMode 
    ? props.theme.headerBackground  // Mode sombre : couleur unie du thème
    : 'linear-gradient(135deg, rgba(190, 216, 255, 0.15) 100%)'  // Mode clair : dégradé
  };
  backdrop-filter: ${props => props.theme.headerBlur};
  -webkit-backdrop-filter: ${props => props.theme.headerBlur};
  color: ${props => props.theme.headerText};
  width: 100%;
  transition: none;
  z-index: 999998;
  border-bottom: none;
  box-shadow: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  
  @media (max-width: 768px) {
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
  height: 60px;  /* ✨ Augmenté de 48px à 56px pour être plus épais */
  
  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 0.5rem;
    height: 64px;  /* ✨ Augmenté de 60px à 64px pour mobile */
  }
`;

const Logo = styled(Link)`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.headerText};
  text-decoration: none;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;

  &:hover {
    color: ${props => props.theme.primary};
  }

  @media (max-width: 768px) {
    font-size: 1.2rem;
    gap: 0.5rem;
  }
`;

// ==================== MENU DESKTOP STYLE APPLE ====================

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0;
  height: 56px;  /* ✨ Augmenté pour correspondre au HeaderContent */

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 1rem;
  height: 56px;  /* ✨ Augmenté pour correspondre */
  cursor: pointer;
  color: ${props => props.theme.headerText};
  font-weight: 400;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }

  &:hover + div {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MegaMenuOverlay = styled.div`
  position: fixed;
  top: 56px;  /* ✨ Ajusté pour correspondre à la nouvelle hauteur */
  left: 0;
  right: 0;
  background-color: ${props => props.theme.headerBackground};
  backdrop-filter: ${props => props.theme.headerBlur};
  -webkit-backdrop-filter: ${props => props.theme.headerBlur};
  border-bottom: none;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 999997;

  &:hover {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
`;

const MegaMenuContent = styled.div`
  max-width: 2500px;
  margin: 0 auto;
  padding: 2rem 2rem 3rem 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
`;

const MegaMenuItem = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  color: ${props => props.theme.text};
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.card};

  &:hover {
    background-color: ${props => props.theme.hover};
    transform: translateY(-2px);
  }
`;

const MegaMenuItemIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  color: ${props => props.theme.text};

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.primary};
  }
`;

const MegaMenuItemDesc = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.4;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  height: 56px;  /* ✨ Augmenté pour correspondre */

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const UserNavItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 1rem;
  height: 56px;  /* ✨ Augmenté pour correspondre */
  cursor: pointer;
  color: ${props => props.theme.headerText};
  font-weight: 400;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  opacity: 0.9;

  &:hover {
    opacity: 1;
  }

  &:hover + div {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const UserMegaMenu = styled.div`
  position: fixed;
  top: 56px;  /* ✨ Ajusté pour correspondre à la nouvelle hauteur */
  right: 2rem;
  background-color: ${props => props.theme.headerBackground};
  backdrop-filter: ${props => props.theme.headerBlur};
  -webkit-backdrop-filter: ${props => props.theme.headerBlur};
  border-bottom: none;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 999997;
  border-radius: 12px;
  min-width: 250px;

  &:hover {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
`;

const UserMegaMenuContent = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const UserMegaMenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  color: ${props => props.theme.text};
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  background-color: ${props => props.theme.card};
  font-size: 0.95rem;

  &:hover {
    background-color: ${props => props.theme.hover};
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.primary};
  }
`;

const UserMegaMenuButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  width: 100%;
  border: none;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: left;
  font-size: 0.95rem;

  &:hover {
    background-color: ${props => props.theme.hover};
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.primary};
  }
`;

const ThemeToggle = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.headerText};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  border-radius: 50%;
  opacity: 0.9;

  &:hover {
    opacity: 1;
    background-color: rgba(255, 255, 255, 0.1);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.headerText};
  cursor: pointer;
  padding: 0.5rem;
  display: none;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileMenu = styled.div`
  position: fixed;
  top: 64px;  /* ✨ Ajusté pour mobile */
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${props => props.theme.background};
  padding: 1rem;
  overflow-y: auto;
  z-index: 999997;
  transform: ${props => props.$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform 0.3s ease;
  display: none;

  @media (max-width: 768px) {
    display: block;
    padding-left: calc(env(safe-area-inset-left) + 1rem);
    padding-right: calc(env(safe-area-inset-right) + 1rem);
    padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
  }
`;

const MobileNavSection = styled.div`
  margin-bottom: 1.5rem;
`;

const MobileSectionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 1rem;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MobileNavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin: 0.25rem 0;
  border-radius: 8px;
  text-decoration: none;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.card};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.hover};
    color: ${props => props.theme.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const MobileUserSection = styled.div`
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 1rem;
  margin-top: 1rem;
`;

const MobileUserButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  width: 100%;
  margin: 0.25rem 0;
  border: none;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  text-align: left;

  &:hover {
    background-color: ${props => props.theme.hover};
    color: ${props => props.theme.primary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

function Header({ isDarkMode, toggleDarkMode, user, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const location = useLocation();
  const hoverTimeoutRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleMouseEnter = (menuName) => {
    // Clear any existing timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }

    // Set a new timeout to activate the menu after 200ms
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMenu(menuName);
    }, 200);
  };

  const handleMouseLeave = () => {
    // Clear the timeout if mouse leaves before 200ms
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleHeaderLeave = () => {
    // Clear any pending hover timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Start a timeout to close the menu after leaving the header
    closeTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 300);
  };

  const handleMenuEnter = () => {
    // Cancel the close timeout if entering the menu
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  const handleMenuClose = () => {
    setActiveMenu(null);
    // Clear any pending timeouts
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <HeaderWrapper $isDarkMode={isDarkMode} onMouseLeave={handleHeaderLeave}>
        <HeaderContent>
          <Logo to="/">
            <RifimLogo />
            RIFIM
          </Logo>

          {/* MENU DESKTOP */}
          <DesktopNav>
            <NavItem
              onMouseEnter={() => handleMouseEnter('questionnaires')}
              onMouseLeave={handleMouseLeave}
            >
              <FileText />
              Compte-rendu
            </NavItem>
            <NavItem
              onMouseEnter={() => handleMouseEnter('cases')}
              onMouseLeave={handleMouseLeave}
            >
              <FolderOpen />
              Cas
            </NavItem>
            <NavItem
              onMouseEnter={() => handleMouseEnter('protocols')}
              onMouseLeave={handleMouseLeave}
            >
              <BookOpen />
              Protocoles
            </NavItem>
          </DesktopNav>

          {/* SECTION DROITE */}
          <UserSection>
            <ThemeToggle onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </ThemeToggle>

            <UserNavItem
              onMouseEnter={() => handleMouseEnter('user')}
              onMouseLeave={handleMouseLeave}
            >
              <User />
              {user?.username}
            </UserNavItem>

            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </MobileMenuButton>
          </UserSection>
        </HeaderContent>
      </HeaderWrapper>

      {/* MEGA MENUS AVEC LES BONS LIENS */}
      
      {/* QUESTIONNAIRES */}
      <MegaMenuOverlay
        style={{
          opacity: activeMenu === 'questionnaires' ? 1 : 0,
          visibility: activeMenu === 'questionnaires' ? 'visible' : 'hidden',
          pointerEvents: activeMenu === 'questionnaires' ? 'auto' : 'none'
        }}
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuClose}
      >
        <MegaMenuContent>
          <MegaMenuItem to="/questionnaires">
            <MegaMenuItemIcon>
              <FileText />
              Gérer les questionnaires
            </MegaMenuItemIcon>
            <MegaMenuItemDesc>
              Créez et gérez vos questionnaires personnalisés
            </MegaMenuItemDesc>
          </MegaMenuItem>
          <MegaMenuItem to="/questionnaires-list">
            <MegaMenuItemIcon>
              <FileText />
              Mes Questionnaires
            </MegaMenuItemIcon>
            <MegaMenuItemDesc>
              Accédez à tous vos questionnaires personnels
            </MegaMenuItemDesc>
          </MegaMenuItem>
          <MegaMenuItem to="/public-questionnaires">
            <MegaMenuItemIcon>
              <Users />
              Questionnaires Publics
            </MegaMenuItemIcon>
            <MegaMenuItemDesc>
              Explorez les questionnaires partagés par la communauté
            </MegaMenuItemDesc>
          </MegaMenuItem>
        </MegaMenuContent>
      </MegaMenuOverlay>

      {/* CAS */}
      <MegaMenuOverlay
        style={{
          opacity: activeMenu === 'cases' ? 1 : 0,
          visibility: activeMenu === 'cases' ? 'visible' : 'hidden',
          pointerEvents: activeMenu === 'cases' ? 'auto' : 'none'
        }}
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuClose}
      >
        <MegaMenuContent>
          <MegaMenuItem to="/cases">
            <MegaMenuItemIcon>
              <FolderOpen />
              Gérer les Cas
            </MegaMenuItemIcon>
            <MegaMenuItemDesc>
              Organisez et administrez vos cas cliniques
            </MegaMenuItemDesc>
          </MegaMenuItem>
          <MegaMenuItem to="/cases-list">
            <MegaMenuItemIcon>
              <FolderOpen />
              Mes Cas
            </MegaMenuItemIcon>
            <MegaMenuItemDesc>
              Gérez votre collection de cas cliniques personnels
            </MegaMenuItemDesc>
          </MegaMenuItem>
          <MegaMenuItem to="/public-cases">
            <MegaMenuItemIcon>
              <Users />
              Cas Publics
            </MegaMenuItemIcon>
            <MegaMenuItemDesc>
              Découvrez les cas partagés par la communauté
            </MegaMenuItemDesc>
          </MegaMenuItem>
        </MegaMenuContent>
      </MegaMenuOverlay>

      {/* PROTOCOLES */}
      <MegaMenuOverlay
        style={{
          opacity: activeMenu === 'protocols' ? 1 : 0,
          visibility: activeMenu === 'protocols' ? 'visible' : 'hidden',
          pointerEvents: activeMenu === 'protocols' ? 'auto' : 'none'
        }}
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuClose}
      >
        <MegaMenuContent>
          <MegaMenuItem to="/protocols/create">
            <MegaMenuItemIcon>
              <BookOpen />
              Créer un Protocole
            </MegaMenuItemIcon>
            <MegaMenuItemDesc>
              Créez un nouveau protocole médical personnalisé
            </MegaMenuItemDesc>
          </MegaMenuItem>
          <MegaMenuItem to="/protocols/personal">
            <MegaMenuItemIcon>
              <BookOpen />
              Mes Protocoles
            </MegaMenuItemIcon>
            <MegaMenuItemDesc>
              Accédez à vos protocoles personnels
            </MegaMenuItemDesc>
          </MegaMenuItem>
          <MegaMenuItem to="/protocols/public">
            <MegaMenuItemIcon>
              <Users />
              Protocoles Publics
            </MegaMenuItemIcon>
            <MegaMenuItemDesc>
              Explorez les protocoles de la communauté
            </MegaMenuItemDesc>
          </MegaMenuItem>
        </MegaMenuContent>
      </MegaMenuOverlay>

      {/* MENU UTILISATEUR */}
      <UserMegaMenu
        style={{
          opacity: activeMenu === 'user' ? 1 : 0,
          visibility: activeMenu === 'user' ? 'visible' : 'hidden',
          pointerEvents: activeMenu === 'user' ? 'auto' : 'none'
        }}
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuClose}
      >
        <UserMegaMenuContent>
          <UserMegaMenuItem to="/statistics">
            <BarChart3 />
            Statistiques
          </UserMegaMenuItem>
          <UserMegaMenuButton onClick={onLogout}>
            <LogOut />
            Déconnexion
          </UserMegaMenuButton>
        </UserMegaMenuContent>
      </UserMegaMenu>

      {/* MENU MOBILE */}
      <MobileMenu $isOpen={mobileMenuOpen}>
        <MobileNavSection>
          <MobileSectionTitle>
            <FileText />
            Compte-rendu
          </MobileSectionTitle>
          <MobileNavItem to="/questionnaires">
            <FileText />
            Gérer les questionnaires
          </MobileNavItem>
          <MobileNavItem to="/questionnaires-list">
            <FileText />
            Mes Questionnaires
          </MobileNavItem>
          <MobileNavItem to="/public-questionnaires">
            <Users />
            Questionnaires Publics
          </MobileNavItem>
        </MobileNavSection>

        <MobileNavSection>
          <MobileSectionTitle>
            <FolderOpen />
            Cas
          </MobileSectionTitle>
          <MobileNavItem to="/cases">
            <FolderOpen />
            Gérer les Cas
          </MobileNavItem>
          <MobileNavItem to="/cases-list">
            <FolderOpen />
            Mes Cas
          </MobileNavItem>
          <MobileNavItem to="/public-cases">
            <Users />
            Cas Publics
          </MobileNavItem>
        </MobileNavSection>

        <MobileNavSection>
          <MobileSectionTitle>
            <BookOpen />
            Protocoles
          </MobileSectionTitle>
          <MobileNavItem to="/protocols/create">
            <BookOpen />
            Créer un Protocole
          </MobileNavItem>
          <MobileNavItem to="/protocols/personal">
            <BookOpen />
            Mes Protocoles
          </MobileNavItem>
          <MobileNavItem to="/protocols/public">
            <Users />
            Protocoles Publics
          </MobileNavItem>
        </MobileNavSection>

        <MobileUserSection>
          <MobileSectionTitle>
            <User />
            {user?.username}
          </MobileSectionTitle>
          <MobileUserButton as={Link} to="/statistics">
            <BarChart3 />
            Statistiques
          </MobileUserButton>
          <MobileUserButton onClick={() => { onLogout(); setMobileMenuOpen(false); }}>
            <LogOut />
            Déconnexion
          </MobileUserButton>
          <MobileUserButton onClick={toggleDarkMode}>
            {isDarkMode ? <Sun /> : <Moon />}
            {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
          </MobileUserButton>
        </MobileUserSection>
      </MobileMenu>
    </>
  );
}

export default Header;