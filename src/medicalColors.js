// Palette de couleurs pour application médicale
// Basée sur des standards de couleurs utilisés dans le domaine médical

export const medicalColors = {
  // Couleurs principales médicales
  primary: {
    main: '#2E86AB',      // Bleu médical professionnel
    light: '#4B9FCA',     // Bleu clair pour hovers
    dark: '#1A5F7A',      // Bleu foncé pour emphasis
    subtle: '#E8F4F8',    // Bleu très clair pour backgrounds
  },
  
  // Couleurs secondaires
  secondary: {
    main: '#57A773',      // Vert médical (santé/positif)
    light: '#7BB899',     // Vert clair
    dark: '#3E8B5A',      // Vert foncé
    subtle: '#F0F8F4',    // Vert très clair
  },
  
  // Couleurs d'accent
  accent: {
    main: '#F39C12',      // Orange médical (attention/important)
    light: '#F5B041',     // Orange clair
    dark: '#E67E22',      // Orange foncé
    subtle: '#FDF2E9',    // Orange très clair
  },
  
  // Couleurs de statut médical
  status: {
    success: '#27AE60',   // Vert succès
    warning: '#F39C12',   // Orange avertissement
    error: '#E74C3C',     // Rouge erreur
    info: '#3498DB',      // Bleu information
  },
  
  // Couleurs neutres médicales
  neutral: {
    white: '#FFFFFF',
    lightGray: '#F8F9FA',
    gray: '#E9ECEF',
    mediumGray: '#ADB5BD',
    darkGray: '#6C757D',
    charcoal: '#495057',
    black: '#212529',
  },
  
  // Couleurs spécifiques aux cartes médicales
  cards: {
    background: '#FFFFFF',
    border: '#E9ECEF',
    shadow: 'rgba(0, 0, 0, 0.08)',
    hover: '#F8F9FA',
  },
  
  // Couleurs pour les boutons médicaux
  buttons: {
    primary: {
      bg: '#2E86AB',
      text: '#FFFFFF',
      hover: '#1A5F7A',
      disabled: '#ADB5BD',
    },
    secondary: {
      bg: '#57A773',
      text: '#FFFFFF',
      hover: '#3E8B5A',
      disabled: '#ADB5BD',
    },
    tertiary: {
      bg: '#F8F9FA',
      text: '#495057',
      hover: '#E9ECEF',
      border: '#DEE2E6',
    },
  },
  
  // Couleurs pour les formulaires médicaux
  forms: {
    input: {
      bg: '#FFFFFF',
      border: '#DEE2E6',
      focus: '#2E86AB',
      error: '#E74C3C',
      success: '#27AE60',
    },
    label: '#495057',
    placeholder: '#6C757D',
    help: '#6C757D',
  },
  
  // Couleurs pour les questions/options
  questions: {
    background: '#FFFFFF',
    border: '#E9ECEF',
    selected: '#E8F4F8',
    hover: '#F8F9FA',
    text: '#495057',
  },
  
  // Couleurs pour les différents niveaux de profondeur
  depth: {
    level0: '#FFFFFF',      // Niveau principal
    level1: '#F8F9FA',      // Sous-niveau 1
    level2: '#F1F3F4',      // Sous-niveau 2
    level3: '#E9ECEF',      // Sous-niveau 3
  },
};

// Fonction utilitaire pour générer des couleurs avec opacité
export const withOpacity = (color, opacity) => {
  // Convertit une couleur hex en rgba avec opacité
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Fonction pour obtenir une couleur selon la profondeur
export const getDepthColor = (depth) => {
  const colors = [
    medicalColors.depth.level0,
    medicalColors.depth.level1,
    medicalColors.depth.level2,
    medicalColors.depth.level3,
  ];
  return colors[Math.min(depth, colors.length - 1)];
};

// Export des couleurs pour compatibilité
export default medicalColors;