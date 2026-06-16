// src/components/ThemeSwitcher.js
// Sélecteur flottant pour comparer les styles du site en direct.
// N'altère aucune logique métier : il ne fait que changer le style actif.
import React, { useState } from 'react';
import styled from 'styled-components';
import { Palette, X, Check } from 'lucide-react';
import { styleList } from '../themes';

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
  color: #ffffff;
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
  width: 260px;
  max-width: calc(100vw - 40px);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.cardHover};
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  animation: fadeIn 0.2s ease-out;

  @media print {
    display: none;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const Title = styled.span`
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.textSecondary};
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

const StyleOption = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1.5px solid ${({ $active, theme }) => ($active ? theme.primary : theme.border)};
  background: ${({ $active, theme }) => ($active ? theme.hover : theme.card)};
  color: ${({ theme }) => theme.text};
  font-size: 0.9rem;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.hover};
  }
`;

const Emoji = styled.span`
  font-size: 1.1rem;
  line-height: 1;
`;

const Name = styled.span`
  flex: 1;
`;

function ThemeSwitcher({ currentStyle, onChangeStyle }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <Panel role="dialog" aria-label="Sélecteur de style">
          <PanelHeader>
            <Title>Style du site</Title>
            <CloseButton onClick={() => setOpen(false)} aria-label="Fermer">
              <X size={16} />
            </CloseButton>
          </PanelHeader>
          {styleList.map((s) => {
            const active = s.id === currentStyle;
            return (
              <StyleOption
                key={s.id}
                $active={active}
                onClick={() => onChangeStyle(s.id)}
              >
                <Emoji>{s.emoji}</Emoji>
                <Name>{s.name}</Name>
                {active && <Check size={16} />}
              </StyleOption>
            );
          })}
        </Panel>
      )}
      <FloatingButton
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
