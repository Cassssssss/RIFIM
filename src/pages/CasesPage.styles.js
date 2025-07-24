import styled from 'styled-components';

// ==================== LAYOUT PRINCIPAL RESPONSIVE ==================== 
export const PageContainer = styled.div`
  padding: 2rem;
  background-color: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  color: ${props => props.theme.text};
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem;
    min-height: calc(100vh - 70px); /* Ajustement pour header mobile */
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    min-height: calc(100vh - 65px);
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
`;

export const SectionContainer = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  position: relative;
  overflow: hidden;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 12px ${props => props.theme.shadow};
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
    border-radius: 6px;
  }
`;

// ==================== GRILLES RESPONSIVE ==================== 
export const CasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  @media (max-width: 580px) {
    grid-template-columns: 1fr; /* Une seule colonne sur petits écrans */
    gap: 0.75rem;
  }
`;

export const FoldersSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid ${props => props.theme.border};
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
  }
  
  @media (max-width: 480px) {
    margin-top: 1rem;
    padding-top: 1rem;
  }
`;

// ==================== CARDS RESPONSIVE ==================== 
export const CaseCard = styled.div`
  background-color: ${props => props.theme.surface};
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${props => props.theme.border};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      transform: none;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    border-radius: 8px;
    transition: box-shadow 0.2s ease; /* Transition simplifiée */
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    }
  }
  
  @media (max-width: 480px) {
    border-radius: 6px;
  }
`;

export const CaseImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      opacity: 1;
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    height: 180px; /* Légèrement plus petit sur mobile */
  }
  
  @media (max-width: 480px) {
    height: 160px;
  }
`;

export const CaseTitle = styled.h2`
  color: ${props => props.theme.text};
  text-align: center;
  padding: 1rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 1.125rem;
    padding: 0.75rem;
    line-height: 1.3;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.5rem;
  }
`;

export const CaseActions = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.75rem;
  gap: 0.5rem;
  border-top: 1px solid ${props => props.theme.border};
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    flex-direction: column; /* Passage en colonne sur mobile */
    gap: 0.5rem;
    padding: 1rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.375rem;
  }
`;

// ==================== GALERIE D'IMAGES MOBILE ==================== 
export const GalleryContainer = styled.div`
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  overflow: hidden;
  background-color: ${props => props.theme.card};
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
    border-radius: 6px;
  }
`;

export const GalleryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props => props.theme.surface};
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-bottom: 1px solid ${props => props.theme.border};
  min-height: 60px; /* Hauteur minimum pour le touch */

  &:hover {
    background-color: ${props => props.theme.hover || props.theme.backgroundSecondary};
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: ${props => props.theme.surface};
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 0.75rem;
    min-height: 56px; /* Taille tactile optimale */
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:active {
      background-color: ${props => props.theme.hover || props.theme.backgroundSecondary};
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    min-height: 52px;
  }
  
  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: ${props => props.theme.text};
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      font-size: 1rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.9rem;
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    color: ${props => props.theme.textSecondary};
    transition: transform 0.2s ease;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      width: 24px; /* Plus grand pour faciliter le touch */
      height: 24px;
    }
  }
`;

export const ImagesGrid = styled.div`
  display: flex;
  gap: 10px;
  padding: 1rem;
  min-height: 120px;
  background-color: ${props => props.theme.background};
  user-select: none;
  overflow-x: auto;
  flex-wrap: nowrap;
  align-items: flex-start;
  
  /* Scrollbar personnalisée */
  scrollbar-width: thin;
  scrollbar-color: ${props => props.theme.border} ${props => props.theme.background};
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.background};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.border};
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.textLight};
    }
  }

  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 8px;
    min-height: 100px;
    
    /* Améliore le défilement tactile */
    -webkit-overflow-scrolling: touch;
    overscroll-behavior-x: contain;
    
    /* Scrollbar mobile plus fine */
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    scrollbar-width: none; /* Cache la scrollbar sur mobile Firefox */
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    gap: 6px;
    min-height: 80px;
    
    /* Cache complètement la scrollbar sur très petits écrans */
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const ImageWrapper = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  cursor: move;
  flex: 0 0 auto;
  width: 100px;
  height: 100px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transform: scale(1.05);
    border-color: ${props => props.theme.primary};
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transform: none;
      border-color: transparent;
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    width: 90px; /* Légèrement plus petit sur mobile */
    height: 90px;
    border-radius: 6px;
    cursor: default; /* Pas de curseur move sur mobile */
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: pan-x pan-y;
    
    &:active {
      transform: scale(0.95);
      box-shadow: 0 1px 4px rgba(0,0,0,0.15);
      border-color: ${props => props.theme.primary};
    }
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    border-radius: 4px;
  }
  
  @media (max-width: 380px) {
    width: 70px;
    height: 70px;
  }
`;

