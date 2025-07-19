// src/theme.js - THÈME HARMONISÉ AVEC LA COULEUR HEADER

export const lightTheme = {
  // ==================== COULEURS HEADER (CONSERVÉES) ====================
  headerBackground: '#4f5b93',     // Couleur header originale
  headerText: '#ffffff',           // Texte header original
  
  // ==================== COULEURS PRINCIPALES (HARMONISÉES AVEC HEADER) ====================
  primary: '#4f5b93',              // MÊME COULEUR QUE LE HEADER !
  primaryHover: '#3d4873',         // Version plus foncée du header
  secondary: '#10b981',            // Vert médical (gardé)
  secondaryHover: '#059669',       // Vert foncé au survol
  accent: '#f59e0b',              // Orange pour les badges/alertes
  
  // ==================== BACKGROUNDS ====================
  background: '#f8fafc',           // Background principal
  backgroundSolid: '#f8fafc',      // Background solide
  backgroundSecondary: '#f1f5f9',  // Background secondaire (pour SectionTitle) - PLUS CONTRASTÉ
  card: '#ffffff',                 // Cartes/conteneurs
  cardSecondary: '#f9fafb',        // Cartes secondaires
  cardHover: '#f3f4f6',            // Survol des cartes
  surface: '#ffffff',              // Surface (pour compatibilité)
  
  // ==================== TEXTES ====================
  text: '#1f2937',                 // Texte principal
  textSecondary: '#6b7280',        // Texte secondaire
  textLight: '#9ca3af',            // Texte discret
  textInverse: '#ffffff',          // Texte sur fond coloré
  
  // ==================== BORDURES ====================
  border: '#e5e7eb',               // Bordures principales
  borderLight: '#f3f4f6',          // Bordures discrètes
  borderFocus: '#4f5b93',          // Bordures focus (même couleur)
  
  // ==================== ÉTATS ====================
  success: '#10b981',              // Succès
  successLight: '#dcfce7',         // Background succès
  warning: '#f59e0b',              // Avertissement
  warningLight: '#fef3c7',         // Background avertissement
  error: '#ef4444',                // Erreur
  errorLight: '#fef2f2',           // Background erreur
  info: '#4f5b93',                 // Information (même couleur)
  infoLight: '#e0e7ff',            // Background information
  
  // ==================== INTERACTIONS ====================
  hover: '#f9fafb',                // Survol général
  active: '#f3f4f6',               // État actif
  focus: 'rgba(79, 91, 147, 0.1)', // Focus avec transparence du header
  disabled: '#9ca3af',             // Éléments désactivés
  
  // ==================== BOUTONS (HARMONISÉS) ====================
  buttonText: '#ffffff',           // Texte des boutons
  buttonSecondary: '#f3f4f6',      // Boutons secondaires
  buttonSecondaryText: '#374151',  // Texte boutons secondaires
  buttonDanger: '#ef4444',         // Boutons de suppression
  buttonDangerHover: '#dc2626',    // Boutons de suppression au survol
  
  // ==================== OMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.1)',    // Ombre légère
  shadowMedium: 'rgba(0, 0, 0, 0.15)', // Ombre moyenne
  shadowStrong: 'rgba(0, 0, 0, 0.25)', // Ombre forte
  
  // ==================== TAGS ET BADGES (HARMONISÉS) ====================
  tagBackground: '#e0e7ff',        // Background des tags (bleu clair)
  tagText: '#3d4873',              // Texte des tags (bleu foncé)
  
  // ==================== STATUTS SPÉCIFIQUES ====================
  statusPublic: '#dcfce7',         // Background statut public
  statusPublicText: '#166534',     // Texte statut public
  statusPrivate: '#fef3c7',        // Background statut privé
  statusPrivateText: '#92400e',    // Texte statut privé
  statusDraft: '#f3f4f6',          // Background statut brouillon (mode clair)
  statusDraftText: '#374151',      // Texte statut brouillon (mode clair)
  
  // ==================== INPUTS ====================
  inputBackground: '#ffffff',      // Background des inputs
  inputText: '#1f2937',            // Texte des inputs
  
  // ==================== QUESTIONS (COMPATIBILITÉ) ====================
  questionBackground: '#f9fafb',   // Background questions
  questionBackgroundAlt: '#f3f4f6', // Background questions alternatif
  
  // ==================== ESPACEMENT ====================
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    xxl: '2rem'       // 32px
  },
  
  // ==================== RAYONS DE BORDURE ====================
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  }
};

