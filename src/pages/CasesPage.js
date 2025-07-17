// pages/CasesPage.js - VERSION STYLISÉE AVEC FONCTIONNALITÉS RESTAURÉES
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { 
  Upload, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Star, 
  StarHalf,
  Plus, 
  X, 
  Image as ImageIcon,
  FileText,
  Settings,
  Download,
  Folder,
  File,
  Save,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Imports conditionnels pour éviter les erreurs d'initialisation
let ImageViewer, LoadingSpinner, ErrorMessage, TutorialOverlay;
try {
  ImageViewer = require('../components/ImageViewer').default;
} catch (e) {
  ImageViewer = () => <div>ImageViewer non disponible</div>;
}

try {
  LoadingSpinner = require('../components/LoadingSpinner').default;
} catch (e) {
  LoadingSpinner = () => <div>Chargement...</div>;
}

try {
  ErrorMessage = require('../components/ErrorMessage').default;
} catch (e) {
  ErrorMessage = ({ children }) => <div style={{color: 'red'}}>{children}</div>;
}

try {
  TutorialOverlay = require('./TutorialOverlay').default;
} catch (e) {
  TutorialOverlay = () => <div>Tutoriel non disponible</div>;
}

try {
  const { PaginationContainer, PaginationButton, PaginationInfo } = require('./CasesPage.styles');
} catch (e) {
  // Fallback en cas d'erreur d'import
}

// Composants de pagination en fallback
const FallbackPaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${props => props.theme.surface || '#fff'};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FallbackPaginationButton = styled.button`
  background-color: ${props => props.theme.primary || '#3b82f6'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary || '#2563eb'};
  }

  &:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
  }
`;

const FallbackPaginationInfo = styled.span`
  margin: 0 1rem;
  font-weight: bold;
`;

// ==================== STYLED COMPONENTS HARMONISÉS ====================

const PageContainer = styled.div`
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SectionContainer = styled.div`
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 8px 32px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  position: relative;
  overflow: hidden;

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

const SectionTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;

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
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.backgroundSecondary || props.theme.card;
      case 'danger': return '#ef4444';
      case 'success': return '#10b981';
      default: return props.theme.primary;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.text;
      default: return 'white';
    }
  }};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.border;
      default: return 'transparent';
    }
  }};
  border-radius: 8px;
  padding: ${props => props.size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  font-size: ${props => props.size === 'large' ? '0.95rem' : '0.85rem'};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  option {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }
`;

const FolderContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.background};
  border-radius: 12px;
  border: 2px solid ${props => props.theme.border};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }
`;

const FolderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const FolderTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: ${props => props.theme.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FolderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    
    button, label {
      flex: 1;
      min-width: 120px;
    }
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  gap: 0.5rem;
  border: none;

  &:hover {
    background-color: ${props => props.theme.secondary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const CasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CaseCard = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  position: relative;

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
    box-shadow: 0 12px 40px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const CaseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CaseContent = styled.div`
  padding: 1.5rem;
`;

const CaseTitle = styled.h2`
  color: ${props => props.theme.text};
  text-align: center;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const StarRatingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 0.25rem;
`;

const StarButton = styled.span`
  cursor: pointer;
  margin: 0 2px;
  svg {
    width: 24px;
    height: 24px;
    transition: fill 0.2s ease;
    fill: ${props => (props.filled ? 'gold' : 'gray')};
  }
`;

const CaseActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const CaseButton = styled.button`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.backgroundSecondary || props.theme.card;
      case 'danger': return '#ef4444';
      default: return props.theme.primary;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.text;
      default: return 'white';
    }
  }};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.border;
      default: return 'transparent';
    }
  }};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const AddTagForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagInput = styled.input`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 0.75rem;
  width: 120px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const AddTagButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const AnswerSection = styled.div`
  margin-top: 1rem;
`;

const AnswerText = styled.p`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  font-style: italic;
`;

const AnswerInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const TutorialButton = styled.button`
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.primary};
  }
`;

const VideoContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${props => props.theme.card};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* Ratio 16:9 */
    height: 0;
    overflow: hidden;
    max-width: 100%;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

// ==================== COMPOSANTS ====================

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
      <div style={{
        marginBottom: '1.5rem',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          <h3>{folder}</h3>
          {folderMainImage && (
            <img 
              src={folderMainImage} 
              alt={`Image principale de ${folder}`}
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginRight: '10px'
              }}
              onError={() => setImageLoadError(prev => ({ ...prev, [folderMainImage]: true }))}
            />
          )}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
        
        {isOpen && (
          <Droppable droppableId={folder} direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  display: 'flex',
                  gap: '10px',
                  padding: '1rem',
                  minHeight: '120px',
                  backgroundColor: '#f3f4f6',
                  overflowX: 'auto',
                  flexWrap: 'nowrap',
                  alignItems: 'flex-start'
                }}
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
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.5 : 1,
                            position: 'relative',
                            borderRadius: '4px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            cursor: 'move',
                            flex: '0 0 auto',
                            width: '100px',
                            height: '100px'
                          }}
                        >
                          <img
                            src={imageLoadError[image] ? '/images/placeholder.jpg' : image}
                            alt={`${folder} image ${index}`}
                            onClick={() => onImageClick(folder, index)}
                            onError={() => setImageLoadError(prev => ({ ...prev, [image]: true }))}
                            style={{
                              width: '100%',
                              height: '100px',
                              objectFit: 'cover',
                              cursor: 'pointer',
                              transition: 'transform 0.3s ease'
                            }}
                          />
                          <button 
                            onClick={() => onDeleteImage(caseId, folder, image)}
                            style={{
                              position: 'absolute',
                              top: '5px',
                              right: '5px',
                              backgroundColor: 'rgba(255, 0, 0, 0.7)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '50%',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '12px',
                              transition: 'background-color 0.3s ease'
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
      </div>
    </DragDropContext>
  );
});

const StarRating = memo(({ rating, onRatingChange }) => {
  return (
    <StarRatingContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarButton
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
        </StarButton>
      ))}
    </StarRatingContainer>
  );
});

