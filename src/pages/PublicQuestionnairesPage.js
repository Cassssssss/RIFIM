import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp, Clock, Users, FileText } from 'lucide-react';

// ==================== STYLED COMPONENTS HARMONISÉS AVEC LE THÈME ====================

const ModernPageContainer = styled.div`
  display: flex;
  background: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const ModernFilterSection = styled.div`
  width: 320px;
  margin-right: 2rem;
  background-color: ${props => props.theme.card};
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  height: fit-content;
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

  svg {
    transition: transform 0.3s ease;
  }

  &[data-open="true"] svg {
    transform: rotate(180deg);
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
  z-index: 1000;
  box-shadow: 0 4px 6px ${props => props.theme.shadow};
`;

const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
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
    color: ${props => props.theme.text};
  }
`;

const ModernListContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ModernTitle = styled.h1`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
  margin-bottom: 2rem;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  &::before {
    content: '🌐';
    font-size: 2rem;
  }
`;

const ModernSearchBar = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1.1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  margin-bottom: 2rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const ModernQuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ModernQuestionnaireCard = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
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
    transform: translateY(-4px);
    box-shadow: 0 8px 30px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const ModernCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const ModernCardTitle = styled.h3`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
  line-height: 1.3;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ModernCardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const ModernMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;

  svg {
    color: ${props => props.theme.primary};
  }
`;

const ModernCardActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const PrimaryActionButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.primaryHover || props.theme.secondary});
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.primary}30;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.primary}40;
  }
`;

const SecondaryActionButton = styled(Link)`
  background: linear-gradient(135deg, ${props => props.theme.secondary}, ${props => props.theme.secondaryHover || props.theme.primary});
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.secondary}30;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.secondary}40;
  }
`;

const ModernTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const ModernTag = styled.span`
  background: linear-gradient(135deg, ${props => props.theme.tagBackground || props.theme.primary}, ${props => props.theme.primary});
  color: ${props => props.theme.tagText || 'white'};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  box-shadow: 0 1px 3px ${props => props.theme.shadow};
