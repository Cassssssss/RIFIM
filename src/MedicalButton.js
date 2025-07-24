import React from 'react';
import styled from 'styled-components';

// ==================== COULEURS MÉDICALES AVEC VARIABLES MOBILES ====================
const medicalColors = {
  // Couleurs principales
  primary: '#3b82f6', // Bleu médical
  primaryHover: '#2563eb',
  secondary: '#6366f1', // Indigo
  secondaryHover: '#4f46e5',
  
  // Couleurs d'état
  success: '#10b981', // Vert médical
  successHover: '#059669',
  warning: '#f59e0b', // Orange
  warningHover: '#d97706',
  danger: '#ef4444', // Rouge médical
  dangerHover: '#dc2626',
  
  // Couleurs neutres
  gray: '#6b7280',
  grayHover: '#4b5563',
  white: '#ffffff',
  black: '#1f2937',
  
  // Backgrounds
  lightBg: '#f8fafc',
  darkBg: '#1e293b',
  
  // Bordures
  border: '#e2e8f0',
  borderDark: '#334155',
  
  // Espacement
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  
  // Tailles de boutons avec adaptation mobile
  buttonSizes: {
    small: {
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      borderRadius: '6px',
      minHeight: '36px',
      // MOBILE ADAPTATIONS
      mobilePadding: '0.75rem 1rem',
      mobileFontSize: '0.875rem',
      mobileMinHeight: '44px', // Taille tactile optimale
    },
    medium: {
      padding: '0.75rem 1.5rem',
      fontSize: '1rem',
      borderRadius: '8px',
      minHeight: '40px',
      // MOBILE ADAPTATIONS
      mobilePadding: '1rem 1.5rem',
      mobileFontSize: '1rem',
      mobileMinHeight: '48px',
    },
    large: {
      padding: '1rem 2rem',
      fontSize: '1.125rem',
      borderRadius: '10px',
      minHeight: '48px',
      // MOBILE ADAPTATIONS
      mobilePadding: '1.25rem 2rem',
      mobileFontSize: '1.125rem',
      mobileMinHeight: '52px',
    },
  },
  
  // Styles de boutons
  buttons: {
    primary: {
      bg: '#3b82f6',
      text: '#ffffff',
      hover: '#2563eb',
      active: '#1d4ed8',
      shadow: '0 2px 4px rgba(59, 130, 246, 0.3)',
      mobileShadow: '0 1px 3px rgba(59, 130, 246, 0.3)',
    },
    secondary: {
      bg: 'transparent',
      text: '#3b82f6',
      border: '#3b82f6',
      hover: '#3b82f6',
      hoverText: '#ffffff',
      active: '#2563eb',
      shadow: '0 2px 4px rgba(59, 130, 246, 0.2)',
      mobileShadow: '0 1px 3px rgba(59, 130, 246, 0.2)',
    },
    tertiary: {
      bg: 'transparent',
      text: '#6b7280',
      hover: '#f3f4f6',
      active: '#e5e7eb',
      shadow: 'none',
      mobileShadow: 'none',
    },
    success: {
      bg: '#10b981',
      text: '#ffffff',
      hover: '#059669',
      active: '#047857',
      shadow: '0 2px 4px rgba(16, 185, 129, 0.3)',
      mobileShadow: '0 1px 3px rgba(16, 185, 129, 0.3)',
    },
    danger: {
      bg: '#ef4444',
      text: '#ffffff',
      hover: '#dc2626',
      active: '#b91c1c',
      shadow: '0 2px 4px rgba(239, 68, 68, 0.3)',
      mobileShadow: '0 1px 3px rgba(239, 68, 68, 0.3)',
    },
  },
};

