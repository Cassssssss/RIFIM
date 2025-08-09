// PublicQuestionnairesPage.js - VERSION AVEC CSS OVERRIDE BRUTAL
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Clock, Users, FileText, TrendingUp, User, Eye, Plus } from 'lucide-react';
import axios from '../utils/axiosConfig';
import RatingStars from '../components/RatingStars';

// Import du nouveau système de filtres unifié
import UnifiedFilterSystem from '../components/shared/UnifiedFilterSystem';

// Import des composants partagés
import {
  QuestionnairesGrid,
  QuestionnaireCard,
  CardHeader,
  TagsContainer,
  Tag,
  CardMeta,
  MetaItem,
  ActionButtons
} from '../components/shared/SharedComponents';

// ==================== CSS OVERRIDE BRUTAL ====================
const forceFullWidthCSS = `
  /* FORCE ABSOLUE pour PublicQuestionnairesPage */
  .public-questionnaires * {
    max-width: none !important;
  }
  
  .public-questionnaires [class*="PageContainer"] {
    width: 100vw !important;
    max-width: 100vw !important;
    margin: 0 !important;
    padding: 1rem !important;
    box-sizing: border-box !important;
  }
  
  .public-questionnaires [class*="ContentWrapper"] {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    display: flex !important;
    flex-direction: column !important;
  }
  
  .public-questionnaires [class*="QuestionnairesGrid"] {
    display: grid !important;
    width: 100% !important;
    max-width: none !important;
    margin: 2rem 0 !important;
    padding: 0 !important;
    gap: 1rem !important;
    
    /* Desktop ultra large 2560px+ : 8+ colonnes */
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
  }
  
  @media (min-width: 1920px) and (max-width: 2559px) {
    .public-questionnaires [class*="QuestionnairesGrid"] {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
      gap: 0.9rem !important;
    }
  }
  
  @media (min-width: 1600px) and (max-width: 1919px) {
    .public-questionnaires [class*="QuestionnairesGrid"] {
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important;
      gap: 1rem !important;
    }
  }
  
  @media (min-width: 1200px) and (max-width: 1599px) {
    .public-questionnaires [class*="QuestionnairesGrid"] {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
      gap: 1rem !important;
    }
  }
  
  @media (min-width: 768px) and (max-width: 1199px) {
    .public-questionnaires [class*="QuestionnairesGrid"] {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
    }
  }
  
  @media (max-width: 767px) {
    .public-questionnaires [class*="QuestionnairesGrid"] {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 0.5rem !important;
    }
    
    .public-questionnaires [class*="PageContainer"] {
      padding: 0.5rem !important;
    }
  }
  
  /* Force la largeur de toutes les cartes */
  .public-questionnaires [class*="QuestionnairesGrid"] > * {
    width: 100% !important;
    max-width: none !important;
  }
`;

// ==================== STYLES SPÉCIFIQUES À CETTE PAGE ====================

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
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
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

const SearchAndFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
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

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${props => props.theme.primaryHover};
    transform: translateY(-1px);
  }

  &:hover::after {
    content: "Ajouter à mes questionnaires";
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    background: ${props => props.theme.text};
    color: ${props => props.theme.background};
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 500;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    border: 1px solid ${props => props.theme.border};
  }

  &:hover::before {
    content: '';
    position: absolute;
    bottom: calc(100% + 2px);
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

// ==================== COMPOSANT CARTE QUESTIONNAIRE ====================

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
      <ActionButtons style={{ paddingBottom: '5px', position: 'relative' }}>
        <ActionButton to={`/use/${questionnaire._id}`}>
          <FileText size={14} />
          Utiliser
        </ActionButton>
        
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchQuestionnaires(newPage);
  };

  // Configuration des filtres pour UnifiedFilterSystem
  const filtersConfig = [
    {
      key: 'modality',
      title: 'Modalité',
      icon: '📊',
      options: modalityOptions,
      selectedValues: modalityFilters,
      onChange: setModalityFilters
    },
    {
      key: 'specialty',
      title: 'Spécialité',
      icon: '🏥',
      options: specialtyOptions,
      selectedValues: specialtyFilters,
      onChange: setSpecialtyFilters
    },
    {
      key: 'location',
      title: 'Localisation',
      icon: '📍',
      options: locationOptions,
      selectedValues: locationFilters,
      onChange: setLocationFilters
    }
  ];

  return (
    <div className="public-questionnaires">
      <style dangerouslySetInnerHTML={{ __html: forceFullWidthCSS }} />
      <PageContainer>
        <Title>🗂️ Questionnaires Publics</Title>

        <ContentWrapper>
          <SearchAndFiltersContainer>
            {/* BARRE DE RECHERCHE */}
            <SearchBar
              type="text"
              placeholder="🔍 Rechercher un questionnaire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* NOUVEAU SYSTÈME DE FILTRES UNIFIÉ */}
            <UnifiedFilterSystem
              filters={filtersConfig}
              style={{ justifyContent: 'flex-start' }}
            />
          </SearchAndFiltersContainer>

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
        </ContentWrapper>
      </PageContainer>
    </div>
  );
}

export default PublicQuestionnairesPage;