import { control } from './shared/designSystem';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, EyeOff, Eye, ChevronDown, ChevronUp, Plus, Italic } from 'lucide-react';

// ==================== STYLED COMPONENTS AVEC SUPPORT MODE SOMBRE ====================

const ImagePreviewWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  background-color: ${props => props.theme.card || 'white'};
  border: 1px solid ${props => props.theme.border || '#ccc'};
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 10px ${props => props.theme.shadow || 'rgba(0,0,0,0.1)'};
`;

const FormatButton = styled.button`
  padding: 0.5rem;
  margin-right: 0.25rem;
  border: 1px solid ${props => props.theme.border || '#e0e6ed'};
  background-color: ${props => props.theme.card || '#ffffff'};
  color: ${props => props.theme.text || '#424242'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.theme.backgroundSecondary || props.theme.hover || '#f3f4f6'};
  }
`;

const PreviewWrapper = styled.div`
  width: 100%;
  min-width: 0;
  max-width: 100%;
`;

// Boutons de navigation des pages avec support mode sombre
const PageNavigationButton = styled.button`
  ${control}
  background: ${props => props.isActive ? props.theme.primary : props.theme.card};
  border-color: ${props => props.isActive ? props.theme.primary : props.theme.border};
  color: ${props => props.isActive ? props.theme.buttonText : props.theme.textSecondary};
  &:hover:not(:disabled) {
    background: ${props => props.isActive ? props.theme.primaryHover : props.theme.hover};
    color: ${props => props.isActive ? props.theme.buttonText : props.theme.text};
  }
`;

const PageTitleInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.border || '#d1d5db'};
  border-radius: 4px;
  background-color: ${props => props.theme.card || 'white'};
  color: ${props => props.theme.text || '#000'};
  box-shadow: 0 4px 12px ${props => props.theme.shadow || 'rgba(0,0,0,0.1)'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary || '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.theme.primary || '#3b82f6'}20;
  }
`;

// Input de texte libre avec styles adaptatifs
const FreeTextInput = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border || '#d1d5db'};
  border-radius: 8px;
  min-height: 100px;
  background-color: ${props => props.theme.card || 'white'};
  color: ${props => props.theme.text || '#000'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary || '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.theme.primary || '#3b82f6'}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary || '#6b7280'};
  }
`;

// Input numérique avec styles adaptatifs
const NumberInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border || '#d1d5db'};
  border-radius: 8px;
  background-color: ${props => props.theme.card || 'white'};
  color: ${props => props.theme.text || '#000'};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary || '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => props.theme.primary || '#3b82f6'}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary || '#6b7280'};
  }
`;

// ==================== COMPOSANTS VISUELS CORRIGÉS ====================

// Card principale d'une question - Style médical moderne avec support mode sombre
const ModernQuestionCard = styled.div`
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 10px;
  margin-bottom: 0.85rem;
  overflow: hidden;
`;

// Header d'une question - Style professionnel avec support mode sombre
const ModernQuestionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  min-height: 42px;
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.4;
  color: ${props => props.theme.text};
  background: ${props => props.depth % 2 ? props.theme.cardSecondary : props.theme.card};
  border-bottom: 1px solid ${props => props.theme.borderLight};
  svg { width: 15px; height: 15px; }
  button { display: inline-flex; align-items: center; justify-content: center; color: inherit; }
  @media (pointer: coarse) { min-height: 44px; }
`;

// Contenu de la question avec support mode sombre
const ModernQuestionContent = styled.div`
  padding: 0.75rem;
  background: ${props => props.theme.card};
`;

// Options avec style médical clair - CORRIGÉ POUR MODE SOMBRE !
const ModernOptionCard = styled.label`
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-height: 38px;
  padding: 0.4rem 0.65rem;
  margin-bottom: 0.4rem;
  border: 1px solid ${props => props.checked ? props.theme.primary : props.theme.border};
  border-radius: 7px;
  background: ${props => props.checked ? props.theme.primary + '0a' : props.theme.card};
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 0.85rem;
  line-height: 1.45;
  transition: border-color 150ms ease, background-color 150ms ease;
  &:hover { border-color: ${props => props.theme.primary}; background: ${props => props.theme.hover}; }
  &:focus-within { outline: 2px solid ${props => props.theme.primary}; outline-offset: 2px; }
  input[type='radio'], input[type='checkbox'] {
    width: 14px;
    height: 14px;
    min-width: 14px;
    min-height: 14px;
    margin: 0;
    padding: 0;
    appearance: auto;
    border: initial;
    border-radius: initial;
    background: initial;
    box-shadow: none;
    flex-shrink: 0;
    accent-color: ${props => props.theme.primary};
    transform: none;
  }
  .option-text {
    flex: 1;
    min-width: 0;
    overflow-wrap: anywhere;
    font-weight: ${props => props.checked ? '500' : '400'};
  }
  .option-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-left: auto;
    padding-left: 0.35rem;
    max-width: 55%;
    svg { width: 15px; height: 15px; }
    label { gap: 0.35rem; }
    label span { font-size: 0.7rem; color: ${props => props.theme.textSecondary}; }
  }
  @media (pointer: coarse) { min-height: 44px; }
