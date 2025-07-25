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
  // 🔧 AJOUT : Nouveaux états pour les viewers 3 et 4
  const [currentIndexTopLeft, setCurrentIndexTopLeft] = useState(0);
  const [currentIndexTopRight, setCurrentIndexTopRight] = useState(0);
  const [currentIndexBottomLeft, setCurrentIndexBottomLeft] = useState(0);
  const [currentIndexBottomRight, setCurrentIndexBottomRight] = useState(0);
  
  const [currentFolderLeft, setCurrentFolderLeft] = useState('');
  const [currentFolderRight, setCurrentFolderRight] = useState('');
  // 🔧 AJOUT : Nouveaux dossiers pour les viewers 3 et 4
  const [currentFolderTopLeft, setCurrentFolderTopLeft] = useState('');
  const [currentFolderTopRight, setCurrentFolderTopRight] = useState('');
  const [currentFolderBottomLeft, setCurrentFolderBottomLeft] = useState('');
  const [currentFolderBottomRight, setCurrentFolderBottomRight] = useState('');
  
  // 🔧 MODIFICATION : Mode viewer étendu (1, 2, 3 ou 4)
  const [viewMode, setViewMode] = useState(1); // 1=single, 2=dual, 3=triple, 4=quad
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  
  // 🔧 AJOUT : Contrôles d'image pour tous les viewers
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
  const [isMobile] = useState(window.innerWidth < 768);

  const leftViewerRef = useRef(null);
  const rightViewerRef = useRef(null);
  const singleViewerRef = useRef(null);
  // 🔧 AJOUT : Nouvelles références pour les viewers 3 et 4
  const topLeftViewerRef = useRef(null);
  const topRightViewerRef = useRef(null);
  const bottomLeftViewerRef = useRef(null);
  const bottomRightViewerRef = useRef(null);

  const [touchStartPoints, setTouchStartPoints] = useState(null);
  const [initialScale, setInitialScale] = useState(1);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });

  const [theme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  // ==================== FONCTION loadImage ÉTENDUE ==================== 
  
  const loadImage = useCallback((folder, index, side) => {
    if (currentCase && currentCase.images && currentCase.images[folder]) {
      const imagePath = currentCase.images[folder][index];
      if (imagePath) {
        const imageUrl = imagePath.startsWith('http') ? imagePath : `${process.env.REACT_APP_SPACES_URL}/${imagePath}`;
        
        // 🔧 AJOUT : Support pour tous les viewers
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
          // 🔧 AJOUT : Mise à jour des index pour tous les viewers
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
        
        // 🔧 AJOUT : Support pour tous les viewers
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
  }, [currentCase, currentFolderLeft, currentFolderRight, currentFolderTopLeft, currentFolderTopRight, 
      currentFolderBottomLeft, currentFolderBottomRight, currentIndexLeft, currentIndexRight, 
      currentIndexTopLeft, currentIndexTopRight, currentIndexBottomLeft, currentIndexBottomRight, loadImage]);

  // ==================== AUTRES FONCTIONS ÉTENDUES ====================

  const applyImageTransforms = useCallback((side) => {
    const controls = imageControls[side];
    
    // 🔧 AJOUT : Support pour tous les viewers
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

  // 🔧 MODIFICATION : handlePan étendu pour tous les viewers
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
      
      // Application immédiate pour un suivi parfait de la souris
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

  // 🔧 FIX CRITIQUE : Touch handlers optimisés pour mobile
  const handleTouchStart = useCallback((e, side) => {
    // FIX : Ne pas empêcher les événements par défaut de manière systématique
    if (e.touches.length === 2) {
      // Zoom/pinch - on peut empêcher le défaut ici car c'est spécifique
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
      // Navigation - ne pas empêcher le défaut pour permettre le scroll
      setLastTouch({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  }, [imageControls]);
  
  const handleTouchMove = useCallback((e, side) => {
    // FIX : Gestion plus fine du preventDefault
    if (e.touches.length === 2 && touchStartPoints) {
      // Zoom - empêcher le défaut
      e.preventDefault();
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
      // Navigation - permettre le scroll natif par défaut
      const touch = e.touches[0];
      const deltaY = touch.clientY - lastTouch.y;
      
      // Seulement empêcher le défaut si on est vraiment en train de naviguer dans les images
      if (Math.abs(deltaY) > 5) {
        // Seulement si on a une véritable intention de navigation
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

  // 🔧 MODIFICATION : Fonction de changement de mode étendue
  const cycleViewMode = useCallback(() => {
    setViewMode(prev => {
      const nextMode = prev >= 4 ? 1 : prev + 1;
      
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
  }, []);

  const handleDragStart = useCallback((event, folder) => {
    event.dataTransfer.setData('text/plain', folder);
    event.target.classList.add('dragging');
  }, []);

  // 🔧 MODIFICATION : handleDrop étendu pour tous les viewers
  const handleDrop = useCallback((event, side) => {
    event.preventDefault();
    const folder = event.dataTransfer.getData('text');
    
    if (currentCase && currentCase.images && currentCase.images[folder]) {
      loadImage(folder, 0, side);
      
      // 🔧 AJOUT : Mise à jour du dossier pour tous les viewers
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

  // ==================== GESTION DES ÉVÉNEMENTS WHEEL ÉTENDUE ==================== 
  
  const handleWheelEvent = useCallback((e) => {
    // FIX CRITIQUE : Gestion plus fine du preventDefault
    // Ne l'empêche que si on fait vraiment du zoom/navigation d'images
    const isImageInteraction = e.ctrlKey || e.metaKey || e.target.closest(`.${styles.image}`);
    
    if (isImageInteraction) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    // 🔧 MODIFICATION : Identifier le viewer ciblé pour tous les modes
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
      // Détecter quel viewer est ciblé en mode 3 ou 4
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

  // ==================== EFFECTS ==================== 

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isMobile && viewMode !== 1) {
      setViewMode(1);
    }
  }, [isMobile, viewMode]);

  // Effect pour gérer la molette - FIX CRITIQUE
  useEffect(() => {
    const mainViewer = document.getElementById('main-viewer');
    if (mainViewer) {
      // FIX : Utilisation passive: false seulement quand nécessaire
      mainViewer.addEventListener('wheel', handleWheelEvent, { 
        passive: false,
        capture: true 
      });
    }

    return () => {
      if (mainViewer) {
        mainViewer.removeEventListener('wheel', handleWheelEvent, { capture: true });
      }
    };
  }, [handleWheelEvent]);

  // 🔧 MODIFICATION : Touches clavier étendues pour tous les modes
  useEffect(() => {
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
  }, [handleScroll, viewMode]);

  // Effect pour les événements touch - FIX CRITIQUE
  useEffect(() => {
    if (isTouchDevice) {
      const viewer = document.querySelector(`.${styles.viewer}`);
      let touchStartY = 0;
      let lastScrollTime = 0;
      const scrollDelay = 50;
      
      const handleTouchStartGlobal = (e) => {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMoveGlobal = (e) => {
        // FIX CRITIQUE : Ne pas empêcher par défaut de manière systématique
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        const currentTime = Date.now();
        
        // Seulement pour la navigation d'images, pas pour le scroll général
        const isImageContainer = e.target.closest(`.${styles.image}`) || e.target.closest(`.${styles.viewer}`);
        
        if (isImageContainer && currentTime - lastScrollTime > scrollDelay) {
          if (Math.abs(deltaY) > 15) { // Seuil plus élevé
            e.preventDefault(); // Seulement ici qu'on empêche le défaut
            const direction = deltaY > 0 ? 1 : -1;
            handleScroll(direction * 50, false, viewMode === 1 ? 'single' : 'left');
            lastScrollTime = currentTime;
          }
        }
        
        touchStartY = currentY;
      };

      // FIX CRITIQUE : Gestion plus fine du preventDefault
      const preventRefresh = (e) => {
        // Seulement empêcher le refresh si on tire depuis le haut de la page
        if (window.scrollY === 0 && e.touches[0].clientY > e.touches[0].clientY) {
          e.preventDefault();
        }
      };

      // FIX : Ne pas bloquer l'overflow du body
      // document.body.style.overflow = 'hidden'; // SUPPRIMÉ
      
      document.addEventListener('touchmove', preventRefresh, { passive: false });
      viewer?.addEventListener('touchstart', handleTouchStartGlobal, { passive: true });
      viewer?.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });

      return () => {
        // document.body.style.overflow = ''; // SUPPRIMÉ
        document.removeEventListener('touchmove', preventRefresh);
        viewer?.removeEventListener('touchstart', handleTouchStartGlobal);
        viewer?.removeEventListener('touchmove', handleTouchMoveGlobal);
      };
    }
  }, [isTouchDevice, handleScroll, viewMode]);

  // Effect pour charger le cas
  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(`/cases/${caseId}`);
        const caseData = response.data;
        setCurrentCase(caseData);
        
        // 🔧 AJOUT : Initialiser tous les dossiers
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

  // 🔧 AJOUT : Effects pour les nouveaux viewers
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

  // 🔧 AJOUT : Fonction pour obtenir le nom du dossier selon le côté
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

  // 🔧 AJOUT : Fonction pour obtenir l'index selon le côté
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

  // 🔧 MODIFICATION : Fonction renderViewer étendue
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

  // 🔧 AJOUT : Fonction pour rendre le viewer selon le mode
  const renderMainViewer = useCallback(() => {
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
  }, [viewMode, renderViewer]);
      
  if (!currentCase) return <div>Chargement...</div>;

  // 🔧 MODIFICATION : Texte du bouton selon le mode
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