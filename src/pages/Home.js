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
  TrendingUp,
  Users,
  BookOpen,
  Stethoscope,
  Calendar,
  Bell,
  Star,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Github,
  Youtube,
  HelpCircle,
  Mail,
  Sparkles,
  Award,
  Target,
  Zap,
  Download,
  Upload
} from 'lucide-react';

// CONTENEUR PRINCIPAL
const HomeContainer = styled.div`
  min-height: calc(100vh - 80px);
  background: linear-gradient(135deg, 
    ${props => props.theme.background} 0%, 
    ${props => props.theme.backgroundSecondary || '#f8fafc'} 100%
  );
  padding: 2rem;
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem;
    min-height: calc(100vh - 60px);
  }
`;

// CONTENEUR INTERNE
const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

// SECTION HERO
const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: slideDown 0.8s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const LogoContainer = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1.5rem 3rem;
  background: ${props => props.theme.card};
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 2px solid ${props => props.theme.border};

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    gap: 0.5rem;
  }
`;

const Logo = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.theme.text};
  margin-bottom: 1rem;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: ${props => props.theme.textSecondary || '#6b7280'};
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// CONTENEUR PRINCIPAL AVEC GRID
const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

// SECTION GAUCHE
const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

// SECTION DROITE (SIDEBAR)
const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
`;

// GRILLE DE NAVIGATION PAR CATEGORIE
const CategorySection = styled.div`
  background: ${props => props.theme.card};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.border};
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const CategoryIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: ${props => props.gradient};
  color: white;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  flex: 1;
`;

const CategoryStats = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: ${props => props.theme.backgroundSecondary};
  border-radius: 20px;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 600;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const ActionCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: ${props => props.theme.background};
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid ${props => props.theme.border};

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.color};
    background: ${props => props.theme.card};
  }
`;

const ActionIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${props => props.gradient};
  color: white;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

const ActionContent = styled.div`
  flex: 1;
`;

const ActionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const ActionDescription = styled.p`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  line-height: 1.4;
`;

// WIDGETS SIDEBAR
const Widget = styled.div`
  background: ${props => props.theme.card};
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid ${props => props.theme.border};
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const WidgetTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WidgetContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const RecentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => props.theme.backgroundSecondary};
    transform: translateX(3px);
  }
`;

const RecentIcon = styled.div`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: ${props => props.color}20;
  color: ${props => props.color};

  svg {
    width: 18px;
    height: 18px;
  }
`;

const RecentInfo = styled.div`
  flex: 1;
`;

const RecentTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.text};
  margin-bottom: 0.125rem;
`;

const RecentMeta = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.textSecondary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// SECTION LIENS UTILES
const QuickLinksSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const QuickLinkCard = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: ${props => props.theme.card};
  border-radius: 12px;
  text-decoration: none;
  border: 1px solid ${props => props.theme.border};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.color};
  }
`;

const QuickLinkIcon = styled.div`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: ${props => props.color}15;
  color: ${props => props.color};

  svg {
    width: 24px;
    height: 24px;
  }
`;

const QuickLinkContent = styled.div`
  flex: 1;
`;

const QuickLinkTitle = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin-bottom: 0.25rem;
`;

const QuickLinkDesc = styled.div`
  font-size: 0.85rem;
  color: ${props => props.theme.textSecondary};
`;

// BOUTON FLOTTANT
const FloatingButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  z-index: 100;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
  }

  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
  }
`;

// ANNONCES
const AnnouncementBanner = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);

  svg {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`;

