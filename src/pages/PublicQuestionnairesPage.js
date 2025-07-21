// PublicQuestionnairesPage.js - VERSION CORRIGÉE AVEC CARTES OPTIMISÉES
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronDown, ChevronUp, Clock, Users, FileText, TrendingUp, User, Eye, Copy, Plus } from 'lucide-react';
import axios from '../utils/axiosConfig';
import RatingStars from '../components/RatingStars';

// ==================== STYLES CONTAINER PRINCIPAL OPTIMISÉ ====================

const PageContainer = styled.div`
  padding: 2rem 3rem;
  width: 100%;
  min-height: calc(100vh - 60px);
  background-color: ${props => props.theme.background};

  @media (max-width: 1200px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1600px;
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

// ==================== SECTION FILTRES (INCHANGÉE) ====================

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
  border: 2px solid ${props => props.theme.primary};
  border-top: none;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  z-index: 1000;
  max-height: 250px;
  overflow-y: auto;
`;

const DropdownOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid ${props => props.theme.borderLight};

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  &:last-child {
    border-bottom: none;
  }

  input {
    margin-right: 0.75rem;
    accent-color: ${props => props.theme.primary};
  }
`;

const FilterIndicator = styled.div`
  background-color: ${props => props.theme.infoLight};
  color: ${props => props.theme.primary};
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 1rem;
  border: 1px solid ${props => props.theme.primary}30;
`;

// ==================== CONTENU PRINCIPAL ====================

const ListContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: border-color 0.2s ease;
  margin-bottom: 2rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

// ==================== GRILLE POUR CARTES CORRIGÉE ====================
const QuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// ==================== CARTES RÉDUITES EN LARGEUR ====================

const QuestionnaireCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  position: relative;
  /* CORRECTION : Remplacer overflow: hidden par overflow: visible pour permettre aux tooltips de dépasser */
  overflow: visible;
  display: flex;
  flex-direction: column;
  height: fit-content;

  /* CORRECTION : Ajouter la bande dégradé au-dessus comme dans PublicCasesPage */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
    /* CORRECTION : S'assurer que la bande reste dans la carte avec overflow */
    border-radius: 12px 12px 0 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
    /* CORRECTION : Augmenter le z-index au survol pour que les tooltips passent au-dessus */
    z-index: 100;
  }
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

const QuestionnaireTitle = styled(Link)`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.3;
  
  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const QuestionnaireIcon = styled.span`
  font-size: 1.2rem;
  flex-shrink: 0;
  margin-top: 2px;
`;

const PopularityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: linear-gradient(45deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  margin-bottom: 1rem;

  svg {
    color: ${props => props.theme.primary};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
`;

// ==================== MÉTADONNÉES COMPACTES ====================

const CardMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.75rem;
  font-weight: 500;

  svg {
    color: ${props => props.theme.primary};
    flex-shrink: 0;
    width: 14px;
    height: 14px;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

// ==================== ACTIONS COMPACTES ====================

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
  /* CORRECTION : Augmenter le padding-bottom pour laisser plus d'espace pour le tooltip */
  padding-bottom: 50px;
  position: relative;
`;

const ActionButton = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 0.8rem;
  background-color: ${props => props.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primaryHover};
    transform: translateY(-1px);
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

// CORRECTION : Bouton copie avec même couleur que PublicCasesPage et tooltip bien positionné
const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  /* CORRECTION : Même couleur que PublicCasesPage (primary au lieu de secondary) */
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    /* CORRECTION : Même couleur de survol que PublicCasesPage */
    background-color: ${props => props.theme.primaryHover};
    transform: translateY(-1px);
  }

  /* CORRECTION : Tooltip repositionné au-dessus avec plus d'espace */
  &:hover::after {
    content: "Ajouter à mes questionnaires";
    position: absolute;
    bottom: calc(100% + 15px);
    left: 50%;
    transform: translateX(-50%);
    background: ${props => props.theme.text};
    color: ${props => props.theme.background};
    padding: 0.6rem 0.8rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: 1px solid ${props => props.theme.border};
  }

  /* CORRECTION : Flèche du tooltip repositionnée */
  &:hover::before {
    content: '';
    position: absolute;
    bottom: calc(100% + 9px);
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${props => props.theme.text};
    z-index: 1001;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

// ==================== PAGINATION (INCHANGÉE) ====================

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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: ${props => props.theme.textSecondary};
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.error};
  background-color: ${props => props.theme.errorLight};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.error};
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

