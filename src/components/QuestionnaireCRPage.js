import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import QuestionnairePreview from './QuestionnairePreview';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import set from 'lodash/set';
import styled from 'styled-components';

const ViewerContainer = styled.div`
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  background-color: ${props => props.theme.background};
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const Content = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  
  img {
    max-width: 100%;
    height: auto;
  }
`;

const QuestionnaireCRPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [crTexts, setCRTexts] = useState({});
  const [freeTexts, setFreeTexts] = useState({});
  const [hiddenQuestions, setHiddenQuestions] = useState({});
  const [editableCR, setEditableCR] = useState('');
  const crRef = useRef(null);

  const fetchQuestionnaire = useCallback(async () => {
    try {
      const response = await axios.get(`/questionnaires/${id}`);
      const loadedQuestionnaire = response.data;
      console.log("Questionnaire chargé:", loadedQuestionnaire);
      setQuestionnaire(loadedQuestionnaire);
      setSelectedOptions(loadedQuestionnaire.selectedOptions || {});
      setCRTexts(loadedQuestionnaire.crData?.crTexts || {});
      setFreeTexts(loadedQuestionnaire.crData?.freeTexts || {});
      setHiddenQuestions(loadedQuestionnaire.hiddenQuestions || {});
    } catch (error) {
      console.error('Erreur lors du chargement du questionnaire:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchQuestionnaire();
  }, [fetchQuestionnaire]);

  useEffect(() => {
    const headerTitle = document.getElementById('header-title');
    if (headerTitle && questionnaire) {
      headerTitle.textContent = questionnaire.title;
    }
  }, [questionnaire]);

  const generateCR = useCallback(() => {
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
            if (question.text === 'INDICATION' || question.text === 'CONCLUSION') {
              addContent(`<strong>${question.text} :</strong>`, true, section);
              addContent(freeText, false, section);
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
            const option = question.options?.[index];
            if (!option) return;
            const crText = crTexts[question.id]?.[index];
            if (crText) {
              addContent(crText, false, section);
              // Si l'option doit être incluse dans la conclusion
              if (option.includeInConclusion) {
                conclusionContent.push(crText);
              }
            }
            if (option.subQuestions) {
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
      mainContent.push('<strong>CONCLUSION :</strong>');
      conclusionContent.forEach(content => {
        mainContent.push(content);
      });
    }
  
    return mainContent.join('\n');
  }, [questionnaire, selectedOptions, crTexts, freeTexts]);

  useEffect(() => {
    const generatedCR = generateCR();
    setEditableCR(generatedCR);
  }, [generateCR]);

  const handleCRTextChange = useCallback((questionId, optionIndex, text) => {
    setCRTexts(prev => {
      const newCRTexts = {
        ...prev,
        [questionId]: {
          ...(prev[questionId] || {}),
          [optionIndex]: text
        }
      };
      setEditableCR(generateCR());
      return newCRTexts;
    });
  }, [generateCR]);

  const handleFreeTextChange = useCallback((questionId, value) => {
    setFreeTexts(prev => ({ ...prev, [questionId]: value }));
  }, []);

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

  const handleSave = useCallback(async () => {
    try {
      const dataToSave = {
        ...questionnaire,
        selectedOptions,
        crData: { crTexts, freeTexts },
        hiddenQuestions
      };
      
      const response = await axios.put(`/questionnaires/${id}`, dataToSave);
      
      if (response.data) {
        setQuestionnaire(response.data);
        alert('Questionnaire sauvegardé avec succès!');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  }, [questionnaire, selectedOptions, crTexts, freeTexts, hiddenQuestions, id]);

  const toggleQuestionVisibility = useCallback((questionId) => {
    setHiddenQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  }, []);

  if (!questionnaire) return <div>Chargement...</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-3/5">
          <div className="rounded-lg p-0">
            <h3 className="text-xl font-semibold mb-4">Questionnaire</h3>
            <div className="bg-gray-100 p-4 rounded-md">
            <QuestionnairePreview 
  title=""
  questions={questionnaire.questions}
  selectedOptions={selectedOptions}
  setSelectedOptions={handleOptionChange}
  crTexts={crTexts}
  setCRTexts={setCRTexts}
  freeTexts={freeTexts}
  onFreeTextChange={handleFreeTextChange}
  showCRFields={true}
  hiddenQuestions={hiddenQuestions}
  toggleQuestionVisibility={toggleQuestionVisibility}
  showAddButton={false}
  questionnaireLinks={questionnaire.links}
  questionnaireId={id}
  onOptionUpdate={handleOptionUpdate}
  onCRTextChange={handleCRTextChange}  // Assurez-vous que cette ligne est présente
/>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-2/4">
          <div className="rounded-lg p-0">
            <h3 className="text-xl font-semibold mb-4">Aperçu du CR</h3>
            <div 
              className="bg-gray-100 p-4 rounded-md whitespace-pre-wrap font-calibri text-base"
              contentEditable={true}
              onBlur={(e) => setEditableCR(e.target.innerHTML)}
              dangerouslySetInnerHTML={{ __html: editableCR }}
            />
          </div>
          <button 
            onClick={handleSave}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireCRPage;