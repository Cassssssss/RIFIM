import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Search, Filter, Plus, Eye, Edit, Trash2, Copy, Globe, Lock, Star, Clock } from 'lucide-react';
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
    content: '🔒';
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

const CreateButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.theme.primary}40;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.primary}60;
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
  cursor: pointer;

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
  gap: 1rem;
`;

const ProtocolTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
  line-height: 1.4;
  flex: 1;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
  
  ${props => {
    switch (props.status) {
      case 'Validé':
        return `
          background-color: #dcfce7;
          color: #15803d;
        `;
      case 'En révision':
        return `
          background-color: #fef3c7;
          color: #d97706;
        `;
      default:
        return `
          background-color: ${props.theme.backgroundSecondary};
          color: ${props.theme.textSecondary};
        `;
    }
  }}
`;

const ProtocolMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  
  span {
    font-size: 1rem;
  }
`;

const ProtocolDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const VisibilityToggle = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  margin-bottom: 1rem;

  &:hover {
    background-color: ${props => props.theme.backgroundSecondary};
    border-color: ${props => props.theme.primary};
    color: ${props => props.theme.primary};
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
    z-index: 10;
  }

  &.danger:hover {
    background-color: ${props => props.theme.error || '#ef4444'};
    border-color: ${props => props.theme.error || '#ef4444'};
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

function ProtocolsPersonalPage() {
  const navigate = useNavigate();
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Options pour les filtres
  const imagingTypes = ['IRM', 'Scanner', 'Échographie', 'Radiographie', 'Mammographie', 'Médecine Nucléaire', 'Angiographie'];
  const anatomicalRegions = ['Cerveau', 'Thorax', 'Abdomen', 'Pelvis', 'Rachis', 'Membre Supérieur', 'Membre Inférieur', 'Vaisseaux', 'Cœur', 'Sein', 'Uro, Pédiatrie, ORL'];

  const fetchProtocols = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        search: searchTerm,
        imagingType: filterType,
        anatomicalRegion: filterRegion
      });

      const response = await axios.get(`/protocols/my?${params}`);
      setProtocols(response.data.protocols || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (err) {
      console.error('Erreur lors du chargement des protocoles:', err);
      setError('Erreur lors du chargement des protocoles');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, filterType, filterRegion]);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  useEffect(() => {
    setCurrentPage(1); // Reset page when filters change
  }, [searchTerm, filterType, filterRegion]);

  // NOUVEAU : Gérer le clic sur la carte pour naviguer vers la vue détaillée
  const handleCardClick = (protocolId) => {
    navigate(`/protocols/view/${protocolId}`);
  };

  const handleDelete = async (e, protocolId) => {
    e.stopPropagation(); // Empêcher la navigation quand on clique sur supprimer
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce protocole ?')) {
      try {
        await axios.delete(`/protocols/${protocolId}`);
        fetchProtocols();
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        setError('Erreur lors de la suppression du protocole');
      }
    }
  };

  const handleCopy = async (e, protocolId) => {
    e.stopPropagation(); // Empêcher la navigation quand on clique sur copier
    try {
      await axios.post(`/protocols/${protocolId}/copy`);
      alert('Protocole copié avec succès !');
      fetchProtocols();
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      setError('Erreur lors de la copie du protocole');
    }
  };

  const handleToggleVisibility = async (e, protocolId, isPublic) => {
    e.stopPropagation(); // Empêcher la navigation quand on clique sur la visibilité
    try {
      await axios.patch(`/protocols/${protocolId}`, {
        public: !isPublic
      });
      fetchProtocols();
    } catch (err) {
      console.error('Erreur lors de la modification de la visibilité:', err);
      setError('Erreur lors de la modification de la visibilité');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <PageContainer>
      <PageTitle>Mes Protocoles</PageTitle>
      
      <ActionBar>
        <SearchContainer>
          <SearchWrapper>
            <SearchIcon size={20} />
            <SearchInput
              type="text"
              placeholder="Rechercher un protocole..."
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
        
        <CreateButton to="/protocols/create">
          <Plus size={20} />
          Créer un Protocole
        </CreateButton>
      </ActionBar>

      {protocols.length === 0 ? (
        <EmptyState>
          <h3>Aucun protocole trouvé</h3>
          <p>
            {searchTerm || filterType || filterRegion 
              ? "Aucun protocole ne correspond à vos critères de recherche."
              : "Vous n'avez pas encore créé de protocole. Commencez dès maintenant !"
            }
          </p>
          <CreateButton to="/protocols/create">
            <Plus size={20} />
            Créer votre premier protocole
          </CreateButton>
        </EmptyState>
      ) : (
        <>
          <ProtocolsGrid>
            {protocols.map((protocol) => (
              <ProtocolCard 
                key={protocol._id}
                onClick={() => handleCardClick(protocol._id)}
              >
                <ProtocolHeader>
                  <ProtocolTitle>{protocol.title}</ProtocolTitle>
                  <StatusBadge status={protocol.status}>
                    {protocol.status}
                  </StatusBadge>
                </ProtocolHeader>
                
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
                </ProtocolMeta>
                
                <ProtocolDescription>
                  {protocol.description || protocol.indication}
                </ProtocolDescription>
                
                <VisibilityToggle
                  onClick={(e) => handleToggleVisibility(e, protocol._id, protocol.public)}
                >
                  {protocol.public ? <Globe size={16} /> : <Lock size={16} />}
                  {protocol.public ? 'Public' : 'Privé'}
                </VisibilityToggle>
                
                <ActionsContainer>
                  <ActionButton
                    as={Link}
                    to={`/protocols/view/${protocol._id}`}
                    title="Voir"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Eye size={16} />
                  </ActionButton>
                  
                  <ActionButton
                    as={Link}
                    to={`/protocols/edit/${protocol._id}`}
                    title="Modifier"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Edit size={16} />
                  </ActionButton>
                  
                  <ActionButton
                    onClick={(e) => handleCopy(e, protocol._id)}
                    title="Copier"
                  >
                    <Copy size={16} />
                  </ActionButton>
                  
                  <ActionButton
                    onClick={(e) => handleDelete(e, protocol._id)}
                    className="danger"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </ActionButton>
                </ActionsContainer>
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

export default ProtocolsPersonalPage;