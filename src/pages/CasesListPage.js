// CasesListPage.js - VERSION AVEC SHARED COMPONENTS
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Star, ChevronDown, Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';

// Import des composants partagés
import {
  PageContainer,
  SearchInput,
  CasesList,
  CaseCard,
  CaseImage,
  CaseContent,
  CaseTitle,
  StarRating,
  TagsContainer,
  Tag,
  FilterContainer,
  FilterSection,
  FilterButton,
  SpoilerButton,
  DropdownContent,
  DropdownItem,
  DropdownCheckbox,
  LoadingMessage,
  ErrorMessage
} from '../components/shared/SharedComponents';

// ==================== STYLES SPÉCIFIQUES À CETTE PAGE ====================

const PageTitle = styled.h1`
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

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  margin: 2rem 0;

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

// ==================== COMPOSANT CARTE CAS ====================

function CaseCardComponent({ cas, showSpoilers }) {
  return (
    <CaseCard to={`/radiology-viewer/${cas._id}`}>
      <CaseImage 
        src={cas.mainImage ? cas.mainImage : (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) || '/images/default.jpg'}
        alt={cas.title}
        loading="lazy"
      />
      <CaseContent>
        <CaseTitle>{showSpoilers ? cas.title : '?'}</CaseTitle>
        <StarRating>
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={22}
              fill={index < cas.difficulty ? "gold" : "transparent"}
              stroke={index < cas.difficulty ? "gold" : "#d1d5db"}
              style={{ 
                filter: index < cas.difficulty ? 'drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3))' : 'none'
              }}
            />
          ))}
        </StarRating>
        <TagsContainer>
          {cas.tags && cas.tags.map(tag => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagsContainer>
      </CaseContent>
    </CaseCard>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================

function CasesListPage() {
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState([1,2,3,4,5]);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const [tagFilter, setTagFilter] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCases = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases?page=${page}&limit=12`);
      setCases(response.data.cases);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      const tags = new Set(response.data.cases.flatMap(cas => cas.tags || []));
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error('Erreur lors de la récupération des cas:', error);
      setError('Impossible de charger les cas. Veuillez réessayer plus tard.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases(1);
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
    <PageContainer style={{ padding: '2rem', backgroundColor: 'inherit' }}>
      <PageTitle>🗂️ Liste des cas</PageTitle>
      
      <SearchInput
        type="text"
        placeholder="🔍 Rechercher un cas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <FilterContainer>
        <FilterSection>
          <FilterButton 
            onClick={(e) => handleFilterClick(e, setShowDifficultyDropdown)}
            active={difficultyFilter.length !== 5}
            isOpen={showDifficultyDropdown}
          >
            ⭐ Difficulté ({difficultyFilter.length}/5) <ChevronDown size={16} />
          </FilterButton>
          {showDifficultyDropdown && (
            <DropdownContent onClick={(e) => e.stopPropagation()}>
              {[1,2,3,4,5].map(difficulty => (
                <DropdownItem key={difficulty}>
                  <DropdownCheckbox 
                    type="checkbox"
                    checked={difficultyFilter.includes(difficulty)}
                    onChange={() => handleDifficultyChange(difficulty)}
                  />
                  <span>{difficulty} étoile{difficulty > 1 ? 's' : ''}</span>
                </DropdownItem>
              ))}
            </DropdownContent>
          )}
        </FilterSection>

        <FilterSection>
          <FilterButton 
            onClick={(e) => handleFilterClick(e, setShowTagDropdown)}
            active={tagFilter.length > 0}
            isOpen={showTagDropdown}
          >
            🏷️ Tags ({tagFilter.length}/{allTags.length}) <ChevronDown size={16} />
          </FilterButton>
          {showTagDropdown && (
            <DropdownContent onClick={(e) => e.stopPropagation()}>
              {allTags.map(tag => (
                <DropdownItem key={tag}>
                  <DropdownCheckbox 
                    type="checkbox"
                    checked={tagFilter.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                  <span>{tag}</span>
                </DropdownItem>
              ))}
            </DropdownContent>
          )}
        </FilterSection>

        <SpoilerButton onClick={() => setShowSpoilers(!showSpoilers)}>
          {showSpoilers ? <EyeOff size={16} /> : <Eye size={16} />}
          {showSpoilers ? 'Masquer titres' : 'Voir titres'}
        </SpoilerButton>
      </FilterContainer>

      {isLoading ? (
        <LoadingMessage>
          🔄 Chargement des cas...
        </LoadingMessage>
      ) : error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#ef4444',
          background: '#fef2f2',
          borderRadius: '12px',
          margin: '2rem 0',
          border: '2px solid #ef444430',
          fontWeight: '500',
          fontSize: '1.1rem'
        }}>
          ⚠️ {error}
        </div>
      ) : filteredCases.length === 0 ? (
        <EmptyState>
          <h3>Aucun cas trouvé</h3>
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
    </PageContainer>
  );
}

export default CasesListPage;