import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ChevronDown, ChevronUp, Plus, Trash2, GripVertical, Copy, Camera, Upload, Link } from 'lucide-react';
import axios from '../utils/axiosConfig';
import QuestionnairePreview from './QuestionnairePreview';
import LinkEditor from './LinkEditor';
import { AlertTriangle } from 'lucide-react';
import ImageMapEditor from './ImageMapEditor';

// ==================== STYLED COMPONENTS MODERNISÉS COMPACTS ====================

const ModernCreatorWrapper = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.background} 0%, ${props => props.theme.backgroundSecondary || props.theme.card} 100%);
  color: ${props => props.theme.text};
  padding: 1.5rem;
  min-height: calc(100vh - 60px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModernTitle = styled.h1`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ModernCreatorCard = styled.div`
  position: relative;
  overflow: hidden;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  
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

const ModernQuestionCard = styled.div`
  background-color: ${props => props.theme.cardSecondary || props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 4px 12px ${props => props.theme.primary}20;
  }
`;

const ModernQuestionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${props => props.theme.border};
  background: ${props => props.depth === 0 ? 
    `linear-gradient(90deg, ${props.theme.primary}10, ${props.theme.secondary}10)` : 
    props.theme.background};
  transition: background-color 0.2s ease;
  
  /* Empêcher la sélection sur l'en-tête sauf les inputs */
  user-select: none;
  
  input, textarea {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }
`;

const ModernQuestionContent = styled.div`
  padding: 0.75rem;
  background-color: ${props => props.depth % 2 === 0 ? 
    props.theme.card : 
    props.theme.cardSecondary || props.theme.background};
`;

const ModernInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  margin-bottom: ${props => props.marginBottom || '0'};
  
  /* Force la sélection de texte */
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary || props.theme.textLight};
    font-size: 0.85rem;
  }
`;

const ModernTitleInput = styled(ModernInput)`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  border: none;
  border-bottom: 2px solid ${props => props.theme.border};
  border-radius: 0;
  background: transparent;
  padding: 0.75rem 0;

  &:focus {
    border-bottom-color: ${props => props.theme.primary};
    box-shadow: none;
  }
`;

const ModernTextarea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  resize: vertical;
  min-height: 60px;
  transition: all 0.2s ease;
  
  /* Force la sélection de texte */
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary || props.theme.textLight};
    font-size: 0.85rem;
  }
`;

const ModernSelect = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.primary}20;
  }
`;

const CompactButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.primaryHover || props.theme.secondary});
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px ${props => props.theme.primary}30;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${props => props.theme.primary}40;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CompactSuccessButton = styled(CompactButton)`
  background: linear-gradient(135deg, ${props => props.theme.success}, ${props => props.theme.successLight || props.theme.secondary});
  box-shadow: 0 2px 4px ${props => props.theme.success}30;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 8px ${props => props.theme.success}40;
  }
`;

const CompactDangerButton = styled(CompactButton)`
  background: linear-gradient(135deg, ${props => props.theme.error}, ${props => props.theme.errorLight || '#dc2626'});
  box-shadow: 0 2px 4px ${props => props.theme.error}30;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 8px ${props => props.theme.error}40;
  }
`;

const CompactSecondaryButton = styled(CompactButton)`
  background: ${props => props.theme.buttonSecondary || props.theme.background};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 1px 3px ${props => props.theme.shadow};

  &:hover:not(:disabled) {
    background: ${props => props.theme.hover};
    border-color: ${props => props.theme.primary};
  }
`;

const CompactIconButton = styled.button`
  background: ${props => props.variant === 'danger' ? 
    `linear-gradient(135deg, ${props.theme.error}, ${props.theme.errorLight || '#dc2626'})` :
    props.variant === 'secondary' ?
    props.theme.background :
    `linear-gradient(135deg, ${props.theme.primary}, ${props.theme.primaryHover || props.theme.secondary})`
  };
  color: ${props => props.variant === 'secondary' ? props.theme.text : 'white'};
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.border}` : 'none'};
  border-radius: 6px;
  padding: 0.375rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px ${props => props.theme.shadow};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px ${props => props.theme.shadow};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const CompactButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const CompactDragHandle = styled.div`
  color: ${props => props.theme.textSecondary};
  cursor: grab;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  &:hover {
    color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hover};
    transform: scale(1.1);
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.95);
  }
`;