// ==================== COMPOSANTS ====================

function QuestionnaireCardComponent({ questionnaire }) {
  const [questionnaireRating, setQuestionnaireRating] = useState({
    averageRating: questionnaire.averageRating || 0,
    ratingsCount: questionnaire.ratingsCount || 0,
    userRating: questionnaire.userRating || null
  });

  const handleRatingUpdate = (questionnaireId, newRatingData) => {
    setQuestionnaireRating(newRatingData);
  };

  const isPopular = (questionnaire) => {
    const views = Number(questionnaire?.views) || 0;
    const copies = Number(questionnaire?.copies) || 0;
    return copies > 10 || views > 100;
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
    const minutes = Math.max(2, Math.ceil(questionCount * 0.75));
    return `~${minutes} min`;
  };

  const getQuestionnaireIcon = (tags) => {
    if (!tags || tags.length === 0) return '📋';
    if (tags.includes('IRM')) return '🧲';
    if (tags.includes('TDM')) return '💽';
    if (tags.includes('Echo')) return '📡';
    if (tags.includes('Rx')) return '🦴';
    if (tags.includes('Neuro')) return '🧠';
    if (tags.includes('Cardiovasc')) return '❤️';
    if (tags.includes('Thorax')) return '🫁';
    if (tags.includes('Pelvis')) return '🦴';
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
              <TrendingUp size={10} />
              Populaire
            </PopularityBadge>
          )}
        </QuestionnaireTitle>
      </CardHeader>

      <AuthorInfo>
        <User size={14} />
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
          <Eye />
          <span>{questionnaire.views || 0} vues</span>
        </MetaItem>
      </CardMeta>

      {/* Système de notation */}
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
          <FileText size={14} />
          Utiliser
        </ActionButton>
        
        {/* CORRECTION : Bouton avec icône Plus et tooltip */}
        <CopyButton
          onClick={(e) => {
            e.preventDefault();
            addToMyQuestionnaires(questionnaire._id);
          }}
        >
          <Plus size={14} />
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

  // CORRECTION : Uniformiser la limite à 10 comme demandé
  const fetchQuestionnaires = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('/questionnaires/public', {
        params: {
          page,
          limit: 10, // CORRECTION : Changé de 12 à 10 pour uniformiser
          search: searchTerm,
          modality: modalityFilters.join(','),
          specialty: specialtyFilters.join(','),
          location: locationFilters.join(',')
        }
      });
      if (response.data && response.data.questionnaires) {
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchQuestionnaires(newPage);
  };

  return (
    <PageContainer>
      <Title>🗂️ Questionnaires Publics</Title>
      <Subtitle>
        Découvrez et utilisez les questionnaires partagés par la communauté
      </Subtitle>

      <ContentWrapper>
        {/* SECTION FILTRES */}
        <FilterSection>
          <FilterGroup>
            <FilterTitle>📊 Modalité</FilterTitle>
            <FilterDropdown>
              <DropdownButton
                onClick={() => setIsModalityDropdownOpen(!isModalityDropdownOpen)}
                data-open={isModalityDropdownOpen}
              >
                <span>{modalityFilters.length > 0 ? `${modalityFilters.length} sélectionnée(s)` : 'Toutes'}</span>
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
            <FilterTitle>🏥 Spécialité</FilterTitle>
            <FilterDropdown>
              <DropdownButton
                onClick={() => setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen)}
                data-open={isSpecialtyDropdownOpen}
              >
                <span>{specialtyFilters.length > 0 ? `${specialtyFilters.length} sélectionnée(s)` : 'Toutes'}</span>
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
                <span>{locationFilters.length > 0 ? `${locationFilters.length} sélectionnée(s)` : 'Toutes'}</span>
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
            <LoadingContainer>
              <div>Chargement des questionnaires...</div>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <h3>❌ Erreur</h3>
              <p>{error}</p>
            </ErrorContainer>
          ) : questionnaires.length === 0 ? (
            <EmptyState>
              <h3>Aucun questionnaire trouvé</h3>
              <p>Essayez de modifier vos filtres ou votre recherche.</p>
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
                    ← Précédent
                  </PaginationButton>
                  <PaginationInfo>
                    Page {currentPage} sur {totalPages} • {questionnaires.length} questionnaires
                  </PaginationInfo>
                  <PaginationButton 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    Suivant →
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