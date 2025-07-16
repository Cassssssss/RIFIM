// pages/QuestionnaireListPage.js - VERSION COMPLÈTE AVEC GESTION DES TAGS
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp, Edit, FileText, Copy, Trash2, Eye, EyeOff, Clock, Users, Plus, X } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

// ==================== STYLED COMPONENTS ====================

const PageContainer = styled.div`
  display: flex;
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const FilterSection = styled.div`
  width: 280px;
  margin-right: 2rem;
  background-color: ${props => props.theme.card};
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  height: fit-content;

  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: ${props => props.theme.text};
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hover};
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
`;

const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  input {
    margin-right: 0.75rem;
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.primary};
  }

  span {
    font-weight: 500;
  }
`;

const ListContainer = styled.div`
  flex: 1;
  max-width: calc(100% - 300px);

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const QuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const QuestionnaireCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

const QuestionnaireTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  line-height: 1.4;
`;

const QuestionnaireIcon = styled.span`
  font-size: 1.5rem;
  flex-shrink: 0;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  font-weight: 500;

  svg {
    color: ${props => props.theme.primary};
    flex-shrink: 0;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
`;

const ActionButton = styled(Link)`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.backgroundSecondary;
      case 'danger': return '#ef4444';
      default: return props.theme.primary;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.text;
      default: return 'white';
    }
  }};
  padding: ${props => props.size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.border;
      default: return 'transparent';
    }
  }};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: ${props => props.size === 'large' ? '0.95rem' : '0.85rem'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Button = styled.button`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.backgroundSecondary;
      case 'danger': return '#ef4444';
      default: return props.theme.primary;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.text;
      default: return 'white';
    }
  }};
  padding: ${props => props.variant === 'danger' ? '0.25rem 0.5rem' : '0.5rem 1rem'};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.border;
      default: return 'transparent';
    }
  }};
  border-radius: 8px;
  font-weight: 500;
  font-size: ${props => props.variant === 'danger' ? '0.75rem' : '0.85rem'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  svg {
    width: ${props => props.variant === 'danger' ? '12px' : '16px'};
    height: ${props => props.variant === 'danger' ? '12px' : '16px'};
  }
`;

const TutorialButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
  }
`;

const VideoContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};

  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 1rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: 8px;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 8px;
    }
  }
`;

// ==================== STYLED COMPONENTS POUR LES TAGS ====================

const TagsSection = styled.div`
  margin: 1rem 0;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.7;
  }
`;

const AddTagSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const AddTagButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const TagInput = styled.input`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 0.75rem;
  width: 120px;
`;

const TagForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SubmitTagButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }
`;

const CancelTagButton = styled.button`
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    background-color: #4b5563;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  font-size: 1.1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  margin: 1rem 0;
`;

// ==================== COMPOSANT PRINCIPAL ====================

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

  // Fonction de récupération des questionnaires
  const fetchQuestionnaires = useCallback(async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        search: searchTerm,
        modality: modalityFilters.join(','),
        specialty: specialtyFilters.join(','),
        location: locationFilters.join(',')
      });

      const response = await axios.get(`/questionnaires?${params}`);
      setQuestionnaires(response.data.questionnaires);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalQuestionnaires(response.data.totalQuestionnaires);
    } catch (error) {
      console.error('Erreur lors de la récupération des questionnaires:', error);
    }
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  // Effet pour charger les questionnaires
  useEffect(() => {
    fetchQuestionnaires(1);
  }, [fetchQuestionnaires]);

  // ========== FONCTIONS POUR LA GESTION DES TAGS ==========

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

  // Fonction de changement de visibilité
  const toggleVisibility = async (id, isPublic) => {
    try {
      await axios.patch(`/questionnaires/${id}/togglePublic`);
      fetchQuestionnaires(currentPage);
    } catch (error) {
      console.error('Erreur lors de la modification de la visibilité:', error);
      alert('Erreur lors de la modification de la visibilité');
    }
  };

  // Fonction de suppression
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

  // Fonctions utilitaires
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
      </FilterSection>

      {/* CONTENU PRINCIPAL */}
      <ListContainer>
        {/* BARRE DE RECHERCHE */}
        <SearchBar
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

              {/* ========== SECTION TAGS AVEC GESTION ========== */}
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

              {/* Actions - LIENS ORIGINAUX CONSERVÉS */}
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
                    // TODO: Logique de duplication
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
                
                <Button 
                  variant="danger"
                  onClick={() => deleteQuestionnaire(questionnaire._id)}
                >
                  <Trash2 />
                  SUPPRIMER
                </Button>
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

        {/* BOUTON CRÉER */}
        <ActionButton 
          as={Link} 
          to="/create" 
          variant="primary"
          style={{ marginTop: '2rem', padding: '0.75rem 2rem', display: 'inline-flex' }}
        >
          CRÉER UN NOUVEAU QUESTIONNAIRE
        </ActionButton>

        {/* BOUTON TUTORIEL */}
        <TutorialButton onClick={() => setShowTutorial(true)}>
          📚 Voir le tutoriel
        </TutorialButton>

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