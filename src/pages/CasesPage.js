// pages/CasesPage.js - VERSION STYLISÉE AVEC FONCTIONNALITÉS RESTAURÉES
import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { 
  Upload, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Star, 
  StarHalf,
  Plus, 
  X, 
  Image as ImageIcon,
  FileText,
  Settings,
  Download,
  Folder,
  File,
  Save,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import ImageViewer from '../components/ImageViewer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import TutorialOverlay from './TutorialOverlay';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PaginationContainer, PaginationButton, PaginationInfo } from './CasesPage.styles';

// ==================== STYLED COMPONENTS HARMONISÉS ====================

const PageContainer = styled.div`
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.text};
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
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

const SectionContainer = styled.div`
  margin-bottom: 3rem;
  padding: 2rem;
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  box-shadow: 0 8px 32px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
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
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.text};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const Input = styled.input`
  flex: 1;
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

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.backgroundSecondary || props.theme.card;
      case 'danger': return '#ef4444';
      case 'success': return '#10b981';
      default: return props.theme.primary;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.text;
      default: return 'white';
    }
  }};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.border;
      default: return 'transparent';
    }
  }};
  border-radius: 8px;
  padding: ${props => props.size === 'large' ? '0.75rem 1.5rem' : '0.5rem 1rem'};
  font-size: ${props => props.size === 'large' ? '0.95rem' : '0.85rem'};
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    margin-bottom: 0.5rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
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

  option {
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }
`;

const FolderContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.background};
  border-radius: 12px;
  border: 2px solid ${props => props.theme.border};
  transition: all 0.3s ease;

  &:hover {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }
`;

const FolderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const FolderTitle = styled.h3`
  margin: 0;
  font-size: 1.3rem;
  color: ${props => props.theme.text};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FolderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    width: 100%;
    
    button, label {
      flex: 1;
      min-width: 120px;
    }
  }
`;

const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  gap: 0.5rem;
  border: none;

  &:hover {
    background-color: ${props => props.theme.secondary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const CasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const CaseCard = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  border: 1px solid ${props => props.theme.border};
  position: relative;

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
    transform: translateY(-4px);
    box-shadow: 0 12px 40px ${props => props.theme.shadow};
    border-color: ${props => props.theme.primary};
  }
`;

const CaseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const CaseContent = styled.div`
  padding: 1.5rem;
`;

const CaseTitle = styled.h2`
  color: ${props => props.theme.text};
  text-align: center;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const StarRatingContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 0.25rem;
`;

const StarButton = styled.span`
  cursor: pointer;
  margin: 0 2px;
  svg {
    width: 24px;
    height: 24px;
    transition: fill 0.2s ease;
    fill: ${props => (props.filled ? 'gold' : 'gray')};
  }
`;

const CaseActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const CaseButton = styled.button`
  background-color: ${props => {
    switch(props.variant) {
      case 'primary': return props.theme.primary;
      case 'secondary': return props.theme.backgroundSecondary || props.theme.card;
      case 'danger': return '#ef4444';
      default: return props.theme.primary;
    }
  }};
  color: ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.text;
      default: return 'white';
    }
  }};
  border: 1px solid ${props => {
    switch(props.variant) {
      case 'secondary': return props.theme.border;
      default: return 'transparent';
    }
  }};
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    opacity: 0.9;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Tag = styled.span`
  background-color: ${props => props.theme.primary};
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  
  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const AddTagForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TagInput = styled.input`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  font-size: 0.75rem;
  width: 120px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const AddTagButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const AnswerSection = styled.div`
  margin-top: 1rem;
`;

const AnswerText = styled.p`
  margin-bottom: 0.5rem;
  color: ${props => props.theme.text};
  font-style: italic;
`;

const AnswerInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 4px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const TutorialButton = styled.button`
  background-color: ${props => props.theme.secondary};
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.primary};
  }