export const darkTheme = {
  // ==================== COULEURS HEADER (SOMBRES HARMONISÉES) ====================
  headerBackground: '#2d3748',     // Header sombre harmonisé
  headerText: '#ffffff',           // Texte header
  
  // ==================== COULEURS PRINCIPALES (HARMONISÉES) ====================
  primary: '#4f5b93',              // Même couleur primaire en mode sombre
  primaryHover: '#3d4873',         
  secondary: '#34d399',            // Vert plus vif
  secondaryHover: '#10b981',       
  accent: '#fbbf24',              
  
  // ==================== BACKGROUNDS SOMBRES ====================
  background: '#1a202c',           // Background principal sombre
  backgroundSolid: '#1a202c',      // Background solide sombre
  backgroundSecondary: '#2d3748',  // Background secondaire pour SectionTitle - PLUS CONTRASTÉ
  card: '#2d3748',                 // Cartes sombres
  cardSecondary: '#4a5568',        // Cartes secondaires sombres
  cardHover: '#718096',            // Survol des cartes sombres
  surface: '#2d3748',              // Surface sombre
  
  // ==================== TEXTES SOMBRES ====================
  text: '#f7fafc',                 
  textSecondary: '#cbd5e0',        
  textLight: '#a0aec0',            
  textInverse: '#1a202c',          
  
  // ==================== BORDURES SOMBRES ====================
  border: '#4a5568',               
  borderLight: '#2d3748',          
  borderFocus: '#4f5b93',          // Même couleur focus
  
  // ==================== ÉTATS SOMBRES ====================
  success: '#34d399',              
  successLight: '#064e3b',         
  warning: '#fbbf24',              
  warningLight: '#451a03',         
  error: '#f87171',                
  errorLight: '#7f1d1d',           
  info: '#4f5b93',                 // Même couleur info
  infoLight: '#2a4365',            
  
  // ==================== INTERACTIONS SOMBRES ====================
  hover: '#4a5568',                
  active: '#718096',               
  focus: 'rgba(79, 91, 147, 0.3)', // Focus harmonisé
  disabled: '#718096',             
  
  // ==================== BOUTONS SOMBRES ====================
  buttonText: '#ffffff',           
  buttonSecondary: '#4a5568',      
  buttonSecondaryText: '#f7fafc',  
  buttonDanger: '#f87171',         
  buttonDangerHover: '#ef4444',    
  
  // ==================== OMBRES SOMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.3)',    
  shadowMedium: 'rgba(0, 0, 0, 0.4)', 
  shadowStrong: 'rgba(0, 0, 0, 0.6)', 
  
  // ==================== TAGS ET BADGES SOMBRES (HARMONISÉS) ====================
  tagBackground: '#2a4365',        // Bleu sombre
  tagText: '#90cdf4',              // Bleu clair
  
  // ==================== STATUTS SOMBRES ====================
  statusPublic: '#064e3b',         
  statusPublicText: '#6ee7b7',     
  statusPrivate: '#451a03',        
  statusPrivateText: '#fcd34d',    
  statusDraft: '#4a5568',          // Background statut brouillon (mode sombre) - PLUS CONTRASTÉ
  statusDraftText: '#f7fafc',      // Texte statut brouillon (mode sombre) - PLUS CONTRASTÉ
  
  // ==================== INPUTS SOMBRES ====================
  inputBackground: '#4a5568',      
  inputText: '#f7fafc',            
  
  // ==================== QUESTIONS SOMBRES ====================
  questionBackground: '#4a5568',   
  questionBackgroundAlt: '#718096', 
  
  // ==================== ESPACEMENT (IDENTIQUE) ====================
  spacing: {
    xs: '0.25rem',    
    sm: '0.5rem',     
    md: '0.75rem',    
    lg: '1rem',       
    xl: '1.5rem',     
    xxl: '2rem'       
  },
  
  // ==================== RAYONS (IDENTIQUES) ====================
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  }
};