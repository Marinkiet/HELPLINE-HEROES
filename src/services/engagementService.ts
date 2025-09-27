import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase credentials are available
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase credentials not found. Please check your .env file contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

interface UserSession {
  session_id: string;
  age_group: 'early' | 'middle' | 'teen';
  language: string;
  location_country?: string;
  location_region?: string;
  location_city?: string;
  screen_time_seconds: number;
  points_earned: number;
  games_completed: string[];
  last_activity: string;
}

interface GameSession {
  session_id: string;
  game_id: string;
  game_name: string;
  start_time: string;
  end_time?: string;
  duration_seconds?: number;
  points_earned: number;
  completed: boolean;
}

interface UserInteraction {
  session_id: string;
  interaction_type: string;
  interaction_data: Record<string, any>;
}

class EngagementService {
  private sessionId: string;
  private sessionStartTime: number;
  private currentGameSession: string | null = null;
  private gameStartTime: number | null = null;
  private screenTimeInterval: NodeJS.Timeout | null = null;
  private sessionInitialized: Promise<boolean>;
  private sessionInitializedResolver: ((value: boolean) => void) | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.sessionStartTime = Date.now();
    
    // Create a promise that resolves when session is initialized
    this.sessionInitialized = new Promise((resolve) => {
      this.sessionInitializedResolver = resolve;
    });
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Initialize user session
  async initializeSession(ageGroup: 'early' | 'middle' | 'teen', language: string): Promise<boolean> {
    try {
      // Check if Supabase is available
      if (!supabase) {
        console.warn('⚠️ Supabase not initialized. Session tracking disabled.');
        if (this.sessionInitializedResolver) {
          this.sessionInitializedResolver(false);
        }
        return false;
      }

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

      if (error) {
        console.error('Error initializing session:', error);
        // Resolve with false to indicate failure
        if (this.sessionInitializedResolver) {
          this.sessionInitializedResolver(false);
        }
        return false;
      } else {
        console.log('✅ User session initialized:', this.sessionId);
        // Resolve with true to indicate success
        if (this.sessionInitializedResolver) {
          this.sessionInitializedResolver(true);
        }
        // Start screen time tracking only after successful initialization
        this.startScreenTimeTracking();
        
        // Track session start interaction
        await this.trackInteraction('session_start', {
          age_group: ageGroup,
          language: language,
          location: location
        });
        
        return true;
      }
    } catch (error) {
      console.error('Error in initializeSession:', error);
      // Resolve with false to indicate failure
      if (this.sessionInitializedResolver) {
        this.sessionInitializedResolver(false);
      }
      return false;
    }
  }

  // Update session data
  async updateSession(updates: Partial<UserSession>): Promise<void> {
    // Wait for session to be initialized before updating
    const isInitialized = await this.sessionInitialized;
    if (!isInitialized) {
      console.warn('Session not initialized, skipping update');
      return;
    }

    // Check if Supabase is available
    if (!supabase) {
      console.warn('⚠️ Supabase not available, skipping session update');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({
          ...updates,
          last_activity: new Date().toISOString()
        })
        .eq('session_id', this.sessionId);

      if (error) {
        console.warn('⚠️ Database error updating session (continuing normally):', error);
      }
    } catch (error) {
      console.warn('⚠️ Network error updating session (continuing normally):', error);
      // Don't throw the error - just log it and continue
    }
  }

