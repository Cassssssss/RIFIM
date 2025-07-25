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
  
  // Mode viewer adaptatif selon l'écran
  const [viewMode, setViewMode] = useState(1);
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  
  // Contrôles d'image pour tous les viewers
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
  
  // États tactiles améliorés
  const [touchStartPoints, setTouchStartPoints] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollAccumulator, setScrollAccumulator] = useState(0);
  const [activeViewer, setActiveViewer] = useState('single');

  // Détection des capacités de l'appareil
  const [deviceInfo] = useState(() => {
    if (typeof window === 'undefined') return { isMobile: false, isPortrait: true };
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || 
                          window.innerWidth <= 1023;
    const isPortraitMode = window.innerHeight > window.innerWidth;
    
    return {
      isMobile: isMobileDevice,
      isPortrait: isPortraitMode,
      isTouch: 'ontouchstart' in window,
      isIOS: /iphone|ipad|ipod/i.test(userAgent),
      isAndroid: /android/i.test(userAgent)
    };
  });

  const [orientation, setOrientation] = useState(() => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  // Bloquage du scroll de la page pour RadiologyViewer
  useEffect(() => {
    // Bloque le scroll de la page uniquement sur mobile
    if (deviceInfo.isMobile) {
      // Ajoute la classe pour bloquer le scroll
      document.body.classList.add('viewer-active');
      
      // Style dynamique pour bloquer le scroll
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      
      // Empêche le scroll par défaut sur les événements touch
      const preventDefaultScroll = (e) => {
        // Ne bloque que si c'est sur le container principal, pas sur les thumbnails
        if (!e.target.closest(`.${styles.folderGrid}`)) {
          e.preventDefault();
        }
      };
      
      document.addEventListener('touchmove', preventDefaultScroll, { passive: false });
      document.addEventListener('wheel', preventDefaultScroll, { passive: false });
      
      return () => {
        // Remet le scroll normal quand on quitte
        document.body.classList.remove('viewer-active');
        document.body.style.overflow = originalStyle;
        document.documentElement.style.overflow = '';
        document.removeEventListener('touchmove', preventDefaultScroll);
        document.removeEventListener('wheel', preventDefaultScroll);
      };
    }
  }, [deviceInfo.isMobile]);

  // Gestion de l'orientation
  useEffect(() => {
    const handleOrientationChange = () => {
      setTimeout(() => {
        const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
        setOrientation(newOrientation);
        
        // Ajuste le viewMode selon l'orientation sur mobile
        if (deviceInfo.isMobile) {
          if (newOrientation === 'portrait') {
            setViewMode(1); // Un seul viewer en portrait
          } else {
            setViewMode(Math.min(viewMode, 2)); // Maximum 2 viewers en landscape
          }
        }
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [deviceInfo.isMobile, viewMode]);

  // ==================== FONCTIONS DE CHARGEMENT D'IMAGES ====================
  
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
          
          // Mise à jour des index
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

  // ==================== GESTION DU SCROLL ADAPTATIF ====================
  
  const handleScroll = useCallback((deltaY, slowMode = false, side) => {
    const threshold = slowMode ? 10 : (deviceInfo.isMobile ? 30 : 50);
    
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
      currentIndexTopLeft, currentIndexTopRight, currentIndexBottomLeft, currentIndexBottomRight, 
      loadImage, deviceInfo.isMobile]);

  // ==================== CONTRÔLES D'IMAGES ====================

  const applyImageTransforms = useCallback((side) => {
    const controls = imageControls[side];
    
    let imageElement;
    switch(side) {
      case 'left': imageElement = leftViewerRef.current; break;
      case 'right': imageElement = rightViewerRef.current; break;
      case 'single': imageElement = singleViewerRef.current; break;
      case 'topLeft': imageElement = topLeftViewerRef.current; break;
      case 'topRight': imageElement = topRightViewerRef.current; break;
      case 'bottomLeft': imageElement = bottomLeftViewerRef.current; break;
      case 'bottomRight': imageElement = bottomRightViewerRef.current; break;
      default: imageElement = singleViewerRef.current;
    }
    
    if (imageElement && controls) {
      imageElement.style.transform = `scale(${controls.scale}) translate(${controls.translateX}px, ${controls.translateY}px)`;
      imageElement.style.filter = `contrast(${controls.contrast}%) brightness(${controls.brightness}%)`;
    }
  }, [imageControls]);

  const handleZoom = useCallback((side, deltaY) => {
    const zoomSensitivity = deviceInfo.isMobile ? 0.002 : 0.001;
    const zoomFactor = 1 + (deltaY * zoomSensitivity);
    
    setImageControls(prevControls => {
      const newControls = {
        ...prevControls,
        [side]: {
          ...prevControls[side],
          scale: Math.max(0.1, Math.min(10, prevControls[side].scale * zoomFactor))
        }
      };
      return newControls;
    });
  }, [deviceInfo.isMobile]);

  const handlePan = useCallback((side, deltaX, deltaY) => {
    setImageControls(prevControls => {
      const sensitivity = deviceInfo.isMobile ? 1.5 : 1;
      const newControls = {
        ...prevControls,
        [side]: {
          ...prevControls[side],
          translateX: prevControls[side].translateX + (deltaX * sensitivity),
          translateY: prevControls[side].translateY + (deltaY * sensitivity)
        }
      };
      
      // Application immédiate pour mobile
      let imageElement;
      switch(side) {
        case 'left': imageElement = leftViewerRef.current; break;
        case 'right': imageElement = rightViewerRef.current; break;
        case 'single': imageElement = singleViewerRef.current; break;
        case 'topLeft': imageElement = topLeftViewerRef.current; break;
        case 'topRight': imageElement = topRightViewerRef.current; break;
        case 'bottomLeft': imageElement = bottomLeftViewerRef.current; break;
        case 'bottomRight': imageElement = bottomRightViewerRef.current; break;
        default: imageElement = singleViewerRef.current;
      }
      
      if (imageElement) {
        imageElement.style.transform = `scale(${newControls[side].scale}) translate(${newControls[side].translateX}px, ${newControls[side].translateY}px)`;
      }
      
      return newControls;
    });
  }, [deviceInfo.isMobile]);

  // ==================== GESTION TACTILE OPTIMISÉE ====================
  
  const handleTouchStart = useCallback((e, side) => {
    const isImageInteraction = e.target.closest(`.${styles.image}`);
    
    if (e.touches.length === 2) {
      // Zoom à deux doigts
      e.preventDefault();
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
      setIsScrolling(false);
    } else if (e.touches.length === 1 && isImageInteraction) {
      // Navigation et pan
      const touch = e.touches[0];
      setLastTouch({
        x: touch.clientX,
        y: touch.clientY
      });
      setActiveViewer(side);
      setIsScrolling(true);
      setScrollAccumulator(0);
    }
  }, [imageControls]);
  
  const handleTouchMove = useCallback((e, side) => {
    const isImageInteraction = e.target.closest(`.${styles.image}`);
    
    if (e.touches.length === 2 && touchStartPoints) {
      // Zoom pinch
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const newDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      const scaleFactor = newDistance / touchStartPoints.distance;
      const newScale = Math.max(0.1, Math.min(10, initialScale * scaleFactor));

      setImageControls(prev => ({
        ...prev,
        [side]: {
          ...prev[side],
          scale: newScale
        }
      }));
      applyImageTransforms(side);
    } else if (e.touches.length === 1 && isScrolling && isImageInteraction) {
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = lastTouch.x - touch.clientX;
      const deltaY = lastTouch.y - touch.clientY;
      
      // Détection du type de mouvement
      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        // Mouvement horizontal - Pan si zoomé
        if (imageControls[side].scale > 1.1) {
          handlePan(side, -deltaX, 0);
        }
      } else {
        // Mouvement vertical - Navigation
        setScrollAccumulator(prev => {
          const newAccumulator = prev + deltaY;
          
          if (Math.abs(newAccumulator) > 25) {
            const direction = newAccumulator > 0 ? 1 : -1;
            handleScroll(direction * 100, false, side);
            return 0;
          }
          
          return newAccumulator;
        });
      }
      
      setLastTouch({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }, [touchStartPoints, initialScale, isScrolling, lastTouch, imageControls, applyImageTransforms, handlePan, handleScroll]);
  
  const handleTouchEnd = useCallback((e) => {
    setTouchStartPoints(null);
    setIsScrolling(false);
    setScrollAccumulator(0);
  }, []);

  // ==================== GESTION WHEEL OPTIMISÉE ====================
  
  const handleWheelEvent = useCallback((e) => {
    const isImageInteraction = e.target.closest(`.${styles.image}`) || 
                              e.target.closest(`.${styles.viewer}`) ||
                              e.ctrlKey || e.metaKey;
    
    if (isImageInteraction) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // Identifier le viewer ciblé
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
    } else if (isImageInteraction) {
      handleScroll(e.deltaY, false, targetSide);
    }
  }, [viewMode, handleZoom, handleScroll]);

  // ==================== GESTION MODES DE VUE ADAPTATIFS ====================
  
  const cycleViewMode = useCallback(() => {
    setViewMode(prev => {
      let nextMode;
      
      if (deviceInfo.isMobile) {
        if (orientation === 'portrait') {
          nextMode = 1; // Un seul viewer en portrait mobile
        } else {
          nextMode = prev >= 2 ? 1 : prev + 1; // Maximum 2 viewers en landscape mobile
        }
      } else {
        nextMode = prev >= 4 ? 1 : prev + 1; // Tous les modes sur desktop
      }
      
      // Copier l'image actuelle vers le mode suivant
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
    });
  }, [deviceInfo.isMobile, orientation]);

  // ==================== DRAG & DROP ====================
  
  const handleDragStart = useCallback((event, folder) => {
    if (deviceInfo.isMobile) return; // Pas de drag sur mobile
    event.dataTransfer.setData('text/plain', folder);
    event.target.classList.add('dragging');
  }, [deviceInfo.isMobile]);

  const handleDrop = useCallback((event, side) => {
    if (deviceInfo.isMobile) return;
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
  }, [currentCase, loadImage, deviceInfo.isMobile]);

  // ==================== GESTION SOURIS (DESKTOP) ====================
  
  const handleMouseDown = useCallback((e, side) => {
    if (deviceInfo.isMobile) return;
    
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
  }, [deviceInfo.isMobile]);

  const handleMouseMove = useCallback((e, side) => {
    if (deviceInfo.isMobile) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (isPanning) {
      handlePan(side, deltaX, deltaY);
    } else if (isZooming) {
      handleZoom(side, -deltaY);
    } else if (isAdjustingContrast) {
      // Ajustement de contraste
      const contrastSensitivity = 2;
      setImageControls(prevControls => ({
        ...prevControls,
        [side]: {
          ...prevControls[side],
          contrast: Math.max(0, Math.min(300, prevControls[side].contrast + (deltaX * contrastSensitivity)))
        }
      }));
    } else if (isDragging) {
      handleScroll(deltaY, true, side);
    }

    setStartX(e.clientX);
    setStartY(e.clientY);
  }, [deviceInfo.isMobile, isPanning, isZooming, isAdjustingContrast, isDragging, startX, startY, handlePan, handleZoom, handleScroll]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
    setIsZooming(false);
    setIsAdjustingContrast(false);
  }, []);

  // ==================== EFFECTS ====================

  // Effect pour gérer la molette
  useEffect(() => {
    const mainViewer = document.getElementById('main-viewer');
    if (mainViewer) {
      mainViewer.addEventListener('wheel', handleWheelEvent, { 
        passive: false,
        capture: false 
      });
    }

    return () => {
      if (mainViewer) {
        mainViewer.removeEventListener('wheel', handleWheelEvent);
      }
    };
  }, [handleWheelEvent]);

  // Touches clavier (desktop uniquement)
  useEffect(() => {
    if (deviceInfo.isMobile) return;
    
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
  }, [handleScroll, viewMode, deviceInfo.isMobile]);

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

  // Effects pour charger les images initiales
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

  // ==================== FONCTIONS DE RENDU ====================

  // Fonction pour obtenir le nom du dossier
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

  // Fonction pour obtenir l'index
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

  // Fonction renderViewer
  const renderViewer = useCallback((side, className = '') => {
    const folderName = getFolderName(side);
    const currentIndex = getCurrentIndex(side);
    const totalImages = currentCase?.images?.[folderName]?.length || 0;
    
    let viewerRef;
    switch(side) {
      case 'left': viewerRef = leftViewerRef; break;
      case 'right': viewerRef = rightViewerRef; break;
      case 'single': viewerRef = singleViewerRef; break;
      case 'topLeft': viewerRef = topLeftViewerRef; break;
      case 'topRight': viewerRef = topRightViewerRef; break;
      case 'bottomLeft': viewerRef = bottomLeftViewerRef; break;
      case 'bottomRight': viewerRef = bottomRightViewerRef; break;
      default: viewerRef = singleViewerRef;
    }

    const eventHandlers = deviceInfo.isMobile ? {
      onTouchStart: (e) => handleTouchStart(e, side),
      onTouchMove: (e) => handleTouchMove(e, side),
      onTouchEnd: handleTouchEnd
    } : {
      onMouseDown: (e) => handleMouseDown(e, side),
      onMouseMove: (e) => handleMouseMove(e, side),
      onMouseUp: handleMouseUp,
      onContextMenu: (e) => e.preventDefault(),
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => handleDrop(e, side)
    };

    return (
      <div 
        className={`${styles.viewer} ${className} ${styles[side]}`}
        {...eventHandlers}
      >
        <div className={styles.folderLabel}>
          {folderName} - {currentIndex + 1}/{totalImages}
        </div>
        <img 
          ref={viewerRef}
          className={styles.image} 
          alt={`Image médicale ${side}`}
          draggable={false}
        />
      </div>
    );
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, 
      handleMouseUp, handleDrop, getFolderName, getCurrentIndex, currentCase, deviceInfo.isMobile]);

  // Fonction pour changer de dossier
  const handleFolderClick = useCallback((folder) => {
    if (viewMode === 1 || deviceInfo.isMobile) {
      loadImage(folder, 0, 'single');
      setCurrentFolderLeft(folder);
      setCurrentIndexLeft(0);
    } else if (viewMode === 2) {
      loadImage(folder, 0, 'left');
      setCurrentFolderLeft(folder);
      setCurrentIndexLeft(0);
    } else if (viewMode >= 3) {
      loadImage(folder, 0, 'topLeft');
      setCurrentFolderTopLeft(folder);
      setCurrentIndexTopLeft(0);
    }
  }, [viewMode, deviceInfo.isMobile, loadImage]);

  // Rendu des miniatures de dossiers
  const renderFolderThumbnails = useCallback(() => {
    if (!currentCase || !currentCase.folders) return null;

    return (
      <div id="folder-thumbnails" className={`${styles.folderGrid} ${deviceInfo.isMobile ? styles.mobileGrid : ''}`}>
        {currentCase.folders.map(folder => (
          <div 
            key={folder} 
            className={`${styles.folderThumbnail} ${
              (viewMode === 1 && currentFolderLeft === folder) ||
              (viewMode === 2 && currentFolderLeft === folder) ||
              (viewMode >= 3 && currentFolderTopLeft === folder) 
                ? styles.active 
                : ''
            }`}
            draggable={!deviceInfo.isMobile}
            onDragStart={(e) => !deviceInfo.isMobile && handleDragStart(e, folder)}
            onClick={() => handleFolderClick(folder)}
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
              loading="lazy"
            />
            <div className={styles.folderThumbnailLabel}>{folder}</div>
          </div>
        ))}
      </div>
    );
  }, [currentCase, deviceInfo.isMobile, handleDragStart, viewMode, currentFolderLeft, currentFolderTopLeft, handleFolderClick]);

  // Rendu du viewer principal
  const renderMainViewer = useCallback(() => {
    // Sur mobile portrait, forcer un seul viewer
    if (deviceInfo.isMobile && orientation === 'portrait') {
      return renderViewer('single', styles.singleViewer);
    }
    
    switch(viewMode) {
      case 1:
        return renderViewer('single', styles.singleViewer);
      
      case 2:
        return (
          <div className={`${styles.dualViewer} ${deviceInfo.isMobile ? styles.mobileDual : ''}`}>
            {renderViewer('left', styles.viewerHalf)}
            {renderViewer('right', styles.viewerHalf)}
          </div>
        );
      
      case 3:
        return (
          <div className={styles.tripleViewer}>
            {renderViewer('topLeft', styles.viewerThird)}
            {renderViewer('topRight', styles.viewerThird)}
            {renderViewer('bottomLeft', styles.viewerThird)}
          </div>
        );
      
      case 4:
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
  }, [viewMode, renderViewer, deviceInfo.isMobile, orientation]);
      
  if (!currentCase) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Chargement du cas...</p>
      </div>
    );
  }

  // Texte du bouton selon le mode et la plateforme
  const getViewModeText = () => {
    if (deviceInfo.isMobile && orientation === 'portrait') {
      return 'Mode mobile (1 viewer)';
    }
    
    switch(viewMode) {
      case 1: return 'Mode 1 viewer';
      case 2: return 'Mode 2 viewers';
      case 3: return 'Mode 3 viewers';
      case 4: return 'Mode 4 viewers';
      default: return 'Mode 1 viewer';
    }
  };
      
  return (
    <div className={`${styles.container} ${deviceInfo.isMobile ? styles.mobileContainer : ''} ${orientation === 'portrait' ? styles.portrait : styles.landscape}`}>
      <div className={styles.content}>
        <div className={`${styles.layout} ${deviceInfo.isMobile ? styles.mobileLayout : ''}`}>
          {renderFolderThumbnails()}
          <div id="main-viewer" className={`${styles.mainViewer} ${deviceInfo.isMobile ? styles.mobileViewer : ''}`}>
            {renderMainViewer()}
          </div>
        </div>
      </div>

      <div className={`${styles.bottomBar} ${deviceInfo.isMobile ? styles.mobileBottomBar : ''}`}>
        {!deviceInfo.isMobile && (
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
                  <li><strong>1 (&)</strong> Mode 1 viewer</li>
                  <li><strong>2 (é)</strong> Mode 2 viewers</li>
                  <li><strong>3 (")</strong> Mode 3 viewers</li>
                  <li><strong>4 (')</strong> Mode 4 viewers</li>
                  <li><strong>↑ ↓</strong> Navigation synchronisée</li>
                  <li><strong>Shift + clic gauche</strong> Déplacer</li>
                  <li><strong>Clic droit</strong> Zoom</li>
                  <li><strong>Shift + clic droit</strong> Contraste</li>
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div className={styles.buttonsContainer}>
          {/* Affiche le bouton de changement de mode seulement si pertinent */}
          {(!deviceInfo.isMobile || orientation === 'landscape') && (
            <button 
              className={styles.responseButton}
              onClick={cycleViewMode}
            >
              {getViewModeText()}
            </button>
          )}
          
          <button 
            className={styles.responseButton}
            onClick={() => setIsResponseVisible(!isResponseVisible)}
          >
            {isResponseVisible ? (
              <>
                <EyeOff size={16} />
                {!deviceInfo.isMobile && 'Cacher la réponse'}
              </>
            ) : (
              <>
                <Eye size={16} />
                {!deviceInfo.isMobile && 'Voir la réponse'}
              </>
            )}
          </button>
          
          <Link to={`/sheet/${caseId}`} className={styles.sheetLink}>
            📋 {!deviceInfo.isMobile && 'Fiche récapitulative'}
          </Link>
        </div>
      </div>

      {isResponseVisible && currentCase && currentCase.answer && (
        <div className={`${styles.responseBox} ${deviceInfo.isMobile ? styles.mobileResponseBox : ''}`}>
          <p className={styles.responseText}>{currentCase.answer}</p>
        </div>
      )}
    </div>
  );
}

export default memo(RadiologyViewer);