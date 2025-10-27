export interface Lesson {
  lesson_id: string;
  title: string;
  description: string;
  content: Record<string, any>;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  subject_category: string;
  learning_objectives: string[];
  creation_date: string;
  last_modified: string;
  is_active: boolean;
}

export interface LessonEngagement {
  engagement_id: string;
  session_id: string;
  lesson_id: string;
  session_start_time: string;
  session_end_time?: string;
  duration_seconds: number;
  completion_status: 'completed' | 'partial' | 'abandoned';
  interaction_count: number;
  scroll_depth_percentage: number;
  quiz_attempts: number;
  quiz_scores: QuizScore[];
  created_at: string;
}

export interface QuizScore {
  score: number;
  max_score: number;
  timestamp: string;
  quiz_id?: string;
}

export interface LessonFeedback {
  feedback_id: string;
  session_id: string;
  lesson_id: string;
  rating: number;
  written_feedback?: string;
  difficulty_perception: 'too_easy' | 'just_right' | 'too_hard';
  clarity_rating: number;
  timestamp: string;
}

export interface LessonPerformanceMetrics {
  metric_id: string;
  lesson_id: string;
  average_completion_rate: number;
  average_session_duration: number;
  user_satisfaction_score: number;
  drop_off_points: DropOffPoint[];
  common_struggle_areas: StruggleArea[];
  total_attempts: number;
  total_completions: number;
  last_calculated: string;
}

export interface DropOffPoint {
  section: string;
  percentage: number;
  count: number;
}

export interface StruggleArea {
  area: string;
  description: string;
  frequency: number;
}

export interface LessonAnalyticsSummary {
  lesson_id: string;
  title: string;
  subject_category: string;
  difficulty_level: string;
  unique_users: number;
  total_attempts: number;
  total_completions: number;
  avg_duration_seconds: number;
  avg_interactions: number;
  avg_scroll_depth: number;
  avg_rating: number;
  feedback_count: number;
  creation_date: string;
  last_modified: string;
}

export interface CreateLessonInput {
  title: string;
  description?: string;
  content: Record<string, any>;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  subject_category: string;
  learning_objectives: string[];
}

export interface CreateEngagementInput {
  session_id: string;
  lesson_id: string;
  completion_status?: 'completed' | 'partial' | 'abandoned';
  interaction_count?: number;
  scroll_depth_percentage?: number;
  quiz_attempts?: number;
  quiz_scores?: QuizScore[];
}

export interface CreateFeedbackInput {
  session_id: string;
  lesson_id: string;
  rating: number;
  written_feedback?: string;
  difficulty_perception: 'too_easy' | 'just_right' | 'too_hard';
  clarity_rating: number;
}

export interface UpdateEngagementInput {
  session_end_time?: string;
  duration_seconds?: number;
  completion_status?: 'completed' | 'partial' | 'abandoned';
  interaction_count?: number;
  scroll_depth_percentage?: number;
  quiz_attempts?: number;
  quiz_scores?: QuizScore[];
}

export interface AnalyticsFilters {
  subject_category?: string;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  date_from?: string;
  date_to?: string;
  completion_status?: 'completed' | 'partial' | 'abandoned';
}

export interface GPTAnalysisExport {
  lessons: Lesson[];
  engagement_data: LessonEngagement[];
  feedback_data: LessonFeedback[];
  performance_metrics: LessonPerformanceMetrics[];
  summary: LessonAnalyticsSummary[];
  export_timestamp: string;
}
