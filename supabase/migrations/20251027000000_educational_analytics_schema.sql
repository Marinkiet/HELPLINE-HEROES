/*
  # Educational Analytics Database Schema

  ## Overview
  Comprehensive analytics system for tracking educational lesson performance and user engagement.
  Designed to capture actionable insights for GPT-powered lesson optimization.

  ## New Tables

  ### 1. lessons
  Stores all educational lesson content and metadata
  - `lesson_id` (uuid, primary key) - Unique lesson identifier
  - `title` (text) - Lesson title
  - `description` (text) - Lesson description
  - `content` (jsonb) - Full lesson content in structured format
  - `difficulty_level` (text) - beginner, intermediate, advanced
  - `subject_category` (text) - Subject classification
  - `learning_objectives` (jsonb) - Array of learning objectives
  - `creation_date` (timestamptz) - When lesson was created
  - `last_modified` (timestamptz) - Last update timestamp
  - `is_active` (boolean) - Whether lesson is currently active

  ### 2. lesson_engagement
  Tracks detailed user interaction with lessons (extends existing game_sessions)
  - `engagement_id` (uuid, primary key) - Unique engagement record
  - `session_id` (text) - References user_sessions
  - `lesson_id` (uuid, foreign key) - References lessons table
  - `session_start_time` (timestamptz) - Session start
  - `session_end_time` (timestamptz) - Session end
  - `duration_seconds` (integer) - Calculated session duration
  - `completion_status` (text) - completed, partial, abandoned
  - `interaction_count` (integer) - Number of user interactions
  - `scroll_depth_percentage` (integer) - How far user scrolled (0-100)
  - `quiz_attempts` (integer) - Number of quiz attempts
  - `quiz_scores` (jsonb) - Array of quiz scores with timestamps
  - `created_at` (timestamptz) - Record creation time

  ### 3. lesson_feedback
  Captures user feedback and ratings for lessons
  - `feedback_id` (uuid, primary key) - Unique feedback identifier
  - `session_id` (text) - References user_sessions
  - `lesson_id` (uuid, foreign key) - References lessons table
  - `rating` (integer) - Rating 1-5 scale
  - `written_feedback` (text) - Detailed written feedback
  - `difficulty_perception` (text) - too_easy, just_right, too_hard
  - `clarity_rating` (integer) - Content clarity rating 1-5
  - `timestamp` (timestamptz) - When feedback was submitted

  ### 4. lesson_performance_metrics
  Aggregated performance metrics per lesson (updated periodically)
  - `metric_id` (uuid, primary key) - Unique metric record
  - `lesson_id` (uuid, foreign key) - References lessons table
  - `average_completion_rate` (numeric) - Percentage who completed
  - `average_session_duration` (numeric) - Average time in seconds
  - `user_satisfaction_score` (numeric) - Average rating
  - `drop_off_points` (jsonb) - Array of common abandonment points
  - `common_struggle_areas` (jsonb) - Areas where users struggle
  - `total_attempts` (integer) - Total number of lesson attempts
  - `total_completions` (integer) - Total successful completions
  - `last_calculated` (timestamptz) - When metrics were last updated

  ## Indexes
  - Optimized for querying by lesson_id, session_id, timestamps
  - JSONB GIN indexes for efficient JSON querying

  ## Security
  - Row Level Security enabled on all tables
  - Policies allow anonymous access for educational content
  - Read access for analytics, write access for engagement tracking
*/

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  lesson_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  content jsonb NOT NULL DEFAULT '{}',
  difficulty_level text CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  subject_category text NOT NULL,
  learning_objectives jsonb DEFAULT '[]',
  creation_date timestamptz DEFAULT now(),
  last_modified timestamptz DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create lesson_engagement table
CREATE TABLE IF NOT EXISTS lesson_engagement (
  engagement_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  lesson_id uuid NOT NULL REFERENCES lessons(lesson_id) ON DELETE CASCADE,
  session_start_time timestamptz DEFAULT now(),
  session_end_time timestamptz,
  duration_seconds integer DEFAULT 0,
  completion_status text CHECK (completion_status IN ('completed', 'partial', 'abandoned')) DEFAULT 'partial',
  interaction_count integer DEFAULT 0,
  scroll_depth_percentage integer CHECK (scroll_depth_percentage >= 0 AND scroll_depth_percentage <= 100) DEFAULT 0,
  quiz_attempts integer DEFAULT 0,
  quiz_scores jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE
);

