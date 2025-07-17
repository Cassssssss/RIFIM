// pages/CasesPage.js - VERSION STYLISÉE COMPLÈTE
import React, { useState, useEffect, useCallback } from 'react';
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
  Plus, 
  X, 
  Image as ImageIcon,
  FileText,
  Settings,
  Download
} from 'lucide-react';
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

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.75rem;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: ${props => props.theme.card};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${props => props.theme.shadow};
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${ImageWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background-color: #dc2626;
    transform: scale(1.1);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const MainImageLabel = styled.div`
  position: absolute;
  bottom: 0.25rem;
  left: 0.25rem;
  background-color: rgba(16, 185, 129, 0.9);
  color: white;
  padding: 0.125rem 0.375rem;
  font-size: 0.625rem;
  border-radius: 4px;
  font-weight: 600;
  backdrop-filter: blur(4px);
`;

const SetMainButton = styled.button`
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
  background-color: rgba(16, 185, 129, 0.9);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background-color: rgba(16, 185, 129, 1);
  }
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

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  gap: 0.25rem;
`;

const CaseActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
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

const AddTagSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const AddTagButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
    transform: translateY(-1px);
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const TagInput = styled.input`
  padding: 0.375rem 0.75rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 6px;
  font-size: 0.75rem;
  width: 140px;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const TagForm = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubmitTagButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const CancelTagButton = styled.button`
  background-color: #6b7280;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #4b5563;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LabeledField = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${props => props.theme.text};
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

function CasesPage() {
  const [title, setTitle] = useState('');
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState('');
  const [images, setImages] = useState({});
  const [cases, setCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [answer, setAnswer] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [mainImage, setMainImage] = useState('');
  const [folderMainImages, setFolderMainImages] = useState({});

  // États de gestion des tags par cas
  const [caseNewTags, setCaseNewTags] = useState({});
  const [caseIsAddingTag, setCaseIsAddingTag] = useState({});

  const fetchCases = useCallback(async (page = 1) => {
    try {
      const response = await axios.get(`/cases?page=${page}&limit=6`);
      setCases(response.data.cases);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erreur lors de la récupération des cas:', error);
    }
  }, []);

  useEffect(() => {
    fetchCases(1);
  }, [fetchCases]);

  const filteredCases = cases.filter(cas => 
    cas.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFolder = () => {
    if (newFolderName.trim() && !folders.includes(newFolderName.trim())) {
      setFolders([...folders, newFolderName.trim()]);
      setNewFolderName('');
    }
  };

  const removeFolder = (folderToRemove) => {
    setFolders(folders.filter(folder => folder !== folderToRemove));
    const newImages = { ...images };
    delete newImages[folderToRemove];
    setImages(newImages);
  };

  const handleImageUpload = (event, folder) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      const newImages = { ...images };
      if (!newImages[folder]) {
        newImages[folder] = [];
      }
      
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages[folder] = [...(newImages[folder] || []), e.target.result];
          setImages({ ...newImages });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (folder, imageIndex) => {
    const newImages = { ...images };
    newImages[folder] = newImages[folder].filter((_, index) => index !== imageIndex);
    setImages(newImages);
  };

  const setAsMainImage = (folder, imageIndex) => {
    const imageUrl = images[folder][imageIndex];
    if (folder === 'principal') {
      setMainImage(imageUrl);
    } else {
      setFolderMainImages({
        ...folderMainImages,
        [folder]: imageUrl
      });
    }
  };

  const createCase = async () => {
    if (!title.trim()) {
      alert('Veuillez entrer un titre pour le cas');
      return;
    }

    try {
      const caseData = {
        title: title.trim(),
        folders,
        images,
        mainImage,
        folderMainImages,
        difficulty,
        answer: answer.trim(),
        tags
      };

      await axios.post('/cases', caseData);
      
      // Réinitialiser le formulaire
      setTitle('');
      setFolders([]);
      setNewFolderName('');
      setImages({});
      setDifficulty(1);
      setAnswer('');
      setTags([]);
      setMainImage('');
      setFolderMainImages({});
      
      // Recharger les cas
      fetchCases(currentPage);
      
      alert('Cas créé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la création du cas:', error);
      alert('Erreur lors de la création du cas');
    }
  };

  const deleteCase = async (caseId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cas ?')) {
      try {
        await axios.delete(`/cases/${caseId}`);
        fetchCases(currentPage);
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du cas');
      }
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setIsAddingTag(false);
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagSubmit = (e) => {
    e.preventDefault();
    addTag();
  };

  // Gestion des tags pour les cas existants
  const handleCaseAddTag = async (caseId, tag) => {
    if (!tag || !tag.trim()) return;
    
    try {
      const response = await axios.post(`/cases/${caseId}/tags`, { tag: tag.trim() });
      
      setCases(prevCases => 
        prevCases.map(c => 
          c._id === caseId 
            ? { ...c, tags: response.data.tags }
            : c
        )
      );
      
      setCaseNewTags(prev => ({ ...prev, [caseId]: '' }));
      setCaseIsAddingTag(prev => ({ ...prev, [caseId]: false }));
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout du tag:', error);
      alert('Erreur lors de l\'ajout du tag');
    }
  };

  const handleCaseRemoveTag = async (caseId, tagToRemove) => {
    try {
      const response = await axios.delete(`/cases/${caseId}/tags/${encodeURIComponent(tagToRemove)}`);
      
      setCases(prevCases => 
        prevCases.map(c => 
          c._id === caseId 
            ? { ...c, tags: response.data.tags }
            : c
        )
      );
      
    } catch (error) {
      console.error('Erreur lors de la suppression du tag:', error);
      alert('Erreur lors de la suppression du tag');
    }
  };

  const handleCaseTagSubmit = (e, caseId) => {
    e.preventDefault();
    const tag = caseNewTags[caseId];
    if (tag) {
      handleCaseAddTag(caseId, tag);
    }
  };

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
            placeholder="Titre du cas"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button variant="primary" size="large" onClick={createCase}>
            <Plus />
            Créer le cas
          </Button>
        </InputGroup>

        {/* GESTION DES TAGS */}
        <div>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)' }}>Tags :</h4>
          <TagsContainer>
            {tags.map((tag, index) => (
              <Tag key={index}>
                {tag}
                <RemoveTagButton onClick={() => removeTag(tag)}>
                  <X />
                </RemoveTagButton>
              </Tag>
            ))}
          </TagsContainer>
          
          <AddTagSection>
            {isAddingTag ? (
              <TagForm onSubmit={handleTagSubmit}>
                <TagInput
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nouveau tag"
                  autoFocus
                />
                <SubmitTagButton type="submit">
                  <Plus />
                </SubmitTagButton>
                <CancelTagButton 
                  type="button"
                  onClick={() => {
                    setIsAddingTag(false);
                    setNewTag('');
                  }}
                >
                  <X />
                </CancelTagButton>
              </TagForm>
            ) : (
              <AddTagButton onClick={() => setIsAddingTag(true)}>
                <Plus />
                Ajouter tag
              </AddTagButton>
            )}
          </AddTagSection>
        </div>

        {/* DIFFICULTÉ ET RÉPONSE */}
        <GridContainer>
          <LabeledField>
            <label>Difficulté (1-5 étoiles) :</label>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
            >
              {[1,2,3,4,5].map(num => (
                <option key={num} value={num}>{num} étoile{num > 1 ? 's' : ''}</option>
              ))}
            </Select>
          </LabeledField>
          <LabeledField>
            <label>Réponse/Diagnostic :</label>
            <Input
              type="text"
              placeholder="Réponse ou diagnostic"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </LabeledField>
        </GridContainer>

        {/* GESTION DES DOSSIERS */}
        <div style={{ marginTop: '2rem' }}>
          <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-color)' }}>Dossiers d'images :</h4>
          <InputGroup>
            <Input
              type="text"
              placeholder="Nom du nouveau dossier"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            <Button variant="secondary" onClick={addFolder}>
              <Plus />
              Ajouter dossier
            </Button>
          </InputGroup>
        </div>

        {/* DOSSIERS D'IMAGES */}
        {folders.map((folder) => (
          <FolderContainer key={folder}>
            <FolderHeader>
              <FolderTitle>
                <ImageIcon />
                {folder}
              </FolderTitle>
              <FolderActions>
                <UploadButton htmlFor={`upload-${folder}`}>
                  <Upload />
                  Ajouter images
                </UploadButton>
                <FileInput
                  id={`upload-${folder}`}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, folder)}
                />
                <Button 
                  variant="danger" 
                  onClick={() => removeFolder(folder)}
                >
                  <Trash2 />
                  Supprimer
                </Button>
              </FolderActions>
            </FolderHeader>

            {images[folder] && images[folder].length > 0 && (
              <ImagesGrid>
                {images[folder].map((image, index) => (
                  <ImageWrapper key={index}>
                    <PreviewImage src={image} alt={`${folder}-${index}`} />
                    <RemoveImageButton 
                      onClick={() => removeImage(folder, index)}
                    >
                      <X />
                    </RemoveImageButton>
                    {((folder === 'principal' && image === mainImage) || 
                      (folder !== 'principal' && folderMainImages[folder] === image)) && (
                      <MainImageLabel>Principal</MainImageLabel>
                    )}
                    <SetMainButton
                      onClick={() => setAsMainImage(folder, index)}
                    >
                      Principal
                    </SetMainButton>
                  </ImageWrapper>
                ))}
              </ImagesGrid>
            )}
          </FolderContainer>
        ))}
      </SectionContainer>

      {/* SECTION LISTE DES CAS */}
      <SectionContainer>
        <SectionTitle>
          <FileText />
          Mes cas créés
        </SectionTitle>

        <CasesGrid>
          {filteredCases.map((cas) => (
            <CaseCard key={cas._id}>
              <CaseImage 
                src={cas.mainImage || (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) || '/images/default.jpg'}
                alt={cas.title}
                loading="lazy"
              />
              
              <CaseContent>
                <CaseTitle>{cas.title}</CaseTitle>
                
                <StarRating>
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={20}
                      fill={index < cas.difficulty ? "gold" : "gray"}
                      stroke={index < cas.difficulty ? "gold" : "gray"}
                    />
                  ))}
                </StarRating>

                {/* SECTION TAGS AVEC GESTION */}
                <TagsContainer>
                  {cas.tags && cas.tags.map((tag, index) => (
                    <Tag key={index}>
                      {tag}
                      <RemoveTagButton 
                        onClick={() => handleCaseRemoveTag(cas._id, tag)}
                      >
                        <X />
                      </RemoveTagButton>
                    </Tag>
                  ))}
                </TagsContainer>
                
                <AddTagSection>
                  {caseIsAddingTag[cas._id] ? (
                    <TagForm onSubmit={(e) => handleCaseTagSubmit(e, cas._id)}>
                      <TagInput
                        type="text"
                        value={caseNewTags[cas._id] || ''}
                        onChange={(e) => setCaseNewTags(prev => ({ 
                          ...prev, 
                          [cas._id]: e.target.value 
                        }))}
                        placeholder="Nouveau tag"
                        autoFocus
                      />
                      <SubmitTagButton type="submit">
                        <Plus />
                      </SubmitTagButton>
                      <CancelTagButton 
                        type="button"
                        onClick={() => {
                          setCaseIsAddingTag(prev => ({ ...prev, [cas._id]: false }));
                          setCaseNewTags(prev => ({ ...prev, [cas._id]: '' }));
                        }}
                      >
                        <X />
                      </CancelTagButton>
                    </TagForm>
                  ) : (
                    <AddTagButton 
                      onClick={() => setCaseIsAddingTag(prev => ({ ...prev, [cas._id]: true }))}
                    >
                      <Plus />
                      Ajouter tag
                    </AddTagButton>
                  )}
                </AddTagSection>

                <CaseActions>
                  <CaseButton 
                    variant="primary"
                    onClick={() => window.open(`/radiology-viewer/${cas._id}`, '_blank')}
                  >
                    <Eye />
                    Voir
                  </CaseButton>
                  
                  <CaseButton 
                    variant="secondary"
                    onClick={() => window.open(`/create-sheet/${cas._id}`, '_blank')}
                  >
                    <Edit />
                    Fiche
                  </CaseButton>
                  
                  <CaseButton 
                    variant="secondary"
                    onClick={() => loadCaseForEditing(cas)}
                  >
                    <Settings />
                    Modifier
                  </CaseButton>
                  
                  <CaseButton 
                    variant="danger"
                    onClick={() => deleteCase(cas._id)}
                  >
                    <Trash2 />
                    Supprimer
                  </CaseButton>
                </CaseActions>
              </CaseContent>
            </CaseCard>
          ))}
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
    </PageContainer>
  );
}

export default CasesPage;