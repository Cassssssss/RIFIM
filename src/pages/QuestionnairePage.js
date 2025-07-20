// pages/QuestionnairePage.js - VERSION COMPLÈTE AVEC STYLE HARMONISÉ
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp, Trash2, Clock, Users, FileText } from 'lucide-react';

// ==================== STYLED COMPONENTS HARMONISÉS ====================

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

const FilterIndicator = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.primary};
  padding: 0.5rem;
  background-color: ${props => props.theme.background};
  border-radius: 4px;
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

// ==================== NOUVELLE GRILLE POUR CARTES ====================
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

const QuestionnaireTitle = styled(Link)`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  line-height: 1.4;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
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

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
  justify-content: space-between;
`;

const ActionButton = styled(Link)`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
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

// ==================== BOUTON SUPPRIMER RÉDUIT À L'ICÔNE SEULEMENT ====================
const DeleteButton = styled.button`
  background-color: #ef4444;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 40px;
  height: 40px;

  &:hover {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

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
    // CORRECTION : Utiliser la route /my pour récupérer les questionnaires de l'utilisateur connecté
    const response = await axios.get('/questionnaires/my', {
      params: {
        page,
        limit: 10,
        search: searchTerm,
        modality: modalityFilters.join(','),
        specialty: specialtyFilters.join(','),
        location: locationFilters.join(',')
      }
    });
    
    // Vérification de sécurité pour s'assurer que questionnaires est un tableau
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

  // ========== FONCTION DE SUPPRESSION ==========
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
        <SearchBar
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
                <QuestionnaireTitle to={`/use/${questionnaire._id}`}>
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
                
                {/* BOUTON SUPPRIMER RÉDUIT À L'ICÔNE SEULEMENT */}
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