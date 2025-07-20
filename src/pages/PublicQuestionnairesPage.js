// PublicQuestionnairesPage.js - VERSION CORRIGÉE SANS FOND SUPPLÉMENTAIRE
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronDown, ChevronUp, Clock, Users, FileText, TrendingUp, User, Eye, Copy } from 'lucide-react';
import axios from '../utils/axiosConfig';
import RatingStars from '../components/RatingStars'; // NOUVEAU : Import du système de notation

// ==================== STYLED COMPONENTS SIMPLIFIÉS COMME QuestionnairePage ====================

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: ${props => props.theme.background};
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.6;
`;

// ==================== SECTION FILTRES ====================

const FilterSection = styled.div`
  width: 280px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
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
  background-color: ${props => props.theme.card};
  border: 2px solid ${props => props.theme.border};
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

// ==================== SECTION CONTENU PRINCIPAL ====================

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

// ==================== GRILLE DES QUESTIONNAIRES ====================

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

const CopyButton = styled.button`
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.secondaryHover};
    transform: translateY(-1px);
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
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

// ==================== MESSAGES D'ÉTAT ====================

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

// ==================== PAGINATION ====================

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
    return `~${Math.max(1, Math.ceil(questionCount / 3))} min`;
  };

  const getQuestionnaireIcon = (tags) => {
    if (!tags || !Array.isArray(tags)) return '📋';
    
    if (tags.some(tag => tag.toLowerCase().includes('neuro'))) return '🧠';
    if (tags.some(tag => tag.toLowerCase().includes('cardio'))) return '❤️';
    if (tags.some(tag => tag.toLowerCase().includes('thorax'))) return '🫁';
    if (tags.some(tag => tag.toLowerCase().includes('abdo'))) return '🔍';
    if (tags.some(tag => tag.toLowerCase().includes('pelvis'))) return '🦴';
    if (tags.some(tag => tag.toLowerCase().includes('ostéo'))) return '🦴';
    if (tags.some(tag => tag.toLowerCase().includes('séno'))) return '🔬';
    
    return '📋';
  };

  return (
    <QuestionnaireCard>
      <CardHeader>
        <QuestionnaireTitle to={`/use/${questionnaire._id}`}>
          <QuestionnaireIcon>
            {getQuestionnaireIcon(questionnaire.tags)}
          </QuestionnaireIcon>
          {questionnaire.title}
          {isPopular(questionnaire) && (
            <PopularityBadge>
              <TrendingUp size={12} />
              Populaire
            </PopularityBadge>
          )}
        </QuestionnaireTitle>
      </CardHeader>

      <AuthorInfo>
        <User size={16} />
        Par <strong>{questionnaire.user?.username || 'Utilisateur'}</strong>
      </AuthorInfo>

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
          <span>Public</span>
        </MetaItem>
        <MetaItem>
          <FileText />
          <span>{questionnaire.questions ? questionnaire.questions.length : 0} questions</span>
        </MetaItem>
        <MetaItem>
          <Clock />
          <span>{estimateTime(questionnaire)}</span>
        </MetaItem>
        <MetaItem>
          <Eye />
          <span>{questionnaire.views || 0} vues</span>
        </MetaItem>
        <MetaItem>
          <Copy />
          <span>{questionnaire.copies || 0} copies</span>
        </MetaItem>
      </CardMeta>

      {/* NOUVEAU : Système de notation */}
      <RatingStars
        itemId={questionnaire._id}
        itemType="questionnaire"
        averageRating={questionnaireRating.averageRating}
        ratingsCount={questionnaireRating.ratingsCount}
        userRating={questionnaireRating.userRating}
        onRatingUpdate={(id, data) => handleRatingUpdate(id, data)}
        compact={true}
      />

      {/* Actions */}
      <ActionButtons>
        <ActionButton to={`/use/${questionnaire._id}`}>
          <FileText size={16} />
          Utiliser
        </ActionButton>
        
        <CopyButton
          onClick={(e) => {
            e.preventDefault();
            addToMyQuestionnaires(questionnaire._id);
          }}
          title="Ajouter à mes questionnaires"
        >
          <Copy size={16} />
        </CopyButton>
      </ActionButtons>
    </QuestionnaireCard>
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
      setQuestionnaires([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  useEffect(() => {
    fetchQuestionnaires(currentPage);
  }, [fetchQuestionnaires, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <PageContainer>
      <Title>🩺 Questionnaires Publics</Title>
      <Subtitle>
        Découvrez et utilisez des questionnaires partagés par la communauté médicale
      </Subtitle>

      <ContentWrapper>
        {/* SECTION FILTRES */}
        <FilterSection>
          <FilterGroup>
            <FilterTitle>🔍 Modalités</FilterTitle>
            <FilterDropdown>
              <DropdownButton
                data-open={isModalityDropdownOpen}
                onClick={() => setIsModalityDropdownOpen(!isModalityDropdownOpen)}
              >
                <span>
                  {modalityFilters.length > 0 
                    ? `${modalityFilters.length} sélectionnée(s)` 
                    : 'Toutes modalités'
                  }
                </span>
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
                data-open={isSpecialtyDropdownOpen}
                onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
              >
                <span>
                  {specialtyFilters.length > 0 
                    ? `${specialtyFilters.length} sélectionnée(s)` 
                    : 'Toutes spécialités'
                  }
                </span>
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
            <FilterTitle>📍 Localisations</FilterTitle>
            <FilterDropdown>
              <DropdownButton
                data-open={isLocationDropdownOpen}
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              >
                <span>
                  {locationFilters.length > 0 
                    ? `${locationFilters.length} sélectionnée(s)` 
                    : 'Toutes localisations'
                  }
                </span>
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

          {/* CONTENU CONDITIONNEL */}
          {isLoading ? (
            <LoadingMessage>⏳ Chargement des questionnaires...</LoadingMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : questionnaires.length === 0 ? (
            <EmptyState>
              <h3>Aucun questionnaire trouvé</h3>
              <p>
                Essayez de modifier vos critères de recherche ou de supprimer certains filtres.
              </p>
            </EmptyState>
          ) : (
            <>
              {/* GRILLE DES QUESTIONNAIRES */}
              <QuestionnairesGrid>
                {questionnaires.map((questionnaire) => (
                  <QuestionnaireCardComponent 
                    key={questionnaire._id} 
                    questionnaire={questionnaire} 
                  />
                ))}
              </QuestionnairesGrid>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <PaginationContainer>
                  <PaginationButton
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Précédent
                  </PaginationButton>
                  
                  <PaginationInfo>
                    Page {currentPage} sur {totalPages}
                  </PaginationInfo>
                  
                  <PaginationButton
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                  </PaginationButton>
                </PaginationContainer>
              )}
            </>
          )}
        </ListContainer>
      </ContentWrapper>
    </PageContainer>
  );
}

export default PublicQuestionnairesPage;