// src/theme.js - THÈME HARMONISÉ AVEC LA COULEUR HEADER

export const lightTheme = {
  // ==================== COULEURS HEADER (MINIMALISTE APPLE - BLANC GLASSMORPHISM) ====================
  headerBackground: 'rgba(255, 255, 255, 0.72)',  // Blanc translucide (effet glassmorphism Apple)
  headerBackgroundSolid: '#ffffff',                // Version solide pour fallback
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
  // ==================== COULEURS HEADER (SOMBRE GLASSMORPHISM APPLE) ====================
  headerBackground: 'rgba(28, 28, 30, 0.72)',  // Fond sombre Apple avec transparence
  headerBackgroundSolid: '#1c1c1e',             // Version solide pour fallback
  headerText: '#f5f5f7',                        // Texte header blanc cassé

  // ==================== COULEURS PRINCIPALES (MINIMALISME APPLE DARK) ====================
  primary: '#0A84FF',              // Bleu vif Apple adapté au mode sombre
  primaryHover: '#409CFF',         // Version plus claire au survol
  primaryLight: '#1A3A52',         // Version sombre pour backgrounds
  secondary: '#30D158',            // Vert Apple mode sombre
  secondaryHover: '#32D74B',       // Vert plus vif au survol
  accent: '#FF9F0A',               // Orange Apple mode sombre

  // ==================== BACKGROUNDS SOMBRES (APPLE DARK MODE) ====================
  background: '#000000',           // Background principal noir pur Apple
  backgroundSolid: '#000000',      // Background solide noir
  backgroundSecondary: '#1c1c1e',  // Background secondaire gris très sombre Apple
  card: '#1c1c1e',                 // Cartes sombres Apple
  cardSecondary: '#2c2c2e',        // Cartes secondaires
  cardHover: '#2c2c2e',            // Survol des cartes (gris, pas bleu)
  surface: '#1c1c1e',              // Surface sombre

  // ==================== TEXTES SOMBRES (APPLE) ====================
  text: '#f5f5f7',                 // Texte principal blanc cassé Apple
  textSecondary: '#aeaeb2',        // Texte secondaire gris Apple
  textLight: '#86868b',            // Texte discret gris Apple
  textInverse: '#1D1D1F',          // Texte inversé (Shark)

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
  active: '#2c2c2e',               // État actif (gris, pas bleu)
  focus: 'rgba(10, 132, 255, 0.2)', // Focus bleu Apple transparent
  disabled: '#636366',             // Désactivé gris Apple

  // ==================== BOUTONS SOMBRES (APPLE) ====================
  buttonText: '#ffffff',           // Texte boutons blanc
  buttonSecondary: '#2c2c2e',      // Boutons secondaires gris sombre
  buttonSecondaryText: '#f5f5f7',  // Texte boutons secondaires blanc cassé
  buttonDanger: '#FF453A',         // Boutons danger rouge Apple
  buttonDangerHover: '#FF6961',    // Boutons danger au survol

  // ==================== OMBRES SOMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
  shadowStrong: 'rgba(0, 0, 0, 0.6)',

  // ==================== TAGS ET BADGES SOMBRES (APPLE) ====================
  tagBackground: '#1A3A52',        // Background tag bleu sombre
  tagText: '#409CFF',              // Texte tag bleu clair Apple
  
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