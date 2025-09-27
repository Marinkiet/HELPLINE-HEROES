/*
  # Reset points_earned data

  1. Database Changes
    - Reset all points_earned values to 0 in user_sessions table
    - This will clear the accumulated points data for analytics

  2. Purpose
    - Clean slate for points tracking
    - Reset analytics data for Total Points display
*/

-- Reset all points_earned to 0 in user_sessions table
UPDATE user_sessions 
SET points_earned = 0, 
    updated_at = now()
WHERE points_earned > 0;

-- Optional: Also reset games_completed if you want to reset game completion tracking
-- UPDATE user_sessions 
-- SET games_completed = '[]'::jsonb, 
--     updated_at = now()
-- WHERE jsonb_array_length(games_completed) > 0;