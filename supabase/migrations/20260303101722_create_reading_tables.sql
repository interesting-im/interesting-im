-- reading_articles table (new)
CREATE TABLE IF NOT EXISTS reading_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  author TEXT DEFAULT 'Unknown',
  image_url TEXT,
  audio_url TEXT,
  category TEXT DEFAULT 'General',
  difficulty INTEGER DEFAULT 1,
  reading_time_minutes INTEGER DEFAULT 5,
  word_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- reading_vocabulary table (new)
CREATE TABLE IF NOT EXISTS reading_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES reading_articles(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT,
  example_sentence TEXT,
  difficulty INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(article_id, word)
);

-- reading_daily_stats table (new)
CREATE TABLE IF NOT EXISTS reading_daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT,
  date DATE DEFAULT CURRENT_DATE,
  articles_read INTEGER DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS on new tables
ALTER TABLE reading_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_daily_stats ENABLE ROW LEVEL SECURITY;

-- Public read policies for new tables
CREATE POLICY "Anyone can read reading_articles" ON reading_articles FOR SELECT USING (is_published = true);
CREATE POLICY "Anyone can read reading_vocabulary" ON reading_vocabulary FOR SELECT USING (true);
CREATE POLICY "Anyone can read reading_daily_stats" ON reading_daily_stats FOR SELECT USING (true);

-- Authenticated users can manage their own data
CREATE POLICY "Users can insert reading_daily_stats" ON reading_daily_stats FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id IS NULL);
CREATE POLICY "Users can update reading_daily_stats" ON reading_daily_stats FOR UPDATE USING (auth.uid()::text = user_id OR user_id IS NULL);

-- Create indexes
CREATE INDEX idx_reading_articles_published ON reading_articles(is_published) WHERE is_published = true;
CREATE INDEX idx_reading_articles_category ON reading_articles(category);
CREATE INDEX idx_reading_vocabulary_article ON reading_vocabulary(article_id);
CREATE INDEX idx_reading_daily_stats_user_date ON reading_daily_stats(user_id, date);
