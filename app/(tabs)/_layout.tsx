import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";

import { HapticTab } from "@/components/HapticTab";
// Removed: import { IconSymbol } from "@/components/ui/IconSymbol";
// Removed: import TabBarBackground from "@/components/ui/TabBarBackground"; // This line is now removed
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        // Removed: tabBarBackground: TabBarBackground, // This line is now removed
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
            backgroundColor: colors.surface, // TabBarBackground was providing this, ensure it's here
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
          },
          default: {
            backgroundColor: colors.surface, // TabBarBackground was providing this, ensure it's here
            borderTopColor: colors.border,
            borderTopWidth: 0.5,
            elevation: 8,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },
        }),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        tabBarItemStyle: {
          paddingVertical: 8,
          height: 70,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Wallpapers",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>🖼️</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 24 }}>📁</Text>
          ),
        }}
      />
    </Tabs>
  );
}
