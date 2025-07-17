import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp, Clock, Users, FileText } from 'lucide-react';

// ==================== STYLED COMPONENTS HARMONISÉS AVEC LE THÈME ====================

const ModernPageContainer = styled.div`
  display: flex;
  background: linear-gradient(135deg, ${props => props.theme.background} 0%, ${props => props.theme.backgroundSecondary || props.theme.card} 100%);
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
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.theme.hover};
    transform: translateX(2px);
  }

  input {
    margin-right: 0.75rem;
    width: 18px;
    height: 18px;
    accent-color: ${props => props.theme.primary};
    cursor: pointer;
  }
`;

const FilterIndicator = styled.div`
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: ${props => props.theme.primary};
  padding: 1rem;
  background-color: ${props => props.theme.background};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  font-weight: 500;

  &::before {
    content: '🔍';
    margin-right: 0.5rem;
  }
`;

const ModernListContainer = styled.div`
  flex-grow: 1;
  max-width: calc(100% - 340px);

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const ModernTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-weight: 700;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '🌐';
    font-size: 2rem;
    -webkit-text-fill-color: initial;
  }
`;

const ModernSearchBar = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20, 0 4px 12px ${props => props.theme.shadow};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary || props.theme.textLight};
  }
`;

const QuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ModernQuestionnaireCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
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
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary}50;
  }
`;

const QuestionnaireTitle = styled(Link)`
  color: ${props => props.theme.primary};
  font-size: 1.3rem;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  
  &:hover {
    text-decoration: underline;
  }

  &::before {
    content: '📋';
    font-size: 1.5rem;
  }
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary || props.theme.background};
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
  gap: 0.75rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const PrimaryActionButton = styled.button`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.primaryHover || props.theme.secondary});
  color: ${props => props.theme.buttonText || 'white'};
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px ${props => props.theme.primary}30;
  
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
  z-index: 10;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.primary};
    border-radius: 3px;
  }
`;

const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  color: ${props => props.theme.text};
  transition: background-color 0.2s ease;
  font-weight: 500;

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  input {
    margin-right: 0.75rem;
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.primary};
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};

  &::before {
    content: '🔄';
    font-size: 2rem;
    display: block;
    margin-bottom: 1rem;
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.error || '#ef4444'};
  font-size: 1.1rem;
  background-color: ${props => props.theme.errorLight || '#fef2f2'};
  border: 2px solid ${props => props.theme.error || '#ef4444'}30;
  border-radius: 12px;
  margin: 2rem 0;
  font-weight: 500;

  &::before {
    content: '⚠️';
    font-size: 1.5rem;
    display: block;
    margin-bottom: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  margin: 2rem 0;

  &::before {
    content: '📚';
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
  }

  h3 {
    color: ${props => props.theme.primary};
    font-size: 1.5rem;
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
    fetchQuestionnaires(1);
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchQuestionnaires(1);
    }, 300);
  
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters, fetchQuestionnaires]);

  return (
    <ModernPageContainer>
      <ModernFilterSection>
        <FilterGroup>
          <FilterTitle>📊 Modalités</FilterTitle>
          {modalityOptions.map(modality => (
            <FilterOption key={modality}>
              <input
                type="checkbox"
                name="modality"
                value={modality}
                checked={modalityFilters.includes(modality)}
                onChange={() => handleModalityFilter(modality)}
              />
              {modality}
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup>
          <FilterTitle>🏥 Spécialités</FilterTitle>
          {specialtyOptions.map(specialty => (
            <FilterOption key={specialty}>
              <input
                type="checkbox"
                name="specialty"
                value={specialty}
                checked={specialtyFilters.includes(specialty)}
                onChange={() => handleSpecialtyFilter(specialty)}
              />
              {specialty}
            </FilterOption>
          ))}
        </FilterGroup>

        <FilterGroup>
          <FilterTitle>📍 Localisation</FilterTitle>
          <FilterDropdown>
            <DropdownButton 
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              data-open={isLocationDropdownOpen}
            >
              Sélectionner {locationFilters.length > 0 && `(${locationFilters.length})`}
              {isLocationDropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </DropdownButton>
            {isLocationDropdownOpen && (
              <DropdownContent>
                {locationOptions.map(location => (
                  <DropdownOption key={location}>
                    <input
                      type="checkbox"
                      name="location"
                      value={location}
                      checked={locationFilters.includes(location)}
                      onChange={() => handleLocationFilter(location)}
                    />
                    {location}
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
            <h3>Aucun questionnaire public trouvé</h3>
            <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
          </EmptyState>
        ) : (
          <QuestionnairesGrid>
            {questionnaires.map((questionnaire) => (
              <ModernQuestionnaireCard key={questionnaire._id}>
                <QuestionnaireTitle to={`/use/${questionnaire._id}`}>
                  {questionnaire.title}
                </QuestionnaireTitle>

                <ModernTagsContainer>
                  {questionnaire.tags && questionnaire.tags.map(tag => (
                    <ModernTag key={tag}>{tag}</ModernTag>
                  ))}
                </ModernTagsContainer>

                <CardMeta>
                  <MetaItem>
                    <Clock />
                    <span>{formatDate(questionnaire.updatedAt || questionnaire.createdAt)}</span>
                  </MetaItem>
                  <MetaItem>
                    <Users />
                    <span>Public</span>
                  </MetaItem>
                  <MetaItem>
                    <FileText />
                    <span>{estimateTime(questionnaire)}</span>
                  </MetaItem>
                </CardMeta>

                <ActionButtons>
                  <PrimaryActionButton onClick={() => addToMyQuestionnaires(questionnaire._id)}>
                    ➕ Ajouter à mes questionnaires
                  </PrimaryActionButton>
                  
                  <SecondaryActionButton to={`/use/${questionnaire._id}`}>
                    ▶️ UTILISER
                  </SecondaryActionButton>
                </ActionButtons>
              </ModernQuestionnaireCard>
            ))}
          </QuestionnairesGrid>
        )}

        {totalPages > 1 && (
          <PaginationContainer>
            <PaginationButton 
              onClick={() => fetchQuestionnaires(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              ← Précédent
            </PaginationButton>
            <PaginationInfo>
              Page {currentPage} sur {totalPages} • {questionnaires.length} questionnaires
            </PaginationInfo>
            <PaginationButton 
              onClick={() => fetchQuestionnaires(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Suivant →
            </PaginationButton>
          </PaginationContainer>
        )}
      </ModernListContainer>
    </ModernPageContainer>
  );
}

export default PublicQuestionnairesPage;