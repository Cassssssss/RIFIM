import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Star, StarHalf, Edit, Save, Upload, X, Folder, Image as ImageIcon, File, ArrowUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Trash2, Plus } from 'lucide-react';
import ImageViewer from '../components/ImageViewer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import * as S from './CasesPage.styles';
import { CasesGrid, FoldersSection } from './CasesPage.styles';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import styled from 'styled-components';
import TutorialOverlay from './TutorialOverlay';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
console.log('API_BASE_URL:', API_BASE_URL);
const SPACES_URL = process.env.REACT_APP_SPACES_URL || 'https://rifim.lon1.digitaloceanspaces.com';
const UPLOAD_BASE_URL = process.env.REACT_APP_UPLOAD_URL || 'http://localhost:5002/uploads';

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


const CollapsibleImageGallery = memo(({ folder, images, onImageClick, onDeleteImage, caseId, fetchFolderMainImage, onReorderImages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoadError, setImageLoadError] = useState({});
  const [folderMainImage, setFolderMainImage] = useState(null);

  useEffect(() => {
    const loadFolderMainImage = async () => {
      const imageUrl = await fetchFolderMainImage(caseId, folder);
      setFolderMainImage(imageUrl);
    };
    loadFolderMainImage();
  }, [caseId, folder, fetchFolderMainImage]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    const reorderedImages = Array.from(images);
    const [movedImage] = reorderedImages.splice(sourceIndex, 1);
    reorderedImages.splice(destinationIndex, 0, movedImage);
    
    onReorderImages(folder, reorderedImages);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <S.GalleryContainer>
        <S.GalleryHeader onClick={() => setIsOpen(!isOpen)}>
          <h3>{folder}</h3>
          {folderMainImage && (
            <S.FolderMainImage 
              src={folderMainImage} 
              alt={`Image principale de ${folder}`} 
              onError={() => setImageLoadError(prev => ({ ...prev, [folderMainImage]: true }))}
            />
          )}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </S.GalleryHeader>
        
        {isOpen && (
          <Droppable droppableId={folder} direction="horizontal">
            {(provided) => (
              <S.ImagesGrid
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {images.map((image, index) => {
                  const draggableId = `draggable-${folder}-${index}`;
                  return (
                    <Draggable 
                      key={draggableId}
                      draggableId={draggableId}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <S.ImageWrapper
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.5 : 1,
                          }}
                        >
                          <S.ThumbnailImage
                            src={imageLoadError[image] ? '/images/placeholder.jpg' : image}
                            alt={`${folder} image ${index}`}
                            onClick={() => onImageClick(folder, index)}
                            onError={() => setImageLoadError(prev => ({ ...prev, [image]: true }))}
                          />
                          <S.DeleteButton onClick={() => onDeleteImage(caseId, folder, image)}>
                            <X size={12} />
                          </S.DeleteButton>
                        </S.ImageWrapper>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </S.ImagesGrid>
            )}
          </Droppable>
        )}
      </S.GalleryContainer>
    </DragDropContext>
  );
});

const CaseCard = memo(({ cas, onUpdateDifficulty, onUpdateAnswer, onAddTag, onRemoveTag, onDeleteCase, onLoadCase, onTogglePublic }) => {
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
    onAddTag(cas._id, newTag);
    setNewTag('');
  }, [cas._id, newTag, onAddTag]);

  const handleTogglePublic = async () => {
    try {
      await onTogglePublic(cas._id);
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du cas:', error);
    }
  };

  return (
    <S.CaseCard>
      <Link to={`/radiology-viewer/${cas._id}`}>
        <S.CaseImage 
          src={cas.mainImage ? cas.mainImage : (cas.folders && cas.folders[0] && cas.folderMainImages && cas.folderMainImages[cas.folders[0]]) || '/images/default.jpg'}
          alt={cas.title || 'Image sans titre'} 
        />
        <S.CaseTitle>{cas.title || 'Cas sans titre'}</S.CaseTitle>
      </Link>
      <StarRating
        rating={cas.difficulty || 1}
        onRatingChange={(newRating) => onUpdateDifficulty(cas._id, newRating)}
      />
      <S.AnswerSection>
        {editingAnswer && editingAnswer.id === cas._id ? (
          <>
            <S.AnswerInput
              value={editingAnswer.value}
              onChange={(e) => setEditingAnswer({ ...editingAnswer, value: e.target.value })}
              placeholder="Entrez la réponse..."
            />
            <S.Button onClick={handleAnswerSave}>
              <Save size={16} />
              Sauvegarder
            </S.Button>
          </>
        ) : (
          <>
            <S.AnswerText>{cas.answer || 'Pas de réponse'}</S.AnswerText>
            <S.Button onClick={handleAnswerEdit}>
              <Edit size={16} />
              Modifier la réponse
            </S.Button>
          </>
        )}
      </S.AnswerSection>
      <S.TagsContainer>
        {cas.tags && cas.tags.map(tag => (
          <S.Tag key={tag}>
            {tag}
            <S.RemoveTagButton onClick={() => onRemoveTag(cas._id, tag)}>
              <X size={12} />
            </S.RemoveTagButton>
          </S.Tag>
        ))}
        <S.AddTagForm onSubmit={handleAddTag}>
          <S.TagInput
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nouveau tag"
          />
          <S.AddTagButton type="submit">
            <Plus size={16} />
          </S.AddTagButton>
        </S.AddTagForm>
      </S.TagsContainer>
      <S.Button as={Link} to={`/create-sheet/${cas._id}`}>Créer fiche</S.Button>
      <S.Button onClick={() => onLoadCase(cas._id)}>Charger</S.Button>
      <S.Button onClick={() => onDeleteCase(cas._id)}>Supprimer</S.Button>
      <S.Button onClick={handleTogglePublic}>
        {cas.public ? 'Rendre privé' : 'Rendre public'}
      </S.Button>
    </S.CaseCard>
  );
});