export const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
  
  &:hover {
    opacity: 0.9;
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      opacity: 1;
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    transition: opacity 0.2s ease;
  }
`;

// ==================== BOUTONS RESPONSIVE ==================== 
export const Button = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 40px;
  
  &:hover {
    background-color: ${props => props.theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: ${props => props.theme.primary};
      transform: none;
      box-shadow: none;
    }
  }

  &:disabled {
    background-color: ${props => props.theme.disabled};
    cursor: not-allowed;
    opacity: 0.6;
    
    &:hover {
      transform: none;
      background-color: ${props => props.theme.disabled};
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    min-height: 48px; /* Taille tactile optimale */
    border-radius: 6px;
    width: 100%; /* Pleine largeur sur mobile */
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:active {
      background-color: ${props => props.theme.primaryHover};
      transform: scale(0.98);
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
    min-height: 44px;
  }
  
  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }
  }
`;

export const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: ${props => props.theme.primary};
  border: 1px solid ${props => props.theme.primary};
  
  &:hover {
    background-color: ${props => props.theme.primary};
    color: white;
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: transparent;
      color: ${props => props.theme.primary};
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    &:active {
      background-color: ${props => props.theme.primary};
      color: white;
    }
  }
`;

export const DangerButton = styled(Button)`
  background-color: #ef4444;
  
  &:hover {
    background-color: #dc2626;
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: #ef4444;
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    &:active {
      background-color: #dc2626;
    }
  }
`;

// ==================== PAGINATION RESPONSIVE ==================== 
export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1.5rem;
    padding: 0.75rem;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 1rem;
    padding: 0.5rem;
  }
`;

export const PaginationButton = styled.button`
  background-color: ${props => props.theme.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &:hover {
    background-color: ${props => props.theme.secondary};
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: ${props => props.theme.primary};
    }
  }

  &:disabled {
    background-color: ${props => props.theme.disabled};
    cursor: not-allowed;
    
    &:hover {
      background-color: ${props => props.theme.disabled};
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
    font-size: 1rem;
    min-height: 44px; /* Taille tactile optimale */
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:active {
      background-color: ${props => props.theme.secondary};
      transform: scale(0.98);
    }
  }
  
  @media (max-width: 480px) {
    width: 100%; /* Pleine largeur sur très petits écrans */
    justify-content: center;
  }
`;

export const PaginationInfo = styled.span`
  margin: 0 1rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    margin: 0 0.5rem;
    font-size: 1rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    margin: 0;
    order: -1; /* Affiche l'info en premier sur mobile */
  }
`;

// ==================== ACTIONS DE DOSSIER MOBILE ==================== 
export const MainImageButton = styled(Button)`
  background-color: ${props => props.theme.secondary};
  
  &:hover {
    background-color: ${props => props.theme.secondaryHover};
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: ${props => props.theme.secondary};
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    &:active {
      background-color: ${props => props.theme.secondaryHover};
    }
  }
`;

export const FolderContainer = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${props => props.theme.background};
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid ${props => props.theme.border};
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.75rem;
    padding: 0.5rem;
    border-radius: 6px;
  }
`;

export const FolderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
    margin-bottom: 0.5rem;
  }
`;

export const FolderTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.text};
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 1.125rem;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const FolderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;

  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
    
    button, label {
      width: 100%;
      justify-content: center;
    }
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

