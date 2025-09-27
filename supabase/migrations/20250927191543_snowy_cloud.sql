/*
  # Add retry tracking for question responses

  1. New Columns
    - `retry_count` (integer) - Number of times user retried this question
    - `first_attempt_correct` (boolean) - Whether user got it right on first try
    - `needs_review` (boolean) - Flag for questions that need admin review

  2. Indexes
    - Add indexes for performance on new columns

  3. Notes
    - This helps track which questions users struggle with
    - Enables AI-powered question improvement suggestions
    - Points only awarded on first correct attempt
*/

-- Add new columns to question_responses table
ALTER TABLE question_responses 
ADD COLUMN IF NOT EXISTS retry_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS first_attempt_correct boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS needs_review boolean DEFAULT false;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_question_responses_retry_count 
ON question_responses (retry_count);

CREATE INDEX IF NOT EXISTS idx_question_responses_first_attempt_correct 
ON question_responses (first_attempt_correct);

CREATE INDEX IF NOT EXISTS idx_question_responses_needs_review 
ON question_responses (needs_review);

-- Create a view for questions that need review (high retry rates)
CREATE OR REPLACE VIEW questions_needing_review AS
SELECT 
  game_id,
  question_id,
  question_text,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE is_correct = false) as incorrect_attempts,
  COUNT(*) FILTER (WHERE retry_count > 0) as retry_attempts,
  ROUND(
    (COUNT(*) FILTER (WHERE is_correct = false)::decimal / COUNT(*)) * 100, 
    2
  ) as error_rate_percentage,
  ROUND(
    AVG(retry_count), 
    2
  ) as avg_retry_count
FROM question_responses 
GROUP BY game_id, question_id, question_text
HAVING COUNT(*) >= 5 -- Only consider questions with at least 5 attempts
  AND (
    COUNT(*) FILTER (WHERE is_correct = false)::decimal / COUNT(*) > 0.4 -- More than 40% error rate
    OR AVG(retry_count) > 1.5 -- Average more than 1.5 retries
  )
ORDER BY error_rate_percentage DESC, avg_retry_count DESC;