import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Search, Filter, Eye, Copy, Star, Clock, User, TrendingUp, Globe } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ==================== STYLED COMPONENTS ====================

const PageContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  min-height: calc(100vh - 60px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &::before {
    content: '🌍';
    font-size: 2rem;
    -webkit-text-fill-color: initial;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 600px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  color: ${props => props.theme.textSecondary};
  pointer-events: none;
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const SortContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SortButton = styled.button`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.isActive ? props.theme.primary : props.theme.border};
  border-radius: 12px;
  background-color: ${props => props.isActive ? props.theme.primary : props.theme.card};
  color: ${props => props.isActive ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.isActive ? props.theme.primaryHover : props.theme.backgroundSecondary};
  }
`;

const ProtocolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProtocolCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
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
  line-height: 1.3;
  flex: 1;
`;

const PopularityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const ProtocolMeta = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => props.theme.backgroundSecondary || '#f1f5f9'};
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
`;

const AuthorInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
  border-radius: 8px;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
`;

const ProtocolDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin-bottom: 1rem;
  line-height: 1.5;
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
  border-top: 1px solid ${props => props.theme.border};
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
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
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;

  &:hover {
    background-color: ${props => props.theme.primary};
    border-color: ${props => props.theme.primary};
    color: white;
    transform: translateY(-1px);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
  }

  p {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
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
      setProtocols(response.data.protocols || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Erreur lors du chargement des protocoles publics:', err);
      setError('Erreur lors du chargement des protocoles publics');
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
    return protocol.copies > 10 || protocol.views > 100;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <PageContainer>
      <PageTitle>Protocoles Publics</PageTitle>

      <ActionBar>
        <SearchContainer>
          <SearchWrapper>
            <SearchIcon size={20} />
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
              <ProtocolCard key={protocol._id}>
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
                      {Array.from({ length: protocol.complexity }, (_, i) => (
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
                      {protocol.views || 0} vues
                    </StatItem>
                    <StatItem>
                      <Copy size={14} />
                      {protocol.copies || 0} copies
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
                      title="Copier dans mes protocoles"
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
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </PaginationButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationButton
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationButton>
              ))}
              
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Suivant
              </PaginationButton>
            </PaginationContainer>
          )}
        </>
      )}
    </PageContainer>
  );
}

export default ProtocolsPublicPage;