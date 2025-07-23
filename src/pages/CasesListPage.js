// CasesListPage.js - VERSION AVEC SHARED COMPONENTS UNIFIÉS ET CORRECTIONS
import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axiosConfig';
import { Star, ChevronDown, Eye, EyeOff } from 'lucide-react';

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
  UnifiedCaseTitle,
  UnifiedStarRating,
  UnifiedTagsContainer,
  UnifiedTag,
  UnifiedPaginationContainer,
  UnifiedPaginationButton,
  UnifiedPaginationInfo,
  UnifiedEmptyState,
  UnifiedLoadingMessage,
  UnifiedErrorMessage
} from '../components/shared/SharedCasesComponents';

// ==================== COMPOSANT CARTE CAS ====================

function CaseCardComponent({ cas, showSpoilers }) {
  const getImageSrc = (cas) => {
    if (cas.mainImage) return cas.mainImage;
    if (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) {
      return cas.folderMainImages[cas.folders[0]];
    }
    return '/images/default.jpg';
  };

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
        <UnifiedCaseTitle>
          {showSpoilers ? (cas.title || 'Cas sans titre') : '?'}
        </UnifiedCaseTitle>
        
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

function CasesListPage() {
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

  // États des dropdowns
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // Récupération des cas
  const fetchCases = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases/my?page=${page}&limit=12`);
      
      if (response.data && Array.isArray(response.data.cases)) {
        setCases(response.data.cases);
        setCurrentPage(response.data.currentPage || page);
        setTotalPages(response.data.totalPages || 1);
        
        // Extraction des tags uniques
        const uniqueTags = [...new Set(
          response.data.cases
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
      console.error('Erreur lors du chargement des cas:', error);
      setError('Erreur lors du chargement des cas. Veuillez réessayer.');
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
        (cas.tags && cas.tags.some(tag => tag.toLowerCase().includes(term)))
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

  // CORRECTION MAJEURE : Gestionnaires d'événements améliorés
  const handleDifficultyChange = (difficulty, event) => {
    // Empêcher la propagation pour éviter la fermeture du dropdown
    event.stopPropagation();
    
    setDifficultyFilter(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const handleTagChange = (tag, event) => {
    // Empêcher la propagation pour éviter la fermeture du dropdown
    event.stopPropagation();
    
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

  // CORRECTION MAJEURE : Gestion améliorée des clics extérieurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Vérifier si le clic est à l'extérieur des dropdowns
      const isClickInsideDropdown = event.target.closest('[data-dropdown]');
      if (!isClickInsideDropdown) {
        setShowDifficultyDropdown(false);
        setShowTagDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Rendu du composant
  return (
    <UnifiedPageContainer>
      <PageHeader>
        <UnifiedPageTitle>Mes Cas Cliniques</UnifiedPageTitle>
        <PageSubtitle>
          Gérez et consultez vos cas cliniques personnels
        </PageSubtitle>
      </PageHeader>

      <SearchAndFiltersSection>
        <UnifiedSearchInput
          type="text"
          placeholder="Rechercher dans vos cas (titre, tags...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <UnifiedFilterContainer>
          {/* Filtre par difficulté */}
          <UnifiedFilterSection data-dropdown>
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
                  <UnifiedDropdownItem 
                    key={difficulty}
                    onClick={(e) => handleDifficultyChange(difficulty, e)}
                  >
                    <UnifiedDropdownCheckbox
                      type="checkbox"
                      checked={difficultyFilter.includes(difficulty)}
                      onChange={(e) => handleDifficultyChange(difficulty, e)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    {difficulty} étoile{difficulty > 1 ? 's' : ''}
                  </UnifiedDropdownItem>
                ))}
              </UnifiedDropdownContent>
            )}
          </UnifiedFilterSection>

          {/* Filtre par tags */}
          {allTags.length > 0 && (
            <UnifiedFilterSection data-dropdown>
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
                    <UnifiedDropdownItem 
                      key={tag}
                      onClick={(e) => handleTagChange(tag, e)}
                    >
                      <UnifiedDropdownCheckbox
                        type="checkbox"
                        checked={tagFilter.includes(tag)}
                        onChange={(e) => handleTagChange(tag, e)}
                        onClick={(e) => e.stopPropagation()}
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
          Chargement de vos cas...
        </UnifiedLoadingMessage>
      ) : error ? (
        <UnifiedErrorMessage>
          {error}
        </UnifiedErrorMessage>
      ) : filteredCases.length === 0 ? (
        <UnifiedEmptyState>
          <h3>Aucun cas trouvé</h3>
          <p>
            {cases.length === 0 
              ? "Vous n'avez pas encore créé de cas. Commencez par créer votre premier cas !" 
              : "Aucun cas ne correspond à vos critères de recherche. Essayez de modifier vos filtres."
            }
          </p>
        </UnifiedEmptyState>
      ) : (
        <>
          <UnifiedCasesList>
            {filteredCases.map((cas) => (
              <CaseCardComponent 
                key={cas._id} 
                cas={cas} 
                showSpoilers={showSpoilers}
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

export default CasesListPage;