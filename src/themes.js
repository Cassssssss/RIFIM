// src/themes.js
// =============================================================================
// REGISTRE DE STYLES — plusieurs univers visuels complets, commutables à chaud.
//
// Chaque style définit une variante "light" et "dark". La factory build()
// transforme une spécification compacte (couleurs de caractère + polices +
// arrondis + ombres) en l'objet thème complet attendu partout dans l'app.
//
// NOTE : on ne modifie AUCUNE logique. Seules les valeurs de style changent.
// Pour ajouter un style : copier un bloc ci-dessous et changer les valeurs.
// =============================================================================

const SPACING = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.5rem',
  xxl: '2rem',
};

// Couleurs d'état neutres communes (mode clair) — surchargées si besoin.
const STATE_LIGHT = {
  success: '#10b981', successLight: '#dcfce7',
  warning: '#f59e0b', warningLight: '#fef3c7',
  error: '#ef4444', errorLight: '#fef2f2', errorHover: '#dc2626',
  infoLight: '#e0e7ff',
  textInverse: '#ffffff', buttonText: '#ffffff',
};

const STATE_DARK = {
  success: '#34d399', successLight: '#064e3b',
  warning: '#fbbf24', warningLight: '#451a03',
  error: '#f87171', errorLight: '#7f1d1d', errorHover: '#ef4444',
  infoLight: '#2a4365',
  textInverse: '#1a202c', buttonText: '#ffffff',
};

// Transforme une spec compacte en thème complet (toutes les clés utilisées
// dans l'app sont produites ici, pour qu'aucun composant ne casse).
// Valeurs de mise en page par défaut (agencement « classique »).
const DEFAULT_LAYOUT = {
  containerMax: '100%',
  contentPad: '1.5rem',
  fontScale: '1',
  lineHeight: '1.6',
  headingSpacing: 'normal',
  headingTransform: 'none',
  headingWeight: '700',
};

function build(c) {
  const hover = c.hover || c.cardHover;
  const active = c.active || c.cardSecondary;
  const focus = c.focus || `${c.primary}22`;
  const tag = c.tag || { bg: c.cardSecondary, text: c.textSecondary, border: c.border };

  return {
    // ---- nouveaux jetons (polices / arrondis / ombres / agencement) ----
    fonts: c.fonts,
    radii: c.radii,
    borderRadius: c.radii, // compat : certains composants lisent theme.borderRadius
    shadows: c.shadows,
    layout: { ...DEFAULT_LAYOUT, ...(c.layout || {}) },
    spacing: SPACING,

    // ---- header ----
    headerBackground: c.header.bg,
    headerBackgroundSolid: c.header.solid,
    headerBlur: c.header.blur,
    headerBorder: c.header.border,
    headerText: c.header.text,
    headerShadow: c.header.shadow,

    // ---- couleurs principales ----
    primary: c.primary,
    primaryHover: c.primaryHover,
    secondary: c.secondary,
    secondaryHover: c.secondaryHover,
    accent: c.accent,

    // ---- backgrounds ----
    background: c.bg,
    backgroundSolid: c.bg,
    backgroundSecondary: c.bgSecondary,
    card: c.card,
    cardSecondary: c.cardSecondary,
    cardHover: c.cardHover,
    surface: c.card,

    // ---- textes ----
    text: c.text,
    textSecondary: c.textSecondary,
    textLight: c.textLight,
    textInverse: c.textInverse,

    // ---- bordures ----
    border: c.border,
    borderLight: c.borderLight,
    borderFocus: c.primary,

    // ---- états ----
    success: c.success, successLight: c.successLight,
    warning: c.warning, warningLight: c.warningLight,
    error: c.error, errorLight: c.errorLight,
    info: c.primary, infoLight: c.infoLight,

    // ---- interactions ----
    hover, active, focus,
    disabled: c.textLight,

    // ---- boutons ----
    buttonText: c.buttonText,
    buttonSecondary: c.cardSecondary,
    buttonSecondaryText: c.textSecondary,
    buttonDanger: c.error,
    buttonDangerHover: c.errorHover,

    // ---- ombres (jetons couleur, compat) ----
    shadow: c.shadows.color,
    shadowMedium: c.shadows.colorMedium,
    shadowStrong: c.shadows.colorStrong,

    // ---- tags ----
    tagBackground: tag.bg,
    tagText: tag.text,
    tagBorder: tag.border,

    // ---- boutons d'action ----
    actionButtonBackground: c.card,
    actionButtonText: c.textSecondary,
    actionButtonBorder: c.border,
    actionButtonHover: hover,

    // ---- bouton supprimer ----
    deleteButtonBackground: c.errorLight,
    deleteButtonText: c.error,
    deleteButtonBorder: c.errorLight,
    deleteButtonHover: c.errorLight,

    // ---- statuts ----
    statusPublic: c.successLight, statusPublicText: c.success,
    statusPrivate: c.warningLight, statusPrivateText: c.warning,
    statusDraft: c.cardSecondary, statusDraftText: c.textSecondary,

    // ---- inputs ----
    inputBackground: c.card,
    inputText: c.text,

    // ---- questions ----
    questionBackground: c.cardSecondary,
    questionBackgroundAlt: c.cardHover,

    // ---- triplets RGB pour Tailwind (--color-*) ----
    tw: c.tw,
  };
}

// =============================================================================
// DÉFINITION DES STYLES
// =============================================================================

const SYSTEM_FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif";

