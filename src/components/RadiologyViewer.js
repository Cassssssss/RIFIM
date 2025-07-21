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
  
  const loadImage = useCallback((folder, index, side) => {
    console.log('Loading image:', folder, index, side);
    if (currentCase && currentCase.images && currentCase.images[folder]) {
      const imagePath = currentCase.images[folder][index];
      if (imagePath) {
        // Vérifier si l'URL est déjà complète
        const imageUrl = imagePath.startsWith('http') ? imagePath : `${process.env.REACT_APP_SPACES_URL}/${imagePath}`;
        console.log('Image URL:', imageUrl);
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

  // ================================
  // MODIFICATION PRINCIPALE ICI 🔧
  // ================================
  const handleScroll = useCallback((deltaY, slowMode = false, side) => {
    const threshold = slowMode ? 10 : 50;
    setAccumulatedDelta(prev => {
      const newDelta = prev + deltaY;
      if (Math.abs(newDelta) >= threshold) {
        const direction = newDelta > 0 ? 1 : -1;
        const currentFolder = side === 'left' || side === 'single' ? currentFolderLeft : currentFolderRight;
        const currentIndex = side === 'left' || side === 'single' ? currentIndexLeft : currentIndexRight;
        const images = currentCase.images[currentFolder];
        if (images) {
          // 🚨 CHANGEMENT : Remplacer le modulo par des limites strictes
          let newIndex = currentIndex + direction;
          
          // Empêcher de dépasser les limites (pas de boucle)
          if (newIndex < 0) {
            newIndex = 0; // Bloquer à la première image
          } else if (newIndex >= images.length) {
            newIndex = images.length - 1; // Bloquer à la dernière image
          }
          
          // Ne charger l'image que si l'index a changé
          if (newIndex !== currentIndex) {
            loadImage(currentFolder, newIndex, side);
          }
        }
        return 0;
      }
      return newDelta;
    });
  }, [currentCase, currentFolderLeft, currentFolderRight, currentIndexLeft, currentIndexRight, loadImage]);

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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (isMobile && !isSingleViewMode) {
      setIsSingleViewMode(true);
    }
  }, [isMobile]);

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
        console.error(`Erreur lors du chargement de la thumbnail pour ${folder}:`, error);
      }
    }
    setFolderThumbnails(thumbnails);
  }, []);

  useEffect(() => {
    const fetchCase = async () => {
      try {
        const response = await axios.get(`/cases/${caseId}`);
        setCurrentCase(response.data);
        fetchFolderThumbnails(response.data);
        
        if (response.data.folders && response.data.folders.length > 0) {
          const firstFolder = response.data.folders[0];
          setCurrentFolderLeft(firstFolder);
          setCurrentFolderRight(firstFolder);
          if (isSingleViewMode) {
            loadImage(firstFolder, 0, 'single');
          } else {
            loadImage(firstFolder, 0, 'left');
            loadImage(firstFolder, 0, 'right');
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du cas:', error);
      }
    };

    if (caseId) {
      fetchCase();
    }
  }, [caseId, fetchFolderThumbnails, loadImage, isSingleViewMode]);

  useEffect(() => {
    Object.keys(imageControls).forEach(side => {
      applyImageTransforms(side);
    });
  }, [imageControls, applyImageTransforms]);

  const handleZoom = useCallback((side, deltaY) => {
    setImageControls(prev => {
      const newControls = { ...prev };
      const zoomFactor = deltaY > 0 ? 1.1 : 0.9;
      newControls[side] = {
        ...newControls[side],
        scale: Math.max(0.1, Math.min(5, newControls[side].scale * zoomFactor))
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
    setImageControls(prev => {
      const newControls = { ...prev };
      newControls[side] = {
        ...newControls[side],
        translateX: newControls[side].translateX + deltaX,
        translateY: newControls[side].translateY + deltaY
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
    setImageControls(prev => {
      const newControls = { ...prev };
      const contrastChange = deltaX * 0.5;
      newControls[side] = {
        ...newControls[side],
        contrast: Math.max(0, Math.min(200, newControls[side].contrast + contrastChange))
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
    if (isTouchDevice) {
      const viewer = document.querySelector(`.${styles.viewer}`);
      let touchStartY = 0;
      let lastScrollTime = 0;
      const scrollDelay = 0;
      
      const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchMove = (e) => {
        e.preventDefault();
        const currentY = e.touches[0].clientY;
        const deltaY = touchStartY - currentY;
        const currentTime = Date.now();
        
        if (currentTime - lastScrollTime > scrollDelay) {
          if (Math.abs(deltaY) > 1) {
            const direction = deltaY > 0 ? 1 : -1;
            handleScroll(direction * 9, false, isSingleViewMode ? 'single' : 'left');
            lastScrollTime = currentTime;
          }
        }
        
        touchStartY = currentY;
      };

      const preventRefresh = (e) => {
        e.preventDefault();
      };

      document.body.style.overflow = 'hidden';
      document.addEventListener('touchmove', preventRefresh, { passive: false });
      viewer?.addEventListener('touchstart', handleTouchStart, { passive: false });
      viewer?.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('touchmove', preventRefresh);
        viewer?.removeEventListener('touchstart', handleTouchStart);
        viewer?.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isTouchDevice, handleScroll, isSingleViewMode]);

  const getTouchDistance = (touches) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

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
              src={currentCase.folderMainImages?.[folder] || folderThumbnails[folder] || `${process.env.REACT_APP_SPACES_URL}/images/default.jpg`}
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
  }, [currentCase, isMobile, handleDragStart, loadImage, folderThumbnails]);
      
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
          <div className={styles.shortcutIcon}>⌨️</div>
          {isShortcutGuideVisible && (
            <div className={`${styles.shortcutPopup} ${styles.visible}`}>
              <h3 className={styles.shortcutTitle}>Guide des raccourcis</h3>
              <ul className={styles.shortcutList}>
                <li><strong>Zoom :</strong> Clic droit + Déplacer la souris verticalement</li>
                <li><strong>Défilement des images :</strong> Molette de la souris ou flèches haut/bas</li>
                <li><strong>Contraste :</strong> Shift + Clic droit + Déplacer la souris horizontalement</li>
                <li><strong>Déplacer l'image :</strong> Shift + Clic gauche + Déplacer la souris</li>
                <li><strong>Mode simple/double écran :</strong> Touche "&" pour simple, "é" pour double</li>
              </ul>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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