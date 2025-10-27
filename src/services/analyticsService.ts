import { createClient } from '@supabase/supabase-js';
import type {
  Lesson,
  LessonEngagement,
  LessonFeedback,
  LessonPerformanceMetrics,
  LessonAnalyticsSummary,
  CreateLessonInput,
  CreateEngagementInput,
  CreateFeedbackInput,
  UpdateEngagementInput,
  AnalyticsFilters,
  GPTAnalysisExport
} from '../types/analytics';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const analyticsService = {
  // LESSON CRUD OPERATIONS
  async createLesson(input: CreateLessonInput): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .insert({
        title: input.title,
        description: input.description,
        content: input.content,
        difficulty_level: input.difficulty_level,
        subject_category: input.subject_category,
        learning_objectives: input.learning_objectives,
        is_active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lesson:', error);
      return null;
    }

    return data;
  },

  async getLesson(lessonId: string): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('lesson_id', lessonId)
      .single();

    if (error) {
      console.error('Error fetching lesson:', error);
      return null;
    }

    return data;
  },

  async getAllLessons(filters?: AnalyticsFilters): Promise<Lesson[]> {
    let query = supabase
      .from('lessons')
      .select('*')
      .eq('is_active', true)
      .order('creation_date', { ascending: false });

    if (filters?.subject_category) {
      query = query.eq('subject_category', filters.subject_category);
    }

    if (filters?.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }

    return data || [];
  },

  async updateLesson(lessonId: string, updates: Partial<CreateLessonInput>): Promise<Lesson | null> {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('lesson_id', lessonId)
      .select()
      .single();

    if (error) {
      console.error('Error updating lesson:', error);
      return null;
    }

    return data;
  },

  async deleteLesson(lessonId: string): Promise<boolean> {
    const { error } = await supabase
      .from('lessons')
      .update({ is_active: false })
      .eq('lesson_id', lessonId);

    if (error) {
      console.error('Error deleting lesson:', error);
      return false;
    }

    return true;
  },

  // ENGAGEMENT TRACKING
  async startEngagement(input: CreateEngagementInput): Promise<LessonEngagement | null> {
    const { data, error } = await supabase
      .from('lesson_engagement')
      .insert({
        session_id: input.session_id,
        lesson_id: input.lesson_id,
        completion_status: input.completion_status || 'partial',
        interaction_count: input.interaction_count || 0,
        scroll_depth_percentage: input.scroll_depth_percentage || 0,
        quiz_attempts: input.quiz_attempts || 0,
        quiz_scores: input.quiz_scores || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error starting engagement:', error);
      return null;
    }

    return data;
  },

  async updateEngagement(engagementId: string, updates: UpdateEngagementInput): Promise<LessonEngagement | null> {
    const { data, error } = await supabase
      .from('lesson_engagement')
      .update(updates)
      .eq('engagement_id', engagementId)
      .select()
      .single();

    if (error) {
      console.error('Error updating engagement:', error);
      return null;
    }

    return data;
  },

  async getEngagementsByLesson(lessonId: string, filters?: AnalyticsFilters): Promise<LessonEngagement[]> {
    let query = supabase
      .from('lesson_engagement')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('session_start_time', { ascending: false });

    if (filters?.completion_status) {
      query = query.eq('completion_status', filters.completion_status);
    }

    if (filters?.date_from) {
      query = query.gte('session_start_time', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('session_start_time', filters.date_to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching engagements:', error);
      return [];
    }

    return data || [];
  },

  async getEngagementsBySession(sessionId: string): Promise<LessonEngagement[]> {
    const { data, error } = await supabase
      .from('lesson_engagement')
      .select('*')
      .eq('session_id', sessionId)
      .order('session_start_time', { ascending: false });

    if (error) {
      console.error('Error fetching session engagements:', error);
      return [];
    }

    return data || [];
  },

  // FEEDBACK OPERATIONS
  async submitFeedback(input: CreateFeedbackInput): Promise<LessonFeedback | null> {
    const { data, error } = await supabase
      .from('lesson_feedback')
      .insert({
        session_id: input.session_id,
        lesson_id: input.lesson_id,
        rating: input.rating,
        written_feedback: input.written_feedback,
        difficulty_perception: input.difficulty_perception,
        clarity_rating: input.clarity_rating
      })
      .select()
      .single();

    if (error) {
      console.error('Error submitting feedback:', error);
      return null;
    }

    return data;
  },

  async getFeedbackByLesson(lessonId: string, filters?: AnalyticsFilters): Promise<LessonFeedback[]> {
    let query = supabase
      .from('lesson_feedback')
      .select('*')
      .eq('lesson_id', lessonId)
      .order('timestamp', { ascending: false });

    if (filters?.date_from) {
      query = query.gte('timestamp', filters.date_from);
    }

    if (filters?.date_to) {
      query = query.lte('timestamp', filters.date_to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching feedback:', error);
      return [];
    }

    return data || [];
  },

  // PERFORMANCE METRICS
  async updatePerformanceMetrics(lessonId: string): Promise<boolean> {
    const { error } = await supabase.rpc('update_lesson_performance_metrics', {
      p_lesson_id: lessonId
    });

    if (error) {
      console.error('Error updating performance metrics:', error);
      return false;
    }

    return true;
  },

  async getPerformanceMetrics(lessonId: string): Promise<LessonPerformanceMetrics | null> {
    const { data, error } = await supabase
      .from('lesson_performance_metrics')
      .select('*')
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching performance metrics:', error);
      return null;
    }

    return data;
  },

  async getAllPerformanceMetrics(): Promise<LessonPerformanceMetrics[]> {
    const { data, error } = await supabase
      .from('lesson_performance_metrics')
      .select('*')
      .order('last_calculated', { ascending: false });

    if (error) {
      console.error('Error fetching all performance metrics:', error);
      return [];
    }

    return data || [];
  },

  // ANALYTICS SUMMARY
  async getLessonAnalyticsSummary(filters?: AnalyticsFilters): Promise<LessonAnalyticsSummary[]> {
    let query = supabase
      .from('lesson_analytics_summary')
      .select('*')
      .order('total_attempts', { ascending: false });

    if (filters?.subject_category) {
      query = query.eq('subject_category', filters.subject_category);
    }

    if (filters?.difficulty_level) {
      query = query.eq('difficulty_level', filters.difficulty_level);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching analytics summary:', error);
      return [];
    }

    return data || [];
  },

  async getLessonAnalyticsById(lessonId: string): Promise<LessonAnalyticsSummary | null> {
    const { data, error } = await supabase
      .from('lesson_analytics_summary')
      .select('*')
      .eq('lesson_id', lessonId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching lesson analytics:', error);
      return null;
    }

    return data;
  },

  // GPT INTEGRATION - EXPORT DATA FOR ANALYSIS
  async exportDataForGPTAnalysis(filters?: AnalyticsFilters): Promise<GPTAnalysisExport | null> {
    try {
      const lessons = await this.getAllLessons(filters);
      const lessonIds = lessons.map(l => l.lesson_id);

      const engagementPromises = lessonIds.map(id => this.getEngagementsByLesson(id, filters));
      const feedbackPromises = lessonIds.map(id => this.getFeedbackByLesson(id, filters));
      const metricsPromises = lessonIds.map(id => this.getPerformanceMetrics(id));

      const [engagementArrays, feedbackArrays, metricsArray] = await Promise.all([
        Promise.all(engagementPromises),
        Promise.all(feedbackPromises),
        Promise.all(metricsPromises)
      ]);

      const engagement_data = engagementArrays.flat();
      const feedback_data = feedbackArrays.flat();
      const performance_metrics = metricsArray.filter((m): m is LessonPerformanceMetrics => m !== null);
      const summary = await this.getLessonAnalyticsSummary(filters);

      return {
        lessons,
        engagement_data,
        feedback_data,
        performance_metrics,
        summary,
        export_timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting data for GPT analysis:', error);
      return null;
    }
  },

  // ANALYTICS INSIGHTS
  async getTopPerformingLessons(limit: number = 10): Promise<LessonAnalyticsSummary[]> {
    const { data, error } = await supabase
      .from('lesson_analytics_summary')
      .select('*')
      .order('avg_rating', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top performing lessons:', error);
      return [];
    }

    return data || [];
  },

  async getLessonsNeedingImprovement(limit: number = 10): Promise<LessonAnalyticsSummary[]> {
    const { data, error } = await supabase
      .from('lesson_analytics_summary')
      .select('*')
      .order('avg_rating', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching lessons needing improvement:', error);
      return [];
    }

    return data || [];
  },

  async getEngagementTrends(lessonId: string, days: number = 30): Promise<any[]> {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);

    const { data, error } = await supabase
      .from('lesson_engagement')
      .select('session_start_time, completion_status, duration_seconds')
      .eq('lesson_id', lessonId)
      .gte('session_start_time', dateFrom.toISOString())
      .order('session_start_time', { ascending: true });

    if (error) {
      console.error('Error fetching engagement trends:', error);
      return [];
    }

    return data || [];
  }
};
