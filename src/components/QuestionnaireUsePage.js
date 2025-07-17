import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get(`/questionnaires/${id}`);
        const loadedQuestionnaire = response.data;
        setQuestionnaire(loadedQuestionnaire);
        setSelectedOptions(loadedQuestionnaire.selectedOptions || {});
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
      console.log("Questionnaire:", questionnaire);
      console.log("Questions marquées comme importantes:", questionnaire.questions.filter(q => q.isImportantToCheck));
      
      // Forcer l'affichage de la boîte de dialogue pour les questions importantes
      const importantQuestions = questionnaire.questions.filter(q => q.isImportantToCheck);
      
      if (importantQuestions.length > 0) {
        const confirmDialog = await new Promise((resolve) => {
          const dialogElement = document.createElement('div');
          
          // Créer une fonction pour gérer le clic sur Annuler
          const handleCancel = () => {
            dialogElement.remove();
            resolve(false);
          };
      
          // Créer une fonction pour gérer le clic sur Continuer
          const handleContinue = () => {
            dialogElement.remove();
            resolve(true);
          };
      
          dialogElement.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl transform transition-all">
                <div class="flex items-center gap-3 mb-4">
                  <div class="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
                    <svg class="w-6 h-6 text-yellow-600 dark:text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                  </div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Attention !</h3>
                </div>
                
                <p class="mb-4 text-gray-600 dark:text-gray-300">Veuillez vérifier ces questions importantes avant de copier le compte-rendu :</p>
                
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
        line.startsWith('<strong>') || line.startsWith('<u>') ? `<p><br>${line}</p>` : `<p>${line}</p>`
      ).join('');

      const maxWidth = 200;
      const maxHeight = 150;

      const imagePromises = insertedImages.map(src => 
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            const width = Math.round(img.width * ratio);
            const height = Math.round(img.height * ratio);
            resolve(`<img src="${src}" alt="Image insérée" width="${width}" height="${height}" style="object-fit: contain;" />`);
          };
          img.onerror = () => {
            resolve(`<img src="${src}" alt="Image insérée" width="${maxWidth}" height="${maxHeight}" style="object-fit: contain;" />`);
          };
          img.src = src;
        })
      );

      const imageElements = await Promise.all(imagePromises);

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Calibri, sans-serif; font-size: 12pt; }
              p { margin: 0; padding: 0; }
              .image-container { display: inline-block; margin: 10px 10px 0 0; vertical-align: top; }
            </style>
          </head>
          <body>
            ${formattedContent}
            <p><br></p>
            <div style="display: flex; flex-wrap: wrap;">
              ${imageElements.map(img => `<div class="image-container">${img}</div>`).join('')}
            </div>
          </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
      
      setCopySuccess('Copié !');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      setCopySuccess('Échec de la copie');
    }
  };

  const handleOptionChange = useCallback((questionId, optionIndex, questionType) => {
    setSelectedOptions(prevOptions => {
      const newOptions = { ...prevOptions };
      if (!newOptions[questionId]) {
        newOptions[questionId] = [];
      }
      if (questionType === 'single') {
        newOptions[questionId] = [optionIndex];
      } else if (questionType === 'multiple') {
        const index = newOptions[questionId].indexOf(optionIndex);
        if (index > -1) {
          newOptions[questionId] = newOptions[questionId].filter(i => i !== optionIndex);
        } else {
          newOptions[questionId] = [...newOptions[questionId], optionIndex];
        }
      }
      return newOptions;
    });
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await axios.put(`/questionnaires/${id}`, {
        ...questionnaire,
        selectedOptions,
        crData: { crTexts, freeTexts },
        hiddenQuestions
      });
      alert('Sauvegarde réussie !');
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
                      backgroundColor: '#f0f0f0',
                    }} 
                  />
                  <button 
                    onClick={() => handleImageRemove(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    title="Supprimer l'image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <button 
              onClick={copyToClipboard}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Copier
            </button>
            {copySuccess && <span className="text-green-600">{copySuccess}</span>}
          </div>
        </div>
      </div>
    </ModernCard>
  </ModernPageContainer>
);
};

export default QuestionnaireUsePage;