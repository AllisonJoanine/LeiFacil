/**
 * Tema e Identidade Visual do LeiFácil
 * Cores e estilos padronizados para todo o aplicativo
 */

export const Colors = {
  // Cores Primárias
  primary: {
    navy: '#1e3a8a',      // Azul-marinho principal
    blue: '#2563eb',      // Azul médio
    lightBlue: '#3b82f6', // Azul claro
    gold: '#fbbf24',      // Dourado (destaque Premium)
  },

  // Cores Neutras - Modo Claro
  light: {
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    disabled: '#d1d5db',
  },

  // Cores Neutras - Modo Escuro
  dark: {
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    border: '#374151',
    disabled: '#4b5563',
  },

  // Cores de Status
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Cores de Overlay
  overlay: {
    light: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.7)',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 42,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

/**
 * Retorna as cores do tema baseado no modo (claro/escuro)
 */
export function getThemeColors(isDark: boolean) {
  return {
    background: isDark ? Colors.dark.background : Colors.light.background,
    surface: isDark ? Colors.dark.surface : Colors.light.surface,
    text: isDark ? Colors.dark.text : Colors.light.text,
    textSecondary: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
    border: isDark ? Colors.dark.border : Colors.light.border,
    primary: Colors.primary.navy,
    accent: Colors.primary.gold,
  };
}
