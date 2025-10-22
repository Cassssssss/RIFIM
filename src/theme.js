// src/theme.js - THÈME HARMONISÉ AVEC LA COULEUR HEADER

export const lightTheme = {
  // ==================== COULEURS HEADER (MINIMALISTE APPLE - GRIS GLASSMORPHISM) ====================
  headerBackground: 'rgba(232, 232, 237, 0.72)',  // Gris stylé translucide (effet glassmorphism Apple)
  headerBackgroundSolid: '#e8e8ed',                // Version solide pour fallback
  headerText: '#1D1D1F',                           // Texte header noir Shark

  // ==================== COULEURS PRINCIPALES (MINIMALISME APPLE) ====================
  primary: '#0066CC',              // Science Blue (vrai bleu Apple) - utilisé avec parcimonie
  primaryHover: '#0077ED',         // Version légèrement plus claire au survol
  primaryLight: '#E8F0FE',         // Version très claire pour backgrounds
  secondary: '#10b981',            // Vert médical (gardé)
  secondaryHover: '#059669',       // Vert foncé au survol
  accent: '#FF9500',               // Orange Apple pour les badges/alertes

  // ==================== BACKGROUNDS (BLANC ET GRIS APPLE) ====================
  background: '#f5f5f7',           // Athens Gray - background principal Apple
  backgroundSolid: '#f5f5f7',      // Background solide
  backgroundSecondary: '#ffffff',  // Background secondaire blanc (pas bleu)
  card: '#ffffff',                 // Cartes/conteneurs blanc pur
  cardSecondary: '#fafafa',        // Cartes secondaires gris très clair
  cardHover: '#f5f5f7',            // Survol des cartes (gris Apple, pas bleu)
  surface: '#ffffff',              // Surface (pour compatibilité)

  // ==================== TEXTES (SHARK APPLE) ====================
  text: '#1D1D1F',                 // Shark - texte principal Apple (presque noir)
  textSecondary: '#6b7280',        // Texte secondaire gris
  textLight: '#86868b',            // Texte discret (gris Apple)
  textInverse: '#ffffff',          // Texte sur fond coloré

  // ==================== BORDURES ====================
  border: '#d2d2d7',               // Bordures principales (gris Apple)
  borderLight: '#e5e5e7',          // Bordures discrètes
  borderFocus: '#0066CC',          // Bordures focus (Science Blue)
  
  // ==================== ÉTATS ====================
  success: '#10b981',              // Succès (vert)
  successLight: '#d1f4e0',         // Background succès
  warning: '#FF9500',              // Avertissement (orange Apple)
  warningLight: '#fff4e5',         // Background avertissement
  error: '#FF3B30',                // Erreur (rouge Apple)
  errorLight: '#fee2e2',           // Background erreur
  info: '#0066CC',                 // Information (Science Blue)
  infoLight: '#E8F0FE',            // Background information

  // ==================== INTERACTIONS ====================
  hover: '#fafafa',                // Survol général
  active: '#f5f5f7',               // État actif (gris clair Apple)
  focus: 'rgba(0, 102, 204, 0.1)', // Focus avec transparence Science Blue
  disabled: '#8e8e93',             // Éléments désactivés

  // ==================== BOUTONS (APPLE STYLE) ====================
  buttonText: '#ffffff',           // Texte des boutons
  buttonSecondary: '#f5f5f7',      // Boutons secondaires (gris Apple)
  buttonSecondaryText: '#1D1D1F',  // Texte boutons secondaires (Shark)
  buttonDanger: '#FF3B30',         // Boutons de suppression (rouge Apple)
  buttonDangerHover: '#D70015',    // Boutons de suppression au survol

  // ==================== OMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.08)',   // Ombre légère (plus subtile Apple)
  shadowMedium: 'rgba(0, 0, 0, 0.12)', // Ombre moyenne
  shadowStrong: 'rgba(0, 0, 0, 0.2)', // Ombre forte

  // ==================== TAGS ET BADGES (SUBTILS APPLE) ====================
  tagBackground: '#E8F0FE',        // Background des tags (bleu très clair)
  tagText: '#0066CC',              // Texte des tags (Science Blue)
  
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
  headerBackgroundSolid: '#2d3748',
  headerText: '#ffffff',           // Texte header

  // ==================== COULEURS PRINCIPALES (HARMONISÉES) ====================
  primary: '#4f5b93',              // Même couleur primaire en mode sombre
  primaryHover: '#3d4873',
  primaryLight: '#1e293b',
  secondary: '#34d399',            // Vert plus vif
  secondaryHover: '#10b981',
  accent: '#fbbf24',

  // ==================== BACKGROUNDS SOMBRES ====================
  background: '#1a202c',           // Background principal sombre
  backgroundSolid: '#1a202c',      // Background solide sombre
  backgroundSecondary: '#2d3748',  // Background secondaire pour SectionTitle
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
  successLight: '#1a3a26',
  warning: '#fbbf24',
  warningLight: '#3a2a0a',
  error: '#f87171',
  errorLight: '#3a1a1a',
  info: '#60a5fa',
  infoLight: '#1A3A52',

  // ==================== INTERACTIONS SOMBRES ====================
  hover: '#2c2c2e',
  active: '#3a3a3c',
  focus: 'rgba(79, 91, 147, 0.2)',
  disabled: '#636366',

  // ==================== BOUTONS SOMBRES ====================
  buttonText: '#ffffff',
  buttonSecondary: '#2c2c2e',
  buttonSecondaryText: '#ffffff',
  buttonDanger: '#f87171',
  buttonDangerHover: '#ef4444',

  // ==================== OMBRES SOMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
  shadowStrong: 'rgba(0, 0, 0, 0.6)',

  // ==================== TAGS ET BADGES SOMBRES ====================
  tagBackground: '#1A3A52',
  tagText: '#64B5F6',

  // ==================== STATUTS SOMBRES ====================
  statusPublic: '#064e3b',
  statusPublicText: '#6ee7b7',
  statusPrivate: '#451a03',
  statusPrivateText: '#fcd34d',
  statusDraft: '#4a5568',
  statusDraftText: '#f7fafc',

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