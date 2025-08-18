// pages/QuestionnairePage.js - VERSION AVEC FILTRES CUMULATIFS (ET)
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { Trash2, Clock, Users, FileText } from 'lucide-react';
import styled from 'styled-components';

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

// Nouveau composant pour afficher les filtres actifs
const ActiveFiltersDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  flex-wrap: wrap;

  strong {
    color: ${props => props.theme.primary};
    margin-right: 0.5rem;
  }

  .filter-tag {
    background-color: ${props => props.theme.primary};
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }

  .separator {
    color: ${props => props.theme.textSecondary};
    font-weight: bold;
    margin: 0 0.25rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const ResultsInfo = styled.div`
  text-align: center;
  color: ${props => props.theme.textSecondary};
  margin-top: 2rem;
  font-size: 0.95rem;
`;

function QuestionnairePage() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilters, setModalityFilters] = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // État pour afficher les questionnaires filtrés côté client
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState([]);
  
  // Ajout du hook useNavigate pour la navigation
  const navigate = useNavigate();

  const modalityOptions = ['Rx', 'TDM', 'IRM', 'Echo'];
  const specialtyOptions = ['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo', 'Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'];
  const locationOptions = [
    "Avant-pied", "Bras", "Bassin", "Cheville", "Coude", "Cuisse", "Doigts", "Epaule", 
    "Genou", "Hanche", "Jambe", "Parties molles", "Poignet", "Rachis"
  ];

  // 🔧 MODIFICATION PRINCIPALE : Fonction de filtrage côté client avec logique ET
  const filterQuestionnairesLocally = useCallback((questionnairesToFilter) => {
    let filtered = [...questionnairesToFilter];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.tags && q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // 🔧 IMPORTANT : Logique ET pour les filtres
    // Un questionnaire doit avoir TOUS les tags sélectionnés dans chaque catégorie
    
    // Filtre par modalité (ET)
    if (modalityFilters.length > 0) {
      filtered = filtered.filter(q => {
        if (!q.tags || q.tags.length === 0) return false;
        // Le questionnaire doit avoir TOUS les tags de modalité sélectionnés
        return modalityFilters.every(filter => 
          q.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
        );
      });
    }

    // Filtre par spécialité (ET)
    if (specialtyFilters.length > 0) {
      filtered = filtered.filter(q => {
        if (!q.tags || q.tags.length === 0) return false;
        // Le questionnaire doit avoir TOUS les tags de spécialité sélectionnés
        return specialtyFilters.every(filter => 
          q.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
        );
      });
    }

    // Filtre par localisation (ET)
    if (locationFilters.length > 0) {
      filtered = filtered.filter(q => {
        if (!q.tags || q.tags.length === 0) return false;
        // Le questionnaire doit avoir TOUS les tags de localisation sélectionnés
        return locationFilters.every(filter => 
          q.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
        );
      });
    }

    return filtered;
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      // 🔧 MODIFICATION : On récupère TOUS les questionnaires sans filtres côté serveur
      const response = await axios.get('/questionnaires/my', {
        params: {
          page,
          limit: 100, // Augmenté pour avoir plus de résultats à filtrer
          // On n'envoie plus les filtres au serveur pour pouvoir appliquer la logique ET côté client
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔧 MODIFICATION : Appliquer les filtres localement quand les questionnaires ou les filtres changent
  useEffect(() => {
    const filtered = filterQuestionnairesLocally(questionnaires);
    setFilteredQuestionnaires(filtered);
  }, [questionnaires, filterQuestionnairesLocally]);

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
        // Mise à jour locale de l'état
        setQuestionnaires(prevQuestionnaires => 
          prevQuestionnaires.filter(q => q._id !== id)
        );
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du questionnaire');
      }
    }
  };

  const getQuestionnaireIcon = (tags) => {
    if (!tags || tags.length === 0) return '📋';
    if (tags.includes('IRM') || tags.includes('irm')) return '🧲';
    if (tags.includes('TDM') || tags.includes('tdm')) return '📍';
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

  // Fonction pour vérifier si des filtres sont actifs
  const hasActiveFilters = modalityFilters.length > 0 || specialtyFilters.length > 0 || locationFilters.length > 0;

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

        {/* 🔧 NOUVEAU : Affichage des filtres actifs avec logique ET */}
        {hasActiveFilters && (
          <ActiveFiltersDisplay>
            <strong>Filtres actifs (cumulatifs) :</strong>
            {modalityFilters.length > 0 && (
              <>
                {modalityFilters.map((filter, index) => (
                  <React.Fragment key={`mod-${filter}`}>
                    <span className="filter-tag">{filter}</span>
                    {index < modalityFilters.length - 1 && <span className="separator">ET</span>}
                  </React.Fragment>
                ))}
              </>
            )}
            {modalityFilters.length > 0 && specialtyFilters.length > 0 && <span className="separator">ET</span>}
            {specialtyFilters.length > 0 && (
              <>
                {specialtyFilters.map((filter, index) => (
                  <React.Fragment key={`spec-${filter}`}>
                    <span className="filter-tag">{filter}</span>
                    {index < specialtyFilters.length - 1 && <span className="separator">ET</span>}
                  </React.Fragment>
                ))}
              </>
            )}
            {((modalityFilters.length > 0 || specialtyFilters.length > 0) && locationFilters.length > 0) && <span className="separator">ET</span>}
            {locationFilters.length > 0 && (
              <>
                {locationFilters.map((filter, index) => (
                  <React.Fragment key={`loc-${filter}`}>
                    <span className="filter-tag">{filter}</span>
                    {index < locationFilters.length - 1 && <span className="separator">ET</span>}
                  </React.Fragment>
                ))}
              </>
            )}
          </ActiveFiltersDisplay>
        )}

        {/* ÉTAT DE CHARGEMENT */}
        {isLoading ? (
          <LoadingMessage>Chargement des questionnaires...</LoadingMessage>
        ) : filteredQuestionnaires.length === 0 ? (
          <EmptyState>
            <h3>Aucun questionnaire trouvé</h3>
            <p>
              {hasActiveFilters 
                ? "Aucun questionnaire ne correspond à TOUS vos critères de filtrage. Essayez de retirer certains filtres."
                : searchTerm 
                  ? "Aucun questionnaire ne correspond à votre recherche."
                  : "Vous n'avez pas encore de questionnaire."}
            </p>
          </EmptyState>
        ) : (
          <>
            {/* CONTENEUR CENTRÉ POUR LA GRILLE */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%'
            }}>
              {/* GRILLE DES QUESTIONNAIRES (déjà centrée via SharedComponents) */}
              <QuestionnairesGrid>
                {filteredQuestionnaires.map((questionnaire) => (
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

            {/* INFO SUR LE NOMBRE DE RÉSULTATS */}
            <ResultsInfo>
              {filteredQuestionnaires.length} questionnaire{filteredQuestionnaires.length > 1 ? 's' : ''} trouvé{filteredQuestionnaires.length > 1 ? 's' : ''}
              {hasActiveFilters && ' avec les filtres appliqués'}
            </ResultsInfo>
          </>
        )}
      </ListContainer>
    </PageContainer>
  );
}

export default QuestionnairePage;