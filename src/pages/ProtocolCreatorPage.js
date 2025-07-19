import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Save, Plus, Trash2, ArrowLeft, Eye, Clock, AlertCircle } from 'lucide-react';
import styled from 'styled-components';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ==================== STYLED COMPONENTS ====================

const PageContainer = styled.div`
  padding: 2rem;
  background: ${props => props.theme.background};
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
  font-size: 2rem;
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

  &.secondary {
    background-color: ${props => props.theme.backgroundSecondary};
    border-color: ${props => props.theme.primary};
    color: ${props => props.theme.primary};

    &:hover {
      background-color: ${props => props.theme.primary};
      color: white;
    }
  }
`;

const FormContainer = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 1rem;
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
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.textSecondary};
  }
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

const SequencesContainer = styled.div`
  margin-top: 1rem;
`;

const SequenceCard = styled.div`
  background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
`;

const SequenceHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1rem;
  gap: 1rem;
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

const DeleteSequenceButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fef2f2;
  }
`;

const AddSequenceButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  border: 2px dashed ${props => props.theme.border};
  border-radius: 12px;
  background-color: transparent;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;

  &:hover {
    border-color: ${props => props.theme.primary};
    color: ${props => props.theme.primary};
    background-color: ${props => props.theme.primary}10;
  }
`;

const ParametersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ParameterInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ParameterLabel = styled.label`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.theme.textSecondary};
`;

const ParameterField = styled.input`
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 0.9rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const PreviewContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.backgroundSecondary || '#f8fafc'};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
`;

const EstimatedDuration = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, ${props => props.theme.primary}20, ${props => props.theme.secondary}20);
  border-radius: 8px;
  font-weight: 500;
  color: ${props => props.theme.primary};
  margin-top: 1rem;
