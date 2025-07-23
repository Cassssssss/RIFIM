// PublicQuestionnairesPage.js - VERSION AVEC SHARED COMPONENTS
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ChevronDown, ChevronUp, Clock, Users, FileText, TrendingUp, User, Eye, Plus } from 'lucide-react';
import axios from '../utils/axiosConfig';
import RatingStars from '../components/RatingStars';

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

const FilterSection = styled.div`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const FilterGroup = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
`;

const FilterTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  user-select: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.theme.primary};
  }

  svg {
    transition: transform 0.2s ease;
    transform: ${props => props.collapsed ? 'rotate(0deg)' : 'rotate(180deg)'};
  }
`;

const FilterContent = styled.div`
  max-height: ${props => props.collapsed ? '0' : '500px'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FilterOption = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  font-size: 0.85rem;
  color: ${props => props.theme.text};

  &:hover {
    background-color: ${props => props.theme.hover};
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.primary};
  }
`;

const ActiveFiltersIndicator = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.primary};
  color: ${props => props.theme.primary};
  padding: 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  
  &::before {
    content: "🎯 ";
    margin-right: 0.5rem;
  }
`;

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
    background-color: ${props => props.theme.primaryHover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const PaginationInfo = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #dc2626;
  background-color: #fef2f2;
  border-radius: 8px;
  margin: 2rem 0;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};

  h3 {
    color: ${props => props.theme.primary};
    margin-bottom: 1rem;
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

function PublicQuestionnairesPage() {
  // États
  const [questionnaires, setQuestionnaires] = useState([]);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [questionnairesPerPage] = useState(12);

  // États des filtres
  const [modalityFilter, setModalityFilter] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);

  // États de collapse pour les filtres
  const [modalityCollapsed, setModalityCollapsed] = useState(false);
  const [specialtyCollapsed, setSpecialtyCollapsed] = useState(false);
  const [locationCollapsed, setLocationCollapsed] = useState(false);

  // Options de filtres
  const modalityOptions = ['IRM', 'Scanner', 'Échographie', 'Radiographie', 'Mammographie'];
  const specialtyOptions = ['Neuroradiologie', 'Cardiologie', 'Orthopédie', 'Gastroentérologie', 'Pneumologie'];
  const locationOptions = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Strasbourg'];

  // Récupération des questionnaires
  const fetchQuestionnaires = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/questionnaires/public');
      
      if (response.data && Array.isArray(response.data)) {
        setQuestionnaires(response.data);
      } else {
        setQuestionnaires([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des questionnaires:', error);
      setError('Erreur lors du chargement des questionnaires publics.');
      setQuestionnaires([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestionnaires();
  }, [fetchQuestionnaires]);

  // Filtrage et recherche
  useEffect(() => {
    let filtered = questionnaires;

    // Recherche par terme
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(q => 
        (q.title && q.title.toLowerCase().includes(term)) ||
        (q.description && q.description.toLowerCase().includes(term)) ||
        (q.tags && q.tags.some(tag => tag.toLowerCase().includes(term)))
      );
    }

    // Filtres par modalité
    if (modalityFilter.length > 0) {
      filtered = filtered.filter(q => 
        q.tags && q.tags.some(tag => modalityFilter.includes(tag))
      );
    }

    // Filtres par spécialité
    if (specialtyFilter.length > 0) {
      filtered = filtered.filter(q => 
        q.tags && q.tags.some(tag => specialtyFilter.includes(tag))
      );
    }

    // Filtres par localisation
    if (locationFilter.length > 0) {
      filtered = filtered.filter(q => 
        q.tags && q.tags.some(tag => locationFilter.includes(tag))
      );
    }

    setFilteredQuestionnaires(filtered);
    setCurrentPage(1);
    setTotalPages(Math.ceil(filtered.length / questionnairesPerPage));
  }, [questionnaires, searchTerm, modalityFilter, specialtyFilter, locationFilter, questionnairesPerPage]);

  // Gestionnaires de filtres
  const handleModalityChange = (modality) => {
    setModalityFilter(prev => 
      prev.includes(modality) 
        ? prev.filter(m => m !== modality)
        : [...prev, modality]
    );
  };

  const handleSpecialtyChange = (specialty) => {
    setSpecialtyFilter(prev => 
      prev.includes(specialty) 
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const handleLocationChange = (location) => {
    setLocationFilter(prev => 
      prev.includes(location) 
        ? prev.filter(l => l !== location)
        : [...prev, location]
    );
  };

  // Copie de questionnaire
  const handleCopyQuestionnaire = async (questionnaireId) => {
    try {
      await axios.post(`/questionnaires/${questionnaireId}/copy`);
      alert('Questionnaire copié avec succès dans vos questionnaires personnels !');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      alert('Erreur lors de la copie du questionnaire.');
    }
  };

  // Pagination
  const startIndex = (currentPage - 1) * questionnairesPerPage;
  const endIndex = startIndex + questionnairesPerPage;
  const currentQuestionnaires = filteredQuestionnaires.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Nombre total de filtres actifs
  const activeFiltersCount = modalityFilter.length + specialtyFilter.length + locationFilter.length;

  // Rendu du composant
  return (
    <PageContainer>
      <Title>🗃️ Questionnaires Publics</Title>
      
      <ContentWrapper>
        {/* Section des filtres */}
        <FilterSection>
          {activeFiltersCount > 0 && (
            <ActiveFiltersIndicator>
              {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
            </ActiveFiltersIndicator>
          )}

          {/* Filtre Modalité */}
          <FilterGroup>
            <FilterTitle 
              collapsed={modalityCollapsed}
              onClick={() => setModalityCollapsed(!modalityCollapsed)}
            >
              📊 Modalité
              <ChevronDown size={16} />
            </FilterTitle>
            <FilterContent collapsed={modalityCollapsed}>
              <FilterOptions>
                {modalityOptions.map(modality => (
                  <FilterOption key={modality}>
                    <input
                      type="checkbox"
                      checked={modalityFilter.includes(modality)}
                      onChange={() => handleModalityChange(modality)}
                    />
                    {modality}
                  </FilterOption>
                ))}
              </FilterOptions>
            </FilterContent>
          </FilterGroup>

          {/* Filtre Spécialité */}
          <FilterGroup>
            <FilterTitle 
              collapsed={specialtyCollapsed}
              onClick={() => setSpecialtyCollapsed(!specialtyCollapsed)}
            >
              🩺 Spécialité
              <ChevronDown size={16} />
            </FilterTitle>
            <FilterContent collapsed={specialtyCollapsed}>
              <FilterOptions>
                {specialtyOptions.map(specialty => (
                  <FilterOption key={specialty}>
                    <input
                      type="checkbox"
                      checked={specialtyFilter.includes(specialty)}
                      onChange={() => handleSpecialtyChange(specialty)}
                    />
                    {specialty}
                  </FilterOption>
                ))}
              </FilterOptions>
            </FilterContent>
          </FilterGroup>

          {/* Filtre Localisation */}
          <FilterGroup>
            <FilterTitle 
              collapsed={locationCollapsed}
              onClick={() => setLocationCollapsed(!locationCollapsed)}
            >
              📍 Localisation
              <ChevronDown size={16} />
            </FilterTitle>
            <FilterContent collapsed={locationCollapsed}>
              <FilterOptions>
                {locationOptions.map(location => (
                  <FilterOption key={location}>
                    <input
                      type="checkbox"
                      checked={locationFilter.includes(location)}
                      onChange={() => handleLocationChange(location)}
                    />
                    {location}
                  </FilterOption>
                ))}
              </FilterOptions>
            </FilterContent>
          </FilterGroup>
        </FilterSection>

        {/* Liste des questionnaires */}
        <ListContainer>
          <SearchBar
            type="text"
            placeholder="Rechercher un questionnaire..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {loading ? (
            <LoadingMessage>Chargement des questionnaires...</LoadingMessage>
          ) : error ? (
            <ErrorMessage>{error}</ErrorMessage>
          ) : currentQuestionnaires.length === 0 ? (
            <EmptyState>
              <h3>Aucun questionnaire trouvé</h3>
              <p>Essayez de modifier vos critères de recherche ou de filtrage.</p>
            </EmptyState>
          ) : (
            <>
              <QuestionnairesGrid>
                {currentQuestionnaires.map((questionnaire, index) => {
                  const isPopular = questionnaire.usageCount > 50;
                  
                  return (
                    <QuestionnaireCard key={questionnaire._id || index}>
                      <CardHeader>
                        <QuestionnaireTitle to={`/questionnaires/use/${questionnaire._id}`}>
                          <QuestionnaireIcon>📋</QuestionnaireIcon>
                          {questionnaire.title || 'Questionnaire sans titre'}
                          {isPopular && (
                            <PopularityBadge>
                              <TrendingUp size={12} />
                              Populaire
                            </PopularityBadge>
                          )}
                        </QuestionnaireTitle>
                      </CardHeader>

                      <AuthorInfo>
                        <User size={14} />
                        Par {questionnaire.createdBy?.username || questionnaire.createdBy?.email || 'Auteur anonyme'}
                      </AuthorInfo>

                      <CardMeta>
                        <MetaItem>
                          <Clock size={14} />
                          {new Date(questionnaire.createdAt).toLocaleDateString('fr-FR')}
                        </MetaItem>
                        <MetaItem>
                          <Users size={14} />
                          Public
                        </MetaItem>
                        <MetaItem>
                          <FileText size={14} />
                          {questionnaire.questions?.length || 0} questions
                        </MetaItem>
                        <MetaItem>
                          <Eye size={14} />
                          {questionnaire.usageCount || 0} vues
                        </MetaItem>
                      </CardMeta>

                      <div onClick={(e) => e.stopPropagation()}>
                        <RatingStars
                          itemId={questionnaire._id}
                          itemType="questionnaire"
                          averageRating={questionnaire.averageRating || 0}
                          ratingsCount={questionnaire.ratingsCount || 0}
                          userRating={questionnaire.userRating || 0}
                          onRatingUpdate={() => {}}
                          size={14}
                          compact={true}
                        />
                      </div>

                      {questionnaire.tags && questionnaire.tags.length > 0 && (
                        <TagsContainer>
                          {questionnaire.tags.map((tag, tagIndex) => (
                            <Tag key={tagIndex}>{tag}</Tag>
                          ))}
                        </TagsContainer>
                      )}

                      <ActionButtons>
                        <ActionButton to={`/questionnaires/use/${questionnaire._id}`}>
                          <Eye size={14} />
                          Utiliser
                        </ActionButton>
                        
                        <CopyButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCopyQuestionnaire(questionnaire._id);
                          }}
                          title="Copier dans mes questionnaires"
                        >
                          <Plus size={14} />
                        </CopyButton>
                      </ActionButtons>
                    </QuestionnaireCard>
                  );
                })}
              </QuestionnairesGrid>

              {/* Pagination */}
              {totalPages > 1 && (
                <PaginationContainer>
                  <PaginationButton 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    ← Précédent
                  </PaginationButton>
                  
                  <PaginationInfo>
                    Page {currentPage} sur {totalPages} • {filteredQuestionnaires.length} questionnaires
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