`;

const VideoContainer = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: ${props => props.theme.card};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin-bottom: 1rem;
    color: ${props => props.theme.text};
  }

  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* Ratio 16:9 */
    height: 0;
    overflow: hidden;
    max-width: 100%;

    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
`;

// ==================== COMPOSANTS ====================

const StarRating = memo(({ rating, onRatingChange }) => {
  return (
    <StarRatingContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarButton
          key={star}
          onClick={() => onRatingChange(star)}
          filled={rating >= star}
        >
          {rating >= star ? (
            <Star fill="gold" color="gold" />
          ) : rating >= star - 0.5 ? (
            <StarHalf fill="gold" color="gold" />
          ) : (
            <Star color="gray" />
          )}
        </StarButton>
      ))}
    </StarRatingContainer>
  );
});

const CaseCardComponent = memo(({ cas, onUpdateDifficulty, onUpdateAnswer, onAddTag, onRemoveTag, onDeleteCase, onLoadCase, onTogglePublic }) => {
  const [editingAnswer, setEditingAnswer] = useState(null);
  const [newTag, setNewTag] = useState('');

  const handleAnswerEdit = useCallback(() => {
    setEditingAnswer({ id: cas._id, value: cas.answer || '' });
  }, [cas._id, cas.answer]);

  const handleAnswerSave = useCallback(() => {
    if (editingAnswer) {
      onUpdateAnswer(editingAnswer.id, editingAnswer.value);
      setEditingAnswer(null);
    }
  }, [editingAnswer, onUpdateAnswer]);

  const handleAddTag = useCallback((e) => {
    e.preventDefault();
    if (newTag.trim()) {
      onAddTag(cas._id, newTag.trim());
      setNewTag('');
    }
  }, [cas._id, newTag, onAddTag]);

  const handleTogglePublic = async () => {
    try {
      await onTogglePublic(cas._id);
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du cas:', error);
    }
  };

  return (
    <CaseCard>
      <Link to={`/radiology-viewer/${cas._id}`}>
        <CaseImage 
          src={cas.mainImage ? cas.mainImage : (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) || '/images/default.jpg'}
          alt={cas.title || 'Image sans titre'} 
        />
      </Link>
      
      <CaseContent>
        <Link to={`/radiology-viewer/${cas._id}`} style={{ textDecoration: 'none' }}>
          <CaseTitle>{cas.title || 'Cas sans titre'}</CaseTitle>
        </Link>
        
        <StarRating
          rating={cas.difficulty || 1}
          onRatingChange={(newRating) => onUpdateDifficulty(cas._id, newRating)}
        />
        
        <AnswerSection>
          {editingAnswer && editingAnswer.id === cas._id ? (
            <>
              <AnswerInput
                value={editingAnswer.value}
                onChange={(e) => setEditingAnswer({ ...editingAnswer, value: e.target.value })}
                placeholder="Entrez la réponse..."
              />
              <Button variant="success" onClick={handleAnswerSave}>
                <Save size={16} />
                Sauvegarder
              </Button>
            </>
          ) : (
            <>
              <AnswerText>{cas.answer || 'Pas de réponse'}</AnswerText>
              <Button variant="secondary" onClick={handleAnswerEdit}>
                <Edit size={16} />
                Modifier la réponse
              </Button>
            </>
          )}
        </AnswerSection>
        
        <TagsContainer>
          {cas.tags && cas.tags.map(tag => (
            <Tag key={tag}>
              {tag}
              <RemoveTagButton onClick={() => onRemoveTag(cas._id, tag)}>
                <X size={12} />
              </RemoveTagButton>
            </Tag>
          ))}
          <AddTagForm onSubmit={handleAddTag}>
            <TagInput
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nouveau tag"
            />
            <AddTagButton type="submit">
              <Plus size={16} />
            </AddTagButton>
          </AddTagForm>
        </TagsContainer>
        
        <CaseActions>
          <CaseButton as={Link} to={`/create-sheet/${cas._id}`} variant="secondary">
            <FileText />
            Créer fiche
          </CaseButton>
          <CaseButton variant="primary" onClick={() => onLoadCase(cas._id)}>
            <Download />
            Charger
          </CaseButton>
          <CaseButton variant="secondary" onClick={handleTogglePublic}>
            {cas.public ? <EyeOff /> : <Eye />}
            {cas.public ? 'Rendre privé' : 'Rendre public'}
          </CaseButton>
          <CaseButton variant="danger" onClick={() => onDeleteCase(cas._id)}>
            <Trash2 />
            Supprimer
          </CaseButton>
        </CaseActions>
      </CaseContent>
    </CaseCard>
  );
});