`;

// ==================== COMPOSANT PRINCIPAL ====================

function ProtocolCreatorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    imagingType: '',
    anatomicalRegion: '',
    indication: '',
    description: '',
    sequences: [],
    acquisitionParameters: {
      fieldStrength: '',
      coil: '',
      position: '',
      contrast: {
        used: false,
        agent: '',
        dose: '',
        injectionProtocol: ''
      },
      preparation: ''
    },
    contraindications: [],
    advantages: [],
    limitations: [],
    complexity: 1,
    status: 'Brouillon',
    public: false
  });

  // Options pour les selects
  const imagingTypes = ['IRM', 'Scanner', 'Échographie', 'Radiographie', 'Mammographie', 'Médecine Nucléaire', 'Angiographie'];
  const anatomicalRegions = ['Cerveau', 'Thorax', 'Abdomen', 'Pelvis', 'Rachis', 'Membre Supérieur', 'Membre Inférieur', 'Vaisseaux', 'Cœur', 'Sein', 'Uro, Pédiatrie, ORL'];

  // Charger le protocole existant en mode édition
  useEffect(() => {
    if (isEditing) {
      const fetchProtocol = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/protocols/${id}`);
          
          // Normaliser les données pour éviter les erreurs undefined
          const protocolData = {
            ...response.data,
            sequences: response.data.sequences?.map(seq => ({
              ...seq,
              technicalParameters: seq.technicalParameters || {}, // S'assurer que c'est un objet
              justification: seq.justification || '',
              description: seq.description || '',
              duration: seq.duration || ''
            })) || [],
            acquisitionParameters: {
              fieldStrength: '',
              coil: '',
              position: '',
              contrast: {
                used: false,
                agent: '',
                dose: '',
                injectionProtocol: ''
              },
              preparation: '',
              ...response.data.acquisitionParameters
            }
          };
          
          setFormData(protocolData);
        } catch (err) {
          console.error('Erreur lors du chargement du protocole:', err);
          setError('Erreur lors du chargement du protocole');
        } finally {
          setLoading(false);
        }
      };

      fetchProtocol();
    }
  }, [id, isEditing]);

  // Gérer les changements de champs simples
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Gérer les changements dans les paramètres d'acquisition
  const handleAcquisitionParameterChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      acquisitionParameters: {
        ...prev.acquisitionParameters,
        [field]: value
      }
    }));
  };

  // Gérer les changements dans les paramètres de contraste
  const handleContrastChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      acquisitionParameters: {
        ...prev.acquisitionParameters,
        contrast: {
          ...prev.acquisitionParameters.contrast,
          [field]: value
        }
      }
    }));
  };

  // Ajouter une nouvelle séquence
  const addSequence = () => {
    const newSequence = {
      id: Date.now().toString(),
      name: '',
      description: '',
      justification: '',
      technicalParameters: {
        TR: '',
        TE: '',
        thickness: '',
        spacing: '',
        FOV: '',
        matrix: ''
      }, // Initialiser avec tous les champs
      order: formData.sequences.length + 1,
      duration: ''
    };

    setFormData(prev => ({
      ...prev,
      sequences: [...prev.sequences, newSequence]
    }));
  };

  // Supprimer une séquence
  const removeSequence = (sequenceId) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.filter(seq => seq.id !== sequenceId)
    }));
  };

  // Mettre à jour une séquence
  const updateSequence = (sequenceId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.map(seq =>
        seq.id === sequenceId ? { ...seq, [field]: value } : seq
      )
    }));
  };

  // Mettre à jour les paramètres techniques d'une séquence
  const updateSequenceParameter = (sequenceId, parameterName, value) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.map(seq =>
        seq.id === sequenceId
          ? {
              ...seq,
              technicalParameters: {
                ...seq.technicalParameters,
                [parameterName]: value
              }
            }
          : seq
      )
    }));
  };

  // Calculer la durée totale estimée
  const calculateTotalDuration = () => {
    let totalMinutes = 0;
    
    formData.sequences.forEach(sequence => {
      if (sequence.duration) {
        const durationMatch = sequence.duration.match(/(\d+)min(?:\s*(\d+)s)?/);
        if (durationMatch) {
          totalMinutes += parseInt(durationMatch[1]);
          if (durationMatch[2]) {
            totalMinutes += parseInt(durationMatch[2]) / 60;
          }
        }
      }
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  };

  // Sauvegarder le protocole
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');

      // Validation de base
      if (!formData.title || !formData.imagingType || !formData.anatomicalRegion || !formData.indication) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      if (formData.sequences.length === 0) {
        throw new Error('Veuillez ajouter au moins une séquence');
      }

      // Vérifier que toutes les séquences ont une justification
      const invalidSequences = formData.sequences.filter(seq => !seq.justification.trim());
      if (invalidSequences.length > 0) {
        throw new Error('Toutes les séquences doivent avoir une justification');
      }

      const dataToSave = {
        ...formData,
        estimatedDuration: calculateTotalDuration()
      };

      if (isEditing) {
        await axios.put(`/protocols/${id}`, dataToSave);
      } else {
        await axios.post('/protocols', dataToSave);
      }

      navigate('/protocols/personal');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error && !formData.title) return <ErrorMessage message={error} />;

  return (
    <PageContainer>
      <Header>
        <PageTitle>
          {isEditing ? 'Modifier le Protocole' : 'Créer un Nouveau Protocole'}
        </PageTitle>
        
        <ActionButtons>
          <ActionButton onClick={() => navigate('/protocols/personal')}>
            <ArrowLeft size={16} />
            Retour
          </ActionButton>
          
          <ActionButton 
            className="primary" 
            onClick={handleSave}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </ActionButton>
        </ActionButtons>
      </Header>

      {error && (
        <ErrorMessage message={error} />
      )}

      <FormContainer>
        {/* Informations générales */}
        <SectionTitle>
          📋 Informations Générales
        </SectionTitle>
        
        <FormGrid>
          <FormGroup className="full-width">
            <Label>
              Titre du protocole *
              <AlertCircle size={14} color="#ef4444" />
            </Label>
            <Input
              type="text"
              placeholder="Ex: IRM cérébrale avec injection"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Type d'imagerie *</Label>
            <Select
              value={formData.imagingType}
              onChange={(e) => handleInputChange('imagingType', e.target.value)}
            >
              <option value="">Sélectionner...</option>
              {imagingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Région anatomique *</Label>
            <Select
              value={formData.anatomicalRegion}
              onChange={(e) => handleInputChange('anatomicalRegion', e.target.value)}
            >
              <option value="">Sélectionner...</option>
              {anatomicalRegions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Niveau de complexité</Label>
            <Select
              value={formData.complexity}
              onChange={(e) => handleInputChange('complexity', parseInt(e.target.value))}
            >
              <option value={1}>1 - Basique</option>
              <option value={2}>2 - Facile</option>
              <option value={3}>3 - Intermédiaire</option>
              <option value={4}>4 - Avancé</option>
              <option value={5}>5 - Expert</option>
            </Select>
          </FormGroup>
          
          <FormGroup className="full-width">
            <Label>Indication clinique *</Label>
            <TextArea
              placeholder="Décrivez l'indication clinique pour ce protocole..."
              value={formData.indication}
              onChange={(e) => handleInputChange('indication', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup className="full-width">
            <Label>Description générale</Label>
            <TextArea
              placeholder="Description détaillée du protocole..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </FormGroup>
        </FormGrid>

        {/* Paramètres d'acquisition */}
        <SectionTitle>
          ⚙️ Paramètres d'Acquisition
        </SectionTitle>
        
        <FormGrid>
          <FormGroup>
            <Label>Force du champ magnétique</Label>
            <Input
              type="text"
              placeholder="Ex: 1.5T, 3T"
              value={formData.acquisitionParameters.fieldStrength}
              onChange={(e) => handleAcquisitionParameterChange('fieldStrength', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Antenne/Bobine</Label>
            <Input
              type="text"
              placeholder="Ex: Antenne tête 32 canaux"
              value={formData.acquisitionParameters.coil}
              onChange={(e) => handleAcquisitionParameterChange('coil', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Position du patient</Label>
            <Input
              type="text"
              placeholder="Ex: Décubitus dorsal"
              value={formData.acquisitionParameters.position}
              onChange={(e) => handleAcquisitionParameterChange('position', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>
              <input
                type="checkbox"
                checked={formData.acquisitionParameters.contrast.used}
                onChange={(e) => handleContrastChange('used', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Utilisation de produit de contraste
            </Label>
          </FormGroup>
          
          {formData.acquisitionParameters.contrast.used && (
            <>
              <FormGroup>
                <Label>Agent de contraste</Label>
                <Input
                  type="text"
                  placeholder="Ex: Gadolinium"
                  value={formData.acquisitionParameters.contrast.agent}
                  onChange={(e) => handleContrastChange('agent', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Dosage</Label>
                <Input
                  type="text"
                  placeholder="Ex: 0.1 mmol/kg"
                  value={formData.acquisitionParameters.contrast.dose}
                  onChange={(e) => handleContrastChange('dose', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup className="full-width">
                <Label>Protocole d'injection</Label>
                <TextArea
                  placeholder="Décrivez le protocole d'injection..."
                  value={formData.acquisitionParameters.contrast.injectionProtocol}
                  onChange={(e) => handleContrastChange('injectionProtocol', e.target.value)}
                />
              </FormGroup>
            </>
          )}
          
          <FormGroup className="full-width">
            <Label>Préparation du patient</Label>
            <TextArea
              placeholder="Instructions de préparation..."
              value={formData.acquisitionParameters.preparation}
              onChange={(e) => handleAcquisitionParameterChange('preparation', e.target.value)}
            />
          </FormGroup>
        </FormGrid>

        {/* Séquences */}
        <SectionTitle>
          🔄 Séquences d'Acquisition
        </SectionTitle>
        
        <SequencesContainer>
          {formData.sequences.map((sequence, index) => (
            <SequenceCard key={sequence.id}>
              <DeleteSequenceButton
                onClick={() => removeSequence(sequence.id)}
                title="Supprimer cette séquence"
              >
                <Trash2 size={16} />
              </DeleteSequenceButton>
              
              <SequenceHeader>
                <SequenceNumber>{index + 1}</SequenceNumber>
                <FormGroup style={{ flex: 1, margin: 0 }}>
                  <Input
                    type="text"
                    placeholder="Nom de la séquence (ex: T1 MPRAGE)"
                    value={sequence.name}
                    onChange={(e) => updateSequence(sequence.id, 'name', e.target.value)}
                  />
                </FormGroup>
                <FormGroup style={{ width: '150px', margin: 0 }}>
                  <Input
                    type="text"
                    placeholder="Durée (ex: 3min 30s)"
                    value={sequence.duration}
                    onChange={(e) => updateSequence(sequence.id, 'duration', e.target.value)}
                  />
                </FormGroup>
              </SequenceHeader>
              
              <FormGroup>
                <Label>Description de la séquence</Label>
                <TextArea
                  placeholder="Décrivez brièvement cette séquence..."
                  value={sequence.description}
                  onChange={(e) => updateSequence(sequence.id, 'description', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>
                  Justification * 
                  <AlertCircle size={14} color="#ef4444" />
                </Label>
                <TextArea
                  placeholder="Pourquoi cette séquence est-elle nécessaire ? Que permet-elle de visualiser ?"
                  value={sequence.justification}
                  onChange={(e) => updateSequence(sequence.id, 'justification', e.target.value)}
                />
              </FormGroup>
              
              <Label>Paramètres techniques</Label>
              <ParametersGrid>
                <ParameterInput>
                  <ParameterLabel>TR (ms)</ParameterLabel>
                  <ParameterField
                    type="text"
                    placeholder="ex: 2000"
                    value={(sequence.technicalParameters && sequence.technicalParameters.TR) || ''}
                    onChange={(e) => updateSequenceParameter(sequence.id, 'TR', e.target.value)}
                  />
                </ParameterInput>
                
                <ParameterInput>
                  <ParameterLabel>TE (ms)</ParameterLabel>
                  <ParameterField
                    type="text"
                    placeholder="ex: 30"
                    value={(sequence.technicalParameters && sequence.technicalParameters.TE) || ''}
                    onChange={(e) => updateSequenceParameter(sequence.id, 'TE', e.target.value)}
                  />
                </ParameterInput>
                
                <ParameterInput>
                  <ParameterLabel>Épaisseur (mm)</ParameterLabel>
                  <ParameterField
                    type="text"
                    placeholder="ex: 5"
                    value={(sequence.technicalParameters && sequence.technicalParameters.thickness) || ''}
                    onChange={(e) => updateSequenceParameter(sequence.id, 'thickness', e.target.value)}
                  />
                </ParameterInput>
                
                <ParameterInput>
                  <ParameterLabel>Espacement (mm)</ParameterLabel>
                  <ParameterField
                    type="text"
                    placeholder="ex: 1"
                    value={(sequence.technicalParameters && sequence.technicalParameters.spacing) || ''}
                    onChange={(e) => updateSequenceParameter(sequence.id, 'spacing', e.target.value)}
                  />
                </ParameterInput>
                
                <ParameterInput>
                  <ParameterLabel>FOV (mm)</ParameterLabel>
                  <ParameterField
                    type="text"
                    placeholder="ex: 256x256"
                    value={(sequence.technicalParameters && sequence.technicalParameters.FOV) || ''}
                    onChange={(e) => updateSequenceParameter(sequence.id, 'FOV', e.target.value)}
                  />
                </ParameterInput>
                
                <ParameterInput>
                  <ParameterLabel>Matrice</ParameterLabel>
                  <ParameterField
                    type="text"
                    placeholder="ex: 512x512"
                    value={(sequence.technicalParameters && sequence.technicalParameters.matrix) || ''}
                    onChange={(e) => updateSequenceParameter(sequence.id, 'matrix', e.target.value)}
                  />
                </ParameterInput>
              </ParametersGrid>
            </SequenceCard>
          ))}
          
          <AddSequenceButton onClick={addSequence}>
            <Plus size={20} />
            Ajouter une séquence
          </AddSequenceButton>
        </SequencesContainer>

        {/* Aperçu et informations complémentaires */}
        <SectionTitle>
          📊 Informations Complémentaires
        </SectionTitle>
        
        <FormGrid>
          <FormGroup>
            <Label>Statut du protocole</Label>
            <Select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              <option value="Brouillon">Brouillon</option>
              <option value="En révision">En révision</option>
              <option value="Validé">Validé</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>
              <input
                type="checkbox"
                checked={formData.public}
                onChange={(e) => handleInputChange('public', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Rendre ce protocole public
            </Label>
          </FormGroup>
        </FormGrid>

        {/* Aperçu de la durée */}
        {formData.sequences.length > 0 && (
          <EstimatedDuration>
            <Clock size={20} />
            Durée totale estimée : {calculateTotalDuration()}
          </EstimatedDuration>
        )}
      </FormContainer>
    </PageContainer>
  );
}

export default ProtocolCreatorPage;