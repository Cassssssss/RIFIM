// ProtocolsPublicPage.js - VERSION AVEC AFFICHAGE CORRECT DU NOM D'UTILISATEUR
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { Search, Clock, Star, Eye, Copy, User, TrendingUp } from 'lucide-react';
import RatingStars from '../components/RatingStars';

// ==================== STYLES ====================

const PageContainer = styled.div`
  padding: 2rem 3rem;
  min-height: calc(100vh - 60px);
  background-color: ${props => props.theme.background};

  @media (max-width: 1200px) {
    padding: 2rem;
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
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
`;

const StatBox = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
  margin-top: 0.25rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;

  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border: 2px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
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
  background-color: ${props => props.isActive ? props.theme.primary : props.theme.background};
  color: ${props => props.isActive ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.5rem;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.isActive ? props.theme.primary : props.theme.hover};
  }
`;

const ProtocolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProtocolCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const ProtocolTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  flex: 1;
`;

const PopularityBadge = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  white-space: nowrap;
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

const ProtocolMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0;
  padding: 0.75rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};

  strong {
    color: ${props => props.theme.text};
  }
`;

const Description = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const StatsBottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.borderLight};
`;

const StatsGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;

  svg {
    color: ${props => props.theme.primary};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  width: 32px;
  height: 32px;

  &:hover {
    background-color: ${props => props.theme.secondary};
    transform: translateY(-1px);
  }

  svg {
    width: 14px;
    height: 14px;
  }
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const PaginationButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.secondary};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

