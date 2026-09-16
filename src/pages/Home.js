import { pageHeading, pageTitle } from '../components/shared/designSystem';
import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import {
  FileText,
  FolderOpen,
  Plus,
  Globe,
  Activity,
  BarChart3,
  Clock,
  Users,
  ChevronRight
} from 'lucide-react';

// CONTENEUR PRINCIPAL
const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
  padding: 0 0 2rem;

  @media (max-width: 768px) {
    min-height: calc(100vh - 60px);
  }
`;

// CONTENEUR INTERNE
const ContentWrapper = styled.div`
  width: 100%;
`;

// EN-TÊTE : l'utilisateur est déjà connecté et la marque figure dans le rail
// de gauche. Inutile de lui resservir un bandeau d'accueil pleine hauteur :
// on l'accueille par son nom et on affiche ses chiffres sur la même ligne.
const HeroSection = styled.div`
  ${pageHeading}
  padding-top: 0.75rem;
`;

const Eyebrow = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 0.65rem;
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
`;

const Title = styled.h1`
  ${pageTitle}
  font-size: clamp(2rem, 3vw, 2.8rem);
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  line-height: 1.5;
`;

// GRILLE PRINCIPALE
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
  @media (max-width: 1150px) { grid-template-columns: 1fr; }
`;

// SECTION CATÉGORIE
const CategorySection = styled.div`
  position: relative;
  min-width: 0;
  background: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.radii.card};
  padding: 1.5rem;
  box-shadow: ${props => props.theme.shadows.card};
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 1.5rem;
    width: 42px;
    height: 3px;
    border-radius: 4px;
    background: ${props => props.$tone};
  }
  @media (max-width: 768px) { padding: 1.1rem; }

`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const CategoryIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${props => props.color}15;
  color: ${props => props.color};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const CategoryCount = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 999px;
  min-width: 28px;
  text-align: center;
  padding: 0.15rem 0.4rem;
`;

const CategoryActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ActionLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  padding: 0.85rem 0.5rem;
  border-radius: ${props => props.theme.radii.md};
  text-decoration: none;
  transition: background 160ms ease;
  &:hover { background: ${props => props.theme.cardSecondary}; }

`;

const ActionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
`;

const ActionIconSmall = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${props => props.color}15;
  color: ${props => props.color};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const ActionText = styled.div`
  flex: 1;
`;

const ActionTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.125rem;
`;

const ActionDescription = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
`;

const ActionArrow = styled.div`
  color: ${props => props.theme.textSecondary};
  opacity: 0.5;
  transform: translateX(0);
  transition: all 0.2s ease;

  ${ActionLink}:hover & {
    opacity: 1;
    transform: translateX(0);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// SECTION STATISTIQUES — compacte, dans l'en-tête, en ligne.
// Trois grands « 0 » pleine largeur, c'est l'accueil le plus décourageant
// possible pour un compte neuf : on les réduit à un simple récapitulatif.
const StatsSection = styled.div`
  display: flex;
  align-items: baseline;
  gap: 1.75rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }
`;

const StatCard = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.45rem;
`;

const StatValue = styled.span`
  font-size: 1.4rem;
  font-weight: 700;
  color: ${props => props.color};
  line-height: 1;
`;

const StatLabel = styled.span`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

// SECTION ACTIVITÉ RÉCENTE
const RecentSection = styled.div`
  background: ${props => props.theme.card};
  border-radius: ${props => props.theme.radii.card};
  padding: 2rem;
  border: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.textSecondary};
  }
