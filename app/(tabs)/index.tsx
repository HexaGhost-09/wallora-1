import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  View,
  StatusBar,
} from "react-native";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ModernCard } from "@/components/ui/ModernCard";
import { ModernButton } from "@/components/ui/ModernButton";
import { SearchBar } from "@/components/ui/SearchBar";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");
const IMAGE_SIZE = (width - 48) / 2;

export default function HomeScreen() {
  const wallpapers = [
    {
      id: "1",
      uri: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg",
      thumbnail: "https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?w=300&h=400&fit=crop",
      title: "Abstract Waves",
      category: "Abstract",
    },
    {
      id: "2",
      uri: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",
      thumbnail: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?w=300&h=400&fit=crop",
      title: "Mountain Vista",
      category: "Nature",
    },
    {
      id: "3",
      uri: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg",
      thumbnail: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?w=300&h=400&fit=crop",
      title: "City Lights",
      category: "Urban",
    },
    {
      id: "4",
      uri: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg",
      thumbnail: "https://images.pexels.com/photos/1323712/pexels-photo-1323712.jpeg?w=300&h=400&fit=crop",
      title: "Ocean Sunset",
      category: "Nature",
    },
    {
      id: "5",
      uri: "https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg",
      thumbnail: "https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?w=300&h=400&fit=crop",
      title: "Geometric Pattern",
      category: "Abstract",
    },
    {
      id: "6",
      uri: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg",
      thumbnail: "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?w=300&h=400&fit=crop",
      title: "Space Nebula",
      category: "Space",
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const filteredWallpapers = wallpapers.filter(wallpaper =>
    wallpaper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    wallpaper.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const shareImage = async () => {
    if (selectedImage) {
      try {
        const filename = selectedImage.uri.split("/").pop();
        const fileUri = FileSystem.cacheDirectory + filename;
        await FileSystem.downloadAsync(selectedImage.uri, fileUri);
        await Sharing.shareAsync(fileUri);
      } catch (error) {
        console.error("Failed to share image:", error);
      }
    }
  };

  const renderItem = ({ item }) => (
    <ModernCard 
      onPress={() => openImage(item)} 
      style={styles.imageCard}
      variant="elevated"
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.image}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.imageOverlay}>
        <ThemedText style={styles.imageTitle} numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText style={[styles.imageCategory, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.category}
        </ThemedText>
      </View>
    </ModernCard>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <View style={styles.headerContent}>
          <ThemedText type="title" style={styles.headerTitle}>
            Wallora
          </ThemedText>
          <ThemedText style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Discover beautiful wallpapers
          </ThemedText>
        </View>
      </View>

      {/* Search Bar */}
      <SearchBar 
        placeholder="Search wallpapers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      {/* Stats */}
      <View style={styles.statsContainer}>
        <ModernCard style={styles.statCard} variant="outlined">
          <ThemedText style={[styles.statNumber, { color: colors.tint }]}>
            {filteredWallpapers.length}
          </ThemedText>
          <ThemedText style={[styles.statLabel, { color: colors.textSecondary }]}>
            Wallpapers
          </ThemedText>
        </ModernCard>
      </View>

      {/* Wallpapers Grid */}
      <FlatList
        data={filteredWallpapers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Full-screen Modal */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        onRequestClose={closeImage}
        animationType="fade"
        statusBarTranslucent
      >
        <View style={[styles.fullScreenModal, { backgroundColor: colors.overlay }]}>
          {/* Header Controls */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={closeImage} style={styles.modalButton}>
              <IconSymbol name="xmark" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.modalTitleContainer}>
              {selectedImage && (
                <>
                  <ThemedText style={styles.modalTitle}>
                    {selectedImage.title}
                  </ThemedText>
                  <ThemedText style={styles.modalCategory}>
                    {selectedImage.category}
                  </ThemedText>
                </>
              )}
            </View>
            <View style={{ width: 44 }} />
          </View>

          {/* Image */}
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.fullScreenImage}
              contentFit="contain"
            />
          )}

          {/* Bottom Controls */}
          <View style={styles.modalFooter}>
            <ModernButton
              title="Share"
              onPress={shareImage}
              variant="primary"
              icon={<IconSymbol name="square.and.arrow.up" size={20} color="#fff" />}
            />
          </View>
        </View>
      </Modal>
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
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  imageCard: {
    flex: 1,
    margin: 6,
    padding: 0,
    overflow: 'hidden',
    aspectRatio: 3 / 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  imageTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  imageCategory: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  fullScreenModal: {
    flex: 1,
    justifyContent: 'space-between',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  modalButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalCategory: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 2,
  },
  fullScreenImage: {
    flex: 1,
    marginHorizontal: 16,
  },
  modalFooter: {
    paddingHorizontal: 16,
    paddingBottom: 50,
    alignItems: 'center',
  },
});