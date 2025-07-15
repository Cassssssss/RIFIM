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
import { PrimaryButton, SecondaryButton, TertiaryButton, DangerButton, IconButton, ButtonGroup } from '../MedicalButton';

// Styled components MIS À JOUR avec les nouvelles couleurs médicales
const CreatorWrapper = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: ${props => props.theme.spacing.xl};
  border-radius: 8px;
`;

const CreatorCard = styled.div`
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};
  box-shadow: 0 2px 4px ${props => props.theme.shadow};
`;

const QuestionCard = styled.div`
  background-color: ${props => props.theme.cardSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  margin-bottom: ${props => props.theme.spacing.md};
  box-shadow: 0 1px 3px ${props => props.theme.shadow};
`;

const QuestionHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  border-bottom: 1px solid ${props => props.theme.border};
  background-color: ${props => props.depth === 0 ? props.theme.primary + '15' : props.theme.questionBackgroundAlt};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const QuestionContent = styled.div`
  padding: ${props => props.theme.spacing.md};
  background-color: ${props => props.depth % 2 === 0 ? props.theme.questionBackground : props.theme.questionBackgroundAlt};
`;

const OptionCard = styled.div`
  background-color: ${props => props.theme.optionBackground};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  margin-bottom: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.optionHover};
  }
`;

const SubQuestionWrapper = styled.div`
  margin-left: ${props => props.theme.spacing.md};
  border-left: 2px solid ${props => props.theme.primary};
  padding-left: ${props => props.theme.spacing.md};
  margin-top: ${props => props.theme.spacing.sm};
`;

const DraggableHandle = styled.div`
  color: ${props => props.theme.primary};
  cursor: move;
  padding: ${props => props.theme.spacing.xs};
  margin-right: ${props => props.theme.spacing.sm};
  
  &:hover {
    color: ${props => props.theme.secondary};
  }
`;

const Input = styled.input`
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.inputText};
  border: 1px solid ${props => props.theme.inputBorder};
  border-radius: 4px;
  padding: ${props => props.theme.spacing.sm};
  width: 100%;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.inputFocus};
    box-shadow: 0 0 0 2px ${props => props.theme.inputFocus}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.optionTextSecondary};
  }
`;

const Select = styled.select`
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.inputText};
  border: 1px solid ${props => props.theme.inputBorder};
  border-radius: 4px;
  padding: ${props => props.theme.spacing.sm};
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.inputFocus};
  }
