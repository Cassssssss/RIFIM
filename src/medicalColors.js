// Palette de couleurs vraiment médicales
// Basée sur les couleurs utilisées dans les hôpitaux, blouses, matériel médical

export const medicalColors = {
  // Couleurs principales médicales authentiques
  primary: {
    main: '#005A9C',      // Bleu médical profond (blouse chirurgien)
    light: '#4A90C2',     // Bleu médical clair
    dark: '#003D6B',      // Bleu médical très foncé
    subtle: '#E6F3FF',    // Bleu médical très clair
  },
  
  // Couleurs secondaires médicales
  secondary: {
    main: '#006B3C',      // Vert médical (croix verte pharmacie)
    light: '#4A9B6E',     // Vert médical clair
    dark: '#004A2A',      // Vert médical foncé
    subtle: '#E6F7ED',    // Vert médical très clair
  },
  
  // Couleurs d'accent médicales
  accent: {
    main: '#D4006B',      // Rose médical (sanguin/urgence)
    light: '#E6479B',     // Rose médical clair
    dark: '#A0004F',      // Rose médical foncé
    subtle: '#FCE6F1',    // Rose médical très clair
  },
  
  // Couleurs de statut médical
  status: {
    success: '#006B3C',   // Vert médical
    warning: '#FF8C00',   // Orange médical (attention)
    error: '#CC0000',     // Rouge médical (urgence)
    info: '#005A9C',      // Bleu médical
    critical: '#8B0000',  // Rouge critique
  },
  
  // Couleurs neutres médicales (tons blancs/gris des hôpitaux)
  neutral: {
    white: '#FFFFFF',
    offWhite: '#FAFAFA',     // Blanc cassé médical
    lightGray: '#F5F5F5',   // Gris clair médical
    gray: '#E0E0E0',        // Gris médical
    mediumGray: '#BDBDBD',  // Gris moyen
    darkGray: '#757575',    // Gris foncé
    charcoal: '#424242',    // Charbon médical
    black: '#212121',
  },
  
  // Couleurs spécifiques aux cartes médicales
  cards: {
    background: '#FFFFFF',
    backgroundAlt: '#FAFAFA',
    border: '#E0E0E0',
    shadow: 'rgba(0, 90, 156, 0.1)',    // Ombre bleu médical
    hover: '#F5F5F5',
    selected: '#E6F3FF',
  },
  
  // Standardisation des boutons médicaux
  buttons: {
    // Bouton principal (actions importantes)
    primary: {
      bg: '#005A9C',
      text: '#FFFFFF',
      hover: '#004A82',
      active: '#003D6B',
      disabled: '#BDBDBD',
      shadow: 'rgba(0, 90, 156, 0.2)',
    },
    // Bouton secondaire (actions moins importantes)
    secondary: {
      bg: '#006B3C',
      text: '#FFFFFF',
      hover: '#005A31',
      active: '#004A2A',
      disabled: '#BDBDBD',
      shadow: 'rgba(0, 107, 60, 0.2)',
    },
    // Bouton tertiaire (actions subtiles)
    tertiary: {
      bg: '#FFFFFF',
      text: '#005A9C',
      hover: '#F5F5F5',
      active: '#E0E0E0',
      border: '#005A9C',
      disabled: '#BDBDBD',
    },
    // Bouton danger (suppression, actions critiques)
    danger: {
      bg: '#CC0000',
      text: '#FFFFFF',
      hover: '#B30000',
      active: '#8B0000',
      disabled: '#BDBDBD',
      shadow: 'rgba(204, 0, 0, 0.2)',
    },
    // Bouton success (validation, confirmation)
    success: {
      bg: '#006B3C',
      text: '#FFFFFF',
      hover: '#005A31',
      active: '#004A2A',
      disabled: '#BDBDBD',
      shadow: 'rgba(0, 107, 60, 0.2)',
    },
  },
  
  // Tailles standardisées des boutons
  buttonSizes: {
    small: {
      padding: '0.375rem 0.75rem',    // 6px 12px
      fontSize: '0.875rem',           // 14px
      lineHeight: '1.25rem',          // 20px
      borderRadius: '0.375rem',       // 6px
      minHeight: '2rem',              // 32px
    },
    medium: {
      padding: '0.5rem 1rem',         // 8px 16px
      fontSize: '1rem',               // 16px
      lineHeight: '1.5rem',           // 24px
      borderRadius: '0.5rem',         // 8px
      minHeight: '2.5rem',            // 40px
    },
    large: {
      padding: '0.75rem 1.5rem',      // 12px 24px
      fontSize: '1.125rem',           // 18px
      lineHeight: '1.75rem',          // 28px
      borderRadius: '0.5rem',         // 8px
      minHeight: '3rem',              // 48px
    },
  },
  
  // Espacements standardisés
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    xxl: '3rem',      // 48px
  },
  
  // Couleurs pour les formulaires médicaux
  forms: {
    input: {
      bg: '#FFFFFF',
      border: '#E0E0E0',
      focus: '#005A9C',
      error: '#CC0000',
      success: '#006B3C',
      disabled: '#F5F5F5',
    },
    label: '#424242',
    placeholder: '#757575',
    help: '#757575',
    required: '#CC0000',
  },
  
  // Couleurs pour les questions/options
  questions: {
    background: '#FFFFFF',
    backgroundAlt: '#FAFAFA',
    border: '#E0E0E0',
    selected: '#E6F3FF',
    hover: '#F5F5F5',
    text: '#424242',
    textSecondary: '#757575',
  },
  
  // Couleurs pour les différents niveaux de profondeur
  depth: {
    level0: '#FFFFFF',      // Niveau principal
    level1: '#FAFAFA',      // Sous-niveau 1
    level2: '#F5F5F5',      // Sous-niveau 2
    level3: '#E0E0E0',      // Sous-niveau 3
  },
};

// Fonction utilitaire pour générer des couleurs avec opacité
export const withOpacity = (color, opacity) => {
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

// Fonction pour obtenir les styles d'un bouton standardisé
export const getButtonStyles = (variant = 'primary', size = 'medium') => {
  const buttonColor = medicalColors.buttons[variant];
  const buttonSize = medicalColors.buttonSizes[size];
  
  return {
    backgroundColor: buttonColor.bg,
    color: buttonColor.text,
    padding: buttonSize.padding,
    fontSize: buttonSize.fontSize,
    lineHeight: buttonSize.lineHeight,
    borderRadius: buttonSize.borderRadius,
    minHeight: buttonSize.minHeight,
    border: buttonColor.border ? `1px solid ${buttonColor.border}` : 'none',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    boxShadow: buttonColor.shadow ? `0 1px 3px ${buttonColor.shadow}` : 'none',
    '&:hover': {
      backgroundColor: buttonColor.hover,
    },
    '&:active': {
      backgroundColor: buttonColor.active,
    },
    '&:disabled': {
      backgroundColor: buttonColor.disabled,
      cursor: 'not-allowed',
      opacity: 0.6,
    },
  };
};

// Export des couleurs pour compatibilité
export default medicalColors;