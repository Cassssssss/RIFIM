// ProtocolsPersonalPage.js - VERSION CORRIGÉE
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  Clock,
  Star,
  Users,
  FileText
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ==================== STYLED COMPONENTS ====================

const PageContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.theme.background};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CreateButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  font-size: 1rem;

  &:hover {
    background-color: ${props => props.theme.primaryHover};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }
`;

const FiltersContainer = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  align-items: end;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  color: ${props => props.theme.text};
  font-weight: 500;
  font-size: 0.9rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const ProtocolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ProtocolCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

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
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
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
  margin: 0;
  line-height: 1.3;
  flex: 1;
`;

const StatusBadge = styled.span`
  background-color: ${props => {
    switch(props.status) {
      case 'Validé': return props.theme.success;
      case 'En révision': return props.theme.warning;
      default: return props.theme.textSecondary;
    }
  }};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-left: 0.5rem;
`;

const VisibilityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: ${props => props.isPublic ? props.theme.success : props.theme.textSecondary};
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;
  font-weight: 500;

  svg {
    color: ${props => props.theme.primary};
    flex-shrink: 0;
  }
`;

const ProtocolDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${props => props.theme.border};
`;

const ActionButton = styled.button`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.secondary;
      case 'danger': return props.theme.error;
      default: return 'transparent';
    }
  }};
  color: ${props => props.variant === 'outline' ? props.theme.text : 'white'};
  border: ${props => props.variant === 'outline' ? `1px solid ${props.theme.border}` : 'none'};
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  min-width: 36px;
  height: 36px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const ViewButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  flex: 1;

  &:hover {
    background-color: ${props => props.theme.primaryHover};
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
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.isActive ? props.theme.primary : props.theme.card};
  color: ${props => props.isActive ? 'white' : props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
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

  // ✅ CORRECTION : Options corrigées pour correspondre au schéma MongoDB
  const imagingTypes = ['IRM', 'Scanner', 'Échographie', 'Radiographie', 'Mammographie', 'Médecine Nucléaire', 'Angiographie'];
  
  // ✅ CORRECTION CRITIQUE : Utiliser exactement les mêmes valeurs que dans Protocol.js
  const anatomicalRegions = [
    'Céphalée',           // ← AU LIEU DE "Cerveau"
    'Cervical', 
    'Thorax', 
    'Abdomen', 
    'Pelvis', 
    'Rachis', 
    'Membre Supérieur', 
    'Membre Inférieur', 
    'Vaisseaux', 
    'Cœur', 
    'Sein', 
    'Autre'              // ← AU LIEU DE "Uro, Pédiatrie, ORL"
  ];

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

  const handleEdit = (e, protocolId) => {
    e.stopPropagation(); // Empêcher la navigation quand on clique sur éditer
    navigate(`/protocols/edit/${protocolId}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <Header>
        <PageTitle>
          📋 Mes Protocoles
        </PageTitle>
        <CreateButton onClick={() => navigate('/protocols/create')}>
          <Plus size={20} />
          Nouveau Protocole
        </CreateButton>
      </Header>

      {error && <ErrorMessage message={error} />}

      {/* Filtres de recherche */}
      <FiltersContainer>
        <FiltersGrid>
          <FilterGroup>
            <FilterLabel>🔍 Recherche</FilterLabel>
            <SearchInput
              type="text"
              placeholder="Rechercher un protocole..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>📊 Type d'imagerie</FilterLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">Tous les types</option>
              {imagingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FilterGroup>
          
          <FilterGroup>
            <FilterLabel>🎯 Région anatomique</FilterLabel>
            <Select
              value={filterRegion}
              onChange={(e) => setFilterRegion(e.target.value)}
            >
              <option value="">Toutes les régions</option>
              {anatomicalRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </Select>
          </FilterGroup>
        </FiltersGrid>
      </FiltersContainer>

      {/* Grille des protocoles */}
      {protocols.length === 0 ? (
        <EmptyState>
          <h3>Aucun protocole trouvé</h3>
          <p>
            {searchTerm || filterType || filterRegion 
              ? "Aucun protocole ne correspond à vos critères de recherche."
              : "Vous n'avez pas encore créé de protocole."
            }
          </p>
          <CreateButton onClick={() => navigate('/protocols/create')}>
            <Plus size={20} />
            Créer mon premier protocole
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
                <CardHeader>
                  <div>
                    <ProtocolTitle>{protocol.title}</ProtocolTitle>
                    <StatusBadge status={protocol.status}>
                      {protocol.status}
                    </StatusBadge>
                    <VisibilityBadge isPublic={protocol.public}>
                      {protocol.public ? <Eye size={14} /> : <EyeOff size={14} />}
                      {protocol.public ? 'Public' : 'Privé'}
                    </VisibilityBadge>
                  </div>
                </CardHeader>

                <CardMeta>
                  <MetaItem>
                    <FileText />
                    <span>{protocol.imagingType}</span>
                  </MetaItem>
                  <MetaItem>
                    <Users />
                    <span>{protocol.anatomicalRegion}</span>
                  </MetaItem>
                  <MetaItem>
                    <Clock />
                    <span>{formatDate(protocol.updatedAt)}</span>
                  </MetaItem>
                  <MetaItem>
                    <Star />
                    <span>{protocol.sequences?.length || 0} séquences</span>
                  </MetaItem>
                </CardMeta>

                {protocol.description && (
                  <ProtocolDescription>
                    {protocol.description}
                  </ProtocolDescription>
                )}

                <CardActions>
                  <ViewButton onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(protocol._id);
                  }}>
                    <Eye size={16} />
                    Voir
                  </ViewButton>
                  
                  <ActionButton
                    variant="outline"
                    onClick={(e) => handleEdit(e, protocol._id)}
                    title="Modifier"
                  >
                    <Edit />
                  </ActionButton>
                  
                  <ActionButton
                    variant="secondary"
                    onClick={(e) => handleCopy(e, protocol._id)}
                    title="Dupliquer"
                  >
                    <Copy />
                  </ActionButton>
                  
                  <ActionButton
                    variant="danger"
                    onClick={(e) => handleDelete(e, protocol._id)}
                    title="Supprimer"
                  >
                    <Trash2 />
                  </ActionButton>
                </CardActions>
              </ProtocolCard>
            ))}
          </ProtocolsGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </PaginationButton>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationButton
                  key={i + 1}
                  isActive={currentPage === i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </PaginationButton>
              ))}
              
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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