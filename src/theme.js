// src/theme.js - VERSION CORRIGÉE
// ✨ Header transparent style Apple + Tags harmonisés sobres et élégants

export const lightTheme = {
  // ==================== HEADER TRANSPARENT STYLE APPLE ====================
  // ⭐ Le fond de page est #f8fafc, le header doit être un peu plus gris
  headerBackground: 'rgba(229, 235, 242, 0.28)',  // ⭐ Plus gris que le fond + transparent
  headerBackgroundSolid: '#f1f5f9',
  headerBlur: 'blur(20px)',  // ⭐ Plus de blur pour effet Apple
  headerBorder: 'rgba(0, 0, 0, 0.08)',
  headerText: '#1f2937',
  headerShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  
  // ==================== COULEURS PRINCIPALES ====================
  primary: '#4f5b93',
  primaryHover: '#3d4873',
  secondary: '#10b981',
  secondaryHover: '#059669',
  accent: '#f59e0b',
  
  // ==================== BACKGROUNDS ====================
  background: '#f8fafc',  // Fond principal blanc cassé
  backgroundSolid: '#f8fafc',
  backgroundSecondary: '#f1f5f9',
  card: '#ffffff',  // Cartes blanches
  cardSecondary: '#f9fafb',
  cardHover: '#f3f4f6',
  surface: '#ffffff',
  
  // ==================== TEXTES ====================
  text: '#1f2937',
  textSecondary: '#6b7280',
  textLight: '#9ca3af',
  textInverse: '#ffffff',
  
  // ==================== BORDURES ====================
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  borderFocus: '#4f5b93',
  
  // ==================== ÉTATS ====================
  success: '#10b981',
  successLight: '#dcfce7',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  error: '#ef4444',
  errorLight: '#fef2f2',
  info: '#4f5b93',
  infoLight: '#e0e7ff',
  
  // ==================== INTERACTIONS ====================
  hover: '#f9fafb',
  active: '#f3f4f6',
  focus: 'rgba(79, 91, 147, 0.1)',
  disabled: '#9ca3af',
  
  // ==================== BOUTONS ====================
  buttonText: '#ffffff',
  buttonSecondary: '#f3f4f6',
  buttonSecondaryText: '#374151',
  buttonDanger: '#ef4444',
  buttonDangerHover: '#dc2626',
  
  // ==================== OMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowMedium: 'rgba(0, 0, 0, 0.15)',
  shadowStrong: 'rgba(0, 0, 0, 0.25)',
  
  // ==================== TAGS HARMONISÉS (MODE CLAIR) ====================
  // ⭐ Tags sobres et élégants, bien visibles
  tagBackground: '#f3f4f6',  // Gris très clair
  tagText: '#374151',        // Gris foncé pour bon contraste
  tagBorder: '#d1d5db',      // Bordure gris moyen
  
  // ==================== BOUTONS ÉLÉGANTS ====================
  // ⭐ Boutons "Utiliser/Charger" élégants
  actionButtonBackground: '#ffffff',
  actionButtonText: '#374151',
  actionButtonBorder: '#d1d5db',
  actionButtonHover: '#f9fafb',
  
  // ⭐ Bouton poubelle sobre
  deleteButtonBackground: '#fef2f2',
  deleteButtonText: '#991b1b',
  deleteButtonBorder: '#fecaca',
  deleteButtonHover: '#fee2e2',
  
  // ==================== STATUTS ====================
  statusPublic: '#dcfce7',
  statusPublicText: '#166534',
  statusPrivate: '#fef3c7',
  statusPrivateText: '#92400e',
  statusDraft: '#f3f4f6',
  statusDraftText: '#374151',
  
  // ==================== INPUTS ====================
  inputBackground: '#ffffff',
  inputText: '#1f2937',
  
  // ==================== QUESTIONS ====================
  questionBackground: '#f9fafb',
  questionBackgroundAlt: '#f3f4f6',
  
  // ==================== ESPACEMENT ====================
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    xxl: '2rem'
  },
  
  // ==================== RAYONS ====================
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  }
};

