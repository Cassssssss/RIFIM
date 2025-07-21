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
  const [currentIndexLeft, setCurrentIndexLeft] = useState(0);
  const [currentIndexRight, setCurrentIndexRight] = useState(0);
  const [currentFolderLeft, setCurrentFolderLeft] = useState('');
  const [currentFolderRight, setCurrentFolderRight] = useState('');
  const [isSingleViewMode, setIsSingleViewMode] = useState(false);
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  const [imageControls, setImageControls] = useState({
    left: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 },
    right: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 },
    single: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 }
  });
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isAdjustingContrast, setIsAdjustingContrast] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [accumulatedDelta, setAccumulatedDelta] = useState(0);
  const [isShortcutGuideVisible, setIsShortcutGuideVisible] = useState(false);
  const [folderThumbnails, setFolderThumbnails] = useState({});
  const isTouchDevice = 'ontouchstart' in window;
  const [touchDistance, setTouchDistance] = useState(null);
  const [isMobile] = useState(window.innerWidth < 768);

  const leftViewerRef = useRef(null);
  const rightViewerRef = useRef(null);
  const singleViewerRef = useRef(null);

  const [touchStartPoints, setTouchStartPoints] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });

  const [theme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  // ==================== OPTIMISATIONS DE PERFORMANCE ====================
  
  // Cache pour les images et queue de préchargement
  const imageCache = useRef(new Map());
  const preloadQueue = useRef(new Set());

  // Fonction helper pour définir la source d'image
  const setImageSrc = useCallback((side, url, index) => {
    const imageElement = side === 'left' ? leftViewerRef.current :
                         side === 'right' ? rightViewerRef.current :
                         singleViewerRef.current;
    
    if (imageElement) {
      imageElement.src = url;
      if (side === 'left' || side === 'single') {
        setCurrentIndexLeft(index);
      } else if (side === 'right') {
        setCurrentIndexRight(index);
      }
    }
  }, []);

  // Préchargement des images adjacentes
  const preloadAdjacentImages = useCallback((folder, currentIndex) => {
    if (!currentCase?.images?.[folder]) return;
    
    const images = currentCase.images[folder];
    const preloadIndices = [];
    
    // Précharger 2 images avant et après l'index actuel
    for (let i = -2; i <= 2; i++) {
      const index = currentIndex + i;
      if (index >= 0 && index < images.length && index !== currentIndex) {
        preloadIndices.push(index);
      }
    }
    
    preloadIndices.forEach(index => {
      const cacheKey = `${folder}-${index}`;
      if (!imageCache.current.has(cacheKey) && !preloadQueue.current.has(cacheKey)) {
        preloadQueue.current.add(cacheKey);
        
        const imagePath = images[index];
        const imageUrl = imagePath.startsWith('http') ? imagePath : `${process.env.REACT_APP_SPACES_URL}/${imagePath}`;
        
        const img = new Image();
        img.onload = () => {
          imageCache.current.set(cacheKey, imageUrl);
          preloadQueue.current.delete(cacheKey);
        };
        img.onerror = () => {
          preloadQueue.current.delete(cacheKey);
        };
        img.src = imageUrl;
      }
    });
  }, [currentCase]);

  // Fonction loadImage optimisée avec cache et préchargement
  const loadImage = useCallback((folder, index, side) => {
    console.log('Loading image:', folder, index, side);
    if (currentCase && currentCase.images && currentCase.images[folder]) {
      const imagePath = currentCase.images[folder][index];
      if (imagePath) {
        const imageUrl = imagePath.startsWith('http') ? imagePath : `${process.env.REACT_APP_SPACES_URL}/${imagePath}`;
        
        // Vérifier le cache d'abord
        const cacheKey = `${folder}-${index}`;
        if (imageCache.current.has(cacheKey)) {
          const cachedUrl = imageCache.current.get(cacheKey);
          setImageSrc(side, cachedUrl, index);
          return;
        }
        
        const imageElement = side === 'left' ? leftViewerRef.current :
                             side === 'right' ? rightViewerRef.current :
                             singleViewerRef.current;
        
        if (imageElement) {
          // Précharger l'image pour éviter les clignotements
          const img = new Image();
          img.onload = () => {
            imageCache.current.set(cacheKey, imageUrl); // Mettre en cache
            setImageSrc(side, imageUrl, index);
            preloadAdjacentImages(folder, index); // Précharger les images adjacentes
          };
          img.src = imageUrl;
        }
      }
    }
  }, [currentCase, setImageSrc, preloadAdjacentImages]);

  // Fonction handleScroll optimisée avec requestAnimationFrame
  const handleScroll = useCallback((deltaY, slowMode = false, side) => {
    const threshold = slowMode ? 5 : 25; // RÉDUIT de 50 à 25 pour plus de réactivité
    
    // Utilisation de requestAnimationFrame pour une animation plus fluide
    requestAnimationFrame(() => {
      setAccumulatedDelta(prev => {
        const newDelta = prev + deltaY;
        if (Math.abs(newDelta) >= threshold) {
          const direction = newDelta > 0 ? 1 : -1;
          const currentFolder = side === 'left' || side === 'single' ? currentFolderLeft : currentFolderRight;
          const currentIndex = side === 'left' || side === 'single' ? currentIndexLeft : currentIndexRight;
          const images = currentCase.images[currentFolder];
          
          if (images) {
            let newIndex = currentIndex + direction;
            
            // Empêcher de dépasser les limites
            if (newIndex < 0) {
              newIndex = 0;
            } else if (newIndex >= images.length) {
              newIndex = images.length - 1;
            }
            
            // Charger uniquement si l'index a changé (évite les rechargements inutiles)
            if (newIndex !== currentIndex) {
              loadImage(currentFolder, newIndex, side);
            }
          }
          return 0;
        }
        return newDelta;
      });
    });
  }, [currentCase, currentFolderLeft, currentFolderRight, currentIndexLeft, currentIndexRight, loadImage]);

  // ==================== AUTRES FONCTIONS ====================

  const resetImageControls = useCallback((side) => {
    setImageControls(prev => ({
      ...prev,
      [side]: {
        scale: 1,
        contrast: 100,
        brightness: 100,
        translateX: 0,
        translateY: 0
      }
    }));
  }, []);

  const handleZoom = useCallback((side, deltaY) => {
    const zoomSensitivity = 0.001;
    const zoomFactor = 1 + (deltaY * zoomSensitivity);
    
    setImageControls(prevControls => {
      const newControls = {
        ...prevControls,
        [side]: {
          ...prevControls[side],
          scale: Math.max(0.1, Math.min(5, prevControls[side].scale * zoomFactor))
        }
      };
      
      const imageElement = side === 'left' ? leftViewerRef.current : 
                           side === 'right' ? rightViewerRef.current : 
                           singleViewerRef.current;
      if (imageElement) {
        imageElement.style.transform = `scale(${newControls[side].scale}) translate(${newControls[side].translateX}px, ${newControls[side].translateY}px)`;
      }
      
      return newControls;
    });
  }, []);

  const handlePan = useCallback((side, deltaX, deltaY) => {
    const panSensitivity = 2;
    
    setImageControls(prevControls => {
      const newControls = {
        ...prevControls,
        [side]: {
          ...prevControls[side],
          translateX: prevControls[side].translateX + (deltaX * panSensitivity),
          translateY: prevControls[side].translateY + (deltaY * panSensitivity)
        }
      };
      
      const imageElement = side === 'left' ? leftViewerRef.current : 
                           side === 'right' ? rightViewerRef.current : 
                           singleViewerRef.current;
      if (imageElement) {
        imageElement.style.transform = `scale(${newControls[side].scale}) translate(${newControls[side].translateX}px, ${newControls[side].translateY}px)`;
      }
      
      return newControls;
    });
  }, []);

  const handleContrast = useCallback((side, deltaX) => {
    const contrastSensitivity = 2;
    
    setImageControls(prevControls => {
      const newControls = {
        ...prevControls,
        [side]: {
          ...prevControls[side],
          contrast: Math.max(0, Math.min(300, prevControls[side].contrast + (deltaX * contrastSensitivity)))
        }
      };
      
      const imageElement = side === 'left' ? leftViewerRef.current : 
                           side === 'right' ? rightViewerRef.current : 
                           singleViewerRef.current;
      if (imageElement) {
        imageElement.style.filter = `contrast(${newControls[side].contrast}%) brightness(${newControls[side].brightness}%)`;
      }
      
      return newControls;
    });
  }, []);

  const applyImageTransforms = useCallback((side) => {
    const controls = imageControls[side];
    const imageElement = side === 'left' ? leftViewerRef.current : 
                         side === 'right' ? rightViewerRef.current : 
                         singleViewerRef.current;
    if (imageElement) {
      imageElement.style.transform = `scale(${controls.scale}) translate(${controls.translateX}px, ${controls.translateY}px)`;
      imageElement.style.filter = `contrast(${controls.contrast}%) brightness(${controls.brightness}%)`;
    }
  }, [imageControls]);

  const handleTouchStart = useCallback((e, side) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      e.stopPropagation();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      setTouchStartPoints({
        distance,
        scale: imageControls[side].scale
      });
      setInitialScale(imageControls[side].scale);
    } else if (e.touches.length === 1) {
      e.preventDefault();
      setLastTouch({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  }, [imageControls]);
  
  const handleTouchMove = useCallback((e, side) => {
    e.preventDefault();
    if (e.touches.length === 2 && touchStartPoints) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const newDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
  
      const scaleFactor = newDistance / touchStartPoints.distance;
      const newScale = Math.max(0.1, Math.min(5, initialScale * scaleFactor));
  
      setImageControls(prev => ({
        ...prev,
        [side]: {
          ...prev[side],
          scale: newScale
        }
      }));
      applyImageTransforms(side);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      const deltaY = touch.clientY - lastTouch.y;
      
      if (Math.abs(deltaY) > 1) {
        handleScroll(deltaY * 4, false, side);
      }
      
      setLastTouch({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }, [touchStartPoints, initialScale, applyImageTransforms, handleScroll, lastTouch]);
  
  const handleTouchEnd = useCallback(() => {
    setTouchStartPoints(null);
  }, []);

  const toggleViewMode = useCallback(() => {
    setIsSingleViewMode(prev => {
      if (!prev) {
        // Suppression du setTimeout - transition immédiate
        if (singleViewerRef.current && leftViewerRef.current) {
          singleViewerRef.current.src = leftViewerRef.current.src;
          setImageControls(prevControls => ({
            ...prevControls,
            single: {...prevControls.left}
          }));
        }
      } else {
        // Suppression du setTimeout - transition immédiate
        if (leftViewerRef.current && singleViewerRef.current) {
          leftViewerRef.current.src = singleViewerRef.current.src;
          rightViewerRef.current.src = singleViewerRef.current.src;
          setImageControls(prevControls => ({
            ...prevControls,
            left: {...prevControls.single},
            right: {...prevControls.single}
          }));
        }
      }
      return !prev;
    });
  }, []);

  const handleDragStart = useCallback((event, folder) => {
    event.dataTransfer.setData('text/plain', folder);
    event.target.classList.add('dragging');
  }, []);

  const handleDrop = useCallback((event, side) => {
    event.preventDefault();
    const folder = event.dataTransfer.getData('text');
    console.log('Dropped folder:', folder);
    if (currentCase && currentCase.images && currentCase.images[folder]) {
      loadImage(folder, 0, side);
      if (side === 'left' || side === 'single') {
        setCurrentFolderLeft(folder);
      } else {
        setCurrentFolderRight(folder);
      }
    } else {
      console.error('Invalid folder or no images in folder:', folder);
    }
    event.target.classList.remove('drag-over');
    document.querySelectorAll('.folder-thumbnail').forEach(el => el.classList.remove('dragging'));
  }, [currentCase, loadImage]);

  const handleMouseDown = useCallback((e, side) => {
    if (e.button === 0 && e.shiftKey) {
      setIsPanning(true);
    } else if (e.button === 2 && e.shiftKey) {
      setIsAdjustingContrast(true);
    } else if (e.button === 2) {
      setIsZooming(true);
    } else if (e.button === 0) {
      setIsDragging(true);
    }
    setStartX(e.clientX);
    setStartY(e.clientY);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e, side) => {
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (isPanning) {
      handlePan(side, deltaX, deltaY);
    } else if (isZooming) {
      handleZoom(side, -deltaY);
    } else if (isAdjustingContrast) {
      handleContrast(side, deltaX);
    } else if (isDragging) {
      handleScroll(deltaY, true, side);
    }

    setStartX(e.clientX);
    setStartY(e.clientY);
  }, [isPanning, isZooming, isAdjustingContrast, isDragging, startX, startY, handlePan, handleZoom, handleContrast, handleScroll]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
    setIsZooming(false);
    setIsAdjustingContrast(false);
  }, []);

  // ==================== EFFECTS ====================

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isMobile && !isSingleViewMode) {
      setIsSingleViewMode(true);
    }
  }, [isMobile]);

  // Nettoyage du cache périodique
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      // Nettoyer le cache si trop volumineux (garde les 50 dernières images)
      if (imageCache.current.size > 50) {
        const entries = Array.from(imageCache.current.entries());
        const toKeep = entries.slice(-30); // Garde les 30 plus récentes
        imageCache.current.clear();
        toKeep.forEach(([key, value]) => imageCache.current.set(key, value));
      }
    }, 30000); // Nettoie toutes les 30 secondes

    return () => clearInterval(cleanupInterval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "&") {
        if (!isSingleViewMode) toggleViewMode();
      } else if (event.key === "é") {
        if (isSingleViewMode) toggleViewMode();
      } else if (event.key === "ArrowDown") {
        handleScroll(100, false, isSingleViewMode ? 'single' : 'left');
        if (!isSingleViewMode) handleScroll(100, false, 'right');
      } else if (event.key === "ArrowUp") {
        handleScroll(-100, false, isSingleViewMode ? 'single' : 'left');
        if (!isSingleViewMode) handleScroll(-100, false, 'right');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleScroll, isSingleViewMode, toggleViewMode]);

  // Événements touch optimisés
  useEffect(() => {
    if (isTouchDevice) {
      const viewer = document.querySelector(`.${styles.viewer}`);
      let touchStartY = 0;
      let lastScrollTime = 0;
      const scrollDelay = 16; // ~60fps = 16ms entre chaque frame
      
      const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMove = (e) => {
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        const currentTime = Date.now();
        
        if (currentTime - lastScrollTime > scrollDelay) {
          if (Math.abs(deltaY) > 5) { // Seuil réduit pour plus de réactivité
            const direction = deltaY > 0 ? 1 : -1;
            handleScroll(direction * 15, false, isSingleViewMode ? 'single' : 'left'); // Réduit de 50 à 15
            lastScrollTime = currentTime;
          }
        }
        
        touchStartY = currentY;
      };

      const preventRefresh = (e) => {
        e.preventDefault();
      };

      // Options passive: false pour de meilleures performances
      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', preventRefresh, { passive: false });
      viewer?.addEventListener('touchstart', handleTouchStart, { passive: true });
      viewer?.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('touchmove', preventRefresh);
        viewer?.removeEventListener('touchstart', handleTouchStart);
        viewer?.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isTouchDevice, handleScroll, isSingleViewMode]);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(`/cases/${caseId}`);
        const caseData = response.data;
        setCurrentCase(caseData);
        if (caseData.folders && caseData.folders.length > 0) {
          setCurrentFolderLeft(caseData.folders[0]);
          setCurrentFolderRight(caseData.folders[0]);
          loadImage(caseData.folders[0], 0, 'left');
          if (!isSingleViewMode) {
            loadImage(caseData.folders[0], 0, 'right');
          } else {
            loadImage(caseData.folders[0], 0, 'single');
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du cas:', error);
      }
    };

    fetchCase();
  }, [caseId, loadImage, isSingleViewMode]);

  const fetchFolderThumbnails = useCallback((caseData) => {
    if (!caseData) return;
    const thumbnails = {};
  
    for (const folder of caseData.folders) {
      try {
        const imagesInFolder = caseData.images[folder];
        if (imagesInFolder && imagesInFolder.length > 0) {
          const firstImagePath = imagesInFolder[0];
          const imagePath = firstImagePath.startsWith('http') 
            ? firstImagePath 
            : `${process.env.REACT_APP_SPACES_URL}/${firstImagePath}`;
          
          thumbnails[folder] = imagePath;
        }
      } catch (error) {
        console.error(`Erreur lors de la génération de la miniature pour ${folder}:`, error);
        thumbnails[folder] = `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`;
      }
    }
  
    setFolderThumbnails(thumbnails);
  }, []);

  const renderViewer = useCallback((side) => (
    <div 
      className={`${styles.viewer} ${styles.viewerHalf}`}
      onWheel={useCallback((e) => {
        e.preventDefault();
        
        // Utiliser requestAnimationFrame pour lisser l'animation
        requestAnimationFrame(() => {
          if (e.ctrlKey) {
            handleZoom(side, -e.deltaY);
          } else {
            // Réduire la sensibilité pour un défilement plus contrôlé
            const scaledDelta = e.deltaY * 0.5;
            handleScroll(scaledDelta, false, side);
          }
        });
      }, [handleZoom, handleScroll, side])}
      onMouseDown={(e) => handleMouseDown(e, side)}
      onMouseMove={(e) => handleMouseMove(e, side)}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => handleDrop(e, side)}
      onTouchStart={(e) => handleTouchStart(e, side)}
      onTouchMove={(e) => handleTouchMove(e, side)}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.folderLabel}>
        {side === 'left' ? currentFolderLeft : currentFolderRight}
      </div>
      <img 
        ref={side === 'left' ? leftViewerRef : rightViewerRef}
        className={styles.image} 
        alt={`Image médicale ${side}`}
      />
    </div>
  ), [handleZoom, handleScroll, handleMouseDown, handleMouseMove, handleMouseUp, handleDrop, 
      handleTouchStart, handleTouchMove, handleTouchEnd, currentFolderLeft, currentFolderRight]);

  const renderFolderThumbnails = useCallback(() => {
    if (!currentCase || !currentCase.folders) return null;

    return (
      <div id="folder-thumbnails" className={styles.folderGrid}>
        {currentCase.folders.map(folder => (
          <div 
            key={folder} 
            className={styles.folderThumbnail}
            draggable={!isMobile}
            onDragStart={(e) => !isMobile && handleDragStart(e, folder)}
            onClick={() => {
              if (isMobile) {
                loadImage(folder, 0, 'single');
                setCurrentFolderLeft(folder);
              }
            }}
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
  }, [currentCase, isMobile, handleDragStart, loadImage]);
      
  if (!currentCase) return <div>Chargement...</div>;
      
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.layout}>
          {renderFolderThumbnails()}
          <div id="main-viewer" className={styles.mainViewer}>
            {isSingleViewMode ? (
              <div 
                className={`${styles.viewer} ${styles.singleViewer}`}
                onWheel={useCallback((e) => {
                  e.preventDefault();
                  
                  requestAnimationFrame(() => {
                    if (e.ctrlKey) {
                      handleZoom('single', -e.deltaY);
                    } else {
                      const scaledDelta = e.deltaY * 0.5;
                      handleScroll(scaledDelta, false, 'single');
                    }
                  });
                }, [handleZoom, handleScroll])}
                onMouseDown={(e) => handleMouseDown(e, 'single')}
                onMouseMove={(e) => handleMouseMove(e, 'single')}
                onMouseUp={handleMouseUp}
                onContextMenu={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, 'single')}
                onTouchStart={(e) => handleTouchStart(e, 'single')}
                onTouchMove={(e) => handleTouchMove(e, 'single')}
                onTouchEnd={handleTouchEnd}
              >
                <div className={styles.folderLabel}>
                  {currentFolderLeft}
                </div>
                <img 
                  ref={singleViewerRef}
                  className={styles.image} 
                  alt="Image médicale"
                />
              </div>
            ) : (
              <div className={styles.dualViewer}>
                {renderViewer('left')}
                {renderViewer('right')}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.shortcutGuide}>
          <div 
            className={styles.shortcutIcon}
            onClick={() => setIsShortcutGuideVisible(!isShortcutGuideVisible)}
            title="Guide des raccourcis"
          >
            ?
          </div>
          {isShortcutGuideVisible && (
            <div className={`${styles.shortcutPopup} ${styles.visible}`}>
              <div className={styles.shortcutTitle}>Raccourcis clavier</div>
              <ul className={styles.shortcutList}>
                <li><strong>& (1)</strong> Mode simple</li>
                <li><strong>é (2)</strong> Mode double</li>
                <li><strong>↑ ↓</strong> Navigation</li>
                <li><strong>Shift + clic</strong> Panoramique</li>
                <li><strong>Clic droit</strong> Zoom</li>
                <li><strong>Shift + clic droit</strong> Contraste</li>
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
                Cacher la réponse
              </>
            ) : (
              <>
                <Eye size={16} />
                Voir la réponse
              </>
            )}
          </button>
          <Link to={`/sheet/${caseId}`} className={styles.sheetLink}>
            📋 Fiche récapitulative
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