// PublicCasesPage.js - VERSION AVEC SHARED COMPONENTS
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronDown, ChevronUp, Star, Eye, Copy, User, TrendingUp, Plus, EyeOff } from 'lucide-react';
import axios from '../utils/axiosConfig';
import RatingStars from '../components/RatingStars';

// Import des composants partagés
import {
  SearchInput,
  CasesList,
  CaseCard,
  CaseImage,
  CaseContent,
  CaseHeader,
  CaseTitle,
  StarRating,
  PopularityBadge,
  AuthorInfo,
  TagsContainer,
  Tag,
  FilterContainer,
  FilterSection,
  FilterButton,
  SpoilerButton,
  DropdownContent,
  DropdownItem,
  DropdownCheckbox,
  StatsContainer,
  StatItem,
  ActionsContainer,
  CopyActionButton,
  RatingSection,
  LoadingMessage,
  ErrorMessage
} from '../components/shared/SharedComponents';

// ==================== STYLES SPÉCIFIQUES À CETTE PAGE ====================

const PageContainer = styled.div`
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

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const MainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};

  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding: 2rem;
`;

const PaginationButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.primaryDark || props.theme.primary};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: ${props => props.theme.textSecondary};
    cursor: not-allowed;
    transform: none;
  }
`;

const PaginationInfo = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

// ==================== COMPOSANT CARTE CAS ====================

function CaseCardComponent({ cas, showSpoilers, onCopyCase }) {
  const [caseRating, setCaseRating] = useState({
    averageRating: cas.averageRating || 0,
    ratingsCount: cas.ratingsCount || 0,
    userRating: cas.userRating || null
  });

  const handleRatingUpdate = (caseId, newRatingData) => {
    setCaseRating(newRatingData);
  };

  const isPopular = (cas) => {
    const views = Number(cas?.views) || 0;
    const copies = Number(cas?.copies) || 0;
    return copies > 5 || views > 50;
  };

  const handleCardClick = (e) => {
    // Navigation gérée par le Link parent
  };

  return (
    <CaseCard to={`/radiology-viewer/${cas._id}`} onClick={handleCardClick}>
      <CaseImage 
        src={cas.mainImage || (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) || '/images/default.jpg'}
        alt={cas.title || 'Image sans titre'} 
      />
      <CaseContent>
        <CaseHeader>
          <CaseTitle>
            {showSpoilers ? (cas.title || 'Sans titre') : '?'}
          </CaseTitle>
          {isPopular(cas) && (
            <PopularityBadge>
              <TrendingUp size={12} />
              Populaire
            </PopularityBadge>
          )}
        </CaseHeader>

        <AuthorInfo>
          <User size={16} />
          Par <strong>{cas.user?.username || 'Utilisateur'}</strong>
        </AuthorInfo>

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

        <RatingSection>
          <div onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}>
            <RatingStars
              itemId={cas._id}
              itemType="case"
              averageRating={caseRating.averageRating}
              ratingsCount={caseRating.ratingsCount}
              userRating={caseRating.userRating}
              onRatingUpdate={(newRatingData) => handleRatingUpdate(cas._id, newRatingData)}
              size={14}
              compact={true}
            />
          </div>
        </RatingSection>

        <StatsContainer>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <StatItem>
              <Eye size={14} />
              {Number(cas.views) || 0} vues
            </StatItem>
            <StatItem>
              <Copy size={14} />
              {Number(cas.copies) || 0} copies
            </StatItem>
          </div>
          
          <ActionsContainer>
            <CopyActionButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCopyCase(cas._id);
              }}
            >
              <Plus size={16} />
            </CopyActionButton>
          </ActionsContainer>
        </StatsContainer>

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
        const cleanedCases = response.data.cases.map(cas => ({
          ...cas,
          averageRating: cas.averageRating ? Number(cas.averageRating) : 0,
          ratingsCount: cas.ratingsCount ? Number(cas.ratingsCount) : 0,
          userRating: cas.userRating || null,
          views: cas.views || cas.stats?.views || 0,
          copies: cas.copies || cas.stats?.copies || 0,
        }));
        
        setCases(cleanedCases);
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

  const handleCopyCase = async (caseId) => {
    try {
      await axios.post(`/cases/${caseId}/copy`);
      alert('✅ Cas copié dans vos cas personnels !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      alert('❌ Erreur lors de la copie du cas');
    }
  };

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

  return (
    <PageContainer>
      <HeaderSection>
        <MainTitle>📂 Cas Cliniques Publics</MainTitle>
      </HeaderSection>

      <SearchInput
        type="text"
        placeholder="🔍 Rechercher un cas clinique..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ maxWidth: '600px', margin: '0 auto 2rem', display: 'block', borderRadius: '50px' }}
      />

      <FilterContainer>
        <FilterSection>
          <FilterButton
            active={difficultyFilter.length !== 5}
            isOpen={showDifficultyDropdown}
            onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
          >
            ⭐ Difficulté
            <ChevronDown />
          </FilterButton>
          {showDifficultyDropdown && (
            <DropdownContent>
              {[1, 2, 3, 4, 5].map(difficulty => (
                <DropdownItem key={difficulty}>
                  <DropdownCheckbox
                    type="checkbox"
                    checked={difficultyFilter.includes(difficulty)}
                    onChange={() => handleDifficultyChange(difficulty)}
                  />
                  {difficulty} étoile{difficulty > 1 ? 's' : ''}
                </DropdownItem>
              ))}
            </DropdownContent>
          )}
        </FilterSection>

        <FilterSection>
          <FilterButton
            active={tagFilter.length > 0}
            isOpen={showTagDropdown}
            onClick={() => setShowTagDropdown(!showTagDropdown)}
          >
            🏷️ Tags
            <ChevronDown />
          </FilterButton>
          {showTagDropdown && (
            <DropdownContent>
              {allTags.map(tag => (
                <DropdownItem key={tag}>
                  <DropdownCheckbox
                    type="checkbox"
                    checked={tagFilter.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                  {tag}
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
          Chargement des cas publics...
        </LoadingMessage>
      ) : error ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          color: '#ef4444',
          background: '#fef2f2',
          borderRadius: '12px',
          margin: '2rem 0',
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      ) : filteredCases.length === 0 ? (
        <EmptyState>
          <h3>Aucun cas public trouvé</h3>
          <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
        </EmptyState>
      ) : (
        <CasesList>
          {filteredCases.map((cas) => (
            <CaseCardComponent 
              key={cas._id} 
              cas={cas} 
              showSpoilers={showSpoilers} 
              onCopyCase={handleCopyCase}
            />
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

export default PublicCasesPage;