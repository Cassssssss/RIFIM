import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Star, ChevronDown, Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';

// ==================== STYLED COMPONENTS HARMONISÉS AVEC LE THÈME ====================

const ModernPageContainer = styled.div`
  padding: 2rem;
  background: ${props => props.theme.background};
  min-height: calc(100vh - 60px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModernTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '🌍';
    font-size: 2rem;
    -webkit-text-fill-color: initial;
  }
`;

const ModernSearchInput = styled.input`
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

const FilterContainer = styled.div`
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

const FilterSection = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.primaryHover || props.theme.secondary});
  color: ${props => props.theme.buttonText || 'white'};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.primary}30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.primary}40;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &[data-open="true"] svg {
    transform: rotate(180deg);
  }
`;

const SpoilerButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.accent || '#f59e0b'}, #d97706);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.accent || '#f59e0b'}30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.accent || '#f59e0b'}40;
  }
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1rem;
  z-index: 10;
  box-shadow: 0 8px 25px ${props => props.theme.shadow};
  min-width: 200px;
  max-height: 250px;
  overflow-y: auto;

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary};
    border-radius: 3px;
  }
`;

const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.theme.hover};
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  input {
    width: 18px;
    height: 18px;
    accent-color: ${props => props.theme.primary};
    cursor: pointer;
  }
`;

const CasesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ModernCaseCard = styled(Link)`
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  text-decoration: none;
  color: ${props => props.theme.text};
  background-color: ${props => props.theme.card};
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};

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
    transform: translateY(-6px);
    box-shadow: 0 12px 30px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary}50;
  }
`;

const CaseImage = styled.img`
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ModernCaseCard}:hover & {
    transform: scale(1.05);
  }
`;

const CaseContent = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CaseTitle = styled.h2`
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
  color: ${props => props.theme.primary};
  line-height: 1.3;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  justify-content: center;
`;

const ModernTag = styled.span`
  background: linear-gradient(135deg, ${props => props.theme.tagBackground || props.theme.primary}, ${props => props.theme.primary});
  color: ${props => props.theme.tagText || 'white'};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 1px 3px ${props => props.theme.shadow};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};

  &::before {
    content: '🔄';
    font-size: 2rem;
    display: block;
    margin-bottom: 1rem;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.error || '#ef4444'};
  font-size: 1.1rem;
  background-color: ${props => props.theme.errorLight || '#fef2f2'};
  border: 2px solid ${props => props.theme.error || '#ef4444'}30;
  border-radius: 12px;
  margin: 2rem 0;
  font-weight: 500;

  &::before {
    content: '⚠️';
    font-size: 1.5rem;
    display: block;
    margin-bottom: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  margin: 2rem 0;

  &::before {
    content: '📭';
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
  }

  h3 {
    color: ${props => props.theme.primary};
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.textSecondary};
    font-size: 1.1rem;
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

function CaseCardComponent({ cas, showSpoilers }) {
  if (!cas) return null;

  return (
    <ModernCaseCard to={`/radiology-viewer/${cas._id}`}>
      <CaseImage 
        src={cas.mainImage || '/images/default.jpg'}
        alt={cas.title || 'Cas sans titre'}
        loading="lazy"
      />
      <CaseContent>
        <CaseTitle>{showSpoilers ? (cas.title || 'Sans titre') : '?'}</CaseTitle>
        <StarRating>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={22}
              fill={index < (cas.difficulty || 0) ? "gold" : "transparent"}
              stroke={index < (cas.difficulty || 0) ? "gold" : "#d1d5db"}
              style={{ 
                filter: index < (cas.difficulty || 0) ? 'drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3))' : 'none'
              }}
            />
          ))}
        </StarRating>
        <TagsContainer>
          {cas.tags && cas.tags.map(tag => (
            <ModernTag key={tag}>{tag}</ModernTag>
          ))}
        </TagsContainer>
      </CaseContent>
    </ModernCaseCard>
  );
}

