import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, NavigationProp, ParamListBase } from '@react-navigation/native';

// Ensure ThemedView and ThemedText are imported
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

// Define a type for a Wallpaper based on your ACTUAL API response
interface Wallpaper {
  id: string;
  category: string;
  title: string;
  image: string; // Corrected to 'image'
  download: string;
  timestamp: string;
}

type RootStackParamList = {
  FullScreenWallpaperPage: { wallpaperItem: Wallpaper };
};

const API_BASE_URL = 'https://wallora-wallpapers.deno.dev';
const PAGE_LIMIT = 10;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([]);
  const [isLoadingInitial, setIsLoadingInitial] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchWallpapers = useCallback(async (pageNum: number, isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
      setErrorMessage(null);
    } else if (pageNum === 1) {
      setIsLoadingInitial(true);
      setErrorMessage(null);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/wallpapers?page=${pageNum}&limit=${PAGE_LIMIT}`);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }

      const data: Wallpaper[] = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setWallpapers(prevWallpapers =>
          pageNum === 1 ? data : [...prevWallpapers, ...data]
        );
        setHasMore(data.length === PAGE_LIMIT);
      }
      setErrorMessage(null);
    } catch (error: any) {
      console.error('Error fetching wallpapers:', error.message || error);
      setErrorMessage(`Failed to load wallpapers: ${error.message || 'Unknown error'}`);
      setHasMore(false);
    } finally {
      setIsLoadingInitial(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [wallpapers.length]);

  useEffect(() => {
    fetchWallpapers(1);
  }, [fetchWallpapers]);

  const handleLoadMore = useCallback(() => {
    if (!isLoadingInitial && !isLoadingMore && !isRefreshing && hasMore) {
      setPage(prevPage => prevPage + 1);
      fetchWallpapers(page + 1);
    }
  }, [isLoadingInitial, isLoadingMore, isRefreshing, hasMore, page, fetchWallpapers]);

  const onRefresh = useCallback(() => {
    setPage(1);
    setWallpapers([]);
    setHasMore(true);
    fetchWallpapers(1, true);
  }, [fetchWallpapers]);

  const navigateToFullScreen = useCallback((wallpaper: Wallpaper) => {
    navigation.navigate('FullScreenWallpaperPage', { wallpaperItem: wallpaper });
  }, [navigation]);

  const renderWallpaperItem = useCallback(({ item, index }: { item: Wallpaper; index: number }) => {
    if (!item.image || typeof item.image !== 'string' || !item.image.startsWith('http')) {
        console.warn(`[WARNING] Invalid image URL for item ID: ${item.id}, URL: ${item.image}`);
        return null;
    }

    const itemWidth = (Dimensions.get('window').width / 2) - 15;
    const itemHeight = itemWidth * (16 / 9);

    return (
      <Pressable
        onPress={() => navigateToFullScreen(item)}
        style={styles.wallpaperItemContainer}
      >
        <ThemedView style={[styles.wallpaperItem, { width: itemWidth, height: itemHeight }]}>
          <Image
            source={{ uri: item.image }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={500}
            cachePolicy="disk"
            onError={(e) => console.error(`Failed to load image for ID ${item.id}:`, e.nativeEvent.error)}
          />
        </ThemedView>
      </Pressable>
    );
  }, [navigateToFullScreen]);

  const renderErrorWidget = useCallback(() => (
    <ThemedView style={styles.centered}>
      <ThemedText style={styles.errorIcon}>😞</ThemedText>
      <ThemedText type="subtitle" style={styles.errorMessageText}>
        {errorMessage || 'Something went wrong.'}
      </ThemedText>
      {wallpapers.length === 0 && (
        <Pressable onPress={() => fetchWallpapers(1)} style={styles.retryButton}>
          <ThemedText type="defaultSemiBold" style={styles.retryButtonText}>
            Retry
          </ThemedText>
        </Pressable>
      )}
    </ThemedView>
  ), [errorMessage, wallpapers.length, fetchWallpapers]);

  const renderEmptyWidget = useCallback(() => (
    <ThemedView style={styles.centered}>
      <ThemedText style={styles.emptyIcon}>🖼️</ThemedText>
      <ThemedText type="subtitle" style={styles.emptyMessageText}>
        No wallpapers found.
      </ThemedText>
      <ThemedText type="default" style={styles.emptySubText}>
        Pull down to refresh or try again later.
      </ThemedText>
      {/* The comment below this line is for clarity and does not affect JSX parsing. */}
    </ThemedView>
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.appBar}>
        <ThemedText type="title" style={styles.appBarTitle}>Wallora Wallpapers</ThemedText>
      </ThemedView>

      {isLoadingInitial ? (
        <ThemedView style={styles.centered}>
          <ActivityIndicator size="large" color="#673AB7" />
          <ThemedText style={styles.loadingText}>Loading wallpapers...</ThemedText>
        </ThemedView>
      ) : errorMessage && wallpapers.length === 0 ? (
        renderErrorWidget()
      ) : wallpapers.length === 0 && !hasMore ? (
        renderEmptyWidget()
      ) : (
        <FlatList
          data={wallpapers}
          renderItem={renderWallpaperItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          initialNumToRender={PAGE_LIMIT * 2}
          maxToRenderPerBatch={PAGE_LIMIT * 2}
          windowSize={7}
          contentContainerStyle={styles.listContentContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isLoadingMore ? (
              <ActivityIndicator style={styles.footerLoader} size="small" color="#673AB7" />
            ) : !hasMore && wallpapers.length > 0 ? (
              <ThemedText style={styles.endOfListText}>No more wallpapers to load.</ThemedText>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#673AB7"
              colors={["#673AB7"]}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  appBarTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContentContainer: {
    padding: 10,
    flexGrow: 1,
  },
  wallpaperItemContainer: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  wallpaperItem: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#673AB7',
  },
  errorMessageText: {
    marginTop: 10,
    color: 'red',
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 64,
  },
  emptyIcon: {
    fontSize: 64,
  },
  emptyMessageText: {
    marginTop: 10,
    color: 'gray',
    textAlign: 'center',
  },
  emptySubText: {
    marginTop: 5,
    color: 'gray',
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: '#673AB7',
  },
  retryButtonText: {
    color: 'white',
  },
  footerLoader: {
    marginVertical: 20,
  },
  endOfListText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: 'gray',
  },
});