import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, EyeOff, Eye, ChevronDown, ChevronUp, Plus, Italic } from 'lucide-react';
import styled from 'styled-components';

// Card d'une question
export const QuestionCard = styled.div`
  background: ${props => props.theme.backgroundSecondary || "#f7fafd"};
  border-radius: 16px;
  box-shadow: 0 1px 12px rgba(20, 50, 80, 0.08);
  border: 1px solid ${props => props.theme.border};
  margin-bottom: 1.5rem;
  padding: 1.5rem 1.2rem;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 24px rgba(20,50,80,0.11);
    border-color: ${props => props.theme.primary};
  }
`;

// Header d'une question
export const QuestionHeader = styled.div`
  font-weight: 600;
  font-size: 1.17rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;

// Options (radio/checkbox)
export const OptionCard = styled.label`
  display: flex;
  align-items: center;
  background: #fff;
  border: 1.5px solid ${props => props.checked ? props.theme.primary : "#e0e6ed"};
  border-radius: 12px;
  padding: 0.7rem 1.1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 1.08rem;
  box-shadow: ${props => props.checked ? "0 2px 6px #0066ff22" : "none"};
  transition: border 0.17s, box-shadow 0.17s;
  &:hover {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 3px 12px #0066ff11;
  }
  input {
    margin-right: 0.9rem;
    accent-color: ${props => props.theme.primary};
    transform: scale(1.2);
  }
`;

const ImagePreviewWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const FormatButton = styled.button`
  padding: 0.5rem;
  margin-right: 0.25rem;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  min-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f3f4f6;
  }
`;

const PreviewWrapper = styled.div`
  max-width: 100%;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const QuestionCard = styled.div`
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    margin-bottom: 0.5rem;
  }
`;

const ImageMapContainer = styled.div`
  position: relative;
  width: 100%;
  margin: 1rem 0;
  
  img, svg {
    width: 100%;
    height: auto;
    display: block; // Important pour éviter les espaces
  }
  
  svg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;
const getColorValues = (color) => {
  const colors = {
    blue: '0, 123, 255',
    red: '255, 0, 0',
    green: '0, 255, 0',
    yellow: '255, 255, 0'
  };
  return colors[color] || colors.blue;
};

const getBackgroundColor = (depth) => {
  const baseHue = 210;
  const saturation = 90;
  const baseLightness = 95;
  const decrement = 2;
  const lightness = Math.max(0, baseLightness - depth * decrement);
  return `hsl(${baseHue}, ${saturation}%, ${lightness}%)`;
};

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

const QuestionHeader = styled.div`
  background-color: ${({ depth }) => getBackgroundColor(depth)};
  padding: 1rem;
  border-radius: 8px 8px 0 0;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionContent = styled.div`
  padding: 1rem;
  padding-right: 0;
  background-color: white;
  border-radius: 0 0 8px 8px;
  border-right: ;
`;

const LinkButton = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  color: #3b82f6;
  background-color: #eff6ff;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background-color: #dbeafe;
  }
