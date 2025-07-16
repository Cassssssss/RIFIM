// src/theme.js - NOUVEAU THÈME MÉDICAL MODERNE

export const lightTheme = {
  // Couleurs principales
  primary: '#4f46e5',           // Bleu médical moderne
  primaryHover: '#3730a3',      // Bleu foncé au survol
  secondary: '#10b981',         // Vert médical
  secondaryHover: '#059669',    // Vert foncé au survol
  accent: '#f59e0b',           // Orange pour les badges/alertes
  
  // Backgrounds
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Dégradé principal
  backgroundSolid: '#f8fafc',   // Background solide alternatif
  card: '#ffffff',              // Cartes/conteneurs
  cardSecondary: '#f9fafb',     // Cartes secondaires
  cardHover: '#f3f4f6',         // Survol des cartes
  
  // Textes
  text: '#1f2937',              // Texte principal
  textSecondary: '#6b7280',     // Texte secondaire
  textLight: '#9ca3af',         // Texte discret
  textInverse: '#ffffff',       // Texte sur fond coloré
  
  // Bordures et séparateurs
  border: '#e5e7eb',            // Bordures principales
  borderLight: '#f3f4f6',       // Bordures discrètes
  borderFocus: '#4f46e5',       // Bordures focus
  
  // États
  success: '#10b981',           // Succès
  successLight: '#dcfce7',      // Background succès
  warning: '#f59e0b',           // Avertissement
  warningLight: '#fef3c7',      // Background avertissement
  error: '#ef4444',             // Erreur
  errorLight: '#fef2f2',        // Background erreur
  info: '#3b82f6',              // Information
  infoLight: '#dbeafe',         // Background information
  
  // Interactions
  hover: '#f9fafb',             // Survol général
  active: '#f3f4f6',            // État actif
  focus: 'rgba(79, 70, 229, 0.1)', // Focus avec transparence
  
  // Boutons
  buttonText: '#ffffff',        // Texte des boutons
  buttonSecondary: '#f3f4f6',   // Boutons secondaires
  buttonSecondaryText: '#374151', // Texte boutons secondaires
  buttonDanger: '#ef4444',      // Boutons de suppression
  buttonDangerHover: '#dc2626', // Boutons de suppression au survol
  
  // Ombres
  shadow: 'rgba(0, 0, 0, 0.1)', // Ombre légère
  shadowMedium: 'rgba(0, 0, 0, 0.15)', // Ombre moyenne
  shadowStrong: 'rgba(0, 0, 0, 0.25)', // Ombre forte
  
  // Tags et badges
  tagBackground: '#e0e7ff',     // Background des tags
  tagText: '#3730a3',           // Texte des tags
  
  // Statuts spécifiques
  statusPublic: '#dcfce7',      // Background statut public
  statusPublicText: '#166534',  // Texte statut public
  statusPrivate: '#fef3c7',     // Background statut privé
  statusPrivateText: '#92400e', // Texte statut privé
  
  // Espacement (ajout pour consistency)
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '0.75rem',    // 12px
    lg: '1rem',       // 16px
    xl: '1.5rem',     // 24px
    xxl: '2rem'       // 32px
  },
  
  // Rayons de bordure
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  }
};

export const darkTheme = {
  // Couleurs principales (adaptées pour le mode sombre)
  primary: '#6366f1',           // Bleu plus vif pour le sombre
  primaryHover: '#4f46e5',      
  secondary: '#34d399',         // Vert plus vif
  secondaryHover: '#10b981',    
  accent: '#fbbf24',           
  
  // Backgrounds sombres
  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
  backgroundSolid: '#0f172a',   
  card: '#1e293b',              
  cardSecondary: '#334155',     
  cardHover: '#475569',         
  
  // Textes pour mode sombre
  text: '#f8fafc',              
  textSecondary: '#cbd5e1',     
  textLight: '#94a3b8',         
  textInverse: '#1f2937',       
  
  // Bordures sombres
  border: '#475569',            
  borderLight: '#334155',       
  borderFocus: '#6366f1',       
  
  // États adaptés
  success: '#34d399',           
  successLight: '#064e3b',      
  warning: '#fbbf24',           
  warningLight: '#451a03',      
  error: '#f87171',             
  errorLight: '#7f1d1d',        
  info: '#60a5fa',              
  infoLight: '#1e3a8a',         
  
  // Interactions sombres
  hover: '#334155',             
  active: '#475569',            
  focus: 'rgba(99, 102, 241, 0.2)', 
  
  // Boutons sombres
  buttonText: '#ffffff',        
  buttonSecondary: '#334155',   
  buttonSecondaryText: '#f8fafc', 
  buttonDanger: '#f87171',      
  buttonDangerHover: '#ef4444', 
  
  // Ombres sombres
  shadow: 'rgba(0, 0, 0, 0.3)', 
  shadowMedium: 'rgba(0, 0, 0, 0.4)', 
  shadowStrong: 'rgba(0, 0, 0, 0.6)', 
  
  // Tags et badges sombres
  tagBackground: '#312e81',     
  tagText: '#a5b4fc',           
  
  // Statuts sombres
  statusPublic: '#064e3b',      
  statusPublicText: '#6ee7b7',  
  statusPrivate: '#451a03',     
  statusPrivateText: '#fcd34d', 
  
  // Espacement identique
  spacing: {
    xs: '0.25rem',    
    sm: '0.5rem',     
    md: '0.75rem',    
    lg: '1rem',       
    xl: '1.5rem',     
    xxl: '2rem'       
  },
  
  // Rayons identiques
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  }
};