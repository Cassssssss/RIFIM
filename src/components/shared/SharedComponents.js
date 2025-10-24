// src/components/shared/SharedComponents.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// ==================== CONTENEURS PARTAGÉS ====================

export const PageContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 1rem 2rem;
  width: 100%;
  max-width: 100vw;
  box-sizing: border-box;

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
  width: 100%;
  max-width: 100%;
  padding: 0 1rem;

  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0;
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

// ==================== GRILLES UNIFIÉES PLEINE LARGEUR ====================

export const QuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.2rem;
  margin: 2rem 0;
  padding: 0;
  width: 100%;
  max-width: none;

  @media (min-width: 2560px) {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1.5rem;
  }

  @media (min-width: 1920px) and (max-width: 2559px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }

  @media (min-width: 1440px) and (max-width: 1919px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0;
  }
`;

export const CasesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.2rem;
  margin: 2rem 0;
  padding: 0;
  width: 100%;
  max-width: none;

  @media (min-width: 2560px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  @media (min-width: 1920px) and (max-width: 2559px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  @media (min-width: 1440px) and (max-width: 1919px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0;
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

  @media (max-width: 768px) {
    height: 120px;
  }
`;

export const CaseContent = styled.div`
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 0.75rem;
  }
`;

export const CaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;

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

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
  }
`;

export const PopularityBadge = styled.div`
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
`;

// ==================== COMPOSANTS CARTE QUESTIONNAIRE ====================

export const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 0.5rem;

  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
    flex-direction: column;
  }
`;

export const QuestionnaireTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
    gap: 0.375rem;
  }
`;

export const QuestionnaireIcon = styled.span`
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

export const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1rem 0;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin: 0.5rem 0;
    font-size: 0.75rem;
    justify-content: center;
  }
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  svg {
    width: 16px;
    height: 16px;
    opacity: 0.7;
  }

  @media (max-width: 768px) {
    gap: 0.25rem;
    
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  margin: 0.5rem 0;

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    gap: 0.375rem;
    justify-content: center;
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
  gap: 0.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }
`;

export const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;

  svg {
    width: 14px;
    height: 14px;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    gap: 0.25rem;
    
    svg {
      width: 12px;
      height: 12px;
    }
  }
`;

export const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.25rem;
    justify-content: center;
  }
`;

export const RatingSection = styled.div`
  margin: 1rem 0;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

// ==================== TAGS ====================

export const TagsSection = styled.div`
  margin: 1rem 0;

  @media (max-width: 768px) {
    margin: 0.5rem 0;
  }
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    gap: 0.375rem;
    justify-content: center;
  }
`;

export const Tag = styled.span`
  /* ⭐ TAGS HARMONISÉS : Sobres et élégants */
  background-color: ${props => props.theme.tagBackground};
  color: ${props => props.theme.tagText};
  border: 1px solid ${props => props.theme.tagBorder};
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.tagBorder};
  }

  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    
    svg {
      width: 10px !important;
      height: 10px !important;
    }
  }
`;

export const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.tagText};
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 1;
  }
`;

export const AddTagSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.25rem;
    margin-top: 0.375rem;
    justify-content: center;
  }
`;

export const AddTagButton = styled.button`
  background-color: ${props => props.theme.tagBackground};
  color: ${props => props.theme.tagText};
  border: 1px solid ${props => props.theme.tagBorder};
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.tagBorder};
  }

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
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};

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

  @media (max-width: 768px) {
    gap: 0.2rem;
  }
`;

export const SubmitTagButton = styled.button`
  background-color: ${props => props.theme.tagBackground};
  color: ${props => props.theme.tagText};
  border: 1px solid ${props => props.theme.tagBorder};
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.tagBorder};
  }

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

  @media (max-width: 768px) {
    gap: 0.5rem;
    margin-top: 0.5rem;
    justify-content: center;
  }
`;

export const ActionButton = styled(Link)`
  /* ⭐ BOUTONS D'ACTION SOBRES ET ÉLÉGANTS */
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.actionButtonBackground;
      case 'secondary': return props.theme.actionButtonBackground;
      case 'danger': return props.theme.deleteButtonBackground;
      default: return props.theme.actionButtonBackground;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.actionButtonText;
      case 'secondary': return props.theme.actionButtonText;
      case 'danger': return props.theme.deleteButtonText;
      default: return props.theme.actionButtonText;
    }
  }};
  padding: ${props => props.size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.actionButtonBorder;
      case 'secondary': return props.theme.actionButtonBorder;
      case 'danger': return props.theme.deleteButtonBorder;
      default: return props.theme.actionButtonBorder;
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
    background-color: ${props => {
      switch(props.variant) {
        case 'primary': return props.theme.actionButtonHover;
        case 'secondary': return props.theme.actionButtonHover;
        case 'danger': return props.theme.deleteButtonHover;
        default: return props.theme.actionButtonHover;
      }
    }};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => props.theme.shadow};
  }

  svg {
    width: 16px;
    height: 16px;
  }

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
  /* ⭐ BOUTONS STANDARDS SOBRES ET ÉLÉGANTS */
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.actionButtonBackground;
      case 'secondary': return props.theme.actionButtonBackground;
      case 'danger': return props.theme.deleteButtonBackground;
      default: return props.theme.actionButtonBackground;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.actionButtonText;
      case 'secondary': return props.theme.actionButtonText;
      case 'danger': return props.theme.deleteButtonText;
      default: return props.theme.actionButtonText;
    }
  }};
  padding: ${props => props.variant === 'danger' ? '0.25rem 0.5rem' : '0.5rem 1rem'};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.actionButtonBorder;
      case 'secondary': return props.theme.actionButtonBorder;
      case 'danger': return props.theme.deleteButtonBorder;
      default: return props.theme.actionButtonBorder;
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
    background-color: ${props => {
      switch(props.variant) {
        case 'primary': return props.theme.actionButtonHover;
        case 'secondary': return props.theme.actionButtonHover;
        case 'danger': return props.theme.deleteButtonHover;
        default: return props.theme.actionButtonHover;
      }
    }};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => props.theme.shadow};
  }

  svg {
    width: ${props => props.variant === 'danger' ? '12px' : '16px'};
    height: ${props => props.variant === 'danger' ? '12px' : '16px'};
  }

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
  /* ⭐ BOUTON POUBELLE SOBRE ET ÉLÉGANT */
  background-color: ${props => props.theme.deleteButtonBackground};
  color: ${props => props.theme.deleteButtonText};
  border: 1px solid ${props => props.theme.deleteButtonBorder};
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: ${props => props.theme.deleteButtonHover};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(153, 27, 27, 0.2);
  }

  svg {
    width: 18px;
    height: 18px;
  }

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

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    border-radius: 6px;
  }
`;