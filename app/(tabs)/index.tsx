import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Modal,
  View,
  StatusBar,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ModernCard } from "@/components/ui/ModernCard";
import { ModernButton } from "@/components/ui/ModernButton";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { api, Wallpaper } from "@/services/api";

const { width, height } = Dimensions.get("window");
const IMAGE_SIZE = (width - 48) / 2;

export default function HomeScreen() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadWallpapers();
  }, []);

  const loadWallpapers = async () => {
    setLoading(true);
    try {
      const data = await api.getAllWallpapers();
      setWallpapers(data);
    } catch (error) {
      console.error('Failed to load wallpapers:', error);
    } finally {
      setLoading(false);
    }
  };

  const openImage = (image) => {
    setSelectedImage(image);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const shareImage = async () => {
    if (selectedImage) {
      try {
        const filename = selectedImage.url.split("/").pop();
        const fileUri = FileSystem.cacheDirectory + filename;
        await FileSystem.downloadAsync(selectedImage.url, fileUri);
        await Sharing.shareAsync(fileUri);
      } catch (error) {
        console.error("Failed to share image:", error);
      }
    }
  };

  const setWallpaper = async (type: 'home' | 'lock' | 'both') => {
    if (!selectedImage) return;

    try {
      // Request media library permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant media library permissions to set wallpaper.');
        return;
      }

      // Download the image
      const filename = selectedImage.url.split("/").pop() || 'wallpaper.jpg';
      const fileUri = FileSystem.cacheDirectory + filename;
      await FileSystem.downloadAsync(selectedImage.url, fileUri);

      // Save to media library
      await MediaLibrary.saveToLibraryAsync(fileUri);
      
      let message = '';
      switch (type) {
        case 'home':
          message = 'Image saved to gallery. Please set as home screen wallpaper manually from your device settings.';
          break;
        case 'lock':
          message = 'Image saved to gallery. Please set as lock screen wallpaper manually from your device settings.';
          break;
        case 'both':
          message = 'Image saved to gallery. Please set as wallpaper for both home and lock screen manually from your device settings.';
          break;
      }
      
      Alert.alert('Success', message);
    } catch (error) {
      console.error('Failed to set wallpaper:', error);
      Alert.alert('Error', 'Failed to save wallpaper. Please try again.');
    }
  };

  const showWallpaperOptions = () => {
    Alert.alert(
      'Set Wallpaper',
      'Choose where to apply this wallpaper:',
      [
        { text: 'Home Screen', onPress: () => setWallpaper('home') },
        { text: 'Lock Screen', onPress: () => setWallpaper('lock') },
        { text: 'Both', onPress: () => setWallpaper('both') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <ModernCard 
      onPress={() => openImage(item)} 
      style={styles.imageCard}
      variant="elevated"
    >
      <Image
        source={{ uri: item.thumbnail || item.url }}
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

      {/* Wallpapers Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ThemedText style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading wallpapers...
          </ThemedText>
        </View>
      ) : (
      <FlatList
        data={wallpapers}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
      />
      )}

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
              source={{ uri: selectedImage.url }}
              style={styles.fullScreenImage}
              contentFit="contain"
            />
          )}

          {/* Bottom Controls */}
          <View style={styles.modalFooter}>
            <ModernButton
              title="Set as Wallpaper"
              onPress={showWallpaperOptions}
              variant="primary"
              icon={<IconSymbol name="photo.fill" size={20} color="#fff" />}
              style={styles.wallpaperButton}
            />
            <ModernButton
              title="Share"
              onPress={shareImage}
              variant="secondary"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
  },
  gridContainer: {
    paddingHorizontal: 16,
    paddingBottom: 120,
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
    paddingBottom: 60,
    alignItems: 'center',
    gap: 12,
  },
  wallpaperButton: {
    width: '100%',
  },
});