-- Add user reading stats with coins and levels
ALTER TABLE reading_progress ADD COLUMN IF NOT EXISTS coins_earned INTEGER DEFAULT 0;
ALTER TABLE reading_progress ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE reading_progress ADD COLUMN IF NOT EXISTS experience INTEGER DEFAULT 0;

-- Create user_stats table for overall progress
CREATE TABLE IF NOT EXISTS reading_user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT UNIQUE,
  total_coins INTEGER DEFAULT 0,
  total_experience INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  articles_completed INTEGER DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_read_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reading_user_stats ENABLE ROW LEVEL SECURITY;

-- Public read, authenticated write
CREATE POLICY "Anyone can read user stats" ON reading_user_stats FOR SELECT USING (true);
CREATE POLICY "Users can upsert own stats" ON reading_user_stats FOR ALL USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Add index
CREATE INDEX idx_reading_user_stats_user ON reading_user_stats(user_id);