`;

const createPathFromPoints = (points) => {
  if (!points || points.length < 2) return '';
  return (
    points
      .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ') + ' Z'
  );
};

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
    return Array.isArray(selectedOptions[question.id])
      ? selectedOptions[question.id].includes(optionIndex)
      : selectedOptions[question.id][optionIndex];
  };

  const handleMouseEnter = (event, imageId) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setImagePosition({ x: rect.right + 10, y: rect.top });
    setShowImage(imageId);
  };

  const handleMouseLeave = () => {
    setShowImage(null);
  };

  return (
    <div className="mb- overflow-hidden">
      <div className="bg-white rounded-lg shadow border-l-2 border-blue-400" style={{ margin: 0, width: '100%' }}>
        <QuestionHeader depth={depth}>
          <div className="flex items-center flex-grow gap-2">
            {showCRFields && toggleQuestionVisibility && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleQuestionVisibility(question.id);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                {hiddenQuestions?.[question.id] ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
            <h3 className="text-base text-gray-700">{question.text}</h3>
            <div className="flex items-center gap-2 ml-auto">
              {questionnaireLinks && questionnaireLinks[questionId]?.map((link, index) => (
                <LinkButton
                  key={index}
                  onClick={() => navigate(`/questionnaire/${questionnaireId}/link/${questionId}/${index}`)}
                >
                  {link.title || `Fiche ${index + 1}`}
                </LinkButton>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {question.image && (
              <div className="flex items-center">
                <div 
                  className="relative cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(e, questionId)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Camera size={18} className="text-blue-500" />
                </div>
                {showAddButton && onImageInsert && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageInsert(question.image);
                    }}
                    className="ml-1 text-blue-500 hover:text-blue-600"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>
        </QuestionHeader>

        {showImage === questionId && question.image && (
          <ImagePreview 
            image={question.image}
            alt="Question"
            position={imagePosition}
          />
        )}

        {isExpanded && (
          <QuestionContent>
            {['single', 'multiple'].includes(question.type) && (
              <div className="space-y-3">
                {question.options?.map((option, optionIndex) => {
                  if (!option) return null;
                  const optionId = `${questionId}-options-${optionIndex}`;
                  const checked = isOptionSelected(optionIndex);

                  return (
                    <>
                      <OptionCard
                        key={option?.id || optionId}
                        checked={checked}
                        style={{ width: '100%' }}
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
                        <span>{option.text}</span>
                        <div className="flex items-center gap-2 ml-auto">
                          {questionnaireLinks && questionnaireLinks[optionId]?.map((link, index) => (
                            <LinkButton
                              key={index}
                              onClick={() => navigate(`/questionnaire/${questionnaireId}/link/${optionId}/${index}`)}
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
                          <label className="flex items-center gap-2">
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
                      </OptionCard>
                      {showImage === optionId && option.image && (
                        <ImagePreview 
                          image={option.image}
                          alt="Option"
                          position={imagePosition}
                        />
                      )}

                      {showCRFields && isOptionSelected(optionIndex) && (
                        <div className="mt-3">
                          <TextFormatButtons 
                            onBold={() => handleCRTextChange(optionIndex, `<strong>${crTexts[question.id]?.[optionIndex] || option.text}</strong>`)}
                            onUnderline={() => handleCRTextChange(optionIndex, `<u>${crTexts[question.id]?.[optionIndex] || option.text}</u>`)}
                            onItalic={() => handleCRTextChange(optionIndex, `<em>${crTexts[question.id]?.[optionIndex] || option.text}</em>`)}
                            onSize={(size) => handleCRTextChange(optionIndex, `<span style="font-size: ${size};">${crTexts[question.id]?.[optionIndex] || option.text}</span>`)}
                            onCenter={() => handleCRTextChange(optionIndex, `<div style="text-align: center;">${crTexts[question.id]?.[optionIndex] || option.text}</div>`)}
                          />
                          <textarea
                            value={crTexts[question.id]?.[optionIndex] || ''}
                            onChange={(e) => handleCRTextChange(optionIndex, e.target.value)}
                            placeholder="Texte du CR pour cette option"
                            className="w-full p-2 border rounded-md text-sm min-h-[100px]"
                          />
                        </div>
                      )}

                      {isOptionSelected(optionIndex) && option?.subQuestions?.map((subQuestion, sqIndex) => (
                        <div 
                          key={subQuestion?.id || `${optionId}-sub-${sqIndex}`} 
                          className="mt-3 overflow-hidden" 
                          style={{ 
                            marginLeft: '1rem',
                            width: '100%',
                            borderLeft: '2px solid #e5e7eb',
                            maxWidth: 'calc(100% - 1rem)'
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
                    </>
                  );
                })}
              </div>
            )}

              {question.type === 'text' && (
                <textarea
                  value={freeTexts?.[question.id] || ''}
                  onChange={(e) => onFreeTextChange(question.id, e.target.value)}
                  placeholder="Votre réponse..."
                  className="w-full p-3 border rounded-md min-h-[100px]"
                />
              )}
{question.type === 'imageMap' && question.questionImage && (
  <div>
<ImageMapContainer>
  <img 
    src={question.questionImage.src} 
    alt="Question"
    className="rounded-lg"
  />
  <svg
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'all'
    }}
  >
        {question.questionImage.areas?.map((area, index) => (
<path
  key={index}
  d={createPathFromPoints(area.points)}
  fill={selectedOptions[question.id]?.includes(index) 
    ? `rgba(${getColorValues(area.color || 'blue')}, 0.5)` 
    : `rgba(${getColorValues(area.color || 'blue')}, 0.2)`}
  stroke={`rgba(${getColorValues(area.color || 'blue')}, 0.5)`}
  strokeWidth="0.2"
  onClick={() => {
    setSelectedOptions(question.id, index, 'multiple');
              if (showCRFields && area.crText) {
                handleCRTextChange(index, area.crText);
              }
            }}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </svg>
    </ImageMapContainer>
    {showCRFields && (
      <div className="mt-4 space-y-4">
        {question.questionImage.areas?.map((area, index) => (
          <div key={index} className="p-4 bg-white rounded shadow">
            <h5 className="font-medium mb-2">Zone {index + 1} - {area.text}</h5>
            <textarea
              value={crTexts[question.id]?.[index] || ''}
              onChange={(e) => handleCRTextChange(index, e.target.value)}
              placeholder="Texte du CR pour cette option"
              className="w-full p-2 border rounded min-h-[100px]"
            />
          </div>
        ))}
      </div>
    )}
  </div>
)}

              {question.type === 'number' && (
                <input
                  type="number"
                  value={freeTexts?.[question.id] || ''}
                  onChange={(e) => onFreeTextChange(question.id, e.target.value)}
                  placeholder="Votre réponse..."
                  className="w-full p-3 border rounded-md"
                />
              )}
            </QuestionContent>
          )}
        </div>
      </div>
    );
};

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
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-start gap-2 mb-4">
        {[...Array(maxPage)].map((_, idx) => (
          <div key={idx} className="relative">
<button
  onClick={() => setCurrentPage(idx + 1)}
  onDoubleClick={() => setEditingPageTitle(idx + 1)}
  className={`
    px-4 py-2 rounded-md text-sm font-medium
    ${currentPage === idx + 1 
      ? 'bg-blue-500 text-white' 
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
    transition-colors duration-200
  `}
>
  {questionnaire?.pageTitles?.[idx + 1] || `Page ${idx + 1}`}
</button>
{editingPageTitle === idx + 1 && setQuestionnaire && (
  <div className="absolute z-10 top-full left-0 mt-1 w-48">
    <input
      type="text"
      className="w-full px-2 py-1 border rounded shadow-lg"
      value={questionnaire?.pageTitles?.[idx + 1] || `Page ${idx + 1}`}
      onChange={(e) => {
        if (!questionnaire) return;
        const newPageTitles = new Map(questionnaire.pageTitles || new Map());
        newPageTitles.set(idx + 1, e.target.value);
        setQuestionnaire(prev => ({
          ...prev,
          pageTitles: newPageTitles
        }));
      }}
      onBlur={() => setEditingPageTitle(null)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
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

      <div className="space-y-4">
        {currentQuestions.map((question, index) => (
          <QuestionPreview
            key={question?.id || `question-${index}`}
            question={question}
            path={[questions.indexOf(question)]}
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
    </div>
  );
};

export default QuestionnairePreview;