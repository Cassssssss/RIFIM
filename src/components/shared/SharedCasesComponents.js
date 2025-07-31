// src/components/shared/SharedCasesComponents.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// ==================== LAYOUT PRINCIPAL ====================

export const UnifiedPageContainer = styled.div`
  padding: 2rem 3rem;
  min-height: calc(100vh - 60px);
  background-color: ${props => props.theme.background};

  @media (max-width: 1200px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

export const UnifiedPageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
`;

export const PageSubtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  margin: 0;
`;

// ==================== SECTION DE RECHERCHE ET FILTRES ====================

export const SearchAndFiltersSection = styled.div`
  margin-bottom: 2rem;
`;

export const UnifiedSearchInput = styled.input`
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem auto;
  display: block;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 4px 15px ${props => props.theme.shadow};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

export const UnifiedFilterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
`;

export const UnifiedFilterSection = styled.div`
  position: relative;
  /* CORRECTION CRITIQUE : Assurer que le dropdown soit au-dessus des autres éléments */
  z-index: ${props => props.isOpen ? '1000' : 'auto'};
`;

export const UnifiedFilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? props.theme.primary : props.theme.backgroundSecondary};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.active ? props.theme.primary : props.theme.hover};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  svg {
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

export const UnifiedSpoilerButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${props => props.active 
    ? 'linear-gradient(135deg, #10b981, #059669)' 
    : 'linear-gradient(135deg, #5A9FD4, #6ABFA5)'
  };
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  min-width: 150px;
  justify-content: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.active 
      ? 'rgba(16, 185, 129, 0.3)' 
      : 'rgba(90, 159, 212, 0.3)'
    };
    background: ${props => props.active 
      ? 'linear-gradient(135deg, #059669, #047857)' 
      : 'linear-gradient(135deg, #4E8BC0, #5AAB91)'
    };
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.active 
      ? 'rgba(16, 185, 129, 0.2)' 
      : 'rgba(90, 159, 212, 0.2)'
    };
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

export const UnifiedDropdownContent = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 280px;
  overflow-y: auto;
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  /* CORRECTION MAJEURE : Z-index élevé pour être au-dessus de tout */
  z-index: 9999;
  box-shadow: 0 8px 25px ${props => props.theme.shadow};
  /* CORRECTION : Fond solide pour éviter la transparence */
  backdrop-filter: blur(10px);
  
  /* Style personnalisé pour les scrollbars */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.textSecondary};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.text};
  }
`;

// CORRECTION MAJEURE : UnifiedDropdownItem avec meilleure gestion des événements
export const UnifiedDropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 500;
  user-select: none;
  /* CORRECTION : Empêcher la propagation d'événements */
  
  &:hover {
    background-color: ${props => props.theme.hover};
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }

  &:only-child {
    border-radius: 12px;
  }

  /* CORRECTION : Gérer les clics sur les checkbox correctement */
  input[type="checkbox"] {
    pointer-events: auto;
  }
`;

// CORRECTION MAJEURE : UnifiedDropdownCheckbox avec gestion d'événements améliorée
export const UnifiedDropdownCheckbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${props => props.theme.primary};
  cursor: pointer;
  flex-shrink: 0;
  margin: 0;
  /* CORRECTION : Assurer que les événements de checkbox fonctionnent */
  pointer-events: auto;
`;

// ==================== LISTE ET CARTES DES CAS ====================

export const UnifiedCasesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

export const UnifiedCaseCard = styled(Link)`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  display: block;
  /* CORRECTION : Z-index normal pour les cartes */
  z-index: 1;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary}50;
    /* CORRECTION : Élever légèrement au hover mais rester sous les dropdowns */
    z-index: 2;
  }
`;

export const UnifiedCaseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 1px solid ${props => props.theme.border};
`;

export const UnifiedCaseContent = styled.div`
  padding: 1.5rem;
`;

export const UnifiedCaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const UnifiedCaseTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  line-height: 1.4;
`;

export const UnifiedStarRating = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 1rem;
  align-items: center;
`;

export const UnifiedPopularityBadge = styled.div`
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
`;

export const UnifiedAuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

export const UnifiedStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
`;

export const UnifiedStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

export const UnifiedActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  /* CORRECTION : Z-index pour que les boutons d'action restent cliquables */
  position: relative;
  z-index: 3;
`;

export const UnifiedActionButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px ${props => props.theme.shadow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${props => props.theme.shadow};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.primary}30;
  }
`;

export const UnifiedRatingSection = styled.div`
  margin: 1rem 0;
`;

export const UnifiedTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const UnifiedTag = styled.span`
  background: linear-gradient(135deg, ${props => props.theme.primary}20, ${props => props.theme.secondary}20);
  color: ${props => props.theme.primary};
  border: 1px solid ${props => props.theme.primary}30;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
`;

// ==================== PAGINATION ====================

export const UnifiedPaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const UnifiedPaginationButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.shadow};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.primary}30;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    background: ${props => props.theme.disabled || '#9ca3af'};
    box-shadow: none;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const UnifiedPaginationInfo = styled.div`
  font-weight: 500;
  color: ${props => props.theme.text};
  text-align: center;
`;

// ==================== ÉTATS SPÉCIAUX ====================

export const UnifiedEmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  border: 2px dashed ${props => props.theme.border};
  margin: 2rem 0;

  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: 600;
  }

  p {
    color: ${props => props.theme.textSecondary};
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }
`;

export const UnifiedLoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  font-size: 1.1rem;
  color: ${props => props.theme.textSecondary};
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  margin: 2rem 0;
`;

export const UnifiedErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: ${props => props.theme.error || '#fee2e2'};
  color: ${props => props.theme.errorText || '#dc2626'};
  border-radius: 16px;
  border: 1px solid ${props => props.theme.errorBorder || '#fecaca'};
  margin: 2rem 0;
  font-weight: 500;
`;

// ==================== BACKDROP POUR FERMER LES DROPDOWNS ====================

export const DropdownBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
  cursor: default;
`;