import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Camera, EyeOff, Eye, ChevronDown, ChevronUp, Plus, Italic } from 'lucide-react';

const ImagePreviewWrapper = styled.div`
  position: fixed;
  z-index: 9999;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

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
    <p style={{ marginTop: '5px', fontSize: '12px' }}>
      {image.caption || 'Pas de légende'}
    </p>
  </ImagePreviewWrapper>
);

const FormatButton = styled.button`
  padding: 0.5rem;
  margin-right: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
  }
`;

const TextFormatButtons = ({ onBold, onUnderline, onItalic, onSize, onCenter }) => (
  <div className="flex space-x-2 mb-2">
    <FormatButton onClick={onBold}>B</FormatButton>
    <FormatButton onClick={onUnderline}>U</FormatButton>
    <FormatButton onClick={onItalic}><Italic size={16} /></FormatButton>
    <FormatButton onClick={() => onSize('12px')}>Petit</FormatButton>
    <FormatButton onClick={() => onSize('16px')}>Moyen</FormatButton>
    <FormatButton onClick={() => onSize('20px')}>Grand</FormatButton>
    <FormatButton onClick={onCenter}>⧏⧐</FormatButton>
  </div>
);

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
  onOptionUpdate
}) => {
  const navigate = useNavigate();
  const questionId = path.join('-');
  const [isExpanded, setIsExpanded] = useState(true);
  const [showImage, setShowImage] = useState(null);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const questionRef = useRef(null);

  if (!question || !question.id) return null;

  if (hiddenQuestions && hiddenQuestions[question.id] && !showCRFields) {
    return null;
  }

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
    if (!selectedOptions?.[question.id]) {
      return false;
    }
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
    <div className={`
      mb-4
      ${depth === 0 ? 'border-l-4 border-blue-500 dark:border-blue-700 pl-4' : 'ml-4 pl-2 border-l-2 border-gray-400 dark:border-gray-700'}
      bg-gray-100
      rounded-lg overflow-hidden
      transition-colors duration-200
    `} ref={questionRef}>
      <div className="flex items-center justify-between cursor-pointer p-2" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center">
          {showCRFields && typeof toggleQuestionVisibility === 'function' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleQuestionVisibility(question.id);
              }}
              className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {hiddenQuestions && hiddenQuestions[question.id] ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
          <div className="flex flex-col">
            <h3 className={`font-semibold ${depth === 0 ? 'text-lg' : 'text-md'} text-gray-900 dark:text-white transition-colors duration-200`}>
              {question.text || 'Question sans texte'}
            </h3>
            {questionnaireLinks && questionnaireLinks[questionId] && (
              <div className="flex flex-wrap gap-2 mt-2">
                {questionnaireLinks[questionId].map((link, index) => (
                  <div
                    key={index}
                    className="px-3 py-1 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded text-sm cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/questionnaire/${questionnaireId}/link/${questionId}/${index}`);
                    }}
                  >
                    {link.title || `Fiche ${index + 1}`}
                  </div>
                ))}
              </div>
            )}
          </div>
          {question.image && (
            <div className="flex items-center ml-2">
              <div 
                className="relative"
                onMouseEnter={(e) => handleMouseEnter(e, question.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Camera size={20} className="text-blue-500 cursor-pointer" />
              </div>
              {showAddButton && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageInsert(question.image);
                  }}
                  className="ml-1 p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100"
                  title="Ajouter l'image au CR"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
          )}
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {showImage === question.id && question.image && (
        <ImagePreview 
          image={question.image} 
          alt="Question" 
          position={imagePosition}
        />
      )}

      {isExpanded && (
        <div className="mt-2">
          {(question.type === 'single' || question.type === 'multiple') && Array.isArray(question.options) && (
            <ul className="space-y-1">
              {question.options.map((option, optionIndex) => {
                if (!option) return null;
                const optionId = `${questionId}-options-${optionIndex}`;
                return (
                  <li key={option?.id || `${question.id}-option-${optionIndex}`}>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <input
                          type={question.type === 'single' ? 'radio' : 'checkbox'}
                          checked={isOptionSelected(optionIndex)}
                          onChange={() => handleOptionChange(optionIndex)}
                          className="mr-2"
                        />
                        <div className="flex flex-col flex-grow">
                          <div className="flex items-center">
                            <span className="questionnaire-option text-gray-900 dark:text-white">
                              {option?.text || `Option ${optionIndex + 1}`}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                          <label className="flex items-center space-x-2 cursor-pointer">
  <input
    type="checkbox"
    className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
    checked={option.includeInConclusion || false}
    onChange={(e) => {
      if (typeof onOptionUpdate === 'function') {
        const updatedOption = {
          ...option,
          includeInConclusion: e.target.checked
        };
        onOptionUpdate([...path, 'options', optionIndex], updatedOption);
      }
    }}
  />
  <span className="text-xs text-gray-500">Conclusion ?</span>
</label>
                          </div>
                        </div>
                      </div>

                      {/* Image controls */}
                      {option.image && (
                        <div className="flex items-center ml-2">
                          <div 
                            className="relative"
                            onMouseEnter={(e) => handleMouseEnter(e, optionId)}
                            onMouseLeave={handleMouseLeave}
                          >
                            <Camera size={20} className="text-blue-500 cursor-pointer" />
                          </div>
                          {showAddButton && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onImageInsert(option.image);
                              }}
                              className="ml-1 p-1 text-blue-500 hover:text-blue-700 rounded-full hover:bg-blue-100"
                              title="Ajouter l'image au CR"
                            >
                              <Plus size={16} />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Show image preview */}
                      {showImage === optionId && option.image && (
                        <ImagePreview 
                          image={option.image} 
                          alt="Option" 
                          position={imagePosition}
                        />
                      )}

                      {/* CR text input for selected options */}
                      {showCRFields && isOptionSelected(optionIndex) && (
                        <>
                          <TextFormatButtons 
                            onBold={() => handleCRTextChange(optionIndex, `<strong>${option.text}</strong>`)}
                            onUnderline={() => handleCRTextChange(optionIndex, `<u>${option.text}</u>`)}
                            onItalic={() => handleCRTextChange(optionIndex, `<em>${option.text}</em>`)}
                            onSize={(size) => handleCRTextChange(optionIndex, `<span style="font-size: ${size};">${option.text}</span>`)}
                            onCenter={() => handleCRTextChange(optionIndex, `<div style="text-align: center;">${option.text}</div>`)}
                          />
                          <textarea
                            id={`cr-text-${question.id}-${optionIndex}`}
                            value={crTexts[question.id]?.[optionIndex] || ''}
                            onChange={(e) => handleCRTextChange(optionIndex, e.target.value)}
                            placeholder="Texte du CR pour cette option"
                            className="mt-1 w-full p-2 border rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </>
                      )}

                      {/* Sub-questions */}
                      {isOptionSelected(optionIndex) && Array.isArray(option?.subQuestions) && (
                        <div className="ml-6 mt-2">
                          {option.subQuestions.map((subQuestion, sqIndex) => (
                            <QuestionPreview
                              key={subQuestion?.id || `${question.id}-${optionIndex}-${sqIndex}`}
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
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {question.type === 'text' && (
            <textarea
              value={freeTexts?.[question.id] || ''}
              onChange={(e) => onFreeTextChange(question.id, e.target.value)}
              placeholder="Votre réponse..."
              className="mt-2 w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          )}
         {question.type === 'number' && (
            <input
              type="number"
              value={freeTexts?.[question.id] || ''}
              onChange={(e) => onFreeTextChange(question.id, e.target.value)}
              placeholder="Votre réponse..."
              className="mt-2 w-full p-2 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          )}
        </div>
      )}
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
  onOptionUpdate
}) => {
  if (!Array.isArray(questions)) return null;

  return (
    <div className="max-w-2xl mx-auto p-1">
      {questions.map((question, index) => (
        <QuestionPreview 
          key={question?.id || `question-${index}`}
          question={question}
          path={[index]}
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
        />
      ))}
    </div>
  );
};

export default QuestionnairePreview;