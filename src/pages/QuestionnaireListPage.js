// pages/QuestionnaireListPage.js - VERSION CORRIGÉE AVEC NAVIGATION ORIGINALE
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp, Edit, FileText, Copy, Trash2, Eye, EyeOff, Clock, Users } from 'lucide-react';
import TutorialOverlay from './TutorialOverlay';

// ==================== STYLED COMPONENTS AMÉLIORÉS ====================

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

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.text};

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  input {
    margin-right: 0.5rem;
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.primary};
  }
`;

const ListContainer = styled.div`
  flex-grow: 1;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 2rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.backgroundSolid};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.borderFocus};
    box-shadow: 0 0 0 3px ${props => props.theme.focus};
  }

  &::placeholder {
    color: ${props => props.theme.textLight};
  }
`;

// Cartes modernes au lieu de liste
const QuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QuestionnaireCard = styled.div`
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadowMedium};
    border-color: ${props => props.theme.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const QuestionnaireTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionnaireIcon = styled.div`
  width: 24px;
  height: 24px;
  background: ${props => props.theme.primary};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.tagBackground};
  color: ${props => props.theme.tagText};
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
`;

const CardMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme.cardSecondary};
  border-radius: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.primary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const ActionButton = styled(Link)`
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.buttonSecondary;
      case 'danger': return props.theme.errorLight;
      default: return props.theme.buttonSecondary;
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.textInverse;
      case 'secondary': return props.theme.buttonSecondaryText;
      case 'danger': return props.theme.buttonDanger;
      default: return props.theme.buttonSecondaryText;
    }
  }};
  padding: ${props => props.size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.border}` : 'none'};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: ${props => props.size === 'large' ? '0.95rem' : '0.85rem'};
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
  ${props => props.size === 'large' && 'flex: 1; min-width: 140px;'}

  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'primary': return props.theme.primaryHover;
        case 'secondary': return props.theme.hover;
        case 'danger': return props.theme.buttonDanger;
        default: return props.theme.hover;
      }
    }};
    color: ${props => props.variant === 'danger' ? props.theme.textInverse : 'inherit'};
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const Button = styled.button`
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.buttonSecondary;
      case 'danger': return props.theme.errorLight;
      default: return props.theme.buttonSecondary;
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.textInverse;
      case 'secondary': return props.theme.buttonSecondaryText;
      case 'danger': return props.theme.buttonDanger;
      default: return props.theme.buttonSecondaryText;
    }
  }};
  padding: 0.5rem 1rem;
  border: ${props => props.variant === 'secondary' ? `1px solid ${props.theme.border}` : 'none'};
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => {
      switch (props.variant) {
        case 'primary': return props.theme.primaryHover;
        case 'secondary': return props.theme.hover;
        case 'danger': return props.theme.buttonDanger;
        default: return props.theme.hover;
      }
    }};
    color: ${props => props.variant === 'danger' ? props.theme.textInverse : 'inherit'};
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const TutorialButton = styled.button`
  background-color: ${props => props.theme.secondary};
  color: ${props => props.theme.textInverse};
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  margin-top: 2rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondaryHover};
    transform: translateY(-1px);
  }
`;

const VideoContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};

  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
    font-size: 1.2rem;
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

const FilterDropdown = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.5rem;
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  color: ${props => props.theme.text};
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 10;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
`;

const DropdownOption = styled.label`
  display: block;
  padding: 0.5rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  
  &:hover {
    background-color: ${props => props.theme.hover};
  }
`;

// ==================== HELPER FUNCTIONS ====================

const getQuestionnaireIcon = (tags) => {
  if (tags?.includes('IRM')) return '🧠';
  if (tags?.includes('TDM')) return '🫁';
  if (tags?.includes('Echo')) return '❤️';
  if (tags?.includes('Rx')) return '🦴';
  return '📋';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
  return `Il y a ${Math.ceil(diffDays / 30)} mois`;
};

const estimateTime = (questionnaire) => {
  const questionCount = questionnaire.questions?.length || 0;
  const estimatedMinutes = Math.max(2, Math.ceil(questionCount * 0.5));
  return `~${estimatedMinutes} min`;
};

// ==================== COMPONENT PRINCIPAL ====================

function QuestionnaireListPage() {
  // États
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

  // Données de filtres
  const modalities = ['Rx', 'TDM', 'IRM', 'Echo'];
  const specialties = ['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo', 'Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'];
  const locations = ['Genou', 'Épaule', 'Rachis', 'Cheville', 'Poignet', 'Hanche'];

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
      await axios.patch(`/questionnaires/${id}`, { public: !isPublic });
      fetchQuestionnaires(currentPage);
    } catch (error) {
      console.error('Erreur lors de la modification de la visibilité:', error);
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
      }
    }
  };

  // Steps du tutoriel
  const tutorialSteps = [
    {
      image: ['/tutorials/questionnaire-1.png'],
      description: 'Bienvenue dans la liste de vos questionnaires ! Ici vous pouvez voir tous vos questionnaires créés.'
    },
    {
      image: ['/tutorials/questionnaire-2.png'], 
      description: 'Utilisez les filtres à gauche pour rechercher par modalité, spécialité ou localisation.'
    },
    {
      image: ['/tutorials/questionnaire-3.png'],
      description: 'Cliquez sur UTILISER pour remplir un questionnaire, ou sur les autres boutons pour le modifier.'
    }
  ];

  // ==================== RENDU COMPONENT ====================

  return (
    <PageContainer>
      {/* SIDEBAR - FILTRES */}
      <FilterSection>
        <FilterGroup>
          <FilterTitle>🔍 Modalités</FilterTitle>
          {modalities.map(modality => (
            <FilterOption key={modality}>
              <input
                type="checkbox"
                checked={modalityFilters.includes(modality)}
                onChange={() => handleModalityFilter(modality)}
              />
              <span>{modality}</span>
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup>
          <FilterTitle>🏥 Spécialités</FilterTitle>
          {specialties.map(specialty => (
            <FilterOption key={specialty}>
              <input
                type="checkbox"
                checked={specialtyFilters.includes(specialty)}
                onChange={() => handleSpecialtyFilter(specialty)}
              />
              <span>{specialty}</span>
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup>
          <FilterTitle>📍 Localisation</FilterTitle>
          <FilterDropdown>
            <DropdownButton onClick={() => setLocationDropdownOpen(!locationDropdownOpen)}>
              <span>Sélectionner</span>
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
          type="text"
          placeholder="🔍 Rechercher un questionnaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
              {questionnaire.tags && questionnaire.tags.length > 0 && (
                <TagsContainer>
                  {questionnaire.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagsContainer>
              )}

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
                
                <ActionButton 
                  to="#"
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: Logique de duplication
                    console.log('Dupliquer:', questionnaire._id);
                  }}
                >
                  <Copy />
                  DUPLIQUER
                </ActionButton>
                
                <Button 
                  variant="secondary"
                  onClick={() => toggleVisibility(questionnaire._id, questionnaire.public)}
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