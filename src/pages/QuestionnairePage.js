// pages/QuestionnairePage.js - VERSION COMPLÈTE AVEC SHARED COMPONENTS
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp, Trash2, Clock, Users, FileText } from 'lucide-react';

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
  FilterIndicator,
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
  const [isModalityDropdownOpen, setIsModalityDropdownOpen] = useState(false);
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

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
          limit: 12, // Uniformisé avec les autres pages
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleModalityFilter = (modality) => {
    setModalityFilters(prev => {
      if (prev.includes(modality)) {
        return prev.filter(m => m !== modality);
      } else {
        return [...prev, modality];
      }
    });
  };

  const handleSpecialtyFilter = (specialty) => {
    setSpecialtyFilters(prev => {
      if (prev.includes(specialty)) {
        return prev.filter(s => s !== specialty);
      } else {
        return [...prev, specialty];
      }
    });
  };

  const handleLocationFilter = (location) => {
    setLocationFilters(prev => {
      if (prev.includes(location)) {
        return prev.filter(l => l !== location);
      } else {
        return [...prev, location];
      }
    });
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
      <FilterSection>
        <FilterGroup>
          <FilterTitle>📊 Modalités</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setIsModalityDropdownOpen(!isModalityDropdownOpen)}>
              Modalités ({modalityFilters.length})
              {isModalityDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </DropdownButton>
            {isModalityDropdownOpen && (
              <DropdownContent>
                {modalityOptions.map(modality => (
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
            <DropdownButton onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}>
              Spécialités ({specialtyFilters.length})
              {isSpecialtyDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </DropdownButton>
            {isSpecialtyDropdownOpen && (
              <DropdownContent>
                {specialtyOptions.map(specialty => (
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
            <DropdownButton onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}>
              Localisation ({locationFilters.length})
              {isLocationDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </DropdownButton>
            {isLocationDropdownOpen && (
              <DropdownContent>
                {locationOptions.map(location => (
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

        {(modalityFilters.length > 0 || specialtyFilters.length > 0 || locationFilters.length > 0) && (
          <FilterIndicator>
            Filtres appliqués : 
            {[...modalityFilters, ...specialtyFilters, ...locationFilters].join(', ')}
          </FilterIndicator>
        )}
      </FilterSection>

      {/* CONTENU PRINCIPAL */}
      <ListContainer>
        {/* BARRE DE RECHERCHE */}
        <SearchInput
          type="text"
          placeholder="🔍 Rechercher un questionnaire..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {/* GRILLE DES QUESTIONNAIRES */}
        <QuestionnairesGrid>
          {questionnaires.map((questionnaire) => (
            <QuestionnaireCard key={questionnaire._id}>
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
                <ActionButton to={`/use/${questionnaire._id}`}>
                  ▶️ UTILISER
                </ActionButton>
                
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
            <PaginationButton onClick={() => fetchQuestionnaires(currentPage - 1)} disabled={currentPage === 1}>
              Précédent
            </PaginationButton>
            <PaginationInfo>Page {currentPage} sur {totalPages}</PaginationInfo>
            <PaginationButton onClick={() => fetchQuestionnaires(currentPage + 1)} disabled={currentPage === totalPages}>
              Suivant
            </PaginationButton>
          </PaginationContainer>
        )}
      </ListContainer>
    </PageContainer>
  );
}

export default QuestionnairePage;