// ==================== STYLED BUTTON AVEC ADAPTATION MOBILE COMPLÈTE ====================
const StyledButton = styled.button`
  /* Variables de base */
  --button-padding: ${props => medicalColors.buttonSizes[props.size || 'medium'].padding};
  --button-font-size: ${props => medicalColors.buttonSizes[props.size || 'medium'].fontSize};
  --button-border-radius: ${props => medicalColors.buttonSizes[props.size || 'medium'].borderRadius};
  --button-min-height: ${props => medicalColors.buttonSizes[props.size || 'medium'].minHeight};
  --button-shadow: ${props => medicalColors.buttons[props.variant || 'primary'].shadow};
  
  /* Styles de base */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: var(--button-padding);
  font-size: var(--button-font-size);
  font-weight: 500;
  font-family: inherit;
  line-height: 1.5;
  border-radius: var(--button-border-radius);
  min-height: var(--button-min-height);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  user-select: none;
  box-shadow: var(--button-shadow);
  
  /* MOBILE ADAPTATIONS CRITIQUES */
  @media (max-width: 768px) {
    /* Variables mobiles */
    --button-padding: ${props => medicalColors.buttonSizes[props.size || 'medium'].mobilePadding};
    --button-font-size: ${props => medicalColors.buttonSizes[props.size || 'medium'].mobileFontSize};
    --button-min-height: ${props => medicalColors.buttonSizes[props.size || 'medium'].mobileMinHeight};
    --button-shadow: ${props => medicalColors.buttons[props.variant || 'primary'].mobileShadow};
    
    /* Optimisations tactiles */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    font-size: 16px; /* Empêche le zoom sur iOS */
    
    /* Transition plus rapide sur mobile */
    transition: all 0.15s ease;
    
    /* Largeur pleine sur très petits écrans si spécifié */
    ${props => props.fullWidthMobile && `
      width: 100%;
      justify-content: center;
    `}
    
    /* Espacement réduit entre les boutons sur mobile */
    ${props => props.compactMobile && `
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      min-height: 42px;
    `}
  }
  
  @media (max-width: 480px) {
    /* Adaptations pour très petits écrans */
    gap: 0.25rem;
    
    ${props => props.fullWidthMobile && `
      margin-bottom: 0.5rem;
    `}
  }
  
  /* ==================== VARIANTS DE COULEUR ==================== */
  
  /* PRIMARY */
  ${props => (props.variant === 'primary' || !props.variant) && `
    background-color: ${medicalColors.buttons.primary.bg};
    color: ${medicalColors.buttons.primary.text};
    
    &:hover:not(:disabled) {
      background-color: ${medicalColors.buttons.primary.hover};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      
      @media (max-width: 768px) {
        /* Pas d'effet hover sur mobile */
        background-color: ${medicalColors.buttons.primary.bg};
        transform: none;
        box-shadow: var(--button-shadow);
      }
    }
    
    &:active {
      background-color: ${medicalColors.buttons.primary.active};
      transform: translateY(0);
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.primary.hover};
        transform: scale(0.98);
      }
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      
      @media (max-width: 768px) {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
      }
    }
  `}
  
  /* SECONDARY */
  ${props => props.variant === 'secondary' && `
    background-color: ${medicalColors.buttons.secondary.bg};
    color: ${medicalColors.buttons.secondary.text};
    border-color: ${medicalColors.buttons.secondary.border};
    
    &:hover:not(:disabled) {
      background-color: ${medicalColors.buttons.secondary.hover};
      color: ${medicalColors.buttons.secondary.hoverText};
      transform: translateY(-1px);
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.secondary.bg};
        color: ${medicalColors.buttons.secondary.text};
        transform: none;
      }
    }
    
    &:active {
      background-color: ${medicalColors.buttons.secondary.active};
      color: ${medicalColors.buttons.secondary.hoverText};
      transform: translateY(0);
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.secondary.hover};
        color: ${medicalColors.buttons.secondary.hoverText};
        transform: scale(0.98);
      }
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      
      @media (max-width: 768px) {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
      }
    }
  `}
  
  /* TERTIARY */
  ${props => props.variant === 'tertiary' && `
    background-color: ${medicalColors.buttons.tertiary.bg};
    color: ${medicalColors.buttons.tertiary.text};
    box-shadow: none;
    
    &:hover:not(:disabled) {
      background-color: ${medicalColors.buttons.tertiary.hover};
      transform: translateY(-1px);
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.tertiary.bg};
        transform: none;
      }
    }
    
    &:active {
      background-color: ${medicalColors.buttons.tertiary.active};
      transform: translateY(0);
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.tertiary.hover};
        transform: scale(0.98);
      }
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.3);
      
      @media (max-width: 768px) {
        box-shadow: 0 0 0 2px rgba(107, 114, 128, 0.5);
      }
    }
  `}
  
  /* SUCCESS */
  ${props => props.variant === 'success' && `
    background-color: ${medicalColors.buttons.success.bg};
    color: ${medicalColors.buttons.success.text};
    
    &:hover:not(:disabled) {
      background-color: ${medicalColors.buttons.success.hover};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.success.bg};
        transform: none;
        box-shadow: var(--button-shadow);
      }
    }
    
    &:active {
      background-color: ${medicalColors.buttons.success.active};
      transform: translateY(0);
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.success.hover};
        transform: scale(0.98);
      }
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
      
      @media (max-width: 768px) {
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
      }
    }
  `}
  
  /* DANGER */
  ${props => props.variant === 'danger' && `
    background-color: ${medicalColors.buttons.danger.bg};
    color: ${medicalColors.buttons.danger.text};
    
    &:hover:not(:disabled) {
      background-color: ${medicalColors.buttons.danger.hover};
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.danger.bg};
        transform: none;
        box-shadow: var(--button-shadow);
      }
    }
    
    &:active {
      background-color: ${medicalColors.buttons.danger.active};
      transform: translateY(0);
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.danger.hover};
        transform: scale(0.98);
      }
    }
    
    &:focus {
      outline: none;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
      
      @media (max-width: 768px) {
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5);
      }
    }
  `}
  
  /* ==================== ÉTATS DISABLED ==================== */
  &:disabled {
    background-color: ${props => props.theme.disabled || '#9ca3af'};
    color: ${props => props.theme.textDisabled || '#6b7280'};
    cursor: not-allowed;
    opacity: 0.6;
    box-shadow: none;
    
    &:hover {
      transform: none;
      background-color: ${props => props.theme.disabled || '#9ca3af'};
    }
    
    &:active {
      transform: none;
    }
    
    @media (max-width: 768px) {
      opacity: 0.5; /* Plus visible sur mobile */
    }
  }
  
  /* ==================== LOADING STATE ==================== */
  ${props => props.loading && `
    pointer-events: none;
    position: relative;
    color: transparent;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: button-loading-spinner 1s ease infinite;
      color: ${props.variant === 'secondary' || props.variant === 'tertiary' ? 
        medicalColors.buttons[props.variant].text : 
        medicalColors.buttons[props.variant || 'primary'].text};
    }
    
    @keyframes button-loading-spinner {
      from {
        transform: rotate(0turn);
      }
      to {
        transform: rotate(1turn);
      }
    }
    
    @media (max-width: 768px) {
      &::after {
        width: 18px;
        height: 18px;
        margin-left: -9px;
        margin-top: -9px;
        border-width: 3px; /* Plus visible sur mobile */
      }
    }
  `}
  
  /* ==================== ICÔNE ADAPTATIONS ==================== */
  svg {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      width: 1.1em; /* Légèrement plus grande sur mobile */
      height: 1.1em;
    }
  }
  
  /* Bouton avec icône uniquement */
  ${props => props.iconOnly && `
    padding: var(--button-padding);
    aspect-ratio: 1;
    min-width: var(--button-min-height);
    
    @media (max-width: 768px) {
      min-width: var(--button-min-height);
      padding: 0.75rem;
    }
  `}
  
  /* ==================== RESPONSIVE BREAKPOINTS ==================== */
  
  /* Tablettes */
  @media (max-width: 1024px) and (min-width: 769px) {
    /* Taille légèrement réduite sur tablettes */
    padding: calc(var(--button-padding) * 0.9);
    font-size: calc(var(--button-font-size) * 0.95);
  }
  
  /* Très petits écrans */
  @media (max-width: 380px) {
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
    min-height: 42px;
    
    ${props => props.size === 'large' && `
      font-size: 1rem;
      padding: 1rem 1.25rem;
      min-height: 46px;
    `}
    
    ${props => props.size === 'small' && `
      font-size: 0.8rem;
      padding: 0.5rem 0.75rem;
      min-height: 40px;
    `}
  }
`;

