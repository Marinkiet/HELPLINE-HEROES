import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserSession {
  session_id: string;
  age_group: string;
  language: string;
  location_country?: string;
  location_region?: string;
  location_city?: string;
  screen_time_seconds: number;
  points_earned: number;
  games_completed: string[];
  last_activity: string;
}

export interface GameSession {
  session_id: string;
  game_id: string;
  game_name: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  points_earned: number;
  completed: boolean;
}

export interface UserInteraction {
  session_id: string;
  interaction_type: string;
  interaction_data: Record<string, any>;
}

class EngagementService {
  private sessionId: string;
  private sessionStartTime: number;
  private isSessionInitialized: boolean = false;
  private currentGameSession: string | null = null;
  private gameStartTime: number | null = null;
  private screenTimeInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    this.startScreenTimeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize user session
  async initializeSession(ageGroup: string, language: string): Promise<void> {
    // Check if session is already initialized
    if (this.isSessionInitialized) {
      return;
    }

    try {
      // Get user location (optional)
      const location = await this.getUserLocation();
      
      const sessionData: Partial<UserSession> = {
        session_id: this.sessionId,
        age_group: ageGroup,
        language: language,
        location_country: location?.country,
        location_region: location?.region,
        location_city: location?.city,
        screen_time_seconds: 0,
        points_earned: 0,
        games_completed: [],
        last_activity: new Date().toISOString()
      };

      const { error } = await supabase
        .from('user_sessions')
        .insert(sessionData);

      if (error && error.code !== '23505') {
        console.error('Error initializing session:', error);
        return;
      }
      
      // Mark session as initialized on success or if already exists
      this.isSessionInitialized = true;
      
      if (error?.code === '23505') {
        console.log('✅ Session already exists:', this.sessionId);
      } else {
        console.log('✅ User session initialized:', this.sessionId);
      }

      // Track session start interaction
      await this.trackInteraction('session_start', {
        age_group: ageGroup,
        language: language,
        location: location
      });
    } catch (error) {
      console.error('Error in initializeSession:', error);
    }
  }

  // Update session data
  async updateSession(updates: Partial<UserSession>): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          ...updates,
          last_activity: new Date().toISOString()
        })
        .eq('session_id', this.sessionId);

      if (error) {
        console.error('Error updating session:', error);
      }
    } catch (error) {
      console.error('Error in updateSession:', error);
    }
  }

  // Start game session
  async startGameSession(gameId: string, gameName: string): Promise<void> {
    try {
      this.currentGameSession = `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.gameStartTime = Date.now();

      const gameSessionData: Partial<GameSession> = {
        session_id: this.sessionId,
        game_id: gameId,
        game_name: gameName,
        start_time: new Date().toISOString(),
        points_earned: 0,
        completed: false
      };

      const { error } = await supabase
        .from('game_sessions')
        .insert(gameSessionData);

      if (error) {
        console.error('Error starting game session:', error);
      } else {
        console.log('🎮 Game session started:', gameId);
      }

      // Track game start interaction
      await this.trackInteraction('game_start', {
        game_id: gameId,
        game_name: gameName
      });
    } catch (error) {
      console.error('Error in startGameSession:', error);
    }
  }

  // End game session
  async endGameSession(pointsEarned: number = 0, completed: boolean = false): Promise<void> {
    if (!this.currentGameSession || !this.gameStartTime) return;

    try {
      const endTime = Date.now();
      const durationSeconds = Math.floor((endTime - this.gameStartTime) / 1000);

      const { error } = await supabase
        .from('game_sessions')
        .update({
          end_time: new Date().toISOString(),
          duration_seconds: durationSeconds,
          points_earned: pointsEarned,
          completed: completed
        })
        .eq('session_id', this.sessionId)
        .eq('start_time', new Date(this.gameStartTime).toISOString());

      if (error) {
        console.error('Error ending game session:', error);
      } else {
        console.log('🏁 Game session ended:', { duration: durationSeconds, points: pointsEarned, completed });
      }

      // Update user session with points and completed games
      if (completed) {
        const { data: currentSession } = await supabase
          .from('user_sessions')
          .select('points_earned, games_completed')
          .eq('session_id', this.sessionId)
          .single();

        if (currentSession) {
          const updatedGamesCompleted = [...(currentSession.games_completed || [])];
          const gameId = this.currentGameSession?.split('_')[1] || '';
          
          if (!updatedGamesCompleted.includes(gameId)) {
            updatedGamesCompleted.push(gameId);
          }

          await this.updateSession({
            points_earned: (currentSession.points_earned || 0) + pointsEarned,
            games_completed: updatedGamesCompleted
          });
        }
      }

      // Track game end interaction
      await this.trackInteraction('game_end', {
        duration_seconds: durationSeconds,
        points_earned: pointsEarned,
        completed: completed
      });

      this.currentGameSession = null;
      this.gameStartTime = null;
    } catch (error) {
      console.error('Error in endGameSession:', error);
    }
  }

  // Track user interactions
  async trackInteraction(type: string, data: Record<string, any> = {}): Promise<void> {
    try {
      const interactionData: Partial<UserInteraction> = {
        session_id: this.sessionId,
        interaction_type: type,
        interaction_data: data
      };

      const { error } = await supabase
        .from('user_interactions')
        .insert(interactionData);

      if (error) {
        console.error('Error tracking interaction:', error);
      }
    } catch (error) {
      console.error('Error in trackInteraction:', error);
    }
  }

  // Update language
  async updateLanguage(language: string): Promise<void> {
    await this.updateSession({ language });
    await this.trackInteraction('language_change', { language });
  }

  // Update age group
  async updateAgeGroup(ageGroup: string): Promise<void> {
    await this.updateSession({ age_group: ageGroup });
    await this.trackInteraction('age_group_change', { age_group: ageGroup });
  }

  // Start screen time tracking
  private startScreenTimeTracking(): void {
    this.screenTimeInterval = setInterval(async () => {
      const currentScreenTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
      await this.updateSession({ screen_time_seconds: currentScreenTime });
    }, 30000); // Update every 30 seconds
  }

  // Stop screen time tracking
  stopScreenTimeTracking(): void {
    if (this.screenTimeInterval) {
      clearInterval(this.screenTimeInterval);
      this.screenTimeInterval = null;
    }
  }

  // Get user location (optional, requires user permission)
  private async getUserLocation(): Promise<{ country?: string; region?: string; city?: string } | null> {
    try {
      // Try to get location from IP (using a free service)
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return {
          country: data.country_name,
          region: data.region,
          city: data.city
        };
      }
    } catch (error) {
      console.log('Could not get location:', error);
    }
    return null;
  }

  // Get session ID for external use
  getSessionId(): string {
    return this.sessionId;
  }

  // End session (call when user leaves)
  async endSession(): Promise<void> {
    this.stopScreenTimeTracking();
    
    const finalScreenTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    await this.updateSession({ screen_time_seconds: finalScreenTime });
    
    await this.trackInteraction('session_end', {
      total_screen_time: finalScreenTime
    });

    console.log('📊 Session ended:', this.sessionId);
  }
}

// Create singleton instance
export const engagementService = new EngagementService();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  engagementService.endSession();
});