import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import axios from '../utils/axiosConfig';
import styled from 'styled-components';
import { Save, ArrowLeft, Image as ImageIcon, Type, Smartphone, Monitor } from 'lucide-react';

// ==================== STYLED COMPONENTS OPTIMISÉS MOBILE ====================

const MobileEditorContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
  padding: 0;
  display: flex;
  flex-direction: column;
  
  /* Gestion mobile avec safe area */
  @media (max-width: 768px) {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    min-height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom));
  }
`;

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: ${props => props.theme.card};
  border-bottom: 1px solid ${props => props.theme.border};
  box-shadow: 0 2px 8px ${props => props.theme.shadow};
  position: sticky;
  top: 0;
  z-index: 100;
  
  @media (max-width: 768px) {
    padding: 1rem;
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    right: 0;
    background: ${props => props.theme.card};
    backdrop-filter: blur(10px);
  }
`;

const MobileHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    gap: 0.75rem;
  }
`;

const MobileBackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 44px;
  min-width: 44px;
  
  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 10px;
    
    &:active {
      background: ${props => props.theme.hover};
      transform: scale(0.95);
    }
  }
  
  &:hover {
    background: ${props => props.theme.hover};
    border-color: ${props => props.theme.primary};
    
    @media (max-width: 768px) {
      background: transparent;
      border-color: ${props => props.theme.border};
    }
  }
`;

const MobileTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.25rem;
    
    /* Tronque le titre s'il est trop long */
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  @media (max-width: 480px) {
    font-size: 1.1rem;
    max-width: 150px;
  }
`;

const MobileSaveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  min-height: 44px;
  
  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
    border-radius: 10px;
    font-size: 0.85rem;
    
    &:active {
      background: ${props => props.theme.primaryHover || props.theme.primary};
      transform: scale(0.95);
    }
  }
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.primaryHover || props.theme.primary};
    transform: translateY(-1px);
    box-shadow: 0 4px 12px ${props => props.theme.shadow};
    
    @media (max-width: 768px) {
      transform: none;
      box-shadow: none;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const MobileContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background};
  
  @media (max-width: 768px) {
    margin-top: 80px; /* Compense le header fixe */
    padding-bottom: 20px;
  }
`;

const MobileTitleInputContainer = styled.div`
  padding: 2rem;
  background: ${props => props.theme.card};
  border-bottom: 1px solid ${props => props.theme.border};
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const MobileTitleInput = styled.input`
  width: 100%;
  padding: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  background: ${props => props.theme.background};
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  transition: all 0.2s ease;
  
  @media (max-width: 768px) {
    font-size: 16px; /* Évite le zoom sur iOS */
    padding: 1.25rem;
    border-radius: 12px;
  }
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
  
  &::placeholder {
    color: ${props => props.theme.textSecondary};
    font-weight: 400;
  }
`;

const MobileEditorWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  background: ${props => props.theme.background};
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
  
  /* Styles pour l'éditeur TinyMCE */
  .tox .tox-editor-header {
    @media (max-width: 768px) {
      position: sticky !important;
      top: 0 !important;
      z-index: 50 !important;
      background: ${props => props.theme.card} !important;
      border-bottom: 1px solid ${props => props.theme.border} !important;
    }
  }
  
  .tox .tox-toolbar {
    @media (max-width: 768px) {
      flex-wrap: wrap !important;
      padding: 8px !important;
    }
  }
  
  .tox .tox-toolbar__group {
    @media (max-width: 768px) {
      margin: 2px !important;
    }
  }
  
  .tox .tox-tbtn {
    @media (max-width: 768px) {
      min-height: 44px !important;
      min-width: 44px !important;
      margin: 1px !important;
    }
  }
  
  .tox .tox-edit-area {
    @media (max-width: 768px) {
      padding: 8px !important;
    }
  }
`;

const MobileViewToggle = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: ${props => props.theme.surface};
    border-bottom: 1px solid ${props => props.theme.border};
  }
`;

const MobileViewButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? 'white' : props.theme.text};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
  font-weight: 500;
  min-height: 44px;
  
  &:active {
    transform: scale(0.95);
  }
`;

const MobileLoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const MobileLoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid ${props => props.theme.border};
  border-top: 4px solid ${props => props.theme.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const MobileErrorMessage = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: #ef4444;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  
  @media (max-width: 768px) {
    bottom: env(safe-area-inset-bottom, 20px);
    left: 16px;
    right: 16px;
    border-radius: 12px;
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

const SheetEditor = () => {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);
  
  // États
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileView, setMobileView] = useState('edit'); // 'edit' ou 'preview'

  // Détection mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Chargement initial
  useEffect(() => {
    const loadSheet = async () => {
      if (!caseId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        const response = await axios.get(`/cases/${caseId}/sheet`);
        
        if (response.data) {
          setTitle(response.data.title || '');
          setContent(response.data.content || '');
        }
      } catch (error) {
        console.error('Erreur lors du chargement de la fiche:', error);
        setError('Erreur lors du chargement de la fiche');
      } finally {
        setIsLoading(false);
      }
    };

    loadSheet();
  }, [caseId]);

  // Gestion du changement de titre
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  // Gestion du changement de contenu
  const handleEditorChange = (content) => {
    setContent(content);
  };

  // Sauvegarde
  const handleSave = async () => {
    if (!caseId) return;
    
    setIsSaving(true);
    setError('');
    
    try {
      await axios.post(`/cases/${caseId}/sheet`, {
        title: title.trim(),
        content: content
      });
      
      // Notification de succès
      if (isMobile) {
        // Vibration si disponible
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      }
      
      // Redirection après sauvegarde
      navigate('/cases');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      setError('Erreur lors de la sauvegarde de la fiche');
    } finally {
      setIsSaving(false);
    }
  };

  // Gestion de l'upload d'images
  const handleImageUpload = (blobInfo, progress) => new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    axios.post(`/cases/${caseId}/sheet-images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progress(percentCompleted);
      }
    })
    .then(response => {
      if (response.data && response.data.location) {
        resolve(response.data.location);
      } else {
        reject('URL invalide reçue du serveur');
      }
    })
    .catch(error => {
      console.error('Erreur upload:', error);
      reject(`Erreur d'upload: ${error.message}`);
    });
  });

  // Configuration de l'éditeur TinyMCE optimisée pour mobile
  const editorConfig = {
    height: isMobile ? 400 : 600,
    menubar: !isMobile, // Masque la barre de menu sur mobile
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'help', 'wordcount'
    ],
    toolbar: isMobile 
      ? 'undo redo | bold italic | bullist numlist | image link | removeformat'
      : 'undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help | image link',
    content_style: `
      body { 
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
        font-size: ${isMobile ? '16px' : '14px'};
        line-height: 1.6;
        margin: 1rem;
      }
      img {
        max-width: 100%;
        height: auto;
      }
    `,
    images_upload_handler: handleImageUpload,
    image_advtab: true,
    automatic_uploads: true,
    mobile: {
      theme: 'mobile',
      plugins: ['autosave', 'lists', 'autolink'],
      toolbar: ['undo', 'bold', 'italic', 'styleselect']
    },
    // Configuration spécifique mobile
    toolbar_mode: isMobile ? 'sliding' : 'floating',
    contextmenu: !isMobile,
    branding: false,
    resize: !isMobile,
    statusbar: !isMobile
  };

  // Retour arrière
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/cases');
    }
  };

  // Affichage du contenu en fonction de la vue mobile
  const renderContent = () => {
    if (!isMobile || mobileView === 'edit') {
      return (
        <Editor
          onInit={(evt, editor) => editorRef.current = editor}
          apiKey="q9documtjyjhlnuja8z0ggda10ikahcpntobydvkzka5d07p"
          value={content}
          init={editorConfig}
          onEditorChange={handleEditorChange}
        />
      );
    }
    
    // Vue preview sur mobile
    return (
      <div 
        style={{
          background: '#fff',
          padding: '1rem',
          borderRadius: '8px',
          border: '1px solid var(--border-color)',
          minHeight: '400px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6'
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <MobileEditorContainer>
      {/* Header */}
      <MobileHeader>
        <MobileHeaderLeft>
          <MobileBackButton onClick={handleBack}>
            <ArrowLeft size={20} />
          </MobileBackButton>
          <MobileTitle>Éditeur de fiche</MobileTitle>
        </MobileHeaderLeft>
        
        <MobileSaveButton 
          onClick={handleSave} 
          disabled={isSaving || isLoading}
        >
          <Save size={16} />
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
        </MobileSaveButton>
      </MobileHeader>

      {/* Toggle vue mobile */}
      <MobileViewToggle>
        <MobileViewButton 
          active={mobileView === 'edit'} 
          onClick={() => setMobileView('edit')}
        >
          <Type size={16} />
          Édition
        </MobileViewButton>
        <MobileViewButton 
          active={mobileView === 'preview'} 
          onClick={() => setMobileView('preview')}
        >
          <Monitor size={16} />
          Aperçu
        </MobileViewButton>
      </MobileViewToggle>

      {/* Zone de contenu */}
      <MobileContentArea>
        {/* Champ titre */}
        <MobileTitleInputContainer>
          <MobileTitleInput 
            type="text" 
            value={title} 
            onChange={handleTitleChange} 
            placeholder="Titre de la fiche récapitulative"
            disabled={isLoading}
          />
        </MobileTitleInputContainer>

        {/* Éditeur */}
        <MobileEditorWrapper>
          {renderContent()}
        </MobileEditorWrapper>
      </MobileContentArea>

      {/* Loading overlay */}
      {(isLoading || isSaving) && (
        <MobileLoadingOverlay>
          <MobileLoadingSpinner />
        </MobileLoadingOverlay>
      )}

      {/* Message d'erreur */}
      {error && (
        <MobileErrorMessage>
          {error}
          <button 
            onClick={() => setError('')}
            style={{
              float: 'right',
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.2rem',
              padding: '0 0.5rem'
            }}
          >
            ×
          </button>
        </MobileErrorMessage>
      )}
    </MobileEditorContainer>
  );
};

export default SheetEditor;