import React from 'react';
import styled from 'styled-components';
import { medicalColors } from './medicalColors';

// Bouton de base avec toutes les variantes
const StyledButton = styled.button`
  /* Styles de base */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  white-space: nowrap;
  
  /* Tailles selon la prop size */
  ${props => {
    const size = medicalColors.buttonSizes[props.size || 'medium'];
    return `
      padding: ${size.padding};
      font-size: ${size.fontSize};
      line-height: ${size.lineHeight};
      border-radius: ${size.borderRadius};
      min-height: ${size.minHeight};
    `;
  }}
  
  /* Couleurs selon la variant */
  ${props => {
    const variant = medicalColors.buttons[props.variant || 'primary'];
    return `
      background-color: ${variant.bg};
      color: ${variant.text};
      ${variant.border ? `border: 1px solid ${variant.border};` : ''}
      ${variant.shadow ? `box-shadow: 0 1px 3px ${variant.shadow};` : ''}
      
      &:hover:not(:disabled) {
        background-color: ${variant.hover};
      }
      
      &:active:not(:disabled) {
        background-color: ${variant.active};
        transform: translateY(1px);
      }
      
      &:disabled {
        background-color: ${variant.disabled};
        cursor: not-allowed;
        opacity: 0.6;
      }
    `;
  }}
  
  /* Styles pour les icônes */
  svg {
    margin-right: ${props => props.children ? '0.5rem' : '0'};
  }
  
  /* Styles pour les boutons full width */
  ${props => props.fullWidth && `
    width: 100%;
  `}
  
  /* Styles pour les boutons avec loading */
  ${props => props.loading && `
    cursor: not-allowed;
    opacity: 0.7;
  `}
`;

// Composant bouton principal
export const MedicalButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  fullWidth = false,
  loading = false,
  icon,
  ...props 
}) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth}
      loading={loading}
      disabled={loading || props.disabled}
      {...props}
    >
      {icon && icon}
      {loading ? 'Chargement...' : children}
    </StyledButton>
  );
};

// Boutons spécialisés pour plus de facilité
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

// Conteneur pour grouper les boutons
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
`;

// Conteneur pour les boutons d'action (ex: dans les modals)
export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${medicalColors.spacing.sm};
  margin-top: ${medicalColors.spacing.lg};
  padding-top: ${medicalColors.spacing.md};
  border-top: 1px solid ${props => props.theme.border};
  
  /* Responsive sur mobile */
  @media (max-width: 768px) {
    flex-direction: column;
    
    ${StyledButton} {
      width: 100%;
    }
  }
`;

// Bouton avec icône spécialisé
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
  
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.cardHover};
    border-color: ${props => props.theme.primary};
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  /* Variant danger pour les boutons de suppression */
  ${props => props.variant === 'danger' && `
    color: ${medicalColors.buttons.danger.bg};
    
    &:hover:not(:disabled) {
      background-color: ${medicalColors.buttons.danger.bg};
      color: ${medicalColors.buttons.danger.text};
    }
  `}
`;

// Export du composant principal par défaut
export default MedicalButton;