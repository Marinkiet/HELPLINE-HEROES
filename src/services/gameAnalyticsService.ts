import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Comprehensive Game Analytics Service
 * Handles all data collection and analytics for educational games
 */

export interface PlayerProfile {
  playerId?: string;
  sessionId: string;
  ageGroup: '5-7' | '8-10' | '11-13' | '14+';
  province?: string;
  city?: string;
  schoolCode?: string;
  preferredLanguage: string;
  dataConsent?: boolean;
}

export interface GameSessionData {
  gameId: string;
  gameName: string;
  gameCategory: string;
  score: number;
  maxPossibleScore: number;
  completionPercentage: number;
  sessionDurationSeconds: number;
  languageUsed: string;
  questionsAnswered: number;
  correctAnswers: number;
  startedAt: Date;
  completedAt: Date;
}

export interface QuestionResponseData {
  questionId: string;
  questionText: string;
  questionCategory: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  responseTimeSeconds: number;
  attemptNumber?: number;
  hintsUsed?: number;
}

export interface SchoolData {
  schoolCode: string;
  province: string;
  city: string;
  schoolType: 'primary' | 'secondary' | 'combined';
  enrollmentSize: 'small' | 'medium' | 'large';
}

class GameAnalyticsService {
  /**
   * Create or update a player profile
   */
  async createPlayerProfile(profile: PlayerProfile): Promise<string | null> {
    try {
      // Check if player already exists for this session
      const { data: existing } = await supabase
        .from('players')
        .select('player_id')
        .eq('session_id', profile.sessionId)
        .maybeSingle();

      if (existing) {
        // Update existing player
        await supabase
          .from('players')
          .update({
            last_active_at: new Date().toISOString(),
            preferred_language: profile.preferredLanguage,
            province: profile.province,
            city: profile.city,
            school_code: profile.schoolCode
          })
          .eq('player_id', existing.player_id);

        return existing.player_id;
      }

      // Create new player
      const { data, error } = await supabase
        .from('players')
        .insert({
          session_id: profile.sessionId,
          age_group: profile.ageGroup,
          province: profile.province,
          city: profile.city,
          school_code: profile.schoolCode,
          preferred_language: profile.preferredLanguage,
          data_consent: profile.dataConsent ?? true
        })
        .select('player_id')
        .single();

      if (error) {
        console.error('Error creating player profile:', error);
        return null;
      }

      return data.player_id;
    } catch (error) {
      console.error('Error in createPlayerProfile:', error);
      return null;
    }
  }

  /**
   * Record a complete game session with all metrics
   */
  async recordGameSession(
    sessionId: string,
    sessionData: GameSessionData
  ): Promise<string | null> {
    try {
      // Get player ID from session ID
      const { data: player } = await supabase
        .from('players')
        .select('player_id')
        .eq('session_id', sessionId)
        .single();

      if (!player) {
        console.error('Player not found for session:', sessionId);
        return null;
      }

      // Find the game_sessions record (from existing schema)
      const { data: gameSession, error } = await supabase
        .from('game_sessions')
        .select('id')
        .eq('session_id', sessionId)
        .eq('game_id', sessionData.gameId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error finding game session:', error);
      }

      return gameSession?.id || null;
    } catch (error) {
      console.error('Error in recordGameSession:', error);
      return null;
    }
  }

  /**
   * Record detailed question responses
   */
  async recordQuestionResponse(
    gameSessionId: string,
    playerId: string,
    response: QuestionResponseData
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('detailed_question_responses')
        .insert({
          game_session_id: gameSessionId,
          player_id: playerId,
          question_id: response.questionId,
          question_text: response.questionText,
          question_category: response.questionCategory,
          selected_answer: response.selectedAnswer,
          correct_answer: response.correctAnswer,
          is_correct: response.isCorrect,
          response_time_seconds: response.responseTimeSeconds,
          attempt_number: response.attemptNumber || 1,
          hints_used: response.hintsUsed || 0
        });

      if (error) {
        console.error('Error recording question response:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in recordQuestionResponse:', error);
      return false;
    }
  }

  /**
   * Batch record multiple question responses
   */
  async recordQuestionResponses(
    gameSessionId: string,
    playerId: string,
    responses: QuestionResponseData[]
  ): Promise<boolean> {
    try {
      const formattedResponses = responses.map(response => ({
        game_session_id: gameSessionId,
        player_id: playerId,
        question_id: response.questionId,
        question_text: response.questionText,
        question_category: response.questionCategory,
        selected_answer: response.selectedAnswer,
        correct_answer: response.correctAnswer,
        is_correct: response.isCorrect,
        response_time_seconds: response.responseTimeSeconds,
        attempt_number: response.attemptNumber || 1,
        hints_used: response.hintsUsed || 0
      }));

      const { error } = await supabase
        .from('detailed_question_responses')
        .insert(formattedResponses);

      if (error) {
        console.error('Error batch recording question responses:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in recordQuestionResponses:', error);
      return false;
    }
  }

  /**
   * Register a school
   */
  async registerSchool(school: SchoolData): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('schools')
        .insert({
          school_code: school.schoolCode,
          province: school.province,
          city: school.city,
          school_type: school.schoolType,
          enrollment_size: school.enrollmentSize
        })
        .select()
        .single();

      if (error) {
        // School might already exist, which is fine
        if (error.code === '23505') {
          return true;
        }
        console.error('Error registering school:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in registerSchool:', error);
      return false;
    }
  }

