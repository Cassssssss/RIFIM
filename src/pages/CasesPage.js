// CasesPage.js - VERSION COMPLÈTE AVEC TOUTE LA GESTION DES CAS
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
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

// ==================== STYLES SPÉCIFIQUES POUR LA GESTION ====================

const CreationSection = styled(UnifiedSectionContainer)`
  margin-bottom: 2rem;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.inputBackground || props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary || props.theme.textLight};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.inputBackground || props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const PrimaryButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.primaryHover || props.theme.secondary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.primary}30;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    background: ${props => props.theme.disabled || '#9ca3af'};
    box-shadow: none;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const SecondaryButton = styled.button`
  background-color: ${props => props.theme.buttonSecondary || props.theme.background};
  color: ${props => props.theme.buttonSecondaryText || props.theme.text};
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.hover};
    border-color: ${props => props.theme.primary};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${props => props.theme.shadow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const UploadButton = styled.label`
  background: linear-gradient(135deg, ${props => props.theme.secondary}, ${props => props.theme.secondaryHover || props.theme.primary});
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.secondary}30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.secondary}40;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const MainImageButton = styled.label`
  background: linear-gradient(135deg, ${props => props.theme.accent || '#f59e0b'}, #d97706);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.accent || '#f59e0b'}30;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.accent || '#f59e0b'}40;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FolderContainer = styled.div`
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 2px 10px ${props => props.theme.shadow};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary}50;
  }
`;

const FolderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const FolderTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '📁';
    font-size: 1.5rem;
  }
`;

const FolderActions = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
    
    button, label {
      width: 100%;
    }
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ImagePreviewContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: cover;
  display: block;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(220, 38, 38, 1);
    transform: scale(1.1);
  }
`;

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

const ImagePreview2 = styled.img`
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

// Composants pour la galerie d'images
const GalleryContainer = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  overflow: hidden;
`;

const GalleryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  h3 {
    margin: 0;
    color: ${props => props.theme.text};
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const FolderMainImage = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid ${props => props.theme.border};
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.5rem;
  padding: 1rem;
  background-color: ${props => props.theme.card};
  min-height: 100px; /* Assure une hauteur minimum pour le drop */
  
  /* Style pour la zone de drop active */
  ${props => props.isDraggingOver && `
    background-color: rgba(59, 130, 246, 0.1);
    border: 2px dashed #3b82f6;
    border-radius: 8px;
  `}
`;

const ImageWrapper = styled.div`
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  transition: all 0.2s ease;
  cursor: grab;
  
  /* Style pour les éléments en cours de drag */
  ${props => props.isDragging && `
    opacity: 0.8;
    transform: scale(1.05);
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    cursor: grabbing;
  `}
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.2s ease;
  user-select: none;

  &:hover {
    transform: ${props => props.isDragging ? 'none' : 'scale(1.05)'};
  }
`;

const DeleteButton2 = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.7rem;
  z-index: 10;

  &:hover {
    background: rgba(220, 38, 38, 1);
  }
`;

// Composant étoile cliquable pour la notation
const ClickableStar = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const StarRatingContainer = styled.div`
  display: flex;
  gap: 2px;
  margin: 0.5rem 0;
  align-items: center;
`;

// Bouton action standard
const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ViewButton = styled(ActionButton)`
  background-color: ${props => props.theme.primary};
  color: white;

  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const CreateSheetButton = styled(ActionButton)`
  background-color: #2563eb;
  color: white;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const ManageButton = styled(ActionButton)`
  background-color: #6b7280;
  color: white;

  &:hover {
    background-color: #4b5563;
  }
`;

const ToggleButton = styled(ActionButton)`
  background-color: ${props => props.isPublic ? '#059669' : '#6b7280'};
  color: white;

  &:hover {
    background-color: ${props => props.isPublic ? '#047857' : '#4b5563'};
  }
`;

const DeleteButton = styled.button`
  background-color: #dc2626;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: #b91c1c;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(220, 38, 38, 0.3);
  }
