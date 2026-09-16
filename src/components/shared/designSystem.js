import { css } from 'styled-components';

export const pageLayout = css`
  width: 100%;
  min-width: 0;
  padding: 0 0 2rem;
  color: ${({ theme }) => theme.text};
`;

export const pageHeading = css`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  text-align: left;
`;

export const pageTitle = css`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: clamp(1.55rem, 2.2vw, 1.95rem);
  font-weight: 600;
  letter-spacing: -0.035em;
  line-height: 1.2;
  color: ${({ theme }) => theme.text};
  margin: 0;
  overflow-wrap: anywhere;
`;

export const surface = css`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radii.card};
  box-shadow: ${({ theme }) => theme.shadows.card};
`;

// Shared controls: restrained secondary actions, one clear primary action.
export const control = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  min-height: 34px;
  min-width: 0;
  padding: 0.4rem 0.7rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 7px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text};
  font: inherit;
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1.35;
  letter-spacing: 0;
  text-transform: none;
  text-decoration: none;
  box-shadow: none;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;
  svg { width: 15px; height: 15px; flex-shrink: 0; stroke-width: 1.7; }
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.hover};
    border-color: ${({ theme }) => theme.textLight};
    color: ${({ theme }) => theme.text};
    box-shadow: none;
    transform: none;
  }
  &:focus-visible { outline: 2px solid ${({ theme }) => theme.primary}; outline-offset: 3px; }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
  @media (pointer: coarse) { min-height: 44px; }
`;

export const primaryControl = css`
  ${control}
  background: ${({ theme }) => theme.primary};
  border-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.buttonText};
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primaryHover};
    border-color: ${({ theme }) => theme.primaryHover};
    color: ${({ theme }) => theme.buttonText};
  }
`;

export const quietControl = css`
  ${control}
  background: transparent;
  border-color: transparent;
  color: ${({ theme }) => theme.textSecondary};
  &:hover:not(:disabled) { border-color: transparent; }
`;

export const dangerControl = css`
  ${quietControl}
  color: ${({ theme }) => theme.error};
  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.error};
    background: ${({ theme }) => theme.errorLight};
  }
`;

export const iconControl = css`
  padding: 0.4rem;
  width: 34px;
  flex: 0 0 auto;
  @media (pointer: coarse) { width: 44px; }
`;

export const variantControl = css`
  ${({ variant }) => variant === 'danger' ? dangerControl : variant === 'secondary' ? quietControl : primaryControl}
`;

export const tagStyle = css`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.45rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 5px;
  background: ${({ theme }) => theme.cardSecondary};
  color: ${({ theme }) => theme.textSecondary};
  font-size: 0.72rem;
  font-weight: 500;
  line-height: 1.5;
`;
