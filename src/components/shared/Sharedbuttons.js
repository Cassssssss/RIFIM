// src/components/shared/SharedButtons.js
// Composants de boutons partagés avec un style sobre et élégant
import styled from 'styled-components';

// ==================== BOUTONS PRIMAIRES ====================

// Bouton principal élégant et sobre (pour "UTILISER", actions principales)
export const ElegantPrimaryButton = styled.button`
  /* Design sobre et élégant */
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  border: 1.5px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  /* Ombre subtile */
  box-shadow: 0 1px 3px ${props => props.theme.shadow};
  
  /* Effet au survol */
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 6px ${props => props.theme.shadow};
  }
  
  /* Focus accessible */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.primary}30;
  }
  
  /* État désactivé */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Responsive mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    
    &:hover {
      transform: none;
    }
  }
`;

// ==================== BOUTONS SECONDAIRES ====================

// Bouton secondaire (pour "MODIFIER", actions secondaires)
export const ElegantSecondaryButton = styled.button`
  /* Design discret */
  background-color: transparent;
  color: ${props => props.theme.textSecondary};
  border: 1.5px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  /* Effet au survol */
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.hover};
    color: ${props => props.theme.text};
    border-color: ${props => props.theme.textSecondary};
  }
  
  /* Focus accessible */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.border};
  }
  
  /* État désactivé */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Responsive mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

// ==================== BOUTONS DE SUPPRESSION ====================

// Bouton de suppression élégant (remplace la poubelle rouge)
export const ElegantDeleteButton = styled.button`
  /* Design sobre pour la suppression */
  background-color: transparent;
  color: ${props => props.theme.textLight};
  border: 1.5px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  /* Effet au survol - devient rouge de manière élégante */
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.errorLight};
    color: ${props => props.theme.error};
    border-color: ${props => props.theme.error};
  }
  
  /* Focus accessible */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.error}20;
  }
  
  /* État désactivé */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Responsive mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

// ==================== BOUTONS ICÔNES ====================

// Petit bouton icône élégant (pour les actions rapides dans les cartes)
export const ElegantIconButton = styled.button`
  /* Design minimaliste */
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.textSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  /* Ombre subtile */
  box-shadow: 0 1px 2px ${props => props.theme.shadow};
  
  /* Effet au survol */
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.hover};
    color: ${props => props.theme.text};
    border-color: ${props => props.theme.textSecondary};
    transform: translateY(-1px);
    box-shadow: 0 2px 4px ${props => props.theme.shadow};
  }
  
  /* Focus accessible */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.primary}30;
  }
  
  /* État désactivé */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Responsive mobile */
  @media (max-width: 768px) {
    padding: 0.4rem;
    
    &:hover {
      transform: none;
    }
    
    svg {
      width: 16px !important;
      height: 16px !important;
    }
  }
`;

// Bouton icône de suppression (petit, pour les cartes)
export const ElegantDeleteIconButton = styled.button`
  /* Design minimaliste pour suppression */
  background-color: transparent;
  color: ${props => props.theme.textLight};
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 6px;
  padding: 0.4rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  /* Effet au survol */
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.errorLight};
    color: ${props => props.theme.error};
    border-color: ${props => props.theme.error};
  }
  
  /* Focus accessible */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${props => props.theme.error}20;
  }
  
  /* État désactivé */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Responsive mobile */
  @media (max-width: 768px) {
    padding: 0.35rem;
    
    svg {
      width: 14px !important;
      height: 14px !important;
    }
  }
`;

// ==================== GROUPE DE BOUTONS ====================

// Conteneur pour grouper les boutons de manière élégante
export const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
  
  /* Responsive mobile */
  @media (max-width: 768px) {
    gap: 0.5rem;
    width: 100%;
    
    /* Les boutons prennent toute la largeur sur mobile si besoin */
    ${props => props.fullWidthMobile && `
      flex-direction: column;
      
      button {
        width: 100%;
      }
    `}
  }
`;

// ==================== BOUTONS SPÉCIAUX ====================

// Bouton pour rendre public/privé
export const VisibilityToggleButton = styled.button`
  /* Design sobre pour toggle visibilité */
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.textSecondary};
  border: 1.5px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  /* Effet au survol */
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.hover};
    color: ${props => props.theme.text};
    border-color: ${props => props.theme.textSecondary};
  }
  
  /* Focus accessible */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.border};
  }
  
  /* État désactivé */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Responsive mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;

// Bouton pour dupliquer
export const DuplicateButton = styled.button`
  /* Design sobre pour duplication */
  background-color: transparent;
  color: ${props => props.theme.textSecondary};
  border: 1.5px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.65rem 1.25rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  /* Effet au survol */
  &:hover:not(:disabled) {
    background-color: ${props => props.theme.hover};
    color: ${props => props.theme.text};
    border-color: ${props => props.theme.textSecondary};
  }
  
  /* Focus accessible */
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.border};
  }
  
  /* État désactivé */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Responsive mobile */
  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
`;