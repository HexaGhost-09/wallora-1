import React from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();

  // Placeholder categories
  const categories = [
    { id: "1", name: "Abstract", icon: "sparkles" },
    { id: "2", name: "Nature", icon: "leaf.fill" },
    { id: "3", name: "Cityscape", icon: "building.2.fill" },
    { id: "4", name: "Geometric", icon: "square.grid.3x3.fill" },
    { id: "5", name: "Minimalist", icon: "minus.rectangle.fill" },
    { id: "6", name: "Space", icon: "globe.americas.fill" },
    { id: "7", name: "Animals", icon: "paw.fill" },
    { id: "8", name: "Cars", icon: "car.fill" },
    { id: "9", name: "Food", icon: "fork.knife" },
    { id: "10", name: "Art", icon: "paintbrush.fill" },
  ];

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryCard}>
      <IconSymbol
        name={item.icon}
        size={40}
        color={Colors[colorScheme ?? "light"].tint}
      />
      <ThemedText type="subtitle" style={styles.categoryText}>
        {item.name}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{
        light: Colors.light.background,
        dark: Colors.dark.background,
      }}
      headerImage={
        <IconSymbol
          size={250}
          color={Colors[colorScheme ?? "light"].tint}
          name="square.grid.2x2.fill"
          style={styles.headerIcon}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Categories</ThemedText>
      </ThemedView>

      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    backgroundColor: "transparent",
  },
  headerIcon: {
    alignSelf: "center",
    marginTop: 20,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.cardBackground, // Use a themed background for cards
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    aspectRatio: 1, // Make cards square
  },
  categoryText: {
    marginTop: 10,
    textAlign: "center",
  },
});
