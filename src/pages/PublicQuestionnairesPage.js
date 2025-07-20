import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronDown, ChevronUp, Clock, Users, FileText, TrendingUp, User, Eye, Copy } from 'lucide-react';
import axios from '../utils/axiosConfig';
import RatingStars from '../components/RatingStars'; // NOUVEAU : Import du système de notation

// ==================== STYLED COMPONENTS ====================

const ModernPageContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}15, ${props => props.theme.secondary}15);
  border-radius: 20px;
  border: 1px solid ${props => props.theme.primary}20;
`;

const MainTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SubTitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ModernFilterSection = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid ${props => props.theme.borderLight};
  border-radius: 12px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const FiltersRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterDropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
  }

  &[data-open="true"] {
    border-color: ${props => props.theme.primary};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.primary};
  border-top: none;
  border-radius: 0 0 8px 8px;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${props => props.theme.text};

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  input {
    margin-right: 0.5rem;
    accent-color: ${props => props.theme.primary};
  }
`;

const ModernListContainer = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.2rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  font-size: 1.1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 12px;
  margin: 2rem 0;
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

const ModernQuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ModernQuestionnaireCard = styled.div`
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
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

const ModernCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ModernCardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.primary};
  margin: 0;
  line-height: 1.3;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PopularityBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => props.theme.success};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ModernCardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const ModernMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const ModernTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ModernTag = styled.span`
  background: linear-gradient(135deg, ${props => props.theme.primary}20, ${props => props.theme.secondary}20);
  color: ${props => props.theme.primary};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid ${props => props.theme.primary}30;
`;

// NOUVEAU : Section de notation
const RatingSection = styled.div`
  padding: 0.5rem 0;
  border-top: 1px solid ${props => props.theme.borderLight};
  border-bottom: 1px solid ${props => props.theme.borderLight};
  margin: 0.75rem 0;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const ModernCardActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

const PrimaryActionButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: ${props => props.theme.primaryDark || props.theme.primary};
    transform: translateY(-2px);
  }
`;

const SecondaryActionButton = styled(Link)`
  flex: 1;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  border: 2px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hover};
    color: ${props => props.theme.text};
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.hover};
  }

  &.primary {
    background-color: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};

    &:hover {
      background-color: ${props => props.theme.primaryDark || props.theme.primary};
    }
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.borderLight};
`;

const PaginationButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.primaryDark || props.theme.primary};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: ${props => props.theme.textSecondary};
    cursor: not-allowed;
    transform: none;
  }
`;

const PaginationInfo = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

// ==================== COMPOSANTS ====================

