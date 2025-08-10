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
  background-color: ${props => props.$active ? props.theme.primary : props.theme.card};
  color: ${props => props.$active ? 'white' : props.theme.text};
  border: 2px solid ${props => props.$active ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$active ? props.theme.primaryDark : props.theme.hover};
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
    background: ${props => props.$gradient || `linear-gradient(90deg, ${props.theme.primary}, ${props.theme.secondary})`};
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
  background: ${props => props.$background || `linear-gradient(135deg, ${props.theme.primary}20, ${props.theme.secondary}20)`};
  color: ${props => props.$color || props.theme.primary};

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
  color: ${props => props.$positive ? '#10b981' : '#ef4444'};

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
  background-color: ${props => props.$active ? props.theme.primary : props.theme.background};
  color: ${props => props.$active ? 'white' : props.theme.text};
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
    if (props.$rank === 1) return 'linear-gradient(135deg, #FFD700, #FFA500)';
    if (props.$rank === 2) return 'linear-gradient(135deg, #C0C0C0, #808080)';
    if (props.$rank === 3) return 'linear-gradient(135deg, #CD7F32, #8B4513)';
    return props.theme.backgroundSecondary;
  }};
  color: ${props => props.$rank <= 3 ? 'white' : props.theme.text};
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
    totalDocuments: 0,
    publicShareRate: 0,
    averageViews: 0,
    monthlyGrowth: 0,
    weeklyActive: 0,
    totalUsers: 0
  });

  const [activityData, setActivityData] = useState([]);
  const [modalityData, setModalityData] = useState([]);
  const [contentTypeData, setContentTypeData] = useState([]);
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
      
      // Récupérer le username et userId de l'utilisateur connecté
      const currentUsername = localStorage.getItem('username');
      const currentUserId = localStorage.getItem('userId');
      
      if (!currentUsername) {
        throw new Error('Utilisateur non connecté');
      }
      
      console.log('🔍 Utilisateur connecté:', {
        username: currentUsername,
        userId: currentUserId
      });
      
      // Variables pour stocker toutes les données
      let allQuestionnaires = [];
      let allCases = [];
      let allProtocols = [];
      
      // === RÉCUPÉRATION DES QUESTIONNAIRES ===
      try {
        const questResponse = await axios.get('/questionnaires', { 
          params: { limit: 10000 } 
        });
        
        if (questResponse.data) {
          allQuestionnaires = Array.isArray(questResponse.data) 
            ? questResponse.data 
            : (questResponse.data.questionnaires || []);
        }
      } catch (err) {
        console.log('Erreur récupération questionnaires:', err.message);
      }
      
      console.log(`📋 ${allQuestionnaires.length} questionnaires récupérés`);
      
      // === RÉCUPÉRATION DES CAS ===
      try {
        const casesResponse = await axios.get('/cases', { 
          params: { limit: 10000 } 
        });
        
        if (casesResponse.data) {
          allCases = Array.isArray(casesResponse.data) 
            ? casesResponse.data 
            : (casesResponse.data.cases || []);
        }
      } catch (err) {
        console.log('Erreur récupération cas:', err.message);
      }
      
      console.log(`📋 ${allCases.length} cas récupérés`);
      
      // === RÉCUPÉRATION DES PROTOCOLES ===
      try {
        const protocolsResponse = await axios.get('/protocols', {
          params: { limit: 10000 }
        });
        
        if (protocolsResponse.data) {
          allProtocols = Array.isArray(protocolsResponse.data) 
            ? protocolsResponse.data 
            : (protocolsResponse.data.protocols || []);
        }
      } catch (err) {
        console.log('Pas de protocoles disponibles');
      }
      
      console.log(`📋 ${allProtocols.length} protocoles récupérés`);
      
      // === CONSTRUCTION DU CLASSEMENT ===
      
      // Créer une table de correspondance ID MongoDB -> Username
      const idToUsernameMap = {};
      const usernameToStatsMap = {};
      
      // Correspondances connues (à adapter selon votre système)
      const knownMappings = {
        '66d4a5ebc973626bea6cba3e': 'Cass22',
        // Ajoutez d'autres mappings ici si nécessaire
      };
      
      // Fonction pour obtenir tous les identifiants possibles d'un document
      const getDocumentIdentifiers = (doc) => {
        const identifiers = [];
        
        // Gérer le champ user qui peut être un objet ou une string
        if (doc.user) {
          if (typeof doc.user === 'object' && doc.user._id) {
            identifiers.push(doc.user._id);
            if (doc.user.username) identifiers.push(doc.user.username);
            if (doc.user.name) identifiers.push(doc.user.name);
          } else if (typeof doc.user === 'string') {
            identifiers.push(doc.user);
          }
        }
        
        // Autres champs possibles
        if (doc.author) identifiers.push(doc.author);
        if (doc.username) identifiers.push(doc.username);
        if (doc.userId) identifiers.push(doc.userId);
        if (doc.createdBy) identifiers.push(doc.createdBy);
        
        return identifiers;
      };
      
      // Parcourir tous les documents pour détecter les correspondances
      [...allQuestionnaires, ...allCases, ...allProtocols].forEach(doc => {
        // Gérer le cas où user est un objet
        if (doc.user && typeof doc.user === 'object') {
          if (doc.user._id && doc.user.username) {
            idToUsernameMap[doc.user._id] = doc.user.username;
          } else if (doc.user._id && doc.user.name) {
            idToUsernameMap[doc.user._id] = doc.user.name;
          }
        }
        
        // Méthode 1: Si on a user (ID) et author/username (nom)
        if (doc.user && doc.author && doc.user !== doc.author) {
          const userId = typeof doc.user === 'object' ? doc.user._id : doc.user;
          if (userId && /^[a-f0-9]{24}$/i.test(userId) && !/^[a-f0-9]{24}$/i.test(doc.author)) {
            idToUsernameMap[userId] = doc.author;
          }
        }
        
        // Méthode 2: Si on a userId et username
        if (doc.userId && doc.username && doc.userId !== doc.username) {
          if (/^[a-f0-9]{24}$/i.test(doc.userId) && !/^[a-f0-9]{24}$/i.test(doc.username)) {
            idToUsernameMap[doc.userId] = doc.username;
          }
        }
        
        // Méthode 3: Utiliser les correspondances connues
        Object.entries(knownMappings).forEach(([id, username]) => {
          const userId = typeof doc.user === 'object' ? doc.user._id : doc.user;
          if (userId === id || doc.userId === id || doc._id === id) {
            idToUsernameMap[id] = username;
          }
        });
      });
      
      // Ajouter les correspondances connues
      Object.assign(idToUsernameMap, knownMappings);
      
      console.log('📊 Table de correspondance ID -> Username:', idToUsernameMap);
      console.log('🔍 Utilisateur actuel:', { username: currentUsername, userId: currentUserId });
      
      // Fonction pour obtenir le nom d'utilisateur principal
      const getUsernameFromDoc = (doc) => {
        // Si user est un objet avec username ou name
        if (doc.user && typeof doc.user === 'object') {
          if (doc.user.username) return doc.user.username;
          if (doc.user.name) return doc.user.name;
          if (doc.user._id) {
            return idToUsernameMap[doc.user._id] || doc.user._id;
          }
        }
        
        // Si user est une string (ID)
        if (doc.user && typeof doc.user === 'string') {
          if (/^[a-f0-9]{24}$/i.test(doc.user)) {
            return idToUsernameMap[doc.user] || doc.user;
          }
          return doc.user;
        }
        
        // Essayer les autres champs
        if (doc.author && !/^[a-f0-9]{24}$/i.test(doc.author)) {
          return doc.author;
        }
        if (doc.username && !/^[a-f0-9]{24}$/i.test(doc.username)) {
          return doc.username;
        }
        if (doc.userId) {
          if (/^[a-f0-9]{24}$/i.test(doc.userId)) {
            return idToUsernameMap[doc.userId] || doc.userId;
          }
          return doc.userId;
        }
        
        return 'Anonyme';
      };
      
      // Fonction améliorée pour vérifier si c'est l'utilisateur actuel
      const isCurrentUserDoc = (doc) => {
        const identifiers = getDocumentIdentifiers(doc);
        
        for (const id of identifiers) {
          if (!id) continue; // Ignorer les valeurs null/undefined
          
          // S'assurer que id est une string
          if (typeof id === 'object') continue; // Ignorer les objets
          
          const idStr = String(id); // Convertir en string
          
          // Comparaison directe avec le username
          if (currentUsername && idStr.toLowerCase() === currentUsername.toLowerCase()) {
            return true;
          }
          
          // Comparaison avec l'userId
          if (currentUserId && idStr === currentUserId) {
            return true;
          }
          
          // Vérifier via la table de correspondance
          if (idToUsernameMap[idStr] && currentUsername && 
              idToUsernameMap[idStr].toLowerCase() === currentUsername.toLowerCase()) {
            return true;
          }
        }
        
        return false;
      };
      
      console.log('🔍 Analyse de la structure des documents...');
      
      // Analyser quelques questionnaires
      if (allQuestionnaires.length > 0) {
        const firstQuest = allQuestionnaires[0];
        console.log('Exemple de questionnaire:', {
          ...firstQuest,
          _content: '...' // Éviter d'afficher le contenu complet
        });
        console.log('Identifiants du questionnaire:', getDocumentIdentifiers(firstQuest));
        console.log('Username extrait:', getUsernameFromDoc(firstQuest));
        console.log('Correspond à utilisateur actuel?', isCurrentUserDoc(firstQuest));
      }
      
      // Analyser quelques cas
      if (allCases.length > 0) {
        const firstCase = allCases[0];
        console.log('Exemple de cas:', {
          ...firstCase,
          _content: '...'
        });
        console.log('Identifiants du cas:', getDocumentIdentifiers(firstCase));
        console.log('Username extrait:', getUsernameFromDoc(firstCase));
        console.log('Correspond à utilisateur actuel?', isCurrentUserDoc(firstCase));
      }
      
      // Traiter tous les questionnaires
      let questionnairesCount = {};
      allQuestionnaires.forEach((q, index) => {
        try {
          const username = getUsernameFromDoc(q);
          const isCurrentUserItem = isCurrentUserDoc(q);
          
          if (!usernameToStatsMap[username]) {
            usernameToStatsMap[username] = {
              questionnaires: 0,
              cases: 0,
              protocols: 0,
              documents: 0,
              isCurrentUser: isCurrentUserItem
            };
          }
          
          usernameToStatsMap[username].questionnaires++;
          usernameToStatsMap[username].documents++;
          
          // Si c'est l'utilisateur actuel, le marquer
          if (isCurrentUserItem) {
            usernameToStatsMap[username].isCurrentUser = true;
          }
          
          if (!questionnairesCount[username]) questionnairesCount[username] = 0;
          questionnairesCount[username]++;
        } catch (err) {
          console.error(`Erreur lors du traitement du questionnaire ${index}:`, err);
        }
      });
      
      console.log('📊 Nombre de questionnaires par utilisateur:', questionnairesCount);
      
      // Traiter tous les cas
      let casesCount = {};
      allCases.forEach((c, index) => {
        try {
          const username = getUsernameFromDoc(c);
          const isCurrentUserItem = isCurrentUserDoc(c);
          
          if (!usernameToStatsMap[username]) {
            usernameToStatsMap[username] = {
              questionnaires: 0,
              cases: 0,
              protocols: 0,
              documents: 0,
              isCurrentUser: isCurrentUserItem
            };
          }
          
          usernameToStatsMap[username].cases++;
          usernameToStatsMap[username].documents++;
          
          if (isCurrentUserItem) {
            usernameToStatsMap[username].isCurrentUser = true;
          }
          
          if (!casesCount[username]) casesCount[username] = 0;
          casesCount[username]++;
        } catch (err) {
          console.error(`Erreur lors du traitement du cas ${index}:`, err);
        }
      });
      
      console.log('📊 Nombre de cas par utilisateur:', casesCount);
      
      // Traiter tous les protocoles
      allProtocols.forEach(p => {
        const username = getUsernameFromDoc(p);
        const isCurrentUserItem = isCurrentUserDoc(p);
        
        if (!usernameToStatsMap[username]) {
          usernameToStatsMap[username] = {
            questionnaires: 0,
            cases: 0,
            protocols: 0,
            documents: 0,
            isCurrentUser: isCurrentUserItem
          };
        }
        
        usernameToStatsMap[username].protocols++;
        usernameToStatsMap[username].documents++;
        
        if (isCurrentUserItem) {
          usernameToStatsMap[username].isCurrentUser = true;
        }
      });
      
      // Fusionner les entrées qui correspondent au même utilisateur
      // Par exemple, si on a "66d4a5ebc973626bea6cba3e" et "Cass22" séparément
      const finalStatsMap = {};
      
      Object.entries(usernameToStatsMap).forEach(([key, stats]) => {
        // Si c'est un ID MongoDB et qu'on a un username correspondant
        if (/^[a-f0-9]{24}$/i.test(key) && idToUsernameMap[key]) {
          const username = idToUsernameMap[key];
          if (!finalStatsMap[username]) {
            finalStatsMap[username] = { ...stats };
          } else {
            // Fusionner les stats
            finalStatsMap[username].questionnaires += stats.questionnaires;
            finalStatsMap[username].cases += stats.cases;
            finalStatsMap[username].protocols += stats.protocols;
            finalStatsMap[username].documents += stats.documents;
            finalStatsMap[username].isCurrentUser = finalStatsMap[username].isCurrentUser || stats.isCurrentUser;
          }
        } else if (!/^[a-f0-9]{24}$/i.test(key)) {
          // C'est déjà un username
          if (!finalStatsMap[key]) {
            finalStatsMap[key] = { ...stats };
          } else {
            // Fusionner si nécessaire
            finalStatsMap[key].questionnaires += stats.questionnaires;
            finalStatsMap[key].cases += stats.cases;
            finalStatsMap[key].protocols += stats.protocols;
            finalStatsMap[key].documents += stats.documents;
            finalStatsMap[key].isCurrentUser = finalStatsMap[key].isCurrentUser || stats.isCurrentUser;
          }
        }
      });
      
      // S'assurer que l'utilisateur actuel est dans la liste
      if (!Object.values(finalStatsMap).some(stats => stats.isCurrentUser)) {
        finalStatsMap[currentUsername] = {
          questionnaires: 0,
          cases: 0,
          protocols: 0,
          documents: 0,
          isCurrentUser: true
        };
      }
      
      // Ajouter les utilisateurs connus qui n'ont pas encore de documents
      const knownUsers = ['Cass222', 'admin', 'test'];
      knownUsers.forEach(username => {
        if (!finalStatsMap[username]) {
          finalStatsMap[username] = {
            questionnaires: 0,
            cases: 0,
            protocols: 0,
            documents: 0,
            isCurrentUser: username.toLowerCase() === currentUsername.toLowerCase()
          };
        }
      });
      
      const userStatsMap = finalStatsMap;
      
      console.log('📊 Statistiques finales par utilisateur:');
      Object.entries(userStatsMap).forEach(([username, stats]) => {
        const displayName = stats.isCurrentUser ? `${username} (VOUS)` : username;
        console.log(`  ${displayName}: Q=${stats.questionnaires}, C=${stats.cases}, P=${stats.protocols}, Total=${stats.documents}`);
      });
      
      // Récupérer les stats de l'utilisateur actuel
      let currentUserStats = null;
      for (const [username, stats] of Object.entries(userStatsMap)) {
        if (stats.isCurrentUser) {
          currentUserStats = stats;
          console.log(`✅ Stats de l'utilisateur actuel (${username}):`, stats);
          break;
        }
      }
      
      if (!currentUserStats) {
        console.log('⚠️ Utilisateur actuel non trouvé, utilisation de valeurs par défaut');
        currentUserStats = {
          questionnaires: 0,
          cases: 0,
          protocols: 0,
          documents: 0
        };
      }
      
      console.log('📊 Stats utilisateur actuel:', currentUserStats);
      
      // Filtrer les documents de l'utilisateur actuel pour les statistiques temporelles
      const userQuestionnaires = allQuestionnaires.filter(q => isCurrentUserDoc(q));
      const userCases = allCases.filter(c => isCurrentUserDoc(c));
      const userProtocols = allProtocols.filter(p => isCurrentUserDoc(p));
      
      console.log(`📊 Documents de l'utilisateur actuel (${currentUsername}):`, {
        questionnaires: userQuestionnaires.length,
        cas: userCases.length,
        protocoles: userProtocols.length,
        total: userQuestionnaires.length + userCases.length + userProtocols.length
      });
      
      // === CALCUL DES STATISTIQUES TEMPORELLES ===
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
          startDate = new Date(0);
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
        return new Date();
      };
      
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
      
      // === DONNÉES D'ACTIVITÉ HEBDOMADAIRE ===
      const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      const weeklyActivity = new Array(7).fill(null).map((_, index) => ({
        name: daysOfWeek[index],
        questionnaires: 0,
        protocoles: 0,
        cas: 0
      }));
      
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
      
      // === RÉPARTITION PAR MODALITÉ ===
      const modalityCount = {};
      
      userQuestionnaires.forEach(q => {
        let modality = q.modality;
        
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
        .slice(0, 6);
      
      if (modalityDataArray.length === 0) {
        modalityDataArray = [
          { name: 'IRM', value: 1, percentage: 25 },
          { name: 'Scanner', value: 1, percentage: 25 },
          { name: 'Radio', value: 1, percentage: 25 },
          { name: 'Échographie', value: 1, percentage: 25 }
        ];
      }
      
      // === RÉPARTITION PAR TYPE DE CONTENU ===
      const contentTypeDataArray = [
        { 
          name: 'Questionnaires', 
          value: currentUserStats.questionnaires, 
          percentage: Math.round((currentUserStats.questionnaires / Math.max(1, currentUserStats.documents)) * 100)
        },
        { 
          name: 'Cas cliniques', 
          value: currentUserStats.cases, 
          percentage: Math.round((currentUserStats.cases / Math.max(1, currentUserStats.documents)) * 100)
        },
        { 
          name: 'Protocoles', 
          value: currentUserStats.protocols, 
          percentage: Math.round((currentUserStats.protocols / Math.max(1, currentUserStats.documents)) * 100)
        }
      ].filter(item => item.value > 0);
      
      // === MÉTRIQUES CONCRÈTES ===
      const totalDocuments = currentUserStats.documents;
      const publicDocuments = userQuestionnaires.filter(q => q.public || q.isPublic).length + 
                             userCases.filter(c => c.public || c.isPublic).length;
      const publicShareRate = totalDocuments > 0 ? Math.round((publicDocuments / totalDocuments) * 100) : 0;
      
      const totalViews = [...userQuestionnaires, ...userCases].reduce((sum, item) => 
        sum + (item.views || 0), 0
      );
      const averageViews = totalDocuments > 0 ? Math.round(totalViews / totalDocuments) : 0;
      
      const daysInPeriod = Math.max(1, Math.ceil((new Date() - startDate) / (1000 * 60 * 60 * 24)));
      
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
      
      // === CRÉATION DU LEADERBOARD ===
      let leaderboard = Object.entries(userStatsMap)
        .filter(([username, stats]) => {
          // Filtrer les IDs MongoDB qui n'ont pas été convertis en username
          return !/^[a-f0-9]{24}$/i.test(username);
        })
        .map(([username, stats]) => ({
          name: stats.isCurrentUser ? `${username} (Vous)` : username,
          questionnaires: stats.questionnaires,
          cases: stats.cases,
          totalDocuments: stats.documents,
          rank: 0
        }))
        .sort((a, b) => b.totalDocuments - a.totalDocuments);
      
      // Ajouter le rang
      leaderboard = leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1
      }));
      
      console.log('🏆 Classement final:', leaderboard);
      
      // === DISTRIBUTION TEMPORELLE ===
      const hourlyData = new Array(24).fill(0);
      
      [...filteredQuestionnaires, ...filteredCases, ...filteredProtocols].forEach(item => {
        const date = getValidDate(item);
        const hour = date.getHours();
        hourlyData[hour]++;
      });
      
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
        totalQuestionnaires: currentUserStats.questionnaires,
        totalProtocols: currentUserStats.protocols,
        totalCases: currentUserStats.cases,
        totalDocuments: currentUserStats.documents,
        publicShareRate: publicShareRate,
        averageViews: averageViews,
        monthlyGrowth: parseFloat(monthlyGrowth),
        weeklyActive: weeklyActivity.filter(d => d.questionnaires + d.protocoles + d.cas > 0).length,
        totalUsers: leaderboard.length
      });
      
      setActivityData(weeklyActivity);
      setModalityData(modalityDataArray);
      setContentTypeData(contentTypeDataArray);
      setPerformanceData(concreteMetrics);
      setLeaderboardData(leaderboard);
      setTimeDistribution(timeDistributionData);

    } catch (error) {
      console.error('❌ Erreur critique:', error);
      setError('Impossible de charger les statistiques. Veuillez réessayer.');
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
        <PeriodButton $active={period === 'week'} onClick={() => setPeriod('week')}>
          <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Cette semaine
        </PeriodButton>
        <PeriodButton $active={period === 'month'} onClick={() => setPeriod('month')}>
          <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Ce mois
        </PeriodButton>
        <PeriodButton $active={period === 'year'} onClick={() => setPeriod('year')}>
          <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Cette année
        </PeriodButton>
        <PeriodButton $active={period === 'all'} onClick={() => setPeriod('all')}>
          <Calendar size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
          Tout
        </PeriodButton>
      </PeriodSelector>

      {/* Statistiques principales */}
      <StatsGrid>
        <StatCard $gradient="linear-gradient(90deg, #667eea, #764ba2)">
          <StatHeader>
            <StatTitle>Questionnaires Créés</StatTitle>
            <StatIcon $background="linear-gradient(135deg, #667eea20, #764ba220)" $color="#667eea">
              <FileText />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatNumber(globalStats.totalQuestionnaires)}</StatValue>
          <StatChange $positive={globalStats.monthlyGrowth > 0}>
            {globalStats.monthlyGrowth > 0 ? <TrendingUp /> : <TrendingDown />}
            {globalStats.monthlyGrowth > 0 ? '+' : ''}{globalStats.monthlyGrowth}% ce mois
          </StatChange>
          <StatDescription>{globalStats.weeklyActive} jours actifs cette semaine</StatDescription>
        </StatCard>

        <StatCard $gradient="linear-gradient(90deg, #f093fb, #f5576c)">
          <StatHeader>
            <StatTitle>Protocoles Créés</StatTitle>
            <StatIcon $background="linear-gradient(135deg, #f093fb20, #f5576c20)" $color="#f093fb">
              <Target />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatNumber(globalStats.totalProtocols)}</StatValue>
          <StatChange $positive={globalStats.totalProtocols > 0}>
            {globalStats.totalProtocols > 0 ? <CheckCircle /> : ''}
            {globalStats.totalProtocols > 0 ? 'Actif' : 'Nouveau'}
          </StatChange>
          <StatDescription>Fonctionnalité récente</StatDescription>
        </StatCard>

        <StatCard $gradient="linear-gradient(90deg, #4facfe, #00f2fe)">
          <StatHeader>
            <StatTitle>Cas Cliniques Créés</StatTitle>
            <StatIcon $background="linear-gradient(135deg, #4facfe20, #00f2fe20)" $color="#4facfe">
              <FolderOpen />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatNumber(globalStats.totalCases)}</StatValue>
          <StatChange $positive={globalStats.totalCases > 0}>
            {globalStats.totalCases > 0 ? <CheckCircle /> : ''}
            Cas documentés
          </StatChange>
          <StatDescription>
            {globalStats.averageViews > 0 ? `${globalStats.averageViews} vues en moyenne` : 'Nouveaux cas'}
          </StatDescription>
        </StatCard>

        <StatCard $gradient="linear-gradient(90deg, #fa709a, #fee140)">
          <StatHeader>
            <StatTitle>Documents Totaux</StatTitle>
            <StatIcon $background="linear-gradient(135deg, #fa709a20, #fee14020)" $color="#fa709a">
              <Award />
            </StatIcon>
          </StatHeader>
          <StatValue>{formatNumber(globalStats.totalDocuments)}</StatValue>
          <StatChange $positive={true}>
            <Share2 />
            {globalStats.publicShareRate}% publics
          </StatChange>
          <StatDescription>
            Rang: #{leaderboardData.find(u => u.name.includes('(Vous)'))?.rank || 1} / {globalStats.totalUsers || 1}
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
              <ChartButton $active={chartType === 'line'} onClick={() => setChartType('line')}>
                <LineChartIcon />
              </ChartButton>
              <ChartButton $active={chartType === 'bar'} onClick={() => setChartType('bar')}>
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

        {/* Graphique de répartition */}
        <ChartCard>
          <ChartHeader>
            <ChartTitle>
              {modalityChartType === 'modality' ? '🎯 Répartition par Modalité' : '📁 Répartition par Type'}
            </ChartTitle>
            <ChartActions>
              <ChartButton 
                $active={modalityChartType === 'modality'} 
                onClick={() => setModalityChartType('modality')}
                title="Modalités d'imagerie"
              >
                🏥
              </ChartButton>
              <ChartButton 
                $active={modalityChartType === 'content'} 
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

        {/* Métriques concrètes */}
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
          <ChartTitle>
            🥇 Classement des Utilisateurs 
            {globalStats.totalUsers > 0 && (
              <span style={{ fontSize: '0.9rem', fontWeight: 'normal', marginLeft: '1rem', color: theme.textSecondary }}>
                ({globalStats.totalUsers} utilisateurs au total)
              </span>
            )}
          </ChartTitle>
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
            {leaderboardData.map((user, index) => (
              <tr key={`${user.rank}-${user.name}-${index}`} style={{
                backgroundColor: user.name.includes('(Vous)') ? `${theme.primary}10` : 'transparent',
                fontWeight: user.name.includes('(Vous)') ? 'bold' : 'normal'
              }}>
                <td>
                  <RankBadge $rank={user.rank}>{user.rank}</RankBadge>
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