import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';
import { 
  Search as SearchIcon, 
  Eye, 
  Copy, 
  Star, 
  Clock, 
  User, 
  TrendingUp, 
  Plus,
  ThumbsUp
} from 'lucide-react';

import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ==================== STYLES COMPOSANTS ====================

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
  pointer-events: none;
`;

const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  option {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }
`;

const SortContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SortButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.isActive ? props.theme.primary : props.theme.borderLight};
  border-radius: 8px;
  background-color: ${props => props.isActive ? props.theme.primary : props.theme.card};
  color: ${props => props.isActive ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProtocolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProtocolCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.primary};
  }
`;

const ProtocolHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ProtocolTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  flex: 1;
  line-height: 1.3;
`;

const PopularityBadge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => props.theme.success};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const ProtocolMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const ProtocolDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.borderLight};
`;

const StatItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.875rem;
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
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
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: ${props => props.theme.textSecondary};

  h3 {
    color: ${props => props.theme.text};
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 2rem;
    line-height: 1.6;
  }
`;

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primaryDark};
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const RatingStars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.1rem;
`;

const RatingValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
`;

const RatingCount = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
`;

// Pagination components
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 6px;
  background-color: ${props => props.isActive ? props.theme.primary : props.theme.card};
  color: ${props => props.isActive ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.primary};
    color: white;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

function ProtocolsPublicPage() {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Options pour les filtres
  const imagingTypes = ['IRM', 'Scanner', 'Échographie', 'Radiographie', 'Mammographie', 'Médecine Nucléaire', 'Angiographie'];
  const anatomicalRegions = ['Céphalée', 'Cervical', 'Thorax', 'Abdomen', 'Pelvis', 'Rachis', 'Membre Supérieur', 'Membre Inférieur', 'Vaisseaux', 'Cœur', 'Sein', 'Autre'];

  const fetchProtocols = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        search: searchTerm,
        imagingType: filterType,
        anatomicalRegion: filterRegion,
        sortBy: sortBy
      });

      const response = await axios.get(`/protocols/public?${params}`);
      console.log('Réponse API:', response.data);
      
      // S'assurer que les données sont valides et sont des tableaux
      const protocolsData = response.data.protocols || [];
      const validProtocols = Array.isArray(protocolsData) ? protocolsData : [];
      
      // Nettoyer les données pour éviter les objets React invalides
      const cleanedProtocols = validProtocols.map(protocol => ({
        ...protocol,
        // S'assurer que toutes les propriétés sont des valeurs primitives ou null
        title: protocol.title ? String(protocol.title) : 'Sans titre',
        description: protocol.description ? String(protocol.description) : '',
        indication: protocol.indication ? String(protocol.indication) : '',
        imagingType: protocol.imagingType ? String(protocol.imagingType) : '',
        anatomicalRegion: protocol.anatomicalRegion ? String(protocol.anatomicalRegion) : '',
        estimatedDuration: protocol.estimatedDuration ? String(protocol.estimatedDuration) : '',
        complexity: protocol.complexity ? Number(protocol.complexity) : 1,
        averageRating: protocol.averageRating ? Number(protocol.averageRating) : 0,
        ratingsCount: protocol.ratingsCount ? Number(protocol.ratingsCount) : 0,
        views: protocol.views || protocol.stats?.views || 0,
        copies: protocol.copies || protocol.stats?.copies || 0,
        user: protocol.user || {},
        _id: protocol._id ? String(protocol._id) : ''
      }));
      
      setProtocols(cleanedProtocols);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Erreur lors du chargement des protocoles publics:', err);
      setError('Erreur lors du chargement des protocoles publics');
      setProtocols([]); // Reset en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterType, filterRegion, sortBy]);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [searchTerm, filterType, filterRegion, sortBy]);

  const handleCopy = async (protocolId) => {
    try {
      await axios.post(`/protocols/${protocolId}/copy`);
      alert('Protocole copié dans vos protocoles personnels !');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      setError('Erreur lors de la copie du protocole');
    }
  };

  const isPopular = (protocol) => {
    const views = Number(protocol?.views) || 0;
    const copies = Number(protocol?.copies) || 0;
    return copies > 10 || views > 100;
  };

  // Fonction pour afficher les étoiles de notation - CORRIGÉE
  const renderRatingStars = (rating) => {
    const stars = [];
    const numericRating = Number(rating) || 0;
    const maxStars = 5;
    
    // Convertir la note de 0-10 à 0-5 pour l'affichage
    const adjustedRating = (numericRating / 10) * maxStars;
    const fullStars = Math.floor(adjustedRating);
    const hasHalfStar = adjustedRating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star 
          key={`full-${i}`} 
          size={12} 
          fill="gold" 
          stroke="gold"
        />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Star 
          key="half" 
          size={12} 
          fill="gold" 
          stroke="gold"
          style={{ opacity: 0.5 }} 
        />
      );
    }
    
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star 
          key={`empty-${i}`} 
          size={12} 
          fill="none"
          stroke="#d1d5db"
        />
      );
    }
    
    return stars;
  };

  // Fonction pour formatter la note - AJOUTÉE
  const formatRating = (rating) => {
    const numericRating = Number(rating) || 0;
    return numericRating.toFixed(1);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <PageContainer>
      <PageTitle>Protocoles Publics</PageTitle>

      <ActionBar>
        <SearchContainer>
          <SearchWrapper>
            <SearchIconWrapper>
              <SearchIcon size={20} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Rechercher un protocole public..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
          <FilterSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Toutes les modalités</option>
            {imagingTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </FilterSelect>
          <FilterSelect
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="">Toutes les régions</option>
            {anatomicalRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </FilterSelect>
        </SearchContainer>

        <SortContainer>
          <SortButton
            isActive={sortBy === 'popular'}
            onClick={() => setSortBy('popular')}
          >
            <TrendingUp size={16} style={{ marginRight: '0.5rem' }} />
            Populaires
          </SortButton>
          <SortButton
            isActive={sortBy === 'recent'}
            onClick={() => setSortBy('recent')}
          >
            Récents
          </SortButton>
          <SortButton
            isActive={sortBy === 'alphabetical'}
            onClick={() => setSortBy('alphabetical')}
          >
            A-Z
          </SortButton>
          <SortButton
            isActive={sortBy === 'rating'}
            onClick={() => setSortBy('rating')}
          >
            <Star size={16} style={{ marginRight: '0.5rem' }} />
            Mieux notés
          </SortButton>
        </SortContainer>
      </ActionBar>

      {protocols.length === 0 ? (
        <EmptyState>
          <h3>Aucun protocole trouvé</h3>
          <p>
            {searchTerm || filterType || filterRegion 
              ? "Aucun protocole public ne correspond à vos critères de recherche."
              : "Aucun protocole public n'est disponible pour le moment."
            }
          </p>
        </EmptyState>
      ) : (
        <>
          <ProtocolsGrid>
            {protocols.map((protocol) => (
              <ProtocolCard key={protocol._id || Math.random()}>
                <ProtocolHeader>
                  <ProtocolTitle>{protocol.title}</ProtocolTitle>
                  {isPopular(protocol) && (
                    <PopularityBadge>
                      <TrendingUp size={12} />
                      Populaire
                    </PopularityBadge>
                  )}
                </ProtocolHeader>
                
                <AuthorInfo>
                  <User size={16} />
                  Par <strong>{protocol.user?.username || 'Utilisateur'}</strong>
                </AuthorInfo>

                {/* Système de notation - AJOUTÉ */}
                {protocol.averageRating > 0 && (
                  <RatingContainer>
                    <RatingStars>
                      {renderRatingStars(protocol.averageRating)}
                    </RatingStars>
                    <RatingValue>{formatRating(protocol.averageRating)}/10</RatingValue>
                    <RatingCount>({protocol.ratingsCount} avis)</RatingCount>
                  </RatingContainer>
                )}
                
                <ProtocolMeta>
                  <MetaItem>
                    <span>📋</span>
                    {protocol.imagingType}
                  </MetaItem>
                  <MetaItem>
                    <span>🎯</span>
                    {protocol.anatomicalRegion}
                  </MetaItem>
                  {protocol.estimatedDuration && (
                    <MetaItem>
                      <Clock size={14} />
                      {protocol.estimatedDuration}
                    </MetaItem>
                  )}
                  {protocol.complexity && (
                    <MetaItem>
                      {Array.from({ length: Number(protocol.complexity) }, (_, i) => (
                        <Star key={i} size={12} fill="currentColor" />
                      ))}
                    </MetaItem>
                  )}
                </ProtocolMeta>
                
                <ProtocolDescription>
                  {protocol.description || protocol.indication}
                </ProtocolDescription>
                
                <StatsContainer>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <StatItem>
                      <Eye size={14} />
                      {Number(protocol.views) || 0} vues
                    </StatItem>
                    <StatItem>
                      <Copy size={14} />
                      {Number(protocol.copies) || 0} copies
                    </StatItem>
                  </div>
                  
                  <ActionsContainer>
                    <ActionButton
                      as={Link}
                      to={`/protocols/view/${protocol._id}`}
                      title="Voir"
                    >
                      <Eye size={16} />
                    </ActionButton>
                    
                    <ActionButton
                      onClick={() => handleCopy(protocol._id)}
                      title="Copier"
                    >
                      <Copy size={16} />
                    </ActionButton>
                  </ActionsContainer>
                </StatsContainer>
              </ProtocolCard>
            ))}
          </ProtocolsGrid>

          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} 
                disabled={currentPage === 1}
              >
                ← Précédent
              </PaginationButton>
              
              <span style={{ margin: '0 1rem', color: 'var(--color-text-secondary)' }}>
                Page {currentPage} sur {totalPages}
              </span>
              
              <PaginationButton 
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} 
                disabled={currentPage === totalPages}
              >
                Suivant →
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}
    </PageContainer>
  );
}

export default ProtocolsPublicPage;