import { control, dangerControl, iconControl, quietControl, tagStyle, variantControl } from './designSystem';
import { pageHeading, pageLayout, pageTitle } from './designSystem';
// src/components/shared/SharedComponents.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// ==================== CONTENEURS PARTAGÉS ====================

export const PageContainer = styled.div`
  ${pageLayout}
`;

export const FilterSection = styled.div`
  width: 280px;
  margin-right: 2rem;
  background-color: ${props => props.theme.card};
  padding: 1.5rem;
  border-radius: ${props => props.theme.radii.card};
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
  ${control}
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
  box-shadow: ${props => props.theme.shadows.card};
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
  min-width: 0;
  width: 100%;
`;

// Les actions principales se lisent sur une ligne, à gauche, comme dans
// n'importe quelle application : on ne centre pas une barre d'actions.
export const TopActionsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 0;
`;

// ==================== EN-TÊTE DE PAGE ====================

// Titre + sous-titre à gauche, actions à droite, séparés du contenu par un
// filet. Remplace les grands titres centrés qui mangeaient un demi-écran.
export const PageHead = styled.header`
  ${pageHeading}
`;

export const PageHeadText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
  h1 { ${pageTitle} }
  p { font-size: 0.95rem; margin: 0; color: ${props => props.theme.textSecondary}; }
`;

// Barre d'outils : recherche + filtres sur une seule ligne, alignés à gauche.
export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

// ==================== INPUTS UNIFIÉS ====================

export const SearchInput = styled.input`
  flex: 1 1 260px;
  max-width: 380px;
  min-width: 0;
  padding: 0.6rem 1rem;
  margin: 0;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.radii?.md || '10px'};
  font-size: 0.95rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}22;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

// ==================== GRILLES UNIFIÉES PLEINE LARGEUR ====================

export const QuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* 🔧 OPTIMISATION : Plus de cartes par ligne */
  gap: 1.2rem; /* 🔧 OPTIMISATION : Gap réduit pour plus de cartes */
  margin: 2rem 0;
  padding: 0;
  width: 100%; /* 🔧 OPTIMISATION : Utilise toute la largeur */
  max-width: none; /* 🔧 OPTIMISATION : Pas de limite de largeur */

  /* 🔧 Pour les très grands écrans (4K+) */
  @media (min-width: 2560px) {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 1.5rem;
  }

  /* 🔧 Pour les écrans larges (1920px+) */
  @media (min-width: 1920px) and (max-width: 2559px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  }

  /* 🔧 Pour les écrans moyens (1440px+) */
  @media (min-width: 1440px) and (max-width: 1919px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  }

  /* 🔧 Pour les tablettes et petits écrans */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  /* 🔧 MODIFICATION PRINCIPALE : Optimisation pour mobile avec 2 colonnes compactes */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    @media (max-width: 480px) { grid-template-columns: 1fr; }
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0;
  }
`;

export const CasesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); /* 🔧 OPTIMISATION : Cartes plus petites pour plus par ligne */
  gap: 1.2rem; /* 🔧 OPTIMISATION : Gap réduit */
  margin: 2rem 0;
  padding: 0;
  width: 100%; /* 🔧 OPTIMISATION : Utilise toute la largeur */
  max-width: none; /* 🔧 OPTIMISATION : Pas de limite de largeur */

  /* 🔧 Pour les très grands écrans (4K+) */
  @media (min-width: 2560px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  /* 🔧 Pour les écrans larges (1920px+) */
  @media (min-width: 1920px) and (max-width: 2559px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }

  /* 🔧 Pour les écrans moyens (1440px+) */
  @media (min-width: 1440px) and (max-width: 1919px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }

  /* 🔧 Pour les tablettes et petits écrans */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
  }

  /* 🔧 MODIFICATION PRINCIPALE : Optimisation pour mobile avec 2 colonnes compactes */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    @media (max-width: 480px) { grid-template-columns: 1fr; }
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding: 0;
  }
`;

// ==================== CARTES UNIFIÉES ====================

export const QuestionnaireCard = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.25rem;
  transition: border-color 150ms ease;
  &:hover { border-color: ${props => props.theme.textLight}; }
  @media (max-width: 768px) { padding: 1rem; }

`;

// ==================== COMPOSANTS CARTE CAS PARTAGÉS ====================

export const CaseCard = styled(Link)`
  display: block;
  background-color: ${props => props.theme.surface || props.theme.card};
  border-radius: ${props => props.theme.radii.card};
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
  background: ${props => props.theme.secondary};
  color: ${props => props.theme.buttonText};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.radii.card};
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
  ${quietControl}
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
  color: ${props => props.active ? props.theme.buttonText : props.theme.text};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
  }
`;

export const SpoilerButton = styled.button`
  background-color: ${props => props.active ? props.theme.secondary : props.theme.disabled};
  color: ${props => props.theme.buttonText};
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
    background-color: ${props => props.active ? props.theme.secondaryHover : props.theme.textSecondary};
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
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  margin: 0;
  color: ${props => props.theme.text};
  overflow-wrap: anywhere;
`;

export const QuestionnaireIcon = styled.span`
  display: inline-flex;
  color: ${props => props.theme.textLight};
  flex: 0 0 auto;
  svg { width: 19px; height: 19px; stroke-width: 1.6; }
`;

export const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem 0.9rem;
  margin: 0.8rem 0 1rem;
  padding: 0;
  background: transparent;
  border: 0;
`;

export const MetaItem = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.75rem;
  line-height: 1.5;
  svg { width: 14px; height: 14px; flex-shrink: 0; stroke-width: 1.6; }
`;

// ==================== TAGS UNIFIÉS ====================

export const TagsSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin: 0 0 1rem;
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
`;

export const Tag = styled.span`
  ${tagStyle}
`;

export const RemoveTagButton = styled.button`
  ${quietControl}
  padding: 0;
  min-height: 20px;
  width: 20px;
  @media (pointer: coarse) { min-height: 32px; width: 32px; }
`;

export const AddTagSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
`;

export const AddTagButton = styled.button`
  ${quietControl}
  font-size: 0.72rem;
  padding: 0.25rem 0.35rem;
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
  ${control}
  ${iconControl}
`;

export const CancelTagButton = styled.button`
  ${quietControl}
  ${iconControl}
`;

// ==================== BOUTONS UNIFIÉS ====================

export const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.borderLight};
`;

export const ActionButton = styled(Link)`
  ${variantControl}
`;

export const Button = styled.button`
  ${variantControl}
`;

export const DeleteButton = styled.button`
  ${dangerControl}
  ${iconControl}
`;

export const TutorialButton = styled.button`
  ${control}
`;

export const VideoContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.card};
  border-radius: ${props => props.theme.radii.card};
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
  color: ${props => props.theme.error};
  font-size: 1.1rem;
  background-color: ${props => props.theme.errorLight};
  border: 1px solid ${props => props.theme.error};
  border-radius: 8px;
  margin: 1rem 0;

  /* 🔧 MODIFICATION : Message d'erreur plus compact sur mobile */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    border-radius: 6px;
  }
`;