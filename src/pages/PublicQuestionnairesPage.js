import { primaryControl, quietControl } from '../components/shared/designSystem';
import { pageLayout, pageTitle } from '../components/shared/designSystem';
// PublicQuestionnairesPage.js - VERSION AVEC FILTRES CUMULATIFS (ET)
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
  QuestionnairesGridFullWidth,
  QuestionnaireCard,
  CardHeader,
  TagsContainer,
  Tag,
  CardMeta,
  MetaItem,
  ActionButtons
} from '../components/shared/SharedComponents';

// ==================== STYLES SPÉCIFIQUES PLEINE LARGEUR ====================

const PageContainer = styled.div`
  ${pageLayout}
`;

const Title = styled.h1`
  ${pageTitle}
  padding-bottom: 1.5rem;
  margin-bottom: 1.75rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const SearchAndFiltersSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.75rem;
`;

const SearchBar = styled.input`
  flex: 1 1 300px;
  min-width: 0;
  max-width: 520px;
  min-height: 38px;
  padding: 0.55rem 0.8rem;
  font: inherit;
  font-size: 0.85rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 7px;
  background: ${props => props.theme.card};
  color: ${props => props.theme.text};
  &:focus { outline: 2px solid ${props => props.theme.primary}; outline-offset: 2px; }
  &::placeholder { color: ${props => props.theme.textSecondary}; }

`;

// Grille personnalisée pleine largeur pour cette page
const CustomFullWidthGrid = styled.div`
  display: grid;
  width: 100%;
  gap: 1rem;
  margin: 2rem 0;
  padding: 0;

  /* Configuration responsive des colonnes */
  /* Ultra large screens 2560px+ : 8-10 colonnes */
  @media (min-width: 2560px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.2rem;
  }

  /* Large screens 1920px-2559px : 6-8 colonnes */
  @media (min-width: 1920px) and (max-width: 2559px) {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 1.1rem;
  }

  /* Medium-large screens 1600px-1919px : 5-6 colonnes */
  @media (min-width: 1600px) and (max-width: 1919px) {
    grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
    gap: 1rem;
  }

  /* Standard screens 1400px-1599px : 4-5 colonnes */
  @media (min-width: 1400px) and (max-width: 1599px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1rem;
  }

  /* Medium screens 1200px-1399px : 4 colonnes */
  @media (min-width: 1200px) and (max-width: 1399px) {
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
    gap: 1rem;
  }

  /* Small screens 1024px-1199px : 3-4 colonnes */
  @media (min-width: 1024px) and (max-width: 1199px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  /* Tablets landscape 768px-1023px : 3 colonnes */
  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 0.9rem;
  }

  /* Mobile : 2 colonnes */
  @media (max-width: 767px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  /* Fallback général */
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
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
  display: inline-flex;
  color: ${props => props.theme.textLight};
  svg { width: 19px; height: 19px; }
`;

const PopularityBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.buttonText};
  padding: 0.2rem 0.5rem;
  border-radius: ${props => props.theme.radii.card};
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
  ${primaryControl}