function PublicCasesPage() {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState([1,2,3,4,5]);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagFilter, setTagFilter] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCases = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases/public?page=${page}&limit=12`);
      if (response.data) {
        setCases(response.data.cases);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        const tags = new Set(response.data.cases.flatMap(cas => cas.tags || []));
        setAllTags(Array.from(tags));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des cas publics:', error);
      setError("Impossible de charger les cas publics. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const filteredCases = cases.filter(cas => 
    cas.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    difficultyFilter.includes(cas.difficulty) &&
    (tagFilter.length === 0 || tagFilter.some(tag => cas.tags && cas.tags.includes(tag)))
  );

  const handleDifficultyChange = (difficulty) => {
    setDifficultyFilter(prev => 
      prev.includes(difficulty) 
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleTagChange = (tag) => {
    setTagFilter(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDifficultyDropdown(false);
      setShowTagDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleFilterClick = (e, setter) => {
    e.stopPropagation();
    setter(prev => !prev);
  };

  return (
    <ModernPageContainer>
      <ModernTitle>Cas Publics</ModernTitle>
      
      <ModernSearchInput
        type="text"
        placeholder="🔍 Rechercher un cas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <FilterContainer>
        <FilterSection>
          <FilterButton 
            onClick={(e) => handleFilterClick(e, setShowDifficultyDropdown)}
            data-open={showDifficultyDropdown}
          >
            ⭐ Difficulté ({difficultyFilter.length}/5) <ChevronDown size={16} />
          </FilterButton>
          {showDifficultyDropdown && (
            <Dropdown onClick={(e) => e.stopPropagation()}>
              {[1,2,3,4,5].map(difficulty => (
                <DropdownOption key={difficulty}>
                  <input 
                    type="checkbox"
                    checked={difficultyFilter.includes(difficulty)}
                    onChange={() => handleDifficultyChange(difficulty)}
                  />
                  <span>{difficulty} étoile{difficulty > 1 ? 's' : ''}</span>
                </DropdownOption>
              ))}
            </Dropdown>
          )}
        </FilterSection>

        <FilterSection>
          <FilterButton 
            onClick={(e) => handleFilterClick(e, setShowTagDropdown)}
            data-open={showTagDropdown}
          >
            🏷️ Tags ({tagFilter.length}/{allTags.length}) <ChevronDown size={16} />
          </FilterButton>
          {showTagDropdown && (
            <Dropdown onClick={(e) => e.stopPropagation()}>
              {allTags.map(tag => (
                <DropdownOption key={tag}>
                  <input 
                    type="checkbox"
                    checked={tagFilter.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                  <span>{tag}</span>
                </DropdownOption>
              ))}
            </Dropdown>
          )}
        </FilterSection>

        <SpoilerButton onClick={() => setShowSpoilers(!showSpoilers)}>
          {showSpoilers ? <EyeOff size={16} /> : <Eye size={16} />}
          {showSpoilers ? 'Masquer titres' : 'Voir titres'}
        </SpoilerButton>
      </FilterContainer>

      {isLoading ? (
        <LoadingMessage>
          Chargement des cas publics...
        </LoadingMessage>
      ) : error ? (
        <ErrorMessage>
          {error}
        </ErrorMessage>
      ) : filteredCases.length === 0 ? (
        <EmptyState>
          <h3>Aucun cas public trouvé</h3>
          <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
        </EmptyState>
      ) : (
        <CasesList>
          {filteredCases.map((cas) => (
            <CaseCardComponent key={cas._id} cas={cas} showSpoilers={showSpoilers} />
          ))}
        </CasesList>
      )}

      {totalPages > 1 && (
        <PaginationContainer>
          <PaginationButton 
            onClick={() => fetchCases(currentPage - 1)} 
            disabled={currentPage === 1}
          >
            ← Précédent
          </PaginationButton>
          <PaginationInfo>
            Page {currentPage} sur {totalPages} • {filteredCases.length} cas
          </PaginationInfo>
          <PaginationButton 
            onClick={() => fetchCases(currentPage + 1)} 
            disabled={currentPage === totalPages}
          >
            Suivant →
          </PaginationButton>
        </PaginationContainer>
      )}
    </ModernPageContainer>
  );
}

export default PublicCasesPage;