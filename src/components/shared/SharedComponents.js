// src/components/shared/SharedComponents.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// ==================== CONTENEURS PARTAGÉS ====================

export const PageContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

export const FilterSection = styled.div`
  width: 280px;
  margin-right: 2rem;
  background-color: ${props => props.theme.card};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  height: fit-content;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
  }
`;

export const FilterGroup = styled.div`
  margin-bottom: 2rem;
`;

export const FilterTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const FilterDropdown = styled.div`
  position: relative;
  width: 100%;
`;

export const DropdownButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: ${props => props.theme.text};
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hover};
  }
`;

export const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
`;

export const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  input {
    margin-right: 0.75rem;
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.primary};
  }

  span {
    font-weight: 500;
  }
`;

export const DropdownItem = styled.div`
  padding: 0.75rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

export const DropdownCheckbox = styled.input`
  margin-right: 0.5rem;
  width: 16px;
  height: 16px;
  accent-color: ${props => props.theme.primary};
`;

export const FilterIndicator = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.primary};
  padding: 0.5rem;
  background-color: ${props => props.theme.background};
  border-radius: 4px;
`;

export const ListContainer = styled.div`
  flex: 1;
  max-width: calc(100% - 300px);

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

export const TopActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-top: 1rem;

  @media (max-width: 768px) {
    align-items: center;
  }
`;

// ==================== INPUTS UNIFIÉS ====================

export const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

// ==================== GRILLES UNIFIÉES ====================

export const QuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  /* 🔧 MODIFICATION PRINCIPALE : Optimisation pour mobile avec 2 colonnes compactes */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

export const CasesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  /* 🔧 MODIFICATION PRINCIPALE : Optimisation pour mobile avec 2 colonnes compactes */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }
`;

// ==================== CARTES UNIFIÉES ====================

export const QuestionnaireCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }

  /* 🔧 MODIFICATION : Optimisation mobile compacte */
  @media (max-width: 768px) {
    padding: 0.75rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px ${props => props.theme.shadow};
    
    &:hover {
      transform: none;
      box-shadow: 0 2px 8px ${props => props.theme.shadow};
      border-color: ${props => props.theme.border};
    }

    &::before {
      height: 3px;
    }
  }
`;

// ==================== COMPOSANTS CARTE CAS PARTAGÉS ====================

export const CaseCard = styled(Link)`
  display: block;
  background-color: ${props => props.theme.surface || props.theme.card};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  text-decoration: none;
  color: inherit;
  border: 1px solid ${props => props.theme.border};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }

  /* 🔧 MODIFICATION : Optimisation mobile compacte */
  @media (max-width: 768px) {
    border-radius: 8px;
    box-shadow: 0 2px 8px ${props => props.theme.shadow};
    
    &:hover {
      transform: none;
      box-shadow: 0 2px 8px ${props => props.theme.shadow};
      border-color: ${props => props.theme.border};
    }
  }
`;

export const CaseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;

  /* 🔧 MODIFICATION : Image plus compacte sur mobile */
  @media (max-width: 768px) {
    height: 120px;
  }
`;

export const CaseContent = styled.div`
  padding: 1.5rem;

  /* 🔧 MODIFICATION : Padding réduit sur mobile */
  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const CaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

  /* 🔧 MODIFICATION : Layout adapté pour mobile */
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const CaseTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-align: center;
  line-height: 1.4;

  /* 🔧 MODIFICATION : Texte plus compact sur mobile */
  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.3;
    margin: 0 0 0.5rem 0;
  }
`;

export const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin: 1rem 0;

  /* 🔧 MODIFICATION : Étoiles plus compactes sur mobile */
  @media (max-width: 768px) {
    gap: 0.1rem;
    margin: 0.5rem 0;
    
    svg {
      width: 16px !important;
      height: 16px !important;
    }
  }
`;

export const PopularityBadge = styled.span`
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  /* 🔧 MODIFICATION : Badge plus petit sur mobile */
  @media (max-width: 768px) {
    font-size: 0.6rem;
    padding: 0.2rem 0.4rem;
    border-radius: 8px;
    
    svg {
      width: 10px !important;
      height: 10px !important;
    }
  }
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  margin-bottom: 1rem;
  justify-content: center;

  svg {
    color: ${props => props.theme.primary};
  }

  /* 🔧 MODIFICATION : Texte plus compact sur mobile */
  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-bottom: 0.5rem;
    
    svg {
      width: 12px !important;
      height: 12px !important;
    }
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary || props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};

  /* 🔧 MODIFICATION : Layout plus compact sur mobile */
  @media (max-width: 768px) {
    margin: 0.5rem 0;
    padding: 0.5rem;
    border-radius: 6px;
  }
