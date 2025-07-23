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
  background-color: ${props => props.theme.secondary};
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
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

export const UnifiedDropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 250px;
  overflow-y: auto;
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-top: none;
  border-radius: 0 0 12px 12px;
  z-index: 10;
  box-shadow: 0 8px 25px ${props => props.theme.shadow};
`;

export const UnifiedDropdownItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }
`;

export const UnifiedDropdownCheckbox = styled.input`
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.primary};
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
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

export const UnifiedCaseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: ${props => props.theme.backgroundSecondary};
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
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  flex: 1;
`;

export const UnifiedStarRating = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 1rem;
`;

export const UnifiedPopularityBadge = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
`;

export const UnifiedAuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  margin-bottom: 1rem;

  svg {
    color: ${props => props.theme.primary};
  }
`;

// ==================== STATS ET ACTIONS ====================

export const UnifiedStatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
`;

export const UnifiedStatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  font-weight: 500;

  svg {
    color: ${props => props.theme.primary};
  }
`;

export const UnifiedActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const UnifiedActionButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 36px;
  height: 36px;

  &:hover {
    background-color: ${props => props.theme.secondary};
    transform: translateY(-1px);
    box-shadow: 0 2px 6px ${props => props.theme.shadow};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// ==================== RATING SECTION ====================

export const UnifiedRatingSection = styled.div`
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

// ==================== TAGS ====================

export const UnifiedTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const UnifiedTag = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// ==================== PAGINATION ====================

export const UnifiedPaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 3rem;
  padding: 2rem;
`;

export const UnifiedPaginationButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.secondary};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }

  &:disabled {
    background-color: ${props => props.theme.textSecondary};
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;

export const UnifiedPaginationInfo = styled.span`
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
  font-size: 0.95rem;
`;

// ==================== ÉTATS VIDES ET MESSAGES ====================

export const UnifiedEmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  margin: 2rem 0;
  border: 1px solid ${props => props.theme.border};

  h3 {
    color: ${props => props.theme.primary};
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
  }

  p {
    color: ${props => props.theme.textSecondary};
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

export const UnifiedLoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  margin: 2rem 0;
  border: 1px solid ${props => props.theme.border};
`;

export const UnifiedErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  background-color: #fef2f2;
  border-radius: 12px;
  margin: 2rem 0;
  border: 1px solid #fecaca;
  font-weight: 500;
`;

// ==================== COMPOSANTS POUR LA GESTION PRIVÉE ====================

export const UnifiedSectionContainer = styled.div`
  position: relative;
  overflow: hidden;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  margin-bottom: 2rem;
  padding: 1.5rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  }
`;

export const UnifiedSectionTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

// ==================== BOUTONS D'ACTION SPÉCIALISÉS ====================

export const UnifiedCreateButton = styled(Link)`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${props => props.theme.shadow};
    opacity: 0.95;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

export const UnifiedEditButton = styled(Link)`
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 0.85rem;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const UnifiedDeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  font-size: 0.75rem;

  &:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;