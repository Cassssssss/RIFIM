import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import axios from '../utils/axiosConfig';
import styles from './RadiologyViewer.module.css';

const CollapsibleImageGallery = memo(({ folder, images, onImageClick, onDeleteImage }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryHeader} onClick={() => setIsOpen(!isOpen)}>
        <h3>{folder}</h3>
        {isOpen ? <ChevronUp /> : <ChevronDown />}
      </div>
      {isOpen && (
        <div className={styles.imagesGrid}>
          {images.map((image, index) => (
            <div key={index} className={styles.imageWrapper}>
              <img
                src={`${process.env.REACT_APP_SPACES_URL}/${image}`}
                alt={`${folder} image ${index}`}
                onClick={() => onImageClick(folder, index)}
                className={styles.thumbnailImage}
                loading="lazy"
              />
              <button onClick={() => onDeleteImage(folder, image)} className={styles.deleteButton}>
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

function RadiologyViewer() {
  const { caseId } = useParams();
  const [currentCase, setCurrentCase] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFolder, setCurrentFolder] = useState('');
  
  // MOBILE FIRST : Mode simple uniquement
  const [viewMode] = useState(1); // Toujours en mode 1 viewer
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  
  // Contrôles d'image simplifiés
  const [imageControls, setImageControls] = useState({
    scale: 1,
    contrast: 100,
    brightness: 100,
    translateX: 0,
    translateY: 0
  });
  
  const [isShortcutGuideVisible, setIsShortcutGuideVisible] = useState(false);
  const [isMobile] = useState(window.innerWidth < 768);

  const viewerRef = useRef(null);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // ==================== FONCTION loadImage SIMPLIFIÉE ==================== 
  
  const loadImage = useCallback((folder, index) => {
    if (currentCase && currentCase.images && currentCase.images[folder]) {
      const imagePath = currentCase.images[folder][index];
      if (imagePath) {
        const imageUrl = imagePath.startsWith('http') ? imagePath : `${process.env.REACT_APP_SPACES_URL}/${imagePath}`;
        
        if (viewerRef.current) {
          viewerRef.current.src = imageUrl;
          setCurrentIndex(index);
          setCurrentFolder(folder);
        }
      }
    }
  }, [currentCase]);

  // ==================== NAVIGATION SIMPLIFIÉE ==================== 
  
  const navigateImage = useCallback((direction) => {
    if (!currentCase || !currentFolder) return;
    
    const images = currentCase.images[currentFolder];
    if (!images || images.length === 0) return;
    
    let newIndex = currentIndex + direction;
    
    // Gestion des limites
    if (newIndex < 0) {
      newIndex = 0;
    } else if (newIndex >= images.length) {
      newIndex = images.length - 1;
    }
    
    if (newIndex !== currentIndex) {
      loadImage(currentFolder, newIndex);
    }
  }, [currentCase, currentFolder, currentIndex, loadImage]);

  // ==================== GESTION TOUCH MOBILE SIMPLIFIÉE ==================== 
  
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setTouchStartY(e.touches[0].clientY);
      setIsNavigating(false);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 1 && !isNavigating) {
      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      
      // Seuil pour déclencher la navigation
      if (Math.abs(deltaY) > 30) {
        setIsNavigating(true);
        const direction = deltaY > 0 ? 1 : -1;
        navigateImage(direction);
      }
    }
  }, [touchStartY, isNavigating, navigateImage]);

  const handleTouchEnd = useCallback(() => {
    setIsNavigating(false);
  }, []);

  // ==================== GESTION CLAVIER SIMPLIFIÉE ==================== 
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch(event.key) {
        case 'ArrowUp':
          event.preventDefault();
          navigateImage(-1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          navigateImage(1);
          break;
        case 'ArrowLeft':
          event.preventDefault();
          navigateImage(-1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          navigateImage(1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigateImage]);

  // ==================== GESTION MOLETTE SIMPLIFIÉE ==================== 
  
  const handleWheel = useCallback((e) => {
    // Seulement pour la navigation d'images, pas pour le zoom par défaut
    if (!e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const direction = e.deltaY > 0 ? 1 : -1;
      navigateImage(direction);
    }
  }, [navigateImage]);

  useEffect(() => {
    const viewer = viewerRef.current?.parentElement;
    if (viewer) {
      viewer.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        viewer.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  // ==================== CHARGEMENT DU CAS ==================== 

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(`/cases/${caseId}`);
        const caseData = response.data;
        setCurrentCase(caseData);
        
        // Initialiser avec le premier dossier
        if (caseData.folders && caseData.folders.length > 0) {
          const firstFolder = caseData.folders[0];
          setCurrentFolder(firstFolder);
          setCurrentIndex(0);
          
          // Charger la première image
          setTimeout(() => {
            loadImage(firstFolder, 0);
          }, 100);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du cas:', error);
      }
    };

    fetchCase();
  }, [caseId, loadImage]);

  // ==================== SÉLECTION DE DOSSIER ==================== 
  
  const selectFolder = useCallback((folder) => {
    if (folder !== currentFolder) {
      setCurrentFolder(folder);
      setCurrentIndex(0);
      loadImage(folder, 0);
    }
  }, [currentFolder, loadImage]);

  // ==================== RENDU DES DOSSIERS ==================== 
  
  const renderFolderThumbnails = useCallback(() => {
    if (!currentCase || !currentCase.folders) return null;

    return (
      <div className={styles.folderGrid}>
        {currentCase.folders.map(folder => (
          <div 
            key={folder} 
            className={`${styles.folderThumbnail} ${folder === currentFolder ? styles.active : ''}`}
            onClick={() => selectFolder(folder)}
          >
            <img 
              src={currentCase.folderMainImages?.[folder] || `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`}
              alt={`${folder} thumbnail`} 
              className={styles.folderThumbnailImage}
              onError={(e) => {
                if (e.target.src !== `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`) {
                  e.target.src = `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`;
                }
              }}
            />
            <div className={styles.folderThumbnailLabel}>{folder}</div>
          </div>
        ))}
      </div>
    );
  }, [currentCase, currentFolder, selectFolder]);

  // ==================== RENDU PRINCIPAL ==================== 
  
  if (!currentCase) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Chargement du cas...</p>
        </div>
      </div>
    );
  }

  const totalImages = currentCase.images?.[currentFolder]?.length || 0;
  
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.layout}>
          {renderFolderThumbnails()}
          
          <div className={styles.mainViewer}>
            <div 
              className={styles.singleViewer}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className={styles.folderLabel}>
                {currentFolder} - {currentIndex + 1}/{totalImages}
              </div>
              
              {currentFolder && totalImages > 0 ? (
                <img 
                  ref={viewerRef}
                  className={styles.image} 
                  alt={`Image médicale ${currentIndex + 1}`}
                  style={{
                    transform: `scale(${imageControls.scale}) translate(${imageControls.translateX}px, ${imageControls.translateY}px)`,
                    filter: `contrast(${imageControls.contrast}%) brightness(${imageControls.brightness}%)`
                  }}
                />
              ) : (
                <div className={styles.loading}>
                  <p>Sélectionnez un dossier pour voir les images</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.shortcutGuide}>
          <div 
            className={styles.shortcutIcon}
            onClick={() => setIsShortcutGuideVisible(!isShortcutGuideVisible)}
          >
            ?
          </div>
          {isShortcutGuideVisible && (
            <div className={`${styles.shortcutPopup} ${styles.visible}`}>
              <div className={styles.shortcutTitle}>Navigation</div>
              <ul className={styles.shortcutList}>
                <li><strong>↑ ↓</strong> Navigation images</li>
                <li><strong>← →</strong> Navigation images</li>
                <li><strong>Molette</strong> Navigation images</li>
                {isMobile && (
                  <>
                    <li><strong>Glisser haut/bas</strong> Navigation tactile</li>
                    <li><strong>Pincer</strong> Zoom (natif)</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
        
        <div>
          <button 
            className={styles.responseButton}
            onClick={() => setIsResponseVisible(!isResponseVisible)}
          >
            {isResponseVisible ? (
              <>
                <EyeOff size={16} />
                Cacher
              </>
            ) : (
              <>
                <Eye size={16} />
                Réponse
              </>
            )}
          </button>
          
          <Link to={`/sheet/${caseId}`} className={styles.sheetLink}>
            📋 Fiche
          </Link>
        </div>
      </div>

      {isResponseVisible && currentCase && currentCase.answer && (
        <div className={styles.responseBox}>
          <p className={styles.responseText}>{currentCase.answer}</p>
        </div>
      )}
    </div>
  );
}

export default memo(RadiologyViewer);