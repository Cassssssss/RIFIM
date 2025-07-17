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

// ==================== STYLED COMPONENTS MODERNISÉS HARMONISÉS AVEC LE THÈME ====================

const ModernCreatorWrapper = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.background} 0%, ${props => props.theme.backgroundSecondary || props.theme.card} 100%);
  color: ${props => props.theme.text};
  padding: 2rem;
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
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
  margin-bottom: 2rem;
  text-align: center;
`;

const ModernCreatorCard = styled.div`
  position: relative;
  overflow: hidden;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
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
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  transition: all 0.2s ease;
  overflow: hidden;

  &:hover {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 4px 15px ${props => props.theme.primary}20;
    transform: translateY(-1px);
  }
`;

const ModernQuestionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
  background: ${props => props.depth === 0 ? 
    `linear-gradient(90deg, ${props.theme.primary}15, ${props.theme.secondary}15)` : 
    props.theme.background};
  transition: background-color 0.2s ease;
`;

const ModernQuestionContent = styled.div`
  padding: 1rem;
  background-color: ${props => props.depth % 2 === 0 ? 
    props.theme.card : 
    props.theme.cardSecondary || props.theme.background};
`;

const ModernInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  margin-bottom: ${props => props.marginBottom || '0'};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary || props.theme.textLight};
  }
`;

const ModernTitleInput = styled(ModernInput)`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
  border: none;
  border-bottom: 3px solid ${props => props.theme.border};
  border-radius: 0;
  background: transparent;
  padding: 1rem 0;

  &:focus {
    border-bottom-color: ${props => props.theme.primary};
    box-shadow: none;
  }
`;

const ModernTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  resize: vertical;
  min-height: 100px;
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

const ModernSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const ModernButton = styled.button`
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
    width: 16px;
    height: 16px;
  }
`;

const ModernSuccessButton = styled(ModernButton)`
  background: linear-gradient(135deg, ${props => props.theme.success}, ${props => props.theme.successLight || props.theme.secondary});
  box-shadow: 0 2px 8px ${props => props.theme.success}30;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 15px ${props => props.theme.success}40;
  }
`;

const ModernDangerButton = styled(ModernButton)`
  background: linear-gradient(135deg, ${props => props.theme.error}, ${props => props.theme.errorLight || '#dc2626'});
  box-shadow: 0 2px 8px ${props => props.theme.error}30;

  &:hover:not(:disabled) {
    box-shadow: 0 4px 15px ${props => props.theme.error}40;
  }
`;

const ModernSecondaryButton = styled(ModernButton)`
  background: ${props => props.theme.buttonSecondary || props.theme.background};
  color: ${props => props.theme.text};
  border: 2px solid ${props => props.theme.border};
  box-shadow: 0 2px 8px ${props => props.theme.shadow};

  &:hover:not(:disabled) {
    background: ${props => props.theme.hover};
    border-color: ${props => props.theme.primary};
    box-shadow: 0 4px 15px ${props => props.theme.shadow};
  }
`;

const ModernIconButton = styled.button`
  background: ${props => props.variant === 'danger' ? 
    `linear-gradient(135deg, ${props.theme.error}, ${props.theme.errorLight || '#dc2626'})` :
    props.variant === 'secondary' ?
    props.theme.background :
    `linear-gradient(135deg, ${props.theme.primary}, ${props.theme.primaryHover || props.theme.secondary})`
  };
  color: ${props => props.variant === 'secondary' ? props.theme.text : 'white'};
  border: ${props => props.variant === 'secondary' ? `2px solid ${props.theme.border}` : 'none'};
  border-radius: 8px;
  padding: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px ${props => props.theme.shadow};

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${props => props.theme.shadow};
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
`;

const ModernButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ModernDragHandle = styled.div`
  color: ${props => props.theme.textSecondary};
  cursor: grab;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hover};
  }

  &:active {
    cursor: grabbing;
  }