`;

// Conteneur pour les champs CR avec support mode sombre
const CRFieldContainer = styled.div`
  margin-top: 0.75rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.backgroundSecondary || props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
`;

const ImageMapContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 1rem 0;
  
  img, svg {
    width: 100%;
    height: auto;
    display: block;
  }
  
  svg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const LinkButton = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  color: ${props => props.theme.primary || "#3b82f6"};
  background-color: ${props => props.theme.primary ? 
    `${props.theme.primary}15` : "#eff6ff"};
  border-radius: 0.375rem;
  border: 1px solid ${props => props.theme.primary ? 
    `${props.theme.primary}30` : "#bfdbfe"};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.theme.primary ? 
      `${props.theme.primary}25` : "#dbeafe"};
    border-color: ${props => props.theme.primary || "#3b82f6"};
  }
`;

// ==================== FONCTIONS UTILITAIRES ====================

const getColorValues = (color) => {
  const colors = {
    blue: '0, 123, 255',
    red: '255, 0, 0',
    green: '0, 255, 0',
    yellow: '255, 255, 0'
  };
  return colors[color] || colors.blue;
};

const createPathFromPoints = (points) => {
  if (!points || points.length < 2) return '';
  return (
    points
      .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z'
  );
};

// ==================== COMPOSANTS UTILITAIRES ====================

const ImagePreview = ({ image, alt, position }) => (
  <ImagePreviewWrapper style={{ left: `${position.x}px`, top: `${position.y}px` }}>
    <img 
      src={image.src} 
      alt={alt} 
      style={{ 
        maxWidth: '400px', 
        maxHeight: '400px', 
        width: 'auto', 
        height: 'auto', 
        objectFit: 'contain' 
      }} 
    />
    <p className="mt-1 text-xs text-gray-600">
      {image.caption || 'Pas de légende'}
    </p>
  </ImagePreviewWrapper>
);

const TextFormatButtons = ({ onBold, onUnderline, onItalic, onSize, onCenter }) => (
  <div className="flex items-center gap-1 mb-2">
    <FormatButton onClick={onBold}>B</FormatButton>
    <FormatButton onClick={onUnderline}>U</FormatButton>
    <FormatButton onClick={onItalic}><Italic size={14} /></FormatButton>
    <FormatButton onClick={() => onSize('12px')}>Petit</FormatButton>
    <FormatButton onClick={() => onSize('16px')}>Moyen</FormatButton>
    <FormatButton onClick={() => onSize('20px')}>Grand</FormatButton>
    <FormatButton onClick={onCenter}>⧏⧐</FormatButton>
  </div>
);

// ==================== COMPOSANT PRINCIPAL ====================

