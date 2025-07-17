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
import { medicalColors } from '../medicalColors';

// Styled components avec thème médical appliqué
const CreatorWrapper = styled.div`
  background-color: ${medicalColors.backgrounds.main};
  color: ${medicalColors.neutral.charcoal};
  padding: 2rem;
  border-radius: 8px;
  min-height: 100vh;
`;

const CreatorCard = styled.div`
  background-color: ${medicalColors.cards.background};
  color: ${medicalColors.neutral.charcoal};
  border: 1px solid ${medicalColors.borders.light};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 20px ${medicalColors.shadows.soft};
`;

const QuestionCard = styled.div`
  background-color: ${medicalColors.cards.background};
  border: 1px solid ${medicalColors.borders.light};
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 8px ${medicalColors.shadows.soft};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${medicalColors.primary.main};
    box-shadow: 0 4px 12px ${medicalColors.primary.main}20;
  }
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${medicalColors.borders.light};
  background-color: ${props => props.depth === 0 ? 
    medicalColors.primary.subtle : 
    medicalColors.backgrounds.alt};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const QuestionContent = styled.div`
  padding: 0.75rem;
  background-color: ${props => props.depth % 2 === 0 ? 
    medicalColors.backgrounds.main : 
    medicalColors.backgrounds.alt};
`;

const OptionCard = styled.div`
  background-color: ${medicalColors.backgrounds.alt};
  border: 1px solid ${medicalColors.borders.light};
  border-radius: 6px;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${medicalColors.cards.hover};
    border-color: ${medicalColors.primary.main};
  }
