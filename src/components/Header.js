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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999998; /* Juste en dessous du menu */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  
  /* Mobile optimizations */
  @media (max-width: 768px) {
    padding: 0.5rem 0;
    /* Support pour les safe areas iPhone */
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    
    /* 🔧 CORRECTION ULTRA-ROBUSTE : Fix pour la disparition du header sur mobile */
    transform: translate3d(0, 0, 0) !important;
    -webkit-transform: translate3d(0, 0, 0) !important;
    will-change: transform !important;
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
    
    /* 🔧 POSITION FIXE BLINDÉE */
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    
    /* 🔧 VISIBILITÉ FORCÉE */
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    
    /* 🔧 HAUTEUR STABLE */
    height: 60px !important;
    min-height: 60px !important;
    max-height: 60px !important;
    
    /* Améliore le rendu sur iOS Safari */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    
    /* 🔧 PROTECTION CONTRE LE SCROLL BOUNCE */
    contain: layout style paint;
    isolation: isolate;
  }

  /* ======================================================================================== */
  /* 🌟 MOBILE PAYSAGE - HEADER COMPACT MAIS TOUJOURS VISIBLE 🌟 */
  /* ======================================================================================== */
  
  @media (max-width: 1024px) and (orientation: landscape) {
    /* 🔧 HEADER COMPACT en mode paysage mobile MAIS TOUJOURS FIXÉ */
    padding: 0.25rem 0;
    min-height: 50px !important;
    height: 50px !important;
    
    /* 🔧 FORCE position fixe en paysage aussi */
    position: fixed !important;
    top: 0 !important;
    transform: translate3d(0, 0, 0) !important;
    -webkit-transform: translate3d(0, 0, 0) !important;
    
    /* Support pour les safe areas en paysage */
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
    padding-top: calc(0.25rem + env(safe-area-inset-top));
  }
  
  @media (max-width: 896px) and (orientation: landscape) and (max-height: 414px) {
    /* 🔧 ENCORE PLUS COMPACT pour iPhone en paysage MAIS TOUJOURS FIXÉ */
    padding: 0.25rem 0;
    min-height: 45px !important;
    height: 45px !important;
    
    /* 🔧 FORCE position fixe */
    position: fixed !important;
    top: 0 !important;
    transform: translate3d(0, 0, 0) !important;
    -webkit-transform: translate3d(0, 0, 0) !important;
  }
  
  /* ======================================================================================== */
  /* 🌟 FIN DE LA SECTION MODE PAYSAGE 🌟 */
  /* ======================================================================================== */
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 2500px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 0.5rem;
    height: 100%;
  }

  /* Mobile paysage */
  @media (max-width: 1024px) and (orientation: landscape) {
    padding: 0 0.75rem;
    gap: 0.25rem;
    height: 100%;
  }
  
  @media (max-width: 896px) and (orientation: landscape) and (max-height: 414px) {
    padding: 0 0.5rem;
    gap: 0.15rem;
    height: 100%;
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
    
    span {
      @media (max-width: 480px) {
        display: none;
      }
    }
  }

  /* Mobile paysage */
  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 1rem;
    gap: 0.2rem;
    
    svg {
      width: 18px;
      height: 18px;
    }
    
    span {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 896px) and (orientation: landscape) and (max-height: 414px) {
    font-size: 0.9rem;
    
    svg {
      width: 16px;
      height: 16px;
    }
    
    span {
      font-size: 0.8rem;
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
    
    @media (max-width: 480px) {
      display: none;
    }
  }

  /* Mobile paysage */
  @media (max-width: 1024px) and (orientation: landscape) {
    font-size: 0.9rem;
    gap: 0.2rem;
  }
  
  @media (max-width: 896px) and (orientation: landscape) and (max-height: 414px) {
    display: none;
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

  /* Mobile paysage */
  @media (max-width: 1024px) and (orientation: landscape) {
    gap: 0.25rem;
  }
  
  @media (max-width: 896px) and (orientation: landscape) and (max-height: 414px) {
    gap: 0.15rem;
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
    
    &:hover {
      transform: none;
    }
  }

  /* Mobile paysage */
  @media (max-width: 1024px) and (orientation: landscape) {
    padding: 0.3rem;
    min-height: 32px;
    min-width: 32px;
    border-radius: 6px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  }
  
  @media (max-width: 896px) and (orientation: landscape) and (max-height: 414px) {
    padding: 0.25rem;
    min-height: 28px;
    min-width: 28px;
    
    svg {
      width: 14px;
      height: 14px;
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
    
    &:hover {
      transform: none;
    }
    
    span {
      @media (max-width: 480px) {
        display: none;
      }
    }
  }

  /* Mobile paysage */
  @media (max-width: 1024px) and (orientation: landscape) {
    padding: 0.3rem;
    gap: 0.2rem;
    min-height: 32px;
    border-radius: 6px;
    font-size: 0.85rem;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
  
  @media (max-width: 896px) and (orientation: landscape) and (max-height: 414px) {
    padding: 0.25rem;
    min-height: 28px;
    font-size: 0.75rem;
    
    span {
      display: none;
    }
    
    svg {
      width: 12px;
      height: 12px;
    }
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
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 99999;
  min-width: 280px;
  backdrop-filter: blur(8px);
  animation: ${props => props.$isOpen ? 'dropdownSlideIn' : 'dropdownSlideOut'} 0.2s ease;
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
  
  @media (max-width: 768px) {
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
    z-index: 999999;
    max-height: none;
    border: none;
    
    padding-top: calc(1rem + env(safe-area-inset-top));
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
    padding-left: calc(1rem + env(safe-area-inset-left));
    padding-right: calc(1rem + env(safe-area-inset-right));
    
    animation: ${props => props.$isOpen ? 'mobileSlideIn' : 'mobileSlideOut'} 0.3s ease;
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
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0 0 0.5rem 0;
    border-radius: 12px;
    font-size: 1rem;
    min-height: 56px;
    
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
  
  @media (max-width: 768px) {
    padding: 1rem;
    margin: 0;
    border-radius: 12px;
    font-size: 1rem;
    min-height: 56px;
    
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
    
    if (!showMenu) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }
  };

  const handleMenuItemClick = () => {
    setShowMenu(false);
    document.body.classList.remove('menu-open');
  };

  // 🔧 EFFECT ULTRA-ROBUSTE : Force le header TOUJOURS visible
  useEffect(() => {
    const forceHeaderVisible = () => {
      const header = document.querySelector('header');
      if (header && window.innerWidth <= 768) {
        // 🔧 FORCE TOUS LES STYLES CRITIQUES SANS EXCEPTION
        header.style.cssText += `
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100vw !important;
          z-index: 999998 !important;
          transform: translate3d(0, 0, 0) !important;
          -webkit-transform: translate3d(0, 0, 0) !important;
          will-change: transform !important;
          backface-visibility: hidden !important;
          -webkit-backface-visibility: hidden !important;
          display: block !important;
          visibility: visible !important;
          opacity: 1 !important;
          contain: layout style paint !important;
          isolation: isolate !important;
        `;
      }
    };

    // 🔧 FORCE IMMÉDIATEMENT ET RÉPÉTITIVEMENT
    forceHeaderVisible();
    
    // 🔧 MULTIPLE LISTENERS POUR COUVRIR TOUS LES CAS
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        requestAnimationFrame(forceHeaderVisible);
      }
    };

    const handleResize = () => {
      setTimeout(forceHeaderVisible, 10);
    };

    const handleOrientationChange = () => {
      setTimeout(forceHeaderVisible, 100);
      setTimeout(forceHeaderVisible, 500);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setTimeout(forceHeaderVisible, 50);
      }
    };

    const handleFocus = () => {
      setTimeout(forceHeaderVisible, 50);
    };

    // 🔧 AJOUT DE TOUS LES LISTENERS POSSIBLES
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', forceHeaderVisible);
    
    // 🔧 FORCE PÉRIODIQUEMENT (toutes les 2 secondes en cas d'urgence)
    const interval = setInterval(forceHeaderVisible, 2000);
    
    // 🔧 FORCE APRÈS DÉLAIS DE SÉCURITÉ
    const timeouts = [
      setTimeout(forceHeaderVisible, 100),
      setTimeout(forceHeaderVisible, 500),
      setTimeout(forceHeaderVisible, 1000),
      setTimeout(forceHeaderVisible, 2000)
    ];
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', forceHeaderVisible);
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
        document.body.classList.remove('menu-open');
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('menu-open');
    };
  }, [showMenu]);

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

          <DropdownMenu $isOpen={showMenu}>
            <MobileMenuHeader>
              <MobileMenuTitle>Menu</MobileMenuTitle>
              <MobileCloseButton onClick={handleMenuItemClick}>
                <X size={24} />
              </MobileCloseButton>
            </MobileMenuHeader>

            {userName && (
              <>
                <UserInfo>
                  <User size={18} />
                  Connecté en tant que <strong>{userName}</strong>
                </UserInfo>
                <MenuDivider />
              </>
            )}

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