// ==================== UPLOAD ET FICHIERS MOBILE ==================== 
export const UploadButton = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.primary};
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  min-height: 40px;

  &:hover {
    background-color: ${props => props.theme.secondary};
    transform: translateY(-1px);
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: ${props => props.theme.primary};
      transform: none;
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
    min-height: 48px;
    width: 100%;
    border-radius: 6px;
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:active {
      background-color: ${props => props.theme.secondary};
      transform: scale(0.98);
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem 1.25rem;
    font-size: 0.9rem;
    min-height: 44px;
  }
  
  svg {
    width: 16px;
    height: 16px;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const ImagePreviewContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1rem;

  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    gap: 8px;
    margin-top: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
    margin-top: 0.5rem;
  }
`;

export const ImagePreview = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    border-radius: 6px;
  }
  
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    border-radius: 4px;
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const RemoveImageButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  background-color: rgba(255, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 0, 0, 1);
    transform: scale(1.1);
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: rgba(255, 0, 0, 0.8);
      transform: none;
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    width: 28px; /* Plus grand pour faciliter le touch */
    height: 28px;
    font-size: 16px;
    top: 2px;
    right: 2px;
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:active {
      background-color: rgba(255, 0, 0, 1);
      transform: scale(0.95);
    }
  }
  
  @media (max-width: 480px) {
    width: 26px;
    height: 26px;
    font-size: 14px;
  }
`;

// ==================== LARGE IMAGE VIEWER MOBILE ==================== 
export const LargeImageContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    background-color: rgba(0, 0, 0, 0.95); /* Plus opaque sur mobile */
    
    /* Safe area pour les appareils avec encoche */
    padding-top: env(safe-area-inset-top, 0);
    padding-left: env(safe-area-inset-left, 0);
    padding-right: env(safe-area-inset-right, 0);
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;

export const LargeImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    max-width: 95%;
    max-height: 85%; /* Laisse plus d'espace pour les contrôles */
    border-radius: 4px;
    
    /* Amélioration tactile */
    touch-action: pan-x pan-y zoom-in;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    transform: scale(1.1);
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: rgba(0, 0, 0, 0.7);
      transform: none;
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    top: calc(1rem + env(safe-area-inset-top, 0));
    right: calc(1rem + env(safe-area-inset-right, 0));
    width: 52px; /* Plus grand pour faciliter le touch */
    height: 52px;
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:active {
      background-color: rgba(0, 0, 0, 0.9);
      transform: scale(0.95);
    }
  }
  
  @media (max-width: 480px) {
    top: calc(0.75rem + env(safe-area-inset-top, 0));
    right: calc(0.75rem + env(safe-area-inset-right, 0));
    width: 48px;
    height: 48px;
  }
  
  svg {
    width: 24px;
    height: 24px;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      width: 28px;
      height: 28px;
    }
  }
`;

export const NavigationButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background-color: rgba(0, 0, 0, 0.9);
    transform: translateY(-50%) scale(1.1);
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background-color: rgba(0, 0, 0, 0.7);
      transform: translateY(-50%);
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    width: 52px; /* Plus grand pour faciliter le touch */
    height: 52px;
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:active {
      background-color: rgba(0, 0, 0, 0.9);
      transform: translateY(-50%) scale(0.95);
    }
  }
  
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
  }
  
  svg {
    width: 24px;
    height: 24px;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      width: 28px;
      height: 28px;
    }
  }
`;

// ==================== COMPOSANTS MANQUANTS AJOUTÉS ==================== 

export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

export const Label = styled.label`
  font-weight: 600;
  color: ${props => props.theme.text};
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  display: block;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
  
  &::placeholder {
    color: ${props => props.theme.textLight};
    opacity: 0.7;
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    min-height: 48px;
    border-radius: 6px;
    font-size: 16px; /* Empêche le zoom sur iOS */
    
    &:focus {
      box-shadow: 0 0 0 2px ${props => props.theme.primary}66;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem;
    min-height: 44px;
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
  
  &::placeholder {
    color: ${props => props.theme.textLight};
    opacity: 0.7;
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    min-height: 80px;
    border-radius: 6px;
    resize: none; /* Désactive le resize sur mobile */
    font-size: 16px; /* Empêche le zoom sur iOS */
    
    &:focus {
      box-shadow: 0 0 0 2px ${props => props.theme.primary}66;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem;
    min-height: 70px;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.primary}33;
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 1rem;
    min-height: 48px;
    border-radius: 6px;
    font-size: 16px; /* Empêche le zoom sur iOS */
    padding-right: 3rem;
    
    &:focus {
      box-shadow: 0 0 0 2px ${props => props.theme.primary}66;
    }
  }
  
  @media (max-width: 480px) {
    padding: 0.875rem;
    min-height: 44px;
    padding-right: 2.75rem;
  }
`;

