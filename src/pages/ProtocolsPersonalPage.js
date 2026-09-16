import { control, primaryControl, quietControl } from '../components/shared/designSystem';
import { pageHeading, pageLayout, pageTitle } from '../components/shared/designSystem';
// ProtocolsPersonalPage.js - VERSION PLEINE LARGEUR
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { Plus, Search, Filter, Edit, Copy, Trash2, Eye, EyeOff, Clock, FileText, Users, Star } from 'lucide-react';

// ==================== STYLED COMPONENTS PLEINE LARGEUR ====================

const PageContainer = styled.div`
  ${pageLayout}
`;

const Header = styled.div`
  ${pageHeading}
`;

const HeaderActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  ${pageTitle}
`;

const CreateButton = styled.button`
  ${primaryControl}
`;

// Section des filtres centrée
const FiltersSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.75rem;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.radii.card};
  font-size: 1rem;
  background-color: ${props => props.theme.card};
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

const SearchIcon = styled(Search)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.textSecondary};
  width: 20px;
  height: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterSelect = styled.select`
  ${control}
  min-width: 160px;
`;

// Grille personnalisée pleine largeur
const ProtocolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 1.25rem;
  margin-bottom: 2rem;
  @media (min-width: 769px) {
    ${props => props.$columns ? `grid-template-columns: repeat(${props.$columns}, minmax(0, 1fr));` : ''}
  }
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ProtocolCard = styled.div`
  min-width: 0;
  container-type: inline-size;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.radii.card};
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;


  &:hover {
    transform: none;
    box-shadow: none;
    border-color: ${props => props.theme.primary};
  }

  @media (max-width: 768px) {
    padding: 1rem;
    
    &:hover {
      transform: none;
    }
  }
`;

const CardHeader = styled.div`
  margin-bottom: 1rem;
`;

const ProtocolTitle = styled.h3`
  overflow-wrap: anywhere;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'Validé':
        return `
          background-color: ${props.theme.success};
          color: ${props.theme.buttonText};
        `;
      case 'En révision':
        return `
          background-color: ${props.theme.warning};
          color: ${props.theme.buttonText};
        `;
      default:
        return `
          background-color: ${props.theme.textSecondary};
          color: ${props.theme.buttonText};
        `;
    }
  }}
`;

const VisibilityBadge = styled.span`
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background-color: ${props => props.isPublic ? props.theme.primary : props.theme.textSecondary};
  color: ${props => props.theme.buttonText};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1rem;
  font-size: 0.75rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.theme.textSecondary};
  font-size: 0.85rem;

  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.primary};
  }
`;

const ProtocolDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardActions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem;
  justify-content: space-between;
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 1rem;
`;

const ViewButton = styled.button`
  ${primaryControl}
  grid-column: 1 / -1;
`;

const ActionButton = styled.button`
  ${quietControl}
  color: ${props => props.variant === 'danger' ? props.theme.error : props.theme.textSecondary};
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
    margin-bottom: 2rem;
  }
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
  padding: 2rem;
  color: ${props => props.theme.error};
  background-color: ${props => props.theme.errorLight};
  border-radius: ${props => props.theme.radii.md};
  border: 1px solid ${props => props.theme.error};
  max-width: 600px;
  margin: 2rem auto;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 3rem;
`;

const PaginationButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.isActive ? props.theme.primary : props.theme.card};
  color: ${props => props.isActive ? props.theme.buttonText : props.theme.text};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: ${props => props.theme.primary};
    color: ${props => props.theme.buttonText};
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
  const [itemsPerPage, setItemsPerPage] = useState(24);
  const [columns, setColumns] = useState(4);

  const imagingTypes =['IRM', 'Scanner', 'Échographie', 'Radiographie', 'Mammographie', 'Médecine Nucléaire', 'Angiographie'];
  
  const anatomicalRegions = [
    'Céphalée',
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
    'Autre'
  ];

  const fetchProtocols = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
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
  }, [currentPage, itemsPerPage, searchTerm, filterType, filterRegion]);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterRegion, itemsPerPage]);

  const handleCardClick = (protocolId) => {
    navigate(`/protocols/view/${protocolId}`);
  };

  const handleDelete = async (e, protocolId) => {
    e.stopPropagation();
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce protocole ?')) {
      try {
        await axios.delete(`/protocols/${protocolId}`);
        setProtocols(prevProtocols => prevProtocols.filter(p => p._id !== protocolId));
      } catch (err) {
        console.error('Erreur lors de la suppression:', err);
        alert('Erreur lors de la suppression du protocole');
      }
    }
  };

  const handleEdit = (e, protocolId) => {
    e.stopPropagation();
    navigate(`/protocols/edit/${protocolId}`);
  };

  const handleCopy = async (e, protocolId) => {
    e.stopPropagation();
    try {
      const response = await axios.post(`/protocols/${protocolId}/copy`);
      setProtocols(prevProtocols => [response.data, ...prevProtocols]);
      alert('Protocole dupliqué avec succès !');
    } catch (err) {
      console.error('Erreur lors de la duplication:', err);
      alert('Erreur lors de la duplication du protocole');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) return <LoadingContainer>Chargement des protocoles...</LoadingContainer>;
  if (error) return <ErrorContainer>{error}</ErrorContainer>;

  return (
    <PageContainer>
      <Header>
        <Title>Mes protocoles</Title>
        <HeaderActions>
          <CreateButton onClick={() => navigate('/protocols/create')}>
            <Plus size={20} />
            Nouveau Protocole
          </CreateButton>
        </HeaderActions>
      </Header>

      {/* SECTION DE RECHERCHE ET FILTRES CENTRÉE */}
      <FiltersSection>
        <SearchBar>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Rechercher un protocole..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>

        <FilterContainer>
          <FilterSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">📊 Tous les types</option>
            {imagingTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
          >
            <option value="">🏥 Toutes les régions</option>
            {anatomicalRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </FilterSelect>

          <FilterSelect
            value={columns}
            onChange={(e) => setColumns(Number(e.target.value))}
          >
            {[2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} colonnes</option>
            ))}
          </FilterSelect>
        </FilterContainer>
      </FiltersSection>

      {/* CONTENU PRINCIPAL */}
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
          {/* GRILLE PLEINE LARGEUR */}
          <ProtocolsGrid $columns={columns}>
            {protocols.map((protocol) => (
              <ProtocolCard 
                key={protocol._id} 
                onClick={() => handleCardClick(protocol._id)}
              >
                <CardHeader>
                  <ProtocolTitle>{protocol.title}</ProtocolTitle>
                  <BadgeContainer>
                    <StatusBadge status={protocol.status}>
                      {protocol.status}
                    </StatusBadge>
                    <VisibilityBadge isPublic={protocol.public}>
                      {protocol.public ? <Eye size={12} /> : <EyeOff size={12} />}
                      {protocol.public ? 'Public' : 'Privé'}
                    </VisibilityBadge>
                  </BadgeContainer>
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

          {/* PAGINATION */}
          {totalPages > 1 && (
            <PaginationContainer>
              <PaginationButton
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Précédent
              </PaginationButton>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <PaginationButton
                    key={pageNum}
                    isActive={currentPage === pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </PaginationButton>
                );
              })}
              
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