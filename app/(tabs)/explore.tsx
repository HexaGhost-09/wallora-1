import React, { useState } from "react";
import { StyleSheet, FlatList, TouchableOpacity, StatusBar } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ModernCard } from "@/components/ui/ModernCard";
import { SearchBar } from "@/components/ui/SearchBar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { 
      id: "1", 
      name: "Abstract", 
      icon: "sparkles", 
      count: 245,
      gradient: ['#667eea', '#764ba2'],
      description: "Artistic and creative designs"
    },
    { 
      id: "2", 
      name: "Nature", 
      icon: "leaf.fill", 
      count: 189,
      gradient: ['#11998e', '#38ef7d'],
      description: "Landscapes and natural beauty"
    },
    { 
      id: "3", 
      name: "Urban", 
      icon: "building.2.fill", 
      count: 156,
      gradient: ['#2193b0', '#6dd5ed'],
      description: "City life and architecture"
    },
    { 
      id: "4", 
      name: "Geometric", 
      icon: "square.grid.3x3.fill", 
      count: 134,
      gradient: ['#ee9ca7', '#ffdde1'],
      description: "Patterns and shapes"
    },
    { 
      id: "5", 
      name: "Minimalist", 
      icon: "minus.rectangle.fill", 
      count: 98,
      gradient: ['#bdc3c7', '#2c3e50'],
      description: "Clean and simple designs"
    },
    { 
      id: "6", 
      name: "Space", 
      icon: "globe.americas.fill", 
      count: 87,
      gradient: ['#0f0c29', '#24243e'],
      description: "Cosmic and stellar imagery"
    },
    { 
      id: "7", 
      name: "Animals", 
      icon: "paw.fill", 
      count: 76,
      gradient: ['#f093fb', '#f5576c'],
      description: "Wildlife and pets"
    },
    { 
      id: "8", 
      name: "Technology", 
      icon: "cpu.fill", 
      count: 65,
      gradient: ['#4facfe', '#00f2fe'],
      description: "Digital and tech themes"
    },
  ];

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategoryItem = ({ item, index }) => (
    <ModernCard 
      onPress={() => {/* Navigate to category */}}
      style={[
        styles.categoryCard,
        { backgroundColor: colors.cardBackground }
      ]}
      variant="elevated"
    >
      <ThemedView style={[
        styles.iconContainer,
        { backgroundColor: colors.tintLight }
      ]}>
        <IconSymbol
          name={item.icon}
          size={28}
          color={colors.tint}
        />
      </ThemedView>
      
      <ThemedView style={styles.categoryContent}>
        <ThemedText type="subtitle" style={styles.categoryName}>
          {item.name}
        </ThemedText>
        <ThemedText style={[styles.categoryDescription, { color: colors.textSecondary }]}>
          {item.description}
        </ThemedText>
        <ThemedText style={[styles.categoryCount, { color: colors.tint }]}>
          {item.count} wallpapers
        </ThemedText>
      </ThemedView>

      <IconSymbol
        name="chevron.right"
        size={16}
        color={colors.iconSecondary}
      />
    </ModernCard>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <ThemedView style={[styles.header, { backgroundColor: colors.background }]}>
        <ThemedView style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            Categories
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Explore wallpapers by theme
          </ThemedText>
        </ThemedView>
      </ThemedView>

      {/* Search Bar */}
      <SearchBar 
        placeholder="Search categories..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* Stats */}
      <ThemedView style={styles.statsContainer}>
        <ModernCard style={styles.statCard} variant="outlined">
          <ThemedText style={[styles.statNumber, { color: colors.tint }]}>
            {filteredCategories.length}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Categories
          </ThemedText>
        </ModernCard>
      </ThemedView>

      {/* Categories List */}
      <FlatList
        data={filteredCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    marginBottom: 6,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: '500',
  },
});