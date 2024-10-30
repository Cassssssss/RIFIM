import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import QuestionnairePreview from './QuestionnairePreview';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { X } from 'lucide-react';
import set from 'lodash/set';
import styled from 'styled-components';


const PreviewWrapper = styled.div`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: 2rem;
  border-radius: 8px;
`;

const PreviewCard = styled.div`
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
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
        if (question.type === 'text' || question.type === 'number') {
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
              
              // Si l'option doit être incluse dans la conclusion
              if (option.includeInConclusion) {
                conclusionContent.push(crText);
              }
            }
    
            // Récursivement vérifier les sous-questions
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

    // Ajouter la section conclusion si nécessaire
    if (conclusionContent.length > 0) {
      mainContent.push(''); // Ligne vide avant la conclusion
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

  // Dans QuestionnaireUsePage.js, ajoutez cette fonction avec les autres handlers
  const handleOptionUpdate = useCallback((path, updatedOption) => {
    console.log('handleOptionUpdate called with path:', path, 'updatedOption:', updatedOption);
    setQuestionnaire(prev => {
      if (!prev) return prev;
  
      const newQuestionnaire = JSON.parse(JSON.stringify(prev));
  
      // Construire le chemin vers l'option à mettre à jour
      const pathString = path.reduce((acc, curr) => {
        if (typeof curr === 'number') {
          return `${acc}[${curr}]`;
        } else {
          return `${acc}.${curr}`;
        }
      }, 'questions');
  
      console.log('pathString:', pathString);
  
      // Mettre à jour l'option à l'aide de lodash.set
      set(newQuestionnaire, pathString, updatedOption);
  
      console.log('newQuestionnaire after update:', newQuestionnaire);
  
      return newQuestionnaire;
    });
  
    // Forcer la mise à jour du CR
    setEditableCR(generateCR());
  }, [generateCR]);
  

  const copyToClipboard = async () => {
    try {
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
    <PreviewWrapper>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/5">
          <PreviewCard>
<div className="bg-gray-100 p-4 rounded-md">
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
          </PreviewCard>
        </div>
  
        <div className="lg:w-2/5">
          <PreviewCard>
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
          </PreviewCard>
        </div>
      </div>
    </PreviewWrapper>
  );
  
};

export default QuestionnaireUsePage;