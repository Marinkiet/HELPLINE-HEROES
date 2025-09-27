/*
  # User Engagement Tracking System

  1. New Tables
    - `user_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, unique session identifier)
      - `age_group` (text, selected age group)
      - `language` (text, selected language)
      - `location_country` (text, user's country)
      - `location_region` (text, user's region/state)
      - `location_city` (text, user's city)
      - `screen_time_seconds` (integer, total screen time)
      - `points_earned` (integer, total points from games)
      - `games_completed` (jsonb, array of completed game IDs)
      - `last_activity` (timestamp, last user activity)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `game_sessions`
      - `id` (uuid, primary key)
      - `session_id` (text, references user_sessions)
      - `game_id` (text, game identifier)
      - `game_name` (text, game name)
      - `start_time` (timestamp)
      - `end_time` (timestamp)
      - `duration_seconds` (integer)
      - `points_earned` (integer)
      - `completed` (boolean)
      - `created_at` (timestamp)

    - `user_interactions`
      - `id` (uuid, primary key)
      - `session_id` (text, references user_sessions)
      - `interaction_type` (text, type of interaction)
      - `interaction_data` (jsonb, additional data)
      - `timestamp` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for anonymous access (since users aren't authenticated)
    - Add policies for reading aggregated data

  3. Indexes
    - Add indexes for common queries
    - Optimize for analytics queries
*/

-- Create user_sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  age_group text, --NOT NULL CHECK (age_group IN ('early', 'middle', 'teen')),
  language text NOT NULL DEFAULT 'en',
  location_country text,
  location_region text,
  location_city text,
  screen_time_seconds integer DEFAULT 0,
  points_earned integer DEFAULT 0,
  games_completed jsonb DEFAULT '[]'::jsonb,
  last_activity timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  game_id text NOT NULL,
  game_name text NOT NULL,
  start_time timestamptz DEFAULT now(),
  end_time timestamptz,
  duration_seconds integer,
  points_earned integer DEFAULT 0,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE
);

-- Create user_interactions table
CREATE TABLE IF NOT EXISTS user_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  interaction_type text NOT NULL,
  interaction_data jsonb DEFAULT '{}'::jsonb,
  timestamp timestamptz DEFAULT now(),
  FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous access (since users aren't authenticated)
CREATE POLICY "Allow anonymous insert on user_sessions"
  ON user_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update on user_sessions"
  ON user_sessions
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous select on user_sessions"
  ON user_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert on game_sessions"
  ON game_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous update on game_sessions"
  ON game_sessions
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous select on game_sessions"
  ON game_sessions
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous insert on user_interactions"
  ON user_interactions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on user_interactions"
  ON user_interactions
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_age_group ON user_sessions(age_group);
CREATE INDEX IF NOT EXISTS idx_user_sessions_language ON user_sessions(language);
CREATE INDEX IF NOT EXISTS idx_user_sessions_location_country ON user_sessions(location_country);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);

CREATE INDEX IF NOT EXISTS idx_game_sessions_session_id ON game_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed ON game_sessions(completed);
CREATE INDEX IF NOT EXISTS idx_game_sessions_start_time ON game_sessions(start_time);

CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_type ON user_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_user_interactions_timestamp ON user_interactions(timestamp);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_sessions
CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();