`;

export const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;

  svg {
    color: ${props => props.theme.primary};
  }

  span {
    font-weight: 600;
    color: ${props => props.theme.text};
  }

  /* 🔧 MODIFICATION : Statistiques plus compactes sur mobile */
  @media (max-width: 768px) {
    font-size: 0.7rem;
    gap: 0.1rem;
    
    svg {
      width: 12px !important;
      height: 12px !important;
    }
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;

  /* 🔧 MODIFICATION : Actions adaptées pour mobile */
  @media (max-width: 768px) {
    gap: 0.25rem;
    margin-top: 0.5rem;
  }
`;

export const CopyActionButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primaryDark || props.theme.secondary};
    transform: translateY(-1px);
  }

  svg {
    width: 14px;
    height: 14px;
  }

  /* 🔧 MODIFICATION : Bouton plus compact sur mobile */
  @media (max-width: 768px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.7rem;
    border-radius: 4px;
    
    &:hover {
      transform: none;
    }
    
    svg {
      width: 12px !important;
      height: 12px !important;
    }
  }
`;

export const RatingSection = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};

  /* 🔧 MODIFICATION : Section rating plus compacte sur mobile */
  @media (max-width: 768px) {
    margin-top: 0.5rem;
    padding-top: 0.5rem;
  }
`;

// ==================== FILTRES ====================

export const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FilterButton = styled.button`
  background-color: ${props => props.active ? props.theme.primary : props.theme.backgroundSecondary || props.theme.background};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
  }
`;

export const SpoilerButton = styled.button`
  background-color: ${props => props.active ? '#10b981' : '#6b7280'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? '#059669' : '#4b5563'};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 1rem;

  /* 🔧 MODIFICATION : Header plus compact sur mobile */
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

export const QuestionnaireTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  line-height: 1.4;

  /* 🔧 MODIFICATION : Titre plus compact sur mobile */
  @media (max-width: 768px) {
    font-size: 0.9rem;
    line-height: 1.3;
    gap: 0.5rem;
  }
`;

export const QuestionnaireIcon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;

  /* 🔧 MODIFICATION : Icône plus petite sur mobile */
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};

  /* 🔧 MODIFICATION : Meta plus compact sur mobile */
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    border-radius: 6px;
    flex-direction: column;
  }
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  font-weight: 500;

  svg {
    color: ${props => props.theme.primary};
    flex-shrink: 0;
  }

  /* 🔧 MODIFICATION : Meta item plus compact sur mobile */
  @media (max-width: 768px) {
    font-size: 0.75rem;
    gap: 0.375rem;
    
    svg {
      width: 12px !important;
      height: 12px !important;
    }
  }
`;

// ==================== TAGS UNIFIÉS ====================

export const TagsSection = styled.div`
  margin: 1rem 0;

  /* 🔧 MODIFICATION : Section tags plus compacte sur mobile */
  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  justify-content: center;

  /* 🔧 MODIFICATION : Tags plus compacts sur mobile */
  @media (max-width: 768px) {
    gap: 0.25rem;
    margin-bottom: 0.375rem;
  }
`;

export const Tag = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  /* 🔧 MODIFICATION : Tag plus petit sur mobile */
  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
    
    svg {
      width: 10px !important;
      height: 10px !important;
    }
  }
`;

export const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.7;
  }
`;

export const AddTagSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  /* 🔧 MODIFICATION : Section ajout tag plus compacte sur mobile */
  @media (max-width: 768px) {
    gap: 0.25rem;
    margin-top: 0.375rem;
    justify-content: center;
  }
`;

export const AddTagButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }

  /* 🔧 MODIFICATION : Bouton ajout tag plus compact sur mobile */
  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    
    svg {
      width: 10px !important;
      height: 10px !important;
    }
  }
`;

export const TagInput = styled.input`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 0.75rem;
  width: 120px;

  /* 🔧 MODIFICATION : Input tag plus compact sur mobile */
  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
    width: 80px;
    border-radius: 3px;
  }
