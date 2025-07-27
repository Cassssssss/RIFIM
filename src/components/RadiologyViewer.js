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

// ==================== HOOK MOBILE VIEWPORT FIX ====================

const useMobileViewportFix = () => {
  const updateViewport = useCallback(() => {
    // Fix pour la hauteur du viewport mobile
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Détection mobile améliorée
    const isMobile = window.innerWidth <= 768 || 
                     'ontouchstart' in window || 
                     navigator.maxTouchPoints > 0;
    
    // Hauteurs des éléments fixes
    const header = document.querySelector('header') || 
                   document.querySelector('.header') || 
                   document.querySelector('[data-header]');
    const bottomBar = document.querySelector('.bottomBar') || 
                      document.querySelector('.bottom-bar');

    let headerHeight = 60; // Valeur par défaut
    let bottomBarHeight = 50; // Valeur par défaut

    if (header) {
      headerHeight = header.getBoundingClientRect().height;
    }
    if (bottomBar) {
      bottomBarHeight = bottomBar.getBoundingClientRect().height;
    }

    // Safe areas pour iPhone X+
    const safeAreaTop = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('env(safe-area-inset-top)') || '0');
    const safeAreaBottom = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('env(safe-area-inset-bottom)') || '0');

    // Mise à jour des variables CSS
    const root = document.documentElement;
    root.style.setProperty('--header-height', `${headerHeight}px`);
    root.style.setProperty('--bottom-bar-height', `${bottomBarHeight}px`);
    root.style.setProperty('--safe-area-top', `${safeAreaTop}px`);
    root.style.setProperty('--safe-area-bottom', `${safeAreaBottom}px`);
    root.style.setProperty('--is-mobile', isMobile ? '1' : '0');

    // Debug en mode développement
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 Mobile Viewport Updated:', {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        vh: vh,
        headerHeight,
        bottomBarHeight,
        safeAreas: { top: safeAreaTop, bottom: safeAreaBottom },
        isMobile,
        availableHeight: window.innerHeight - headerHeight - bottomBarHeight - safeAreaTop - safeAreaBottom
      });
    }
  }, []);

  // Gestion des changements d'orientation et de redimensionnement
  useEffect(() => {
    updateViewport();

    const handleResize = () => {
      // Délai pour attendre que le navigateur mobile termine son animation
      setTimeout(updateViewport, 100);
    };

    const handleOrientationChange = () => {
      // Délai plus long pour l'orientation
      setTimeout(updateViewport, 300);
    };

    // Écouteurs d'événements
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Observer pour détecter les changements DOM
    const observer = new MutationObserver(() => {
      setTimeout(updateViewport, 50);
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      observer.disconnect();
    };
  }, [updateViewport]);

  return updateViewport;
};

// ==================== COMPOSANT PRINCIPAL ====================

