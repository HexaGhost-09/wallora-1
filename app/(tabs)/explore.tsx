import React, { useState, useEffect } from "react";
import { StyleSheet, FlatList, TouchableOpacity, StatusBar, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ModernCard } from "@/components/ui/ModernCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { api, Category } from "@/services/api";

export default function ExploreScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

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

      {/* Categories List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading categories...
          </ThemedText>
        </View>
      ) : (
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
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
});