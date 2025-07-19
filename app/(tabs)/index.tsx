import React from "react";
import { StyleSheet, StatusBar } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

/**
 * A simple home screen component that displays "Hello World".
 * This component demonstrates a basic structure for an Expo app screen.
 */
export default function HomeScreen() {
  // Determine the current color scheme (light or dark)
  const colorScheme = useColorScheme();
  // Get the appropriate colors based on the color scheme
  const colors = Colors[colorScheme ?? "light"];

  return (
    // ThemedView provides a background that adapts to the color scheme
    <ThemedView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* StatusBar component to control the status bar style */}
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      {/* ThemedText component for text that adapts to the color scheme */}
      <ThemedText type="title" style={styles.helloText}>
        Hello World {/* Changed from "Hello" to "Hello World" */}
      </ThemedText>
    </ThemedView>
  );
}

// Styles for the HomeScreen component
const styles = StyleSheet.create({
  container: {
    flex: 1, // Takes up the entire available space
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
  },
  helloText: {
    fontSize: 48, // Large font size for visibility
    fontWeight: "bold", // Bold font weight
  },
});
