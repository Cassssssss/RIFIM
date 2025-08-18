// pages/QuestionnaireListPage.js - VERSION AVEC FILTRES CUMULATIFS (ET)
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { Edit, FileText, Copy, Trash2, Eye, EyeOff, Clock, Users, Plus, X } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

// Import du nouveau système de filtres unifié
import UnifiedFilterSystem from '../components/shared/UnifiedFilterSystem';

// Import des composants partagés
import {
  PageContainer,
  TopActionsContainer,
  ListContainer,
  SearchInput,
  QuestionnairesGrid,
  QuestionnaireCard,
  CardHeader,
  QuestionnaireTitle,
  QuestionnaireIcon,
  CardMeta,
  MetaItem,
  TagsSection,
  TagsContainer,
  Tag,
  RemoveTagButton,
  AddTagSection,
  AddTagButton,
  TagInput,
  TagForm,
  SubmitTagButton,
  CancelTagButton,
  ActionButtons,
  ActionButton,
  Button,
  DeleteButton,
  TutorialButton,
  VideoContainer,
  LoadingMessage,
  ErrorMessage
} from '../components/shared/SharedComponents';

// Import styled-components pour les nouveaux styles
import styled from 'styled-components';

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

function QuestionnaireListPage() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalQuestionnaires, setTotalQuestionnaires] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilters, setModalityFilters] = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  
  // État pour afficher les questionnaires filtrés côté client
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // États pour la gestion des tags
  const [newTags, setNewTags] = useState({});
  const [isAddingTag, setIsAddingTag] = useState({});

  // Données de filtres
  const modalities = ['Rx', 'TDM', 'IRM', 'Echo'];
  const specialties = ['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo', 'Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'];
  const locations = ['Genou', 'Épaule', 'Rachis', 'Cheville', 'Poignet', 'Hanche'];

  const tutorialSteps = [
    {
      target: '.questionnaire-card',
      content: 'Chaque questionnaire est affiché dans une carte avec ses informations principales.'
    },
    {
      target: '.search-bar',
      content: 'Utilisez la barre de recherche pour trouver rapidement un questionnaire.'
    },
    {
      target: '.filter-section',
      content: 'Les filtres vous permettent de trier les questionnaires par modalité, spécialité ou localisation.'
    }
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
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '100', // Augmenté pour avoir plus de résultats à filtrer
        // On n'envoie plus les filtres au serveur pour pouvoir appliquer la logique ET côté client
      });

      const response = await axios.get(`/questionnaires/my?${params}`);
      
      const questionnaires = response.data?.questionnaires;
      const safeQuestionnaires = Array.isArray(questionnaires) ? questionnaires : [];

      setQuestionnaires(safeQuestionnaires);
      setCurrentPage(page);
      setTotalPages(response.data?.totalPages || 0);
      setTotalQuestionnaires(response.data?.totalQuestionnaires || 0);

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des questionnaires:', error);
      setQuestionnaires([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalQuestionnaires(0);
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
  }, [fetchQuestionnaires]);

  // Fonctions pour la gestion des tags
  const handleAddTag = async (questionnaireId, tag) => {
    if (!tag || !tag.trim()) return;
    
    try {
      const response = await axios.post(`/questionnaires/${questionnaireId}/tags`, { tag: tag.trim() });
      
      setQuestionnaires(prevQuestionnaires => 
        prevQuestionnaires.map(q => 
          q._id === questionnaireId 
            ? { ...q, tags: response.data.tags }
            : q
        )
      );
      
      setNewTags(prev => ({ ...prev, [questionnaireId]: '' }));
      setIsAddingTag(prev => ({ ...prev, [questionnaireId]: false }));
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tag:', error);
      alert('Erreur lors de l\'ajout du tag');
    }
  };

  const handleRemoveTag = async (questionnaireId, tagToRemove) => {
    try {
      const response = await axios.delete(`/questionnaires/${questionnaireId}/tags/${encodeURIComponent(tagToRemove)}`);
      
      setQuestionnaires(prevQuestionnaires => 
        prevQuestionnaires.map(q => 
          q._id === questionnaireId 
            ? { ...q, tags: response.data.tags }
            : q
        )
      );
      
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
      alert('Erreur lors de la suppression du tag');
    }
  };

  const handleTagSubmit = (e, questionnaireId) => {
    e.preventDefault();
    const tag = newTags[questionnaireId];
    if (tag) {
      handleAddTag(questionnaireId, tag);
    }
  };

  const toggleVisibility = async (id, isPublic) => {
    try {
      const response = await axios.patch(`/questionnaires/${id}/togglePublic`);
      
      setQuestionnaires(prevQuestionnaires => 
        prevQuestionnaires.map(q => 
          q._id === id 
            ? { ...q, public: response.data.public }
            : q
        )
      );
      
    } catch (error) {
      console.error('Erreur lors de la modification de la visibilité:', error);
      alert('Erreur lors de la modification de la visibilité');
    }
  };

  const deleteQuestionnaire = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce questionnaire ?')) {
      try {
        await axios.delete(`/questionnaires/${id}`);
        
        setQuestionnaires(prevQuestionnaires => 
          prevQuestionnaires.filter(q => q._id !== id)
        );
        
        if (questionnaires.length === 1 && currentPage > 1) {
          fetchQuestionnaires(currentPage - 1);
        }
        
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du questionnaire');
      }
    }
  };

  const duplicateQuestionnaire = async (id) => {
    try {
      const response = await axios.post(`/questionnaires/${id}/duplicate`);
      
      setQuestionnaires(prevQuestionnaires => [
        response.data,
        ...prevQuestionnaires
      ]);
      
      alert('✅ Questionnaire dupliqué avec succès !');
      
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      alert('Erreur lors de la duplication du questionnaire');
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

  // Configuration des filtres pour UnifiedFilterSystem
  const filtersConfig = [
    {
      key: 'modality',
      title: 'Modalités',
      icon: '📊',
      options: modalities,
      selectedValues: modalityFilters,
      onChange: setModalityFilters
    },
    {
      key: 'specialty',
      title: 'Spécialités',
      icon: '🏥',
      options: specialties,
      selectedValues: specialtyFilters,
      onChange: setSpecialtyFilters
    },
    {
      key: 'location',
      title: 'Localisation',
      icon: '📍',
      options: locations,
      selectedValues: locationFilters,
      onChange: setLocationFilters
    }
  ];

  // Fonction pour vérifier si des filtres sont actifs
  const hasActiveFilters = modalityFilters.length > 0 || specialtyFilters.length > 0 || locationFilters.length > 0;

  return (
    <PageContainer>
      {/* BOUTONS D'ACTIONS PRINCIPAUX */}
      <TopActionsContainer>
        <ActionButton 
          as={Link} 
          to="/create" 
          variant="primary"
          style={{ padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: '600', textAlign: 'center' }}
        >
          ➕ CRÉER UN NOUVEAU QUESTIONNAIRE
        </ActionButton>

        <TutorialButton onClick={() => setShowTutorial(true)}>
          📚 Voir le tutoriel
        </TutorialButton>
      </TopActionsContainer>

      {/* CONTENU PRINCIPAL */}
      <ListContainer>
        {/* BARRE DE RECHERCHE */}
        <SearchInput
          className="search-bar"
          type="text"
          placeholder="🔍 Rechercher un questionnaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* NOUVEAU SYSTÈME DE FILTRES UNIFIÉ */}
        <div className="filter-section" style={{ marginBottom: '2rem' }}>
          <UnifiedFilterSystem
            filters={filtersConfig}
            style={{ justifyContent: 'flex-start' }}
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
                  : "Vous n'avez pas encore créé de questionnaire."}
            </p>
          </EmptyState>
        ) : (
          <>
            {/* GRILLE DES QUESTIONNAIRES */}
            <QuestionnairesGrid>
              {filteredQuestionnaires.map((questionnaire) => (
                <QuestionnaireCard key={questionnaire._id} className="questionnaire-card">
                  <CardHeader>
                    <QuestionnaireTitle>
                      <QuestionnaireIcon>
                        {getQuestionnaireIcon(questionnaire.tags)}
                      </QuestionnaireIcon>
                      {questionnaire.title}
                    </QuestionnaireTitle>
                  </CardHeader>

                  {/* Section Tags avec gestion */}
                  <TagsSection>
                    <TagsContainer>
                      {questionnaire.tags && questionnaire.tags.map((tag, index) => (
                        <Tag key={index}>
                          {tag}
                          <RemoveTagButton 
                            onClick={() => handleRemoveTag(questionnaire._id, tag)}
                            title="Supprimer ce tag"
                          >
                            <X size={12} />
                          </RemoveTagButton>
                        </Tag>
                      ))}
                    </TagsContainer>
                    
                    <AddTagSection>
                      {isAddingTag[questionnaire._id] ? (
                        <TagForm onSubmit={(e) => handleTagSubmit(e, questionnaire._id)}>
                          <TagInput
                            type="text"
                            value={newTags[questionnaire._id] || ''}
                            onChange={(e) => setNewTags(prev => ({ 
                              ...prev, 
                              [questionnaire._id]: e.target.value 
                            }))}
                            placeholder="Nouveau tag"
                            autoFocus
                          />
                          <SubmitTagButton type="submit" title="Ajouter le tag">
                            <Plus size={12} />
                          </SubmitTagButton>
                          <CancelTagButton 
                            type="button"
                            onClick={() => {
                              setIsAddingTag(prev => ({ ...prev, [questionnaire._id]: false }));
                              setNewTags(prev => ({ ...prev, [questionnaire._id]: '' }));
                            }}
                            title="Annuler"
                          >
                            <X size={12} />
                          </CancelTagButton>
                        </TagForm>
                      ) : (
                        <AddTagButton 
                          onClick={() => setIsAddingTag(prev => ({ ...prev, [questionnaire._id]: true }))}
                          title="Ajouter un tag"
                        >
                          <Plus size={12} />
                          Ajouter tag
                        </AddTagButton>
                      )}
                    </AddTagSection>
                  </TagsSection>

                  {/* Métadonnées */}
                  <CardMeta>
                    <MetaItem>
                      <Clock />
                      <span>{formatDate(questionnaire.updatedAt || questionnaire.createdAt)}</span>
                    </MetaItem>
                    <MetaItem>
                      <Users />
                      <span>Personnel</span>
                    </MetaItem>
                    <MetaItem>
                      <FileText />
                      <span>{questionnaire.public ? 'Public' : 'Privé'}</span>
                    </MetaItem>
                    <MetaItem>
                      <Clock />
                      <span>{estimateTime(questionnaire)}</span>
                    </MetaItem>
                  </CardMeta>

                  {/* Actions */}
                  <ActionButtons>
                    <ActionButton 
                      to={`/use/${questionnaire._id}`}
                      variant="primary" 
                      size="large"
                    >
                      ▶️ UTILISER
                    </ActionButton>
                    
                    <ActionButton 
                      to={`/edit/${questionnaire._id}`}
                      variant="secondary"
                    >
                      <Edit />
                      MODIFIER
                    </ActionButton>
                    
                    <ActionButton 
                      to={`/cr/${questionnaire._id}`}
                      variant="secondary"
                    >
                      <FileText />
                      CR
                    </ActionButton>
                    
                    <Button 
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        duplicateQuestionnaire(questionnaire._id);
                      }}
                    >
                      <Copy />
                      DUPLIQUER
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleVisibility(questionnaire._id, questionnaire.public);
                      }}
                    >
                      {questionnaire.public ? <EyeOff /> : <Eye />}
                      {questionnaire.public ? 'Rendre privé' : 'Rendre public'}
                    </Button>
                    
                    <DeleteButton 
                      onClick={() => deleteQuestionnaire(questionnaire._id)}
                      title="Supprimer ce questionnaire"
                    >
                      <Trash2 />
                    </DeleteButton>
                  </ActionButtons>
                </QuestionnaireCard>
              ))}
            </QuestionnairesGrid>

            {/* INFO SUR LE NOMBRE DE RÉSULTATS */}
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
              {filteredQuestionnaires.length} questionnaire{filteredQuestionnaires.length > 1 ? 's' : ''} trouvé{filteredQuestionnaires.length > 1 ? 's' : ''}
              {hasActiveFilters && ' avec les filtres appliqués'}
            </div>
          </>
        )}

        {/* TUTORIEL OVERLAY */}
        {showTutorial && (
          <TutorialOverlay 
            steps={tutorialSteps} 
            onClose={() => setShowTutorial(false)} 
          />
        )}

        {/* VIDÉOS TUTORIELS */}
        <VideoContainer>
          <h3>📺 Tutoriel vidéo</h3>
          <div className="video-wrapper">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/h525ujn4jBc"
              title="Tutoriel questionnaires"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </VideoContainer>

        <VideoContainer>
          <h3>📺 Tutoriel avancé</h3>
          <div className="video-wrapper">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/oIC9UXnVnOk"
              title="Tutoriel avancé questionnaires"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </VideoContainer>
      </ListContainer>
    </PageContainer>
  );
}

export default QuestionnaireListPage;