// ==================== COMPOSANT PRINCIPAL ==================== 
const MedicalButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidthMobile = false,
  compactMobile = false,
  iconOnly = false,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <StyledButton
      type={type}
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled || loading}
      fullWidthMobile={fullWidthMobile}
      compactMobile={compactMobile}
      iconOnly={iconOnly}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {loading ? 'Chargement...' : children}
    </StyledButton>
  );
};

// ==================== BOUTONS SPÉCIALISÉS ==================== 
export const PrimaryButton = (props) => (
  <MedicalButton variant="primary" {...props} />
);

export const SecondaryButton = (props) => (
  <MedicalButton variant="secondary" {...props} />
);

export const TertiaryButton = (props) => (
  <MedicalButton variant="tertiary" {...props} />
);

export const DangerButton = (props) => (
  <MedicalButton variant="danger" {...props} />
);

export const SuccessButton = (props) => (
  <MedicalButton variant="success" {...props} />
);

// ==================== CONTENEUR POUR GROUPER LES BOUTONS MOBILE ==================== 
export const ButtonGroup = styled.div`
  display: flex;
  gap: ${medicalColors.spacing.sm};
  align-items: center;
  flex-wrap: wrap;
  
  /* Styles pour les boutons dans le groupe */
  ${StyledButton} {
    flex: ${props => props.equalWidth ? '1' : '0 0 auto'};
  }
  
  /* Orientation verticale */
  ${props => props.vertical && `
    flex-direction: column;
    align-items: stretch;
    
    ${StyledButton} {
      width: 100%;
    }
  `}
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    gap: ${medicalColors.spacing.xs};
    
    /* Passage automatique en vertical sur mobile si spécifié */
    ${props => props.verticalOnMobile && `
      flex-direction: column;
      align-items: stretch;
      
      ${StyledButton} {
        width: 100%;
        margin-bottom: ${medicalColors.spacing.xs};
        
        &:last-child {
          margin-bottom: 0;
        }
      }
    `}
    
    /* Boutons compacts sur mobile */
    ${props => props.compactOnMobile && `
      ${StyledButton} {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
        min-height: 42px;
      }
    `}
  }
  
  @media (max-width: 480px) {
    /* Force la disposition verticale sur très petits écrans */
    ${props => props.forceVerticalOnSmall && `
      flex-direction: column;
      align-items: stretch;
      
      ${StyledButton} {
        width: 100%;
      }
    `}
  }
`;

