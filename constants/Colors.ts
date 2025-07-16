/**
 * Modern color system with comprehensive color ramps and semantic tokens
 */

const tintColorLight = '#6366f1'; // Modern indigo
const tintColorDark = '#818cf8';

export const Colors = {
  light: {
    text: '#0f172a',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    surface: '#ffffff',
    surfaceSecondary: '#f8fafc',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    tint: tintColorLight,
    tintLight: '#eef2ff',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    icon: '#64748b',
    iconSecondary: '#94a3b8',
    tabIconDefault: '#94a3b8',
    tabIconSelected: tintColorLight,
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    cardBackground: '#ffffff',
  },
  dark: {
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textMuted: '#64748b',
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    border: '#334155',
    borderLight: '#475569',
    tint: tintColorDark,
    tintLight: '#312e81',
    accent: '#fbbf24',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    icon: '#cbd5e1',
    iconSecondary: '#64748b',
    tabIconDefault: '#64748b',
    tabIconSelected: tintColorDark,
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.7)',
    cardBackground: '#1e293b',
  },
};