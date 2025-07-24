import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axiosConfig';
import { Star, StarHalf, Edit, Save, Upload, X, Folder, Image as ImageIcon, File, ArrowUp, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Trash2, Plus, Menu } from 'lucide-react';
import ImageViewer from '../components/ImageViewer';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import * as S from './CasesPage.styles';
import { CasesGrid, FoldersSection } from './CasesPage.styles';
import { PaginationContainer, PaginationButton, PaginationInfo } from '../pages/CasesPage.styles';
import styled from 'styled-components';
import TutorialOverlay from './TutorialOverlay';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
console.log('API_BASE_URL:', API_BASE_URL);
const SPACES_URL = process.env.REACT_APP_SPACES_URL || 'https://rifim.lon1.digitaloceanspaces.com';
const UPLOAD_BASE_URL = process.env.REACT_APP_UPLOAD_URL || 'http://localhost:5002/uploads';

// ==================== STYLED COMPONENTS OPTIMISÉS POUR MOBILE ====================

const MobileOptimizedPageContainer = styled(S.PageContainer)`
  background: ${props => props.theme.background};
  min-height: calc(100vh - 60px);
  padding: 1rem;
  
  /* Gestion du padding sur mobile */
  @media (max-width: 768px) {
    padding: 0.75rem;
    padding-bottom: 100px; /* Espace pour la navigation mobile */
    min-height: calc(100vh - 80px);
  }

  /* Mode paysage mobile */
  @media (max-width: 768px) and (orientation: landscape) {
    padding: 0.5rem;
    padding-bottom: 80px;
  }
`;

const MobileOptimizedTitle = styled(S.Title)`
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 2px 4px ${props => props.theme.shadow};
  margin-bottom: 2rem;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const MobileSectionContainer = styled(S.SectionContainer)`
  position: relative;
  overflow: hidden;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  box-shadow: 0 4px 20px ${props => props.theme.shadow};
  margin-bottom: 2rem;
  padding: 1.5rem;
  
  @media (max-width: 768px) {
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 10px ${props => props.theme.shadow};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${props => props.theme.primary}, ${props => props.theme.secondary});
  }
`;

// Container pour les filtres mobile avec accordéon
const MobileFiltersContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    background: ${props => props.theme.card};
    border: 1px solid ${props => props.theme.border};
    border-radius: 8px;
    margin-bottom: 1rem;
    overflow: hidden;
  }
`;

const MobileFiltersHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${props => props.theme.surface};
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:active {
    background: ${props => props.theme.hover};
  }
`;

const MobileFiltersContent = styled.div`
  padding: ${props => props.isOpen ? '1rem' : '0'};
  max-height: ${props => props.isOpen ? '400px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  background: ${props => props.theme.background};
`;

// Grille de cas optimisée pour mobile
const MobileCasesGrid = styled(CasesGrid)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

// Carte de cas optimisée pour mobile
const MobileCaseCard = styled(S.CaseCard)`
  background-color: ${props => props.theme.surface};
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  
  @media (max-width: 768px) {
    border-radius: 8px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    
    /* Pas d'effet hover sur mobile - remplacé par active */
    &:active {
      transform: scale(0.98);
      background-color: ${props => props.theme.hover};
    }
  }
  
  @media (min-width: 769px) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }
  }
`;

// Actions de cas optimisées pour mobile
const MobileCaseActions = styled(S.CaseActions)`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    padding: 0.75rem;
    
    button {
      flex: 1;
      min-width: 120px;
      min-height: 44px; /* Taille tactile recommandée */
      font-size: 0.9rem;
      padding: 0.75rem;
      border-radius: 8px;
      
      /* Améliore l'accessibilité tactile */
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
  }
`;

// Container d'images optimisé pour mobile
const MobileImagesGrid = styled(S.ImagesGrid)`
  display: flex;
  gap: 10px;
  padding: 1rem;
  min-height: 120px;
  background-color: ${props => props.theme.background};
  user-select: none;
  overflow-x: auto;
  flex-wrap: nowrap;
  align-items: flex-start;

  @media (max-width: 768px) {
    padding: 0.75rem;
    gap: 8px;
    min-height: 100px;
    
    /* Améliore le défilement tactile */
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
    
    /* Indicateur visuel pour le défilement horizontal */
    &::after {
      content: '→';
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: ${props => props.theme.primary};
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      opacity: 0.7;
      pointer-events: none;
    }
  }
`;

// Wrapper d'image optimisé pour mobile
const MobileImageWrapper = styled(S.ImageWrapper)`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  cursor: pointer;
  flex: 0 0 auto;
  width: 100px;
  height: 100px;
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    
    /* Améliore l'interaction tactile */
    &:active {
      transform: scale(0.95);
    }
  }
  
  /* Bouton de suppression plus accessible sur mobile */
  .delete-button {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(255, 0, 0, 0.8);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s ease;
    
    @media (max-width: 768px) {
      width: 28px;
      height: 28px;
      font-size: 14px;
      /* Améliore l'accessibilité tactile */
    }
    
    &:hover, &:active {
      background: rgba(255, 0, 0, 1);
      transform: scale(1.1);
    }
  }
