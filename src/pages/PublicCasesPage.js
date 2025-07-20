import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Star, Eye, EyeOff, ChevronDown, TrendingUp, User, Copy } from 'lucide-react';
import axios from '../utils/axiosConfig';
import RatingStars from '../components/RatingStars'; // NOUVEAU : Import du système de notation

// ==================== STYLED COMPONENTS ====================

const ModernPageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}15, ${props => props.theme.secondary}15);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.primary}20;
`;

const MainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 2px 10px ${props => props.theme.shadow};
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 250px;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const FilterDropdown = styled.div`
  position: relative;
  min-width: 150px;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
  }

  &[data-open="true"] {
    border-color: ${props => props.theme.primary};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.primary};
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
`;

const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${props => props.theme.text};

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  input {
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.primary};
  }
`;

const SpoilerButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primaryDark || props.theme.primary};
    transform: translateY(-2px);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  font-size: 1.1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin: 2rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const CasesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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

const CaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CaseTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  line-height: 1.3;
  flex: 1;
  margin: 0;
`;

const PopularityBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => props.theme.success};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
`;

const CaseMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

// NOUVEAU : Section de notation
const RatingSection = styled.div`
  padding: 0.5rem 0;
  border-top: 1px solid ${props => props.theme.borderLight};
  border-bottom: 1px solid ${props => props.theme.borderLight};
  margin: 0.75rem 0;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hover};
  }

  &.primary {
    background-color: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};

    &:hover {
      background-color: ${props => props.theme.primaryDark || props.theme.primary};
    }
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  justify-content: center;
`;

const ModernTag = styled.span`
  background: linear-gradient(135deg, ${props => props.theme.primary}20, ${props => props.theme.secondary}20);
  color: ${props => props.theme.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid ${props => props.theme.primary}30;
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

// ==================== COMPOSANTS ====================

function CaseCardComponent({ cas, showSpoilers }) {
  // NOUVEAU : États pour la gestion des notes
  const [caseRating, setCaseRating] = useState({
    averageRating: cas.averageRating || 0,
    ratingsCount: cas.ratingsCount || 0,
    userRating: cas.userRating || null
  });

  // NOUVEAU : Gestion de la mise à jour des notes
  const handleRatingUpdate = (caseId, newRatingData) => {
    setCaseRating(newRatingData);
  };

  // NOUVEAU : Fonction pour déterminer si un cas est populaire
  const isPopular = (cas) => {
    const views = Number(cas?.views) || 0;
    const copies = Number(cas?.copies) || 0;
    return copies > 5 || views > 50;
  };

  // NOUVEAU : Gestion du clic sur la carte (éviter la navigation lors du clic sur notation)
  const handleCardClick = (e) => {
    // Ne rien faire ici, la navigation est gérée par le Link parent
  };

  return (
    <ModernCaseCard to={`/radiology-viewer/${cas._id}`} onClick={handleCardClick}>
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

        <CaseMeta>
          <MetaItem>
            <span>📊</span>
            Difficulté {cas.difficulty || 1}/5
          </MetaItem>
          {cas.tags && cas.tags.length > 0 && (
            <MetaItem>
              <span>🏷️</span>
              {cas.tags.length} tag{cas.tags.length > 1 ? 's' : ''}
            </MetaItem>
          )}
        </CaseMeta>

        {/* NOUVEAU : Section de notation optimisée */}
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
            <ActionButton
              className="primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Logique de copie du cas
                handleCopyCase(cas._id);
              }}
            >
              Copier
            </ActionButton>
          </ActionsContainer>
        </StatsContainer>

        <TagsContainer>
          {cas.tags && cas.tags.map(tag => (
            <ModernTag key={tag}>{tag}</ModernTag>
          ))}
        </TagsContainer>
      </CaseContent>
    </ModernCaseCard>
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
        // MODIFIÉ : Nettoyer les données pour inclure les informations de notation
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

  // NOUVEAU : Fonction pour copier un cas
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
    <ModernPageContainer>
      <HeaderSection>
        <MainTitle>📂 Cas Cliniques Publics</MainTitle>
        <SubTitle>
          Explorez une collection de cas cliniques partagés par la communauté. 
          Apprenez, pratiquez et enrichissez vos connaissances en radiologie.
        </SubTitle>
      </HeaderSection>

      <FilterContainer>
        <SearchInput
          type="text"
          placeholder="🔍 Rechercher un cas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FilterDropdown>
          <DropdownButton 
            onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
            data-open={showDifficultyDropdown}
          >
            Difficulté ({difficultyFilter.length}/5)
            <ChevronDown size={16} />
          </DropdownButton>
          {showDifficultyDropdown && (
            <DropdownMenu>
              {[1, 2, 3, 4, 5].map(level => (
                <DropdownItem key={level}>
                  <input
                    type="checkbox"
                    checked={difficultyFilter.includes(level)}
                    onChange={() => handleDifficultyChange(level)}
                  />
                  Niveau {level}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </FilterDropdown>

        <FilterDropdown>
          <DropdownButton 
            onClick={() => setShowTagDropdown(!showTagDropdown)}
            data-open={showTagDropdown}
          >
            Tags ({tagFilter.length})
            <ChevronDown size={16} />
          </DropdownButton>
          {showTagDropdown && (
            <DropdownMenu>
              {allTags.map(tag => (
                <DropdownItem key={tag}>
                  <input
                    type="checkbox"
                    checked={tagFilter.includes(tag)}
                    onChange={() => handleTagChange(tag)}
                  />
                  {tag}
                </DropdownItem>
              ))}
            </DropdownMenu>
          )}
        </FilterDropdown>

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