  /**
   * Get game performance analytics by various dimensions
   */
  async getGamePerformance(filters: {
    gameId?: string;
    ageGroup?: string;
    province?: string;
    language?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    try {
      let query = supabase
        .from('game_analytics_dashboard')
        .select('*');

      if (filters.gameId) {
        query = query.eq('game_id', filters.gameId);
      }
      if (filters.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters.province) {
        query = query.eq('province', filters.province);
      }
      if (filters.language) {
        query = query.eq('language', filters.language);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching game performance:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getGamePerformance:', error);
      return null;
    }
  }

  /**
   * Get school performance analytics
   */
  async getSchoolPerformance(schoolCode?: string) {
    try {
      let query = supabase
        .from('school_performance_analytics')
        .select('*');

      if (schoolCode) {
        query = query.eq('school_code', schoolCode);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching school performance:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getSchoolPerformance:', error);
      return null;
    }
  }

  /**
   * Get aggregated daily metrics
   */
  async getDailyMetrics(gameId: string, days: number = 30) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('game_performance_summary')
        .select('*')
        .eq('game_id', gameId)
        .gte('date', startDate.toISOString().split('T')[0])
        .lte('date', endDate.toISOString().split('T')[0])
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching daily metrics:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getDailyMetrics:', error);
      return null;
    }
  }

  /**
   * Get learning insights for content optimization
   */
  async getLearningInsights(filters: {
    gameId?: string;
    ageGroup?: string;
    severity?: 'low' | 'medium' | 'high';
    resolved?: boolean;
  }) {
    try {
      let query = supabase
        .from('learning_insights')
        .select('*')
        .order('detected_at', { ascending: false });

      if (filters.gameId) {
        query = query.eq('game_id', filters.gameId);
      }
      if (filters.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters.severity) {
        query = query.eq('severity', filters.severity);
      }
      if (filters.resolved !== undefined) {
        query = query.eq('resolved', filters.resolved);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching learning insights:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getLearningInsights:', error);
      return null;
    }
  }

  /**
   * Trigger daily aggregation (should be called by a cron job or manually)
   */
  async aggregateDailyPerformance(targetDate?: Date) {
    try {
      const date = targetDate || new Date();
      const dateString = date.toISOString().split('T')[0];

      const { error } = await supabase.rpc('aggregate_game_performance', {
        target_date: dateString
      });

      if (error) {
        console.error('Error aggregating daily performance:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in aggregateDailyPerformance:', error);
      return false;
    }
  }

  /**
   * Get player statistics
   */
  async getPlayerStats(playerId: string) {
    try {
      const { data, error } = await supabase
        .from('players')
        .select(`
          *,
          game_sessions:game_sessions(count)
        `)
        .eq('player_id', playerId)
        .single();

      if (error) {
        console.error('Error fetching player stats:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getPlayerStats:', error);
      return null;
    }
  }

  /**
   * Get difficult questions (for content improvement)
   */
  async getDifficultQuestions(gameId: string, minResponses: number = 10) {
    try {
      const { data, error } = await supabase
        .from('detailed_question_responses')
        .select('question_id, question_text, question_category, is_correct')
        .eq('game_id', gameId);

      if (error || !data) {
        console.error('Error fetching difficult questions:', error);
        return null;
      }

      // Group by question and calculate difficulty
      const questionStats = data.reduce((acc: any, response: any) => {
        if (!acc[response.question_id]) {
          acc[response.question_id] = {
            questionId: response.question_id,
            questionText: response.question_text,
            questionCategory: response.question_category,
            totalResponses: 0,
            correctResponses: 0
          };
        }

        acc[response.question_id].totalResponses++;
        if (response.is_correct) {
          acc[response.question_id].correctResponses++;
        }

        return acc;
      }, {});

      // Filter and calculate accuracy
      const difficultQuestions = Object.values(questionStats)
        .filter((q: any) => q.totalResponses >= minResponses)
        .map((q: any) => ({
          ...q,
          accuracy: (q.correctResponses / q.totalResponses) * 100
        }))
        .sort((a: any, b: any) => a.accuracy - b.accuracy);

      return difficultQuestions;
    } catch (error) {
      console.error('Error in getDifficultQuestions:', error);
      return null;
    }
  }
}

export const gameAnalyticsService = new GameAnalyticsService();