const CaseCardComponent = memo(({ cas, onUpdateDifficulty, onUpdateAnswer, onAddTag, onRemoveTag, onDeleteCase, onLoadCase, onTogglePublic }) => {
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
    if (newTag.trim()) {
      onAddTag(cas._id, newTag.trim());
      setNewTag('');
    }
  }, [cas._id, newTag, onAddTag]);

  const handleTogglePublic = async () => {
    try {
      await onTogglePublic(cas._id);
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du cas:', error);
    }
  };

  return (
    <CaseCard>
      <Link to={`/radiology-viewer/${cas._id}`}>
        <CaseImage 
          src={cas.mainImage ? cas.mainImage : (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) || '/images/default.jpg'}
          alt={cas.title || 'Image sans titre'} 
        />
      </Link>
      
      <CaseContent>
        <Link to={`/radiology-viewer/${cas._id}`} style={{ textDecoration: 'none' }}>
          <CaseTitle>{cas.title || 'Cas sans titre'}</CaseTitle>
        </Link>
        
        <StarRating
          rating={cas.difficulty || 1}
          onRatingChange={(newRating) => onUpdateDifficulty(cas._id, newRating)}
        />
        
        <AnswerSection>
          {editingAnswer && editingAnswer.id === cas._id ? (
            <>
              <AnswerInput
                value={editingAnswer.value}
                onChange={(e) => setEditingAnswer({ ...editingAnswer, value: e.target.value })}
                placeholder="Entrez la réponse..."
              />
              <Button variant="success" onClick={handleAnswerSave}>
                <Save size={16} />
                Sauvegarder
              </Button>
            </>
          ) : (
            <>
              <AnswerText>{cas.answer || 'Pas de réponse'}</AnswerText>
              <Button variant="secondary" onClick={handleAnswerEdit}>
                <Edit size={16} />
                Modifier la réponse
              </Button>
            </>
          )}
        </AnswerSection>
        
        <TagsContainer>
          {cas.tags && cas.tags.map(tag => (
            <Tag key={tag}>
              {tag}
              <RemoveTagButton onClick={() => onRemoveTag(cas._id, tag)}>
                <X size={12} />
              </RemoveTagButton>
            </Tag>
          ))}
          <AddTagForm onSubmit={handleAddTag}>
            <TagInput
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nouveau tag"
            />
            <AddTagButton type="submit">
              <Plus size={16} />
            </AddTagButton>
          </AddTagForm>
        </TagsContainer>
        
        <CaseActions>
          <CaseButton as={Link} to={`/create-sheet/${cas._id}`} variant="secondary">
            <FileText />
            Créer fiche
          </CaseButton>
          <CaseButton variant="primary" onClick={() => onLoadCase(cas._id)}>
            <Download />
            Charger
          </CaseButton>
          <CaseButton variant="secondary" onClick={handleTogglePublic}>
            {cas.public ? <EyeOff /> : <Eye />}
            {cas.public ? 'Rendre privé' : 'Rendre public'}
          </CaseButton>
          <CaseButton variant="danger" onClick={() => onDeleteCase(cas._id)}>
            <Trash2 />
            Supprimer
          </CaseButton>
        </CaseActions>
      </CaseContent>
    </CaseCard>
  );
});