`;

// ==================== COMPOSANT GALERIE D'IMAGES COLLAPSIBLE ====================

const CollapsibleImageGallery = React.memo(({ folder, images, onImageClick, onDeleteImage, caseId, fetchFolderMainImage, onReorderImages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState({});
  const [folderMainImage, setFolderMainImage] = useState(null);

  useEffect(() => {
    const loadFolderMainImage = async () => {
      const imageUrl = await fetchFolderMainImage(caseId, folder);
      setFolderMainImage(imageUrl);
    };
    loadFolderMainImage();
  }, [caseId, folder, fetchFolderMainImage]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    // Si l'élément est déposé au même endroit, ne rien faire
    if (sourceIndex === destinationIndex) return;
    
    console.log(`Déplacement de l'index ${sourceIndex} vers l'index ${destinationIndex}`);
    
    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(sourceIndex, 1);
    reorderedImages.splice(destinationIndex, 0, movedImage);
    
    onReorderImages(folder, reorderedImages);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <GalleryContainer>
        <GalleryHeader onClick={() => setIsOpen(!isOpen)}>
          <h3>{folder}</h3>
          {folderMainImage && (
            <FolderMainImage 
              src={folderMainImage} 
              alt={`Image principale de ${folder}`} 
              onError={() => setImageLoadError(prev => ({ ...prev, [folderMainImage]: true }))}
            />
          )}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </GalleryHeader>
        
        {isOpen && (
          <Droppable droppableId={`folder-${folder}`}>
            {(provided, snapshot) => (
              <ImagesGrid
                {...provided.droppableProps}
                ref={provided.innerRef}
                isDraggingOver={snapshot.isDraggingOver}
              >
                {images.map((image, index) => {
                  const draggableId = `${folder}-${index}-${image.split('/').pop()}`;
                  return (
                    <Draggable 
                      key={`${folder}-${index}`}
                      draggableId={draggableId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <ImageWrapper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                          style={{
                            ...provided.draggableProps.style,
                            zIndex: snapshot.isDragging ? 1000 : 'auto',
                          }}
                        >
                          <ThumbnailImage
                            src={imageLoadError[image] ? '/images/placeholder.jpg' : image}
                            alt={`${folder} image ${index + 1}`}
                            onClick={() => !snapshot.isDragging && onImageClick(folder, index)}
                            onError={() => setImageLoadError(prev => ({ ...prev, [image]: true }))}
                            isDragging={snapshot.isDragging}
                          />
                          <DeleteButton2 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!snapshot.isDragging) {
                                onDeleteImage(caseId, folder, image);
                              }
                            }}
                            style={{
                              opacity: snapshot.isDragging ? 0 : 1,
                              pointerEvents: snapshot.isDragging ? 'none' : 'auto'
                            }}
                          >
                            <X size={12} />
                          </DeleteButton2>
                        </ImageWrapper>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </ImagesGrid>
            )}
          </Droppable>
        )}
      </GalleryContainer>
    </DragDropContext>
  );
});

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
  const [answer, setAnswer] = useState(cas.answer || '');
  const [newTag, setNewTag] = useState('');

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
          
          {/* Étoiles cliquables pour la difficulté */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
              Difficulté:
            </span>
            <StarRatingContainer>
              {[1, 2, 3, 4, 5].map((star) => (
                <ClickableStar
                  key={star}
                  onClick={() => onUpdateDifficulty(cas._id, star)}
                  title={`Noter ${star} étoile${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={16}
                    fill={star <= (cas.difficulty || 0) ? "gold" : "transparent"}
                    stroke={star <= (cas.difficulty || 0) ? "gold" : "#d1d5db"}
                  />
                </ClickableStar>
              ))}
            </StarRatingContainer>
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
        <ViewButton as={Link} to={`/radiology-viewer/${cas._id}`}>
          <Eye size={14} />
          Voir
        </ViewButton>
        
        <CreateSheetButton as={Link} to={`/sheet-editor/${cas._id}`}>
          <File size={14} />
          Créer fiche
        </CreateSheetButton>
        
        <ManageButton onClick={() => onLoadCase(cas._id)}>
          <Folder size={14} />
          Gérer
        </ManageButton>

        <ToggleButton 
          onClick={() => onTogglePublic(cas._id)}
          isPublic={cas.public}
        >
          {cas.public ? 'Public' : 'Privé'}
        </ToggleButton>

        <DeleteButton 
          onClick={() => onDeleteCase(cas._id)}
          title="Supprimer ce cas"
        >
          <Trash2 size={16} />
        </DeleteButton>
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour la création de cas
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  // États pour la gestion des images
  const [newImages, setNewImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
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
      const response = await axios.get(`/cases?page=${page}&limit=12`);
      
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
      setCases(prevCases => prevCases.map(c => c._id === caseId ? response.data : c));
    } catch (error) {
      console.error('Erreur lors du chargement du cas:', error);
      alert('Erreur lors du chargement du cas');
    }
  };

  // ==================== GESTION DES CAS ====================

  const addNewCase = useCallback(async () => {
    let sanitizedTitle = newCaseTitle.trim();
    if (sanitizedTitle.toLowerCase().startsWith('rifim/')) {
      sanitizedTitle = sanitizedTitle.substring('rifim/'.length);
    }
    if (sanitizedTitle === '') return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/cases`, { 
        title: sanitizedTitle,
        folders: [],
        images: {},
        difficulty: 1,
        answer: ''
      });
      setCases(prevCases => [...prevCases, response.data]);
      setNewCaseTitle('');
      setSelectedCase(response.data);
    } catch (error) {
      setError('Erreur lors de l\'ajout d\'un nouveau cas');
      console.error('Erreur lors de l\'ajout d\'un nouveau cas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [newCaseTitle]);

  const addNewFolder = useCallback(async () => {
    if (!selectedCase || newFolderName.trim() === '') return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/cases/${selectedCase._id}/folders`, { folderName: newFolderName });
      setCases(prevCases => prevCases.map(c => c._id === selectedCase._id ? response.data : c));
      setSelectedCase(response.data);
      setNewFolderName('');
    } catch (error) {
      setError('Erreur lors de l\'ajout d\'un nouveau dossier');
      console.error('Erreur lors de l\'ajout d\'un nouveau dossier:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCase, newFolderName]);

  // ==================== GESTION DES IMAGES ====================

  const handleImageUpload = useCallback((event, folder) => {
    const files = Array.from(event.target.files);
    setNewImages(prev => ({
      ...prev,
      [folder]: [
        ...(prev[folder] || []),
        ...files.map(file => ({
          file,
          preview: URL.createObjectURL(file)
        }))
      ]
    }));
  }, []);

  const removeImage = useCallback((folder, index) => {
    setNewImages(prev => ({
      ...prev,
      [folder]: prev[folder].filter((_, i) => i !== index)
    }));
  }, []);

  const addImagesToCase = useCallback(async () => {
    if (!selectedCase) return;
    
    setIsLoading(true);
    setError(null);
    try {
      for (const [folder, images] of Object.entries(newImages)) {
        const formData = new FormData();
        images.forEach((image, index) => {
          formData.append('images', image.file);
        });
        formData.append('folder', folder);

        const response = await axios.post(`/cases/${selectedCase._id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      const updatedCase = await axios.get(`/cases/${selectedCase._id}`);
      setCases(prevCases => prevCases.map(c => c._id === selectedCase._id ? updatedCase.data : c));
      setSelectedCase(updatedCase.data);
      setNewImages({});
    } catch (error) {
      console.error('Erreur lors de l\'ajout des images:', error.response?.data || error.message);
      setError('Erreur lors de l\'ajout des images au cas');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCase, newImages]);

  const setMainImage = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file && selectedCase) {
      setIsLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('mainImage', file);
        const response = await axios.post(`/cases/${selectedCase._id}/main-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setCases(prevCases => prevCases.map(c => c._id === selectedCase._id ? response.data : c));
        setSelectedCase(response.data);
      } catch (error) {
        setError('Erreur lors de la définition de l\'image principale');
        console.error('Erreur lors de la définition de l\'image principale:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedCase]);

  const setFolderMainImage = useCallback(async (event, folder) => {
    const file = event.target.files[0];
    if (file && selectedCase) {
      setIsLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('folderMainImage', file);
        formData.append('folder', folder);
        const response = await axios.post(`/cases/${selectedCase._id}/folder-main-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setCases(prevCases => prevCases.map(c => 
          c._id === selectedCase._id 
            ? response.data
            : c
        ));

        setSelectedCase(response.data);

      } catch (error) {
        setError('Erreur lors de la définition de l\'image principale du dossier');
        console.error('Erreur lors de la définition de l\'image principale du dossier:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedCase]);

  const deleteFolder = useCallback(async (folder) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le dossier "${folder}" ?`)) {
      try {
        await axios.delete(`/cases/${selectedCase._id}/folders/${folder}`);
        const updatedCase = await axios.get(`/cases/${selectedCase._id}`);
        setCases(prevCases => prevCases.map(c => c._id === selectedCase._id ? updatedCase.data : c));
        setSelectedCase(updatedCase.data);
      } catch (error) {
        console.error('Erreur lors de la suppression du dossier:', error);
        setError('Erreur lors de la suppression du dossier');
      }
    }
  }, [selectedCase]);

  const fetchFolderMainImage = useCallback(async (caseId, folder) => {
    try {
      const response = await axios.get(`/cases/${caseId}`);
      if (response.data && response.data.folderMainImages && response.data.folderMainImages[folder]) {
        return response.data.folderMainImages[folder];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données du cas:', error);
    }
    return null;
  }, []);

  const deleteExistingImage = useCallback(async (caseId, folder, imagePath) => {
    try {
      const fileName = imagePath.split('/').pop();
      await axios.delete(`/cases/${caseId}/images`, {
        data: { folder, fileName }
      });
      const updatedCase = await axios.get(`/cases/${caseId}`);
      setCases(prevCases => prevCases.map(c => c._id === caseId ? updatedCase.data : c));
      setSelectedCase(updatedCase.data);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      setError('Erreur lors de la suppression de l\'image');
    }
  }, []);

  const handleReorderImages = useCallback(async (folder, reorderedImages) => {
    if (!selectedCase) return;
    
    try {
      console.log('Réorganisation des images pour le dossier:', folder);
      console.log('Nouvel ordre:', reorderedImages);
      
      // Mettre à jour l'état local immédiatement pour une meilleure UX
      setSelectedCase(prevCase => ({
        ...prevCase,
        images: {
          ...prevCase.images,
          [folder]: reorderedImages
        }
      }));

      // Mettre à jour les cas dans la liste
      setCases(prevCases => prevCases.map(c => 
        c._id === selectedCase._id 
          ? {
              ...c,
              images: {
                ...c.images,
                [folder]: reorderedImages
              }
            }
          : c
      ));

      // Appeler l'API avec la nouvelle route
      const response = await axios.patch(`/cases/${selectedCase._id}/reorder-images`, {
        folder,
        images: reorderedImages
      });

      if (!response.data) {
        throw new Error('Échec de la mise à jour');
      }

      console.log('Images réorganisées avec succès');

    } catch (error) {
      console.error('Erreur lors de la réorganisation des images:', error);
      // Recharger le cas en cas d'erreur pour restaurer l'état correct
      await loadCase(selectedCase._id);
      setError('Erreur lors de la réorganisation des images');
    }
  }, [selectedCase, loadCase]);

  // ==================== GESTION DES ÉVÉNEMENTS D'IMAGES ====================

  const handleImageClick = useCallback((folder, index) => {
    setSelectedImage(selectedCase.images[folder][index]);
    setSelectedImageIndex(index);
    setCurrentFolder(folder);
  }, [selectedCase]);

  const closeImage = useCallback(() => {
    setSelectedImage(null);
    setSelectedImageIndex(null);
    setCurrentFolder(null);
  }, []);

  const navigateImage = useCallback((direction) => {
    if (!currentFolder || selectedImageIndex === null || !selectedCase || !selectedCase.images) return;
    const images = selectedCase.images[currentFolder];
    let newIndex = selectedImageIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setSelectedImage(images[newIndex]);
    setSelectedImageIndex(newIndex);
  }, [currentFolder, selectedImageIndex, selectedCase]);

  // Navigation au clavier
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedImage) {
        if (event.key === 'ArrowLeft') {
          navigateImage(-1);
        } else if (event.key === 'ArrowRight') {
          navigateImage(1);
        } else if (event.key === 'Escape') {
          closeImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, navigateImage, closeImage]);

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
        <UnifiedPageTitle>🎯 Création de cas</UnifiedPageTitle>
        <PageSubtitle>
          Créez, modifiez et gérez vos cas cliniques personnels
        </PageSubtitle>
      </PageHeader>

      <SearchAndFiltersSection>
        <UnifiedSearchInput
          type="text"
          placeholder="🔍 Rechercher un cas..."
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

      {/* SECTION CRÉATION DE CAS */}
      <CreationSection>
        <UnifiedSectionTitle>
          ➕ Créer un nouveau cas
        </UnifiedSectionTitle>
        
        <InputGroup>
          <Input
            type="text"
            value={newCaseTitle}
            onChange={(e) => setNewCaseTitle(e.target.value)}
            placeholder="Titre du nouveau cas"
          />
          <PrimaryButton onClick={addNewCase}>
            <Plus size={18} />
            Créer un nouveau cas
          </PrimaryButton>
        </InputGroup>

        <Select
          value={selectedCase?._id || ''}
          onChange={(e) => loadCase(e.target.value)}
        >
          <option value="">Sélectionner un cas</option>
          {cases.map(cas => (
            <option key={cas._id} value={cas._id}>{cas.title}</option>
          ))}
        </Select>
      </CreationSection>

      {/* SECTION GESTION D'UN CAS SÉLECTIONNÉ */}
      {selectedCase && (
        <CreationSection>
          <UnifiedSectionTitle>
            🛠️ Gestion du cas: {selectedCase.title}
          </UnifiedSectionTitle>
          
          <InputGroup>
            <MainImageButton>
              <ImageIcon size={20} />
              Choisir l'image principale du cas
              <FileInput
                type="file"
                accept="image/*"
                onChange={setMainImage}
              />
            </MainImageButton>
          </InputGroup>

          <InputGroup>
            <Input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom du nouveau dossier"
            />
            <PrimaryButton onClick={addNewFolder}>
              <Folder size={20} />
              Ajouter un dossier
            </PrimaryButton>
          </InputGroup>

          {selectedCase.folders.map(folder => (
            <FolderContainer key={folder}>
              <FolderHeader>
                <FolderTitle>{folder}</FolderTitle>
                <FolderActions>
                  <UploadButton>
                    <Upload size={20} />
                    Ajouter des images
                    <FileInput 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={(e) => handleImageUpload(e, folder)} 
                    />
                  </UploadButton>
                  <MainImageButton as="label">
                    <ImageIcon size={20} />
                    Image principale
                    <FileInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFolderMainImage(e, folder)}
                    />
                  </MainImageButton>
                  <SecondaryButton onClick={() => deleteFolder(folder)}>
                    <Trash2 size={20} />
                    Supprimer
                  </SecondaryButton>
                </FolderActions>
              </FolderHeader>
              {newImages[folder] && newImages[folder].length > 0 && (
                <ImagePreviewContainer>
                  {newImages[folder].map((img, index) => (
                    <ImagePreview key={index}>
                      <PreviewImage src={img.preview} alt={`Preview ${index}`} />
                      <RemoveImageButton onClick={() => removeImage(folder, index)}>
                        <X size={12} />
                      </RemoveImageButton>
                    </ImagePreview>
                  ))}
                </ImagePreviewContainer>
              )}
            </FolderContainer>
          ))}

          <PrimaryButton 
            onClick={addImagesToCase} 
            disabled={Object.values(newImages).every(arr => !arr || arr.length === 0)}
          >
            <Upload size={18} />
            Ajouter les images au cas
          </PrimaryButton>
        </CreationSection>
      )}

      {/* SECTION LISTE DES CAS */}
      <PrivateManagementSection>
        <UnifiedSectionTitle>
          📋 Vos Cas Cliniques ({filteredCases.length})
        </UnifiedSectionTitle>
        
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

      {/* SECTION GESTION DES IMAGES DU CAS SÉLECTIONNÉ */}
      {selectedCase && selectedCase.images && (
        <FolderSection>
          <UnifiedSectionTitle>
            🗂️ Gestion des images - {selectedCase.title}
          </UnifiedSectionTitle>
          
          {selectedCase.folders.map(folder => (
            selectedCase.images[folder] && (
              <CollapsibleImageGallery
                key={folder}
                folder={folder}
                images={selectedCase.images[folder]}
                onImageClick={handleImageClick}
                onDeleteImage={deleteExistingImage}
                caseId={selectedCase._id}
                fetchFolderMainImage={fetchFolderMainImage}
                onReorderImages={handleReorderImages}
              />
            )
          ))}
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
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage(-1); }}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
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
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigateImage(1); }}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
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
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Spinner de chargement global */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <LoadingSpinner />
        </div>
      )}

      {/* Message d'erreur global */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000
        }}>
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}
    </UnifiedPageContainer>
  );
}

export default CasesPage;