`;

const ModernPreviewSection = styled(ModernCreatorCard)`
  background: linear-gradient(135deg, ${props => props.theme.card}, ${props => props.theme.cardSecondary || props.theme.background});
`;

const ModernPreviewTitle = styled.h3`
  color: ${props => props.theme.primary};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &::before {
    content: '👁️';
    font-size: 1.2rem;
  }
`;

const ModernOptionContainer = styled.div`
  margin: 0.5rem 0;
  padding: 0.75rem;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hover};
  }
`;

const ModernLinkButton = styled(ModernSecondaryButton)`
  font-size: 0.8rem;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  
  ${props => !props.enabled && `
    opacity: 0.5;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: 0 2px 8px ${props.theme.shadow};
    }
  `}
`;

// ==================== COMPOSANT DRAG AND DROP ====================

const DraggableQuestion = memo(({ question, index, moveQuestion, path, children }) => {
  const ref = useRef(null);
  
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
  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      {children}
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
  const [editingLink, setEditingLink] = useState(null);
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
        if (parentPath[i] === 'options' || path[i] === 'subQuestions') {
          current = current[parentPath[i]];
        } else {
          current = current[path[i]];
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
  const handleOpenLinkEditor = useCallback((questionId) => {
    if (!id) {
      alert("Vous devez d'abord sauvegarder le questionnaire avant d'ajouter des liens.");
      return;
    }
    setEditingLink({ questionId, title: '', content: '', index: null });
    setShowLinkEditor(true);
  }, [id]);

  const handleSaveLink = useCallback((linkData) => {
    setQuestionLinks(prev => {
      const newLinks = { ...prev };
      const questionId = linkData.questionId;
      
      if (!newLinks[questionId]) {
        newLinks[questionId] = [];
      }
      
      if (linkData.index !== null) {
        newLinks[questionId][linkData.index] = {
          title: linkData.title,
          content: linkData.content
        };
      } else {
        newLinks[questionId].push({
          title: linkData.title,
          content: linkData.content
        });
      }
      
      return newLinks;
    });
    setShowLinkEditor(false);
    setEditingLink(null);
  }, []);

  const handleDeleteLink = useCallback(async (questionId, linkIndex) => {
    setQuestionLinks(prev => {
      const newLinks = { ...prev };
      if (newLinks[questionId]) {
        newLinks[questionId].splice(linkIndex, 1);
        if (newLinks[questionId].length === 0) {
          delete newLinks[questionId];
        }
      }
      return newLinks;
    });
  }, []);

  const handleDeleteLinkConfirm = async () => {
    if (linkToDelete) {
      await handleDeleteLink(linkToDelete.elementId, linkToDelete.index);
      setLinkToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  // Rendu des questions
  const renderQuestion = useCallback((question, path) => {
    const isExpanded = expandedQuestions[path.join('-')] ?? true;
    const questionId = path.join('-');
    const depth = path.length;
    const links = questionLinks[questionId] || [];
  
    console.log('question.questionImage:', question.questionImage);
    return (
      <DraggableQuestion
        key={question.id || `question-${questionId}`}
        question={question}
        index={path[path.length - 1]}
        moveQuestion={moveQuestion}
        path={path}
      >
        <ModernQuestionCard>
          <ModernQuestionHeader depth={depth}>
            <ModernIconButton
              variant="secondary"
              onClick={() => toggleQuestion(path)}
              style={{ marginRight: '0.5rem' }}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </ModernIconButton>
            
            <ModernDragHandle>
              <GripVertical size={16} />
            </ModernDragHandle>
            
            <span style={{ 
              marginLeft: '0.5rem', 
              fontWeight: '600',
              color: depth === 0 ? 'inherit' : '#6b7280'
            }}>
              Question {depth === 0 ? path[0] + 1 : `${path[0] + 1}.${path.slice(1).join('.')}`}
            </span>

            <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
              <ModernIconButton
                variant="secondary"
                onClick={() => addQuestion(path, duplicateQuestion(question))}
                title="Dupliquer"
              >
                <Copy size={16} />
              </ModernIconButton>
              
              <ModernIconButton
                variant="danger"
                onClick={() => deleteQuestion(path)}
                title="Supprimer"
              >
                <Trash2 size={16} />
              </ModernIconButton>
            </div>
          </ModernQuestionHeader>

          {isExpanded && (
            <ModernQuestionContent depth={depth}>
              <ModernTextarea
                value={question.text || ''}
                onChange={(e) => updateQuestion(path, 'text', e.target.value)}
                placeholder="Tapez votre question ici..."
                style={{ marginBottom: '1rem' }}
              />

              <ModernSelect
                value={question.type || 'single'}
                onChange={(e) => updateQuestion(path, 'type', e.target.value)}
                style={{ marginBottom: '1rem' }}
              >
                <option value="single">Choix unique</option>
                <option value="multiple">Choix multiple</option>
                <option value="text">Texte libre</option>
              </ModernSelect>

              {/* Upload d'image pour la question */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem', 
                  fontWeight: '500',
                  color: '#374151'
                }}>
                  Image de la question:
                </label>
                <ModernButton as="label" style={{ cursor: 'pointer' }}>
                  <Camera size={16} />
                  Ajouter une image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleQuestionImageUpload(e, path)}
                    style={{ display: 'none' }}
                  />
                </ModernButton>
                
                {question.questionImage?.src && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <img 
                      src={question.questionImage.src} 
                      alt="Question" 
                      style={{ 
                        maxWidth: '200px', 
                        height: 'auto',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }} 
                    />
                  </div>
                )}
              </div>

              {/* Options pour choix unique/multiple */}
              {(question.type === 'single' || question.type === 'multiple') && (
                <div>
                  <h4 style={{ 
                    marginBottom: '1rem', 
                    fontWeight: '600',
                    color: '#374151'
                  }}>
                    Options de réponse:
                  </h4>
                  
                  {question.options?.map((option, optionIndex) => (
                    <ModernOptionContainer key={option.id || optionIndex}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ModernInput
                          value={option.text || ''}
                          onChange={(e) => updateQuestion([...path, 'options', optionIndex], 'text', e.target.value)}
                          placeholder={`Option ${optionIndex + 1}`}
                          style={{ flex: 1, marginBottom: 0 }}
                        />
                        
                        <ModernIconButton
                          variant="danger"
                          onClick={() => deleteOption([...path, 'options', optionIndex])}
                          title="Supprimer l'option"
                        >
                          <Trash2 size={16} />
                        </ModernIconButton>
                      </div>

                      {/* Sous-questions */}
                      {option.subQuestions?.length > 0 && (
                        <div style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
                          {option.subQuestions.map((subQuestion, subIndex) => 
                            renderQuestion(subQuestion, [...path, 'options', optionIndex, 'subQuestions', subIndex])
                          )}
                        </div>
                      )}

                      <ModernSecondaryButton
                        onClick={() => addQuestion([...path, 'options', optionIndex, 'subQuestions'])}
                        style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                      >
                        <Plus size={14} />
                        Ajouter une sous-question
                      </ModernSecondaryButton>
                    </ModernOptionContainer>
                  ))}

                  <ModernButton
                    onClick={() => addOption(path)}
                    style={{ marginTop: '1rem' }}
                  >
                    <Plus size={16} />
                    Ajouter une option
                  </ModernButton>
                </div>
              )}

              {/* Bouton pour ajouter des liens */}
              <ModernLinkButton
                enabled={!!id}
                onClick={() => handleOpenLinkEditor(questionId)}
                title={!id ? "Sauvegardez d'abord le questionnaire pour ajouter des liens" : "Ajouter un lien"}
              >
                <Link size={14} />
                Ajouter un lien
              </ModernLinkButton>

              {/* Affichage des liens existants */}
              {links.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h5 style={{ marginBottom: '0.5rem', fontWeight: '500' }}>Liens associés:</h5>
                  {links.map((link, index) => (
                    <div 
                      key={index}
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '0.5rem',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}
                    >
                      <span>{link.title}</span>
                      <ModernIconButton
                        variant="danger"
                        onClick={() => {
                          setLinkToDelete({ elementId: questionId, index });
                          setShowDeleteConfirm(true);
                        }}
                        title="Supprimer le lien"
                      >
                        <Trash2 size={14} />
                      </ModernIconButton>
                    </div>
                  ))}
                </div>
              )}
            </ModernQuestionContent>
          )}
        </ModernQuestionCard>
      </DraggableQuestion>
    );
  }, [expandedQuestions, moveQuestion, toggleQuestion, updateQuestion, handleQuestionImageUpload, duplicateQuestion, addQuestion, deleteQuestion, deleteOption, addOption, questionnaire.title, handleOpenLinkEditor, questionLinks]);

  console.log('questionLinks dans Creator:', questionLinks);
  console.log('id dans Creator:', id);

  return (
    <ModernCreatorWrapper>
      <ModernTitle>
        {id ? 'Modifier le questionnaire' : 'Créer un nouveau questionnaire'}
      </ModernTitle>

      <div style={{ 
        display: 'flex', 
        flexDirection: window.innerWidth > 1024 ? 'row' : 'column',
        gap: '2rem'
      }}>
        {/* Section principale d'édition */}
        <div style={{ flex: '2', minWidth: '0' }}>
          <ModernCreatorCard>
            <ModernTitleInput
              type="text" 
              value={questionnaire.title} 
              onChange={(e) => updateQuestionnaire('title', e.target.value)}
              placeholder="Titre du questionnaire" 
            />
            
            <DndProvider backend={HTML5Backend}>
              {questionnaire.questions.map((question, index) => renderQuestion(question, [index]))}
            </DndProvider>
            
            <ModernButtonGroup>
              <ModernButton onClick={() => addQuestion()}>
                <Plus size={16} />
                Ajouter une question
              </ModernButton>
              
              <ModernSuccessButton onClick={handleSave}>
                Sauvegarder le questionnaire
              </ModernSuccessButton>
            </ModernButtonGroup>
          </ModernCreatorCard>
        </div>
        
        {/* Section aperçu */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <ModernPreviewSection>
            <ModernPreviewTitle>
              Aperçu du questionnaire
            </ModernPreviewTitle>
            
            <div style={{ 
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
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
                crData={questionnaire.crData}
                onCRTextChange={(questionId, value) => {
                  setQuestionnaire(prev => ({
                    ...prev,
                    crData: {
                      ...prev.crData,
                      crTexts: {
                        ...(prev.crData?.crTexts || {}),
                        [questionId]: value
                      }
                    }
                  }));
                }}
                onFreeTextChange={handleFreeTextChange}
                onOptionChange={handleOptionChange}
                questionLinks={questionLinks}
                onImageUpload={handleImageUpload}
                onAddCaption={handleAddCaption}
                questionnaireTitle={questionnaire.title}
              />
            </div>
          </ModernPreviewSection>
        </div>
      </div>

      {/* Modales */}
      {showLinkEditor && (
        <LinkEditor
          isOpen={showLinkEditor}
          onClose={() => {
            setShowLinkEditor(false);
            setEditingLink(null);
          }}
          onSave={handleSaveLink}
          initialData={editingLink}
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
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            maxWidth: '400px',
            width: '90%'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <AlertTriangle size={24} style={{ color: '#f59e0b', marginRight: '0.5rem' }} />
              <h3 style={{ margin: 0, color: '#374151' }}>Confirmer la suppression</h3>
            </div>
            
            <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
              Êtes-vous sûr de vouloir supprimer ce lien ? Cette action est irréversible.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <ModernSecondaryButton
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setLinkToDelete(null);
                }}
              >
                Annuler
              </ModernSecondaryButton>
              
              <ModernDangerButton onClick={handleDeleteLinkConfirm}>
                Supprimer
              </ModernDangerButton>
            </div>
          </div>
        </div>
      )}
    </ModernCreatorWrapper>
  );
};

export default QuestionnaireCreator;