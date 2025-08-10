// pages/QuestionnairePage.js - VERSION AVEC GRILLE CENTRÉE ET CARTES CLIQUABLES
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { Trash2, Clock, Users, FileText } from 'lucide-react';

// Import du nouveau système de filtres unifié
import UnifiedFilterSystem from '../components/shared/UnifiedFilterSystem';

// Import des composants partagés
import {
  PageContainer,
  ListContainer,
  SearchInput,
  QuestionnairesGrid,
  QuestionnaireCard,
  CardHeader,
  QuestionnaireTitle,
  QuestionnaireIcon,
  CardMeta,
  MetaItem,
  TagsContainer,
  Tag,
  ActionButtons,
  ActionButton,
  DeleteButton
} from '../components/shared/SharedComponents';

function QuestionnairePage() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilters, setModalityFilters] = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  
  // Ajout du hook useNavigate pour la navigation
  const navigate = useNavigate();

  const modalityOptions = ['Rx', 'TDM', 'IRM', 'Echo'];
  const specialtyOptions = ['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo', 'Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'];
  const locationOptions = [
    "Avant-pied", "Bras", "Bassin", "Cheville", "Coude", "Cuisse", "Doigts", "Epaule", 
    "Genou", "Hanche", "Jambe", "Parties molles", "Poignet", "Rachis"
  ];

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    try {
      const response = await axios.get('/questionnaires/my', {
        params: {
          page,
          limit: 12,
          search: searchTerm,
          modality: modalityFilters.join(','),
          specialty: specialtyFilters.join(','),
          location: locationFilters.join(',')
        }
      });
      
      const questionnaires = response.data?.questionnaires;
      const safeQuestionnaires = Array.isArray(questionnaires) ? questionnaires : [];

      setQuestionnaires(safeQuestionnaires);
      setCurrentPage(page);
      setTotalPages(response.data?.totalPages || 0);

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des questionnaires:', error);
      setQuestionnaires([]);
      setCurrentPage(1);
      setTotalPages(0);
    }
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  useEffect(() => {
    fetchQuestionnaires(1);
    const headerTitle = document.getElementById('header-title');
    if (headerTitle) {
      headerTitle.textContent = 'Liste des questionnaires';
    }
  }, [fetchQuestionnaires]);

  const deleteQuestionnaire = async (id, event) => {
    // Empêcher la propagation du clic pour éviter de naviguer
    event.stopPropagation();
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce questionnaire ?')) {
      try {
        await axios.delete(`/questionnaires/${id}`);
        fetchQuestionnaires(currentPage);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du questionnaire');
      }
    }
  };

  const getQuestionnaireIcon = (tags) => {
    if (!tags || tags.length === 0) return '📋';
    if (tags.includes('IRM') || tags.includes('irm')) return '🧲';
    if (tags.includes('TDM') || tags.includes('tdm')) return '🔍';
    if (tags.includes('Rx') || tags.includes('rx')) return '🩻';
    if (tags.includes('Echo') || tags.includes('echo')) return '📡';
    return '📋';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const estimateTime = (questionnaire) => {
    const questionCount = questionnaire.questions ? questionnaire.questions.length : 0;
    const estimatedMinutes = Math.max(2, Math.ceil(questionCount * 0.5));
    return `~${estimatedMinutes} min`;
  };

  // Nouvelle fonction pour gérer le clic sur la carte
  const handleCardClick = (questionnaireId) => {
    navigate(`/use/${questionnaireId}`);
  };

  // Configuration des filtres pour UnifiedFilterSystem
  const filtersConfig = [
    {
      key: 'modality',
      title: 'Modalités',
      icon: '📊',
      options: modalityOptions,
      selectedValues: modalityFilters,
      onChange: setModalityFilters
    },
    {
      key: 'specialty',
      title: 'Spécialités',
      icon: '🏥',
      options: specialtyOptions,
      selectedValues: specialtyFilters,
      onChange: setSpecialtyFilters
    },
    {
      key: 'location',
      title: 'Localisation',
      icon: '📍',
      options: locationOptions,
      selectedValues: locationFilters,
      onChange: setLocationFilters
    }
  ];

  return (
    <PageContainer>
      {/* CONTENU PRINCIPAL */}
      <ListContainer>
        {/* BARRE DE RECHERCHE */}
        <SearchInput
          type="text"
          placeholder="🔍 Rechercher un questionnaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* NOUVEAU SYSTÈME DE FILTRES UNIFIÉ */}
        <div style={{ 
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center'  // 🔧 CENTRAGE : Centre les filtres aussi
        }}>
          <UnifiedFilterSystem
            filters={filtersConfig}
            style={{ justifyContent: 'center' }}  // 🔧 CENTRAGE : Centre le contenu des filtres
          />
        </div>

        {/* CONTENEUR CENTRÉ POUR LA GRILLE */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}>
          {/* GRILLE DES QUESTIONNAIRES (déjà centrée via SharedComponents) */}
          <QuestionnairesGrid>
            {questionnaires.map((questionnaire) => (
              <QuestionnaireCard 
                key={questionnaire._id}
                onClick={() => handleCardClick(questionnaire._id)}
                style={{
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <CardHeader>
                  <QuestionnaireTitle>
                    <QuestionnaireIcon>
                      {getQuestionnaireIcon(questionnaire.tags)}
                    </QuestionnaireIcon>
                    {questionnaire.title}
                  </QuestionnaireTitle>
                </CardHeader>

                {/* Tags */}
                <TagsContainer>
                  {questionnaire.tags && questionnaire.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsContainer>

                {/* Métadonnées */}
                <CardMeta>
                  <MetaItem>
                    <Clock size={14} />
                    <span>{formatDate(questionnaire.updatedAt || questionnaire.createdAt)}</span>
                  </MetaItem>
                  <MetaItem>
                    <Users size={14} />
                    <span>Personnel</span>
                  </MetaItem>
                  <MetaItem>
                    <FileText size={14} />
                    <span>{questionnaire.public ? 'Public' : 'Privé'}</span>
                  </MetaItem>
                  <MetaItem>
                    <Clock size={14} />
                    <span>{estimateTime(questionnaire)}</span>
                  </MetaItem>
                </CardMeta>

                {/* Actions */}
                <ActionButtons>
                  <ActionButton 
                    to={`/use/${questionnaire._id}`}
                    onClick={(e) => e.stopPropagation()} // Empêcher le double clic
                  >
                    ▶️ UTILISER
                  </ActionButton>
                  
                  <DeleteButton 
                    onClick={(e) => deleteQuestionnaire(questionnaire._id, e)}
                    title="Supprimer ce questionnaire"
                  >
                    <Trash2 size={18} />
                  </DeleteButton>
                </ActionButtons>
              </QuestionnaireCard>
            ))}
          </QuestionnairesGrid>
        </div>

        {/* PAGINATION (centrée) */}
        {totalPages > 1 && (
          <PaginationContainer style={{
            maxWidth: '600px',
            margin: '3rem auto',  // 🔧 CENTRAGE : Centre la pagination
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <PaginationButton 
              onClick={() => fetchQuestionnaires(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              ← Précédent
            </PaginationButton>
            
            <PaginationInfo>
              Page {currentPage} sur {totalPages}
            </PaginationInfo>
            
            <PaginationButton 
              onClick={() => fetchQuestionnaires(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Suivant →
            </PaginationButton>
          </PaginationContainer>
        )}
      </ListContainer>
    </PageContainer>
  );
}

export default QuestionnairePage;