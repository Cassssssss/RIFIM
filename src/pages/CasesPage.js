// CasesPage.js - VERSION AVEC SHARED COMPONENTS UNIFIÉS
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../utils/axiosConfig';
import { 
  Star, Edit, Save, Upload, X, Folder, Image as ImageIcon, 
  File, ArrowUp, ChevronDown, ChevronUp, ChevronLeft, 
  ChevronRight, Trash2, Plus, Eye, EyeOff 
} from 'lucide-react';
import ImageViewer from '../components/ImageViewer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  UnifiedErrorMessage,
  UnifiedSectionContainer,
  UnifiedSectionTitle,
  UnifiedCreateButton,
  UnifiedEditButton,
  UnifiedDeleteButton
} from '../components/shared/SharedCasesComponents';

// Import des styles spécifiques à cette page
import * as S from './CasesPage.styles';
import { CasesGrid, FoldersSection } from './CasesPage.styles';
import styled from 'styled-components';

// ==================== STYLES SPÉCIFIQUES POUR LA GESTION PRIVÉE ====================

const PrivateManagementSection = styled(UnifiedSectionContainer)`
  margin-bottom: 2rem;
`;

const CaseManagementGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const CaseManagementCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const CaseActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const TagInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.85rem;
  width: 120px;
`;

const FolderSection = styled(UnifiedSectionContainer)`
  margin-top: 2rem;
`;

const FolderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const FolderCard = styled.div`
  background-color: ${props => props.theme.backgroundSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1rem;
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ImagePreview = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid ${props => props.theme.border};

  &:hover {
    border-color: ${props => props.theme.primary};
  }
`;

// ==================== COMPOSANT CARTE CAS PRIVÉ ====================

function PrivateCaseCard({ 
  cas, 
  onUpdateDifficulty, 
  onUpdateAnswer, 
  onAddTag, 
  onRemoveTag, 
  onDeleteCase, 
  onLoadCase, 
  onTogglePublic 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [difficulty, setDifficulty] = useState(cas.difficulty || 1);
  const [answer, setAnswer] = useState(cas.answer || '');
  const [newTag, setNewTag] = useState('');

  const handleDifficultySubmit = () => {
    onUpdateDifficulty(cas._id, difficulty);
    setIsEditing(false);
  };

  const handleAnswerSubmit = () => {
    onUpdateAnswer(cas._id, answer);
  };

  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      onAddTag(cas._id, newTag.trim());
      setNewTag('');
    }
  };

  const getImageSrc = (cas) => {
    if (cas.mainImage) return cas.mainImage;
    if (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) {
      return cas.folderMainImages[cas.folders[0]];
    }
    return '/images/default.jpg';
  };

  return (
    <CaseManagementCard>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <img 
          src={getImageSrc(cas)}
          alt={cas.title}
          style={{ 
            width: '80px', 
            height: '80px', 
            objectFit: 'cover', 
            borderRadius: '8px',
            border: `1px solid var(--color-border)`
          }}
          onError={(e) => {
            e.target.src = '/images/default.jpg';
          }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            color: 'var(--color-text)', 
            fontSize: '1.1rem', 
            marginBottom: '0.5rem',
            fontWeight: '600'
          }}>
            {cas.title || 'Cas sans titre'}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Difficulté:
            </span>
            {isEditing ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select 
                  value={difficulty} 
                  onChange={(e) => setDifficulty(Number(e.target.value))}
                  style={{ 
                    padding: '0.25rem',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)'
                  }}
                >
                  {[1,2,3,4,5].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <button onClick={handleDifficultySubmit} style={{ 
                  padding: '0.25rem 0.5rem',
                  backgroundColor: 'var(--color-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}>
                  <Save size={12} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    size={16}
                    fill={index < (cas.difficulty || 0) ? "gold" : "transparent"}
                    stroke={index < (cas.difficulty || 0) ? "gold" : "#d1d5db"}
                  />
                ))}
                <button onClick={() => setIsEditing(true)} style={{ 
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  marginLeft: '0.5rem'
                }}>
                  <Edit size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tags */}
      {cas.tags && cas.tags.length > 0 && (
        <UnifiedTagsContainer style={{ marginBottom: '1rem' }}>
          {cas.tags.map((tag, index) => (
            <UnifiedTag key={index}>
              {tag}
              <button
                onClick={() => onRemoveTag(cas._id, tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  marginLeft: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                <X size={12} />
              </button>
            </UnifiedTag>
          ))}
        </UnifiedTagsContainer>
      )}

      {/* Ajout de tag */}
      <form onSubmit={handleTagSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <TagInput
          type="text"
          placeholder="Nouveau tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button type="submit" style={{
          padding: '0.5rem',
          backgroundColor: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          <Plus size={14} />
        </button>
      </form>

      {/* Réponse */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ 
          display: 'block', 
          fontSize: '0.85rem', 
          color: 'var(--color-text-secondary)',
          marginBottom: '0.5rem'
        }}>
          Réponse:
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onBlur={handleAnswerSubmit}
          placeholder="Entrez la réponse du cas..."
          style={{
            width: '100%',
            minHeight: '60px',
            padding: '0.5rem',
            border: '1px solid var(--color-border)',
            borderRadius: '6px',
            resize: 'vertical',
            fontSize: '0.85rem'
          }}
        />
      </div>

      {/* Actions */}
      <CaseActions>
        <UnifiedEditButton to={`/radiology-viewer/${cas._id}`}>
          <Eye size={14} />
          Voir
        </UnifiedEditButton>
        
        <button
          onClick={() => onLoadCase(cas._id)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem'
          }}
        >
          <Folder size={14} />
          Gérer
        </button>

        <button
          onClick={() => onTogglePublic(cas._id)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: cas.public ? '#10B981' : '#6B7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem'
          }}
        >
          {cas.public ? 'Public' : 'Privé'}
        </button>

        <UnifiedDeleteButton onClick={() => onDeleteCase(cas._id)}>
          <Trash2 size={12} />
          Supprimer
        </UnifiedDeleteButton>
      </CaseActions>
    </CaseManagementCard>
  );
}

// ==================== COMPOSANT PRINCIPAL ====================

function CasesPage() {
  // États principaux
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState([1, 2, 3, 4, 5]);
  const [tagFilter, setTagFilter] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [showSpoilers, setShowSpoilers] = useState(true); // Toujours visible pour les cas privés
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour la gestion des images
  const [newImages, setNewImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);

  // États des dropdowns
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // Références
  const fileInputRefs = useRef({});

  // ==================== RÉCUPÉRATION DES DONNÉES ====================

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

  const loadCase = async (caseId) => {
    try {
      const response = await axios.get(`/cases/${caseId}`);
      setSelectedCase(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du cas:', error);
      alert('Erreur lors du chargement du cas');
    }
  };

  // ==================== EFFETS ====================

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
        (cas.answer && cas.answer.toLowerCase().includes(term))
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

  // ==================== GESTIONNAIRES D'ÉVÉNEMENTS ====================

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

  const updateCaseDifficulty = async (caseId, difficulty) => {
    try {
      await axios.patch(`/cases/${caseId}`, { difficulty });
      setCases(prev => prev.map(cas => 
        cas._id === caseId ? { ...cas, difficulty } : cas
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la difficulté:', error);
      alert('Erreur lors de la mise à jour de la difficulté');
    }
  };

  const updateCaseAnswer = async (caseId, answer) => {
    try {
      await axios.patch(`/cases/${caseId}`, { answer });
      setCases(prev => prev.map(cas => 
        cas._id === caseId ? { ...cas, answer } : cas
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réponse:', error);
    }
  };

  const handleAddTag = async (caseId, tag) => {
    try {
      const response = await axios.post(`/cases/${caseId}/tags`, { tag });
      setCases(prev => prev.map(cas => 
        cas._id === caseId ? response.data : cas
      ));
      
      // Mise à jour des tags globaux
      if (!allTags.includes(tag)) {
        setAllTags(prev => [...prev, tag]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tag:', error);
      alert('Erreur lors de l\'ajout du tag');
    }
  };

  const handleRemoveTag = async (caseId, tag) => {
    try {
      const response = await axios.delete(`/cases/${caseId}/tags/${encodeURIComponent(tag)}`);
      setCases(prev => prev.map(cas => 
        cas._id === caseId ? response.data : cas
      ));
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
      alert('Erreur lors de la suppression du tag');
    }
  };

  const deleteCase = async (caseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cas ?')) {
      try {
        await axios.delete(`/cases/${caseId}`);
        setCases(prev => prev.filter(cas => cas._id !== caseId));
        if (selectedCase && selectedCase._id === caseId) {
          setSelectedCase(null);
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du cas:', error);
        alert('Erreur lors de la suppression du cas');
      }
    }
  };

  const handleTogglePublic = async (caseId) => {
    try {
      const response = await axios.patch(`/cases/${caseId}/togglePublic`);
      setCases(prev => prev.map(cas => 
        cas._id === caseId ? response.data : cas
      ));
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
      alert('Erreur lors du changement de visibilité');
    }
  };

  // Gestion des images
  const handleImageClick = (folder, imageIndex) => {
    if (selectedCase && selectedCase.images && selectedCase.images[folder]) {
      setSelectedImage(selectedCase.images[folder][imageIndex]);
    }
  };

  const closeImage = () => {
    setSelectedImage(null);
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

  // ==================== RENDU ====================

  return (
    <UnifiedPageContainer>
      <PageHeader>
        <UnifiedPageTitle>Gestion des Cas Cliniques</UnifiedPageTitle>
        <PageSubtitle>
          Créez, modifiez et gérez vos cas cliniques personnels
        </PageSubtitle>
        <div style={{ marginTop: '1rem' }}>
          <UnifiedCreateButton to="/cases/create">
            <Plus size={20} />
            Créer un nouveau cas
          </UnifiedCreateButton>
        </div>
      </PageHeader>

      <SearchAndFiltersSection>
        <UnifiedSearchInput
          type="text"
          placeholder="Rechercher dans vos cas (titre, tags, réponse...)"
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
      ) : (
        <>
          {/* Section de gestion des cas */}
          <PrivateManagementSection>
            <UnifiedSectionTitle>
              📋 Vos Cas Cliniques ({filteredCases.length})
            </UnifiedSectionTitle>
            
            {filteredCases.length === 0 ? (
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
              <CaseManagementGrid>
                {filteredCases.map((cas) => (
                  <PrivateCaseCard
                    key={cas._id}
                    cas={cas}
                    onUpdateDifficulty={updateCaseDifficulty}
                    onUpdateAnswer={updateCaseAnswer}
                    onAddTag={handleAddTag}
                    onRemoveTag={handleRemoveTag}
                    onDeleteCase={deleteCase}
                    onLoadCase={loadCase}
                    onTogglePublic={handleTogglePublic}
                  />
                ))}
              </CaseManagementGrid>
            )}
          </PrivateManagementSection>

          {/* Section de gestion des dossiers et images */}
          {selectedCase && (
            <FolderSection>
              <UnifiedSectionTitle>
                🗂️ Gestion des images - {selectedCase.title}
              </UnifiedSectionTitle>
              
              {selectedCase.folders && selectedCase.folders.length > 0 ? (
                <FolderGrid>
                  {selectedCase.folders.map(folder => (
                    <FolderCard key={folder}>
                      <h4 style={{ 
                        color: 'var(--color-primary)', 
                        marginBottom: '0.5rem',
                        fontSize: '1rem'
                      }}>
                        📁 {folder}
                      </h4>
                      
                      {selectedCase.images && selectedCase.images[folder] && (
                        <div>
                          <p style={{ 
                            fontSize: '0.85rem', 
                            color: 'var(--color-text-secondary)',
                            marginBottom: '0.5rem'
                          }}>
                            {selectedCase.images[folder].length} image(s)
                          </p>
                          
                          <ImagePreviewGrid>
                            {selectedCase.images[folder].slice(0, 6).map((image, index) => (
                              <ImagePreview
                                key={index}
                                src={image}
                                alt={`${folder} ${index + 1}`}
                                onClick={() => handleImageClick(folder, index)}
                                onError={(e) => {
                                  e.target.src = '/images/default.jpg';
                                }}
                              />
                            ))}
                          </ImagePreviewGrid>
                          
                          {selectedCase.images[folder].length > 6 && (
                            <p style={{ 
                              fontSize: '0.75rem', 
                              color: 'var(--color-text-secondary)',
                              marginTop: '0.25rem'
                            }}>
                              +{selectedCase.images[folder].length - 6} autres images
                            </p>
                          )}
                        </div>
                      )}
                    </FolderCard>
                  ))}
                </FolderGrid>
              ) : (
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Aucun dossier d'images pour ce cas.
                </p>
              )}
            </FolderSection>
          )}

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

      {/* Modal d'image agrandie */}
      {selectedImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            cursor: 'pointer'
          }}
          onClick={closeImage}
        >
          <img
            src={selectedImage}
            alt="Image agrandie"
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              objectFit: 'contain',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={closeImage}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>
        </div>
      )}
    </UnifiedPageContainer>
  );
}

export default CasesPage;