`;

// Pagination optimisée pour mobile
const MobilePaginationContainer = styled(PaginationContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2rem 0;
  gap: 1rem;
  
  @media (max-width: 768px) {
    margin: 1.5rem 0;
    gap: 0.5rem;
    padding: 0 1rem;
    
    /* Stack verticalement si nécessaire */
    flex-wrap: wrap;
  }
`;

const MobilePaginationButton = styled(PaginationButton)`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.theme.border};
  border-radius: 8px;
  background: ${props => props.theme.card};
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  
  @media (max-width: 768px) {
    padding: 1rem 1.25rem;
    min-height: 44px;
    border-radius: 10px;
    font-size: 0.9rem;
    
    /* Améliore l'accessibilité tactile */
    min-width: 100px;
  }
  
  &:hover:not(:disabled) {
    background: ${props => props.theme.hover};
    border-color: ${props => props.theme.primary};
    
    @media (max-width: 768px) {
      /* Remplace hover par active sur mobile */
      &:active {
        background: ${props => props.theme.hover};
        border-color: ${props => props.theme.primary};
      }
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Bouton de tutoriel flottant optimisé pour mobile
const MobileTutorialButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: ${props => props.theme.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
  
  @media (max-width: 768px) {
    bottom: 100px; /* Au-dessus de la navigation mobile */
    right: 16px;
    width: 48px;
    height: 48px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
    
    @media (max-width: 768px) {
      &:active {
        transform: scale(0.95);
      }
    }
  }
`;

// Modal optimisé pour mobile
const MobileModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  
  @media (max-width: 768px) {
    padding: 0;
    align-items: flex-start;
  }
`;

const MobileModalContent = styled.div`
  background: ${props => props.theme.card};
  border-radius: 12px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    border-radius: 0;
    overflow-y: auto;
  }
