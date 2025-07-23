// src/components/shared/SharedComponents.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

// ==================== CONTENEURS PARTAGÉS ====================

export const PageContainer = styled.div`
  padding: 2rem;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: calc(100vh - 60px);
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const SectionContainer = styled.div`
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
    border-radius: 12px 12px 0 0;
  }
`;

// ==================== TITRE UNIFIÉ ====================

export const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20, 0 4px 12px ${props => props.theme.shadow};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary || props.theme.textLight};
  }
`;

// ==================== CARTES UNIFIÉES ====================

export const Card = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  position: relative;
  overflow: visible;
  display: flex;
  flex-direction: column;
  height: fit-content;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
    border-radius: 12px 12px 0 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
    z-index: 100;
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

export const CardTitle = styled(Link)`
  color: ${props => props.theme.text};
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  line-height: 1.4;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

export const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardFooter = styled.div`
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

// ==================== GRILLES UNIFIÉES ====================

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// ==================== BOUTONS UNIFIÉS ====================

export const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  background-color: ${props => {
    if (props.variant === 'primary') return props.theme.primary;
    if (props.variant === 'secondary') return props.theme.card;
    if (props.variant === 'danger') return props.theme.error;
    return props.theme.primary;
  }};
  
  color: ${props => {
    if (props.variant === 'secondary') return props.theme.text;
    return 'white';
  }};
  
  border: ${props => {
    if (props.variant === 'secondary') return `1px solid ${props.theme.border}`;
    return 'none';
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => {
      if (props.variant === 'primary') return `${props.theme.primary}40`;
      if (props.variant === 'danger') return `${props.theme.error}40`;
      return props.theme.shadow;
    }};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const LinkButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  
  background-color: ${props => {
    if (props.variant === 'primary') return props.theme.primary;
    if (props.variant === 'secondary') return props.theme.card;
    if (props.variant === 'danger') return props.theme.error;
    return props.theme.primary;
  }};
  
  color: ${props => {
    if (props.variant === 'secondary') return props.theme.text;
    return 'white';
  }};
  
  border: ${props => {
    if (props.variant === 'secondary') return `1px solid ${props.theme.border}`;
    return 'none';
  }};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => {
      if (props.variant === 'primary') return `${props.theme.primary}40`;
      if (props.variant === 'danger') return `${props.theme.error}40`;
      return props.theme.shadow;
    }};
    color: ${props => {
      if (props.variant === 'secondary') return props.theme.text;
      return 'white';
    }};
  }
`;

// ==================== FILTRES UNIFIÉS ====================

export const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

export const FilterButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 20px;
  background-color: ${props => props.active ? props.theme.primary : props.theme.card};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.active ? props.theme.primaryHover : props.theme.hover};
  }
`;

// ==================== TAGS UNIFIÉS ====================

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const Tag = styled.span`
  background-color: ${props => {
    // Couleurs par type de tag
    if (props.type === 'IRM') return props.theme.primary;
    if (props.type === 'Ostéo') return props.theme.secondary;
    if (props.type === 'Genou') return props.theme.accent;
    if (props.type === 'Thorax') return props.theme.warning;
    return props.theme.textLight;
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
`;

// ==================== MÉTADONNÉES UNIFIÉES ====================

export const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

// ==================== PAGINATION UNIFIÉE ====================

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
`;

export const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background-color: ${props => props.active ? props.theme.primary : props.theme.card};
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: ${props => props.active ? '600' : '400'};

  &:hover:not(:disabled) {
    background-color: ${props => props.active ? props.theme.primaryHover : props.theme.hover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PaginationInfo = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

// ==================== INDICATEURS DE STATUT UNIFIÉS ====================

export const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  ${props => {
    if (props.status === 'public') {
      return `
        background-color: ${props.theme.statusPublic || props.theme.successLight};
        color: ${props.theme.statusPublicText || props.theme.success};
      `;
    }
    if (props.status === 'private') {
      return `
        background-color: ${props.theme.statusPrivate || props.theme.warningLight};
        color: ${props.theme.statusPrivateText || props.theme.warning};
      `;
    }
    if (props.status === 'draft') {
      return `
        background-color: ${props.theme.statusDraft || props.theme.cardSecondary};
        color: ${props.theme.statusDraftText || props.theme.textSecondary};
      `;
    }
    return `
      background-color: ${props.theme.cardSecondary};
      color: ${props.theme.textSecondary};
    `;
  }}
`;

// ==================== INDICATEURS DE TEMPS UNIFIÉ ====================

export const TimeIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

// ==================== WRAPPER POUR ICÔNES UNIFIÉ ====================

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  flex-shrink: 0;
`;