import { medicalColors, withOpacity } from './medicalColors';

export const lightTheme = {
  // Couleurs de base
  body: medicalColors.neutral.white,
  text: medicalColors.neutral.charcoal,
  
  // Couleurs principales
  primary: medicalColors.primary.main,
  secondary: medicalColors.secondary.main,
  accent: medicalColors.accent.main,
  
  // Backgrounds
  background: medicalColors.neutral.lightGray,
  
  // Bordures et séparateurs
  border: medicalColors.cards.border,
  
  // Cartes
  card: medicalColors.cards.background,
  cardSecondary: medicalColors.neutral.white,
  cardHover: medicalColors.cards.hover,
  
  // Inputs et formulaires
  inputBackground: medicalColors.forms.input.bg,
  inputText: medicalColors.neutral.charcoal,
  inputBorder: medicalColors.forms.input.border,
  inputFocus: medicalColors.forms.input.focus,
  
  // Boutons
  buttonPrimary: medicalColors.buttons.primary.bg,
  buttonPrimaryText: medicalColors.buttons.primary.text,
  buttonPrimaryHover: medicalColors.buttons.primary.hover,
  buttonSecondary: medicalColors.buttons.secondary.bg,
  buttonSecondaryText: medicalColors.buttons.secondary.text,
  buttonSecondaryHover: medicalColors.buttons.secondary.hover,
  buttonTertiary: medicalColors.buttons.tertiary.bg,
  buttonTertiaryText: medicalColors.buttons.tertiary.text,
  buttonTertiaryHover: medicalColors.buttons.tertiary.hover,
  buttonText: medicalColors.buttons.primary.text,
  
  // Questions et options
  questionBackground: medicalColors.questions.background,
  optionBackground: medicalColors.neutral.lightGray,
  optionText: medicalColors.questions.text,
  optionSelected: medicalColors.questions.selected,
  optionHover: medicalColors.questions.hover,
  
  // Header
  headerBackground: medicalColors.primary.main,
  headerText: medicalColors.neutral.white,
  
  // Status et alertes
  success: medicalColors.status.success,
  warning: medicalColors.status.warning,
  error: medicalColors.status.error,
  info: medicalColors.status.info,
  
  // Niveaux de profondeur
  depth: {
    level0: medicalColors.depth.level0,
    level1: medicalColors.depth.level1,
    level2: medicalColors.depth.level2,
    level3: medicalColors.depth.level3,
  },
  
  // Ombres
  shadow: medicalColors.cards.shadow,
  shadowHover: withOpacity(medicalColors.neutral.black, 0.15),
  
  // Compatibilité avec l'ancien système
  disabled: medicalColors.buttons.primary.disabled,
};

export const darkTheme = {
  // Couleurs de base pour le mode sombre
  body: '#1a1a2e',
  text: '#FFFFFF',
  
  // Couleurs principales (adaptées pour le dark mode)
  primary: medicalColors.primary.light,
  secondary: medicalColors.secondary.light,
  accent: medicalColors.accent.light,
  
  // Backgrounds sombres
  background: '#0f1629',
  
  // Bordures pour le dark mode
  border: '#2a2a3e',
  
  // Cartes sombres
  card: '#1e2233',
  cardSecondary: '#2a2a3e',
  cardHover: '#2d3142',
  
  // Inputs pour le dark mode
  inputBackground: '#2a2a3e',
  inputText: '#E4E6E8',
  inputBorder: '#404463',
  inputFocus: medicalColors.primary.light,
  
  // Boutons pour le dark mode
  buttonPrimary: medicalColors.primary.light,
  buttonPrimaryText: '#FFFFFF',
  buttonPrimaryHover: medicalColors.primary.main,
  buttonSecondary: medicalColors.secondary.light,
  buttonSecondaryText: '#FFFFFF',
  buttonSecondaryHover: medicalColors.secondary.main,
  buttonTertiary: '#2a2a3e',
  buttonTertiaryText: '#E4E6E8',
  buttonTertiaryHover: '#404463',
  buttonText: '#FFFFFF',
  
  // Questions et options pour le dark mode
  questionBackground: '#1e2233',
  optionBackground: '#2a2a3e',
  optionText: '#FFFFFF',
  optionSelected: withOpacity(medicalColors.primary.light, 0.2),
  optionHover: '#2d3142',
  
  // Header pour le dark mode
  headerBackground: '#1e2233',
  headerText: '#FFFFFF',
  
  // Status pour le dark mode
  success: medicalColors.status.success,
  warning: medicalColors.status.warning,
  error: medicalColors.status.error,
  info: medicalColors.status.info,
  
  // Niveaux de profondeur pour le dark mode
  depth: {
    level0: '#1e2233',
    level1: '#2a2a3e',
    level2: '#2d3142',
    level3: '#404463',
  },
  
  // Ombres pour le dark mode
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowHover: 'rgba(0, 0, 0, 0.4)',
  
  // Compatibilité
  disabled: '#6c757d',
  
  // Propriétés spécifiques au dark mode (pour compatibilité)
  questionnaireOptionText: '#E4E6E8',
};