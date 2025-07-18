import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import QuestionnairePreview from './QuestionnairePreview';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { X } from 'lucide-react';
import set from 'lodash/set';
import styled from 'styled-components';

const ModernPageContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.background} 0%, ${props => props.theme.backgroundSecondary || props.theme.card} 100%);
  color: ${props => props.theme.text};
  min-height: calc(100vh - 60px);
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ModernCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 18px;
  box-shadow: 0 6px 32px ${props => props.theme.shadow};
  margin: 0 auto;
  padding: 2.5rem 2.5rem 2rem 2.5rem;
  max-width: 1400px;   // <--- augmente la largeur ici
  width: 95%;
  margin-top: 2rem;
  @media (max-width: 1200px) {
    padding: 1rem;
    max-width: 99vw;
  }
`;

const ModernTitle = styled.h1`
  font-size: 2.2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin: 1.5rem 0;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, ${props => props.theme.primary || '#3b82f6'}, ${props => props.theme.secondary || '#8b5cf6'});
  transition: width 0.3s ease;
  width: ${props => props.percentage}%;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.text || '#374151'};
  margin-bottom: 0.5rem;
`;

const QuestionnaireUsePage = () => {
  const { id } = useParams();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [crTexts, setCRTexts] = useState({});
  const [freeTexts, setFreeTexts] = useState({});
  const [insertedImages, setInsertedImages] = useState([]);
  const [copySuccess, setCopySuccess] = useState('');
  const [hiddenQuestions, setHiddenQuestions] = useState({});
  const [editableCR, setEditableCR] = useState('');
  const crRef = useRef(null);

  // Calcul du pourcentage de progression
  const progressPercentage = useMemo(() => {
    if (!questionnaire?.questions) return 0;
    
    // Fonction pour compter toutes les questions visibles (y compris sous-questions qui apparaissent)
    const countAllVisibleQuestions = (questions, parentAnswered = true) => {
      let count = 0;
      
      questions.forEach(question => {
        // Ne compter que si la question parent est répondue (pour les sous-questions)
        if (parentAnswered && ['single', 'multiple', 'text', 'number', 'imageMap'].includes(question.type)) {
          count++;
        }
        
        // Compter les sous-questions qui deviennent visibles quand une option est sélectionnée
        if (question.options && selectedOptions[question.id] && selectedOptions[question.id].length > 0) {
          const selectedIndices = selectedOptions[question.id] || [];
          selectedIndices.forEach(index => {
            const option = question.options[index];
            if (option?.subQuestions && option.subQuestions.length > 0) {
              count += countAllVisibleQuestions(option.subQuestions, true);
            }
          });
        }
      });
      
      return count;
    };

    // Fonction pour compter les questions répondues
    const countAnsweredQuestions = (questions) => {
      let answered = 0;
      
      questions.forEach(question => {
        // Une question est considérée comme répondue si elle a au moins une réponse
        const hasAnswer = 
          (selectedOptions[question.id] && selectedOptions[question.id].length > 0) ||
          (freeTexts[question.id] && freeTexts[question.id].trim() !== '');
        
        if (hasAnswer) {
          answered++;
        }
        
        // Compter récursivement les sous-questions répondues
        if (question.options && selectedOptions[question.id] && selectedOptions[question.id].length > 0) {
          const selectedIndices = selectedOptions[question.id] || [];
          selectedIndices.forEach(index => {
            const option = question.options[index];
            if (option?.subQuestions && option.subQuestions.length > 0) {
              answered += countAnsweredQuestions(option.subQuestions);
            }
          });
        }
      });
      
      return answered;
    };

    const totalQuestions = countAllVisibleQuestions(questionnaire.questions);
    const answeredQuestions = countAnsweredQuestions(questionnaire.questions);
    
    // Debug pour vérifier les calculs
    console.log('Total questions visibles:', totalQuestions);
    console.log('Questions répondues:', answeredQuestions);
    console.log('Pourcentage:', totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0);
    
    return totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  }, [questionnaire, selectedOptions, freeTexts]);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get(`/questionnaires/${id}`);
        const loadedQuestionnaire = response.data;
        setQuestionnaire(loadedQuestionnaire);
        setSelectedOptions({}); // TOUJOURS vide au début
        setCRTexts(loadedQuestionnaire.crData?.crTexts || {});
        setFreeTexts(loadedQuestionnaire.crData?.freeTexts || {});
        setHiddenQuestions(loadedQuestionnaire.hiddenQuestions || {});
      } catch (error) {
        console.error('Erreur lors du chargement du questionnaire:', error);
      }
    };
    fetchQuestionnaire();
  }, [id]);

  useEffect(() => {
    const headerTitle = document.getElementById('header-title');
    if (headerTitle && questionnaire) {
      headerTitle.textContent = questionnaire.title;
    }
  }, [questionnaire]);

  const generateCR = () => {
    let mainContent = [];
    let conclusionContent = [];
    
    const addContent = (content, isTitle = false, section) => {
      if (isTitle || content.startsWith('<strong>') || content.startsWith('<u>')) {
        section.push('');
      }
      section.push(content.trim());
    };
    
    const generateCRRecursive = (questions, section) => {
      questions.forEach(question => {
        // Ajouter la gestion des imageMap ici
        if (question.type === 'imageMap' && question.questionImage) {
          const selectedAreas = selectedOptions[question.id] || [];
          selectedAreas.forEach(areaIndex => {
            const crText = crTexts[question.id]?.[areaIndex];
            if (crText) {
              addContent(crText, false, section);
            }
          });
        } else if (question.type === 'text' || question.type === 'number') {
          const freeText = freeTexts[question.id];
          if (freeText) {
            if (question.text === 'INDICATION') {
              addContent(`<strong>${question.text} :</strong>`, true, section);
              addContent(freeText, false, section);
            } else if (question.text === 'Conclusion') {
              // Ignorer le champ CONCLUSION car on le génère automatiquement
            } else {
              addContent(freeText, false, section);
            }
          }
        } else if (question.text === 'TECHNIQUE') {
          const selectedIndices = selectedOptions[question.id] || [];
          const techniqueResponses = selectedIndices
            .map(index => question.options[index]?.text)
            .filter(Boolean);
          if (techniqueResponses.length > 0) {
            addContent('<strong>TECHNIQUE :</strong>', true, section);
            addContent(techniqueResponses.join(', ') + '.', false, section);
          }
        } else {
          const selectedIndices = selectedOptions[question.id] || [];
          selectedIndices.forEach(index => {
            const option = question.options[index];
            if (!option) return;
  
            const crText = crTexts[question.id]?.[index];
            if (crText) {
              addContent(crText, false, section);
              
              if (option.includeInConclusion) {
                conclusionContent.push(crText);
              }
            }
  
            if (option.subQuestions && option.subQuestions.length > 0) {
              generateCRRecursive(option.subQuestions, section);
            }
          });
        }
      });
    };
    
    if (questionnaire && Array.isArray(questionnaire.questions)) {
      generateCRRecursive(questionnaire.questions, mainContent);
    }
  
    if (conclusionContent.length > 0) {
      mainContent.push('');
      mainContent.push('<strong>Conclusion :</strong>');
      conclusionContent.forEach(content => {
        mainContent.push(content);
      });
    }
  
    return mainContent.join('\n');
  };

  useEffect(() => {
    const generatedCR = generateCR();
    setEditableCR(generatedCR);
  }, [questionnaire, selectedOptions, crTexts, freeTexts]);

  const handleFreeTextChange = useCallback((questionId, value) => {
    setFreeTexts(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleImageInsert = useCallback((image) => {
    setInsertedImages(prev => [...prev, image.src]);
  }, []);

  const handleImageRemove = useCallback((index) => {
    setInsertedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleOptionUpdate = useCallback((path, updatedOption) => {
    setQuestionnaire(prev => {
      if (!prev) return prev;
  
      const newQuestionnaire = JSON.parse(JSON.stringify(prev));
      const pathString = path.reduce((acc, curr) => {
        if (typeof curr === 'number') {
          return `${acc}[${curr}]`;
        } else {
          return `${acc}.${curr}`;
        }
      }, 'questions');
  
      set(newQuestionnaire, pathString, updatedOption);
      return newQuestionnaire;
    });
  
    setEditableCR(generateCR());
  }, [generateCR]);

  const copyToClipboard = async () => {
    try {
      // Vérifier s'il y a des questions importantes non répondues
      const importantQuestions = [];
      
      const checkImportantQuestions = (questions) => {
        questions.forEach(question => {
          if (question.important) {
            const hasAnswer = 
              (selectedOptions[question.id] && selectedOptions[question.id].length > 0) ||
              (freeTexts[question.id] && freeTexts[question.id].trim() !== '');
            
            if (!hasAnswer) {
              importantQuestions.push(question);
            }
          }
          
          if (question.options && selectedOptions[question.id]) {
            const selectedIndices = selectedOptions[question.id] || [];
            selectedIndices.forEach(index => {
              const option = question.options[index];
              if (option?.subQuestions) {
                checkImportantQuestions(option.subQuestions);
              }
            });
          }
        });
      };
      
      if (questionnaire?.questions) {
        checkImportantQuestions(questionnaire.questions);
      }
      
      if (importantQuestions.length > 0) {
        const confirmDialog = await new Promise((resolve) => {
          const dialogElement = document.createElement('div');
          dialogElement.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50';
          
          const handleCancel = () => {
            document.body.removeChild(dialogElement);
            resolve(false);
          };
          
          const handleContinue = () => {
            document.body.removeChild(dialogElement);
            resolve(true);
          };
          
          dialogElement.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
              <div class="flex items-center gap-3 mb-4">
                <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"/>
                </svg>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Questions importantes non répondues</h3>
              </div>
              
              <p class="mb-4 text-gray-600 dark:text-gray-300">Les questions suivantes sont marquées comme importantes mais n'ont pas de réponse dans le compte-rendu :</p>
              
              <ul class="mb-6 space-y-2">
                ${importantQuestions.map(q => `
                  <li class="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                    <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    ${q.text}
                  </li>
                `).join('')}
              </ul>
              
              <p class="mb-6 text-gray-600 dark:text-gray-300">Êtes-vous sûr de vouloir continuer ?</p>
              
              <div class="flex justify-end gap-3">
                <button
                  id="cancel-button"
                  class="px-4 py-2 text-gray-600 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-200 transition-colors rounded-md"
                >
                  Annuler
                </button>
                <button
                  id="continue-button"
                  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                >
                  Continuer
                </button>
              </div>
            </div>
          `;
      
          // Ajouter les gestionnaires d'événements après que le HTML soit inséré
          dialogElement.querySelector('#cancel-button').addEventListener('click', handleCancel);
          dialogElement.querySelector('#continue-button').addEventListener('click', handleContinue);
          
          document.body.appendChild(dialogElement);
        });
      
        if (!confirmDialog) {
          return;
        }
      }
  
      // Le reste du code existant...
      const formattedContent = editableCR.split('\n').map(line => 
        line.startsWith('<strong>') || line.startsWith('<u>') ?
          line.replace(/<\/?strong>/g, '').replace(/<\/?u>/g, '') : line
      ).join('\n');
  
      await navigator.clipboard.writeText(formattedContent);
      setCopySuccess('Compte-rendu copié !');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      setCopySuccess('Erreur lors de la copie');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const handleOptionChange = useCallback((questionId, optionIndex, questionType) => {
    setSelectedOptions(prev => {
      const newSelectedOptions = { ...prev };
      
      if (!newSelectedOptions[questionId]) {
        newSelectedOptions[questionId] = [];
      }
      
      if (questionType === 'single') {
        newSelectedOptions[questionId] = [optionIndex];
      } else if (questionType === 'multiple') {
        const currentSelections = [...newSelectedOptions[questionId]];
        const index = currentSelections.indexOf(optionIndex);
        
        if (index > -1) {
          currentSelections.splice(index, 1);
        } else {
          currentSelections.push(optionIndex);
        }
        
        newSelectedOptions[questionId] = currentSelections;
      }
      
      return newSelectedOptions;
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const response = await axios.put(`/questionnaires/${id}`, {
        ...questionnaire,
        selectedOptions,
        crData: {
          crTexts,
          freeTexts
        },
        hiddenQuestions
      });
      
      console.log('Questionnaire sauvegardé:', response.data);
      alert('Questionnaire sauvegardé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde');
    }
  }, [questionnaire, selectedOptions, crTexts, freeTexts, hiddenQuestions, id]);

  if (!questionnaire) return <div>Chargement...</div>;

  return (
    <ModernPageContainer>
      <ModernCard>
        <ModernTitle>{questionnaire?.title || "Questionnaire"}</ModernTitle>
        
        <ProgressContainer>
          <ProgressText>Progression : {progressPercentage}%</ProgressText>
          <ProgressBar>
            <ProgressFill percentage={progressPercentage} />
          </ProgressBar>
        </ProgressContainer>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/5">
            <QuestionnairePreview 
              questions={questionnaire.questions}
              selectedOptions={selectedOptions}
              setSelectedOptions={handleOptionChange}
              crTexts={crTexts}
              setCRTexts={setCRTexts}
              freeTexts={freeTexts}
              onFreeTextChange={handleFreeTextChange}
              showCRFields={false}
              onImageInsert={handleImageInsert}
              hiddenQuestions={hiddenQuestions}
              toggleQuestionVisibility={() => {}}
              questionnaireLinks={questionnaire.links}
              questionnaireId={id}
              onOptionUpdate={handleOptionUpdate}
              questionnaire={questionnaire}
              handleOpenLinkEditor={() => {}}
            />
          </div>
          <div className="lg:w-2/5">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md whitespace-pre-wrap font-calibri text-base">
              <div
                ref={crRef}
                contentEditable={true}
                onBlur={(e) => setEditableCR(e.target.innerHTML)}
                dangerouslySetInnerHTML={{ __html: editableCR }}
                className="focus:outline-none"
              />
              {insertedImages.length > 0 && <br />}
              <div className="flex flex-wrap">
                {insertedImages.map((src, index) => (
                  <div key={index} className="relative" style={{maxWidth: '200px', maxHeight: '200px', margin: '0 10px 10px 0'}}>
                    <img 
                      src={src} 
                      alt={`Image insérée ${index + 1}`} 
                      style={{
                        maxWidth: '100%', 
                        maxHeight: '100%', 
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    />
                    <button
                      onClick={() => handleImageRemove(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={copyToClipboard}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Copier le CR
              </button>
              <button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Sauvegarder
              </button>
              {copySuccess && (
                <span className="text-green-500 flex items-center">
                  {copySuccess}
                </span>
              )}
            </div>
          </div>
        </div>
      </ModernCard>
    </ModernPageContainer>
  );
};

export default QuestionnaireUsePage;