export const darkTheme = {
  // ==================== HEADER TRANSPARENT STYLE APPLE (SOMBRE) ====================
  // ⭐ Le fond de page est #1a202c, le header doit être un peu plus gris
  headerBackground: 'rgba(45, 55, 72, 0.85)',  // ⭐ Plus gris que le fond + transparent
  headerBackgroundSolid: '#2d3748',
  headerBlur: 'blur(20px)',  // ⭐ Plus de blur pour effet Apple
  headerBorder: 'rgba(255, 255, 255, 0.08)',
  headerText: '#f7fafc',
  headerShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
  
  // ==================== COULEURS PRINCIPALES ====================
  primary: '#4f5b93',
  primaryHover: '#3d4873',
  secondary: '#34d399',
  secondaryHover: '#10b981',
  accent: '#fbbf24',
  
  // ==================== BACKGROUNDS ====================
  background: '#1a202c',
  backgroundSolid: '#1a202c',
  backgroundSecondary: '#2d3748',
  card: '#2d3748',
  cardSecondary: '#4a5568',
  cardHover: '#718096',
  surface: '#2d3748',
  
  // ==================== TEXTES ====================
  text: '#f7fafc',
  textSecondary: '#cbd5e0',
  textLight: '#a0aec0',
  textInverse: '#1a202c',
  
  // ==================== BORDURES ====================
  border: '#4a5568',
  borderLight: '#2d3748',
  borderFocus: '#4f5b93',
  
  // ==================== ÉTATS ====================
  success: '#34d399',
  successLight: '#064e3b',
  warning: '#fbbf24',
  warningLight: '#451a03',
  error: '#f87171',
  errorLight: '#7f1d1d',
  info: '#4f5b93',
  infoLight: '#2a4365',
  
  // ==================== INTERACTIONS ====================
  hover: '#4a5568',
  active: '#718096',
  focus: 'rgba(79, 91, 147, 0.3)',
  disabled: '#718096',
  
  // ==================== BOUTONS ====================
  buttonText: '#ffffff',
  buttonSecondary: '#4a5568',
  buttonSecondaryText: '#f7fafc',
  buttonDanger: '#f87171',
  buttonDangerHover: '#ef4444',
  
  // ==================== OMBRES ====================
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowMedium: 'rgba(0, 0, 0, 0.4)',
  shadowStrong: 'rgba(0, 0, 0, 0.6)',
  
  // ==================== TAGS HARMONISÉS (MODE SOMBRE) ====================
  // ⭐ Tags sobres et élégants en mode sombre, bien visibles
  tagBackground: '#374151',  // Gris moyen
  tagText: '#e5e7eb',        // Gris très clair pour bon contraste
  tagBorder: '#4b5563',      // Bordure gris
  
  // ==================== BOUTONS ÉLÉGANTS ====================
  // ⭐ Boutons "Utiliser/Charger" élégants mode sombre
  actionButtonBackground: '#374151',
  actionButtonText: '#f3f4f6',
  actionButtonBorder: '#4b5563',
  actionButtonHover: '#4b5563',
  
  // ⭐ Bouton poubelle sobre mode sombre
  deleteButtonBackground: '#7f1d1d',
  deleteButtonText: '#fecaca',
  deleteButtonBorder: '#991b1b',
  deleteButtonHover: '#991b1b',
  
  // ==================== STATUTS ====================
  statusPublic: '#064e3b',
  statusPublicText: '#6ee7b7',
  statusPrivate: '#451a03',
  statusPrivateText: '#fcd34d',
  statusDraft: '#4a5568',
  statusDraftText: '#f7fafc',
  
  // ==================== INPUTS ====================
  inputBackground: '#4a5568',
  inputText: '#f7fafc',
  
  // ==================== QUESTIONS ====================
  questionBackground: '#4a5568',
  questionBackgroundAlt: '#718096',
  
  // ==================== ESPACEMENT ====================
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    xxl: '2rem'
  },
  
  // ==================== RAYONS ====================
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px'
  }
};