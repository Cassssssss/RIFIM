// src/theme.js - THÈME CORRIGÉ AVEC HEADER ORIGINAL

export const lightTheme = {
  // ==================== COULEURS HEADER (CONSERVÉES) ====================
  headerBackground: '#4f5b93',     // Couleur header originale
  headerText: '#ffffff',           // Texte header original
  
  // ==================== COULEURS PRINCIPALES ====================
  primary: '#4f46e5',              // Bleu médical moderne
  primaryHover: '#3730a3',         // Bleu foncé au survol
  secondary: '#10b981',            // Vert médical
  secondaryHover: '#059669',       // Vert foncé au survol
  accent: '#f59e0b',              // Orange pour les badges/alertes
  
  // ==================== BACKGROUNDS ====================
  background: '#f8fafc',           // Background principal (PAS de dégradé)
  backgroundSolid: '#f8fafc',      // Background solide
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
  borderFocus: '#4f46e5',          // Bordures focus
  
  // ==================== ÉTATS ====================
  success: '#10b981',              // Succès
  successLight: '#dcfce7',         // Background succès
  warning: '#f59e0b',              // Avertissement
  warningLight: '#fef3c7',         // Background avertissement
  error: '#ef4444',                // Erreur
  errorLight: '#fef2f2',           // Background erreur
  info: '#3b82f6',                 // Information
  infoLight: '#dbeafe',            // Background information
  
  // ==================== INTERACTIONS ====================
  hover: '#f9fafb',                // Survol général
  active: '#f3f4f6',               // État actif
  focus: 'rgba(79, 70, 229, 0.1)', // Focus avec transparence
  disabled: '#9ca3af',             // Éléments désactivés
  
  // ==================== BOUTONS ====================
  buttonText: '#ffffff',           // Texte des boutons
  buttonSecondary: '#f3f4f6',      // Boutons secondaires
  buttonSecondaryText: '#374151',  // Texte boutons secondaires
  buttonDanger: '#ef4444',         // Boutons de suppression
  buttonDangerHover: '#dc2626',    // Boutons de suppression au survol
  
  // ==================== OMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.1)',    // Ombre légère
  shadowMedium: 'rgba(0, 0, 0, 0.15)', // Ombre moyenne
  shadowStrong: 'rgba(0, 0, 0, 0.25)', // Ombre forte
  
  // ==================== TAGS ET BADGES ====================
  tagBackground: '#e0e7ff',        // Background des tags
  tagText: '#3730a3',              // Texte des tags
  
  // ==================== STATUTS SPÉCIFIQUES ====================
  statusPublic: '#dcfce7',         // Background statut public
  statusPublicText: '#166534',     // Texte statut public
  statusPrivate: '#fef3c7',        // Background statut privé
  statusPrivateText: '#92400e',    // Texte statut privé
  
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
  // ==================== COULEURS HEADER (SOMBRES) ====================
  headerBackground: '#1f2335',     // Header sombre
  headerText: '#ffffff',           // Texte header
  
  // ==================== COULEURS PRINCIPALES ====================
  primary: '#6366f1',              // Bleu plus vif pour le sombre
  primaryHover: '#4f46e5',         
  secondary: '#34d399',            // Vert plus vif
  secondaryHover: '#10b981',       
  accent: '#fbbf24',              
  
  // ==================== BACKGROUNDS SOMBRES ====================
  background: '#181c2e',           // Background principal sombre
  backgroundSolid: '#181c2e',      // Background solide sombre
  card: '#1e293b',                 // Cartes sombres
  cardSecondary: '#334155',        // Cartes secondaires sombres
  cardHover: '#475569',            // Survol des cartes sombres
  surface: '#1e293b',              // Surface sombre
  
  // ==================== TEXTES SOMBRES ====================
  text: '#f8fafc',                 
  textSecondary: '#cbd5e1',        
  textLight: '#94a3b8',            
  textInverse: '#1f2937',          
  
  // ==================== BORDURES SOMBRES ====================
  border: '#475569',               
  borderLight: '#334155',          
  borderFocus: '#6366f1',          
  
  // ==================== ÉTATS SOMBRES ====================
  success: '#34d399',              
  successLight: '#064e3b',         
  warning: '#fbbf24',              
  warningLight: '#451a03',         
  error: '#f87171',                
  errorLight: '#7f1d1d',           
  info: '#60a5fa',                 
  infoLight: '#1e3a8a',            
  
  // ==================== INTERACTIONS SOMBRES ====================
  hover: '#334155',                
  active: '#475569',               
  focus: 'rgba(99, 102, 241, 0.2)', 
  disabled: '#64748b',             
  
  // ==================== BOUTONS SOMBRES ====================
  buttonText: '#ffffff',           
  buttonSecondary: '#334155',      
  buttonSecondaryText: '#f8fafc',  
  buttonDanger: '#f87171',         
  buttonDangerHover: '#ef4444',    
  
  // ==================== OMBRES SOMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.3)',    
  shadowMedium: 'rgba(0, 0, 0, 0.4)', 
  shadowStrong: 'rgba(0, 0, 0, 0.6)', 
  
  // ==================== TAGS ET BADGES SOMBRES ====================
  tagBackground: '#312e81',        
  tagText: '#a5b4fc',              
  
  // ==================== STATUTS SOMBRES ====================
  statusPublic: '#064e3b',         
  statusPublicText: '#6ee7b7',     
  statusPrivate: '#451a03',        
  statusPrivateText: '#fcd34d',    
  
  // ==================== INPUTS SOMBRES ====================
  inputBackground: '#334155',      
  inputText: '#f8fafc',            
  
  // ==================== QUESTIONS SOMBRES ====================
  questionBackground: '#334155',   
  questionBackgroundAlt: '#475569', 
  
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