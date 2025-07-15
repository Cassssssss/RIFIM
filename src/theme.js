import { medicalColors, withOpacity } from './medicalColors';

export const lightTheme = {
  // Couleurs de base
  body: medicalColors.neutral.white,
  text: medicalColors.neutral.charcoal,
  
  // Couleurs principales médicales
  primary: medicalColors.primary.main,
  secondary: medicalColors.secondary.main,
  accent: medicalColors.accent.main,
  
  // Backgrounds médicaux
  background: medicalColors.neutral.offWhite,
  
  // Bordures et séparateurs
  border: medicalColors.cards.border,
  
  // Cartes médicales
  card: medicalColors.cards.background,
  cardSecondary: medicalColors.cards.backgroundAlt,
  cardTertiary: medicalColors.neutral.lightGray,
  cardHover: medicalColors.cards.hover,
  cardSelected: medicalColors.cards.selected,
  
  // Inputs et formulaires médicaux
  inputBackground: medicalColors.forms.input.bg,
  inputText: medicalColors.neutral.charcoal,
  inputBorder: medicalColors.forms.input.border,
  inputFocus: medicalColors.forms.input.focus,
  inputError: medicalColors.forms.input.error,
  inputSuccess: medicalColors.forms.input.success,
  inputDisabled: medicalColors.forms.input.disabled,
  
  // Boutons standardisés
  buttonPrimary: medicalColors.buttons.primary.bg,
  buttonPrimaryText: medicalColors.buttons.primary.text,
  buttonPrimaryHover: medicalColors.buttons.primary.hover,
  buttonPrimaryActive: medicalColors.buttons.primary.active,
  buttonPrimaryDisabled: medicalColors.buttons.primary.disabled,
  
  buttonSecondary: medicalColors.buttons.secondary.bg,
  buttonSecondaryText: medicalColors.buttons.secondary.text,
  buttonSecondaryHover: medicalColors.buttons.secondary.hover,
  buttonSecondaryActive: medicalColors.buttons.secondary.active,
  
  buttonTertiary: medicalColors.buttons.tertiary.bg,
  buttonTertiaryText: medicalColors.buttons.tertiary.text,
  buttonTertiaryHover: medicalColors.buttons.tertiary.hover,
  buttonTertiaryBorder: medicalColors.buttons.tertiary.border,
  
  buttonDanger: medicalColors.buttons.danger.bg,
  buttonDangerText: medicalColors.buttons.danger.text,
  buttonDangerHover: medicalColors.buttons.danger.hover,
  
  buttonSuccess: medicalColors.buttons.success.bg,
  buttonSuccessText: medicalColors.buttons.success.text,
  buttonSuccessHover: medicalColors.buttons.success.hover,
  
  // Compatibilité ancien système
  buttonText: medicalColors.buttons.primary.text,
  
  // Questions et options médicales
  questionBackground: medicalColors.questions.background,
  questionBackgroundAlt: medicalColors.questions.backgroundAlt,
  optionBackground: medicalColors.questions.backgroundAlt,
  optionText: medicalColors.questions.text,
  optionTextSecondary: medicalColors.questions.textSecondary,
  optionSelected: medicalColors.questions.selected,
  optionHover: medicalColors.questions.hover,
  
  // Header médical
  headerBackground: medicalColors.primary.main,
  headerText: medicalColors.neutral.white,
  
  // Status et alertes médicales
  success: medicalColors.status.success,
  warning: medicalColors.status.warning,
  error: medicalColors.status.error,
  info: medicalColors.status.info,
  critical: medicalColors.status.critical,
  
  // Niveaux de profondeur
  depth: {
    level0: medicalColors.depth.level0,
    level1: medicalColors.depth.level1,
    level2: medicalColors.depth.level2,
    level3: medicalColors.depth.level3,
  },
  
  // Ombres médicales
  shadow: medicalColors.cards.shadow,
  shadowHover: withOpacity(medicalColors.primary.main, 0.15),
  
  // Espacements standardisés
  spacing: medicalColors.spacing,
  
  // Tailles de boutons standardisées
  buttonSizes: medicalColors.buttonSizes,
  
  // Compatibilité avec l'ancien système
  disabled: medicalColors.buttons.primary.disabled,
};

export const darkTheme = {
  // Couleurs de base pour le mode sombre médical
  body: '#1a1a2e',
  text: '#FFFFFF',
  
  // Couleurs principales adaptées pour le dark mode
  primary: medicalColors.primary.light,
  secondary: medicalColors.secondary.light,
  accent: medicalColors.accent.light,
  
  // Backgrounds sombres médicaux
  background: '#0f1629',
  
  // Bordures pour le dark mode
  border: '#2a2a3e',
  
  // Cartes sombres médicales
  card: '#1e2233',
  cardSecondary: '#2a2a3e',
  cardTertiary: '#2d3142',
  cardHover: '#404463',
  cardSelected: withOpacity(medicalColors.primary.light, 0.2),
  
  // Inputs pour le dark mode
  inputBackground: '#2a2a3e',
  inputText: '#E4E6E8',
  inputBorder: '#404463',
  inputFocus: medicalColors.primary.light,
  inputError: medicalColors.status.error,
  inputSuccess: medicalColors.status.success,
  inputDisabled: '#404463',
  
  // Boutons pour le dark mode
  buttonPrimary: medicalColors.primary.light,
  buttonPrimaryText: '#FFFFFF',
  buttonPrimaryHover: medicalColors.primary.main,
  buttonPrimaryActive: medicalColors.primary.dark,
  buttonPrimaryDisabled: '#6c757d',
  
  buttonSecondary: medicalColors.secondary.light,
  buttonSecondaryText: '#FFFFFF',
  buttonSecondaryHover: medicalColors.secondary.main,
  buttonSecondaryActive: medicalColors.secondary.dark,
  
  buttonTertiary: '#2a2a3e',
  buttonTertiaryText: '#E4E6E8',
  buttonTertiaryHover: '#404463',
  buttonTertiaryBorder: '#404463',
  
  buttonDanger: medicalColors.buttons.danger.bg,
  buttonDangerText: medicalColors.buttons.danger.text,
  buttonDangerHover: medicalColors.buttons.danger.hover,
  
  buttonSuccess: medicalColors.buttons.success.bg,
  buttonSuccessText: medicalColors.buttons.success.text,
  buttonSuccessHover: medicalColors.buttons.success.hover,
  
  // Compatibilité
  buttonText: '#FFFFFF',
  
  // Questions et options pour le dark mode
  questionBackground: '#1e2233',
  questionBackgroundAlt: '#2a2a3e',
  optionBackground: '#2a2a3e',
  optionText: '#FFFFFF',
  optionTextSecondary: '#BDBDBD',
  optionSelected: withOpacity(medicalColors.primary.light, 0.2),
  optionHover: '#404463',
  
  // Header pour le dark mode
  headerBackground: '#1e2233',
  headerText: '#FFFFFF',
  
  // Status pour le dark mode
  success: medicalColors.status.success,
  warning: medicalColors.status.warning,
  error: medicalColors.status.error,
  info: medicalColors.primary.light,
  critical: medicalColors.status.critical,
  
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
  
  // Espacements standardisés
  spacing: medicalColors.spacing,
  
  // Tailles de boutons standardisées
  buttonSizes: medicalColors.buttonSizes,
  
  // Compatibilité
  disabled: '#6c757d',
  
  // Propriétés spécifiques au dark mode (pour compatibilité)
  questionnaireOptionText: '#E4E6E8',
};