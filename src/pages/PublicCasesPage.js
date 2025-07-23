// PublicCasesPage.js - VERSION AVEC SHARED COMPONENTS UNIFIÉS
import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axiosConfig';
import { ChevronDown, Star, Eye, Copy, User, TrendingUp, Plus, EyeOff } from 'lucide-react';
import RatingStars from '../components/RatingStars';

// Import des composants partagés unifiés
import {
  UnifiedPageContainer,
  PageHeader,
  UnifiedPageTitle,
  PageSubtitle,
  SearchAndFiltersSection,
  UnifiedSearchInput,
  UnifiedFilterContainer,
  UnifiedFilterSection,
  UnifiedFilterButton,
  UnifiedSpoilerButton,
  UnifiedDropdownContent,
  UnifiedDropdownItem,
  UnifiedDropdownCheckbox,
  UnifiedCasesList,
  UnifiedCaseCard,
  UnifiedCaseImage,
  UnifiedCaseContent,
  UnifiedCaseHeader,
  UnifiedCaseTitle,
  UnifiedStarRating,
  UnifiedPopularityBadge,
  UnifiedAuthorInfo,
  UnifiedStatsContainer,
  UnifiedStatItem,
  UnifiedActionsContainer,
  UnifiedActionButton,
  UnifiedRatingSection,
  UnifiedTagsContainer,
  UnifiedTag,
  UnifiedPaginationContainer,
  UnifiedPaginationButton,
  UnifiedPaginationInfo,
  UnifiedEmptyState,
  UnifiedLoadingMessage,
  UnifiedErrorMessage
} from '../components/shared/SharedCasesComponents';

// ==================== COMPOSANT CARTE CAS PUBLIC ====================

function PublicCaseCardComponent({ cas, showSpoilers, onCopyCase, caseRating, onRatingUpdate }) {
  const getImageSrc = (cas) => {
    if (cas.mainImage) return cas.mainImage;
    if (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) {
      return cas.folderMainImages[cas.folders[0]];
    }
    return '/images/default.jpg';
  };

  const isPopular = cas.views > 100 || cas.copies > 20;

  return (
    <UnifiedCaseCard to={`/radiology-viewer/${cas._id}`}>
      <UnifiedCaseImage 
        src={getImageSrc(cas)}
        alt={cas.title || 'Cas médical'}
        loading="lazy"
        onError={(e) => {
          e.target.src = '/images/default.jpg';
        }}
      />
      <UnifiedCaseContent>
        <UnifiedCaseHeader>
          <UnifiedCaseTitle>
            {showSpoilers ? (cas.title || 'Cas sans titre') : '?'}
          </UnifiedCaseTitle>
          {isPopular && (
            <UnifiedPopularityBadge>
              <TrendingUp size={12} />
              Populaire
            </UnifiedPopularityBadge>
          )}
        </UnifiedCaseHeader>
        
        <UnifiedStarRating>
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
        </UnifiedStarRating>

        {cas.author && (
          <UnifiedAuthorInfo>
            <User size={14} />
            Par {cas.author.name || cas.author.email || 'Auteur anonyme'}
          </UnifiedAuthorInfo>
        )}

        <UnifiedRatingSection>
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
              onRatingUpdate={(newRatingData) => onRatingUpdate(cas._id, newRatingData)}
              size={14}
              compact={true}
            />
          </div>
        </UnifiedRatingSection>

        <UnifiedStatsContainer>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <UnifiedStatItem>
              <Eye size={14} />
              {Number(cas.views) || 0} vues
            </UnifiedStatItem>
            <UnifiedStatItem>
              <Copy size={14} />
              {Number(cas.copies) || 0} copies
            </UnifiedStatItem>
          </div>
          
          <UnifiedActionsContainer>
            <UnifiedActionButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCopyCase(cas._id);
              }}
              title="Copier ce cas dans vos cas personnels"
            >
              <Plus size={16} />
            </UnifiedActionButton>
          </UnifiedActionsContainer>
        </UnifiedStatsContainer>

        {cas.tags && cas.tags.length > 0 && (
          <UnifiedTagsContainer>
            {cas.tags.map((tag, index) => (
              <UnifiedTag key={index}>{tag}</UnifiedTag>
            ))}
          </UnifiedTagsContainer>
        )}
      </UnifiedCaseContent>
    </UnifiedCaseCard>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================