function ProtocolsPublicPage() {
  // États
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState(''); 
  const [sortBy, setSortBy] = useState('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, authors: 0 });

  const navigate = useNavigate();

  // Fonction pour obtenir le nom d'affichage de l'auteur
  const getAuthorDisplayName = (protocol) => {
    if (!protocol.user) return 'Auteur anonyme';
    
    // Si l'utilisateur est un objet avec des propriétés
    if (typeof protocol.user === 'object') {
      return protocol.user.username || protocol.user.name || protocol.user.email || 'Auteur anonyme';
    }
    
    // Si l'utilisateur est juste une chaîne de caractères
    if (typeof protocol.user === 'string') {
      return protocol.user;
    }
    
    return 'Auteur anonyme';
  };

  // Chargement des protocoles
  const fetchProtocols = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await axios.get('/protocols/public', {
        params: {
          page,
          limit: 12,
          search: searchTerm,
          modality: modalityFilter,
          specialty: specialtyFilter,
          sortBy
        }
      });

      setProtocols(response.data.protocols || []);
      setCurrentPage(response.data.currentPage || 1);
      setTotalPages(response.data.totalPages || 1);
      setStats({
        total: response.data.total || 0,
        authors: response.data.authorsCount || 0
      });
    } catch (error) {
      console.error('Erreur lors du chargement des protocoles:', error);
      setError('Impossible de charger les protocoles publics.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, modalityFilter, specialtyFilter, sortBy]);

  // Effet pour charger les protocoles
  useEffect(() => {
    fetchProtocols(1);
  }, [fetchProtocols]);

  // Gestionnaires d'événements
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleModalityChange = (e) => {
    setModalityFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSpecialtyChange = (e) => {
    setSpecialtyFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleProtocolClick = (protocolId) => {
    navigate(`/protocols/view/${protocolId}`);
  };

  const handleViewClick = (e, protocolId) => {
    e.stopPropagation();
    navigate(`/protocols/view/${protocolId}`);
  };

  const handleCopy = async (e, protocolId) => {
    e.stopPropagation();
    try {
      await axios.post(`/protocols/${protocolId}/copy`);
      alert('Protocole copié avec succès !');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      alert('Erreur lors de la copie du protocole');
    }
  };

  const handleRatingUpdate = (protocolId, newRatingData) => {
    setProtocols(prev => prev.map(protocol => 
      protocol._id === protocolId 
        ? { ...protocol, ...newRatingData }
        : protocol
    ));
  };

  // Rendu du composant
  return (
    <PageContainer>
      <Header>
        <Title>Protocoles Publics</Title>
        
        <StatsContainer>
          <StatBox>
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Protocoles disponibles</StatLabel>
          </StatBox>
          <StatBox>
            <StatNumber>{stats.authors}</StatNumber>
            <StatLabel>Auteurs contributeurs</StatLabel>
          </StatBox>
        </StatsContainer>
      </Header>

      <FiltersContainer>
        <SearchContainer>
          <SearchIconWrapper>
            <Search size={20} />
          </SearchIconWrapper>
          <SearchInput
            type="text"
            placeholder="Rechercher un protocole..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </SearchContainer>

        <FilterSelect value={modalityFilter} onChange={handleModalityChange}>
          <option value="">Toutes les modalités</option>
          <option value="IRM">IRM</option>
          <option value="Scanner">Scanner</option>
          <option value="Échographie">Échographie</option>
          <option value="Radiographie">Radiographie</option>
        </FilterSelect>

        <FilterSelect value={specialtyFilter} onChange={handleSpecialtyChange}>
          <option value="">Toutes les spécialités</option>
          <option value="Neurologie">Neurologie</option>
          <option value="Cardiologie">Cardiologie</option>
          <option value="Orthopédie">Orthopédie</option>
          <option value="Gastroentérologie">Gastroentérologie</option>
        </FilterSelect>

        <SortContainer>
          <SortButton
            isActive={sortBy === 'popular'}
            onClick={() => handleSortChange('popular')}
          >
            <TrendingUp size={16} />
            Populaires
          </SortButton>
          
          <SortButton
            isActive={sortBy === 'recent'}
            onClick={() => handleSortChange('recent')}
          >
            <Clock size={16} />
            Récents
          </SortButton>
          
          <SortButton
            isActive={sortBy === 'rating'}
            onClick={() => handleSortChange('rating')}
          >
            <Star size={16} />
            Mieux notés
          </SortButton>
        </SortContainer>
      </FiltersContainer>

      {loading ? (
        <LoadingMessage>Chargement des protocoles...</LoadingMessage>
      ) : error ? (
        <ErrorMessage>{error}</ErrorMessage>
      ) : protocols.length === 0 ? (
        <EmptyState>
          <h3>Aucun protocole trouvé</h3>
          <p>Essayez de modifier vos critères de recherche.</p>
        </EmptyState>
      ) : (
        <>
          <ProtocolsGrid>
            {protocols.map((protocol) => {
              const isPopular = (protocol.stats?.views || 0) > 50 || (protocol.stats?.copies || 0) > 10;
              
              return (
                <ProtocolCard
                  key={protocol._id}
                  onClick={() => handleProtocolClick(protocol._id)}
                >
                  <CardContent>
                    <CardHeader>
                      <ProtocolTitle>{protocol.title}</ProtocolTitle>
                      {isPopular && (
                        <PopularityBadge>
                          <TrendingUp size={12} />
                          Populaire
                        </PopularityBadge>
                      )}
                    </CardHeader>

                    <AuthorInfo>
                      <User size={14} />
                      Par {getAuthorDisplayName(protocol)}
                    </AuthorInfo>

                    <ProtocolMeta>
                      {protocol.imagingType && (
                        <MetaItem>
                          <strong>Modalité:</strong> {protocol.imagingType}
                        </MetaItem>
                      )}
                      {protocol.anatomicalRegion && (
                        <MetaItem>
                          <strong>Région:</strong> {protocol.anatomicalRegion}
                        </MetaItem>
                      )}
                      {protocol.status && (
                        <MetaItem>
                          <strong>Statut:</strong> {protocol.status}
                        </MetaItem>
                      )}
                      {protocol.duration && (
                        <MetaItem>
                          <Clock size={12} />
                          <strong>{protocol.duration} min</strong>
                        </MetaItem>
                      )}
                    </ProtocolMeta>

                    {protocol.description && (
                      <Description>{protocol.description}</Description>
                    )}

                    <div onClick={(e) => e.stopPropagation()}>
                      <RatingStars
                        itemId={protocol._id}
                        itemType="protocol"
                        averageRating={protocol.averageRating || 0}
                        ratingsCount={protocol.ratingsCount || 0}
                        userRating={protocol.userRating || 0}
                        onRatingUpdate={(newRatingData) => handleRatingUpdate(protocol._id, newRatingData)}
                        size={14}
                        compact={true}
                      />
                    </div>

                    <StatsBottomContainer>
                      <StatsGroup>
                        <StatItem>
                          <Eye size={12} />
                          {protocol.stats?.views || 0} vues
                        </StatItem>
                        <StatItem>
                          <Copy size={12} />
                          {protocol.stats?.copies || 0} copies
                        </StatItem>
                      </StatsGroup>
                      
                      <ActionsContainer>
                        <ActionButton
                          onClick={(e) => handleViewClick(e, protocol._id)}
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </ActionButton>
                        
                        <ActionButton
                          onClick={(e) => handleCopy(e, protocol._id)}
                          title="Copier"
                        >
                          <Copy size={16} />
                        </ActionButton>
                      </ActionsContainer>
                    </StatsBottomContainer>
                  </CardContent>
                </ProtocolCard>
              );
            })}
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