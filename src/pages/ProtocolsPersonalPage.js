// ProtocolsPersonalPage.js - VERSION PLEINE LARGEUR
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { Plus, Search, Filter, Edit, Copy, Trash2, Eye, EyeOff, Clock, FileText, Users, Star } from 'lucide-react';

// ==================== STYLED COMPONENTS PLEINE LARGEUR ====================

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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    align-items: stretch;
  }
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
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-align: center;  /* Toujours centré */
  width: 100%;  /* Prend toute la largeur */

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

const CreateButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px ${props => props.theme.primary}40;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.primary}60;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

// Section des filtres centrée
const FiltersSection = styled.div`
  max-width: 1200px;
  margin: 0 auto 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 12px;
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
  justify-content: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FilterSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 200px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

// Grille personnalisée pleine largeur
const ProtocolsGrid = styled.div`
  display: grid;
  width: 100%;
  gap: 1rem;
  margin: 2rem 0;
  padding: 0;

  /* Configuration responsive des colonnes */
  @media (min-width: 2560px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.2rem;
  }

  @media (min-width: 1920px) and (max-width: 2559px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.1rem;
  }

  @media (min-width: 1600px) and (max-width: 1919px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
  }

  @media (min-width: 1400px) and (max-width: 1599px) {
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 1rem;
  }

  @media (min-width: 1200px) and (max-width: 1399px) {
    grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
    gap: 1rem;
  }

  @media (min-width: 1024px) and (max-width: 1199px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1rem;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 0.9rem;
  }

  @media (max-width: 767px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  /* Fallback général */
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
`;

const ProtocolCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
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
          color: white;
        `;
      case 'En révision':
        return `
          background-color: ${props.theme.warning};
          color: white;
        `;
      default:
        return `
          background-color: ${props.theme.textSecondary};
          color: white;
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
  color: white;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const CardMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary || props.theme.background};
  border-radius: 8px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
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
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  border-top: 1px solid ${props => props.theme.border};
  padding-top: 1rem;
`;

const ViewButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primaryDark || props.theme.secondary};
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  background-color: ${props => {
    if (props.variant === 'danger') return '#ef4444';
    if (props.variant === 'secondary') return props.theme.backgroundSecondary;
    return props.theme.card;
  }};
  color: ${props => props.variant === 'danger' ? 'white' : props.theme.text};
  border: 1px solid ${props => props.variant === 'danger' ? 'transparent' : props.theme.border};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background-color: ${props => {
      if (props.variant === 'danger') return '#dc2626';
      return props.theme.hover;
    }};
  }

  svg {
    width: 16px;
    height: 16px;
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
  border-radius: 8px;
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

  const imagingTypes = ['IRM', 'Scanner', 'Échographie', 'Radiographie', 'Mammographie', 'Médecine Nucléaire', 'Angiographie'];
  
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
        limit: '20', // Augmenté pour afficher plus de protocoles
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
    setCurrentPage(1);
  }, [searchTerm, filterType, filterRegion]);

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
        <Title>📋 Mes Protocoles</Title>
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
          <ProtocolsGrid>
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