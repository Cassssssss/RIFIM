// pages/ProtocolViewPage.js - VERSION CORRIGÉE avec bouton retour intelligent
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from '../utils/axiosConfig';
import { ArrowLeft, Copy, Edit, Clock, User, Eye, BarChart3 } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ==================== STYLES ====================

const PageContainer = styled.div`
  max-width: 1200px;
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
  padding-bottom: 1rem;
  border-bottom: 2px solid ${props => props.theme.borderLight};
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.text};
  margin: 0;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ActionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.className === 'primary' ? props.theme.primary : props.theme.card};
  color: ${props => props.className === 'primary' ? 'white' : props.theme.text};
  border: ${props => props.className === 'primary' ? 'none' : `1px solid ${props.theme.borderLight}`};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.className === 'primary' ? props.theme.primaryDark : props.theme.backgroundSecondary};
    transform: translateY(-1px);
  }
`;

const ActionButtonButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.className === 'primary' ? props.theme.primary : props.theme.card};
  color: ${props => props.className === 'primary' ? 'white' : props.theme.text};
  border: ${props => props.className === 'primary' ? 'none' : `1px solid ${props.theme.borderLight}`};
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.className === 'primary' ? props.theme.primaryDark : props.theme.backgroundSecondary};
    transform: translateY(-1px);
  }
`;

const ContentContainer = styled.div`
  display: grid;
  gap: 2rem;
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const MetaItem = styled.div`
  background-color: ${props => props.theme.card};
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.borderLight};
`;

const MetaLabel = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  margin-bottom: 0.5rem;
`;

const MetaValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${props => {
    switch (props.status) {
      case 'VALIDÉ': return '#dcfce7';
      case 'BROUILLON': return '#fef3c7';
      case 'EN_REVISION': return '#dbeafe';
      default: return '#f3f4f6';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'VALIDÉ': return '#166534';
      case 'BROUILLON': return '#92400e';
      case 'EN_REVISION': return '#1e40af';
      default: return '#374151';
    }
  }};
`;

const ContentSection = styled.div`
  background-color: ${props => props.theme.card};
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.borderLight};
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SectionContent = styled.div`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const SequencesContainer = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const SequenceCard = styled.div`
  background-color: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.borderLight};
  border-radius: 8px;
  padding: 1.5rem;
`;

const SequenceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const SequenceNumber = styled.div`
  background-color: ${props => props.theme.primary};
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
`;

const SequenceName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  margin: 0;
  flex: 1;
`;

const ParametersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ParameterItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background-color: ${props => props.theme.card};
  border-radius: 6px;
  border: 1px solid ${props => props.theme.borderLight};
`;

const ParameterLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

// ==================== COMPOSANT PRINCIPAL ====================

function ProtocolViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  
  // ✅ NOUVEAU : Détecter d'où vient l'utilisateur pour le bouton retour intelligent
  const [returnPath, setReturnPath] = useState('/protocols/public');

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/protocols/${id}`);
        setProtocol(response.data);
        
        // Récupérer l'ID de l'utilisateur connecté depuis le token ou localStorage
        const token = localStorage.getItem('token');
        if (token) {
          // Décoder le token pour récupérer l'ID utilisateur (simple décodage JWT)
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setCurrentUser(payload.userId);
            
            // ✅ CORRECTION : Déterminer le chemin de retour intelligent
            const isOwner = response.data.user && 
              (response.data.user._id === payload.userId || response.data.user === payload.userId);
            
            if (isOwner) {
              // Si l'utilisateur est propriétaire, retourner vers ses protocoles personnels
              setReturnPath('/protocols/personal');
            } else {
              // Sinon retourner vers les protocoles publics
              setReturnPath('/protocols/public');
            }
          } catch (e) {
            console.error('Erreur décodage token:', e);
            setReturnPath('/protocols/public');
          }
        } else {
          setReturnPath('/protocols/public');
        }
      } catch (err) {
        console.error('Erreur lors du chargement du protocole:', err);
        setError('Erreur lors du chargement du protocole');
      } finally {
        setLoading(false);
      }
    };

    fetchProtocol();
  }, [id]);

  const handleCopy = async () => {
    try {
      await axios.post(`/protocols/${id}/copy`);
      alert('Protocole copié dans vos protocoles personnels !');
      navigate('/protocols/personal');
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
      setError('Erreur lors de la copie du protocole');
    }
  };

  // NOUVEAU : Vérifier si l'utilisateur actuel est le propriétaire du protocole
  const isOwner = protocol && currentUser && protocol.user && 
    (protocol.user._id === currentUser || protocol.user === currentUser);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!protocol) return <ErrorMessage message="Protocole non trouvé" />;

  return (
    <PageContainer>
      <Header>
        <PageTitle>{protocol.title}</PageTitle>
        <ActionButtons>
          {/* ✅ CORRECTION : Bouton retour intelligent */}
          <ActionButton to={returnPath}>
            <ArrowLeft size={16} />
            Retour
          </ActionButton>
          <ActionButtonButton onClick={handleCopy}>
            <Copy size={16} />
            Copier
          </ActionButtonButton>
          {/* MODIFICATION : Afficher le bouton Modifier SEULEMENT si l'utilisateur est propriétaire */}
          {isOwner && (
            <ActionButton to={`/protocols/edit/${protocol._id}`} className="primary">
              <Edit size={16} />
              Modifier
            </ActionButton>
          )}
        </ActionButtons>
      </Header>

      <ContentContainer>
        {/* Métadonnées du protocole */}
        <MetaInfo>
          <MetaItem>
            <MetaLabel>Type d'imagerie</MetaLabel>
            <MetaValue>{protocol.imagingType}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Région anatomique</MetaLabel>
            <MetaValue>{protocol.anatomicalRegion}</MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Statut</MetaLabel>
            <MetaValue>
              <StatusBadge status={protocol.status}>
                {protocol.status}
              </StatusBadge>
            </MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Durée estimée</MetaLabel>
            <MetaValue>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={16} />
                {protocol.estimatedDuration || 'Non spécifiée'}
              </div>
            </MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Créé par</MetaLabel>
            <MetaValue>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <User size={16} />
                {protocol.user?.username || 'Utilisateur inconnu'}
              </div>
            </MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Statistiques</MetaLabel>
            <MetaValue>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={16} />
                {protocol.views || 0} vues • {protocol.copies || 0} copies
              </div>
            </MetaValue>
          </MetaItem>
        </MetaInfo>

        {/* Description */}
        {protocol.description && (
          <ContentSection>
            <SectionTitle>
              <BarChart3 size={20} />
              Description
            </SectionTitle>
            <SectionContent>{protocol.description}</SectionContent>
          </ContentSection>
        )}

        {/* Indication clinique */}
        {protocol.indication && (
          <ContentSection>
            <SectionTitle>
              🎯 Indication Clinique
            </SectionTitle>
            <SectionContent>{protocol.indication}</SectionContent>
          </ContentSection>
        )}

        {/* Séquences d'acquisition */}
        {protocol.sequences && protocol.sequences.length > 0 && (
          <ContentSection>
            <SectionTitle>
              🧲 Séquences d'Acquisition
            </SectionTitle>
            <SequencesContainer>
              {protocol.sequences.map((sequence, index) => (
                <SequenceCard key={index}>
                  <SequenceHeader>
                    <SequenceNumber>{index + 1}</SequenceNumber>
                    <SequenceName>{sequence.name || `Séquence ${index + 1}`}</SequenceName>
                  </SequenceHeader>
                  
                  {sequence.description && (
                    <SectionContent style={{ marginBottom: '1rem' }}>
                      {sequence.description}
                    </SectionContent>
                  )}

                  {sequence.parameters && Object.keys(sequence.parameters).length > 0 && (
                    <>
                      <h5 style={{ margin: '1rem 0 0.5rem 0', fontWeight: 600 }}>Paramètres techniques :</h5>
                      <ParametersGrid>
                        {Object.entries(sequence.parameters).map(([key, value]) => (
                          <ParameterItem key={key}>
                            <ParameterLabel>{key}</ParameterLabel>
                            <span style={{ fontWeight: 600 }}>{value}</span>
                          </ParameterItem>
                        ))}
                      </ParametersGrid>
                    </>
                  )}

                  {sequence.justification && (
                    <>
                      <h5 style={{ margin: '1rem 0 0.5rem 0', fontWeight: 600 }}>Justification :</h5>
                      <SectionContent>{sequence.justification}</SectionContent>
                    </>
                  )}
                </SequenceCard>
              ))}
            </SequencesContainer>
          </ContentSection>
        )}

        {/* Conseils de réalisation */}
        {protocol.realizationTips && (
          <ContentSection>
            <SectionTitle>
              💡 Conseils de Réalisation
            </SectionTitle>
            <SectionContent>{protocol.realizationTips}</SectionContent>
          </ContentSection>
        )}

        {/* Critères de qualité */}
        {protocol.qualityCriteria && (
          <ContentSection>
            <SectionTitle>
              ✅ Critères de Qualité
            </SectionTitle>
            <SectionContent>{protocol.qualityCriteria}</SectionContent>
          </ContentSection>
        )}

        {/* Remarques */}
        {protocol.notes && (
          <ContentSection>
            <SectionTitle>
              📝 Remarques
            </SectionTitle>
            <SectionContent>{protocol.notes}</SectionContent>
          </ContentSection>
        )}
      </ContentContainer>
    </PageContainer>
  );
}

export default ProtocolViewPage;