import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
  Stethoscope,
  ChevronRight
} from 'lucide-react';

// CONTENEUR PRINCIPAL
const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: ${props => props.theme.background};
  padding: 3rem 2rem;

  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: calc(100vh - 60px);
  }
`;

// CONTENEUR INTERNE
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

// SECTION HERO
const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }
`;

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const Logo = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    color: ${props => props.theme.primary};
  }

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0.75rem;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme.textSecondary};
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// GRILLE PRINCIPALE
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

// SECTION CATÉGORIE
const CategorySection = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid ${props => props.theme.border};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
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
  font-size: 1.5rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const CategoryCount = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
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
  padding: 1rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  text-decoration: none;
  border: 1px solid ${props => props.theme.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.color};
    transform: translateX(4px);
  }
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
  opacity: 0;
  transform: translateX(-4px);
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

// SECTION STATISTIQUES
const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

const StatCard = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  text-align: center;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.color};
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

// SECTION ACTIVITÉ RÉCENTE
const RecentSection = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
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

const RecentItem = styled.div`
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
  const navigate = useNavigate();
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
              color: '#667eea',
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
              color: '#f093fb',
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
      color: '#667eea'
    },
    {
      to: '/questionnaires-list',
      title: 'Mes questionnaires',
      description: 'Gérer vos questionnaires',
      icon: <FileText />,
      color: '#764ba2'
    },
    {
      to: '/public-questionnaires',
      title: 'Questionnaires publics',
      description: 'Explorer la bibliothèque',
      icon: <Globe />,
      color: '#667eea'
    }
  ];

  const casesItems = [
    {
      to: '/cases',
      title: 'Créer un cas',
      description: 'Nouveau cas DICOM',
      icon: <Plus />,
      color: '#f093fb'
    },
    {
      to: '/cases-list',
      title: 'Mes cas',
      description: 'Votre bibliothèque',
      icon: <FolderOpen />,
      color: '#f5576c'
    },
    {
      to: '/public-cases',
      title: 'Cas publics',
      description: 'Cas de la communauté',
      icon: <Users />,
      color: '#f093fb'
    }
  ];

  const protocolsItems = [
    {
      to: '/protocols/create',
      title: 'Créer un protocole',
      description: 'Nouveau protocole',
      icon: <Plus />,
      color: '#4facfe'
    },
    {
      to: '/protocols/personal',
      title: 'Mes protocoles',
      description: 'Protocoles personnels',
      icon: <Activity />,
      color: '#00f2fe'
    },
    {
      to: '/protocols/public',
      title: 'Protocoles publics',
      description: 'Protocoles partagés',
      icon: <Globe />,
      color: '#4facfe'
    }
  ];

  return (
    <HomeContainer>
      <ContentWrapper>
        {/* HERO SECTION */}
        <HeroSection>
          <LogoContainer>
            <Logo>
              <Stethoscope size={48} />
              RIFIM
            </Logo>
          </LogoContainer>

          <Title>Radiologie Interventionnelle Formation et Innovation Médicale</Title>
          <Subtitle>
            Plateforme collaborative pour la gestion de questionnaires, cas cliniques et protocoles d'imagerie
          </Subtitle>
        </HeroSection>

        {/* STATISTIQUES */}
        <StatsSection>
          <StatCard>
            <StatValue color="#667eea">{stats.questionnaires}</StatValue>
            <StatLabel>Questionnaires</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#f093fb">{stats.cases}</StatValue>
            <StatLabel>Cas cliniques</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue color="#4facfe">{stats.protocols}</StatValue>
            <StatLabel>Protocoles</StatLabel>
          </StatCard>
        </StatsSection>

        {/* GRILLE PRINCIPALE */}
        <MainGrid>
          {/* QUESTIONNAIRES */}
          <CategorySection>
            <CategoryHeader>
              <CategoryIcon color="#667eea">
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
          <CategorySection>
            <CategoryHeader>
              <CategoryIcon color="#f093fb">
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
          <CategorySection>
            <CategoryHeader>
              <CategoryIcon color="#4facfe">
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
                  <RecentIcon color={activity.color}>
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
                Aucune activité récente
              </EmptyState>
            )}
          </RecentList>
        </RecentSection>
      </ContentWrapper>
    </HomeContainer>
  );
}

export default Home;