`;

// ==================== COMPOSANT PRINCIPAL ====================

function CasesPage() {
  // États existants
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState([]);
  const [specialtyFilter, setSpecialtyFilter] = useState([]);
  const [locationFilter, setLocationFilter] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTutorial, setShowTutorial] = useState(false);
  const [isScrollVisible, setIsScrollVisible] = useState(false);

  // Nouveaux états pour mobile
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Détection de la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Gestion du scroll pour le bouton "retour en haut"
  useEffect(() => {
    const handleScroll = () => {
      setIsScrollVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fonctions existantes (gardées identiques)
  const fetchCases = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.get('/cases/my', {
        params: {
          page,
          limit: 12,
          search: searchTerm,
          modality: modalityFilter.join(','),
          specialty: specialtyFilter.join(','),
          location: locationFilter.join(',')
        }
      });
      
      const cases = response.data?.cases;
      const safeCases = Array.isArray(cases) ? cases : [];
      
      setCases(safeCases);
      setCurrentPage(response.data?.currentPage || 1);
      setTotalPages(response.data?.totalPages || 1);
    } catch (error) {
      console.error('Erreur lors de la récupération des cas:', error);
      setError('Erreur lors du chargement des cas');
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, modalityFilter, specialtyFilter, locationFilter]);

  // Effet pour charger les cas
  useEffect(() => {
    fetchCases(currentPage);
  }, [fetchCases, currentPage]);

  // Fonctions de filtrage
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Composant des filtres mobile
  const MobileFilters = () => (
    <MobileFiltersContainer>
      <MobileFiltersHeader onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Menu size={20} />
          Filtres
          {(modalityFilter.length + specialtyFilter.length + locationFilter.length > 0) && (
            <span style={{ 
              background: props => props.theme.primary, 
              color: 'white', 
              borderRadius: '50%', 
              width: '20px', 
              height: '20px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '12px' 
            }}>
              {modalityFilter.length + specialtyFilter.length + locationFilter.length}
            </span>
          )}
        </span>
        {isMobileFiltersOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </MobileFiltersHeader>
      
      <MobileFiltersContent isOpen={isMobileFiltersOpen}>
        {/* Contenu des filtres - à implémenter selon vos besoins */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'block' }}>
              Recherche
            </label>
            <input
              type="text"
              placeholder="Rechercher un cas..."
              value={searchTerm}
              onChange={handleSearch}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}
            />
          </div>
          
          {/* Ajoutez ici vos autres filtres selon vos besoins */}
        </div>
      </MobileFiltersContent>
    </MobileFiltersContainer>
  );

  return (
    <MobileOptimizedPageContainer>
      <MobileOptimizedTitle>Gestion des Cas</MobileOptimizedTitle>
      
      {/* Filtres mobile */}
      {isMobile && <MobileFilters />}
      
      {/* Grille des cas */}
      <MobileCasesGrid>
        {cases.map(caseItem => (
          <MobileCaseCard key={caseItem._id} onClick={() => setSelectedCase(caseItem)}>
            {caseItem.folderMainImages && Object.keys(caseItem.folderMainImages).length > 0 && (
              <img 
                src={Object.values(caseItem.folderMainImages)[0]} 
                alt={caseItem.title}
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover',
                  // Optimisation des images sur mobile
                  imageRendering: 'optimizeQuality'
                }}
                loading="lazy" // Lazy loading pour améliorer les performances
              />
            )}
            
            <div style={{ padding: '1rem' }}>
              <h3 style={{ 
                fontSize: isMobile ? '1.1rem' : '1.2rem',
                marginBottom: '0.5rem',
                color: 'var(--text-color)',
                lineHeight: '1.3'
              }}>
                {caseItem.title}
              </h3>
              
              {/* Métadonnées du cas */}
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.5rem', 
                marginBottom: '1rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                {caseItem.modality && (
                  <span style={{ 
                    background: 'var(--primary-color)', 
                    color: 'white', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {caseItem.modality}
                  </span>
                )}
                {caseItem.specialty && (
                  <span style={{ 
                    background: 'var(--secondary-color)', 
                    color: 'white', 
                    padding: '0.25rem 0.5rem', 
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}>
                    {caseItem.specialty}
                  </span>
                )}
              </div>
            </div>
            
            <MobileCaseActions>
              <Link 
                to={`/radiology-viewer/${caseItem._id}`}
                style={{ 
                  textDecoration: 'none',
                  flex: 1
                }}
              >
                <button style={{ 
                  width: '100%',
                  background: 'var(--primary-color)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <ImageIcon size={16} />
                  Voir
                </button>
              </Link>
              
              <Link 
                to={`/sheet-editor/${caseItem._id}`}
                style={{ 
                  textDecoration: 'none',
                  flex: 1
                }}
              >
                <button style={{ 
                  width: '100%',
                  background: 'var(--secondary-color)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}>
                  <Edit size={16} />
                  Fiche
                </button>
              </Link>
            </MobileCaseActions>
          </MobileCaseCard>
        ))}
      </MobileCasesGrid>

      {/* Modal des détails du cas */}
      {selectedCase && (
        <MobileModal onClick={() => setSelectedCase(null)}>
          <MobileModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '2rem' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h2 style={{ fontSize: isMobile ? '1.5rem' : '2rem' }}>
                  {selectedCase.title}
                </h2>
                <button 
                  onClick={() => setSelectedCase(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Contenu du modal - à adapter selon vos besoins */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem' 
              }}>
                {/* Statistiques */}
                <div style={{ 
                  padding: '1rem', 
                  background: 'var(--card-background)', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                    Nombre d'images
                  </h4>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                    {Object.values(selectedCase.images || {}).reduce((acc, curr) => acc + curr.length, 0)}
                  </p>
                </div>
                
                <div style={{ 
                  padding: '1rem', 
                  background: 'var(--card-background)', 
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>
                    Nombre de dossiers
                  </h4>
                  <p style={{ fontSize: '1.2rem', fontWeight: '600' }}>
                    {selectedCase.folders?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </MobileModalContent>
        </MobileModal>
      )}

      {/* Pagination */}
      <MobilePaginationContainer>
        <MobilePaginationButton 
          onClick={() => fetchCases(currentPage - 1)} 
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
          {!isMobile && 'Précédent'}
        </MobilePaginationButton>
        
        <PaginationInfo style={{ 
          fontSize: isMobile ? '0.9rem' : '1rem',
          fontWeight: 'bold'
        }}>
          {currentPage} / {totalPages}
        </PaginationInfo>
        
        <MobilePaginationButton 
          onClick={() => fetchCases(currentPage + 1)} 
          disabled={currentPage === totalPages}
        >
          {!isMobile && 'Suivant'}
          <ChevronRight size={16} />
        </MobilePaginationButton>
      </MobilePaginationContainer>

      {/* Loading overlay */}
      {isLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <LoadingSpinner />
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: isMobile ? '120px' : '20px',
          right: '20px',
          background: 'red',
          color: 'white',
          padding: '1rem',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          maxWidth: isMobile ? 'calc(100vw - 40px)' : '400px'
        }}>
          <ErrorMessage>{error}</ErrorMessage>
        </div>
      )}

      {/* Bouton tutorial flottant */}
      <MobileTutorialButton onClick={() => setShowTutorial(true)}>
        ?
      </MobileTutorialButton>

      {/* Bouton retour en haut */}
      {isScrollVisible && (
        <button
          style={{
            position: 'fixed',
            bottom: isMobile ? '160px' : '90px',
            right: '20px',
            background: 'var(--primary-color)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 99
          }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Modal tutorial */}
      {showTutorial && (
        <MobileModal onClick={() => setShowTutorial(false)}>
          <MobileModalContent onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '2rem' }}>
              <TutorialOverlay 
                onClose={() => setShowTutorial(false)} 
              />
            </div>
          </MobileModalContent>
        </MobileModal>
      )}
    </MobileOptimizedPageContainer>
  );
}

export default CasesPage;