// ==================== COMPOSANT PRINCIPAL ====================

function CasesPage() {
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [newCaseTitle, setNewCaseTitle] = useState('');
  const [newFolderName, setNewFolderName] = useState('');
  const [newImages, setNewImages] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrollVisible, setIsScrollVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const tutorialSteps = [
    {
      image: "/tutorials/Screen_Cases1.png",
      description: "Page de création de cas - Commencez par créer un nouveau cas."
    }
  ];

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    const toggleScrollVisibility = () => {
      setIsScrollVisible(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', toggleScrollVisibility);
    return () => window.removeEventListener('scroll', toggleScrollVisibility);
  }, []);

  const fetchCases = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases?page=${page}&limit=10`);
      setCases(response.data.cases);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erreur lors de la récupération des cas:', error);
      setError('Erreur lors de la récupération des cas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadCase = useCallback(async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases/${id}`);
      setSelectedCase(response.data);
      setCases(prevCases => prevCases.map(c => c._id === id ? response.data : c));
    } catch (error) {
      setError('Erreur lors du chargement du cas');
      console.error('Erreur lors du chargement du cas:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNewCase = useCallback(async () => {
    let sanitizedTitle = newCaseTitle.trim();
    if (sanitizedTitle.toLowerCase().startsWith('rifim/')) {
      sanitizedTitle = sanitizedTitle.substring('rifim/'.length);
    }
    if (sanitizedTitle === '') return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/cases`, { 
        title: sanitizedTitle,
        folders: [],
        images: {},
        difficulty: 1,
        answer: ''
      });
      setCases(prevCases => [...prevCases, response.data]);
      setNewCaseTitle('');
      setSelectedCase(response.data);
    } catch (error) {
      setError('Erreur lors de l\'ajout d\'un nouveau cas');
      console.error('Erreur lors de l\'ajout d\'un nouveau cas:', error);
    } finally {
      setIsLoading(false);
    }
  }, [newCaseTitle]);

  const deleteCase = useCallback(async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cas ?')) {
      setIsLoading(true);
      setError(null);
      try {
        await axios.delete(`/cases/${id}`);
        setCases(prevCases => prevCases.filter(c => c._id !== id));
        setSelectedCase(null);
      } catch (error) {
        console.error('Erreur lors de la suppression du cas:', error);
        setError('Erreur lors de la suppression du cas');
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const updateCaseDifficulty = useCallback(async (id, difficulty) => {
    try {
      await axios.patch(`/cases/${id}`, { difficulty });
      setCases(prevCases => prevCases.map(c => 
        c._id === id ? { ...c, difficulty } : c
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la difficulté:', error);
    }
  }, []);

  const updateCaseAnswer = useCallback(async (id, answer) => {
    try {
      await axios.patch(`/cases/${id}`, { answer });
      setCases(prevCases => prevCases.map(c => 
        c._id === id ? { ...c, answer } : c
      ));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la réponse:', error);
    }
  }, []);

  const handleAddTag = useCallback(async (caseId, tag) => {
    try {
      const response = await axios.patch(`/cases/${caseId}/tags`, { tagToAdd: tag });
      setCases(prevCases => prevCases.map(c => c._id === caseId ? response.data : c));
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tag:', error);
    }
  }, []);

  const handleRemoveTag = useCallback(async (caseId, tagToRemove) => {
    try {
      const response = await axios.patch(`/cases/${caseId}/tags`, { tagToRemove });
      setCases(prevCases => prevCases.map(c => c._id === caseId ? response.data : c));
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
    }
  }, []);

  const handleTogglePublic = useCallback(async (id) => {
    try {
      const response = await axios.patch(`/cases/${id}/togglePublic`);
      if (response.data) {
        setCases(prevCases => 
          prevCases.map(c => 
            c._id === id ? { ...c, public: !c.public } : c
          )
        );
      }
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du cas:', error);
    }
  }, []);

  const filteredCases = cases.filter(cas => 
    cas.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageContainer>
      <Title>🏥 Création de Cas</Title>
      
      <SearchInput
        type="text"
        placeholder="🔍 Rechercher un cas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* SECTION CRÉATION DE CAS */}
      <SectionContainer>
        <SectionTitle>
          <Plus />
          Créer un nouveau cas
        </SectionTitle>
        
        <InputGroup>
          <Input
            type="text"
            value={newCaseTitle}
            onChange={(e) => setNewCaseTitle(e.target.value)}
            placeholder="Titre du nouveau cas"
          />
          <Button variant="primary" size="large" onClick={addNewCase}>
            <Plus />
            Créer un nouveau cas
          </Button>
        </InputGroup>

        <Select
          value={selectedCase?._id || ''}
          onChange={(e) => loadCase(e.target.value)}
        >
          <option value="">Sélectionner un cas</option>
          {cases.map(cas => (
            <option key={cas._id} value={cas._id}>{cas.title}</option>
          ))}
        </Select>
      </SectionContainer>

      {/* SECTION LISTE DES CAS */}
      <SectionContainer>
        <SectionTitle>
          <FileText />
          Mes cas créés
        </SectionTitle>

        <CasesGrid>
          {filteredCases && filteredCases.length > 0 ? (
            filteredCases.map((cas) => (
              <CaseCardComponent
                key={cas._id}
                cas={cas}
                onUpdateDifficulty={updateCaseDifficulty}
                onUpdateAnswer={updateCaseAnswer}
                onAddTag={handleAddTag}
                onRemoveTag={handleRemoveTag}
                onDeleteCase={deleteCase}
                onLoadCase={loadCase}
                onTogglePublic={handleTogglePublic}
              />
            ))
          ) : (
            <p>Aucun cas disponible</p>
          )}
        </CasesGrid>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <PaginationContainer>
            <PaginationButton 
              onClick={() => fetchCases(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              Précédent
            </PaginationButton>
            <PaginationInfo>
              Page {currentPage} sur {totalPages}
            </PaginationInfo>
            <PaginationButton 
              onClick={() => fetchCases(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              Suivant
            </PaginationButton>
          </PaginationContainer>
        )}
      </SectionContainer>

      {/* LOADING ET ERREURS */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded shadow-lg">
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {/* TUTORIEL */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-y-auto">
            <TutorialOverlay 
              steps={tutorialSteps} 
              onClose={() => setShowTutorial(false)} 
            />
          </div>
        </div>
      )}

      <div className="fixed bottom-4 right-4">
        <TutorialButton onClick={() => setShowTutorial(true)}>
          Voir le tutoriel
        </TutorialButton>
      </div>

      {/* BOUTON SCROLL VERS LE HAUT */}
      {isScrollVisible && (
        <button
          className="fixed bottom-20 right-4 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-secondary transition-colors duration-200"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* VIDÉO TUTORIEL */}
      <VideoContainer>
        <h3>Tutoriel vidéo</h3>
        <div className="video-wrapper">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/NerjVRmP7TA"
            title="Tutoriel vidéo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </VideoContainer>
    </PageContainer>
  );
}

export default memo(CasesPage);