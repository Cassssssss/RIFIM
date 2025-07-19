import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { ArrowLeft, Edit, Copy, Clock, User, Star, AlertCircle } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ==================== STYLED COMPONENTS ====================

const PageContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, ${props => props.theme.background} 0%, ${props => props.theme.backgroundSecondary || props.theme.card} 100%);
  color: ${props => props.theme.text};
  min-height: calc(100vh - 60px);

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
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

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  text-decoration: none;

  &:hover {
    background-color: ${props => props.theme.backgroundSecondary};
    transform: translateY(-1px);
  }

  &.primary {
    background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
    color: white;
    border: none;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px ${props => props.theme.primary}40;
    }
  }
`;

const ContentContainer = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
`;

const MetaInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
  border-radius: 12px;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.span`
  font-size: 0.875rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

const MetaValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  margin: 2rem 0 1rem 0;
  color: ${props => props.theme.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.border};
`;

const Description = styled.p`
  line-height: 1.6;
  color: ${props => props.theme.text};
  margin-bottom: 1.5rem;
`;

const SequenceCard = styled.div`
  background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const SequenceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SequenceNumber = styled.div`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
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
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  flex: 1;
`;

const SequenceDuration = styled.span`
  padding: 0.25rem 0.75rem;
  background-color: ${props => props.theme.primary}20;
  color: ${props => props.theme.primary};
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ParametersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background-color: ${props => props.theme.card};
  border-radius: 8px;
`;

const ParameterItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ParameterLabel = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  font-weight: 500;
`;

const ParameterValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'Validé':
        return `
          background-color: #10b981;
          color: white;
        `;
      case 'En révision':
        return `
          background-color: #f59e0b;
          color: white;
        `;
      default: // Brouillon
        return `
          background-color: ${props.theme.textSecondary};
          color: white;
        `;
    }
  }}
`;

// ==================== COMPOSANT PRINCIPAL ====================

function ProtocolViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProtocol = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/protocols/${id}`);
        setProtocol(response.data);
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
      alert('Erreur lors de la copie du protocole');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!protocol) return <ErrorMessage message="Protocole non trouvé" />;

  return (
    <PageContainer>
      <Header>
        <PageTitle>{protocol.title}</PageTitle>
        
        <ActionButtons>
          <ActionButton onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Retour
          </ActionButton>
          
          {/* Afficher le bouton modifier seulement si c'est notre protocole */}
          <ActionButton 
            as={Link}
            to={`/protocols/edit/${protocol._id}`}
            className="primary"
          >
            <Edit size={16} />
            Modifier
          </ActionButton>
          
          <ActionButton onClick={handleCopy}>
            <Copy size={16} />
            Copier
          </ActionButton>
        </ActionButtons>
      </Header>

      <ContentContainer>
        {/* Informations générales */}
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
            <MetaLabel>Complexité</MetaLabel>
            <MetaValue>
              {Array.from({ length: protocol.complexity || 1 }, (_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </MetaValue>
          </MetaItem>
          <MetaItem>
            <MetaLabel>Statut</MetaLabel>
            <MetaValue>
              <StatusBadge status={protocol.status}>
                {protocol.status}
              </StatusBadge>
            </MetaValue>
          </MetaItem>
          {protocol.estimatedDuration && (
            <MetaItem>
              <MetaLabel>Durée estimée</MetaLabel>
              <MetaValue>
                <Clock size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {protocol.estimatedDuration}
              </MetaValue>
            </MetaItem>
          )}
          {protocol.user && (
            <MetaItem>
              <MetaLabel>Créé par</MetaLabel>
              <MetaValue>
                <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                {protocol.user.username || 'Utilisateur'}
              </MetaValue>
            </MetaItem>
          )}
        </MetaInfo>

        {/* Indication clinique */}
        <SectionTitle>
          🎯 Indication Clinique
        </SectionTitle>
        <Description>{protocol.indication}</Description>

        {/* Description */}
        {protocol.description && (
          <>
            <SectionTitle>
              📋 Description
            </SectionTitle>
            <Description>{protocol.description}</Description>
          </>
        )}

        {/* Séquences */}
        {protocol.sequences && protocol.sequences.length > 0 && (
          <>
            <SectionTitle>
              🔄 Séquences d'Acquisition
            </SectionTitle>
            {protocol.sequences.map((sequence, index) => (
              <SequenceCard key={sequence.id || index}>
                <SequenceHeader>
                  <SequenceNumber>{index + 1}</SequenceNumber>
                  <SequenceName>{sequence.name}</SequenceName>
                  {sequence.duration && (
                    <SequenceDuration>{sequence.duration}</SequenceDuration>
                  )}
                </SequenceHeader>
                
                {sequence.description && (
                  <Description>{sequence.description}</Description>
                )}
                
                {sequence.justification && (
                  <div style={{ marginBottom: '1rem' }}>
                    <strong>Justification :</strong> {sequence.justification}
                  </div>
                )}
                
                {sequence.technicalParameters && Object.keys(sequence.technicalParameters).length > 0 && (
                  <ParametersGrid>
                    {Object.entries(sequence.technicalParameters).map(([key, value]) => (
                      value && (
                        <ParameterItem key={key}>
                          <ParameterLabel>{key}</ParameterLabel>
                          <ParameterValue>{value}</ParameterValue>
                        </ParameterItem>
                      )
                    ))}
                  </ParametersGrid>
                )}
              </SequenceCard>
            ))}
          </>
        )}

        {/* Paramètres d'acquisition */}
        {protocol.acquisitionParameters && (
          <>
            <SectionTitle>
              ⚙️ Paramètres d'Acquisition
            </SectionTitle>
            <MetaInfo>
              {protocol.acquisitionParameters.fieldStrength && (
                <MetaItem>
                  <MetaLabel>Force du champ</MetaLabel>
                  <MetaValue>{protocol.acquisitionParameters.fieldStrength}</MetaValue>
                </MetaItem>
              )}
              {protocol.acquisitionParameters.coil && (
                <MetaItem>
                  <MetaLabel>Antenne</MetaLabel>
                  <MetaValue>{protocol.acquisitionParameters.coil}</MetaValue>
                </MetaItem>
              )}
              {protocol.acquisitionParameters.position && (
                <MetaItem>
                  <MetaLabel>Position</MetaLabel>
                  <MetaValue>{protocol.acquisitionParameters.position}</MetaValue>
                </MetaItem>
              )}
            </MetaInfo>
            
            {protocol.acquisitionParameters.contrast?.used && (
              <>
                <h4>Produit de contraste</h4>
                <MetaInfo>
                  {protocol.acquisitionParameters.contrast.agent && (
                    <MetaItem>
                      <MetaLabel>Agent</MetaLabel>
                      <MetaValue>{protocol.acquisitionParameters.contrast.agent}</MetaValue>
                    </MetaItem>
                  )}
                  {protocol.acquisitionParameters.contrast.dose && (
                    <MetaItem>
                      <MetaLabel>Dosage</MetaLabel>
                      <MetaValue>{protocol.acquisitionParameters.contrast.dose}</MetaValue>
                    </MetaItem>
                  )}
                </MetaInfo>
                {protocol.acquisitionParameters.contrast.injectionProtocol && (
                  <Description>{protocol.acquisitionParameters.contrast.injectionProtocol}</Description>
                )}
              </>
            )}
            
            {protocol.acquisitionParameters.preparation && (
              <>
                <h4>Préparation du patient</h4>
                <Description>{protocol.acquisitionParameters.preparation}</Description>
              </>
            )}
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
}

export default ProtocolViewPage;