export const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    gap: 0.75rem;
    margin-bottom: 0.75rem;
    min-height: 44px; /* Taille tactile */
  }
  
  @media (max-width: 480px) {
    margin-bottom: 0.5rem;
  }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  accent-color: ${props => props.theme.primary};
  cursor: pointer;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    width: 24px; /* Plus grand pour faciliter le touch */
    height: 24px;
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
  
  @media (max-width: 480px) {
    width: 22px;
    height: 22px;
  }
`;

export const CheckboxLabel = styled.label`
  font-size: 0.9rem;
  color: ${props => props.theme.text};
  cursor: pointer;
  user-select: none;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.4;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.75rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
`;

export const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  padding: 0.5rem;
  background-color: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 6px;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.75rem;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    padding: 0.5rem;
  }
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: ${props => props.theme.textSecondary};
  
  h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.text};
  }
  
  p {
    font-size: 0.9rem;
    line-height: 1.6;
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    
    h3 {
      font-size: 1.125rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0.75rem;
    
    h3 {
      font-size: 1rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: ${props => {
    switch (props.variant) {
      case 'success': return 'rgba(16, 185, 129, 0.1)';
      case 'warning': return 'rgba(245, 158, 11, 0.1)';
      case 'danger': return 'rgba(239, 68, 68, 0.1)';
      default: return 'rgba(59, 130, 246, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'success': return '#059669';
      case 'warning': return '#d97706';
      case 'danger': return '#dc2626';
      default: return '#2563eb';
    }
  }};
  border: 1px solid ${props => {
    switch (props.variant) {
      case 'success': return 'rgba(16, 185, 129, 0.2)';
      case 'warning': return 'rgba(245, 158, 11, 0.2)';
      case 'danger': return 'rgba(239, 68, 68, 0.2)';
      default: return 'rgba(59, 130, 246, 0.2)';
    }
  }};
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.375rem 0.875rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
  }
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    align-items: flex-end; /* Modal depuis le bas sur mobile */
    padding: 0;
    
    /* Safe area pour les appareils avec encoche */
    padding-bottom: env(safe-area-inset-bottom, 0);
  }
`;

export const ModalContent = styled.div`
  background-color: ${props => props.theme.card};
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    width: 100%;
    max-width: none;
    border-radius: 12px 12px 0 0; /* Arrondi seulement en haut sur mobile */
    max-height: 90vh;
    padding: 1.5rem;
    
    /* Animation slide-up sur mobile */
    animation: slideUpMobile 0.3s ease-out;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 8px 8px 0 0;
  }
  
  @keyframes slideUpMobile {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${props => props.theme.border};
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
    color: ${props => props.theme.text};
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    
    h2 {
      font-size: 1.25rem;
    }
  }
  
  @media (max-width: 480px) {
    h2 {
      font-size: 1.125rem;
    }
  }
`;

export const ModalCloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.textSecondary};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.theme.backgroundSecondary};
    color: ${props => props.theme.text};
    
    /* MOBILE ADAPTATIONS - Pas d'effet hover */
    @media (max-width: 768px) {
      background: none;
      color: ${props => props.theme.textSecondary};
    }
  }
  
  /* MOBILE ADAPTATIONS */
  @media (max-width: 768px) {
    padding: 0.75rem; /* Plus grand pour faciliter le touch */
    
    /* Amélioration tactile */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    
    &:active {
      background-color: ${props => props.theme.backgroundSecondary};
      color: ${props => props.theme.text};
    }
  }
  
  svg {
    width: 20px;
    height: 20px;
    
    /* MOBILE ADAPTATIONS */
    @media (max-width: 768px) {
      width: 24px;
      height: 24px;
    }
  }
`;