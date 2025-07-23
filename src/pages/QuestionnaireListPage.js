// pages/QuestionnaireListPage.js - VERSION COMPLÈTE AVEC SHARED COMPONENTS
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp, Edit, FileText, Copy, Trash2, Eye, EyeOff, Clock, Users, Plus, X } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

// Import des composants partagés
import {
  PageContainer,
  FilterSection,
  FilterGroup,
  FilterTitle,
  FilterDropdown,
  DropdownButton,
  DropdownContent,
  DropdownOption,
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
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [modalityDropdownOpen, setModalityDropdownOpen] = useState(false);
  const [specialtyDropdownOpen, setSpecialtyDropdownOpen] = useState(false);

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

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12', // Uniformisé avec les autres pages
        search: searchTerm,
        modality: modalityFilters.join(','),
        specialty: specialtyFilters.join(','),
        location: locationFilters.join(',')
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
    }
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

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

  // Handlers des filtres
  const handleModalityFilter = (modality) => {
    setModalityFilters(prev => 
      prev.includes(modality) 
        ? prev.filter(m => m !== modality)
        : [...prev, modality]
    );
  };

  const handleSpecialtyFilter = (specialty) => {
    setSpecialtyFilters(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleLocationFilter = (location) => {
    setLocationFilters(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  const toggleVisibility = async (id, isPublic) => {
    try {
      await axios.patch(`/questionnaires/${id}/togglePublic`);
      fetchQuestionnaires(currentPage);
    } catch (error) {
      console.error('Erreur lors de la modification de la visibilité:', error);
      alert('Erreur lors de la modification de la visibilité');
    }
  };

  const deleteQuestionnaire = async (id) => {
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

  return (
    <PageContainer>
      {/* SECTION FILTRES */}
      <FilterSection className="filter-section">
        <FilterGroup>
          <FilterTitle>📊 Modalités</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setModalityDropdownOpen(!modalityDropdownOpen)}>
              Modalités ({modalityFilters.length})
              {modalityDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </DropdownButton>
            {modalityDropdownOpen && (
              <DropdownContent>
                {modalities.map(modality => (
                  <DropdownOption key={modality}>
                    <input
                      type="checkbox"
                      checked={modalityFilters.includes(modality)}
                      onChange={() => handleModalityFilter(modality)}
                    />
                    <span>{modality}</span>
                  </DropdownOption>
                ))}
              </DropdownContent>
            )}
          </FilterDropdown>
        </FilterGroup>

        <FilterGroup>
          <FilterTitle>🏥 Spécialités</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setSpecialtyDropdownOpen(!specialtyDropdownOpen)}>
              Spécialités ({specialtyFilters.length})
              {specialtyDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </DropdownButton>
            {specialtyDropdownOpen && (
              <DropdownContent>
                {specialties.map(specialty => (
                  <DropdownOption key={specialty}>
                    <input
                      type="checkbox"
                      checked={specialtyFilters.includes(specialty)}
                      onChange={() => handleSpecialtyFilter(specialty)}
                    />
                    <span>{specialty}</span>
                  </DropdownOption>
                ))}
              </DropdownContent>
            )}
          </FilterDropdown>
        </FilterGroup>

        <FilterGroup>
          <FilterTitle>📍 Localisation</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}>
              Localisation ({locationFilters.length})
              {locationDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </DropdownButton>
            {locationDropdownOpen && (
              <DropdownContent>
                {locations.map(location => (
                  <DropdownOption key={location}>
                    <input
                      type="checkbox"
                      checked={locationFilters.includes(location)}
                      onChange={() => handleLocationFilter(location)}
                    />
                    <span>{location}</span>
                  </DropdownOption>
                ))}
              </DropdownContent>
            )}
          </FilterDropdown>
        </FilterGroup>

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
      </FilterSection>

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

        {/* GRILLE DES QUESTIONNAIRES */}
        <QuestionnairesGrid>
          {questionnaires.map((questionnaire) => (
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
                    console.log('Dupliquer:', questionnaire._id);
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

        {/* PAGINATION */}
        {totalPages > 1 && (
          <PaginationContainer>
            <PaginationButton
              onClick={() => fetchQuestionnaires(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </PaginationButton>
            <PaginationInfo>
              Page {currentPage} sur {totalPages}
            </PaginationInfo>
            <PaginationButton
              onClick={() => fetchQuestionnaires(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </PaginationButton>
          </PaginationContainer>
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