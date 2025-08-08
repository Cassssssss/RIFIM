// PublicQuestionnairesPage.js - VERSION OPTIMISÉE PLEINE LARGEUR
import React, { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axiosConfig';
import { Clock, Users, FileText, Star, TrendingUp, User } from 'lucide-react';
import RatingStars from '../components/RatingStars';

// Import du système de filtres unifié
import UnifiedFilterSystem from '../components/shared/UnifiedFilterSystem';

// Import des composants partagés
import {
  PageContainer,
  ListContainer,
  SearchInput,
  QuestionnairesGrid,
  QuestionnaireCard,
  CardHeader,
  QuestionnaireTitle,
  QuestionnaireIcon,
  CardMeta,
  MetaItem,
  TagsContainer,
  Tag,
  ActionButtons,
  ActionButton,
  LoadingMessage,
  ErrorMessage
} from '../components/shared/SharedComponents';

// Import pour la pagination
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';

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
  const [questionnaireRatings, setQuestionnaireRatings] = useState({});

  // 🔧 OPTIMISATION : Plus de questionnaires par page
  const ITEMS_PER_PAGE = 24;

  const modalityOptions = ['Rx', 'TDM', 'IRM', 'Echo'];
  const specialtyOptions = ['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo', 'Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'];
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
          limit: ITEMS_PER_PAGE,
          search: searchTerm,
          modality: modalityFilters.join(','),
          specialty: specialtyFilters.join(','),
          location: locationFilters.join(',')
        }
      });
      
      const questionnaires = response.data?.questionnaires;
      const safeQuestionnaires = Array.isArray(questionnaires) ? questionnaires : [];

      setQuestionnaires(safeQuestionnaires);
      setCurrentPage(page);
      setTotalPages(response.data?.totalPages || 0);

      // Initialisation des ratings
      const ratings = {};
      safeQuestionnaires.forEach(q => {
        ratings[q._id] = {
          averageRating: q.averageRating || 0,
          ratingsCount: q.ratingsCount || 0,
          userRating: q.userRating || 0
        };
      });
      setQuestionnaireRatings(ratings);

    } catch (error) {
      console.error('❌ Erreur lors de la récupération des questionnaires publics:', error);
      setQuestionnaires([]);
      setCurrentPage(1);
      setTotalPages(0);
      setError('Erreur lors du chargement des questionnaires publics');
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters, ITEMS_PER_PAGE]);

  useEffect(() => {
    fetchQuestionnaires(1);
  }, [fetchQuestionnaires]);

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

  const handleRatingUpdate = (questionnaireId, newRatingData) => {
    setQuestionnaireRatings(prev => ({
      ...prev,
      [questionnaireId]: newRatingData
    }));
  };

  const getAuthorDisplayName = (questionnaire) => {
    if (!questionnaire.author) return 'Auteur anonyme';
    
    if (typeof questionnaire.author === 'object') {
      return questionnaire.author.name || questionnaire.author.email || 'Auteur anonyme';
    }
    
    if (typeof questionnaire.author === 'string') {
      return questionnaire.author;
    }
    
    return 'Auteur anonyme';
  };

  // Configuration des filtres
  const filtersConfig = [
    {
      key: 'modality',
      title: 'Modalités',
      icon: '📊',
      options: modalityOptions,
      selectedValues: modalityFilters,
      onChange: setModalityFilters
    },
    {
      key: 'specialty',
      title: 'Spécialités',
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
    <PageContainer style={{ 
      maxWidth: '100%',  // 🔧 OPTIMISATION : Utilise toute la largeur
      padding: '1rem 2rem',  // 🔧 OPTIMISATION : Padding horizontal
      width: '100vw'
    }}>
      {/* TITRE CENTRÉ */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '2rem' 
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '0.5rem'
        }}>
          📋 Questionnaires Publics
        </h1>
      </div>

      {/* CONTENU PRINCIPAL */}
      <ListContainer style={{ 
        maxWidth: '100%',  // 🔧 OPTIMISATION : Conteneur pleine largeur
        width: '100%',
        padding: '0'
      }}>
        {/* BARRE DE RECHERCHE */}
        <SearchInput
          type="text"
          placeholder="🔍 Rechercher un questionnaire..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            maxWidth: '800px',  // 🔧 OPTIMISATION : Limite raisonnable
            margin: '0 auto 2rem',  // 🔧 OPTIMISATION : Centre la barre
            display: 'block'
          }}
        />

        {/* SYSTÈME DE FILTRES */}
        <div style={{ 
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'center'  // 🔧 OPTIMISATION : Centre les filtres
        }}>
          <UnifiedFilterSystem
            filters={filtersConfig}
            style={{ justifyContent: 'center' }}
          />
        </div>

        {/* MESSAGES D'ÉTAT */}
        {isLoading && (
          <LoadingMessage>Chargement des questionnaires publics...</LoadingMessage>
        )}

        {error && (
          <ErrorMessage>{error}</ErrorMessage>
        )}

        {/* GRILLE DES QUESTIONNAIRES - PLEINE LARGEUR */}
        {!isLoading && !error && (
          <div style={{ 
            width: '100%',  // 🔧 OPTIMISATION : Wrapper pleine largeur
            maxWidth: '100%',
            padding: '0'
          }}>
            <QuestionnairesGrid style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',  // 🔧 OPTIMISATION : Plus de cartes
              gap: '1.2rem',  // 🔧 OPTIMISATION : Gap réduit
              margin: '0',
              padding: '0',
              width: '100%',
              maxWidth: '100%'  // 🔧 OPTIMISATION : Force la pleine largeur
            }}>
              {questionnaires.map((questionnaire) => (
                <QuestionnaireCard key={questionnaire._id}>
                  <CardHeader>
                    <QuestionnaireTitle>
                      <QuestionnaireIcon>
                        {getQuestionnaireIcon(questionnaire.tags)}
                      </QuestionnaireIcon>
                      {questionnaire.title}
                    </QuestionnaireTitle>
                  </CardHeader>

                  {/* Auteur */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    color: 'var(--color-text-secondary)',
                    fontSize: '0.85rem',
                    marginBottom: '0.5rem'
                  }}>
                    <User size={14} />
                    Par {getAuthorDisplayName(questionnaire)}
                  </div>

                  {/* Tags */}
                  <TagsContainer>
                    {questionnaire.tags && questionnaire.tags.map((tag, index) => (
                      <Tag key={index}>{tag}</Tag>
                    ))}
                  </TagsContainer>

                  {/* Rating */}
                  <div style={{ margin: '0.5rem 0' }}>
                    <RatingStars
                      itemId={questionnaire._id}
                      itemType="questionnaire"
                      averageRating={questionnaireRatings[questionnaire._id]?.averageRating || 0}
                      ratingsCount={questionnaireRatings[questionnaire._id]?.ratingsCount || 0}
                      userRating={questionnaireRatings[questionnaire._id]?.userRating || 0}
                      onRatingUpdate={(newData) => handleRatingUpdate(questionnaire._id, newData)}
                      size={14}
                      compact={true}
                    />
                  </div>

                  {/* Métadonnées */}
                  <CardMeta>
                    <MetaItem>
                      <Clock size={14} />
                      <span>{formatDate(questionnaire.updatedAt || questionnaire.createdAt)}</span>
                    </MetaItem>
                    <MetaItem>
                      <Users size={14} />
                      <span>{questionnaire.attempts || 0} utilisations</span>
                    </MetaItem>
                    <MetaItem>
                      <FileText size={14} />
                      <span>{questionnaire.questions?.length || 0} questions</span>
                    </MetaItem>
                    <MetaItem>
                      <Clock size={14} />
                      <span>{estimateTime(questionnaire)}</span>
                    </MetaItem>
                  </CardMeta>

                  {/* Actions */}
                  <ActionButtons>
                    <ActionButton to={`/use/${questionnaire._id}`}>
                      ⭐ Noter ce questionnaire
                    </ActionButton>
                    
                    <ActionButton 
                      to={`/use/${questionnaire._id}`}
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                      }}
                    >
                      📝 Utiliser
                    </ActionButton>
                  </ActionButtons>
                </QuestionnaireCard>
              ))}
            </QuestionnairesGrid>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <PaginationContainer style={{ 
            maxWidth: '600px',
            margin: '3rem auto',  // 🔧 OPTIMISATION : Centre la pagination
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <PaginationButton 
              onClick={() => fetchQuestionnaires(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              ← Précédent
            </PaginationButton>
            
            <PaginationInfo>
              Page {currentPage} sur {totalPages}
            </PaginationInfo>
            
            <PaginationButton 
              onClick={() => fetchQuestionnaires(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Suivant →
            </PaginationButton>
          </PaginationContainer>
        )}
      </ListContainer>
    </PageContainer>
  );
}

export default PublicQuestionnairesPage;