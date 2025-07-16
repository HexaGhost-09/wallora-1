import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onChangeText?: (text: string) => void;
  value?: string;
}

export function SearchBar({ 
  placeholder = "Search wallpapers...", 
  onSearch, 
  onChangeText,
  value 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value || '');
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleChangeText = (text: string) => {
    setSearchQuery(text);
    onChangeText?.(text);
  };

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onChangeText?.('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
      <IconSymbol 
        name="magnifyingglass" 
        size={20} 
        color={colors.iconSecondary} 
        style={styles.searchIcon}
      />
      <TextInput
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={searchQuery}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
          <IconSymbol 
            name="xmark.circle.fill" 
            size={18} 
            color={colors.iconSecondary} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 20,
  },
  clearButton: {
    padding: 4,
  },
});