function RadiologyViewer() {
  const { caseId } = useParams();
  const [currentCase, setCurrentCase] = useState(null);
  const [currentIndexLeft, setCurrentIndexLeft] = useState(0);
  const [currentIndexRight, setCurrentIndexRight] = useState(0);
  const [currentIndexTopLeft, setCurrentIndexTopLeft] = useState(0);
  const [currentIndexTopRight, setCurrentIndexTopRight] = useState(0);
  const [currentIndexBottomLeft, setCurrentIndexBottomLeft] = useState(0);
  const [currentIndexBottomRight, setCurrentIndexBottomRight] = useState(0);
  
  const [currentFolderLeft, setCurrentFolderLeft] = useState('');
  const [currentFolderRight, setCurrentFolderRight] = useState('');
  const [currentFolderTopLeft, setCurrentFolderTopLeft] = useState('');
  const [currentFolderTopRight, setCurrentFolderTopRight] = useState('');
  const [currentFolderBottomLeft, setCurrentFolderBottomLeft] = useState('');
  const [currentFolderBottomRight, setCurrentFolderBottomRight] = useState('');
  
  // Détection mobile améliorée et stable
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || 
           'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 ||
           /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  });
  
  // Mode viewer : forcé à 1 sur mobile au démarrage
  const [viewMode, setViewMode] = useState(() => isMobile ? 1 : 1);
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  
  const [imageControls, setImageControls] = useState({
    left: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 },
    right: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 },
    single: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 },
    topLeft: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 },
    topRight: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 },
    bottomLeft: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 },
    bottomRight: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 }
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

  const leftViewerRef = useRef(null);
  const rightViewerRef = useRef(null);
  const singleViewerRef = useRef(null);
  const topLeftViewerRef = useRef(null);
  const topRightViewerRef = useRef(null);
  const bottomLeftViewerRef = useRef(null);
  const bottomRightViewerRef = useRef(null);

  const [touchStartPoints, setTouchStartPoints] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });

  const [theme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  // Hook pour les corrections viewport mobile
  const updateViewport = useMobileViewportFix();

  // ==================== FONCTION loadImage ÉTENDUE ==================== 
  
  const loadImage = useCallback((folder, index, side) => {
    if (currentCase && currentCase.images && currentCase.images[folder]) {
      const imagePath = currentCase.images[folder][index];
      if (imagePath) {
        const imageUrl = imagePath.startsWith('http') ? imagePath : `${process.env.REACT_APP_SPACES_URL}/${imagePath}`;
        
        let imageElement;
        switch(side) {
          case 'left':
            imageElement = leftViewerRef.current;
            break;
          case 'right':
            imageElement = rightViewerRef.current;
            break;
          case 'single':
            imageElement = singleViewerRef.current;
            break;
          case 'topLeft':
            imageElement = topLeftViewerRef.current;
            break;
          case 'topRight':
            imageElement = topRightViewerRef.current;
            break;
          case 'bottomLeft':
            imageElement = bottomLeftViewerRef.current;
            break;
          case 'bottomRight':
            imageElement = bottomRightViewerRef.current;
            break;
          default:
            imageElement = singleViewerRef.current;
        }
        
        if (imageElement) {
          imageElement.src = imageUrl;
          switch(side) {
            case 'left':
            case 'single':
              setCurrentIndexLeft(index);
              break;
            case 'right':
              setCurrentIndexRight(index);
              break;
            case 'topLeft':
              setCurrentIndexTopLeft(index);
              break;
            case 'topRight':
              setCurrentIndexTopRight(index);
              break;
            case 'bottomLeft':
              setCurrentIndexBottomLeft(index);
              break;
            case 'bottomRight':
              setCurrentIndexBottomRight(index);
              break;
          }
        }
      }
    }
  }, [currentCase]);

  // ==================== FONCTION handleScroll ÉTENDUE ==================== 
  
  const handleScroll = useCallback((deltaY, slowMode = false, side) => {
    const threshold = slowMode ? 10 : 50;
    
    setAccumulatedDelta(prev => {
      const newDelta = prev + deltaY;
      if (Math.abs(newDelta) >= threshold) {
        const direction = newDelta > 0 ? 1 : -1;
        
        let currentFolder, currentIndex;
        switch(side) {
          case 'left':
          case 'single':
            currentFolder = currentFolderLeft;
            currentIndex = currentIndexLeft;
            break;
          case 'right':
            currentFolder = currentFolderRight;
            currentIndex = currentIndexRight;
            break;
          case 'topLeft':
            currentFolder = currentFolderTopLeft;
            currentIndex = currentIndexTopLeft;
            break;
          case 'topRight':
            currentFolder = currentFolderTopRight;
            currentIndex = currentIndexTopRight;
            break;
          case 'bottomLeft':
            currentFolder = currentFolderBottomLeft;
            currentIndex = currentIndexBottomLeft;
            break;
          case 'bottomRight':
            currentFolder = currentFolderBottomRight;
            currentIndex = currentIndexBottomRight;
            break;
          default:
            currentFolder = currentFolderLeft;
            currentIndex = currentIndexLeft;
        }
        
        const images = currentCase?.images?.[currentFolder];
        
        if (images && images.length > 0) {
          let newIndex = currentIndex + direction;
          
          if (newIndex < 0) {
            newIndex = 0;
          } else if (newIndex >= images.length) {
            newIndex = images.length - 1;
          }
          
          if (newIndex !== currentIndex) {
            loadImage(currentFolder, newIndex, side);
          }
        }
        return 0;
      }
      return newDelta;
    });
  }, [currentCase, currentFolderLeft, currentFolderRight, currentFolderTopLeft, currentFolderTopRight, 
      currentFolderBottomLeft, currentFolderBottomRight, currentIndexLeft, currentIndexRight, 
      currentIndexTopLeft, currentIndexTopRight, currentIndexBottomLeft, currentIndexBottomRight, loadImage]);

  // ==================== AUTRES FONCTIONS ÉTENDUES ====================

  const applyImageTransforms = useCallback((side) => {
    const controls = imageControls[side];
    
    let imageElement;
    switch(side) {
      case 'left':
        imageElement = leftViewerRef.current;
        break;
      case 'right':
        imageElement = rightViewerRef.current;
        break;
      case 'single':
        imageElement = singleViewerRef.current;
        break;
      case 'topLeft':
        imageElement = topLeftViewerRef.current;
        break;
      case 'topRight':
        imageElement = topRightViewerRef.current;
        break;
      case 'bottomLeft':
        imageElement = bottomLeftViewerRef.current;
        break;
      case 'bottomRight':
        imageElement = bottomRightViewerRef.current;
        break;
      default:
        imageElement = singleViewerRef.current;
    }
    
    if (imageElement && controls) {
      imageElement.style.transform = `scale(${controls.scale}) translate(${controls.translateX}px, ${controls.translateY}px)`;
      imageElement.style.filter = `contrast(${controls.contrast}%) brightness(${controls.brightness}%)`;
    }
  }, [imageControls]);

  const handleZoom = useCallback((side, deltaY) => {
    const zoomSensitivity = isMobile ? 0.002 : 0.001; // Plus sensible sur mobile
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
  }, [isMobile]);

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
      
      let imageElement;
      switch(side) {
        case 'left':
          imageElement = leftViewerRef.current;
          break;
        case 'right':
          imageElement = rightViewerRef.current;
          break;
        case 'single':
          imageElement = singleViewerRef.current;
          break;
        case 'topLeft':
          imageElement = topLeftViewerRef.current;
          break;
        case 'topRight':
          imageElement = topRightViewerRef.current;
          break;
        case 'bottomLeft':
          imageElement = bottomLeftViewerRef.current;
          break;
        case 'bottomRight':
          imageElement = bottomRightViewerRef.current;
          break;
        default:
          imageElement = singleViewerRef.current;
      }
      
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
      
      return newControls;
    });
  }, []);

  // ==================== GESTION TOUCH MOBILE OPTIMISÉE ====================

  const handleTouchStart = useCallback((e, side) => {
    if (!isMobile) return;
    
    // Empêche le zoom de la page entière
    if (e.touches.length === 2) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (e.touches.length === 2) {
      // Geste de pincement pour le zoom
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
      // Touch simple pour le scroll
      setLastTouch({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  }, [isMobile, imageControls]);
  
  const handleTouchMove = useCallback((e, side) => {
    if (!isMobile) return;
    
    // Empêche le zoom de la page entière
    if (e.touches.length === 2) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (e.touches.length === 2 && touchStartPoints) {
      // Geste de pincement - zoom de l'image uniquement
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
      
      // Applique immédiatement le zoom à l'image
      let imageElement;
      switch(side) {
        case 'left':
          imageElement = leftViewerRef.current;
          break;
        case 'right':
          imageElement = rightViewerRef.current;
          break;
        case 'single':
          imageElement = singleViewerRef.current;
          break;
        default:
          imageElement = singleViewerRef.current;
      }
      
      if (imageElement) {
        imageElement.style.transform = `scale(${newScale}) translate(${prev[side]?.translateX || 0}px, ${prev[side]?.translateY || 0}px)`;
      }
      
    } else if (e.touches.length === 1) {
      // Scroll vertical pour navigation d'images
      const touch = e.touches[0];
      const deltaY = touch.clientY - lastTouch.y;
      
      if (Math.abs(deltaY) > 2) { // Seuil plus bas pour mobile
        handleScroll(deltaY * 3, false, side); // Facteur plus sensible pour mobile
      }
      
      setLastTouch({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }, [isMobile, touchStartPoints, initialScale, handleScroll, lastTouch, leftViewerRef, rightViewerRef, singleViewerRef]);
  
  const handleTouchEnd = useCallback((e) => {
    if (!isMobile) return;
    
    // Empêche le zoom de la page entière
    if (e.changedTouches.length === 2 || touchStartPoints) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setTouchStartPoints(null);
  }, [isMobile, touchStartPoints]);

  // ==================== FONCTION DE CHANGEMENT DE MODE MOBILE-SAFE ====================

  const cycleViewMode = useCallback(() => {
    setViewMode(prev => {
      if (isMobile) {
        // Sur mobile : seulement mode 1 et 2
        return prev === 1 ? 2 : 1;
      } else {
        // Sur desktop : tous les modes (1 à 4)
        const nextMode = prev >= 4 ? 1 : prev + 1;
        
        if (nextMode === 1 && singleViewerRef.current && leftViewerRef.current) {
          singleViewerRef.current.src = leftViewerRef.current.src;
          setImageControls(prevControls => ({
            ...prevControls,
            single: {...prevControls.left}
          }));
        } else if (nextMode === 2 && leftViewerRef.current && singleViewerRef.current) {
          leftViewerRef.current.src = singleViewerRef.current.src;
          rightViewerRef.current.src = singleViewerRef.current.src;
          setImageControls(prevControls => ({
            ...prevControls,
            left: {...prevControls.single},
            right: {...prevControls.single}
          }));
        }
        
        return nextMode;
      }
    });
  }, [isMobile]);

  // ==================== GESTION DRAG & DROP (DESKTOP SEULEMENT) ====================

  const handleDragStart = useCallback((event, folder) => {
    if (isMobile) {
      event.preventDefault();
      return;
    }
    
    event.dataTransfer.setData('text/plain', folder);
    event.target.classList.add('dragging');
  }, [isMobile]);

  const handleDrop = useCallback((event, side) => {
    if (isMobile) {
      event.preventDefault();
      return;
    }
    
    event.preventDefault();
    const folder = event.dataTransfer.getData('text');
    
    if (currentCase && currentCase.images && currentCase.images[folder]) {
      loadImage(folder, 0, side);
      
      switch(side) {
        case 'left':
        case 'single':
          setCurrentFolderLeft(folder);
          setCurrentIndexLeft(0);
          break;
        case 'right':
          setCurrentFolderRight(folder);
          setCurrentIndexRight(0);
          break;
        case 'topLeft':
          setCurrentFolderTopLeft(folder);
          setCurrentIndexTopLeft(0);
          break;
        case 'topRight':
          setCurrentFolderTopRight(folder);
          setCurrentIndexTopRight(0);
          break;
        case 'bottomLeft':
          setCurrentFolderBottomLeft(folder);
          setCurrentIndexBottomLeft(0);
          break;
        case 'bottomRight':
          setCurrentFolderBottomRight(folder);
          setCurrentIndexBottomRight(0);
          break;
      }
    }
    
    event.target.classList.remove('drag-over');
    document.querySelectorAll('.folder-thumbnail').forEach(el => el.classList.remove('dragging'));
  }, [currentCase, loadImage, isMobile]);

  // ==================== GESTION SOURIS (DESKTOP SEULEMENT) ====================

  const handleMouseDown = useCallback((e, side) => {
    if (isMobile) return;
    
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
  }, [isMobile]);

  const handleMouseMove = useCallback((e, side) => {
    if (isMobile) return;
    
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
  }, [isPanning, isZooming, isAdjustingContrast, isDragging, startX, startY, handlePan, handleZoom, handleContrast, handleScroll, isMobile]);

  const handleMouseUp = useCallback(() => {
    if (isMobile) return;
    setIsDragging(false);
    setIsPanning(false);
    setIsZooming(false);
    setIsAdjustingContrast(false);
  }, [isMobile]);

  // ==================== GESTION WHEEL (DESKTOP SEULEMENT) ==================== 
  
  const handleWheelEvent = useCallback((e) => {
    if (isMobile) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    let targetSide = 'single';
    
    if (viewMode === 2) {
      const viewers = document.querySelectorAll(`.${styles.viewerHalf}`);
      const leftViewer = viewers[0];
      const rightViewer = viewers[1];
      
      if (e.target.closest(`.${styles.viewer}`) === rightViewer) {
        targetSide = 'right';
      } else {
        targetSide = 'left';
      }
    } else if (viewMode === 3 || viewMode === 4) {
      const viewerElement = e.target.closest(`.${styles.viewer}`);
      if (viewerElement) {
        const viewerClass = viewerElement.className;
        if (viewerClass.includes('topLeft')) targetSide = 'topLeft';
        else if (viewerClass.includes('topRight')) targetSide = 'topRight';
        else if (viewerClass.includes('bottomLeft')) targetSide = 'bottomLeft';
        else if (viewerClass.includes('bottomRight')) targetSide = 'bottomRight';
      }
    }
    
    if (e.ctrlKey || e.metaKey) {
      handleZoom(targetSide, -e.deltaY);
    } else {
      handleScroll(e.deltaY, false, targetSide);
    }
  }, [viewMode, handleZoom, handleScroll, isMobile]);

  // ==================== EFFECTS ==================== 

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Empêche le scroll du body sur mobile et zoom de page
  useEffect(() => {
    if (isMobile) {
      // Empêche le scroll et zoom du body
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.touchAction = 'pan-x pan-y';
      
      // Empêche le zoom de la page via meta viewport
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
      
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.touchAction = '';
        
        // Restaure le viewport original
        if (viewportMeta) {
          viewportMeta.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover'
          );
        }
      };
    }
  }, [isMobile]);

  // Force les bonnes dimensions sur mobile
  useEffect(() => {
    if (isMobile && viewMode > 2) {
      setViewMode(1); // Force le mode 1 si on est en mode 3/4 sur mobile
    }
  }, [isMobile, viewMode]);

  // Update viewport quand les éléments changent
  useEffect(() => {
    updateViewport();
  }, [viewMode, isResponseVisible, isShortcutGuideVisible, updateViewport]);

  // Effect pour gérer la molette (desktop uniquement)
  useEffect(() => {
    if (isMobile) return;
    
    const mainViewer = document.getElementById('main-viewer');
    if (mainViewer) {
      mainViewer.addEventListener('wheel', handleWheelEvent, { passive: false });
    }

    return () => {
      if (mainViewer) {
        mainViewer.removeEventListener('wheel', handleWheelEvent);
      }
    };
  }, [handleWheelEvent, isMobile]);

  // Touches clavier (desktop uniquement)
  useEffect(() => {
    if (isMobile) return;
    
    const handleKeyDown = (event) => {
      if (event.key === "&" || event.key === "1") {
        setViewMode(1);
      } else if (event.key === "é" || event.key === "2") {
        setViewMode(2);
      } else if (event.key === "\"" || event.key === "3") {
        setViewMode(3);
      } else if (event.key === "'" || event.key === "4") {
        setViewMode(4);
      } else if (event.key === "ArrowDown") {
        if (viewMode === 1) {
          handleScroll(100, false, 'single');
        } else if (viewMode === 2) {
          handleScroll(100, false, 'left');
          handleScroll(100, false, 'right');
        } else if (viewMode === 3) {
          handleScroll(100, false, 'topLeft');
          handleScroll(100, false, 'topRight');
          handleScroll(100, false, 'bottomLeft');
        } else if (viewMode === 4) {
          handleScroll(100, false, 'topLeft');
          handleScroll(100, false, 'topRight');
          handleScroll(100, false, 'bottomLeft');
          handleScroll(100, false, 'bottomRight');
        }
      } else if (event.key === "ArrowUp") {
        if (viewMode === 1) {
          handleScroll(-100, false, 'single');
        } else if (viewMode === 2) {
          handleScroll(-100, false, 'left');
          handleScroll(-100, false, 'right');
        } else if (viewMode === 3) {
          handleScroll(-100, false, 'topLeft');
          handleScroll(-100, false, 'topRight');
          handleScroll(-100, false, 'bottomLeft');
        } else if (viewMode === 4) {
          handleScroll(-100, false, 'topLeft');
          handleScroll(-100, false, 'topRight');
          handleScroll(-100, false, 'bottomLeft');
          handleScroll(-100, false, 'bottomRight');
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleScroll, viewMode, isMobile]);

  // Effect pour charger le cas
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(`/cases/${caseId}`);
        const caseData = response.data;
        setCurrentCase(caseData);
        
        if (caseData.folders && caseData.folders.length > 0) {
          const folders = caseData.folders;
          setCurrentFolderLeft(folders[0] || '');
          setCurrentFolderRight(folders[1] || folders[0] || '');
          setCurrentFolderTopLeft(folders[0] || '');
          setCurrentFolderTopRight(folders[1] || folders[0] || '');
          setCurrentFolderBottomLeft(folders[2] || folders[0] || '');
          setCurrentFolderBottomRight(folders[3] || folders[1] || folders[0] || '');
          
          // Initialiser tous les index à 0
          setCurrentIndexLeft(0);
          setCurrentIndexRight(0);
          setCurrentIndexTopLeft(0);
          setCurrentIndexTopRight(0);
          setCurrentIndexBottomLeft(0);
          setCurrentIndexBottomRight(0);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du cas:', error);
      }
    };

    fetchCase();
  }, [caseId]);

  // Effects pour charger les images initiales pour tous les viewers
  useEffect(() => {
    if (currentCase && currentFolderLeft && leftViewerRef.current) {
      loadImage(currentFolderLeft, currentIndexLeft, viewMode === 1 ? 'single' : 'left');
    }
  }, [currentCase, currentFolderLeft, currentIndexLeft, viewMode, loadImage]);
  
  useEffect(() => {
    if (currentCase && currentFolderRight && rightViewerRef.current && viewMode >= 2) {
      loadImage(currentFolderRight, currentIndexRight, 'right');
    }
  }, [currentCase, currentFolderRight, currentIndexRight, viewMode, loadImage]);

  useEffect(() => {
    if (currentCase && currentFolderTopLeft && topLeftViewerRef.current && (viewMode === 3 || viewMode === 4)) {
      loadImage(currentFolderTopLeft, currentIndexTopLeft, 'topLeft');
    }
  }, [currentCase, currentFolderTopLeft, currentIndexTopLeft, viewMode, loadImage]);

  useEffect(() => {
    if (currentCase && currentFolderTopRight && topRightViewerRef.current && (viewMode === 3 || viewMode === 4)) {
      loadImage(currentFolderTopRight, currentIndexTopRight, 'topRight');
    }
  }, [currentCase, currentFolderTopRight, currentIndexTopRight, viewMode, loadImage]);

  useEffect(() => {
    if (currentCase && currentFolderBottomLeft && bottomLeftViewerRef.current && (viewMode === 3 || viewMode === 4)) {
      loadImage(currentFolderBottomLeft, currentIndexBottomLeft, 'bottomLeft');
    }
  }, [currentCase, currentFolderBottomLeft, currentIndexBottomLeft, viewMode, loadImage]);

  useEffect(() => {
    if (currentCase && currentFolderBottomRight && bottomRightViewerRef.current && viewMode === 4) {
      loadImage(currentFolderBottomRight, currentIndexBottomRight, 'bottomRight');
    }
  }, [currentCase, currentFolderBottomRight, currentIndexBottomRight, viewMode, loadImage]);

  // Effect pour les transformations d'images
  useEffect(() => {
    applyImageTransforms('left');
    applyImageTransforms('right');
    applyImageTransforms('single');
    applyImageTransforms('topLeft');
    applyImageTransforms('topRight');
    applyImageTransforms('bottomLeft');
    applyImageTransforms('bottomRight');
  }, [imageControls, applyImageTransforms]);

  // ==================== FONCTIONS HELPER ====================

  const getFolderName = useCallback((side) => {
    switch(side) {
      case 'left':
      case 'single':
        return currentFolderLeft;
      case 'right':
        return currentFolderRight;
      case 'topLeft':
        return currentFolderTopLeft;
      case 'topRight':
        return currentFolderTopRight;
      case 'bottomLeft':
        return currentFolderBottomLeft;
      case 'bottomRight':
        return currentFolderBottomRight;
      default:
        return '';
    }
  }, [currentFolderLeft, currentFolderRight, currentFolderTopLeft, currentFolderTopRight, 
      currentFolderBottomLeft, currentFolderBottomRight]);

  const getCurrentIndex = useCallback((side) => {
    switch(side) {
      case 'left':
      case 'single':
        return currentIndexLeft;
      case 'right':
        return currentIndexRight;
      case 'topLeft':
        return currentIndexTopLeft;
      case 'topRight':
        return currentIndexTopRight;
      case 'bottomLeft':
        return currentIndexBottomLeft;
      case 'bottomRight':
        return currentIndexBottomRight;
      default:
        return 0;
    }
  }, [currentIndexLeft, currentIndexRight, currentIndexTopLeft, currentIndexTopRight, 
      currentIndexBottomLeft, currentIndexBottomRight]);

  // ==================== FONCTION DE RENDU DES VIEWERS ====================

  const renderViewer = useCallback((side, className = '') => {
    const folderName = getFolderName(side);
    const currentIndex = getCurrentIndex(side);
    const totalImages = currentCase?.images?.[folderName]?.length || 0;
    
    let viewerRef;
    switch(side) {
      case 'left':
        viewerRef = leftViewerRef;
        break;
      case 'right':
        viewerRef = rightViewerRef;
        break;
      case 'single':
        viewerRef = singleViewerRef;
        break;
      case 'topLeft':
        viewerRef = topLeftViewerRef;
        break;
      case 'topRight':
        viewerRef = topRightViewerRef;
        break;
      case 'bottomLeft':
        viewerRef = bottomLeftViewerRef;
        break;
      case 'bottomRight':
        viewerRef = bottomRightViewerRef;
        break;
      default:
        viewerRef = singleViewerRef;
    }

    return (
      <div 
        className={`${styles.viewer} ${className} ${styles[side]}`}
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
          {folderName} - {currentIndex + 1}/{totalImages}
        </div>
        <img 
          ref={viewerRef}
          className={styles.image} 
          alt={`Image médicale ${side}`}
        />
      </div>
    );
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleDrop, 
      handleTouchStart, handleTouchMove, handleTouchEnd, getFolderName, getCurrentIndex, currentCase]);

  // ==================== FONCTION DE RENDU DES THUMBNAILS ====================

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
                // Sur mobile, charge toujours dans le viewer principal
                loadImage(folder, 0, viewMode === 1 ? 'single' : 'left');
                setCurrentFolderLeft(folder);
                setCurrentIndexLeft(0);
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
  }, [currentCase, isMobile, handleDragStart, loadImage, viewMode]);

  // ==================== FONCTION DE RENDU DU MAIN VIEWER ====================

  const renderMainViewer = useCallback(() => {
    // Sur mobile, force les modes 3 et 4 vers le mode 1
    if (isMobile && (viewMode === 3 || viewMode === 4)) {
      return renderViewer('single', styles.singleViewer);
    }

    switch(viewMode) {
      case 1:
        return renderViewer('single', styles.singleViewer);
      
      case 2:
        return (
          <div className={styles.dualViewer}>
            {renderViewer('left', styles.viewerHalf)}
            {renderViewer('right', styles.viewerHalf)}
          </div>
        );
      
      case 3:
        // Mode 3 uniquement sur desktop
        return (
          <div className={styles.tripleViewer}>
            {renderViewer('topLeft', styles.viewerThird)}
            {renderViewer('topRight', styles.viewerThird)}
            {renderViewer('bottomLeft', styles.viewerThird)}
          </div>
        );
      
      case 4:
        // Mode 4 uniquement sur desktop
        return (
          <div className={styles.quadViewer}>
            <div className={styles.quadTop}>
              {renderViewer('topLeft', styles.viewerQuarter)}
              {renderViewer('topRight', styles.viewerQuarter)}
            </div>
            <div className={styles.quadBottom}>
              {renderViewer('bottomLeft', styles.viewerQuarter)}
              {renderViewer('bottomRight', styles.viewerQuarter)}
            </div>
          </div>
        );
      
      default:
        return renderViewer('single', styles.singleViewer);
    }
  }, [viewMode, renderViewer, isMobile]);

  // ==================== FONCTIONS D'AFFICHAGE ====================

  if (!currentCase) return <div>Chargement...</div>;

  const getViewModeText = () => {
    if (isMobile) {
      switch(viewMode) {
        case 1: return 'Mode 1 viewer';
        case 2: return 'Mode 2 viewers';
        default: return 'Mode 1 viewer';
      }
    } else {
      switch(viewMode) {
        case 1: return 'Mode 1 viewer';
        case 2: return 'Mode 2 viewers';
        case 3: return 'Mode 3 viewers';
        case 4: return 'Mode 4 viewers';
        default: return 'Mode 1 viewer';
      }
    }
  };
      
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.layout}>
          {renderFolderThumbnails()}
          <div id="main-viewer" className={styles.mainViewer}>
            {renderMainViewer()}
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
              <div className={styles.shortcutTitle}>
                {isMobile ? 'Contrôles tactiles' : 'Raccourcis clavier'}
              </div>
              <ul className={styles.shortcutList}>
                {isMobile ? (
                  <>
                    <li><strong>Tap</strong> Sélectionner séquence</li>
                    <li><strong>Glisser ↕</strong> Navigation images</li>
                    <li><strong>Pincer</strong> Zoom</li>
                    <li><strong>Bouton</strong> Changer mode</li>
                  </>
                ) : (
                  <>
                    <li><strong>1 (&)</strong> Mode 1 viewer</li>
                    <li><strong>2 (é)</strong> Mode 2 viewers</li>
                    <li><strong>3 (")</strong> Mode 3 viewers</li>
                    <li><strong>4 (')</strong> Mode 4 viewers</li>
                    <li><strong>↑ ↓</strong> Navigation synchronisée</li>
                    <li><strong>Shift + clic gauche</strong> Déplacer</li>
                    <li><strong>Clic droit</strong> Zoom</li>
                    <li><strong>Shift + clic droit</strong> Contraste</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
        <div>
          <button 
            className={styles.responseButton}
            onClick={cycleViewMode}
          >
            {getViewModeText()}
          </button>
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