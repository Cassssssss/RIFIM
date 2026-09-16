// src/components/Sidebar.js
// =============================================================================
// NAVIGATION PRINCIPALE — colonne latérale gauche (remplace les méga-menus
// horizontaux).
//
// Desktop  : rail fixe à gauche, repliable (large 260px / étroit 76px).
//            La largeur réelle est publiée dans --app-rail-w, que GlobalStyle
//            utilise pour décaler le contenu : un seul endroit à changer.
// Mobile   : le rail devient un tiroir coulissant, ouvert par la barre du haut.
//            --app-rail-w repasse à 0 pour que le contenu occupe tout l'écran.
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Moon, Sun, Menu, X, User, LogOut, FileText, FolderOpen, BookOpen,
  Users, BarChart3, Home, PlusCircle, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react';
import RifimLogo from './shared/Logo';

const RAIL_WIDE = 260;
const RAIL_NARROW = 76;
const TOPBAR_H = 60;
const MOBILE = 900; // au-dessous : tiroir coulissant

// ---------------------------------------------------------------- structure

const Rail = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: ${(p) => (p.$collapsed ? RAIL_NARROW : RAIL_WIDE)}px;
  display: flex;
  flex-direction: column;
  background: ${(p) => p.theme.headerBackgroundSolid};
  border-right: 1px solid ${(p) => p.theme.border};
  z-index: 999998;
  transition: width 0.22s ease, transform 0.25s ease;
  padding-left: env(safe-area-inset-left);

  @media (max-width: ${MOBILE}px) {
    width: ${RAIL_WIDE}px;
    transform: translateX(${(p) => (p.$open ? '0' : '-100%')});
    box-shadow: ${(p) => (p.$open ? `0 0 40px ${p.theme.shadowStrong || 'rgba(0,0,0,.35)'}` : 'none')};
  }
