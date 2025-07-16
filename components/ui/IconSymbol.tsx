// Enhanced fallback for using MaterialIcons on Android and web with more comprehensive mappings

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Comprehensive SF Symbols to Material Icons mappings
 */
const MAPPING = {
  // Navigation
  'house.fill': 'home',
  'house': 'home-outlined',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  
  // Media & Photos
  'photo.fill': 'photo',
  'photo': 'photo-outlined',
  'photo.fill.on.rectangle.fill': 'collections',
  'camera.fill': 'camera-alt',
  'camera': 'camera-alt-outlined',
  'video.fill': 'videocam',
  'video': 'videocam-outlined',
  
  // Grid & Layout
  'square.grid.2x2.fill': 'grid-view',
  'square.grid.2x2': 'grid-on',
  'square.grid.3x3.fill': 'apps',
  'square.grid.3x3': 'grid-3x3',
  'rectangle.grid.1x2.fill': 'view-column',
  'list.bullet': 'list',
  
  // Actions & Controls
  'magnifyingglass': 'search',
  'xmark': 'close',
  'xmark.circle.fill': 'cancel',
  'plus': 'add',
  'minus': 'remove',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'star.fill': 'star',
  'star': 'star-border',
  
  // Sharing & Communication
  'square.and.arrow.up': 'share',
  'square.and.arrow.up.fill': 'share',
  'paperplane.fill': 'send',
  'envelope.fill': 'email',
  'phone.fill': 'phone',
  
  // Settings & Tools
  'gear': 'settings',
  'gear.fill': 'settings',
  'wrench.fill': 'build',
  'slider.horizontal.3': 'tune',
  'paintbrush.fill': 'brush',
  
  // Nature & Objects
  'leaf.fill': 'eco',
  'globe.americas.fill': 'public',
  'building.2.fill': 'business',
  'car.fill': 'directions-car',
  'paw.fill': 'pets',
  'cpu.fill': 'memory',
  
  // Shapes & Symbols
  'sparkles': 'auto-awesome',
  'minus.rectangle.fill': 'crop-din',
  'circle.fill': 'circle',
  'square.fill': 'crop-square',
  'triangle.fill': 'change-history',
  
  // Status & Indicators
  'checkmark': 'check',
  'checkmark.circle.fill': 'check-circle',
  'exclamationmark.triangle.fill': 'warning',
  'info.circle.fill': 'info',
  'bell.fill': 'notifications',
  'bell': 'notifications-none',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const materialIconName = MAPPING[name];
  
  if (!materialIconName) {
    console.warn(`IconSymbol: No mapping found for "${name}". Using default icon.`);
    return <MaterialIcons color={color} size={size} name="help-outline" style={style} />;
  }
  
  return <MaterialIcons color={color} size={size} name={materialIconName} style={style} />;
}