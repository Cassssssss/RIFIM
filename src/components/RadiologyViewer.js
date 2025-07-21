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
  const [theme, setTheme] = useState('dark');
  const [touchStartPoints, setTouchStartPoints] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTouchDevice, setIsTouchDevice] = useState('ontouchstart' in window);

  const leftViewerRef = useRef(null);
  const rightViewerRef = useRef(null);
  const singleViewerRef = useRef(null);

  // ==================== CHARGEMENT DES DONNÉES ====================

  useEffect(() => {
    const fetchCase = async () => {
      if (!caseId) return;
      
      try {
        const response = await axios.get(`/cases/${caseId}`);
        const caseData = response.data;
        
        if (caseData && caseData.images) {
          setCurrentCase(caseData);
          
          const folders = Object.keys(caseData.images);
          if (folders.length > 0) {
            const firstFolder = folders[0];
            setCurrentFolderLeft(firstFolder);
            setCurrentFolderRight(folders.length > 1 ? folders[1] : firstFolder);
            
            loadImage(firstFolder, 0, isSingleViewMode ? 'single' : 'left');
            if (!isSingleViewMode && folders.length > 1) {
              loadImage(folders[1], 0, 'right');
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du cas:', error);
      }
    };

    fetchCase();
  }, [caseId, isSingleViewMode]);

  const loadImage = useCallback((folder, index, side) => {
    if (!currentCase?.images?.[folder]?.[index]) return;
    
    const imageUrl = `${process.env.REACT_APP_SPACES_URL}/${currentCase.images[folder][index]}`;
    
    if (side === 'left' && leftViewerRef.current) {
      leftViewerRef.current.src = imageUrl;
      setCurrentIndexLeft(index);
    } else if (side === 'right' && rightViewerRef.current) {
      rightViewerRef.current.src = imageUrl;
      setCurrentIndexRight(index);
    } else if (side === 'single' && singleViewerRef.current) {
      singleViewerRef.current.src = imageUrl;
      setCurrentIndexLeft(index);
    }
  }, [currentCase]);

  // ==================== GESTION DU SCROLL ====================

  const handleScroll = useCallback((deltaY, useAccumulation = false, side) => {
    if (!currentCase) return;
    
    const threshold = useAccumulation ? 30 : 50;
    
    setAccumulatedDelta(prev => {
      const newDelta = prev + deltaY;
      if (Math.abs(newDelta) >= threshold) {
        const direction = newDelta > 0 ? 1 : -1;
        const currentFolder = side === 'left' || side === 'single' ? currentFolderLeft : currentFolderRight;
        const currentIndex = side === 'left' || side === 'single' ? currentIndexLeft : currentIndexRight;
        const images = currentCase?.images?.[currentFolder];
        
        if (images && images.length > 0) {
          let newIndex = currentIndex + direction;
          
          // Empêcher de dépasser les limites
          if (newIndex < 0) {
            newIndex = 0;
          } else if (newIndex >= images.length) {
            newIndex = images.length - 1;
          }
          
          // Charger la nouvelle image
          if (newIndex !== currentIndex) {
            loadImage(currentFolder, newIndex, side);
          }
        }
        return 0;
      }
      return newDelta;
    });
  }, [currentCase, currentFolderLeft, currentFolderRight, currentIndexLeft, currentIndexRight, loadImage]);

  // ==================== AUTRES FONCTIONS ====================

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
      
      return newControls;
    });
  }, []);

  // 🔧 CORRECTION PRINCIPALE : Application immédiate des transformations pour éliminer le décalage
  const handlePan = useCallback((side, deltaX, deltaY) => {
    setImageControls(prevControls => {
      const newControls = {
        ...prevControls,
        [side]: {
          ...prevControls[side],
          translateX: prevControls[side].translateX + deltaX,
          translateY: prevControls[side].translateY + deltaY
        }
      };
      
      // APPLICATION IMMÉDIATE - C'EST ÇA QUI RÈGLE LE PROBLÈME DE DÉCALAGE !
      const imageElement = side === 'left' ? leftViewerRef.current : 
                           side === 'right' ? rightViewerRef.current : 
                           singleViewerRef.current;
      
      if (imageElement) {
        // Transformation CSS appliquée INSTANTANÉMENT, pas d'attente de re-render
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
      
      return newControls;
    });
  }, []);

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
        if (singleViewerRef.current && leftViewerRef.current) {
          singleViewerRef.current.src = leftViewerRef.current.src;
          setImageControls(prevControls => ({
            ...prevControls,
            single: {...prevControls.left}
          }));
        }
      } else {
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
    console.log('Dropped folder:', folder, 'on side:', side);
    
    if (currentCase && currentCase.images && currentCase.images[folder]) {
      // Charger l'image seulement sur le côté où on a droppé
      loadImage(folder, 0, side);
      
      // Mettre à jour seulement le folder du côté concerné
      if (side === 'left' || side === 'single') {
        setCurrentFolderLeft(folder);
        setCurrentIndexLeft(0); // Reset l'index à 0
      } else if (side === 'right') {
        setCurrentFolderRight(folder);
        setCurrentIndexRight(0); // Reset l'index à 0
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

  // ==================== GESTION DES ÉVÉNEMENTS WHEEL - VERSION SIMPLIFIÉE ==================== 
  
  const handleWheelEvent = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Identifier le viewer ciblé
    let targetSide = isSingleViewMode ? 'single' : 'left';
    
    if (!isSingleViewMode) {
      const viewers = document.querySelectorAll(`.${styles.viewerHalf}`);
      const leftViewer = viewers[0];
      const rightViewer = viewers[1];
      
      if (e.target.closest(`.${styles.viewer}`) === rightViewer) {
        targetSide = 'right';
      }
    }
    
    if (e.ctrlKey || e.metaKey) {
      handleZoom(targetSide, -e.deltaY);
    } else {
      handleScroll(e.deltaY, false, targetSide);
    }
  }, [isSingleViewMode, handleZoom, handleScroll]);

  // ==================== EFFECTS ==================== 

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isMobile && !isSingleViewMode) {
      setIsSingleViewMode(true);
    }
  }, [isMobile]);

  // Effect pour gérer la molette - SIMPLIFIÉ
  useEffect(() => {
    const mainViewer = document.getElementById('main-viewer');
    if (mainViewer) {
      mainViewer.addEventListener('wheel', handleWheelEvent, { passive: false });
    }

    return () => {
      if (mainViewer) {
        mainViewer.removeEventListener('wheel', handleWheelEvent);
      }
    };
  }, [handleWheelEvent]);

  // Effect pour les touches clavier
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

  // Effect pour les événements touch
  useEffect(() => {
    if (isTouchDevice) {
      const viewer = document.querySelector(`.${styles.viewer}`);
      let touchStartY = 0;
      let lastScrollTime = 0;
      const scrollDelay = 50;
      
      const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMove = (e) => {
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        const currentTime = Date.now();
        
        if (currentTime - lastScrollTime > scrollDelay) {
          if (Math.abs(deltaY) > 10) {
            const direction = deltaY > 0 ? 1 : -1;
            handleScroll(direction * 50, false, isSingleViewMode ? 'single' : 'left');
            lastScrollTime = currentTime;
          }
        }
      };

      if (viewer) {
        viewer.addEventListener('touchstart', handleTouchStart);
        viewer.addEventListener('touchmove', handleTouchMove, { passive: false });
      }

      return () => {
        if (viewer) {
          viewer.removeEventListener('touchstart', handleTouchStart);
          viewer.removeEventListener('touchmove', handleTouchMove);
        }
      };
    }
  }, [isTouchDevice, handleScroll, isSingleViewMode]);

  // Effect pour appliquer les transformations
  useEffect(() => {
    applyImageTransforms('left');
    applyImageTransforms('right');
    applyImageTransforms('single');
  }, [imageControls, applyImageTransforms]);

  // Effect pour gérer le redimensionnement
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ==================== RENDER ==================== 

  if (!currentCase) {
    return <div className={styles.loading}>Chargement du cas...</div>;
  }

  const currentLeftFolder = currentFolderLeft || Object.keys(currentCase.images)[0];
  const currentRightFolder = currentFolderRight || Object.keys(currentCase.images)[1] || Object.keys(currentCase.images)[0];

  return (
    <div className={styles.container}>
      {/* En-tête avec navigation */}
      <div className={styles.header}>
        <Link to="/cases" className={styles.backButton}>
          <ChevronLeft size={20} />
          Retour aux cas
        </Link>
        <h1 className={styles.title}>{currentCase.title}</h1>
        <div className={styles.headerControls}>
          <button 
            onClick={toggleViewMode}
            className={styles.viewModeButton}
          >
            {isSingleViewMode ? 'Vue double' : 'Vue simple'}
          </button>
          <button 
            onClick={() => setIsResponseVisible(!isResponseVisible)}
            className={styles.responseButton}
          >
            {isResponseVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            {isResponseVisible ? 'Cacher' : 'Montrer'} réponse
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className={styles.content}>
        <div className={styles.layout}>
          {/* Galerie de dossiers */}
          <div className={styles.folderGrid}>
            {Object.entries(currentCase.images).map(([folder, images]) => {
              if (!images || images.length === 0) return null;
              
              return (
                <div
                  key={folder}
                  className={styles.folderThumbnail}
                  draggable
                  onDragStart={(e) => handleDragStart(e, folder)}
                  onClick={() => loadImage(folder, 0, isSingleViewMode ? 'single' : 'left')}
                >
                  <img
                    src={`${process.env.REACT_APP_SPACES_URL}/${images[0]}`}
                    alt={`${folder} thumbnail`}
                    className={styles.folderThumbnailImage}
                  />
                  <div className={styles.folderThumbnailLabel}>
                    {folder} ({images.length})
                  </div>
                </div>
              );
            })}
          </div>

          {/* Viewer principal */}
          <div className={styles.mainViewer} id="main-viewer">
            {isSingleViewMode ? (
              /* Vue simple */
              <div 
                className={styles.singleViewer}
                onDrop={(e) => handleDrop(e, 'single')}
                onDragOver={(e) => e.preventDefault()}
                onMouseDown={(e) => handleMouseDown(e, 'single')}
                onMouseMove={(e) => handleMouseMove(e, 'single')}
                onMouseUp={handleMouseUp}
                onTouchStart={(e) => handleTouchStart(e, 'single')}
                onTouchMove={(e) => handleTouchMove(e, 'single')}
                onTouchEnd={handleTouchEnd}
              >
                <div className={styles.viewer}>
                  <img
                    ref={singleViewerRef}
                    className={styles.image}
                    alt="Vue radiologique"
                    draggable={false}
                  />
                  <div className={styles.folderLabel}>
                    {currentLeftFolder} - {currentIndexLeft + 1}/{currentCase.images[currentLeftFolder]?.length || 0}
                  </div>
                </div>
              </div>
            ) : (
              /* Vue double */
              <div className={styles.dualViewer}>
                <div 
                  className={styles.viewerHalf}
                  onDrop={(e) => handleDrop(e, 'left')}
                  onDragOver={(e) => e.preventDefault()}
                  onMouseDown={(e) => handleMouseDown(e, 'left')}
                  onMouseMove={(e) => handleMouseMove(e, 'left')}
                  onMouseUp={handleMouseUp}
                  onTouchStart={(e) => handleTouchStart(e, 'left')}
                  onTouchMove={(e) => handleTouchMove(e, 'left')}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className={styles.viewer}>
                    <img
                      ref={leftViewerRef}
                      className={styles.image}
                      alt="Vue radiologique gauche"
                      draggable={false}
                    />
                    <div className={styles.folderLabel}>
                      {currentLeftFolder} - {currentIndexLeft + 1}/{currentCase.images[currentLeftFolder]?.length || 0}
                    </div>
                  </div>
                </div>
                
                <div 
                  className={styles.viewerHalf}
                  onDrop={(e) => handleDrop(e, 'right')}
                  onDragOver={(e) => e.preventDefault()}
                  onMouseDown={(e) => handleMouseDown(e, 'right')}
                  onMouseMove={(e) => handleMouseMove(e, 'right')}
                  onMouseUp={handleMouseUp}
                  onTouchStart={(e) => handleTouchStart(e, 'right')}
                  onTouchMove={(e) => handleTouchMove(e, 'right')}
                  onTouchEnd={handleTouchEnd}
                >
                  <div className={styles.viewer}>
                    <img
                      ref={rightViewerRef}
                      className={styles.image}
                      alt="Vue radiologique droite"
                      draggable={false}
                    />
                    <div className={styles.folderLabel}>
                      {currentRightFolder} - {currentIndexRight + 1}/{currentCase.images[currentRightFolder]?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Guide des raccourcis */}
        <div className={styles.shortcutGuide}>
          <div className={styles.shortcutGroup}>
            <span className={styles.shortcutLabel}>Navigation:</span>
            <span className={styles.shortcutKey}>Molette</span>
            <span className={styles.shortcutKey}>Flèches ↑↓</span>
          </div>
          <div className={styles.shortcutGroup}>
            <span className={styles.shortcutLabel}>Zoom:</span>
            <span className={styles.shortcutKey}>Ctrl + Molette</span>
          </div>
          <div className={styles.shortcutGroup}>
            <span className={styles.shortcutLabel}>Déplacer:</span>
            <span className={styles.shortcutKey}>Shift + Clic gauche</span>
          </div>
          <div className={styles.shortcutGroup}>
            <span className={styles.shortcutLabel}>Vue:</span>
            <span className={styles.shortcutKey}>1/2</span>
          </div>
        </div>

        {/* Réponse (si visible) */}
        {isResponseVisible && currentCase.response && (
          <div className={styles.responseSection}>
            <h3>Réponse</h3>
            <div 
              className={styles.responseContent}
              dangerouslySetInnerHTML={{ __html: currentCase.response }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RadiologyViewer;