const QuestionPreview = ({ 
  question, 
  path = [],
  depth = 0, 
  selectedOptions, 
  setSelectedOptions, 
  crTexts, 
  setCRTexts, 
  freeTexts,
  onFreeTextChange,
  showCRFields = false,
  onImageInsert,
  hiddenQuestions,
  toggleQuestionVisibility,
  imageCaptions,
  showAddButton = true,
  questionnaireLinks,
  questionnaireId,
  onOptionUpdate,
  handleImageUpload,
  handleAddCaption,
  handleOpenLinkEditor,
  questionnaire
}) => {
  const navigate = useNavigate();
  const questionId = path.join('-');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showImage, setShowImage] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  if (!question || !question.id) return null;
  if (hiddenQuestions && hiddenQuestions[question.id] && !showCRFields) return null;

  const handleOptionChange = (optionIndex) => {
    if (typeof setSelectedOptions === 'function') {
      setSelectedOptions(question.id, optionIndex, question.type);
    }
  };

  const handleCRTextChange = (optionIndex, text) => {
    setCRTexts(prev => ({
      ...prev,
      [question.id]: {
        ...(prev[question.id] || {}),
        [optionIndex]: text
      }
    }));
  };

  const isOptionSelected = (optionIndex) => {
    if (!selectedOptions?.[question.id]) return false;
    return selectedOptions[question.id].includes(optionIndex);
  };

  const handleMouseEnter = (e, optionId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setImagePosition({
      x: rect.right + 10,
      y: rect.top
    });
    setShowImage(optionId);
  };

  const handleMouseLeave = () => {
    setShowImage(null);
  };

  return (
    <div className="question-preview" style={{ width: '100%', maxWidth: '100%' }}>
      <ModernQuestionCard>
        <ModernQuestionHeader depth={depth}>
          <span style={{ flexGrow: 1 }}>
            {question.text}
            {question.important && <span style={{ color: '#ef4444', marginLeft: '0.5rem' }}>*</span>}
          </span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {showCRFields && toggleQuestionVisibility && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleQuestionVisibility(question.id);
                }}
                style={{
                  padding: '0.25rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: hiddenQuestions[question.id] ? '#ef4444' : '#10b981'
                }}
              >
                {hiddenQuestions[question.id] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
            
            {question.image && (
              <div
                className="relative cursor-pointer"
                onMouseEnter={(e) => handleMouseEnter(e, questionId)}
                onMouseLeave={handleMouseLeave}
              >
                <Camera size={18} className="text-blue-500" />
              </div>
            )}
            
            <button
              aria-label={isExpanded ? `Replier ${question.text}` : `Déplier ${question.text}`}
              aria-expanded={isExpanded}
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                padding: '0.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </ModernQuestionHeader>

        {showImage === questionId && question.image && (
          <ImagePreview 
            image={question.image}
            alt="Question"
            position={imagePosition}
          />
        )}

        {isExpanded && (
          <ModernQuestionContent>
            {/* IMAGE MAP */}
            {question.type === 'imageMap' && question.questionImage && (
              <ImageMapContainer>
                <img 
                  src={question.questionImage.src} 
                  alt={question.questionImage.alt || "Image interactive"} 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    maxWidth: '600px'
                  }}
                />
                {question.questionImage.areas && (
                  <svg style={{ width: '100%', height: '100%' }}>
                    {question.questionImage.areas.map((area, areaIndex) => {
                      const isSelected = selectedOptions?.[question.id]?.includes(areaIndex);
                      
                      if (area.shape === 'circle') {
                        return (
                          <circle
                            key={areaIndex}
                            cx={area.coords[0]}
                            cy={area.coords[1]}
                            r={area.coords[2]}
                            fill={isSelected ? `rgba(${getColorValues(area.color || 'blue')}, 0.3)` : 'transparent'}
                            stroke={`rgb(${getColorValues(area.color || 'blue')})`}
                            strokeWidth="2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleOptionChange(areaIndex)}
                          />
                        );
                      } else if (area.shape === 'polygon' && area.points) {
                        return (
                          <path
                            key={areaIndex}
                            d={createPathFromPoints(area.points)}
                            fill={isSelected ? `rgba(${getColorValues(area.color || 'blue')}, 0.3)` : 'transparent'}
                            stroke={`rgb(${getColorValues(area.color || 'blue')})`}
                            strokeWidth="2"
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleOptionChange(areaIndex)}
                          />
                        );
                      }
                      return null;
                    })}
                  </svg>
                )}
              </ImageMapContainer>
            )}

            {/* OPTIONS AVEC STYLE MÉDICAL CLAIR */}
            {['single', 'multiple'].includes(question.type) && (
              <div className="space-y-2">
                {question.options?.map((option, optionIndex) => {
                  if (!option) return null;
                  const optionId = `${questionId}-options-${optionIndex}`;
                  const checked = isOptionSelected(optionIndex);

                  return (
                    <div key={option?.id || optionId}>
                      <ModernOptionCard
                        checked={checked}
                        onClick={(e) => {
                          e.preventDefault();
                          handleOptionChange(optionIndex);
                        }}
                      >
                        <input
                          type={question.type === 'single' ? 'radio' : 'checkbox'}
                          checked={checked}
                          onChange={(e) => handleOptionChange(optionIndex)}
                          name={`question-${question.id}`}
                          style={{ pointerEvents: "none" }}
                          onClick={e => e.stopPropagation()}
                        />
                        
                        <span className="option-text">{option.text}</span>
                        
                        <div className="option-actions">
                          {questionnaireLinks && questionnaireLinks[optionId]?.map((link, index) => (
                            <LinkButton
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/questionnaire/${questionnaireId}/link/${optionId}/${index}`);
                              }}
                            >
                              {link.title || `Fiche ${index + 1}`}
                            </LinkButton>
                          ))}

                          {option.image && (
                            <>
                              <div 
                                className="relative cursor-pointer"
                                onMouseEnter={(e) => handleMouseEnter(e, optionId)}
                                onMouseLeave={handleMouseLeave}
                              >
                                <Camera size={18} className="text-blue-500" />
                              </div>
                              {showAddButton && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onImageInsert(option.image);
                                  }}
                                  className="text-blue-500 hover:text-blue-600"
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                            </>
                          )}

                          <label className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={option.includeInConclusion || false}
                              onChange={(e) => {
                                if (typeof onOptionUpdate === 'function') {
                                  onOptionUpdate([...path, 'options', optionIndex], {
                                    ...option,
                                    includeInConclusion: e.target.checked
                                  });
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-gray-500">Conclusion</span>
                          </label>
                        </div>
                      </ModernOptionCard>

                      {showImage === optionId && option.image && (
                        <ImagePreview 
                          image={option.image}
                          alt="Option"
                          position={imagePosition}
                        />
                      )}

                      {showCRFields && isOptionSelected(optionIndex) && (
                        <CRFieldContainer>
                          <TextFormatButtons 
                            onBold={() => handleCRTextChange(optionIndex, `<strong>${crTexts[question.id]?.[optionIndex] || option.text}</strong>`)}
                            onUnderline={() => handleCRTextChange(optionIndex, `<u>${crTexts[question.id]?.[optionIndex] || option.text}</u>`)}
                            onItalic={() => handleCRTextChange(optionIndex, `<em>${crTexts[question.id]?.[optionIndex] || option.text}</em>`)}
                            onSize={(size) => handleCRTextChange(optionIndex, `<span style="font-size: ${size};">${crTexts[question.id]?.[optionIndex] || option.text}</span>`)}
                            onCenter={() => handleCRTextChange(optionIndex, `<div style="text-align: center;">${crTexts[question.id]?.[optionIndex] || option.text}</div>`)}
                          />
                          <FreeTextInput
                            value={crTexts[question.id]?.[optionIndex] || ''}
                            onChange={(e) => handleCRTextChange(optionIndex, e.target.value)}
                            placeholder="Texte du CR pour cette option"
                          />
                        </CRFieldContainer>
                      )}

                      {/* SOUS-QUESTIONS */}
                      {isOptionSelected(optionIndex) && option?.subQuestions?.map((subQuestion, sqIndex) => (
                        <div 
                          key={subQuestion?.id || `${optionId}-sub-${sqIndex}`} 
                          className="mt-3 overflow-hidden" 
                          style={{ 
                            marginLeft: '1.5rem',
                            width: '100%',
                            borderLeft: '3px solid #e5e7eb',
                            paddingLeft: '1rem',
                            maxWidth: 'calc(100% - 2.5rem)'
                          }}
                        >
                          <QuestionPreview
                            question={subQuestion}
                            path={[...path, 'options', optionIndex, 'subQuestions', sqIndex]}
                            depth={depth + 1}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            crTexts={crTexts}
                            setCRTexts={setCRTexts}
                            freeTexts={freeTexts}
                            onFreeTextChange={onFreeTextChange}
                            showCRFields={showCRFields}
                            onImageInsert={onImageInsert}
                            hiddenQuestions={hiddenQuestions}
                            toggleQuestionVisibility={toggleQuestionVisibility}
                            imageCaptions={imageCaptions}
                            showAddButton={showAddButton}
                            questionnaireLinks={questionnaireLinks}
                            questionnaireId={questionnaireId}
                            onOptionUpdate={onOptionUpdate}
                            handleImageUpload={handleImageUpload}
                            handleAddCaption={handleAddCaption}
                            handleOpenLinkEditor={handleOpenLinkEditor}
                            questionnaire={questionnaire}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}

            {/* CHAMP TEXTE LIBRE */}
            {question.type === 'text' && (
              <FreeTextInput
                value={freeTexts?.[question.id] || ''}
                onChange={(e) => onFreeTextChange(question.id, e.target.value)}
                placeholder="Votre réponse..."
              />
            )}

            {/* CHAMPS POUR LA TECHNIQUE */}
            {question.text === 'TECHNIQUE' && question.options && (
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedOptions?.[question.id]?.includes(index) || false}
                        onChange={() => handleOptionChange(index)}
                        className="mr-3 h-4 w-4"
                      />
                      <span>{option.text}</span>
                    </div>
                    
                    {showCRFields && selectedOptions?.[question.id]?.includes(index) && (
                      <CRFieldContainer>
                        <FreeTextInput
                          value={crTexts[question.id]?.[index] || ''}
                          onChange={(e) => handleCRTextChange(index, e.target.value)}
                          placeholder="Texte du CR pour cette option"
                        />
                      </CRFieldContainer>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* CHAMP NUMÉRIQUE */}
            {question.type === 'number' && (
              <NumberInput
                type="number"
                value={freeTexts?.[question.id] || ''}
                onChange={(e) => onFreeTextChange(question.id, e.target.value)}
                placeholder="Votre réponse..."
              />
            )}
          </ModernQuestionContent>
        )}
      </ModernQuestionCard>
    </div>
  );
};

// ==================== COMPOSANT PRINCIPAL QUESTIONNAIRE ====================

const QuestionnairePreview = ({ 
  questions,
  selectedOptions,
  setSelectedOptions,
  crTexts,
  setCRTexts,
  freeTexts,
  onFreeTextChange,
  showCRFields = false,
  onImageInsert,
  hiddenQuestions,
  toggleQuestionVisibility,
  imageCaptions,
  showAddButton = true,
  questionnaireLinks,
  questionnaireId,
  onOptionUpdate,
  handleImageUpload,
  handleAddCaption,
  handleOpenLinkEditor,
  questionnaire,
  setQuestionnaire 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPageTitle, setEditingPageTitle] = useState(null);

  if (!Array.isArray(questions)) return null;

  const currentQuestions = questions.filter(q => (q.page || 1) === currentPage);
  const maxPage = Math.max(...questions.map(q => q.page || 1), 1);

  return (
    <PreviewWrapper>
      {/* NAVIGATION PAGES */}
      <div className="flex justify-start gap-2 mb-6">
        {[...Array(maxPage)].map((_, idx) => (
          <div key={idx} className="relative">
            <PageNavigationButton
              isActive={currentPage === idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              onDoubleClick={() => setEditingPageTitle(idx + 1)}
            >
              {questionnaire?.pageTitles?.[idx + 1] || `Page ${idx + 1}`}
            </PageNavigationButton>
            {editingPageTitle === idx + 1 && setQuestionnaire && (
              <div className="absolute z-10 top-full left-0 mt-1 w-48">
                <PageTitleInput
                  type="text"
                  value={questionnaire?.pageTitles?.[idx + 1] || `Page ${idx + 1}`}
                  onChange={(e) => {
                    setQuestionnaire(prev => ({
                      ...prev,
                      pageTitles: {
                        ...prev.pageTitles,
                        [idx + 1]: e.target.value
                      }
                    }));
                  }}
                  onBlur={() => setEditingPageTitle(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      setEditingPageTitle(null);
                    }
                  }}
                  autoFocus
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* QUESTIONS DE LA PAGE COURANTE */}
      <div className="space-y-4">
        {currentQuestions.map((question, index) => (
          <QuestionPreview
            key={question?.id || index}
            question={question}
            path={[questions.findIndex(q => q.id === question.id)]}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            crTexts={crTexts}
            setCRTexts={setCRTexts}
            freeTexts={freeTexts}
            onFreeTextChange={onFreeTextChange}
            showCRFields={showCRFields}
            onImageInsert={onImageInsert}
            hiddenQuestions={hiddenQuestions}
            toggleQuestionVisibility={toggleQuestionVisibility}
            imageCaptions={imageCaptions}
            showAddButton={showAddButton}
            questionnaireLinks={questionnaireLinks}
            questionnaireId={questionnaireId}
            onOptionUpdate={onOptionUpdate}
            handleImageUpload={handleImageUpload}
            handleAddCaption={handleAddCaption}
            handleOpenLinkEditor={handleOpenLinkEditor}
            questionnaire={questionnaire}
          />
        ))}
      </div>
    </PreviewWrapper>
  );
};

export default QuestionnairePreview;