function PublicCasesPage() {
  // États
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState([1, 2, 3, 4, 5]);
  const [tagFilter, setTagFilter] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [caseRatings, setCaseRatings] = useState({});

  // États des dropdowns
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // Récupération des cas publics
  const fetchCases = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases/public?page=${page}&limit=12`);
      
      if (response.data && Array.isArray(response.data.cases)) {
        const cleanedCases = response.data.cases.map(cas => ({
          ...cas,
          averageRating: cas.averageRating ? Number(cas.averageRating) : 0,
          ratingsCount: cas.ratingsCount ? Number(cas.ratingsCount) : 0,
          views: Number(cas.views) || 0,
          copies: Number(cas.copies) || 0
        }));

        setCases(cleanedCases);
        setCurrentPage(response.data.currentPage || page);
        setTotalPages(response.data.totalPages || 1);
        
        // Initialisation des ratings
        const ratings = {};
        cleanedCases.forEach(cas => {
          ratings[cas._id] = {
            averageRating: cas.averageRating || 0,
            ratingsCount: cas.ratingsCount || 0,
            userRating: cas.userRating || 0
          };
        });
        setCaseRatings(ratings);
        
        // Extraction des tags uniques
        const uniqueTags = [...new Set(
          cleanedCases
            .filter(cas => cas.tags && Array.isArray(cas.tags))
            .flatMap(cas => cas.tags)
        )];
        setAllTags(uniqueTags);
      } else {
        setCases([]);
        setTotalPages(1);
        setAllTags([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des cas publics:', error);
      setError('Erreur lors du chargement des cas publics. Veuillez réessayer.');
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effet initial
  useEffect(() => {
    fetchCases(currentPage);
  }, [fetchCases, currentPage]);

  // Filtrage des cas
  useEffect(() => {
    let filtered = cases;

    // Filtre par terme de recherche
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(cas => 
        (cas.title && cas.title.toLowerCase().includes(term)) ||
        (cas.tags && cas.tags.some(tag => tag.toLowerCase().includes(term))) ||
        (cas.author && (
          (cas.author.name && cas.author.name.toLowerCase().includes(term)) ||
          (cas.author.email && cas.author.email.toLowerCase().includes(term))
        ))
      );
    }

    // Filtre par difficulté
    if (difficultyFilter.length > 0) {
      filtered = filtered.filter(cas => 
        difficultyFilter.includes(cas.difficulty || 1)
      );
    }

    // Filtre par tags
    if (tagFilter.length > 0) {
      filtered = filtered.filter(cas =>
        cas.tags && cas.tags.some(tag => tagFilter.includes(tag))
      );
    }

    setFilteredCases(filtered);
  }, [cases, searchTerm, difficultyFilter, tagFilter]);

  // Gestionnaires d'événements
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchCases(newPage);
    }
  };

  const handleCopyCase = async (caseId) => {
    try {
      await axios.post(`/cases/${caseId}/copy`);
      alert('Cas copié avec succès dans vos cas personnels !');
      
      // Mise à jour du compteur de copies
      setCases(prevCases => 
        prevCases.map(cas => 
          cas._id === caseId 
            ? { ...cas, copies: (Number(cas.copies) || 0) + 1 }
            : cas
        )
      );
    } catch (error) {
      console.error('Erreur lors de la copie du cas:', error);
      alert('Erreur lors de la copie du cas. Veuillez réessayer.');
    }
  };

  const handleRatingUpdate = (caseId, newRatingData) => {
    setCaseRatings(prev => ({
      ...prev,
      [caseId]: newRatingData
    }));
  };

  // Fermeture des dropdowns au clic extérieur
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDifficultyDropdown(false);
      setShowTagDropdown(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Rendu du composant
  return (
    <UnifiedPageContainer>
      <PageHeader>
        <UnifiedPageTitle>Cas Cliniques Publics</UnifiedPageTitle>
      </PageHeader>

      <SearchAndFiltersSection>
        <UnifiedSearchInput
          type="text"
          placeholder="Rechercher dans les cas publics (titre, tags, auteur...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <UnifiedFilterContainer>
          {/* Filtre par difficulté */}
          <UnifiedFilterSection>
            <UnifiedFilterButton
              active={difficultyFilter.length < 5}
              isOpen={showDifficultyDropdown}
              onClick={(e) => {
                e.stopPropagation();
                setShowDifficultyDropdown(!showDifficultyDropdown);
                setShowTagDropdown(false);
              }}
            >
              ⭐ Difficulté
              <ChevronDown />
            </UnifiedFilterButton>
            {showDifficultyDropdown && (
              <UnifiedDropdownContent>
                {[1, 2, 3, 4, 5].map(difficulty => (
                  <UnifiedDropdownItem key={difficulty}>
                    <UnifiedDropdownCheckbox
                      type="checkbox"
                      checked={difficultyFilter.includes(difficulty)}
                      onChange={() => handleDifficultyChange(difficulty)}
                    />
                    {difficulty} étoile{difficulty > 1 ? 's' : ''}
                  </UnifiedDropdownItem>
                ))}
              </UnifiedDropdownContent>
            )}
          </UnifiedFilterSection>

          {/* Filtre par tags */}
          {allTags.length > 0 && (
            <UnifiedFilterSection>
              <UnifiedFilterButton
                active={tagFilter.length > 0}
                isOpen={showTagDropdown}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTagDropdown(!showTagDropdown);
                  setShowDifficultyDropdown(false);
                }}
              >
                🏷️ Tags
                <ChevronDown />
              </UnifiedFilterButton>
              {showTagDropdown && (
                <UnifiedDropdownContent>
                  {allTags.map(tag => (
                    <UnifiedDropdownItem key={tag}>
                      <UnifiedDropdownCheckbox
                        type="checkbox"
                        checked={tagFilter.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                      />
                      {tag}
                    </UnifiedDropdownItem>
                  ))}
                </UnifiedDropdownContent>
              )}
            </UnifiedFilterSection>
          )}

          {/* Bouton spoiler */}
          <UnifiedSpoilerButton 
            onClick={() => setShowSpoilers(!showSpoilers)}
          >
            {showSpoilers ? <EyeOff size={16} /> : <Eye size={16} />}
            {showSpoilers ? 'Masquer titres' : 'Voir titres'}
          </UnifiedSpoilerButton>
        </UnifiedFilterContainer>
      </SearchAndFiltersSection>

      {/* Contenu principal */}
      {isLoading ? (
        <UnifiedLoadingMessage>
          Chargement des cas publics...
        </UnifiedLoadingMessage>
      ) : error ? (
        <UnifiedErrorMessage>
          {error}
        </UnifiedErrorMessage>
      ) : filteredCases.length === 0 ? (
        <UnifiedEmptyState>
          <h3>Aucun cas public trouvé</h3>
          <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
        </UnifiedEmptyState>
      ) : (
        <>
          <UnifiedCasesList>
            {filteredCases.map((cas) => (
              <PublicCaseCardComponent 
                key={cas._id} 
                cas={cas} 
                showSpoilers={showSpoilers}
                onCopyCase={handleCopyCase}
                caseRating={caseRatings[cas._id] || { averageRating: 0, ratingsCount: 0, userRating: 0 }}
                onRatingUpdate={handleRatingUpdate}
              />
            ))}
          </UnifiedCasesList>

          {/* Pagination */}
          {totalPages > 1 && (
            <UnifiedPaginationContainer>
              <UnifiedPaginationButton 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                ← Précédent
              </UnifiedPaginationButton>
              
              <UnifiedPaginationInfo>
                Page {currentPage} sur {totalPages} • {filteredCases.length} cas
              </UnifiedPaginationInfo>
              
              <UnifiedPaginationButton 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                Suivant →
              </UnifiedPaginationButton>
            </UnifiedPaginationContainer>
          )}
        </>
      )}
    </UnifiedPageContainer>
  );
}

export default PublicCasesPage;