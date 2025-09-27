/*
  # Add Question Analytics Tables

  1. New Tables
    - `question_responses`
      - `id` (uuid, primary key)
      - `session_id` (text, foreign key)
      - `game_id` (text)
      - `question_id` (text)
      - `question_text` (text)
      - `user_answer` (text)
      - `correct_answer` (text)
      - `is_correct` (boolean)
      - `response_time_seconds` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `question_responses` table
    - Add policy for anonymous users to insert and read data

  3. Indexes
    - Add indexes for efficient querying by game_id, question_id, and correctness
*/

CREATE TABLE IF NOT EXISTS question_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  game_id text NOT NULL,
  question_id text NOT NULL,
  question_text text NOT NULL,
  user_answer text NOT NULL,
  correct_answer text NOT NULL,
  is_correct boolean NOT NULL DEFAULT false,
  response_time_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE question_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous insert on question_responses"
  ON question_responses
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select on question_responses"
  ON question_responses
  FOR SELECT
  TO anon
  USING (true);

-- Add foreign key constraint
ALTER TABLE question_responses 
ADD CONSTRAINT question_responses_session_id_fkey 
FOREIGN KEY (session_id) REFERENCES user_sessions(session_id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_responses_session_id ON question_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_game_id ON question_responses(game_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_question_id ON question_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_is_correct ON question_responses(is_correct);
CREATE INDEX IF NOT EXISTS idx_question_responses_created_at ON question_responses(created_at);