-- Create lesson_feedback table
CREATE TABLE IF NOT EXISTS lesson_feedback (
  feedback_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  lesson_id uuid NOT NULL REFERENCES lessons(lesson_id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  written_feedback text,
  difficulty_perception text CHECK (difficulty_perception IN ('too_easy', 'just_right', 'too_hard')),
  clarity_rating integer CHECK (clarity_rating >= 1 AND clarity_rating <= 5),
  timestamp timestamptz DEFAULT now(),
  FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE
);

-- Create lesson_performance_metrics table
CREATE TABLE IF NOT EXISTS lesson_performance_metrics (
  metric_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(lesson_id) ON DELETE CASCADE,
  average_completion_rate numeric(5,2) DEFAULT 0,
  average_session_duration numeric(10,2) DEFAULT 0,
  user_satisfaction_score numeric(3,2) DEFAULT 0,
  drop_off_points jsonb DEFAULT '[]',
  common_struggle_areas jsonb DEFAULT '[]',
  total_attempts integer DEFAULT 0,
  total_completions integer DEFAULT 0,
  last_calculated timestamptz DEFAULT now(),
  UNIQUE(lesson_id)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_lesson_engagement_lesson_id ON lesson_engagement(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_engagement_session_id ON lesson_engagement(session_id);
CREATE INDEX IF NOT EXISTS idx_lesson_engagement_session_start ON lesson_engagement(session_start_time);
CREATE INDEX IF NOT EXISTS idx_lesson_engagement_completion ON lesson_engagement(completion_status);

CREATE INDEX IF NOT EXISTS idx_lesson_feedback_lesson_id ON lesson_feedback(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_session_id ON lesson_feedback(session_id);
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_rating ON lesson_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_lesson_feedback_timestamp ON lesson_feedback(timestamp);

CREATE INDEX IF NOT EXISTS idx_lessons_subject ON lessons(subject_category);
CREATE INDEX IF NOT EXISTS idx_lessons_difficulty ON lessons(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_lessons_active ON lessons(is_active);

-- GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_lessons_content ON lessons USING GIN(content);
CREATE INDEX IF NOT EXISTS idx_lessons_objectives ON lessons USING GIN(learning_objectives);
CREATE INDEX IF NOT EXISTS idx_lesson_engagement_quiz_scores ON lesson_engagement USING GIN(quiz_scores);
CREATE INDEX IF NOT EXISTS idx_lesson_metrics_drop_off ON lesson_performance_metrics USING GIN(drop_off_points);
CREATE INDEX IF NOT EXISTS idx_lesson_metrics_struggle ON lesson_performance_metrics USING GIN(common_struggle_areas);

-- Enable Row Level Security
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_performance_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lessons table (allow anonymous access)
CREATE POLICY "Anyone can view active lessons"
  ON lessons FOR SELECT
  USING (is_active = true);

CREATE POLICY "Anonymous users can view all lessons"
  ON lessons FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can create lessons"
  ON lessons FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update lessons"
  ON lessons FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for lesson_engagement table
CREATE POLICY "Anyone can view engagement data"
  ON lesson_engagement FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert engagement data"
  ON lesson_engagement FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update engagement data"
  ON lesson_engagement FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for lesson_feedback table
CREATE POLICY "Anyone can view feedback"
  ON lesson_feedback FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert feedback"
  ON lesson_feedback FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update feedback"
  ON lesson_feedback FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for lesson_performance_metrics table
CREATE POLICY "Anyone can view performance metrics"
  ON lesson_performance_metrics FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anonymous users can insert metrics"
  ON lesson_performance_metrics FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anonymous users can update metrics"
  ON lesson_performance_metrics FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create function to automatically update lesson performance metrics
CREATE OR REPLACE FUNCTION update_lesson_performance_metrics(p_lesson_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO lesson_performance_metrics (
    lesson_id,
    average_completion_rate,
    average_session_duration,
    user_satisfaction_score,
    total_attempts,
    total_completions,
    last_calculated
  )
  SELECT
    p_lesson_id,
    (COUNT(*) FILTER (WHERE completion_status = 'completed')::numeric / NULLIF(COUNT(*), 0) * 100),
    AVG(duration_seconds),
    (SELECT AVG(rating)::numeric FROM lesson_feedback WHERE lesson_id = p_lesson_id),
    COUNT(*),
    COUNT(*) FILTER (WHERE completion_status = 'completed'),
    now()
  FROM lesson_engagement
  WHERE lesson_id = p_lesson_id
  ON CONFLICT (lesson_id)
  DO UPDATE SET
    average_completion_rate = EXCLUDED.average_completion_rate,
    average_session_duration = EXCLUDED.average_session_duration,
    user_satisfaction_score = EXCLUDED.user_satisfaction_score,
    total_attempts = EXCLUDED.total_attempts,
    total_completions = EXCLUDED.total_completions,
    last_calculated = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update last_modified on lessons
CREATE OR REPLACE FUNCTION update_lesson_modified_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_lessons_modified
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_lesson_modified_timestamp();

-- Create view for comprehensive lesson analytics
CREATE OR REPLACE VIEW lesson_analytics_summary AS
SELECT
  l.lesson_id,
  l.title,
  l.subject_category,
  l.difficulty_level,
  COUNT(DISTINCT le.session_id) as unique_users,
  COUNT(le.engagement_id) as total_attempts,
  COUNT(CASE WHEN le.completion_status = 'completed' THEN 1 END) as total_completions,
  ROUND(AVG(le.duration_seconds), 2) as avg_duration_seconds,
  ROUND(AVG(le.interaction_count), 2) as avg_interactions,
  ROUND(AVG(le.scroll_depth_percentage), 2) as avg_scroll_depth,
  ROUND(AVG(lf.rating), 2) as avg_rating,
  COUNT(lf.feedback_id) as feedback_count,
  l.creation_date,
  l.last_modified
FROM lessons l
LEFT JOIN lesson_engagement le ON l.lesson_id = le.lesson_id
LEFT JOIN lesson_feedback lf ON l.lesson_id = lf.lesson_id
WHERE l.is_active = true
GROUP BY l.lesson_id, l.title, l.subject_category, l.difficulty_level, l.creation_date, l.last_modified;
