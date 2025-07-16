// pages/QuestionnaireListPage.js - VERSION MODERNE COMPLÈTE
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { ChevronDown, ChevronUp, Plus, Edit, FileText, Copy, Trash2, Eye, EyeOff, Star, Clock, Users, Search } from 'lucide-react';
import TutorialOverlay from '../components/TutorialOverlay';

// ==================== STYLED COMPONENTS ====================

const PageWrapper = styled.div`
  background: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 0;
`;

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  width: 280px;
  background: ${props => props.theme.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  height: fit-content;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SidebarTitle = styled.h3`
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterGroup = styled.div`
  margin-bottom: 2rem;
`;

const FilterItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s ease;
  color: ${props => props.theme.text};

  &:hover {
    background: ${props => props.theme.hover};
  }

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${props => props.theme.primary};
  }
`;

const MainContent = styled.div`
  flex: 1;
`;

const SearchSection = styled.div`
  background: ${props => props.theme.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
`;

const SearchBox = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  background: ${props => props.theme.backgroundSolid};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.borderFocus};
    box-shadow: 0 0 0 3px ${props => props.theme.focus};
  }

  &::placeholder {
    color: ${props => props.theme.textLight};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textLight};
  width: 20px;
  height: 20px;
`;

const StatsBar = styled.div`
  background: ${props => props.theme.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

const QuestionnairesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const QuestionnaireCard = styled.div`
  background: ${props => props.theme.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 2px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px ${props => props.theme.shadowMedium};
    border-color: ${props => props.theme.primary};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.3;
`;

const CardIcon = styled.div`
  width: 24px;
  height: 24px;
  background: ${props => props.theme.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.textInverse};
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const StatusBadge = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.full};
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: ${props => props.isPublic ? props.theme.statusPublic : props.theme.statusPrivate};
  color: ${props => props.isPublic ? props.theme.statusPublicText : props.theme.statusPrivateText};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tag = styled.span`
  background: ${props => props.theme.tagBackground};
  color: ${props => props.theme.tagText};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: 500;
`;

const CardMeta = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: ${props => props.theme.cardSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.primary};
  }
`;

const CardActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const Button = styled.button`
  padding: ${props => props.size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  font-size: ${props => props.size === 'large' ? '0.95rem' : '0.85rem'};
  min-width: ${props => props.size === 'large' ? '140px' : 'auto'};
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
  }

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: ${props.theme.primary};
          color: ${props.theme.textInverse};
          flex: 1;
          
          &:hover {
            background: ${props.theme.primaryHover};
            transform: translateY(-1px);
          }
        `;
      case 'secondary':
        return `
          background: ${props.theme.buttonSecondary};
          color: ${props.theme.buttonSecondaryText};
          border: 1px solid ${props.theme.border};
          
          &:hover {
            background: ${props.theme.hover};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.errorLight};
          color: ${props.theme.buttonDanger};
          border: 1px solid ${props.theme.error}30;
          
          &:hover {
            background: ${props.theme.error};
            color: ${props.theme.textInverse};
          }
        `;
      default:
        return `
          background: ${props.theme.buttonSecondary};
          color: ${props.theme.buttonSecondaryText};
        `;
    }
  }}
`;

const CopyBadge = styled.div`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: ${props => props.theme.accent};
  color: ${props => props.theme.textInverse};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.sm};
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CreateButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${props => props.theme.secondary};
  color: ${props => props.theme.textInverse};
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 20px ${props => props.theme.secondary}50;
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px ${props => props.theme.secondary}70;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: ${props => props.theme.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.disabled ? props.theme.cardSecondary : props.theme.primary};
  color: ${props => props.disabled ? props.theme.textLight : props.theme.textInverse};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: ${props => props.theme.primaryHover};
  }
`;

const PaginationInfo = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

const TutorialButton = styled.button`
  background: ${props => props.theme.secondary};
  color: ${props => props.theme.textInverse};
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 1rem;
  
  &:hover {
    background: ${props => props.theme.secondaryHover};
    transform: translateY(-1px);
  }
`;

const VideoContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: ${props => props.theme.card};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};

  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
    font-size: 1.2rem;
    font-weight: 600;
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
    border-radius: ${props => props.theme.borderRadius.md};

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: ${props => props.theme.borderRadius.md};
    }
  }
`;

// ==================== HELPER FUNCTIONS ====================