`;

const Scrim = styled.div`
  display: none;

  @media (max-width: ${MOBILE}px) {
    display: ${(p) => (p.$open ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(2px);
    z-index: 999997;
  }
`;

const RailHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  height: ${TOPBAR_H}px;
  flex: 0 0 auto;
  padding: 0 0.75rem;
  border-bottom: 1px solid ${(p) => p.theme.borderLight};

  /* Replié, la largeur (76px) ne suffit pas à poser le logo ET le bouton côte
     à côte : le logo se faisait écraser à zéro. On les empile. */
  ${(p) =>
    p.$collapsed &&
    `
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem;
    height: auto;
    padding: 0.6rem 0.25rem;
  `}

  /* Plier/déplier n'a de sens que pour le rail ancré (desktop) ; dans le
     tiroir mobile, le bouton utile est « fermer ». */
  .rail-close {
    display: none;
  }

  @media (max-width: ${MOBILE}px) {
    .rail-collapse {
      display: none;
    }
    .rail-close {
      display: inline-flex;
    }
  }
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-width: 0;
  padding: 0.35rem;
  border-radius: ${(p) => p.theme.radii.md};
  color: ${(p) => p.theme.text};
  font-family: ${(p) => p.theme.fonts.heading};
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: -0.05em;
  text-decoration: none;

  svg {
    flex: 0 0 auto;
  }

  ${(p) => p.$collapsed && 'gap: 0; padding: 0.35rem 0;'}

  span {
    white-space: nowrap;
    overflow: hidden;
  }

  &:hover {
    color: ${(p) => p.theme.primary};
  }
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: ${(p) => p.theme.radii.md};
  background: transparent;
  color: ${(p) => p.theme.textSecondary};
  cursor: pointer;
  transition: background 0.18s ease, color 0.18s ease;

  &:hover {
    background: ${(p) => p.theme.hover};
    color: ${(p) => p.theme.text};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const RailNav = styled.nav`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1.25rem 0.8rem 1rem;
`;

const Section = styled.div`
  & + & {
    margin-top: 1.15rem;
  }
`;

const SectionLabel = styled.div`
  padding: 0.5rem 0.65rem 0.3rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: ${(p) => p.theme.textSecondary};
  white-space: nowrap;
  overflow: hidden;

  /* Replié : on garde un filet de séparation à la place du libellé, pour ne
     pas laisser les groupes se toucher visuellement. */
  ${(p) =>
    p.$collapsed &&
    `
    height: 1px;
    padding: 0;
    margin: 0.7rem 0.75rem 0.5rem;
    background: ${p.theme.borderLight};
    color: transparent;
  `}
`;

const Item = styled(NavLink)`
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.65rem;
  margin: 0.12rem 0;
  border-radius: ${(p) => p.theme.radii.md};
  color: ${(p) => p.theme.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  transition: background 0.16s ease, color 0.16s ease;

  ${(p) => p.$collapsed && 'justify-content: center; padding: 0.6rem 0;'}

  svg {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    color: ${(p) => p.theme.textLight};
    transition: color 0.16s ease;
  }

  &:hover {
    background: ${(p) => p.theme.hover};
    color: ${(p) => p.theme.text};
  }

  &:hover svg {
    color: ${(p) => p.theme.primary};
  }

  /* NavLink v6 pose « active » tout seul sur la route courante. */
  &.active {
    background: ${(p) => p.theme.primary}12;
    color: ${(p) => p.theme.primary};
    font-weight: 600;
    box-shadow: inset 2px 0 0 ${(p) => p.theme.primary};
  }
  &.active svg, &.active:hover svg { color: ${(p) => p.theme.primary}; }
  &.active:hover { background: ${(p) => p.theme.primary}1c; }

`;

const ItemLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RailFoot = styled.div`
  flex: 0 0 auto;
  padding: 0.6rem;
  padding-bottom: calc(0.6rem + env(safe-area-inset-bottom));
  border-top: 1px solid ${(p) => p.theme.borderLight};
`;

const UserRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.65rem;
  margin-bottom: 0.35rem;
  border-radius: ${(p) => p.theme.radii.md};
  background: ${(p) => p.theme.cardSecondary};
  color: ${(p) => p.theme.text};
  font-size: 0.85rem;
  font-weight: 600;
  overflow: hidden;
  white-space: nowrap;

  ${(p) => p.$collapsed && 'justify-content: center; padding: 0.5rem 0;'}

  svg {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    color: ${(p) => p.theme.primary};
  }
`;

const FootButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  width: 100%;
  padding: 0.55rem 0.65rem;
  margin: 0.12rem 0;
  border: none;
  border-radius: ${(p) => p.theme.radii.md};
  background: transparent;
  color: ${(p) => p.theme.textSecondary};
  font-size: 0.9rem;
  font-weight: 500;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  transition: background 0.16s ease, color 0.16s ease;

  ${(p) => p.$collapsed && 'justify-content: center; padding: 0.55rem 0;'}

  svg {
    flex: 0 0 auto;
    width: 18px;
    height: 18px;
    color: ${(p) => p.theme.textLight};
  }

  &:hover {
    background: ${(p) => p.theme.hover};
    color: ${(p) => p.theme.text};
  }

  &:hover svg {
    color: ${(p) => p.theme.primary};
  }
`;

// Barre du haut, uniquement sous le point de rupture mobile.
const TopBar = styled.header`
  display: none;

  @media (max-width: ${MOBILE}px) {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: ${TOPBAR_H}px;
    padding: 0 0.75rem;
    padding-left: calc(0.75rem + env(safe-area-inset-left));
    padding-right: calc(0.75rem + env(safe-area-inset-right));
    background: ${(p) => p.theme.headerBackground};
    backdrop-filter: ${(p) => p.theme.headerBlur};
    -webkit-backdrop-filter: ${(p) => p.theme.headerBlur};
    border-bottom: 1px solid ${(p) => p.theme.border};
    color: ${(p) => p.theme.headerText};
    z-index: 999996;
  }
`;

const TopBarSpacer = styled.div`
  flex: 1 1 auto;
`;

// ------------------------------------------------------------------ données

const SECTIONS = [
  {
    label: 'Compte-rendu',
    items: [
      { to: '/questionnaires', label: 'Gérer les questionnaires', icon: FileText },
      { to: '/questionnaires-list', label: 'Mes questionnaires', icon: FileText },
      { to: '/public-questionnaires', label: 'Questionnaires publics', icon: Users },
    ],
  },
  {
    label: 'Cas',
    items: [
      { to: '/cases', label: 'Gérer les cas', icon: FolderOpen },
      { to: '/cases-list', label: 'Mes cas', icon: FolderOpen },
      { to: '/public-cases', label: 'Cas publics', icon: Users },
    ],
  },
  {
    label: 'Protocoles',
    items: [
      { to: '/protocols/create', label: 'Créer un protocole', icon: PlusCircle },
      { to: '/protocols/personal', label: 'Mes protocoles', icon: BookOpen },
      { to: '/protocols/public', label: 'Protocoles publics', icon: Users },
    ],
  },
];

// ---------------------------------------------------------------- composant

function Sidebar({ isDarkMode, toggleDarkMode, userName, user, onLogout }) {
  const name = userName || user?.username || '';
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem('railCollapsed') === '1'
  );
  const [open, setOpen] = useState(false);
  const [narrow, setNarrow] = useState(
    () => typeof window !== 'undefined'
      && window.matchMedia(`(max-width: ${MOBILE}px)`).matches
  );

  // Suivi du point de rupture : le rendu (bouton replier, libellés) en dépend,
  // donc il doit vivre dans l'état et pas être relu à la volée au render.
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE}px)`);
    const onChange = (e) => setNarrow(e.matches);
    mq.addEventListener('change', onChange);
    setNarrow(mq.matches);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Largeur publiée pour le reste de l'app (cf. GlobalStyle). Sur mobile le
  // rail flotte au-dessus du contenu : la réserve d'espace doit valoir 0.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty(
      '--app-rail-w',
      narrow ? '0px' : `${collapsed ? RAIL_NARROW : RAIL_WIDE}px`
    );
    root.style.setProperty('--app-topbar-h', narrow ? `${TOPBAR_H}px` : '0px');
  }, [collapsed, narrow]);

  // Un changement de route ferme le tiroir mobile.
  useEffect(() => {
    setOpen(false);
  }, [location]);

  // Échap ferme le tiroir ; on verrouille le défilement pendant qu'il est ouvert.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((c) => {
      localStorage.setItem('railCollapsed', c ? '0' : '1');
      return !c;
    });
  }, []);

  // Replié ne concerne que le desktop : dans le tiroir mobile, tout est déplié.
  const folded = collapsed && !narrow;

  const renderItem = ({ to, label, icon: Icon }) => (
    <Item
      key={to}
      to={to}
      end={to === '/'}
      $collapsed={folded}
      title={folded ? label : undefined}
      aria-label={label}
    >
      <Icon />
      {!folded && <ItemLabel>{label}</ItemLabel>}
    </Item>
  );

  return (
    <>
      <TopBar>
        <IconButton onClick={() => setOpen(true)} aria-label="Ouvrir la navigation">
          <Menu />
        </IconButton>
        <Brand to="/" $collapsed={false}>
          <RifimLogo />
          <span>RIFIM</span>
        </Brand>
        <TopBarSpacer />
        <IconButton
          onClick={toggleDarkMode}
          aria-label={isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </IconButton>
      </TopBar>

      <Scrim $open={open} onClick={() => setOpen(false)} />

      <Rail $collapsed={folded} $open={open} inert={narrow && !open ? "" : undefined} aria-label="Navigation principale">
        <RailHead $collapsed={folded}>
          <Brand to="/" $collapsed={folded} title={folded ? 'RIFIM — accueil' : undefined}>
            <RifimLogo />
            {!folded && <span>RIFIM</span>}
          </Brand>

          {/* Plier/déplier sur desktop, fermer le tiroir sur mobile. */}
          <IconButton
            className="rail-collapse"
            onClick={toggleCollapsed}
            aria-label={folded ? 'Déplier la navigation' : 'Replier la navigation'}
            title={folded ? 'Déplier' : 'Replier'}
          >
            {folded ? <PanelLeftOpen /> : <PanelLeftClose />}
          </IconButton>
          <IconButton
            className="rail-close"
            onClick={() => setOpen(false)}
            aria-label="Fermer la navigation"
          >
            <X />
          </IconButton>
        </RailHead>

        <RailNav>
          <Section>
            {renderItem({ to: '/', label: 'Accueil', icon: Home })}
          </Section>

          {SECTIONS.map((section) => (
            <Section key={section.label}>
              <SectionLabel $collapsed={folded}>{section.label}</SectionLabel>
              {section.items.map(renderItem)}
            </Section>
          ))}

          <Section>
            <SectionLabel $collapsed={folded}>Suivi</SectionLabel>
            {renderItem({ to: '/statistics', label: 'Statistiques', icon: BarChart3 })}
          </Section>
        </RailNav>

        <RailFoot>
          {name && (
            <UserRow $collapsed={folded} title={folded ? name : undefined}>
              <User />
              {!folded && <ItemLabel>{name}</ItemLabel>}
            </UserRow>
          )}

          <FootButton
            $collapsed={folded}
            onClick={toggleDarkMode}
            title={folded ? (isDarkMode ? 'Mode clair' : 'Mode sombre') : undefined}
          >
            {isDarkMode ? <Sun /> : <Moon />}
            {!folded && <ItemLabel>{isDarkMode ? 'Mode clair' : 'Mode sombre'}</ItemLabel>}
          </FootButton>

          <FootButton
            $collapsed={folded}
            onClick={onLogout}
            title={folded ? 'Déconnexion' : undefined}
          >
            <LogOut />
            {!folded && <ItemLabel>Déconnexion</ItemLabel>}
          </FootButton>
        </RailFoot>
      </Rail>
    </>
  );
}

export default Sidebar;
