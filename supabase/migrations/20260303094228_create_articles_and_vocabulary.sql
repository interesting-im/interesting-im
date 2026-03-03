-- Create vocabulary table only if not exists
CREATE TABLE IF NOT EXISTS vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT,
  example_sentence TEXT,
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  difficulty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reading_progress table (for tracking user progress)
CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id TEXT,
  progress_percent INTEGER DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(article_id, user_id)
);

-- Create daily_reading table (for tracking daily reading)
CREATE TABLE IF NOT EXISTS daily_reading (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  date DATE DEFAULT CURRENT_DATE,
  articles_read INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reading ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read vocabulary" ON vocabulary FOR SELECT USING (true);
CREATE POLICY "Anyone can read progress" ON reading_progress FOR SELECT USING (true);
CREATE POLICY "Anyone can read daily reading" ON daily_reading FOR SELECT USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vocabulary_article ON vocabulary(article_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_reading_user_date ON daily_reading(user_id, date);