// ==================== COMPOSANT PRINCIPAL ====================

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);

  const tutorialSteps = [
    {
      image: "/tutorials/Screen_Cases1.png",
      description: "Page de création de cas - Commencez par créer un nouveau cas."
    }
  ];

  useEffect(() => {
    fetchCases();
  }, []);

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
      console.error('Erreur lors de la récupération des cas:', error);
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

  const removeImage = useCallback((folder, index) => {
    setNewImages(prev => ({
      ...prev,
      [folder]: prev[folder].filter((_, i) => i !== index)
    }));
  }, []);

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
      console.error('Erreur lors de l\'ajout des images:', error);
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
          c._id === selectedCase._id ? response.data : c
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

  const handleReorderImages = useCallback(async (folder, reorderedImages) => {
    if (!selectedCase) return;
    
    try {
      setSelectedCase(prevCase => ({
        ...prevCase,
        images: {
          ...prevCase.images,
          [folder]: reorderedImages
        }
      }));

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

      const response = await axios.patch(`/cases/${selectedCase._id}/reorder-images`, {
        folder,
        images: reorderedImages
      });

      if (!response.data) {
        throw new Error('Échec de la mise à jour');
      }

    } catch (error) {
      console.error('Erreur lors de la réorganisation des images:', error);
      await loadCase(selectedCase._id);
    }
  }, [selectedCase, loadCase]);

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
      }
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du cas:', error);
    }
  }, []);

  const filteredCases = cases.filter(cas => 
    cas.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <Title>🏥 Création de Cas</Title>
      
      <SearchInput
        type="text"
        placeholder="🔍 Rechercher un cas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* SECTION CRÉATION DE CAS */}
      <SectionContainer>
        <SectionTitle>
          <Plus />
          Créer un nouveau cas
        </SectionTitle>
        
        <InputGroup>
          <Input
            type="text"
            value={newCaseTitle}
            onChange={(e) => setNewCaseTitle(e.target.value)}
            placeholder="Titre du nouveau cas"
          />
          <Button variant="primary" size="large" onClick={addNewCase}>
            <Plus />
            Créer un nouveau cas
          </Button>
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
      </SectionContainer>

      {/* SECTION GESTION DU CAS SÉLECTIONNÉ - RESTAURÉE */}
      {selectedCase && (
        <SectionContainer>
          <SectionTitle>
            <Settings />
            Gestion du cas : {selectedCase.title}
          </SectionTitle>

          <InputGroup>
            <UploadButton>
              <ImageIcon size={20} style={{ marginRight: '10px' }} />
              Choisir l'image principale du cas
              <FileInput
                type="file"
                accept="image/*"
                onChange={setMainImage}
              />
            </UploadButton>
          </InputGroup>

          <InputGroup>
            <Input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom du nouveau dossier"
            />
            <Button onClick={addNewFolder}>
              <Folder size={20} style={{ marginRight: '10px' }} />
              Ajouter un dossier
            </Button>
          </InputGroup>

          {selectedCase.folders && selectedCase.folders.map(folder => (
            <FolderContainer key={folder}>
              <FolderHeader>
                <FolderTitle>
                  <Folder />
                  {folder}
                </FolderTitle>
                <FolderActions>
                  <UploadButton>
                    <Upload size={20} style={{ marginRight: '10px' }} />
                    Ajouter des images {folder}
                    <FileInput 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={(e) => handleImageUpload(e, folder)} 
                    />
                  </UploadButton>
                  <UploadButton>
                    <ImageIcon size={20} style={{ marginRight: '10px' }} />
                    Image principale du dossier
                    <FileInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFolderMainImage(e, folder)}
                    />
                  </UploadButton>
                  <Button variant="danger" onClick={() => deleteFolder(folder)}>
                    <Trash2 size={20} style={{ marginRight: '10px' }} />
                    Supprimer le dossier
                  </Button>
                </FolderActions>
              </FolderHeader>
              {newImages[folder] && newImages[folder].length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1rem' }}>
                  {newImages[folder].map((img, index) => (
                    <div key={index} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '4px', overflow: 'hidden' }}>
                      <img src={img.preview} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => removeImage(folder, index)}
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          backgroundColor: 'rgba(255, 0, 0, 0.7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FolderContainer>
          ))}

          <Button 
            onClick={addImagesToCase} 
            disabled={Object.values(newImages).every(arr => !arr || arr.length === 0)}
            variant="success"
            size="large"
          >
            <Upload />
            Ajouter les images au cas
          </Button>
        </SectionContainer>
      )}

      {/* SECTION GALERIES D'IMAGES DU CAS SÉLECTIONNÉ - RESTAURÉE */}
      {selectedCase && selectedCase.images && (
        <SectionContainer>
          <SectionTitle>
            <ImageIcon />
            Galeries d'images : {selectedCase.title}
          </SectionTitle>
          {selectedCase.folders && selectedCase.folders.map(folder => (
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
            <div 
              onClick={closeImage}
              tabIndex={0}
              style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                outline: 'none'
              }}
            >
              <img 
                src={selectedImage} 
                alt="Selected" 
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '80vmin',
                  height: '80vmin',
                  objectFit: 'contain',
                  backgroundColor: 'black'
                }}
              />
              <button 
                onClick={(e) => { e.stopPropagation(); closeImage(); }}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  zIndex: 10000
                }}
              >
                <X size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); navigateImage(-1); }} 
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '20px',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px',
                  fontSize: '24px',
                  zIndex: 10000
                }}
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); navigateImage(1); }} 
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '20px',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '10px',
                  fontSize: '24px',
                  zIndex: 10000
                }}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </SectionContainer>
      )}

      {/* SECTION LISTE DES CAS */}
      <SectionContainer>
        <SectionTitle>
          <FileText />
          Mes cas créés
        </SectionTitle>

        <CasesGrid>
          {filteredCases && filteredCases.length > 0 ? (
            filteredCases.map((cas) => (
              <CaseCardComponent
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
        </CasesGrid>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <FallbackPaginationContainer>
            <FallbackPaginationButton 
              onClick={() => fetchCases(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Précédent
            </FallbackPaginationButton>
            <FallbackPaginationInfo>
              Page {currentPage} sur {totalPages}
            </FallbackPaginationInfo>
            <FallbackPaginationButton 
              onClick={() => fetchCases(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Suivant
            </FallbackPaginationButton>
          </FallbackPaginationContainer>
        )}
      </SectionContainer>

      {/* LOADING ET ERREURS */}
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

      {/* TUTORIEL */}
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

      {/* BOUTON SCROLL VERS LE HAUT */}
      {isScrollVisible && (
        <button
          className="fixed bottom-20 right-4 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-secondary transition-colors duration-200"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* VIDÉO TUTORIEL */}
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
    </PageContainer>
  );
}

export default memo(CasesPage);