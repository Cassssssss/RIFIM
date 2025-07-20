// ProtocolCreatorPage.js - VERSION SANS VALIDATION OBLIGATOIRE
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { 
  Save, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Clock, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

// ==================== STYLED COMPONENTS ====================

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
  flex-wrap: wrap;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.text};
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  background-color: ${props => props.className === 'primary' ? props.theme.primary : 'transparent'};
  color: ${props => props.className === 'primary' ? 'white' : props.theme.text};
  border: 2px solid ${props => props.className === 'primary' ? props.theme.primary : props.theme.border};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.className === 'primary' ? props.theme.primaryHover : props.theme.hover};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const FormContainer = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.25rem;
  font-weight: 600;
  margin: 2rem 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:first-of-type {
    margin-top: 0;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  .full-width {
    grid-column: 1 / -1;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: ${props => props.theme.text};
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
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

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 1rem;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
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

const SequenceCard = styled.div`
  background-color: ${props => props.theme.backgroundSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  position: relative;
`;

const SequenceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SequenceTitle = styled.h4`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.1rem;
`;

const DeleteButton = styled.button`
  background-color: ${props => props.theme.error};
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.errorHover || props.theme.error};
    transform: translateY(-1px);
  }
`;

const AddButton = styled.button`
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
  margin-top: 1rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.theme.primaryHover};
    transform: translateY(-1px);
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
`;

const ListInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const RemoveItemButton = styled.button`
  background-color: ${props => props.theme.error};
  color: white;
  border: none;
  padding: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${props => props.theme.errorHover || props.theme.error};
  }
`;

const StatusToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  margin-top: 1rem;
`;

const ToggleSwitch = styled.button`
  position: relative;
  width: 50px;
  height: 25px;
  background-color: ${props => props.isActive ? props.theme.primary : props.theme.border};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.isActive ? '27px' : '2px'};
    width: 21px;
    height: 21px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
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

  // État du formulaire - AUCUNE VALIDATION CÔTÉ CLIENT
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
    status: 'Brouillon',
    public: false
  });

  // Options pour les selects
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
              technicalParameters: seq.technicalParameters || {}, 
              justification: seq.justification || '',
              description: seq.description || '',
              duration: seq.duration || ''
            })) || [],
            acquisitionParameters: {
              fieldStrength: response.data.acquisitionParameters?.fieldStrength || '',
              coil: response.data.acquisitionParameters?.coil || '',
              position: response.data.acquisitionParameters?.position || '',
              contrast: {
                used: response.data.acquisitionParameters?.contrast?.used || false,
                agent: response.data.acquisitionParameters?.contrast?.agent || '',
                dose: response.data.acquisitionParameters?.contrast?.dose || '',
                injectionProtocol: response.data.acquisitionParameters?.contrast?.injectionProtocol || ''
              },
              preparation: response.data.acquisitionParameters?.preparation || ''
            },
            contraindications: response.data.contraindications || [],
            advantages: response.data.advantages || [],
            limitations: response.data.limitations || [],
            public: response.data.public || false,
            status: response.data.status || 'Brouillon'
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

  // Gestionnaires d'événements
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAcquisitionParameterChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      acquisitionParameters: {
        ...prev.acquisitionParameters,
        [field]: value
      }
    }));
  };

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

  const addSequence = () => {
    const newSequence = {
      id: Date.now().toString(),
      name: '',
      description: '',
      justification: '',
      technicalParameters: {},
      order: formData.sequences.length + 1,
      duration: ''
    };

    setFormData(prev => ({
      ...prev,
      sequences: [...prev.sequences, newSequence]
    }));
  };

  const updateSequence = (sequenceId, field, value) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.map(seq =>
        seq.id === sequenceId ? { ...seq, [field]: value } : seq
      )
    }));
  };

  const removeSequence = (sequenceId) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.filter(seq => seq.id !== sequenceId)
    }));
  };

  const addListItem = (listType) => {
    setFormData(prev => ({
      ...prev,
      [listType]: [...prev[listType], '']
    }));
  };

  const updateListItem = (listType, index, value) => {
    setFormData(prev => ({
      ...prev,
      [listType]: prev[listType].map((item, i) => i === index ? value : item)
    }));
  };

  const removeListItem = (listType, index) => {
    setFormData(prev => ({
      ...prev,
      [listType]: prev[listType].filter((_, i) => i !== index)
    }));
  };

  const calculateEstimatedDuration = () => {
    let totalMinutes = 0;
    
    formData.sequences.forEach(sequence => {
      if (sequence.duration) {
        const durationMatch = sequence.duration.match(/(\d+)min/);
        if (durationMatch) {
          totalMinutes += parseInt(durationMatch[1]);
        }
      }
    });

    if (totalMinutes === 0) return 'Non spécifiée';
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes > 0 ? minutes + 'min' : ''}`;
    } else {
      return `${minutes}min`;
    }
  };

  const handleSave = async () => {
    // ✅ AUCUNE VALIDATION CÔTÉ CLIENT - SUPPRIMÉE
    // On permet la sauvegarde même si les champs sont vides

    try {
      setSaving(true);
      setError('');

      // Nettoyer les données avant l'envoi
      const cleanedData = {
        ...formData,
        contraindications: formData.contraindications.filter(item => item.trim() !== ''),
        advantages: formData.advantages.filter(item => item.trim() !== ''),
        limitations: formData.limitations.filter(item => item.trim() !== ''),
        estimatedDuration: calculateEstimatedDuration(),
        // S'assurer que les champs vides ont des valeurs par défaut
        title: formData.title || 'Protocole sans titre',
        imagingType: formData.imagingType || '',
        anatomicalRegion: formData.anatomicalRegion || '',
        indication: formData.indication || ''
      };

      if (isEditing) {
        await axios.put(`/protocols/${id}`, cleanedData);
      } else {
        await axios.post('/protocols', cleanedData);
      }

      navigate('/protocols/personal');
    } catch (err) {
      console.error('Erreur lors de la sauvegarde:', err);
      setError('Erreur lors de la sauvegarde du protocole');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <Header>
        <PageTitle>
          📋 {isEditing ? 'Modifier le Protocole' : 'Créer un Nouveau Protocole'}
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
        {/* Informations générales - PLUS DE CHAMPS OBLIGATOIRES */}
        <SectionTitle>
          📋 Informations Générales
        </SectionTitle>
        
        <FormGrid>
          <FormGroup className="full-width">
            <Label>
              Titre du protocole
              {/* ✅ SUPPRIMÉ : <AlertCircle size={14} color="#ef4444" /> */}
            </Label>
            <Input
              type="text"
              placeholder="Ex: IRM cérébrale avec injection"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Type d'imagerie</Label>
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
            <Label>Région anatomique</Label>
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
          
          <FormGroup className="full-width">
            <Label>Indication clinique</Label>
            <TextArea
              placeholder="Décrivez l'indication clinique pour ce protocole..."
              value={formData.indication}
              onChange={(e) => handleInputChange('indication', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup className="full-width">
            <Label>Description du protocole</Label>
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
            <Label>Intensité du champ magnétique</Label>
            <Select
              value={formData.acquisitionParameters.fieldStrength}
              onChange={(e) => handleAcquisitionParameterChange('fieldStrength', e.target.value)}
            >
              <option value="">Sélectionner...</option>
              <option value="1.5T">1.5T</option>
              <option value="3T">3T</option>
              <option value="7T">7T (recherche)</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>Antenne</Label>
            <Input
              type="text"
              placeholder="Ex: Antenne tête 32 canaux"
              value={formData.acquisitionParameters.coil}
              onChange={(e) => handleAcquisitionParameterChange('coil', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Position du patient</Label>
            <Select
              value={formData.acquisitionParameters.position}
              onChange={(e) => handleAcquisitionParameterChange('position', e.target.value)}
            >
              <option value="">Sélectionner...</option>
              <option value="Décubitus dorsal">Décubitus dorsal</option>
              <option value="Décubitus ventral">Décubitus ventral</option>
              <option value="Décubitus latéral">Décubitus latéral</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label>
              <input
                type="checkbox"
                checked={formData.acquisitionParameters.contrast.used}
                onChange={(e) => handleContrastChange('used', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              Utiliser un produit de contraste
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
                <Label>Dose</Label>
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
              placeholder="Instructions de préparation (jeûne, médication, etc.)..."
              value={formData.acquisitionParameters.preparation}
              onChange={(e) => handleAcquisitionParameterChange('preparation', e.target.value)}
            />
          </FormGroup>
        </FormGrid>

        {/* Séquences */}
        <SectionTitle>
          🔄 Séquences d'Acquisition
        </SectionTitle>
        
        {formData.sequences.map((sequence, index) => (
          <SequenceCard key={sequence.id}>
            <SequenceHeader>
              <SequenceTitle>Séquence {index + 1}</SequenceTitle>
              <DeleteButton onClick={() => removeSequence(sequence.id)}>
                <Trash2 size={14} />
              </DeleteButton>
            </SequenceHeader>
            
            <FormGrid>
              <FormGroup>
                <Label>Nom de la séquence</Label>
                <Input
                  type="text"
                  placeholder="Ex: T1 FLAIR axial"
                  value={sequence.name}
                  onChange={(e) => updateSequence(sequence.id, 'name', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Durée estimée</Label>
                <Input
                  type="text"
                  placeholder="Ex: 3min 30s"
                  value={sequence.duration}
                  onChange={(e) => updateSequence(sequence.id, 'duration', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup className="full-width">
                <Label>Description</Label>
                <TextArea
                  placeholder="Décrivez cette séquence..."
                  value={sequence.description}
                  onChange={(e) => updateSequence(sequence.id, 'description', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup className="full-width">
                <Label>Justification médicale</Label>
                <TextArea
                  placeholder="Pourquoi cette séquence est-elle nécessaire ?"
                  value={sequence.justification}
                  onChange={(e) => updateSequence(sequence.id, 'justification', e.target.value)}
                />
              </FormGroup>
            </FormGrid>
          </SequenceCard>
        ))}

        <AddButton onClick={addSequence}>
          <Plus size={16} />
          Ajouter une séquence
        </AddButton>

        {/* Contre-indications */}
        <SectionTitle>
          ⚠️ Contre-indications
        </SectionTitle>
        
        <ListContainer>
          {formData.contraindications.map((item, index) => (
            <ListItem key={index}>
              <ListInput
                value={item}
                placeholder="Saisir une contre-indication..."
                onChange={(e) => updateListItem('contraindications', index, e.target.value)}
              />
              <RemoveItemButton onClick={() => removeListItem('contraindications', index)}>
                <Trash2 size={14} />
              </RemoveItemButton>
            </ListItem>
          ))}
          <AddButton onClick={() => addListItem('contraindications')}>
            <Plus size={16} />
            Ajouter une contre-indication
          </AddButton>
        </ListContainer>

        {/* Avantages */}
        <SectionTitle>
          ✅ Avantages du Protocole
        </SectionTitle>
        
        <ListContainer>
          {formData.advantages.map((item, index) => (
            <ListItem key={index}>
              <ListInput
                value={item}
                placeholder="Saisir un avantage..."
                onChange={(e) => updateListItem('advantages', index, e.target.value)}
              />
              <RemoveItemButton onClick={() => removeListItem('advantages', index)}>
                <Trash2 size={14} />
              </RemoveItemButton>
            </ListItem>
          ))}
          <AddButton onClick={() => addListItem('advantages')}>
            <Plus size={16} />
            Ajouter un avantage
          </AddButton>
        </ListContainer>

        {/* Limitations */}
        <SectionTitle>
          ⚠️ Limitations
        </SectionTitle>
        
        <ListContainer>
          {formData.limitations.map((item, index) => (
            <ListItem key={index}>
              <ListInput
                value={item}
                placeholder="Saisir une limitation..."
                onChange={(e) => updateListItem('limitations', index, e.target.value)}
              />
              <RemoveItemButton onClick={() => removeListItem('limitations', index)}>
                <Trash2 size={14} />
              </RemoveItemButton>
            </ListItem>
          ))}
          <AddButton onClick={() => addListItem('limitations')}>
            <Plus size={16} />
            Ajouter une limitation
          </AddButton>
        </ListContainer>

        {/* Paramètres de publication */}
        <SectionTitle>
          🌐 Paramètres de Publication
        </SectionTitle>
        
        <StatusToggle>
          <ToggleSwitch
            isActive={formData.public}
            onClick={() => handleInputChange('public', !formData.public)}
          />
          <div>
            <strong>Protocole {formData.public ? 'Public' : 'Privé'}</strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'gray' }}>
              {formData.public 
                ? 'Visible par tous les utilisateurs' 
                : 'Visible uniquement par vous'
              }
            </p>
          </div>
          {formData.public ? <Eye /> : <EyeOff />}
        </StatusToggle>

        {/* Durée estimée */}
        <EstimatedDuration>
          <Clock size={16} />
          <span>Durée totale estimée: {calculateEstimatedDuration()}</span>
        </EstimatedDuration>
      </FormContainer>
    </PageContainer>
  );
}

export default ProtocolCreatorPage;