const getQuestionnaireIcon = (tags) => {
  if (tags?.includes('IRM')) return '🧠';
  if (tags?.includes('TDM')) return '🫁';
  if (tags?.includes('Echo')) return '❤️';
  if (tags?.includes('Rx')) return '🦴';
  return '📋';
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaines`;
  return `Il y a ${Math.ceil(diffDays / 30)} mois`;
};

const estimateTime = (questionnaire) => {
  const questionCount = questionnaire.questions?.length || 0;
  const estimatedMinutes = Math.max(2, Math.ceil(questionCount * 0.5));
  return `~${estimatedMinutes} min`;
};

// ==================== COMPONENT PRINCIPAL ====================

function QuestionnaireListPage() {
  // États
  const [questionnaires, setQuestionnaires] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalQuestionnaires, setTotalQuestionnaires] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilters, setModalityFilters] = useState([]);
  const [specialtyFilters, setSpecialtyFilters] = useState([]);
  const [locationFilters, setLocationFilters] = useState([]);
  const [showTutorial, setShowTutorial] = useState(false);
  const [loading, setLoading] = useState(false);

  // Données de filtres
  const modalities = ['Rx', 'TDM', 'IRM', 'Echo'];
  const specialties = ['Cardiovasc', 'Dig', 'Neuro', 'ORL', 'Ostéo', 'Pedia', 'Pelvis', 'Séno', 'Thorax', 'Uro'];
  const locations = ['Genou', 'Épaule', 'Rachis', 'Cheville', 'Poignet', 'Hanche'];

  // Fonction de récupération des questionnaires
  const fetchQuestionnaires = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
        search: searchTerm,
        modality: modalityFilters.join(','),
        specialty: specialtyFilters.join(','),
        location: locationFilters.join(',')
      });

      const response = await axios.get(`/questionnaires?${params}`);
      setQuestionnaires(response.data.questionnaires);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      setTotalQuestionnaires(response.data.totalQuestionnaires);
    } catch (error) {
      console.error('Erreur lors de la récupération des questionnaires:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, modalityFilters, specialtyFilters, locationFilters]);

  // Effet pour charger les questionnaires
  useEffect(() => {
    fetchQuestionnaires(1);
  }, [fetchQuestionnaires]);

  // Handlers des filtres
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

  // Fonction de changement de visibilité
  const toggleVisibility = async (id, isPublic) => {
    try {
      await axios.patch(`/questionnaires/${id}`, { public: !isPublic });
      fetchQuestionnaires(currentPage);
    } catch (error) {
      console.error('Erreur lors de la modification de la visibilité:', error);
    }
  };

  // Fonction de suppression
  const deleteQuestionnaire = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce questionnaire ?')) {
      try {
        await axios.delete(`/questionnaires/${id}`);
        fetchQuestionnaires(currentPage);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  // Calcul des statistiques
  const publicCount = questionnaires.filter(q => q.public).length;
  const privateCount = questionnaires.filter(q => !q.public).length;
  const thisWeekCount = questionnaires.filter(q => {
    const created = new Date(q.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return created > weekAgo;
  }).length;

  // Steps du tutoriel (vous pouvez les personnaliser)
  const tutorialSteps = [
    {
      image: ['/tutorials/questionnaire-1.png'],
      description: 'Bienvenue dans la liste de vos questionnaires ! Ici vous pouvez voir tous vos questionnaires créés.'
    },
    {
      image: ['/tutorials/questionnaire-2.png'], 
      description: 'Utilisez les filtres à gauche pour rechercher par modalité, spécialité ou localisation.'
    },
    {
      image: ['/tutorials/questionnaire-3.png'],
      description: 'Cliquez sur UTILISER pour remplir un questionnaire, ou sur les autres boutons pour le modifier.'
    }
  ];

  // ==================== RENDU COMPONENT ====================

  return (
    <PageWrapper>
      <Container>
        {/* SIDEBAR - FILTRES */}
        <Sidebar>
          <FilterGroup>
            <SidebarTitle>
              🔍 Modalités
            </SidebarTitle>
            {modalities.map(modality => (
              <FilterItem key={modality}>
                <input
                  type="checkbox"
                  checked={modalityFilters.includes(modality)}
                  onChange={() => handleModalityFilter(modality)}
                />
                <span>{modality}</span>
              </FilterItem>
            ))}
          </FilterGroup>

          <FilterGroup>
            <SidebarTitle>
              🏥 Spécialités
            </SidebarTitle>
            {specialties.map(specialty => (
              <FilterItem key={specialty}>
                <input
                  type="checkbox"
                  checked={specialtyFilters.includes(specialty)}
                  onChange={() => handleSpecialtyFilter(specialty)}
                />
                <span>{specialty}</span>
              </FilterItem>
            ))}
          </FilterGroup>

          <FilterGroup>
            <SidebarTitle>
              📍 Localisation
            </SidebarTitle>
            {locations.map(location => (
              <FilterItem key={location}>
                <input
                  type="checkbox"
                  checked={locationFilters.includes(location)}
                  onChange={() => handleLocationFilter(location)}
                />
                <span>{location}</span>
              </FilterItem>
            ))}
          </FilterGroup>
        </Sidebar>

        {/* CONTENU PRINCIPAL */}
        <MainContent>
          {/* BARRE DE RECHERCHE */}
          <SearchSection>
            <SearchBox>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="🔍 Rechercher un questionnaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SearchBox>
          </SearchSection>

          {/* STATISTIQUES */}
          <StatsBar>
            <StatItem>
              <StatNumber>{totalQuestionnaires}</StatNumber>
              <StatLabel>Questionnaires</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{publicCount}</StatNumber>
              <StatLabel>Publics</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{privateCount}</StatNumber>
              <StatLabel>Privés</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber>{thisWeekCount}</StatNumber>
              <StatLabel>Cette semaine</StatLabel>
            </StatItem>
          </StatsBar>

          {/* GRILLE DES QUESTIONNAIRES */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div>Chargement...</div>
            </div>
          ) : (
            <QuestionnairesGrid>
              {questionnaires.map((questionnaire) => (
                <QuestionnaireCard key={questionnaire._id}>
                  {/* Badge copie si applicable */}
                  {questionnaire.title.toLowerCase().includes('copie') && (
                    <CopyBadge>COPIE</CopyBadge>
                  )}

                  {/* En-tête de la carte */}
                  <CardHeader>
                    <div>
                      <CardTitle>
                        <CardIcon>
                          {getQuestionnaireIcon(questionnaire.tags)}
                        </CardIcon>
                        {questionnaire.title}
                      </CardTitle>
                    </div>
                    <StatusBadge isPublic={questionnaire.public}>
                      {questionnaire.public ? (
                        <>🌐 Public</>
                      ) : (
                        <>🔒 Privé</>
                      )}
                    </StatusBadge>
                  </CardHeader>

                  {/* Tags */}
                  {questionnaire.tags && questionnaire.tags.length > 0 && (
                    <TagsContainer>
                      {questionnaire.tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                      ))}
                    </TagsContainer>
                  )}

                  {/* Métadonnées */}
                  <CardMeta>
                    <MetaItem>
                      <Clock />
                      <span>{formatDate(questionnaire.updatedAt || questionnaire.createdAt)}</span>
                    </MetaItem>
                    <MetaItem>
                      <Users />
                      <span>Pas encore utilisé</span> {/* Vous pouvez ajouter un compteur d'utilisation */}
                    </MetaItem>
                    <MetaItem>
                      <Star />
                      <span>{questionnaire.public ? 'Public' : 'Personnel'}</span>
                    </MetaItem>
                    <MetaItem>
                      <Clock />
                      <span>{estimateTime(questionnaire)}</span>
                    </MetaItem>
                  </CardMeta>

                  {/* Actions */}
                  <CardActions>
                    <Button 
                      as={Link} 
                      to={`/questionnaires/${questionnaire._id}/use`}
                      variant="primary" 
                      size="large"
                    >
                      ▶️ UTILISER
                    </Button>
                    
                    <Button 
                      as={Link} 
                      to={`/questionnaires/${questionnaire._id}/edit`}
                      variant="secondary"
                    >
                      <Edit />
                      Modifier
                    </Button>
                    
                    <Button 
                      as={Link} 
                      to={`/questionnaires/${questionnaire._id}/cr`}
                      variant="secondary"
                    >
                      <FileText />
                      CR
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      onClick={() => {
                        // Logique de duplication
                        console.log('Dupliquer:', questionnaire._id);
                      }}
                    >
                      <Copy />
                      Dupliquer
                    </Button>
                    
                    <Button 
                      variant="secondary"
                      onClick={() => toggleVisibility(questionnaire._id, questionnaire.public)}
                    >
                      {questionnaire.public ? <EyeOff /> : <Eye />}
                      {questionnaire.public ? 'Rendre privé' : 'Rendre public'}
                    </Button>
                    
                    <Button 
                      variant="danger"
                      onClick={() => deleteQuestionnaire(questionnaire._id)}
                    >
                      <Trash2 />
                    </Button>
                  </CardActions>
                </QuestionnaireCard>
              ))}
            </QuestionnairesGrid>
          )}

          {/* PAGINATION */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationButton
                onClick={() => fetchQuestionnaires(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ⬅️ Précédent
              </PaginationButton>
              <PaginationInfo>
                Page {currentPage} sur {totalPages}
              </PaginationInfo>
              <PaginationButton
                onClick={() => fetchQuestionnaires(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Suivant ➡️
              </PaginationButton>
            </Pagination>
          )}

          {/* BOUTON TUTORIEL */}
          <TutorialButton onClick={() => setShowTutorial(true)}>
            📚 Voir le tutoriel
          </TutorialButton>

          {/* TUTORIEL OVERLAY */}
          {showTutorial && (
            <TutorialOverlay 
              steps={tutorialSteps} 
              onClose={() => setShowTutorial(false)} 
            />
          )}

          {/* VIDÉOS TUTORIELS */}
          <VideoContainer>
            <h3>📺 Tutoriel vidéo</h3>
            <div className="video-wrapper">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/h525ujn4jBc"
                title="Tutoriel questionnaires"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </VideoContainer>

          <VideoContainer>
            <h3>📺 Tutoriel avancé</h3>
            <div className="video-wrapper">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/oIC9UXnVnOk"
                title="Tutoriel avancé questionnaires"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </VideoContainer>
        </MainContent>
      </Container>

      {/* BOUTON FLOTTANT DE CRÉATION */}
      <CreateButton as={Link} to="/create" title="Créer un nouveau questionnaire">
        <Plus />
      </CreateButton>
    </PageWrapper>
  );
}

export default QuestionnaireListPage;