// ==================== CONTENEUR POUR LES BOUTONS D'ACTION ==================== 
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${medicalColors.spacing.sm};
  margin-top: ${medicalColors.spacing.lg};
  padding-top: ${medicalColors.spacing.md};
  border-top: 1px solid ${props => props.theme.border};
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    flex-direction: column-reverse; /* Bouton principal en bas */
    gap: ${medicalColors.spacing.xs};
    margin-top: ${medicalColors.spacing.md};
    padding-top: ${medicalColors.spacing.sm};
    
    ${StyledButton} {
      width: 100%;
      justify-content: center;
    }
    
    /* Ordre des boutons sur mobile */
    ${StyledButton}:first-child {
      order: 2; /* Bouton secondaire en haut */
    }
    
    ${StyledButton}:last-child {
      order: 1; /* Bouton principal en bas (plus accessible) */
    }
  }
  
  /* Alignement centré sur mobile si spécifié */
  ${props => props.centerOnMobile && `
    @media (max-width: 768px) {
      justify-content: center;
      
      ${StyledButton} {
        width: auto;
        min-width: 120px;
      }
    }
  `}
`;

// ==================== BOUTON AVEC ICÔNE SPÉCIALISÉ ==================== 
export const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${medicalColors.spacing.sm};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${medicalColors.buttonSizes.small.borderRadius};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 36px;
  min-height: 36px;
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.cardHover};
    border-color: ${props => props.theme.primary};
    transform: translateY(-1px);
    
    @media (max-width: 768px) {
      background-color: ${props => props.theme.card};
      transform: none;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    
    @media (max-width: 768px) {
      background-color: ${props => props.theme.cardHover};
      transform: scale(0.95);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      background-color: ${props => props.theme.card};
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    min-width: 44px; /* Taille tactile optimale */
    min-height: 44px;
    padding: ${medicalColors.spacing.md};
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  
  @media (max-width: 480px) {
    min-width: 40px;
    min-height: 40px;
    padding: ${medicalColors.spacing.sm};
  }
  
  /* Variant danger pour les boutons de suppression */
  ${props => props.variant === 'danger' && `
    color: ${medicalColors.buttons.danger.bg};
    
    &:hover:not(:disabled) {
      background-color: ${medicalColors.buttons.danger.bg};
      color: ${medicalColors.buttons.danger.text};
      border-color: ${medicalColors.buttons.danger.bg};
      
      @media (max-width: 768px) {
        background-color: ${props => props.theme.card};
        color: ${medicalColors.buttons.danger.bg};
        border-color: ${props => props.theme.border};
      }
    }
    
    &:active:not(:disabled) {
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.danger.bg};
        color: ${medicalColors.buttons.danger.text};
        border-color: ${medicalColors.buttons.danger.bg};
      }
    }
  `}
  
  /* Focus visible */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
    
    @media (max-width: 768px) {
      box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
    }
  }
  
  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
    }
  }
`;

