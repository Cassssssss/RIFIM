import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Star, StarHalf, Edit, Save, Upload, X, Folder, Image as ImageIcon, File, ArrowUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react';
import ImageViewer from '../components/ImageViewer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import * as S from './CasesPage.styles';
import { CasesGrid, FoldersSection } from './CasesPage.styles';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import styled from 'styled-components';
import TutorialOverlay from './TutorialOverlay';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
console.log('API_BASE_URL:', API_BASE_URL);
const SPACES_URL = process.env.REACT_APP_SPACES_URL || 'https://rifim.lon1.digitaloceanspaces.com';
const UPLOAD_BASE_URL = process.env.REACT_APP_UPLOAD_URL || 'http://localhost:5002/uploads';

// ==================== STYLED COMPONENTS HARMONISÉS AVEC LE THÈME ====================

const ModernPageContainer = styled(S.PageContainer)`
  background: ${props => props.theme.background};  min-height: calc(100vh - 60px);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModernTitle = styled(S.Title)`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
  margin-bottom: 2rem;
  text-align: center;
`;

const ModernSectionContainer = styled(S.SectionContainer)`
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
  }
`;

const ModernInputGroup = styled(S.InputGroup)`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ModernInput = styled(S.Input)`
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

const ModernSelect = styled(S.Select)`
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

// Boutons harmonisés avec le thème
const PrimaryButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.primaryHover || props.theme.secondary});
  color: ${props => props.theme.buttonText || 'white'};
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

  &:active:not(:disabled) {
    transform: translateY(0);
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

const DangerButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.error || '#ef4444'}, ${props => props.theme.buttonDangerHover || '#dc2626'});
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
  box-shadow: 0 2px 8px ${props => props.theme.error || '#ef4444'}30;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.error || '#ef4444'}40;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const UploadButtonStyled = styled.label`
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

const MainImageButtonStyled = styled.label`
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

const ModernFolderContainer = styled(S.FolderContainer)`
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

const ModernFolderHeader = styled(S.FolderHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const ModernFolderTitle = styled(S.FolderTitle)`
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

const ModernFolderActions = styled(S.FolderActions)`
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

const ModernCaseCard = styled(S.CaseCard)`
  position: relative;
  overflow: hidden;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  
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
    transform: translateY(-4px);
    box-shadow: 0 8px 30px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary}50;
  }
`;

const ModernTagsContainer = styled(S.TagsContainer)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const ModernTag = styled(S.Tag)`
  background: linear-gradient(135deg, ${props => props.theme.tagBackground || props.theme.primary}, ${props => props.theme.primary});
  color: ${props => props.theme.tagText || 'white'};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  box-shadow: 0 1px 3px ${props => props.theme.shadow};
`;

const ModernAddTagButton = styled(S.AddTagButton)`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.25rem 0.75rem;
  font-weight: 500;
  font-size: 0.75rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px ${props => props.theme.shadow};

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px ${props => props.theme.shadow};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const TutorialButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }

  &::before {
    content: '🎓';
    font-size: 1.2rem;
  }
`;

const VideoContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};

  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 1.5rem;
    font-size: 1.2rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &::before {
      content: '🎬';
      font-size: 1.5rem;
    }
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 12px ${props => props.theme.shadow};

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
  }
`;