const STYLES = [
  // -------------------------------------------------------------------------
  // 0. CLASSIQUE (Apple) — l'existant, propre et sobre.
  // -------------------------------------------------------------------------
  {
    id: 'classic', name: 'Classique', emoji: '🍎',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: SYSTEM_FONT, body: SYSTEM_FONT },
      radii: { sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px', button: '8px', card: '12px' },
      shadows: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        cardHover: '0 6px 20px rgba(0,0,0,0.12)',
        button: '0 1px 3px rgba(0,0,0,0.10)',
        color: 'rgba(0,0,0,0.1)', colorMedium: 'rgba(0,0,0,0.15)', colorStrong: 'rgba(0,0,0,0.25)',
      },
      header: { bg: 'rgba(229,235,242,0.28)', solid: '#f1f5f9', blur: 'blur(20px)', border: 'rgba(0,0,0,0.08)', text: '#1f2937', shadow: '0 1px 3px rgba(0,0,0,0.05)' },
      bg: '#f8fafc', bgSecondary: '#f1f5f9', card: '#ffffff', cardSecondary: '#f9fafb', cardHover: '#f3f4f6',
      text: '#1f2937', textSecondary: '#6b7280', textLight: '#9ca3af',
      border: '#e5e7eb', borderLight: '#f3f4f6',
      primary: '#4f5b93', primaryHover: '#3d4873', secondary: '#10b981', secondaryHover: '#059669', accent: '#f59e0b',
      tw: { primary: '79 91 147', secondary: '16 185 129', accent: '245 158 11', background: '248 250 252', surface: '255 255 255', text: '31 41 55', border: '229 231 235' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: SYSTEM_FONT, body: SYSTEM_FONT },
      radii: { sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '9999px', button: '8px', card: '12px' },
      shadows: {
        card: '0 2px 8px rgba(0,0,0,0.3)',
        cardHover: '0 6px 20px rgba(0,0,0,0.45)',
        button: '0 1px 3px rgba(0,0,0,0.4)',
        color: 'rgba(0,0,0,0.3)', colorMedium: 'rgba(0,0,0,0.4)', colorStrong: 'rgba(0,0,0,0.6)',
      },
      header: { bg: 'rgba(45,55,72,0.85)', solid: '#2d3748', blur: 'blur(20px)', border: 'rgba(255,255,255,0.08)', text: '#f7fafc', shadow: '0 1px 3px rgba(0,0,0,0.3)' },
      bg: '#1a202c', bgSecondary: '#2d3748', card: '#2d3748', cardSecondary: '#4a5568', cardHover: '#718096',
      text: '#f7fafc', textSecondary: '#cbd5e0', textLight: '#a0aec0',
      border: '#4a5568', borderLight: '#2d3748',
      primary: '#4f5b93', primaryHover: '#3d4873', secondary: '#34d399', secondaryHover: '#10b981', accent: '#fbbf24',
      tw: { primary: '79 91 147', secondary: '52 211 153', accent: '251 191 36', background: '26 32 44', surface: '45 55 72', text: '247 250 252', border: '74 85 104' },
    },
  },

  // -------------------------------------------------------------------------
  // 1. NÉO-BRUTALISTE — bordures noires épaisses, ombres dures décalées,
  //    couleurs vives plates, police géométrique bold.
  // -------------------------------------------------------------------------
  {
    id: 'brutalist', name: 'Néo-brutaliste', emoji: '🟨',
    light: {
      ...STATE_LIGHT,
      errorLight: '#ffe0e0',
      fonts: { heading: "'Space Grotesk', sans-serif", body: "'Space Grotesk', sans-serif" },
      radii: { sm: '0', md: '0', lg: '2px', xl: '2px', full: '0', button: '2px', card: '2px' },
      shadows: {
        card: '5px 5px 0 #111111',
        cardHover: '8px 8px 0 #111111',
        button: '3px 3px 0 #111111',
        color: 'rgba(17,17,17,1)', colorMedium: 'rgba(17,17,17,1)', colorStrong: 'rgba(17,17,17,1)',
      },
      header: { bg: '#fffbe6', solid: '#fffbe6', blur: 'none', border: '#111111', text: '#111111', shadow: '0 4px 0 #111111' },
      bg: '#fffbe6', bgSecondary: '#fff3bf', card: '#ffffff', cardSecondary: '#fff3bf', cardHover: '#ffec99',
      text: '#111111', textSecondary: '#3d3d3d', textLight: '#6b6b6b',
      border: '#111111', borderLight: '#111111',
      primary: '#2b50ff', primaryHover: '#1a3ad9', secondary: '#00c2a8', secondaryHover: '#00a892', accent: '#ff2e93',
      tag: { bg: '#b4ff39', text: '#111111', border: '#111111' },
      tw: { primary: '43 80 255', secondary: '0 194 168', accent: '255 46 147', background: '255 251 230', surface: '255 255 255', text: '17 17 17', border: '17 17 17' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Space Grotesk', sans-serif", body: "'Space Grotesk', sans-serif" },
      radii: { sm: '0', md: '0', lg: '2px', xl: '2px', full: '0', button: '2px', card: '2px' },
      shadows: {
        card: '5px 5px 0 #f5f5f0',
        cardHover: '8px 8px 0 #f5f5f0',
        button: '3px 3px 0 #f5f5f0',
        color: 'rgba(245,245,240,1)', colorMedium: 'rgba(245,245,240,1)', colorStrong: 'rgba(245,245,240,1)',
      },
      header: { bg: '#121212', solid: '#121212', blur: 'none', border: '#f5f5f0', text: '#f5f5f0', shadow: '0 4px 0 #f5f5f0' },
      bg: '#121212', bgSecondary: '#1c1b18', card: '#1c1b18', cardSecondary: '#26251f', cardHover: '#333228',
      text: '#f5f5f0', textSecondary: '#cfcfc6', textLight: '#9a9a90',
      border: '#f5f5f0', borderLight: '#f5f5f0',
      primary: '#5b7cff', primaryHover: '#7a93ff', secondary: '#2ee6c8', secondaryHover: '#4ff0d6', accent: '#ff4fa6',
      tag: { bg: '#b4ff39', text: '#111111', border: '#f5f5f0' },
      tw: { primary: '91 124 255', secondary: '46 230 200', accent: '255 79 166', background: '18 18 18', surface: '28 27 24', text: '245 245 240', border: '245 245 240' },
    },
  },

  // -------------------------------------------------------------------------
  // 2. CLAY / DOUX — gros arrondis, ombres "gonflées" pastel, ambiance
  //    premium et ludique. Boutons en pilule.
  // -------------------------------------------------------------------------
  {
    id: 'clay', name: 'Clay doux', emoji: '🫧',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Baloo 2', system-ui, sans-serif", body: "'Nunito', sans-serif" },
      radii: { sm: '12px', md: '18px', lg: '28px', xl: '36px', full: '9999px', button: '9999px', card: '32px' },
      shadows: {
        card: '0 12px 28px rgba(139,124,246,0.16), 0 4px 10px rgba(0,0,0,0.04)',
        cardHover: '0 18px 40px rgba(139,124,246,0.22), 0 6px 14px rgba(0,0,0,0.05)',
        button: '0 6px 14px rgba(139,124,246,0.25)',
        color: 'rgba(80,60,160,0.15)', colorMedium: 'rgba(80,60,160,0.22)', colorStrong: 'rgba(80,60,160,0.32)',
      },
      header: { bg: 'rgba(243,240,255,0.7)', solid: '#f3f0ff', blur: 'blur(18px)', border: '#e7e1ff', text: '#4a4458', shadow: '0 4px 20px rgba(139,124,246,0.12)' },
      bg: '#f3f0ff', bgSecondary: '#ece7ff', card: '#fbfaff', cardSecondary: '#f1edff', cardHover: '#e9e3ff',
      text: '#4a4458', textSecondary: '#6f6890', textLight: '#9b94b8',
      border: '#e7e1ff', borderLight: '#f1edff',
      primary: '#8b7cf6', primaryHover: '#735ff0', secondary: '#4fd1c5', secondaryHover: '#38b2ac', accent: '#ff9e7d',
      tw: { primary: '139 124 246', secondary: '79 209 197', accent: '255 158 125', background: '243 240 255', surface: '251 250 255', text: '74 68 88', border: '231 225 255' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Baloo 2', system-ui, sans-serif", body: "'Nunito', sans-serif" },
      radii: { sm: '12px', md: '18px', lg: '28px', xl: '36px', full: '9999px', button: '9999px', card: '32px' },
      shadows: {
        card: '0 12px 28px rgba(0,0,0,0.4), 0 4px 10px rgba(0,0,0,0.3)',
        cardHover: '0 18px 44px rgba(0,0,0,0.5)',
        button: '0 6px 16px rgba(139,124,246,0.4)',
        color: 'rgba(0,0,0,0.4)', colorMedium: 'rgba(0,0,0,0.5)', colorStrong: 'rgba(0,0,0,0.6)',
      },
      header: { bg: 'rgba(30,27,46,0.8)', solid: '#1e1b2e', blur: 'blur(18px)', border: '#3d3760', text: '#ece9ff', shadow: '0 4px 20px rgba(0,0,0,0.4)' },
      bg: '#1e1b2e', bgSecondary: '#272340', card: '#2a2640', cardSecondary: '#352f52', cardHover: '#413a63',
      text: '#ece9ff', textSecondary: '#bdb6e0', textLight: '#8e87b3',
      border: '#3d3760', borderLight: '#2a2640',
      primary: '#a594ff', primaryHover: '#bcaeff', secondary: '#5ee0d2', secondaryHover: '#7eeadf', accent: '#ffb59a',
      tw: { primary: '165 148 255', secondary: '94 224 210', accent: '255 181 154', background: '30 27 46', surface: '42 38 64', text: '236 233 255', border: '61 55 96' },
    },
  },

  // -------------------------------------------------------------------------
  // 3. ÉDITORIAL — police à empattements (serif), tons papier chauds,
  //    élégance "magazine", ombres discrètes.
  // -------------------------------------------------------------------------
  {
    id: 'editorial', name: 'Éditorial', emoji: '📰',
    light: {
      ...STATE_LIGHT,
      successLight: '#dcefe2', warningLight: '#f5ead0', errorLight: '#f6e0db',
      fonts: { heading: "'Fraunces', Georgia, serif", body: "'Lora', Georgia, serif" },
      radii: { sm: '2px', md: '3px', lg: '4px', xl: '6px', full: '9999px', button: '3px', card: '4px' },
      shadows: {
        card: '0 1px 2px rgba(43,38,32,0.08)',
        cardHover: '0 4px 14px rgba(43,38,32,0.12)',
        button: '0 1px 2px rgba(43,38,32,0.10)',
        color: 'rgba(43,38,32,0.1)', colorMedium: 'rgba(43,38,32,0.16)', colorStrong: 'rgba(43,38,32,0.26)',
      },
      header: { bg: 'rgba(247,243,233,0.85)', solid: '#f7f3e9', blur: 'blur(8px)', border: '#e0d8c4', text: '#2b2620', shadow: '0 1px 0 #e0d8c4' },
      bg: '#f7f3e9', bgSecondary: '#f0e9d8', card: '#fffdf7', cardSecondary: '#f4eede', cardHover: '#ece3cd',
      text: '#2b2620', textSecondary: '#6b6356', textLight: '#9a8f7d',
      border: '#e0d8c4', borderLight: '#efe8d6',
      primary: '#9b2d20', primaryHover: '#7e2419', secondary: '#2d6a4f', secondaryHover: '#235640', accent: '#c9a227',
      tag: { bg: '#f0e9d8', text: '#6b6356', border: '#d8cdb2' },
      tw: { primary: '155 45 32', secondary: '45 106 79', accent: '201 162 39', background: '247 243 233', surface: '255 253 247', text: '43 38 32', border: '224 216 196' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Fraunces', Georgia, serif", body: "'Lora', Georgia, serif" },
      radii: { sm: '2px', md: '3px', lg: '4px', xl: '6px', full: '9999px', button: '3px', card: '4px' },
      shadows: {
        card: '0 1px 2px rgba(0,0,0,0.4)',
        cardHover: '0 4px 16px rgba(0,0,0,0.5)',
        button: '0 1px 2px rgba(0,0,0,0.4)',
        color: 'rgba(0,0,0,0.4)', colorMedium: 'rgba(0,0,0,0.5)', colorStrong: 'rgba(0,0,0,0.6)',
      },
      header: { bg: 'rgba(28,26,21,0.9)', solid: '#1c1a15', blur: 'blur(8px)', border: '#3a352a', text: '#f0eadd', shadow: '0 1px 0 #3a352a' },
      bg: '#1c1a15', bgSecondary: '#26231c', card: '#26231c', cardSecondary: '#322e24', cardHover: '#3e3930',
      text: '#f0eadd', textSecondary: '#c4bcab', textLight: '#928a78',
      border: '#3a352a', borderLight: '#26231c',
      primary: '#d4715f', primaryHover: '#df8978', secondary: '#6abf99', secondaryHover: '#85cdad', accent: '#e0c050',
      tag: { bg: '#322e24', text: '#c4bcab', border: '#4a4435' },
      tw: { primary: '212 113 95', secondary: '106 191 153', accent: '224 192 80', background: '28 26 21', surface: '38 35 28', text: '240 234 221', border: '58 53 42' },
    },
  },

  // -------------------------------------------------------------------------
  // 4. Y2K VIBRANT — néons, dégradés francs, fun rétro-2000, glow coloré.
  // -------------------------------------------------------------------------
  {
    id: 'y2k', name: 'Y2K vibrant', emoji: '💿',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Outfit', sans-serif", body: "'Outfit', sans-serif" },
      radii: { sm: '10px', md: '16px', lg: '24px', xl: '32px', full: '9999px', button: '9999px', card: '24px' },
      shadows: {
        card: '0 8px 28px rgba(255,62,201,0.22), 0 0 0 1px rgba(0,179,255,0.10)',
        cardHover: '0 12px 36px rgba(0,179,255,0.30)',
        button: '0 6px 18px rgba(255,62,201,0.35)',
        color: 'rgba(124,58,237,0.2)', colorMedium: 'rgba(124,58,237,0.3)', colorStrong: 'rgba(124,58,237,0.45)',
      },
      header: { bg: 'rgba(240,244,255,0.6)', solid: '#f0f4ff', blur: 'blur(16px)', border: '#d9c5ff', text: '#1b1340', shadow: '0 4px 24px rgba(255,62,201,0.18)' },
      bg: '#f0f4ff', bgSecondary: '#e6ecff', card: '#ffffff', cardSecondary: '#f3edff', cardHover: '#ebe1ff',
      text: '#1b1340', textSecondary: '#5a4b8a', textLight: '#9385c0',
      border: '#d9c5ff', borderLight: '#ebe1ff',
      primary: '#00b3ff', primaryHover: '#0095e0', secondary: '#ff3ec9', secondaryHover: '#e022ad', accent: '#aaff00',
      tag: { bg: '#ff3ec9', text: '#ffffff', border: '#ff3ec9' },
      tw: { primary: '0 179 255', secondary: '255 62 201', accent: '170 255 0', background: '240 244 255', surface: '255 255 255', text: '27 19 64', border: '217 197 255' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Outfit', sans-serif", body: "'Outfit', sans-serif" },
      radii: { sm: '10px', md: '16px', lg: '24px', xl: '32px', full: '9999px', button: '9999px', card: '24px' },
      shadows: {
        card: '0 8px 28px rgba(255,62,201,0.28), 0 0 0 1px rgba(0,179,255,0.18)',
        cardHover: '0 12px 40px rgba(0,179,255,0.40)',
        button: '0 6px 20px rgba(255,62,201,0.45)',
        color: 'rgba(0,179,255,0.25)', colorMedium: 'rgba(255,62,201,0.35)', colorStrong: 'rgba(255,62,201,0.5)',
      },
      header: { bg: 'rgba(13,10,31,0.8)', solid: '#0d0a1f', blur: 'blur(16px)', border: '#3a2d66', text: '#f2ecff', shadow: '0 4px 24px rgba(0,179,255,0.20)' },
      bg: '#0d0a1f', bgSecondary: '#150f30', card: '#181233', cardSecondary: '#221944', cardHover: '#2e2255',
      text: '#f2ecff', textSecondary: '#bda9e8', textLight: '#8b78bf',
      border: '#3a2d66', borderLight: '#221944',
      primary: '#2ad0ff', primaryHover: '#5cdcff', secondary: '#ff5cd6', secondaryHover: '#ff7ee0', accent: '#c4ff3d',
      tag: { bg: '#ff5cd6', text: '#15082b', border: '#ff5cd6' },
      tw: { primary: '42 208 255', secondary: '255 92 214', accent: '196 255 61', background: '13 10 31', surface: '24 18 51', text: '242 236 255', border: '58 45 102' },
    },
  },

  // -------------------------------------------------------------------------
  // 5. SWISS MINIMAL — grotesk serré, monochrome + un rouge franc, arrondis
  //    minimes, ombres en filet. Rigueur typographique.
  // -------------------------------------------------------------------------
  {
    id: 'swiss', name: 'Swiss minimal', emoji: '🔺',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
      radii: { sm: '0', md: '2px', lg: '2px', xl: '4px', full: '9999px', button: '2px', card: '2px' },
      shadows: {
        card: '0 1px 0 rgba(0,0,0,0.10)',
        cardHover: '0 2px 0 rgba(0,0,0,0.18)',
        button: 'none',
        color: 'rgba(0,0,0,0.08)', colorMedium: 'rgba(0,0,0,0.14)', colorStrong: 'rgba(0,0,0,0.22)',
      },
      header: { bg: 'rgba(255,255,255,0.85)', solid: '#ffffff', blur: 'blur(6px)', border: '#111111', text: '#111111', shadow: 'none' },
      bg: '#ffffff', bgSecondary: '#f4f4f4', card: '#ffffff', cardSecondary: '#f4f4f4', cardHover: '#ececec',
      text: '#111111', textSecondary: '#555555', textLight: '#999999',
      border: '#111111', borderLight: '#e0e0e0',
      primary: '#e30613', primaryHover: '#b80510', secondary: '#111111', secondaryHover: '#333333', accent: '#e30613',
      tag: { bg: '#111111', text: '#ffffff', border: '#111111' },
      tw: { primary: '227 6 19', secondary: '17 17 17', accent: '227 6 19', background: '255 255 255', surface: '255 255 255', text: '17 17 17', border: '17 17 17' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Inter', sans-serif", body: "'Inter', sans-serif" },
      radii: { sm: '0', md: '2px', lg: '2px', xl: '4px', full: '9999px', button: '2px', card: '2px' },
      shadows: {
        card: '0 1px 0 rgba(255,255,255,0.14)',
        cardHover: '0 2px 0 rgba(255,255,255,0.22)',
        button: 'none',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(10,10,10,0.9)', solid: '#0a0a0a', blur: 'blur(6px)', border: '#fafafa', text: '#fafafa', shadow: 'none' },
      bg: '#0a0a0a', bgSecondary: '#161616', card: '#161616', cardSecondary: '#1f1f1f', cardHover: '#2a2a2a',
      text: '#fafafa', textSecondary: '#b0b0b0', textLight: '#777777',
      border: '#fafafa', borderLight: '#2a2a2a',
      primary: '#ff3b30', primaryHover: '#ff5c52', secondary: '#fafafa', secondaryHover: '#d4d4d4', accent: '#ff3b30',
      tag: { bg: '#fafafa', text: '#0a0a0a', border: '#fafafa' },
      tw: { primary: '255 59 48', secondary: '250 250 250', accent: '255 59 48', background: '10 10 10', surface: '22 22 22', text: '250 250 250', border: '250 250 250' },
    },
  },

  // -------------------------------------------------------------------------
  // 6. CYBERPUNK NÉON — néons cyan/magenta sur fond sombre, glow, police
  //    Orbitron, pleine largeur dense, titres MAJUSCULES espacés.
  // -------------------------------------------------------------------------
  {
    id: 'cyberpunk', name: 'Cyberpunk néon', emoji: '🌃',
    light: {
      ...STATE_DARK, buttonText: '#0c0718',
      fonts: { heading: "'Orbitron', sans-serif", body: "'Space Grotesk', sans-serif" },
      radii: { sm: '2px', md: '4px', lg: '6px', xl: '8px', full: '9999px', button: '4px', card: '6px' },
      shadows: {
        card: '0 0 0 1px rgba(0,240,255,0.25), 0 8px 24px rgba(255,46,151,0.20)',
        cardHover: '0 0 0 1px rgba(0,240,255,0.55), 0 10px 32px rgba(0,240,255,0.30)',
        button: '0 0 14px rgba(0,240,255,0.55)',
        color: 'rgba(0,240,255,0.3)', colorMedium: 'rgba(255,46,151,0.4)', colorStrong: 'rgba(255,46,151,0.6)',
      },
      header: { bg: 'rgba(22,14,43,0.8)', solid: '#160e2b', blur: 'blur(14px)', border: '#ff2e97', text: '#eafcff', shadow: '0 0 20px rgba(255,46,151,0.3)' },
      bg: '#160e2b', bgSecondary: '#1e1340', card: '#201541', cardSecondary: '#2c1d57', cardHover: '#382565',
      text: '#eafcff', textSecondary: '#b08cff', textLight: '#7a5fb0',
      border: '#ff2e97', borderLight: '#3a2566',
      primary: '#00f0ff', primaryHover: '#33f4ff', secondary: '#ff2e97', secondaryHover: '#ff5cae', accent: '#b4ff39',
      tag: { bg: '#2c1d57', text: '#00f0ff', border: '#00f0ff' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.5', headingSpacing: '0.18em', headingTransform: 'uppercase', headingWeight: '700' },
      tw: { primary: '0 240 255', secondary: '255 46 151', accent: '180 255 57', background: '22 14 43', surface: '32 21 65', text: '234 252 255', border: '255 46 151' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#060312',
      fonts: { heading: "'Orbitron', sans-serif", body: "'Space Grotesk', sans-serif" },
      radii: { sm: '2px', md: '4px', lg: '6px', xl: '8px', full: '9999px', button: '4px', card: '6px' },
      shadows: {
        card: '0 0 0 1px rgba(0,240,255,0.3), 0 8px 24px rgba(255,46,151,0.28)',
        cardHover: '0 0 0 1px rgba(0,240,255,0.7), 0 10px 36px rgba(0,240,255,0.40)',
        button: '0 0 16px rgba(0,240,255,0.7)',
        color: 'rgba(0,240,255,0.35)', colorMedium: 'rgba(255,46,151,0.45)', colorStrong: 'rgba(255,46,151,0.65)',
      },
      header: { bg: 'rgba(10,6,22,0.85)', solid: '#0a0616', blur: 'blur(14px)', border: '#ff2e97', text: '#eafcff', shadow: '0 0 22px rgba(255,46,151,0.4)' },
      bg: '#0a0616', bgSecondary: '#120a26', card: '#140c2c', cardSecondary: '#1f1444', cardHover: '#2a1c5a',
      text: '#eafcff', textSecondary: '#c0a0ff', textLight: '#7e63b8',
      border: '#ff2e97', borderLight: '#2a1c5a',
      primary: '#00f0ff', primaryHover: '#5cf6ff', secondary: '#ff2e97', secondaryHover: '#ff5cae', accent: '#c4ff3d',
      tag: { bg: '#1f1444', text: '#00f0ff', border: '#00f0ff' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.5', headingSpacing: '0.18em', headingTransform: 'uppercase', headingWeight: '700' },
      tw: { primary: '0 240 255', secondary: '255 46 151', accent: '196 255 61', background: '10 6 22', surface: '20 12 44', text: '234 252 255', border: '255 46 151' },
    },
  },

  // -------------------------------------------------------------------------
  // 7. RÉTRO TERMINAL — phosphore vert sur noir, monospace, zéro arrondi,
  //    zéro ombre, titres MAJ, contenu compact centré.
  // -------------------------------------------------------------------------
  {
    id: 'terminal', name: 'Rétro terminal', emoji: '🖥️',
    light: {
      ...STATE_DARK, buttonText: '#04160c',
      fonts: { heading: "'JetBrains Mono', monospace", body: "'JetBrains Mono', monospace" },
      radii: { sm: '0', md: '0', lg: '0', xl: '0', full: '0', button: '0', card: '0' },
      shadows: {
        card: 'none', cardHover: '0 0 0 1px #39ff7a', button: 'none',
        color: 'rgba(57,255,122,0.2)', colorMedium: 'rgba(57,255,122,0.3)', colorStrong: 'rgba(57,255,122,0.45)',
      },
      header: { bg: '#04160c', solid: '#04160c', blur: 'none', border: '#1f7a3d', text: '#39ff7a', shadow: 'none' },
      bg: '#04160c', bgSecondary: '#06200f', card: '#06200f', cardSecondary: '#0a2c16', cardHover: '#0e381d',
      text: '#39ff7a', textSecondary: '#27c75c', textLight: '#1c8f43',
      border: '#1f7a3d', borderLight: '#0e381d',
      primary: '#39ff7a', primaryHover: '#5cff95', secondary: '#ffb000', secondaryHover: '#ffc23d', accent: '#ffb000',
      tag: { bg: '#0a2c16', text: '#39ff7a', border: '#1f7a3d' },
      layout: { containerMax: '100%', contentPad: '1.25rem', fontScale: '0.95', lineHeight: '1.5', headingSpacing: '0.05em', headingTransform: 'uppercase', headingWeight: '700' },
      tw: { primary: '57 255 122', secondary: '255 176 0', accent: '255 176 0', background: '4 22 12', surface: '6 32 15', text: '57 255 122', border: '31 122 61' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#020a06',
      fonts: { heading: "'JetBrains Mono', monospace", body: "'JetBrains Mono', monospace" },
      radii: { sm: '0', md: '0', lg: '0', xl: '0', full: '0', button: '0', card: '0' },
      shadows: {
        card: 'none', cardHover: '0 0 0 1px #ffb000', button: 'none',
        color: 'rgba(255,176,0,0.2)', colorMedium: 'rgba(255,176,0,0.3)', colorStrong: 'rgba(255,176,0,0.45)',
      },
      header: { bg: '#0a0700', solid: '#0a0700', blur: 'none', border: '#8a5e00', text: '#ffb000', shadow: 'none' },
      bg: '#0a0700', bgSecondary: '#140d00', card: '#140d00', cardSecondary: '#1f1500', cardHover: '#2a1d00',
      text: '#ffb000', textSecondary: '#cc8c00', textLight: '#8a5e00',
      border: '#8a5e00', borderLight: '#2a1d00',
      primary: '#ffb000', primaryHover: '#ffc23d', secondary: '#39ff7a', secondaryHover: '#5cff95', accent: '#39ff7a',
      tag: { bg: '#1f1500', text: '#ffb000', border: '#8a5e00' },
      layout: { containerMax: '100%', contentPad: '1.25rem', fontScale: '0.95', lineHeight: '1.5', headingSpacing: '0.05em', headingTransform: 'uppercase', headingWeight: '700' },
      tw: { primary: '255 176 0', secondary: '57 255 122', accent: '57 255 122', background: '10 7 0', surface: '20 13 0', text: '255 176 0', border: '138 94 0' },
    },
  },

  // -------------------------------------------------------------------------
  // 8. PASTEL KAWAII — rose/lavande tout doux, police Quicksand, énormes
  //    arrondis, ombres roses gonflées, contenu aéré et centré.
  // -------------------------------------------------------------------------
  {
    id: 'kawaii', name: 'Pastel kawaii', emoji: '🌸',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Quicksand', sans-serif", body: "'Nunito', sans-serif" },
      radii: { sm: '14px', md: '22px', lg: '32px', xl: '44px', full: '9999px', button: '9999px', card: '36px' },
      shadows: {
        card: '0 12px 30px rgba(255,126,182,0.25), 0 4px 10px rgba(255,126,182,0.12)',
        cardHover: '0 18px 42px rgba(255,126,182,0.30)',
        button: '0 8px 18px rgba(255,126,182,0.35)',
        color: 'rgba(255,126,182,0.2)', colorMedium: 'rgba(255,126,182,0.3)', colorStrong: 'rgba(255,126,182,0.45)',
      },
      header: { bg: 'rgba(255,240,246,0.75)', solid: '#fff0f6', blur: 'blur(16px)', border: '#ffc2dd', text: '#7a4a63', shadow: '0 6px 24px rgba(255,126,182,0.18)' },
      bg: '#fff0f6', bgSecondary: '#ffe3ef', card: '#ffffff', cardSecondary: '#fff0f6', cardHover: '#ffe3ef',
      text: '#7a4a63', textSecondary: '#b07a93', textLight: '#d4a8bd',
      border: '#ffc2dd', borderLight: '#ffe0ee',
      primary: '#ff7eb6', primaryHover: '#ff5ca3', secondary: '#7ec8ff', secondaryHover: '#5cb6ff', accent: '#ffd166',
      tag: { bg: '#ffe3ef', text: '#c75c92', border: '#ffc2dd' },
      layout: { containerMax: '100%', contentPad: '1.5rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '700' },
      tw: { primary: '255 126 182', secondary: '126 200 255', accent: '255 209 102', background: '255 240 246', surface: '255 255 255', text: '122 74 99', border: '255 194 221' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Quicksand', sans-serif", body: "'Nunito', sans-serif" },
      radii: { sm: '14px', md: '22px', lg: '32px', xl: '44px', full: '9999px', button: '9999px', card: '36px' },
      shadows: {
        card: '0 12px 30px rgba(0,0,0,0.4)',
        cardHover: '0 18px 44px rgba(255,126,182,0.30)',
        button: '0 8px 20px rgba(255,126,182,0.4)',
        color: 'rgba(0,0,0,0.4)', colorMedium: 'rgba(0,0,0,0.5)', colorStrong: 'rgba(0,0,0,0.6)',
      },
      header: { bg: 'rgba(42,24,34,0.82)', solid: '#2a1822', blur: 'blur(16px)', border: '#5c3447', text: '#ffe0ee', shadow: '0 6px 24px rgba(0,0,0,0.4)' },
      bg: '#2a1822', bgSecondary: '#34202c', card: '#34202c', cardSecondary: '#412836', cardHover: '#4d3040',
      text: '#ffe0ee', textSecondary: '#e0a8c4', textLight: '#a87890',
      border: '#5c3447', borderLight: '#412836',
      primary: '#ff8fc2', primaryHover: '#ffaad1', secondary: '#8fd0ff', secondaryHover: '#aadcff', accent: '#ffd97a',
      tag: { bg: '#412836', text: '#ff8fc2', border: '#5c3447' },
      layout: { containerMax: '100%', contentPad: '1.5rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '700' },
      tw: { primary: '255 143 194', secondary: '143 208 255', accent: '255 217 122', background: '42 24 34', surface: '52 32 44', text: '255 224 238', border: '92 52 71' },
    },
  },

  // -------------------------------------------------------------------------
  // 9. LUXE DORÉ — noir/or/crème, serif Cormorant, filets dorés, arrondis
  //    minimes, beaucoup d'air, titres en petites capitales espacées.
  // -------------------------------------------------------------------------
  {
    id: 'luxe', name: 'Luxe doré', emoji: '🥂',
    light: {
      ...STATE_LIGHT, buttonText: '#1a1712',
      successLight: '#e3ecdf', warningLight: '#f3e9cf', errorLight: '#f1ddd8',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '0', md: '2px', lg: '3px', xl: '4px', full: '9999px', button: '0', card: '2px' },
      shadows: {
        card: '0 1px 3px rgba(26,23,18,0.10)',
        cardHover: '0 6px 20px rgba(191,155,48,0.18)',
        button: '0 1px 2px rgba(26,23,18,0.12)',
        color: 'rgba(26,23,18,0.1)', colorMedium: 'rgba(26,23,18,0.16)', colorStrong: 'rgba(26,23,18,0.26)',
      },
      header: { bg: 'rgba(250,246,236,0.88)', solid: '#faf6ec', blur: 'blur(8px)', border: '#caa84f', text: '#1a1712', shadow: '0 1px 0 #caa84f' },
      bg: '#faf6ec', bgSecondary: '#f1e9d6', card: '#fffdf6', cardSecondary: '#f5eddd', cardHover: '#ece0c6',
      text: '#1a1712', textSecondary: '#6b5f48', textLight: '#9a8b6c',
      border: '#caa84f', borderLight: '#e6d9b8',
      primary: '#bf9b30', primaryHover: '#a3842a', secondary: '#1a1712', secondaryHover: '#33302a', accent: '#bf9b30',
      tag: { bg: '#f1e9d6', text: '#7e6b2f', border: '#caa84f' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.1', lineHeight: '1.7', headingSpacing: '0.12em', headingTransform: 'uppercase', headingWeight: '600' },
      tw: { primary: '191 155 48', secondary: '26 23 18', accent: '191 155 48', background: '250 246 236', surface: '255 253 246', text: '26 23 18', border: '202 168 79' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#0e0c08',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '0', md: '2px', lg: '3px', xl: '4px', full: '9999px', button: '0', card: '2px' },
      shadows: {
        card: '0 1px 3px rgba(0,0,0,0.5)',
        cardHover: '0 6px 22px rgba(191,155,48,0.28)',
        button: '0 1px 2px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(14,12,8,0.9)', solid: '#0e0c08', blur: 'blur(8px)', border: '#bf9b30', text: '#f3ead0', shadow: '0 1px 0 #bf9b30' },
      bg: '#0e0c08', bgSecondary: '#161208', card: '#171308', cardSecondary: '#1f190d', cardHover: '#2a2212',
      text: '#f3ead0', textSecondary: '#c9b888', textLight: '#90825c',
      border: '#bf9b30', borderLight: '#2a2212',
      primary: '#d4b34a', primaryHover: '#e0c668', secondary: '#f3ead0', secondaryHover: '#fff8e6', accent: '#d4b34a',
      tag: { bg: '#1f190d', text: '#d4b34a', border: '#bf9b30' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.1', lineHeight: '1.7', headingSpacing: '0.12em', headingTransform: 'uppercase', headingWeight: '600' },
      tw: { primary: '212 179 74', secondary: '243 234 208', accent: '212 179 74', background: '14 12 8', surface: '23 19 8', text: '243 234 208', border: '191 155 48' },
    },
  },

  // -------------------------------------------------------------------------
  // 10. CROQUIS / CAHIER — papier, titres manuscrits (Caveat), bordures
  //     pointillées, encre + stylo rouge + surligneur. Décontracté.
  // -------------------------------------------------------------------------
  {
    id: 'sketch', name: 'Croquis cahier', emoji: '✏️',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Caveat', cursive", body: "'Inter', sans-serif" },
      radii: { sm: '6px', md: '10px', lg: '14px', xl: '18px', full: '9999px', button: '10px', card: '12px' },
      shadows: {
        card: '2px 3px 0 rgba(43,43,43,0.12)',
        cardHover: '4px 5px 0 rgba(43,43,43,0.16)',
        button: '2px 2px 0 rgba(43,43,43,0.18)',
        color: 'rgba(43,43,43,0.12)', colorMedium: 'rgba(43,43,43,0.18)', colorStrong: 'rgba(43,43,43,0.28)',
      },
      header: { bg: 'rgba(253,253,247,0.9)', solid: '#fdfdf7', blur: 'blur(6px)', border: '#2b2b2b', text: '#2b2b2b', shadow: '0 2px 0 rgba(43,43,43,0.1)' },
      bg: '#fdfdf7', bgSecondary: '#f4f4ea', card: '#ffffff', cardSecondary: '#f7f7ee', cardHover: '#eeeee2',
      text: '#2b2b2b', textSecondary: '#5c5c5c', textLight: '#8a8a8a',
      border: '#2b2b2b', borderLight: '#cfcfc4',
      primary: '#3457d5', primaryHover: '#2643b0', secondary: '#e0392b', secondaryHover: '#c22d22', accent: '#f2b705',
      tag: { bg: '#fff7d6', text: '#7a5f00', border: '#2b2b2b' },
      layout: { containerMax: '100%', contentPad: '1.5rem', fontScale: '1.05', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '700' },
      tw: { primary: '52 87 213', secondary: '224 57 43', accent: '242 183 5', background: '253 253 247', surface: '255 255 255', text: '43 43 43', border: '43 43 43' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Caveat', cursive", body: "'Inter', sans-serif" },
      radii: { sm: '6px', md: '10px', lg: '14px', xl: '18px', full: '9999px', button: '10px', card: '12px' },
      shadows: {
        card: '2px 3px 0 rgba(0,0,0,0.4)',
        cardHover: '4px 5px 0 rgba(0,0,0,0.5)',
        button: '2px 2px 0 rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.4)', colorMedium: 'rgba(0,0,0,0.5)', colorStrong: 'rgba(0,0,0,0.6)',
      },
      header: { bg: 'rgba(34,48,43,0.9)', solid: '#22302b', blur: 'blur(6px)', border: '#f2f2e8', text: '#f2f2e8', shadow: '0 2px 0 rgba(0,0,0,0.3)' },
      bg: '#22302b', bgSecondary: '#2b3a34', card: '#2b3a34', cardSecondary: '#33453e', cardHover: '#3d5149',
      text: '#f2f2e8', textSecondary: '#c9d2cb', textLight: '#94a09a',
      border: '#f2f2e8', borderLight: '#3d5149',
      primary: '#7fb2ff', primaryHover: '#a3c8ff', secondary: '#ff8a7a', secondaryHover: '#ffa89b', accent: '#ffe14d',
      tag: { bg: '#33453e', text: '#ffe14d', border: '#f2f2e8' },
      layout: { containerMax: '100%', contentPad: '1.5rem', fontScale: '1.05', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '700' },
      tw: { primary: '127 178 255', secondary: '255 138 122', accent: '255 225 77', background: '34 48 43', surface: '43 58 52', text: '242 242 232', border: '242 242 232' },
    },
  },

  // -------------------------------------------------------------------------
  // 11. BAUHAUS — couleurs primaires rouge/bleu/jaune, police Anton massive,
  //     ombres dures, bandeau header coloré, titres MAJ, pleine largeur.
  // -------------------------------------------------------------------------
  {
    id: 'bauhaus', name: 'Bauhaus', emoji: '🔴',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Anton', sans-serif", body: "'Space Grotesk', sans-serif" },
      radii: { sm: '0', md: '4px', lg: '8px', xl: '12px', full: '9999px', button: '0', card: '4px' },
      shadows: {
        card: '6px 6px 0 #111111',
        cardHover: '9px 9px 0 #e63946',
        button: '4px 4px 0 #111111',
        color: 'rgba(17,17,17,1)', colorMedium: 'rgba(17,17,17,1)', colorStrong: 'rgba(17,17,17,1)',
      },
      header: { bg: '#f4d35e', solid: '#f4d35e', blur: 'none', border: '#111111', text: '#111111', shadow: '0 4px 0 #111111' },
      bg: '#f4f1ea', bgSecondary: '#eae6db', card: '#ffffff', cardSecondary: '#f4f1ea', cardHover: '#eae6db',
      text: '#111111', textSecondary: '#444444', textLight: '#777777',
      border: '#111111', borderLight: '#d8d4c8',
      primary: '#e63946', primaryHover: '#c52d39', secondary: '#1d3557', secondaryHover: '#16293f', accent: '#f4d35e',
      tag: { bg: '#1d3557', text: '#ffffff', border: '#111111' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.4', headingSpacing: '0.02em', headingTransform: 'uppercase', headingWeight: '400' },
      tw: { primary: '230 57 70', secondary: '29 53 87', accent: '244 211 94', background: '244 241 234', surface: '255 255 255', text: '17 17 17', border: '17 17 17' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Anton', sans-serif", body: "'Space Grotesk', sans-serif" },
      radii: { sm: '0', md: '4px', lg: '8px', xl: '12px', full: '9999px', button: '0', card: '4px' },
      shadows: {
        card: '6px 6px 0 #f4f1ea',
        cardHover: '9px 9px 0 #e63946',
        button: '4px 4px 0 #f4f1ea',
        color: 'rgba(244,241,234,1)', colorMedium: 'rgba(244,241,234,1)', colorStrong: 'rgba(244,241,234,1)',
      },
      header: { bg: '#e63946', solid: '#e63946', blur: 'none', border: '#f4f1ea', text: '#ffffff', shadow: '0 4px 0 #f4f1ea' },
      bg: '#141414', bgSecondary: '#1c1c1c', card: '#1c1c1c', cardSecondary: '#262626', cardHover: '#333333',
      text: '#f4f1ea', textSecondary: '#c4c0b4', textLight: '#8a867a',
      border: '#f4f1ea', borderLight: '#333333',
      primary: '#ff5864', primaryHover: '#ff7a84', secondary: '#5a86c4', secondaryHover: '#7ba0d6', accent: '#f4d35e',
      tag: { bg: '#5a86c4', text: '#0a0a0a', border: '#f4f1ea' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.4', headingSpacing: '0.02em', headingTransform: 'uppercase', headingWeight: '400' },
      tw: { primary: '255 88 100', secondary: '90 134 196', accent: '244 211 94', background: '20 20 20', surface: '28 28 28', text: '244 241 234', border: '244 241 234' },
    },
  },

  // -------------------------------------------------------------------------
  // 12. GLASSMORPHISM — cartes en verre dépoli translucide, flou, dégradés
  //     doux, arrondis généreux. (Flou ajouté via override CSS data-style.)
  // -------------------------------------------------------------------------
  {
    id: 'glass', name: 'Verre dépoli', emoji: '🪟',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Poppins', sans-serif", body: "'Poppins', sans-serif" },
      radii: { sm: '10px', md: '16px', lg: '20px', xl: '28px', full: '9999px', button: '14px', card: '22px' },
      shadows: {
        card: '0 8px 32px rgba(31,38,64,0.12)', cardHover: '0 12px 40px rgba(31,38,64,0.18)', button: '0 6px 18px rgba(109,123,255,0.3)',
        color: 'rgba(31,38,64,0.12)', colorMedium: 'rgba(31,38,64,0.18)', colorStrong: 'rgba(31,38,64,0.28)',
      },
      header: { bg: 'rgba(255,255,255,0.45)', solid: '#e9eefb', blur: 'blur(24px)', border: 'rgba(255,255,255,0.6)', text: '#1f2740', shadow: '0 4px 30px rgba(31,38,64,0.1)' },
      bg: '#e9eefb', bgSecondary: '#dde6f7', card: 'rgba(255,255,255,0.55)', cardSecondary: 'rgba(255,255,255,0.4)', cardHover: 'rgba(255,255,255,0.72)',
      text: '#1f2740', textSecondary: '#4d5773', textLight: '#8089a3',
      border: 'rgba(255,255,255,0.6)', borderLight: 'rgba(255,255,255,0.4)',
      primary: '#6d7bff', primaryHover: '#5563ff', secondary: '#ff7ad9', secondaryHover: '#ff5ccf', accent: '#5ce1e6',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '109 123 255', secondary: '255 122 217', accent: '92 225 230', background: '233 238 251', surface: '255 255 255', text: '31 39 64', border: '210 219 240' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Poppins', sans-serif", body: "'Poppins', sans-serif" },
      radii: { sm: '10px', md: '16px', lg: '20px', xl: '28px', full: '9999px', button: '14px', card: '22px' },
      shadows: {
        card: '0 8px 32px rgba(0,0,0,0.4)', cardHover: '0 12px 40px rgba(0,0,0,0.5)', button: '0 6px 18px rgba(109,123,255,0.45)',
        color: 'rgba(0,0,0,0.4)', colorMedium: 'rgba(0,0,0,0.5)', colorStrong: 'rgba(0,0,0,0.6)',
      },
      header: { bg: 'rgba(15,20,36,0.55)', solid: '#0f1424', blur: 'blur(24px)', border: 'rgba(255,255,255,0.15)', text: '#eaf0ff', shadow: '0 4px 30px rgba(0,0,0,0.4)' },
      bg: '#0f1424', bgSecondary: '#161d33', card: 'rgba(255,255,255,0.08)', cardSecondary: 'rgba(255,255,255,0.05)', cardHover: 'rgba(255,255,255,0.14)',
      text: '#eaf0ff', textSecondary: '#aab4d4', textLight: '#727da3',
      border: 'rgba(255,255,255,0.15)', borderLight: 'rgba(255,255,255,0.08)',
      primary: '#8b97ff', primaryHover: '#a4adff', secondary: '#ff8fe0', secondaryHover: '#ffa8e8', accent: '#6feaef',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '139 151 255', secondary: '255 143 224', accent: '111 234 239', background: '15 20 36', surface: '22 29 51', text: '234 240 255', border: '60 70 100' },
    },
  },

  // -------------------------------------------------------------------------
  // 13. BOTANIQUE — verts forêt, terre, miel, serif Spectral, ambiance
  //     organique et calme.
  // -------------------------------------------------------------------------
  {
    id: 'botanical', name: 'Botanique', emoji: '🌿',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Spectral', serif", body: "'Spectral', serif" },
      radii: { sm: '4px', md: '8px', lg: '14px', xl: '20px', full: '9999px', button: '10px', card: '14px' },
      shadows: {
        card: '0 6px 18px rgba(39,51,31,0.10)', cardHover: '0 10px 28px rgba(39,51,31,0.16)', button: '0 4px 12px rgba(74,124,63,0.25)',
        color: 'rgba(39,51,31,0.1)', colorMedium: 'rgba(39,51,31,0.16)', colorStrong: 'rgba(39,51,31,0.26)',
      },
      header: { bg: 'rgba(243,246,238,0.85)', solid: '#f3f6ee', blur: 'blur(10px)', border: '#cdd9bd', text: '#27331f', shadow: '0 1px 0 #cdd9bd' },
      bg: '#f3f6ee', bgSecondary: '#e8efe0', card: '#fbfdf8', cardSecondary: '#eef3e7', cardHover: '#e2ebd6',
      text: '#27331f', textSecondary: '#566b48', textLight: '#869578',
      border: '#cdd9bd', borderLight: '#e2ebd6',
      primary: '#4a7c3f', primaryHover: '#3c6633', secondary: '#a86b3c', secondaryHover: '#8e5930', accent: '#d9a441',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '74 124 63', secondary: '168 107 60', accent: '217 164 65', background: '243 246 238', surface: '251 253 248', text: '39 51 31', border: '205 217 189' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Spectral', serif", body: "'Spectral', serif" },
      radii: { sm: '4px', md: '8px', lg: '14px', xl: '20px', full: '9999px', button: '10px', card: '14px' },
      shadows: {
        card: '0 6px 18px rgba(0,0,0,0.4)', cardHover: '0 10px 28px rgba(0,0,0,0.5)', button: '0 4px 12px rgba(123,179,106,0.3)',
        color: 'rgba(0,0,0,0.4)', colorMedium: 'rgba(0,0,0,0.5)', colorStrong: 'rgba(0,0,0,0.6)',
      },
      header: { bg: 'rgba(22,32,26,0.88)', solid: '#16201a', blur: 'blur(10px)', border: '#3a4d3f', text: '#e6f0e0', shadow: '0 1px 0 #3a4d3f' },
      bg: '#16201a', bgSecondary: '#1e2b22', card: '#1e2b22', cardSecondary: '#27382c', cardHover: '#314638',
      text: '#e6f0e0', textSecondary: '#aec4a4', textLight: '#7e9176',
      border: '#3a4d3f', borderLight: '#27382c',
      primary: '#7bb36a', primaryHover: '#95c486', secondary: '#d09a5e', secondaryHover: '#dcaf78', accent: '#e6c068',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '123 179 106', secondary: '208 154 94', accent: '230 192 104', background: '22 32 26', surface: '30 43 34', text: '230 240 224', border: '58 77 63' },
    },
  },

  // -------------------------------------------------------------------------
  // 14. OCÉAN PROFOND — bleus/teal aquatiques, accent corail, formes fluides
  //     très arrondies, police Outfit.
  // -------------------------------------------------------------------------
  {
    id: 'ocean', name: 'Océan profond', emoji: '🌊',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Outfit', sans-serif", body: "'Outfit', sans-serif" },
      radii: { sm: '8px', md: '14px', lg: '22px', xl: '30px', full: '9999px', button: '9999px', card: '22px' },
      shadows: {
        card: '0 8px 24px rgba(12,138,181,0.16)', cardHover: '0 12px 32px rgba(12,138,181,0.24)', button: '0 6px 16px rgba(12,138,181,0.3)',
        color: 'rgba(12,138,181,0.16)', colorMedium: 'rgba(12,138,181,0.24)', colorStrong: 'rgba(12,138,181,0.34)',
      },
      header: { bg: 'rgba(238,247,251,0.7)', solid: '#eef7fb', blur: 'blur(16px)', border: '#bfe0ee', text: '#0b2a3a', shadow: '0 6px 24px rgba(12,138,181,0.14)' },
      bg: '#eef7fb', bgSecondary: '#ddeef6', card: '#ffffff', cardSecondary: '#ecf6fb', cardHover: '#daeef6',
      text: '#0b2a3a', textSecondary: '#3f6b80', textLight: '#7ba1b3',
      border: '#bfe0ee', borderLight: '#dcf0f8',
      primary: '#0c8ab5', primaryHover: '#0a7399', secondary: '#13c4a3', secondaryHover: '#0fa98c', accent: '#ffb84d',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '12 138 181', secondary: '19 196 163', accent: '255 184 77', background: '238 247 251', surface: '255 255 255', text: '11 42 58', border: '191 224 238' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Outfit', sans-serif", body: "'Outfit', sans-serif" },
      radii: { sm: '8px', md: '14px', lg: '22px', xl: '30px', full: '9999px', button: '9999px', card: '22px' },
      shadows: {
        card: '0 8px 24px rgba(0,0,0,0.45)', cardHover: '0 12px 32px rgba(0,0,0,0.55)', button: '0 6px 16px rgba(42,176,214,0.4)',
        color: 'rgba(0,0,0,0.45)', colorMedium: 'rgba(0,0,0,0.55)', colorStrong: 'rgba(0,0,0,0.65)',
      },
      header: { bg: 'rgba(4,20,31,0.82)', solid: '#04141f', blur: 'blur(16px)', border: '#155069', text: '#d6f2fb', shadow: '0 6px 24px rgba(0,0,0,0.4)' },
      bg: '#04141f', bgSecondary: '#082233', card: '#082636', cardSecondary: '#0d3147', cardHover: '#124057',
      text: '#d6f2fb', textSecondary: '#8fc0d4', textLight: '#5a8aa0',
      border: '#155069', borderLight: '#0d3147',
      primary: '#2ab0d6', primaryHover: '#56c4e2', secondary: '#2fe0bd', secondaryHover: '#5ae8cd', accent: '#ffc266',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '42 176 214', secondary: '47 224 189', accent: '255 194 102', background: '4 20 31', surface: '8 38 54', text: '214 242 251', border: '21 80 105' },
    },
  },

  // -------------------------------------------------------------------------
  // 15. GAZETTE — presse noir & blanc, serif PT Serif + titres Oswald
  //     condensés, zéro arrondi, masthead noir.
  // -------------------------------------------------------------------------
  {
    id: 'gazette', name: 'Gazette', emoji: '📰',
    light: {
      ...STATE_LIGHT, buttonText: '#f7f6f2',
      fonts: { heading: "'Oswald', sans-serif", body: "'PT Serif', serif" },
      radii: { sm: '0', md: '0', lg: '0', xl: '0', full: '0', button: '0', card: '0' },
      shadows: {
        card: 'none', cardHover: '0 0 0 1px #1a1a1a', button: 'none',
        color: 'rgba(26,26,26,0.12)', colorMedium: 'rgba(26,26,26,0.2)', colorStrong: 'rgba(26,26,26,0.3)',
      },
      header: { bg: '#1a1a1a', solid: '#1a1a1a', blur: 'none', border: '#1a1a1a', text: '#f7f6f2', shadow: '0 2px 0 #1a1a1a' },
      bg: '#f7f6f2', bgSecondary: '#eeede8', card: '#fffefb', cardSecondary: '#f1f0ec', cardHover: '#e7e6e0',
      text: '#1a1a1a', textSecondary: '#4a4a4a', textLight: '#7a7a7a',
      border: '#1a1a1a', borderLight: '#cccac4',
      primary: '#1a1a1a', primaryHover: '#000000', secondary: '#8b0000', secondaryHover: '#6e0000', accent: '#8b0000',
      tag: { bg: '#1a1a1a', text: '#f7f6f2', border: '#1a1a1a' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.55', headingSpacing: '0.02em', headingTransform: 'uppercase', headingWeight: '600' },
      tw: { primary: '26 26 26', secondary: '139 0 0', accent: '139 0 0', background: '247 246 242', surface: '255 254 251', text: '26 26 26', border: '26 26 26' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#121212',
      fonts: { heading: "'Oswald', sans-serif", body: "'PT Serif', serif" },
      radii: { sm: '0', md: '0', lg: '0', xl: '0', full: '0', button: '0', card: '0' },
      shadows: {
        card: 'none', cardHover: '0 0 0 1px #f0efe9', button: 'none',
        color: 'rgba(240,239,233,0.12)', colorMedium: 'rgba(240,239,233,0.2)', colorStrong: 'rgba(240,239,233,0.3)',
      },
      header: { bg: '#000000', solid: '#000000', blur: 'none', border: '#f0efe9', text: '#f0efe9', shadow: '0 2px 0 #f0efe9' },
      bg: '#121212', bgSecondary: '#1a1a1a', card: '#1a1a1a', cardSecondary: '#242424', cardHover: '#2e2e2e',
      text: '#f0efe9', textSecondary: '#b8b7b1', textLight: '#83827d',
      border: '#f0efe9', borderLight: '#2e2e2e',
      primary: '#f0efe9', primaryHover: '#ffffff', secondary: '#ff6b6b', secondaryHover: '#ff8a8a', accent: '#ff6b6b',
      tag: { bg: '#f0efe9', text: '#121212', border: '#f0efe9' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.55', headingSpacing: '0.02em', headingTransform: 'uppercase', headingWeight: '600' },
      tw: { primary: '240 239 233', secondary: '255 107 107', accent: '255 107 107', background: '18 18 18', surface: '26 26 26', text: '240 239 233', border: '240 239 233' },
    },
  },

  // -------------------------------------------------------------------------
  // 16. SEVENTIES — orange brûlé, moutarde, avocat, brun ; serif DM Serif
  //     Display + DM Sans ; arrondis groovy, bandeau header orange.
  // -------------------------------------------------------------------------
  {
    id: 'seventies', name: 'Seventies funk', emoji: '🧡',
    light: {
      ...STATE_LIGHT, buttonText: '#fff7ea',
      fonts: { heading: "'DM Serif Display', serif", body: "'DM Sans', sans-serif" },
      radii: { sm: '6px', md: '12px', lg: '18px', xl: '24px', full: '9999px', button: '9999px', card: '16px' },
      shadows: {
        card: '0 6px 16px rgba(58,36,23,0.14)', cardHover: '0 10px 26px rgba(58,36,23,0.2)', button: '0 5px 14px rgba(197,87,31,0.3)',
        color: 'rgba(58,36,23,0.14)', colorMedium: 'rgba(58,36,23,0.2)', colorStrong: 'rgba(58,36,23,0.3)',
      },
      header: { bg: '#c5571f', solid: '#c5571f', blur: 'none', border: '#3a2417', text: '#fff7ea', shadow: '0 3px 0 #3a2417' },
      bg: '#f7ead6', bgSecondary: '#f0dcc0', card: '#fff7ea', cardSecondary: '#f3e3cd', cardHover: '#ecd7ba',
      text: '#3a2417', textSecondary: '#7a5638', textLight: '#a98a68',
      border: '#d8b48c', borderLight: '#ecd7ba',
      primary: '#c5571f', primaryHover: '#a8471a', secondary: '#3f7d5f', secondaryHover: '#336649', accent: '#e3a92c',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '400' },
      tw: { primary: '197 87 31', secondary: '63 125 95', accent: '227 169 44', background: '247 234 214', surface: '255 247 234', text: '58 36 23', border: '216 180 140' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#241712',
      fonts: { heading: "'DM Serif Display', serif", body: "'DM Sans', sans-serif" },
      radii: { sm: '6px', md: '12px', lg: '18px', xl: '24px', full: '9999px', button: '9999px', card: '16px' },
      shadows: {
        card: '0 6px 16px rgba(0,0,0,0.45)', cardHover: '0 10px 26px rgba(0,0,0,0.55)', button: '0 5px 14px rgba(224,122,62,0.35)',
        color: 'rgba(0,0,0,0.45)', colorMedium: 'rgba(0,0,0,0.55)', colorStrong: 'rgba(0,0,0,0.65)',
      },
      header: { bg: '#3a2417', solid: '#3a2417', blur: 'none', border: '#5a3d2c', text: '#fff7ea', shadow: '0 3px 0 #5a3d2c' },
      bg: '#241712', bgSecondary: '#2e1d16', card: '#2e1d16', cardSecondary: '#3a261c', cardHover: '#472f22',
      text: '#f3e3cd', textSecondary: '#cba888', textLight: '#94735a',
      border: '#5a3d2c', borderLight: '#3a261c',
      primary: '#e07a3e', primaryHover: '#e8945f', secondary: '#5fa37c', secondaryHover: '#7bb795', accent: '#f0bd55',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '400' },
      tw: { primary: '224 122 62', secondary: '95 163 124', accent: '240 189 85', background: '36 23 18', surface: '46 29 22', text: '243 227 205', border: '90 61 44' },
    },
  },

  // -------------------------------------------------------------------------
  // 17. NOIR CINÉMA — niveaux de gris contrastés, rouge sang, titres Bebas
  //     condensés MAJ, ombres dramatiques.
  // -------------------------------------------------------------------------
  {
    id: 'noir', name: 'Noir cinéma', emoji: '🎬',
    light: {
      ...STATE_LIGHT, buttonText: '#f0f0f0',
      fonts: { heading: "'Bebas Neue', sans-serif", body: "'Inter', sans-serif" },
      radii: { sm: '0', md: '0', lg: '2px', xl: '2px', full: '9999px', button: '0', card: '0' },
      shadows: {
        card: '0 10px 30px rgba(0,0,0,0.25)', cardHover: '0 16px 40px rgba(0,0,0,0.35)', button: 'none',
        color: 'rgba(0,0,0,0.25)', colorMedium: 'rgba(0,0,0,0.35)', colorStrong: 'rgba(0,0,0,0.5)',
      },
      header: { bg: '#0a0a0a', solid: '#0a0a0a', blur: 'none', border: '#0a0a0a', text: '#f0f0f0', shadow: '0 2px 12px rgba(0,0,0,0.4)' },
      bg: '#e8e8e8', bgSecondary: '#dcdcdc', card: '#ffffff', cardSecondary: '#f0f0f0', cardHover: '#e2e2e2',
      text: '#0a0a0a', textSecondary: '#3d3d3d', textLight: '#747474',
      border: '#0a0a0a', borderLight: '#cfcfcf',
      primary: '#0a0a0a', primaryHover: '#000000', secondary: '#b8002e', secondaryHover: '#920024', accent: '#b8002e',
      tag: { bg: '#0a0a0a', text: '#f0f0f0', border: '#0a0a0a' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.5', headingSpacing: '0.06em', headingTransform: 'uppercase', headingWeight: '400' },
      tw: { primary: '10 10 10', secondary: '184 0 46', accent: '184 0 46', background: '232 232 232', surface: '255 255 255', text: '10 10 10', border: '10 10 10' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#080808',
      fonts: { heading: "'Bebas Neue', sans-serif", body: "'Inter', sans-serif" },
      radii: { sm: '0', md: '0', lg: '2px', xl: '2px', full: '9999px', button: '0', card: '0' },
      shadows: {
        card: '0 10px 30px rgba(0,0,0,0.6)', cardHover: '0 16px 44px rgba(0,0,0,0.7)', button: 'none',
        color: 'rgba(0,0,0,0.6)', colorMedium: 'rgba(0,0,0,0.7)', colorStrong: 'rgba(0,0,0,0.8)',
      },
      header: { bg: '#000000', solid: '#000000', blur: 'none', border: '#2a2a2a', text: '#ededed', shadow: '0 2px 12px rgba(0,0,0,0.6)' },
      bg: '#080808', bgSecondary: '#121212', card: '#121212', cardSecondary: '#1a1a1a', cardHover: '#242424',
      text: '#ededed', textSecondary: '#9a9a9a', textLight: '#5e5e5e',
      border: '#2a2a2a', borderLight: '#1a1a1a',
      primary: '#ededed', primaryHover: '#ffffff', secondary: '#e11d48', secondaryHover: '#f43f5e', accent: '#e11d48',
      tag: { bg: '#ededed', text: '#080808', border: '#ededed' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.5', headingSpacing: '0.06em', headingTransform: 'uppercase', headingWeight: '400' },
      tw: { primary: '237 237 237', secondary: '225 29 72', accent: '225 29 72', background: '8 8 8', surface: '18 18 18', text: '237 237 237', border: '42 42 42' },
    },
  },

  // -------------------------------------------------------------------------
  // 18. PIXEL ARCADE — 8-bit, police Press Start 2P + VT323, couleurs néon
  //     rétro-jeu, blocs nets, zéro arrondi.
  // -------------------------------------------------------------------------
  {
    id: 'pixel', name: 'Pixel arcade', emoji: '👾',
    light: {
      ...STATE_DARK, buttonText: '#0b0b2a',
      fonts: { heading: "'Press Start 2P', cursive", body: "'VT323', monospace" },
      radii: { sm: '0', md: '0', lg: '0', xl: '0', full: '0', button: '0', card: '0' },
      shadows: {
        card: '4px 4px 0 #50fa7b', cardHover: '6px 6px 0 #ff3864', button: '0 0 0 2px #50fa7b',
        color: 'rgba(80,250,123,0.4)', colorMedium: 'rgba(255,56,100,0.5)', colorStrong: 'rgba(255,56,100,0.7)',
      },
      header: { bg: '#0b0b2a', solid: '#0b0b2a', blur: 'none', border: '#50fa7b', text: '#ffdf5c', shadow: '0 4px 0 #50fa7b' },
      bg: '#0b0b2a', bgSecondary: '#141452', card: '#15154a', cardSecondary: '#1f1f66', cardHover: '#2a2a80',
      text: '#ffffff', textSecondary: '#8be9fd', textLight: '#6272a4',
      border: '#50fa7b', borderLight: '#2a2a80',
      primary: '#ffdf5c', primaryHover: '#ffe680', secondary: '#ff3864', secondaryHover: '#e02554', accent: '#50fa7b',
      tag: { bg: '#1f1f66', text: '#50fa7b', border: '#50fa7b' },
      layout: { containerMax: '100%', contentPad: '1.5rem', fontScale: '1', lineHeight: '1.6', headingSpacing: '0.02em', headingTransform: 'uppercase', headingWeight: '400' },
      tw: { primary: '255 223 92', secondary: '255 56 100', accent: '80 250 123', background: '11 11 42', surface: '21 21 74', text: '255 255 255', border: '80 250 123' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#050514',
      fonts: { heading: "'Press Start 2P', cursive", body: "'VT323', monospace" },
      radii: { sm: '0', md: '0', lg: '0', xl: '0', full: '0', button: '0', card: '0' },
      shadows: {
        card: '4px 4px 0 #ff3864', cardHover: '6px 6px 0 #50fa7b', button: '0 0 0 2px #ff3864',
        color: 'rgba(255,56,100,0.4)', colorMedium: 'rgba(80,250,123,0.5)', colorStrong: 'rgba(80,250,123,0.7)',
      },
      header: { bg: '#050514', solid: '#050514', blur: 'none', border: '#ff3864', text: '#50fa7b', shadow: '0 4px 0 #ff3864' },
      bg: '#050514', bgSecondary: '#0d0d33', card: '#0d0d33', cardSecondary: '#16164d', cardHover: '#212166',
      text: '#ffffff', textSecondary: '#8be9fd', textLight: '#5566a0',
      border: '#ff3864', borderLight: '#212166',
      primary: '#50fa7b', primaryHover: '#7cffa0', secondary: '#ffdf5c', secondaryHover: '#ffe680', accent: '#ff3864',
      tag: { bg: '#16164d', text: '#ffdf5c', border: '#ff3864' },
      layout: { containerMax: '100%', contentPad: '1.5rem', fontScale: '1', lineHeight: '1.6', headingSpacing: '0.02em', headingTransform: 'uppercase', headingWeight: '400' },
      tw: { primary: '80 250 123', secondary: '255 223 92', accent: '255 56 100', background: '5 5 20', surface: '13 13 51', text: '255 255 255', border: '255 56 100' },
    },
  },

  // -------------------------------------------------------------------------
  // 19. JAPANDI ZEN — beiges chauds, matcha, terracotta, police Zen Maru
  //     Gothic, très aéré, interlignage généreux.
  // -------------------------------------------------------------------------
  {
    id: 'japandi', name: 'Japandi zen', emoji: '🍵',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'Zen Maru Gothic', sans-serif", body: "'Zen Maru Gothic', sans-serif" },
      radii: { sm: '6px', md: '10px', lg: '14px', xl: '18px', full: '9999px', button: '8px', card: '12px' },
      shadows: {
        card: '0 4px 14px rgba(58,53,46,0.08)', cardHover: '0 8px 22px rgba(58,53,46,0.12)', button: '0 3px 10px rgba(58,53,46,0.12)',
        color: 'rgba(58,53,46,0.08)', colorMedium: 'rgba(58,53,46,0.12)', colorStrong: 'rgba(58,53,46,0.2)',
      },
      header: { bg: 'rgba(244,241,234,0.85)', solid: '#f4f1ea', blur: 'blur(10px)', border: '#d8d0c0', text: '#3a352e', shadow: '0 1px 0 #d8d0c0' },
      bg: '#f4f1ea', bgSecondary: '#eae5da', card: '#fbf9f3', cardSecondary: '#efebe1', cardHover: '#e6e0d2',
      text: '#3a352e', textSecondary: '#6e665a', textLight: '#9c9384',
      border: '#d8d0c0', borderLight: '#e6e0d2',
      primary: '#6b7a5e', primaryHover: '#586549', secondary: '#a65a3c', secondaryHover: '#8c4a30', accent: '#c9a66b',
      layout: { containerMax: '100%', contentPad: '2.5rem', fontScale: '1.05', lineHeight: '1.8', headingSpacing: '0.04em', headingTransform: 'none', headingWeight: '500' },
      tw: { primary: '107 122 94', secondary: '166 90 60', accent: '201 166 107', background: '244 241 234', surface: '251 249 243', text: '58 53 46', border: '216 208 192' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Zen Maru Gothic', sans-serif", body: "'Zen Maru Gothic', sans-serif" },
      radii: { sm: '6px', md: '10px', lg: '14px', xl: '18px', full: '9999px', button: '8px', card: '12px' },
      shadows: {
        card: '0 4px 14px rgba(0,0,0,0.4)', cardHover: '0 8px 22px rgba(0,0,0,0.5)', button: '0 3px 10px rgba(0,0,0,0.4)',
        color: 'rgba(0,0,0,0.4)', colorMedium: 'rgba(0,0,0,0.5)', colorStrong: 'rgba(0,0,0,0.6)',
      },
      header: { bg: 'rgba(31,29,24,0.88)', solid: '#1f1d18', blur: 'blur(10px)', border: '#403b2f', text: '#ece7db', shadow: '0 1px 0 #403b2f' },
      bg: '#1f1d18', bgSecondary: '#27241d', card: '#27241d', cardSecondary: '#312d24', cardHover: '#3b362b',
      text: '#ece7db', textSecondary: '#c2bbac', textLight: '#8f897a',
      border: '#403b2f', borderLight: '#312d24',
      primary: '#9aab87', primaryHover: '#b0c0a0', secondary: '#cc7a58', secondaryHover: '#d99478', accent: '#dcc08a',
      layout: { containerMax: '100%', contentPad: '2.5rem', fontScale: '1.05', lineHeight: '1.8', headingSpacing: '0.04em', headingTransform: 'none', headingWeight: '500' },
      tw: { primary: '154 171 135', secondary: '204 122 88', accent: '220 192 138', background: '31 29 24', surface: '39 36 29', text: '236 231 219', border: '64 59 47' },
    },
  },

  // -------------------------------------------------------------------------
  // 20. CORPORATE FINTECH — bleu marine + vert, IBM Plex Sans, ombres
  //     nettes et discrètes, large conteneur pro.
  // -------------------------------------------------------------------------
  {
    id: 'corporate', name: 'Corporate fintech', emoji: '🏦',
    light: {
      ...STATE_LIGHT,
      fonts: { heading: "'IBM Plex Sans', sans-serif", body: "'IBM Plex Sans', sans-serif" },
      radii: { sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px', button: '6px', card: '8px' },
      shadows: {
        card: '0 1px 3px rgba(15,27,45,0.08), 0 1px 2px rgba(15,27,45,0.04)', cardHover: '0 6px 18px rgba(15,27,45,0.12)', button: '0 1px 2px rgba(15,27,45,0.1)',
        color: 'rgba(15,27,45,0.08)', colorMedium: 'rgba(15,27,45,0.12)', colorStrong: 'rgba(15,27,45,0.2)',
      },
      header: { bg: 'rgba(255,255,255,0.85)', solid: '#ffffff', blur: 'blur(12px)', border: '#d6dde6', text: '#0f1b2d', shadow: '0 1px 3px rgba(15,27,45,0.06)' },
      bg: '#f5f7fa', bgSecondary: '#eaeef4', card: '#ffffff', cardSecondary: '#f1f4f9', cardHover: '#e8edf4',
      text: '#0f1b2d', textSecondary: '#4a5a70', textLight: '#8290a3',
      border: '#d6dde6', borderLight: '#e8edf4',
      primary: '#0a4d8c', primaryHover: '#083e70', secondary: '#00a37a', secondaryHover: '#008a67', accent: '#3b82f6',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '0.98', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '10 77 140', secondary: '0 163 122', accent: '59 130 246', background: '245 247 250', surface: '255 255 255', text: '15 27 45', border: '214 221 230' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'IBM Plex Sans', sans-serif", body: "'IBM Plex Sans', sans-serif" },
      radii: { sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px', button: '6px', card: '8px' },
      shadows: {
        card: '0 1px 3px rgba(0,0,0,0.5)', cardHover: '0 6px 18px rgba(0,0,0,0.6)', button: '0 1px 2px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(11,18,32,0.88)', solid: '#0b1220', blur: 'blur(12px)', border: '#243450', text: '#e6edf6', shadow: '0 1px 3px rgba(0,0,0,0.5)' },
      bg: '#0b1220', bgSecondary: '#111b2e', card: '#111b2e', cardSecondary: '#1a2740', cardHover: '#243450',
      text: '#e6edf6', textSecondary: '#9fb0c6', textLight: '#647890',
      border: '#243450', borderLight: '#1a2740',
      primary: '#3b82f6', primaryHover: '#5a96f8', secondary: '#10c896', secondaryHover: '#34d6ab', accent: '#60a5fa',
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '0.98', lineHeight: '1.6', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '59 130 246', secondary: '16 200 150', accent: '96 165 250', background: '11 18 32', surface: '17 27 46', text: '230 237 246', border: '36 52 80' },
    },
  },

  // -------------------------------------------------------------------------
  // 21. GALAXIE COSMIQUE — espace profond indigo/violet, accents pink/star,
  //     police Exo 2, halos lumineux.
  // -------------------------------------------------------------------------
  {
    id: 'cosmic', name: 'Galaxie cosmique', emoji: '🌌',
    light: {
      ...STATE_DARK,
      fonts: { heading: "'Exo 2', sans-serif", body: "'Exo 2', sans-serif" },
      radii: { sm: '8px', md: '14px', lg: '20px', xl: '28px', full: '9999px', button: '12px', card: '18px' },
      shadows: {
        card: '0 8px 28px rgba(139,92,246,0.25)', cardHover: '0 12px 36px rgba(236,72,153,0.3)', button: '0 6px 18px rgba(139,92,246,0.4)',
        color: 'rgba(139,92,246,0.25)', colorMedium: 'rgba(236,72,153,0.35)', colorStrong: 'rgba(236,72,153,0.5)',
      },
      header: { bg: 'rgba(26,22,51,0.8)', solid: '#1a1633', blur: 'blur(16px)', border: '#4a3f80', text: '#ece9ff', shadow: '0 4px 24px rgba(139,92,246,0.25)' },
      bg: '#1a1633', bgSecondary: '#241f47', card: '#221d44', cardSecondary: '#2e2858', cardHover: '#3a3370',
      text: '#ece9ff', textSecondary: '#b3a8e6', textLight: '#7d72b3',
      border: '#4a3f80', borderLight: '#2e2858',
      primary: '#8b5cf6', primaryHover: '#a07cf8', secondary: '#ec4899', secondaryHover: '#f061a8', accent: '#38bdf8',
      tag: { bg: '#2e2858', text: '#8b5cf6', border: '#4a3f80' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.6', headingSpacing: '0.08em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '139 92 246', secondary: '236 72 153', accent: '56 189 248', background: '26 22 51', surface: '34 29 68', text: '236 233 255', border: '74 63 128' },
    },
    dark: {
      ...STATE_DARK,
      fonts: { heading: "'Exo 2', sans-serif", body: "'Exo 2', sans-serif" },
      radii: { sm: '8px', md: '14px', lg: '20px', xl: '28px', full: '9999px', button: '12px', card: '18px' },
      shadows: {
        card: '0 8px 28px rgba(157,107,255,0.3)', cardHover: '0 12px 40px rgba(244,114,182,0.35)', button: '0 6px 20px rgba(157,107,255,0.45)',
        color: 'rgba(157,107,255,0.3)', colorMedium: 'rgba(244,114,182,0.4)', colorStrong: 'rgba(244,114,182,0.55)',
      },
      header: { bg: 'rgba(12,10,30,0.85)', solid: '#0c0a1e', blur: 'blur(16px)', border: '#352c66', text: '#f0edff', shadow: '0 4px 26px rgba(157,107,255,0.3)' },
      bg: '#0c0a1e', bgSecondary: '#15112e', card: '#15112e', cardSecondary: '#201a40', cardHover: '#2b2454',
      text: '#f0edff', textSecondary: '#bdb2e8', textLight: '#7c70b0',
      border: '#352c66', borderLight: '#201a40',
      primary: '#9d6bff', primaryHover: '#b48cff', secondary: '#f472b6', secondaryHover: '#f78fc6', accent: '#56c5ff',
      tag: { bg: '#201a40', text: '#9d6bff', border: '#352c66' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.6', headingSpacing: '0.08em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '157 107 255', secondary: '244 114 182', accent: '86 197 255', background: '12 10 30', surface: '21 17 46', text: '240 237 255', border: '53 44 102' },
    },
  },

  // -------------------------------------------------------------------------
  // 22. ENCRE & PAPIER — éditorial monochrome, papier chaud / encre noire,
  //     filets fins, arrondis nets, accent sépia discret. Sobre, imprimé.
  // -------------------------------------------------------------------------
  {
    id: 'ink', name: 'Encre & papier', emoji: '🖋️',
    light: {
      ...STATE_LIGHT, buttonText: '#fffdf8',
      successLight: '#e4eadf', warningLight: '#f1e8d2', errorLight: '#f1ddd6',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '2px', md: '4px', lg: '6px', xl: '8px', full: '9999px', button: '3px', card: '4px' },
      shadows: {
        card: '0 1px 2px rgba(28,26,23,0.06)',
        cardHover: '0 4px 14px rgba(28,26,23,0.10)',
        button: '0 1px 1px rgba(28,26,23,0.08)',
        color: 'rgba(28,26,23,0.08)', colorMedium: 'rgba(28,26,23,0.12)', colorStrong: 'rgba(28,26,23,0.20)',
      },
      header: { bg: 'rgba(247,244,238,0.85)', solid: '#f7f4ee', blur: 'blur(8px)', border: '#ddd6c8', text: '#1c1a17', shadow: '0 1px 0 #ddd6c8' },
      bg: '#f7f4ee', bgSecondary: '#efeae0', card: '#fffdf8', cardSecondary: '#f2ede3', cardHover: '#e9e3d6',
      text: '#1c1a17', textSecondary: '#57534c', textLight: '#8a857b',
      border: '#ddd6c8', borderLight: '#ebe6da',
      primary: '#2b2825', primaryHover: '#45403a', secondary: '#6b6359', secondaryHover: '#534c44', accent: '#8c6d4a',
      tag: { bg: '#efeae0', text: '#57534c', border: '#ddd6c8' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: '0.01em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '43 40 37', secondary: '107 99 89', accent: '140 109 74', background: '247 244 238', surface: '255 253 248', text: '28 26 23', border: '221 214 200' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#16140f',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '2px', md: '4px', lg: '6px', xl: '8px', full: '9999px', button: '3px', card: '4px' },
      shadows: {
        card: '0 1px 3px rgba(0,0,0,0.5)',
        cardHover: '0 6px 20px rgba(199,154,106,0.18)',
        button: '0 1px 2px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(22,20,15,0.9)', solid: '#16140f', blur: 'blur(8px)', border: '#3a352b', text: '#f0ebe0', shadow: '0 1px 0 #3a352b' },
      bg: '#16140f', bgSecondary: '#1e1b15', card: '#1f1c16', cardSecondary: '#29251d', cardHover: '#332e24',
      text: '#f0ebe0', textSecondary: '#bdb6a6', textLight: '#8a8474',
      border: '#3a352b', borderLight: '#29251d',
      primary: '#e8e1d2', primaryHover: '#fff8ea', secondary: '#c2bba6', secondaryHover: '#d8d0bc', accent: '#c79a6a',
      tag: { bg: '#29251d', text: '#c79a6a', border: '#3a352b' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: '0.01em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '232 225 210', secondary: '194 187 166', accent: '199 154 106', background: '22 20 15', surface: '31 28 22', text: '240 235 224', border: '58 53 43' },
    },
  },

  // -------------------------------------------------------------------------
  // 23. VERT SAUGE — botanique apaisé, vert sauge / crème, arrondis doux,
  //     ombres légères, accent ocre. Sobre et naturel.
  // -------------------------------------------------------------------------
  {
    id: 'sage', name: 'Vert sauge', emoji: '🌿',
    light: {
      ...STATE_LIGHT,
      successLight: '#e2ecdb', warningLight: '#f0ead0', errorLight: '#f1ddd6',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '6px', md: '10px', lg: '14px', xl: '18px', full: '9999px', button: '10px', card: '14px' },
      shadows: {
        card: '0 2px 6px rgba(35,41,31,0.07)',
        cardHover: '0 8px 20px rgba(91,115,85,0.14)',
        button: '0 1px 3px rgba(35,41,31,0.08)',
        color: 'rgba(35,41,31,0.08)', colorMedium: 'rgba(35,41,31,0.12)', colorStrong: 'rgba(35,41,31,0.20)',
      },
      header: { bg: 'rgba(243,245,239,0.85)', solid: '#f3f5ef', blur: 'blur(10px)', border: '#d3dac6', text: '#23291f', shadow: '0 1px 0 #d3dac6' },
      bg: '#f3f5ef', bgSecondary: '#e8ece1', card: '#fbfcf8', cardSecondary: '#eef1e8', cardHover: '#e3e8d9',
      text: '#23291f', textSecondary: '#545b4b', textLight: '#868d78',
      border: '#d3dac6', borderLight: '#e6ebdb',
      primary: '#5b7355', primaryHover: '#485c43', secondary: '#7a8c6a', secondaryHover: '#66785a', accent: '#a3835a',
      tag: { bg: '#e8ece1', text: '#4d5b3f', border: '#d3dac6' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '91 115 85', secondary: '122 140 106', accent: '163 131 90', background: '243 245 239', surface: '251 252 248', text: '35 41 31', border: '211 218 198' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#14170f',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '6px', md: '10px', lg: '14px', xl: '18px', full: '9999px', button: '10px', card: '14px' },
      shadows: {
        card: '0 2px 6px rgba(0,0,0,0.5)',
        cardHover: '0 8px 22px rgba(139,163,127,0.20)',
        button: '0 1px 3px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(20,23,15,0.9)', solid: '#14170f', blur: 'blur(10px)', border: '#353c29', text: '#e9eede', shadow: '0 1px 0 #353c29' },
      bg: '#14170f', bgSecondary: '#1b1f15', card: '#1c2016', cardSecondary: '#252a1c', cardHover: '#2f3524',
      text: '#e9eede', textSecondary: '#b6bfa3', textLight: '#858d72',
      border: '#353c29', borderLight: '#252a1c',
      primary: '#8ba37f', primaryHover: '#a3bb96', secondary: '#9bad88', secondaryHover: '#b3c4a0', accent: '#c2a173',
      tag: { bg: '#252a1c', text: '#a3bb96', border: '#353c29' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '139 163 127', secondary: '155 173 136', accent: '194 161 115', background: '20 23 15', surface: '28 32 22', text: '233 238 222', border: '53 60 41' },
    },
  },

  // -------------------------------------------------------------------------
  // 24. BLEU ARDOISE — corporate raffiné, bleu-gris ardoise / blanc cassé,
  //     arrondis nets, accent bleu-sarcelle. Sobre et professionnel.
  // -------------------------------------------------------------------------
  {
    id: 'slate', name: 'Bleu ardoise', emoji: '🔹',
    light: {
      ...STATE_LIGHT,
      successLight: '#dde9e4', warningLight: '#eee6d2', errorLight: '#f1ddd9',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '4px', md: '8px', lg: '12px', xl: '14px', full: '9999px', button: '8px', card: '10px' },
      shadows: {
        card: '0 2px 6px rgba(30,39,48,0.08)',
        cardHover: '0 8px 22px rgba(65,86,107,0.16)',
        button: '0 1px 3px rgba(30,39,48,0.10)',
        color: 'rgba(30,39,48,0.08)', colorMedium: 'rgba(30,39,48,0.14)', colorStrong: 'rgba(30,39,48,0.24)',
      },
      header: { bg: 'rgba(244,246,248,0.85)', solid: '#f4f6f8', blur: 'blur(10px)', border: '#d2dae2', text: '#1e2730', shadow: '0 1px 0 #d2dae2' },
      bg: '#f4f6f8', bgSecondary: '#e9edf1', card: '#ffffff', cardSecondary: '#eef1f5', cardHover: '#e2e8ee',
      text: '#1e2730', textSecondary: '#4f5b67', textLight: '#828d9b',
      border: '#d2dae2', borderLight: '#e6ebf0',
      primary: '#41566b', primaryHover: '#324656', secondary: '#647c92', secondaryHover: '#516778', accent: '#4a8a9c',
      tag: { bg: '#e9edf1', text: '#41566b', border: '#d2dae2' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.65', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '65 86 107', secondary: '100 124 146', accent: '74 138 156', background: '244 246 248', surface: '255 255 255', text: '30 39 48', border: '210 218 226' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#0f141a',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '4px', md: '8px', lg: '12px', xl: '14px', full: '9999px', button: '8px', card: '10px' },
      shadows: {
        card: '0 2px 6px rgba(0,0,0,0.5)',
        cardHover: '0 8px 22px rgba(111,138,163,0.22)',
        button: '0 1px 3px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(15,20,26,0.9)', solid: '#0f141a', blur: 'blur(10px)', border: '#2c3743', text: '#e7edf3', shadow: '0 1px 0 #2c3743' },
      bg: '#0f141a', bgSecondary: '#161d25', card: '#171e27', cardSecondary: '#1f2832', cardHover: '#29333f',
      text: '#e7edf3', textSecondary: '#aebac7', textLight: '#7d8a99',
      border: '#2c3743', borderLight: '#1f2832',
      primary: '#6f8aa3', primaryHover: '#89a1b8', secondary: '#809ab0', secondaryHover: '#99b1c4', accent: '#66b0c4',
      tag: { bg: '#1f2832', text: '#89a1b8', border: '#2c3743' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.65', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '111 138 163', secondary: '128 154 176', accent: '102 176 196', background: '15 20 26', surface: '23 30 39', text: '231 237 243', border: '44 55 67' },
    },
  },

  // -------------------------------------------------------------------------
  // 25. ARGILE TERRACOTTA — méditerranéen chaud, terracotta / sable, arrondis
  //     doux, accent eucalyptus. Sobre et chaleureux.
  // -------------------------------------------------------------------------
  {
    id: 'clay', name: 'Argile terracotta', emoji: '🏺',
    light: {
      ...STATE_LIGHT, buttonText: '#fffaf4',
      successLight: '#e3ebdd', warningLight: '#f3e7cf', errorLight: '#f2ddd4',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '5px', md: '9px', lg: '13px', xl: '16px', full: '9999px', button: '9px', card: '12px' },
      shadows: {
        card: '0 2px 6px rgba(42,32,26,0.08)',
        cardHover: '0 8px 22px rgba(181,97,63,0.16)',
        button: '0 1px 3px rgba(42,32,26,0.10)',
        color: 'rgba(42,32,26,0.08)', colorMedium: 'rgba(42,32,26,0.13)', colorStrong: 'rgba(42,32,26,0.22)',
      },
      header: { bg: 'rgba(247,241,234,0.85)', solid: '#f7f1ea', blur: 'blur(8px)', border: '#e0cdb8', text: '#2a201a', shadow: '0 1px 0 #e0cdb8' },
      bg: '#f7f1ea', bgSecondary: '#efe5d9', card: '#fffaf4', cardSecondary: '#f3e8db', cardHover: '#ecdcc9',
      text: '#2a201a', textSecondary: '#6a584b', textLight: '#9c8775',
      border: '#e0cdb8', borderLight: '#eaddcc',
      primary: '#b5613f', primaryHover: '#9c4f30', secondary: '#7d6a55', secondaryHover: '#67563f', accent: '#7a9080',
      tag: { bg: '#efe5d9', text: '#9c4f30', border: '#e0cdb8' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: '0.01em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '181 97 63', secondary: '125 106 85', accent: '122 144 128', background: '247 241 234', surface: '255 250 244', text: '42 32 26', border: '224 205 184' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#18120d',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '5px', md: '9px', lg: '13px', xl: '16px', full: '9999px', button: '9px', card: '12px' },
      shadows: {
        card: '0 2px 6px rgba(0,0,0,0.5)',
        cardHover: '0 8px 22px rgba(207,125,87,0.22)',
        button: '0 1px 3px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(24,18,13,0.9)', solid: '#18120d', blur: 'blur(8px)', border: '#3c2e1f', text: '#f2e7da', shadow: '0 1px 0 #3c2e1f' },
      bg: '#18120d', bgSecondary: '#201810', card: '#211910', cardSecondary: '#2b2116', cardHover: '#382a1b',
      text: '#f2e7da', textSecondary: '#cbb29c', textLight: '#998069',
      border: '#3c2e1f', borderLight: '#2b2116',
      primary: '#cf7d57', primaryHover: '#e0936d', secondary: '#b39a80', secondaryHover: '#c9b096', accent: '#93ab98',
      tag: { bg: '#2b2116', text: '#e0936d', border: '#3c2e1f' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: '0.01em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '207 125 87', secondary: '179 154 128', accent: '147 171 152', background: '24 18 13', surface: '33 25 16', text: '242 231 218', border: '60 46 31' },
    },
  },

  // -------------------------------------------------------------------------
  // 26. PRUNE AUBERGINE — feutré et raffiné, prune profond / greige rosé,
  //     arrondis discrets, accent or vieilli. Sobre et sophistiqué.
  // -------------------------------------------------------------------------
  {
    id: 'plum', name: 'Prune aubergine', emoji: '🍇',
    light: {
      ...STATE_LIGHT, buttonText: '#fffafc',
      successLight: '#e6e9df', warningLight: '#f1e8d0', errorLight: '#f1dce0',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '4px', md: '6px', lg: '10px', xl: '12px', full: '9999px', button: '6px', card: '10px' },
      shadows: {
        card: '0 2px 6px rgba(38,29,35,0.08)',
        cardHover: '0 8px 22px rgba(110,61,91,0.16)',
        button: '0 1px 3px rgba(38,29,35,0.10)',
        color: 'rgba(38,29,35,0.08)', colorMedium: 'rgba(38,29,35,0.13)', colorStrong: 'rgba(38,29,35,0.22)',
      },
      header: { bg: 'rgba(246,242,244,0.85)', solid: '#f6f2f4', blur: 'blur(8px)', border: '#ddccd5', text: '#261d23', shadow: '0 1px 0 #ddccd5' },
      bg: '#f6f2f4', bgSecondary: '#ece2e7', card: '#fffafc', cardSecondary: '#f1e6ec', cardHover: '#e7d6e0',
      text: '#261d23', textSecondary: '#5f4f59', textLight: '#927f8a',
      border: '#ddccd5', borderLight: '#ebe0e6',
      primary: '#6e3d5b', primaryHover: '#582f49', secondary: '#7d6a72', secondaryHover: '#665563', accent: '#b08a4a',
      tag: { bg: '#ece2e7', text: '#582f49', border: '#ddccd5' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.65', headingSpacing: '0.04em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '110 61 91', secondary: '125 106 114', accent: '176 138 74', background: '246 242 244', surface: '255 250 252', text: '38 29 35', border: '221 204 213' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#160f13',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '4px', md: '6px', lg: '10px', xl: '12px', full: '9999px', button: '6px', card: '10px' },
      shadows: {
        card: '0 2px 6px rgba(0,0,0,0.5)',
        cardHover: '0 8px 22px rgba(168,102,144,0.22)',
        button: '0 1px 3px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(22,15,19,0.9)', solid: '#160f13', blur: 'blur(8px)', border: '#382836', text: '#f0e6ec', shadow: '0 1px 0 #382836' },
      bg: '#160f13', bgSecondary: '#1d141a', card: '#1e151b', cardSecondary: '#281d24', cardHover: '#342633',
      text: '#f0e6ec', textSecondary: '#c4b0bd', textLight: '#917f8a',
      border: '#382836', borderLight: '#281d24',
      primary: '#a86690', primaryHover: '#c07ea8', secondary: '#ab94a3', secondaryHover: '#c2acba', accent: '#cda85f',
      tag: { bg: '#281d24', text: '#c07ea8', border: '#382836' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.65', headingSpacing: '0.04em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '168 102 144', secondary: '171 148 163', accent: '205 168 95', background: '22 15 19', surface: '30 21 27', text: '240 230 236', border: '56 40 54' },
    },
  },

  // -------------------------------------------------------------------------
  // 27. BLEU NUIT — bibliothèque feutrée, marine profond / ivoire chaud,
  //     accent laiton. Classique et raffiné.
  // -------------------------------------------------------------------------
  {
    id: 'navy', name: 'Bleu nuit', emoji: '🌙',
    light: {
      ...STATE_LIGHT, buttonText: '#fffefa',
      successLight: '#e3eadf', warningLight: '#f1e9d2', errorLight: '#f1ddd8',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '3px', md: '6px', lg: '10px', xl: '12px', full: '9999px', button: '6px', card: '8px' },
      shadows: {
        card: '0 2px 6px rgba(26,34,54,0.08)',
        cardHover: '0 8px 22px rgba(31,58,95,0.15)',
        button: '0 1px 3px rgba(26,34,54,0.10)',
        color: 'rgba(26,34,54,0.08)', colorMedium: 'rgba(26,34,54,0.14)', colorStrong: 'rgba(26,34,54,0.24)',
      },
      header: { bg: 'rgba(245,244,239,0.85)', solid: '#f5f4ef', blur: 'blur(8px)', border: '#d8d4c6', text: '#1a2236', shadow: '0 1px 0 #d8d4c6' },
      bg: '#f5f4ef', bgSecondary: '#eae8df', card: '#fffefa', cardSecondary: '#eeece3', cardHover: '#e3e0d2',
      text: '#1a2236', textSecondary: '#4a536b', textLight: '#828aa0',
      border: '#d8d4c6', borderLight: '#e8e4d8',
      primary: '#1f3a5f', primaryHover: '#162944', secondary: '#5a6478', secondaryHover: '#475062', accent: '#b08d57',
      tag: { bg: '#eae8df', text: '#1f3a5f', border: '#d8d4c6' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.68', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '31 58 95', secondary: '90 100 120', accent: '176 141 87', background: '245 244 239', surface: '255 254 250', text: '26 34 54', border: '216 212 198' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#0c111c',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '3px', md: '6px', lg: '10px', xl: '12px', full: '9999px', button: '6px', card: '8px' },
      shadows: {
        card: '0 2px 6px rgba(0,0,0,0.5)',
        cardHover: '0 8px 22px rgba(94,132,184,0.22)',
        button: '0 1px 3px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(12,17,28,0.9)', solid: '#0c111c', blur: 'blur(8px)', border: '#283346', text: '#e9ecf4', shadow: '0 1px 0 #283346' },
      bg: '#0c111c', bgSecondary: '#121826', card: '#131a2a', cardSecondary: '#1b2334', cardHover: '#243049',
      text: '#e9ecf4', textSecondary: '#adb6c9', textLight: '#7c8598',
      border: '#283346', borderLight: '#1b2334',
      primary: '#5e84b8', primaryHover: '#7a9ccb', secondary: '#8893a8', secondaryHover: '#a0aabd', accent: '#cba76b',
      tag: { bg: '#1b2334', text: '#7a9ccb', border: '#283346' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.68', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '94 132 184', secondary: '136 147 168', accent: '203 167 107', background: '12 17 28', surface: '19 26 42', text: '233 236 244', border: '40 51 70' },
    },
  },

  // -------------------------------------------------------------------------
  // 28. FORÊT PROFONDE — vert pin / ivoire, accent laiton. Naturel et
  //     intemporel, plus profond que le sauge.
  // -------------------------------------------------------------------------
  {
    id: 'forest', name: 'Forêt profonde', emoji: '🌲',
    light: {
      ...STATE_LIGHT, buttonText: '#fcfdf9',
      successLight: '#e0ebde', warningLight: '#f1e9cf', errorLight: '#f1ddd6',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '4px', md: '8px', lg: '12px', xl: '14px', full: '9999px', button: '8px', card: '10px' },
      shadows: {
        card: '0 2px 6px rgba(24,36,25,0.08)',
        cardHover: '0 8px 22px rgba(44,81,66,0.15)',
        button: '0 1px 3px rgba(24,36,25,0.10)',
        color: 'rgba(24,36,25,0.08)', colorMedium: 'rgba(24,36,25,0.13)', colorStrong: 'rgba(24,36,25,0.22)',
      },
      header: { bg: 'rgba(242,244,238,0.85)', solid: '#f2f4ee', blur: 'blur(8px)', border: '#cfd8c9', text: '#182419', shadow: '0 1px 0 #cfd8c9' },
      bg: '#f2f4ee', bgSecondary: '#e6ebe0', card: '#fcfdf9', cardSecondary: '#ebf0e6', cardHover: '#dfe7d8',
      text: '#182419', textSecondary: '#46584a', textLight: '#7d8b7e',
      border: '#cfd8c9', borderLight: '#e2e8db',
      primary: '#2c5142', primaryHover: '#213f33', secondary: '#5b7a64', secondaryHover: '#496351', accent: '#b08a3e',
      tag: { bg: '#e6ebe0', text: '#2c5142', border: '#cfd8c9' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '44 81 66', secondary: '91 122 100', accent: '176 138 62', background: '242 244 238', surface: '252 253 249', text: '24 36 25', border: '207 216 201' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#0b130d',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '4px', md: '8px', lg: '12px', xl: '14px', full: '9999px', button: '8px', card: '10px' },
      shadows: {
        card: '0 2px 6px rgba(0,0,0,0.5)',
        cardHover: '0 8px 22px rgba(95,144,114,0.22)',
        button: '0 1px 3px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(11,19,13,0.9)', solid: '#0b130d', blur: 'blur(8px)', border: '#283729', text: '#e7efe6', shadow: '0 1px 0 #283729' },
      bg: '#0b130d', bgSecondary: '#111b14', card: '#121d15', cardSecondary: '#1a261d', cardHover: '#243228',
      text: '#e7efe6', textSecondary: '#aabfae', textLight: '#7c8d7f',
      border: '#283729', borderLight: '#1a261d',
      primary: '#5f9072', primaryHover: '#79a98b', secondary: '#87a591', secondaryHover: '#9fbaa8', accent: '#c9a559',
      tag: { bg: '#1a261d', text: '#79a98b', border: '#283729' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '95 144 114', secondary: '135 165 145', accent: '201 165 89', background: '11 19 13', surface: '18 29 21', text: '231 239 230', border: '40 55 41' },
    },
  },

  // -------------------------------------------------------------------------
  // 29. BORDEAUX — vin profond / parchemin, accent or. Chaleureux et
  //     élégant, registre « cave / reliure ».
  // -------------------------------------------------------------------------
  {
    id: 'bordeaux', name: 'Bordeaux', emoji: '🍷',
    light: {
      ...STATE_LIGHT, buttonText: '#fffbf6',
      successLight: '#e3eadd', warningLight: '#f3e7cf', errorLight: '#f2dcd6',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '3px', md: '6px', lg: '10px', xl: '12px', full: '9999px', button: '6px', card: '8px' },
      shadows: {
        card: '0 2px 6px rgba(42,26,28,0.08)',
        cardHover: '0 8px 22px rgba(122,47,58,0.16)',
        button: '0 1px 3px rgba(42,26,28,0.10)',
        color: 'rgba(42,26,28,0.08)', colorMedium: 'rgba(42,26,28,0.13)', colorStrong: 'rgba(42,26,28,0.22)',
      },
      header: { bg: 'rgba(247,242,238,0.85)', solid: '#f7f2ee', blur: 'blur(8px)', border: '#e0cdc4', text: '#2a1a1c', shadow: '0 1px 0 #e0cdc4' },
      bg: '#f7f2ee', bgSecondary: '#efe4dd', card: '#fffbf6', cardSecondary: '#f3e7df', cardHover: '#ecd9cd',
      text: '#2a1a1c', textSecondary: '#6a5450', textLight: '#9c847f',
      border: '#e0cdc4', borderLight: '#eaddd4',
      primary: '#7a2f3a', primaryHover: '#642430', secondary: '#7d645a', secondaryHover: '#66514a', accent: '#b0883f',
      tag: { bg: '#efe4dd', text: '#642430', border: '#e0cdc4' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.68', headingSpacing: '0.02em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '122 47 58', secondary: '125 100 90', accent: '176 136 63', background: '247 242 238', surface: '255 251 246', text: '42 26 28', border: '224 205 196' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#170e10',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '3px', md: '6px', lg: '10px', xl: '12px', full: '9999px', button: '6px', card: '8px' },
      shadows: {
        card: '0 2px 6px rgba(0,0,0,0.5)',
        cardHover: '0 8px 22px rgba(176,87,103,0.22)',
        button: '0 1px 3px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(23,14,16,0.9)', solid: '#170e10', blur: 'blur(8px)', border: '#3a2a2c', text: '#f1e6e4', shadow: '0 1px 0 #3a2a2c' },
      bg: '#170e10', bgSecondary: '#1f1316', card: '#201418', cardSecondary: '#2a1c20', cardHover: '#37262a',
      text: '#f1e6e4', textSecondary: '#cbb0ac', textLight: '#997f7b',
      border: '#3a2a2c', borderLight: '#2a1c20',
      primary: '#b05767', primaryHover: '#c66f7e', secondary: '#b1968a', secondaryHover: '#c8ada0', accent: '#cda45c',
      tag: { bg: '#2a1c20', text: '#c66f7e', border: '#3a2a2c' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.68', headingSpacing: '0.02em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '176 87 103', secondary: '177 150 138', accent: '205 164 92', background: '23 14 16', surface: '32 20 24', text: '241 230 228', border: '58 42 44' },
    },
  },

  // -------------------------------------------------------------------------
  // 30. GRAPHITE — monochrome gris froid, minimal, accent bleu doux.
  //     Neutre et net, registre « studio / architecture ».
  // -------------------------------------------------------------------------
  {
    id: 'graphite', name: 'Graphite', emoji: '🪨',
    light: {
      ...STATE_LIGHT,
      successLight: '#e0e9e4', warningLight: '#eee7d4', errorLight: '#f0ddd9',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '3px', md: '6px', lg: '9px', xl: '12px', full: '9999px', button: '6px', card: '8px' },
      shadows: {
        card: '0 2px 6px rgba(32,36,42,0.07)',
        cardHover: '0 8px 20px rgba(32,36,42,0.13)',
        button: '0 1px 3px rgba(32,36,42,0.09)',
        color: 'rgba(32,36,42,0.07)', colorMedium: 'rgba(32,36,42,0.12)', colorStrong: 'rgba(32,36,42,0.20)',
      },
      header: { bg: 'rgba(244,245,246,0.85)', solid: '#f4f5f6', blur: 'blur(10px)', border: '#d6d9dd', text: '#20242a', shadow: '0 1px 0 #d6d9dd' },
      bg: '#f4f5f6', bgSecondary: '#e9ebed', card: '#ffffff', cardSecondary: '#eef0f2', cardHover: '#e3e6e9',
      text: '#20242a', textSecondary: '#565d66', textLight: '#888f99',
      border: '#d6d9dd', borderLight: '#e8eaed',
      primary: '#3a4047', primaryHover: '#2a2f35', secondary: '#646b74', secondaryHover: '#515862', accent: '#5b7fb0',
      tag: { bg: '#e9ebed', text: '#3a4047', border: '#d6d9dd' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.65', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '58 64 71', secondary: '100 107 116', accent: '91 127 176', background: '244 245 246', surface: '255 255 255', text: '32 36 42', border: '214 217 221' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#121417',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '3px', md: '6px', lg: '9px', xl: '12px', full: '9999px', button: '6px', card: '8px' },
      shadows: {
        card: '0 2px 6px rgba(0,0,0,0.5)',
        cardHover: '0 8px 22px rgba(122,155,208,0.18)',
        button: '0 1px 3px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(18,20,23,0.9)', solid: '#121417', blur: 'blur(10px)', border: '#2d3239', text: '#e9ebee', shadow: '0 1px 0 #2d3239' },
      bg: '#121417', bgSecondary: '#191c20', card: '#1a1d21', cardSecondary: '#23272c', cardHover: '#2e333a',
      text: '#e9ebee', textSecondary: '#b0b6bd', textLight: '#7f868e',
      border: '#2d3239', borderLight: '#23272c',
      primary: '#9aa3ad', primaryHover: '#b4bcc5', secondary: '#878f99', secondaryHover: '#9fa7b0', accent: '#7a9bd0',
      tag: { bg: '#23272c', text: '#b4bcc5', border: '#2d3239' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1', lineHeight: '1.65', headingSpacing: 'normal', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '154 163 173', secondary: '135 143 153', accent: '122 155 208', background: '18 20 23', surface: '26 29 33', text: '233 235 238', border: '45 50 57' },
    },
  },

  // -------------------------------------------------------------------------
  // 31. CHAMPAGNE — beige doré clair et aéré, accent ardoise douce.
  //     Lumineux et minimal, registre « papeterie haut de gamme ».
  // -------------------------------------------------------------------------
  {
    id: 'champagne', name: 'Champagne', emoji: '🌾',
    light: {
      ...STATE_LIGHT, buttonText: '#fffdf7',
      successLight: '#e4eadd', warningLight: '#f1e9d0', errorLight: '#f1ddd6',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '5px', md: '9px', lg: '13px', xl: '16px', full: '9999px', button: '9px', card: '12px' },
      shadows: {
        card: '0 2px 6px rgba(43,38,29,0.07)',
        cardHover: '0 8px 22px rgba(138,116,73,0.15)',
        button: '0 1px 3px rgba(43,38,29,0.09)',
        color: 'rgba(43,38,29,0.07)', colorMedium: 'rgba(43,38,29,0.12)', colorStrong: 'rgba(43,38,29,0.20)',
      },
      header: { bg: 'rgba(246,243,236,0.85)', solid: '#f6f3ec', blur: 'blur(8px)', border: '#ddd3bf', text: '#2b261d', shadow: '0 1px 0 #ddd3bf' },
      bg: '#f6f3ec', bgSecondary: '#ece6da', card: '#fffdf7', cardSecondary: '#f1ebde', cardHover: '#e6ddca',
      text: '#2b261d', textSecondary: '#655d4c', textLight: '#988e78',
      border: '#ddd3bf', borderLight: '#eae2d2',
      primary: '#8a7449', primaryHover: '#6f5d39', secondary: '#9b8a6a', secondaryHover: '#837457', accent: '#6d7785',
      tag: { bg: '#ece6da', text: '#6f5d39', border: '#ddd3bf' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: '0.03em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '138 116 73', secondary: '155 138 106', accent: '109 119 133', background: '246 243 236', surface: '255 253 247', text: '43 38 29', border: '221 211 191' },
    },
    dark: {
      ...STATE_DARK, buttonText: '#15130d',
      fonts: { heading: "'Cormorant Garamond', serif", body: "'Lora', serif" },
      radii: { sm: '5px', md: '9px', lg: '13px', xl: '16px', full: '9999px', button: '9px', card: '12px' },
      shadows: {
        card: '0 2px 6px rgba(0,0,0,0.5)',
        cardHover: '0 8px 22px rgba(194,168,117,0.20)',
        button: '0 1px 3px rgba(0,0,0,0.5)',
        color: 'rgba(0,0,0,0.5)', colorMedium: 'rgba(0,0,0,0.6)', colorStrong: 'rgba(0,0,0,0.7)',
      },
      header: { bg: 'rgba(21,19,13,0.9)', solid: '#15130d', blur: 'blur(8px)', border: '#353022', text: '#f0ead9', shadow: '0 1px 0 #353022' },
      bg: '#15130d', bgSecondary: '#1c1912', card: '#1d1a13', cardSecondary: '#26221a', cardHover: '#322d22',
      text: '#f0ead9', textSecondary: '#c6bca6', textLight: '#948a72',
      border: '#353022', borderLight: '#26221a',
      primary: '#c2a875', primaryHover: '#d6bd8d', secondary: '#b0a081', secondaryHover: '#c6b797', accent: '#93a0ae',
      tag: { bg: '#26221a', text: '#d6bd8d', border: '#353022' },
      layout: { containerMax: '100%', contentPad: '2rem', fontScale: '1.05', lineHeight: '1.7', headingSpacing: '0.03em', headingTransform: 'none', headingWeight: '600' },
      tw: { primary: '194 168 117', secondary: '176 160 129', accent: '147 160 174', background: '21 19 13', surface: '29 26 19', text: '240 234 217', border: '53 48 34' },
    },
  },
];

// =============================================================================
// EXPORTS
// =============================================================================

export const themes = Object.fromEntries(
  STYLES.map((st) => [
    st.id,
    {
      meta: { id: st.id, name: st.name, emoji: st.emoji },
      light: build(st.light),
      dark: build(st.dark),
    },
  ])
);

export const styleList = STYLES.map((st) => ({ id: st.id, name: st.name, emoji: st.emoji }));

export const defaultStyleId = 'navy';

// Compat ascendante : certains anciens imports attendent ces noms.
export const lightTheme = themes.classic.light;
export const darkTheme = themes.classic.dark;