const ModernPreviewSection = styled(ModernCreatorCard)`
  background: linear-gradient(135deg, ${props => props.theme.card}, ${props => props.theme.cardSecondary || props.theme.background});
`;

const ModernPreviewTitle = styled.h3`
  color: ${props => props.theme.primary};
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '👁️';
    font-size: 1rem;
  }
`;

const CompactOptionContainer = styled.div`
  margin: 0.375rem 0;
  padding: 0.5rem;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hover};
  }
`;

const CompactImageUpload = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 0.5rem;
`;

const CompactLinkButton = styled(CompactSecondaryButton)`
  font-size: 0.75rem;
  padding: 0.375rem 0.75rem;
  margin-top: 0.5rem;
  
  ${props => !props.enabled && `
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: 0 1px 3px ${props.theme.shadow};
    }
  `}
`;

const SubQuestionWrapper = styled.div`
  margin-left: 1rem;
  margin-top: 0.5rem;
  padding-left: 0.75rem;
  border-left: 2px solid ${props => props.theme.border};
`;

const OptionCard = styled.div`
  margin-bottom: 0.5rem;
`;

// ==================== COMPOSANT IMAGE UPLOAD INTÉGRÉ ====================

const ImageUploadComponent = memo(({ onImageUpload, currentImage, id, onAddCaption, caption, questionnaireTitle }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [showCaptionModal, setShowCaptionModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        await onImageUpload(file, id, questionnaireTitle);
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <CompactImageUpload>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id={`image-upload-${id}`}
        disabled={uploading}
      />
      <label htmlFor={`image-upload-${id}`} style={{ cursor: 'pointer' }}>
        <CompactIconButton as="span" variant="secondary">
          {currentImage ? <Camera size={14} /> : <Upload size={14} />}
        </CompactIconButton>
      </label>
      
      {uploading && <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>...</span>}
      
      {currentImage && (
        <div 
          style={{ position: 'relative' }}
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          <CompactIconButton 
            variant="secondary"
            onClick={() => setShowCaptionModal(true)}
          >
            <Camera size={14} />
          </CompactIconButton>
          
          {showPreview && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              padding: '0.5rem',
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              border: '1px solid #e5e7eb'
            }}>
              <img
                src={currentImage}
                alt="Preview"
                style={{ maxWidth: '150px', maxHeight: '100px', objectFit: 'contain' }}
              />
              {caption && <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: '#6b7280' }}>{caption}</p>}
            </div>
          )}
        </div>
      )}
      
      {showCaptionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '400px'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: '600' }}>Ajouter une légende</h3>
            <ModernTextarea
              value={caption || ''}
              onChange={(e) => onAddCaption(id, e.target.value)}
              placeholder="Entrez la légende de l'image"
              style={{ marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CompactButton onClick={() => setShowCaptionModal(false)}>
                Fermer
              </CompactButton>
            </div>
          </div>
        </div>
      )}
    </CompactImageUpload>
  );
});

// ==================== COMPOSANT DRAG AND DROP ====================

const DraggableQuestion = memo(({ question, index, moveQuestion, path, children }) => {
  const ref = useRef(null);
  const dragRef = useRef(null);
  
  const [{ handlerId }, drop] = useDrop({
    accept: 'question',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      const dragPath = item.path;
      const hoverPath = path;

      if (JSON.stringify(dragPath) === JSON.stringify(hoverPath)) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveQuestion(dragPath, hoverPath);
      item.index = hoverIndex;
      item.path = hoverPath;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'question',
    item: () => ({ id: question.id, index, path }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  
  // Connecter le drag uniquement à la poignée
  drag(dragRef);
  drop(ref);

  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      {React.cloneElement(children, { dragRef })}
    </div>
  );
});

// ==================== COMPOSANT PRINCIPAL ====================

const QuestionnaireCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState({
    title: '',
    questions: [],
    selectedOptions: {},
    crData: { crTexts: {}, freeTexts: {} },
    pageTitles: {}
  });
  
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [questionLinks, setQuestionLinks] = useState({});
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [currentEditingElement, setCurrentEditingElement] = useState({ elementId: null, linkIndex: null });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  // Chargement des données si en mode édition
  useEffect(() => {
    if (id) {
      const fetchQuestionnaire = async () => {
        try {
          const response = await axios.get(`/questionnaires/${id}`);
          const data = response.data;
          setQuestionnaire({
            title: data.title || '',
            questions: data.questions || [],
            selectedOptions: data.selectedOptions || {},
            crData: data.crData || { crTexts: {}, freeTexts: {} },
            pageTitles: data.pageTitles || {}
          });
          
          if (data.links) {
            setQuestionLinks(data.links);
          }
        } catch (error) {
          console.error('Erreur lors du chargement:', error);
          alert('Erreur lors du chargement du questionnaire');
        }
      };
      fetchQuestionnaire();
    }
  }, [id]);

  // Fonctions de gestion des questions
  const updateQuestionnaire = useCallback((field, value) => {
    setQuestionnaire(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const moveQuestion = useCallback((dragPath, hoverPath) => {
    setQuestionnaire(prev => {
      const newQuestions = JSON.parse(JSON.stringify(prev.questions));
      
      const getQuestionAt = (questions, path) => {
        let current = questions;
        for (let i = 0; i < path.length; i++) {
          if (path[i] === 'options' || path[i] === 'subQuestions') {
            current = current[path[i]];
          } else {
            current = current[path[i]];
          }
        }
        return current;
      };

      const removeQuestionAt = (questions, path) => {
        const parentPath = path.slice(0, -1);
        const index = path[path.length - 1];
        const parent = getQuestionAt(questions, parentPath);
        return parent.splice(index, 1)[0];
      };

      const insertQuestionAt = (questions, path, question) => {
        const parentPath = path.slice(0, -1);
        const index = path[path.length - 1];
        const parent = getQuestionAt(questions, parentPath);
        parent.splice(index, 0, question);
      };

      const movedQuestion = removeQuestionAt(newQuestions, dragPath);
      insertQuestionAt(newQuestions, hoverPath, movedQuestion);

      return { ...prev, questions: newQuestions };
    });
  }, []);

  const toggleQuestion = useCallback((path) => {
    setExpandedQuestions(prev => {
      const key = path.join('-');
      return { ...prev, [key]: !prev[key] };
    });
  }, []);

  const updateQuestion = useCallback((path, field, value) => {
    setQuestionnaire(prev => {
      const updatedQuestions = JSON.parse(JSON.stringify(prev.questions));
      let current = updatedQuestions;
      for (let i = 0; i < path.length - 1; i++) {
        if (path[i] === 'options' || path[i] === 'subQuestions') {
          current = current[path[i]];
        } else {
          current = current[path[i]];
        }
      }
      if (typeof value === 'function') {
        current[path[path.length - 1]][field] = value(current[path[path.length - 1]][field]);
      } else {
        current[path[path.length - 1]][field] = value;
      }
      return { ...prev, questions: updatedQuestions };
    });
  }, []);

  const handleQuestionImageUpload = useCallback(async (e, path) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('questionnaireTitle', questionnaire.title);

      try {
        const response = await axios.post('upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        let currentQuestion = questionnaire.questions;
        for (let i = 0; i < path.length - 1; i++) {
          currentQuestion = currentQuestion[path[i]];
        }
        currentQuestion = currentQuestion[path[path.length - 1]];

        updateQuestion(path, 'questionImage', {
          src: response.data.imageUrl,
          areas: currentQuestion?.questionImage?.areas || []
        });
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image:', error);
      }
    }
  }, [questionnaire, updateQuestion]);

  const handleImageUpload = useCallback(async (file, elementId, questionnaireTitle) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('questionnaireTitle', questionnaireTitle);
  
    try {
      const response = await axios.post('/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const path = elementId.split('-');
      updateQuestion(path, 'image', { src: response.data.imageUrl, caption: '' });
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
    }
  }, [updateQuestion]);

  const handleAddCaption = useCallback((elementId, caption) => {
    const path = elementId.split('-');
    updateQuestion(path, 'image', prevImage => ({ ...prevImage, caption: caption }));
  }, [updateQuestion]);

  const duplicateQuestion = useCallback((question) => {
    const deepCopy = JSON.parse(JSON.stringify(question));
    const updateIds = (q) => {
      q.id = Date.now().toString();
      if (q.options) {
        q.options.forEach(option => {
          option.id = Date.now().toString();
          if (option.subQuestions) {
            option.subQuestions.forEach(updateIds);
          }
        });
      }
    };
    updateIds(deepCopy);
    return deepCopy;
  }, []);

  const addQuestion = useCallback((path = [], duplicatedQuestion = null) => {
    const newQuestion = duplicatedQuestion || { 
      id: Date.now().toString(), 
      text: '', 
      type: 'single', 
      options: [] 
    };
    
    setQuestionnaire(prev => {
      const updatedQuestions = JSON.parse(JSON.stringify(prev.questions));
      
      const addRecursive = (questions, currentPath) => {
        if (currentPath.length === 0) {
          questions.push(newQuestion);
          return questions;
        }
        
        const [index, ...restPath] = currentPath;
        
        if (restPath[0] === 'options') {
          if (!questions[index].options) {
            questions[index].options = [];
          }
          questions[index].options = addRecursive(questions[index].options, restPath.slice(1));
        } else if (restPath[0] === 'subQuestions') {
          if (!questions[index].subQuestions) {
            questions[index].subQuestions = [];
          }
          questions[index].subQuestions = addRecursive(questions[index].subQuestions, restPath.slice(1));
        }
        
        return questions;
      };
      
      return { ...prev, questions: addRecursive(updatedQuestions, path) };
    });
  }, []);

  const addOption = useCallback((path) => {
    setQuestionnaire(prev => {
      const updatedQuestions = JSON.parse(JSON.stringify(prev.questions));
      let current = updatedQuestions;
      for (let i = 0; i < path.length; i++) {
        if (path[i] === 'options' || path[i] === 'subQuestions') {
          current = current[path[i]];
        } else {
          current = current[path[i]];
        }
      }
      if (!current.options) {
        current.options = [];
      }
      current.options.push({ id: Date.now().toString(), text: '', subQuestions: [] });
      return { ...prev, questions: updatedQuestions };
    });
  }, []);

  const deleteQuestion = useCallback((path) => {
    setQuestionnaire(prev => {
      const updatedQuestions = JSON.parse(JSON.stringify(prev.questions));
      const parentPath = path.slice(0, -1);
      const index = path[path.length - 1];
      
      if (parentPath.length === 0) {
        updatedQuestions.splice(index, 1);
      } else {
        let current = updatedQuestions;
        for (let i = 0; i < parentPath.length; i++) {
          if (parentPath[i] === 'options' || parentPath[i] === 'subQuestions') {
            current = current[parentPath[i]];
          } else {
            current = current[parentPath[i]];
          }
        }
        current.splice(index, 1);
      }
      
      return { ...prev, questions: updatedQuestions };
    });
  }, []);

  const deleteOption = useCallback((path) => {
    setQuestionnaire(prev => {
      const updatedQuestions = JSON.parse(JSON.stringify(prev.questions));
      const parentPath = path.slice(0, -1);
      const index = path[path.length - 1];
      let current = updatedQuestions;
      for (let i = 0; i < parentPath.length; i++) {
        if (parentPath[i] === 'options' || parentPath[i] === 'subQuestions') {
          current = current[parentPath[i]];
        } else {
          current = current[parentPath[i]];
        }
      }
      current.splice(index, 1);
      return { ...prev, questions: updatedQuestions };
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      if (!questionnaire.title) {
        alert('Le titre du questionnaire est requis');
        return;
      }
  
      const dataToSave = {
        title: questionnaire.title,
        questions: questionnaire.questions.map(question => ({
          ...question,
          page: question.page || 1,
          type: question.type || 'single',
          text: question.text || '',
          id: question.id || Date.now().toString()
        })),
        selectedOptions: questionnaire.selectedOptions || {},
        crData: {
          crTexts: questionnaire.crData?.crTexts || {},
          freeTexts: questionnaire.crData?.freeTexts || {}
        },
        pageTitles: questionnaire.pageTitles || {},
        links: questionLinks
      };
  
      console.log('ID du questionnaire:', id);
      console.log('Données envoyées au serveur:', dataToSave);
  
      let response;
      if (id) {
        response = await axios.put(`/questionnaires/${id}`, dataToSave);
      } else {
        response = await axios.post('/questionnaires', dataToSave);
      }
  
      console.log('Réponse serveur:', response.data);
      setQuestionnaire(response.data);
      alert('Questionnaire sauvegardé avec succès');
      navigate('/questionnaires');
    } catch (error) {
      console.error('Détails complets de l\'erreur:', error);
      console.error('Données de la requête:', error?.config?.data);
      console.error('Réponse serveur:', error?.response?.data);
      alert(`Erreur lors de la sauvegarde: ${error?.response?.data?.message || error.message}`);
    }
  }, [questionnaire, id, navigate, questionLinks]);

  const handleFreeTextChange = useCallback((questionId, value) => {
    setQuestionnaire(prev => ({
      ...prev,
      crData: {
        ...prev.crData,
        freeTexts: {
          ...(prev.crData?.freeTexts || {}),
          [questionId]: value
        }
      }
    }));
  }, []);

  const handleOptionChange = useCallback((questionId, optionIndex, questionType) => {
    setQuestionnaire(prev => {
      const updatedQuestionnaire = JSON.parse(JSON.stringify(prev));
      if (!updatedQuestionnaire.selectedOptions) {
        updatedQuestionnaire.selectedOptions = {};
      }
      if (!updatedQuestionnaire.selectedOptions[questionId]) {
        updatedQuestionnaire.selectedOptions[questionId] = [];
      }
      
      if (questionType === 'single') {
        updatedQuestionnaire.selectedOptions[questionId] = [optionIndex];
      } else if (questionType === 'multiple') {
        const index = updatedQuestionnaire.selectedOptions[questionId].indexOf(optionIndex);
        if (index > -1) {
          updatedQuestionnaire.selectedOptions[questionId] = updatedQuestionnaire.selectedOptions[questionId].filter(i => i !== optionIndex);
        } else {
          updatedQuestionnaire.selectedOptions[questionId].push(optionIndex);
        }
      }
      
      return updatedQuestionnaire;
    });
  }, []);

  // Gestion des liens
  const handleOpenLinkEditor = useCallback((elementId, linkIndex) => {
    if (!id) {
      alert("Vous devez d'abord sauvegarder le questionnaire avant d'ajouter des liens.");
      return;
    }
    setCurrentEditingElement({ elementId, linkIndex });
    setShowLinkEditor(true);
  }, [id]);

  const handleSaveLink = useCallback(async (elementId, content, linkIndex, title) => {
    try {
      const updatedLinks = { ...questionLinks };
      
      if (!updatedLinks[elementId]) {
        updatedLinks[elementId] = [];
      }
      
      const newLink = { content, title, date: new Date() };
      
      if (typeof linkIndex !== 'undefined') {
        updatedLinks[elementId][linkIndex] = newLink;
      } else {
        updatedLinks[elementId].push(newLink);
      }
      
      setQuestionLinks(updatedLinks);
      
      await axios.post(`/questionnaires/${id}/links`, {
        elementId,
        content,
        linkIndex,
        title
      });
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du lien:', error);
    }
  }, [questionLinks, id]);

  const handleDeleteLink = useCallback(async (elementId, linkIndex) => {
    try {
      await axios.delete(`/questionnaires/${id}/links/${elementId}/${linkIndex}`);
      
      setQuestionLinks(prev => {
        const updated = { ...prev };
        if (updated[elementId]) {
          updated[elementId] = updated[elementId].filter((_, index) => index !== linkIndex);
          if (updated[elementId].length === 0) {
            delete updated[elementId];
          }
        }
        return updated;
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du lien:', error);
    }
  }, [id]);

  const handleDeleteLinkConfirm = async () => {
    if (linkToDelete) {
      await handleDeleteLink(linkToDelete.elementId, linkToDelete.index);
      setLinkToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  // Rendu des questions
  const renderQuestion = useCallback((question, path, dragRef) => {
    const isExpanded = expandedQuestions[path.join('-')] ?? true;
    const questionId = path.join('-');
    const depth = path.length;
    const links = questionLinks[questionId] || [];
  
    return (
      <ModernQuestionCard>
        <ModernQuestionHeader depth={depth}>
          <CompactIconButton
            variant="secondary"
            onClick={() => toggleQuestion(path)}
            style={{ marginRight: '0.5rem' }}
          >
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </CompactIconButton>
          
          <CompactDragHandle ref={dragRef} className="drag-handle">
            <GripVertical size={14} />
          </CompactDragHandle>
          
          <ModernInput
            value={question.text || ''}
            onChange={(e) => updateQuestion(path, 'text', e.target.value)}
            placeholder="Tapez votre question ici..."
            style={{ 
              marginLeft: '0.5rem', 
              flex: 1,
              marginBottom: 0,
              fontSize: '0.9rem'
            }}
          />

          {/* Gestion de la page et "Important?" pour les questions de niveau 1 */}
          {depth === 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <input
                  type="checkbox"
                  checked={question.isImportantToCheck || false}
                  onChange={(e) => updateQuestion(path, 'isImportantToCheck', e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Important?</span>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Page:</span>
                <input
                  type="number"
                  min="1"
                  value={question.page || 1}
                  onChange={(e) => updateQuestion(path, 'page', Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '50px',
                    padding: '0.25rem',
                    fontSize: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    userSelect: 'text'
                  }}
                />
                <input
                  type="text"
                  value={questionnaire.pageTitles[question.page] ?? ''}
                  onChange={(e) => {
                    const pageNumber = question.page || 1;
                    setQuestionnaire(prev => ({
                      ...prev,
                      pageTitles: {
                        ...prev.pageTitles,
                        [pageNumber]: e.target.value || ''
                      }
                    }));
                  }}
                  placeholder={`Titre page ${question.page || 1}`}
                  style={{
                    width: '120px',
                    padding: '0.25rem',
                    fontSize: '0.75rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    userSelect: 'text'
                  }}
                />
              </div>
            </div>
          )}

          {/* Images pour les questions */}
          <ImageUploadComponent
            onImageUpload={handleImageUpload}
            currentImage={question.image?.src}
            id={questionId}
            onAddCaption={handleAddCaption}
            caption={question.image?.caption}
            questionnaireTitle={questionnaire.title}
          />

          {/* Boutons des liens existants */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.5rem' }}>
            {links.map((link, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                <CompactSecondaryButton
                  onClick={() => handleOpenLinkEditor(questionId, index)}
                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                  title={`Éditer: ${link.title || `Fiche ${index + 1}`}`}
                >
                  {link.title || `Fiche ${index + 1}`}
                  <CompactIconButton
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLinkToDelete({ elementId: questionId, index });
                      setShowDeleteConfirm(true);
                    }}
                    style={{ marginLeft: '0.25rem', padding: '0.125rem' }}
                    title="Supprimer la fiche"
                  >
                    <Trash2 size={10} />
                  </CompactIconButton>
                </CompactSecondaryButton>
              </div>
            ))}
            
            <CompactIconButton
              variant="secondary"
              onClick={() => handleOpenLinkEditor(questionId)}
              title={!id ? "Sauvegardez d'abord le questionnaire" : "Ajouter une nouvelle fiche"}
              disabled={!id}
            >
              <Plus size={12} />
            </CompactIconButton>
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.25rem' }}>
            <CompactIconButton
              variant="secondary"
              onClick={() => {
                const duplicated = duplicateQuestion(question);
                addQuestion(path.slice(0, -1), duplicated);
              }}
              title="Dupliquer"
            >
              <Copy size={14} />
            </CompactIconButton>
            
            <CompactIconButton
              variant="danger"
              onClick={() => deleteQuestion(path)}
              title="Supprimer"
            >
              <Trash2 size={14} />
            </CompactIconButton>
          </div>
        </ModernQuestionHeader>

        {isExpanded && (
          <ModernQuestionContent depth={depth}>
            <ModernSelect
              value={question.type || 'single'}
              onChange={(e) => updateQuestion(path, 'type', e.target.value)}
              style={{ marginBottom: '0.75rem' }}
            >
              <option value="single">Choix unique</option>
              <option value="multiple">Choix multiple</option>
              <option value="text">Texte libre</option>
              <option value="number">Numérique</option>
              <option value="imageMap">Image interactive</option>
            </ModernSelect>

            {/* Gestion des images pour les questions imageMap */}
            {question.type === 'imageMap' && (
              <div style={{ marginBottom: '0.75rem' }}>
                {!question.questionImage?.src ? (
                  <div style={{
                    border: '2px dashed #d1d5db',
                    borderRadius: '6px',
                    padding: '1rem',
                    textAlign: 'center'
                  }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleQuestionImageUpload(e, path)}
                      className="hidden"
                      id={`question-image-${questionId}`}
                    />
                    <label
                      htmlFor={`question-image-${questionId}`}
                      style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    >
                      <Camera size={32} style={{ color: '#9ca3af', marginBottom: '0.5rem' }} />
                      <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Cliquez pour ajouter l'image de la question
                      </span>
                    </label>
                  </div>
                ) : (
                  <div>
                    <div style={{ position: 'relative' }}>
                      <img 
                        src={question.questionImage.src} 
                        alt="Question" 
                        style={{ width: '100%', borderRadius: '6px' }}
                      />
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleQuestionImageUpload(e, path)}
                          className="hidden"
                          id={`question-image-change-${questionId}`}
                        />
                        <label
                          htmlFor={`question-image-change-${questionId}`}
                          style={{ cursor: 'pointer' }}
                        >
                          <CompactIconButton as="span" variant="secondary">
                            <Camera size={14} />
                          </CompactIconButton>
                        </label>
                      </div>
                    </div>

                    <ImageMapEditor
                      image={question.questionImage}
                      areas={question.questionImage.areas || []}
                      onAreasChange={(newAreas) => 
                        updateQuestion(path, 'questionImage', {
                          ...question.questionImage,
                          areas: newAreas
                        })
                      }
                    />
                  </div>
                )}
              </div>
            )}

            {/* Options pour choix unique/multiple */}
            {['single', 'multiple'].includes(question.type) && (
              <div style={{ marginTop: '0.75rem' }}>
                {question.options?.map((option, oIndex) => (
                  <OptionCard key={option.id || `${questionId}-option-${oIndex}`}>
                    <CompactOptionContainer>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ModernInput
                          value={option.text || ''}
                          onChange={(e) => updateQuestion([...path, 'options', oIndex], 'text', e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                          style={{ flex: 1, marginBottom: 0 }}
                        />
                        
                        {/* Images pour les options */}
                        <ImageUploadComponent
                          onImageUpload={handleImageUpload}
                          currentImage={option.image?.src}
                          id={`${questionId}-options-${oIndex}`}
                          onAddCaption={handleAddCaption}
                          caption={option.image?.caption}
                          questionnaireTitle={questionnaire.title}
                        />

                        {/* Fiches pour les options */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          {(questionLinks[`${questionId}-options-${oIndex}`] || []).map((link, index) => (
                            <CompactSecondaryButton
                              key={index}
                              onClick={() => handleOpenLinkEditor(`${questionId}-options-${oIndex}`, index)}
                              style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                              title={`Éditer: ${link.title || `Fiche ${index + 1}`}`}
                            >
                              {link.title || `Fiche ${index + 1}`}
                              <CompactIconButton
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLinkToDelete({ elementId: `${questionId}-options-${oIndex}`, index });
                                  setShowDeleteConfirm(true);
                                }}
                                style={{ marginLeft: '0.25rem', padding: '0.125rem' }}
                                title="Supprimer la fiche"
                              >
                                <Trash2 size={10} />
                              </CompactIconButton>
                            </CompactSecondaryButton>
                          ))}
                          
                          <CompactIconButton
                            variant="secondary"
                            onClick={() => handleOpenLinkEditor(`${questionId}-options-${oIndex}`)}
                            title="Ajouter une fiche"
                          >
                            <Plus size={12} />
                          </CompactIconButton>
                        </div>
                        
                        <CompactIconButton
                          variant="danger"
                          onClick={() => deleteOption([...path, 'options', oIndex])}
                          title="Supprimer l'option"
                        >
                          <Trash2 size={14} />
                        </CompactIconButton>
                        
                        <CompactIconButton
                          variant="secondary"
                          onClick={() => addQuestion([...path, 'options', oIndex, 'subQuestions'])}
                          title="Ajouter une sous-question"
                        >
                          <Plus size={14} />
                        </CompactIconButton>
                      </div>

                      {/* Sous-questions */}
                      {option.subQuestions?.length > 0 && (
                        <SubQuestionWrapper>
                          {option.subQuestions.map((subQuestion, sqIndex) => (
                            <DraggableQuestion
                              key={subQuestion.id || `subquestion-${sqIndex}`}
                              question={subQuestion}
                              index={sqIndex}
                              moveQuestion={moveQuestion}
                              path={[...path, 'options', oIndex, 'subQuestions', sqIndex]}
                            >
                              {renderQuestion(subQuestion, [...path, 'options', oIndex, 'subQuestions', sqIndex])}
                            </DraggableQuestion>
                          ))}
                        </SubQuestionWrapper>
                      )}
                    </CompactOptionContainer>
                  </OptionCard>
                ))}

                <CompactButton
                  onClick={() => addOption(path)}
                  style={{ marginTop: '0.5rem' }}
                >
                  <Plus size={14} />
                  Ajouter une option
                </CompactButton>
              </div>
            )}
          </ModernQuestionContent>
        )}
      </ModernQuestionCard>
    );
  }, [expandedQuestions, moveQuestion, toggleQuestion, updateQuestion, handleQuestionImageUpload, duplicateQuestion, addQuestion, deleteQuestion, deleteOption, addOption, questionnaire.title, handleOpenLinkEditor, questionLinks, handleImageUpload, handleAddCaption]);

  return (
    <ModernCreatorWrapper>
      <ModernTitle>
        {id ? 'Modifier le questionnaire' : 'Créer un nouveau questionnaire'}
      </ModernTitle>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'row',
        gap: '1.5rem'
      }}>
        {/* Section principale d'édition - 2/3 de la largeur */}
        <div style={{ flex: '2', minWidth: '0' }}>
          <ModernCreatorCard>
            <ModernTitleInput
              type="text" 
              value={questionnaire.title} 
              onChange={(e) => updateQuestionnaire('title', e.target.value)}
              placeholder="Titre du questionnaire" 
            />
            
            <DndProvider backend={HTML5Backend}>
              {questionnaire.questions.map((question, index) => (
                <DraggableQuestion
                  key={question.id || `question-${index}`}
                  question={question}
                  index={index}
                  moveQuestion={moveQuestion}
                  path={[index]}
                >
                  {renderQuestion(question, [index])}
                </DraggableQuestion>
              ))}
            </DndProvider>
            
            <CompactButtonGroup>
              <CompactButton onClick={() => addQuestion()}>
                <Plus size={14} />
                Ajouter une question
              </CompactButton>
              
              <CompactSuccessButton onClick={handleSave}>
                Sauvegarder le questionnaire
              </CompactSuccessButton>
            </CompactButtonGroup>
          </ModernCreatorCard>
        </div>
        
        {/* Section aperçu - 1/3 de la largeur, à droite */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <ModernPreviewSection>
            <ModernPreviewTitle>
              Aperçu du questionnaire
            </ModernPreviewTitle>
            
            <div style={{ 
              padding: '0.75rem',
              backgroundColor: '#f9fafb',
              borderRadius: '6px',
              border: '1px solid #e5e7eb',
              fontSize: '0.9rem'
            }}>
              <QuestionnairePreview 
                questions={questionnaire.questions}
                selectedOptions={questionnaire.selectedOptions}
                setSelectedOptions={(questionId, optionIndex, type) => {
                  setQuestionnaire(prev => ({
                    ...prev,
                    selectedOptions: {
                      ...prev.selectedOptions,
                      [questionId]: type === 'single' ? [optionIndex] : 
                        [...(prev.selectedOptions[questionId] || [])].includes(optionIndex) ?
                        prev.selectedOptions[questionId].filter(i => i !== optionIndex) :
                        [...(prev.selectedOptions[questionId] || []), optionIndex]
                    }
                  }));
                }}
                crTexts={questionnaire.crData?.crTexts || {}}
                setCRTexts={(newCRTexts) => updateQuestionnaire('crData', {
                  ...questionnaire.crData,
                  crTexts: newCRTexts
                })}
                freeTexts={questionnaire.crData?.freeTexts || {}}
                onFreeTextChange={handleFreeTextChange}
                showCRFields={false}
                questionnaireLinks={questionLinks}
                questionnaireId={id}
                questionnaire={questionnaire}
                setQuestionnaire={setQuestionnaire}
              />
            </div>
          </ModernPreviewSection>
        </div>
      </div>

      {/* Modales */}
      {showLinkEditor && (
        <LinkEditor
          onClose={() => setShowLinkEditor(false)}
          onSave={handleSaveLink}
          elementId={currentEditingElement.elementId}
          questionnaireId={id}
          linkIndex={currentEditingElement.linkIndex}
          initialContent={
            currentEditingElement.linkIndex !== undefined
              ? questionLinks[currentEditingElement.elementId]?.[currentEditingElement.linkIndex]?.content || ""
              : ""
          }
          initialTitle={
            currentEditingElement.linkIndex !== undefined
              ? questionLinks[currentEditingElement.elementId]?.[currentEditingElement.linkIndex]?.title || ""
              : ""
          }
        />
      )}

      {showDeleteConfirm && (
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
          <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <AlertTriangle size={20} style={{ color: '#f59e0b', marginRight: '0.5rem' }} />
              <h3 style={{ margin: 0, color: '#374151', fontSize: '1.1rem' }}>Confirmer la suppression</h3>
            </div>
            
            <p style={{ marginBottom: '1.5rem', color: '#6b7280', fontSize: '0.9rem' }}>
              Êtes-vous sûr de vouloir supprimer ce lien ? Cette action est irréversible.
            </p>
            
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <CompactSecondaryButton
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setLinkToDelete(null);
                }}
              >
                Annuler
              </CompactSecondaryButton>
              
              <CompactDangerButton onClick={handleDeleteLinkConfirm}>
                Supprimer
              </CompactDangerButton>
            </div>
          </div>
        </div>
      )}
    </ModernCreatorWrapper>
  );
};

export default QuestionnaireCreator;