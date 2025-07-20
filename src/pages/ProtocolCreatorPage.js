// ProtocolCreatorPage.js - VERSION CORRIGÉE AVEC SAUVEGARDE AMÉLIORÉE
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axiosConfig';
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
    background-color: ${props => props.className === 'primary' ? 
      props.theme.primaryHover : props.theme.cardHover};
    border-color: ${props => props.theme.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FormContainer = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px ${props => props.theme.shadow};
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.primary};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  .full-width {
    grid-column: 1 / -1;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 6px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}20;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background-color: ${props => props.theme.backgroundSecondary};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: ${props => props.theme.primary};
`;

const CheckboxLabel = styled.label`
  color: ${props => props.theme.text};
  font-weight: 500;
  cursor: pointer;
`;

const SequenceContainer = styled.div`
  background-color: ${props => props.theme.backgroundSecondary};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const SequenceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const SequenceTitle = styled.h3`
  color: ${props => props.theme.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
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
    left: ${props => props.isActive ? '26px' : '2px'};
    width: 21px;
    height: 21px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.2s ease;
  }
`;

const EstimatedDuration = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.info}20;
  border: 1px solid ${props => props.theme.info};
  border-radius: 6px;
  color: ${props => props.theme.info};
  font-weight: 500;
`;

// ==================== COMPOSANT PRINCIPAL ====================

function ProtocolCreatorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // État du formulaire avec valeurs par défaut
  const [formData, setFormData] = useState({
    title: '',
    imagingType: '',
    anatomicalRegion: '',
    indication: '',
    description: '',
    contraindications: [],
    advantages: [],
    limitations: [],
    public: false,
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
    }
  });

  // Listes des options - VALEURS EXACTES DU SCHÉMA MONGODB
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
            limitations: response.data.limitations || []
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

  // Gérer les changements dans les champs
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

  // Ajouter un élément à une liste
  const addListItem = (listName) => {
    setFormData(prev => ({
      ...prev,
      [listName]: [...prev[listName], '']
    }));
  };

  // Supprimer un élément d'une liste
  const removeListItem = (listName, index) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].filter((_, i) => i !== index)
    }));
  };

  // Modifier un élément d'une liste
  const updateListItem = (listName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [listName]: prev[listName].map((item, i) => i === index ? value : item)
    }));
  };

  // Ajouter une séquence
  const addSequence = () => {
    setFormData(prev => ({
      ...prev,
      sequences: [...prev.sequences, {
        name: '',
        description: '',
        duration: '',
        technicalParameters: {},
        justification: ''
      }]
    }));
  };

  // Supprimer une séquence
  const removeSequence = (index) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.filter((_, i) => i !== index)
    }));
  };

  // Modifier une séquence
  const updateSequence = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      sequences: prev.sequences.map((seq, i) => 
        i === index ? { ...seq, [field]: value } : seq
      )
    }));
  };

  // Calculer la durée estimée
  const calculateEstimatedDuration = () => {
    const totalMinutes = formData.sequences.reduce((total, sequence) => {
      const duration = sequence.duration || '';
      const minutes = parseInt(duration.replace(/\D/g, ''), 10) || 0;
      return total + minutes;
    }, 0);

    if (totalMinutes === 0) {
      return '';
    } else if (totalMinutes >= 60) {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h${minutes > 0 ? minutes + 'min' : ''}`;
    } else {
      return `${totalMinutes}min`;
    }
  };

  // FONCTION DE SAUVEGARDE CORRIGÉE AVEC DEBUGGING
  const handleSave = async () => {
    console.log('🔍 DÉBUT SAUVEGARDE - isEditing:', isEditing, 'ID:', id);
    
    try {
      setSaving(true);
      setError('');

      // Nettoyer les données avant l'envoi
      const cleanedData = {
        ...formData,
        contraindications: formData.contraindications.filter(item => item.trim() !== ''),
        advantages: formData.advantages.filter(item => item.trim() !== ''),
        limitations: formData.limitations.filter(item => item.trim() !== ''),
        sequences: formData.sequences.filter(seq => seq.name && seq.name.trim() !== ''),
        estimatedDuration: calculateEstimatedDuration(),
        // S'assurer que les champs obligatoires ont des valeurs par défaut
        title: formData.title || 'Protocole sans titre',
        imagingType: formData.imagingType || 'Non spécifié',
        anatomicalRegion: formData.anatomicalRegion || 'Non spécifié',
        indication: formData.indication || 'Non spécifiée'
      };

      console.log('📤 Données à envoyer:', cleanedData);

      let response;
      if (isEditing) {
        console.log('🔄 Mise à jour du protocole existant...');
        response = await axios.put(`/protocols/${id}`, cleanedData);
        console.log('✅ Protocole mis à jour:', response.data);
      } else {
        console.log('➕ Création d\'un nouveau protocole...');
        response = await axios.post('/protocols', cleanedData);
        console.log('✅ Protocole créé:', response.data);
      }

      console.log('🎉 Sauvegarde réussie, redirection...');
      navigate('/protocols/personal');
    } catch (err) {
      console.error('❌ Erreur lors de la sauvegarde:', err);
      console.error('📋 Détails de l\'erreur:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });

      if (err.response?.status === 401) {
        setError('Session expirée. Veuillez vous reconnecter.');
        navigate('/auth');
      } else if (err.response?.status === 403) {
        setError('Accès non autorisé pour cette action.');
      } else if (err.response?.status === 404) {
        setError('Protocole non trouvé.');
      } else {
        setError(err.response?.data?.message || 'Erreur lors de la sauvegarde du protocole');
      }
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
            <Label>Indication</Label>
            <Input
              type="text"
              placeholder="Ex: Suspicion de pathologie tumorale"
              value={formData.indication}
              onChange={(e) => handleInputChange('indication', e.target.value)}
            />
          </FormGroup>
          
          <FormGroup className="full-width">
            <Label>Description générale</Label>
            <TextArea
              placeholder="Décrivez brièvement ce protocole..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
          </FormGroup>
        </FormGrid>

        {/* Paramètres d'acquisition */}
        <SectionTitle>
          🔬 Paramètres d'Acquisition
        </SectionTitle>
        
        <FormGrid>
          <FormGroup>
            <Label>Intensité du champ</Label>
            <Select
              value={formData.acquisitionParameters.fieldStrength}
              onChange={(e) => handleAcquisitionParameterChange('fieldStrength', e.target.value)}
            >
              <option value="">Sélectionner...</option>
              <option value="1.5T">1.5T</option>
              <option value="3T">3T</option>
              <option value="7T">7T</option>
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
          
          <FormGroup className="full-width">
            <Label>Préparation du patient</Label>
            <TextArea
              placeholder="Instructions de préparation..."
              value={formData.acquisitionParameters.preparation}
              onChange={(e) => handleAcquisitionParameterChange('preparation', e.target.value)}
            />
          </FormGroup>
        </FormGrid>

        {/* Injection de produit de contraste */}
        <CheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={formData.acquisitionParameters.contrast.used}
            onChange={(e) => handleContrastChange('used', e.target.checked)}
          />
          <CheckboxLabel>Injection de produit de contraste</CheckboxLabel>
        </CheckboxContainer>

        {formData.acquisitionParameters.contrast.used && (
          <FormGrid style={{ marginTop: '1rem' }}>
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
                placeholder="Protocole d'injection détaillé..."
                value={formData.acquisitionParameters.contrast.injectionProtocol}
                onChange={(e) => handleContrastChange('injectionProtocol', e.target.value)}
              />
            </FormGroup>
          </FormGrid>
        )}

        {/* Séquences */}
        <SectionTitle>
          📷 Séquences d'Acquisition
        </SectionTitle>
        
        {formData.sequences.map((sequence, index) => (
          <SequenceContainer key={index}>
            <SequenceHeader>
              <SequenceTitle>Séquence {index + 1}</SequenceTitle>
              <RemoveItemButton onClick={() => removeSequence(index)}>
                <Trash2 size={16} />
              </RemoveItemButton>
            </SequenceHeader>
            
            <FormGrid>
              <FormGroup>
                <Label>Nom de la séquence</Label>
                <Input
                  type="text"
                  placeholder="Ex: T1 FLAIR axial"
                  value={sequence.name}
                  onChange={(e) => updateSequence(index, 'name', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup>
                <Label>Durée estimée</Label>
                <Input
                  type="text"
                  placeholder="Ex: 3min 30s"
                  value={sequence.duration}
                  onChange={(e) => updateSequence(index, 'duration', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup className="full-width">
                <Label>Description</Label>
                <TextArea
                  placeholder="Décrivez cette séquence..."
                  value={sequence.description}
                  onChange={(e) => updateSequence(index, 'description', e.target.value)}
                />
              </FormGroup>
              
              <FormGroup className="full-width">
                <Label>Justification médicale</Label>
                <TextArea
                  placeholder="Pourquoi cette séquence est-elle nécessaire ?"
                  value={sequence.justification}
                  onChange={(e) => updateSequence(index, 'justification', e.target.value)}
                />
              </FormGroup>
            </FormGrid>
          </SequenceContainer>
        ))}
        
        <AddButton onClick={addSequence}>
          <Plus size={16} />
          Ajouter une séquence
        </AddButton>

        {/* Durée estimée totale */}
        {formData.sequences.length > 0 && (
          <EstimatedDuration>
            <Clock size={16} />
            Durée estimée totale : {calculateEstimatedDuration()}
          </EstimatedDuration>
        )}

        {/* Contre-indications */}
        <SectionTitle>
          ⚠️ Contre-indications
        </SectionTitle>
        
        <ListContainer>
          {formData.contraindications.map((item, index) => (
            <ListItem key={index}>
              <ListInput
                type="text"
                placeholder="Contre-indication..."
                value={item}
                onChange={(e) => updateListItem('contraindications', index, e.target.value)}
              />
              <RemoveItemButton onClick={() => removeListItem('contraindications', index)}>
                <Trash2 size={16} />
              </RemoveItemButton>
            </ListItem>
          ))}
        </ListContainer>
        
        <AddButton onClick={() => addListItem('contraindications')}>
          <Plus size={16} />
          Ajouter une contre-indication
        </AddButton>

        {/* Avantages */}
        <SectionTitle>
          ✅ Avantages
        </SectionTitle>
        
        <ListContainer>
          {formData.advantages.map((item, index) => (
            <ListItem key={index}>
              <ListInput
                type="text"
                placeholder="Avantage..."
                value={item}
                onChange={(e) => updateListItem('advantages', index, e.target.value)}
              />
              <RemoveItemButton onClick={() => removeListItem('advantages', index)}>
                <Trash2 size={16} />
              </RemoveItemButton>
            </ListItem>
          ))}
        </ListContainer>
        
        <AddButton onClick={() => addListItem('advantages')}>
          <Plus size={16} />
          Ajouter un avantage
        </AddButton>

        {/* Limitations */}
        <SectionTitle>
          ⚡ Limitations
        </SectionTitle>
        
        <ListContainer>
          {formData.limitations.map((item, index) => (
            <ListItem key={index}>
              <ListInput
                type="text"
                placeholder="Limitation..."
                value={item}
                onChange={(e) => updateListItem('limitations', index, e.target.value)}
              />
              <RemoveItemButton onClick={() => removeListItem('limitations', index)}>
                <Trash2 size={16} />
              </RemoveItemButton>
            </ListItem>
          ))}
        </ListContainer>
        
        <AddButton onClick={() => addListItem('limitations')}>
          <Plus size={16} />
          Ajouter une limitation
        </AddButton>

        {/* Statut de publication */}
        <StatusToggle>
          <ToggleSwitch
            type="button"
            isActive={formData.public}
            onClick={() => handleInputChange('public', !formData.public)}
          />
          <div>
            <div style={{ color: formData.public ? '#10b981' : '#6b7280', fontWeight: '600' }}>
              {formData.public ? <Eye size={16} /> : <EyeOff size={16} />}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              {formData.public ? 'Protocole public' : 'Protocole privé'}
            </div>
          </div>
        </StatusToggle>
      </FormContainer>
    </PageContainer>
  );
}

export default ProtocolCreatorPage;