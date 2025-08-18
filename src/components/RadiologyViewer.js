import React, { useState, useEffect, useCallback, useRef, memo, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight, Eye, EyeOff, FileText } from 'lucide-react';
import axios from '../utils/axiosConfig';
import styles from './RadiologyViewer.module.css';

// 🚀 NOUVEAU : Cache d'images en mémoire
const imageCache = new Map();
const MAX_CACHE_SIZE = 100; // Limite du cache

// 🚀 NOUVEAU : Préchargeur d'images avec priorités
class ImagePreloader {
  constructor() {
    this.queue = [];
    this.loading = new Set();
    this.maxConcurrent = 3;
  }

  preload(url, priority = 0) {
    if (imageCache.has(url) || this.loading.has(url)) {
      return Promise.resolve(imageCache.get(url));
    }

    return new Promise((resolve, reject) => {
      const task = { url, priority, resolve, reject };
      this.queue.push(task);
      this.queue.sort((a, b) => b.priority - a.priority);
      this.processQueue();
    });
  }

  processQueue() {
    while (this.loading.size < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      this.loadImage(task);
    }
  }

  loadImage(task) {
    this.loading.add(task.url);
    
    const img = new Image();
    img.decoding = 'async'; // 🚀 Décodage asynchrone
    
    img.onload = () => {
      // Gestion du cache avec limite de taille
      if (imageCache.size >= MAX_CACHE_SIZE) {
        const firstKey = imageCache.keys().next().value;
        imageCache.delete(firstKey);
      }
      imageCache.set(task.url, img);
      
      this.loading.delete(task.url);
      task.resolve(img);
      this.processQueue();
    };
    
    img.onerror = () => {
      this.loading.delete(task.url);
      task.reject(new Error(`Failed to load ${task.url}`));
      this.processQueue();
    };
    
    img.src = task.url;
  }
}

