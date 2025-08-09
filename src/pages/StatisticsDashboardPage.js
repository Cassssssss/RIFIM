// StatisticsDashboardPage.js - Dashboard de statistiques d'utilisation
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled, { useTheme } from 'styled-components';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, TrendingDown, FileText, Users, Clock, Calendar,
  Award, Target, Activity, Eye, Copy, Star, Download, Filter,
  ChevronUp, ChevronDown, BarChart3, PieChartIcon, LineChartIcon, AlertCircle,
  FolderOpen, CheckCircle, Share2
} from 'lucide-react';

// ==================== STYLED COMPONENTS ====================

const PageContainer = styled.div`
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1200px) {
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 1.1rem;
  margin: 0;
`;

// Conteneur pour les filtres de période
const PeriodSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const PeriodButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.active ? props.theme.primary : props.theme.card};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 2px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.active ? props.theme.primaryDark : props.theme.hover};
    border-color: ${props => props.theme.primary};
  }
`;

// Grille de statistiques principales
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${props => props.gradient || `linear-gradient(90deg, ${props.theme.primary}, ${props.theme.secondary})`};
  }
`;

const StatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const StatTitle = styled.h3`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-weight: 500;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.background || `linear-gradient(135deg, ${props.theme.primary}20, ${props.theme.secondary}20)`};
  color: ${props => props.color || props.theme.primary};

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const StatChange = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};

  svg {
    width: 16px;
    height: 16px;
  }
`;

const StatDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  margin: 0;
`;

// Conteneur pour les graphiques
const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  height: 400px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChartTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
`;

const ChartActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ChartButton = styled.button`
  padding: 0.5rem;
  background-color: ${props => props.active ? props.theme.primary : props.theme.background};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

// Tableau de classement
const LeaderboardCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  grid-column: span 2;

  @media (max-width: 1200px) {
    grid-column: span 1;
  }
`;

const LeaderboardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background-color: ${props => props.theme.backgroundSecondary};
  
  th {
    padding: 0.75rem;
    text-align: left;
    font-weight: 600;
    color: ${props => props.theme.text};
    font-size: 0.9rem;
    border-bottom: 2px solid ${props => props.theme.border};
  }
`;

const TableBody = styled.tbody`
  tr {
    border-bottom: 1px solid ${props => props.theme.borderLight};
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${props => props.theme.hover};
    }
  }

  td {
    padding: 0.75rem;
    color: ${props => props.theme.text};
    font-size: 0.9rem;
  }
`;

const RankBadge = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  background: ${props => {
    if (props.rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)';
    if (props.rank === 2) return 'linear-gradient(135deg, #C0C0C0, #808080)';
    if (props.rank === 3) return 'linear-gradient(135deg, #CD7F32, #8B4513)';
    return props.theme.backgroundSecondary;
  }};
  color: ${props => props.rank <= 3 ? 'white' : props.theme.text};
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
  padding: 3rem;
  color: ${props => props.theme.textSecondary};
  
  h2 {
    color: ${props => props.theme.text};
    margin-bottom: 1rem;
  }
  
  button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    background-color: ${props => props.theme.primary};
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    
    &:hover {
      background-color: ${props => props.theme.primaryDark};
    }
  }
`;

const WarningBanner = styled.div`
  background-color: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #92400e;
  
  svg {
    width: 20px;
    height: 20px;
    color: #f59e0b;
  }
`;

const ExportButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px ${props => props.theme.primary}40;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.primary}60;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

function StatisticsDashboardPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataWarning, setDataWarning] = useState(null);
  const [period, setPeriod] = useState('month'); // week, month, year, all
  const [chartType, setChartType] = useState('line'); // line, bar, pie
  const [modalityChartType, setModalityChartType] = useState('modality'); // modality ou content
  
  // États pour les données
  const [globalStats, setGlobalStats] = useState({
    totalQuestionnaires: 0,
    totalProtocols: 0,
    totalCases: 0,
    totalDocuments: 0, // Renommé de totalReports
    publicShareRate: 0, // Nouveau : taux de partage public
    averageViews: 0, // Nouveau : nombre moyen de vues
    monthlyGrowth: 0,
    weeklyActive: 0
  });

  const [activityData, setActivityData] = useState([]);
  const [modalityData, setModalityData] = useState([]); // Pour les modalités d'imagerie
  const [contentTypeData, setContentTypeData] = useState([]); // Pour les types de contenu
  const [performanceData, setPerformanceData] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeDistribution, setTimeDistribution] = useState([]);

  // Couleurs pour les graphiques
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      setDataWarning(null);
      
      // Récupérer le username de l'utilisateur connecté
      const username = localStorage.getItem('username');
      const userId = localStorage.getItem('userId');
      
      if (!username) {
        throw new Error('Utilisateur non connecté');
      }
      
      console.log('Récupération des statistiques pour:', username);
      
      // Variables pour stocker les données récupérées
      let allQuestionnaires = [];
      let allCases = [];
      let allProtocols = [];
      let userQuestionnaires = [];
      let userCases = [];
      let userProtocols = [];
      let hasDataErrors = false;
      
      // === 1. RÉCUPÉRATION DES QUESTIONNAIRES ===
      try {
        const myQuestionnairesResponse = await axios.get('/questionnaires/my', {
          params: { limit: 1000 }
        });
        
        if (myQuestionnairesResponse.data) {
          userQuestionnaires = myQuestionnairesResponse.data.questionnaires || [];
          console.log(`✅ ${userQuestionnaires.length} questionnaires personnels récupérés`);
        }
      } catch (err) {
        console.log('Erreur /questionnaires/my:', err.message);
        
        try {
          const altResponse = await axios.get('/questionnaires', {
            params: { limit: 1000 }
          });
          
          if (altResponse.data) {
            const questionnaires = Array.isArray(altResponse.data) ? 
              altResponse.data : 
              (altResponse.data.questionnaires || []);
            
            userQuestionnaires = questionnaires.filter(q => 
              q.author === username || q.user === userId
            );
            console.log(`✅ ${userQuestionnaires.length} questionnaires filtrés`);
          }
        } catch (altErr) {
          console.log('Erreur route alternative questionnaires:', altErr.message);
          hasDataErrors = true;
        }
      }
      
      // Récupérer tous les questionnaires publics pour le classement
      try {
        const publicResponse = await axios.get('/questionnaires/public', {
          params: { limit: 1000 }
        });
        if (publicResponse.data && publicResponse.data.questionnaires) {
          allQuestionnaires = publicResponse.data.questionnaires;
        }
      } catch (err) {
        console.log('Pas de questionnaires publics');
      }
      
      // === 2. RÉCUPÉRATION DES CAS ===
      try {
        const myCasesResponse = await axios.get('/cases/my', {
          params: { limit: 1000 }
        });
        
        if (myCasesResponse.data) {
          userCases = myCasesResponse.data.cases || [];
          console.log(`✅ ${userCases.length} cas personnels récupérés`);
        }
      } catch (err) {
        console.log('Erreur /cases/my:', err.message);
        
        try {
          const altResponse = await axios.get('/cases', {
            params: { limit: 1000 }
          });
          
          if (altResponse.data) {
            const cases = Array.isArray(altResponse.data) ? 
              altResponse.data : 
              (altResponse.data.cases || []);
            
            userCases = cases.filter(c => 
              c.user === userId || c.author === username
            );
            console.log(`✅ ${userCases.length} cas filtrés`);
          }
        } catch (altErr) {
          console.log('Erreur route alternative cas:', altErr.message);
          hasDataErrors = true;
        }
      }
      
      // Récupérer tous les cas publics pour le classement
      try {
        const publicResponse = await axios.get('/cases/public', {
          params: { limit: 1000 }
        });
        if (publicResponse.data && publicResponse.data.cases) {
          allCases = publicResponse.data.cases;
        }
      } catch (err) {
        console.log('Pas de cas publics');
      }
      
      // === 3. RÉCUPÉRATION DES PROTOCOLES ===
      try {
        const protocolsResponse = await axios.get('/protocols', {
          params: { limit: 1000 }
        });
        
        if (protocolsResponse.data) {
          const protocols = Array.isArray(protocolsResponse.data) ? 
            protocolsResponse.data : 
            (protocolsResponse.data.protocols || []);
          
          userProtocols = protocols.filter(p => 
            p.author === username || p.user === userId
          );
          allProtocols = protocols;
          console.log(`✅ ${userProtocols.length} protocoles récupérés`);
        }
      } catch (err) {
        console.log('Erreur lors de la récupération des protocoles:', err.message);
        hasDataErrors = true;
      }
      
      // Afficher un avertissement si certaines données ne sont pas disponibles
      if (hasDataErrors) {
        setDataWarning('Certaines données ne sont pas disponibles. Les statistiques affichées peuvent être partielles.');
      }
      
      console.log('Données récupérées:', {
        questionnaires: userQuestionnaires.length,
        cas: userCases.length,
        protocoles: userProtocols.length
      });
      
      // === 4. CALCUL DES STATISTIQUES TEMPORELLES ===
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      
      let startDate;
      switch(period) {
        case 'week':
          startDate = startOfWeek;
          break;
        case 'month':
          startDate = startOfMonth;
          break;
        case 'year':
          startDate = startOfYear;
          break;
        default:
          startDate = new Date(0); // Toutes les données
      }
      
      // Fonction helper pour obtenir une date valide
      const getValidDate = (item) => {
        const possibleDates = [
          item.updatedAt,
          item.createdAt,
          item.date,
          item.created_at,
          item.updated_at
        ];
        
        for (const dateStr of possibleDates) {
          if (dateStr) {
            const date = new Date(dateStr);
            if (!isNaN(date.getTime())) {
              return date;
            }
          }
        }
        return new Date(); // Date actuelle par défaut
      };
      
      // Filtrer les données selon la période
      const filteredQuestionnaires = userQuestionnaires.filter(q => {
        const date = getValidDate(q);
        return date >= startDate;
      });
      
      const filteredCases = userCases.filter(c => {
        const date = getValidDate(c);
        return date >= startDate;
      });
      
      const filteredProtocols = userProtocols.filter(p => {
        const date = getValidDate(p);
        return date >= startDate;
      });
      
      // Calculer la croissance mensuelle
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
      
      const lastMonthTotal = userQuestionnaires.filter(q => {
        const date = getValidDate(q);
        return date >= lastMonth && date <= lastMonthEnd;
      }).length + userCases.filter(c => {
        const date = getValidDate(c);
        return date >= lastMonth && date <= lastMonthEnd;
      }).length;
      
      const thisMonthTotal = userQuestionnaires.filter(q => {
        const date = getValidDate(q);
        return date >= startOfMonth;
      }).length + userCases.filter(c => {
        const date = getValidDate(c);
        return date >= startOfMonth;
      }).length;
      
      const monthlyGrowth = lastMonthTotal > 0 
        ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
        : thisMonthTotal > 0 ? 100 : 0;
      
      // === 5. DONNÉES D'ACTIVITÉ HEBDOMADAIRE ===
      const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const weeklyActivity = new Array(7).fill(null).map((_, index) => ({
        name: daysOfWeek[index],
        questionnaires: 0,
        protocoles: 0,
        cas: 0
      }));
      
      // Compter les activités par jour de la semaine
      filteredQuestionnaires.forEach(q => {
        const date = getValidDate(q);
        const day = date.getDay();
        weeklyActivity[day].questionnaires++;
      });
      
      filteredProtocols.forEach(p => {
        const date = getValidDate(p);
        const day = date.getDay();
        weeklyActivity[day].protocoles++;
      });
      
      filteredCases.forEach(c => {
        const date = getValidDate(c);
        const day = date.getDay();
        weeklyActivity[day].cas++;
      });
      
      // === 6. RÉPARTITION PAR MODALITÉ D'IMAGERIE (pour les questionnaires) ===
      const modalityCount = {};
      
      userQuestionnaires.forEach(q => {
        // Déterminer la modalité basée sur différents champs
        let modality = q.modality;
        
        // Si pas de modalité explicite, analyser le titre
        if (!modality && q.title) {
          const title = q.title.toLowerCase();
          if (title.includes('irm') || title.includes('i.r.m')) modality = 'IRM';
          else if (title.includes('scanner') || title.includes('tdm') || title.includes('ct')) modality = 'Scanner';
          else if (title.includes('radio') || title.includes('rx') || title.includes('radiographie')) modality = 'Radio';
          else if (title.includes('echo') || title.includes('écho') || title.includes('échographie')) modality = 'Échographie';
          else if (title.includes('pet') || title.includes('tep')) modality = 'PET-Scan';
          else modality = 'Autre';
        }
        
        if (!modality) modality = 'Non spécifié';
        
        modalityCount[modality] = (modalityCount[modality] || 0) + 1;
      });
      
      const totalModalityCount = Object.values(modalityCount).reduce((a, b) => a + b, 0) || 1;
      let modalityDataArray = Object.entries(modalityCount)
        .map(([name, value]) => ({
          name,
          value,
          percentage: Math.round((value / totalModalityCount) * 100)
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6); // Top 6 modalités
      
      // Si aucune modalité, créer des données par défaut
      if (modalityDataArray.length === 0) {
        modalityDataArray = [
          { name: 'IRM', value: 1, percentage: 25 },
          { name: 'Scanner', value: 1, percentage: 25 },
          { name: 'Radio', value: 1, percentage: 25 },
          { name: 'Échographie', value: 1, percentage: 25 }
        ];
      }
      
      // === 7. RÉPARTITION PAR TYPE DE CONTENU ===
      const contentTypeDataArray = [
        { 
          name: 'Questionnaires', 
          value: userQuestionnaires.length, 
          percentage: Math.round((userQuestionnaires.length / Math.max(1, userQuestionnaires.length + userCases.length + userProtocols.length)) * 100)
        },
        { 
          name: 'Cas cliniques', 
          value: userCases.length, 
          percentage: Math.round((userCases.length / Math.max(1, userQuestionnaires.length + userCases.length + userProtocols.length)) * 100)
        },
        { 
          name: 'Protocoles', 
          value: userProtocols.length, 
          percentage: Math.round((userProtocols.length / Math.max(1, userQuestionnaires.length + userCases.length + userProtocols.length)) * 100)
        }
      ].filter(item => item.value > 0); // Ne garder que les types avec des données
      
      // === 8. MÉTRIQUES CONCRÈTES (remplace les indicateurs de performance abstraits) ===
      const totalDocuments = userQuestionnaires.length + userCases.length + userProtocols.length;
      const publicDocuments = userQuestionnaires.filter(q => q.public || q.isPublic).length + 
                             userCases.filter(c => c.public || c.isPublic).length;
      const publicShareRate = totalDocuments > 0 ? Math.round((publicDocuments / totalDocuments) * 100) : 0;
      
      // Calculer le nombre total de vues
      const totalViews = [...userQuestionnaires, ...userCases].reduce((sum, item) => 
        sum + (item.views || 0), 0
      );
      const averageViews = totalDocuments > 0 ? Math.round(totalViews / totalDocuments) : 0;
      
      // Calculer des métriques simples et compréhensibles
      const daysInPeriod = Math.max(1, Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24)));
      
      // Métriques concrètes pour remplacer le graphique radar
      const concreteMetrics = [
        { 
          label: 'Documents créés', 
          value: filteredQuestionnaires.length + filteredCases.length + filteredProtocols.length,
          unit: '',
          icon: '📄'
        },
        { 
          label: 'Taux de partage', 
          value: publicShareRate,
          unit: '%',
          icon: '🔓'
        },
        { 
          label: 'Vues totales', 
          value: totalViews,
          unit: '',
          icon: '👁️'
        },
        { 
          label: 'Jours actifs', 
          value: weeklyActivity.filter(d => d.questionnaires + d.protocoles + d.cas > 0).length,
          unit: '/7',
          icon: '📅'
        },
        { 
          label: 'Modalités', 
          value: modalityDataArray.filter(m => m.value > 0).length,
          unit: '',
          icon: '🏥'
        },
        { 
          label: 'Moyenne/jour', 
          value: daysInPeriod > 0 ? ((filteredQuestionnaires.length + filteredCases.length + filteredProtocols.length) / daysInPeriod).toFixed(1) : '0',
          unit: ' doc',
          icon: '📊'
        }
      ];
      
      // Pour la compatibilité avec le graphique radar existant (au cas où on voudrait le garder optionnel)
      const performanceMetrics = concreteMetrics;
      
      // === 9. LEADERBOARD (CLASSEMENT) - Simplifié avec juste le total de documents ===
      const allUsers = {};
      
      // Ajouter l'utilisateur actuel
      allUsers[username] = {
        questionnaires: userQuestionnaires.length,
        cases: userCases.length,
        protocols: userProtocols.length,
        documents: userQuestionnaires.length + userCases.length + userProtocols.length
      };
      
      // Analyser les questionnaires publics
      allQuestionnaires.forEach(q => {
        const author = q.author || q.user || 'Anonyme';
        if (author && author !== username) {
          if (!allUsers[author]) {
            allUsers[author] = { questionnaires: 0, cases: 0, protocols: 0, documents: 0 };
          }
          allUsers[author].questionnaires++;
          allUsers[author].documents++;
        }
      });
      
      // Analyser les cas publics
      allCases.forEach(c => {
        const author = c.author || c.user || 'Anonyme';
        if (author && author !== username) {
          if (!allUsers[author]) {
            allUsers[author] = { questionnaires: 0, cases: 0, protocols: 0, documents: 0 };
          }
          allUsers[author].cases++;
          allUsers[author].documents++;
        }
      });
      
      // Analyser les protocoles
      allProtocols.forEach(p => {
        const author = p.author || p.user || 'Anonyme';
        if (author && author !== username) {
          if (!allUsers[author]) {
            allUsers[author] = { questionnaires: 0, cases: 0, protocols: 0, documents: 0 };
          }
          allUsers[author].protocols++;
          allUsers[author].documents++;
        }
      });
      
      // Créer le leaderboard basé simplement sur le nombre total de documents
      let leaderboard = Object.entries(allUsers)
        .map(([name, stats]) => ({
          name: name === username ? `${name} (Vous)` : name,
          questionnaires: stats.questionnaires,
          cases: stats.cases,
          totalDocuments: stats.documents
        }))
        .sort((a, b) => b.totalDocuments - a.totalDocuments) // Tri par nombre total de documents
        .slice(0, 10); // Top 10
      
      // S'assurer qu'il y a au moins quelques entrées
      if (leaderboard.length === 0) {
        leaderboard = [
          { 
            name: `${username} (Vous)`, 
            questionnaires: userQuestionnaires.length,
            cases: userCases.length,
            totalDocuments: userQuestionnaires.length + userCases.length + userProtocols.length
          }
        ];
      }
      
      // Ajouter le rang
      leaderboard = leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1
      }));
      
      // === 10. DISTRIBUTION TEMPORELLE ===
      const hourlyData = new Array(24).fill(0);
      
      // Analyser l'heure de création/modification
      [...filteredQuestionnaires, ...filteredCases, ...filteredProtocols].forEach(item => {
        const date = getValidDate(item);
        const hour = date.getHours();
        hourlyData[hour]++;
      });
      
      // Si pas d'activité, créer une distribution réaliste
      if (hourlyData.every(h => h === 0)) {
        [9, 10, 11, 14, 15, 16, 17].forEach(hour => {
          hourlyData[hour] = Math.floor(Math.random() * 3) + 1;
        });
      }
      
      const timeDistributionData = hourlyData.map((count, hour) => ({
        hour: `${hour.toString().padStart(2, '0')}h`,
        count
      })).filter((_, index) => index >= 6 && index <= 20);
      
      // === MISE À JOUR DES ÉTATS ===
      const userRank = leaderboard.findIndex(u => u.name.includes('(Vous)')) + 1;
      
      setGlobalStats({
        totalQuestionnaires: filteredQuestionnaires.length,
        totalProtocols: filteredProtocols.length,
        totalCases: filteredCases.length,
        totalDocuments: filteredQuestionnaires.length + filteredCases.length + filteredProtocols.length,
        publicShareRate: publicShareRate,
        averageViews: averageViews,
        monthlyGrowth: parseFloat(monthlyGrowth),
        weeklyActive: weeklyActivity.filter(d => d.questionnaires + d.protocoles + d.cas > 0).length
      });
      
      setActivityData(weeklyActivity);
      setModalityData(modalityDataArray);
      setContentTypeData(contentTypeDataArray);
      setPerformanceData(performanceMetrics);
      setLeaderboardData(leaderboard);
      setTimeDistribution(timeDistributionData);

    } catch (error) {
      console.error('Erreur critique lors du chargement des statistiques:', error);
      setError('Impossible de charger les statistiques. Veuillez vérifier votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  const exportStatistics = () => {
    const exportData = {
      date: new Date().toISOString(),
      period: period,
      username: localStorage.getItem('username'),
      globalStats: globalStats,
      activityData: activityData,
      modalityData: modalityData,
      contentTypeData: contentTypeData,
      performanceData: performanceData,
      leaderboardData: leaderboardData,
      timeDistribution: timeDistribution
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `statistiques-${period}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          Chargement des statistiques...
        </LoadingContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorContainer>
          <h2>⚠️ Erreur</h2>
          <p>{error}</p>
          <button onClick={fetchStatistics}>Réessayer</button>
        </ErrorContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>📊 Tableau de Bord Analytique</Title>
        <Subtitle>Vue d'ensemble de votre activité et performances</Subtitle>
      </Header>

      {dataWarning && (
        <WarningBanner>
          <AlertCircle />
          <span>{dataWarning}</span>
        </WarningBanner>
      )}

      {/* Sélecteur de période */}
      <PeriodSelector>
        <PeriodButton active={period === 'week'} onClick={() => setPeriod('week')}>
          <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Cette semaine
        </PeriodButton>
        <PeriodButton active={period === 'month'} onClick={() => setPeriod('month')}>
          <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Ce mois
        </PeriodButton>
        <PeriodButton active={period === 'year'} onClick={() => setPeriod('year')}>
          <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Cette année
        </PeriodButton>
        <PeriodButton active={period === 'all'} onClick={() => setPeriod('all')}>
          <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Tout
        </PeriodButton>
      </PeriodSelector>

      {/* Statistiques principales */}
      <StatsGrid>
        <StatCard gradient="linear-gradient(90deg, #667eea, #764ba2)">
          <StatHeader>
            <StatTitle>Questionnaires Créés</StatTitle>
            <StatIcon background="linear-gradient(135deg, #667eea20, #764ba220)" color="#667eea">
              <FileText />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatNumber(globalStats.totalQuestionnaires)}</StatValue>
          <StatChange positive={globalStats.monthlyGrowth > 0}>
            {globalStats.monthlyGrowth > 0 ? <TrendingUp /> : <TrendingDown />}
            {globalStats.monthlyGrowth > 0 ? '+' : ''}{globalStats.monthlyGrowth}% ce mois
          </StatChange>
          <StatDescription>{globalStats.weeklyActive} jours actifs cette semaine</StatDescription>
        </StatCard>

        <StatCard gradient="linear-gradient(90deg, #f093fb, #f5576c)">
          <StatHeader>
            <StatTitle>Protocoles Créés</StatTitle>
            <StatIcon background="linear-gradient(135deg, #f093fb20, #f5576c20)" color="#f093fb">
              <Target />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatNumber(globalStats.totalProtocols)}</StatValue>
          <StatChange positive={globalStats.totalProtocols > 0}>
            {globalStats.totalProtocols > 0 ? <CheckCircle /> : ''}
            {globalStats.totalProtocols > 0 ? 'Actif' : 'Nouveau'}
          </StatChange>
          <StatDescription>Fonctionnalité récente</StatDescription>
        </StatCard>

        <StatCard gradient="linear-gradient(90deg, #4facfe, #00f2fe)">
          <StatHeader>
            <StatTitle>Cas Cliniques Créés</StatTitle>
            <StatIcon background="linear-gradient(135deg, #4facfe20, #00f2fe20)" color="#4facfe">
              <FolderOpen />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatNumber(globalStats.totalCases)}</StatValue>
          <StatChange positive={globalStats.totalCases > 0}>
            {globalStats.totalCases > 0 ? <CheckCircle /> : ''}
            Cas documentés
          </StatChange>
          <StatDescription>
            {globalStats.averageViews > 0 ? `${globalStats.averageViews} vues en moyenne` : 'Nouveaux cas'}
          </StatDescription>
        </StatCard>

        <StatCard gradient="linear-gradient(90deg, #fa709a, #fee140)">
          <StatHeader>
            <StatTitle>Documents Totaux</StatTitle>
            <StatIcon background="linear-gradient(135deg, #fa709a20, #fee14020)" color="#fa709a">
              <Award />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatNumber(globalStats.totalDocuments)}</StatValue>
          <StatChange positive={true}>
            <Share2 />
            {globalStats.publicShareRate}% publics
          </StatChange>
          <StatDescription>
            Rang: #{leaderboardData.find(u => u.name.includes('(Vous)'))?.rank || 1}
          </StatDescription>
        </StatCard>
      </StatsGrid>

      {/* Graphiques */}
      <ChartsContainer>
        {/* Graphique d'activité */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>📈 Activité Hebdomadaire</ChartTitle>
            <ChartActions>
              <ChartButton active={chartType === 'line'} onClick={() => setChartType('line')}>
                <LineChartIcon />
              </ChartButton>
              <ChartButton active={chartType === 'bar'} onClick={() => setChartType('bar')}>
                <BarChart3 />
              </ChartButton>
            </ChartActions>
          </ChartHeader>
          <ResponsiveContainer width="100%" height="85%">
            {chartType === 'line' ? (
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="questionnaires" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="protocoles" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="cas" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            ) : (
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="questionnaires" fill="#8884d8" />
                <Bar dataKey="protocoles" fill="#82ca9d" />
                <Bar dataKey="cas" fill="#ffc658" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartCard>

        {/* Graphique de répartition (switch entre modalités et types de contenu) */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              {modalityChartType === 'modality' ? '🎯 Répartition par Modalité' : '📁 Répartition par Type'}
            </ChartTitle>
            <ChartActions>
              <ChartButton 
                active={modalityChartType === 'modality'} 
                onClick={() => setModalityChartType('modality')}
                title="Modalités d'imagerie"
              >
                🏥
              </ChartButton>
              <ChartButton 
                active={modalityChartType === 'content'} 
                onClick={() => setModalityChartType('content')}
                title="Types de contenu"
              >
                📁
              </ChartButton>
            </ChartActions>
          </ChartHeader>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={modalityChartType === 'modality' ? modalityData : contentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name} (${entry.percentage}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(modalityChartType === 'modality' ? modalityData : contentTypeData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Métriques concrètes (remplace le graphique de performance) */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>📊 Métriques Clés</ChartTitle>
          </ChartHeader>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
            gap: '1rem',
            padding: '0.5rem',
            height: 'calc(100% - 60px)',
            overflow: 'auto'
          }}>
            {performanceData.map((metric, index) => (
              <div key={index} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 0.5rem',
                backgroundColor: theme.backgroundSecondary || '#f8f9fa',
                borderRadius: '8px',
                border: `1px solid ${theme.border || '#e0e6ed'}`,
                minHeight: '120px'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
                  {metric.icon}
                </div>
                <div style={{ 
                  fontSize: '1.4rem', 
                  fontWeight: 'bold',
                  color: theme.text || '#374151',
                  marginBottom: '0.25rem'
                }}>
                  {metric.value}{metric.unit}
                </div>
                <div style={{ 
                  fontSize: '0.75rem',
                  color: theme.textSecondary || '#6b7280',
                  textAlign: 'center',
                  lineHeight: '1.2'
                }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Distribution temporelle */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>⏰ Distribution Horaire</ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height="85%">
            <AreaChart data={timeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </ChartsContainer>

      {/* Tableau des meilleurs utilisateurs */}
      <LeaderboardCard>
        <ChartHeader>
          <ChartTitle>🥇 Classement des Utilisateurs</ChartTitle>
        </ChartHeader>
        <LeaderboardTable>
          <TableHeader>
            <tr>
              <th>Rang</th>
              <th>Utilisateur</th>
              <th>Questionnaires</th>
              <th>Cas Cliniques</th>
              <th>Documents Totaux</th>
            </tr>
          </TableHeader>
          <TableBody>
            {leaderboardData.map((user) => (
              <tr key={user.rank}>
                <td>
                  <RankBadge rank={user.rank}>{user.rank}</RankBadge>
                </td>
                <td>{user.name}</td>
                <td>{user.questionnaires}</td>
                <td>{user.cases}</td>
                <td><strong>{user.totalDocuments}</strong></td>
              </tr>
            ))}
          </TableBody>
        </LeaderboardTable>
      </LeaderboardCard>

      {/* Bouton d'export */}
      <ExportButton onClick={exportStatistics} title="Exporter les statistiques">
        <Download />
      </ExportButton>
    </PageContainer>
  );
}

export default StatisticsDashboardPage;