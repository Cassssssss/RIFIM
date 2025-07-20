import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import RatingStars from '../components/RatingStars';

// ==================== STYLES COMPOSANTS ====================

// MODIFICATION : Retirer max-width et utiliser plus d'espace comme les autres pages
const PageContainer = styled.div`
  padding: 2rem 3rem;
  width: 100%;
  min-height: calc(100vh - 60px);

  @media (max-width: 1200px) {
    padding: 2rem;
  }

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
  background-color: ${props => props.isActive ? props.theme.primary : props.theme.background};
  color: ${props => props.isActive ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 0.5rem;

  &:hover {
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.isActive ? props.theme.primary : props.theme.cardHover};
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.borderLight};

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.primary};
`;

const StatLabel = styled.div`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
`;

// MODIFICATION : Grille plus large et responsive améliorée
const ProtocolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProtocolCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    border-color: ${props => props.theme.primary};
    background-color: ${props => props.theme.cardHover};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  }
`;

const CardContent = styled.div`
  position: relative;
  z-index: 1;
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

// MODIFICATION : Section de notation plus compacte
const RatingSection = styled.div`
  padding: 0.5rem 0;
  border-top: 1px solid ${props => props.theme.borderLight};
  border-bottom: 1px solid ${props => props.theme.borderLight};
  margin: 0.75rem 0;
`;

const StatsBottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`;

const StatBottomItem = styled.span`
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

  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
    border-color: ${props => props.theme.primary};
    transform: scale(1.1);
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
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

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

  // Options de filtre
  const modalityOptions = [
    { value: '', label: 'Toutes les modalités' },
    { value: 'IRM', label: 'IRM' },
    { value: 'TDM', label: 'TDM' },
    { value: 'Rx', label: 'Radiographie' },
    { value: 'Echo', label: 'Échographie' }
  ];

  const specialtyOptions = [
    { value: '', label: 'Toutes les spécialités' },
    { value: 'Cardiovasc', label: 'Cardiovasculaire' },
    { value: 'Dig', label: 'Digestif' },
    { value: 'Neuro', label: 'Neurologie' },
    { value: 'ORL', label: 'ORL' },
    { value: 'Ostéo', label: 'Ostéo-articulaire' },
    { value: 'Pedia', label: 'Pédiatrie' },
    { value: 'Pelvis', label: 'Pelvis' },
    { value: 'Séno', label: 'Sénologie' },
    { value: 'Thorax', label: 'Thorax' },
    { value: 'Uro', label: 'Urologie' }
  ];

  return (
    <PageContainer>
      <PageTitle>Protocoles Publics</PageTitle>

      {/* Statistiques */}
      <StatsContainer>
        <StatItem>
          <StatNumber>{stats.total}</StatNumber>
          <StatLabel>Protocoles disponibles</StatLabel>
        </StatItem>
        <StatItem>
          <StatNumber>{stats.authors}</StatNumber>
          <StatLabel>Auteurs contributeurs</StatLabel>
        </StatItem>
      </StatsContainer>

      {/* Barre d'actions */}
      <ActionBar>
        <SearchContainer>
          <SearchWrapper>
            <SearchIconWrapper>
              <SearchIcon size={20} />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="Rechercher un protocole..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </SearchWrapper>

          <FilterSelect value={modalityFilter} onChange={handleModalityChange}>
            {modalityOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect value={specialtyFilter} onChange={handleSpecialtyChange}>
            {specialtyOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FilterSelect>
        </SearchContainer>

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
      </ActionBar>

      {/* Contenu */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : protocols.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-secondary)' }}>
          <h3>Aucun protocole trouvé</h3>
          <p>Essayez de modifier vos critères de recherche.</p>
        </div>
      ) : (
        <>
          <ProtocolsGrid>
            {protocols.map(protocol => (
              <ProtocolCard key={protocol._id} onClick={() => handleProtocolClick(protocol._id)}>
                <CardContent>
                  <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <ProtocolTitle>{protocol.title}</ProtocolTitle>
                    {protocol.isPopular && (
                      <PopularityBadge>
                        <ThumbsUp size={12} />
                        Populaire
                      </PopularityBadge>
                    )}
                  </div>

                  <AuthorInfo>
                    <User size={14} />
                    Par {protocol.author?.nom || 'Auteur inconnu'}
                  </AuthorInfo>

                  <ProtocolMeta>
                    {protocol.modality && (
                      <MetaItem>
                        🔬 {protocol.modality}
                      </MetaItem>
                    )}
                    {protocol.specialty && (
                      <MetaItem>
                        🏥 {protocol.specialty}
                      </MetaItem>
                    )}
                    {protocol.estimatedTime && (
                      <MetaItem>
                        <Clock size={14} />
                        {protocol.estimatedTime} min
                      </MetaItem>
                    )}
                  </ProtocolMeta>
                  
                  <ProtocolDescription>
                    {protocol.description || protocol.indication}
                  </ProtocolDescription>

                  {/* MODIFICATION : Section de notation optimisée en mode compact */}
                  <RatingSection>
                    <div onClick={(e) => e.stopPropagation()}>
                      <RatingStars
                        itemId={protocol._id}
                        itemType="protocol"
                        averageRating={protocol.averageRating}
                        ratingsCount={protocol.ratingsCount}
                        userRating={protocol.userRating}
                        onRatingUpdate={(newRatingData) => handleRatingUpdate(protocol._id, newRatingData)}
                        size={14}
                        compact={true}
                      />
                    </div>
                  </RatingSection>
                  
                  <StatsBottomContainer>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <StatBottomItem>
                        <Eye size={14} />
                        {Number(protocol.views) || 0} vues
                      </StatBottomItem>
                      <StatBottomItem>
                        <Copy size={14} />
                        {Number(protocol.copies) || 0} copies
                      </StatBottomItem>
                    </div>
                    
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