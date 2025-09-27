import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface ContentItem {
  id: string;
  content_key: string;
  content_type: string;
  translations: Record<string, string>;
  created_at: string;
  updated_at: string;
}

interface GameContentItem {
  id: string;
  game_id: string;
  content_key: string;
  content_type: string;
  translations: Record<string, string>;
  created_at: string;
  updated_at: string;
}

class ContentService {
  private appContentCache: Map<string, ContentItem> = new Map();
  private gameContentCache: Map<string, Map<string, GameContentItem>> = new Map();
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
  private lastCacheUpdate: number = 0;

  // Get app content by key
  async getAppContent(contentKey: string, language: string = 'en'): Promise<string> {
    try {
      await this.ensureCacheLoaded();
      
      const content = this.appContentCache.get(contentKey);
      if (content && content.translations[language]) {
        return content.translations[language];
      }
      
      // Fallback to English if language not found
      if (content && content.translations['en']) {
        console.warn(`Content for ${contentKey} not found in ${language}, falling back to English`);
        return content.translations['en'];
      }
      
      console.warn(`Content not found for key: ${contentKey}`);
      return contentKey; // Return the key as fallback
    } catch (error) {
      console.error('Error getting app content:', error);
      return contentKey; // Return the key as fallback
    }
  }

  // Get game content by game ID and key
  async getGameContent(gameId: string, contentKey: string, language: string = 'en'): Promise<string> {
    try {
      await this.ensureCacheLoaded();
      
      const gameContent = this.gameContentCache.get(gameId);
      if (gameContent) {
        const content = gameContent.get(contentKey);
        if (content && content.translations[language]) {
          return content.translations[language];
        }
        
        // Fallback to English if language not found
        if (content && content.translations['en']) {
          console.warn(`Game content for ${gameId}.${contentKey} not found in ${language}, falling back to English`);
          return content.translations['en'];
        }
      }
      
      console.warn(`Game content not found for: ${gameId}.${contentKey}`);
      return contentKey; // Return the key as fallback
    } catch (error) {
      console.error('Error getting game content:', error);
      return contentKey; // Return the key as fallback
    }
  }

  // Get all content for a specific language (useful for bulk operations)
  async getAllAppContent(language: string = 'en'): Promise<Record<string, string>> {
    try {
      await this.ensureCacheLoaded();
      
      const result: Record<string, string> = {};
      
      for (const [key, content] of this.appContentCache) {
        if (content.translations[language]) {
          result[key] = content.translations[language];
        } else if (content.translations['en']) {
          result[key] = content.translations['en'];
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error getting all app content:', error);
      return {};
    }
  }

  // Get all content for a specific game and language
  async getAllGameContent(gameId: string, language: string = 'en'): Promise<Record<string, string>> {
    try {
      await this.ensureCacheLoaded();
      
      const result: Record<string, string> = {};
      const gameContent = this.gameContentCache.get(gameId);
      
      if (gameContent) {
        for (const [key, content] of gameContent) {
          if (content.translations[language]) {
            result[key] = content.translations[language];
          } else if (content.translations['en']) {
            result[key] = content.translations['en'];
          }
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error getting all game content:', error);
      return {};
    }
  }

  // Update app content (admin function)
  async updateAppContent(contentKey: string, translations: Record<string, string>): Promise<boolean> {
    if (!supabase) {
      console.warn('Supabase not available for content update');
      return false;
    }

    try {
      const { error } = await supabase
        .from('app_content')
        .upsert({
          content_key: contentKey,
          translations: translations,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating app content:', error);
        return false;
      }

      // Update cache
      this.appContentCache.set(contentKey, {
        id: '', // Will be updated on next cache load
        content_key: contentKey,
        content_type: 'text',
        translations: translations,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error in updateAppContent:', error);
      return false;
    }
  }

  // Update game content (admin function)
  async updateGameContent(gameId: string, contentKey: string, translations: Record<string, string>): Promise<boolean> {
    if (!supabase) {
      console.warn('Supabase not available for game content update');
      return false;
    }

    try {
      const { error } = await supabase
        .from('game_content')
        .upsert({
          game_id: gameId,
          content_key: contentKey,
          translations: translations,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error updating game content:', error);
        return false;
      }

      // Update cache
      if (!this.gameContentCache.has(gameId)) {
        this.gameContentCache.set(gameId, new Map());
      }
      
      this.gameContentCache.get(gameId)!.set(contentKey, {
        id: '', // Will be updated on next cache load
        game_id: gameId,
        content_key: contentKey,
        content_type: 'text',
        translations: translations,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      return true;
    } catch (error) {
      console.error('Error in updateGameContent:', error);
      return false;
    }
  }

  // Clear cache (useful for development or when content is updated)
  clearCache(): void {
    this.appContentCache.clear();
    this.gameContentCache.clear();
    this.lastCacheUpdate = 0;
  }

  // Private method to ensure cache is loaded and fresh
  private async ensureCacheLoaded(): Promise<void> {
    const now = Date.now();
    
    // Check if cache needs refresh
    if (now - this.lastCacheUpdate > this.cacheExpiry || this.appContentCache.size === 0) {
      await this.loadCache();
    }
  }

  // Private method to load content from database into cache
  private async loadCache(): Promise<void> {
    if (!supabase) {
      console.warn('Supabase not available, using fallback content');
      this.loadFallbackContent();
      return;
    }

    try {
      // Load app content
      const { data: appContent, error: appError } = await supabase
        .from('app_content')
        .select('*');

      if (appError) {
        console.warn('⚠️ Database error loading app content, using fallback:', appError);
        this.loadFallbackContent();
        return;
      }

      // Load game content
      const { data: gameContent, error: gameError } = await supabase
        .from('game_content')
        .select('*');

      if (gameError) {
        console.warn('⚠️ Database error loading game content:', gameError);
      }

      // Update cache
      this.appContentCache.clear();
      this.gameContentCache.clear();

      // Cache app content
      if (appContent) {
        for (const item of appContent) {
          this.appContentCache.set(item.content_key, item);
        }
      }

      // Cache game content
      if (gameContent) {
        for (const item of gameContent) {
          if (!this.gameContentCache.has(item.game_id)) {
            this.gameContentCache.set(item.game_id, new Map());
          }
          this.gameContentCache.get(item.game_id)!.set(item.content_key, item);
        }
      }

      this.lastCacheUpdate = Date.now();
      console.log('✅ Content cache loaded from database');
    } catch (error) {
      console.warn('⚠️ Network error loading content cache, using fallback:', error);
      this.loadFallbackContent();
    }
  }

  // Fallback content when database is not available
  private loadFallbackContent(): void {
    console.log('📦 Loading fallback content');
    
    // Add some basic fallback content
    this.appContentCache.set('hero.title', {
      id: 'fallback',
      content_key: 'hero.title',
      content_type: 'text',
      translations: {
        en: 'You Are a SUPERHERO!',
        af: 'Jy is \'n SUPERHELD!',
        zu: 'Ungiqhawe ELIKHULU!'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    this.appContentCache.set('hero.subtitle', {
      id: 'fallback',
      content_key: 'hero.subtitle',
      content_type: 'text',
      translations: {
        en: 'Learn how to stay safe, help friends, and be brave!',
        af: 'Leer hoe om veilig te bly, vriende te help, en dapper te wees!',
        zu: 'Funda ukuthi ungahlala kanjani uphephile, usize abangane, futhi ube nesibindi!'
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

    this.lastCacheUpdate = Date.now();
  }
}

// Create singleton instance
export const contentService = new ContentService();