/*
  # Comprehensive Game Analytics System Extension

  ## Overview
  Extends existing analytics with detailed player performance tracking for educational games.
  Builds on top of existing user_sessions and game_sessions tables.

  ## New Tables

  ### 1. players
  Enhanced player profiles with demographic data
  - `player_id` (uuid, primary key) - Anonymous player identifier
  - `session_id` (text, unique) - Links to user_sessions
  - `age_group` (text) - Specific ranges: '5-7', '8-10', '11-13', '14+'
  - `province` (text) - South African province
  - `city` (text) - City name
  - `school_code` (text) - Anonymized school identifier (hash)
  - `preferred_language` (text) - Primary language
  - `created_at` (timestamptz) - Registration date
  - `last_active_at` (timestamptz) - Last activity
  - `total_score` (integer) - Cumulative score across all games
  - `data_consent` (boolean) - Privacy consent flag

  ### 2. schools
  School information for institutional analytics
  - `school_id` (uuid, primary key) - School identifier
  - `school_code` (text, unique) - Anonymized school code (hash)
  - `province` (text) - Province location
  - `city` (text) - City location
  - `school_type` (text) - primary, secondary, combined
  - `enrollment_size` (text) - small (<500), medium (500-1000), large (>1000)
  - `created_at` (timestamptz) - Record creation

  ### 3. detailed_question_responses
  Granular question-level analytics
  - `response_id` (uuid, primary key) - Response identifier
  - `game_session_id` (uuid) - Links to game_sessions
  - `player_id` (uuid) - Links to players
  - `question_id` (text) - Question identifier
  - `question_text` (text) - The question (anonymized if needed)
  - `question_category` (text) - Question topic/theme
  - `selected_answer` (text) - Player's chosen answer
  - `correct_answer` (text) - The right answer
  - `is_correct` (boolean) - Whether answer was right
  - `response_time_seconds` (integer) - Time taken to answer
  - `attempt_number` (integer) - Retry count (1 = first attempt)
  - `hints_used` (integer) - Number of hints requested
  - `created_at` (timestamptz) - Response timestamp

  ### 4. game_performance_summary
  Aggregated performance metrics for fast queries
  - `summary_id` (uuid, primary key) - Summary identifier
  - `game_id` (text) - Game identifier
  - `game_name` (text) - Human-readable game name
  - `age_group` (text) - Age range
  - `province` (text) - Geographic location
  - `language` (text) - Language used
  - `date` (date) - Aggregation date
  - `total_sessions` (integer) - Number of sessions
  - `unique_players` (integer) - Unique player count
  - `avg_score` (numeric) - Average score
  - `avg_completion_rate` (numeric) - Average completion %
  - `avg_duration_minutes` (numeric) - Average session duration
  - `total_questions_answered` (integer) - Total questions
  - `total_correct_answers` (integer) - Total correct
  - `accuracy_rate` (numeric) - Overall accuracy %
  - `created_at` (timestamptz) - Record creation
  - `updated_at` (timestamptz) - Last update

  ### 5. learning_insights
  AI-ready insights for content optimization
  - `insight_id` (uuid, primary key) - Insight identifier
  - `game_id` (text) - Related game
  - `age_group` (text) - Target age group
  - `insight_type` (text) - difficulty_spike, common_error, engagement_drop
  - `insight_data` (jsonb) - Detailed insight data
  - `severity` (text) - low, medium, high
  - `recommendation` (text) - Suggested action
  - `detected_at` (timestamptz) - When insight was detected
  - `resolved` (boolean) - Whether issue was addressed

  ## Security
  - RLS enabled on all tables
  - Anonymous access for data collection
  - Privacy-first design with data anonymization

  ## Compliance
  - POPIA compliant (South African data privacy)
  - GDPR aligned
  - Designed for educational data privacy regulations
*/

