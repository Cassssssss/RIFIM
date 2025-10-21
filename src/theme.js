// src/theme.js - THÈME HARMONISÉ AVEC LA COULEUR HEADER

export const lightTheme = {
  // ==================== COULEURS HEADER (BLEU APPLE MODERNE) ====================
  headerBackground: 'rgba(0, 122, 255, 0.72)',  // Bleu Apple avec transparence (effet glassmorphism)
  headerBackgroundSolid: '#007AFF',              // Version solide pour fallback
  headerText: '#ffffff',                         // Texte header

  // ==================== COULEURS PRINCIPALES (BLEU APPLE #007AFF) ====================
  primary: '#007AFF',              // Bleu Apple moderne et dynamique
  primaryHover: '#0051D5',         // Version plus foncée au survol
  primaryLight: '#E5F2FF',         // Version très claire pour backgrounds
  secondary: '#10b981',            // Vert médical (gardé)
  secondaryHover: '#059669',       // Vert foncé au survol
  accent: '#FF9500',               // Orange Apple pour les badges/alertes
  
  // ==================== BACKGROUNDS ====================
  background: '#f5f5f7',           // Background principal (gris Apple)
  backgroundSolid: '#f5f5f7',      // Background solide
  backgroundSecondary: '#E8F4FF',  // Background secondaire bleuté
  card: '#ffffff',                 // Cartes/conteneurs
  cardSecondary: '#fafafa',        // Cartes secondaires
  cardHover: '#E5F2FF',            // Survol des cartes (bleu très clair)
  surface: '#ffffff',              // Surface (pour compatibilité)
  
  // ==================== TEXTES ====================
  text: '#1f2937',                 // Texte principal
  textSecondary: '#6b7280',        // Texte secondaire
  textLight: '#9ca3af',            // Texte discret
  textInverse: '#ffffff',          // Texte sur fond coloré
  
  // ==================== BORDURES ====================
  border: '#d2d2d7',               // Bordures principales (gris Apple)
  borderLight: '#e5e5e7',          // Bordures discrètes
  borderFocus: '#007AFF',          // Bordures focus (bleu Apple)
  
  // ==================== ÉTATS ====================
  success: '#34C759',              // Succès (vert Apple)
  successLight: '#d1f4e0',         // Background succès
  warning: '#FF9500',              // Avertissement (orange Apple)
  warningLight: '#fff4e5',         // Background avertissement
  error: '#FF3B30',                // Erreur (rouge Apple)
  errorLight: '#ffe5e5',           // Background erreur
  info: '#007AFF',                 // Information (bleu Apple)
  infoLight: '#E5F2FF',            // Background information
  
  // ==================== INTERACTIONS ====================
  hover: '#fafafa',                // Survol général
  active: '#E5F2FF',               // État actif (bleu clair)
  focus: 'rgba(0, 122, 255, 0.1)', // Focus avec transparence bleu Apple
  disabled: '#8e8e93',             // Éléments désactivés (gris Apple)
  
  // ==================== BOUTONS (APPLE STYLE) ====================
  buttonText: '#ffffff',           // Texte des boutons
  buttonSecondary: '#f5f5f7',      // Boutons secondaires (gris Apple)
  buttonSecondaryText: '#1d1d1f',  // Texte boutons secondaires
  buttonDanger: '#FF3B30',         // Boutons de suppression (rouge Apple)
  buttonDangerHover: '#D70015',    // Boutons de suppression au survol
  
  // ==================== OMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.1)',    // Ombre légère
  shadowMedium: 'rgba(0, 0, 0, 0.15)', // Ombre moyenne
  shadowStrong: 'rgba(0, 0, 0, 0.25)', // Ombre forte
  
  // ==================== TAGS ET BADGES (BLEU APPLE) ====================
  tagBackground: '#E5F2FF',        // Background des tags (bleu Apple clair)
  tagText: '#0051D5',              // Texte des tags (bleu Apple foncé)
  
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
  // ==================== COULEURS HEADER (SOMBRE GLASSMORPHISM) ====================
  headerBackground: 'rgba(28, 28, 30, 0.72)',  // Fond sombre Apple avec transparence
  headerBackgroundSolid: '#1c1c1e',             // Version solide pour fallback
  headerText: '#ffffff',                        // Texte header

  // ==================== COULEURS PRINCIPALES (BLEU APPLE DARK MODE) ====================
  primary: '#0A84FF',              // Bleu Apple adapté au mode sombre
  primaryHover: '#409CFF',         // Version plus claire au survol (inversé)
  primaryLight: '#1A3A52',         // Version sombre pour backgrounds
  secondary: '#30D158',            // Vert Apple mode sombre
  secondaryHover: '#32D74B',       // Vert plus vif au survol
  accent: '#FF9F0A',               // Orange Apple mode sombre              
  
  // ==================== BACKGROUNDS SOMBRES (APPLE DARK MODE) ====================
  background: '#000000',           // Background principal noir Apple
  backgroundSolid: '#000000',      // Background solide noir
  backgroundSecondary: '#1c1c1e',  // Background secondaire gris très sombre
  card: '#1c1c1e',                 // Cartes sombres Apple
  cardSecondary: '#2c2c2e',        // Cartes secondaires
  cardHover: '#3a3a3c',            // Survol des cartes
  surface: '#1c1c1e',              // Surface sombre
  
  // ==================== TEXTES SOMBRES (APPLE) ====================
  text: '#ffffff',                 // Texte principal blanc
  textSecondary: '#aeaeb2',        // Texte secondaire gris Apple
  textLight: '#8e8e93',            // Texte discret
  textInverse: '#000000',          // Texte inversé          
  
  // ==================== BORDURES SOMBRES (APPLE) ====================
  border: '#38383a',               // Bordures sombres Apple
  borderLight: '#2c2c2e',          // Bordures discrètes
  borderFocus: '#0A84FF',          // Focus bleu Apple mode sombre
  
  // ==================== ÉTATS SOMBRES (APPLE) ====================
  success: '#30D158',              // Vert Apple mode sombre
  successLight: '#1a3a26',         // Background succès sombre
  warning: '#FF9F0A',              // Orange Apple mode sombre
  warningLight: '#3a2a0a',         // Background avertissement sombre
  error: '#FF453A',                // Rouge Apple mode sombre
  errorLight: '#3a1a1a',           // Background erreur sombre
  info: '#0A84FF',                 // Bleu Apple mode sombre
  infoLight: '#1A3A52',            // Background info sombre            
  
  // ==================== INTERACTIONS SOMBRES (APPLE) ====================
  hover: '#2c2c2e',                // Survol gris sombre Apple
  active: '#3a3a3c',               // État actif
  focus: 'rgba(10, 132, 255, 0.2)', // Focus bleu Apple transparent
  disabled: '#636366',             // Désactivé gris Apple             
  
  // ==================== BOUTONS SOMBRES (APPLE) ====================
  buttonText: '#ffffff',           // Texte boutons blanc
  buttonSecondary: '#2c2c2e',      // Boutons secondaires gris sombre
  buttonSecondaryText: '#ffffff',  // Texte boutons secondaires blanc
  buttonDanger: '#FF453A',         // Boutons danger rouge Apple
  buttonDangerHover: '#FF6961',    // Boutons danger au survol    
  
  // ==================== OMBRES SOMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.3)',    
  shadowMedium: 'rgba(0, 0, 0, 0.4)', 
  shadowStrong: 'rgba(0, 0, 0, 0.6)', 
  
  // ==================== TAGS ET BADGES SOMBRES (APPLE) ====================
  tagBackground: '#1A3A52',        // Background tag bleu sombre
  tagText: '#64B5F6',              // Texte tag bleu clair
  
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