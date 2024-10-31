import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import axios from '../utils/axiosConfig';
import styles from './RadiologyViewer.module.css';

// Composant Gallery séparé
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
  // States
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

  // UI States
  const [isPanning, setIsPanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isAdjustingContrast, setIsAdjustingContrast] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [accumulatedDelta, setAccumulatedDelta] = useState(0);
  const [isShortcutGuideVisible, setIsShortcutGuideVisible] = useState(false);
  const [folderThumbnails, setFolderThumbnails] = useState({});

  // Touch States
  const isTouchDevice = 'ontouchstart' in window;
  const [touchStartPoints, setTouchStartPoints] = useState(null);
  const [lastTouch, setLastTouch] = useState({ x: 0, y: 0 });
  const [isMobile] = useState(window.innerWidth < 768);
  const [initialScale, setInitialScale] = useState(1);
  const [touchDistance, setTouchDistance] = useState(null);

  // Refs
  const leftViewerRef = useRef(null);
  const rightViewerRef = useRef(null);
  const singleViewerRef = useRef(null);

  // Theme
  const [theme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  // Base functions
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

  const loadImage = useCallback((folder, index, side) => {
    if (currentCase?.images?.[folder]) {
      const imagePath = currentCase.images[folder][index];
      if (imagePath) {
        const imageUrl = imagePath.startsWith('http') ? imagePath : `${process.env.REACT_APP_SPACES_URL}/${imagePath}`;
        const imageElement = side === 'left' ? leftViewerRef.current :
                           side === 'right' ? rightViewerRef.current :
                           singleViewerRef.current;
        if (imageElement) {
          imageElement.src = imageUrl;
          if (side === 'left' || side === 'single') {
            setCurrentIndexLeft(index);
          } else if (side === 'right') {
            setCurrentIndexRight(index);
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
        const currentFolder = side === 'left' || side === 'single' ? currentFolderLeft : currentFolderRight;
        const currentIndex = side === 'left' || side === 'single' ? currentIndexLeft : currentIndexRight;
        const images = currentCase?.images[currentFolder];
        if (images) {
          const newIndex = (currentIndex + direction + images.length) % images.length;
          loadImage(currentFolder, newIndex, side);
        }
        return 0;
      }
      return newDelta;
    });
  }, [currentCase, currentFolderLeft, currentFolderRight, currentIndexLeft, currentIndexRight, loadImage]);

  const handleZoom = useCallback((side, delta) => {
    setImageControls(prev => {
      const newControls = {...prev};
      newControls[side].scale = Math.max(0.1, Math.min(5, newControls[side].scale * (1 + delta * 0.001)));
      return newControls;
    });
    applyImageTransforms(side);
  }, [applyImageTransforms]);

  const handlePan = useCallback((side, deltaX, deltaY) => {
    setImageControls(prev => {
      const newControls = {...prev};
      newControls[side].translateX += deltaX;
      newControls[side].translateY += deltaY;
      return newControls;
    });
    applyImageTransforms(side);
  }, [applyImageTransforms]);

  const handleContrast = useCallback((side, delta) => {
    setImageControls(prev => {
      const newControls = {...prev};
      newControls[side].contrast = Math.max(0, Math.min(200, newControls[side].contrast + delta * 0.5));
      return newControls;
    });
    applyImageTransforms(side);
  }, [applyImageTransforms]);

  // Touch handlers
  const handleTouchStart = useCallback((e, side) => {
    if (e.touches.length === 2) {
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
    } else if (e.touches.length === 1) {
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
      
      if (Math.abs(deltaY) > 5) {
        handleScroll(deltaY * 2, false, side);
      }
      
      setLastTouch({
        x: touch.clientX,
        y: touch.clientY
      });
    }
  }, [touchStartPoints, initialScale, applyImageTransforms, handleScroll, lastTouch]);

  const handleTouchEnd = useCallback(() => {
    setTouchStartPoints(null);
    setInitialScale(1);
    setTouchDistance(null);
  }, []);

  // Mouse handlers
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

  // Drag and drop handlers
  const handleDragStart = useCallback((event, folder) => {
    event.dataTransfer.setData('text/plain', folder);
    event.target.classList.add('dragging');
  }, []);

  const handleDrop = useCallback((event, side) => {
    event.preventDefault();
    const folder = event.dataTransfer.getData('text');
    if (currentCase?.images?.[folder]) {
      loadImage(folder, 0, side);
      if (side === 'left' || side === 'single') {
        setCurrentFolderLeft(folder);
      } else {
        setCurrentFolderRight(folder);
      }
    }
    event.target.classList.remove('drag-over');
    document.querySelectorAll('.folder-thumbnail').forEach(el => el.classList.remove('dragging'));
  }, [currentCase, loadImage]);

  // View mode toggling
  const toggleViewMode = useCallback(() => {
    setIsSingleViewMode(prev => {
      if (!prev) {
        setTimeout(() => {
          if (singleViewerRef.current && leftViewerRef.current) {
            singleViewerRef.current.src = leftViewerRef.current.src;
            setImageControls(prevControls => ({
              ...prevControls,
              single: {...prevControls.left}
            }));
          }
        }, 0);
      } else {
        setTimeout(() => {
          if (leftViewerRef.current && singleViewerRef.current) {
            leftViewerRef.current.src = singleViewerRef.current.src;
            rightViewerRef.current.src = singleViewerRef.current.src;
            setImageControls(prevControls => ({
              ...prevControls,
              left: {...prevControls.single},
              right: {...prevControls.single}
            }));
          }
        }, 0);
      }
      return !prev;
    });
  }, []);

  // Data fetching
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
        } else {
          thumbnails[folder] = `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`;
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération de la vignette pour le dossier ${folder}:`, error);
        thumbnails[folder] = `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`;
      }
    }
  
    setFolderThumbnails(thumbnails);
  }, []);

  const fetchCase = useCallback(async () => {
    try {
      const response = await axios.get(`/cases/${caseId}`);
      setCurrentCase(response.data);
      if (response.data.folders && response.data.folders.length > 0) {
        setCurrentFolderLeft(response.data.folders[0]);
        setCurrentFolderRight(response.data.folders[0]);
      }
      fetchFolderThumbnails(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement du cas:', error);
    }
  }, [caseId, fetchFolderThumbnails]);

  // Effects
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isMobile && !isSingleViewMode) {
      setIsSingleViewMode(true);
    }
  }, [isMobile]);

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

  useEffect(() => {
    const preventDefault = (e) => {
      e.preventDefault();
    };
  
    document.body.addEventListener('wheel', preventDefault, { passive: false });
  
    return () => {
      document.body.removeEventListener('wheel', preventDefault);
    };
  }, []);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  useEffect(() => {
    if (currentCase && currentCase.folders && currentCase.folders.length > 0) {
      const firstFolder = currentCase.folders[0];
      if (currentCase.images && currentCase.images[firstFolder]) {
        loadImage(firstFolder, 0, 'left');
        loadImage(firstFolder, 0, 'right');
      }
    }
  }, [currentCase, loadImage]);

  // Render functions
  const renderViewer = useCallback((side) => (
    <div 
      className={`${styles.viewer} ${styles.viewerHalf}`}
      onWheel={(e) => {
        e.preventDefault();
        if (e.ctrlKey) {
          handleZoom(side, -e.deltaY);
        } else {
          handleScroll(e.deltaY, false, side);
        }
      }}
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
                id="single-viewer" 
                className={`${styles.viewer} ${styles.singleViewer}`}
                onWheel={(e) => {
                  e.preventDefault();
                  if (e.ctrlKey) {
                    handleZoom('single', -e.deltaY);
                  } else {
                    handleScroll(e.deltaY, false, 'single');
                  }
                }}
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
                <div className={styles.folderLabel}>{currentFolderLeft}</div>
                <img ref={singleViewerRef} className={styles.image} alt="Image médicale" />
              </div>
            ) : (
              <div id="dual-viewer" className={styles.dualViewer}>
                {renderViewer('left')}
                {renderViewer('right')}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className={styles.bottomBar}>
        <div 
          className={styles.shortcutGuide}
          onMouseEnter={() => setIsShortcutGuideVisible(true)}
          onMouseLeave={() => setIsShortcutGuideVisible(false)}
        >
          <div className={styles.shortcutIcon}>?</div>
          {isShortcutGuideVisible && (
            <div className={`${styles.shortcutPopup} ${styles.visible}`}>
              <h3 className={styles.shortcutTitle}>Guide des raccourcis</h3>
              <ul className={styles.shortcutList}>
                <li><strong>Zoom :</strong> Clic droit + Déplacer la souris verticalement ou pincer pour zoomer sur mobile</li>
                <li><strong>Défilement des images :</strong> Molette de la souris, flèches haut/bas ou glisser sur mobile</li>
                <li><strong>Contraste :</strong> Shift + Clic droit + Déplacer la souris horizontalement</li>
                <li><strong>Déplacer l'image :</strong> Shift + Clic gauche + Déplacer la souris</li>
                <li><strong>Mode simple/double écran :</strong> Touche "&" pour simple, "é" pour double</li>
              </ul>
            </div>
          )}
        </div>
  
        <div>
          <button 
            className={styles.responseButton}
            onClick={() => setIsResponseVisible(!isResponseVisible)}
          >
            {isResponseVisible ? "Cacher la réponse" : "Réponse"}
          </button>
          <Link to={`/sheet/${caseId}`} className={styles.sheetLink}>
            Voir la fiche récapitulative
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