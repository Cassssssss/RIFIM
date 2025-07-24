/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // Utilise la classe 'dark' pour le mode sombre
  theme: {
    extend: {
      // Breakpoints responsive personnalisés
      screens: {
        'xs': '475px',      // Extra small devices
        'sm': '640px',      // Small devices (landscape phones)
        'md': '768px',      // Medium devices (tablets)
        'lg': '1024px',     // Large devices (desktops)
        'xl': '1280px',     // Extra large devices
        '2xl': '1536px',    // 2X Extra large devices
        
        // Breakpoints personnalisés pour mobile
        'mobile': {'max': '767px'},
        'tablet': {'min': '768px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
        
        // Breakpoints pour orientation
        'portrait': {'raw': '(orientation: portrait)'},
        'landscape': {'raw': '(orientation: landscape)'},
        
        // Breakpoints pour dispositifs tactiles
        'touch': {'raw': '(hover: none) and (pointer: coarse)'},
        'no-touch': {'raw': '(hover: hover) and (pointer: fine)'},
      },
      
      // Couleurs personnalisées pour le thème
      colors: {
        primary: {
          50: 'rgb(var(--color-primary) / 0.05)',
          100: 'rgb(var(--color-primary) / 0.1)',
          200: 'rgb(var(--color-primary) / 0.2)',
          300: 'rgb(var(--color-primary) / 0.3)',
          400: 'rgb(var(--color-primary) / 0.4)',
          500: 'rgb(var(--color-primary) / 0.5)',
          600: 'rgb(var(--color-primary) / 0.6)',
          700: 'rgb(var(--color-primary) / 0.7)',
          800: 'rgb(var(--color-primary) / 0.8)',
          900: 'rgb(var(--color-primary) / 0.9)',
          DEFAULT: 'rgb(var(--color-primary))',
        },
        secondary: {
          50: 'rgb(var(--color-secondary) / 0.05)',
          100: 'rgb(var(--color-secondary) / 0.1)',
          200: 'rgb(var(--color-secondary) / 0.2)',
          300: 'rgb(var(--color-secondary) / 0.3)',
          400: 'rgb(var(--color-secondary) / 0.4)',
          500: 'rgb(var(--color-secondary) / 0.5)',
          600: 'rgb(var(--color-secondary) / 0.6)',
          700: 'rgb(var(--color-secondary) / 0.7)',
          800: 'rgb(var(--color-secondary) / 0.8)',
          900: 'rgb(var(--color-secondary) / 0.9)',
          DEFAULT: 'rgb(var(--color-secondary))',
        },
        accent: {
          50: 'rgb(var(--color-accent) / 0.05)',
          100: 'rgb(var(--color-accent) / 0.1)',
          200: 'rgb(var(--color-accent) / 0.2)',
          300: 'rgb(var(--color-accent) / 0.3)',
          400: 'rgb(var(--color-accent) / 0.4)',
          500: 'rgb(var(--color-accent) / 0.5)',
          600: 'rgb(var(--color-accent) / 0.6)',
          700: 'rgb(var(--color-accent) / 0.7)',
          800: 'rgb(var(--color-accent) / 0.8)',
          900: 'rgb(var(--color-accent) / 0.9)',
          DEFAULT: 'rgb(var(--color-accent))',
        },
        background: 'rgb(var(--color-background))',
        surface: 'rgb(var(--color-surface))',
        text: 'rgb(var(--color-text))',
      },
      
      // Espacement personnalisé pour mobile
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Hauteurs personnalisées pour mobile
      height: {
        'screen-safe': ['100vh', '100dvh'],
        'screen-small': ['100vh', '100svh'],
        'screen-dynamic': ['100vh', '100dvh'],
      },
      
      // Largeurs minimales pour mobile
      minHeight: {
        'screen-safe': ['100vh', '100dvh'],
        'touch': '44px',
      },
      
      // Tailles de police responsive
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        
        // Tailles spécifiques mobile
        'mobile-xs': ['0.625rem', { lineHeight: '0.875rem' }],
        'mobile-sm': ['0.75rem', { lineHeight: '1rem' }],
        'mobile-base': ['0.875rem', { lineHeight: '1.25rem' }],
        'mobile-lg': ['1rem', { lineHeight: '1.5rem' }],
      },
      
      // Rayons de bordure
      borderRadius: {
        'mobile': '0.5rem',
        'mobile-lg': '0.75rem',
      },
      
      // Animations personnalisées
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-fast': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      
      // Keyframes pour les animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      
      // Durées de transition
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '600': '600ms',
        '700': '700ms',
        '800': '800ms',
        '900': '900ms',
        '1000': '1000ms',
      },
      
      // Z-index standardisés
      zIndex: {
        'dropdown': '1000',
        'sticky': '1020',
        'fixed': '1030',
        'modal-backdrop': '1040',
        'modal': '1050',
        'popover': '1060',
        'tooltip': '1070',
        'notification': '1080',
      },
      
      // Ombres personnalisées
      boxShadow: {
        'mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'mobile-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mobile-xl': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [
    // Plugin pour les utilitaires tactiles
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Utilitaires pour les zones tactiles
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
        },
        '.touch-target-lg': {
          minHeight: '48px',
          minWidth: '48px',
        },
        
        // Utilitaires pour le scroll mobile
        '.mobile-scroll': {
          '-webkit-overflow-scrolling': 'touch',
          'overscroll-behavior': 'contain',
        },
        
        // Utilitaires pour les safe areas
        '.safe-area-padding': {
          paddingTop: 'env(safe-area-inset-top)',
          paddingRight: 'env(safe-area-inset-right)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-area-margin': {
          marginTop: 'env(safe-area-inset-top)',
          marginRight: 'env(safe-area-inset-right)',
          marginBottom: 'env(safe-area-inset-bottom)',
          marginLeft: 'env(safe-area-inset-left)',
        },
        
        // Utilitaires pour cacher les scrollbars sur mobile
        '.scrollbar-hidden': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        
        // Utilitaires pour améliorer les performances sur mobile
        '.gpu-acceleration': {
          '-webkit-transform': 'translateZ(0)',
          'transform': 'translateZ(0)',
        },
        
        // Utilitaires pour les interactions tactiles
        '.tap-highlight-none': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.touch-pan-x': {
          'touch-action': 'pan-x',
        },
        '.touch-pan-y': {
          'touch-action': 'pan-y',
        },
        
        // Utilitaires pour les hauteurs viewport
        '.h-screen-safe': {
          height: '100vh',
          height: '100dvh',
        },
        '.min-h-screen-safe': {
          minHeight: '100vh',
          minHeight: '100dvh',
        },
        
        // Utilitaires pour les layouts mobile
        '.mobile-stack': {
          '@media (max-width: 767px)': {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          },
        },
        '.mobile-full': {
          '@media (max-width: 767px)': {
            width: '100%',
          },
        },
        '.mobile-hidden': {
          '@media (max-width: 767px)': {
            display: 'none',
          },
        },
        '.mobile-only': {
          display: 'none',
          '@media (max-width: 767px)': {
            display: 'block',
          },
        },
        '.desktop-only': {
          '@media (max-width: 767px)': {
            display: 'none',
          },
        },
      }
      
      addUtilities(newUtilities, ['responsive', 'hover'])
    },
    
    // Plugin pour les composants responsive
    function({ addComponents, theme }) {
      const components = {
        // Composant container responsive
        '.container-responsive': {
          width: '100%',
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          '@media (min-width: 640px)': {
            paddingLeft: '1.5rem',
            paddingRight: '1.5rem',
          },
          '@media (min-width: 1024px)': {
            paddingLeft: '2rem',
            paddingRight: '2rem',
          },
        },
        
        // Composant bouton responsive
        '.btn-responsive': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          fontWeight: '500',
          transition: 'all 0.2s ease',
          '@media (max-width: 767px)': {
            width: '100%',
            padding: '1rem',
            fontSize: '1rem',
            minHeight: '44px',
          },
        },
        
        // Composant carte responsive
        '.card-responsive': {
          backgroundColor: theme('colors.surface'),
          borderRadius: '0.75rem',
          padding: '1.5rem',
          boxShadow: theme('boxShadow.card'),
          transition: 'all 0.3s ease',
          '@media (max-width: 767px)': {
            padding: '1rem',
            borderRadius: '0.5rem',
            boxShadow: theme('boxShadow.mobile'),
          },
        },
        
        // Composant grille responsive
        '.grid-responsive': {
          display: 'grid',
          gap: '1.5rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          '@media (max-width: 767px)': {
            gridTemplateColumns: '1fr',
            gap: '1rem',
          },
        },
      }
      
      addComponents(components)
    },
  ],
}