function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    questionnaires: 0,
    cases: 0,
    protocols: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [currentTip, setCurrentTip] = useState(0);

  const tips = [
    {
      icon: '💡',
      title: 'Export PDF',
      content: 'Vous pouvez exporter vos questionnaires en PDF directement depuis la page de visualisation.'
    },
    {
      icon: '🎯',
      title: 'Tags intelligents',
      content: 'Utilisez des tags comme "IRM", "TDM" pour mieux organiser et retrouver vos questionnaires.'
    },
    {
      icon: '📊',
      title: 'Visualiseur DICOM',
      content: 'Double-cliquez sur une image DICOM pour activer le mode plein écran avec tous les outils.'
    },
    {
      icon: '🔄',
      title: 'Collaboration',
      content: 'Partagez vos cas en mode public pour collaborer avec d\'autres radiologues.'
    },
    {
      icon: '⚡',
      title: 'Raccourcis',
      content: 'Utilisez les flèches du clavier pour naviguer rapidement entre les images DICOM.'
    }
  ];

  // Rotation des tips
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 10000); // Change toutes les 10 secondes
    return () => clearInterval(interval);
  }, []);

  // Charger les vraies stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Récupérer les vraies données depuis l'API
        const [questionnairesRes, casesRes] = await Promise.all([
          axios.get('/questionnaires/my', { params: { limit: 100 } }).catch(() => ({ data: { questionnaires: [] } })),
          axios.get('/cases/my', { params: { limit: 100 } }).catch(() => ({ data: { cases: [] } }))
        ]);

        setStats({
          questionnaires: questionnairesRes.data?.questionnaires?.length || 0,
          cases: casesRes.data?.cases?.length || 0,
          protocols: 0 // À implémenter quand l'API sera prête
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
        
        // Ajouter les questionnaires récents
        if (questionnairesRes.data?.questionnaires?.length > 0) {
          questionnairesRes.data.questionnaires.slice(0, 2).forEach(q => {
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

        // Ajouter les cas récents
        if (casesRes.data?.cases?.length > 0) {
          casesRes.data.cases.slice(0, 2).forEach(c => {
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

        // Trier par date et prendre les 3 plus récents
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecentActivities(activities.slice(0, 3));
      } catch (error) {
        console.error('Erreur lors du chargement des activités:', error);
        // Fallback avec des exemples
        setRecentActivities([
          {
            type: 'questionnaire',
            title: 'Dernier questionnaire',
            time: 'Récemment',
            icon: <FileText />,
            color: '#667eea'
          }
        ]);
      }
    };

    fetchRecentActivities();
  }, []);

  // Fonction pour formater le temps relatif
  const formatTimeAgo = (date) => {
    if (!date) return 'Récemment';
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000); // différence en secondes

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
      description: 'Nouveau questionnaire personnalisé',
      icon: <Plus />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    },
    {
      to: '/questionnaires-list',
      title: 'Mes questionnaires',
      description: 'Gérer vos questionnaires',
      icon: <FileText />,
      gradient: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
      color: '#764ba2'
    },
    {
      to: '/public-questionnaires',
      title: 'Questionnaires publics',
      description: 'Explorer la bibliothèque',
      icon: <Globe />,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#667eea'
    }
  ];

  const casesItems = [
    {
      to: '/cases',
      title: 'Créer un cas',
      description: 'Nouveau cas avec DICOM',
      icon: <Plus />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    },
    {
      to: '/cases-list',
      title: 'Mes cas',
      description: 'Votre bibliothèque',
      icon: <FolderOpen />,
      gradient: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
      color: '#f5576c'
    },
    {
      to: '/public-cases',
      title: 'Cas publics',
      description: 'Cas de la communauté',
      icon: <Users />,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: '#f093fb'
    }
  ];

  const protocolsItems = [
    {
      to: '/protocols/create',
      title: 'Créer un protocole',
      description: 'Nouveau protocole d\'imagerie',
      icon: <Plus />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe'
    },
    {
      to: '/protocols/personal',
      title: 'Mes protocoles',
      description: 'Vos protocoles personnels',
      icon: <Activity />,
      gradient: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
      color: '#00f2fe'
    },
    {
      to: '/protocols/public',
      title: 'Protocoles publics',
      description: 'Protocoles partagés',
      icon: <Globe />,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      color: '#4facfe'
    }
  ];

  const quickLinks = [
    {
      href: 'https://www.youtube.com/watch?v=NerjVRmP7TA',
      title: 'Tutoriel vidéo',
      description: 'Guide complet d\'utilisation',
      icon: <Youtube />,
      color: '#ff0000',
      external: true
    },
    {
      href: '/statistics',
      title: 'Tableau de bord',
      description: 'Analyses et métriques',
      icon: <BarChart3 />,
      color: '#10b981',
      external: false
    },
    {
      onClick: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.dcm,.dicom';
        input.multiple = true;
        input.onchange = (e) => {
          alert('Upload DICOM - Fonctionnalité en développement');
        };
        input.click();
      },
      title: 'Import rapide',
      description: 'Importer des fichiers DICOM',
      icon: <Upload />,
      color: '#8b5cf6',
      external: false
    },
    {
      href: 'https://www.sfrnet.org/',
      title: 'SFR',
      description: 'Société Française de Radiologie',
      icon: <ExternalLink />,
      color: '#ec4899',
      external: true
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
          
          <Title>Radiologie Interventionnelle</Title>
          <Subtitle>
            Formation et Innovation Médicale - Plateforme collaborative pour la gestion 
            de questionnaires, cas cliniques et protocoles d'imagerie
          </Subtitle>
        </HeroSection>

        {/* ANNONCE */}
        <AnnouncementBanner>
          <Bell />
          <div>
            <strong>🎉 Nouvelle mise à jour !</strong> Le visualiseur DICOM supporte maintenant 
            les reconstructions 3D et l'export en format NIfTI. 
            <Link to="/cases" style={{ color: 'white', marginLeft: '0.5rem', textDecoration: 'underline' }}>
              Essayer maintenant →
            </Link>
          </div>
        </AnnouncementBanner>

        {/* CONTENU PRINCIPAL */}
        <MainContent>
          <LeftSection>
            {/* SECTION QUESTIONNAIRES */}
            <CategorySection>
              <CategoryHeader>
                <CategoryIcon gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                  <FileText />
                </CategoryIcon>
                <CategoryTitle>Questionnaires</CategoryTitle>
                <CategoryStats>
                  {stats.questionnaires} éléments
                </CategoryStats>
              </CategoryHeader>
              <CategoryGrid>
                {questionnairesItems.map((item, index) => (
                  <ActionCard 
                    key={index} 
                    to={item.to}
                    color={item.color}
                  >
                    <ActionIcon gradient={item.gradient}>
                      {item.icon}
                    </ActionIcon>
                    <ActionContent>
                      <ActionTitle>{item.title}</ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionContent>
                  </ActionCard>
                ))}
              </CategoryGrid>
            </CategorySection>

            {/* SECTION CAS CLINIQUES */}
            <CategorySection>
              <CategoryHeader>
                <CategoryIcon gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                  <FolderOpen />
                </CategoryIcon>
                <CategoryTitle>Cas Cliniques</CategoryTitle>
                <CategoryStats>
                  {stats.cases} éléments
                </CategoryStats>
              </CategoryHeader>
              <CategoryGrid>
                {casesItems.map((item, index) => (
                  <ActionCard 
                    key={index} 
                    to={item.to}
                    color={item.color}
                  >
                    <ActionIcon gradient={item.gradient}>
                      {item.icon}
                    </ActionIcon>
                    <ActionContent>
                      <ActionTitle>{item.title}</ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionContent>
                  </ActionCard>
                ))}
              </CategoryGrid>
            </CategorySection>

            {/* SECTION PROTOCOLES */}
            <CategorySection>
              <CategoryHeader>
                <CategoryIcon gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                  <Activity />
                </CategoryIcon>
                <CategoryTitle>Protocoles</CategoryTitle>
                <CategoryStats>
                  {stats.protocols} éléments
                </CategoryStats>
              </CategoryHeader>
              <CategoryGrid>
                {protocolsItems.map((item, index) => (
                  <ActionCard 
                    key={index} 
                    to={item.to}
                    color={item.color}
                  >
                    <ActionIcon gradient={item.gradient}>
                      {item.icon}
                    </ActionIcon>
                    <ActionContent>
                      <ActionTitle>{item.title}</ActionTitle>
                      <ActionDescription>{item.description}</ActionDescription>
                    </ActionContent>
                  </ActionCard>
                ))}
              </CategoryGrid>
            </CategorySection>
          </LeftSection>

          {/* SIDEBAR */}
          <RightSection>
            {/* ACTIVITÉ RÉCENTE */}
            <Widget>
              <WidgetHeader>
                <WidgetTitle>
                  <Clock size={20} />
                  Activité récente
                </WidgetTitle>
              </WidgetHeader>
              <WidgetContent>
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
                          <Clock size={12} />
                          {activity.time}
                        </RecentMeta>
                      </RecentInfo>
                    </RecentItem>
                  ))
                ) : (
                  <div style={{ 
                    padding: '2rem', 
                    textAlign: 'center', 
                    color: '#6b7280',
                    fontSize: '0.9rem'
                  }}>
                    Aucune activité récente
                  </div>
                )}
              </WidgetContent>
            </Widget>

            {/* STATISTIQUES RAPIDES */}
            <Widget>
              <WidgetHeader>
                <WidgetTitle>
                  <TrendingUp size={20} />
                  Vue d'ensemble
                </WidgetTitle>
              </WidgetHeader>
              <WidgetContent>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#667eea' }}>
                      {stats.questionnaires}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Questionnaires
                    </div>
                  </div>
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '1rem', 
                    background: 'linear-gradient(135deg, #f093fb15 0%, #f5576c15 100%)',
                    borderRadius: '8px'
                  }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f093fb' }}>
                      {stats.cases}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                      Cas cliniques
                    </div>
                  </div>
                </div>
                <Link 
                  to="/statistics" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9rem',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Voir les statistiques détaillées
                  <ChevronRight size={16} />
                </Link>
              </WidgetContent>
            </Widget>

            {/* CONSEILS */}
            <Widget>
              <WidgetHeader>
                <WidgetTitle>
                  <HelpCircle size={20} />
                  Astuce du jour
                </WidgetTitle>
              </WidgetHeader>
              <WidgetContent>
                <div style={{ 
                  padding: '1rem', 
                  background: 'linear-gradient(135deg, #fbbf2415 0%, #f59e0b15 100%)',
                  borderRadius: '8px',
                  borderLeft: '3px solid #f59e0b',
                  minHeight: '80px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center'
                }}>
                  <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#374151' }}>
                    <strong>{tips[currentTip].icon} {tips[currentTip].title}</strong><br />
                    {tips[currentTip].content}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '0.5rem', 
                  marginTop: '1rem' 
                }}>
                  {tips.map((_, index) => (
                    <div
                      key={index}
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: index === currentTip ? '#f59e0b' : '#e5e7eb',
                        transition: 'background 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onClick={() => setCurrentTip(index)}
                    />
                  ))}
                </div>
              </WidgetContent>
            </Widget>

            {/* NOUVELLES FONCTIONNALITÉS */}
            <Widget>
              <WidgetHeader>
                <WidgetTitle>
                  <Sparkles size={20} />
                  Nouveautés
                </WidgetTitle>
              </WidgetHeader>
              <WidgetContent>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(34, 197, 94, 0.1)',
                    borderRadius: '8px'
                  }}>
                    <CheckCircle size={16} style={{ color: '#22c55e', marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                        Export DICOM amélioré
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Support multi-séries
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '0.75rem',
                    padding: '0.75rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    borderRadius: '8px'
                  }}>
                    <Zap size={16} style={{ color: '#3b82f6', marginTop: '2px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#374151' }}>
                        IA diagnostic
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
                        Bientôt disponible
                      </div>
                    </div>
                  </div>
                </div>
              </WidgetContent>
            </Widget>
          </RightSection>
        </MainContent>

        {/* LIENS RAPIDES */}
        <QuickLinksSection>
          {quickLinks.map((link, index) => (
            link.onClick ? (
              <QuickLinkCard
                key={index}
                as="div"
                onClick={link.onClick}
                color={link.color}
                style={{ cursor: 'pointer' }}
              >
                <QuickLinkIcon color={link.color}>
                  {link.icon}
                </QuickLinkIcon>
                <QuickLinkContent>
                  <QuickLinkTitle>{link.title}</QuickLinkTitle>
                  <QuickLinkDesc>{link.description}</QuickLinkDesc>
                </QuickLinkContent>
              </QuickLinkCard>
            ) : (
              <QuickLinkCard
                key={index}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                onClick={!link.external ? (e) => {
                  e.preventDefault();
                  navigate(link.href);
                } : undefined}
                color={link.color}
              >
                <QuickLinkIcon color={link.color}>
                  {link.icon}
                </QuickLinkIcon>
                <QuickLinkContent>
                  <QuickLinkTitle>{link.title}</QuickLinkTitle>
                  <QuickLinkDesc>{link.description}</QuickLinkDesc>
                </QuickLinkContent>
                {link.external && <ExternalLink size={16} style={{ color: '#6b7280' }} />}
              </QuickLinkCard>
            )
          ))}
        </QuickLinksSection>
      </ContentWrapper>

      {/* BOUTON FLOTTANT AIDE */}
      <FloatingButton 
        onClick={() => alert('Centre d\'aide - En construction')}
        title="Aide"
      >
        <HelpCircle />
      </FloatingButton>
    </HomeContainer>
  );
}

export default Home;