// PublicCasesPage.js - VERSION CORRIGÉE AVEC BANDE DÉGRADÉE ET BOUTON HARMONISÉ
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronDown, ChevronUp, Star, Eye, Copy, User, TrendingUp, Plus, EyeOff } from 'lucide-react';
import axios from '../utils/axiosConfig';
import RatingStars from '../components/RatingStars';

// ==================== STYLES CONTAINER PRINCIPAL ====================

const ModernPageContainer = styled.div`
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

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
`;

// ==================== BARRE DE RECHERCHE ====================

const SearchBar = styled.input`
  width: 100%;
  max-width: 600px;
  margin: 0 auto 2rem;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 50px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  display: block;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

// ==================== SECTION FILTRES ====================

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const FilterGroup = styled.div`
  position: relative;
`;

const FilterButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${props => props.active ? props.theme.primary : props.theme.card};
  color: ${props => props.active ? 'white' : props.theme.buttonSecondaryText};
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.borderLight};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 120px;
  justify-content: space-between;

  &:hover {
    background-color: ${props => props.active ? props.theme.primaryDark || props.theme.primary : props.theme.hover};
  }

  svg {
    transition: transform 0.2s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
`;

const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

const DropdownCheckbox = styled.input`
  margin-right: 0.5rem;
  accent-color: ${props => props.theme.primary};
`;

const SpoilerButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.secondary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.secondaryDark || props.theme.secondary};
    transform: translateY(-1px);
  }
`;

const CasesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const ModernCaseCard = styled(Link)`
  display: block;
  background: ${props => props.theme.card};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  text-decoration: none;
  border: 1px solid ${props => props.theme.border};
  position: relative;

  /* CORRECTION : Remettre la bande dégradée au-dessus de chaque carte */
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
    transform: translateY(-8px);
    box-shadow: 0 12px 40px ${props => props.theme.shadowMedium};
    border-color: ${props => props.theme.primary};
  }
`;

const CaseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  background-color: ${props => props.theme.borderLight};
`;

const CaseContent = styled.div`
  padding: 1.5rem;
`;

const CaseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CaseTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  flex: 1;
  line-height: 1.4;
`;

const PopularityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 0.5rem;
  white-space: nowrap;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StarRating = styled.div`
  display: flex;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const RatingSection = styled.div`
  margin-bottom: 1rem;
  padding: 0.5rem 0;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid ${props => props.theme.borderLight};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  /* CORRECTION : Ajouter padding-bottom pour éviter que le tooltip soit rogné */
  padding-bottom: 10px;
`;

// CORRECTION : Bouton d'action avec même couleur que PublicQuestionnairesPage
const ActionButton = styled.button`
  /* CORRECTION : Même couleur que PublicQuestionnairesPage (primary) */
  background: ${props => props.theme.primary};
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
  position: relative;

  &:hover {
    /* CORRECTION : Même couleur de survol que PublicQuestionnairesPage */
    background: ${props => props.theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px ${props => props.theme.primary}40;
  }

  /* CORRECTION : Tooltip mieux positionné pour éviter d'être rogné */
  &:hover::after {
    content: "Ajouter à mes cas";
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: ${props => props.theme.text};
    color: ${props => props.theme.background};
    padding: 0.4rem 0.6rem;
    border-radius: 4px;
    font-size: 0.7rem;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    margin-bottom: 5px;
  }

  /* CORRECTION : Ajouter une petite flèche au tooltip */
  &:hover::before {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 4px solid transparent;
    border-top-color: ${props => props.theme.text};
    z-index: 1001;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

// CORRECTION : Tags corrigés pour le mode sombre
const ModernTag = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: ${props => props.theme.tagBackground};
  color: ${props => props.theme.tagText};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid ${props => props.theme.tagBackground};
  
  /* CORRECTION : S'assurer que les tags sont visibles en mode sombre */
  ${props => props.theme.background === '#1a202c' && `
    background-color: #4a5568;
    color: #e2e8f0;
    border-color: #4a5568;
  `}
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
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

// ==================== COMPOSANTS ====================

function CaseCardComponent({ cas, showSpoilers, onCopyCase }) {
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
            {/* CORRECTION : Remplacer le bouton texte par une icône avec tooltip */}
            <ActionButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCopyCase(cas._id);
              }}
            >
              <Plus size={16} />
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

      <SearchBar
        type="text"
        placeholder="🔍 Rechercher un cas clinique..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <FilterContainer>
        <FilterGroup>
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
        </FilterGroup>

        <FilterGroup>
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
        </FilterGroup>

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
    </ModernPageContainer>
  );
}

export default PublicCasesPage;