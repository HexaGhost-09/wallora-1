import React, { useState } from "react";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = (width - 48) / 2; // Two images per row with padding

export default function HomeScreen() {
  // Static array of simple image URLs for demonstration
  const wallpapers = [
    {
      id: "1",
      uri: "https://placehold.co/600x400/FF5733/FFFFFF?text=Abstract",
      thumbnail: "https://placehold.co/150x100/FF5733/FFFFFF?text=Abstract",
    },
    {
      id: "2",
      uri: "https://placehold.co/600x400/33FF57/FFFFFF?text=Nature",
      thumbnail: "https://placehold.co/150x100/33FF57/FFFFFF?text=Nature",
    },
    {
      id: "3",
      uri: "https://placehold.co/600x400/3357FF/FFFFFF?text=Cityscape",
      thumbnail: "https://placehold.co/150x100/3357FF/FFFFFF?text=Cityscape",
    },
    {
      id: "4",
      uri: "https://placehold.co/600x400/FF33A1/FFFFFF?text=Geometric",
      thumbnail: "https://placehold.co/150x100/FF33A1/FFFFFF?text=Geometric",
    },
    {
      id: "5",
      uri: "https://placehold.co/600x400/A133FF/FFFFFF?text=Minimalist",
      thumbnail: "https://placehold.co/150x100/A133FF/FFFFFF?text=Minimalist",
    },
    {
      id: "6",
      uri: "https://placehold.co/600x400/33FFA1/FFFFFF?text=Space",
      thumbnail: "https://placehold.co/150x100/33FFA1/FFFFFF?text=Space",
    },
    {
      id: "7",
      uri: "https://placehold.co/600x400/FF8C33/FFFFFF?text=Animals",
      thumbnail: "https://placehold.co/150x100/FF8C33/FFFFFF?text=Animals",
    },
    {
      id: "8",
      uri: "https://placehold.co/600x400/33A1FF/FFFFFF?text=Cars",
      thumbnail: "https://placehold.co/150x100/33A1FF/FFFFFF?text=Cars",
    },
    {
      id: "9",
      uri: "https://placehold.co/600x400/A1FF33/FFFFFF?text=Food",
      thumbnail: "https://placehold.co/150x100/A1FF33/FFFFFF?text=Food",
    },
    {
      id: "10",
      uri: "https://placehold.co/600x400/FF3333/FFFFFF?text=Art",
      thumbnail: "https://placehold.co/150x100/FF3333/FFFFFF?text=Art",
    },
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const colorScheme = useColorScheme();

  // Function to open the full-screen image modal
  const openImage = (image) => {
    setSelectedImage(image);
  };

  // Function to close the full-screen image modal
  const closeImage = () => {
    setSelectedImage(null);
  };

  // Function to download and share the image
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

  // Render each wallpaper item in the grid
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => openImage(item)}
      style={styles.imageWrapper}
    >
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.image}
        contentFit="cover"
        transition={1000}
      />
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
          name="photo.fill.on.rectangle.fill"
          style={styles.headerIcon}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Wallpapers</ThemedText>
      </ThemedView>

      <FlatList
        data={wallpapers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
      />

      {/* Full-screen image modal */}
      <Modal
        visible={!!selectedImage}
        transparent={true}
        onRequestClose={closeImage}
        animationType="fade"
      >
        <ThemedView style={styles.fullScreenModal}>
          <TouchableOpacity onPress={closeImage} style={styles.closeButton}>
            <IconSymbol name="xmark.circle.fill" size={30} color="#fff" />
          </TouchableOpacity>
          {selectedImage && (
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.fullScreenImage}
              contentFit="contain"
            />
          )}
          <TouchableOpacity onPress={shareImage} style={styles.shareButton}>
            <IconSymbol
              name="square.and.arrow.up.fill"
              size={30}
              color="#fff"
            />
            <ThemedText style={styles.shareButtonText}>Share</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </Modal>
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
  imageWrapper: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    aspectRatio: 3 / 4, // Maintain aspect ratio for wallpaper previews
    backgroundColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  shareButton: {
    position: "absolute",
    bottom: 50,
    left: 20,
    zIndex: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