function QuestionnaireCardComponent({ questionnaire }) {
  // NOUVEAU : États pour la gestion des notes
  const [questionnaireRating, setQuestionnaireRating] = useState({
    averageRating: questionnaire.averageRating || 0,
    ratingsCount: questionnaire.ratingsCount || 0,
    userRating: questionnaire.userRating || null
  });

  // NOUVEAU : Gestion de la mise à jour des notes
  const handleRatingUpdate = (questionnaireId, newRatingData) => {
    setQuestionnaireRating(newRatingData);
  };

  // NOUVEAU : Fonction pour déterminer si un questionnaire est populaire
  const isPopular = (questionnaire) => {
    const views = Number(questionnaire?.views) || 0;
    const copies = Number(questionnaire?.copies) || 0;
    return copies > 10 || views > 100;
  };

  // NOUVEAU : Fonction pour copier un questionnaire
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
    <ModernQuestionnaireCard>
      <ModernCardHeader>
        <ModernCardTitle>
          {getQuestionnaireIcon(questionnaire.tags)}
          {questionnaire.title}
        </ModernCardTitle>
        {isPopular(questionnaire) && (
          <PopularityBadge>
            <TrendingUp size={12} />
            Populaire
          </PopularityBadge>
        )}
      </ModernCardHeader>

      <AuthorInfo>
        <User size={16} />
        Par <strong>{questionnaire.user?.username || 'Utilisateur'}</strong>
      </AuthorInfo>

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

      {/* NOUVEAU : Section de notation optimisée */}
      <RatingSection>
        <RatingStars
          itemId={questionnaire._id}
          itemType="questionnaire"
          averageRating={questionnaireRating.averageRating}
          ratingsCount={questionnaireRating.ratingsCount}
          userRating={questionnaireRating.userRating}
          onRatingUpdate={(newRatingData) => handleRatingUpdate(questionnaire._id, newRatingData)}
          size={14}
          compact={true}
        />
      </RatingSection>

      <StatsContainer>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <StatItem>
            <Eye size={14} />
            {Number(questionnaire.views) || 0} vues
          </StatItem>
          <StatItem>
            <Copy size={14} />
            {Number(questionnaire.copies) || 0} copies
          </StatItem>
        </div>
        
        <ActionButton
          className="primary"
          onClick={() => addToMyQuestionnaires(questionnaire._id)}
        >
          Copier
        </ActionButton>
      </StatsContainer>

      <ModernCardActions>
        <PrimaryActionButton onClick={() => addToMyQuestionnaires(questionnaire._id)}>
          ➕ Ajouter à mes questionnaires
        </PrimaryActionButton>
        <SecondaryActionButton to={`/use/${questionnaire._id}`}>
          ▶️ UTILISER
        </SecondaryActionButton>
      </ModernCardActions>
    </ModernQuestionnaireCard>
  );
}

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
        // MODIFIÉ : Nettoyer les données pour inclure les informations de notation
        const cleanedQuestionnaires = response.data.questionnaires.map(questionnaire => ({
          ...questionnaire,
          averageRating: questionnaire.averageRating ? Number(questionnaire.averageRating) : 0,
          ratingsCount: questionnaire.ratingsCount ? Number(questionnaire.ratingsCount) : 0,
          userRating: questionnaire.userRating || null,
          views: questionnaire.views || questionnaire.stats?.views || 0,
          copies: questionnaire.copies || questionnaire.stats?.copies || 0,
        }));
        
        setQuestionnaires(cleanedQuestionnaires);
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

  return (
    <ModernPageContainer>
      <HeaderSection>
        <MainTitle>📖 Questionnaires Publics</MainTitle>
        <SubTitle>
          Découvrez une collection de questionnaires partagés par la communauté. 
          Enrichissez votre pratique avec des outils d'évaluation variés et de qualité.
        </SubTitle>
      </HeaderSection>

      {/* SECTION FILTRES AVEC MENUS DÉPLIANTS */}
      <ModernFilterSection>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="🔍 Rechercher un questionnaire..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>

        <FiltersRow>
          <FilterGroup>
            <FilterTitle>📊 Modalités</FilterTitle>
            <FilterDropdown>
              <DropdownButton 
                onClick={() => setIsModalityDropdownOpen(!isModalityDropdownOpen)}
                data-open={isModalityDropdownOpen}
              >
                Modalités ({modalityFilters.length})
                {isModalityDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </DropdownButton>
              {isModalityDropdownOpen && (
                <DropdownContent>
                  {modalityOptions.map(modality => (
                    <FilterOption key={modality}>
                      <input
                        type="checkbox"
                        checked={modalityFilters.includes(modality)}
                        onChange={() => handleModalityFilter(modality)}
                      />
                      {modality}
                    </FilterOption>
                  ))}
                </DropdownContent>
              )}
            </FilterDropdown>
          </FilterGroup>

          <FilterGroup>
            <FilterTitle>🩺 Spécialités</FilterTitle>
            <FilterDropdown>
              <DropdownButton 
                onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
                data-open={isSpecialtyDropdownOpen}
              >
                Spécialités ({specialtyFilters.length})
                {isSpecialtyDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </DropdownButton>
              {isSpecialtyDropdownOpen && (
                <DropdownContent>
                  {specialtyOptions.map(specialty => (
                    <FilterOption key={specialty}>
                      <input
                        type="checkbox"
                        checked={specialtyFilters.includes(specialty)}
                        onChange={() => handleSpecialtyFilter(specialty)}
                      />
                      {specialty}
                    </FilterOption>
                  ))}
                </DropdownContent>
              )}
            </FilterDropdown>
          </FilterGroup>

          <FilterGroup>
            <FilterTitle>📍 Localisations</FilterTitle>
            <FilterDropdown>
              <DropdownButton 
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                data-open={isLocationDropdownOpen}
              >
                Localisations ({locationFilters.length})
                {isLocationDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </DropdownButton>
              {isLocationDropdownOpen && (
                <DropdownContent>
                  {locationOptions.map(location => (
                    <FilterOption key={location}>
                      <input
                        type="checkbox"
                        checked={locationFilters.includes(location)}
                        onChange={() => handleLocationFilter(location)}
                      />
                      {location}
                    </FilterOption>
                  ))}
                </DropdownContent>
              )}
            </FilterDropdown>
          </FilterGroup>
        </FiltersRow>
      </ModernFilterSection>

      <ModernListContainer>
        {isLoading ? (
          <LoadingMessage>
            🔄 Chargement des questionnaires publics...
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
                <QuestionnaireCardComponent key={questionnaire._id} questionnaire={questionnaire} />
              ))}
            </ModernQuestionnairesGrid>

            {totalPages > 1 && (
              <PaginationContainer>
                <PaginationButton 
                  onClick={() => fetchQuestionnaires(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  ← Précédent
                </PaginationButton>
                <PaginationInfo>
                  Page {currentPage} sur {totalPages}
                </PaginationInfo>
                <PaginationButton 
                  onClick={() => fetchQuestionnaires(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Suivant →
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