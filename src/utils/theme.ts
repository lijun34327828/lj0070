import type { ThemeConfig, ThemeName } from '@shared/index';

export const minimalTheme: ThemeConfig = {
  name: 'minimal',
  displayName: '极简商务',
  colors: {
    primary: '#1e3a5f',
    secondary: '#8c9bab',
    accent: '#c9a962',
    background: '#f8f9fa',
    cardBg: '#ffffff',
    text: '#1a1a2e',
    textSecondary: '#6c757d',
    border: '#e9ecef',
    grid: '#e9ecef',
    chartColors: ['#1e3a5f', '#c9a962', '#8c9bab', '#4a7c59', '#d4a574', '#6b5b95']
  },
  typography: {
    headingFont: "'Playfair Display', 'Noto Serif SC', serif",
    bodyFont: "'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif"
  },
  borderRadius: {
    sm: '2px',
    md: '4px',
    lg: '6px'
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.05)',
    md: '0 4px 12px rgba(0,0,0,0.06)',
    lg: '0 12px 32px rgba(0,0,0,0.08)'
  }
};

export const luxuryTheme: ThemeConfig = {
  name: 'luxury',
  displayName: '高端奢华',
  colors: {
    primary: '#722f37',
    secondary: '#d4af37',
    accent: '#fffff0',
    background: 'linear-gradient(135deg, #1a0a0a 0%, #2d1515 100%)',
    cardBg: 'linear-gradient(145deg, rgba(114,47,55,0.3) 0%, rgba(45,21,21,0.5) 100%)',
    text: '#fffff0',
    textSecondary: '#c9b896',
    border: 'rgba(212,175,55,0.3)',
    grid: 'rgba(212,175,55,0.15)',
    chartColors: ['#d4af37', '#722f37', '#c9b896', '#8b4513', '#daa520', '#cd853f']
  },
  typography: {
    headingFont: "'Playfair Display', 'Noto Serif SC', serif",
    bodyFont: "'Noto Serif SC', 'Times New Roman', serif"
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  shadows: {
    sm: '0 2px 8px rgba(212,175,55,0.15)',
    md: '0 8px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(212,175,55,0.1)',
    lg: '0 16px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.15)'
  }
};

export const themes: Record<ThemeName, ThemeConfig> = {
  minimal: minimalTheme,
  luxury: luxuryTheme
};

export function getTheme(themeName: ThemeName): ThemeConfig {
  return themes[themeName] || minimalTheme;
}

export function applyThemeVars(theme: ThemeConfig): void {
  const root = document.documentElement;
  
  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-background', theme.colors.background);
  root.style.setProperty('--theme-card-bg', theme.colors.cardBg);
  root.style.setProperty('--theme-text', theme.colors.text);
  root.style.setProperty('--theme-text-secondary', theme.colors.textSecondary);
  root.style.setProperty('--theme-border', theme.colors.border);
  root.style.setProperty('--theme-grid', theme.colors.grid);
  
  root.style.setProperty('--font-heading', theme.typography.headingFont);
  root.style.setProperty('--font-body', theme.typography.bodyFont);
  
  root.style.setProperty('--radius-sm', theme.borderRadius.sm);
  root.style.setProperty('--radius-md', theme.borderRadius.md);
  root.style.setProperty('--radius-lg', theme.borderRadius.lg);
  
  root.style.setProperty('--shadow-sm', theme.shadows.sm);
  root.style.setProperty('--shadow-md', theme.shadows.md);
  root.style.setProperty('--shadow-lg', theme.shadows.lg);
  
  theme.colors.chartColors.forEach((color, index) => {
    root.style.setProperty(`--chart-color-${index + 1}`, color);
  });
}