`;

const SubQuestionWrapper = styled.div`
  margin-left: ${props => Math.min(props.depth * 0.5, 1.5)}rem;
  border-left: 2px solid ${medicalColors.primary.main};
  padding-left: 0.75rem;
  margin-top: 0.5rem;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 6px;
  background-color: ${medicalColors.forms.input.bg};
  color: ${medicalColors.neutral.charcoal};
  border: 1px solid ${medicalColors.forms.input.border};
  
  &:focus {
    outline: none;
    border-color: ${medicalColors.primary.main};
    box-shadow: 0 0 0 2px ${medicalColors.primary.main}20;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${medicalColors.cards.background};
  color: ${medicalColors.neutral.charcoal};
  padding: 2rem;
  border-radius: 12px;
  width: 80%;
  max-width: 500px;
  border: 1px solid ${medicalColors.borders.light};
  box-shadow: 0 10px 40px ${medicalColors.shadows.deep};
`;

// ============ NOUVEAU: Styled component pour le drag handle ============
const DragHandle = styled.div`
  color: ${medicalColors.neutral.mediumGray};
  cursor: grab;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  margin-right: 0.5rem;

  &:hover {
    color: ${medicalColors.primary.main};
    background-color: ${medicalColors.primary.subtle};
  }

  &:active {
    cursor: grabbing;
  }
`;

const ImageUpload = memo(({ onImageUpload, currentImage, id, onAddCaption, caption, questionnaireTitle }) => {
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
    <div className="relative inline-block">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id={`image-upload-${id}`}
        disabled={uploading}
      />
      <label
        htmlFor={`image-upload-${id}`}
        className="cursor-pointer inline-flex items-center px-2 py-1 border rounded-md shadow-sm text-sm font-medium transition-colors"
        style={{
          borderColor: medicalColors.borders.light,
          backgroundColor: medicalColors.cards.background,
          color: medicalColors.neutral.charcoal
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = medicalColors.cards.hover;
          e.target.style.borderColor = medicalColors.primary.main;
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = medicalColors.cards.background;
          e.target.style.borderColor = medicalColors.borders.light;
        }}
      >
        {currentImage ? <Camera size={20} /> : <Upload size={20} />}
      </label>
      {uploading && <span className="ml-2">Téléchargement en cours...</span>}
      {currentImage && (
        <div 
          className="inline-block ml-2"
          onMouseEnter={() => setShowPreview(true)}
          onMouseLeave={() => setShowPreview(false)}
        >
          <Camera 
            size={20} 
            className="cursor-pointer"
            style={{ color: medicalColors.primary.main }}
            onClick={() => setShowCaptionModal(true)}
          />
          {showPreview && (
            <div className="absolute z-10 p-2 bg-white rounded-lg shadow-xl" style={{ top: '100%', left: '50%', transform: 'translateX(-50%)' }}>
              <img
                src={currentImage}
                alt="Preview"
                className="max-w-xs max-h-64 object-contain"
              />
              {caption && <p className="mt-2 text-sm text-gray-500">{caption}</p>}
            </div>
          )}
        </div>
      )}
      {showCaptionModal && (
        <Modal>
          <ModalContent>
            <h2 className="text-xl font-semibold mb-4">Ajouter une légende</h2>
            <textarea
              className="w-full p-2 border rounded mb-4"
              value={caption}
              onChange={(e) => onAddCaption(id, e.target.value)}
              placeholder="Entrez la légende de l'image"
              style={{
                borderColor: medicalColors.forms.input.border,
                backgroundColor: medicalColors.forms.input.bg
              }}
            />
            <div className="flex justify-end">
              <button
                className="text-white py-2 px-4 rounded transition-colors text-sm"
                style={{
                  backgroundColor: medicalColors.buttons.primary.bg,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.buttons.primary.hover}
                onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.buttons.primary.bg}
                onClick={() => setShowCaptionModal(false)}
              >
                Fermer
              </button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </div>
  );
});

// ============ MODIFICATION: DraggableQuestion avec drag sélectif ============
const DraggableQuestion = memo(({ question, index, moveQuestion, path, children }) => {
  const ref = useRef(null);
  const [{ isDragging }, drag] = useDrag({
    type: 'QUESTION',
    item: { index, path },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  
  const [, drop] = useDrop({
    accept: 'QUESTION',
    hover: (item, monitor) => {
      if (!ref.current) return;
      const dragPath = item.path;
      const hoverPath = path;
      
      if (dragPath.join('-') === hoverPath.join('-')) return;
      if (dragPath.includes('options') !== hoverPath.includes('options')) return;
      
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      
      if (dragPath[dragPath.length - 1] < hoverPath[hoverPath.length - 1] && hoverClientY < hoverMiddleY) return;
      if (dragPath[dragPath.length - 1] > hoverPath[hoverPath.length - 1] && hoverClientY > hoverMiddleY) return;
      
      moveQuestion(dragPath, hoverPath);
      item.path = hoverPath;
    },
  });
  
  // ============ NOUVEAU: Connecter le drop à toute la zone ============
  drop(ref);

  // ============ NOUVEAU: Connecter le drag seulement au handle ============
  useEffect(() => {
    if (ref.current) {
      const dragHandle = ref.current.querySelector('.drag-handle');
      if (dragHandle) {
        drag(dragHandle);
      }
    }
  }, [drag]);
  
  return (
    <div ref={ref} className="mb-4 relative" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {children}
    </div>
  );
});

function QuestionnaireCreator() {
  const [questionnaire, setQuestionnaire] = useState({
    title: '',
    questions: [],
    selectedOptions: {},
    crData: { crTexts: {}, freeTexts: {} },
    pageTitles: {}
  });
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [currentEditingElement, setCurrentEditingElement] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [questionLinks, setQuestionLinks] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      alert("Veuillez créer et sauvegarder votre questionnaire avant d'ajouter des liens");
    }
  }, []);

  useEffect(() => {
    if (id) {
      const fetchQuestionnaire = async () => {
        try {
          const response = await axios.get(`/questionnaires/${id}`);
          const loadedQuestionnaire = response.data;
  
          console.log('loadedQuestionnaire:', loadedQuestionnaire);
          
          const linksObject = {};
          if (loadedQuestionnaire.links && typeof loadedQuestionnaire.links === 'object') {
            for (let [key, value] of Object.entries(loadedQuestionnaire.links)) {
              linksObject[key] = value;
            }
          }
          
          setQuestionLinks(linksObject);
          setQuestionnaire({
            ...loadedQuestionnaire,
            selectedOptions: loadedQuestionnaire.selectedOptions || {},
            crData: {
              crTexts: loadedQuestionnaire.crData?.crTexts || {},
              freeTexts: loadedQuestionnaire.crData?.freeTexts || {}
            },
            pageTitles: loadedQuestionnaire.pageTitles || {}
          });
          
          console.log('questionnaire après setQuestionnaire:', questionnaire);
        } catch (error) {
          console.error('Erreur lors du chargement du questionnaire:', error);
        }
      };
      fetchQuestionnaire();
    }
  }, [id]);
  
  const handleOpenLinkEditor = (elementId, linkIndex) => {
    if (!id) {
      alert('Veuillez d\'abord sauvegarder le questionnaire avant d\'ajouter des liens');
      return;
    }
    
    setCurrentEditingElement({
      elementId,
      linkIndex: typeof linkIndex === 'undefined' ? undefined : linkIndex
    });
    setShowLinkEditor(true);
  };

  const handleSaveLink = async (elementId, content, linkIndex, title) => {
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
  };

  const handleDeleteLink = async (elementId, linkIndex) => {
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
  };

  const updateQuestionnaire = useCallback((field, value) => {
    setQuestionnaire(prev => ({ ...prev, [field]: value }));
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
        const response = await axios.post('/api/images/upload-image', formData, {
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
      const response = await axios.post('/api/images/upload-image', formData, {
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
            current = current[path[i]];
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

  const handleDeleteLinkConfirm = async () => {
    if (linkToDelete) {
      await handleDeleteLink(linkToDelete.elementId, linkToDelete.index);
      setLinkToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

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
        <QuestionCard>
          <QuestionHeader depth={depth}>
            <button
              className="mr-2 p-1 rounded-full hover:bg-opacity-20 hover:bg-gray-500"
              onClick={() => toggleQuestion(path)}
              style={{ color: medicalColors.primary.main }}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* ============ NOUVEAU: Drag handle séparé ============ */}
            <DragHandle className="drag-handle">
              <GripVertical size={16} />
            </DragHandle>

            <input 
              className="flex-grow p-2 border-b border-transparent focus:outline-none bg-transparent"
              style={{
                borderBottomColor: 'transparent',
                color: medicalColors.neutral.charcoal
              }}
              onFocus={(e) => e.target.style.borderBottomColor = medicalColors.primary.main}
              onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
              type="text" 
              value={question.text || ''} 
              onChange={(e) => updateQuestion(path, 'text', e.target.value)}
              placeholder="Texte de la question"
            />

            {depth === 1 && (
              <div className="flex items-center ml-4">
                <input
                  type="checkbox"
                  checked={question.isImportantToCheck || false}
                  onChange={(e) => updateQuestion(path, 'isImportantToCheck', e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  style={{ accentColor: medicalColors.primary.main }}
                />
                <span className="ml-2 text-sm" style={{ color: medicalColors.neutral.darkGray }}>
                  Important ?
                </span>
              </div>
            )}

            {depth === 1 && (
              <div className="flex items-center mx-2 gap-2">
                <label className="text-sm mr-2" style={{ color: medicalColors.neutral.darkGray }}>Page:</label>
                <input
                  type="number"
                  min="1"
                  value={question.page || 1}
                  onChange={(e) => updateQuestion(path, 'page', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 p-1 text-sm border rounded"
                  style={{
                    borderColor: medicalColors.forms.input.border,
                    backgroundColor: medicalColors.forms.input.bg
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
                  placeholder={`Page ${question.page || 1}`}
                  className="w-48 p-1 text-sm border rounded"
                  style={{
                    borderColor: medicalColors.forms.input.border,
                    backgroundColor: medicalColors.forms.input.bg
                  }}
                />
              </div>
            )}
            <div className="flex items-center">
              <ImageUpload
                onImageUpload={handleImageUpload}
                currentImage={question.image?.src}
                id={questionId}
                onAddCaption={handleAddCaption}
                caption={question.image?.caption}
                questionnaireTitle={questionnaire.title}
              />
              <div className="flex items-center gap-2 ml-auto">
                {links.map((link, index) => (
                  <div key={index} className="flex items-center">
                    <button
                      className="px-3 py-1 rounded flex items-center"
                      style={{
                        color: medicalColors.primary.main,
                        backgroundColor: medicalColors.primary.subtle
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.cards.hover}
                      onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.primary.subtle}
                      onClick={() => handleOpenLinkEditor(questionId, index)}
                      title={`Éditer la fiche ${index + 1}`}
                    >
                      {link.title || `Fiche ${index + 1}`}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLinkToDelete({ elementId: questionId, index });
                          setShowDeleteConfirm(true);
                        }}
                        className="ml-2"
                        style={{ color: medicalColors.status.error }}
                        title="Supprimer la fiche"
                      >
                        <Trash2 size={14} />
                      </button>
                    </button>
                  </div>
                ))}
                <button
                  className={`ml-2 p-1 rounded-full ${!id ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{
                    color: medicalColors.primary.main,
                    backgroundColor: medicalColors.primary.subtle
                  }}
                  onMouseEnter={(e) => !e.target.disabled && (e.target.style.backgroundColor = medicalColors.cards.hover)}
                  onMouseLeave={(e) => !e.target.disabled && (e.target.style.backgroundColor = medicalColors.primary.subtle)}
                  onClick={() => handleOpenLinkEditor(questionId)}
                  title={!id ? "Sauvegardez d'abord le questionnaire" : "Ajouter une nouvelle fiche"}
                  disabled={!id}
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                className="ml-2 p-1 rounded-full"
                style={{
                  color: medicalColors.primary.main,
                  backgroundColor: medicalColors.primary.subtle
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.cards.hover}
                onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.primary.subtle}
                onClick={() => {
                  const duplicated = duplicateQuestion(question);
                  addQuestion(path.slice(0, -1), duplicated);
                }}
                title="Dupliquer la question"
              >
                <Copy size={16} />
              </button>
              <button
                className="ml-2 p-1 rounded-full"
                style={{
                  color: medicalColors.status.error,
                  backgroundColor: medicalColors.accent.subtle
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.cards.hover}
                onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.accent.subtle}
                onClick={() => deleteQuestion(path)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </QuestionHeader>
          {isExpanded && (
            <QuestionContent depth={depth}>
              <StyledSelect
                value={question.type || 'single'}
                onChange={(e) => updateQuestion(path, 'type', e.target.value)}
              >
                <option value="single">Choix unique</option>
                <option value="multiple">Choix multiple</option>
                <option value="text">Texte libre</option>
                <option value="number">Numérique</option>
                <option value="imageMap">Image interactive</option>
              </StyledSelect>

              {question.type !== 'imageMap' && (
                <div className="flex items-center mb-4">
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    currentImage={question.image?.src}
                    id={questionId}
                    onAddCaption={handleAddCaption}
                    caption={question.image?.caption}
                    questionnaireTitle={questionnaire.title}
                  />
                </div>
              )}

              {question.type === 'imageMap' && (
                <div className="mt-4">
                  {!question.questionImage?.src ? (
                    <div className="border-2 border-dashed rounded-lg p-6 text-center"
                         style={{ borderColor: medicalColors.neutral.gray }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleQuestionImageUpload(e, path)}
                        className="hidden"
                        id={`question-image-${questionId}`}
                      />
                      <label
                        htmlFor={`question-image-${questionId}`}
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Camera size={48} style={{ color: medicalColors.neutral.mediumGray }} className="mb-2" />
                        <span style={{ color: medicalColors.neutral.darkGray }}>
                          Cliquez pour ajouter l'image de la question
                        </span>
                      </label>
                    </div>
                  ) : (
                    <div>
                      <div className="relative">
                        <img 
                          src={question.questionImage.src} 
                          alt="Question" 
                          className="w-full rounded-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleQuestionImageUpload(e, path)}
                            className="hidden"
                            id={`question-image-change-${questionId}`}
                          />
                          <label
                            htmlFor={`question-image-change-${questionId}`}
                            className="cursor-pointer p-2 bg-white rounded-full shadow hover:bg-gray-100"
                          >
                            <Camera size={20} style={{ color: medicalColors.neutral.darkGray }} />
                          </label>
                        </div>
                      </div>
                      {console.log('Areas passées à ImageMapEditor:', question.questionImage.areas)}

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

              {['single', 'multiple'].includes(question.type) && (
                <div className="space-y-2">
                  {question.options && question.options.map((option, oIndex) => (
                    <OptionCard key={option.id || `${questionId}-option-${oIndex}`}>
                      <div className="flex items-center p-1 rounded">
                        <input
                          className="flex-grow p-1 bg-transparent border-b border-transparent focus:outline-none text-sm"
                          style={{
                            borderBottomColor: 'transparent',
                            color: medicalColors.neutral.charcoal
                          }}
                          onFocus={(e) => e.target.style.borderBottomColor = medicalColors.primary.main}
                          onBlur={(e) => e.target.style.borderBottomColor = 'transparent'}
                          type="text"
                          value={option.text || ''}
                          onChange={(e) => updateQuestion([...path, 'options', oIndex], 'text', e.target.value)}
                          placeholder="Texte de l'option"
                        />
                        <ImageUpload
                          onImageUpload={handleImageUpload}
                          currentImage={option.image?.src}
                          id={`${questionId}-options-${oIndex}`}
                          onAddCaption={handleAddCaption}
                          caption={option.image?.caption}
                          questionnaireTitle={questionnaire.title}
                        />
                        <div className="flex">
                          {(questionLinks[`${questionId}-options-${oIndex}`] || []).map((link, index) => (
                            <button
                              key={index}
                              className="ml-2 px-3 py-1 rounded flex items-center"
                              style={{
                                color: medicalColors.primary.main,
                                backgroundColor: medicalColors.primary.subtle
                              }}
                              onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.cards.hover}
                              onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.primary.subtle}
                              onClick={() => handleOpenLinkEditor(`${questionId}-options-${oIndex}`, index)}
                              title={`Éditer la fiche ${index + 1}`}
                            >
                              {link.title || `Fiche ${index + 1}`}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLinkToDelete({ elementId: `${questionId}-options-${oIndex}`, index });
                                  setShowDeleteConfirm(true);
                                }}
                                className="ml-2"
                                style={{ color: medicalColors.status.error }}
                                title="Supprimer la fiche"
                              >
                                <Trash2 size={14} />
                              </button>
                            </button>
                          ))}
                          <button
                            className="ml-2 p-1 rounded-full"
                            style={{
                              color: medicalColors.primary.main,
                              backgroundColor: medicalColors.primary.subtle
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.cards.hover}
                            onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.primary.subtle}
                            onClick={() => handleOpenLinkEditor(`${questionId}-options-${oIndex}`)}
                            title="Ajouter une nouvelle fiche"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          className="ml-1 p-1 rounded-full"
                          style={{
                            color: medicalColors.status.error,
                            backgroundColor: medicalColors.accent.subtle
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.cards.hover}
                          onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.accent.subtle}
                          onClick={() => deleteOption([...path, 'options', oIndex])}
                        >
                          <Trash2 size={14} />
                        </button>
                        <button 
                          className="ml-1 p-1 rounded-full"
                          style={{
                            color: medicalColors.primary.main,
                            backgroundColor: medicalColors.primary.subtle
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.cards.hover}
                          onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.primary.subtle}
                          onClick={() => addQuestion([...path, 'options', oIndex, 'subQuestions'])}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      {option.subQuestions && option.subQuestions.map((subQuestion, sqIndex) => (
                        <SubQuestionWrapper key={subQuestion.id || `${questionId}-option-${oIndex}-subquestion-${sqIndex}`} depth={depth + 1}>
                          {renderQuestion(subQuestion, [...path, 'options', oIndex, 'subQuestions', sqIndex])}
                        </SubQuestionWrapper>
                      ))}
                    </OptionCard>
                  ))}
                  <button 
                    className="w-full p-2 mt-2 text-white rounded transition-colors text-sm"
                    style={{
                      backgroundColor: medicalColors.buttons.primary.bg,
                      border: 'none',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.buttons.primary.hover}
                    onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.buttons.primary.bg}
                    onClick={() => addOption(path)}
                  >
                    <Plus size={14} className="inline mr-1" /> Ajouter une option
                  </button>
                </div>
              )}
            </QuestionContent>
          )}
        </QuestionCard>
      </DraggableQuestion>
    );
  }, [expandedQuestions, moveQuestion, toggleQuestion, updateQuestion, handleImageUpload, duplicateQuestion, addQuestion, deleteQuestion, deleteOption, addOption, questionnaire.title, handleOpenLinkEditor]);

  console.log('questionLinks dans Creator:', questionLinks);
  console.log('id dans Creator:', id);

  return (
    <CreatorWrapper>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <CreatorCard>
            <input 
              className="w-full p-2 text-xl border-b-2 focus:outline-none mb-6"
              style={{
                borderBottomColor: medicalColors.primary.main,
                backgroundColor: 'transparent',
                color: medicalColors.neutral.charcoal
              }}
              onFocus={(e) => e.target.style.borderBottomColor = medicalColors.primary.dark}
              onBlur={(e) => e.target.style.borderBottomColor = medicalColors.primary.main}
              type="text" 
              value={questionnaire.title} 
              onChange={(e) => updateQuestionnaire('title', e.target.value)}
              placeholder="Titre du questionnaire" 
            />
            <DndProvider backend={HTML5Backend}>
              {questionnaire.questions.map((question, index) => renderQuestion(question, [index]))}
            </DndProvider>
            <div className="flex justify-between mt-6">
              <button 
                className="text-white py-2 px-4 rounded transition-colors text-sm"
                style={{
                  backgroundColor: medicalColors.buttons.primary.bg,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.buttons.primary.hover}
                onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.buttons.primary.bg}
                onClick={() => addQuestion()}
              >
                <Plus size={14} className="inline mr-1" /> Ajouter une question
              </button>
              
              <button 
                className="text-white py-2 px-4 rounded transition-colors text-sm"
                style={{
                  backgroundColor: medicalColors.buttons.success.bg,
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.buttons.success.hover}
                onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.buttons.success.bg}
                onClick={handleSave}
              >
                Sauvegarder le questionnaire
              </button>
            </div>
            
          </CreatorCard>
        </div>
        
        <div className="lg:w-2/4">
          <CreatorCard>
            <h3 className="text-xl font-semibold mb-4" style={{ color: medicalColors.primary.main }}>
              Aperçu du questionnaire
            </h3>
            <div className="p-4 rounded-md" style={{ backgroundColor: medicalColors.neutral.lightGray, opacity: 0.9 }}>
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
                          [...(prev.selectedOptions[questionId] || [])].filter(i => i !== optionIndex) :
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
          </CreatorCard>
        </div>
      </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm" style={{ backgroundColor: medicalColors.cards.background }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: medicalColors.neutral.charcoal }}>
              Confirmation
            </h3>
            <p className="mb-4" style={{ color: medicalColors.neutral.darkGray }}>
              Êtes-vous sûr de vouloir supprimer ce lien ?
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 rounded transition-colors"
                style={{
                  backgroundColor: medicalColors.neutral.gray,
                  color: medicalColors.neutral.charcoal,
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.neutral.mediumGray}
                onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.neutral.gray}
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setLinkToDelete(null);
                }}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 text-white rounded transition-colors"
                style={{
                  backgroundColor: medicalColors.buttons.danger.bg,
                  border: 'none',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = medicalColors.buttons.danger.hover}
                onMouseLeave={(e) => e.target.style.backgroundColor = medicalColors.buttons.danger.bg}
                onClick={handleDeleteLinkConfirm}
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </CreatorWrapper>
  );
}

export default QuestionnaireCreator;