`;

const TitleInput = styled.input`
  width: 100%;
  padding: ${props => props.theme.spacing.md};
  font-size: 1.25rem;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid ${props => props.theme.primary};
  background-color: transparent;
  color: ${props => props.theme.text};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  &:focus {
    outline: none;
    border-bottom-color: ${props => props.theme.secondary};
  }
  
  &::placeholder {
    color: ${props => props.theme.optionTextSecondary};
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${props => props.theme.spacing.lg};
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
`;

const SmallButton = styled.button`
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background-color: ${props => {
    if (props.variant === 'danger') return props.theme.buttonDanger;
    if (props.variant === 'secondary') return props.theme.buttonSecondary;
    return props.theme.buttonPrimary;
  }};
  color: ${props => props.theme.buttonText};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  
  &:hover {
    background-color: ${props => {
      if (props.variant === 'danger') return props.theme.buttonDangerHover;
      if (props.variant === 'secondary') return props.theme.buttonSecondaryHover;
      return props.theme.buttonPrimaryHover;
    }};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuestionnaireCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [questionnaire, setQuestionnaire] = useState({
    title: '',
    questions: [],
    selectedOptions: {},
    hiddenQuestions: {}
  });
  
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [linkEditor, setLinkEditor] = useState({ isOpen: false, elementId: null, linkIndex: null });
  const [questionLinks, setQuestionLinks] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  // Fonctions existantes (inchangées)
  const updateQuestionnaire = useCallback((field, value) => {
    setQuestionnaire(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateQuestion = useCallback((path, field, value) => {
    setQuestionnaire(prev => {
      const newQuestionnaire = { ...prev };
      const pathArray = Array.isArray(path) ? path : [path];
      
      let current = newQuestionnaire;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (key === 'questions' || key === 'options' || key === 'subQuestions') {
          current = current[key];
        } else if (typeof key === 'number') {
          current = current[key];
        }
      }
      
      const lastKey = pathArray[pathArray.length - 1];
      if (typeof lastKey === 'number') {
        current[lastKey] = { ...current[lastKey], [field]: value };
      } else {
        current[lastKey] = value;
      }
      
      return newQuestionnaire;
    });
  }, []);

  const addQuestion = useCallback((path = []) => {
    const newQuestion = {
      id: Date.now().toString(),
      text: '',
      type: 'single',
      options: [{ text: '', subQuestions: [] }],
      subQuestions: []
    };
    
    if (path.length === 0) {
      setQuestionnaire(prev => ({
        ...prev,
        questions: [...prev.questions, newQuestion]
      }));
    } else {
      setQuestionnaire(prev => {
        const newQuestionnaire = { ...prev };
        let current = newQuestionnaire;
        
        for (let i = 0; i < path.length; i++) {
          const key = path[i];
          if (key === 'questions' || key === 'options' || key === 'subQuestions') {
            current = current[key];
          } else if (typeof key === 'number') {
            current = current[key];
          }
        }
        
        current.push(newQuestion);
        return newQuestionnaire;
      });
    }
    
    setExpandedQuestions(prev => ({ ...prev, [newQuestion.id]: true }));
  }, []);

  const deleteQuestion = useCallback((path) => {
    setQuestionnaire(prev => {
      const newQuestionnaire = { ...prev };
      const pathArray = Array.isArray(path) ? path : [path];
      
      let current = newQuestionnaire;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (key === 'questions' || key === 'options' || key === 'subQuestions') {
          current = current[key];
        } else if (typeof key === 'number') {
          current = current[key];
        }
      }
      
      const lastKey = pathArray[pathArray.length - 1];
      if (typeof lastKey === 'number') {
        current.splice(lastKey, 1);
      }
      
      return newQuestionnaire;
    });
  }, []);

  const addOption = useCallback((path) => {
    const newOption = { text: '', subQuestions: [] };
    setQuestionnaire(prev => {
      const newQuestionnaire = { ...prev };
      let current = newQuestionnaire;
      
      for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (key === 'questions' || key === 'options' || key === 'subQuestions') {
          current = current[key];
        } else if (typeof key === 'number') {
          current = current[key];
        }
      }
      
      const lastKey = path[path.length - 1];
      current[lastKey].options.push(newOption);
      
      return newQuestionnaire;
    });
  }, []);

  const deleteOption = useCallback((path) => {
    setQuestionnaire(prev => {
      const newQuestionnaire = { ...prev };
      const pathArray = Array.isArray(path) ? path : [path];
      
      let current = newQuestionnaire;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (key === 'questions' || key === 'options' || key === 'subQuestions') {
          current = current[key];
        } else if (typeof key === 'number') {
          current = current[key];
        }
      }
      
      const lastKey = pathArray[pathArray.length - 1];
      if (typeof lastKey === 'number') {
        current.splice(lastKey, 1);
      }
      
      return newQuestionnaire;
    });
  }, []);

  const toggleQuestion = useCallback((questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  }, []);

  const duplicateQuestion = useCallback((path) => {
    setQuestionnaire(prev => {
      const newQuestionnaire = { ...prev };
      const pathArray = Array.isArray(path) ? path : [path];
      
      let current = newQuestionnaire;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        if (key === 'questions' || key === 'options' || key === 'subQuestions') {
          current = current[key];
        } else if (typeof key === 'number') {
          current = current[key];
        }
      }
      
      const lastKey = pathArray[pathArray.length - 1];
      const questionToDuplicate = current[lastKey];
      const duplicatedQuestion = {
        ...JSON.parse(JSON.stringify(questionToDuplicate)),
        id: Date.now().toString()
      };
      
      current.splice(lastKey + 1, 0, duplicatedQuestion);
      
      return newQuestionnaire;
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const questionnaireData = {
        ...questionnaire,
        questions: questionnaire.questions
      };
      
      if (id) {
        await axios.put(`/questionnaires/${id}`, questionnaireData);
      } else {
        await axios.post('/questionnaires', questionnaireData);
      }
      
      navigate('/questionnaires');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  }, [questionnaire, id, navigate]);

  const handleImageUpload = useCallback(async (file, elementId) => {
    // Fonction d'upload d'image (inchangée)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('questionnaireTitle', questionnaire.title);
    
    try {
      const response = await axios.post(`/questionnaires/${id}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      return response.data.location;
    } catch (error) {
      console.error('Erreur upload image:', error);
      throw error;
    }
  }, [questionnaire.title, id]);

  const handleOpenLinkEditor = useCallback((elementId, linkIndex = null) => {
    setLinkEditor({ isOpen: true, elementId, linkIndex });
  }, []);

  const handleAddCaption = useCallback((elementId, caption) => {
    // Fonction pour ajouter une légende (inchangée)
  }, []);

  const moveQuestion = useCallback((dragIndex, hoverIndex) => {
    setQuestionnaire(prev => {
      const newQuestions = [...prev.questions];
      const draggedQuestion = newQuestions[dragIndex];
      newQuestions.splice(dragIndex, 1);
      newQuestions.splice(hoverIndex, 0, draggedQuestion);
      return { ...prev, questions: newQuestions };
    });
  }, []);

  // Fonction pour charger le questionnaire existant
  useEffect(() => {
    if (id) {
      const fetchQuestionnaire = async () => {
        try {
          const response = await axios.get(`/questionnaires/${id}`);
          setQuestionnaire(response.data);
          setQuestionLinks(response.data.questionLinks || {});
        } catch (error) {
          console.error('Erreur lors du chargement:', error);
        }
      };
      fetchQuestionnaire();
    }
  }, [id]);

  const DraggableQuestion = ({ question, index, children }) => {
    const ref = useRef(null);
    
    const [, drop] = useDrop({
      accept: 'question',
      hover(item, monitor) {
        if (!ref.current) return;
        
        const dragIndex = item.index;
        const hoverIndex = index;
        
        if (dragIndex === hoverIndex) return;
        
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
        
        moveQuestion(dragIndex, hoverIndex);
        item.index = hoverIndex;
      },
    });
    
    const [{ isDragging }, drag] = useDrag({
      type: 'question',
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });
    
    const opacity = isDragging ? 0.5 : 1;
    drag(drop(ref));
    
    return (
      <div ref={ref} style={{ opacity }}>
        {children}
      </div>
    );
  };

  const renderQuestion = useCallback((question, path) => {
    if (!question) return null;
    
    const questionId = question.id;
    const depth = path.filter(p => p === 'subQuestions').length;
    const isExpanded = expandedQuestions[questionId] !== false;
    
    return (
      <DraggableQuestion key={questionId} question={question} index={path[0]}>
        <QuestionCard depth={depth}>
          <QuestionHeader depth={depth}>
            <DraggableHandle>
              <GripVertical size={16} />
            </DraggableHandle>
            
            <IconButton
              onClick={() => toggleQuestion(questionId)}
              style={{ marginRight: '8px' }}
            >
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </IconButton>
            
            <Input
              type="text"
              value={question.text || ''}
              onChange={(e) => updateQuestion(path, 'text', e.target.value)}
              placeholder="Texte de la question"
              style={{ marginRight: '8px' }}
            />
            
            <Select
              value={question.type || 'single'}
              onChange={(e) => updateQuestion(path, 'type', e.target.value)}
              style={{ marginRight: '8px', minWidth: '120px' }}
            >
              <option value="single">Choix unique</option>
              <option value="multiple">Choix multiple</option>
              <option value="text">Texte libre</option>
              <option value="numeric">Numérique</option>
              <option value="imageMap">Carte d'image</option>
            </Select>
            
            <IconButton
              onClick={() => duplicateQuestion(path)}
              style={{ marginRight: '4px' }}
            >
              <Copy size={14} />
            </IconButton>
            
            <IconButton
              onClick={() => deleteQuestion(path)}
              variant="danger"
            >
              <Trash2 size={14} />
            </IconButton>
          </QuestionHeader>
          
          {isExpanded && (
            <QuestionContent depth={depth}>
              {question.type === 'imageMap' && (
                <div style={{ marginBottom: '16px' }}>
                  <ImageMapEditor
                    image={question.questionImage}
                    areas={question.areas || []}
                    onAreasChange={(areas) => updateQuestion(path, 'areas', areas)}
                  />
                </div>
              )}
              
              {['single', 'multiple'].includes(question.type) && (
                <div>
                  {question.options && question.options.map((option, oIndex) => (
                    <OptionCard key={option.id || `${questionId}-option-${oIndex}`}>
                      <div style={{ display: 'flex', alignItems: 'center', padding: '4px', borderRadius: '4px' }}>
                        <Input
                          type="text"
                          value={option.text || ''}
                          onChange={(e) => updateQuestion([...path, 'options', oIndex], 'text', e.target.value)}
                          placeholder="Texte de l'option"
                          style={{ marginRight: '8px' }}
                        />
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {(questionLinks[`${questionId}-options-${oIndex}`] || []).map((link, index) => (
                            <SmallButton
                              key={index}
                              onClick={() => handleOpenLinkEditor(`${questionId}-options-${oIndex}`, index)}
                              variant="secondary"
                              title={`Éditer la fiche ${index + 1}`}
                            >
                              {link.title || `Fiche ${index + 1}`}
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLinkToDelete({ elementId: `${questionId}-options-${oIndex}`, index });
                                  setShowDeleteConfirm(true);
                                }}
                                variant="danger"
                                style={{ marginLeft: '4px', padding: '2px' }}
                              >
                                <Trash2 size={12} />
                              </IconButton>
                            </SmallButton>
                          ))}
                          
                          <IconButton
                            onClick={() => handleOpenLinkEditor(`${questionId}-options-${oIndex}`)}
                            title="Ajouter une nouvelle fiche"
                          >
                            <Plus size={14} />
                          </IconButton>
                          
                          <IconButton
                            onClick={() => deleteOption([...path, 'options', oIndex])}
                            variant="danger"
                          >
                            <Trash2 size={14} />
                          </IconButton>
                          
                          <IconButton
                            onClick={() => addQuestion([...path, 'options', oIndex, 'subQuestions'])}
                          >
                            <Plus size={14} />
                          </IconButton>
                        </div>
                      </div>
                      
                      {option.subQuestions && option.subQuestions.map((subQuestion, sqIndex) => (
                        <SubQuestionWrapper key={subQuestion.id || `${questionId}-option-${oIndex}-subquestion-${sqIndex}`} depth={depth + 1}>
                          {renderQuestion(subQuestion, [...path, 'options', oIndex, 'subQuestions', sqIndex])}
                        </SubQuestionWrapper>
                      ))}
                    </OptionCard>
                  ))}
                  
                  <PrimaryButton
                    onClick={() => addOption(path)}
                    size="small"
                    style={{ width: '100%', marginTop: '8px' }}
                  >
                    <Plus size={14} style={{ marginRight: '4px' }} />
                    Ajouter une option
                  </PrimaryButton>
                </div>
              )}
            </QuestionContent>
          )}
        </QuestionCard>
      </DraggableQuestion>
    );
  }, [expandedQuestions, moveQuestion, toggleQuestion, updateQuestion, handleImageUpload, duplicateQuestion, addQuestion, deleteQuestion, deleteOption, addOption, questionnaire.title, handleOpenLinkEditor, questionLinks]);

  return (
    <CreatorWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
          <div style={{ flex: '2', minWidth: '300px' }}>
            <CreatorCard>
              <TitleInput
                type="text"
                value={questionnaire.title}
                onChange={(e) => updateQuestionnaire('title', e.target.value)}
                placeholder="Titre du questionnaire"
              />
              
              <DndProvider backend={HTML5Backend}>
                {questionnaire.questions.map((question, index) => renderQuestion(question, [index]))}
              </DndProvider>
              
              <ActionButtonsContainer>
                <PrimaryButton onClick={() => addQuestion()}>
                  <Plus size={16} style={{ marginRight: '4px' }} />
                  Ajouter une question
                </PrimaryButton>
                
                <SecondaryButton onClick={handleSave}>
                  Sauvegarder le questionnaire
                </SecondaryButton>
              </ActionButtonsContainer>
            </CreatorCard>
          </div>
          
          <div style={{ flex: '1', minWidth: '300px' }}>
            <CreatorCard>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: 'var(--primary-color)' }}>
                Aperçu du questionnaire
              </h3>
              
              <div style={{ backgroundColor: 'var(--background-color)', padding: '16px', borderRadius: '8px', opacity: '0.9' }}>
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
                  questionnaire={questionnaire}
                  questionnaireLinks={questionLinks}
                  questionnaireId={id}
                />
              </div>
            </CreatorCard>
          </div>
        </div>
      </div>
      
      {linkEditor.isOpen && (
        <LinkEditor
          isOpen={linkEditor.isOpen}
          onClose={() => setLinkEditor({ isOpen: false, elementId: null, linkIndex: null })}
          elementId={linkEditor.elementId}
          linkIndex={linkEditor.linkIndex}
          questionnaireId={id}
          onSave={(elementId, linkData, linkIndex) => {
            setQuestionLinks(prev => {
              const newLinks = { ...prev };
              if (!newLinks[elementId]) {
                newLinks[elementId] = [];
              }
              if (linkIndex !== null) {
                newLinks[elementId][linkIndex] = linkData;
              } else {
                newLinks[elementId].push(linkData);
              }
              return newLinks;
            });
          }}
        />
      )}
    </CreatorWrapper>
  );
};

export default memo(QuestionnaireCreator);