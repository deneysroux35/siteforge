export const theme = {
  colors: {
    background: '#0f1115',
    surface: '#15191f',
    surfaceAlt: '#111419',
    surfaceHover: '#20242b',

    border: '#303641',
    borderSoft: '#292f38',

    text: '#ffffff',
    textSecondary: '#b7bec8',
    textMuted: '#68717d',

    accent: '#39ff14',
    info: '#4fc3f7',
    warning: '#ffd54f',
    danger: '#ff6b6b',
    purple: '#b388ff',

    successBackground: '#173619',
    warningBackground: '#33230f',
    dangerBackground: '#321a1a',
  },

  radius: {
    small: 6,
    medium: 8,
    large: 10,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },

  font: {
    family: 'Segoe UI, sans-serif',

    size: {
      xs: 8,
      sm: 10,
      md: 12,
      lg: 16,
      xl: 22,
    },

    weight: {
      normal: 400,
      medium: 600,
      bold: 800,
      heavy: 900,
    },
  },
} as const

export type SiteForgeTheme = typeof theme

export default theme
