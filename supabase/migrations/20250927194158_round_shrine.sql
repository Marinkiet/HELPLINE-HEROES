/*
  # Update location tracking for South African provinces

  1. Database Changes
    - Update location_region column to store South African provinces
    - Add index for better query performance
    - Add constraint to ensure valid province names

  2. Location Data
    - Maps to 9 South African provinces
    - Handles location detection and storage
*/

-- Add check constraint for valid South African provinces
ALTER TABLE user_sessions 
DROP CONSTRAINT IF EXISTS user_sessions_location_region_check;

ALTER TABLE user_sessions 
ADD CONSTRAINT user_sessions_location_region_check 
CHECK (location_region IS NULL OR location_region IN (
  'Eastern Cape',
  'Free State', 
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape'
));

-- Update existing data to use proper province names if needed
UPDATE user_sessions 
SET location_region = CASE 
  WHEN location_region ILIKE '%eastern cape%' THEN 'Eastern Cape'
  WHEN location_region ILIKE '%free state%' THEN 'Free State'
  WHEN location_region ILIKE '%gauteng%' THEN 'Gauteng'
  WHEN location_region ILIKE '%kwazulu%' OR location_region ILIKE '%natal%' THEN 'KwaZulu-Natal'
  WHEN location_region ILIKE '%limpopo%' THEN 'Limpopo'
  WHEN location_region ILIKE '%mpumalanga%' THEN 'Mpumalanga'
  WHEN location_region ILIKE '%northern cape%' THEN 'Northern Cape'
  WHEN location_region ILIKE '%north west%' OR location_region ILIKE '%northwest%' THEN 'North West'
  WHEN location_region ILIKE '%western cape%' THEN 'Western Cape'
  ELSE location_region
END
WHERE location_region IS NOT NULL;

-- Add index for province-based queries
CREATE INDEX IF NOT EXISTS idx_user_sessions_province 
ON user_sessions(location_region) 
WHERE location_region IS NOT NULL;