`;

export const TagForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.25rem;

  /* 🔧 MODIFICATION : Form tag plus compact sur mobile */
  @media (max-width: 768px) {
    gap: 0.2rem;
  }
`;

export const SubmitTagButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }

  /* 🔧 MODIFICATION : Bouton submit tag plus compact sur mobile */
  @media (max-width: 768px) {
    padding: 0.2rem;
    border-radius: 3px;
    
    svg {
      width: 10px !important;
      height: 10px !important;
    }
  }
`;

export const CancelTagButton = styled.button`
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #4b5563;
  }

  /* 🔧 MODIFICATION : Bouton cancel tag plus compact sur mobile */
  @media (max-width: 768px) {
    padding: 0.2rem;
    border-radius: 3px;
    
    svg {
      width: 10px !important;
      height: 10px !important;
    }
  }
`;

// ==================== BOUTONS UNIFIÉS ====================

export const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;

  /* 🔧 MODIFICATION : Boutons d'action plus compacts sur mobile */
  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-top: 0.5rem;
    justify-content: center;
  }
`;

export const ActionButton = styled(Link)`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.backgroundSecondary;
      case 'danger': return '#ef4444';
      default: return props.theme.primary;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.text;
      default: return 'white';
    }
  }};
  padding: ${props => props.size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.border;
      default: return 'transparent';
    }
  }};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: ${props => props.size === 'large' ? '0.95rem' : '0.85rem'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  /* 🔧 MODIFICATION : Boutons action plus compacts sur mobile */
  @media (max-width: 768px) {
    padding: ${props => props.size === 'large' ? '0.5rem 1rem' : '0.375rem 0.75rem'};
    font-size: ${props => props.size === 'large' ? '0.8rem' : '0.7rem'};
    border-radius: 6px;
    gap: 0.375rem;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
    
    svg {
      width: 14px !important;
      height: 14px !important;
    }
  }
`;

export const Button = styled.button`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.backgroundSecondary;
      case 'danger': return '#ef4444';
      default: return props.theme.primary;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.text;
      default: return 'white';
    }
  }};
  padding: ${props => props.variant === 'danger' ? '0.25rem 0.5rem' : '0.5rem 1rem'};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.border;
      default: return 'transparent';
    }
  }};
  border-radius: 8px;
  font-weight: 500;
  font-size: ${props => props.variant === 'danger' ? '0.75rem' : '0.85rem'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  svg {
    width: ${props => props.variant === 'danger' ? '12px' : '16px'};
    height: ${props => props.variant === 'danger' ? '12px' : '16px'};
  }

  /* 🔧 MODIFICATION : Boutons plus compacts sur mobile */
  @media (max-width: 768px) {
    padding: ${props => props.variant === 'danger' ? '0.2rem 0.4rem' : '0.375rem 0.75rem'};
    font-size: ${props => props.variant === 'danger' ? '0.65rem' : '0.7rem'};
    border-radius: 6px;
    gap: 0.375rem;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
    
    svg {
      width: ${props => props.variant === 'danger' ? '10px' : '14px'} !important;
      height: ${props => props.variant === 'danger' ? '10px' : '14px'} !important;
    }
  }
`;

export const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  /* 🔧 MODIFICATION : Bouton supprimer plus compact sur mobile */
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    padding: 0.375rem;
    border-radius: 6px;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
    
    svg {
      width: 14px !important;
      height: 14px !important;
    }
  }
`;

export const TutorialButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  text-align: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }

  /* 🔧 MODIFICATION : Bouton tutoriel plus compact sur mobile */
  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    border-radius: 8px;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    }
  }
`;

export const VideoContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};

  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: 8px;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
  }

  /* 🔧 MODIFICATION : Container vidéo plus compact sur mobile */
  @media (max-width: 768px) {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    
    h3 {
      font-size: 1rem;
      margin-bottom: 0.75rem;
    }
    
    .video-wrapper {
      border-radius: 6px;
    }
  }
`;

// ==================== MESSAGES ====================

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;

  /* 🔧 MODIFICATION : Message de chargement plus compact sur mobile */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  font-size: 1.1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin: 1rem 0;

  /* 🔧 MODIFICATION : Message d'erreur plus compact sur mobile */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    border-radius: 6px;
  }
`;