`;

const ViewAllLink = styled(Link)`
  font-size: 0.875rem;
  color: ${props => props.theme.primary};
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: gap 0.2s ease;

  &:hover {
    gap: 0.5rem;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RecentItem = styled.button`
  width: 100%;
  text-align: left;
  color: inherit;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.backgroundSecondary};
    transform: translateX(4px);
  }
`;

const RecentIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${props => props.color}15;
  color: ${props => props.color};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const RecentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const RecentTitle = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RecentMeta = styled.div`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.95rem;
`;

function Home() {
  const { categories } = useTheme();
  const navigate = useNavigate();
  // Même source que le rail de gauche, pour rester cohérent après un relogin.
  const userName = localStorage.getItem('username') || '';
  const [stats, setStats] = useState({
    questionnaires: 0,
    cases: 0,
    protocols: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);

  // Charger les stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const questionnairesRes = await axios.get('/questionnaires/my', { params: { limit: 100 } })
          .catch(() => ({ data: { questionnaires: [] } }));

        const casesRes = await axios.get('/cases/my', { params: { limit: 100 } })
          .catch(() => ({ data: { cases: [] } }));

        let protocolsCount = 0;
        const possibleEndpoints = [
          { url: '/protocols/list', params: {} },
          { url: '/protocols', params: { personal: true } },
          { url: '/protocols/my', params: {} },
          { url: '/protocols', params: {} }
        ];

        for (const endpoint of possibleEndpoints) {
          try {
            const protocolsRes = await axios.get(endpoint.url, { params: endpoint.params });
            if (protocolsRes.data) {
              if (Array.isArray(protocolsRes.data)) {
                protocolsCount = protocolsRes.data.length;
              } else if (protocolsRes.data.protocols && Array.isArray(protocolsRes.data.protocols)) {
                protocolsCount = protocolsRes.data.protocols.length;
              }
            }
            if (protocolsCount > 0) break;
          } catch (error) {
            // Continue to next endpoint
          }
        }

        setStats({
          questionnaires: questionnairesRes.data?.questionnaires?.length || 0,
          cases: casesRes.data?.cases?.length || 0,
          protocols: protocolsCount
        });
      } catch (error) {
        console.error('Erreur lors du chargement des stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Charger les activités récentes
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const [questionnairesRes, casesRes] = await Promise.all([
          axios.get('/questionnaires/my', { params: { limit: 3, sort: '-updatedAt' } })
            .catch(() => ({ data: { questionnaires: [] } })),
          axios.get('/cases/my', { params: { limit: 3, sort: '-updatedAt' } })
            .catch(() => ({ data: { cases: [] } }))
        ]);

        const activities = [];

        if (questionnairesRes.data?.questionnaires?.length > 0) {
          questionnairesRes.data.questionnaires.slice(0, 3).forEach(q => {
            activities.push({
              type: 'questionnaire',
              title: q.title || 'Sans titre',
              time: formatTimeAgo(q.updatedAt || q.createdAt),
              icon: <FileText />,
              color: categories.questionnaire,
              id: q._id
            });
          });
        }

        if (casesRes.data?.cases?.length > 0) {
          casesRes.data.cases.slice(0, 3).forEach(c => {
            activities.push({
              type: 'case',
              title: c.title || 'Sans titre',
              time: formatTimeAgo(c.updatedAt || c.createdAt),
              icon: <FolderOpen />,
              color: categories.cases,
              id: c._id
            });
          });
        }

        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivities(activities.slice(0, 4));
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
      }
    };

    fetchRecentActivities();
  }, []);

  const formatTimeAgo = (date) => {
    if (!date) return 'Récemment';
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return 'À l\'instant';
    if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
    if (diff < 2592000) return `Il y a ${Math.floor(diff / 86400)} j`;
    return past.toLocaleDateString('fr-FR');
  };

  const questionnairesItems = [
    {
      to: '/questionnaires',
      title: 'Créer un questionnaire',
      description: 'Nouveau questionnaire',
      icon: <Plus />,
      color: categories.questionnaire
    },
    {
      to: '/questionnaires-list',
      title: 'Mes questionnaires',
      description: 'Gérer vos questionnaires',
      icon: <FileText />,
      color: categories.questionnaire
    },
    {
      to: '/public-questionnaires',
      title: 'Questionnaires publics',
      description: 'Explorer la bibliothèque',
      icon: <Globe />,
      color: categories.questionnaire
    }
  ];

  const casesItems = [
    {
      to: '/cases',
      title: 'Créer un cas',
      description: 'Nouveau cas DICOM',
      icon: <Plus />,
      color: categories.cases
    },
    {
      to: '/cases-list',
      title: 'Mes cas',
      description: 'Votre bibliothèque',
      icon: <FolderOpen />,
      color: categories.cases
    },
    {
      to: '/public-cases',
      title: 'Cas publics',
      description: 'Cas de la communauté',
      icon: <Users />,
      color: categories.cases
    }
  ];

  const protocolsItems = [
    {
      to: '/protocols/create',
      title: 'Créer un protocole',
      description: 'Nouveau protocole',
      icon: <Plus />,
      color: categories.protocol
    },
    {
      to: '/protocols/personal',
      title: 'Mes protocoles',
      description: 'Protocoles personnels',
      icon: <Activity />,
      color: categories.protocol
    },
    {
      to: '/protocols/public',
      title: 'Protocoles publics',
      description: 'Protocoles partagés',
      icon: <Globe />,
      color: categories.protocol
    }
  ];

  return (
    <HomeContainer>
      <ContentWrapper>
        {/* EN-TÊTE : accueil nominatif à gauche, chiffres clés à droite */}
        <HeroSection>
          <HeroText>
            <Eyebrow>Votre espace de travail</Eyebrow>
            <Title>{userName ? `Bonjour ${userName}` : 'Bonjour'}</Title>
            <Subtitle>
              Vos questionnaires, cas cliniques et protocoles d'imagerie
            </Subtitle>
          </HeroText>

          <StatsSection>
            <StatCard>
              <StatValue color={categories.questionnaire}>{stats.questionnaires}</StatValue>
              <StatLabel>Questionnaires</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue color={categories.cases}>{stats.cases}</StatValue>
              <StatLabel>Cas cliniques</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue color={categories.protocol}>{stats.protocols}</StatValue>
              <StatLabel>Protocoles</StatLabel>
            </StatCard>
          </StatsSection>
        </HeroSection>

        {/* GRILLE PRINCIPALE */}
        <MainGrid>
          {/* QUESTIONNAIRES */}
          <CategorySection $tone={categories.questionnaire}>
            <CategoryHeader>
              <CategoryIcon color={categories.questionnaire}>
                <FileText />
              </CategoryIcon>
              <CategoryTitle>Questionnaires</CategoryTitle>
              <CategoryCount>{stats.questionnaires}</CategoryCount>
            </CategoryHeader>
            <CategoryActions>
              {questionnairesItems.map((item, index) => (
                <ActionLink
                  key={index}
                  to={item.to}
                  color={item.color}
                >
                  <ActionContent>
                    <ActionIconSmall color={item.color}>
                      {item.icon}
                    </ActionIconSmall>
                    <ActionText>
                      <ActionTitle>{item.title}</ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionText>
                  </ActionContent>
                  <ActionArrow>
                    <ChevronRight />
                  </ActionArrow>
                </ActionLink>
              ))}
            </CategoryActions>
          </CategorySection>

          {/* CAS CLINIQUES */}
          <CategorySection $tone={categories.cases}>
            <CategoryHeader>
              <CategoryIcon color={categories.cases}>
                <FolderOpen />
              </CategoryIcon>
              <CategoryTitle>Cas Cliniques</CategoryTitle>
              <CategoryCount>{stats.cases}</CategoryCount>
            </CategoryHeader>
            <CategoryActions>
              {casesItems.map((item, index) => (
                <ActionLink
                  key={index}
                  to={item.to}
                  color={item.color}
                >
                  <ActionContent>
                    <ActionIconSmall color={item.color}>
                      {item.icon}
                    </ActionIconSmall>
                    <ActionText>
                      <ActionTitle>{item.title}</ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionText>
                  </ActionContent>
                  <ActionArrow>
                    <ChevronRight />
                  </ActionArrow>
                </ActionLink>
              ))}
            </CategoryActions>
          </CategorySection>

          {/* PROTOCOLES */}
          <CategorySection $tone={categories.protocol}>
            <CategoryHeader>
              <CategoryIcon color={categories.protocol}>
                <Activity />
              </CategoryIcon>
              <CategoryTitle>Protocoles</CategoryTitle>
              <CategoryCount>{stats.protocols}</CategoryCount>
            </CategoryHeader>
            <CategoryActions>
              {protocolsItems.map((item, index) => (
                <ActionLink
                  key={index}
                  to={item.to}
                  color={item.color}
                >
                  <ActionContent>
                    <ActionIconSmall color={item.color}>
                      {item.icon}
                    </ActionIconSmall>
                    <ActionText>
                      <ActionTitle>{item.title}</ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionText>
                  </ActionContent>
                  <ActionArrow>
                    <ChevronRight />
                  </ActionArrow>
                </ActionLink>
              ))}
            </CategoryActions>
          </CategorySection>
        </MainGrid>

        {/* ACTIVITÉ RÉCENTE */}
        <RecentSection>
          <SectionHeader>
            <SectionTitle>
              <Clock />
              Activité récente
            </SectionTitle>
            <ViewAllLink to="/statistics">
              Voir tout
              <ChevronRight />
            </ViewAllLink>
          </SectionHeader>
          <RecentList>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <RecentItem
                  key={index}
                  onClick={() => {
                    if (activity.type === 'questionnaire' && activity.id) {
                      navigate(`/use/${activity.id}`);
                    } else if (activity.type === 'case' && activity.id) {
                      navigate(`/radiology-viewer/${activity.id}`);
                    }
                  }}
                >
                  <RecentIcon color={activity.type === 'case' ? categories.cases : categories.questionnaire}>
                    {activity.icon}
                  </RecentIcon>
                  <RecentInfo>
                    <RecentTitle>{activity.title}</RecentTitle>
                    <RecentMeta>
                      <Clock />
                      {activity.time}
                    </RecentMeta>
                  </RecentInfo>
                </RecentItem>
              ))
            ) : (
              <EmptyState>
                Votre prochain cas commence ici.
                <p>Créez une ressource ou explorez celles de la communauté.</p>
              </EmptyState>
            )}
          </RecentList>
        </RecentSection>
      </ContentWrapper>
    </HomeContainer>
  );
}

export default Home;
