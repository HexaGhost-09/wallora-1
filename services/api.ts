export interface Wallpaper {
  id: string;
  url: string;
  title: string;
  category: string;
  thumbnail?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const API_BASE_URL = 'https://wallora-wallpapers.deno.dev';

export const api = {
  async getAllWallpapers(): Promise<Wallpaper[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/wallpapers`);
      if (!response.ok) {
        throw new Error('Failed to fetch wallpapers');
      }
      const data = await response.json();
      return data.map((item: any) => ({
        id: item.id || Math.random().toString(),
        url: item.url,
        title: item.title || 'Untitled',
        category: item.category || 'Unknown',
        thumbnail: item.thumbnail || item.url,
      }));
    } catch (error) {
      console.error('Error fetching wallpapers:', error);
      return [];
    }
  },

  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      
      const categoryIcons: Record<string, string> = {
        nature: 'leaf.fill',
        cars: 'car.fill',
        anime: 'sparkles',
        space: 'globe.americas.fill',
      };

      const categoryDescriptions: Record<string, string> = {
        nature: 'Beautiful landscapes and natural scenes',
        cars: 'Cool cars and automotive wallpapers',
        anime: 'Anime-themed wallpapers and artwork',
        space: 'Cosmic and stellar imagery',
      };

      return data.map((category: string) => ({
        id: category,
        name: category.charAt(0).toUpperCase() + category.slice(1),
        icon: categoryIcons[category] || 'photo.fill',
        description: categoryDescriptions[category] || `${category} wallpapers`,
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async getWallpapersByCategory(category: string): Promise<Wallpaper[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${category}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} wallpapers`);
      }
      const data = await response.json();
      return data.map((item: any) => ({
        id: item.id || Math.random().toString(),
        url: item.url,
        title: item.title || 'Untitled',
        category: category,
        thumbnail: item.thumbnail || item.url,
      }));
    } catch (error) {
      console.error(`Error fetching ${category} wallpapers:`, error);
      return [];
    }
  },
};