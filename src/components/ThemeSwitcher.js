// src/components/ThemeSwitcher.js
// Sélecteur flottant pour comparer les styles du site en direct.
// N'altère aucune logique métier : il ne fait que changer le style actif.
//
// La liste est passée à une quarantaine d'entrées : elle est donc regroupée
// par famille, filtrable, et chaque option montre un aperçu des couleurs du
// style dans le mode courant (clair/sombre) plutôt qu'un simple émoji.
import React, { useState, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Palette, X, Check, Search } from 'lucide-react';
import { themes, styleGroups } from '../themes';

const FloatingButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 2000000;
  width: 52px;
  height: 52px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  border: 2px solid ${({ theme }) => theme.card};
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.08);
  }

  @media print {
    display: none;
  }
`;

const Panel = styled.div`
  position: fixed;
  bottom: 84px;
  right: 20px;
  z-index: 2000000;
  width: 340px;
  max-width: calc(100vw - 40px);
  max-height: min(560px, calc(100vh - 120px));
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;

  @media print {
    display: none;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};
`;

const Title = styled.span`
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textSecondary};
`;

const Count = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textLight};
  margin-left: 6px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  display: flex;
  padding: 2px;

  &:hover {
    color: ${({ theme }) => theme.text};
  }
`;

const SearchRow = styled.div`
  position: relative;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.borderLight};

  svg {
    position: absolute;
    left: 24px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px;
    height: 15px;
    color: ${({ theme }) => theme.textLight};
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 8px 10px 8px 32px;
    font-size: 0.85rem;
    border-radius: ${({ theme }) => theme.radii.md};
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.cardSecondary};
    color: ${({ theme }) => theme.text};
  }
`;

const ScrollArea = styled.div`
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 10px 12px;
`;

const GroupLabel = styled.div`
  padding: 10px 4px 5px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textLight};
`;

const StyleOption = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 8px 10px;
  margin: 2px 0;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.primary : 'transparent')};
  background: ${({ $active, theme }) => ($active ? theme.hover : 'transparent')};
  color: ${({ theme }) => theme.text};
  font-size: 0.88rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.hover};
  }
`;

// Aperçu : fond du style + ses trois couleurs de caractère. Bien plus parlant
// qu'un émoji pour choisir, surtout entre deux variantes proches.
const Swatch = styled.span`
  display: flex;
  align-items: center;
  gap: 3px;
  flex: 0 0 auto;
  padding: 4px 5px;
  border-radius: 7px;
  background: ${({ $bg }) => $bg};
  border: 1px solid ${({ $border }) => $border};
`;

const Dot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 9999px;
  background: ${({ $c }) => $c};
`;

const Name = styled.span`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Empty = styled.div`
  padding: 20px 8px;
  text-align: center;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.textLight};
`;

// Accents insensible à la casse : « thème » se trouve en tapant « theme ».
const normalize = (s) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function ThemeSwitcher({ currentStyle, onChangeStyle, isDarkMode }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const mode = isDarkMode ? 'dark' : 'light';

  const groups = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return styleGroups;
    return styleGroups
      .map((g) => ({
        ...g,
        styles: g.styles.filter((s) => normalize(s.name).includes(q)),
      }))
      .filter((g) => g.styles.length > 0);
  }, [query]);

  const total = useMemo(
    () => groups.reduce((n, g) => n + g.styles.length, 0),
    [groups]
  );

  // Clic à l'extérieur + Échap : le panneau flotte au-dessus de toute l'app,
  // il ne doit pas rester coincé à l'écran.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (buttonRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      {open && (
        <Panel ref={panelRef} role="dialog" aria-label="Sélecteur de style">
          <PanelHeader>
            <Title>
              Style du site
              <Count>{total}</Count>
            </Title>
            <CloseButton onClick={() => setOpen(false)} aria-label="Fermer">
              <X size={16} />
            </CloseButton>
          </PanelHeader>

          <SearchRow>
            <Search />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un style…"
              aria-label="Rechercher un style"
            />
          </SearchRow>

          <ScrollArea>
            {groups.length === 0 && <Empty>Aucun style ne correspond.</Empty>}

            {groups.map((group) => (
              <div key={group.id}>
                <GroupLabel>{group.label}</GroupLabel>
                {group.styles.map((s) => {
                  const active = s.id === currentStyle;
                  const t = themes[s.id][mode];
                  return (
                    <StyleOption
                      key={s.id}
                      $active={active}
                      onClick={() => onChangeStyle(s.id)}
                    >
                      <Swatch $bg={t.background} $border={t.border}>
                        <Dot $c={t.primary} />
                        <Dot $c={t.secondary} />
                        <Dot $c={t.accent} />
                      </Swatch>
                      <Name>{s.name}</Name>
                      {active && <Check size={15} />}
                    </StyleOption>
                  );
                })}
              </div>
            ))}
          </ScrollArea>
        </Panel>
      )}

      <FloatingButton
        ref={buttonRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Changer le style du site"
        title="Changer le style du site"
      >
        <Palette size={22} />
      </FloatingButton>
    </>
  );
}

export default ThemeSwitcher;