const StarRating = memo(({ rating, onRatingChange }) => {
  return (
    <S.StarRatingContainer>
      {[1, 2, 3, 4, 5].map((star) => (
        <S.Star
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
        </S.Star>
      ))}
    </S.StarRatingContainer>
  );
});

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
  const [imageDetails, setImageDetails] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    console.log('Cases mises à jour:', cases);
  }, [cases]);

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
      console.error('Erreur détaillée lors de la récupération des cas:', error);
      setError('Erreur lors de la récupération des cas');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleImageUpload = useCallback((event, folder) => {
    const files = Array.from(event.target.files);
    setNewImages(prev => ({
      ...prev,
      [folder]: [
        ...(prev[folder] || []),
        ...files.map(file => ({
          file,
          preview: URL.createObjectURL(file)
        }))
      ]
    }));
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

  const handleImageClick = useCallback((folder, index) => {
    setSelectedImage(selectedCase.images[folder][index]);
    setSelectedImageIndex(index);
    setCurrentFolder(folder);
  }, [selectedCase]);

  const closeImage = useCallback(() => {
    setSelectedImage(null);
    setSelectedImageIndex(null);
    setCurrentFolder(null);
  }, []);

  const navigateImage = useCallback((direction) => {
    if (!currentFolder || selectedImageIndex === null || !selectedCase || !selectedCase.images) return;
    const images = selectedCase.images[currentFolder];
    let newIndex = selectedImageIndex + direction;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setSelectedImage(images[newIndex]);
    setSelectedImageIndex(newIndex);
  }, [currentFolder, selectedImageIndex, selectedCase]);

  const removeImage = useCallback((folder, index) => {
    setNewImages(prev => ({
      ...prev,
      [folder]: prev[folder].filter((_, i) => i !== index)
    }));
  }, []);

  const fetchFolderMainImage = useCallback(async (caseId, folder) => {
    try {
      const response = await axios.get(`/cases/${caseId}`);
      if (response.data && response.data.folderMainImages && response.data.folderMainImages[folder]) {
        return response.data.folderMainImages[folder];
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données du cas:', error);
    }
    return null;
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

  const addNewFolder = useCallback(async () => {
    if (!selectedCase || newFolderName.trim() === '') return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`/cases/${selectedCase._id}/folders`, { folderName: newFolderName });
      setCases(prevCases => prevCases.map(c => c._id === selectedCase._id ? response.data : c));
      setSelectedCase(response.data);
      setNewFolderName('');
    } catch (error) {
      setError('Erreur lors de l\'ajout d\'un nouveau dossier');
      console.error('Erreur lors de l\'ajout d\'un nouveau dossier:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCase, newFolderName]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedImage) {
        if (event.key === 'ArrowLeft') {
          navigateImage(-1);
        } else if (event.key === 'ArrowRight') {
          navigateImage(1);
        } else if (event.key === 'Escape') {
          closeImage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, navigateImage, closeImage]);

  const addImagesToCase = useCallback(async () => {
    if (!selectedCase) return;
    setIsLoading(true);
    setError(null);
    try {
      for (const [folder, images] of Object.entries(newImages)) {
        const formData = new FormData();
        images.forEach((image, index) => {
          formData.append('images', image.file);
        });
        formData.append('folder', folder);
  
        console.log('Envoi de formData:', Object.fromEntries(formData));
  
        const response = await axios.post(`/cases/${selectedCase._id}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Réponse du serveur:', response.data);
      }
      const updatedCase = await axios.get(`/cases/${selectedCase._id}`);
      setCases(prevCases => prevCases.map(c => c._id === selectedCase._id ? updatedCase.data : c));
      setSelectedCase(updatedCase.data);
      setNewImages({});
    } catch (error) {
      console.error('Erreur détaillée lors de l\'ajout des images:', error.response?.data || error.message);
      setError('Erreur lors de l\'ajout des images au cas');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCase, newImages]);
  
  const setMainImage = useCallback(async (event) => {
    const file = event.target.files[0];
    if (file && selectedCase) {
      setIsLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('mainImage', file);
        const response = await axios.post(`/cases/${selectedCase._id}/main-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setCases(prevCases => prevCases.map(c => c._id === selectedCase._id ? response.data : c));
        setSelectedCase(response.data);
      } catch (error) {
        setError('Erreur lors de la définition de l\'image principale');
        console.error('Erreur lors de la définition de l\'image principale:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedCase]);
  
  const setFolderMainImage = useCallback(async (event, folder) => {
    const file = event.target.files[0];
    if (file && selectedCase) {
      setIsLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('folderMainImage', file);
        formData.append('folder', folder);
        const response = await axios.post(`/cases/${selectedCase._id}/folder-main-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
  
        setCases(prevCases => prevCases.map(c => 
          c._id === selectedCase._id 
            ? response.data
            : c
        ));
  
        setSelectedCase(response.data);
  
      } catch (error) {
        setError('Erreur lors de la définition de l\'image principale du dossier');
        console.error('Erreur lors de la définition de l\'image principale du dossier:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedCase]);
  
  const deleteFolder = useCallback(async (folder) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le dossier "${folder}" ?`)) {
      try {
        await axios.delete(`/cases/${selectedCase._id}/folders/${folder}`);
        const updatedCase = await axios.get(`/cases/${selectedCase._id}`);
        setCases(prevCases => prevCases.map(c => c._id === selectedCase._id ? updatedCase.data : c));
        setSelectedCase(updatedCase.data);
      } catch (error) {
        console.error('Erreur lors de la suppression du dossier:', error);
        setError('Erreur lors de la suppression du dossier');
      }
    }
  }, [selectedCase]);

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
  
  const verifyImages = useCallback(async () => {
    if (!selectedCase) {
      alert("Veuillez sélectionner un cas d'abord.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/cases/${selectedCase._id}/images`);
      setImageDetails(response.data);
      console.log('Détails des images:', response.data);
    } catch (error) {
      console.error('Erreur lors de la vérification des images:', error);
      setError('Erreur lors de la vérification des images. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedCase]);
  
  const deleteExistingImage = useCallback(async (caseId, folder, imagePath) => {
    try {
      const fileName = imagePath.split('/').pop();
      await axios.delete(`/cases/${caseId}/images`, {
        data: { folder, fileName }
      });
      const updatedCase = await axios.get(`/cases/${caseId}`);
      setCases(prevCases => prevCases.map(c => c._id === caseId ? updatedCase.data : c));
      setSelectedCase(updatedCase.data);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      setError('Erreur lors de la suppression de l\'image');
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
        console.log('Visibilité du cas mise à jour avec succès');
      }
    } catch (error) {
      console.error('Erreur lors du changement de visibilité du cas:', error);
    }
  }, []);

  const tutorialSteps = [
    {
      image: "/tutorials/Screen_Cases1.png",
      description: <> Te voici dans la page d'importation de cas pédagogique, merci pour l'effort :).
      Pour commencer, rentre le titre de ton nouveau cas (par exemple "tuberculose") dans l'encadré de texte prévu à cet effet (flèche 1)
      puis appuie sur "Créer un nouveau cas", ici je l'ai nommé "Nouveau_Cas_1".
      Ajoute un "dossier" pour chaque séquence que tu voudras ajouter (T1, T2 etc, logique, mais en scanner une série en coupe coronal et une série en coupe sagittale sont considérées
      comme deux séquences différentes car il n'est pas possible de faire de reconstruction MPR sur ce site malheureusement), donc un dossier= une séquence, ici on a donc un dossier "T1" (flèche 2).  </>
    },

    {
      image: "/tutorials/Screen_Cases2.png",
      description: <>Ici on a donc créé 3 dossiers (donc 3 séquences) pour le cas "Exemple" (ça aurait pu être "tuberculose" ou "Neurocysticercose" ou que sais-je). Pour choisir l'image représentative du cas tu cliques sur "Choisir l'image principale du cas" (flèche 1) et tu choisis l'image que tu veux. 
      Tu ajoutes les images que tu possèdes sur ton ordinateur en cliquant sur le bouton "Ajouter des images" (flèche 2). L'image principale (Flèche 3) correspond à l'image principale du dossier qui sera celle qui représentera la séquence en question lorsque tu consulteras le cas.
      Tu peux supprimer une séquence avec le bouton "Supprimer le dossier" </>
    },
    {
      image: "/tutorials/Screen_Cases3.png",
      description: <> Quand tu auras sélectionné les images à importer pour ta séquence elles seront affichées de cette manière (flèche 1). Si tu veux en supprimer une libre à toi.
      Lorsque tu feras ajouter une image principale du cas (flèche 2) ou Image principale du dossier (flèche 3), elle ne seront pas affichées elles seront ajoutées automatiquement au cas ne t'en fais pas.
      Une fois que tu es satisfait de ta sélection d'images pour chaque séquence tu peux appuyer sur "Ajouter les images au cas" (flèche 4) et c'est nikel (yes).  </>
    },
    {
      image: "/tutorials/Screen_Cases4.png",
      description: <> En bas de la page, quand tu es sur ton cas (ou charge le si tu n'es plus dessus (flèche 1)), clique sur le menu dépliant de la séquence de ton choix (flèche 2) pour pouvoir voir les images correspondant à cette séquence.
      De nouveau si une ne te plais pas, supprime là si tu le souhaites.
      Juste en dessous tu peux vérifier l'image principale de dossier et voir si elle te correspond (flèches 3). Clique également sur le nombre d'étoile qui correspond à la difficulté selon toi (tkt c'est à la louche).
      Comme pour les questionnaires, si tu estimes que ton cas est sympa et intéressant, partage le sur l'espace public (do it) (flèche 5).
      Tu peux également ajouter des tags pour faciliter la recherche de ton cas (flèche 6).
      Modifie ensuite la réponse du cas (flèche 7) qui sera la réponse lorsque l'utilisateur cliquera sur "Voir la réponse" (ici tuberculose (souvent la même chose que le titre)) lors de la consultation du cas (il y a un mode pour ne pas se faire spoiler le titre du cas ne t'inquiète pas tu peux mettre le titre que tu veux ça ne gachera pas la surprise). 
      Et enfin, tu as la possibilité de faire une petite fiche récapitulative du cas que l'utilisateur qui s'entraîne sur ton cas pourra aller consulter après avoir affiché la réponse (c'est important pour la pédagogie fais pas un truc long mais 2/3 images clés avec de la légende et des explications sur la patho ce serait carré).</>
    }
  ];
  
  const filteredCases = cases.filter(cas => 
    cas.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
// Ajoutez cette fonction dans CasesPage.js, avant le return
const handleReorderImages = useCallback(async (folder, reorderedImages) => {
  if (!selectedCase) return;
  
  try {
    // Mettre à jour l'état local immédiatement pour une meilleure UX
    setSelectedCase(prevCase => ({
      ...prevCase,
      images: {
        ...prevCase.images,
        [folder]: reorderedImages
      }
    }));

    // Mettre à jour les cas dans la liste
    setCases(prevCases => prevCases.map(c => 
      c._id === selectedCase._id 
        ? {
            ...c,
            images: {
              ...c.images,
              [folder]: reorderedImages
            }
          }
        : c
    ));

    // Appeler l'API avec la nouvelle route
    const response = await axios.patch(`/cases/${selectedCase._id}/reorder-images`, {
      folder,
      images: reorderedImages
    });

    if (!response.data) {
      throw new Error('Échec de la mise à jour');
    }

  } catch (error) {
    console.error('Erreur lors de la réorganisation des images:', error);
    // Recharger le cas en cas d'erreur
    await loadCase(selectedCase._id);
  }
}, [selectedCase, loadCase]);

  return (
    <S.PageContainer>
      <S.Title>Création de cas</S.Title>
  
      <S.SearchInput
        type="text"
        placeholder="Rechercher un cas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
  
      <S.SectionContainer>
        <S.InputGroup>
          <S.Input
            type="text"
            value={newCaseTitle}
            onChange={(e) => setNewCaseTitle(e.target.value)}
            placeholder="Titre du nouveau cas"
          />
          <S.Button onClick={addNewCase}>Créer un nouveau cas</S.Button>
        </S.InputGroup>
  
        <S.Select
          value={selectedCase?._id || ''}
          onChange={(e) => loadCase(e.target.value)}
        >
          <option value="">Sélectionner un cas</option>
          {cases.map(cas => (
            <option key={cas._id} value={cas._id}>{cas.title}</option>
          ))}
        </S.Select>
      </S.SectionContainer>
  
      {selectedCase && (
        <S.SectionContainer>
          <S.InputGroup>
            <S.UploadButton>
              <ImageIcon size={20} style={{ marginRight: '10px' }} />
              Choisir l'image principale du cas
              <S.FileInput
                type="file"
                accept="image/*"
                onChange={setMainImage}
              />
            </S.UploadButton>
          </S.InputGroup>
  
          <S.InputGroup>
            <S.Input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom du nouveau dossier"
            />
            <S.Button onClick={addNewFolder}>
              <Folder size={20} style={{ marginRight: '10px' }} />
              Ajouter un dossier
            </S.Button>
          </S.InputGroup>
  
          {selectedCase.folders.map(folder => (
            <S.FolderContainer key={folder}>
              <S.FolderHeader>
                <S.FolderTitle>{folder}</S.FolderTitle>
                <S.FolderActions>
                  <S.UploadButton>
                    <Upload size={20} style={{ marginRight: '10px' }} />
                    Ajouter des images {folder}
                    <S.FileInput 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={(e) => handleImageUpload(e, folder)} 
                    />
                  </S.UploadButton>
                  <S.MainImageButton as="label">
                    <ImageIcon size={20} style={{ marginRight: '10px' }} />
                    Image principale du dossier
                    <S.FileInput
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFolderMainImage(e, folder)}
                    />
                  </S.MainImageButton>
                  <S.Button onClick={() => deleteFolder(folder)}>
                    <Trash2 size={20} style={{ marginRight: '10px' }} />
                    Supprimer le dossier
                  </S.Button>
                </S.FolderActions>
              </S.FolderHeader>
              {newImages[folder] && newImages[folder].length > 0 && (
                <S.ImagePreviewContainer>
                  {newImages[folder].map((img, index) => (
                    <S.ImagePreview key={index}>
                      <S.PreviewImage src={img.preview} alt={`Preview ${index}`} />
                      <S.RemoveImageButton onClick={() => removeImage(folder, index)}>
                        <X size={12} />
                      </S.RemoveImageButton>
                    </S.ImagePreview>
                  ))}
                </S.ImagePreviewContainer>
              )}
            </S.FolderContainer>
          ))}
  
          <S.Button 
            onClick={addImagesToCase} 
            disabled={Object.values(newImages).every(arr => !arr || arr.length === 0)}
          >
            Ajouter les images au cas
          </S.Button>
        </S.SectionContainer>
      )}
  
      <S.CasesGrid>
        {filteredCases && filteredCases.length > 0 ? (
          filteredCases.map((cas) => (
            <CaseCard
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
      </S.CasesGrid>

      <S.FoldersSection>
      {selectedCase && selectedCase.images && (
  <S.SectionContainer>
    <h2>{selectedCase.title}</h2>
    {selectedCase.folders.map(folder => (
      selectedCase.images[folder] && (
        <CollapsibleImageGallery
          key={folder}
          folder={folder}
          images={selectedCase.images[folder]}
          onImageClick={(image, index) => handleImageClick(folder, index)}
          onDeleteImage={deleteExistingImage}
          caseId={selectedCase._id}
          fetchFolderMainImage={fetchFolderMainImage}
          onReorderImages={handleReorderImages} // Ajoutez cette ligne
        />
      )
    ))}
            {selectedImage && (
              <S.LargeImageContainer 
                onClick={closeImage}
                tabIndex={0}
                style={{ outline: 'none' }}
              >
                <S.LargeImage 
                  src={selectedImage} 
                  alt="Selected" 
                  onClick={(e) => e.stopPropagation()} 
                />
                <S.CloseButton onClick={(e) => { e.stopPropagation(); closeImage(); }}>
                  <X size={24} />
                </S.CloseButton>
                <S.NavigationButton onClick={(e) => { e.stopPropagation(); navigateImage(-1); }} style={{ left: '20px' }}>
                  <ChevronLeft size={24} />
                </S.NavigationButton>
                <S.NavigationButton onClick={(e) => { e.stopPropagation(); navigateImage(1); }} style={{ right: '20px' }}>
                  <ChevronRight size={24} />
                </S.NavigationButton>
              </S.LargeImageContainer>
            )}
          </S.SectionContainer>
        )}
      </S.FoldersSection>

      {imageDetails && (
        <S.SectionContainer>
          <h3>Détails des images :</h3>
          {Object.entries(imageDetails).map(([folder, images]) => (
            <div key={folder}>
              <h4>{folder} :</h4>
              <ul>
                {images.map((image, index) => (
                  <li key={index}>{image}</li>
                ))}
              </ul>
            </div>
          ))}
        </S.SectionContainer>
      )}

      {selectedCase && (
        <S.SectionContainer>
          <h3>Images principales des dossiers :</h3>
          {selectedCase.folders.map(folder => (
            <div key={folder}>
              <h4>{folder}</h4>
              {selectedCase.folderMainImages && selectedCase.folderMainImages[folder] ? (
                <img 
                  src={selectedCase.folderMainImages[folder]} 
                  alt={`Image principale de ${folder}`} 
                  style={{ maxWidth: '200px', maxHeight: '200px' }} 
                />
              ) : (
                <p>Pas d'image principale définie pour ce dossier</p>
              )}
            </div>
          ))}
        </S.SectionContainer>
      )}

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

      <PaginationContainer>
        <PaginationButton 
          onClick={() => fetchCases(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          Précédent
        </PaginationButton>
        <PaginationInfo>Page {currentPage} sur {totalPages}</PaginationInfo>
        <PaginationButton 
          onClick={() => fetchCases(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          Suivant
        </PaginationButton>
      </PaginationContainer>

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

      {/* Modal de confirmation pour les actions destructives */}
      {/* (À implémenter si nécessaire) */}

      {/* Système de notifications pour les actions réussies/échouées */}
      {/* (À implémenter si nécessaire) */}

      {/* Zone de défilement rapide vers le haut */}
      {isScrollVisible && (
        <button
          className="fixed bottom-20 right-4 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-secondary transition-colors duration-200"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={24} />
        </button>
      )}

      {/* Barre de progression pour les uploads */}
      {/* (À implémenter si nécessaire) */}

      {/* Section de statistiques */}
      {selectedCase && (
        <S.SectionContainer>
          <h3>Statistiques du cas :</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-bold mb-2">Nombre total d'images :</h4>
              <p>{Object.values(selectedCase.images || {}).reduce((acc, curr) => acc + curr.length, 0)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-bold mb-2">Nombre de dossiers :</h4>
              <p>{selectedCase.folders?.length || 0}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-bold mb-2">Status :</h4>
              <p>{selectedCase.public ? 'Public' : 'Privé'}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="font-bold mb-2">Difficulté :</h4>
              <p>{selectedCase.difficulty} / 5</p>
            </div>
          </div>
        </S.SectionContainer>
      )}

      {/* Section d'historique des modifications */}
      {/* (À implémenter si nécessaire) */}

      {/* Section de commentaires */}
      {/* (À implémenter si nécessaire) */}

      {/* Section de métadonnées */}
      {selectedCase && (
        <S.SectionContainer>
          <h3>Métadonnées :</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h4>Identifiant :</h4>
              <p>{selectedCase._id}</p>
            </div>
            <div>
              <h4>Titre :</h4>
              <p>{selectedCase.title}</p>
            </div>
            <div>
              <h4>Tags :</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCase.tags?.map(tag => (
                  <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </S.SectionContainer>
      )}

      {/* Section de debug (uniquement en développement) */}
      {process.env.NODE_ENV === 'development' && selectedCase && (
        <S.SectionContainer>
          <h3>Debug Info:</h3>
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
            {JSON.stringify(selectedCase, null, 2)}
          </pre>
          
        </S.SectionContainer>
      )}
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
    </S.PageContainer>
  );
}

export default memo(CasesPage);