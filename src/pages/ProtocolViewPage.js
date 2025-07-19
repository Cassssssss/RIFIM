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
  background-color: ${props => props.theme.background};
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

const ParameterValue = styled.span`
  font-weight: 600;
  color: ${props => props.theme.text};
`;

// StatusBadge CORRIGÉ avec les nouvelles couleurs du thème
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
          background-color: ${props.theme.success};
          color: white;
        `;
      case 'En révision':
        return `
          background-color: ${props.theme.warning};
          color: white;
        `;
      default: // Brouillon
        return `
          background-color: ${props.theme.statusDraft || props.theme.textSecondary};
          color: ${props.theme.statusDraftText || 'white'};
        `;
    }
  }}
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
  font-size: 1rem;
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
      setError('Erreur lors de la copie du protocole');
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
          <ActionButton as={Link} to="/protocols/personal">
            <ArrowLeft size={16} />
            Retour
          </ActionButton>
          <ActionButton onClick={handleCopy}>
            <Copy size={16} />
            Copier
          </ActionButton>
          <ActionButton as={Link} to={`/protocols/edit/${protocol._id}`} className="primary">
            <Edit size={16} />
            Modifier
          </ActionButton>
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
                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                      {sequence.duration}
                    </span>
                  )}
                </SequenceHeader>
                
                {sequence.description && (
                  <Description>{sequence.description}</Description>
                )}

                {/* Paramètres techniques */}
                {sequence.technicalParameters && Object.keys(sequence.technicalParameters).length > 0 && (
                  <>
                    <h5 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--color-text)' }}>
                      Paramètres techniques :
                    </h5>
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
                  </>
                )}

                {/* Justification */}
                {sequence.justification && (
                  <>
                    <h5 style={{ margin: '1rem 0 0.5rem 0', color: 'var(--color-text)' }}>
                      Justification :
                    </h5>
                    <Description>{sequence.justification}</Description>
                  </>
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
            <ParametersGrid>
              {protocol.acquisitionParameters.fieldStrength && (
                <ParameterItem>
                  <ParameterLabel>Intensité du champ</ParameterLabel>
                  <ParameterValue>{protocol.acquisitionParameters.fieldStrength}</ParameterValue>
                </ParameterItem>
              )}
              {protocol.acquisitionParameters.coil && (
                <ParameterItem>
                  <ParameterLabel>Antenne</ParameterLabel>
                  <ParameterValue>{protocol.acquisitionParameters.coil}</ParameterValue>
                </ParameterItem>
              )}
              {protocol.acquisitionParameters.position && (
                <ParameterItem>
                  <ParameterLabel>Position</ParameterLabel>
                  <ParameterValue>{protocol.acquisitionParameters.position}</ParameterValue>
                </ParameterItem>
              )}
            </ParametersGrid>

            {/* Produit de contraste */}
            {protocol.acquisitionParameters.contrast?.used && (
              <>
                <h4 style={{ margin: '1.5rem 0 1rem 0', color: 'var(--color-primary)' }}>
                  Produit de contraste :
                </h4>
                <ParametersGrid>
                  {protocol.acquisitionParameters.contrast.agent && (
                    <ParameterItem>
                      <ParameterLabel>Agent</ParameterLabel>
                      <ParameterValue>{protocol.acquisitionParameters.contrast.agent}</ParameterValue>
                    </ParameterItem>
                  )}
                  {protocol.acquisitionParameters.contrast.dose && (
                    <ParameterItem>
                      <ParameterLabel>Dose</ParameterLabel>
                      <ParameterValue>{protocol.acquisitionParameters.contrast.dose}</ParameterValue>
                    </ParameterItem>
                  )}
                </ParametersGrid>
                {protocol.acquisitionParameters.contrast.injectionProtocol && (
                  <Description>{protocol.acquisitionParameters.contrast.injectionProtocol}</Description>
                )}
              </>
            )}

            {/* Préparation */}
            {protocol.acquisitionParameters.preparation && (
              <>
                <h4 style={{ margin: '1.5rem 0 1rem 0', color: 'var(--color-primary)' }}>
                  Préparation :
                </h4>
                <Description>{protocol.acquisitionParameters.preparation}</Description>
              </>
            )}
          </>
        )}

        {/* Contre-indications */}
        {protocol.contraindications && protocol.contraindications.length > 0 && (
          <>
            <SectionTitle>
              ⚠️ Contre-indications
            </SectionTitle>
            <ul style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
              {protocol.contraindications.map((contraindication, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  <AlertCircle size={16} style={{ display: 'inline', marginRight: '0.5rem', color: 'var(--color-error)' }} />
                  {contraindication}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Avantages */}
        {protocol.advantages && protocol.advantages.length > 0 && (
          <>
            <SectionTitle>
              ✅ Avantages
            </SectionTitle>
            <ul style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
              {protocol.advantages.map((advantage, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  {advantage}
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Limitations */}
        {protocol.limitations && protocol.limitations.length > 0 && (
          <>
            <SectionTitle>
              ⚠️ Limitations
            </SectionTitle>
            <ul style={{ color: 'var(--color-text)', lineHeight: 1.6 }}>
              {protocol.limitations.map((limitation, index) => (
                <li key={index} style={{ marginBottom: '0.5rem' }}>
                  {limitation}
                </li>
              ))}
            </ul>
          </>
        )}
      </ContentContainer>
    </PageContainer>
  );
}

export default ProtocolViewPage;