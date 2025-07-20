import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import { ChevronDown, ChevronUp, Clock, Users, FileText, Eye, Copy } from 'lucide-react';
import RatingStars from '../components/RatingStars';

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

const FilterDropdownContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
`;

const FilterDropdownButton = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
  }

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const FilterDropdownContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${props => props.theme.background};
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
  grid-template-columns: repeat(auto-fill, minmax(350px, 400px));
  gap: 2rem;
  margin-bottom: 2rem;
  justify-content: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    justify-content: stretch;
  }
`;

const ModernQuestionnaireCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 15px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;

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

const CardContent = styled.div`
  padding: 2rem;
`;

const QuestionnaireTitle = styled.h3`
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

const ModernTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
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

// NOUVEAU : Section de notation pour les questionnaires
const RatingSection = styled.div`
  padding: 0.75rem 0;
  border-top: 1px solid ${props => props.theme.borderLight};
  border-bottom: 1px solid ${props => props.theme.borderLight};
  margin: 1rem 0;
`;

// NOUVEAU : Conteneur des statistiques et actions
const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
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
  box-shadow: 0 2px 8px ${props => props.theme.primary}40;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${props => props.theme.primary}60;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SecondaryActionButton = styled(Link)`
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.primary};
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.theme.primary};
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
    transform: translateY(-2px);
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};
  }

  &:hover {
    z-index: 10;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchQuestionnaires = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setCurrentPage(page);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        search: searchTerm,
        tags: selectedTags.join(',')
      });

      const response = await axios.get(`/questionnaires/public?${params}`);
      
      // Nettoyer les données pour éviter les objets React invalides
      const cleanedQuestionnaires = (response.data.questionnaires || []).map(questionnaire => ({
        ...questionnaire,
        title: questionnaire.title ? String(questionnaire.title) : 'Sans titre',
        tags: Array.isArray(questionnaire.tags) ? questionnaire.tags.map(String) : [],
        averageRating: questionnaire.averageRating ? Number(questionnaire.averageRating) : 0,
        ratingsCount: questionnaire.ratingsCount ? Number(questionnaire.ratingsCount) : 0,
        views: questionnaire.views || questionnaire.stats?.views || 0,
        copies: questionnaire.copies || questionnaire.stats?.copies || 0,
        userRating: questionnaire.userRating || null,
        _id: questionnaire._id ? String(questionnaire._id) : ''
      }));
      
      setQuestionnaires(cleanedQuestionnaires);
      setTotalPages(response.data.totalPages || 0);
      setAvailableTags(response.data.availableTags || []);
    } catch (err) {
      console.error('Erreur lors du chargement des questionnaires publics:', err);
      setError('Erreur lors du chargement des questionnaires publics');
      setQuestionnaires([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedTags]);

  useEffect(() => {
    fetchQuestionnaires();
  }, [fetchQuestionnaires]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTags]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const addToMyQuestionnaires = async (questionnaireId) => {
    try {
      await axios.post(`/questionnaires/${questionnaireId}/copy`);
      alert('Questionnaire ajouté à vos questionnaires personnels !');
    } catch (err) {
      console.error('Erreur lors de l\'ajout:', err);
      setError('Erreur lors de l\'ajout du questionnaire');
    }
  };

  // NOUVEAU : Callback pour mettre à jour les notes
  const handleRatingUpdate = (questionnaireId, newRatingData) => {
    setQuestionnaires(prev => prev.map(questionnaire => 
      questionnaire._id === questionnaireId 
        ? { 
            ...questionnaire, 
            averageRating: newRatingData.averageRating || 0,
            ratingsCount: newRatingData.ratingsCount || 0,
            userRating: newRatingData.userRating || null
          }
        : questionnaire
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const estimateTime = (questionnaire) => {
    const questionCount = questionnaire.questions?.length || 0;
    const estimatedMinutes = Math.max(2, Math.ceil(questionCount * 0.5));
    return `~${estimatedMinutes} min`;
  };

  if (loading) {
    return (
      <ModernPageContainer>
        <LoadingMessage>
          Chargement des questionnaires publics...
        </LoadingMessage>
      </ModernPageContainer>
    );
  }

  if (error) {
    return (
      <ModernPageContainer>
        <ErrorMessage>
          {error}
        </ErrorMessage>
      </ModernPageContainer>
    );
  }

  return (
    <ModernPageContainer>
      <ModernFilterSection>
        <FilterGroup>
          <FilterTitle>
            🏷️ Filtres par catégories
          </FilterTitle>
          
          <FilterDropdownContainer>
            <FilterDropdownButton 
              onClick={() => setShowTagsDropdown(!showTagsDropdown)}
            >
              Tags ({selectedTags.length})
              {showTagsDropdown ? <ChevronUp /> : <ChevronDown />}
            </FilterDropdownButton>
            
            {showTagsDropdown && (
              <FilterDropdownContent>
                {availableTags.map(tag => (
                  <DropdownOption key={tag}>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                    />
                    {tag}
                  </DropdownOption>
                ))}
              </FilterDropdownContent>
            )}
          </FilterDropdownContainer>
        </FilterGroup>
        
        {(searchTerm || selectedTags.length > 0) && (
          <div style={{ 
            marginTop: '1.5rem',
            fontSize: '0.9rem',
            color: 'var(--color-primary)',
            padding: '1rem',
            backgroundColor: 'var(--color-background)',
            borderRadius: '8px',
            border: '1px solid var(--color-border)',
            fontWeight: '500'
          }}>
            🔍 {questionnaires.length} questionnaire{questionnaires.length !== 1 ? 's' : ''} trouvé{questionnaires.length !== 1 ? 's' : ''}
          </div>
        )}
      </ModernFilterSection>

      <ModernListContainer>
        <ModernTitle>Questionnaires Publics</ModernTitle>
        
        <ModernSearchBar
          type="text"
          placeholder="🔍 Rechercher un questionnaire public..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {questionnaires.length === 0 ? (
          <EmptyState>
            <h3>Aucun questionnaire public trouvé</h3>
            <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
          </EmptyState>
        ) : (
          <QuestionnairesGrid>
            {questionnaires.map((questionnaire) => (
              <ModernQuestionnaireCard key={questionnaire._id}>
                <CardContent>
                  <QuestionnaireTitle>
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

                  {/* NOUVEAU : Section de notation pour chaque questionnaire */}
                  <RatingSection>
                    <div onClick={(e) => e.stopPropagation()}>
                      <RatingStars
                        itemId={questionnaire._id}
                        itemType="questionnaire"
                        averageRating={questionnaire.averageRating}
                        ratingsCount={questionnaire.ratingsCount}
                        userRating={questionnaire.userRating}
                        onRatingUpdate={(newRatingData) => handleRatingUpdate(questionnaire._id, newRatingData)}
                        size={14}
                        compact={true}
                      />
                    </div>
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

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <ActionButton
                        as={Link}
                        to={`/use/${questionnaire._id}`}
                        title="Utiliser ce questionnaire"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye size={16} />
                      </ActionButton>
                      
                      <ActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          addToMyQuestionnaires(questionnaire._id);
                        }}
                        title="Copier dans mes questionnaires"
                      >
                        <Copy size={16} />
                      </ActionButton>
                    </div>
                  </StatsContainer>

                  <ActionButtons>
                    <PrimaryActionButton onClick={() => addToMyQuestionnaires(questionnaire._id)}>
                      ➕ Ajouter à mes questionnaires
                    </PrimaryActionButton>
                    
                    <SecondaryActionButton to={`/use/${questionnaire._id}`}>
                      ▶️ UTILISER
                    </SecondaryActionButton>
                  </ActionButtons>
                </CardContent>
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