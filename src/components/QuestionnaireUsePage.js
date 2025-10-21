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
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: calc(100vh - 60px);
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ModernCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  box-shadow: 0 4px 24px ${props => props.theme.shadow};
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 12px;
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

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 2rem;
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr 400px;
    gap: 1.5rem;
  }

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const PreviewSection = styled.div`
  flex: 2;
  min-width: 0;

  @media (min-width: 1024px) {
    position: sticky;
    top: 80px;
    align-self: flex-start;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }
`;

const PreviewCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
`;

const PreviewTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  margin-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.primary};
  padding-bottom: 0.5rem;
`;

const PreviewContent = styled.div`
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  padding: 1rem;
  min-height: 300px;
  max-height: 500px;
  overflow-y: auto;
  font-family: 'Calibri', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;

  &:focus {
    outline: 2px solid ${props => props.theme.primary};
    outline-offset: 2px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`;

const SecondaryButton = styled.button`
  background-color: ${props => props.theme.buttonSecondary};
  color: ${props => props.theme.buttonSecondaryText};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

const SaveButton = styled.button`
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.secondaryHover};
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background: ${props => props.theme.error};
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.buttonDangerHover};
  }
`;

const SuccessMessage = styled.span`
  color: ${props => props.theme.secondary};
  display: flex;
  align-items: center;
  font-weight: 500;
`;

const ProgressContainer = styled.div`
  width: 100%;
  margin: 1.5rem 0;
  text-align: center;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.borderLight};
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.theme.primary};
  transition: width 0.3s ease;
  width: ${props => props.percentage}%;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.text};
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
    
    // Compter UNIQUEMENT les questions principales visibles (pas cachées, pas les sous-questions)
    const countMainVisibleQuestions = (questions) => {
      let count = 0;
      
      questions.forEach(question => {
        // Ne compter que si la question N'EST PAS cachée ET est une question principale
        const isHidden = hiddenQuestions && hiddenQuestions[question.id];
        const isAnswerableQuestion = ['single', 'multiple', 'text', 'number', 'imageMap'].includes(question.type);
        
        if (!isHidden && isAnswerableQuestion) {
          count++;
        }
        // NE PAS compter les sous-questions du tout
      });
      
      return count;
    };

    // Compter UNIQUEMENT les questions principales visibles qui sont répondues
    const countAnsweredMainQuestions = (questions) => {
      let answered = 0;
      
      questions.forEach(question => {
        // Ne compter que si la question N'EST PAS cachée ET est répondue
        const isHidden = hiddenQuestions && hiddenQuestions[question.id];
        const isAnswerableQuestion = ['single', 'multiple', 'text', 'number', 'imageMap'].includes(question.type);
        
        if (!isHidden && isAnswerableQuestion) {
          // Une question est considérée comme répondue si elle a au moins une réponse
          const hasAnswer = 
            (selectedOptions[question.id] && selectedOptions[question.id].length > 0) ||
            (freeTexts[question.id] && freeTexts[question.id].trim() !== '');
          
          if (hasAnswer) {
            answered++;
          }
        }
        // NE PAS compter les sous-questions du tout
      });
      
      return answered;
    };

    const totalMainQuestions = countMainVisibleQuestions(questionnaire.questions);
    const answeredMainQuestions = countAnsweredMainQuestions(questionnaire.questions);
    
    // Debug pour vérifier les calculs
    console.log('=== CALCUL PROGRESSION ===');
    console.log('Questions principales visibles:', totalMainQuestions);
    console.log('Questions principales répondues:', answeredMainQuestions);
    console.log('Questions cachées:', Object.keys(hiddenQuestions || {}).length);
    console.log('Pourcentage:', totalMainQuestions > 0 ? Math.round((answeredMainQuestions / totalMainQuestions) * 100) : 0);
    
    return totalMainQuestions > 0 ? Math.round((answeredMainQuestions / totalMainQuestions) * 100) : 0;
  }, [questionnaire, selectedOptions, freeTexts, hiddenQuestions]);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get(`/questionnaires/${id}`);
        const loadedQuestionnaire = response.data;
        setQuestionnaire(loadedQuestionnaire);
        
        // Séparer les options des questions visibles et masquées
        const originalSelectedOptions = loadedQuestionnaire.selectedOptions || {};
        const hiddenQuestionsData = loadedQuestionnaire.hiddenQuestions || {};
        
        // Créer un objet pour ne garder QUE les sélections des questions masquées
        const hiddenQuestionsSelections = {};
        
        // Fonction récursive pour trouver toutes les questions masquées et garder leurs sélections
        const preserveHiddenSelections = (questions) => {
          questions.forEach(question => {
            if (hiddenQuestionsData[question.id] && originalSelectedOptions[question.id]) {
              // Cette question est masquée ET a des sélections -> les conserver
              hiddenQuestionsSelections[question.id] = originalSelectedOptions[question.id];
            }
            
            // Vérifier les sous-questions
            if (question.options) {
              question.options.forEach(option => {
                if (option.subQuestions) {
                  preserveHiddenSelections(option.subQuestions);
                }
              });
            }
          });
        };
        
        if (loadedQuestionnaire.questions) {
          preserveHiddenSelections(loadedQuestionnaire.questions);
        }
        
        // Initialiser selectedOptions avec SEULEMENT les questions masquées précochées
        setSelectedOptions(hiddenQuestionsSelections);
        
        setCRTexts(loadedQuestionnaire.crData?.crTexts || {});
        setFreeTexts(loadedQuestionnaire.crData?.freeTexts || {});
        setHiddenQuestions(hiddenQuestionsData);
        
        console.log('=== INITIALISATION ===');
        console.log('Questions masquées précochées:', Object.keys(hiddenQuestionsSelections));
        console.log('Sélections conservées:', hiddenQuestionsSelections);
        
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
      <PageHeader>
        <ModernTitle>{questionnaire?.title || "Questionnaire"}</ModernTitle>
        <ProgressContainer>
          <ProgressText>Progression : {progressPercentage}%</ProgressText>
          <ProgressBar>
            <ProgressFill percentage={progressPercentage} />
          </ProgressBar>
        </ProgressContainer>
      </PageHeader>

      <ContentWrapper>
        <ModernCard>
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
        </ModernCard>

        <PreviewSection>
          <PreviewCard>
            <PreviewTitle>📋 Aperçu du Compte-Rendu</PreviewTitle>
              <PreviewContent
                ref={crRef}
                contentEditable={true}
                onBlur={(e) => setEditableCR(e.target.innerHTML)}
                dangerouslySetInnerHTML={{ __html: editableCR }}
              />
              {insertedImages.length > 0 && (
                <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {insertedImages.map((src, index) => (
                    <div key={index} style={{ position: 'relative', maxWidth: '150px', maxHeight: '150px' }}>
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
                      <RemoveImageButton onClick={() => handleImageRemove(index)}>
                        <X size={12} />
                      </RemoveImageButton>
                    </div>
                  ))}
                </div>
              )}
              <ButtonGroup>
                <SecondaryButton onClick={copyToClipboard}>
                  Copier le CR
                </SecondaryButton>
                <SaveButton onClick={handleSave}>
                  Sauvegarder
                </SaveButton>
                {copySuccess && (
                  <SuccessMessage>
                    {copySuccess}
                  </SuccessMessage>
                )}
              </ButtonGroup>
          </PreviewCard>
        </PreviewSection>
      </ContentWrapper>
    </ModernPageContainer>
  );
};

export default QuestionnaireUsePage;