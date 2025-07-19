export interface Wallpaper {
  id: string;
  url: string;
  title: string;
  category: string;
  thumbnail?: string;
  timestamp?: string;
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
      const response = await fetch(`${API_BASE_URL}/wallpapers?limit=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch wallpapers');
      }
      const data = await response.json();
      
      return data.map((item: any) => ({
        id: item.id || Math.random().toString(),
        url: item.url,
        title: this.generateTitle(item.category, item.id),
        category: item.category || 'Unknown',
        thumbnail: item.thumbnail || item.url,
        timestamp: item.timestamp,
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
      const response = await fetch(`${API_BASE_URL}/wallpapers/${category}?limit=50`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} wallpapers`);
      }
      const data = await response.json();
      
      return data.map((item: any) => ({
        id: item.id || Math.random().toString(),
        url: item.url,
        title: this.generateTitle(category, item.id),
        category: category,
        thumbnail: item.thumbnail || item.url,
        timestamp: item.timestamp,
      }));
    } catch (error) {
      console.error(`Error fetching ${category} wallpapers:`, error);
      return [];
    }
  },

  generateTitle(category: string, id: string): string {
    const categoryTitles: Record<string, string[]> = {
      nature: ['Mountain Vista', 'Forest Path', 'Ocean Waves', 'Sunset Sky', 'Flower Field'],
      cars: ['Sports Car', 'Classic Vehicle', 'Racing Machine', 'Luxury Ride', 'Street Racer'],
      anime: ['Anime Art', 'Character Design', 'Manga Style', 'Anime Scene', 'Digital Art'],
      space: ['Galaxy View', 'Nebula', 'Star Field', 'Planet Surface', 'Cosmic Wonder'],
    };

    const titles = categoryTitles[category] || ['Wallpaper'];
    const hash = id.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return titles[Math.abs(hash) % titles.length];
  },
};