`;

const CopyButton = styled.button`
  ${quietControl}
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.borderLight};
`;

const PaginationButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: ${props => props.theme.buttonText};
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
  max-width: 600px;
  margin: 2rem auto;
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

// Nouveau composant pour afficher les filtres actifs
const ActiveFiltersDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  flex-wrap: wrap;

  strong {
    color: ${props => props.theme.primary};
    margin-right: 0.5rem;
  }

  .filter-tag {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.8rem;
  }

  .separator {
    color: ${props => props.theme.textSecondary};
    font-weight: bold;
    margin: 0 0.25rem;
  }

  @media (max-width: 768px) {
    font-size: 0.85rem;
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


  return (
    <QuestionnaireCard>
      <CardHeader>
        <QuestionnaireTitle to={`/use/${questionnaire._id}`}>
          <QuestionnaireIcon>
            <FileText />
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
  
  // État pour afficher les questionnaires filtrés côté client
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState([]);

  const modalityOptions = ['Rx', 'TDM', 'IRM', 'Echo'];
  const specialtyOptions = ['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo','Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'];
  const locationOptions = [
    "Avant-pied", "Bras", "Bassin", "Cheville", "Coude", "Cuisse", "Doigts", "Epaule", 
    "Genou", "Hanche", "Jambe", "Parties molles", "Poignet", "Rachis"
  ];

  // 🔧 MODIFICATION PRINCIPALE : Fonction de filtrage côté client avec logique ET
  const filterQuestionnairesLocally = useCallback((questionnairesToFilter) => {
    let filtered = [...questionnairesToFilter];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (q.tags && q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // 🔧 IMPORTANT : Logique ET pour les filtres
    // Un questionnaire doit avoir TOUS les tags sélectionnés dans chaque catégorie
    
    // Filtre par modalité (ET)
    if (modalityFilters.length > 0) {
      filtered = filtered.filter(q => {
        if (!q.tags || q.tags.length === 0) return false;
        // Le questionnaire doit avoir TOUS les tags de modalité sélectionnés
        return modalityFilters.every(filter => 
          q.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
        );
      });
    }

    // Filtre par spécialité (ET)
    if (specialtyFilters.length > 0) {
      filtered = filtered.filter(q => {
        if (!q.tags || q.tags.length === 0) return false;
        // Le questionnaire doit avoir TOUS les tags de spécialité sélectionnés
        return specialtyFilters.every(filter => 
          q.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
        );
      });
    }

    // Filtre par localisation (ET)
    if (locationFilters.length > 0) {
      filtered = filtered.filter(q => {
        if (!q.tags || q.tags.length === 0) return false;
        // Le questionnaire doit avoir TOUS les tags de localisation sélectionnés
        return locationFilters.every(filter => 
          q.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
        );
      });
    }

    return filtered;
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      // 🔧 MODIFICATION : On récupère TOUS les questionnaires sans filtres côté serveur
      // pour pouvoir appliquer la logique ET côté client
      const response = await axios.get('/questionnaires/public', {
        params: {
          page,
          limit: 100, // Augmenté pour avoir plus de résultats à filtrer
          // On n'envoie plus les filtres au serveur
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
  }, []);

  // 🔧 MODIFICATION : Appliquer les filtres localement quand les questionnaires ou les filtres changent
  useEffect(() => {
    const filtered = filterQuestionnairesLocally(questionnaires);
    setFilteredQuestionnaires(filtered);
  }, [questionnaires, filterQuestionnairesLocally]);

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

  // Fonction pour vérifier si des filtres sont actifs
  const hasActiveFilters = modalityFilters.length > 0 || specialtyFilters.length > 0 || locationFilters.length > 0;

  return (
    <PageContainer>
      <Title>Questionnaires publics</Title>

      {/* SECTION DE RECHERCHE ET FILTRES CENTRÉE */}
      <SearchAndFiltersSection>
        <SearchBar
          type="text"
          placeholder="Rechercher un questionnaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* FILTRES CENTRÉS */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'center'
        }}>
          <UnifiedFilterSystem
            filters={filtersConfig}
            style={{ justifyContent: 'center' }}
          />
        </div>

        {/* 🔧 NOUVEAU : Affichage des filtres actifs avec logique ET */}
        {hasActiveFilters && (
          <ActiveFiltersDisplay>
            <strong>Filtres actifs (cumulatifs) :</strong>
            {modalityFilters.length > 0 && (
              <>
                {modalityFilters.map((filter, index) => (
                  <React.Fragment key={`mod-${filter}`}>
                    <span className="filter-tag">{filter}</span>
                    {index < modalityFilters.length - 1 && <span className="separator">ET</span>}
                  </React.Fragment>
                ))}
              </>
            )}
            {modalityFilters.length > 0 && specialtyFilters.length > 0 && <span className="separator">ET</span>}
            {specialtyFilters.length > 0 && (
              <>
                {specialtyFilters.map((filter, index) => (
                  <React.Fragment key={`spec-${filter}`}>
                    <span className="filter-tag">{filter}</span>
                    {index < specialtyFilters.length - 1 && <span className="separator">ET</span>}
                  </React.Fragment>
                ))}
              </>
            )}
            {((modalityFilters.length > 0 || specialtyFilters.length > 0) && locationFilters.length > 0) && <span className="separator">ET</span>}
            {locationFilters.length > 0 && (
              <>
                {locationFilters.map((filter, index) => (
                  <React.Fragment key={`loc-${filter}`}>
                    <span className="filter-tag">{filter}</span>
                    {index < locationFilters.length - 1 && <span className="separator">ET</span>}
                  </React.Fragment>
                ))}
              </>
            )}
          </ActiveFiltersDisplay>
        )}
      </SearchAndFiltersSection>

      {/* CONTENU PRINCIPAL */}
      {isLoading ? (
        <LoadingContainer>
          <div>Chargement des questionnaires...</div>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <h3>❌ Erreur</h3>
          <p>{error}</p>
        </ErrorContainer>
      ) : filteredQuestionnaires.length === 0 ? (
        <EmptyState>
          <h3>Aucun questionnaire trouvé</h3>
          <p>
            {hasActiveFilters 
              ? "Aucun questionnaire ne correspond à TOUS vos critères de filtrage. Essayez de retirer certains filtres."
              : "Essayez de modifier votre recherche."}
          </p>
        </EmptyState>
      ) : (
        <>
          {/* GRILLE PLEINE LARGEUR */}
          <CustomFullWidthGrid>
            {filteredQuestionnaires.map((questionnaire) => (
              <QuestionnaireCardComponent 
                key={questionnaire._id} 
                questionnaire={questionnaire} 
              />
            ))}
          </CustomFullWidthGrid>

          {/* INFO SUR LE NOMBRE DE RÉSULTATS */}
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '2rem' }}>
            {filteredQuestionnaires.length} questionnaire{filteredQuestionnaires.length > 1 ? 's' : ''} trouvé{filteredQuestionnaires.length > 1 ? 's' : ''}
            {hasActiveFilters && ' avec les filtres appliqués'}
          </div>
        </>
      )}
    </PageContainer>
  );
}

export default PublicQuestionnairesPage;