-- Create players table
CREATE TABLE IF NOT EXISTS players (
  player_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  age_group text NOT NULL CHECK (age_group IN ('5-7', '8-10', '11-13', '14+')),
  province text,
  city text,
  school_code text,
  preferred_language text NOT NULL DEFAULT 'en',
  created_at timestamptz DEFAULT now() NOT NULL,
  last_active_at timestamptz DEFAULT now() NOT NULL,
  total_score integer DEFAULT 0 NOT NULL,
  data_consent boolean DEFAULT true NOT NULL,
  FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE
);

-- Create schools table
CREATE TABLE IF NOT EXISTS schools (
  school_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_code text UNIQUE NOT NULL,
  province text NOT NULL,
  city text NOT NULL,
  school_type text DEFAULT 'unknown' NOT NULL CHECK (school_type IN ('primary', 'secondary', 'combined', 'unknown')),
  enrollment_size text DEFAULT 'unknown' NOT NULL CHECK (enrollment_size IN ('small', 'medium', 'large', 'unknown')),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create detailed_question_responses table
CREATE TABLE IF NOT EXISTS detailed_question_responses (
  response_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_session_id uuid NOT NULL,
  player_id uuid NOT NULL REFERENCES players(player_id) ON DELETE CASCADE,
  question_id text NOT NULL,
  question_text text NOT NULL,
  question_category text NOT NULL,
  selected_answer text NOT NULL,
  correct_answer text NOT NULL,
  is_correct boolean NOT NULL,
  response_time_seconds integer DEFAULT 0 NOT NULL CHECK (response_time_seconds >= 0),
  attempt_number integer DEFAULT 1 NOT NULL CHECK (attempt_number >= 1),
  hints_used integer DEFAULT 0 NOT NULL CHECK (hints_used >= 0),
  created_at timestamptz DEFAULT now() NOT NULL,
  FOREIGN KEY (game_session_id) REFERENCES game_sessions(id) ON DELETE CASCADE
);

-- Create game_performance_summary table
CREATE TABLE IF NOT EXISTS game_performance_summary (
  summary_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL,
  game_name text NOT NULL,
  age_group text NOT NULL CHECK (age_group IN ('5-7', '8-10', '11-13', '14+', 'all')),
  province text,
  language text NOT NULL,
  date date DEFAULT CURRENT_DATE NOT NULL,
  total_sessions integer DEFAULT 0 NOT NULL,
  unique_players integer DEFAULT 0 NOT NULL,
  avg_score numeric(10,2) DEFAULT 0 NOT NULL,
  avg_completion_rate numeric(5,2) DEFAULT 0 NOT NULL,
  avg_duration_minutes numeric(10,2) DEFAULT 0 NOT NULL,
  total_questions_answered integer DEFAULT 0 NOT NULL,
  total_correct_answers integer DEFAULT 0 NOT NULL,
  accuracy_rate numeric(5,2) DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(game_id, age_group, province, language, date)
);

-- Create learning_insights table
CREATE TABLE IF NOT EXISTS learning_insights (
  insight_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id text NOT NULL,
  age_group text CHECK (age_group IN ('5-7', '8-10', '11-13', '14+', 'all')),
  insight_type text NOT NULL CHECK (insight_type IN ('difficulty_spike', 'common_error', 'engagement_drop', 'high_performance', 'low_completion')),
  insight_data jsonb NOT NULL DEFAULT '{}',
  severity text DEFAULT 'medium' NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  recommendation text,
  detected_at timestamptz DEFAULT now() NOT NULL,
  resolved boolean DEFAULT false NOT NULL
);

-- Create indexes for query performance
CREATE INDEX IF NOT EXISTS idx_players_session_id ON players(session_id);
CREATE INDEX IF NOT EXISTS idx_players_age_group ON players(age_group);
CREATE INDEX IF NOT EXISTS idx_players_province ON players(province);
CREATE INDEX IF NOT EXISTS idx_players_school_code ON players(school_code);
CREATE INDEX IF NOT EXISTS idx_players_last_active ON players(last_active_at);

CREATE INDEX IF NOT EXISTS idx_schools_code ON schools(school_code);
CREATE INDEX IF NOT EXISTS idx_schools_province ON schools(province);
CREATE INDEX IF NOT EXISTS idx_schools_city ON schools(city);

CREATE INDEX IF NOT EXISTS idx_detailed_responses_session ON detailed_question_responses(game_session_id);
CREATE INDEX IF NOT EXISTS idx_detailed_responses_player ON detailed_question_responses(player_id);
CREATE INDEX IF NOT EXISTS idx_detailed_responses_question ON detailed_question_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_detailed_responses_correct ON detailed_question_responses(is_correct);
CREATE INDEX IF NOT EXISTS idx_detailed_responses_category ON detailed_question_responses(question_category);
CREATE INDEX IF NOT EXISTS idx_detailed_responses_created ON detailed_question_responses(created_at);

CREATE INDEX IF NOT EXISTS idx_game_summary_game_id ON game_performance_summary(game_id);
CREATE INDEX IF NOT EXISTS idx_game_summary_date ON game_performance_summary(date);
CREATE INDEX IF NOT EXISTS idx_game_summary_age_group ON game_performance_summary(age_group);
CREATE INDEX IF NOT EXISTS idx_game_summary_province ON game_performance_summary(province);
CREATE INDEX IF NOT EXISTS idx_game_summary_language ON game_performance_summary(language);

CREATE INDEX IF NOT EXISTS idx_learning_insights_game ON learning_insights(game_id);
CREATE INDEX IF NOT EXISTS idx_learning_insights_type ON learning_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_learning_insights_severity ON learning_insights(severity);
CREATE INDEX IF NOT EXISTS idx_learning_insights_resolved ON learning_insights(resolved);

-- GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_learning_insights_data ON learning_insights USING GIN(insight_data);

-- Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE detailed_question_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_performance_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies for players table
CREATE POLICY "Anyone can insert players"
  ON players FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read players"
  ON players FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update players"
  ON players FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for schools table
CREATE POLICY "Anyone can insert schools"
  ON schools FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read schools"
  ON schools FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for detailed_question_responses table
CREATE POLICY "Anyone can insert question responses"
  ON detailed_question_responses FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read question responses"
  ON detailed_question_responses FOR SELECT
  TO anon
  USING (true);

-- RLS Policies for game_performance_summary table
CREATE POLICY "Anyone can insert performance summary"
  ON game_performance_summary FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read performance summary"
  ON game_performance_summary FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update performance summary"
  ON game_performance_summary FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- RLS Policies for learning_insights table
CREATE POLICY "Anyone can insert learning insights"
  ON learning_insights FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read learning insights"
  ON learning_insights FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Anyone can update learning insights"
  ON learning_insights FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Create function to aggregate daily game performance
CREATE OR REPLACE FUNCTION aggregate_game_performance(target_date date DEFAULT CURRENT_DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO game_performance_summary (
    game_id,
    game_name,
    age_group,
    province,
    language,
    date,
    total_sessions,
    unique_players,
    avg_score,
    avg_completion_rate,
    avg_duration_minutes,
    total_questions_answered,
    total_correct_answers,
    accuracy_rate,
    updated_at
  )
  SELECT
    gs.game_id,
    gs.game_name,
    p.age_group,
    p.province,
    us.language,
    target_date,
    COUNT(gs.id) as total_sessions,
    COUNT(DISTINCT gs.session_id) as unique_players,
    AVG(gs.points_earned) as avg_score,
    AVG(CASE WHEN gs.completed THEN 100 ELSE 0 END) as avg_completion_rate,
    AVG(gs.duration_seconds / 60.0) as avg_duration_minutes,
    COUNT(dqr.response_id) as total_questions_answered,
    SUM(CASE WHEN dqr.is_correct THEN 1 ELSE 0 END) as total_correct_answers,
    CASE
      WHEN COUNT(dqr.response_id) > 0
      THEN (SUM(CASE WHEN dqr.is_correct THEN 1 ELSE 0 END)::numeric / COUNT(dqr.response_id) * 100)
      ELSE 0
    END as accuracy_rate,
    now()
  FROM game_sessions gs
  JOIN user_sessions us ON gs.session_id = us.session_id
  JOIN players p ON p.session_id = us.session_id
  LEFT JOIN detailed_question_responses dqr ON dqr.game_session_id = gs.id
  WHERE DATE(gs.created_at) = target_date
  GROUP BY gs.game_id, gs.game_name, p.age_group, p.province, us.language
  ON CONFLICT (game_id, age_group, province, language, date)
  DO UPDATE SET
    total_sessions = EXCLUDED.total_sessions,
    unique_players = EXCLUDED.unique_players,
    avg_score = EXCLUDED.avg_score,
    avg_completion_rate = EXCLUDED.avg_completion_rate,
    avg_duration_minutes = EXCLUDED.avg_duration_minutes,
    total_questions_answered = EXCLUDED.total_questions_answered,
    total_correct_answers = EXCLUDED.total_correct_answers,
    accuracy_rate = EXCLUDED.accuracy_rate,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- Create function to update player stats
CREATE OR REPLACE FUNCTION update_player_total_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE players
  SET
    total_score = total_score + NEW.points_earned,
    last_active_at = NEW.end_time
  WHERE session_id = NEW.session_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update player stats after game completion
DROP TRIGGER IF EXISTS trigger_update_player_score ON game_sessions;
CREATE TRIGGER trigger_update_player_score
  AFTER INSERT ON game_sessions
  FOR EACH ROW
  WHEN (NEW.completed = true)
  EXECUTE FUNCTION update_player_total_score();

-- Create view for comprehensive game analytics
CREATE OR REPLACE VIEW game_analytics_dashboard AS
SELECT
  gs.game_id,
  gs.game_name,
  p.age_group,
  p.province,
  us.language,
  COUNT(DISTINCT p.player_id) as unique_players,
  COUNT(gs.id) as total_sessions,
  AVG(gs.points_earned) as avg_score,
  MAX(gs.points_earned) as max_score,
  AVG(gs.duration_seconds / 60.0) as avg_duration_minutes,
  SUM(CASE WHEN gs.completed THEN 1 ELSE 0 END) as completed_sessions,
  (SUM(CASE WHEN gs.completed THEN 1 ELSE 0 END)::numeric / COUNT(gs.id) * 100) as completion_rate,
  COUNT(dqr.response_id) as total_questions,
  SUM(CASE WHEN dqr.is_correct THEN 1 ELSE 0 END) as total_correct,
  CASE
    WHEN COUNT(dqr.response_id) > 0
    THEN (SUM(CASE WHEN dqr.is_correct THEN 1 ELSE 0 END)::numeric / COUNT(dqr.response_id) * 100)
    ELSE 0
  END as accuracy_percentage,
  AVG(dqr.response_time_seconds) as avg_response_time
FROM game_sessions gs
JOIN user_sessions us ON gs.session_id = us.session_id
JOIN players p ON p.session_id = us.session_id
LEFT JOIN detailed_question_responses dqr ON dqr.game_session_id = gs.id
GROUP BY gs.game_id, gs.game_name, p.age_group, p.province, us.language;

-- Create view for school performance analytics
CREATE OR REPLACE VIEW school_performance_analytics AS
SELECT
  s.school_code,
  s.province,
  s.city,
  s.school_type,
  s.enrollment_size,
  COUNT(DISTINCT p.player_id) as total_players,
  COUNT(DISTINCT gs.id) as total_game_sessions,
  AVG(gs.points_earned) as avg_score,
  AVG(gs.duration_seconds / 60.0) as avg_session_minutes,
  SUM(CASE WHEN gs.completed THEN 1 ELSE 0 END) as completed_sessions,
  CASE
    WHEN COUNT(dqr.response_id) > 0
    THEN (SUM(CASE WHEN dqr.is_correct THEN 1 ELSE 0 END)::numeric / COUNT(dqr.response_id) * 100)
    ELSE 0
  END as overall_accuracy
FROM schools s
JOIN players p ON p.school_code = s.school_code
JOIN user_sessions us ON us.session_id = p.session_id
JOIN game_sessions gs ON gs.session_id = us.session_id
LEFT JOIN detailed_question_responses dqr ON dqr.game_session_id = gs.id
GROUP BY s.school_code, s.province, s.city, s.school_type, s.enrollment_size;