  // Start game session
  async startGameSession(gameId: string, gameName: string): Promise<void> {
    // Wait for session to be initialized before starting game session
    const isInitialized = await this.sessionInitialized;
    if (!isInitialized) {
      console.warn('Session not initialized, skipping game session start');
      return;
    }

    // Check if Supabase is available
    if (!supabase) {
      console.warn('⚠️ Supabase not available, skipping game session start');
      return;
    }

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
    if (!this.currentGameSession || !this.gameStartTime || !supabase) return;

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
    // Wait for session to be initialized before tracking interactions
    const isInitialized = await this.sessionInitialized;
    if (!isInitialized) {
      console.warn('Session not initialized, skipping interaction tracking');
      return;
    }

    // Check if Supabase is available
    if (!supabase) {
      console.warn('⚠️ Supabase not available, skipping interaction tracking');
      return;
    }

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
      console.warn('⚠️ Failed to track interaction (network/connection issue):', error);
      // Don't throw the error - just log it and continue
    }
  }

  // Track question responses for analytics
  async trackQuestionResponse(
    gameId: string, 
    questionId: string, 
    questionText: string, 
    userAnswer: string, 
    correctAnswer: string, 
    isCorrect: boolean, 
    responseTimeSeconds: number = 0,
    retryCount: number = 0,
    firstAttemptCorrect: boolean = true
  ): Promise<void> {
    // Wait for session to be initialized before tracking
    const isInitialized = await this.sessionInitialized;
    if (!isInitialized) {
      console.warn('Session not initialized, skipping question response tracking');
      return;
    }

    // Check if Supabase is available
    if (!supabase) {
      console.warn('⚠️ Supabase not available, skipping question response tracking');
      return;
    }

    try {
      const questionResponseData = {
        session_id: this.sessionId,
        game_id: gameId,
        question_id: questionId,
        question_text: questionText,
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        is_correct: isCorrect,
        response_time_seconds: responseTimeSeconds,
        retry_count: retryCount,
        first_attempt_correct: firstAttemptCorrect,
        needs_review: retryCount > 2 || (!isCorrect && retryCount > 0) // Flag for review if multiple retries or incorrect after retry
      };

      const { error } = await supabase
        .from('question_responses')
        .insert(questionResponseData);

      if (error) {
        console.error('Error tracking question response:', error);
      } else {
        console.log('✅ Question response tracked:', { gameId, questionId, isCorrect, retryCount, firstAttemptCorrect });
      }
    } catch (error) {
      console.error('Error in trackQuestionResponse:', error);
    }
  }

  // Update language
  async updateLanguage(language: string): Promise<void> {
    // Wait for session to be initialized before updating language
    const isInitialized = await this.sessionInitialized;
    if (!isInitialized) {
      console.warn('Session not initialized, skipping language update');
      return;
    }

    await this.updateSession({ language });
    await this.trackInteraction('language_change', { language });
  }

  // Update age group
  async updateAgeGroup(ageGroup: 'early' | 'middle' | 'teen'): Promise<void> {
    // Wait for session to be initialized before updating age group
    const isInitialized = await this.sessionInitialized;
    if (!isInitialized) {
      console.warn('Session not initialized, skipping age group update');
      return;
    }

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
      // Try to get location from IP (using a free service with South African province mapping)
      const response = await fetch('https://ipapi.co/json/', {
        headers: {
          'User-Agent': 'TrustlineHeroes/1.0'
        }
      });
      if (response.ok) {
        const data = await response.json();
        
        // Map region to South African provinces if country is South Africa
        let mappedRegion = data.region;
        if (data.country_code === 'ZA' || data.country_name === 'South Africa') {
          mappedRegion = this.mapToSouthAfricanProvince(data.region, data.city);
        }
        
        return {
          country: data.country_name,
          region: mappedRegion,
          city: data.city
        };
      }
    } catch (error) {
      console.log('Could not get location:', error);
    }
    return null;
  }

  // Map location data to South African provinces
  private mapToSouthAfricanProvince(region: string, city: string): string {
    if (!region && !city) return 'Unknown';
    
    const regionLower = (region || '').toLowerCase();
    const cityLower = (city || '').toLowerCase();
    
    // Direct province name matches
    if (regionLower.includes('eastern cape')) return 'Eastern Cape';
    if (regionLower.includes('free state')) return 'Free State';
    if (regionLower.includes('gauteng')) return 'Gauteng';
    if (regionLower.includes('kwazulu') || regionLower.includes('natal')) return 'KwaZulu-Natal';
    if (regionLower.includes('limpopo')) return 'Limpopo';
    if (regionLower.includes('mpumalanga')) return 'Mpumalanga';
    if (regionLower.includes('northern cape')) return 'Northern Cape';
    if (regionLower.includes('north west') || regionLower.includes('northwest')) return 'North West';
    if (regionLower.includes('western cape')) return 'Western Cape';
    
    // City-based mapping for major cities
    if (cityLower.includes('johannesburg') || cityLower.includes('pretoria') || 
        cityLower.includes('soweto') || cityLower.includes('sandton') ||
        cityLower.includes('centurion') || cityLower.includes('roodepoort')) {
      return 'Gauteng';
    }
    
    if (cityLower.includes('cape town') || cityLower.includes('stellenbosch') ||
        cityLower.includes('paarl') || cityLower.includes('george') ||
        cityLower.includes('mossel bay')) {
      return 'Western Cape';
    }
    
    if (cityLower.includes('durban') || cityLower.includes('pietermaritzburg') ||
        cityLower.includes('newcastle') || cityLower.includes('richards bay')) {
      return 'KwaZulu-Natal';
    }
    
    if (cityLower.includes('port elizabeth') || cityLower.includes('east london') ||
        cityLower.includes('uitenhage') || cityLower.includes('grahamstown')) {
      return 'Eastern Cape';
    }
    
    if (cityLower.includes('bloemfontein') || cityLower.includes('welkom') ||
        cityLower.includes('kroonstad')) {
      return 'Free State';
    }
    
    if (cityLower.includes('polokwane') || cityLower.includes('tzaneen') ||
        cityLower.includes('thohoyandou') || cityLower.includes('makhado')) {
      return 'Limpopo';
    }
    
    if (cityLower.includes('nelspruit') || cityLower.includes('mbombela') ||
        cityLower.includes('witbank') || cityLower.includes('emalahleni')) {
      return 'Mpumalanga';
    }
    
    if (cityLower.includes('kimberley') || cityLower.includes('upington') ||
        cityLower.includes('kuruman')) {
      return 'Northern Cape';
    }
    
    if (cityLower.includes('mahikeng') || cityLower.includes('rustenburg') ||
        cityLower.includes('klerksdorp') || cityLower.includes('potchefstroom')) {
      return 'North West';
    }
    
    // Return original region if no mapping found
    return region || 'Unknown';
  }

  // Get session ID for external use
  getSessionId(): string {
    return this.sessionId;
  }

  // End session (call when user leaves)
  async endSession(): Promise<void> {
    // Wait for session to be initialized before ending session
    const isInitialized = await this.sessionInitialized;
    if (!isInitialized) {
      console.warn('Session was not initialized, skipping end session');
      return;
    }

    // Check if Supabase is available
    if (!supabase) {
      console.warn('⚠️ Supabase not available, skipping end session');
      return;
    }

    try {
    this.stopScreenTimeTracking();
    
    const finalScreenTime = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    await this.updateSession({ screen_time_seconds: finalScreenTime });
    
    await this.trackInteraction('session_end', {
      total_screen_time: finalScreenTime
    });

    console.log('📊 Session ended:', this.sessionId);
    } catch (error) {
      console.warn('⚠️ Failed to end session properly (network/connection issue):', error);
      // Still stop screen time tracking even if network fails
      this.stopScreenTimeTracking();
    }
  }
}

// Create singleton instance
export const engagementService = new EngagementService();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  engagementService.endSession();
});