// ==================== BOUTON FLOTTANT MOBILE ==================== 
export const FloatingActionButton = styled(StyledButton)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    bottom: calc(1rem + env(safe-area-inset-bottom, 0));
    right: 1rem;
    width: 56px;
    height: 56px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  
  @media (max-width: 480px) {
    width: 52px;
    height: 52px;
    bottom: calc(0.75rem + env(safe-area-inset-bottom, 0));
    right: 0.75rem;
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
    
    @media (max-width: 768px) {
      transform: none;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
  }
  
  &:active {
    transform: scale(0.95);
    
    @media (max-width: 768px) {
      transform: scale(0.9);
    }
  }
  
  svg {
    width: 24px;
    height: 24px;
    
    @media (max-width: 768px) {
      width: 26px;
      height: 26px;
    }
  }
`;

// ==================== BOUTON TOGGLE MOBILE ==================== 
export const ToggleButton = styled(StyledButton)`
  ${props => props.active && `
    background-color: ${medicalColors.buttons.primary.bg};
    color: ${medicalColors.buttons.primary.text};
    
    &:hover {
      background-color: ${medicalColors.buttons.primary.hover};
      
      @media (max-width: 768px) {
        background-color: ${medicalColors.buttons.primary.bg};
      }
    }
  `}
  
  ${props => !props.active && `
    background-color: transparent;
    color: ${medicalColors.gray};
    border-color: ${medicalColors.border};
    
    &:hover {
      background-color: ${medicalColors.lightBg};
      color: ${medicalColors.primary};
      
      @media (max-width: 768px) {
        background-color: transparent;
        color: ${medicalColors.gray};
      }
    }
    
    &:active {
      @media (max-width: 768px) {
        background-color: ${medicalColors.lightBg};
        color: ${medicalColors.primary};
      }
    }
  `}
`;

// Export du composant principal par défaut
export default MedicalButton;