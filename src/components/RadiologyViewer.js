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
  
  const [viewMode, setViewMode] = useState(1);
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
  const isTouchDevice = 'ontouchstart' in window;
  
  // 🔧 CORRECTION : Détection mobile plus précise
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || isTouchDevice;
  });

  const leftViewerRef = useRef(null);
  const rightViewerRef = useRef(null);
  const singleViewerRef = useRef(null);
  const topLeftViewerRef = useRef(null);
  const topRightViewerRef = useRef(null);
  const bottomLeftViewerRef = useRef(null);
  const bottomRightViewerRef = useRef(null);

  const [touchStartY, setTouchStartY] = useState(0);
  const [isTouch, setIsTouch] = useState(false);
  const [touchDistance, setTouchDistance] = useState(null);
  const [touchMoved, setTouchMoved] = useState(false);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [touchStartPoints, setTouchStartPoints] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const [theme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  // 🎯 MOBILE : Effect pour gérer le viewport mobile de façon optimale
  useEffect(() => {
    if (!isMobile) return;

    const setMobileViewport = () => {
      // 🔧 CORRECTION : Calcul précis de la hauteur réelle du viewport mobile
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Force la hauteur du container à être exacte
      const container = document.querySelector(`.${styles.container}`);
      if (container) {
        const headerHeight = 60; // Header mobile
        const exactHeight = window.innerHeight - headerHeight;
        container.style.height = `${exactHeight}px`;
        container.style.maxHeight = `${exactHeight}px`;
      }
    };

    // Calcul initial
    setMobileViewport();
    
    // Recalcul lors des changements d'orientation et de resize
    const handleViewportChange = () => {
      // Délai pour laisser le temps au navigateur de s'ajuster
      setTimeout(setMobileViewport, 100);
    };
    
    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('orientationchange', handleViewportChange);
    
    // Recalcul périodique pour les navigateurs qui changent la barre d'URL
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMobileViewport();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('orientationchange', handleViewportChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // 🔧 MOBILE : Effect pour empêcher le scroll du body et optimiser les performances
  useEffect(() => {
    if (isMobile) {
      // Sauvegarde les styles originaux
      const originalBodyStyle = {
        overflow: document.body.style.overflow,
        height: document.body.style.height,
        position: document.body.style.position,
        touchAction: document.body.style.touchAction,
        userSelect: document.body.style.userSelect
      };
      
      const originalHtmlStyle = {
        overflow: document.documentElement.style.overflow,
        height: document.documentElement.style.height,
        touchAction: document.documentElement.style.touchAction
      };
      
      // 🎯 SOLUTION : Styles optimaux pour mobile
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
      document.body.style.height = '100dvh'; // Support navigateurs modernes
      document.body.style.position = 'fixed';
      document.body.style.touchAction = 'none';
      document.body.style.userSelect = 'none';
      document.body.style.width = '100%';
      
      document.documentElement.style.overflow = 'hidden';
      document.documentElement.style.height = '100vh';
      document.documentElement.style.height = '100dvh';
      document.documentElement.style.touchAction = 'none';
      
      return () => {
        // Restaure les styles originaux
        Object.assign(document.body.style, originalBodyStyle);
        Object.assign(document.documentElement.style, originalHtmlStyle);
      };
    }
  }, [isMobile]);

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

  // 🔧 MOBILE : Gestion tactile optimisée avec prévention des comportements par défaut
  const handleTouchStart = useCallback((e, side) => {
    // 🎯 SOLUTION : Empêche tous les comportements par défaut sur mobile
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStartY(touch.clientY);
      setIsTouch(true);
      setTouchMoved(false);
      
    } else if (e.touches.length === 2) {
      // Gestion du pinch-to-zoom avec deux doigts
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
      setIsTouch(false);
    }
  }, [imageControls]);
  
  const handleTouchMove = useCallback((e, side) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.touches.length === 1 && isTouch) {
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const deltaY = touchStartY - currentY;
      const currentTime = Date.now();
      
      setTouchMoved(true);
      
      // 🔧 CORRECTION : Gestion plus réactive du scroll tactile
      if (currentTime - lastScrollTime > 80) { // Throttle réduit pour plus de réactivité
        if (Math.abs(deltaY) > 25) { // Seuil réduit pour plus de sensibilité
          const direction = deltaY > 0 ? 1 : -1;
          const targetSide = viewMode === 1 ? 'single' : side;
          handleScroll(direction * 120, false, targetSide);
          setTouchStartY(currentY);
          setLastScrollTime(currentTime);
        }
      }
      
    } else if (e.touches.length === 2 && touchStartPoints) {
      // Gestion du pinch-to-zoom
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
    }
  }, [isTouch, touchStartY, lastScrollTime, touchStartPoints, initialScale, viewMode, handleScroll]);
  
  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsTouch(false);
    setTouchStartPoints(null);
    setTouchMoved(false);
  }, []);

  const cycleViewMode = useCallback(() => {
    setViewMode(prev => {
      const nextMode = prev >= 4 ? 1 : prev + 1;
      
      if (nextMode === 1 && singleViewerRef.current && leftViewerRef.current) {
        singleViewerRef.current.src = leftViewerRef.current.src;
        setImageControls(prevControls => ({
          ...prevControls,
          single: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 }
        }));
      } else if (nextMode === 2 && leftViewerRef.current && singleViewerRef.current) {
        leftViewerRef.current.src = singleViewerRef.current.src;
        if (rightViewerRef.current) {
          rightViewerRef.current.src = singleViewerRef.current.src;
        }
        setImageControls(prevControls => ({
          ...prevControls,
          left: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 },
          right: { scale: 1, contrast: 100, brightness: 100, translateX: 0, translateY: 0 }
        }));
      }
      
      return nextMode;
    });
  }, []);

  const handleDragStart = useCallback((event, folder) => {
    event.dataTransfer.setData('text/plain', folder);
    event.target.classList.add('dragging');
  }, []);

  const handleDrop = useCallback((event, side) => {
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

  const handleWheelEvent = useCallback((e) => {
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
  }, [viewMode, handleZoom, handleScroll]);

  // ==================== EFFECTS ==================== 

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // 🔧 MOBILE : Force le mode 1 viewer sur mobile
  useEffect(() => {
    if (isMobile && viewMode !== 1) {
      setViewMode(1);
    }
  }, [isMobile, viewMode]);

  // Effect pour gérer la molette
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

  // Touches clavier
  useEffect(() => {
    const handleKeyDown = (event) => {
      // 🔧 MOBILE : Désactive les raccourcis clavier sur mobile
      if (isMobile) return;
      
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

  // Effect tactile optimisé
  useEffect(() => {
    if (isTouchDevice && isMobile) {
      // 🎯 SOLUTION : Empêche le comportement de scroll par défaut
      document.body.style.overscrollBehavior = 'none';
      document.documentElement.style.overscrollBehavior = 'none';
      
      const preventDoubleTapZoom = (e) => {
        e.preventDefault();
      };
      
      const images = document.querySelectorAll(`.${styles.image}`);
      images.forEach(img => {
        img.addEventListener('touchstart', preventDoubleTapZoom, { passive: false });
        img.addEventListener('touchmove', preventDoubleTapZoom, { passive: false });
        img.addEventListener('touchend', preventDoubleTapZoom, { passive: false });
      });

      return () => {
        document.body.style.overscrollBehavior = '';
        document.documentElement.style.overscrollBehavior = '';
        images.forEach(img => {
          img.removeEventListener('touchstart', preventDoubleTapZoom);
          img.removeEventListener('touchmove', preventDoubleTapZoom);
          img.removeEventListener('touchend', preventDoubleTapZoom);
        });
      };
    }
  }, [isTouchDevice, isMobile]);

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

  // Fonctions helper
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

  // 🎯 Fonction renderViewer avec gestion tactile optimisée
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
        onMouseDown={(e) => !isMobile && handleMouseDown(e, side)}
        onMouseMove={(e) => !isMobile && handleMouseMove(e, side)}
        onMouseUp={!isMobile ? handleMouseUp : undefined}
        onContextMenu={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, side)}
        onTouchStart={(e) => isMobile && handleTouchStart(e, side)}
        onTouchMove={(e) => isMobile && handleTouchMove(e, side)}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
        style={{
          touchAction: isMobile ? 'none' : 'auto' // Empêche tous les gestes par défaut sur mobile
        }}
      >
        <div className={styles.folderLabel}>
          {folderName} - {currentIndex + 1}/{totalImages}
        </div>
        <img 
          ref={viewerRef}
          className={styles.image}
          alt={`Image médicale ${side}`}
          draggable={false}
          style={{
            transform: 'scale(1) translate(0px, 0px)',
            filter: 'contrast(100%) brightness(100%)',
            touchAction: 'none' // Empêche les gestes sur l'image
          }}
        />
      </div>
    );
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleDrop, 
      handleTouchStart, handleTouchMove, handleTouchEnd, getFolderName, 
      getCurrentIndex, currentCase, isMobile]);

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
                // 🔧 MOBILE : Click direct sur mobile pour charger l'image
                loadImage(folder, 0, 'single');
                setCurrentFolderLeft(folder);
              }
            }}
            style={{
              touchAction: isMobile ? 'manipulation' : 'auto'
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

  const renderMainViewer = useCallback(() => {
    // 🔧 MOBILE : Force le mode single sur mobile
    if (isMobile) {
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
  }, [viewMode, renderViewer, isMobile]);
      
  if (!currentCase) return <div>Chargement...</div>;

  const getViewModeText = () => {
    switch(viewMode) {
      case 1: return 'Mode 1 viewer';
      case 2: return 'Mode 2 viewers';
      case 3: return 'Mode 3 viewers';
      case 4: return 'Mode 4 viewers';
      default: return 'Mode 1 viewer';
    }
  };
      
  return (
    <div className={styles.container}>
      <div className={styles.headerSpacer}></div>
      
      <div className={styles.content}>
        <div className={styles.layout}>
          {renderFolderThumbnails()}
          <div 
            id="main-viewer" 
            className={styles.mainViewer}
            style={{
              touchAction: isMobile ? 'none' : 'auto' // Contrôle total des gestes tactiles
            }}
          >
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
              <div className={styles.shortcutTitle}>Raccourcis {isMobile ? 'tactiles' : 'clavier'}</div>
              <ul className={styles.shortcutList}>
                {!isMobile ? (
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
                ) : (
                  <>
                    <li><strong>Glissement vertical</strong> Navigation tactile</li>
                    <li><strong>Pincement</strong> Zoom à deux doigts</li>
                    <li><strong>Clic sur dossier</strong> Charger les images</li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
        <div>
          {/* 🔧 CORRECTION : Bouton mode seulement sur desktop */}
          {!isMobile && (
            <button 
              className={styles.responseButton}
              onClick={cycleViewMode}
            >
              {getViewModeText()}
            </button>
          )}
          {/* 🔧 CORRECTION : Bouton réponse TOUJOURS visible */}
          <button 
            className={styles.responseButton}
            onClick={() => setIsResponseVisible(!isResponseVisible)}
          >
            {isResponseVisible ? (
              <>
                <EyeOff size={16} />
                {isMobile ? 'Cacher' : 'Cacher la réponse'}
              </>
            ) : (
              <>
                <Eye size={16} />
                {isMobile ? 'Réponse' : 'Voir la réponse'}
              </>
            )}
          </button>
          <Link to={`/sheet/${caseId}`} className={styles.sheetLink}>
            📋 {isMobile ? 'Fiche' : 'Fiche récapitulative'}
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