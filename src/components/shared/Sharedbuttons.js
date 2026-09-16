import { control, dangerControl, iconControl, primaryControl, quietControl } from './designSystem';
// src/components/shared/SharedButtons.js
// Composants de boutons partagés avec un style sobre et élégant
import styled from 'styled-components';

// ==================== BOUTONS PRIMAIRES ====================

// Bouton principal élégant et sobre (pour "UTILISER", actions principales)
export const ElegantPrimaryButton = styled.button`
  ${primaryControl}
`;

// ==================== BOUTONS SECONDAIRES ====================

// Bouton secondaire (pour "MODIFIER", actions secondaires)
export const ElegantSecondaryButton = styled.button`
  ${control}
`;

// ==================== BOUTONS DE SUPPRESSION ====================

// Bouton de suppression élégant (remplace la poubelle rouge)
export const ElegantDeleteButton = styled.button`
  ${dangerControl}
`;

// ==================== BOUTONS ICÔNES ====================

// Petit bouton icône élégant (pour les actions rapides dans les cartes)
export const ElegantIconButton = styled.button`
  ${quietControl}
  ${iconControl}
`;

// Bouton icône de suppression (petit, pour les cartes)
export const ElegantDeleteIconButton = styled.button`
  ${dangerControl}
  ${iconControl}
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
  ${quietControl}
`;

// Bouton pour dupliquer
export const DuplicateButton = styled.button`
  ${quietControl}
`;