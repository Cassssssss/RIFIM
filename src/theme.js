// src/theme.js - THÈME HARMONISÉ AVEC LA COULEUR HEADER

export const lightTheme = {
  // ==================== COULEURS HEADER (BLEU ARDOISE SOBRE) ====================
  headerBackground: 'rgba(51, 65, 85, 0.72)',  // Bleu ardoise avec transparence (effet glassmorphism)
  headerBackgroundSolid: '#334155',              // Version solide pour fallback (slate-700)
  headerText: '#ffffff',                         // Texte header

  // ==================== COULEURS PRINCIPALES (BLEU ARDOISE #334155) ====================
  primary: '#334155',              // Bleu ardoise sobre et élégant (slate-700)
  primaryHover: '#1e293b',         // Version plus foncée au survol (slate-800)
  primaryLight: '#e2e8f0',         // Version très claire pour backgrounds (slate-200)
  secondary: '#10b981',            // Vert médical (gardé)
  secondaryHover: '#059669',       // Vert foncé au survol
  accent: '#f59e0b',               // Orange pour les badges/alertes
  
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
  borderFocus: '#334155',          // Bordures focus (bleu ardoise)
  
  // ==================== ÉTATS ====================
  success: '#10b981',              // Succès (vert)
  successLight: '#d1f4e0',         // Background succès
  warning: '#f59e0b',              // Avertissement (orange)
  warningLight: '#fff4e5',         // Background avertissement
  error: '#ef4444',                // Erreur (rouge)
  errorLight: '#fee2e2',           // Background erreur
  info: '#334155',                 // Information (bleu ardoise)
  infoLight: '#e2e8f0',            // Background information
  
  // ==================== INTERACTIONS ====================
  hover: '#fafafa',                // Survol général
  active: '#e2e8f0',               // État actif (ardoise clair)
  focus: 'rgba(51, 65, 85, 0.1)',  // Focus avec transparence bleu ardoise
  disabled: '#94a3b8',             // Éléments désactivés (slate-400)
  
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
  
  // ==================== TAGS ET BADGES (BLEU ARDOISE) ====================
  tagBackground: '#e2e8f0',        // Background des tags (ardoise clair)
  tagText: '#1e293b',              // Texte des tags (ardoise foncé)
  
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
  headerBackground: 'rgba(15, 23, 42, 0.72)',  // Fond sombre ardoise avec transparence
  headerBackgroundSolid: '#0f172a',             // Version solide pour fallback (slate-900)
  headerText: '#ffffff',                        // Texte header

  // ==================== COULEURS PRINCIPALES (BLEU ARDOISE DARK MODE) ====================
  primary: '#64748b',              // Ardoise moyen adapté au mode sombre (slate-500)
  primaryHover: '#94a3b8',         // Version plus claire au survol (slate-400)
  primaryLight: '#1e293b',         // Version sombre pour backgrounds (slate-800)
  secondary: '#10b981',            // Vert mode sombre
  secondaryHover: '#34d399',       // Vert plus vif au survol
  accent: '#f59e0b',               // Orange mode sombre              
  
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
  
  // ==================== BORDURES SOMBRES (ARDOISE) ====================
  border: '#334155',               // Bordures sombres ardoise
  borderLight: '#1e293b',          // Bordures discrètes
  borderFocus: '#64748b',          // Focus ardoise mode sombre
  
  // ==================== ÉTATS SOMBRES (ARDOISE) ====================
  success: '#10b981',              // Vert mode sombre
  successLight: '#064e3b',         // Background succès sombre
  warning: '#f59e0b',              // Orange mode sombre
  warningLight: '#451a03',         // Background avertissement sombre
  error: '#ef4444',                // Rouge mode sombre
  errorLight: '#7f1d1d',           // Background erreur sombre
  info: '#64748b',                 // Ardoise mode sombre
  infoLight: '#1e293b',            // Background info sombre            
  
  // ==================== INTERACTIONS SOMBRES (ARDOISE) ====================
  hover: '#1e293b',                // Survol ardoise sombre
  active: '#334155',               // État actif
  focus: 'rgba(100, 116, 139, 0.2)', // Focus ardoise transparent
  disabled: '#475569',             // Désactivé ardoise             
  
  // ==================== BOUTONS SOMBRES (ARDOISE) ====================
  buttonText: '#ffffff',           // Texte boutons blanc
  buttonSecondary: '#1e293b',      // Boutons secondaires ardoise sombre
  buttonSecondaryText: '#ffffff',  // Texte boutons secondaires blanc
  buttonDanger: '#ef4444',         // Boutons danger rouge
  buttonDangerHover: '#dc2626',    // Boutons danger au survol    
  
  // ==================== OMBRES SOMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.3)',    
  shadowMedium: 'rgba(0, 0, 0, 0.4)', 
  shadowStrong: 'rgba(0, 0, 0, 0.6)', 
  
  // ==================== TAGS ET BADGES SOMBRES (ARDOISE) ====================
  tagBackground: '#1e293b',        // Background tag ardoise sombre
  tagText: '#cbd5e1',              // Texte tag ardoise clair
  
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