`;

const FilterIndicator = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.primary}15, ${props => props.theme.secondary}15);
  border: 1px solid ${props => props.theme.primary}30;
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.primary};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.2rem;
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};
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

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.border};

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: ${props => props.theme.text};
    margin-bottom: 1rem;
  }

  p {
    color: ${props => props.theme.textSecondary};
    font-size: 1.1rem;
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

function PublicQuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilters, setModalityFilters] = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  
  // États pour les menus dépliants
  const [isModalityDropdownOpen, setIsModalityDropdownOpen] = useState(false);
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const modalityOptions = ['Rx', 'TDM', 'IRM', 'Echo'];
  const specialtyOptions = ['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo','Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'];
  const locationOptions = [
    "Avant-pied", "Bras", "Bassin", "Cheville", "Coude", "Cuisse", "Doigts", "Epaule", 
    "Genou", "Hanche", "Jambe", "Parties molles", "Poignet", "Rachis"
  ];

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/questionnaires/public', {
        params: {
          page,
          limit: 12,
          search: searchTerm,
          modality: modalityFilters.join(','),
          specialty: specialtyFilters.join(','),
          location: locationFilters.join(',')
        }
      });
      if (response.data && response.data.questionnaires) {
        setQuestionnaires(response.data.questionnaires);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("Format de réponse inattendu:", response.data);
        setQuestionnaires([]);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des questionnaires publics:', error);
      setError("Impossible de charger les questionnaires publics. Veuillez réessayer plus tard.");
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchQuestionnaires(1);
    }, 300);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters, fetchQuestionnaires]);

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

  const addToMyQuestionnaires = async (questionnaireId) => {
    try {
      await axios.post(`/questionnaires/${questionnaireId}/copy`);
      alert('✅ Questionnaire ajouté à votre collection privée avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du questionnaire:', error);
      alert('❌ Erreur lors de l\'ajout du questionnaire. Veuillez réessayer.');
    }
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

  const getQuestionnaireIcon = (tags) => {
    if (!tags || tags.length === 0) return '📋';
    if (tags.includes('IRM') || tags.includes('irm')) return '🧲';
    if (tags.includes('TDM') || tags.includes('tdm')) return '🔍';
    if (tags.includes('Rx') || tags.includes('rx')) return '🩻';
    if (tags.includes('Echo') || tags.includes('echo')) return '📡';
    return '📋';
  };

  return (
    <ModernPageContainer>
      {/* SECTION FILTRES AVEC MENUS DÉPLIANTS */}
      <ModernFilterSection>
        <FilterGroup>
          <FilterTitle>📊 Modalités</FilterTitle>
          <FilterDropdown>
            <DropdownButton 
              onClick={() => setIsModalityDropdownOpen(!isModalityDropdownOpen)}
              data-open={isModalityDropdownOpen}
            >
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
            <DropdownButton 
              onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
              data-open={isSpecialtyDropdownOpen}
            >
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
            <DropdownButton 
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              data-open={isLocationDropdownOpen}
            >
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
            Filtres actifs : {[...modalityFilters, ...specialtyFilters, ...locationFilters].join(', ')}
          </FilterIndicator>
        )}
      </ModernFilterSection>

      <ModernListContainer>
        <ModernTitle>Questionnaires Publics</ModernTitle>
        
        <ModernSearchBar
          type="text"
          placeholder="🔍 Rechercher un questionnaire..."
          value={searchTerm}
          onChange={handleSearch}
        />

        {isLoading ? (
          <LoadingMessage>
            Chargement des questionnaires publics...
          </LoadingMessage>
        ) : error ? (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        ) : questionnaires.length === 0 ? (
          <EmptyState>
            <h3>Aucun questionnaire trouvé</h3>
            <p>
              {searchTerm || modalityFilters.length > 0 || specialtyFilters.length > 0 || locationFilters.length > 0
                ? 'Essayez de modifier vos critères de recherche ou vos filtres.'
                : 'Il n\'y a pas encore de questionnaires publics disponibles.'
              }
            </p>
          </EmptyState>
        ) : (
          <>
            <ModernQuestionnairesGrid>
              {questionnaires.map(questionnaire => (
                <ModernQuestionnaireCard key={questionnaire._id}>
                  <ModernCardHeader>
                    <ModernCardTitle>
                      {getQuestionnaireIcon(questionnaire.tags)}
                      {questionnaire.title}
                    </ModernCardTitle>
                  </ModernCardHeader>

                  <ModernCardMeta>
                    <ModernMetaItem>
                      <Clock size={16} />
                      {formatDate(questionnaire.createdAt)}
                    </ModernMetaItem>
                    <ModernMetaItem>
                      <Users size={16} />
                      Public
                    </ModernMetaItem>
                    <ModernMetaItem>
                      <FileText size={16} />
                      {estimateTime(questionnaire)}
                    </ModernMetaItem>
                  </ModernCardMeta>

                  {questionnaire.tags && questionnaire.tags.length > 0 && (
                    <ModernTagsContainer>
                      {questionnaire.tags.map((tag, index) => (
                        <ModernTag key={index}>{tag}</ModernTag>
                      ))}
                    </ModernTagsContainer>
                  )}

                  <ModernCardActions>
                    <PrimaryActionButton onClick={() => addToMyQuestionnaires(questionnaire._id)}>
                      ➕ Ajouter à mes questionnaires
                    </PrimaryActionButton>
                    <SecondaryActionButton to={`/use/${questionnaire._id}`}>
                      ▶️ UTILISER
                    </SecondaryActionButton>
                  </ModernCardActions>
                </ModernQuestionnaireCard>
              ))}
            </ModernQuestionnairesGrid>

            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton 
                  onClick={() => fetchQuestionnaires(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </PaginationButton>
                <PaginationInfo>
                  Page {currentPage} sur {totalPages}
                </PaginationInfo>
                <PaginationButton 
                  onClick={() => fetchQuestionnaires(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </PaginationButton>
              </PaginationContainer>
            )}
          </>
        )}
      </ModernListContainer>
    </ModernPageContainer>
  );
}

export default PublicQuestionnairesPage;