const imagePreloader = new ImagePreloader();

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
  
  // 🚀 NOUVEAU : États de chargement
  const [loadingStates, setLoadingStates] = useState({
    left: false,
    right: false,
    single: false,
    topLeft: false,
    topRight: false,
    bottomLeft: false,
    bottomRight: false
  });
  
  // Détection mobile simple
  const [isMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || 
           'ontouchstart' in window || 
           navigator.maxTouchPoints > 0;
  });
  
  // Mode viewer : forcé à 1 sur mobile au démarrage
  const [viewMode, setViewMode] = useState(() => isMobile ? 1 : 1);
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  
  // 🆕 NOUVEAU : État pour les infos cliniques
  const [isClinicalInfoVisible, setIsClinicalInfoVisible] = useState(false);
  
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

  // 📧 NOUVEAUX ÉTATS POUR DRAG & DROP MOBILE
  const [isDraggingFolder, setIsDraggingFolder] = useState(false);
  const [draggedFolder, setDraggedFolder] = useState(null);
  const [dragOverTarget, setDragOverTarget] = useState(null);

  // 🆕 NOUVEAUX ÉTATS POUR DOUBLE-TAP ET PAN MOBILE
  const [isDoubleTapPanning, setIsDoubleTapPanning] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [panStartPoint, setPanStartPoint] = useState({ x: 0, y: 0 });
  const [currentPanOffset, setCurrentPanOffset] = useState({ x: 0, y: 0 });

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

  // 🔧 CORRECTION : Ajout d'une référence pour tracker le side actuel du drag
  const currentDragSideRef = useRef(null);

  // 🚀 NOUVEAU : Fonction pour obtenir l'URL d'une image
  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith('http') ? imagePath : `${process.env.REACT_APP_SPACES_URL}/${imagePath}`;
  }, []);

  // 🚀 NOUVEAU : Fonction de préchargement intelligent
  const preloadAdjacentImages = useCallback((folder, currentIndex, side) => {
    if (!currentCase?.images?.[folder]) return;
    
    const images = currentCase.images[folder];
    const preloadRange = isMobile ? 2 : 3; // Moins d'images en préchargement sur mobile
    
    // Précharger les images adjacentes avec des priorités
    for (let i = 1; i <= preloadRange; i++) {
      // Images suivantes (priorité haute)
      if (currentIndex + i < images.length) {
        const nextUrl = getImageUrl(images[currentIndex + i]);
        if (nextUrl) {
          imagePreloader.preload(nextUrl, 10 - i);
        }
      }
      
      // Images précédentes (priorité moyenne)
      if (currentIndex - i >= 0) {
        const prevUrl = getImageUrl(images[currentIndex - i]);
        if (prevUrl) {
          imagePreloader.preload(prevUrl, 5 - i);
        }
      }
    }
  }, [currentCase, getImageUrl, isMobile]);

  // ==================== FONCTION loadImage OPTIMISÉE ==================== 
  
  const loadImage = useCallback(async (folder, index, side) => {
    if (!currentCase?.images?.[folder]) return;
    
    const imagePath = currentCase.images[folder][index];
    if (!imagePath) return;
    
    const imageUrl = getImageUrl(imagePath);
    if (!imageUrl) return;
    
    // Définir l'état de chargement
    setLoadingStates(prev => ({ ...prev, [side]: true }));
    
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
      // 🔧 CORRECTION : Ajouter une transition smooth et éviter le grésillement
      const cachedImage = imageCache.get(imageUrl);
      
      if (cachedImage) {
        // Image déjà en cache, chargement instantané
        requestAnimationFrame(() => {
          if (imageElement) {
            imageElement.style.opacity = '0';
            setTimeout(() => {
              imageElement.src = imageUrl;
              imageElement.style.opacity = '1';
              setLoadingStates(prev => ({ ...prev, [side]: false }));
            }, 50);
          }
        });
      } else {
        // Charger l'image avec le préchargeur
        try {
          const img = await imagePreloader.preload(imageUrl, 100); // Priorité maximale pour l'image actuelle
          
          requestAnimationFrame(() => {
            if (imageElement) {
              imageElement.style.opacity = '0';
              setTimeout(() => {
                imageElement.src = imageUrl;
                imageElement.style.opacity = '1';
                setLoadingStates(prev => ({ ...prev, [side]: false }));
              }, 50);
            }
          });
        } catch (error) {
          console.error('Erreur de chargement image:', error);
          // Fallback : charger directement
          imageElement.src = imageUrl;
          setLoadingStates(prev => ({ ...prev, [side]: false }));
        }
      }
      
      // Mettre à jour l'index
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
      
      // 🚀 Précharger les images adjacentes
      preloadAdjacentImages(folder, index, side);
    }
  }, [currentCase, getImageUrl, preloadAdjacentImages]);

  // ==================== FONCTION handleScroll ==================== 
  
  const handleScroll = useCallback((deltaY, slowMode = false, side) => {
    const threshold = slowMode ? 8: 40;
    
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

  // ==================== AUTRES FONCTIONS ====================

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
    const zoomSensitivity = isMobile ? 0.002 : 0.001;
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

  // ==================== GESTION TOUCH MOBILE ====================

  const handleTouchStart = useCallback((e, side) => {
    if (!isMobile) return;
    
    const currentTime = Date.now();
    const tapInterval = currentTime - lastTapTime;
    
    // 🆕 DÉTECTION DU DOUBLE-TAP
    if (tapInterval < 300 && tapInterval > 0 && e.touches.length === 1) {
      // Double-tap détecté - active le mode pan
      e.preventDefault();
      e.stopPropagation();
      
      setIsDoubleTapPanning(true);
      setPanStartPoint({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
      
      // Récupère les valeurs actuelles de translation
      const controls = imageControls[side];
      setCurrentPanOffset({
        x: controls.translateX,
        y: controls.translateY
      });
      
      // Feedback visuel (optionnel - bordure bleue temporaire)
      const viewerElement = e.currentTarget;
      viewerElement.style.borderColor = 'rgba(0, 123, 255, 0.5)';
      viewerElement.style.borderWidth = '3px';
      
      return;
    }
    
    setLastTapTime(currentTime);
    
    // Gestion normale du pinch-to-zoom (2 doigts)
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
    } else if (e.touches.length === 1 && !isDoubleTapPanning) {
      // Touch simple pour le scroll
      setLastTouch({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
      });
    }
  }, [isMobile, imageControls, lastTapTime, isDoubleTapPanning]);
  
  const handleTouchMove = useCallback((e, side) => {
    if (!isMobile) return;
    
    // 🆕 GESTION DU PAN APRÈS DOUBLE-TAP
    if (isDoubleTapPanning && e.touches.length === 1) {
      e.preventDefault();
      e.stopPropagation();
      
      const touch = e.touches[0];
      const deltaX = touch.clientX - panStartPoint.x;
      const deltaY = touch.clientY - panStartPoint.y;
      
      // Applique le déplacement avec une sensibilité ajustée
      const sensitivity = 0.5; // 📧 RÉDUIT de 1.5 à 0.5 pour un mouvement plus précis
      
      setImageControls(prev => ({
        ...prev,
        [side]: {
          ...prev[side],
          translateX: currentPanOffset.x + (deltaX * sensitivity),
          translateY: currentPanOffset.y + (deltaY * sensitivity)
        }
      }));
      
      // Applique immédiatement la transformation
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
        const controls = imageControls[side];
        imageElement.style.transform = `scale(${controls.scale}) translate(${currentPanOffset.x + (deltaX * sensitivity)}px, ${currentPanOffset.y + (deltaY * sensitivity)}px)`;
      }
      
      return;
    }
    
    // Gestion du pinch-to-zoom (2 doigts)
    if (e.touches.length === 2) {
      e.preventDefault();
      e.stopPropagation();
      
      if (touchStartPoints) {
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
          const controls = imageControls[side];
          imageElement.style.transform = `scale(${newScale}) translate(${controls.translateX}px, ${controls.translateY}px)`;
        }
      }
    } else if (e.touches.length === 1 && !isDoubleTapPanning) {
      // Scroll normal (sans double-tap)
      const touch = e.touches[0];
      const deltaY = touch.clientY - lastTouch.y;
      
      if (Math.abs(deltaY) > 2) {
        handleScroll(deltaY * 5, false, side);
      }
      
      setLastTouch({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }, [isMobile, isDoubleTapPanning, panStartPoint, currentPanOffset, touchStartPoints, 
      initialScale, handleScroll, lastTouch, imageControls]);
  
  const handleTouchEnd = useCallback((e, side) => {
    if (!isMobile) return;
    
    // 🆕 FIN DU PAN APRÈS DOUBLE-TAP
    if (isDoubleTapPanning) {
      e.preventDefault();
      e.stopPropagation();
      
      setIsDoubleTapPanning(false);
      
      // Retire le feedback visuel
      const viewerElement = e.currentTarget;
      viewerElement.style.borderColor = '';
      viewerElement.style.borderWidth = '';
      
      // Sauvegarde la position finale
      const controls = imageControls[side];
      setCurrentPanOffset({
        x: controls.translateX,
        y: controls.translateY
      });
    }
    
    if (e.changedTouches.length === 2 || touchStartPoints) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setTouchStartPoints(null);
  }, [isMobile, touchStartPoints, isDoubleTapPanning, imageControls]);

  // ==================== FONCTION DE CHANGEMENT DE MODE ====================

  const cycleViewMode = useCallback(() => {
    setViewMode(prev => {
      if (isMobile) {
        return prev === 1 ? 2 : 1;
      } else {
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

  // 🆕 FONCTION DE RESET DE POSITION (triple-tap optionnel)
  const resetImagePosition = useCallback((side) => {
    setImageControls(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        translateX: 0,
        translateY: 0,
        scale: 1
      }
    }));
  }, []);

  // ==================== 📧 NOUVEAU SYSTÈME DRAG & DROP MOBILE ====================

  // Fonction de gestion du début de drag (mobile uniquement pour dossiers)
  const handleMobileDragStart = useCallback((event, folder) => {
    if (!isMobile) return;
    
    event.preventDefault();
    setIsDraggingFolder(true);
    setDraggedFolder(folder);
    
    // Feedback visuel
    event.currentTarget.style.opacity = '0.7';
    event.currentTarget.style.transform = 'scale(0.95)';
  }, [isMobile]);

  // Fonction de gestion du drag move (mobile)
  const handleMobileDragMove = useCallback((event) => {
    if (!isMobile || !isDraggingFolder) return;
    
    event.preventDefault();
    
    // Obtenir l'élément sous le doigt
    const touch = event.touches[0];
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    
    // Vérifier si on est au-dessus d'un viewer
    const viewer = elementBelow?.closest('[data-viewer-side]');
    if (viewer) {
      const side = viewer.getAttribute('data-viewer-side');
      setDragOverTarget(side);
      viewer.style.borderColor = '#007bff';
      viewer.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
    } else {
      setDragOverTarget(null);
      // Nettoyer les styles des viewers
      document.querySelectorAll('[data-viewer-side]').forEach(v => {
        v.style.borderColor = '';
        v.style.backgroundColor = '';
      });
    }
  }, [isMobile, isDraggingFolder]);

  // Fonction de gestion de la fin du drag (mobile)
  const handleMobileDragEnd = useCallback((event) => {
    if (!isMobile) return;
    
    event.preventDefault();
    
    // Restaurer l'apparence du thumbnail
    event.currentTarget.style.opacity = '';
    event.currentTarget.style.transform = '';
    
    // Si on a un target valide, charger l'image
    if (dragOverTarget && draggedFolder && currentCase?.images?.[draggedFolder]) {
      loadImage(draggedFolder, 0, dragOverTarget);
      
      // Mettre à jour le dossier et l'index selon le côté
      switch(dragOverTarget) {
        case 'left':
        case 'single':
          setCurrentFolderLeft(draggedFolder);
          setCurrentIndexLeft(0);
          break;
        case 'right':
          setCurrentFolderRight(draggedFolder);
          setCurrentIndexRight(0);
          break;
        case 'topLeft':
          setCurrentFolderTopLeft(draggedFolder);
          setCurrentIndexTopLeft(0);
          break;
        case 'topRight':
          setCurrentFolderTopRight(draggedFolder);
          setCurrentIndexTopRight(0);
          break;
        case 'bottomLeft':
          setCurrentFolderBottomLeft(draggedFolder);
          setCurrentIndexBottomLeft(0);
          break;
        case 'bottomRight':
          setCurrentFolderBottomRight(draggedFolder);
          setCurrentIndexBottomRight(0);
          break;
      }
    }
    
    // Nettoyer les styles des viewers
    document.querySelectorAll('[data-viewer-side]').forEach(v => {
      v.style.borderColor = '';
      v.style.backgroundColor = '';
    });
    
    // Reset des états
    setIsDraggingFolder(false);
    setDraggedFolder(null);
    setDragOverTarget(null);
  }, [isMobile, dragOverTarget, draggedFolder, currentCase, loadImage]);

  // ==================== GESTION DRAG & DROP (DESKTOP) ====================

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
    
    // 🔧 CORRECTION : Stocker le side actuel
    currentDragSideRef.current = side;
    
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
    
    // 🔧 CORRECTION : Utiliser le side stocké au mousedown
    const activeSide = currentDragSideRef.current || side;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    if (isPanning) {
      handlePan(activeSide, deltaX, deltaY);
    } else if (isZooming) {
      handleZoom(activeSide, -deltaY);
    } else if (isAdjustingContrast) {
      handleContrast(activeSide, deltaX);
    } else if (isDragging) {
      handleScroll(deltaY, true, activeSide);
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
    // 🔧 CORRECTION : Reset le side stocké
    currentDragSideRef.current = null;
  }, [isMobile]);

  // 🔧 CORRECTION : Ajouter un handler global pour mouseup
  useEffect(() => {
    if (isMobile) return;
    
    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsPanning(false);
      setIsZooming(false);
      setIsAdjustingContrast(false);
      currentDragSideRef.current = null;
    };

    const handleGlobalMouseLeave = (e) => {
      // Ne reset que si on quitte vraiment la fenêtre
      if (!e.relatedTarget || e.relatedTarget.nodeName === 'HTML') {
        handleGlobalMouseUp();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mouseleave', handleGlobalMouseLeave);

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.removeEventListener('mouseleave', handleGlobalMouseLeave);
    };
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

  // 📧 CORRECTION : Force le no-scroll sur mobile avec classe CSS
  useEffect(() => {
    // Ajoute la classe pour identifier la page RadiologyViewer
    document.body.classList.add('radiology-viewer-page');
    
    // Cleanup au démontage : supprime la classe
    return () => {
      document.body.classList.remove('radiology-viewer-page');
    };
  }, []);

  // Force les bonnes dimensions sur mobile
  useEffect(() => {
    if (isMobile && viewMode > 2) {
      setViewMode(1);
    }
  }, [isMobile, viewMode]);

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

  // 🚀 NOUVEAU : Effect pour charger le cas avec préchargement initial
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
          
          // 🚀 Précharger les premières images de chaque dossier
          folders.forEach((folder, index) => {
            if (caseData.images?.[folder]?.[0]) {
              const imageUrl = caseData.images[folder][0];
              const url = imageUrl.startsWith('http') ? 
                imageUrl : `${process.env.REACT_APP_SPACES_URL}/${imageUrl}`;
              imagePreloader.preload(url, 50 - index * 10);
            }
          });
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
    const isLoading = loadingStates[side];
    
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
        className={`${styles.viewer} ${className} ${styles[side]} ${isLoading ? styles.loading : ''}`}
        data-viewer-side={side}
        onMouseDown={(e) => handleMouseDown(e, side)}
        onMouseMove={(e) => handleMouseMove(e, side)}
        onMouseUp={handleMouseUp}
        onContextMenu={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDrop(e, side)}
        onTouchStart={(e) => handleTouchStart(e, side)}
        onTouchMove={(e) => handleTouchMove(e, side)}
        onTouchEnd={(e) => handleTouchEnd(e, side)}
      >
        <div className={styles.folderLabel}>
          {folderName} - {currentIndex + 1}/{totalImages}
        </div>
        <img 
          ref={viewerRef}
          className={styles.image} 
          alt={`Image médicale ${side}`}
          decoding="async"
        />
      </div>
    );
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleDrop, 
      handleTouchStart, handleTouchMove, handleTouchEnd, getFolderName, getCurrentIndex, 
      currentCase, loadingStates]);

  // 🚀 NOUVEAU : Fonction de rendu optimisée pour les thumbnails
  const renderFolderThumbnails = useCallback(() => {
    if (!currentCase || !currentCase.folders) return null;

    return (
      <div id="folder-thumbnails" className={styles.folderGrid}>
        {currentCase.folders.map(folder => {
          // 🚀 Précharger l'image principale du dossier
          const mainImageUrl = currentCase.folderMainImages?.[folder];
          if (mainImageUrl && !imageCache.has(mainImageUrl)) {
            imagePreloader.preload(mainImageUrl, 1);
          }
          
          return (
            <div 
              key={folder} 
              className={styles.folderThumbnail}
              draggable={!isMobile}
              onDragStart={(e) => !isMobile && handleDragStart(e, folder)}
              onTouchStart={(e) => isMobile && handleMobileDragStart(e, folder)}
              onTouchMove={(e) => isMobile && handleMobileDragMove(e)}
              onTouchEnd={(e) => isMobile && handleMobileDragEnd(e)}
              onClick={() => {
                if (isMobile && !isDraggingFolder) {
                  loadImage(folder, 0, viewMode === 1 ? 'single' : 'left');
                  setCurrentFolderLeft(folder);
                  setCurrentIndexLeft(0);
                }
              }}
            >
              <img 
                src={mainImageUrl || `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`}
                alt={`${folder} thumbnail`} 
                className={styles.folderThumbnailImage}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  if (e.target.src !== `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`) {
                    e.target.src = `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`;
                  }
                }}
              />
              <div className={styles.folderThumbnailLabel}>{folder}</div>
            </div>
          );
        })}
      </div>
    );
  }, [currentCase, isMobile, handleDragStart, handleMobileDragStart, handleMobileDragMove, 
      handleMobileDragEnd, loadImage, viewMode, isDraggingFolder]);

  // ==================== FONCTION DE RENDU DU MAIN VIEWER ====================

  const renderMainViewer = useCallback(() => {
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
                    <li><strong>Double-tap + Drag</strong> Déplacer l'image</li>
                    <li><strong>Drag</strong> Glisser dossier vers viewer</li>
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
          {/* 🆕 NOUVEAU : Bouton pour les infos cliniques */}
          <button 
            className={styles.responseButton}
            onClick={() => setIsClinicalInfoVisible(!isClinicalInfoVisible)}
            title="Informations cliniques du patient"
          >
            <FileText size={16} />
            {!isMobile && 'Infos cliniques'}
          </button>

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

      {/* 🆕 NOUVEAU : Popup pour les infos cliniques */}
      {isClinicalInfoVisible && currentCase && (
        <div className={styles.clinicalInfoBox}>
          <div className={styles.clinicalInfoHeader}>
            <h3>📋 Informations cliniques</h3>
            <button 
              onClick={() => setIsClinicalInfoVisible(false)}
              className={styles.closeButton}
              title="Fermer"
            >
              <X size={18} />
            </button>
          </div>
          <div className={styles.clinicalInfoContent}>
            {currentCase.clinicalInfo ? (
              <p>{currentCase.clinicalInfo}</p>
            ) : (
              <p className={styles.noClinicalInfo}>
                Aucune information clinique n'a été renseignée pour ce cas.
              </p>
            )}
          </div>
        </div>
      )}

      {isResponseVisible && currentCase && currentCase.answer && (
        <div className={styles.responseBox}>
          <p className={styles.responseText}>{currentCase.answer}</p>
        </div>
      )}
    </div>
  );
}

export default memo(RadiologyViewer);