const ModernSearchInput = styled(S.SearchInput)`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 2rem;
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

// ==================== COMPOSANTS EXISTANTS AVEC STYLES HARMONISÉS ====================

const CollapsibleImageGallery = memo(({ folder, images, onImageClick, onDeleteImage, caseId, fetchFolderMainImage, onReorderImages }) => {
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
    
    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(sourceIndex, 1);
    reorderedImages.splice(destinationIndex, 0, movedImage);
    
    onReorderImages(folder, reorderedImages);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <S.GalleryContainer>
        <S.GalleryHeader onClick={() => setIsOpen(!isOpen)}>
          <h3>{folder}</h3>
          {folderMainImage && (
            <S.FolderMainImage 
              src={folderMainImage} 
              alt={`Image principale de ${folder}`} 
              onError={() => setImageLoadError(prev => ({ ...prev, [folderMainImage]: true }))}
            />
          )}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </S.GalleryHeader>
        
        {isOpen && (
          <Droppable droppableId={folder} direction="horizontal">
            {(provided) => (
              <S.ImagesGrid
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {images.map((image, index) => {
                  const draggableId = `draggable-${folder}-${index}`;
                  return (
                    <Draggable 
                      key={draggableId}
                      draggableId={draggableId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <S.ImageWrapper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.5 : 1,
                          }}
                        >
                          <S.ThumbnailImage
                            src={imageLoadError[image] ? '/images/placeholder.jpg' : image}
                            alt={`${folder} image ${index}`}
                            onClick={() => onImageClick(folder, index)}
                            onError={() => setImageLoadError(prev => ({ ...prev, [image]: true }))}
                          />
                          <S.DeleteButton onClick={() => onDeleteImage(caseId, folder, image)}>
                            <X size={12} />
                          </S.DeleteButton>
                        </S.ImageWrapper>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </S.ImagesGrid>
            )}
          </Droppable>
        )}
      </S.GalleryContainer>
    </DragDropContext>
  );
});

const CaseCard = memo(({ cas, onUpdateDifficulty, onUpdateAnswer, onAddTag, onRemoveTag, onDeleteCase, onLoadCase, onTogglePublic }) => {
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [newTag, setNewTag] = useState('');

  const handleAnswerEdit = useCallback(() => {
    setEditingAnswer({ id: cas._id, value: cas.answer || '' });
  }, [cas._id, cas.answer]);

  const handleAnswerSave = useCallback(() => {
    if (editingAnswer) {
      onUpdateAnswer(editingAnswer.id, editingAnswer.value);
      setEditingAnswer(null);
    }
  }, [editingAnswer, onUpdateAnswer]);

  const handleAddTag = useCallback((e) => {
    e.preventDefault();
    onAddTag(cas._id, newTag);
    setNewTag('');
  }, [cas._id, newTag, onAddTag]);

  const handleTogglePublic = async () => {
    try {
      await onTogglePublic(cas._id);
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du cas:', error);
    }
  };

  return (
    <ModernCaseCard>
      <Link to={`/radiology-viewer/${cas._id}`}>
        <S.CaseImage 
          src={cas.mainImage ? cas.mainImage : (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) || '/images/default.jpg'}
          alt={cas.title || 'Image sans titre'} 
        />
        <S.CaseTitle>{cas.title || 'Cas sans titre'}</S.CaseTitle>
      </Link>
      <StarRating
        rating={cas.difficulty || 1}
        onRatingChange={(newRating) => onUpdateDifficulty(cas._id, newRating)}
      />
      <S.AnswerSection>
        {editingAnswer && editingAnswer.id === cas._id ? (
          <>
            <S.AnswerInput
              value={editingAnswer.value}
              onChange={(e) => setEditingAnswer({ ...editingAnswer, value: e.target.value })}
              placeholder="Entrez la réponse..."
            />
            <PrimaryButton onClick={handleAnswerSave}>
              <Save size={16} />
              Sauvegarder
            </PrimaryButton>
          </>
        ) : (
          <>
            <S.AnswerText>{cas.answer || 'Pas de réponse'}</S.AnswerText>
            <SecondaryButton onClick={handleAnswerEdit}>
              <Edit size={16} />
              Modifier la réponse
            </SecondaryButton>
          </>
        )}
      </S.AnswerSection>
      <ModernTagsContainer>
        {cas.tags && cas.tags.map(tag => (
          <ModernTag key={tag}>
            {tag}
            <S.RemoveTagButton onClick={() => onRemoveTag(cas._id, tag)}>
              <X size={12} />
            </S.RemoveTagButton>
          </ModernTag>
        ))}
        <S.AddTagForm onSubmit={handleAddTag}>
          <S.TagInput
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nouveau tag"
          />
          <ModernAddTagButton type="submit">
            <Plus size={16} />
          </ModernAddTagButton>
        </S.AddTagForm>
      </ModernTagsContainer>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem', alignItems: 'center' }}>
        <SecondaryButton as={Link} to={`/create-sheet/${cas._id}`}>Créer fiche</SecondaryButton>
        <PrimaryButton onClick={() => onLoadCase(cas._id)}>Charger</PrimaryButton>
        <SecondaryButton onClick={handleTogglePublic}>
          {cas.public ? 'Rendre privé' : 'Rendre public'}
        </SecondaryButton>
        <button
          onClick={() => onDeleteCase(cas._id)}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.5rem',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            width: '40px',
            height: '40px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#dc2626';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ef4444';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
          title="Supprimer ce cas"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </ModernCaseCard>
  );
});

const StarRating = memo(({ rating, onRatingChange }) => {
  return (
    <S.StarRatingContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <S.Star
          key={star}
          onClick={() => onRatingChange(star)}
          filled={rating >= star}
        >
          {rating >= star ? (
            <Star fill="gold" color="gold" />
          ) : rating >= star - 0.5 ? (
            <StarHalf fill="gold" color="gold" />
          ) : (
            <Star color="gray" />
          )}
        </S.Star>
      ))}
    </S.StarRatingContainer>
  );
});

function CasesPage() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newImages, setNewImages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    console.log('Cases mises à jour:', cases);
  }, [cases]);

  useEffect(() => {
    const toggleScrollVisibility = () => {
      setIsScrollVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleScrollVisibility);
    return () => window.removeEventListener('scroll', toggleScrollVisibility);
  }, []);

  const fetchCases = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases?page=${page}&limit=10`);
      setCases(response.data.cases);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erreur détaillée lors de la récupération des cas:', error);
      setError('Erreur lors de la récupération des cas');
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const loadCase = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases/${id}`);
      setSelectedCase(response.data);
      setCases(prevCases => prevCases.map(c => c._id === id ? response.data : c));
    } catch (error) {
      setError('Erreur lors du chargement du cas');
      console.error('Erreur lors du chargement du cas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  const removeImage = useCallback((folder, index) => {
    setNewImages(prev => ({
      ...prev,
      [folder]: prev[folder].filter((_, i) => i !== index)
    }));
  }, []);

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
  
        console.log('Envoi de formData:', Object.fromEntries(formData));
  
        const response = await axios.post(`/cases/${selectedCase._id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Réponse du serveur:', response.data);
      }
      const updatedCase = await axios.get(`/cases/${selectedCase._id}`);
      setCases(prevCases => prevCases.map(c => c._id === selectedCase._id ? updatedCase.data : c));
      setSelectedCase(updatedCase.data);
      setNewImages({});
    } catch (error) {
      console.error('Erreur détaillée lors de l\'ajout des images:', error.response?.data || error.message);
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

  const deleteCase = useCallback(async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cas ?')) {
      setIsLoading(true);
      setError(null);
      try {
        await axios.delete(`/cases/${id}`);
        setCases(prevCases => prevCases.filter(c => c._id !== id));
        setSelectedCase(null);
      } catch (error) {
        console.error('Erreur lors de la suppression du cas:', error);
        setError('Erreur lors de la suppression du cas');
      } finally {
        setIsLoading(false);
      }
    }
  }, []);
  
  const verifyImages = useCallback(async () => {
    if (!selectedCase) {
      alert("Veuillez sélectionner un cas d'abord.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases/${selectedCase._id}/images`);
      setImageDetails(response.data);
      console.log('Détails des images:', response.data);
    } catch (error) {
      console.error('Erreur lors de la vérification des images:', error);
      setError('Erreur lors de la vérification des images. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCase]);
  
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
  
  const updateCaseDifficulty = useCallback(async (id, difficulty) => {
    try {
      await axios.patch(`/cases/${id}`, { difficulty });
      setCases(prevCases => prevCases.map(c => 
        c._id === id ? { ...c, difficulty } : c
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la difficulté:', error);
    }
  }, []);
  
  const updateCaseAnswer = useCallback(async (id, answer) => {
    try {
      await axios.patch(`/cases/${id}`, { answer });
      setCases(prevCases => prevCases.map(c => 
        c._id === id ? { ...c, answer } : c
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réponse:', error);
    }
  }, []);
  
  const handleAddTag = useCallback(async (caseId, tag) => {
    try {
      const response = await axios.patch(`/cases/${caseId}/tags`, { tagToAdd: tag });
      setCases(prevCases => prevCases.map(c => c._id === caseId ? response.data : c));
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tag:', error);
    }
  }, []);
  
  const handleRemoveTag = useCallback(async (caseId, tagToRemove) => {
    try {
      const response = await axios.patch(`/cases/${caseId}/tags`, { tagToRemove });
      setCases(prevCases => prevCases.map(c => c._id === caseId ? response.data : c));
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
    }
  }, []);

  const handleTogglePublic = useCallback(async (id) => {
    try {
      const response = await axios.patch(`/cases/${id}/togglePublic`);
      if (response.data) {
        setCases(prevCases => 
          prevCases.map(c => 
            c._id === id ? { ...c, public: !c.public } : c
          )
        );
        console.log('Visibilité du cas mise à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du cas:', error);
    }
  }, []);

  const tutorialSteps = [
    {
      image: "/tutorials/Screen_Cases1.png",
      description: <> Te voici dans la page d'importation de cas pédagogique, merci pour l'effort :).
      Pour commencer, rentre le titre de ton nouveau cas (par exemple "tuberculose") dans l'encadré de texte prévu à cet effet (flèche 1)
      puis appuie sur "Créer un nouveau cas", ici je l'ai nommé "Nouveau_Cas_1".
      Ajoute un "dossier" pour chaque séquence que tu voudras ajouter (T1, T2 etc, logique, mais en scanner une série en coupe coronal et une série en coupe sagittale sont considérées
      comme deux séquences différentes car il n'est pas possible de faire de reconstruction MPR sur ce site malheureusement), donc un dossier= une séquence, ici on a donc un dossier "T1" (flèche 2).  </>
    },

    {
      image: "/tutorials/Screen_Cases2.png",
      description: <>Ici on a donc créé 3 dossiers (donc 3 séquences) pour le cas "Exemple" (ça aurait pu être "tuberculose" ou "Neurocysticercose" ou que sais-je). Pour choisir l'image représentative du cas tu cliques sur "Choisir l'image principale du cas" (flèche 1) et tu choisis l'image que tu veux. 
      Tu ajoutes les images que tu possèdes sur ton ordinateur en cliquant sur le bouton "Ajouter des images" (flèche 2). L'image principale (Flèche 3) correspond à l'image principale du dossier qui sera celle qui représentera la séquence en question lorsque tu consulteras le cas.
      Tu peux supprimer une séquence avec le bouton "Supprimer le dossier" </>
    },
    {
      image: "/tutorials/Screen_Cases3.png",
      description: <> Quand tu auras sélectionné les images à importer pour ta séquence elles seront affichées de cette manière (flèche 1). Si tu veux en supprimer une libre à toi.
      Lorsque tu feras ajouter une image principale du cas (flèche 2) ou Image principale du dossier (flèche 3), elle ne seront pas affichées elles seront ajoutées automatiquement au cas ne t'en fais pas.
      Une fois que tu es satisfait de ta sélection d'images pour chaque séquence tu peux appuyer sur "Ajouter les images au cas" (flèche 4) et c'est nikel (yes).  </>
    },
    {
      image: "/tutorials/Screen_Cases4.png",
      description: <> En bas de la page, quand tu es sur ton cas (ou charge le si tu n'es plus dessus (flèche 1)), clique sur le menu dépliant de la séquence de ton choix (flèche 2) pour pouvoir voir les images correspondant à cette séquence.
      De nouveau si une ne te plais pas, supprime là si tu le souhaites.
      Juste en dessous tu peux vérifier l'image principale de dossier et voir si elle te correspond (flèches 3). Clique également sur le nombre d'étoile qui correspond à la difficulté selon toi (tkt c'est à la louche).
      Comme pour les questionnaires, si tu estimes que ton cas est sympa et intéressant, partage le sur l'espace public (do it) (flèche 5).
      Tu peux également ajouter des tags pour faciliter la recherche de ton cas (flèche 6).
      Modifie ensuite la réponse du cas (flèche 7) qui sera la réponse lorsque l'utilisateur cliquera sur "Voir la réponse" (ici tuberculose (souvent la même chose que le titre)) lors de la consultation du cas (il y a un mode pour ne pas se faire spoiler le titre du cas ne t'inquiète pas tu peux mettre le titre que tu veux ça ne gachera pas la surprise). 
      Et enfin, tu as la possibilité de faire une petite fiche récapitulative du cas que l'utilisateur qui s'entraîne sur ton cas pourra aller consulter après avoir affiché la réponse (c'est important pour la pédagogie fais pas un truc long mais 2/3 images clés avec de la légende et des explications sur la patho ce serait carré).</>
    }
  ];
  
  const filteredCases = cases.filter(cas => 
    cas.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
// Ajoutez cette fonction dans CasesPage.js, avant le return
const handleReorderImages = useCallback(async (folder, reorderedImages) => {
  if (!selectedCase) return;
  
  try {
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

  } catch (error) {
    console.error('Erreur lors de la réorganisation des images:', error);
    // Recharger le cas en cas d'erreur
    await loadCase(selectedCase._id);
  }
}, [selectedCase, loadCase]);

  return (
    <ModernPageContainer>
      <ModernTitle>🎯 Création de cas</ModernTitle>
  
      <ModernSearchInput
        type="text"
        placeholder="🔍 Rechercher un cas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
  
      <ModernSectionContainer>
        <ModernInputGroup>
          <ModernInput
            type="text"
            value={newCaseTitle}
            onChange={(e) => setNewCaseTitle(e.target.value)}
            placeholder="Titre du nouveau cas"
          />
          <PrimaryButton onClick={addNewCase}>
            <Plus size={18} />
            Créer un nouveau cas
          </PrimaryButton>
        </ModernInputGroup>
  
        <ModernSelect
          value={selectedCase?._id || ''}
          onChange={(e) => loadCase(e.target.value)}
        >
          <option value="">Sélectionner un cas</option>
          {cases.map(cas => (
            <option key={cas._id} value={cas._id}>{cas.title}</option>
          ))}
        </ModernSelect>
      </ModernSectionContainer>
  
      {selectedCase && (
        <ModernSectionContainer>
          <ModernInputGroup>
            <UploadButtonStyled>
              <ImageIcon size={20} />
              Choisir l'image principale du cas
              <S.FileInput
                type="file"
                accept="image/*"
                onChange={setMainImage}
              />
            </UploadButtonStyled>
          </ModernInputGroup>
  
          <ModernInputGroup>
            <ModernInput
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom du nouveau dossier"
            />
            <PrimaryButton onClick={addNewFolder}>
              <Folder size={20} />
              Ajouter un dossier
            </PrimaryButton>
          </ModernInputGroup>
  
          {selectedCase.folders.map(folder => (
            <ModernFolderContainer key={folder}>
              <ModernFolderHeader>
                <ModernFolderTitle>{folder}</ModernFolderTitle>
                <ModernFolderActions>
                  <UploadButtonStyled>
                    <Upload size={20} />
                    Ajouter des images
                    <S.FileInput 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={(e) => handleImageUpload(e, folder)} 
                    />
                  </UploadButtonStyled>
                  <MainImageButtonStyled as="label">
                    <ImageIcon size={20} />
                    Image principale
                    <S.FileInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFolderMainImage(e, folder)}
                    />
                  </MainImageButtonStyled>
                  <DangerButton onClick={() => deleteFolder(folder)}>
                    <Trash2 size={20} />
                    Supprimer
                  </DangerButton>
                </ModernFolderActions>
              </ModernFolderHeader>
              {newImages[folder] && newImages[folder].length > 0 && (
                <S.ImagePreviewContainer>
                  {newImages[folder].map((img, index) => (
                    <S.ImagePreview key={index}>
                      <S.PreviewImage src={img.preview} alt={`Preview ${index}`} />
                      <S.RemoveImageButton onClick={() => removeImage(folder, index)}>
                        <X size={12} />
                      </S.RemoveImageButton>
                    </S.ImagePreview>
                  ))}
                </S.ImagePreviewContainer>
              )}
            </ModernFolderContainer>
          ))}
  
          <PrimaryButton 
            onClick={addImagesToCase} 
            disabled={Object.values(newImages).every(arr => !arr || arr.length === 0)}
          >
            <Upload size={18} />
            Ajouter les images au cas
          </PrimaryButton>
        </ModernSectionContainer>
      )}
  
      <S.CasesGrid>
        {filteredCases && filteredCases.length > 0 ? (
          filteredCases.map((cas) => (
            <CaseCard
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
          ))
        ) : (
          <p>Aucun cas disponible</p>
        )}
      </S.CasesGrid>

      <S.FoldersSection>
      {selectedCase && selectedCase.images && (
  <ModernSectionContainer>
    <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
      🗂️ {selectedCase.title}
    </h2>
    {selectedCase.folders.map(folder => (
      selectedCase.images[folder] && (
        <CollapsibleImageGallery
          key={folder}
          folder={folder}
          images={selectedCase.images[folder]}
          onImageClick={(image, index) => handleImageClick(folder, index)}
          onDeleteImage={deleteExistingImage}
          caseId={selectedCase._id}
          fetchFolderMainImage={fetchFolderMainImage}
          onReorderImages={handleReorderImages}
        />
      )
    ))}
            {selectedImage && (
              <S.LargeImageContainer 
                onClick={closeImage}
                tabIndex={0}
                style={{ outline: 'none' }}
              >
                <S.LargeImage 
                  src={selectedImage} 
                  alt="Selected" 
                  onClick={(e) => e.stopPropagation()} 
                />
                <S.CloseButton onClick={(e) => { e.stopPropagation(); closeImage(); }}>
                  <X size={24} />
                </S.CloseButton>
                <S.NavigationButton onClick={(e) => { e.stopPropagation(); navigateImage(-1); }} style={{ left: '20px' }}>
                  <ChevronLeft size={24} />
                </S.NavigationButton>
                <S.NavigationButton onClick={(e) => { e.stopPropagation(); navigateImage(1); }} style={{ right: '20px' }}>
                  <ChevronRight size={24} />
                </S.NavigationButton>
              </S.LargeImageContainer>
            )}
          </ModernSectionContainer>
        )}
      </S.FoldersSection>

      {imageDetails && (
        <ModernSectionContainer>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📊 Détails des images
          </h3>
          {Object.entries(imageDetails).map(([folder, images]) => (
            <div key={folder}>
              <h4 style={{ color: 'var(--color-primary)' }}>{folder} :</h4>
              <ul>
                {images.map((image, index) => (
                  <li key={index}>{image}</li>
                ))}
              </ul>
            </div>
          ))}
        </ModernSectionContainer>
      )}

      {selectedCase && (
        <ModernSectionContainer>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🖼️ Images principales des dossiers
          </h3>
          {selectedCase.folders.map(folder => (
            <div key={folder} style={{ marginBottom: '1rem' }}>
              <h4 style={{ color: 'var(--color-primary)' }}>{folder}</h4>
              {selectedCase.folderMainImages && selectedCase.folderMainImages[folder] ? (
                <img 
                  src={selectedCase.folderMainImages[folder]} 
                  alt={`Image principale de ${folder}`} 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }} 
                />
              ) : (
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Pas d'image principale définie pour ce dossier
                </p>
              )}
            </div>
          ))}
        </ModernSectionContainer>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      <PaginationContainer>
        <PaginationButton 
          onClick={() => fetchCases(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Précédent
        </PaginationButton>
        <PaginationInfo>Page {currentPage} sur {totalPages}</PaginationInfo>
        <PaginationButton 
          onClick={() => fetchCases(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Suivant
        </PaginationButton>
      </PaginationContainer>

      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <TutorialOverlay 
              steps={tutorialSteps} 
              onClose={() => setShowTutorial(false)} 
            />
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        <TutorialButton onClick={() => setShowTutorial(true)}>
          Voir le tutoriel
        </TutorialButton>
      </div>

      {isScrollVisible && (
        <button
          className="fixed bottom-20 right-4 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-secondary transition-colors duration-200"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={24} />
        </button>
      )}

        {selectedCase && (
        <ModernSectionContainer>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📈 Statistiques du cas
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Nombre total d'images :</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{Object.values(selectedCase.images || {}).reduce((acc, curr) => acc + curr.length, 0)}</p>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Nombre de dossiers :</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{selectedCase.folders?.length || 0}</p>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Status :</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{selectedCase.public ? 'Public' : 'Privé'}</p>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: 'var(--color-primary)' }}>Difficulté :</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>{selectedCase.difficulty} / 5</p>
            </div>
          </div>
        </ModernSectionContainer>
      )}

      {selectedCase && (
        <ModernSectionContainer>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🏷️ Métadonnées
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}>
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Identifiant :</h4>
              <p style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>{selectedCase._id}</p>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)'
            }}>
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Titre :</h4>
              <p>{selectedCase.title}</p>
            </div>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'var(--color-background)', 
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              gridColumn: 'span 2'
            }}>
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Tags :</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {selectedCase.tags?.map(tag => (
                  <ModernTag key={tag}>{tag}</ModernTag>
                )) || <span style={{ color: 'var(--color-text-secondary)' }}>Aucun tag</span>}
              </div>
            </div>
          </div>
        </ModernSectionContainer>
      )}

      {process.env.NODE_ENV === 'development' && selectedCase && (
        <ModernSectionContainer>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            🐛 Debug Info
          </h3>
          <pre style={{ 
            backgroundColor: 'var(--color-background)', 
            padding: '1rem', 
            borderRadius: '8px', 
            overflowX: 'auto',
            fontSize: '0.8rem',
            border: '1px solid var(--color-border)'
          }}>
            {JSON.stringify(selectedCase, null, 2)}
          </pre>
        </ModernSectionContainer>
      )}
      
      <VideoContainer>
        <h3>Tutoriel vidéo</h3>
        <div className="video-wrapper">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/NerjVRmP7TA"
            title="Tutoriel vidéo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </VideoContainer>
    </ModernPageContainer>
  );
}

export default CasesPage;